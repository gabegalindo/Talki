# services.py
# -*- coding: utf-8 -*-
import os
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel
from vertexai.generative_models import GenerativeModel
from pydub import AudioSegment
from google.cloud import speech, texttospeech
import uuid

# --- Vertex AI 모델 전역 변수 ---
# app.py에서 초기화된 후 사용될 모델들을 담을 변수입니다.
image_generation_model = None
generative_model = None

# --- 0. Vertex AI 모델 초기화 함수 ---
def initialize_vertex_ai(project_id, location):
    """
    Vertex AI를 초기화하고 사용할 모델(이미지 생성, Gemini)들을
    전역 변수에 로드합니다. app.py에서 서버 시작 시 한번만 호출됩니다.
    """
    global image_generation_model, generative_model
    try:
        vertexai.init(project=project_id, location=location)
        image_generation_model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        # 사용 가능한 Gemini 모델 버전으로 업데이트
        generative_model = GenerativeModel("gemini-1.5-flash")  # 안정적인 최신 버전 사용
        print(f"✅ Vertex AI가 프로젝트 '{project_id}', 리전 '{location}'으로 성공적으로 초기화되었습니다.")
        return True
    except Exception as e:
        print(f"🚨 Vertex AI 초기화 중 심각한 오류 발생: {e}")
        return False

# --- 1. 이미지 생성 서비스 ---
def generate_image_service(prompt, output_path):
    """주어진 프롬프트로 이미지를 생성하고 지정된 경로에 저장합니다."""
    if not image_generation_model:
        print("🚨 이미지 생성 모델이 초기화되지 않았습니다.")
        return False
    try:
        images = image_generation_model.generate_images(
            prompt=prompt,
            number_of_images=1
        )
        images[0].save(location=output_path, include_generation_parameters=True)
        return True
    except Exception as e:
        print(f"🚨 이미지 생성 중 오류 발생: {e}")
        return False

def convert_webm_to_wav(webm_path, wav_path):
    """WebM 파일을 GCP STT가 인식 가능한 WAV 파일로 변환합니다."""
    try:
        audio = AudioSegment.from_file(webm_path, format="webm")
        # GCP STT 권장 사양: 단일 채널, 16000Hz, 16비트
        audio = audio.set_channels(1)
        audio = audio.set_frame_rate(16000)
        audio = audio.set_sample_width(2) # [추가] 샘플링 비트를 16비트로 설정 (2바이트)
        
        audio.export(wav_path, format="wav")
        print(f"✅ 오디오 변환 성공: {webm_path} -> {wav_path}")
        return True
    except Exception as e:
        print(f"🚨 오디오 변환 실패: {e}")
        return False

# --- 3. 음성 텍스트 변환(STT) 서비스 ---
def transcribe_audio(audio_path):
    """WAV 오디오 파일의 내용을 한국어 텍스트로 변환합니다.
    
    Args:
        audio_path (str): 변환할 오디오 파일 경로
        
    Returns:
        str: 인식된 텍스트 또는 오류 시 None
    """
    try:
        # 오디오 파일을 16비트 PCM 형식으로 변환
        audio = AudioSegment.from_file(audio_path)
        audio = audio.set_sample_width(2)  # 16비트로 설정 (2바이트 = 16비트)
        audio = audio.set_channels(1)  # 모노 채널로 설정
        audio = audio.set_frame_rate(16000)  # 16kHz 샘플 레이트로 설정
        
        # static/generated_audio 디렉토리 생성 (없는 경우)
        output_dir = os.path.join('static', 'generated_audio')
        os.makedirs(output_dir, exist_ok=True)
        
        # 고유한 파일명 생성
        temp_filename = f'temp_{uuid.uuid4()}.wav'
        temp_path = os.path.join(output_dir, temp_filename)
        
        # 변환된 오디오 파일 저장
        audio.export(temp_path, format='wav')
        print(f"✅ 임시 오디오 파일 저장: {temp_path}")
            
        # 변환된 오디오 파일 읽기
        with open(temp_path, 'rb') as audio_file:
            content = audio_file.read()
            
        # 임시 파일 삭제
        try:
            os.unlink(temp_path)
            print(f"✅ 임시 파일 삭제: {temp_path}")
        except Exception as e:
            print(f"⚠️ 임시 파일 삭제 실패 ({temp_path}): {e}")
            
        # Google STT API 호출
        client = speech.SpeechClient()
        audio = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="en-US",
        )
        response = client.recognize(config=config, audio=audio)
        
        if not response.results:
            return ""
            
        return response.results[0].alternatives[0].transcript
    except Exception as e:
        print(f"🚨 음성 인식(STT) 실패: {e}")
        return None

# --- 4. 텍스트 감정 분석 서비스 ---
def analyze_emotion_with_gemini(text):
    """Gemini를 사용하여 텍스트의 감정을 '기쁨', '슬픔', '중립' 중 하나로 안정적으로 반환합니다."""
    if not generative_model:
        print("🚨 감정 분석 모델(Gemini)이 초기화되지 않았습니다.")
        return "중립"
    if not text:
        return "중립"
        
    try:
        prompt = f"""다음 텍스트에서 느껴지는 가장 핵심적인 감정을 '기쁨', '슬픔', '중립' 중 하나로만 분류해줘. 다른 설명은 절대 추가하지 마.

텍스트: "{text}"
"""
        response = generative_model.generate_content(prompt)
        response_text = response.text.strip()
        
        if '기쁨' in response_text:
            return '기쁨'
        elif '슬픔' in response_text:
            return '슬픔'
        else:
            return '중립'
    except Exception as e:
        print(f"🚨 감정 분석 중 예외 발생: {e}")
        return "중립"

# --- 5. Gemini 대화 응답 생성 서비스 ---
def generate_conversational_response(user_text: str) -> str:
    """사용자의 입력 텍스트에 대한 AI의 대화형 응답을 생성합니다."""
    if not generative_model:
        print("🚨 응답 생성 모델(Gemini)이 초기화되지 않았습니다.")
        return "Sorry, I can't answer that."
    if not user_text:
        return "Sorry, I can't answer that."
        
    try:
        prompt = f"""
        You are a friendly AI assistant. 
        Please respond to the user's message in a warm and concise manner (1-2 sentences). 
        Always respond in English.
        
        [prompt]
        Use short, simple sentences with one clear idea each. 
        Avoid difficult or abstract words. 
        Give lots of positive feedback and praise. 
        Reduce negative words. 
        Use a wait-friendly tone like “Take your time”. 
        Provide emotional support like “I understand” or “That sounds fun”. 
        Repeat important points when needed.
        Give meaningful suggestions based on the emotion of user input.
        
        User: "{user_text}"
        AI:"""
        
        response = generative_model.generate_content(prompt)
        return response.text.strip() if response.text else "Hmm... I'm not sure how to respond to that."
        
    except Exception as e:
        print(f"🚨 Gemini 응답 생성 실패: {e}")
        return "Sorry, I can't answer that."

# --- 6. 텍스트 음성 변환(TTS) 서비스 ---
def text_to_speech_service(text_to_speak, output_filename, emotion="NEUTRAL"):
    """주어진 텍스트를 감정이 담긴 한국어 음성 파일(MP3)로 변환합니다."""
    ssml_template = {
        "기쁨": f'<speak><prosody rate="fast" pitch="+2st">{text_to_speak}</prosody></speak>',
        "슬픔": f'<speak><prosody rate="slow" pitch="-2st">{text_to_speak}</prosody></speak>',
        "중립": f'<speak>{text_to_speak}</speak>'
    }
    ssml_text = ssml_template.get(emotion.upper(), ssml_template["중립"])
    
    try:
        client = texttospeech.TextToSpeechClient()
        synthesis_input = texttospeech.SynthesisInput(ssml=ssml_text)
        
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US", 
            name="en-US-Wavenet-A"
        )
        
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        with open(output_filename, "wb") as out:
            out.write(response.audio_content)
        
        return True
    
    except Exception as e:
        print(f"🚨 TTS 변환 중 오류 발생: {e}")
        return False
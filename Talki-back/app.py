# app.py
# -*- coding: utf-8 -*-
import os
import uuid
import tempfile
from flask import Flask, request, jsonify, send_file
from flasgger import Swagger, swag_from
from flask_cors import CORS

# --- 서비스 모듈 임포트 ---
import services

# --- Flask 애플리케이션 및 기본 설정 ---
app = Flask(__name__)
CORS(app) # 모든 도메인에서의 요청을 허용 (개발용)

# --- Swagger UI 설정 ---
SWAGGER_TEMPLATE = {
    "swagger": "2.0",
    "info": {
        "title": "AI Character API",
        "description": "Vertex AI와 GCP 서비스를 활용한 이미지 생성, 대화형 AI API 문서입니다.",
        "version": "1.0.0"
    },
    "basePath": "/",
    "schemes": ["http", "https"]
}
swagger = Swagger(app, template=SWAGGER_TEMPLATE)


# --- 폴더 생성 ---
os.makedirs('static/generated_audio', exist_ok=True)
os.makedirs('static/generated_image', exist_ok=True)

# === API 엔드포인트 ===

@app.route("/")
def index():
    """루트 경로. API 서버가 동작 중임을 알리고 API 문서 링크를 제공합니다."""
    return """
    <h1>AI API 서버가 동작 중입니다.</h1>
    <p>API 문서는 <a href="/apidocs/">/apidocs/</a> 에서 확인하세요.</p>
    """

# --- 1. 이미지 생성 API (/api/generate-image) ---
@app.route('/api/generate-image', methods=['POST'])
@swag_from({
    'tags': ['Image Generation'],
    'summary': '캐릭터 속성을 받아 이미지를 생성하고 PNG 파일로 반환합니다.',
    'requestBody': {
        'required': True,
        'content': {
            'application/json': {
                'schema': {
                    'type': 'object',
                    'properties': {
                        'color': {'type': 'string', 'example': 'blue'},
                        'animal': {'type': 'string', 'example': 'fox'},
                        'background': {'type': 'string', 'example': 'snowy field'},
                        'emotion': {'type': 'string', 'example': 'happy'}
                    },
                    'required': ['color', 'animal', 'background', 'emotion']
                }
            }
        }
    },
    'responses': {   
        '200': {'description': '이미지 생성 성공. PNG 이미지 파일이 반환됩니다.','content': {'image/png': {'schema': {'type': 'string', 'format': 'binary'}}}},
        '400': {'description': '잘못된 요청 (필수 파라미터 누락 등)'},
        '500': {'description': '서버 내부 오류 (이미지 생성 실패)'}
    }
})
def api_generate_image():
    if not request.json:
        return jsonify({"error": "요청 본문이 JSON 형식이 아닙니다."}), 400

    required_params = ['color', 'animal', 'background', 'emotion']
    if not all(param in request.json for param in required_params):
        return jsonify({"error": f"필수 파라미터가 누락되었습니다: {', '.join(required_params)}"}), 400

    prompt = f"Chibi {request.json['color']} {request.json['animal']} character, 2D flat illustration, big sparkling eyes, {request.json['emotion']} expression, rounded and soft body, icon style, on a {request.json['background']}"

    try:
        output_path = os.path.join('static', 'generated_image', f"{uuid.uuid4()}.png")
        if not services.generate_image_service(prompt, output_path):
            raise Exception("이미지 생성 서비스에서 오류 발생")
        
        return send_file(output_path, mimetype='image/png')

    except Exception as e:
        print(f"🚨 이미지 생성 중 오류 발생: {e}")
        return jsonify({"error": "이미지 생성에 실패했습니다.", "details": str(e)}), 500

# --- 2. 대화형 API (/api/conversation) ---
@app.route('/api/conversation', methods=['POST'])
@swag_from({
    'tags': ['Conversation'],
    'summary': '사용자 음성을 받아 AI의 답변 텍스트와 음성을 생성합니다.',
    'requestBody': {
        'required': True,
        'content': {
            'multipart/form-data': {
                'schema': {'type': 'object', 'properties': {'audio_file': {'type': 'string', 'format': 'binary', 'description': '사용자의 음성 파일 (webm)'}}, 'required': ['audio_file']}
            }
        }
    },
    'responses': {
        '200': {
            'description': '대화 처리 성공',
            'content': {
                'application/json': {
                    'schema': {
                        'type': 'object',
                        'properties': {
                            'user_text': {'type': 'string', 'example': '오늘 날씨 정말 좋네요!'},
                            'response_text': {'type': 'string', 'example': '네, 정말 화창하네요! 같이 산책이라도 갈까요?'},
                            'response_audio_url': {'type': 'string', 'example': 'http://localhost:8000/static/generated_audio/some_uuid.mp3'}
                        }
                    }
                }
            }
        },
        '400': {'description': '잘못된 요청 (파일 누락 등)'},
        '500': {'description': '서버 내부 처리 오류'}
    }
})
def api_conversation():
    if 'audio_file' not in request.files:
        return jsonify({"error": "요청에 'audio_file'이 포함되어야 합니다."}), 400

    file = request.files['audio_file']
    if file.filename == '':
        return jsonify({"error": "파일이 선택되지 않았습니다."}), 400

    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            webm_path = os.path.join(temp_dir, 'upload.webm')
            file.save(webm_path)

            wav_path = os.path.join(temp_dir, 'converted.wav')
            if not services.convert_webm_to_wav(webm_path, wav_path):
                raise Exception("오디오 파일 변환 실패")

            user_text = services.transcribe_audio(wav_path)
            if user_text is None:
                raise Exception("음성 인식(STT) 실패")
            if not user_text.strip():
                user_text = "(❌ Could not recognize speech ❌)"

            response_text = services.generate_conversational_response(user_text)
            
            user_emotion = services.analyze_emotion_with_gemini(user_text)
            
            output_filename = f"{uuid.uuid4()}.mp3"
            output_path = os.path.join('static', 'generated_audio', output_filename)
            
            if not services.text_to_speech_service(response_text, output_path, emotion=user_emotion):
                raise Exception("❌ 음성 파일(TTS) 생성 실패 ❌")
            
            audio_url = request.host_url + output_path
            
            return jsonify({
                "user_text": user_text,
                "response_text": response_text,
                "response_audio_url": audio_url
            })

        except Exception as e:
            print(f"🚨 대화형 API 처리 중 오류 발생: {e}")
            return jsonify({"error": "요청 처리 중 서버에서 오류가 발생했습니다.", "details": str(e)}), 500

# --- 서버 실행 ---
if __name__ == '__main__':
    print("--- AI API 서버 시작 ---")
    
    # 환경변수에서 GCP 설정 로드
    project_id = os.getenv("GCP_PROJECT_ID")
    # Gemini 모델을 위해 지원되는 리전으로 기본값 설정
    location = os.getenv("GCP_LOCATION", "asia-northeast1") 

    if not project_id:
        print("🚨 치명적 오류: GCP_PROJECT_ID 환경변수가 설정되지 않았습니다. 서버를 종료합니다.")
        exit(1)

    print(f"프로젝트 ID: {project_id}, 리전: {location}")
    
    # 서버 시작 전 Vertex AI 및 모델 초기화
    if services.initialize_vertex_ai(project_id, location):
        print("서버를 시작합니다. (Port: 8000)")
        app.run(host='0.0.0.0', port=8000, debug=False) # 배포 시에는 debug=False 권장
    else:
        print("🚨 Vertex AI 초기화 실패. 네트워크 연결 및 인증 정보를 확인하세요. 서버를 종료합니다.")
        exit(1)
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel

# --- 설정 (사용자 환경에 맞게 수정) ---
# Google Cloud 프로젝트 ID를 입력하세요.
PROJECT_ID = "1024096060232"
# 이미지를 생성할 리전(Region)을 입력하세요.
LOCATION = "asia-northeast3"

# Vertex AI 초기화
vertexai.init(project=PROJECT_ID, location=LOCATION)

# 사용할 이미지 생성 모델 로드 (Imagen 3)
model = ImageGenerationModel.from_pretrained("imagegeneration@006")

# --- 이미지 생성 ---
# 생성할 이미지에 대한 텍스트 설명 (프롬프트)
prompt = "Make a cute green dinosaur character"

print(f'"{prompt}" 프롬프트로 이미지 생성을 시작합니다...')

# 이미지 생성 요청
images = model.generate_images(
    prompt=prompt,
    # 생성할 이미지 개수 (최대 8개)
    number_of_images=1,
)

# --- 결과 저장 ---
# 생성된 첫 번째 이미지를 파일로 저장
import os

base_filename = "generated_image"
extension = ".png"
counter = 1
filename = f"{base_filename}{extension}"

# 파일명이 이미 존재하면 번호를 붙여서 새로운 파일명 생성
while os.path.exists(filename):
    filename = f"{base_filename}_{counter}{extension}"
    counter += 1

images[0].save(location=filename, include_generation_parameters=True)
print(f"이미지 생성이 완료되었습니다. '{filename}' 파일로 저장되었습니다.")

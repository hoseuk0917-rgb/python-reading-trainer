# V356 semantic review — Level 8 chunk 2

Cards 21-40 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY14_L08_train_val_test_001
- level: 8
- file: python_ai_learning_methods_v14.json
- title: train/validation/test 분리
- question_type: meaning_choice
- concepts: ["train_set","validation_set","test_set","evaluation"]
- reading_goal: 학습용/튜닝용/최종평가용 데이터를 나누는 이유를 이해한다.
- code:
```python
train: 모델을 학습하는 데이터
validation: 설정/하이퍼파라미터를 고르는 데이터
test: 마지막에 성능을 확인하는 데이터
```
- question: validation set의 역할은?
- answer: 설정 선택과 중간 성능 확인
- explanation: test set을 반복해서 보면 평가가 오염될 수 있으므로 validation을 따로 둔다. train, validation, test 분리는 데이터를 학습용, 조정용, 최종 평가용으로 나누는 방식이다. 같은 데이터로 학습과 평가를 반복하면 성능을 과대평가할 수 있다. 따라서 정답은 ‘설정 선택과 중간 성능 확인’이다.
- project_context: 대회/모델평가/LoRA 실험 관리에 필요하다.

## PY12_L08_cv2_imread_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: OpenCV cv2.imread 읽기
- question_type: meaning_choice
- concepts: ["if","import","print","opencv","cv2","image"]
- reading_goal: OpenCV로 이미지를 읽는 코드를 이해한다.
- code:
```python
import cv2

img = cv2.imread("page.png")
if img is None:
    raise FileNotFoundError("page.png could not be decoded")
print(img.shape)
```
- question: cv2.imread는 무엇을 하는가?
- answer: 이미지를 배열 형태로 읽는다
- explanation: cv2.imread는 기본적으로 이미지를 BGR 채널 순서의 NumPy 배열로 디코딩한다. 파일이 없거나 지원 형식으로 읽지 못하면 예외 대신 None을 반환할 수 있으므로 shape 접근 전에 검사한다. 정상이라면 color 이미지의 shape는 보통 (높이, 너비, 채널 수)다. 질문의 정답은 imread의 역할이며 실제 print 값은 page.png의 크기에 따라 달라진다.
- project_context: OCR 전처리, 영상/이미지 분석 코드에서 자주 보인다.

## PY12_L08_cv2_threshold_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: OpenCV threshold 읽기
- question_type: meaning_choice
- concepts: ["opencv","threshold","ocr"]
- reading_goal: 이미지를 흑백에 가깝게 나눠 OCR 전처리에 쓰는 코드를 읽는다.
- code:
```python
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, binary = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY)
```
- question: threshold 처리의 목적에 가까운 것은?
- answer: 픽셀을 기준값으로 나눠 이진화한다
- explanation: 먼저 cvtColor가 BGR 이미지를 1채널 grayscale로 바꾼다. THRESH_BINARY에서 픽셀 값이 임계값 180보다 크면 255, 그렇지 않으면 0이 되어 binary 배열에 저장된다. 반환값의 첫 항목은 사용된 임계값이라 이 코드는 _로 무시한다. 이진화가 OCR을 항상 개선하는 것은 아니며 조명·배경에 따라 임계값이나 adaptive/Otsu 방식을 비교해야 한다.
- project_context: 문서 이미지 OCR 품질 개선에서 자주 만난다.

## PY12_L08_docker_run_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: docker run 기본 읽기
- question_type: meaning_choice
- concepts: ["docker","container","server"]
- reading_goal: 컨테이너로 앱을 실행하는 명령의 의미를 읽는다.
- code:
```python
docker run -p 8000:8000 my-api
```
- question: -p 8000:8000의 의미는?
- answer: 호스트와 컨테이너의 8000 포트를 연결한다
- explanation: -p의 형식은 [호스트 주소:]호스트 포트:컨테이너 포트다. 따라서 호스트의 8000으로 들어온 TCP 연결을 my-api 컨테이너의 8000으로 전달한다. 호스트 주소를 생략하면 Docker 설정에 따라 모든 호스트 인터페이스에 공개될 수 있다. 컨테이너 안 앱이 실제로 8000에서 적절한 인터페이스로 수신해야 하며, 포트 매핑 자체가 앱을 실행하거나 방화벽·인증을 설정하지는 않는다.
- project_context: API 서버 배포와 개발환경 고정에 필요하다.

## PY12_L08_fastapi_cors_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: FastAPI CORS middleware 읽기
- question_type: meaning_choice
- concepts: ["fastapi","cors","middleware","web"]
- reading_goal: 다른 출처의 웹앱 요청을 허용하는 CORS 설정을 읽는다.
- code:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
)
```
- question: CORS 설정의 목적은?
- answer: 브라우저의 다른 출처 요청 허용과 관련된다
- explanation: CORS는 브라우저가 현재 페이지와 다른 scheme·host·port의 서버 응답을 JavaScript에 공개할지 정하는 정책이다. 이 설정은 모든 origin과 method를 허용해 브라우저 교차 출처 호출 범위를 넓힌다. 서버 인증·권한 검사나 방화벽이 아니므로 curl·서버 간 요청을 차단하지 않는다. credentials를 허용할 때는 wildcard 대신 명시적 origin·method·header를 사용해야 하며 실제 프론트 주소만 최소 허용한다.
- project_context: 정적 앱 + 로컬 API 연결에서 중요하다.

## PY12_L08_fastapi_static_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: FastAPI StaticFiles 읽기
- question_type: meaning_choice
- concepts: ["import","fastapi","static_files","web"]
- reading_goal: 정적 파일 폴더를 웹에서 제공하는 코드를 읽는다.
- code:
```python
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")
```
- question: app.mount('/static', ...)의 목적은?
- answer: static 폴더 파일을 /static 경로로 제공한다
- explanation: FastAPI static 설정은 HTML, CSS, JS, 이미지 같은 정적 파일을 서버에서 제공하게 한다. 간단한 웹 앱 배포에 자주 쓰인다. URL 경로와 실제 폴더를 연결하는 설정이므로 배포 후 파일 경로가 맞는지 확인해야 한다.
- project_context: 데모 앱/로컬 서버 구성에서 자주 보인다.

## PY12_L08_github_actions_yaml_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: GitHub Actions workflow 읽기
- question_type: meaning_choice
- concepts: ["github_actions","yaml","ci"]
- reading_goal: push 때 자동 작업이 실행되는 workflow 구조를 읽는다.
- code:
```python
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
```
- question: GitHub Actions YAML에서 on: [push]의 의미는?
- answer: push 이벤트 때 workflow를 실행한다
- explanation: GitHub Actions YAML은 테스트, 빌드, 배포 자동화 절차를 적는 설정 파일이다. push나 pull request 같은 이벤트에 맞춰 실행된다. 자동화 조건을 명확히 적어 두면 언제 검증이 실행되는지 팀원이 쉽게 알 수 있다.
- project_context: GitHub Pages/자동 검사/배포 루틴과 연결된다.

## PY12_L08_gradio_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: gradio Interface 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","import","gradio","ui","demo"]
- reading_goal: 함수를 웹 데모 UI로 감싸는 gradio 구조를 읽는다.
- code:
```python
import gradio as gr

def greet(name):
    return "hello " + name

gr.Interface(fn=greet, inputs="text", outputs="text").launch()
```
- question: gr.Interface의 목적은?
- answer: 함수를 간단한 웹 UI로 실행한다
- explanation: gr.Interface는 text 입력을 greet 함수의 인자로 넘기고 반환 문자열을 text 출력에 표시하는 UI 구성을 만든다. 이어진 launch()가 로컬 서버를 시작해 브라우저에서 사용할 수 있게 한다. Interface 생성만으로 함수가 즉시 호출되는 것은 아니며 사용자가 입력을 제출할 때 실행된다. 외부 공유·인증·입력 검증은 별도 설정이므로 임시 데모를 그대로 공개 서비스로 보지 않는다.
- project_context: AI 기능 MVP 데모 제작에 연결된다.

## PY12_L08_model_eval_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: model.eval 읽기
- question_type: meaning_choice
- concepts: ["torch","model","eval","inference"]
- reading_goal: 모델을 평가/추론 모드로 바꾸는 코드를 읽는다.
- code:
```python
model.eval()
```
- question: model.eval()의 목적은?
- answer: 모델을 평가/추론 모드로 전환한다
- explanation: model.eval()은 Module의 training 플래그를 False로 바꿔 dropout과 batch normalization처럼 train/eval 모드에 따라 달라지는 층을 평가 방식으로 동작시킨다. 파라미터를 고정하거나 gradient 기록을 끄는 명령은 아니므로, 일반 추론에서는 torch.no_grad() 또는 inference_mode()를 별도로 사용한다. 다시 학습할 때는 model.train()으로 되돌린다.
- project_context: 추론 스크립트에서 거의 항상 확인해야 하는 줄이다.

## PY12_L08_model_to_device_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: model.to(device) 읽기
- question_type: meaning_choice
- concepts: ["torch","model","device","cuda"]
- reading_goal: 모델을 CPU/GPU 장치로 옮기는 코드를 읽는다.
- code:
```python
model = model.to(device)
```
- question: model.to(device)의 의미는?
- answer: 모델을 지정한 CPU/GPU 장치로 옮긴다
- explanation: model.to(device)는 모델 파라미터를 CPU나 GPU 같은 실행 장치로 옮긴다. 모델과 입력 텐서가 같은 device에 있어야 연산된다. 모델은 GPU에 있고 입력은 CPU에 있으면 device mismatch 오류가 날 수 있다.
- project_context: CUDA 관련 오류를 읽을 때 중요한 코드다.

## PY12_L08_no_grad_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: torch.no_grad 읽기
- question_type: meaning_choice
- concepts: ["torch","no_grad","inference"]
- reading_goal: 추론 때 gradient 계산을 끄는 코드를 읽는다.
- code:
```python
with torch.no_grad():
    output = model(input_ids)
```
- question: torch.no_grad()의 목적은?
- answer: 추론 중 gradient 계산을 끈다
- explanation: with torch.no_grad() 안의 연산은 자동미분 그래프 기록을 끄므로 일반적인 추론에서 메모리와 계산을 줄인다. 하지만 model을 평가 모드로 바꾸지는 않으므로 dropout·batch normalization 동작은 model.eval()로 별도 전환해야 한다. 이 블록의 output으로 나중에 backward를 수행해야 하는 학습 코드에는 사용하면 안 된다.
- project_context: LLM/분류 모델 추론 코드에서 자주 보인다.

## PY12_L08_nvidia_smi_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: nvidia-smi 로그 읽기
- question_type: meaning_choice
- concepts: ["nvidia_smi","gpu","vram","cuda"]
- reading_goal: nvidia-smi로 GPU 사용량과 메모리 상태를 확인하는 명령을 읽는다.
- code:
```python
nvidia-smi
```
- question: nvidia-smi로 주로 확인하는 것은?
- answer: GPU 사용률, 메모리 사용량, 드라이버/CUDA 정보
- explanation: nvidia-smi는 NVIDIA 드라이버가 인식한 GPU, 사용률, 메모리 점유, 온도와 실행 중인 GPU 프로세스 등을 보여 준다. 화면의 CUDA Version은 보통 현재 드라이버가 지원하는 최대 CUDA 호환 버전이며, 로컬에 설치된 CUDA Toolkit 버전과 같다고 단정할 수 없다. 또한 순간 측정값이므로 학습이 실제로 계속 GPU에서 수행되는지는 반복 관찰과 프레임워크 확인을 함께 한다.
- project_context: EC2/워크스테이션에서 LLM/LoRA 작업 상태 점검에 필요하다.

## PY12_L08_pdfplumber_extract_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: pdfplumber extract_text 읽기
- question_type: meaning_choice
- concepts: ["import","pdfplumber","pdf","text_extract"]
- reading_goal: pdfplumber로 PDF 페이지 텍스트를 읽는 코드를 이해한다.
- code:
```python
import pdfplumber

with pdfplumber.open("report.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
- question: extract_text의 목적은?
- answer: PDF 페이지에서 텍스트를 추출한다
- explanation: pdfplumber는 PDF에서 텍스트와 표를 추출할 때 자주 쓰는 라이브러리다. 표 구조를 실험적으로 확인할 때 특히 유용하다. 추출 결과가 None일 수 있으므로 실제 파이프라인에서는 페이지별 성공 여부와 빈 텍스트를 함께 점검한다.
- project_context: 정책자료/공고/PDF 추출 코드에 연결된다.

## PY12_L08_pil_open_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: PIL Image.open 읽기
- question_type: meaning_choice
- concepts: ["import","print","pillow","image","ocr"]
- reading_goal: 이미지 파일을 여는 Pillow 코드를 읽는다.
- code:
```python
from PIL import Image

image = Image.open("page.png")
print(image.size)
```
- question: Image.open의 목적은?
- answer: 이미지 파일을 연다
- explanation: Image.open("page.png")은 파일 형식을 식별하고 Image 객체를 반환하지만 픽셀 데이터는 필요할 때까지 지연해서 읽는다. image.size는 (width, height) tuple을 돌려준다. 파일이 없으면 FileNotFoundError, 이미지로 식별할 수 없으면 UnidentifiedImageError가 날 수 있다. 많은 파일을 처리할 때는 with Image.open(...) as image처럼 파일 수명을 관리하고, 색상 모드는 convert로 명시한다.
- project_context: OCR/이미지 전처리 코드의 시작점이다.

## PY12_L08_poppler_pdfimages_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: poppler pdfimages 명령 읽기
- question_type: meaning_choice
- concepts: ["poppler","pdfimages","pdf","subprocess"]
- reading_goal: PDF 내부 이미지를 추출하는 외부 도구 명령을 읽는다.
- code:
```python
pdfimages -png report.pdf out/page
```
- question: 이 명령의 목적은?
- answer: PDF 안의 이미지를 PNG로 추출한다
- explanation: pdfimages는 PDF 페이지를 통째로 렌더링하는 명령이 아니라 문서 안에 저장된 raster image 객체를 추출한다. -png는 지원되는 추출 이미지를 PNG로 변환하고 out/page는 디렉터리가 아니라 출력 파일 이름의 접두사다. 부모 폴더가 먼저 있어야 한다. 스캔 PDF의 경우 OCR 입력을 얻는 데 유용하지만, 벡터 글자나 페이지 배치가 그대로 한 이미지로 보존된다고 단정할 수 없다.
- project_context: 공모전/PDF 이미지 DPI 확인 작업과 연결된다.

## PY12_L08_pymupdf_extract_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: PyMuPDF fitz.open 읽기
- question_type: meaning_choice
- concepts: ["if","import","pymupdf","fitz","pdf","text_extract"]
- reading_goal: PDF에서 페이지 텍스트를 추출하는 흐름을 읽는다.
- code:
```python
import fitz

with fitz.open("paper.pdf") as doc:
    if doc.page_count == 0:
        raise ValueError("PDF has no pages")
    text = doc[0].get_text()
```
- question: doc[0].get_text()의 목적은?
- answer: 첫 페이지 텍스트를 추출한다
- explanation: fitz.open은 PDF 문서를 열고 with 종료 시 닫는다. 페이지가 하나 이상이면 0 기반 인덱스 doc[0]이 첫 페이지를 가리키고 get_text()가 그 페이지의 추출 가능한 텍스트를 문자열로 반환한다. 스캔 이미지만 있는 페이지에서는 빈 문자열에 가까울 수 있으며 OCR을 자동 수행하지 않는다. 암호화·손상 파일과 빈 문서도 별도 처리해야 한다.
- project_context: 논문/PDF 자료 텍스트 추출 파이프라인에 중요하다.

## PY12_L08_pytesseract_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: pytesseract OCR 읽기
- question_type: meaning_choice
- concepts: ["import","pytesseract","ocr","image"]
- reading_goal: 이미지에서 글자를 추출하는 OCR 호출을 읽는다.
- code:
```python
import pytesseract
from PIL import Image

text = pytesseract.image_to_string(Image.open("page.png"), lang="kor+eng")
```
- question: 이 코드는 무엇을 시도하는가?
- answer: 이미지에서 한글/영어 텍스트를 OCR한다
- explanation: pytesseract.image_to_string은 외부 Tesseract 엔진에 이미지를 넘기고 kor+eng 언어 모델로 인식한 문자열을 받는다. Python 패키지만 설치해서는 부족하고 Tesseract 실행 파일과 해당 언어 데이터가 있어야 한다. 결과는 원문 보장이 아니라 OCR 추정치이므로 이미지 전처리, 빈 결과·오류 처리, 사람 또는 기준 데이터와의 검증이 필요하다.
- project_context: PDF/이미지 자료 텍스트화에서 자주 쓰인다.

## PY12_L08_streamlit_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: streamlit 앱 실행 흐름
- question_type: meaning_choice
- concepts: ["import","streamlit","app","ui"]
- reading_goal: 간단한 데이터/AI 데모 UI 코드를 읽는다.
- code:
```python
import streamlit as st

st.title("Python Reading Trainer")
st.write("hello")
```
- question: st.title의 목적은?
- answer: 앱 화면에 제목을 표시한다
- explanation: Streamlit이 이 스크립트를 실행하는 세션에서 st.title은 큰 제목 요소를 화면에 추가하고 st.write는 그 아래 내용을 렌더링한다. 일반적으로 streamlit run app.py처럼 실행해야 브라우저 앱이 열리며, st.title 자체가 웹서버를 새로 구성하거나 모델을 실행하는 것은 아니다. 사용자가 상호작용하면 Streamlit이 스크립트를 다시 실행할 수 있으므로 무거운 작업의 캐시 여부도 확인한다.
- project_context: 프로토타입/데모 UI 제작에 유용하다.

## PY12_L08_subprocess_tool_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: subprocess로 외부 도구 호출
- question_type: meaning_choice
- concepts: ["import","print","subprocess","cli","toolchain"]
- reading_goal: 파이썬에서 외부 CLI 도구를 호출하는 패턴을 읽는다.
- code:
```python
import subprocess

result = subprocess.run(["nvidia-smi"], capture_output=True, text=True)
print(result.returncode)
```
- question: 이 코드는 무엇을 하는가?
- answer: nvidia-smi 명령을 실행하고 종료코드를 출력한다
- explanation: subprocess.run은 인자 목록대로 nvidia-smi 프로세스를 시작하고 종료할 때까지 기다린 뒤 CompletedProcess를 반환한다. capture_output=True라서 표준출력과 표준오류는 화면에 바로 나오지 않고 result.stdout·stderr에 저장된다. print는 종료 코드만 보여 주며 보통 0은 정상 종료, 0이 아니면 실패를 뜻한다. 명령 자체를 찾지 못하면 returncode가 아니라 FileNotFoundError가 발생할 수 있다.
- project_context: poppler, git, nvidia-smi, ffmpeg 같은 도구 호출에 자주 쓰인다.

## PY12_L08_torch_cuda_available_001
- level: 8
- file: python_ai_toolchain_expansion_v12.json
- title: torch.cuda.is_available 읽기
- question_type: meaning_choice
- concepts: ["import","print","torch","cuda","gpu","device"]
- reading_goal: PyTorch가 GPU를 사용할 수 있는지 확인하는 코드를 읽는다.
- code:
```python
import torch

print(torch.cuda.is_available())
```
- question: True가 나오면 의미는?
- answer: PyTorch에서 CUDA GPU를 사용할 수 있다
- explanation: torch.cuda.is_available()이 True이면 현재 PyTorch 빌드와 NVIDIA 드라이버 환경에서 CUDA 장치를 초기화해 사용할 수 있다는 뜻이다. 모델이 이미 GPU에 올라갔거나 메모리가 충분하다는 뜻은 아니며, 실제 장치 수·이름·여유 VRAM과 모델·tensor의 device는 따로 확인해야 한다. False이면 CPU 전용 PyTorch, 드라이버 문제, 장치 비노출 같은 원인을 나누어 본다.
- project_context: 로컬/서버에서 GPU 추론 가능 여부를 보는 첫 검사다.

# V356 semantic review — Level 8 chunk 7

Cards 121-140 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY103_L08_git_tag_push_001
- level: 8
- file: python_dev_environment_foundation_v103_a1.json
- title: tag와 push 흐름 읽기
- question_type: meaning_choice
- concepts: ["git_tag","git_push","remote"]
- reading_goal: 검증 통과 지점을 tag로 고정하고 원격에 올린다.
- code:
```python
git tag quality-v103-dev-env-a1-20260602
git push origin quality-v103-dev-env-a1-20260602
```
- question: 두 번째 줄에서 태그 이름을 명시해 push하는 이유는?
- answer: 방금 만든 특정 태그만 원격에 올리기 위해
- explanation: tag는 특정 commit에 붙이는 이름이다. 로컬에서 tag를 만든 것만으로 원격에 생기지는 않으므로 별도 push가 필요하다. git push origin <태그 이름>은 지정한 태그 하나를 전송해, 로컬의 의도하지 않은 다른 태그까지 보내는 --tags보다 범위가 분명하다. 브랜치 commit도 올려야 한다면 현재 브랜치의 push 여부를 따로 확인한다.
- project_context: 검증 통과 단위마다 commit/tag/push하는 운영 규칙과 연결된다.

## PY103_L08_gpu_cuda_driver_001
- level: 8
- file: python_dev_environment_foundation_v103_a1.json
- title: GPU, driver, CUDA 구분하기
- question_type: meaning_choice
- concepts: ["print","gpu","driver","cuda","pytorch"]
- reading_goal: GPU 실행환경의 층을 나누어 이해한다.
- code:
```python
nvidia-smi
python -c "import torch; print(torch.cuda.is_available())"
```
- question: nvidia-smi가 된다고 바로 보장되지 않는 것은?
- answer: 현재 PyTorch가 CUDA GPU를 사용할 수 있는지
- explanation: GPU, NVIDIA driver, CUDA, PyTorch CUDA build는 서로 다른 층이다. nvidia-smi는 GPU와 드라이버 상태를 보여 주지만, 현재 venv에 설치된 PyTorch가 CUDA 지원 빌드인지는 별도 확인해야 한다. 그래서 nvidia-smi와 torch.cuda.is_available()을 함께 본다. 환경 문제는 하드웨어, 드라이버, Python 패키지, 코드 device 선택을 나누어 확인해야 한다.
- project_context: GPU 서버와 로컬 AI 실행환경 점검의 기본이다.

## PY103_L08_nvidia_smi_001
- level: 8
- file: python_dev_environment_foundation_v103_a1.json
- title: nvidia-smi 출력 읽기
- question_type: meaning_choice
- concepts: ["nvidia-smi","gpu","vram"]
- reading_goal: GPU 사용률과 VRAM 상태를 확인한다.
- code:
```python
nvidia-smi
```
- question: 이 명령으로 주로 확인하는 것은?
- answer: GPU 상태와 메모리 사용량
- explanation: nvidia-smi는 NVIDIA GPU 상태를 확인하는 기본 명령이다. GPU 사용률, VRAM 사용량, 실행 중인 프로세스를 볼 수 있다. 작업이 느릴 때 GPU가 실제로 사용 중인지, 다른 프로세스가 메모리를 차지하고 있는지 확인하는 데 도움이 된다. 단, 이것만으로 PyTorch CUDA 사용 가능 여부가 완전히 보장되지는 않으므로 torch.cuda 확인도 함께 해야 한다.
- project_context: LoRA, 임베딩, 모델 추론 작업의 장비 상태 확인과 연결된다.

## PY103_L08_python_m_pip_001
- level: 8
- file: python_dev_environment_foundation_v103_a1.json
- title: python -m pip 읽기
- question_type: meaning_choice
- concepts: ["python_m_pip","pip","venv"]
- reading_goal: 현재 Python에 연결된 pip를 쓰는 이유를 이해한다.
- code:
```python
python -m pip install requests
python -m pip --version
```
- question: python -m pip를 쓰는 장점은?
- answer: 현재 python과 연결된 pip를 더 확실히 사용한다
- explanation: python -m pip는 현재 실행하는 Python으로 pip 모듈을 실행한다는 뜻이다. 그냥 pip 명령은 PATH 상태에 따라 다른 환경의 pip가 잡힐 수 있다. 특히 venv나 여러 Python 버전이 섞인 환경에서는 python과 pip가 같은 환경을 가리키는지 확인해야 한다. python -m pip --version은 pip가 어느 경로와 연결됐는지 보여 주므로 설치 문제 디버깅에 유용하다.
- project_context: 패키지를 설치했는데 import가 실패하는 상황을 줄이는 카드다.

## PY103_L08_requirements_install_001
- level: 8
- file: python_dev_environment_foundation_v103_a1.json
- title: requirements.txt 설치 읽기
- question_type: meaning_choice
- concepts: ["requirements.txt","pip","dependency"]
- reading_goal: requirements.txt가 Python 패키지 목록을 제공하지만 전체 실행환경까지 모두 고정하는 것은 아님을 이해한다.
- code:
```python
python -m pip install -r requirements.txt
```
- question: 이 명령으로 패키지를 설치한 뒤에도 별도로 확인해야 할 항목으로 가장 적절한 것은?
- answer: Python 버전과 필요한 시스템 도구
- explanation: requirements.txt는 pip가 설치할 Python 패키지 목록을 제공한다. 하지만 Python 자체의 버전이나 apt로 설치하는 시스템 도구까지 기록하지는 않는다. 새 환경에서는 패키지 설치 후 Python 버전, 외부 도구, import와 프로젝트 검증도 함께 확인해야 한다.
- project_context: 새 장비에서 requirements.txt를 설치한 뒤 실제 실행환경이 충분히 재현됐는지 확인하는 카드다.

## PY103_L08_torch_cuda_available_001
- level: 8
- file: python_dev_environment_foundation_v103_a1.json
- title: torch.cuda.is_available 읽기
- question_type: meaning_choice
- concepts: ["import","print","torch.cuda","pytorch","cuda"]
- reading_goal: PyTorch가 CUDA GPU를 사용할 수 있는지 확인한다.
- code:
```python
import torch
print(torch.cuda.is_available())
print(torch.version.cuda)
```
- question: torch.cuda.is_available()이 확인하는 것은?
- answer: 현재 PyTorch가 CUDA GPU를 사용할 수 있는지
- explanation: torch.cuda.is_available()은 현재 프로세스의 PyTorch가 CUDA 장치를 사용할 수 있다고 판단하는지 bool로 반환한다. False의 원인은 GPU 부재, 드라이버 불일치, CPU 전용 PyTorch 빌드, 가려진 장치 등 여러 가지다. torch.version.cuda는 이 PyTorch 빌드가 대상으로 삼은 CUDA 버전 정보이며 실제 GPU 사용 성공이나 로컬 CUDA toolkit 설치를 단독으로 증명하지 않는다.
- project_context: GPU가 있는 서버에서 PyTorch가 실제 GPU를 보는지 확인한다.

## PY103_L08_venv_reason_001
- level: 8
- file: python_dev_environment_foundation_v103_a1.json
- title: 가상환경을 쓰는 이유
- question_type: meaning_choice
- concepts: ["venv","virtual_environment","dependency"]
- reading_goal: 프로젝트별 Python 환경 분리의 필요성을 이해한다.
- code:
```python
python -m venv .venv
```
- question: 이 명령을 쓰는 가장 중요한 이유는?
- answer: 프로젝트별 Python 패키지 환경을 분리하기 위해
- explanation: venv는 프로젝트마다 독립된 Python 실행환경을 만드는 도구다. 모든 패키지를 전역 Python에 섞어 설치하면 버전 충돌이 생기고, 어떤 프로젝트 때문에 환경이 바뀌었는지 추적하기 어렵다. .venv를 만들고 활성화한 뒤 필요한 패키지를 설치하면 프로젝트별 의존성을 분리할 수 있다. 이것은 재현 가능한 개발환경을 만드는 출발점이다. 특히 여러 프로젝트를 오가며 작업할 때는 같은 패키지 이름이라도 프로젝트마다 필요한 버전이 다를 수 있으므로, venv는 초급 단계부터 익혀야 하는 안전장치다.
- project_context: 로컬 앱, FastAPI, LoRA, PDF 처리 프로젝트를 분리하는 기본이다.

## PY59_L08_cached_fallback_001
- level: 8
- file: python_error_recovery_retry_ux_v59.json
- title: cached fallback 읽기
- question_type: meaning_choice
- concepts: ["if","cached_fallback","cache","offline"]
- reading_goal: 최신 데이터를 못 불러오면 캐시된 데이터를 임시로 보여주는 전략을 이해한다.
- code:
```python
if networkFailed:
  cards = loadFromCache()
```
- question: cached fallback의 장점은?
- answer: 네트워크 실패 시에도 이전 데이터를 보여줄 수 있다
- explanation: cached fallback은 최신 데이터를 못 가져와도 이전에 저장한 데이터를 보여 주는 방식이다. 사용자는 학습을 계속할 수 있지만 캐시가 오래되었거나 비어 있을 수도 있다. 캐시 자료라는 점과 마지막 갱신 시각을 알리고, 연결이 돌아오면 새 버전을 확인하는 흐름이 필요하다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY59_L08_network_error_001
- level: 8
- file: python_error_recovery_retry_ux_v59.json
- title: network error 읽기
- question_type: meaning_choice
- concepts: ["try_except","network_error","fetch","retry"]
- reading_goal: 네트워크 오류와 서버 응답 오류를 구분해야 함을 이해한다.
- code:
```python
try:
  fetchData()
except NetworkError:
  showOfflineRetry()
```
- question: network error에서 중요한 대응은?
- answer: 네트워크 상태를 확인하고 다시 시도할 수 있게 하는 것
- explanation: network error는 연결 끊김, DNS 실패, 서버 장애처럼 요청이 완료되지 못한 상황을 넓게 가리킨다. 연결 아이콘만으로 서버 도달 가능 여부를 확정할 수 없으므로 실제 요청 결과를 기준으로 처리한다. 캐시 대체 자료와 재시도 안내를 제공하되, 인증 오류나 잘못된 입력처럼 재시도로 해결되지 않는 실패는 별도로 안내해야 한다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY59_L08_partial_failure_001
- level: 8
- file: python_error_recovery_retry_ux_v59.json
- title: partial failure 읽기
- question_type: meaning_choice
- concepts: ["partial_failure","data_loading","resilience"]
- reading_goal: 일부 파일만 실패했을 때 전체 앱을 멈추지 않는 방식을 이해한다.
- code:
```python
loaded = results.filter(r => r.ok)
failed = results.filter(r => !r.ok)
```
- question: partial failure 대응의 핵심은?
- answer: 성공한 데이터는 보여주고 실패한 데이터는 따로 안내하는 것
- explanation: lesson 파일이 많으면 한 파일 실패 때문에 전체 앱을 막지 않는 전략이 필요하다. partial failure는 전체 작업 중 일부만 실패한 상태다. 성공한 항목을 유지하면서 실패한 항목만 재시도할 수 있는지 확인해야 한다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY59_L08_timeout_retry_001
- level: 8
- file: python_error_recovery_retry_ux_v59.json
- title: timeout retry 읽기
- question_type: meaning_choice
- concepts: ["if","timeout","retry","resilience"]
- reading_goal: 요청이 너무 오래 걸릴 때 실패 처리하고 재시도하는 흐름을 이해한다.
- code:
```python
if elapsedMs > 5000:
  showError('응답 시간이 너무 깁니다')
```
- question: timeout 처리가 필요한 이유는?
- answer: 무한히 기다리지 않고 실패와 재시도 흐름으로 넘기기 위해
- explanation: 이 코드는 정해진 시간을 넘긴 요청을 실패 상태로 전환하는 timeout 처리다. 실제 재시도를 하려면 요청 취소, 최대 횟수, 대기 간격을 별도로 구현해야 한다. 모든 작업을 자동 재시도하지 말고, 일시적 실패이며 반복해도 안전한 요청에만 backoff를 적용해야 서버 과부하와 중복 처리를 막을 수 있다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY20_L08_http_exception_001
- level: 8
- file: python_fastapi_api_server_v20.json
- title: HTTPException 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","import","http_exception","status_code","error_response"]
- reading_goal: 조건이 맞지 않을 때 HTTP 오류를 반환하는 코드를 읽는다.
- code:
```python
from fastapi import HTTPException

@app.get("/items/{item_id}")
def get_item(item_id: str):
    item = db.get(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="item not found")
    return item
```
- question: item이 없으면 어떤 HTTP 상태가 반환되는가?
- answer: 404
- explanation: HTTPException(status_code=404)는 찾을 수 없다는 응답을 만든다. HTTPException은 FastAPI에서 의도적으로 오류 응답을 돌려줄 때 쓰는 예외다. 상태 코드와 detail 메시지가 사용자에게 무엇을 알려 주는지 확인해야 한다.
- project_context: 카드/문서/노드 조회 API에서 없는 항목을 명확히 처리하는 방식이다.

## PY20_L08_path_param_001
- level: 8
- file: python_fastapi_api_server_v20.json
- title: path parameter 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","fastapi","path_parameter","endpoint"]
- reading_goal: URL 경로 일부가 함수 인자로 들어오는 구조를 읽는다.
- code:
```python
@app.get("/cards/{card_id}")
def get_card(card_id: str):
    return {"card_id": card_id}
```
- question: /cards/PY20_001로 요청하면 card_id는?
- answer: PY20_001
- explanation: @app.get("/cards/{card_id}")에서 {card_id}는 URL 경로의 한 부분을 변수로 받겠다는 뜻이다. /cards/PY20_001로 요청하면 그 위치의 문자열 PY20_001이 함수 parameter card_id에 들어간다. 함수는 그 값을 dict에 넣어 반환하므로 이 요청에서 card_id 값은 PY20_001이다.
- project_context: 카드 상세, 문서 상세, 노드 상세 API에서 자주 쓰는 패턴이다.

## PY20_L08_post_body_pydantic_001
- level: 8
- file: python_fastapi_api_server_v20.json
- title: POST body와 Pydantic 모델 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","class","import","post","request_body","pydantic","validation"]
- reading_goal: JSON 요청 본문이 Pydantic 모델로 검증되는 구조를 읽는다.
- code:
```python
from pydantic import BaseModel

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

@app.post("/search")
def search(req: SearchRequest):
    return {"query": req.query, "top_k": req.top_k}
```
- question: 요청 JSON에 top_k가 없으면 어떤 값이 쓰이는가?
- answer: 5
- explanation: Pydantic 모델에서 top_k: int = 5로 기본값을 지정했기 때문이다. POST body와 Pydantic 모델은 사용자가 보낸 JSON을 검증된 객체로 바꾸는 흐름이다. 필수 필드, 타입, 기본값이 어디서 정해지는지 보면 된다.
- project_context: RAG 검색 요청, 노드 추출 요청, 교육용 질문 요청 body를 설계할 때 쓰는 구조다.

## PY20_L08_response_model_001
- level: 8
- file: python_fastapi_api_server_v20.json
- title: response_model 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","class","fastapi","response_model","pydantic","schema"]
- reading_goal: API 응답 형식을 Pydantic 모델로 제한하는 구조를 읽는다.
- code:
```python
class SearchResponse(BaseModel):
    answer: str
    citations: list[str]

@app.post("/answer", response_model=SearchResponse)
def answer(req: SearchRequest):
    return {"answer": "...", "citations": ["doc1"]}
```
- question: response_model=SearchResponse의 목적은?
- answer: 응답 형식을 SearchResponse 스키마에 맞춘다
- explanation: FastAPI는 response_model을 OpenAPI 문서에 사용하고, 반환값을 SearchResponse에 맞게 검증·직렬화·필터링한다. 이 예시에서는 answer는 문자열이고 citations는 문자열 목록이어야 한다. 내부 객체에 다른 필드가 있어도 기본적으로 응답 model에 선언된 필드 중심으로 내보내 민감한 필드 노출을 줄일 수 있지만, 올바른 model을 지정해야 한다.
- project_context: 프론트 앱이 기대하는 응답 구조를 안정적으로 유지하는 데 중요하다.

## PY19_L08_encoding_fallback_001
- level: 8
- file: python_file_data_processing_v19.json
- title: 인코딩 fallback 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","encoding","utf8","cp949","try_except"]
- reading_goal: UTF-8로 실패하면 CP949로 다시 읽는 코드를 이해한다.
- code:
```python
def read_text_fallback(path):
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="cp949")
```
- question: UnicodeDecodeError가 나면 무엇을 하는가?
- answer: cp949 인코딩으로 다시 읽는다
- explanation: 첫 UTF-8 decode가 실패할 때만 cp949로 다시 읽는다. 오래된 한국어 Windows 파일에는 도움이 될 수 있지만, 실제 encoding이 다른 파일도 cp949가 오류 없이 잘못된 글자로 해석할 수 있다. 출처의 encoding metadata나 탐지 결과를 우선하고, fallback을 썼다는 사실을 기록해 조용한 데이터 손상을 막아야 한다.
- project_context: 공공기관 자료, CSV, HWP/PDF 추출 텍스트에서 인코딩 문제가 자주 생긴다.

## PY19_L08_glob_sort_001
- level: 8
- file: python_file_data_processing_v19.json
- title: glob 결과 정렬 읽기
- question_type: meaning_choice
- concepts: ["for","import","print","glob","sort","pathlib","deterministic"]
- reading_goal: 파일 목록을 항상 같은 순서로 처리하기 위해 정렬하는 코드를 읽는다.
- code:
```python
from pathlib import Path

files = sorted(Path("data/lessons").glob("*.json"))
for path in files:
    print(path.name)
```
- question: sorted를 붙이는 이유는?
- answer: 처리 순서를 안정적으로 만들기 위해
- explanation: 파일 시스템이 주는 순서는 항상 의도대로 보장되지 않을 수 있어 정렬이 유용하다. glob은 패턴에 맞는 파일 목록을 찾고, sort는 그 목록의 순서를 고정한다. 파일 처리 코드는 순서에 따라 결과가 달라질 수 있으므로 정렬 여부가 중요하다.
- project_context: lesson 파일 검증, chunk parts 병합, clean pack 처리 순서를 안정화하는 데 중요하다.

## PY19_L08_path_join_mkdir_001
- level: 8
- file: python_file_data_processing_v19.json
- title: Path 결합과 폴더 생성 읽기
- question_type: meaning_choice
- concepts: ["import","pathlib","mkdir","path_join","directory"]
- reading_goal: 출력 폴더를 만들고 파일 경로를 조립하는 코드를 읽는다.
- code:
```python
from pathlib import Path

out_dir = Path("derived") / "clean" / "inbox"
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / "manifest.jsonl"
```
- question: parents=True의 의미는?
- answer: 중간 폴더가 없어도 함께 만든다
- explanation: Path의 / 연산자는 운영체제에 맞게 경로 요소를 결합한다. mkdir의 parents=True는 derived와 clean 같은 누락된 부모 디렉터리도 만들고, exist_ok=True는 목표 디렉터리가 이미 있을 때의 FileExistsError를 막는다. 같은 위치에 일반 파일이 있으면 여전히 실패하며, out_file은 경로만 만들 뿐 파일을 생성하지 않는다.
- project_context: derived, tmp, reports 같은 산출물 폴더를 자동 생성할 때 자주 쓴다.

## PY32_L08_glob_get_child_item_001
- level: 8
- file: python_files_paths_project_structure_v32.json
- title: glob / Get-ChildItem 읽기
- question_type: meaning_choice
- concepts: ["glob","Get-ChildItem","file_listing"]
- reading_goal: 특정 패턴의 파일 목록을 찾는 코드를 이해한다.
- code:
```python
Get-ChildItem ".\data\lessons" -File -Filter "*.json"
```
- question: 이 명령이 찾는 파일은?
- answer: data/lessons 폴더의 JSON 파일
- explanation: Get-ChildItem은 지정한 위치의 항목을 나열한다. -File은 폴더를 제외하고, -Filter '*.json'은 이름이 해당 패턴과 맞는 파일만 고른다. 하위 폴더까지 찾으려면 별도로 -Recurse가 필요하다.
- project_context: 전체 lesson 파일 검증 루틴의 시작점이다.

## PY32_L08_new_item_directory_001
- level: 8
- file: python_files_paths_project_structure_v32.json
- title: 폴더 생성 New-Item
- question_type: meaning_choice
- concepts: ["New-Item","directory","force"]
- reading_goal: 없으면 만들고 있으면 넘어가는 폴더 생성 명령을 이해한다.
- code:
```python
New-Item -ItemType Directory -Force -Path ".\tmp\backup" | Out-Null
```
- question: -Force의 의미로 가장 가까운 것은?
- answer: 이미 있어도 오류 없이 진행하게 한다
- explanation: New-Item -ItemType Directory는 폴더를 만든다. 이 경우 -Force를 쓰면 같은 폴더가 이미 있다는 이유만으로 실패하지 않고 기존 폴더를 사용할 수 있다. 다만 권한 문제나 같은 경로의 파일처럼 다른 오류까지 모두 무시한다는 뜻은 아니다.
- project_context: 백업 폴더, 출력 폴더, 임시 폴더를 만들 때 유용하다.

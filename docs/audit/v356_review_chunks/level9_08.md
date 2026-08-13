# V356 semantic review — Level 9 chunk 8

Cards 141-160 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY103_L09_pip_freeze_001
- level: 9
- file: python_dev_environment_foundation_v103_a1.json
- title: pip freeze와 저장 방향 읽기
- question_type: meaning_choice
- concepts: ["pip_freeze","requirements.txt","reproducibility"]
- reading_goal: 현재 환경의 패키지 버전을 파일로 남기는 흐름을 이해한다.
- code:
```python
python -m pip freeze > requirements.txt
```
- question: 이 명령의 결과로 가장 가까운 것은?
- answer: 현재 환경의 패키지 목록이 requirements.txt에 저장된다
- explanation: pip freeze는 현재 환경에 설치된 Python 배포판과 버전을 출력하고, >는 그 출력을 requirements.txt로 덮어쓴다. 환경 스냅샷에는 실험 중 설치한 불필요한 패키지와 간접 의존성도 섞일 수 있다. 필요한 항목인지 검토하고, 운영체제 패키지·Python 버전·환경 표식까지 이 파일 하나가 재현하지는 못한다는 점을 함께 문서화해야 한다.
- project_context: 배포나 새 PC 세팅 전에 의존성을 정리하는 흐름과 연결된다.

## PY59_L09_error_boundary_001
- level: 9
- file: python_error_recovery_retry_ux_v59.json
- title: error boundary 읽기
- question_type: meaning_choice
- concepts: ["try_except","error_boundary","component_error","fallback_UI"]
- reading_goal: 컴포넌트 렌더링 오류를 잡아 대체 화면을 보여주는 error boundary 개념을 이해한다.
- code:
```python
try:
  renderCard(card)
except Exception:
  renderCardFallback(card.id)
```
- question: error boundary의 목적은?
- answer: 일부 화면 오류가 전체 앱을 무너뜨리지 않게 하기 위해
- explanation: 이 예시는 카드 하나의 렌더링을 try/except로 격리하는 경계 패턴이다. 해당 카드가 실패하면 대체 화면을 그리고 나머지 카드는 계속 처리할 수 있다. 프레임워크의 공식 Error Boundary와 문법은 다를 수 있으며, 예외를 잡은 뒤에는 원인을 안전하게 기록하고 복구 불가능한 오류까지 무조건 숨기지 않아야 한다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY59_L09_error_log_001
- level: 9
- file: python_error_recovery_retry_ux_v59.json
- title: user-facing error log 읽기
- question_type: meaning_choice
- concepts: ["error_log","debugging","support"]
- reading_goal: 사용자에게 보여줄 오류와 개발자가 볼 로그를 구분하는 방식을 이해한다.
- code:
```python
console.error(error)
showError('문제가 발생했습니다')
```
- question: 오류 로그와 사용자 메시지를 구분하는 이유는?
- answer: 개발 정보는 기록하고 사용자에게는 이해 가능한 메시지를 보여주기 위해
- explanation: 개발자 로그에는 오류 종류와 발생 위치처럼 진단에 필요한 정보를 남기고, 사용자 화면에는 이해 가능한 설명과 다음 행동을 보여 준다. stack trace, 토큰, 개인 메모 같은 내부 정보나 민감 정보는 사용자 메시지에 넣지 않으며 운영 로그에도 그대로 남기지 않는다. 같은 오류를 연결해 조사하려면 민감하지 않은 오류 ID를 함께 보여 줄 수 있다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY59_L09_invalid_json_recovery_001
- level: 9
- file: python_error_recovery_retry_ux_v59.json
- title: invalid JSON recovery 읽기
- question_type: meaning_choice
- concepts: ["try_except","invalid_JSON","parse_error","recovery"]
- reading_goal: JSON 파싱 실패 시 파일명과 복구 안내를 남기는 방식을 이해한다.
- code:
```python
try:
  data = JSON.parse(text)
catch (error):
  reportBadJson(fileName)
```
- question: invalid JSON recovery에서 필요한 정보는?
- answer: 어떤 파일이 깨졌는지와 어떻게 복구할지에 대한 안내
- explanation: JSON 파싱 오류는 배포 전 검증에서 먼저 잡는 것이 좋지만 런타임 방어도 필요하다. 어떤 파일이 실패했는지 개발 로그에 남기고, 사용자에게는 안전한 대체 화면이나 복구 방법을 제공한다. 손상된 값을 임의의 기본값으로 바꾸면 오류가 숨을 수 있으므로, 해당 파일을 격리하거나 명시적으로 건너뛰는 정책도 정해야 한다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY59_L09_safe_default_001
- level: 9
- file: python_error_recovery_retry_ux_v59.json
- title: safe default 읽기
- question_type: meaning_choice
- concepts: ["safe_default","defensive_programming","UX"]
- reading_goal: 값이 없을 때 안전한 기본값으로 앱이 계속 동작하게 하는 방식을 이해한다.
- code:
```python
choices = card.choices || []
title = card.title || '제목 없음'
```
- question: safe default의 목적은?
- answer: 일부 값이 없어도 앱이 완전히 깨지지 않게 하기 위해
- explanation: safe default는 선택적인 값이 없을 때 앱이 계속 동작하도록 정한 기본값이다. 예시에서는 choices가 없으면 빈 목록, title이 없으면 안내 문구를 쓴다. 하지만 필수 필드까지 기본값으로 덮으면 손상된 데이터를 정상처럼 보이게 할 수 있으므로, 필수값은 검증 오류로 기록하고 선택값에만 기본값을 쓰는 편이 안전하다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY20_L09_background_task_001
- level: 9
- file: python_fastapi_api_server_v20.json
- title: BackgroundTasks 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","import","background_task","fastapi","async_job"]
- reading_goal: 응답 후 뒤에서 작업을 실행하는 구조를 읽는다.
- code:
```python
from fastapi import BackgroundTasks

def save_log(query: str):
    logs.append(query)

@app.post("/search")
def search(req: SearchRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(save_log, req.query)
    return {"ok": True}
```
- question: background_tasks.add_task(save_log, req.query)의 의미는?
- answer: save_log를 백그라운드 작업으로 등록한다
- explanation: add_task는 response가 전송된 뒤 save_log(req.query)를 실행할 background task 목록에 등록한다. 요청 응답을 늦추지 않는 작은 부가 작업에 유용하지만 같은 server process 안에서 실행되므로 process가 종료되면 잃을 수 있고, 실패를 client 응답으로 알릴 수도 없다. 오래 걸리거나 반드시 완료해야 하는 작업은 durable queue와 worker를 고려한다.
- project_context: 질문 로그, 사용 기록, 분석 이벤트 저장에 활용할 수 있는 패턴이다.

## PY20_L09_cors_001
- level: 9
- file: python_fastapi_api_server_v20.json
- title: CORS middleware 읽기
- question_type: meaning_choice
- concepts: ["import","cors","middleware","frontend","api"]
- reading_goal: 프론트엔드가 다른 주소의 API를 호출할 때 필요한 CORS 설정을 읽는다.
- code:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8790"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```
- question: allow_origins에 localhost:8790을 넣는 이유는?
- answer: 그 주소의 프론트에서 API 호출을 허용하려고
- explanation: origin은 scheme, host, port의 조합이므로 http://localhost:8790에서 실행된 browser frontend가 다른 origin의 API를 읽게 하려면 서버가 해당 origin을 CORS 응답에 허용해야 한다. CORS는 browser가 적용하는 교차 출처 규칙이지 authentication이나 API 접근 제어가 아니다. allow_methods와 allow_headers의 *도 필요한 범위로 줄이는 편이 안전하다.
- project_context: 정적 PWA와 로컬 FastAPI 서버를 연결할 때 자주 만나는 문제다.

## PY20_L09_dependency_injection_001
- level: 9
- file: python_fastapi_api_server_v20.json
- title: Depends 의존성 주입 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","import","depends","dependency_injection","fastapi"]
- reading_goal: 요청 처리 전에 공통 의존성을 준비하는 구조를 읽는다.
- code:
```python
from fastapi import Depends

def get_db():
    return db

@app.get("/items")
def list_items(db=Depends(get_db)):
    return db.list_items()
```
- question: Depends(get_db)의 역할은?
- answer: endpoint 실행 전에 get_db 결과를 인자로 넣는다
- explanation: FastAPI는 endpoint 호출 전에 get_db 의존성을 해결하고 그 반환값을 list_items의 db 인자로 전달한다. Depends는 인증·설정·DB session 같은 공통 준비와 정리를 재사용하게 한다. 실제 DB session은 return global 대신 yield dependency로 열고 닫는 패턴이 흔하며, 의존성 주입 자체가 권한 검사를 자동으로 제공하는 것은 아니다.
- project_context: DB 연결, 사용자 인증, 설정 로딩을 endpoint마다 반복하지 않게 할 수 있다.

## PY20_L09_status_code_001
- level: 9
- file: python_fastapi_api_server_v20.json
- title: HTTP status code 분기 읽기
- question_type: meaning_choice
- concepts: ["if","return","try_except","http_status","200","400","500","api"]
- reading_goal: 상황에 따라 다른 HTTP 상태 코드를 반환하는 의미를 이해한다.
- code:
```python
if not query:
    raise HTTPException(status_code=400, detail="query required")

try:
    result = run_search(query)
except Exception:
    raise HTTPException(status_code=500, detail="server error")

return result
```
- question: query가 비어 있으면 왜 400인가?
- answer: 클라이언트 요청이 잘못되었기 때문에
- explanation: 빈 query는 이 API가 요구하는 입력을 충족하지 못한 client 요청이므로 코드가 400을 발생시킨다. run_search의 다른 Exception은 이 예시에서 모두 500으로 바뀐다. 실제 서버에서는 기존 HTTPException까지 500으로 덮어쓰지 않도록 예상 오류를 구분하고, 내부 원인은 안전한 로그에 남기되 client에는 민감한 세부 정보를 보내지 않아야 한다.
- project_context: API 디버깅에서 400/404/500을 구분하는 기초다.

## PY20_L09_uvicorn_run_001
- level: 9
- file: python_fastapi_api_server_v20.json
- title: uvicorn 실행 명령 읽기
- question_type: meaning_choice
- concepts: ["uvicorn","fastapi","host","port"]
- reading_goal: FastAPI 서버를 어떤 모듈/앱/포트로 실행하는지 읽는다.
- code:
```python
uvicorn search_api:app --host 127.0.0.1 --port 8000 --reload
```
- question: search_api:app의 의미는?
- answer: search_api 모듈에서 app 객체를 가져와 ASGI 앱으로 실행한다
- explanation: search_api:app은 module import path와 그 안의 ASGI application 객체 이름이다. module이 반드시 search_api.py 한 파일일 필요는 없고 import 가능한 package 경로일 수도 있다. --reload는 source 변경을 감지하는 개발 옵션이라 production에서는 보통 끄고 적절한 process와 proxy 설정을 사용한다.
- project_context: FastAPI application을 로컬 개발 server로 실행하는 command 구조다.

## PY19_L09_manifest_create_001
- level: 9
- file: python_file_data_processing_v19.json
- title: 파일 manifest 생성 읽기
- question_type: meaning_choice
- concepts: ["for","import","manifest","metadata","file","jsonl"]
- reading_goal: 폴더 안 파일 목록을 메타데이터 JSONL로 저장하는 흐름을 읽는다.
- code:
```python
import json
from pathlib import Path

root = Path("data/raw")
with open("manifest.jsonl", "w", encoding="utf-8") as out:
    for path in sorted(root.rglob("*.pdf")):
        row = {"path": str(path), "name": path.name, "size": path.stat().st_size}
        out.write(json.dumps(row, ensure_ascii=False) + "\n")
```
- question: path.stat().st_size는 무엇을 가져오는가?
- answer: 파일 크기
- explanation: stat()은 파일 메타데이터를 주고 st_size는 크기 바이트 값을 의미한다. manifest는 여러 파일의 목록과 메타데이터를 기록하는 표처럼 볼 수 있다. 어떤 파일을 포함했는지, 경로와 상태가 어떻게 저장되는지 확인하면 재처리가 쉬워진다.
- project_context: 수집 파일을 나중에 재처리할 수 있게 목록화하는 기본 manifest 패턴이다.

## PY19_L09_safe_filename_001
- level: 9
- file: python_file_data_processing_v19.json
- title: 파일명 정규화 함수 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","import","filename","normalization","regex","safe_path"]
- reading_goal: 파일명에 위험한 문자를 안전한 문자로 바꾸는 코드를 읽는다.
- code:
```python
import re

def safe_name(name):
    name = name.strip()
    name = re.sub(r"[\\/:*?\"<>|]", "_", name)
    return name[:120]
```
- question: return name[:120]의 목적은?
- answer: 파일명이 너무 길어지는 것을 제한한다
- explanation: 첫 줄은 앞뒤 공백을 제거하고 re.sub는 Windows에서 금지되는 여러 문자를 밑줄로 바꾼다. [:120]은 Python 문자 수를 제한할 뿐 byte 길이나 전체 경로 길이를 보장하지 않는다. 빈 이름, CON 같은 예약명, 끝의 점·공백, Unicode 정규화, 같은 결과로 변환되는 이름의 충돌과 확장자 보존도 별도로 처리해야 완전한 안전 파일명이 된다.
- project_context: PDF 제목, 웹 제목, 기관 자료명을 파일명으로 바꿀 때 필요한 방어 코드다.

## PY19_L09_sha256_file_001
- level: 9
- file: python_file_data_processing_v19.json
- title: 파일 SHA256 해시 계산 읽기
- question_type: meaning_choice
- concepts: ["for","import","print","sha256","hash","file","integrity"]
- reading_goal: 파일을 chunk 단위로 읽어 해시를 계산하는 코드를 이해한다.
- code:
```python
import hashlib

h = hashlib.sha256()
with open("pack.zip", "rb") as f:
    for block in iter(lambda: f.read(1024 * 1024), b""):
        h.update(block)

print(h.hexdigest())
```
- question: 파일을 rb로 여는 이유는?
- answer: 바이너리 모드로 읽어 정확한 바이트 해시를 계산하려고
- explanation: SHA-256은 bytes를 입력받으므로 rb로 열어 줄바꿈 변환이나 문자 decoding 없이 파일의 실제 바이트를 block별로 h에 누적한다. 같은 digest는 실수로 내용이 바뀌었는지 확인하는 강한 신호지만, 해시만 받은 경우 공격자가 파일과 digest를 모두 바꿀 수 있으므로 출처 인증은 서명이나 신뢰된 digest 채널이 별도로 필요하다.
- project_context: zip 분할/이동/중복 정리에서 파일 무결성을 확인하는 데 쓰인다.

## PY19_L09_zip_extract_001
- level: 9
- file: python_file_data_processing_v19.json
- title: zip 압축 해제 코드 읽기
- question_type: meaning_choice
- concepts: ["import","zipfile","extract","archive","path"]
- reading_goal: zip 파일을 지정 폴더로 푸는 코드를 읽는다.
- code:
```python
from pathlib import Path
from zipfile import ZipFile

zip_path = Path("pack.clean.zip")
out_dir = Path("tmp/unpacked")
out_dir.mkdir(parents=True, exist_ok=True)

with ZipFile(zip_path) as zf:
    zf.extractall(out_dir)
```
- question: extractall(out_dir)의 의미는?
- answer: zip 안의 파일들을 out_dir로 푼다
- explanation: extractall(out_dir)은 archive의 모든 항목을 out_dir 아래에 푼다. 신뢰하지 않는 zip은 경로 이동 항목, 절대 경로, symlink, 지나치게 큰 압축 해제 크기 같은 위험이 있을 수 있으므로 이름과 크기·개수·링크를 검사하고 격리된 새 디렉터리에 풀어야 한다. 기존 파일 충돌도 extraction 전에 확인한다.
- project_context: clean pack, upload pack, 분할 압축본을 확인할 때 필요한 기본 코드다.

## PY32_L09_backup_file_001
- level: 9
- file: python_files_paths_project_structure_v32.json
- title: 백업 파일 만들기
- question_type: meaning_choice
- concepts: ["backup","Copy-Item","safe_patch"]
- reading_goal: 수정 전 원본 파일을 백업하는 명령을 이해한다.
- code:
```python
Copy-Item ".\src\pwa\app.js" ".\tmp\backup\app.js.bak" -Force
```
- question: 이 명령의 목적은?
- answer: app.js를 백업 위치에 복사한다
- explanation: Copy-Item은 app.js를 지정한 백업 경로로 복사한다. -Force 때문에 같은 이름의 백업이 있으면 덮어쓸 수 있으므로, 여러 복구 지점을 보존하려면 타임스탬프나 고유 이름을 사용해야 한다. 중요한 변경이라면 복사 성공과 복원 가능 여부도 확인한다.
- project_context: 큰 패치를 적용하기 전 안전장치로 쓸 수 있다.

## PY32_L09_path_with_spaces_001
- level: 9
- file: python_files_paths_project_structure_v32.json
- title: 공백 있는 경로 읽기
- question_type: meaning_choice
- concepts: ["quoted_path","PowerShell","space"]
- reading_goal: 경로에 공백이 있을 때 따옴표가 필요한 이유를 이해한다.
- code:
```python
Set-Location "D:\projects\my test project"
python ".\scripts\run job.py"
```
- question: 경로를 따옴표로 감싼 이유는?
- answer: 공백이 있는 경로를 하나의 인자로 전달하기 위해
- explanation: path with spaces는 경로 안에 공백이 들어 있는 경우를 말한다. 따옴표가 없으면 공백 기준으로 여러 인자처럼 해석될 수 있어 주의해야 한다. 특히 PowerShell이나 터미널 명령에서는 공백 있는 경로를 따옴표로 감싸는 습관이 중요하다.
- project_context: 공모전 폴더나 한글/공백이 있는 작업 폴더를 다룰 때 중요하다.

## PY32_L09_read_write_utf8_001
- level: 9
- file: python_files_paths_project_structure_v32.json
- title: UTF-8 읽기/쓰기
- question_type: meaning_choice
- concepts: ["UTF-8","read_write","encoding"]
- reading_goal: 한글이 깨지지 않게 인코딩을 지정하는 코드를 이해한다.
- code:
```python
$text = Get-Content ".\README.md" -Raw -Encoding UTF8
Set-Content ".\out.txt" $text -Encoding UTF8
```
- question: -Encoding UTF8을 붙이는 이유는?
- answer: 한글과 특수문자 깨짐을 줄이기 위해
- explanation: 읽기와 쓰기에 UTF-8을 명시하면 시스템 기본 인코딩 차이로 생기는 한글·특수문자 깨짐을 줄일 수 있다. 단, Windows PowerShell 5.1의 UTF8 출력은 BOM을 붙이고 PowerShell 7의 utf8은 기본적으로 BOM이 없으므로, 다른 도구와 교환할 때는 PowerShell 버전과 BOM 요구사항도 확인해야 한다.
- project_context: 한글 설명 카드와 README를 다루므로 UTF-8 저장이 중요하다.

## PY32_L09_temp_file_001
- level: 9
- file: python_files_paths_project_structure_v32.json
- title: 임시 파일 사용하기
- question_type: meaning_choice
- concepts: ["temp_file","atomic_write","safe_write"]
- reading_goal: 직접 덮어쓰기 전에 임시 파일을 거치는 이유를 이해한다.
- code:
```python
$tmp = ".\data\lessons\cards.tmp.json"
$out = ".\data\lessons\cards.json"

Set-Content $tmp $json -Encoding UTF8
Move-Item $tmp $out -Force
```
- question: 임시 파일을 거치는 장점은?
- answer: 쓰기 중 실패했을 때 원본 손상 위험을 줄일 수 있다
- explanation: 원본을 바로 덮어쓰지 않고 같은 폴더의 임시 파일에 먼저 쓴 뒤 교체하면, 쓰기 도중 실패해 원본이 반쯤 기록될 위험을 줄일 수 있다. 교체 전에는 임시 JSON을 검증하고, 교체 작업의 원자성은 운영체제·파일시스템·사용한 명령에 따라 달라질 수 있다는 점도 고려해야 한다.
- project_context: 대량 JSON 생성이나 merge 스크립트에 적용할 수 있는 안전 패턴이다.

## PY39_L09_offline_mode_001
- level: 9
- file: python_frontend_state_storage_cache_v39.json
- title: offline mode 읽기
- question_type: meaning_choice
- concepts: ["if","else","try_except","offline_mode","PWA","cache"]
- reading_goal: 네트워크가 없어도 일부 기능을 제공하는 offline mode를 이해한다.
- code:
```python
try:
  fetch latest lessons
catch network error:
  if cached lessons exist:
    load cached lessons
  else:
    show offline unavailable
```
- question: offline일 때 자연스러운 동작은?
- answer: 캐시된 lessons를 불러온다
- explanation: navigator.onLine은 네트워크 인터페이스 상태의 힌트일 뿐 실제 서버 접근 가능성을 보장하지 않는다. 먼저 네트워크 요청을 시도하고 실패하면 캐시로 fallback하는 편이 안전하다. 캐시도 없을 수 있으므로 사용할 수 없는 상태와 마지막 갱신 시각을 사용자에게 알려야 한다.
- project_context: 학습앱은 오프라인 복습 기능과 잘 맞지만, 최신성 표시가 필요하다.

## PY39_L09_optimistic_update_001
- level: 9
- file: python_frontend_state_storage_cache_v39.json
- title: optimistic update 읽기
- question_type: meaning_choice
- concepts: ["optimistic_update","UI","server_sync"]
- reading_goal: 서버 응답 전 화면을 먼저 바꾸고 실패 시 되돌리는 optimistic update를 이해한다.
- code:
```python
markCardCorrect(cardId); // update UI now
try {
  await saveProgress(cardId);
} catch (error) {
  rollbackCardCorrect(cardId);
}
```
- question: rollbackCardCorrect가 필요한 이유는?
- answer: 서버 저장 실패 시 먼저 바꾼 UI를 되돌리기 위해
- explanation: optimistic update는 서버 응답 전에 UI를 바꿔 빠르게 느끼게 한다. 저장 실패 때 이전 상태로 되돌리거나 재시도하고 오류를 알려야 한다. 동시에 여러 변경이 진행되면 오래된 실패가 최신 UI를 되돌리지 않도록 요청 ID나 mutation 순서도 관리해야 한다.
- project_context: 정답 클릭 후 진행률 저장 API가 느릴 때 사용자 경험을 좋게 만들 수 있다.

# V356 semantic review — Level 7 chunk 4

Cards 61-80 of 176.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY103_L07_command_option_argument_001
- level: 7
- file: python_dev_environment_foundation_v103_a1.json
- title: 옵션과 인자 구분하기
- question_type: meaning_choice
- concepts: ["command","option","argument","cli"]
- reading_goal: CLI 명령에서 옵션과 대상 값을 구분한다.
- code:
```python
git log --oneline -8
```
- question: --oneline과 -8은 무엇에 가장 가까운가?
- answer: 명령의 동작과 출력 범위를 바꾸는 옵션
- explanation: CLI에서 옵션은 명령의 동작을 바꾸고, 위치 인자는 처리 대상을 전달한다. git log --oneline -8에서 --oneline은 커밋을 한 줄로 표시하고 -8은 최대 8개만 보여 주는 옵션이다. 즉 둘 다 옵션이지만 하나는 표시 형식, 다른 하나는 출력 개수를 제어한다. 옵션 이름과 그 값, 위치 인자를 나눠 보면 긴 명령도 읽기 쉬워진다.
- project_context: 검증, Git, 서버 실행 명령을 읽는 기본이다.

## PY103_L07_git_status_model_001
- level: 7
- file: python_dev_environment_foundation_v103_a1.json
- title: git status로 현재 단계 읽기
- question_type: meaning_choice
- concepts: ["git","status","working_tree"]
- reading_goal: Git 변경이 어느 단계에 있는지 확인한다.
- code:
```python
git status --short
 M src/pwa/app.js
?? tmp_check.py
```
- question: ?? 표시의 의미는?
- answer: Git이 아직 추적하지 않는 새 파일
- explanation: git status는 현재 작업 폴더의 변경 상태를 보여 준다. M은 추적 중인 파일이 수정됐다는 뜻이고, ??는 Git이 아직 추적하지 않는 새 파일이라는 뜻이다. 커밋 전에는 예상한 파일만 바뀌었는지 확인해야 한다. 임시 스크립트나 감사 파일이 untracked로 남아 있으면 커밋 전에 삭제하거나 의도적으로 제외해야 한다. 특히 ??로 보이는 임시 감사 스크립트나 출력 리포트는 필요한 산출물인지 확인한 뒤 커밋에서 제외해야 저장소가 깔끔하게 유지된다.
- project_context: 검증 후 커밋 전에 clean 상태를 확인하는 습관과 연결된다.

## PY103_L07_permission_denied_001
- level: 7
- file: python_dev_environment_foundation_v103_a1.json
- title: Permission denied 원인 좁히기
- question_type: meaning_choice
- concepts: ["permission","file_access","linux"]
- reading_goal: 권한 오류를 sudo만으로 해결하지 않고 원인을 나눈다.
- code:
```python
bash: ./run.sh: Permission denied
```
- question: 이 메시지를 봤을 때 먼저 확인할 것은?
- answer: 파일 실행 권한과 현재 사용자 권한
- explanation: Permission denied는 권한이 부족하다는 뜻이지만 원인은 여러 가지다. 실행 권한이 없는 스크립트일 수도 있고, 보호된 폴더에 쓰려고 했을 수도 있으며, root 소유 파일을 일반 사용자로 수정하려는 상황일 수도 있다. 바로 sudo를 붙이기보다 ls -l, 현재 사용자, 대상 파일, 필요한 권한을 확인해야 한다. 필요한 최소 권한만 부여하는 습관이 안전하다.
- project_context: Linux 서버에서 스크립트 실행 오류를 볼 때 필요하다.

## PY103_L07_sudo_permission_001
- level: 7
- file: python_dev_environment_foundation_v103_a1.json
- title: sudo 명령 주의해서 읽기
- question_type: meaning_choice
- concepts: ["sudo","permission","admin"]
- reading_goal: sudo가 관리자 권한 실행이라는 점과 위험성을 이해한다.
- code:
```python
sudo apt install poppler-utils
```
- question: sudo를 붙인 가장 직접적인 이유는?
- answer: 관리자 권한으로 시스템 패키지를 설치하기 위해
- explanation: sudo는 Ubuntu/Linux에서 관리자 권한으로 명령을 실행하게 한다. 시스템 패키지를 설치하거나 보호된 설정을 바꿀 때 필요할 수 있지만, 습관적으로 붙이면 위험하다. 특히 sudo pip install처럼 Python 패키지 설치에 관리자 권한을 섞으면 프로젝트 환경과 파일 소유권이 꼬일 수 있다. Permission denied가 나와도 먼저 어떤 대상에 접근하려다 실패했는지 확인해야 한다.
- project_context: 서버 세팅에서 sudo를 안전하게 판단하기 위한 카드다.

## PY59_L07_error_state_001
- level: 7
- file: python_error_recovery_retry_ux_v59.json
- title: error state 읽기
- question_type: meaning_choice
- concepts: ["error_state","state_management","UI"]
- reading_goal: 로딩, 성공, 실패 상태를 구분해 화면을 바꾸는 방식을 이해한다.
- code:
```python
state = { loading: false, error: 'load failed', data: null }
```
- question: error state가 필요한 이유는?
- answer: 실패 상태를 화면과 로직에서 명확히 다루기 위해
- explanation: error state는 요청이나 렌더링이 실패했음을 화면 상태로 분리해 표현하는 방식이다. 성공 데이터만 가정하면 실패 상황에서 조용히 깨질 수 있다. error state를 따로 두면 재시도 버튼이나 안내 문구를 조건부로 보여 주기 쉽다. 따라서 정답은 ‘실패 상태를 화면과 로직에서 명확히 다루기 위해’이다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY59_L07_fallback_ui_001
- level: 7
- file: python_error_recovery_retry_ux_v59.json
- title: fallback UI 읽기
- question_type: meaning_choice
- concepts: ["fallback_UI","error_state","UX"]
- reading_goal: 정상 화면 대신 오류 안내 화면을 보여주는 fallback UI를 이해한다.
- code:
```python
renderFallback('일시적으로 카드를 표시할 수 없습니다')
```
- question: fallback UI의 목적은?
- answer: 정상 화면을 만들 수 없을 때 대체 안내 화면을 보여주기 위해
- explanation: fallback UI는 정상 화면을 만들 수 없을 때 대신 보여주는 안전한 안내 화면이다. 깨진 화면보다 복구 가능한 행동을 안내하는 편이 낫다. 재시도, 홈으로 이동, 오류 신고 같은 선택지를 제공하면 실패 상황에서도 앱을 계속 쓸 수 있다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY59_L07_recover_action_001
- level: 7
- file: python_error_recovery_retry_ux_v59.json
- title: recover action 읽기
- question_type: meaning_choice
- concepts: ["recover","user_action","error_recovery"]
- reading_goal: 오류 후 사용자가 할 수 있는 복구 행동을 제시하는 UX를 이해한다.
- code:
```python
showActions(['다시 시도', '홈으로 이동', '캐시 새로고침'])
```
- question: recover action의 목적은?
- answer: 오류 상황에서 사용자가 다음에 무엇을 할지 알려주기 위해
- explanation: recover action은 오류가 났을 때 사용자가 할 수 있는 해결 행동이다. 좋은 오류 화면은 문제 설명뿐 아니라 재시도, 새로고침 같은 행동도 제공한다. 복구 행동이 명확하면 사용자가 오류를 만났을 때 앱을 떠나지 않고 다시 시도할 수 있다.
- project_context: 감사 v2에서 ERROR_RECOVERY_USER_FACING이 0 hits였으므로, v59는 사용자가 오류 상황에서도 앱을 복구하고 학습을 이어갈 수 있는 UX를 보강한다.

## PY20_L07_fastapi_app_001
- level: 7
- file: python_fastapi_api_server_v20.json
- title: FastAPI 앱 생성 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","import","fastapi","app","api_server"]
- reading_goal: FastAPI 앱 객체를 만들고 endpoint를 붙이는 기본 구조를 읽는다.
- code:
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"ok": True}
```
- question: @app.get('/health')의 역할은?
- answer: GET /health 요청을 health 함수에 연결한다
- explanation: FastAPI decorator는 특정 HTTP 경로와 파이썬 함수를 연결한다. 브라우저나 프론트엔드가 그 경로를 호출하면 연결된 함수가 실행된다. health endpoint는 서버가 살아 있는지 빠르게 확인하는 용도로도 자주 사용된다.
- project_context: 로컬 RAG API, 검색 API, 학습 앱 API 서버의 가장 기본 구조다.

## PY20_L07_get_query_param_001
- level: 7
- file: python_fastapi_api_server_v20.json
- title: GET query parameter 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","fastapi","query_parameter","get"]
- reading_goal: URL 쿼리 파라미터가 함수 인자로 들어오는 구조를 이해한다.
- code:
```python
@app.get("/search")
def search(q: str, limit: int = 5):
    return {"query": q, "limit": limit}
```
- question: /search?q=lidar로 호출하고 limit을 생략하면 limit 값은?
- answer: 5
- explanation: query parameter는 URL 뒤에 붙는 입력값이다. limit: int = 5처럼 기본값을 지정하면 사용자가 생략했을 때 5가 자동으로 들어간다. 쿼리 파라미터는 검색어, 페이지 크기, 필터처럼 URL로 전달되는 선택값에 자주 쓰인다.
- project_context: 검색창 입력을 API로 보내는 기본 패턴이다.

## PY19_L07_jsonl_stream_001
- level: 7
- file: python_file_data_processing_v19.json
- title: JSONL 한 줄씩 읽기
- question_type: meaning_choice
- concepts: ["if","for","import","print","continue","jsonl","streaming","json","large_file"]
- reading_goal: 대용량 JSONL을 한 번에 메모리에 올리지 않고 처리하는 코드를 읽는다.
- code:
```python
import json

with open("chunks.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        if not line.strip():
            continue
        item = json.loads(line)
        print(item["chunk_id"])
```
- question: for line in f 방식의 장점은?
- answer: 파일을 한 줄씩 읽어 메모리 사용을 줄인다
- explanation: 파일 객체를 직접 반복하면 한 번에 한 줄씩 읽으므로 read_text처럼 파일 전체 문자열을 메모리에 만들지 않는다. 빈 줄은 건너뛰고 각 줄을 json.loads로 파싱한다. 하지만 한 줄의 JSON 오류가 나면 이 코드 전체는 그 자리에서 중단되므로, 계속 처리하거나 재개하려면 줄 번호와 오류를 별도로 기록하는 try/except가 필요하다.
- project_context: 70k+ chunks나 node/edge 후보 jsonl을 처리할 때 필요한 실전 패턴이다.

## PY19_L07_write_jsonl_001
- level: 7
- file: python_file_data_processing_v19.json
- title: JSONL 저장 루프 읽기
- question_type: meaning_choice
- concepts: ["for","import","jsonl","write","ensure_ascii","file"]
- reading_goal: dict 목록을 JSONL 파일로 저장하는 코드를 읽는다.
- code:
```python
import json

rows = [{"id": "a1", "label": "LiDAR"}, {"id": "a2", "label": "Radar"}]

with open("nodes.jsonl", "w", encoding="utf-8") as f:
    for row in rows:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")
```
- question: ensure_ascii=False를 쓰는 이유에 가장 가까운 것은?
- answer: 한글 같은 비ASCII 문자를 읽기 좋게 저장하려고
- explanation: ensure_ascii=False는 비ASCII 문자를 \uXXXX escape 대신 사람이 읽을 수 있는 문자로 JSON 문자열에 기록한다. UTF-8 encoding과 함께 쓰므로 한글도 그대로 보인다. 각 row 뒤에 줄바꿈을 붙여 JSONL 한 레코드를 완성한다. "w" 모드는 기존 nodes.jsonl을 먼저 비우므로 이어 쓰기가 필요한 작업에서는 덮어쓰기 정책을 확인해야 한다.
- project_context: 한국어 기술문서 chunk, node label, evidence snippet을 저장할 때 중요하다.

## PY32_L07_path_join_001
- level: 7
- file: python_files_paths_project_structure_v32.json
- title: Path join 읽기
- question_type: meaning_choice
- concepts: ["import","path_join","pathlib","cross_platform"]
- reading_goal: 문자열 더하기보다 안전하게 경로를 조합하는 방식을 이해한다.
- code:
```python
from pathlib import Path

root = Path("C:/work/app")
lesson = root / "data" / "lessons" / "cards_seed_v1.json"
```
- question: root / 'data' / 'lessons'의 의미는?
- answer: 경로 조각을 안전하게 이어 붙인다
- explanation: path join은 여러 경로 조각을 하나의 경로 객체로 조합하는 방식이다. pathlib의 / 연산자는 운영체제에 맞는 구분자를 처리해 문자열 덧셈보다 구분자 실수를 줄인다. 다만 경로를 조합하는 것만으로 파일이 실제로 생기거나 존재가 확인되는 것은 아니다.
- project_context: Windows와 Linux 서버를 오갈 때 pathlib이 특히 유용하다.

## PY32_L07_working_directory_001
- level: 7
- file: python_files_paths_project_structure_v32.json
- title: 현재 작업 폴더 확인
- question_type: meaning_choice
- concepts: ["working_directory","Get-Location","PowerShell"]
- reading_goal: PowerShell에서 현재 작업 폴더를 확인하는 명령을 읽는다.
- code:
```python
Get-Location
Set-Location "C:\work\app"
Get-Location
```
- question: Get-Location의 역할은?
- answer: 현재 PowerShell 위치를 보여준다
- explanation: working directory는 상대경로를 해석할 기준 폴더다. 첫 Get-Location은 이동 전 위치를 보여 주고, Set-Location은 기준 폴더를 바꾸며, 마지막 Get-Location은 이동 결과를 확인한다. FileNotFoundError가 나면 코드보다 먼저 이 기준이 예상과 같은지 확인하면 원인을 좁히기 쉽다.
- project_context: FileNotFoundError가 났을 때 가장 먼저 확인할 명령 중 하나다.

## PY10_L07_assert_basic_001
- level: 7
- file: python_foundation_expansion_v10.json
- title: assert 기본 읽기
- question_type: output_prediction
- concepts: ["print","assert","test","validation"]
- reading_goal: 조건이 참인지 간단히 검사하는 assert 코드를 읽는다.
- code:
```python
assert 2 + 3 == 5
print("ok")
```
- question: 출력은?
- answer: ok
- explanation: 먼저 2 + 3 == 5를 계산하면 True이므로 assert는 예외를 발생시키지 않고 다음 줄로 넘어간다. 따라서 print가 ok를 출력한다. assert는 개발 중 내부 가정을 확인하는 용도이며 Python을 -O 옵션으로 실행하면 제거될 수 있으므로, 사용자 입력 검증이나 반드시 실행돼야 하는 보안 검사에 사용하면 안 된다.
- project_context: 간단 검증, 테스트, 파이프라인 품질 확인에 유용하다.

## PY10_L07_assert_fail_001
- level: 7
- file: python_foundation_expansion_v10.json
- title: assert 실패 읽기
- question_type: meaning_choice
- concepts: ["print","assert","test","error"]
- reading_goal: assert 조건이 거짓이면 중단되는 흐름을 읽는다.
- code:
```python
assert 2 + 3 == 6
print("ok")
```
- question: 이 코드는 어떻게 되는가?
- answer: AssertionError가 나고 print까지 가지 않는다
- explanation: assert 조건이 거짓이면 AssertionError가 발생한다. 2+3은 5라서 6과 같지 않으므로 이 검증은 실패한다. assert 실패는 코드가 기대한 조건이 거짓이었다는 신호다. 실패 메시지와 직전 입력값을 함께 보면 어떤 가정이 깨졌는지 찾기 쉽다. 따라서 출력은 ‘AssertionError가 나고 print까지 가지 않는다’이다.
- project_context: 검증 실패를 빨리 발견하는 테스트 습관과 연결된다.

## PY10_L07_env_get_001
- level: 7
- file: python_foundation_expansion_v10.json
- title: 환경변수 기본값 읽기
- question_type: meaning_choice
- concepts: ["import","print","env","os.environ","default"]
- reading_goal: 환경변수가 없을 때 기본값 문자열을 쓰는 코드를 읽는다.
- code:
```python
import os

value = os.environ.get("RUN_LIMIT", "100")
print(value)
```
- question: RUN_LIMIT이 없으면 value는?
- answer: 100
- explanation: os.environ.get("RUN_LIMIT", "100")은 RUN_LIMIT 환경변수가 있으면 그 값을, 없으면 두 번째 인자인 문자열 "100"을 반환한다. 따라서 이 조건에서는 value가 "100"이 되고 화면에는 100이 출력된다. 환경변수 값은 문자열이므로 계산에 쓰려면 int(value)처럼 변환해야 한다.
- project_context: API key, 실행 제한, 설정값을 읽는 코드에 자주 나온다.

## PY10_L07_path_glob_001
- level: 7
- file: python_foundation_expansion_v10.json
- title: glob으로 파일 찾기
- question_type: meaning_choice
- concepts: ["for","import","print","pathlib","glob","file"]
- reading_goal: 특정 폴더에서 패턴에 맞는 파일을 찾는 코드를 읽는다.
- code:
```python
from pathlib import Path

for path in Path("data").glob("*.json"):
    print(path.name)
```
- question: *.json은 무엇을 찾는가?
- answer: json 확장자 파일
- explanation: Path("data").glob("*.json")은 현재 작업 폴더 자체가 아니라 data 폴더 바로 아래에서 이름이 .json으로 끝나는 경로를 찾는다. *는 파일 이름 부분의 여러 문자를 대신하고, 패턴에 **가 없으므로 하위 폴더까지 재귀적으로 찾지는 않는다. 일치하는 경로가 없으면 반복문은 아무것도 출력하지 않는다.
- project_context: lesson 파일, side card 파일, 설정 파일 검색에 필요하다.

## PY10_L07_return_dict_001
- level: 7
- file: python_foundation_expansion_v10.json
- title: 함수가 dict 반환하기
- question_type: output_prediction
- concepts: ["def","print","function","dict","return"]
- reading_goal: 함수가 여러 필드를 가진 dict를 반환하는 구조를 읽는다.
- code:
```python
def make_row(id, title):
    return {
        "id": id,
        "title": title,
        "ok": True,
    }

row = make_row("n1", "LiDAR")
print(row["ok"])
```
- question: 출력은?
- answer: True
- explanation: 함수는 숫자나 문자열뿐 아니라 dict도 반환할 수 있다. make_row가 반환한 dict에서 ok key를 읽으면 True 값을 얻는다. 반환값이 dict라면 함수 호출 결과에 바로 key 접근을 이어 붙여 원하는 값을 꺼낼 수 있다.
- project_context: API 응답, 검증 결과, 요약 row 생성 코드에 자주 나온다.

## PY10_L07_safe_get_function_001
- level: 7
- file: python_foundation_expansion_v10.json
- title: safe get 함수 읽기
- question_type: output_prediction
- concepts: ["def","return","print","dict","get","default","function"]
- reading_goal: 없는 key를 안전하게 읽고 기본값을 쓰는 함수를 읽는다.
- code:
```python
def safe_get_score(row):
    return row.get("score", 0.0)

print(safe_get_score({"title": "A"}))
```
- question: 출력은?
- answer: 0.0
- explanation: row.get("score", 0.0)은 score 키가 있으면 그 값을, 없으면 기본값 0.0을 반환한다. 입력 dict에는 title만 있으므로 결과는 0.0이다. get은 선택 필드를 읽을 때 편리하지만, score가 반드시 있어야 하는 데이터라면 기본값이 누락 오류를 숨길 수 있으므로 별도 검증이 필요하다.
- project_context: 불완전한 수집 데이터 처리에 자주 쓰인다.

## PY10_L07_slice_limit_001
- level: 7
- file: python_foundation_expansion_v10.json
- title: slice limit 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","slice","limit","list"]
- reading_goal: 슬라이싱으로 리스트의 앞부분 일부만 자르는 코드를 읽는다.
- code:
```python
def choose(items, limit=3):
    return items[:limit]

print(choose(["a", "b", "c", "d"]))
```
- question: 출력은?
- answer: ["a", "b", "c"]
- explanation: 슬라이싱은 리스트의 일부 구간만 가져오는 문법이다. items[:3]은 시작부터 인덱스 3 전까지, 즉 앞의 3개를 가져온다. 끝 인덱스는 포함되지 않으므로 [:3]이 네 번째 값까지 가져오는 것이 아니라는 점이 중요하다. 따라서 출력은 ‘["a", "b", "c"]’이다.
- project_context: top_k, limit, 샘플링 코드의 기본이다.

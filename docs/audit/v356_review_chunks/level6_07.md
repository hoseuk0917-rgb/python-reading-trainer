# V356 semantic review — Level 6 chunk 7

Cards 121-140 of 162.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY2_L06_os_env_001
- level: 6
- file: python_practical_expansion_v2.json
- title: 환경변수에서 API 키 읽기
- question_type: meaning_choice
- concepts: ["if","import","print","os","env","api_key"]
- reading_goal: os.environ.get()으로 코드 밖 설정값을 읽는 패턴을 이해한다.
- code:
```python
import os

api_key = os.environ.get("GOOGLE_API_KEY")
if api_key:
    print("key found")
```
- question: 이 코드는 무엇을 읽으려는가?
- answer: 환경변수의 API 키
- explanation: os.environ.get('GOOGLE_API_KEY')는 해당 이름의 환경변수를 문자열로 읽고, 없으면 None을 반환한다. 값이 있으면 if 조건이 참이 되어 key found를 출력하지만 실제 API 키는 출력하지 않는다. 환경변수는 소스 코드 노출 위험을 줄일 수 있지만 로그, 프로세스 권한, 배포 설정의 접근 제어도 따로 관리해야 한다. 질문의 정답은 ‘환경변수의 API 키’이다.
- project_context: API 키를 소스 코드에 하드코딩하지 않게 해 주지만 환경변수 자체를 자동으로 비밀로 만들어 주는 것은 아니다.

## PY2_L06_path_exists_001
- level: 6
- file: python_practical_expansion_v2.json
- title: Path.exists() 읽기
- question_type: meaning_choice
- concepts: ["if","else","import","print","pathlib","exists","file"]
- reading_goal: 파일이나 폴더가 실제 존재하는지 확인하는 코드를 읽는다.
- code:
```python
from pathlib import Path

path = Path("data/nodes.jsonl")
if path.exists():
    print("found")
else:
    print("missing")
```
- question: 이 코드는 무엇을 확인하는가?
- answer: 경로 존재 여부
- explanation: Path.exists()는 그 경로에 파일이나 폴더가 존재하는지 True 또는 False로 알려 준다. 이 코드에서는 data/nodes.jsonl이 있으면 found, 없으면 missing을 출력한다. exists()가 True여도 그 뒤에 경로가 사라지거나 읽기 권한이 없으면 open은 실패할 수 있으므로, 존재 확인이 파일 읽기 오류를 모두 막는 것은 아니다.
- project_context: 입력 경로가 없을 때 더 이해하기 쉬운 오류 메시지로 중단하는 사전 점검에 쓸 수 있다.

## PY2_L06_path_mkdir_001
- level: 6
- file: python_practical_expansion_v2.json
- title: mkdir로 출력 폴더 만들기
- question_type: meaning_choice
- concepts: ["import","pathlib","mkdir","directory"]
- reading_goal: 출력 폴더를 미리 만들고 중복 생성 오류를 피하는 코드를 읽는다.
- code:
```python
from pathlib import Path

out_dir = Path("outputs")
out_dir.mkdir(parents=True, exist_ok=True)
```
- question: exist_ok=True의 의미에 가까운 것은?
- answer: 이미 폴더가 있어도 에러를 내지 않는다
- explanation: mkdir은 폴더를 만든다. parents=True는 필요한 상위 폴더도 함께 만들고, exist_ok=True는 outputs가 이미 폴더로 존재할 때 FileExistsError 없이 통과하게 한다. 같은 경로에 일반 파일이 있으면 exist_ok=True여도 폴더를 만들 수 없어 오류가 난다.
- project_context: 결과 파일을 저장하기 전 출력 폴더를 보장하는 패턴이다.

## PY50_L06_progress_schema_001
- level: 6
- file: python_progress_score_mistake_note_v50.json
- title: progress schema 읽기
- question_type: meaning_choice
- concepts: ["progress_schema","data_model","learning_state"]
- reading_goal: 진도 데이터를 어떤 필드 구조로 저장할지 schema 관점에서 읽는다.
- code:
```python
progress_row = {'card_id': card_id, 'status': 'seen', 'updated_at': now}
```
- question: progress schema가 필요한 이유는?
- answer: 진도 데이터를 일정한 구조로 저장하기 위해
- explanation: progress schema는 진도 데이터를 어떤 필드로 저장할지 정한 구조다. schema가 있으면 저장, 로드, 마이그레이션을 안정적으로 만들 수 있다. 필드 이름과 의미가 정해져 있어야 버전이 바뀌어도 기존 진도 데이터를 옮기기 쉽다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L06_progress_tracking_001
- level: 6
- file: python_progress_score_mistake_note_v50.json
- title: progress tracking 읽기
- question_type: meaning_choice
- concepts: ["progress_tracking","learning_progress","state"]
- reading_goal: 학습자가 어디까지 진행했는지 저장하고 이어가는 흐름을 읽는다.
- code:
```python
progress = {'current_card_id': card_id, 'solved_count': solved_count}
```
- question: progress tracking의 목적은?
- answer: 학습자가 어디까지 진행했는지 저장하기 위해
- explanation: progress tracking은 학습 상태를 저장해 다시 열었을 때 이어가게 한다. current_card_id와 solved_count만으로는 card 순서 변경, 삭제, 여러 device 충돌을 처리하기 어려우므로 card별 상태, schema version, updated_at과 안정적인 ID를 함께 둔다. 저장 성공 여부도 사용자에게 거짓으로 보여 주지 않는다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY6_L06_gitignore_001
- level: 6
- file: python_project_expansion_v6.json
- title: .gitignore 읽기
- question_type: meaning_choice
- concepts: ["comment","gitignore","env","venv"]
- reading_goal: Git에 올리지 않을 파일과 폴더를 구분해 읽는다.
- code:
```python
# .gitignore 일부
.env
.venv/
__pycache__/
outputs/
```
- question: .env를 gitignore에 넣는 이유는?
- answer: 비밀 설정 유출 방지
- explanation: .gitignore의 .env 패턴은 추적되지 않은 .env 파일이 새 커밋에 들어가는 실수를 줄인다. .env에는 API key 같은 비밀값이 있을 수 있으므로 정답은 ‘비밀 설정 유출 방지’다. 하지만 이미 Git이 추적 중인 파일은 .gitignore를 추가해도 자동으로 빠지지 않으며, 한 번 노출된 key는 기록 삭제만 믿지 말고 즉시 폐기·재발급해야 한다. .gitignore 자체가 비밀 저장소는 아니다.
- project_context: 공개 GitHub 저장소를 안전하게 운영하기 위한 기본이다.

## PY6_L06_normalize_id_001
- level: 6
- file: python_project_expansion_v6.json
- title: ID 정규화 함수 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","normalization","str","id"]
- reading_goal: 문서 ID를 비교하기 쉬운 형태로 바꾸는 흐름을 읽는다.
- code:
```python
def normalize_doc_id(value):
    return value.strip().lower().replace(" ", "_")

print(normalize_doc_id(" Doc 001 "))
```
- question: 출력은?
- answer: doc_001
- explanation: 먼저 strip()이 양끝 공백을 제거해 "Doc 001"을 만들고, lower()가 "doc 001"로 바꾼 뒤 replace(" ", "_")가 가운데 공백을 밑줄로 바꿔 doc_001을 만든다. 이 함수는 공백과 대소문자만 정규화하며 슬래시·기호·연속 밑줄 같은 다른 문자는 처리하지 않는다. 서로 다른 원본 ID가 같은 결과로 합쳐질 수 있으므로 실제 ID 정책에는 충돌 검사도 필요하다.
- project_context: doc_id, node_id, slug 정규화에 직접 연결된다.

## PY6_L06_pyproject_001
- level: 6
- file: python_project_expansion_v6.json
- title: pyproject.toml 읽기
- question_type: meaning_choice
- concepts: ["comment","pyproject","package","metadata"]
- reading_goal: 프로젝트 이름, 버전, 의존성을 선언하는 파일 구조를 읽는다.
- code:
```python
# pyproject.toml 일부
[project]
name = "reading-trainer"
version = "0.1.0"
dependencies = ["fastapi", "pandas"]
```
- question: dependencies에는 무엇이 들어가는가?
- answer: 필요 패키지 목록
- explanation: [project] 표 안의 name과 version은 프로젝트 메타데이터이고, dependencies는 설치할 때 필요한 직접 의존성 목록이다. pyproject.toml에는 이 밖에도 build-system이나 도구별 설정이 들어갈 수 있다. 다만 버전 범위를 쓰지 않은 이 목록은 최신 호환 버전을 허용하므로, 설치 결과를 완전히 고정하는 lock 파일과는 역할이 다르다.
- project_context: 요즘 파이썬 프로젝트 구조를 읽을 때 requirements와 함께 자주 본다.

## PY6_L06_requirements_001
- level: 6
- file: python_project_expansion_v6.json
- title: requirements.txt 읽기
- question_type: meaning_choice
- concepts: ["comment","requirements","package","pip"]
- reading_goal: 파이썬 프로젝트가 필요로 하는 패키지 목록을 읽는다.
- code:
```python
# requirements.txt
fastapi==0.115.0
uvicorn==0.30.0
pandas==2.2.0
```
- question: 이 파일은 무엇을 나타내는가?
- answer: 설치할 Python 패키지와 버전
- explanation: requirements.txt는 pip install -r requirements.txt처럼 설치할 Python 의존성을 한 줄씩 적는 파일이다. 이 예제의 ==는 FastAPI·Uvicorn·pandas를 지정한 버전으로 설치하라는 뜻이다. 직접 사용하는 패키지와 버전은 확인할 수 있지만, Python 버전·운영체제·하위 의존성까지 이 세 줄만으로 완전히 고정되는 것은 아니므로 재현 환경에는 lock 파일이나 별도 환경 정보가 더 필요할 수 있다.
- project_context: 서버나 앱 프로젝트를 실행하기 전에 의존성을 확인할 때 가장 먼저 본다.

## PY6_L06_slug_001
- level: 6
- file: python_project_expansion_v6.json
- title: slug 생성 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","slug","str","filename"]
- reading_goal: 문자열을 URL이나 파일명에 쓰기 좋은 slug 형태로 바꾸는 코드를 읽는다.
- code:
```python
def make_slug(title):
    return title.lower().replace("/", "-").replace(" ", "-")

print(make_slug("AI / RAG Notes"))
```
- question: 출력에 가까운 것은?
- answer: ai---rag-notes
- explanation: lower() 뒤에 / 하나가 -로 바뀌고, 그 양옆의 공백 두 개도 각각 -로 바뀌어 ai---rag-notes가 된다. 이 결과는 보기의 정답이지만, 함수가 모든 특수문자나 연속 하이픈을 정리하지 않으므로 일반적인 URL·파일명에 항상 안전한 slug를 보장하지는 않는다. 실제 slug 함수라면 허용 문자, 연속 구분자 축약, 빈 결과와 중복 충돌 규칙을 더 정해야 한다.
- project_context: 노드 페이지 파일명, URL slug, 산출물 이름 만들기에 연결된다.

## PY18_L06_from_import_001
- level: 6
- file: python_project_structure_imports_v18.json
- title: from import 읽기
- question_type: meaning_choice
- concepts: ["import","print","from_import","pathlib","module"]
- reading_goal: 모듈 안의 특정 이름만 가져오는 코드를 읽는다.
- code:
```python
from pathlib import Path

root = Path("data")
print(root.exists())
```
- question: from pathlib import Path의 의미는?
- answer: pathlib 모듈에서 Path만 바로 쓰도록 가져온다
- explanation: from import를 쓰면 pathlib.Path가 아니라 Path로 바로 사용할 수 있다. from import는 모듈 전체가 아니라 특정 이름만 가져오는 문법이다. 어떤 함수나 클래스가 현재 파일의 이름공간에 들어오는지 확인해야 한다.
- project_context: 파일 경로를 다루는 코드에서 매우 자주 보이는 패턴이다.

## PY18_L06_import_basic_001
- level: 6
- file: python_project_structure_imports_v18.json
- title: import 기본 읽기
- question_type: meaning_choice
- concepts: ["print","import","module","namespace"]
- reading_goal: 모듈을 import한 뒤 점 표기법으로 함수에 접근하는 구조를 읽는다.
- code:
```python
import json

text = json.dumps({"ok": True})
print(text)
```
- question: json.dumps를 쓸 수 있는 이유는?
- answer: import json으로 json 모듈을 가져왔기 때문에
- explanation: import json을 하면 json.dumps처럼 모듈명.함수명 형태로 접근한다. import는 다른 파일이나 라이브러리의 기능을 현재 코드에서 쓰겠다는 뜻이다. 어디서 가져오는지와 실제로 어떤 이름을 쓰는지 연결해서 읽어야 한다.
- project_context: 표준 라이브러리와 외부 라이브러리 호출 코드를 읽는 기본이다.

## PY18_L06_project_tree_001
- level: 6
- file: python_project_structure_imports_v18.json
- title: Python 프로젝트 폴더 구조 읽기
- question_type: meaning_choice
- concepts: ["project_structure","src","scripts","tests"]
- reading_goal: src, scripts, tests 폴더의 역할을 구분한다.
- code:
```python
project/
  src/
    app/
      pipeline.py
  scripts/
    run_pipeline.py
  tests/
    test_pipeline.py
```
- question: 일반적으로 tests 폴더의 역할은?
- answer: 코드가 맞게 동작하는지 검사하는 테스트 파일을 둔다
- explanation: project tree는 폴더와 파일의 역할을 한눈에 보여 주는 구조다. tests 폴더에는 pytest 같은 도구로 실행할 검증 코드가 들어간다. 테스트 코드를 실제 앱 코드와 분리해 두면 구조가 명확해지고 자동 검증도 실행하기 쉽다.
- project_context: 처음 보는 Python 프로젝트에서 src, scripts, tests의 역할을 먼저 파악하는 훈련이다.

## PY51_L06_beforeinstallprompt_001
- level: 6
- file: python_pwa_install_update_ux_v51.json
- title: beforeinstallprompt 이벤트 읽기
- question_type: meaning_choice
- concepts: ["beforeinstallprompt","PWA_install","browser_event"]
- reading_goal: 브라우저가 PWA 설치 가능 시점을 알려주는 beforeinstallprompt 이벤트를 이해한다.
- code:
```python
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault()
  deferredPrompt = event
})
```
- question: beforeinstallprompt 이벤트의 역할은?
- answer: 브라우저의 기본 설치 안내를 잠시 보류하고 나중에 직접 보여줄 수 있게 한다
- explanation: beforeinstallprompt는 일부 Chromium 계열 browser가 설치 가능 시 보내는 비표준 event다. preventDefault로 즉시 prompt를 보류하고 event를 저장해 사용자 gesture에서 prompt()를 호출할 수 있다. 지원되지 않는 browser에는 platform별 안내나 설치 버튼 숨김 fallback이 필요하다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY51_L06_install_prompt_001
- level: 6
- file: python_pwa_install_update_ux_v51.json
- title: install prompt 읽기
- question_type: meaning_choice
- concepts: ["install_prompt","PWA","user_prompt"]
- reading_goal: PWA를 설치할 수 있음을 사용자에게 알려주는 설치 안내를 이해한다.
- code:
```python
showInstallButton()
button.textContent = '앱 설치하기'
```
- question: install prompt의 목적은?
- answer: 사용자에게 앱 설치 가능 상태를 알려주기 위해
- explanation: install 안내는 browser가 설치 가능 조건을 충족했다고 알려 주거나 platform별 설치 절차가 있을 때만 보여 준다. 모든 browser가 같은 prompt API를 지원하지 않으며 이미 설치됐거나 설치를 원치 않는 사용자에게 반복 노출하지 않는다. 설치는 사용자 선택이고 사용 전제 조건이 되어서는 안 된다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY132_L06_PORT_IN_USE_TROUBLE_001
- level: 6
- file: python_readme_setup_troubleshooting_v132_a1.json
- title: 포트 사용 중 오류
- question_type: multiple_choice
- concepts: ["comment","port","local server","http.server","troubleshooting"]
- reading_goal: 포트 사용 중 오류가 이미 실행 중인 서버나 포트 충돌과 관련됨을 이해한다.
- code:
```python
python -m http.server 5173
# OSError: [Errno 98] Address already in use
```
- question: 로컬 서버 실행 중 Address already in use 또는 포트 사용 중 오류가 나면 README에 어떤 안내가 있으면 좋은가?
- answer: 이미 켜진 서버를 끄거나 다른 포트로 실행하라고 안내한다
- explanation: 포트 사용 중 오류는 같은 포트를 이미 다른 프로세스가 쓰고 있다는 뜻이다. 기존 서버를 종료하거나 5174처럼 다른 포트로 실행하면 된다.
- project_context: 

## PY132_L06_README_CHECKLIST_001
- level: 6
- file: python_readme_setup_troubleshooting_v132_a1.json
- title: README 실행 체크리스트
- question_type: multiple_choice
- concepts: ["README checklist","setup","environment variables","run","troubleshooting"]
- reading_goal: 초보자용 README에는 준비물부터 오류 해결까지 실행 흐름 전체가 들어가야 함을 이해한다.
- code:
```python
1. Prerequisites
2. Setup
3. Environment variables
4. Run
5. Verify
6. Troubleshooting
```
- question: 초보자용 README 실행 안내에 포함되면 좋은 묶음으로 가장 알맞은 것은?
- answer: Python 버전, 설치 순서, 환경변수 예시, 실행/확인/오류 해결
- explanation: 좋은 README는 처음 보는 사람이 따라 할 수 있어야 한다. 준비물, 설치 순서, 환경변수 예시, 실행 명령, 확인 명령, 자주 나는 오류 해결을 함께 적으면 좋다.
- project_context: 

## PY8_L06_favicon_404_001
- level: 6
- file: python_realworld_expansion_v8.json
- title: favicon 404 구분하기
- question_type: meaning_choice
- concepts: ["http","404","favicon"]
- reading_goal: favicon.ico 404가 앱 전체 실패와 다를 수 있음을 읽는다.
- code:
```python
::1 - - [28/May/2026 22:29:11] code 404, message File not found
::1 - - [28/May/2026 22:29:11] "GET /favicon.ico HTTP/1.1" 404 -
```
- question: 이 로그만으로 앱이 깨졌다고 볼 수 있나?
- answer: 아니다, favicon만 없을 수 있다
- explanation: 이 두 줄은 /favicon.ico 요청이 404였다는 사실만 보여 준다. 브라우저가 사이트 아이콘을 자동 요청했지만 파일이 없었을 수 있으므로, 이 로그만으로 HTML·JavaScript·데이터 로딩까지 실패했다고 결론낼 수 없다. 실제 장애 여부는 실패한 요청 경로와 앱 화면·콘솔의 다른 오류를 함께 확인해야 한다. favicon이 필요한 제품이라면 아이콘 누락 자체는 별도로 고쳐야 한다.
- project_context: 로컬 확인 로그에서 무시해도 되는 404와 치명 오류를 구분한다.

## PY8_L06_git_crlf_warning_001
- level: 6
- file: python_realworld_expansion_v8.json
- title: Git CRLF 경고 읽기
- question_type: meaning_choice
- concepts: ["git","crlf","warning"]
- reading_goal: 줄바꿈 형식 변환 경고를 치명적 오류와 구분한다.
- code:
```python
warning: in the working copy of 'src/pwa/app.js', LF will be replaced by CRLF
```
- question: 이 메시지는 보통 무엇인가?
- answer: 줄바꿈 변환 경고
- explanation: Git이 이 작업 트리 파일의 LF 줄바꿈을 CRLF로 변환할 수 있다고 알리는 경고다. 변환 여부는 .gitattributes와 core.autocrlf·core.eol 같은 설정에 영향을 받으므로 Windows라는 사실만으로 결정되지는 않는다. 이 문장 자체는 commit이나 push 실패를 뜻하지 않지만, 의도하지 않은 줄바꿈 diff를 막으려면 저장소의 줄바꿈 정책과 실제 변경 내용을 확인해야 한다.
- project_context: PowerShell에서 Git을 사용할 때 볼 수 있는 줄바꿈 경고를 해석한다.

## PY8_L06_git_push_flow_001
- level: 6
- file: python_realworld_expansion_v8.json
- title: Git push 흐름 읽기
- question_type: meaning_choice
- concepts: ["git","commit","push"]
- reading_goal: 수정 확인, 스테이징, 커밋, 원격 반영 순서를 읽는다.
- code:
```python
Set-Location "D:\projects\python-reading-trainer"
git status
git add src/pwa/app.js
git commit -m "Update app"
git push
```
- question: git add 다음에 보통 하는 일은?
- answer: git commit
- explanation: 표시된 순서에서는 status로 상태를 본 뒤 git add가 app.js의 현재 변경을 스테이징 영역에 올리고, git commit이 스테이징된 내용만 로컬 커밋으로 기록한다. 마지막 git push는 설정된 원격·업스트림으로 관련 ref를 전송한다. 스테이징하지 않은 변경은 그 커밋에 포함되지 않으며, 충돌·권한·원격 설정 문제 등이 있으면 commit이나 push는 별도로 실패할 수 있다.
- project_context: 지금 앱을 GitHub Pages에 반영하는 기본 루틴이다.

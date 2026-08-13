# V356 semantic review — Level 5 chunk 2

Cards 21-40 of 110.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY4_L05_raise_001
- level: 5
- file: python_deep_expansion_v4.json
- title: raise로 직접 에러 내기
- question_type: meaning_choice
- concepts: ["if","raise","error","validation"]
- reading_goal: 조건이 맞지 않으면 의도적으로 에러를 발생시키는 코드를 읽는다.
- code:
```python
score = -1
if score < 0:
    raise ValueError("score must be non-negative")
```
- question: 이 코드는 왜 raise를 쓰는가?
- answer: 잘못된 score를 막기 위해
- explanation: score가 0보다 작으므로 조건이 참이고 raise가 ValueError를 즉시 발생시킨다. 오류 메시지도 조건과 맞게 score는 0 이상이어야 한다고 설명한다. raise 이후의 정상 흐름은 실행되지 않으므로 잘못된 점수가 뒤 단계로 전달되는 것을 막는다. 이 예외를 어디에서 잡을지는 호출부에서 별도로 정해야 한다.
- project_context: 데이터 품질 검증과 안전한 파이프라인에서 중요하다.

## PY113_L05_GIT_ADD_COMMIT_PUSH_001
- level: 5
- file: python_dev_environment_practical_v113_a1.json
- title: git add commit push 흐름
- question_type: multiple_choice
- concepts: ["git","add","commit","push","github"]
- reading_goal: Git 변경을 확인하고 담고 기록한 뒤 원격 저장소에 올리는 순서를 읽는다.
- code:
```python
git add src/pwa/app.js
git commit -m "Fix layout"
git push origin main
```
- question: 가장 알맞은 설명은?
- answer: add로 담고 commit으로 기록한 뒤 push
- explanation: Git의 기본 흐름은 확인(status) → 담기(add) → 기록(commit) → 업로드(push)다. add는 기록 후보를 고르고 commit은 로컬 기록을 만든다. 따라서 정답은 ‘add로 담고 commit으로 기록한 뒤 push’이다.
- project_context: 매번 검증 후 commit/tag/push하는 현재 작업 방식과 직접 연결된다.

## PY113_L05_GIT_CLONE_PULL_001
- level: 5
- file: python_dev_environment_practical_v113_a1.json
- title: clone과 pull 구분
- question_type: multiple_choice
- concepts: ["git","clone","pull","github"]
- reading_goal: Git에서 처음 복사하는 clone과 기존 저장소를 최신화하는 pull의 차이를 읽는다.
- code:
```python
git clone https://github.com/user/repo.git
git pull origin main
```
- question: clone과 pull의 차이는?
- answer: clone은 처음 복사, pull은 최신화
- explanation: clone은 원격 저장소를 새 로컬 저장소로 처음 복제한다. 이미 복제한 저장소에서 git pull origin main을 실행하면 origin의 main을 가져온 뒤 현재 체크아웃한 브랜치에 통합한다. 따라서 pull은 단순 다운로드가 아니며 충돌이 날 수도 있다.
- project_context: PC를 바꾸거나 서버에서 프로젝트를 받을 때 clone/pull을 구분해야 한다.

## PY113_L05_GIT_STATUS_001
- level: 5
- file: python_dev_environment_practical_v113_a1.json
- title: git status 읽기
- question_type: multiple_choice
- concepts: ["git","git status","tracked file","untracked file"]
- reading_goal: git status가 수정 파일과 새 파일을 구분해 보여 주는 명령임을 읽는다.
- code:
```python
git status --short
 M src/pwa/app.js
?? tmp_check.py
```
- question: 위 출력에서 알 수 있는 것은?
- answer: app.js는 수정, tmp_check.py는 새 파일
- explanation: git status --short에서 M은 수정된 파일을 뜻하고, ??는 Git이 아직 추적하지 않는 새 파일을 뜻한다. 커밋 전 변경 확인에 쓴다.
- project_context: 패치 후 임시파일을 지우고 실제 변경 파일만 commit하는 흐름과 연결된다.

## PY113_L05_PYTHON_M_PIP_001
- level: 5
- file: python_dev_environment_practical_v113_a1.json
- title: python -m pip 의미
- question_type: multiple_choice
- concepts: ["pip","python -m","venv"]
- reading_goal: python -m pip가 현재 Python 환경의 pip를 실행한다는 것을 읽는다.
- code:
```python
python -m pip install pandas
```
- question: python -m pip를 쓰는 장점은?
- answer: 현재 Python 환경의 pip를 실행한다
- explanation: 여러 Python/가상환경이 있을 때 pip가 어느 환경에 설치하는지 헷갈릴 수 있다. python -m pip는 현재 Python 기준으로 pip를 실행한다.
- project_context: 가상환경을 켠 뒤 python -m pip를 쓰면 패키지 설치 위치를 더 명확히 할 수 있다.

## PY113_L05_REQUIREMENTS_001
- level: 5
- file: python_dev_environment_practical_v113_a1.json
- title: requirements.txt 읽기
- question_type: multiple_choice
- concepts: ["requirements.txt","pip","dependency"]
- reading_goal: requirements.txt가 프로젝트 패키지 설치 목록임을 읽는다.
- code:
```python
python -m pip install -r requirements.txt
```
- question: 이 명령의 목적은?
- answer: 파일 목록대로 Python 패키지 설치
- explanation: -r은 requirements.txt를 읽어 그 안의 패키지를 현재 Python 환경에 설치하라는 뜻이다. 버전을 고정한 항목은 더 비슷하게 맞출 수 있지만, Python·운영체제와 모든 간접 의존성까지 고정하지 않으면 완전히 같은 환경을 보장하지는 않는다.
- project_context: 다른 PC에서 같은 프로젝트를 실행할 때 가장 자주 쓰는 명령 중 하나다.

## PY130_L05_API_KEY_NOT_IN_CODE_001
- level: 5
- file: python_env_secret_config_beginner_v130_a1.json
- title: API Key를 코드에 쓰지 않기
- question_type: multiple_choice
- concepts: ["if","import","API key","secret","environment variable","security"]
- reading_goal: API Key를 코드에 직접 쓰지 않고 환경변수로 분리해야 하는 보안 이유를 이해한다.
- code:
```python
import os

api_key = os.environ.get('OPENAI_API_KEY')
if not api_key:
    raise SystemExit('OPENAI_API_KEY가 설정되지 않았습니다')
```
- question: API Key를 코드에 직접 적지 않는 이유로 가장 알맞은 것은?
- answer: 비밀값이 GitHub나 공유 파일에 노출될 수 있기 때문에
- explanation: API Key 같은 비밀값을 코드에 직접 쓰면 커밋, 공유, 캡처 과정에서 노출될 수 있다. 보통 환경변수나 서버의 비밀 저장소에서 읽는다.
- project_context: 

## PY130_L05_DOTENV_FILE_CONCEPT_001
- level: 5
- file: python_env_secret_config_beginner_v130_a1.json
- title: .env 파일 개념
- question_type: multiple_choice
- concepts: ["comment",".env","local config","environment variable","gitignore"]
- reading_goal: .env 파일이 로컬 설정값을 담는 파일이며 공유에 주의해야 함을 이해한다.
- code:
```python
# .env 예시
APP_MODE=dev
API_BASE_URL=http://localhost:8000
# 실제 API Key는 공유하지 않는다
```
- question: .env 파일의 일반적인 역할로 가장 알맞은 것은?
- answer: 로컬 개발용 환경변수 값을 적어 두는 파일
- explanation: .env는 로컬 개발에서 환경변수 값을 편하게 관리하기 위해 자주 쓰인다. 단, 비밀값이 들어갈 수 있으므로 보통 Git에 올리지 않는다.
- project_context: 

## PY130_L05_ENV_VAR_CONCEPT_001
- level: 5
- file: python_env_secret_config_beginner_v130_a1.json
- title: 환경변수 개념 이해하기
- question_type: multiple_choice
- concepts: ["import","print","environment variable","os.environ","configuration","runtime"]
- reading_goal: 환경변수가 코드 밖에서 설정값을 전달하고 실행 환경마다 값을 바꾸게 해 주는 방식을 이해한다.
- code:
```python
import os

mode = os.environ.get('APP_MODE', 'dev')
print(mode)
```
- question: 환경변수를 사용하는 대표적인 이유로 가장 알맞은 것은?
- answer: 코드 밖에서 실행 설정값을 바꿀 수 있게 하기 위해
- explanation: 환경변수는 코드 안에 값을 고정하지 않고 실행 환경에서 설정값을 주입하는 방법이다. 개발, 테스트, 배포 환경마다 값을 다르게 둘 수 있다.
- project_context: 

## PY130_L05_GITIGNORE_ENV_001
- level: 5
- file: python_env_secret_config_beginner_v130_a1.json
- title: .env를 .gitignore에 넣기
- question_type: multiple_choice
- concepts: ["comment",".gitignore",".env","secret","Git"]
- reading_goal: .env를 Git에 올리지 않도록 .gitignore에 등록하는 이유를 이해한다.
- code:
```python
# .gitignore
.env
.env.local
__pycache__/
```
- question: .gitignore에 .env를 넣는 이유로 알맞은 것은?
- answer: 로컬 비밀값 파일이 Git에 올라가지 않게 하기 위해
- explanation: .gitignore는 아직 추적하지 않은 .env가 새로 커밋되는 위험을 줄인다. 이미 커밋된 파일이나 과거 기록을 지우지는 않으므로, 비밀이 올라갔다면 추적을 중단하는 것과 별개로 키를 즉시 폐기·교체해야 한다.
- project_context: 

## PY130_L05_LOAD_DOTENV_001
- level: 5
- file: python_env_secret_config_beginner_v130_a1.json
- title: load_dotenv 흐름 읽기
- question_type: multiple_choice
- concepts: ["import","python-dotenv","load_dotenv",".env","os.environ"]
- reading_goal: load_dotenv가 .env 값을 환경변수처럼 읽게 해 주는 역할임을 이해한다.
- code:
```python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.environ.get('OPENAI_API_KEY')
```
- question: python-dotenv의 load_dotenv()를 사용하는 이유로 알맞은 것은?
- answer: .env 파일 값을 환경변수처럼 읽을 수 있게 하기 위해
- explanation: load_dotenv()는 .env의 이름·값을 읽어 os.environ.get()으로 접근하게 한다. 기본 설정은 이미 프로세스에 존재하는 같은 이름의 환경변수를 덮어쓰지 않으므로 배포 환경의 값을 로컬 파일보다 우선할 수 있다.
- project_context: 

## PY130_L05_OS_ENVIRON_GET_001
- level: 5
- file: python_env_secret_config_beginner_v130_a1.json
- title: os.environ.get으로 값 읽기
- question_type: multiple_choice
- concepts: ["import","print","os.environ.get","default value","environment variable","config"]
- reading_goal: os.environ.get의 기본값 인자가 어떤 상황에서 쓰이는지 이해한다.
- code:
```python
import os

base_url = os.environ.get('API_BASE_URL', 'http://localhost')
print(base_url)
```
- question: 다음 코드에서 os.environ.get('API_BASE_URL', 'http://localhost')의 의미로 알맞은 것은?
- answer: 환경변수가 없으면 기본값을 사용한다
- explanation: os.environ.get(name, default)는 환경변수가 있으면 그 값을 읽고, 없으면 default 값을 돌려준다. 선택 설정값을 읽을 때 자주 쓰인다.
- project_context: 

## PY117_L05_FINALLY_CLEANUP_001
- level: 5
- file: python_exception_traceback_beginner_v117_a1.json
- title: finally와 정리 작업
- question_type: multiple_choice
- concepts: ["try_except","finally","file close","cleanup"]
- reading_goal: finally가 파일 닫기나 임시 상태 정리 같은 마무리 작업에 쓰일 수 있음을 읽는다.
- code:
```python
file = open('data.txt')
try:
    text = file.read()
finally:
    file.close()
```
- question: finally에서 file.close()를 두는 이유로 알맞은 것은?
- answer: 마지막에 파일을 정리하기 위해
- explanation: finally에 close()를 두면 read()가 실패해도 열린 파일을 닫는다. 파일 작업에서는 같은 보장을 더 간단히 표현하는 with open(...) as file 문을 보통 우선 사용한다.
- project_context: 실제 파일 처리에서 자원 정리 흐름을 이해하는 데 도움이 된다.

## PY117_L05_FINALLY_RUNS_001
- level: 5
- file: python_exception_traceback_beginner_v117_a1.json
- title: finally 실행 흐름
- question_type: multiple_choice
- concepts: ["try_except","print","finally","try","except","cleanup"]
- reading_goal: finally 블록은 에러 발생 여부와 관계없이 마지막에 실행될 수 있음을 읽는다.
- code:
```python
try:
    x = int('abc')
except ValueError:
    print('bad value')
finally:
    print('done')
```
- question: finally 블록의 print('done')은 언제 실행되는가?
- answer: 에러 처리 흐름 뒤 마지막에 실행된다
- explanation: 이 예시에서는 int 변환이 실패해 except가 'bad value'를 출력한 뒤 finally가 'done'을 출력한다. finally는 정상 종료, 처리된 예외, return 같은 일반적인 제어 이동에서도 실행되지만 프로세스가 강제 종료되는 모든 상황까지 보장한다는 뜻은 아니다.
- project_context: 파일, 네트워크, 임시 상태를 다루는 코드에서 정리 흐름을 읽기 위한 카드다.

## PY117_L05_RAISE_BASIC_001
- level: 5
- file: python_exception_traceback_beginner_v117_a1.json
- title: raise 기본 읽기
- question_type: multiple_choice
- concepts: ["if","def","function","return","raise","ValueError","input validation"]
- reading_goal: raise가 의도적으로 예외를 발생시켜 잘못된 흐름을 막는 문법임을 읽는다.
- code:
```python
def set_age(age):
    if age < 0:
        raise ValueError('age must be non-negative')
    return age
```
- question: raise ValueError의 역할로 알맞은 것은?
- answer: 잘못된 입력이면 예외를 발생시킨다
- explanation: raise는 허용하지 않는 상태를 예외로 알리고 현재 함수의 정상 흐름을 중단한다. 조건은 age < 0이므로 0은 허용되며, 메시지도 '0 이상(non-negative)'이라고 써야 조건과 맞는다.
- project_context: 입력 검증 함수에서 잘못된 값을 어떻게 처리할지 읽는 데 필요하다.

## PY117_L05_RAISE_MESSAGE_001
- level: 5
- file: python_exception_traceback_beginner_v117_a1.json
- title: raise 메시지 읽기
- question_type: multiple_choice
- concepts: ["raise","error message","validation"]
- reading_goal: raise에 붙은 메시지는 무엇이 잘못됐는지 설명하는 힌트임을 이해한다.
- code:
```python
raise ValueError('score must be between 0 and 100')
```
- question: 이 메시지가 알려 주는 내용은?
- answer: score는 0에서 100 사이여야 한다
- explanation: 예외 메시지는 사람이 원인을 알 수 있게 돕는다. 여기서는 score의 허용 범위가 0부터 100까지라는 조건을 알려 준다. 조건 위반 위치를 빠르게 좁히는 단서가 된다. 따라서 정답은 ‘score는 0에서 100 사이여야 한다’이다.
- project_context: 사용자 입력이나 점수 계산 코드에서 에러 메시지를 해석하는 연습이다.

## PY128_L05_CSV_KEY_ERROR_001
- level: 5
- file: python_file_cli_error_recovery_v128_a1.json
- title: CSV 컬럼 KeyError 이해하기
- question_type: multiple_choice
- concepts: ["try_except","print","KeyError","csv.DictReader","CSV column","dict key"]
- reading_goal: CSV 컬럼명이 dict key처럼 쓰이고, 없는 컬럼 접근이 KeyError로 이어짐을 이해한다.
- code:
```python
row = {'name': 'A'}
try:
    score = row['score']
except KeyError:
    print('score 컬럼이 없습니다')
```
- question: csv.DictReader로 읽은 row에서 row['score']를 읽을 때 KeyError가 나는 대표적인 경우는?
- answer: 없는 컬럼 이름으로 row를 읽을 때
- explanation: DictReader의 row는 컬럼명을 key로 쓰는 dict처럼 동작한다. CSV에 score 컬럼이 없는데 row['score']를 읽으면 KeyError가 날 수 있다.
- project_context: 

## PY128_L05_FILE_NOT_FOUND_001
- level: 5
- file: python_file_cli_error_recovery_v128_a1.json
- title: 파일 없음 오류 처리하기
- question_type: multiple_choice
- concepts: ["try_except","import","FileNotFoundError","Path.read_text","SystemExit","CLI error"]
- reading_goal: 파일이 없을 때 traceback 대신 쉬운 CLI 메시지로 멈추는 이유를 이해한다.
- code:
```python
from pathlib import Path

input_path = Path('missing.txt')
try:
    text = input_path.read_text(encoding='utf-8')
except FileNotFoundError:
    raise SystemExit('입력 파일이 없습니다')
```
- question: 다음 코드에서 FileNotFoundError를 잡는 이유로 알맞은 것은?

try:
    text = input_path.read_text(encoding='utf-8')
except FileNotFoundError:
    raise SystemExit('입력 파일이 없습니다')
- answer: 파일이 없을 때 친절하게 멈추기 위해
- explanation: 입력 파일이 없으면 read_text()에서 FileNotFoundError가 날 수 있다. 이때 쉬운 메시지로 종료하면 긴 traceback보다 사용자가 문제를 이해하기 쉽다. 따라서 정답은 ‘파일이 없을 때 친절하게 멈추기 위해’이다.
- project_context: 

## PY128_L05_JSON_DECODE_ERROR_001
- level: 5
- file: python_file_cli_error_recovery_v128_a1.json
- title: JSONDecodeError 읽기
- question_type: multiple_choice
- concepts: ["try_except","import","print","json.JSONDecodeError","json.loads","JSON syntax","try except"]
- reading_goal: JSON 파싱 실패가 문법 오류에서 올 수 있음을 이해하고 오류를 잡는 흐름을 읽는다.
- code:
```python
import json

text = '{bad json}'
try:
    data = json.loads(text)
except json.JSONDecodeError as e:
    print('JSON 형식 오류:', e)
```
- question: json.loads(text)를 실행할 때 json.JSONDecodeError가 나는 대표적인 이유는?
- answer: JSON 문법이 깨졌을 때 나는 오류
- explanation: JSONDecodeError는 JSON 문자열 문법이 올바르지 않을 때 난다. CLI에서는 이 오류를 잡아 사용자가 입력 파일 형식을 확인하도록 알려 주면 좋다.
- project_context: 

## PY128_L05_VALUE_ERROR_INT_001
- level: 5
- file: python_file_cli_error_recovery_v128_a1.json
- title: ValueError로 숫자 변환 실패 읽기
- question_type: multiple_choice
- concepts: ["try_except","print","ValueError","int","type conversion","CLI option"]
- reading_goal: CLI 입력값을 숫자로 바꾸는 과정에서 ValueError가 생길 수 있음을 이해한다.
- code:
```python
try:
    count = int('abc')
except ValueError:
    print('숫자로 바꿀 수 없습니다')
```
- question: 다음 코드에서 ValueError가 날 수 있는 경우로 알맞은 것은?

count = int(args.count)
- answer: 문자열을 int로 바꿀 수 없을 때
- explanation: int('abc')처럼 숫자가 아닌 문자열을 정수로 바꾸려 하면 ValueError가 난다. CLI에서는 숫자 옵션을 받을 때 이런 실패를 고려해야 한다. 따라서 출력은 ‘문자열을 int로 바꿀 수 없을 때’이다.
- project_context:

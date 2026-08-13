# V356 semantic review — Level 5 chunk 5

Cards 81-100 of 110.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY122_L05_TO_CSV_INDEX_FALSE_001
- level: 5
- file: python_pandas_beginner_v122_a1.json
- title: to_csv와 index=False 읽기
- question_type: multiple_choice
- concepts: ["to_csv","index=False","CSV"]
- reading_goal: df.to_csv(..., index=False)가 DataFrame을 CSV로 저장하되 인덱스 열을 저장하지 않는 패턴임을 읽는다.
- code:
```python
passed.to_csv('passed.csv', index=False)
```
- question: index=False를 넣는 이유로 알맞은 것은?
- answer: DataFrame의 인덱스를 CSV 열로 쓰지 않기 위해
- explanation: to_csv()는 기본적으로 행 라벨인 인덱스도 함께 쓴다. index=False는 그 인덱스를 출력하지 않는다는 뜻이다. 의미 있는 식별자를 인덱스로 쓰고 있다면 버려도 되는지 먼저 확인한다.
- project_context: 가공한 pandas 결과를 깔끔한 CSV 파일로 저장하는 카드다.

## PY126_L05_ARGPARSE_PATH_INPUT_001
- level: 5
- file: python_pathlib_argparse_file_cli_v126_a1.json
- title: argparse 입력값을 Path로 바꾸기
- question_type: multiple_choice
- concepts: ["import","print","argparse","Path","pathlib","input path"]
- reading_goal: argparse로 받은 문자열 경로를 Path 객체로 바꾸는 이유를 이해한다.
- code:
```python
from pathlib import Path

input_path = Path(args.input)
print(input_path.name)
```
- question: 다음 코드에서 Path(args.input)을 쓰는 이유로 가장 알맞은 것은?

from pathlib import Path
input_path = Path(args.input)
- answer: 문자열 경로를 Path 객체로 바꿔 경로 기능을 쓰기 위해
- explanation: argparse로 받은 값은 보통 문자열이다. Path(args.input)으로 바꾸면 exists(), suffix, parent, read_text() 같은 경로 관련 기능을 읽기 쉽게 사용할 수 있다.
- project_context: 

## PY126_L05_OUTPUT_PARENT_MKDIR_001
- level: 5
- file: python_pathlib_argparse_file_cli_v126_a1.json
- title: 출력 폴더 먼저 만들기
- question_type: multiple_choice
- concepts: ["import","Path.parent","mkdir","parents=True","exist_ok=True"]
- reading_goal: 출력 파일을 저장하기 전에 부모 폴더를 만드는 이유를 이해한다.
- code:
```python
from pathlib import Path

output_path = Path('out/result.txt')
output_path.parent.mkdir(parents=True, exist_ok=True)
```
- question: 다음 코드가 필요한 이유로 가장 알맞은 것은?

output_path.parent.mkdir(parents=True, exist_ok=True)
- answer: 출력 파일의 부모 폴더가 없으면 미리 만들기 위해
- explanation: write_text()는 부모 폴더가 없으면 실패할 수 있다. output_path.parent.mkdir(parents=True, exist_ok=True)를 먼저 쓰면 중간 폴더까지 안전하게 만들 수 있다.
- project_context: 

## PY126_L05_PATH_EXISTS_CHECK_001
- level: 5
- file: python_pathlib_argparse_file_cli_v126_a1.json
- title: Path.exists로 입력 파일 확인하기
- question_type: multiple_choice
- concepts: ["if","import","Path.exists","input validation","file check","CLI error"]
- reading_goal: 파일 처리 CLI에서 입력 파일 존재 여부를 먼저 검사해야 하는 이유를 설명할 수 있다.
- code:
```python
from pathlib import Path

input_path = Path('data/input.txt')
if not input_path.exists():
    raise SystemExit('입력 파일이 없습니다')
```
- question: 작은 CLI 도구에서 input_path.exists()를 먼저 확인하는 이유는?
- answer: 파일이 없을 때 처리 단계로 넘어가지 않기 위해
- explanation: 사전 확인은 없는 입력에 대해 짧고 이해하기 쉬운 메시지를 보여 주는 데 도움이 된다. 다만 exists()는 디렉터리도 True이고 검사 뒤 상태가 바뀔 수 있으므로, 파일만 받는다면 is_file()을 확인하고 실제 read_text()의 FileNotFoundError·PermissionError도 처리한다.
- project_context: 

## PY126_L05_PATH_SUFFIX_CHECK_001
- level: 5
- file: python_pathlib_argparse_file_cli_v126_a1.json
- title: Path.suffix로 파일 확장자 읽기
- question_type: multiple_choice
- concepts: ["import","print","Path.suffix","file extension","pathlib","branching"]
- reading_goal: Path.suffix가 파일 확장자를 읽어 처리 분기 기준으로 쓰일 수 있음을 이해한다.
- code:
```python
from pathlib import Path

input_path = Path('report.csv')
print(input_path.suffix)  # .csv
```
- question: 다음 코드에서 input_path.suffix가 읽는 값으로 알맞은 것은?

input_path = Path('report.csv')
print(input_path.suffix)
- answer: .csv
- explanation: Path.suffix는 파일 이름의 확장자 부분을 돌려준다. report.csv라면 .csv가 나오므로, CSV와 JSON처럼 처리 방식을 나눌 때 사용할 수 있다.
- project_context: 

## PY126_L05_READ_TEXT_ENCODING_001
- level: 5
- file: python_pathlib_argparse_file_cli_v126_a1.json
- title: read_text로 텍스트 파일 읽기
- question_type: multiple_choice
- concepts: ["import","print","Path.read_text","encoding","utf-8","text file"]
- reading_goal: Path.read_text()와 encoding 인자가 텍스트 파일 읽기에서 어떤 역할을 하는지 이해한다.
- code:
```python
from pathlib import Path

input_path = Path('memo.txt')
text = input_path.read_text(encoding='utf-8')
print(text)
```
- question: 다음 코드의 역할로 가장 알맞은 것은?

text = input_path.read_text(encoding='utf-8')
- answer: 파일 내용을 utf-8 기준 문자열로 읽는다
- explanation: read_text()는 텍스트 파일 내용을 문자열로 읽는다. encoding='utf-8'을 명시하면 한글이 들어간 파일도 어떤 인코딩으로 읽는지 코드에서 더 분명해진다.
- project_context: 

## PY126_L05_WRITE_TEXT_OUTPUT_001
- level: 5
- file: python_pathlib_argparse_file_cli_v126_a1.json
- title: write_text로 결과 저장하기
- question_type: multiple_choice
- concepts: ["import","Path.write_text","output file","encoding","save result"]
- reading_goal: write_text()가 처리 결과 문자열을 출력 파일에 저장하는 단계임을 이해한다.
- code:
```python
from pathlib import Path

output_path = Path('out/result.txt')
result = '완료'
output_path.write_text(result, encoding='utf-8')
```
- question: 다음 코드에서 write_text()의 역할로 알맞은 것은?

output_path.write_text(result, encoding='utf-8')
- answer: 문자열 결과를 파일로 저장한다
- explanation: write_text()는 문자열을 텍스트 파일에 저장한다. 결과 문자열을 만든 뒤 output_path.write_text(result, encoding='utf-8')로 쓰면 작은 CLI 도구의 저장 단계가 된다.
- project_context: 

## PY2_L05_generator_001
- level: 5
- file: python_practical_expansion_v2.json
- title: generator 표현식 읽기
- question_type: output_prediction
- concepts: ["print","generator","sum","for"]
- reading_goal: 괄호 안 for 표현식이 값을 하나씩 만들어내는 구조임을 읽는다.
- code:
```python
scores = [10, 20, 30]
total = sum(score for score in scores)
print(total)
```
- question: 출력은?
- answer: 60
- explanation: generator는 값을 한꺼번에 만들지 않고 필요할 때 하나씩 생산한다. scores의 값을 차례로 sum에 넘기면 전체 합계 60을 계산할 수 있다. generator는 큰 데이터에서도 필요한 값만 순서대로 만들 수 있어 메모리 사용을 줄인다.
- project_context: 큰 데이터를 한꺼번에 리스트로 만들지 않고 처리하는 코드에서 generator를 볼 수 있다.

## PY2_L05_yield_001
- level: 5
- file: python_practical_expansion_v2.json
- title: yield 함수 읽기
- question_type: meaning_choice
- concepts: ["for","def","print","yield","generator","function"]
- reading_goal: yield가 값을 하나씩 내보내는 함수 구조임을 읽는다.
- code:
```python
def read_labels():
    yield "LiDAR"
    yield "Radar"

for label in read_labels():
    print(label)
```
- question: yield가 하는 일에 가까운 것은?
- answer: 값을 하나씩 내보낸다
- explanation: yield가 있는 함수를 호출하면 결과값 하나가 아니라 generator 객체가 만들어진다. for문이 다음 값을 요청하면 함수가 첫 yield까지 실행되어 LiDAR를 내보내고 그 자리에서 잠시 멈춘다. 다음 요청에는 그다음 줄부터 다시 실행되어 Radar를 내보낸다. 이처럼 상태를 유지하며 값을 하나씩 만들기 때문에 모든 결과를 한꺼번에 리스트로 만들 필요가 없다.
- project_context: 대량 파일을 스트리밍 처리할 때 yield 패턴이 쓰일 수 있다.

## PY132_L05_ENV_EXAMPLE_001
- level: 5
- file: python_readme_setup_troubleshooting_v132_a1.json
- title: .env.example 작성 이유
- question_type: multiple_choice
- concepts: ["comment",".env.example",".env","secret","environment variable"]
- reading_goal: .env.example이 실제 비밀값이 아니라 필요한 변수 이름을 안내하는 예시 파일임을 이해한다.
- code:
```python
# .env.example
OPENAI_API_KEY=your_key_here
APP_MODE=dev
```
- question: .env.example 파일을 README와 함께 제공하는 이유로 알맞은 것은?
- answer: 필요한 환경변수 이름만 예시로 알려 주기 위해
- explanation: .env.example은 실제 비밀값을 공개하지 않고 어떤 환경변수가 필요한지만 알려 주는 예시 파일이다. 사용자는 이를 복사해 자신의 .env를 만든다.
- project_context: 

## PY132_L05_MODULE_NOT_FOUND_TROUBLE_001
- level: 5
- file: python_readme_setup_troubleshooting_v132_a1.json
- title: ModuleNotFoundError 해결
- question_type: multiple_choice
- concepts: ["comment","ModuleNotFoundError","venv","requirements.txt","troubleshooting"]
- reading_goal: ModuleNotFoundError가 패키지 설치 환경 문제와 연결될 수 있음을 이해한다.
- code:
```python
ModuleNotFoundError: No module named 'dotenv'

# 확인
python -m pip install -r requirements.txt
```
- question: README의 Troubleshooting에 ModuleNotFoundError 해결법으로 가장 알맞은 것은?
- answer: 가상환경 활성화와 requirements 설치 여부를 확인한다
- explanation: 필요한 배포 패키지가 현재 Python 환경에 없을 때 흔히 나므로 먼저 실제 interpreter, venv, requirements 설치를 확인한다. 그래도 계속되면 import 이름 오타, 프로젝트 실행 위치, 같은 이름의 로컬 파일이 모듈을 가리는지도 확인한다.
- project_context: 

## PY132_L05_PREREQUISITES_001
- level: 5
- file: python_readme_setup_troubleshooting_v132_a1.json
- title: prerequisites 뜻
- question_type: multiple_choice
- concepts: ["comment","prerequisites","Python version","Git","terminal"]
- reading_goal: Prerequisites가 실행 전 필요한 도구와 조건을 적는 섹션임을 이해한다.
- code:
```python
## Prerequisites
- Python 3.11+
- Git
- PowerShell 또는 터미널
```
- question: README에서 Prerequisites 섹션에 들어가기 가장 알맞은 내용은?
- answer: 프로젝트 실행 전에 미리 필요한 도구
- explanation: Prerequisites는 프로젝트를 실행하기 전에 갖춰야 할 도구와 조건을 뜻한다. 예제의 Python 3.11+, Git, PowerShell 또는 터미널이 여기에 해당한다. 이 섹션은 설치 명령을 자세히 적는 Setup과 달리, 사용자가 시작 전에 준비 상태를 확인하게 한다. 실제 API key 값처럼 공개하면 안 되는 정보는 넣지 않는다.
- project_context: 

## PY132_L05_README_ROLE_001
- level: 5
- file: python_readme_setup_troubleshooting_v132_a1.json
- title: README 역할 이해하기
- question_type: multiple_choice
- concepts: ["comment","README","documentation","setup guide","project overview"]
- reading_goal: README가 프로젝트 설명과 실행 안내를 담는 첫 문서라는 점을 이해한다.
- code:
```python
# README.md

## 실행 방법
1. 가상환경 생성
2. 패키지 설치
3. 앱 실행
```
- question: 프로젝트 README.md의 가장 기본적인 역할로 알맞은 것은?
- answer: 프로젝트가 무엇이고 어떻게 실행하는지 안내한다
- explanation: README는 프로젝트의 첫 안내문이다. 무엇을 하는 프로젝트인지, 어떤 준비가 필요한지, 어떻게 실행하고 확인하는지 적어 둔다. 따라서 정답은 ‘프로젝트가 무엇이고 어떻게 실행하는지 안내한다’이다.
- project_context: 

## PY132_L05_RUN_COMMAND_001
- level: 5
- file: python_readme_setup_troubleshooting_v132_a1.json
- title: 실행 명령 구분하기
- question_type: multiple_choice
- concepts: ["comment","run command","verify command","README","pytest"]
- reading_goal: Run 명령과 Verify/Test 명령을 README에서 구분해 적는 이유를 이해한다.
- code:
```python
## Run
python app.py

## Verify
python -m pytest
```
- question: README의 Run 섹션에 들어가기 가장 알맞은 내용은?
- answer: 프로젝트를 실제로 실행하는 명령
- explanation: Run 섹션은 앱이나 스크립트를 어떻게 실행하는지 알려 준다. Verify나 Test 섹션은 실행 후 정상 동작을 확인하는 명령을 적는 곳이다.
- project_context: 

## PY132_L05_SETUP_STEPS_ORDER_001
- level: 5
- file: python_readme_setup_troubleshooting_v132_a1.json
- title: setup 순서 읽기
- question_type: multiple_choice
- concepts: ["git clone","cd","venv","requirements.txt","setup steps"]
- reading_goal: README의 setup steps가 실제 실행 준비 순서를 단계별로 안내해야 함을 이해한다.
- code:
```python
git clone <repo-url>
cd project
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```
- question: clone 후 Python 프로젝트 실행 준비 순서로 가장 자연스러운 것은?
- answer: clone, 폴더 이동, venv 생성, 활성화, 의존성 설치
- explanation: 다른 컴퓨터에서 프로젝트를 실행하려면 저장소를 받고, 폴더로 이동한 뒤, 가상환경을 만들고 활성화한 다음 requirements를 설치하는 흐름이 자연스럽다.
- project_context: 

## PY8_L05_cache_bust_query_001
- level: 5
- file: python_realworld_expansion_v8.json
- title: 쿼리스트링 캐시 우회 읽기
- question_type: meaning_choice
- concepts: ["browser","cache","querystring"]
- reading_goal: URL 뒤 _v 값을 바꿔 브라우저 캐시를 우회하는 의미를 읽는다.
- code:
```python
http://localhost:8787/src/pwa/index.html?_v=21
```
- question: ?_v=21의 주된 목적은?
- answer: 새 URL처럼 보여 캐시를 덜 타게 함
- explanation: 브라우저 캐시는 보통 쿼리스트링까지 포함한 URL을 캐시 키로 구분하므로 _v 값이 다른 index.html을 새 URL로 요청하게 할 수 있다. 그러나 이 예시는 index.html의 URL만 바꾼다. 문서가 불러오는 JSON·JS의 URL이 그대로라면 그 하위 파일의 캐시까지 자동으로 무효화하지는 않는다. 서비스 워커나 CDN이 쿼리를 무시하도록 구성된 경우도 있어, 확실한 갱신에는 자산 URL 버전과 캐시 정책을 함께 확인해야 한다.
- project_context: GitHub Pages나 로컬 서버에서 수정 반영 확인에 유용하다.

## PY124_L05_CAPTURE_GROUP_001
- level: 5
- file: python_regex_beginner_v124_a1.json
- title: 괄호 캡처 그룹 읽기
- question_type: multiple_choice
- concepts: ["if","print","capture group","group(1)","\\d"]
- reading_goal: 정규식의 괄호가 전체 매치 중 필요한 부분만 뽑는 캡처 그룹이 될 수 있음을 읽는다.
- code:
```python
m = re.search(r'ID-(\d+)', 'user ID-2048 ok')
if m:
    print(m.group(1))
```
- question: m.group(1)이 출력할 값으로 알맞은 것은?
- answer: 2048
- explanation: 괄호 (\d+)는 숫자 부분만 따로 잡는 캡처 그룹이다. group(1)은 첫 번째 캡처 그룹을 읽으므로 ID-2048 중 2048만 꺼낸다.
- project_context: 로그 문자열에서 ID 숫자만 분리해 쓰는 실전 흐름이다.

## PY124_L05_FINDALL_BASIC_001
- level: 5
- file: python_regex_beginner_v124_a1.json
- title: re.findall로 전부 찾기
- question_type: multiple_choice
- concepts: ["re.findall","list","\\d"]
- reading_goal: re.findall()이 패턴에 맞는 모든 값을 리스트로 모으는 함수임을 읽는다.
- code:
```python
text = 'A12 B34 C56'
nums = re.findall(r'\d+', text)
```
- question: nums의 값으로 가장 알맞은 것은?
- answer: ['12', '34', '56']
- explanation: findall()은 패턴에 맞는 모든 부분을 리스트로 돌려준다. r'\d+'는 연속된 숫자 묶음을 찾으므로 A12, B34, C56에서 숫자 세 개를 모두 뽑는다.
- project_context: 여러 숫자나 여러 코드 조각을 한 번에 추출하는 카드다.

## PY124_L05_GROUP_ZERO_001
- level: 5
- file: python_regex_beginner_v124_a1.json
- title: group(0)으로 전체 매치 읽기
- question_type: multiple_choice
- concepts: ["if","print","group","match object","re.search"]
- reading_goal: match.group(0)이 정규식에 실제로 매치된 전체 문자열을 돌려주는 표현임을 읽는다.
- code:
```python
m = re.search(r'ID-\d+', 'user ID-2048 ok')
if m:
    print(m.group(0))
```
- question: m.group(0)이 출력할 값으로 알맞은 것은?
- answer: ID-2048
- explanation: group(0)은 패턴 전체와 매치된 문자열을 돌려준다. 여기서는 ID- 다음 숫자가 붙은 ID-2048 전체가 정규식에 맞는 결과다.
- project_context: 정규식으로 찾은 결과에서 실제 매치 문자열을 꺼내는 카드다.

## PY124_L05_RAW_STRING_PATTERN_001
- level: 5
- file: python_regex_beginner_v124_a1.json
- title: raw string 패턴 읽기
- question_type: multiple_choice
- concepts: ["raw string","\\d","regex"]
- reading_goal: 정규식 패턴에서 r'\d+' 같은 raw string을 쓰면 백슬래시 패턴을 읽기 쉬워짐을 이해한다.
- code:
```python
pattern = r'\d+'
nums = re.findall(pattern, 'A12 B34')
```
- question: 정규식 패턴에 r'\d+'처럼 r을 붙이는 주된 이유로 알맞은 것은?
- answer: 백슬래시가 들어간 패턴을 덜 헷갈리게 쓰기 위해
- explanation: 정규식은 \d, \w, \s처럼 백슬래시를 자주 쓴다. raw string인 r'' 형태를 쓰면 Python 문자열 안에서 패턴을 더 읽기 쉽다. 따라서 정답은 ‘백슬래시가 들어간 패턴을 덜 헷갈리게 쓰기 위해’이다.
- project_context: 정규식 코드를 읽을 때 r'' 형태를 먼저 알아보는 카드다.

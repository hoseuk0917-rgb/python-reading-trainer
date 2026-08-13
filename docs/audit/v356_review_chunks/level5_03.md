# V356 semantic review — Level 5 chunk 3

Cards 41-60 of 110.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY118_L05_EXIST_OK_001
- level: 5
- file: python_file_exists_mkdir_beginner_v118_a1.json
- title: exist_ok 옵션 읽기
- question_type: multiple_choice
- concepts: ["mkdir","exist_ok=True","repeatable script"]
- reading_goal: exist_ok=True가 이미 있는 폴더 때문에 mkdir가 실패하지 않게 해 주는 옵션임을 읽는다.
- code:
```python
Path('output').mkdir(exist_ok=True)
```
- question: exist_ok=True의 역할로 알맞은 것은?
- answer: 이미 폴더가 있어도 에러를 내지 않게 한다
- explanation: exist_ok=True는 같은 경로에 디렉터리가 이미 있을 때 FileExistsError를 내지 않는다. 같은 경로에 일반 파일이 있거나 권한이 없으면 여전히 실패하므로 모든 오류를 무시하는 옵션은 아니다.
- project_context: 스크립트를 여러 번 실행해도 폴더 생성 단계에서 멈추지 않게 하는 카드다.

## PY118_L05_IS_FILE_IS_DIR_001
- level: 5
- file: python_file_exists_mkdir_beginner_v118_a1.json
- title: 파일인지 폴더인지 구분하기
- question_type: multiple_choice
- concepts: ["print","is_file","is_dir","Path.exists"]
- reading_goal: exists()가 True여도 파일과 폴더를 is_file(), is_dir()로 구분해야 함을 읽는다.
- code:
```python
path = Path('data')
print(path.exists())
print(path.is_file())
print(path.is_dir())
```
- question: is_file()과 is_dir()를 같이 보는 이유로 알맞은 것은?
- answer: 경로가 파일인지 폴더인지 구분하기 위해
- explanation: exists()는 존재 여부만 알려 준다. 그 경로가 파일인지 폴더인지에 따라 읽기, 쓰기, 목록 조회 방식이 달라진다. 예를 들어 폴더에는 read_text()를 바로 쓰기 어렵다.
- project_context: data 폴더와 data.txt 파일을 헷갈리는 초보 실수를 줄이는 카드다.

## PY118_L05_MKDIR_PARENTS_001
- level: 5
- file: python_file_exists_mkdir_beginner_v118_a1.json
- title: mkdir parents 옵션 읽기
- question_type: multiple_choice
- concepts: ["mkdir","parents=True","directory"]
- reading_goal: mkdir(parents=True, exist_ok=True)가 중간 폴더 생성과 중복 에러 방지에 쓰임을 읽는다.
- code:
```python
out_dir = Path('output/reports')
out_dir.mkdir(parents=True, exist_ok=True)
```
- question: parents=True의 의미로 알맞은 것은?
- answer: 중간 폴더까지 필요하면 만든다
- explanation: parents=True는 output 같은 중간 폴더가 없어도 함께 만들 수 있게 한다. nested output 경로에서 자주 쓰인다. 따라서 정답은 ‘중간 폴더까지 필요하면 만든다’이다.
- project_context: 결과물 저장 폴더를 자동 준비하는 기본 패턴이다.

## PY118_L05_PREVENT_OVERWRITE_001
- level: 5
- file: python_file_exists_mkdir_beginner_v118_a1.json
- title: 덮어쓰기 전 파일 존재 확인
- question_type: multiple_choice
- concepts: ["if","else","print","Path.exists","write_text","overwrite guard"]
- reading_goal: 출력 파일을 쓰기 전에 exists()로 이미 있는 파일인지 확인하는 패턴을 읽는다.
- code:
```python
out = Path('output/result.txt')
if out.exists():
    print('already exists')
else:
    out.write_text('ok', encoding='utf-8')
```
- question: 이 코드가 막으려는 실수는?
- answer: 기존 파일을 실수로 덮어쓰는 실수
- explanation: 이 코드는 검사 시점에 파일이 있으면 write_text()를 건너뛰어 흔한 덮어쓰기를 줄인다. 그러나 검사와 쓰기 사이에 다른 프로세스가 파일을 만들 수 있으므로 강한 보장이 필요하면 open('x', encoding='utf-8') 같은 배타적 생성 모드를 사용한다.
- project_context: 결과 파일이나 제출 파일을 실수로 덮어쓰지 않기 위한 카드다.

## PY10_L05_json_loads_001
- level: 5
- file: python_foundation_expansion_v10.json
- title: json.loads 문자열 파싱
- question_type: output_prediction
- concepts: ["import","print","json","json.loads","dict"]
- reading_goal: JSON 문자열을 dict로 바꾸는 코드를 읽는다.
- code:
```python
import json

text = '{"ok": true, "count": 2}'
data = json.loads(text)
print(data["count"])
```
- question: 출력은?
- answer: 2
- explanation: json.loads(text)는 JSON 문자열을 Python 값으로 파싱한다. 이 예제의 바깥 {}는 dict가 되고 JSON의 true는 Python의 True가 된다. count 키에는 정수 2가 들어 있으므로 data["count"]를 출력하면 2가 나온다. JSON 문법이 잘못되면 json.JSONDecodeError가 발생한다.
- project_context: API 응답 문자열이나 저장된 JSON을 읽는 데 필요하다.

## PY10_L05_try_except_fail_001
- level: 5
- file: python_foundation_expansion_v10.json
- title: try 실패 흐름 읽기
- question_type: output_prediction
- concepts: ["print","try_except","ValueError","fallback"]
- reading_goal: 에러가 나면 except의 기본값이 쓰이는 흐름을 읽는다.
- code:
```python
try:
    value = int("abc")
except ValueError:
    value = 0
print(value)
```
- question: 출력은?
- answer: 0
- explanation: int("abc")는 정수로 바꿀 수 없어 ValueError를 발생시킨다. 이 예외는 바로 아래 except ValueError가 잡으므로 value에 0을 대입한 뒤 실행이 계속되고, print(value)는 0을 출력한다. 이 except는 ValueError만 처리하며 다른 종류의 예외까지 모두 막는 것은 아니다.
- project_context: CSV/JSON 입력값이 예상과 다를 때 자주 쓰는 방어 패턴이다.

## PY10_L05_try_except_success_001
- level: 5
- file: python_foundation_expansion_v10.json
- title: try 성공 흐름 읽기
- question_type: output_prediction
- concepts: ["print","try_except","int","error"]
- reading_goal: 에러가 없으면 except로 가지 않는 흐름을 읽는다.
- code:
```python
try:
    value = int("10")
except ValueError:
    value = 0
print(value)
```
- question: 출력은?
- answer: 10
- explanation: try 블록의 코드가 성공하면 except 블록은 실행되지 않는다. int('10')은 숫자 변환에 성공하므로 정상 결과가 그대로 사용된다. 예외가 발생하지 않으면 except는 건너뛰므로 출력은 성공 경로의 값으로 판단해야 한다.
- project_context: 데이터 변환 코드에서 에러 경로와 정상 경로를 구분하는 기초다.

## PY10_L05_with_open_write_001
- level: 5
- file: python_foundation_expansion_v10.json
- title: with open 저장 읽기
- question_type: meaning_choice
- concepts: ["with","open","file","encoding"]
- reading_goal: with open으로 파일을 안전하게 열고 쓰는 코드를 읽는다.
- code:
```python
with open("log.txt", "w", encoding="utf-8") as f:
    f.write("done")
```
- question: 이 코드는 무엇을 하는가?
- answer: log.txt에 done을 저장한다
- explanation: open(..., "w")는 log.txt를 쓰기 모드로 연다. 파일이 없으면 만들고, 이미 있으면 기존 내용을 먼저 비운 뒤 f.write("done")이 문자열을 기록한다. with 블록을 벗어날 때 파일은 자동으로 닫힌다. 따라서 이 코드는 log.txt의 내용을 done으로 저장한다.
- project_context: 로그, 결과, 요약 저장 코드의 기본이다.

## PY114_L05_INIT_PY_001
- level: 5
- file: python_import_debug_beginner_v114_a1.json
- title: __init__.py 역할 읽기
- question_type: multiple_choice
- concepts: ["__init__.py","package","module","import"]
- reading_goal: __init__.py가 패키지 구조를 명확히 보여주는 표시라는 점을 읽는다.
- code:
```python
app/
  __init__.py
  helpers.py

from app.helpers import clean_text
```
- question: __init__.py가 있는 구조를 초보자에게 권하는 이유는?
- answer: 폴더를 패키지처럼 이해하기 쉬워진다
- explanation: __init__.py가 있으면 해당 폴더를 일반 패키지로 명시하고 패키지 초기화 코드나 공개 이름도 둘 수 있어 구조를 이해하기 쉽다. 현대 Python의 namespace package는 이 파일 없이도 가능하므로, 모든 패키지에 문법상 필수라는 뜻은 아니다.
- project_context: 서비스 코드가 폴더 단위로 나뉠 때 import 구조를 읽는 데 도움이 된다.

## PY114_L05_PROJECT_ROOT_IMPORT_001
- level: 5
- file: python_import_debug_beginner_v114_a1.json
- title: 프로젝트 루트에서 실행하기
- question_type: multiple_choice
- concepts: ["comment","project root","current directory","import","module"]
- reading_goal: 실행 위치가 import 가능 여부에 영향을 줄 수 있음을 읽는다.
- code:
```python
myapp/
  app/
    helpers.py
  main.py

# myapp에서 실행
python main.py
```
- question: 프로젝트 루트에서 실행하는 습관이 중요한 이유는?
- answer: import 기준 위치가 안정되기 때문에
- explanation: 프로젝트가 정한 루트에서 같은 명령을 실행하면 상대경로와 import 탐색 조건이 매번 같아져 동작을 예측하기 쉽다. 패키지 안 모듈은 루트에서 python -m app.module처럼 실행하는 편이 직접 파일 실행보다 import 관계를 안정적으로 유지한다.
- project_context: 검증 스크립트를 항상 프로젝트 폴더에서 실행하는 습관과 연결된다.

## PY114_L05_SHADOWING_FILE_001
- level: 5
- file: python_import_debug_beginner_v114_a1.json
- title: 파일명이 라이브러리를 가리는 경우
- question_type: multiple_choice
- concepts: ["print","shadowing","import","filename","requests"]
- reading_goal: 내 파일 이름이 외부 라이브러리 이름과 겹치면 import가 꼬일 수 있음을 읽는다.
- code:
```python
requests.py

import requests
print(requests.get)
```
- question: 이 구조의 위험은?
- answer: requests.py가 실제 requests 라이브러리를 가릴 수 있다
- explanation: 현재 폴더에 requests.py가 있으면 import requests가 설치한 requests 패키지보다 이 로컬 파일을 먼저 찾을 수 있다. 그러면 기대한 패키지 기능이 없거나 import가 꼬여 오류가 날 수 있다. 그래서 같은 이름의 파일을 피하고, 실제로 어느 파일이 import됐는지는 requests.__file__로 확인할 수 있다.
- project_context: 초보자가 json.py, requests.py, pandas.py 같은 파일명을 만들 때 자주 생기는 문제다.

## PY127_L05_CSV_DICTREADER_ROWS_001
- level: 5
- file: python_json_csv_cli_practice_v127_a1.json
- title: csv.DictReader로 행 읽기
- question_type: multiple_choice
- concepts: ["import","print","csv.DictReader","CSV","rows","dict"]
- reading_goal: DictReader 결과를 리스트로 만들어 CSV 행들을 다루는 흐름을 이해한다.
- code:
```python
import csv

with open('data.csv', newline='', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))
print(rows[0])
```
- question: csv.DictReader를 list로 감싸는 이유로 알맞은 것은?

rows = list(csv.DictReader(f))
- answer: CSV 각 행을 dict 형태의 리스트로 다루기 위해
- explanation: csv.DictReader는 CSV의 각 행을 컬럼명 기준 dict처럼 읽어 준다. list로 감싸면 여러 행을 리스트로 모아 반복, 필터, 요약에 사용할 수 있다.
- project_context: 

## PY127_L05_CSV_FIELDNAMES_001
- level: 5
- file: python_json_csv_cli_practice_v127_a1.json
- title: CSV 컬럼명 확인하기
- question_type: multiple_choice
- concepts: ["import","print","fieldnames","CSV header","DictReader","column"]
- reading_goal: CSV 헤더와 DictReader의 fieldnames가 연결되는 방식을 이해한다.
- code:
```python
import csv

with open('data.csv', newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    print(reader.fieldnames)
```
- question: DictReader에서 reader.fieldnames를 확인하는 이유로 알맞은 것은?
- answer: CSV에 어떤 컬럼이 있는지 확인하기 위해
- explanation: reader.fieldnames는 CSV의 헤더, 즉 컬럼명 목록을 보여 준다. 어떤 키로 row['name']처럼 접근할 수 있는지 확인할 때 유용하다.
- project_context: 

## PY127_L05_JSON_DUMPS_OUTPUT_001
- level: 5
- file: python_json_csv_cli_practice_v127_a1.json
- title: json.dumps로 결과 저장 문자열 만들기
- question_type: multiple_choice
- concepts: ["import","print","json.dumps","ensure_ascii","indent","JSON output"]
- reading_goal: json.dumps의 ensure_ascii=False와 indent가 결과 저장에 어떤 영향을 주는지 이해한다.
- code:
```python
import json

summary = {'메시지': '완료', 'rows': 3}
text = json.dumps(summary, ensure_ascii=False, indent=2)
print(text)
```
- question: 다음 코드에서 ensure_ascii=False를 쓰는 이유로 가장 알맞은 것은?

text = json.dumps(summary, ensure_ascii=False, indent=2)
- answer: 한글을 \uXXXX 형태가 아니라 그대로 저장하기 위해
- explanation: json.dumps()는 Python 데이터를 JSON 문자열로 바꾼다. ensure_ascii=False를 쓰면 한글을 이스케이프하지 않고 사람이 읽기 좋게 그대로 저장할 수 있다.
- project_context: 

## PY127_L05_JSON_LOADS_FROM_FILE_001
- level: 5
- file: python_json_csv_cli_practice_v127_a1.json
- title: read_text와 json.loads로 JSON 읽기
- question_type: multiple_choice
- concepts: ["import","json.loads","read_text","JSON","dict","list"]
- reading_goal: 텍스트로 읽은 JSON 문자열을 Python 데이터로 변환하는 흐름을 읽을 수 있다.
- code:
```python
import json
from pathlib import Path

input_path = Path('data.json')
text = input_path.read_text(encoding='utf-8')
data = json.loads(text)
```
- question: 다음 코드에서 json.loads(text)의 역할로 알맞은 것은?

text = input_path.read_text(encoding='utf-8')
data = json.loads(text)
- answer: JSON 문자열을 Python 데이터로 바꾼다
- explanation: read_text()는 파일 내용을 문자열로 읽고, json.loads()는 JSON 형식 문자열을 dict나 list 같은 Python 데이터로 바꾼다.
- project_context: 

## PY127_L05_SUFFIX_BRANCH_CSV_JSON_001
- level: 5
- file: python_json_csv_cli_practice_v127_a1.json
- title: 확장자로 JSON과 CSV 분기하기
- question_type: multiple_choice
- concepts: ["if","import","print","Path.suffix","JSON","CSV","branching"]
- reading_goal: Path.suffix로 파일 형식에 따라 처리 흐름을 나누는 이유를 이해한다.
- code:
```python
from pathlib import Path

input_path = Path(args.input)
if input_path.suffix == '.json':
    print('JSON 처리')
elif input_path.suffix == '.csv':
    print('CSV 처리')
```
- question: 입력 파일이 .json인지 .csv인지 나누어 처리하려면 가장 먼저 확인하기 좋은 값은?
- answer: input_path.suffix
- explanation: Path.suffix는 마지막 확장자를 돌려주므로 .json과 .csv 처리 함수를 고르는 첫 힌트가 된다. 대문자 확장자도 받으려면 suffix.lower()를 비교하고, 확장자는 내용의 유효성을 보장하지 않으므로 실제 파서 오류도 처리한다.
- project_context: 

## PY127_L05_SUMMARY_COUNT_COLUMNS_001
- level: 5
- file: python_json_csv_cli_practice_v127_a1.json
- title: 행 개수와 컬럼 요약 만들기
- question_type: multiple_choice
- concepts: ["print","summary","len","dict keys","CSV rows"]
- reading_goal: CSV나 JSON 데이터를 읽은 뒤 행 개수와 컬럼 목록을 요약하는 방법을 이해한다.
- code:
```python
rows = [{'name': 'A', 'score': '10'}, {'name': 'B', 'score': '20'}]
summary = {'rows': len(rows), 'columns': list(rows[0].keys())}
print(summary)
```
- question: CSV rows를 읽은 뒤 다음 summary가 담는 정보로 알맞은 것은?

summary = {'rows': len(rows), 'columns': list(rows[0].keys())}
- answer: 행 개수와 컬럼 이름 목록
- explanation: len(rows)는 행 수이고, rows[0].keys()는 첫 행에 들어 있는 키의 순서를 보여 준다. 그러나 rows가 비어 있으면 rows[0]에서 IndexError가 나므로, CSV 구조를 요약할 때는 reader.fieldnames를 따로 보존하거나 빈 목록을 먼저 처리한다.
- project_context: 

## PY119_L05_BOM_SYMPTOM_001
- level: 5
- file: python_json_error_encoding_beginner_v119_a1.json
- title: BOM 문제 증상 읽기
- question_type: multiple_choice
- concepts: ["print","BOM","utf-8-sig","encoding"]
- reading_goal: BOM 때문에 첫 key 앞에 보이지 않는 문자가 붙을 수 있음을 이해한다.
- code:
```python
print(repr(text[:1]))  # '\ufeff'처럼 보일 수 있음
data = json.loads(text)
```
- question: JSON 문자열의 첫 글자가 \ufeff로 보이면 무엇을 의심할 수 있는가?
- answer: BOM이나 인코딩 문제
- explanation: repr(text[:1])이 '\ufeff'를 보이면 UTF-8 BOM이 문자열 맨 앞에 남은 것이다. 이 상태로 json.loads()를 호출하면 BOM 관련 JSONDecodeError가 날 수 있으므로, 원본 bytes가 UTF-8 BOM을 쓴 파일이라면 utf-8-sig로 읽는다.
- project_context: 데이터 key가 이상하게 안 맞을 때 보이지 않는 문자 문제를 찾는 카드다.

## PY119_L05_ENSURE_ASCII_FALSE_001
- level: 5
- file: python_json_error_encoding_beginner_v119_a1.json
- title: ensure_ascii=False 읽기
- question_type: multiple_choice
- concepts: ["ensure_ascii=False","json.dumps","Korean text"]
- reading_goal: json.dumps에서 ensure_ascii=False가 한글을 사람이 읽기 쉽게 저장하는 옵션임을 읽는다.
- code:
```python
text = json.dumps(data, ensure_ascii=False)
```
- question: ensure_ascii=False의 효과로 알맞은 것은?
- answer: 한글을 가능한 그대로 보이게 저장한다
- explanation: ensure_ascii=False를 쓰면 한글이 \uXXXX 형태로만 보이지 않고 사람이 읽기 쉬운 글자로 저장된다. 공유용 설정 파일이나 로그를 사람이 직접 확인할 때 특히 유용하다. 따라서 정답은 ‘한글을 가능한 그대로 보이게 저장한다’이다.
- project_context: 한글 학습 카드나 설명 데이터를 JSON으로 저장할 때 필요한 옵션이다.

## PY119_L05_JSON_WRITE_KOREAN_001
- level: 5
- file: python_json_error_encoding_beginner_v119_a1.json
- title: 한글 JSON 저장 패턴
- question_type: multiple_choice
- concepts: ["ensure_ascii=False","indent=2","encoding"]
- reading_goal: 한글 JSON을 저장할 때 ensure_ascii=False와 encoding='utf-8'을 함께 쓰는 패턴을 읽는다.
- code:
```python
text = json.dumps(data, ensure_ascii=False, indent=2)
Path('cards.json').write_text(text, encoding='utf-8')
```
- question: 이 저장 패턴의 장점으로 알맞은 것은?
- answer: 한글이 읽기 쉽고 파일 인코딩도 명시된다
- explanation: ensure_ascii=False는 한글 표시를 돕고, encoding='utf-8'은 파일 저장 인코딩을 명확히 한다. indent=2는 구조 확인에 좋다. 따라서 정답은 ‘한글이 읽기 쉽고 파일 인코딩도 명시된다’이다.
- project_context: 학습 카드 JSON 파일을 사람이 검토하기 좋게 저장하는 기본 패턴이다.

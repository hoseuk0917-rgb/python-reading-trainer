# V356 semantic review — Level 3 chunk 9

Cards 161-180 of 206.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYF95_A4_FILE_011_PATH_JOIN
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: Path로 경로 이어 붙이기
- question_type: output_prediction
- concepts: ["import","print","pathlib","Path","name"]
- reading_goal: Path 객체에서 / 연산으로 경로를 이어 붙이고 name이 마지막 파일명을 가리키는 흐름을 읽는다.
- code:
```python
from pathlib import Path
path = Path("data") / "memo.txt"
print(path.name)
```
- question: 출력 결과는?
- answer: memo.txt
- explanation: path.name은 마지막 부품인 memo.txt다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 프로젝트 파일 경로를 만들 때 pathlib을 쓰면 경로 조합이 명확해진다.

## PYF95_A4_FILE_012_PATH_SUFFIX
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: Path 확장자 읽기
- question_type: output_prediction
- concepts: ["import","print","pathlib","suffix","path"]
- reading_goal: Path.suffix가 파일 확장자를 점과 함께 돌려주는 흐름을 읽는다.
- code:
```python
from pathlib import Path
path = Path("data/cards.json")
print(path.suffix)
```
- question: 출력 결과는?
- answer: .json
- explanation: cards.json의 suffix는 .json이다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 파일 종류를 구분하는 코드에서 suffix는 자주 사용된다.

## PYF95_A4_FILE_013_PATH_STEM
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: Path stem 읽기
- question_type: output_prediction
- concepts: ["import","print","pathlib","stem","path"]
- reading_goal: Path.stem이 확장자를 뺀 파일 이름을 돌려주는 흐름을 읽는다.
- code:
```python
from pathlib import Path
path = Path("data/cards.json")
print(path.stem)
```
- question: 출력 결과는?
- answer: cards
- explanation: cards.json에서 확장자를 뺀 이름은 cards다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 파일명에서 버전명이나 식별자를 뽑는 코드와 연결된다.

## PYF95_A4_FILE_014_PATH_PARENT
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: Path parent 읽기
- question_type: output_prediction
- concepts: ["import","print","pathlib","parent","path"]
- reading_goal: Path.parent가 파일이 들어 있는 부모 경로를 가리키는 흐름을 읽는다.
- code:
```python
from pathlib import Path
path = Path("data/cards.json")
print(path.parent)
```
- question: 출력 결과는?
- answer: data
- explanation: data/cards.json의 부모 경로는 data다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 출력 폴더와 입력 파일 위치를 분리해 읽는 데 필요하다.

## PYF95_A4_FILE_015_PATH_READ_TEXT
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: Path.read_text 흐름
- question_type: output_prediction
- concepts: ["comment","import","print","pathlib","read_text","encoding"]
- reading_goal: Path.read_text가 파일 내용을 문자열로 읽어 변수에 저장하는 흐름을 읽는다.
- code:
```python
# memo.txt 내용: hello
from pathlib import Path
text = Path("memo.txt").read_text(encoding="utf-8")
print(text)
```
- question: 출력 결과는?
- answer: hello
- explanation: read_text는 memo.txt의 내용 hello를 읽는다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 작은 텍스트 파일을 간단히 읽는 코드에서 read_text가 자주 쓰인다.

## PYF95_A4_FILE_016_PATH_WRITE_TEXT
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: Path.write_text 흐름
- question_type: output_prediction
- concepts: ["import","print","pathlib","write_text","file"]
- reading_goal: Path.write_text가 파일에 문자열을 쓰고 화면 출력과는 별개라는 점을 읽는다.
- code:
```python
from pathlib import Path
Path("out.txt").write_text("hi", encoding="utf-8")
print("done")
```
- question: Path.write_text 실행 뒤 화면에 출력되는 값은?
- answer: done
- explanation: Path('out.txt').write_text('hi', encoding='utf-8')는 문자열 hi를 파일에 저장한다. 이 호출 자체가 화면에 hi를 출력하는 것은 아니고, 이어지는 print('done')만 화면에 보인다. 따라서 파일 내용과 콘솔 출력의 역할을 나누어 읽어야 한다. write_text는 파일을 바꾸는 동작이고, 화면 출력은 print가 담당한다.
- project_context: 짧은 결과 파일을 저장하는 코드에서 write_text가 쓰일 수 있다.

## PYF95_A4_FILE_017_TRY_EXCEPT_VALUE_ERROR
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: int 변환 오류 잡기
- question_type: output_prediction
- concepts: ["try_except","print","try","except","ValueError"]
- reading_goal: try 안에서 ValueError가 발생하면 except ValueError 블록으로 이동하는 흐름을 읽는다.
- code:
```python
try:
    number = int("x")
    print(number)
except ValueError:
    print("bad")
```
- question: 출력 결과는?
- answer: bad
- explanation: int('x')는 정수로 바꿀 수 없어 ValueError를 발생시킨다. 그 순간 try의 다음 print(number)는 실행되지 않고 일치하는 except ValueError 블록으로 이동해 bad를 출력한다. 따옴표는 화면에 나오지 않는다.
- project_context: 사용자 입력을 숫자로 바꾸는 코드는 실패 가능성을 다뤄야 한다.

## PYF95_A4_FILE_018_TRY_EXCEPT_NO_ERROR
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: 오류가 없을 때 except 건너뛰기
- question_type: output_prediction
- concepts: ["try_except","print","try","except","int"]
- reading_goal: try 블록이 정상 실행되면 except 블록이 실행되지 않는 흐름을 읽는다.
- code:
```python
try:
    number = int("3")
    print(number)
except ValueError:
    print("bad")
```
- question: 출력 결과는?
- answer: 결과는 3이다
- explanation: int('3')은 성공하므로 3이 출력되고 except는 실행되지 않는다. 따라서 결과는 3이다. 먼저 try 블록에서 실제로 예외가 생기는 줄을 찾고, 그 예외 종류가 except와 맞는지 확인하면 정상 흐름과 예외 흐름 중 어느 쪽이 이어지는지 판단할 수 있다.
- project_context: 정상 흐름과 오류 흐름을 분리해서 보는 습관이 중요하다.

## PYF95_A4_FILE_019_ZERO_DIVISION
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: ZeroDivisionError 잡기
- question_type: output_prediction
- concepts: ["try_except","print","try","except","ZeroDivisionError"]
- reading_goal: 0으로 나누기 오류가 발생하면 해당 except 블록이 실행되는 흐름을 읽는다.
- code:
```python
try:
    print(10 / 0)
except ZeroDivisionError:
    print("zero")
```
- question: 출력 결과는?
- answer: zero
- explanation: 10 / 0은 ZeroDivisionError를 일으켜 zero가 출력된다. 먼저 try 블록에서 실제로 예외가 생기는 줄을 찾고, 그 예외 종류가 except와 맞는지 확인하면 정상 흐름과 예외 흐름 중 어느 쪽이 이어지는지 판단할 수 있다.
- project_context: 계산 코드에서는 나눗셈의 실패 가능성을 확인해야 한다.

## PYF95_A4_FILE_020_EXCEPTION_AS_E
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: 오류 객체 이름 붙이기
- question_type: output_prediction
- concepts: ["try_except","print","except","exception","as"]
- reading_goal: except ValueError as e에서 e는 오류 객체 이름이고, 블록 안 코드가 실행되는 흐름을 읽는다.
- code:
```python
try:
    int("x")
except ValueError as e:
    print("error")
```
- question: 출력 결과는?
- answer: error
- explanation: int('x')가 발생시킨 ValueError를 except ValueError as e가 잡고 예외 객체를 e에 연결한다. 이 예시는 e를 사용하지 않고 error만 출력하지만, 실제 코드에서는 안전한 진단 정보를 기록할 때 e를 참고할 수 있다.
- project_context: 오류 메시지를 로그로 남기는 코드에서 exception 변수 이름이 자주 등장한다.

## PYF95_A4_FILE_021_FINALLY_RUNS
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: finally는 마지막에 실행된다
- question_type: output_prediction
- concepts: ["try_except","print","try","except","finally"]
- reading_goal: 오류가 없어도 finally 블록은 마지막에 실행되는 흐름을 읽는다.
- code:
```python
try:
    print("try")
except ValueError:
    print("except")
finally:
    print("finally")
```
- question: 출력 순서로 맞는 것은?
- answer: try 다음 finally
- explanation: try가 정상 실행되고 except는 건너뛰지만 finally는 실행된다. 먼저 try 블록에서 실제로 예외가 생기는 줄을 찾고, 그 예외 종류가 except와 맞는지 확인하면 정상 흐름과 예외 흐름 중 어느 쪽이 이어지는지 판단할 수 있다.
- project_context: 정리 작업이나 종료 로그는 finally에 들어갈 수 있다.

## PYF95_A4_FILE_022_SAFE_INT_FUNCTION
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: safe_int 함수 읽기
- question_type: output_prediction
- concepts: ["def","function","try_except","print","try","except","return","ValueError"]
- reading_goal: 함수 안 try/except에서 오류가 나면 except의 return 값이 함수 밖으로 나오는 흐름을 읽는다.
- code:
```python
def safe_int(text):
    try:
        return int(text)
    except ValueError:
        return 0

print(safe_int("x"))
```
- question: 출력 결과는?
- answer: 0
- explanation: int('x')가 ValueError를 내므로 except의 return 0이 실행되고 바깥 print가 0을 출력한다. 다만 0은 실제 입력 '0'의 정상 결과와 실패 기본값을 구분하지 못한다. 호출자가 실패를 알아야 한다면 None, 명시적 결과 객체, 또는 예외 유지처럼 계약을 분명히 해야 한다.
- project_context: 입력값 변환 함수는 실패 시 기본값을 반환하도록 만들 수 있다.

## PYF95_A4_FILE_023_SAFE_INT_SUCCESS
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: safe_int 정상 변환
- question_type: output_prediction
- concepts: ["def","function","try_except","print","try","except","return","int"]
- reading_goal: try가 성공하면 except가 실행되지 않고 try 안 return 값이 사용되는 흐름을 읽는다.
- code:
```python
def safe_int(text):
    try:
        return int(text)
    except ValueError:
        return 0

print(safe_int("7"))
```
- question: 출력 결과는?
- answer: 7
- explanation: int('7')이 정수 7을 만들므로 try의 return 7에서 함수가 끝나고 except는 실행되지 않는다. 바깥 print가 반환값 7을 출력한다.
- project_context: 성공과 실패가 모두 가능한 함수는 두 흐름을 따로 추적해야 한다.

## PYF95_A4_FILE_024_FILE_NOT_FOUND_CONCEPT
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: 없는 파일 오류 종류
- question_type: concept_reading
- concepts: ["FileNotFoundError","open","exception"]
- reading_goal: 파일이 없을 때 발생할 수 있는 오류 종류를 설명 수준에서 판단한다.
- code:
```python
filename = "missing.txt"
```
- question: 없는 파일을 읽으려고 할 때 자주 만나는 오류 이름은?
- answer: FileNotFoundError
- explanation: filename 변수에는 missing.txt라는 경로 문자열이 들어 있다. 이후 이 경로를 읽기 모드로 open하려는데 실제 파일이 없다면 Python은 보통 FileNotFoundError를 발생시킨다. 변수에 파일 이름을 저장하는 것만으로 오류가 나는 것은 아니고, 실제로 존재하지 않는 파일을 열려고 할 때 오류가 발생한다.
- project_context: 파일 입력 코드에서는 경로가 맞는지와 파일 존재 여부가 중요하다.

## PYF95_A4_FILE_025_TRY_FILE_NOT_FOUND
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: 파일 없음 예외 처리
- question_type: output_prediction
- concepts: ["try_except","print","try","except","FileNotFoundError"]
- reading_goal: 파일 열기 실패가 FileNotFoundError except로 이동하는 흐름을 읽는다.
- code:
```python
try:
    with open("missing.txt", "r", encoding="utf-8") as f:
        f.read()
except FileNotFoundError:
    print("missing")
```
- question: 출력 결과는?
- answer: missing
- explanation: missing.txt가 현재 작업 폴더에 없다는 전제에서 open이 FileNotFoundError를 내고 except가 missing을 출력한다. 다른 권한 오류나 디렉터리를 파일로 연 오류까지 이 except가 잡는 것은 아니다. 파일이 존재한다면 with가 읽기 뒤 닫아 준다.
- project_context: 외부 파일을 읽는 앱은 파일이 없을 때의 흐름도 준비해야 한다.

## PYF95_A4_FILE_026_JSON_LOADS_STRING
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: JSON 문자열 파싱
- question_type: output_prediction
- concepts: ["import","print","json","json.loads","dict"]
- reading_goal: JSON 문자열이 json.loads를 거쳐 dict가 되고 key로 값을 꺼내는 흐름을 읽는다.
- code:
```python
import json
text = "{\"name\": \"Mina\"}"
data = json.loads(text)
print(data["name"])
```
- question: 출력 결과는?
- answer: Mina
- explanation: loads 뒤 data는 dict이고 name 값은 Mina다. JSON을 읽을 때는 문자열이나 파일 내용이 json 함수에서 파이썬 값으로 바뀌는 지점을 먼저 찾고, 변환 뒤 자료형에서 key나 index로 어떤 값을 꺼내는지 순서대로 확인한다.
- project_context: 설정 파일이나 API 응답은 JSON 문자열에서 dict로 바뀌어 사용된다.

## PYF95_A4_FILE_027_JSON_DUMPS_STRING
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: dict를 JSON 문자열로 바꾸기
- question_type: output_prediction
- concepts: ["import","print","json","json.dumps","str"]
- reading_goal: json.dumps가 파이썬 dict를 JSON 형식 문자열로 바꾸는 흐름을 읽는다.
- code:
```python
import json
data = {"name": "Mina"}
text = json.dumps(data, ensure_ascii=False)
print(type(text).__name__)
```
- question: 출력 결과는?
- answer: str
- explanation: data는 Python dict이고 json.dumps(data, ensure_ascii=False)가 그 dict를 JSON 형식의 문자열로 직렬화해 text에 저장한다. 따라서 text의 자료형은 str이다. type(text).__name__은 자료형 이름 문자열 "str"을 만들고 마지막 print가 str을 출력한다.
- project_context: 데이터를 파일에 저장하거나 전송하기 전에 문자열로 바꾸는 단계가 필요할 수 있다.

## PYF95_A4_FILE_028_JSON_FILE_FLOW
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: 파일에서 JSON 읽기 흐름
- question_type: output_prediction
- concepts: ["comment","import","print","open","read","json.loads","dict"]
- reading_goal: 파일에서 문자열을 읽고 JSON 파싱 후 dict key로 값을 꺼내는 여러 단계 흐름을 읽는다.
- code:
```python
# config.json 내용: {"level": 3}
import json
with open("config.json", "r", encoding="utf-8") as f:
    text = f.read()
data = json.loads(text)
print(data["level"])
```
- question: 출력 결과는?
- answer: level key에 연결된 값 3
- explanation: f.read()가 JSON 문서를 문자열로 읽고 json.loads(text)가 {'level': 3} dict로 파싱한다. data['level']은 항목 개수가 아니라 level key에 연결된 정수 값 3을 꺼내므로 print는 3을 출력한다.
- project_context: 설정 파일 로딩 코드는 파일 읽기와 JSON 파싱이 이어지는 대표 사례다.

## PYF95_A4_FILE_029_PATH_JSON_FLOW
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: Path와 JSON 함께 읽기
- question_type: output_prediction
- concepts: ["comment","import","print","pathlib","read_text","json.loads","bool"]
- reading_goal: Path.read_text로 읽은 JSON 문자열이 dict로 바뀌고 bool 값으로 사용되는 흐름을 읽는다.
- code:
```python
# config.json 내용: {"ok": true}
import json
from pathlib import Path
text = Path("config.json").read_text(encoding="utf-8")
data = json.loads(text)
print(data["ok"])
```
- question: 출력 결과는?
- answer: True
- explanation: 먼저 Path("config.json").read_text(...)가 파일 내용 {"ok": true}를 문자열로 읽어 text에 저장한다. json.loads(text)가 그 JSON 문자열을 Python dict로 바꾸면서 JSON의 true는 Boolean True가 된다. 마지막 data["ok"]가 True를 꺼내고 print가 True를 출력한다.
- project_context: 짧은 설정 파일 로딩은 pathlib과 json을 함께 쓸 수 있다.

## PYF95_A4_FILE_030_CHOOSE_WITH_REASON
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: with를 쓰는 이유 고르기
- question_type: concept_reading
- concepts: ["with","open","file"]
- reading_goal: with open 구조의 목적을 설명 수준에서 판단한다.
- code:
```python
with open("memo.txt", "r", encoding="utf-8") as f:
    text = f.read()
```
- question: with를 쓰는 이유로 가장 알맞은 것은?
- answer: 파일을 안전하게 열고 닫기 위해
- explanation: with는 open이 반환한 파일 객체의 context manager를 사용한다. 블록을 벗어날 때 정상 흐름인지 예외 흐름인지와 관계없이 파일을 닫도록 해 수동 close 누락을 줄인다. with가 읽기 오류 자체를 처리해 주는 것은 아니므로 필요한 예외 처리는 별도로 한다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 파일 처리 코드에서 자원 정리 흐름을 읽는 데 필요하다.

# V356 semantic review — Level 3 chunk 11

Cards 201-206 of 206.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYV96_A3_SCOPE_015_KEYWORD_ARGUMENT
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: 키워드 인자 읽기
- question_type: output_prediction
- concepts: ["def","function","print","keyword argument","parameter","return"]
- reading_goal: 키워드 인자가 parameter 이름에 맞게 들어가는 흐름을 읽는다.
- code:
```python
def profile(name, age):
    return name + ':' + str(age)

print(profile(age=10, name='Mina'))
```
- question: 출력 결과는?
- answer: Mina:10
- explanation: profile(age=10, name='Mina')는 argument 순서가 정의와 달라도 keyword 이름을 기준으로 age에 10, name에 Mina를 연결한다. 함수 안에서 name + ':' + str(age)가 'Mina:10'을 만들고 return하며, 바깥 print가 Mina:10을 출력한다.
- project_context: 순서가 바뀌어도 이름으로 연결되는 호출문을 이해한다.

## PYV96_A3_SCOPE_016_SCOPE_CHECKLIST
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: 스코프 체크리스트 적용
- question_type: output_prediction
- concepts: ["def","function","print","scope","parameter","return"]
- reading_goal: 같은 이름 value를 함수 안팎에서 나누어 보고 return 결과를 따로 추적한다.
- code:
```python
value = 2
def calc(value):
    value = value * 3
    return value

result = calc(4)
print(value)
print(result)
```
- question: 출력 순서로 맞는 것은?
- answer: 2 다음 12
- explanation: calc(4)의 parameter value는 함수 안의 local 이름이며 12로 바뀌어 반환된다. module 범위의 value는 별도 이름이라 2로 남는다. 따라서 첫 print는 2, 둘째 print는 result에 저장된 12를 출력한다.
- project_context: 스코프 문제의 종합 복습이다.

## PY114_L03_IMPORT_NAME_001
- level: 3
- file: python_import_debug_beginner_v114_a1.json
- title: import는 이름을 찾아온다
- question_type: multiple_choice
- concepts: ["print","import","module","math"]
- reading_goal: import가 모듈 이름을 기준으로 Python 파일이나 설치 패키지를 찾는다는 점을 읽는다.
- code:
```python
import math
print(math.sqrt(9))
```
- question: 이 코드에서 import math의 역할은?
- answer: math라는 모듈을 찾아 사용할 준비를 한다
- explanation: import math가 실행되면 Python이 math 모듈을 불러와 현재 코드에서 math라는 이름으로 사용할 수 있게 한다. 그래서 다음 줄의 math.sqrt(9)가 math 모듈 안 sqrt 함수를 찾아 9의 제곱근을 계산할 수 있다. 즉 import math의 역할은 math 모듈을 찾아 사용할 준비를 하는 것이다.
- project_context: 라이브러리 예제 코드를 읽을 때 import 줄이 무엇을 준비하는지 알아야 한다.

## PY114_L03_MODULE_PACKAGE_001
- level: 3
- file: python_import_debug_beginner_v114_a1.json
- title: module과 package 구분
- question_type: multiple_choice
- concepts: ["module","package","__init__.py","import"]
- reading_goal: module은 파일, package는 모듈을 묶는 폴더라는 감각을 잡는다.
- code:
```python
app/
  __init__.py
  helpers.py

from app.helpers import clean_text
```
- question: 위 구조에서 helpers.py는 무엇에 가깝나?
- answer: Python 모듈 파일
- explanation: helpers.py는 Python 코드를 담은 하나의 .py 파일이므로 module에 해당한다. 그 파일을 포함한 app 폴더는 여러 module을 묶는 package 역할을 할 수 있다. from app.helpers import clean_text는 app package 안 helpers module에서 clean_text라는 이름을 가져오는 구조이므로 정답은 Python 모듈 파일이다.
- project_context: 프로젝트가 커지면 파일 하나가 아니라 여러 모듈/패키지로 나누어 읽게 된다.

## PY11_L03_if_else_001
- level: 3
- file: python_libraries_missing_topics_v11.json
- title: if else 분기 읽기
- question_type: output_prediction
- concepts: ["print","if","else","branch"]
- reading_goal: score >= 70 조건을 먼저 계산한 뒤 False이면 else에서 result가 retry로 저장되고 마지막 print로 이어지는 흐름을 읽는다.
- code:
```python
score = 60
if score >= 70:
    result = "pass"
else:
    result = "retry"
print(result)
```
- question: 출력은?
- answer: retry
- explanation: if/else는 조건이 참일 때와 거짓일 때 실행할 흐름을 나눈다. 이 예제에서 60은 70 이상이 아니므로 if 블록이 아니라 else 블록이 실행된다. 분기 문제는 조건식을 먼저 True 또는 False로 계산한 뒤, 실제로 실행되는 블록만 따라가면 된다. 실행되지 않은 블록의 print나 대입은 결과에 영향을 주지 않는다는 점도 함께 확인해야 한다. 따라서 출력은 ‘retry’이다.
- project_context: 검증 통과/실패, 기준점 분기 코드를 읽는 기초다.

## PY11_L03_tuple_001
- level: 3
- file: python_libraries_missing_topics_v11.json
- title: tuple 기본 읽기
- question_type: output_prediction
- concepts: ["print","tuple","index","immutable"]
- reading_goal: point tuple에서 인덱스 1이 두 번째 값 20을 가리키고 print가 그 값을 출력하는 흐름을 읽는다.
- code:
```python
point = (10, 20)
print(point[1])
```
- question: 출력은?
- answer: 20
- explanation: tuple도 list처럼 0부터 시작하는 인덱스로 값을 읽을 수 있다. point[1]은 두 번째 값 20을 가리키므로 출력은 20이다. list와 달리 tuple 자체의 원소는 생성 뒤 대입으로 바꿀 수 없는 불변 자료형이다. 다만 tuple 안에 list 같은 변경 가능한 객체가 들어 있다면 그 내부까지 자동으로 불변이 되는 것은 아니다.
- project_context: 좌표, 상태값, 함수 반환값 묶음에 자주 쓰인다.

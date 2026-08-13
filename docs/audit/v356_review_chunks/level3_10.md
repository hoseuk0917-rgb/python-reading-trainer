# V356 semantic review — Level 3 chunk 10

Cards 181-200 of 206.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYF95_A4_FILE_031_CHOOSE_TRY_REASON
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: try/except를 쓰는 이유 고르기
- question_type: concept_reading
- concepts: ["try_except","try","except","error"]
- reading_goal: try/except가 실패할 수 있는 코드를 다루기 위한 구조임을 설명 수준에서 판단한다.
- code:
```python
try:
    number = int(text)
except ValueError:
    number = 0
```
- question: try/except를 쓰는 이유로 가장 알맞은 것은?
- answer: 예상한 ValueError의 대체 흐름을 정의하기 위해
- explanation: try/except는 예상 가능한 예외가 발생했을 때 정상 흐름과 구분된 대체 동작을 정의한다. 이 코드는 int(text)의 ValueError만 잡아 number를 0으로 둔다. 모든 Exception을 넓게 잡으면 프로그래밍 오류까지 숨길 수 있으므로 처리할 수 있는 구체적인 예외만 잡는다. 먼저 try 블록에서 실제로 예외가 생기는 줄을 찾고, 그 예외 종류가 except와 맞는지 확인하면 정상 흐름과 예외 흐름 중 어느 쪽이 이어지는지 판단할 수 있다.
- project_context: 입력 변환, 파일 읽기, JSON 파싱처럼 실패 가능성이 있는 곳에서 예외 처리가 필요하다.

## PYF95_A4_FILE_032_CHOOSE_PATHLIB_REASON
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: pathlib을 쓰는 이유 고르기
- question_type: concept_reading
- concepts: ["import","pathlib","Path","path"]
- reading_goal: Path가 파일 경로를 구조적으로 다루기 위한 도구임을 설명 수준에서 판단한다.
- code:
```python
from pathlib import Path
path = Path("data") / "memo.txt"
```
- question: pathlib Path를 쓰는 이유로 가장 알맞은 것은?
- answer: 운영체제에 맞게 경로 부품을 명확히 조합하기 위해
- explanation: Path('data') / 'memo.txt'는 문자열 구분자를 직접 이어 붙이지 않고 경로 부품을 운영체제 규칙에 맞게 조합한다. 이는 가독성과 이식성을 돕지만 파일 존재, 접근 권한, 사용자 입력 경로의 보안까지 자동으로 보장하지는 않는다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 프로젝트가 커질수록 경로 조합과 파일명 분석을 안전하게 읽는 능력이 필요하다.

## PY104_L03_BUILTIN_ALL_001
- level: 3
- file: python_foundation_micro_gaps_v104_a1.json
- title: all()로 모두 True인지 확인하기
- question_type: meaning_choice
- concepts: ["print","all","boolean","condition"]
- reading_goal: all(조건들)이 모든 값이 True일 때만 True가 된다는 의미를 읽는다.
- code:
```python
checks = [True, True, False]
ready = all(checks)
print(ready)
```
- question: ready에는 어떤 값이 저장될까?
- answer: False
- explanation: all(checks)는 원소를 truth value로 검사해 하나라도 거짓이면 즉시 False를 반환한다. 마지막 False 때문에 ready는 False다. 반대로 빈 iterable에는 반례가 없으므로 all([])은 True이며, 하나라도 참인지 보는 any와 기준이 다르다.
- project_context: 검증 스크립트에서 여러 조건을 한 번에 묶어 통과 여부를 판단할 때 all()을 읽을 수 있어야 한다.

## PY104_L03_BUILTIN_MAX_001
- level: 3
- file: python_foundation_micro_gaps_v104_a1.json
- title: max()로 가장 큰 값 읽기
- question_type: meaning_choice
- concepts: ["print","max","built-in function","comparison"]
- reading_goal: max(values)가 리스트 안에서 가장 큰 값을 골라 반환한다는 흐름을 읽는다.
- code:
```python
scores = [72, 91, 84]
best = max(scores)
print(best)
```
- question: 이 코드에서 print(best)는 무엇을 출력할까?
- answer: 91
- explanation: max(scores)는 원소를 비교해 가장 큰 값 91을 반환하고 원본 리스트의 순서를 바꾸지 않는다. 원소가 비교 가능해야 하며 빈 iterable에 default 없이 호출하면 ValueError가 난다. 리스트 전체가 아니라 반환된 하나의 값이 best에 저장된다.
- project_context: 실제 프로젝트에서는 평가 점수, 모델 성능, 파일 크기 후보 중 가장 큰 값을 고르는 로직에서 max()가 자주 보인다.

## PY104_L03_LIST_EXTEND_001
- level: 3
- file: python_foundation_micro_gaps_v104_a1.json
- title: extend()로 여러 값을 한 번에 붙이기
- question_type: meaning_choice
- concepts: ["print","list","extend","mutation"]
- reading_goal: list.extend는 리스트 끝에 여러 원소를 펼쳐서 추가한다는 점을 읽는다.
- code:
```python
items = [1, 2]
items.extend([3, 4])
print(items)
```
- question: print(items)의 출력으로 맞는 것은?
- answer: [1, 2, 3, 4]
- explanation: items.extend([3, 4])는 전달받은 리스트 자체를 한 항목으로 넣지 않고 그 안의 원소 3과 4를 items 끝에 하나씩 추가한다. 그래서 items가 [1, 2, 3, 4]로 직접 변경되고 마지막 print가 그 리스트를 출력한다. append([3, 4])라면 [3, 4]가 한 원소로 들어간다는 점이 다르다.
- project_context: 여러 JSON 결과나 카드 묶음을 하나의 리스트로 합칠 때 append와 extend의 차이를 모르면 중첩 리스트 버그가 생길 수 있다.

## PY104_L03_LIST_INSERT_001
- level: 3
- file: python_foundation_micro_gaps_v104_a1.json
- title: insert()로 원하는 위치에 값 넣기
- question_type: meaning_choice
- concepts: ["print","list","insert","index"]
- reading_goal: list.insert(index, value)가 특정 위치 앞에 값을 끼워 넣는다는 의미를 읽는다.
- code:
```python
steps = ['audit', 'commit']
steps.insert(1, 'validate')
print(steps)
```
- question: insert 실행 뒤 steps는 어떤 순서가 될까?
- answer: ['audit', 'validate', 'commit']
- explanation: insert(1, 'validate')는 현재 인덱스 1 원소 앞에 값을 넣어 ['audit', 'validate', 'commit']을 만든다. 기존 원소는 뒤로 이동하고 리스트 자체가 바뀐다. insert의 반환값은 None이므로 반환값보다 변경된 steps를 확인해야 하며, 큰 리스트 앞쪽 삽입은 원소 이동 비용이 든다.
- project_context: 검증 단계 사이에 새 점검 단계를 끼워 넣거나 UI 메뉴 순서를 조정할 때 insert()의 위치 의미가 중요하다.

## PYV96_A3_SCOPE_001_DEF_NOT_CALL
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: 정의만 있고 호출 없음
- question_type: output_prediction
- concepts: ["print","def","function","call"]
- reading_goal: def hello()가 함수 본문을 정의하기만 하고 hello() 호출이 없으면 내부 print가 실행되지 않는다는 점을 읽는다.
- code:
```python
def hello():
    print('hi')
```
- question: 화면 출력은?
- answer: 아무것도 출력되지 않음
- explanation: hello() 호출이 없으므로 함수 안 print는 실행되지 않는다. 따라서 화면에는 아무것도 출력되지 않는다. 보기 표현으로는 ‘아무것도 출력되지 않음’이 맞다.
- project_context: 함수 본문은 호출될 때 실행된다는 기본 규칙을 복습한다.

## PYV96_A3_SCOPE_002_PARAM_ARG
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: argument가 parameter에 들어가기
- question_type: output_prediction
- concepts: ["def","function","print","parameter","argument","return"]
- reading_goal: 호출값 4가 parameter x에 들어가고 return되는 흐름을 읽는다.
- code:
```python
def double(x):
    return x * 2

print(double(4))
```
- question: 출력 결과는?
- answer: 8
- explanation: print(double(4))을 계산하려고 먼저 double(4)를 호출하면 argument 4가 parameter x에 들어간다. 함수 안에서 x * 2가 8로 계산되고 return 8이 호출한 곳으로 돌아온다. 가장 바깥 print가 그 반환값 8을 출력한다.
- project_context: 함수 입력과 결과를 연결하는 기본 문제다.

## PYV96_A3_SCOPE_003_RETURN_ASSIGN
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: return 값을 변수에 저장
- question_type: output_prediction
- concepts: ["def","print","return","assignment","function"]
- reading_goal: 함수 호출 결과가 바깥 변수에 저장되는 흐름을 읽는다.
- code:
```python
def add(a, b):
    return a + b

result = add(2, 3)
print(result)
```
- question: 출력 결과는?
- answer: 5
- explanation: result = add(2, 3)에서 먼저 add가 호출되어 argument 2와 3이 parameter a와 b에 들어간다. 함수 안의 a + b가 5로 계산되고 return 5가 호출한 곳으로 돌아와 result에 저장된다. 마지막 print(result)가 5를 출력한다.
- project_context: 함수 결과를 다음 코드에서 쓰는 패턴이다.

## PYV96_A3_SCOPE_004_PRINT_NO_RETURN
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: print는 있지만 return 없음
- question_type: output_prediction
- concepts: ["def","function","print","return","None"]
- reading_goal: 함수 안 print와 함수 호출 결과 None을 구분한다.
- code:
```python
def show():
    print('hi')

result = show()
print(result)
```
- question: 출력 순서로 맞는 것은?
- answer: hi 다음 None
- explanation: result = show()에서 먼저 show가 호출되어 hi를 출력한다. 함수에 return문이 없으면 호출 결과는 None이므로 result에 None이 저장되고, 다음 print(result)가 None을 출력한다. 화면 출력과 반환값은 서로 다른 동작이다.
- project_context: print와 return 혼동을 줄이는 핵심 복습이다.

## PYV96_A3_SCOPE_005_LOCAL_DOES_NOT_CHANGE_OUTER
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: 함수 안 대입과 바깥 변수
- question_type: output_prediction
- concepts: ["def","function","print","scope","local variable","assignment"]
- reading_goal: 함수 안 x 대입이 바깥 x를 자동으로 바꾸지 않는 흐름을 읽는다.
- code:
```python
x = 10
def change():
    x = 3

change()
print(x)
```
- question: 출력 결과는?
- answer: 10
- explanation: change() 안의 x = 3은 대입 때문에 함수의 새 local 변수 x를 만든다. module 범위의 x = 10과 이름은 같지만 다른 binding이므로 호출이 끝난 뒤 바깥 print(x)는 10을 출력한다.
- project_context: 같은 이름 변수의 범위를 구분하는 초급 스코프 문제다.

## PYV96_A3_SCOPE_006_RETURN_TO_CHANGE
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: return으로 바깥 값 갱신
- question_type: output_prediction
- concepts: ["def","function","print","return","scope","assignment"]
- reading_goal: 함수 return 값을 바깥 변수에 다시 저장해 값이 바뀌는 흐름을 읽는다.
- code:
```python
x = 10
def change(value):
    return value + 1

x = change(x)
print(x)
```
- question: 출력 결과는?
- answer: 11
- explanation: 처음 바깥 x에는 10이 저장되어 있다. x = change(x)를 실행하면 현재 값 10이 parameter value에 들어가고 함수가 10 + 1인 11을 return한다. 그 반환값을 다시 바깥 x에 대입하므로 x가 11로 바뀌고 마지막 print(x)가 11을 출력한다.
- project_context: 함수로 값을 바꾸려면 return과 재대입 흐름을 확인해야 한다.

## PYV96_A3_SCOPE_007_EARLY_RETURN
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: 조건 안 return으로 일찍 끝나기
- question_type: output_prediction
- concepts: ["def","function","print","if","return","early return"]
- reading_goal: 조건 안 return이 실행되면 아래 return이 실행되지 않는 흐름을 읽는다.
- code:
```python
def label(n):
    if n > 0:
        return 'plus'
    return 'zero'

print(label(5))
```
- question: 출력 결과는?
- answer: plus
- explanation: label(5)를 호출하면 argument 5가 parameter n에 들어간다. n > 0 조건은 True이므로 if 안의 return 'plus'가 실행되는 순간 함수가 끝나고 아래 return 'zero'에는 도달하지 않는다. 바깥 print가 반환된 plus를 출력한다.
- project_context: 여러 return 중 실제 실행되는 하나를 찾는 연습이다.

## PYV96_A3_SCOPE_008_NO_EARLY_RETURN
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: 조건이 False일 때 아래 return
- question_type: output_prediction
- concepts: ["def","print","if","return","function"]
- reading_goal: 조건이 False이면 if 안 return을 건너뛰고 다음 return으로 가는 흐름을 읽는다.
- code:
```python
def label(n):
    if n > 0:
        return 'plus'
    return 'zero'

print(label(0))
```
- question: 출력 결과는?
- answer: zero
- explanation: label(0)을 호출하면 argument 0이 parameter n에 들어간다. n > 0 조건은 False이므로 if 안의 return 'plus'를 건너뛰고 다음 return 'zero'가 실행된다. 함수가 돌려준 zero를 바깥 print가 출력한다.
- project_context: 조건과 return 순서를 함께 보는 복습이다.

## PYV96_A3_SCOPE_009_LIST_MUTATION
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: 리스트 append는 바깥에서도 보임
- question_type: output_prediction
- concepts: ["def","print","list","function","mutation"]
- reading_goal: 함수 안 append가 전달된 리스트 내용을 바꾸는 흐름을 읽는다.
- code:
```python
items = []
def add_item(box):
    box.append('a')

add_item(items)
print(items)
```
- question: 출력 결과는?
- answer: ['a']
- explanation: add_item(items)를 호출하면 parameter box와 바깥 변수 items가 같은 리스트 객체를 가리킨다. box라는 local 이름을 만든 것뿐 리스트를 복사하지 않았으므로 append가 그 객체를 변경하고 바깥에서 ['a']가 보인다.
- project_context: 리스트 object 변경과 숫자 재대입의 차이를 가볍게 복습한다.

## PYV96_A3_SCOPE_010_INT_LOCAL_CHANGE
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: 숫자 parameter 재대입은 바깥을 안 바꿈
- question_type: output_prediction
- concepts: ["def","function","print","int","scope","parameter"]
- reading_goal: 함수 안 parameter 재대입이 바깥 숫자 변수 값을 자동으로 바꾸지 않는 흐름을 읽는다.
- code:
```python
x = 1
def add_one(n):
    n = n + 1

add_one(x)
print(x)
```
- question: 출력 결과는?
- answer: 1
- explanation: 호출할 때 n은 x가 가리키던 정수 1을 받는다. n = n + 1은 새 정수 2를 만든 뒤 local 이름 n만 다시 연결하며 바깥 이름 x를 대입하지 않는다. 그래서 반환값도 사용하지 않은 이 코드의 x는 계속 1이다.
- project_context: return 없이 함수 안에서만 바뀐 값은 바깥에서 보이지 않을 수 있다.

## PYV96_A3_SCOPE_011_NESTED_NOT_CALLED
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: 안쪽 함수도 호출 필요
- question_type: output_prediction
- concepts: ["function","print","nested function","def","call"]
- reading_goal: inner 함수가 정의만 되고 호출되지 않으면 실행되지 않는 흐름을 읽는다.
- code:
```python
def outer():
    def inner():
        print('in')
    print('out')

outer()
```
- question: 출력 결과는?
- answer: out
- explanation: outer()가 호출되면 def inner 문은 local 함수 객체를 만들지만 inner 본문은 실행하지 않는다. inner() 호출이 없으므로 in은 출력되지 않고, 이어지는 print('out')만 out을 출력한다.
- project_context: 중첩 함수에서도 호출 여부를 따로 확인해야 한다.

## PYV96_A3_SCOPE_012_NESTED_CALLED
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: 안쪽 함수 호출
- question_type: output_prediction
- concepts: ["def","function","nested function","call","print"]
- reading_goal: outer 안에서 inner가 호출될 때 안쪽 본문도 실행되는 흐름을 읽는다.
- code:
```python
def outer():
    def inner():
        print('in')
    inner()
    print('out')

outer()
```
- question: 출력 순서로 맞는 것은?
- answer: in 다음 out
- explanation: outer() 안에서 inner가 정의된 뒤 inner()가 호출되어 먼저 in을 출력한다. 그 호출이 끝나면 다음 줄로 돌아와 out을 출력하므로 순서는 in 다음 out이다.
- project_context: 중첩 호출 순서를 한 줄씩 따라가는 연습이다.

## PYV96_A3_SCOPE_013_GLOBAL_LIGHT
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: global로 바깥 변수 바꾸기
- question_type: output_prediction
- concepts: ["def","function","print","global","scope","assignment"]
- reading_goal: global이 있을 때 함수 안 대입이 바깥 변수에 영향을 주는 흐름을 읽는다.
- code:
```python
x = 1
def change():
    global x
    x = 5

change()
print(x)
```
- question: 출력 결과는?
- answer: 5
- explanation: global x 선언은 change 안의 x 대입이 local 이름을 만들지 않고 module 범위의 x를 가리키게 한다. 따라서 x = 5가 바깥 값을 바꾸고 print는 5를 출력한다. 전역 상태 변경은 흐름을 추적하기 어려울 수 있어 가능하면 값을 return해 호출자가 대입하는 방식을 우선 고려한다.
- project_context: global은 예외적인 신호로 보고 일반 함수 흐름과 구분한다.

## PYV96_A3_SCOPE_014_DEFAULT_ARGUMENT
- level: 3
- file: python_function_scope_reading_notes_v96_a3.json
- title: 기본 인자 사용
- question_type: output_prediction
- concepts: ["def","function","print","default argument","parameter","return"]
- reading_goal: argument가 없을 때 parameter 기본값이 사용되는 흐름을 읽는다.
- code:
```python
def greet(name='Guest'):
    return 'Hi ' + name

print(greet())
```
- question: 출력 결과는?
- answer: Hi Guest
- explanation: greet() 호출에는 name argument가 없으므로 parameter name은 정의에 적힌 기본값 'Guest'를 사용한다. 함수 안에서 'Hi '와 Guest를 이어 붙여 'Hi Guest'를 return하고, 바깥 print가 그 반환 문자열을 출력한다.
- project_context: 기본 인자는 함수 호출문을 읽을 때 자주 만난다.

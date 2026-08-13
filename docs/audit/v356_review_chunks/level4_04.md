# V356 semantic review — Level 4 chunk 4

Cards 61-80 of 97.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYF95_A5_OOP_025_ATTRIBUTE_DEFAULT_FALSE
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: 초기값 False인 attribute
- question_type: output_prediction
- concepts: ["def","function","class","print","attribute","bool","__init__"]
- reading_goal: __init__에서 bool attribute를 기본값으로 준비하는 흐름을 읽는다.
- code:
```python
class User:
    def __init__(self):
        self.active = False

u = User()
print(u.active)
```
- question: 출력 결과는?
- answer: False
- explanation: __init__에서 self.active가 False로 저장된다.
- project_context: 초기 상태를 object에 저장하는 방식은 앱 상태 관리의 기본이다.

## PYF95_A5_OOP_026_ATTRIBUTE_LIST
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: attribute가 리스트일 때
- question_type: output_prediction
- concepts: ["def","function","class","print","attribute","list","method","append"]
- reading_goal: list attribute가 method 안에서 append로 바뀌는 흐름을 읽는다.
- code:
```python
class Basket:
    def __init__(self):
        self.items = []
    def add(self, item):
        self.items.append(item)

b = Basket()
b.add("apple")
print(b.items)
```
- question: 출력 결과는?
- answer: ['apple']
- explanation: Basket()을 만들 때마다 __init__이 새 빈 리스트를 self.items에 저장한다. b.add('apple')은 그 instance의 리스트에 apple을 추가하므로 ['apple']이 출력된다. 리스트를 class attribute로 한 번만 만들었다면 여러 instance가 같은 mutable 리스트를 공유할 수 있지만 이 코드는 그렇지 않다.
- project_context: 장바구니, 학습 기록, 로그 목록처럼 object가 리스트 상태를 가질 수 있다.

## PYF95_A5_OOP_027_ATTRIBUTE_DICT
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: attribute가 dict일 때
- question_type: output_prediction
- concepts: ["def","function","class","print","attribute","dict","__init__"]
- reading_goal: dict attribute를 만든 뒤 key로 값을 꺼내는 흐름을 읽는다.
- code:
```python
class Profile:
    def __init__(self):
        self.data = {"level": 3}

p = Profile()
print(p.data["level"])
```
- question: 출력 결과는?
- answer: 3
- explanation: p.data는 dict이고 level key의 값은 3이다. 따라서 결과는 3이다.
- project_context: object 안에 메타데이터 dict를 넣어 관리하는 코드를 이해하는 데 필요하다.

## PYF95_A5_OOP_028_OBJECT_REPR_TYPE
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: object 자체를 출력할 때의 핵심
- question_type: concept_reading
- concepts: ["print","object","repr","class"]
- reading_goal: object 자체 출력은 사람이 원하는 설명과 다를 수 있음을 개념적으로 판단한다.
- code:
```python
class Dog:
    pass

pet = Dog()
print(pet)
```
- question: __str__이나 __repr__을 정의하지 않은 pet의 기본 출력에 대한 설명으로 맞는 것은?
- answer: 보통 class 단서와 식별 정보 형태는 보이지만 의미 있는 상태 설명은 보장되지 않는다
- explanation: 기본 object 표현은 보통 class 이름과 실행 중 식별 정보가 섞인 <... object at ...> 형태다. 정확한 주소 문자열은 실행마다 달라질 수 있고 attribute 의미를 자동으로 설명하지 않는다. 사람이 읽을 표현이 필요하면 __repr__ 또는 __str__을 목적에 맞게 정의하되 비밀값은 포함하지 않는다.
- project_context: 실전에서는 __repr__ 같은 표현 method를 따로 만들기도 한다.

## PYF95_A5_OOP_029_CHOOSE_ATTRIBUTE
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: attribute 설명 고르기
- question_type: concept_reading
- concepts: ["attribute","object","dot"]
- reading_goal: 점 표기법에서 object와 attribute를 구분한다.
- code:
```python
student.score = 90
```
- question: 이 코드에서 score는 무엇으로 보는 것이 가장 알맞은가?
- answer: student object의 attribute
- explanation: student.score에서 score는 student object에 붙은 attribute다.
- project_context: object의 상태 값을 읽거나 바꾸는 코드를 이해하는 기본이다.

## PYF95_A5_OOP_030_CHOOSE_METHOD
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: method 설명 고르기
- question_type: concept_reading
- concepts: ["method","object","dot"]
- reading_goal: 점 표기법으로 호출되는 method를 설명 수준에서 구분한다.
- code:
```python
student.study()
```
- question: 이 코드에서 study는 무엇으로 보는 것이 가장 알맞은가?
- answer: student object가 호출하는 method
- explanation: student.study()는 student object의 study method를 호출하는 형태다.
- project_context: object가 가진 동작을 읽는 데 필요한 기본 개념이다.

## PYF95_A5_OOP_031_CHOOSE_INIT
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: __init__ 역할 고르기
- question_type: concept_reading
- concepts: ["def","function","__init__","attribute","self"]
- reading_goal: __init__이 object 초기 상태를 준비하는 특별한 method임을 판단한다.
- code:
```python
def __init__(self, name):
    self.name = name
```
- question: __init__의 역할로 가장 알맞은 것은?
- answer: instance가 만들어진 뒤 초기 attribute를 설정한다
- explanation: __init__은 __new__가 instance를 만든 뒤 호출되어 전달받은 값으로 초기 상태를 설정한다. 보통 self에 attribute를 저장하며 None을 반환해야 한다. instance 자체를 만드는 단계와 초기화 단계를 완전히 같은 것으로 보면 안 된다.
- project_context: class 기반 코드를 읽을 때 생성 시점의 흐름을 파악하는 데 중요하다.

## PYF95_A5_OOP_032_CHOOSE_CLASS_FLOW
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: 객체 코드 읽는 순서 고르기
- question_type: concept_reading
- concepts: ["def","function","print","class","object flow","attribute"]
- reading_goal: class 기반 코드의 큰 실행 흐름을 생성과 사용 순서로 정리한다.
- code:
```python
class User:
    def __init__(self, name):
        self.name = name

u = User("Mina")
print(u.name)
```
- question: 이 코드를 읽는 순서로 가장 알맞은 것은?
- answer: class 정의 확인 → object 생성 → attribute 출력
- explanation: 먼저 class 문이 실행되어 User가 정의된다. User('Mina') 호출은 instance를 만들고 __init__에서 self.name을 설정한 뒤 u에 연결한다. 마지막 print가 u.name을 읽어 Mina를 출력한다. 정의, instance 생성·초기화, attribute 읽기를 순서대로 구분한다.
- project_context: 긴 객체지향 코드를 읽을 때 전체 흐름을 잡는 기준이 된다.

## PY104_L04_ASSERT_BASIC_001
- level: 4
- file: python_foundation_micro_gaps_v104_a1.json
- title: assert로 기대값 확인하기
- question_type: meaning_choice
- concepts: ["print","assert","test","validation"]
- reading_goal: assert는 조건이 True인지 확인하고 False이면 실패시키는 간단한 검증 문장임을 읽는다.
- code:
```python
total = 2 + 3
assert total == 5
print('ok')
```
- question: 이 코드에서 assert 조건이 True이면 어떤 흐름이 될까?
- answer: 그 다음 줄로 넘어가 ok가 출력된다
- explanation: total == 5가 True라 assert는 조용히 통과하고 다음 줄이 ok를 출력한다. assert는 개발 중 내부 가정과 테스트를 확인하는 데 적합하지만 Python 최적화 옵션에서 제거될 수 있다. 사용자 입력 검증이나 반드시 실행되어야 하는 보안·업무 규칙에는 if와 명시적 예외를 사용해야 한다.
- project_context: 카드 데이터나 검증 스크립트를 수정한 뒤 expected count가 맞는지 확인할 때 assert와 비슷한 사고방식이 필요하다.

## PY104_L04_EXCEPTION_KEYERROR_001
- level: 4
- file: python_foundation_micro_gaps_v104_a1.json
- title: KeyError는 dict에 없는 key를 바로 읽을 때 난다
- question_type: meaning_choice
- concepts: ["print","KeyError","dict","get"]
- reading_goal: KeyError가 딕셔너리에 없는 key를 대괄호로 읽을 때 발생할 수 있음을 이해한다.
- code:
```python
user = {'name': 'Mina'}
print(user['age'])
```
- question: 이 코드가 실패하는 이유로 맞는 것은?
- answer: age key가 user 딕셔너리에 없기 때문이다
- explanation: user에는 name key만 있어 user['age'] 조회가 KeyError를 발생시킨다. age가 반드시 있어야 한다면 대괄호 접근으로 데이터 결함을 드러내는 것이 맞을 수 있다. 선택 필드라면 get으로 명시적 기본값을 쓰되, key 누락과 실제 None 값을 구분해야 하는지도 계약에 포함한다.
- project_context: JSON, 설정 파일, API 응답을 다루는 프로젝트에서는 없는 key를 바로 읽는 코드가 자주 실패 원인이 된다.

## PY104_L04_EXCEPTION_RAISE_001
- level: 4
- file: python_foundation_micro_gaps_v104_a1.json
- title: raise로 직접 오류 발생시키기
- question_type: meaning_choice
- concepts: ["if","raise","exception","validation"]
- reading_goal: raise는 문제가 발견됐을 때 일부러 예외를 발생시켜 흐름을 멈추는 명령이라는 점을 읽는다.
- code:
```python
score = -1
if score < 0:
    raise ValueError('score must be non-negative')
```
- question: 이 코드에서 score가 -1이면 어떤 일이 일어날까?
- answer: ValueError가 발생한다
- explanation: score < 0이 참이므로 raise가 ValueError를 명시적으로 발생시키고 정상 흐름을 중단한다. 메시지의 non-negative는 조건과 일치해 0은 허용하고 음수만 거부한다. 호출자가 이 예외를 잡지 않으면 traceback과 함께 프로그램 밖으로 전파된다.
- project_context: 검증 스크립트에서 조건이 맞지 않으면 raise SystemExit 또는 raise ValueError로 작업을 멈추는 패턴을 자주 보게 된다.

## PY104_L04_EXCEPTION_TYPEERROR_001
- level: 4
- file: python_foundation_micro_gaps_v104_a1.json
- title: TypeError는 값의 종류가 맞지 않을 때 난다
- question_type: meaning_choice
- concepts: ["print","TypeError","type","exception"]
- reading_goal: TypeError가 자료형이나 연산 방식이 맞지 않을 때 발생한다는 뜻을 읽는다.
- code:
```python
age = 10
message = 'age: ' + age
print(message)
```
- question: 이 코드가 실패한다면 가장 가까운 이유는 무엇일까?
- answer: 문자열과 숫자를 그대로 더하려 했기 때문이다
- explanation: TypeError는 값의 종류나 사용 방식이 맞지 않을 때 자주 발생한다. 이 예제에서는 문자열과 정수를 +로 바로 붙이려 해서 문제가 된다. 해결하려면 str(age)처럼 숫자를 문자열로 바꾸거나 f-string을 사용할 수 있다. 오류 이름만 외우기보다 ‘이 연산이 이 자료형에 가능한가’를 확인하는 것이 중요하다. TypeError를 보면 변수의 실제 자료형, 함수에 넘긴 인자 종류, 연산자 양쪽 값을 먼저 확인한다.
- project_context: 실제 코드에서 API 응답, 사용자 입력, JSON 값은 예상과 다른 자료형일 수 있어서 TypeError 독해가 중요하다.

## PY104_L04_PYTEST_EXPECTED_ACTUAL_001
- level: 4
- file: python_foundation_micro_gaps_v104_a1.json
- title: expected와 actual 나누어 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","pytest","expected","actual","assert"]
- reading_goal: 테스트에서 기대값 expected와 실제 결과 actual을 분리해 비교하는 방식을 읽는다.
- code:
```python
def double(x):
    return x * 2

actual = double(4)
expected = 8
assert actual == expected
```
- question: 이 코드에서 actual의 의미로 가장 알맞은 것은?
- answer: 함수를 실행해서 실제로 나온 값
- explanation: 테스트 코드는 보통 실제 결과 actual과 기대값 expected를 비교한다. actual은 함수를 실행해서 나온 값이고 expected는 우리가 맞다고 생각하는 값이다. assert actual == expected는 두 값이 같아야 통과한다는 뜻이다. 이렇게 나누어 쓰면 테스트가 실패했을 때 실제 결과가 틀린 것인지, 기대값을 잘못 적은 것인지 더 쉽게 확인할 수 있다. 초급자에게는 테스트를 읽는 가장 중요한 기준점이다.
- project_context: 학습 앱의 카드 수, 정답 위치, 파일 참조 개수도 expected와 actual을 나누어 비교하면 안정적으로 검증할 수 있다.

## PY104_L04_PYTEST_TEST_FUNCTION_001
- level: 4
- file: python_foundation_micro_gaps_v104_a1.json
- title: pytest는 test_ 함수 안의 assert를 실행한다
- question_type: meaning_choice
- concepts: ["def","function","return","pytest","assert","test function"]
- reading_goal: pytest가 test_로 시작하는 함수를 찾아 assert 검증을 실행한다는 흐름을 읽는다.
- code:
```python
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5
```
- question: pytest가 이 파일을 검사할 때 핵심으로 실행할 함수는 무엇일까?
- answer: test_add
- explanation: pytest의 기본 발견 규칙에서는 test_로 시작하는 함수가 테스트 후보이므로 test_add가 실행되고 add는 그 테스트가 호출하는 기능 함수다. assert가 거짓이면 테스트가 실패한다. 파일 이름과 class 이름 등 다른 발견 규칙도 있으며 pytest 설정으로 바뀔 수 있으므로 'test_면 언제나 어디서든 실행된다'는 뜻은 아니다.
- project_context: 프로젝트에서 검증 스크립트를 자동화할 때 pytest는 작은 함수 단위로 회귀를 막는 기본 도구가 될 수 있다.

## PY104_L04_REGRESSION_CHECK_001
- level: 4
- file: python_foundation_micro_gaps_v104_a1.json
- title: 회귀 테스트는 고친 뒤 다시 깨지지 않았는지 본다
- question_type: meaning_choice
- concepts: ["regression test","validation","pytest"]
- reading_goal: 회귀 테스트가 이전에 되던 기능이 수정 뒤에도 유지되는지 확인하는 검증이라는 점을 이해한다.
- code:
```python
before = 1592
after = 1604
assert after >= before
```
- question: 이 검증이 확인하려는 생각과 가장 가까운 것은?
- answer: 수정 뒤 카드 수가 줄어드는 실수를 막는다
- explanation: 이 assert는 after가 before보다 작아지는 경우만 막아 카드 수 감소를 감지한다. 회귀 테스트는 이전에 보장하던 동작이 변경 뒤에도 유지되는지 확인하는 안전망이지만, 개수가 유지된다고 내용·ID·정답이 올바른 것은 아니다. 실제 검증에는 schema, 고유 ID, 참조와 대표 동작 테스트도 함께 필요하다.
- project_context: 이 프로젝트에서 매번 validate_lessons와 browser smoke를 돌리는 것도 일종의 회귀 확인 루틴이다.

## PY104_L04_TRACEBACK_LAST_LINE_001
- level: 4
- file: python_foundation_micro_gaps_v104_a1.json
- title: traceback 마지막 줄에서 오류 종류 읽기
- question_type: meaning_choice
- concepts: ["print","traceback","error message","debugging"]
- reading_goal: traceback을 볼 때 마지막 줄의 오류 종류와 메시지를 먼저 확인하는 습관을 익힌다.
- code:
```python
Traceback (most recent call last):
  File "app.py", line 2, in <module>
    print(user['age'])
KeyError: 'age'
```
- question: 이 traceback에서 가장 먼저 확인할 핵심은 무엇일까?
- answer: KeyError: 'age'
- explanation: 마지막 줄 KeyError: 'age'는 예외 종류와 메시지를 알려 주므로 좋은 출발점이다. 그다음 바로 위 frame의 app.py 2줄에서 어떤 표현이 age를 조회했는지 확인한다. 호출이 여러 단계라면 마지막 줄만 보고 끝내지 말고 traceback의 frame을 아래에서 위로 따라 실제 입력 경로와 원인을 찾는다.
- project_context: 실제 개발에서는 긴 로그가 나와도 마지막 오류 줄과 그 바로 위 코드 줄을 먼저 보는 습관이 문제 해결 시간을 줄인다.

## PY114_L04_MODULE_NOT_FOUND_MEANING_001
- level: 4
- file: python_import_debug_beginner_v114_a1.json
- title: ModuleNotFoundError 뜻 읽기
- question_type: multiple_choice
- concepts: ["ModuleNotFoundError","import","requests"]
- reading_goal: ModuleNotFoundError가 Python이 모듈 이름을 찾지 못했다는 뜻임을 읽는다.
- code:
```python
ModuleNotFoundError: No module named 'requests'
```
- question: 이 오류가 가장 직접적으로 말하는 것은?
- answer: requests 모듈을 찾지 못했다
- explanation: ModuleNotFoundError는 import하려는 이름을 Python이 찾지 못했다는 뜻이다. 설치 여부와 실행 환경을 먼저 확인해야 한다.
- project_context: 처음 라이브러리 설치 후 import가 안 될 때 가장 자주 만나는 오류다.

## PY114_L04_PIP_ENV_MISMATCH_001
- level: 4
- file: python_import_debug_beginner_v114_a1.json
- title: pip 설치와 실행 환경 불일치
- question_type: multiple_choice
- concepts: ["comment","pip","venv","python -m pip","ModuleNotFoundError"]
- reading_goal: 설치한 pip와 실행한 Python 환경이 다르면 import가 실패할 수 있음을 읽는다.
- code:
```python
pip install requests
python app.py
# ModuleNotFoundError: No module named 'requests'
```
- question: 다음에 가장 먼저 의심할 만한 것은?
- answer: 설치한 환경과 실행한 환경 불일치
- explanation: pip로 설치했어도 다른 Python이나 다른 가상환경으로 실행하면 import가 실패한다. python -m pip로 현재 Python 기준 설치를 확인하는 게 안전하다. 따라서 정답은 ‘설치한 환경과 실행한 환경 불일치’이다.
- project_context: 여러 프로젝트와 가상환경을 오갈 때 가장 흔한 import 오류 원인이다.

## PY114_L04_PYTHON_M_PIP_SHOW_001
- level: 4
- file: python_import_debug_beginner_v114_a1.json
- title: python -m pip show 읽기
- question_type: multiple_choice
- concepts: ["python -m pip","pip show","venv","requests"]
- reading_goal: python -m pip show가 현재 Python 환경 기준 설치 여부를 확인한다는 점을 읽는다.
- code:
```python
python -m pip show requests
```
- question: 이 명령으로 확인하려는 것은?
- answer: 현재 Python 환경에 requests가 설치됐는지
- explanation: python -m pip show는 현재 선택된 Python 환경에서 해당 패키지를 알고 있는지 확인한다. import 오류를 좁힐 때 유용하다.
- project_context: 설치했는데도 import가 안 될 때 환경 불일치를 확인하는 첫 명령으로 쓸 수 있다.

## PY119_L04_JSON_DECODE_ERROR_BASIC_001
- level: 4
- file: python_json_error_encoding_beginner_v119_a1.json
- title: JSONDecodeError 기본 읽기
- question_type: multiple_choice
- concepts: ["import","JSONDecodeError","json.loads","JSON syntax"]
- reading_goal: JSONDecodeError가 JSON 문법을 해석하지 못했다는 신호임을 읽는다.
- code:
```python
import json

text = '{"name": "Mina",}'
data = json.loads(text)
```
- question: 이 코드에서 JSONDecodeError가 날 수 있는 이유로 알맞은 것은?
- answer: JSON 문법에 맞지 않는 부분이 있기 때문에
- explanation: JSONDecodeError는 문자열이 JSON 문법에 맞지 않아 파싱할 수 없을 때 난다. 이 예시는 마지막 원소 뒤의 쉼표가 원인이다. 표준 JSON은 trailing comma를 허용하지 않는다.
- project_context: API 응답이나 설정 파일을 읽을 때 파싱 실패 원인을 찾는 기초 카드다.

# V356 semantic review — Level 3 chunk 3

Cards 41-60 of 206.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYV99_A1_GAP_025_SET_DISCARD_EXISTING
- level: 3
- file: python_core_gaps_v99_a1.json
- title: discard로 있는 값 제거하기
- question_type: output_prediction
- concepts: ["print","set","discard","mutation"]
- reading_goal: discard가 set 안에 있는 값을 제거하고 set 상태가 바뀌는 흐름을 읽는다.
- code:
```python
tags = {"python", "ai", "web"}
tags.discard("web")
print(sorted(tags))
```
- question: 출력 결과는?
- answer: ['ai', 'python']
- explanation: discard는 set 안에 값이 있으면 그 값을 제거하고, 값이 없어도 오류 없이 넘어간다. 이 예제에서는 web이 tags 안에 있으므로 제거되고, sorted는 출력 순서를 안정적으로 보여 주기 위해 사용된다. remove와 달리 discard는 없는 값을 지울 때도 예외를 만들지 않는다. 따라서 중복 태그나 선택 항목을 안전하게 정리할 때 자주 쓴다. 따라서 출력은 ‘['ai', 'python']’이다.
- project_context: 필요 없는 태그나 이미 제외한 항목을 set에서 안전하게 지울 때 쓴다.

## PYV99_A1_GAP_026_SET_COMPREHENSION_FILTER
- level: 3
- file: python_core_gaps_v99_a1.json
- title: 조건이 있는 set comprehension 읽기
- question_type: output_prediction
- concepts: ["print","set comprehension","if","set"]
- reading_goal: set comprehension 안의 for와 if 조건이 어떤 값만 남기는지 읽는다.
- code:
```python
nums = [1, 2, 2, 3, 4]
even = {n for n in nums if n % 2 == 0}
print(sorted(even))
```
- question: 출력 결과는?
- answer: [2, 4]
- explanation: if n % 2 == 0 조건을 통과하는 값은 2와 4다. set은 중복을 제거하므로 2는 한 번만 남는다. set comprehension은 반복문과 조건식을 써서 중복 없는 결과 집합을 만든다. 조건을 만족하는 값만 모으고 싶을 때 간결하게 쓸 수 있다.
- project_context: 중복 없는 후보 목록을 조건으로 걸러 만들 때 set comprehension을 쓸 수 있다.

## PY4_L03_append_extend_001
- level: 3
- file: python_deep_expansion_v4.json
- title: append와 extend 차이 읽기
- question_type: output_prediction
- concepts: ["print","list","append","extend"]
- reading_goal: append는 하나의 항목을 넣고, extend는 여러 항목을 펼쳐 넣는다는 차이를 읽는다.
- code:
```python
items = ["A"]
items.append(["B", "C"])
print(items)
```
- question: 출력은?
- answer: ["A", ["B", "C"]]
- explanation: append는 전달한 값을 리스트의 항목 하나로 추가한다. 리스트를 append하면 그 리스트 전체가 하나의 원소로 들어간다. extend는 리스트 안의 값들을 하나씩 펼쳐 넣는다는 점과 비교해서 읽으면 차이가 분명해진다. 따라서 출력은 ‘["A", ["B", "C"]]’이다.
- project_context: 배치 결과를 합칠 때 append/extend를 헷갈리면 중첩 리스트 버그가 난다.

## PY4_L03_dict_update_001
- level: 3
- file: python_deep_expansion_v4.json
- title: dict.update() 읽기
- question_type: output_prediction
- concepts: ["print","dict","update"]
- reading_goal: 기존 dict에 새 key-value를 덮어쓰거나 추가하는 코드를 읽는다.
- code:
```python
meta = {"source": "arXiv", "score": 0.5}
meta.update({"score": 0.9, "domain": "UAM"})
print(meta["score"])
```
- question: 출력은?
- answer: 0.9
- explanation: dict.update는 기존 dict에 새 key-value를 추가하거나 같은 key의 값을 덮어쓴다. 그래서 score 값이 0.9로 갱신된다. 같은 key가 이미 있으면 새 값으로 바뀌므로 업데이트 전후에 덮어쓰기 의도를 확인해야 한다.
- project_context: 메타데이터 보강, 설정값 병합, 기본값 덮어쓰기에 자주 보인다.

## PY4_L03_extend_001
- level: 3
- file: python_deep_expansion_v4.json
- title: extend로 리스트 펼쳐 넣기
- question_type: output_prediction
- concepts: ["print","list","extend"]
- reading_goal: extend가 다른 리스트의 원소를 현재 리스트에 이어 붙이는 코드임을 읽는다.
- code:
```python
items = ["A"]
items.extend(["B", "C"])
print(items)
```
- question: 출력은?
- answer: ["A", "B", "C"]
- explanation: extend는 전달한 반복 가능한 값의 원소를 하나씩 펼쳐 기존 리스트에 추가한다. 리스트를 이어 붙일 때 append와 다르게 동작한다. append는 리스트 자체를 한 항목으로 넣을 수 있지만 extend는 안의 원소들을 풀어서 넣는 차이가 있다. 따라서 출력은 ‘["A", "B", "C"]’이다.
- project_context: 여러 shard 결과를 하나의 리스트로 합칠 때 자주 쓰인다.

## PY4_L03_is_equal_001
- level: 3
- file: python_deep_expansion_v4.json
- title: is와 == 차이 맛보기
- question_type: meaning_choice
- concepts: ["if","print","is","equals","None"]
- reading_goal: value가 None을 가리킬 때 value is None 조건이 True가 되어 if 블록의 print가 실행되는 흐름을 읽는다.
- code:
```python
value = None
if value is None:
    print("empty")
```
- question: value is None은 무엇을 확인하는가?
- answer: 값이 None 객체인지 확인한다
- explanation: None은 값이 없음을 나타내는 특별한 객체다. 그래서 None인지 확인할 때는 값 비교 ==보다 같은 객체인지 보는 is를 보통 사용한다. is는 객체 정체성을 보는 비교라서 None 같은 싱글턴 값을 확인할 때 특히 명확하다.
- project_context: 누락값 처리와 API 응답 처리에서 매우 자주 나온다.

## PY107_A1_ENV_001_VENV_BOX
- level: 3
- file: python_dev_environment_foundation_v103_a1.json
- title: 가상환경을 도구상자로 이해하기
- question_type: concept
- concepts: ["comment","venv","virtual_environment","dependency"]
- reading_goal: python -m venv .venv 명령이 프로젝트 안에 별도 Python 패키지 환경을 준비하는 명령이라는 점을 이해한다.
- code:
```python
python -m venv .venv
# 프로젝트별 패키지 공간을 만든다
```
- question: 가상환경을 쓰는 가장 알맞은 이유는 무엇인가?
- answer: 프로젝트마다 필요한 패키지를 따로 관리하기 위해
- explanation: 가상환경은 프로젝트별 Python 실행 경로와 패키지 설치 위치를 분리한다. 컴퓨터 전체 환경에 모든 패키지를 섞지 않아 프로젝트 사이 버전 충돌을 줄이는 데 도움이 된다. 다만 운영체제 도구와 Python 자체 버전까지 모두 복제하는 상자는 아니므로, 초보자는 ‘프로젝트별 Python 패키지 도구상자’로 이해하면 정확하다.
- project_context: 프로젝트마다 패키지 버전을 분리하는 가상환경을 이해하면 재현 가능한 Python 실행 환경을 구성하고 의존성 충돌을 줄일 수 있다.

## PY107_A1_ENV_002_WHY_VENV
- level: 3
- file: python_dev_environment_foundation_v103_a1.json
- title: 왜 가상환경을 쓰는가
- question_type: concept
- concepts: ["venv","dependency_conflict","project_isolation"]
- reading_goal: A와 B 프로젝트가 서로 다른 패키지 버전을 필요로 할 때 각 프로젝트의 .venv를 분리해 충돌을 막는 이유를 이해한다.
- code:
```python
project_a/.venv  # A 프로젝트 패키지
project_b/.venv  # B 프로젝트 패키지
```
- question: A 프로젝트와 B 프로젝트가 서로 다른 패키지 버전을 필요로 할 때 가장 안전한 방법은?
- answer: 각 프로젝트에 가상환경을 따로 만든다
- explanation: A 프로젝트와 B 프로젝트가 서로 다른 패키지 버전을 필요로 할 수 있다. 각 프로젝트에 별도 .venv를 만들면 한 프로젝트에 설치한 패키지와 버전이 다른 프로젝트 환경에 섞이지 않아 충돌을 줄일 수 있다. requirements.txt 같은 의존성 목록까지 남기면 같은 환경을 다시 구성하기도 쉬워진다.
- project_context: 프로젝트마다 패키지 버전을 분리하는 가상환경을 이해하면 재현 가능한 Python 실행 환경을 구성하고 의존성 충돌을 줄일 수 있다.

## PY113_L03_SET_LOCATION_001
- level: 3
- file: python_dev_environment_practical_v113_a1.json
- title: Set-Location 의미 읽기
- question_type: multiple_choice
- concepts: ["powershell","current directory","git status"]
- reading_goal: Set-Location으로 프로젝트 폴더로 이동한 뒤 Git 명령을 실행해야 한다는 점을 읽는다.
- code:
```python
Set-Location "D:\projects\python-reading-trainer"
git status --short
```
- question: Set-Location 다음에 git status를 실행하는 이유는?
- answer: 프로젝트 폴더에서 Git 상태 확인
- explanation: git status는 현재 폴더의 저장소 상태를 본다. 그래서 먼저 Set-Location으로 프로젝트 폴더로 이동한 뒤 Git 상태를 확인해야 한다.
- project_context: 패치 전에 git status --short로 변경 파일을 확인하는 습관과 연결된다.

## PY113_L03_TERMINAL_PROMPT_001
- level: 3
- file: python_dev_environment_practical_v113_a1.json
- title: 터미널 프롬프트 읽기
- question_type: multiple_choice
- concepts: ["terminal","current directory","path"]
- reading_goal: 명령어 앞의 경로가 현재 작업 폴더를 보여 주며 상대경로의 기준이 된다는 점을 읽는다.
- code:
```python
PS D:\projects\python-reading-trainer>
python tools/validate_lessons.py
```
- question: 이 명령은 어느 폴더를 기준으로 실행될까?
- answer: D:\projects\python-reading-trainer
- explanation: 프롬프트에 보이는 경로가 현재 작업 폴더다. 이 상태에서 상대경로 명령을 실행하면 해당 폴더를 기준으로 파일을 찾고 실행한다. 따라서 정답은 ‘D:\projects\python-reading-trainer’이다.
- project_context: 검증 명령을 실행할 때 먼저 Set-Location으로 프로젝트 폴더에 들어가는 이유다.

## PY10_L03_def_return_001
- level: 3
- file: python_foundation_expansion_v10.json
- title: def와 return 읽기
- question_type: output_prediction
- concepts: ["print","function","def","return"]
- reading_goal: 함수 정의, 인자 전달, return 값을 함께 읽는다.
- code:
```python
def add(a, b):
    return a + b

print(add(2, 3))
```
- question: 출력은?
- answer: 5
- explanation: def는 함수를 정의하고 return은 계산 결과를 호출한 곳으로 돌려준다. add(2, 3)은 2+3을 계산해 5를 반환한다. 함수 호출식은 return 값을 하나의 값처럼 바꾸어 생각하면 print나 다른 계산에 이어 붙여 읽기 쉽다.
- project_context: 프로젝트 코드는 함수 단위로 쪼개져 있으므로 핵심 기초다.

## PY10_L03_for_list_001
- level: 3
- file: python_foundation_expansion_v10.json
- title: 리스트 순회 읽기
- question_type: output_prediction
- concepts: ["print","for","list","loop"]
- reading_goal: 리스트의 각 값을 하나씩 꺼내 처리하는 코드를 읽는다.
- code:
```python
values = [10, 20, 30]
for value in values:
    print(value + 1)
```
- question: 처음 출력되는 값은?
- answer: 11
- explanation: for 반복문은 리스트의 값을 앞에서부터 하나씩 꺼내 실행한다. 첫 번째 value는 10이고 여기에 1을 더해 11을 출력한다. 반복문 문제는 리스트의 첫 값, 현재 변수 이름, 반복마다 실행되는 계산을 차례대로 보면 된다.
- project_context: 파일 목록, 카드 목록, 검색 결과를 처리하는 기본 구조다.

## PY10_L03_range_loop_001
- level: 3
- file: python_foundation_expansion_v10.json
- title: range 반복 읽기
- question_type: output_prediction
- concepts: ["print","for","range","loop"]
- reading_goal: range(3)이 0, 1, 2를 만들고 for가 그 값을 i에 하나씩 넣어 세 번 출력한 뒤 멈추는 흐름을 읽는다.
- code:
```python
for i in range(3):
    print(i)
```
- question: 출력 흐름은?
- answer: 0 1 2
- explanation: range(3)은 0, 1, 2를 차례대로 만든다. for 반복문은 이 값을 하나씩 꺼내며 같은 코드 블록을 세 번 실행한다. range의 끝값 3은 포함되지 않으므로 출력 개수를 먼저 세어 보면 반복 흐름을 놓치지 않는다.
- project_context: 샤드 번호, 반복 처리, 목록 순회 이해에 필요하다.

## PYF95_A1_FUNC_001_DEF_CALL_PRINT
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수 정의 후 호출 출력
- question_type: output_prediction
- concepts: ["function","def","function call","print"]
- reading_goal: def로 만든 함수가 호출될 때 함수 안의 print가 실행되는 흐름을 읽는다.
- code:
```python
def hello():
    print("hi")

hello()
```
- question: 출력 결과로 맞는 것은?
- answer: hi
- explanation: def hello():는 함수 본문을 정의할 뿐 그 자리에서 출력하지 않는다. 마지막 줄 hello()가 함수를 호출하면 본문으로 들어가 print("hi")가 실행되어 화면에 hi가 보인다. 문자열을 감싼 따옴표는 코드 문법이므로 출력에는 포함되지 않는다.
- project_context: 함수 호출은 반복되는 처리 규칙을 이름으로 묶어 프로젝트 코드의 흐름을 읽기 쉽게 만든다.

## PYF95_A1_FUNC_002_DEF_NOT_CALLED
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 정의만 있고 호출이 없는 함수
- question_type: output_prediction
- concepts: ["function","print","def","function call"]
- reading_goal: def hello()가 함수 본문을 정의하기만 하고 hello() 호출이 없으면 내부 print가 실행되지 않는다는 점을 읽는다.
- code:
```python
def hello():
    print("hi")
```
- question: 이 코드를 실행했을 때 맞는 설명은?
- answer: 아무것도 출력되지 않는다
- explanation: def hello(): 줄은 hello라는 함수를 정의하지만 그 자리에서 함수 본문을 실행하지 않는다. 이 코드에는 이후 hello() 호출이 없으므로 본문의 print("hi")에 도달하지 않는다. 따라서 프로그램을 실행해도 화면에는 아무것도 출력되지 않는다.
- project_context: 큰 코드 파일에서 함수 정의가 많이 보여도 실제 실행 지점은 호출 흐름에서 따로 찾아야 한다.

## PYF95_A1_FUNC_003_RETURN_ASSIGN
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: return 값을 변수에 저장하기
- question_type: output_prediction
- concepts: ["function","print","def","return","parameter","argument"]
- reading_goal: 함수 호출에 넣은 argument가 parameter에 들어가고 return 값이 변수에 저장되는 흐름을 읽는다.
- code:
```python
def double(n):
    return n * 2

result = double(4)
print(result)
```
- question: 출력 결과는?
- answer: 8
- explanation: double(4)를 호출하면 argument 4가 parameter n에 들어간다. 함수 안에서 4 * 2를 계산해 8을 return하고, 그 반환값 8이 result에 저장된다. 마지막 print(result)가 8을 출력한다.
- project_context: 계산 함수를 읽을 때는 입력값, 계산식, 반환값, 반환값을 사용하는 위치를 연결해서 추적해야 한다.

## PYF95_A1_FUNC_004_PARAM_STRING
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 문자열 parameter 사용하기
- question_type: output_prediction
- concepts: ["def","function","print","parameter","argument","return","str"]
- reading_goal: 문자열 argument가 parameter 이름으로 함수 안에 들어가고 return 되는 과정을 읽는다.
- code:
```python
def greet(name):
    return "Hi " + name

print(greet("Mina"))
```
- question: 출력 결과는?
- answer: Hi Mina
- explanation: greet("Mina")를 호출하면 문자열 Mina가 parameter name에 들어간다. 함수 안에서 "Hi "와 name의 현재 값 Mina를 이어 붙여 "Hi Mina"를 return한다. 바깥 print가 그 반환값을 받아 Hi Mina를 출력한다.
- project_context: 사용자 이름, 파일명, 카드 제목처럼 문자열을 함수로 가공하는 코드는 실전 프로젝트에서 자주 등장한다.

## PYF95_A1_FUNC_005_TWO_ARGUMENTS
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 두 argument 더하기
- question_type: output_prediction
- concepts: ["def","function","print","parameter","argument","return","int"]
- reading_goal: 두 argument가 parameter a와 b에 순서대로 연결되고 return 결과가 출력되는 흐름을 읽는다.
- code:
```python
def add(a, b):
    return a + b

print(add(2, 5))
```
- question: 출력 결과는?
- answer: 7
- explanation: add(2, 5)를 호출하면 첫 argument 2는 a에, 둘째 argument 5는 b에 들어간다. 함수는 a + b, 즉 2 + 5를 계산해 7을 return한다. 바깥 print가 반환값 7을 출력한다.
- project_context: 여러 입력값을 받아 하나의 결과를 만드는 함수는 점수 계산과 비용 계산 코드에서 기본 부품이 된다.

## PYF95_A1_FUNC_006_CALL_TWICE
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 같은 함수 두 번 호출하기
- question_type: output_prediction
- concepts: ["def","function","print","function call","return","argument"]
- reading_goal: 같은 함수가 서로 다른 argument로 여러 번 호출될 때 각 호출을 독립적으로 따라간다.
- code:
```python
def double(n):
    return n * 2

print(double(3))
print(double(5))
```
- question: 출력 순서로 맞는 것은?
- answer: 6 다음 10
- explanation: 첫 호출 double(3)은 n에 3을 넣어 6을 반환하고 첫 print가 6을 출력한다. 다음 호출 double(5)는 10을 반환해 둘째 print가 10을 출력한다. 두 호출의 지역 parameter 값은 서로 독립적이다.
- project_context: 재사용 가능한 함수는 같은 규칙을 여러 데이터에 적용하는 프로젝트 코드의 핵심 구조다.

## PYF95_A1_FUNC_007_PRINT_VS_RETURN_NONE
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: print만 있는 함수의 반환값
- question_type: output_prediction
- concepts: ["def","function","print","return","None","function call"]
- reading_goal: 함수 안 print와 return 없는 함수 호출 결과 None을 구분해 출력 흐름을 읽는다.
- code:
```python
def show():
    print("A")

result = show()
print(result)
```
- question: 출력 흐름으로 맞는 것은?
- answer: A 다음 None
- explanation: show()가 A를 출력하고 return이 없어서 result에는 None이 들어간다. 따라서 출력 순서는 ‘A 다음 None’이다.
- project_context: 실전 디버깅에서는 화면에 보인 값과 변수에 저장된 값을 구분해야 함수 결과를 제대로 추적할 수 있다.

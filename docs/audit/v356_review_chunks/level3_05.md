# V356 semantic review — Level 3 chunk 5

Cards 81-100 of 206.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYF95_A1_FUNC_028_FUNCTION_NAME_MEANING
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수 이름으로 역할 추정하기
- question_type: concept_reading
- concepts: ["def","function","print","function contract","strip","lower","return"]
- reading_goal: 함수 이름과 본문을 함께 보고 입력, 처리, 출력 약속을 추정하는 연습을 한다.
- code:
```python
def normalize(text):
    return text.strip().lower()

print(normalize(" YES "))
```
- question: 함수 normalize의 역할로 가장 알맞은 것은?
- answer: 문자열을 정리해 비교하기 쉽게 만든다
- explanation: normalize는 문자열을 비교하거나 저장하기 전에 모양을 일정하게 정리하는 함수다. 입력 text에 strip()을 적용해 앞뒤 공백을 없애고 lower()로 소문자로 바꾼 뒤 새 문자열을 return한다. 예시 호출 normalize(" YES ")의 반환값은 "yes"이므로 ‘문자열을 정리해 비교하기 쉽게 만든다’가 가장 알맞다.
- project_context: 프로젝트 코드에서는 함수 이름이 전체 처리 흐름을 이해하는 중요한 단서가 된다.

## PYF95_A1_FUNC_029_CALL_ORDER
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 호출 순서대로 출력 읽기
- question_type: output_prediction
- concepts: ["def","function","print","return","function call"]
- reading_goal: 함수 안 print가 먼저 실행되고 return 값이 바깥 print에 의해 다시 출력되는 순서를 읽는다.
- code:
```python
def mark(text):
    print("start")
    return text

print(mark("A"))
```
- question: 출력 순서로 맞는 것은?
- answer: start 다음 A
- explanation: 바깥 print가 결과를 출력하려면 먼저 argument인 mark("A")를 계산해야 한다. mark 본문의 print가 start를 먼저 출력하고 A를 반환한 뒤, 바깥 print가 그 반환값 A를 출력한다.
- project_context: 함수 호출이 print의 괄호 안에 들어가면 안쪽 함수 실행과 바깥 출력 순서를 구분해야 한다.

## PYF95_A1_FUNC_030_RETURN_LIST_LENGTH_AFTER_CALL
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수 결과를 len에 넣기
- question_type: output_prediction
- concepts: ["def","function","print","return","list","len","function call"]
- reading_goal: 함수가 반환한 리스트가 len의 입력으로 다시 사용되는 흐름을 읽는다.
- code:
```python
def words():
    return ["a", "b", "c"]

print(len(words()))
```
- question: 출력 결과는?
- answer: 3
- explanation: print의 안쪽부터 계산하면 words()가 먼저 실행되어 ['a', 'b', 'c']를 return한다. 그 반환 리스트가 len의 입력이 되고 항목이 세 개이므로 len(...)은 3이다. 가장 바깥 print가 최종 값 3을 출력한다.
- project_context: 함수 결과를 다른 내장 함수에 바로 넣는 코드는 데이터 처리와 검증 코드에서 자주 등장한다.

## PYF95_A1_FUNC_031_FUNCTION_WITH_RANGE
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수 안 range 반복
- question_type: output_prediction
- concepts: ["def","function","print","range","for","return","local variable"]
- reading_goal: 함수 안에서 range(n)이 n번 반복되고 count가 반복 횟수만큼 증가하는 흐름을 읽는다.
- code:
```python
def repeat_count(n):
    count = 0
    for i in range(n):
        count = count + 1
    return count

print(repeat_count(4))
```
- question: 출력 결과는?
- answer: 4
- explanation: repeat_count(4)를 호출하면 count는 0에서 시작한다. range(4)는 0, 1, 2, 3 네 값을 만들어 반복문이 네 번 실행되고, 실행할 때마다 count가 1씩 늘어 0 → 1 → 2 → 3 → 4가 된다. 함수가 4를 return하고 바깥 print가 4를 출력한다.
- project_context: 반복 횟수를 parameter로 받아 처리하는 함수는 테스트, 샘플 생성, 배치 처리 코드에서 자주 쓰인다.

## PYF95_A1_FUNC_032_FUNCTION_CONTRACT_READING
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수 입력과 출력 고르기
- question_type: concept_reading
- concepts: ["def","function","function contract","parameter","return","str"]
- reading_goal: 함수 본문 전체를 입력, 처리, 출력 약속으로 요약하는 연습을 한다.
- code:
```python
def make_title(name):
    clean = name.strip().title()
    return "Title: " + clean
```
- question: 이 함수의 입력과 출력 설명으로 가장 알맞은 것은?
- answer: 문자열 name을 받아 정리한 제목 문자열을 반환한다
- explanation: make_title은 name 문자열을 입력으로 받는다. strip()으로 양쪽 공백을 제거하고 title()로 각 단어의 첫 글자를 대문자 형태로 바꾼 뒤, 앞에 Title: 을 붙인 새 문자열을 반환한다. 화면 출력은 하지 않으며 호출한 쪽이 반환값을 사용할 수 있다.
- project_context: 긴 프로젝트 코드에서는 함수 하나하나를 계약처럼 요약해야 전체 데이터 흐름을 빠르게 파악할 수 있다.

## PYF95_A2_DTS_001_DICT_READ_KEY
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: dict에서 key로 값 읽기
- question_type: output_prediction
- concepts: ["print","dict","key","value"]
- reading_goal: dict에서 문자열 key를 사용해 연결된 value를 꺼내는 흐름을 읽는다.
- code:
```python
user = {"name": "Mina", "age": 13}
print(user["name"])
```
- question: 출력 결과는?
- answer: Mina
- explanation: user['name']은 name key에 연결된 value인 Mina를 꺼낸다. dict는 먼저 사용한 key를 확인하고 그 key에 연결된 value가 읽히는지, 새 값으로 바뀌는지, 반복 대상으로 쓰이는지를 순서대로 보면 결과를 정확히 추적할 수 있다.
- project_context: 사용자 정보, 설정값, 카드 메타데이터는 dict 형태로 자주 표현된다.

## PYF95_A2_DTS_002_DICT_READ_NUMBER
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: 숫자 value 읽기
- question_type: output_prediction
- concepts: ["print","dict","key","value","int"]
- reading_goal: dict의 key와 숫자 value를 구분하고, 선택한 key에 맞는 값을 출력하는 흐름을 읽는다.
- code:
```python
score = {"math": 90, "eng": 80}
print(score["eng"])
```
- question: 출력 결과는?
- answer: 80
- explanation: eng key에 연결된 값은 80이다. dict는 먼저 사용한 key를 확인하고 그 key에 연결된 value가 읽히는지, 새 값으로 바뀌는지, 반복 대상으로 쓰이는지를 순서대로 보면 결과를 정확히 추적할 수 있다.
- project_context: 점수표나 통계 데이터는 이름 key와 숫자 value의 dict로 자주 저장된다.

## PYF95_A2_DTS_003_DICT_UPDATE_EXISTING
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: 기존 key 값 바꾸기
- question_type: output_prediction
- concepts: ["print","dict","assignment","update"]
- reading_goal: 이미 있는 key에 새 값을 대입하면 value가 바뀌는 흐름을 읽는다.
- code:
```python
user = {"level": 2}
user["level"] = 3
print(user["level"])
```
- question: 출력 결과는?
- answer: 3
- explanation: level key의 값이 2에서 3으로 바뀐다. dict는 먼저 사용한 key를 확인하고 그 key에 연결된 value가 읽히는지, 새 값으로 바뀌는지, 반복 대상으로 쓰이는지를 순서대로 보면 결과를 정확히 추적할 수 있다.
- project_context: 학습 단계, 진행 상태, 설정값은 dict에서 갱신되는 경우가 많다.

## PYF95_A2_DTS_004_DICT_ADD_NEW_KEY
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: 새 key 추가하기
- question_type: output_prediction
- concepts: ["print","dict","assignment","key"]
- reading_goal: 없는 key에 대입하면 새 항목이 추가되고, 그 key로 다시 값을 꺼낼 수 있음을 읽는다.
- code:
```python
user = {"name": "Mina"}
user["city"] = "Seoul"
print(user["city"])
```
- question: 출력 결과는?
- answer: Seoul
- explanation: city key가 새로 추가되고 value는 Seoul이다. dict는 먼저 사용한 key를 확인하고 그 key에 연결된 value가 읽히는지, 새 값으로 바뀌는지, 반복 대상으로 쓰이는지를 순서대로 보면 결과를 정확히 추적할 수 있다.
- project_context: 데이터 처리 중 새 메타데이터 필드를 붙이는 코드는 dict 추가 흐름과 연결된다.

## PYF95_A2_DTS_005_DICT_GET_EXISTING
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: get으로 있는 key 읽기
- question_type: output_prediction
- concepts: ["print","dict","get","default"]
- reading_goal: get이 key가 있을 때는 실제 value를 돌려주는 흐름을 읽는다.
- code:
```python
user = {"name": "Mina"}
print(user.get("name", "unknown"))
```
- question: 출력 결과는?
- answer: Mina
- explanation: user에는 name key가 있고 그 value는 Mina다. user.get("name", "unknown")은 먼저 name key를 찾고, key가 있으므로 기본값 unknown은 사용하지 않고 실제 value Mina를 반환한다. 마지막 print가 Mina를 출력한다.
- project_context: 안전한 설정 읽기나 누락 가능성이 있는 필드 접근에서 get이 자주 사용된다.

## PYF95_A2_DTS_006_DICT_GET_MISSING
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: get으로 없는 key 기본값 읽기
- question_type: output_prediction
- concepts: ["print","dict","get","default"]
- reading_goal: get이 key가 없을 때 오류 대신 기본값을 돌려주는 흐름을 읽는다.
- code:
```python
user = {"name": "Mina"}
print(user.get("grade", "unknown"))
```
- question: 출력 결과는?
- answer: unknown
- explanation: user에는 name key만 있고 grade key는 없다. user.get("grade", "unknown")은 grade를 찾지 못하면 두 번째 argument로 준 기본값 unknown을 반환한다. 대괄호 접근과 달리 이 경우 KeyError가 나지 않고, 마지막 print가 unknown을 출력한다.
- project_context: 불완전한 JSON이나 사용자 입력 dict를 읽을 때 기본값 처리는 매우 중요하다.

## PYF95_A2_DTS_007_DICT_KEYS_LIST
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: keys를 리스트로 보기
- question_type: output_prediction
- concepts: ["print","dict","keys","list"]
- reading_goal: dict.keys()가 key 모음을 만들고 list로 바꾸면 key 목록을 볼 수 있음을 읽는다.
- code:
```python
data = {"a": 1, "b": 2}
print(list(data.keys()))
```
- question: 출력 결과로 맞는 것은?
- answer: ['a', 'b']
- explanation: data.keys()는 value가 아니라 key만 보여 주는 view를 만들고 list()가 이를 리스트로 바꾼다. Python dict는 삽입 순서를 보존하므로 이 코드에서는 a 다음 b가 되어 ['a', 'b']가 출력된다. key를 정렬한 결과는 아니며 삽입 순서가 달라지면 출력 순서도 달라진다.
- project_context: 데이터 필드 목록을 확인하는 검증 코드에서 keys는 자주 등장한다.

## PYF95_A2_DTS_008_DICT_VALUES_LIST
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: values를 리스트로 보기
- question_type: output_prediction
- concepts: ["print","dict","values","list"]
- reading_goal: dict.values()가 value 모음을 만들고 list로 바뀌는 흐름을 읽는다.
- code:
```python
data = {"a": 1, "b": 2}
print(list(data.values()))
```
- question: 출력 결과로 맞는 것은?
- answer: [1, 2]
- explanation: data.values()는 key a와 b가 아니라 그에 연결된 value 1과 2를 dict의 삽입 순서대로 보여 주는 view를 만든다. list(...)가 그 view를 [1, 2] 리스트로 바꾸고, 마지막 print가 [1, 2]를 출력한다.
- project_context: 점수나 개수만 모아 계산하는 코드에서 values는 유용하게 쓰인다.

## PYF95_A2_DTS_009_DICT_ITEMS_LIST
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: items를 리스트로 보기
- question_type: output_prediction
- concepts: ["print","dict","items","tuple"]
- reading_goal: dict.items()가 key와 value 쌍을 tuple처럼 묶어 보여주는 흐름을 읽는다.
- code:
```python
data = {"a": 1, "b": 2}
print(list(data.items()))
```
- question: 출력 결과로 맞는 것은?
- answer: [('a', 1), ('b', 2)]
- explanation: data.items()는 각 key와 value를 2원 tuple로 짝지은 view를 만들고 list()가 이를 리스트로 바꾼다. dict의 삽입 순서가 보존되므로 이 코드의 출력은 [('a', 1), ('b', 2)]다. keys()와 values()와 달리 두 값을 함께 unpack할 때도 items()를 쓴다.
- project_context: dict를 표 형태로 출력하거나 변환할 때 items 반복은 매우 자주 사용된다.

## PYF95_A2_DTS_010_DICT_FOR_KEYS
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: dict를 for로 반복하면 key가 들어온다
- question_type: output_prediction
- concepts: ["print","dict","for","keys"]
- reading_goal: dict를 직접 for로 반복할 때 반복 변수에 key가 들어오는 흐름을 읽는다.
- code:
```python
scores = {"A": 10, "B": 20}
for name in scores:
    print(name)
```
- question: 출력 순서로 맞는 것은?
- answer: A 다음 B
- explanation: dict를 직접 반복하면 value가 아니라 key를 순회한다. Python dict는 삽입 순서를 보존하므로 이 literal에서 먼저 넣은 A가 출력되고 다음에 B가 출력된다. 알파벳순으로 자동 정렬되는 것은 아니며 정렬이 필요하면 sorted(scores)를 명시해야 한다.
- project_context: 설정 dict나 점수 dict를 반복하는 코드에서 현재 반복 값이 key인지 value인지 구분해야 한다.

## PYF95_A2_DTS_011_DICT_FOR_ITEMS
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: items로 key와 value 함께 반복하기
- question_type: output_prediction
- concepts: ["for","print","dict","items","unpacking"]
- reading_goal: items 반복에서 key와 value가 두 변수에 나누어 들어가는 흐름을 읽는다.
- code:
```python
scores = {"A": 10, "B": 20}
for name, score in scores.items():
    print(name, score)
```
- question: 첫 번째 출력으로 맞는 것은?
- answer: A 10
- explanation: 첫 쌍은 A와 10이므로 첫 출력은 A 10이다. for에서는 반복 대상에서 값이 어떤 순서로 변수에 들어오는지 보고, 각 반복에서 실행되는 계산이나 출력까지 한 번씩 적용하면 최종 결과를 안정적으로 판단할 수 있다.
- project_context: 리포트 생성이나 로그 출력에서는 key와 value를 함께 반복하는 코드가 자주 나온다.

## PYF95_A2_DTS_012_DICT_IN_KEY_TRUE
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: in은 dict에서 key를 검사한다
- question_type: output_prediction
- concepts: ["print","dict","in","key","bool"]
- reading_goal: dict에서 in 연산이 value가 아니라 key 존재 여부를 확인하는 흐름을 읽는다.
- code:
```python
user = {"name": "Mina"}
print("name" in user)
```
- question: 출력 결과는?
- answer: True
- explanation: dict에 in을 바로 사용하면 기본적으로 value가 아니라 key가 있는지 검사한다. user에는 name key가 있으므로 "name" in user가 True가 되고, 마지막 print가 Boolean 값 True를 출력한다.
- project_context: 필수 필드가 있는지 검사하는 코드는 dict membership과 연결된다.

## PYF95_A2_DTS_013_DICT_IN_VALUE_FALSE
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: value는 dict in 검사 대상이 아니다
- question_type: output_prediction
- concepts: ["print","dict","in","key"]
- reading_goal: dict에서 in이 기본적으로 key를 검사하므로 value 문자열은 False가 될 수 있음을 읽는다.
- code:
```python
user = {"name": "Mina"}
print("Mina" in user)
```
- question: 출력 결과는?
- answer: False
- explanation: user의 key는 name이고 Mina는 그 key에 연결된 value다. dict에 in을 바로 사용하면 key 존재 여부를 검사하므로 "Mina" in user는 False가 된다. value 포함 여부를 보려면 user.values()를 대상으로 검사해야 하며, 이 코드의 print는 False를 출력한다.
- project_context: 검색 조건이 key인지 value인지 혼동하면 필터링 결과를 잘못 판단할 수 있다.

## PYF95_A2_DTS_014_NESTED_DICT_READ
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: 중첩 dict 값 읽기
- question_type: output_prediction
- concepts: ["print","dict","nested dict","key"]
- reading_goal: dict 안 dict에서 바깥 key와 안쪽 key를 차례대로 따라가 값을 꺼내는 흐름을 읽는다.
- code:
```python
user = {"profile": {"city": "Seoul"}}
print(user["profile"]["city"])
```
- question: 출력 결과는?
- answer: Seoul
- explanation: 먼저 profile dict를 꺼내고 그 안에서 city 값을 꺼낸다. 따라서 출력은 ‘Seoul’이다. dict는 먼저 사용한 key를 확인하고 그 key에 연결된 value가 읽히는지, 새 값으로 바뀌는지, 반복 대상으로 쓰이는지를 순서대로 보면 결과를 정확히 추적할 수 있다.
- project_context: JSON API 응답은 중첩 dict 구조가 많기 때문에 단계별 접근이 중요하다.

## PYF95_A2_DTS_015_LIST_OF_DICTS
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: 리스트 안 dict 읽기
- question_type: output_prediction
- concepts: ["print","list","dict","index","key"]
- reading_goal: 리스트 인덱스로 dict 하나를 고른 뒤 key로 value를 꺼내는 두 단계 접근을 읽는다.
- code:
```python
users = [{"name": "A"}, {"name": "B"}]
print(users[1]["name"])
```
- question: 출력 결과는?
- answer: B
- explanation: users[1]은 두 번째 dict이고 그 name 값은 B다. dict는 먼저 사용한 key를 확인하고 그 key에 연결된 value가 읽히는지, 새 값으로 바뀌는지, 반복 대상으로 쓰이는지를 순서대로 보면 결과를 정확히 추적할 수 있다.
- project_context: 여러 카드나 사용자 목록은 list of dict 구조로 저장되는 경우가 많다.

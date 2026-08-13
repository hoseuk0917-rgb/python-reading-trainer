# V356 semantic review — Level 4 chunk 5

Cards 81-97 of 97.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY119_L04_JSON_ERROR_LOCATION_001
- level: 4
- file: python_json_error_encoding_beginner_v119_a1.json
- title: JSON 오류 위치 힌트 읽기
- question_type: multiple_choice
- concepts: ["JSONDecodeError","line","column"]
- reading_goal: JSONDecodeError 메시지의 line, column 정보가 확인 위치를 좁히는 힌트임을 이해한다.
- code:
```python
JSONDecodeError: Expecting ',' delimiter: line 3 column 5
```
- question: line 3 column 5 정보가 알려 주는 것은?
- answer: 문제를 확인할 후보 위치라는 뜻
- explanation: line과 column은 JSON 파서가 문제를 발견한 위치를 알려 준다. 그 주변의 쉼표, 따옴표, 괄호를 확인하면 된다. 오류 위치는 실제 원인 바로 뒤를 가리킬 수도 있다. 따라서 정답은 ‘문제를 확인할 후보 위치라는 뜻’이다.
- project_context: 긴 JSON 파일에서 오류 위치를 좁히는 읽기 습관을 만든다.

## PY11_L04_if_elif_001
- level: 4
- file: python_libraries_missing_topics_v11.json
- title: elif 여러 조건 읽기
- question_type: output_prediction
- concepts: ["print","if","elif","else","branch"]
- reading_goal: 여러 조건 중 처음 맞는 경로만 실행되는 코드를 읽는다.
- code:
```python
level = 8
if level <= 3:
    group = "basic"
elif level <= 7:
    group = "middle"
else:
    group = "advanced"
print(group)
```
- question: 출력은?
- answer: advanced
- explanation: if/elif/else는 여러 조건을 위에서부터 순서대로 확인한다. level 8은 앞의 두 조건에 맞지 않으므로 마지막 else 경로로 들어간다. 중요한 점은 앞 조건이 True가 되면 뒤 조건은 더 이상 보지 않는다는 것이다. 따라서 조건의 순서가 출력 결과를 바꿀 수 있다. 여러 분기 문제는 각 조건을 차례로 True/False로 적어 보며 실행되는 첫 블록을 찾으면 된다. 따라서 출력은 ‘advanced’이다.
- project_context: 레벨별 카드 분류, 모드 분기, 위험도 분류에 자주 쓰인다.

## PY11_L04_while_001
- level: 4
- file: python_libraries_missing_topics_v11.json
- title: while 반복 읽기
- question_type: output_prediction
- concepts: ["print","while","loop","counter"]
- reading_goal: while 조건이 거짓이 될 때 반복이 끝나는 코드를 읽는다.
- code:
```python
count = 0
while count < 3:
    count += 1
print(count)
```
- question: 출력은?
- answer: 3
- explanation: count는 0에서 시작한다. 조건 count < 3이 참일 때마다 1씩 증가해 1, 2, 3이 되고, 다시 조건을 검사하면 3 < 3은 False라서 반복이 끝난다. print는 반복문 밖에서 한 번만 실행되므로 최종값 3을 출력한다. while을 읽을 때는 조건에 쓰인 값이 반복 안에서 실제로 변하는지 확인해야 무한 반복 여부를 판단할 수 있다.
- project_context: 재시도, polling, queue 처리 코드에서 자주 나온다.

## PY115_L04_APPEND_SIDE_EFFECT_001
- level: 4
- file: python_mutable_default_beginner_v115_a1.json
- title: append는 기존 리스트를 바꾼다
- question_type: multiple_choice
- concepts: ["print","append","list","mutable","side effect"]
- reading_goal: append가 새 리스트를 만드는 것이 아니라 기존 리스트 내용을 바꾸는 동작임을 읽는다.
- code:
```python
items = []
items.append('a')
print(items)
```
- question: items.append('a')의 의미로 알맞은 것은?
- answer: 기존 리스트에 값을 추가한다
- explanation: append는 기존 list 객체의 내용을 바꾼다. 그래서 같은 list를 여러 곳에서 쓰고 있으면 변경 결과가 이어져 보일 수 있다. 따라서 출력은 ‘기존 리스트에 값을 추가한다’이다.
- project_context: mutable default 문제를 이해하려면 append가 기존 값을 바꾼다는 점을 먼저 알아야 한다.

## PY115_L04_DEFAULT_ARG_ONCE_001
- level: 4
- file: python_mutable_default_beginner_v115_a1.json
- title: 기본 인자가 준비되는 시점
- question_type: multiple_choice
- concepts: ["def","return","default argument","function","parameter"]
- reading_goal: 기본 인자가 함수 호출마다 새로 만들어지는 것이 아니라 함수 정의 시점에 준비될 수 있음을 읽는다.
- code:
```python
def greet(name='user'):
    return 'hi ' + name
```
- question: 기본 인자 name='user'에 대한 설명으로 알맞은 것은?
- answer: 인자를 안 주면 사용할 기본값이다
- explanation: 기본 인자 객체는 함수를 정의할 때 한 번 평가되고, 호출에서 값을 생략하면 재사용된다. 여기의 문자열은 바꿀 수 없는 객체라 안전하지만, list나 dict처럼 내용이 바뀌는 객체를 기본값으로 두면 호출 사이 상태가 남을 수 있다.
- project_context: 함수 예제에서 괄호 안에 =가 보일 때 기본값을 읽는 기초가 된다.

## PY115_L04_MUTABLE_LIST_RISK_001
- level: 4
- file: python_mutable_default_beginner_v115_a1.json
- title: list 기본 인자의 위험
- question_type: multiple_choice
- concepts: ["def","function","return","print","mutable default","list","append","function call"]
- reading_goal: list 같은 바뀌는 객체를 기본 인자로 두면 호출 사이에 값이 남을 수 있음을 읽는다.
- code:
```python
def add_item(x, items=[]):
    items.append(x)
    return items

print(add_item('a'))
print(add_item('b'))
```
- question: 이 코드에서 조심해야 할 점은?
- answer: items 리스트가 호출 사이에 공유될 수 있다
- explanation: items=[]는 함수 정의 때 한 번 만들어져 두 호출이 같은 리스트를 쓴다. 첫 호출은 ['a'], 두 번째 호출은 이미 있는 리스트에 'b'를 붙여 ['a', 'b']를 출력한다.
- project_context: 초보자가 함수 결과가 왜 누적되는지 이해할 때 중요한 함정이다.

## PY116_L04_CLASS_NOT_ALWAYS_001
- level: 4
- file: python_oop_gap_beginner_v116_a1.json
- title: class가 항상 필요한 것은 아니다
- question_type: multiple_choice
- concepts: ["def","return","function","class","design choice"]
- reading_goal: 단순한 계산은 class보다 함수로 충분할 수 있음을 읽는다.
- code:
```python
def add(a, b):
    return a + b
```
- question: 이 코드에 대한 판단으로 가장 알맞은 것은?
- answer: 단순 계산이라 함수만으로 충분할 수 있다
- explanation: class는 관련 상태와 행동을 묶을 때 유용하다. 단순히 두 값을 더하는 정도라면 함수 하나가 더 읽기 쉬울 수 있다. 데이터가 거의 없으면 과한 구조가 될 수 있다.
- project_context: 코드를 과하게 복잡하게 만들지 않는 판단 기준을 연습한다.

## PY116_L04_INSTANCE_VARIABLE_001
- level: 4
- file: python_oop_gap_beginner_v116_a1.json
- title: instance variable 읽기
- question_type: multiple_choice
- concepts: ["def","function","class","instance variable","self","object","attribute"]
- reading_goal: self.name처럼 객체마다 따로 저장되는 값을 instance variable로 읽는다.
- code:
```python
class User:
    def __init__(self, name):
        self.name = name
```
- question: self.name에 대한 설명으로 알맞은 것은?
- answer: 각 User 객체가 따로 가질 수 있는 값이다
- explanation: self.name은 만들어진 객체 안에 저장되는 값이다. 서로 다른 User 객체는 서로 다른 name 값을 가질 수 있다. 그래서 객체별 상태를 따로 기억할 수 있다.
- project_context: 사용자, 카드, 진행상태 같은 객체가 각자 다른 값을 가질 때 필요한 개념이다.

## PY116_L04_WHEN_CLASS_HELPS_001
- level: 4
- file: python_oop_gap_beginner_v116_a1.json
- title: class가 도움이 되는 경우
- question_type: multiple_choice
- concepts: ["def","function","return","class","object","method","state"]
- reading_goal: class는 관련 데이터와 행동을 함께 묶을 때 유용하다는 기준을 읽는다.
- code:
```python
class Card:
    def __init__(self, title, answer):
        self.title = title
        self.answer = answer

    def is_correct(self, choice):
        return choice == self.answer
```
- question: 이 코드에서 class Card가 하는 역할로 알맞은 것은?
- answer: 관련 데이터와 행동을 하나로 묶는다
- explanation: Card는 title과 answer라는 데이터와 is_correct라는 행동을 함께 가진다. 이런 식으로 관련된 것들을 묶을 때 class가 도움이 된다.
- project_context: 학습 카드 앱에서 카드 데이터를 객체로 묶는 이유를 읽는 데 도움이 된다.

## PY122_L04_HEAD_PREVIEW_001
- level: 4
- file: python_pandas_beginner_v122_a1.json
- title: df.head()로 앞부분 확인
- question_type: multiple_choice
- concepts: ["print","DataFrame","head","preview"]
- reading_goal: df.head()가 DataFrame의 앞부분을 보여 주어 데이터가 제대로 읽혔는지 확인하는 데 쓰임을 읽는다.
- code:
```python
df = pd.read_csv('scores.csv')
print(df.head())
```
- question: df.head()를 쓰는 이유로 알맞은 것은?
- answer: 데이터 앞부분을 빠르게 확인하기 위해
- explanation: df.head()는 DataFrame의 앞부분을 보여 준다. CSV를 읽은 직후 사용하면 실제 열 이름과 몇 개의 행이 예상한 형태로 들어왔는지 빠르게 확인할 수 있다. 따라서 이 코드에서 df.head()를 사용하는 이유는 데이터를 본격적으로 처리하기 전에 앞부분을 점검하기 위해서다.
- project_context: pandas로 읽은 데이터를 바로 처리하지 않고 먼저 확인하는 습관을 만든다.

## PY122_L04_READ_CSV_BASIC_001
- level: 4
- file: python_pandas_beginner_v122_a1.json
- title: pd.read_csv 기본 읽기
- question_type: multiple_choice
- concepts: ["import","pandas","pd.read_csv","DataFrame"]
- reading_goal: pd.read_csv()가 CSV 파일을 pandas DataFrame으로 읽는 함수임을 이해한다.
- code:
```python
import pandas as pd

df = pd.read_csv('scores.csv')
```
- question: df = pd.read_csv('scores.csv')의 역할로 알맞은 것은?
- answer: CSV 파일을 DataFrame으로 읽기 위해
- explanation: pd.read_csv()는 CSV 파일을 pandas DataFrame으로 읽는다. 이후 열 선택, 필터링, 저장 같은 표 데이터 처리를 할 수 있다.
- project_context: CSV 파일을 pandas로 읽어 표 데이터로 다루는 첫 카드다.

## PY2_L04_dict_comp_001
- level: 4
- file: python_practical_expansion_v2.json
- title: dict comprehension 읽기
- question_type: output_prediction
- concepts: ["print","dict_comprehension","dict","for"]
- reading_goal: 리스트를 key-value dict로 바꾸는 짧은 표현을 읽는다.
- code:
```python
nodes = [
    {"id": "n001", "label": "LiDAR"},
    {"id": "n002", "label": "Radar"}
]

by_id = {node["id"]: node for node in nodes}
print(by_id["n001"]["label"])
```
- question: 출력은?
- answer: LiDAR
- explanation: 딕셔너리 컴프리헨션은 반복하면서 key-value 쌍을 만든다. 이 코드는 node의 id를 key로 하고 node 전체를 value로 저장한다. 반복문으로 dict를 만드는 패턴을 한 줄로 줄인 형태라 key와 value가 무엇인지 먼저 읽어야 한다. 따라서 출력은 ‘LiDAR’이다.
- project_context: id로 노드를 빠르게 찾기 위한 인덱스 dict를 만들 때 자주 쓴다.

## PY2_L04_list_comp_001
- level: 4
- file: python_practical_expansion_v2.json
- title: list comprehension 읽기
- question_type: output_prediction
- concepts: ["print","list_comprehension","for","if","list"]
- reading_goal: 짧게 쓴 필터링 표현을 긴 for-if-append 구조로 풀어 읽는다.
- code:
```python
nodes = [
    {"label": "LiDAR", "kind": "Sensor"},
    {"label": "UAM", "kind": "System"}
]

labels = [node["label"] for node in nodes if node["kind"] == "Sensor"]
print(labels)
```
- question: 출력은?
- answer: ["LiDAR"]
- explanation: 리스트 컴프리헨션은 반복과 조건을 한 줄로 써서 새 리스트를 만드는 표현식이다. 이 코드는 nodes에서 kind가 Sensor인 항목만 고르고, 그 항목의 label 값을 새 리스트에 넣는다. 앞부분은 결과에 들어갈 값이고, 뒤쪽 for와 if는 어떤 원소를 고를지 정한다. 복잡해 보이면 일반 for문으로 풀어 써서 결과에 append되는 값을 확인하면 된다. 따라서 출력은 ‘["LiDAR"]’이다.
- project_context: 파이썬 데이터 처리 코드에서 매우 자주 보이는 압축 문법이다.

## PY124_L04_MATCH_NONE_CHECK_001
- level: 4
- file: python_regex_beginner_v124_a1.json
- title: match None 확인 후 group 읽기
- question_type: multiple_choice
- concepts: ["if","print","None","group","safe check"]
- reading_goal: re.search() 결과가 None일 수 있으므로 group() 전에 if m으로 확인하는 흐름을 읽는다.
- code:
```python
m = re.search(r'\d+', text)
if m:
    print(m.group(0))
```
- question: if m: 확인을 먼저 하는 이유로 알맞은 것은?
- answer: 매치가 없을 때 group() 오류를 줄이기 위해
- explanation: re.search()가 패턴을 찾으면 match object를 돌려주지만 찾지 못하면 None을 돌려준다. 따라서 먼저 if m:으로 실제 match object가 있는지 확인해야 한다. 이 확인 없이 m.group(0)을 호출하면 m이 None일 때 오류가 난다. 즉 if m:은 매치가 있을 때만 group을 읽도록 하는 안전 확인이다.
- project_context: 정규식 추출에서 NoneType 오류를 피하는 안전 흐름이다.

## PY124_L04_RE_SEARCH_BASIC_001
- level: 4
- file: python_regex_beginner_v124_a1.json
- title: re.search 기본 읽기
- question_type: multiple_choice
- concepts: ["import","regex","re.search","\\d"]
- reading_goal: re.search()가 문자열 안에서 정규식 패턴을 처음 찾는 함수임을 읽는다.
- code:
```python
import re

text = 'order 12345 done'
m = re.search(r'\d+', text)
```
- question: re.search(r'\d+', text)의 역할로 알맞은 것은?
- answer: 문자열 안에서 숫자 패턴을 처음 찾기 위해
- explanation: re.search()는 문자열 전체에서 패턴과 처음 맞는 부분을 찾는다. r'\d+'는 하나 이상의 숫자를 찾는 정규식 패턴이므로 주문번호나 로그 숫자 추출에 쓸 수 있다.
- project_context: 로그나 파일명에서 필요한 숫자 조각을 찾는 첫 regex 카드다.

## PY121_L04_RESPONSE_TEXT_DEBUG_001
- level: 4
- file: python_requests_api_beginner_v121_a1.json
- title: response.text로 응답 확인
- question_type: multiple_choice
- concepts: ["print","response.text","status_code","debugging"]
- reading_goal: API 응답이 예상과 다를 때 response.text 일부를 출력해 실제 응답 내용을 확인하는 흐름을 읽는다.
- code:
```python
response = requests.get(url, timeout=10)
print(response.status_code)
print(response.text[:200])
```
- question: response.text[:200]를 출력하는 이유로 알맞은 것은?
- answer: 실제 응답 내용을 일부 확인하기 위해
- explanation: response.status_code로 HTTP 상태를 먼저 확인한 뒤 response.text[:200]은 서버가 돌려준 원문 응답의 앞 200자만 보여 준다. API가 예상한 JSON 대신 오류 HTML이나 안내 문구를 돌려줬는지 빠르게 확인할 수 있어 디버깅에 유용하다. 따라서 이 줄의 목적은 실제 응답 내용을 일부 직접 확인하는 것이다.
- project_context: API가 실패했을 때 화면에 온 실제 응답을 확인하는 습관을 만든다.

## PY121_L04_STATUS_CODE_BASIC_001
- level: 4
- file: python_requests_api_beginner_v121_a1.json
- title: status_code 기본 읽기
- question_type: multiple_choice
- concepts: ["import","print","requests","status_code","HTTP"]
- reading_goal: requests 응답에서 response.status_code가 HTTP 성공과 실패를 확인하는 첫 신호임을 읽는다.
- code:
```python
import requests

response = requests.get(url, timeout=10)
print(response.status_code)
```
- question: response.status_code를 먼저 확인하는 이유로 알맞은 것은?
- answer: API 요청이 성공했는지 먼저 보기 위해
- explanation: status_code는 HTTP 응답 상태를 알려 준다. 2xx는 HTTP 수준의 성공, 4xx는 요청 쪽 문제, 5xx는 서버 쪽 문제를 나타내지만, 2xx라도 응답 데이터가 업무 규칙에 맞는지는 별도로 검증해야 한다.
- project_context: API 호출 결과를 response.json()보다 먼저 상태 코드로 확인하는 초보 카드다.

# V356 semantic review — Level 3 chunk 6

Cards 101-120 of 206.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYF95_A2_DTS_016_DICT_COUNT_PATTERN
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: dict로 개수 세기
- question_type: output_prediction
- concepts: ["print","dict","get","count"]
- reading_goal: get 기본값을 이용해 없는 key의 기존 개수를 0으로 보고 1을 더하는 흐름을 읽는다.
- code:
```python
counts = {}
word = "apple"
counts[word] = counts.get(word, 0) + 1
print(counts["apple"])
```
- question: 출력 결과는?
- answer: 1
- explanation: apple key가 없어서 get은 0을 돌려주고 1을 더해 저장한다. dict는 먼저 사용한 key를 확인하고 그 key에 연결된 value가 읽히는지, 새 값으로 바뀌는지, 반복 대상으로 쓰이는지를 순서대로 보면 결과를 정확히 추적할 수 있다.
- project_context: 단어 빈도, 개념 등장 횟수, 오류 개수 집계는 dict count 패턴으로 자주 작성된다.

## PYF95_A2_DTS_017_TUPLE_INDEX
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: tuple 인덱스로 값 읽기
- question_type: output_prediction
- concepts: ["print","tuple","index"]
- reading_goal: tuple이 순서를 가진 값 묶음이고 인덱스로 값을 꺼낼 수 있음을 읽는다.
- code:
```python
point = (3, 4)
print(point[0])
```
- question: 출력 결과는?
- answer: 결과는 3이다
- explanation: point[0]은 첫 번째 값 3이다. 따라서 결과는 3이다. tuple은 위치가 의미를 가지므로 0부터 시작하는 index와 unpacking되는 변수의 순서를 맞춰 보고, 각 위치의 값이 이후 어느 식에서 사용되는지 이어서 확인한다.
- project_context: 좌표, 범위, 쌍 데이터처럼 위치가 의미를 가지는 값은 tuple로 표현될 수 있다.

## PYF95_A2_DTS_018_TUPLE_SECOND
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: tuple 두 번째 값 읽기
- question_type: output_prediction
- concepts: ["print","tuple","index"]
- reading_goal: tuple에서 두 번째 위치의 값을 인덱스 1로 꺼내는 흐름을 읽는다.
- code:
```python
pair = ("id", 7)
print(pair[1])
```
- question: 출력 결과는?
- answer: 7
- explanation: pair[1]은 두 번째 값인 7이다. tuple은 위치가 의미를 가지므로 0부터 시작하는 index와 unpacking되는 변수의 순서를 맞춰 보고, 각 위치의 값이 이후 어느 식에서 사용되는지 이어서 확인한다.
- project_context: items 결과나 좌표 데이터는 tuple의 위치별 의미를 확인해야 한다.

## PYF95_A2_DTS_019_TUPLE_UNPACK
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: tuple unpacking
- question_type: output_prediction
- concepts: ["print","tuple","unpacking","assignment"]
- reading_goal: tuple의 두 값이 x와 y에 나누어 저장되고 계산에 쓰이는 흐름을 읽는다.
- code:
```python
point = (3, 4)
x, y = point
print(x + y)
```
- question: 출력 결과는?
- answer: 7
- explanation: x는 3, y는 4가 되어 합은 7이다. tuple은 위치가 의미를 가지므로 0부터 시작하는 index와 unpacking되는 변수의 순서를 맞춰 보고, 각 위치의 값이 이후 어느 식에서 사용되는지 이어서 확인한다.
- project_context: 함수 결과나 items 쌍을 여러 변수로 나누어 받을 때 unpacking을 이해해야 한다.

## PYF95_A2_DTS_020_RETURN_TUPLE
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: 함수가 tuple처럼 여러 값 반환하기
- question_type: output_prediction
- concepts: ["def","function","print","tuple","return","unpacking"]
- reading_goal: 함수가 여러 값을 return하면 tuple처럼 묶이고, unpacking으로 변수에 나누어 들어가는 흐름을 읽는다.
- code:
```python
def make_point():
    return 2, 5

x, y = make_point()
print(y)
```
- question: 출력 결과는?
- answer: 5
- explanation: return 2, 5는 괄호를 생략한 2원 tuple (2, 5)를 반환한다. x, y = make_point()가 두 원소를 순서대로 unpack해 x에는 2, y에는 5를 저장하므로 print(y)는 5를 출력한다. 원소 수와 변수 수가 다르면 unpacking 오류가 난다.
- project_context: 여러 결과를 함께 돌려주는 함수는 좌표, 범위, 상태값 반환에서 자주 등장한다.

## PYF95_A2_DTS_021_ITEMS_UNPACK_TUPLE
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: items 결과를 unpacking하기
- question_type: output_prediction
- concepts: ["for","print","dict","items","tuple","unpacking"]
- reading_goal: items가 만든 key-value 쌍이 반복문에서 두 변수로 나누어 들어가는 흐름을 읽는다.
- code:
```python
data = {"x": 1}
for key, value in data.items():
    print(key)
    print(value)
```
- question: 출력 순서로 맞는 것은?
- answer: x 다음 1
- explanation: data.items()의 한 항목은 ('x', 1) 형태의 2원 tuple이다. for문의 key, value가 이를 unpack해 첫 print는 x, 둘째 print는 1을 각각 새 줄에 출력한다.
- project_context: dict 변환이나 출력 코드는 items와 unpacking을 함께 쓰는 경우가 많다.

## PYF95_A2_DTS_022_SET_DEDUP
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: set으로 중복 제거하기
- question_type: output_prediction
- concepts: ["print","set","dedup","len"]
- reading_goal: list를 set으로 바꾸면 중복이 제거되고 len이 고유 값 개수를 세는 흐름을 읽는다.
- code:
```python
items = ["a", "a", "b"]
unique = set(items)
print(len(unique))
```
- question: 출력 결과는?
- answer: 2
- explanation: a와 b 두 종류만 남으므로 길이는 2다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.
- project_context: 중복 카드, 중복 사용자, 중복 태그를 줄이는 검증 코드에서 set은 자주 쓰인다.

## PYF95_A2_DTS_023_SET_IN_TRUE
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: set에서 포함 여부 확인하기
- question_type: output_prediction
- concepts: ["print","set","in","membership"]
- reading_goal: set에서 in이 값의 포함 여부를 확인하는 흐름을 읽는다.
- code:
```python
tags = {"python", "ai"}
print("python" in tags)
```
- question: 출력 결과는?
- answer: True
- explanation: python은 tags set에 들어 있으므로 True다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.
- project_context: 허용 태그, 이미 처리한 id, 방문한 노드를 검사할 때 set membership이 자주 쓰인다.

## PYF95_A2_DTS_024_SET_ADD
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: set에 값 추가하기
- question_type: output_prediction
- concepts: ["print","set","add","in"]
- reading_goal: set.add로 새 값을 추가한 뒤 포함 여부를 확인하는 흐름을 읽는다.
- code:
```python
tags = {"python"}
tags.add("ai")
print("ai" in tags)
```
- question: 출력 결과는?
- answer: True
- explanation: ai를 추가했으므로 포함 검사는 True다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.
- project_context: 처리 완료 id나 발견한 개념을 set에 추가하는 패턴은 파이프라인 코드에서 자주 쓰인다.

## PYF95_A2_DTS_025_SET_ADD_DUPLICATE
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: set에 중복 추가하기
- question_type: output_prediction
- concepts: ["print","set","add","dedup"]
- reading_goal: set에 이미 있는 값을 다시 추가해도 중복으로 늘어나지 않는 흐름을 읽는다.
- code:
```python
tags = {"python"}
tags.add("python")
print(len(tags))
```
- question: 출력 결과는?
- answer: 1
- explanation: python은 이미 있으므로 다시 추가해도 길이는 1이다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.
- project_context: 중복 제거가 필요한 코드에서 set은 같은 값을 여러 번 넣어도 한 번만 남기는 성질을 이용한다.

## PYF95_A2_DTS_026_SET_UNION
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: set 합집합
- question_type: concept_reading
- concepts: ["print","set","union"]
- reading_goal: 두 set의 합집합이 양쪽 값을 모두 모으되 중복은 한 번만 남기는 흐름을 읽는다.
- code:
```python
a = {"python", "ai"}
b = {"ai", "web"}
print(a | b)
```
- question: 결과에 들어 있는 값 조합으로 맞는 것은?
- answer: python, ai, web 모두 포함
- explanation: a | b는 두 set의 합집합을 만들어 python, ai, web을 각각 한 번씩 포함한다. set에는 정해진 표시 순서가 없으므로 print 결과의 원소 순서를 예측해서는 안 된다. 이 문제의 정답은 순서가 아니라 세 값이 모두 포함된다는 뜻이다.
- project_context: 여러 출처의 태그나 개념 목록을 합칠 때 set union이 유용하다.

## PYF95_A2_DTS_027_SET_INTERSECTION
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: set 교집합
- question_type: concept_reading
- concepts: ["print","set","intersection"]
- reading_goal: 두 set의 교집합이 양쪽에 모두 있는 값만 남기는 흐름을 읽는다.
- code:
```python
a = {"python", "ai"}
b = {"ai", "web"}
print(a & b)
```
- question: 공통으로 남는 값은?
- answer: ai
- explanation: a & b는 두 set에 공통으로 있는 원소만 남긴 새 set을 만든다. 공통 원소는 문자열 ai 하나이므로 실제 print 표현은 {'ai'}와 같은 set 형태이고, 질문이 묻는 남은 값은 ai다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.
- project_context: 학생이 배운 개념과 문제 요구 개념의 공통부분을 찾는 데 set intersection을 쓸 수 있다.

## PYF95_A2_DTS_028_SET_DIFFERENCE
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: set 차집합
- question_type: concept_reading
- concepts: ["print","set","difference"]
- reading_goal: 차집합이 왼쪽에는 있지만 오른쪽에는 없는 값을 남기는 흐름을 읽는다.
- code:
```python
learned = {"print", "if", "for"}
needed = {"if", "for"}
print(learned - needed)
```
- question: 남는 값은?
- answer: print
- explanation: learned - needed는 learned에는 있고 needed에는 없는 원소만 남긴 set을 만든다. 남은 문자열은 print 하나이므로 실제 print 표현은 {'print'}와 같은 set 형태이고, 질문이 묻는 값은 print다. 빼기 방향을 바꾸면 결과가 달라진다.
- project_context: 이미 배운 것과 아직 필요한 것의 차이를 계산할 때 set difference가 쓰일 수 있다.

## PYF95_A2_DTS_029_DICT_SET_COMBO
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: dict key를 set으로 바꾸기
- question_type: output_prediction
- concepts: ["print","dict","keys","set","in"]
- reading_goal: dict의 keys를 set으로 바꾼 뒤 포함 여부를 검사하는 흐름을 읽는다.
- code:
```python
data = {"a": 1, "b": 2}
keys = set(data.keys())
print("a" in keys)
```
- question: 출력 결과는?
- answer: True
- explanation: keys set에는 a와 b가 있으므로 a in keys는 True다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.
- project_context: 필드 존재 검사나 빠른 membership 검사는 dict keys와 set을 함께 사용할 수 있다.

## PYF95_A2_DTS_030_CHOOSE_DICT_STRUCTURE
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: 이름으로 점수를 찾는 구조 고르기
- question_type: concept_reading
- concepts: ["dict","key","value"]
- reading_goal: dict가 순서 번호가 아니라 key 이름으로 value를 찾는 구조임을 설명 수준에서 판단한다.
- code:
```python
scores = {"Mina": 90, "Jin": 80}
```
- question: Mina의 점수를 바로 찾기 위해 쓰는 기준은?
- answer: key 이름
- explanation: dict는 key인 Mina로 value 90을 찾는다. 따라서 정답은 ‘key 이름’이다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.
- project_context: 학생별 점수, 사용자별 설정, 파일별 메타데이터는 key-value 구조로 읽을 때 자연스럽다.

## PYF95_A2_DTS_031_CHOOSE_TUPLE_STRUCTURE
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: 좌표를 읽는 구조 고르기
- question_type: concept_reading
- concepts: ["tuple","index"]
- reading_goal: tuple은 key가 아니라 순서와 위치로 값을 읽는다는 점을 판단한다.
- code:
```python
point = (10, 20)
```
- question: point[0]과 point[1]을 읽을 때 중요한 것은?
- answer: 값의 순서
- explanation: tuple은 순서가 있는 묶음이므로 인덱스 위치가 중요하다. 따라서 정답은 ‘값의 순서’이다. tuple은 위치가 의미를 가지므로 0부터 시작하는 index와 unpacking되는 변수의 순서를 맞춰 보고, 각 위치의 값이 이후 어느 식에서 사용되는지 이어서 확인한다.
- project_context: 좌표나 범위처럼 위치가 의미를 가지는 값은 tuple로 표현될 수 있다.

## PYF95_A2_DTS_032_CHOOSE_SET_STRUCTURE
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: 중복 없는 태그 구조 고르기
- question_type: concept_reading
- concepts: ["set","dedup"]
- reading_goal: set이 중복 없는 값 모음이라는 성질을 설명 수준에서 판단한다.
- code:
```python
tags = {"python", "ai"}
```
- question: set을 쓰는 이유로 가장 알맞은 것은?
- answer: 중복 없는 값 모음을 다루기 위해
- explanation: set은 중복 없는 값 모음을 표현하기 좋다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.
- project_context: 태그, id, 방문한 노드처럼 중복을 피해야 하는 값 모음에 set이 자주 사용된다.

## PYF95_A2_DTS_033_DICT_GET_DECISION
- level: 3
- file: python_foundation_level3_v95_a2_dict_tuple_set.json
- title: 대괄호와 get 중 안전한 쪽 고르기
- question_type: output_prediction
- concepts: ["dict","get","default"]
- reading_goal: 없는 key를 get으로 읽으면 오류 대신 기본값이 들어가는 흐름을 읽는다.
- code:
```python
user = {"name": "Mina"}
value = user.get("grade", 0)
```
- question: grade가 없을 때 value는?
- answer: 0
- explanation: grade key가 없으므로 기본값 0이 value에 들어간다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.
- project_context: 외부 데이터의 일부 필드가 없을 수 있을 때 get 기본값은 안전한 읽기 방식이 된다.

## PYF95_A3_LOOP_001_WHILE_COUNT
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: while로 0부터 2까지 출력
- question_type: output_prediction
- concepts: ["print","while","condition","counter"]
- reading_goal: while 조건과 i 업데이트를 따라가며 반복 횟수와 출력 순서를 판단한다.
- code:
```python
i = 0
while i < 3:
    print(i)
    i = i + 1
```
- question: 출력 순서로 맞는 것은?
- answer: 0, 1, 2 순서로 출력
- explanation: i가 0, 1, 2일 때 조건 i < 3이 참이어서 각 값이 출력된다. 매 반복 마지막에 i를 1씩 늘리므로 i가 3이 되어 반복이 끝난다. 이 갱신 줄이 없으면 조건이 계속 참이어서 무한 반복될 수 있으므로 while을 읽을 때는 초기값, 종료 조건, 상태 갱신을 함께 찾는다.
- project_context: while은 조건 기반 반복을 읽는 기본 구조다.

## PYF95_A3_LOOP_002_WHILE_FALSE_START
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: 처음부터 False인 while
- question_type: output_prediction
- concepts: ["print","while","condition"]
- reading_goal: while 조건이 처음부터 False이면 반복문 안이 실행되지 않는다는 점을 읽는다.
- code:
```python
i = 5
while i < 3:
    print(i)
    i = i + 1
```
- question: 출력 결과는?
- answer: 아무것도 출력되지 않음
- explanation: 처음 i는 5이고 5 < 3은 False이므로 본문이 실행되지 않는다. 따라서 화면에는 아무것도 출력되지 않는다. 보기 표현으로는 ‘아무것도 출력되지 않음’이 맞다.
- project_context: 조건 검사 위치를 이해하면 실행되지 않는 코드 블록을 찾을 수 있다.

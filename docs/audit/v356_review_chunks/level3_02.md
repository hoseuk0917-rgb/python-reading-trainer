# V356 semantic review — Level 3 chunk 2

Cards 21-40 of 206.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYV99_A1_GAP_005_ISINSTANCE_STR
- level: 3
- file: python_core_gaps_v99_a1.json
- title: isinstance로 타입 확인하기
- question_type: output_prediction
- concepts: ["print","isinstance","type","str","int"]
- reading_goal: 문자열 숫자와 실제 숫자를 isinstance로 구분하는 흐름을 읽는다.
- code:
```python
value = "7"
print(isinstance(value, int))
```
- question: 출력 결과는?
- answer: False
- explanation: value는 따옴표가 있는 문자열 '7'이다. 겉보기에는 숫자처럼 보여도 파이썬이 보는 자료형은 str이므로 isinstance(value, int)는 False를 반환한다. isinstance는 값이 특정 자료형인지 확인하는 함수다. 숫자 계산이나 조건 분기 전에 실제 자료형을 확인할 때 유용하다. 문자열 숫자와 진짜 숫자는 출력 모양이 비슷해도 연산 방식이 달라질 수 있다.
- project_context: 입력값이 문자열인지 숫자인지 확인해야 하는 검증 코드에서 중요하다.

## PYV99_A1_GAP_006_STARTSWITH_PREFIX
- level: 3
- file: python_core_gaps_v99_a1.json
- title: startswith로 시작 글자 확인하기
- question_type: output_prediction
- concepts: ["print","startswith","string","prefix"]
- reading_goal: startswith가 문자열이 특정 접두어로 시작하는지 True/False로 알려주는 흐름을 읽는다.
- code:
```python
name = "python.py"
print(name.startswith("py"))
```
- question: 출력 결과는?
- answer: True
- explanation: name에는 문자열 "python.py"가 저장된다. name.startswith("py")는 문자열의 시작 부분이 py와 같은지 확인하고, 실제로 py로 시작하므로 True를 반환한다. 마지막 print가 True를 출력한다. startswith는 기본적으로 대소문자를 구분한다.
- project_context: 파일명이나 태그가 특정 접두어로 시작하는지 검사할 때 쓰인다.

## PYV99_A1_GAP_007_ENDSWITH_SUFFIX
- level: 3
- file: python_core_gaps_v99_a1.json
- title: endswith로 파일 확장자 확인하기
- question_type: output_prediction
- concepts: ["print","endswith","string","suffix"]
- reading_goal: endswith가 문자열이 특정 접미어로 끝나는지 확인하는 흐름을 읽는다.
- code:
```python
filename = "cards.json"
print(filename.endswith(".json"))
```
- question: 출력 결과는?
- answer: True
- explanation: 문자열 cards.json이 정확히 .json으로 끝나므로 True다. endswith는 대소문자를 구분하는 문자열 끝 비교일 뿐, 파일이 실제로 존재하거나 내용이 유효한 JSON인지 확인하지 않는다. 파일 경로의 확장자 부품이 필요할 때는 Path.suffix도 고려한다.
- project_context: JSON 파일만 골라 읽는 스크립트에서 확장자 검사에 자주 쓰인다.

## PYV99_A1_GAP_008_FIND_INDEX
- level: 3
- file: python_core_gaps_v99_a1.json
- title: find로 처음 나오는 위치 찾기
- question_type: output_prediction
- concepts: ["print","find","string","index"]
- reading_goal: find가 찾는 글자의 시작 위치를 숫자로 돌려주는 흐름을 읽는다.
- code:
```python
word = "robotics"
print(word.find("bot"))
```
- question: 출력 결과는?
- answer: 2
- explanation: robotics에서 bot은 r, o 다음 위치인 index 2에서 시작한다. find는 위치 숫자를 돌려준다. find는 문자열에서 특정 글자나 단어가 처음 나오는 위치를 돌려준다. 못 찾으면 -1이므로 바로 인덱스로 쓰기 전에 결과를 확인해야 한다.
- project_context: 문자열 안에서 특정 조각이 어디에 있는지 확인할 때 쓰인다.

## PYV99_A1_GAP_009_FIND_MISSING
- level: 3
- file: python_core_gaps_v99_a1.json
- title: find가 못 찾으면 -1
- question_type: output_prediction
- concepts: ["print","find","string","missing"]
- reading_goal: find가 문자열을 찾지 못할 때 -1을 돌려주는 흐름을 읽는다.
- code:
```python
word = "python"
print(word.find("z"))
```
- question: 출력 결과는?
- answer: -1
- explanation: python 안에는 z가 없으므로 find('z')는 -1을 돌려준다. False가 아니라 숫자 -1이라는 점을 구분한다. find가 값을 찾지 못하면 -1을 돌려준다. 이 값을 실제 위치처럼 사용하면 마지막 글자 접근 같은 버그가 생길 수 있어 분기 처리가 필요하다.
- project_context: 검색 결과가 없을 때의 처리 흐름을 읽는 데 필요하다.

## PYV99_A1_GAP_010_FSTRING_VALUE
- level: 3
- file: python_core_gaps_v99_a1.json
- title: f-string으로 값 넣어 출력하기
- question_type: output_prediction
- concepts: ["print","f-string","string","format"]
- reading_goal: f-string의 중괄호 안 변수값이 문자열 안으로 들어가는 흐름을 읽는다.
- code:
```python
name = "Mina"
score = 3
print(f"{name}:{score}")
```
- question: 출력 결과는?
- answer: Mina:3
- explanation: f-string에서는 중괄호 안의 name과 score가 현재 변수 값으로 바뀐다. 그래서 문자열 안에 Mina와 3이 들어가 Mina:3 형태가 출력된다. 중괄호 안은 단순 글자가 아니라 먼저 계산되는 표현식이다. f-string은 로그, 상태 메시지, 디버깅 출력에서 자주 쓰인다. 따옴표 안에 있어도 f가 붙어 있으면 변수 값이 문자열에 삽입된다는 점을 구분해야 한다.
- project_context: 로그나 상태 메시지를 만들 때 f-string을 자주 사용한다.

## PYV99_A1_GAP_011_LIST_POP_LAST
- level: 3
- file: python_core_gaps_v99_a1.json
- title: pop으로 마지막 값 꺼내기
- question_type: output_prediction
- concepts: ["print","list","pop","mutation"]
- reading_goal: pop이 마지막 값을 돌려주고 리스트에서도 제거하는 흐름을 읽는다.
- code:
```python
items = ["A", "B", "C"]
value = items.pop()
print(value)
print(items)
```
- question: 출력 결과로 맞는 것은?
- answer: C\n['A', 'B']
- explanation: pop()은 마지막 원소 C를 리스트에서 제거하면서 그 값을 반환한다. 그래서 첫 print는 C, 둘째 print는 변경된 ['A', 'B']를 출력한다. 빈 리스트에서 pop()을 호출하면 IndexError가 나므로 원소 존재를 전제로 하는 코드인지 확인해야 한다.
- project_context: 작업 큐나 임시 목록에서 하나씩 꺼내 처리하는 코드와 연결된다.

## PYV99_A1_GAP_012_LIST_POP_INDEX
- level: 3
- file: python_core_gaps_v99_a1.json
- title: pop(0)으로 첫 값 꺼내기
- question_type: output_prediction
- concepts: ["print","list","pop","index"]
- reading_goal: pop에 위치를 넣으면 해당 위치의 값을 꺼내는 흐름을 읽는다.
- code:
```python
items = ["A", "B", "C"]
value = items.pop(0)
print(value)
print(items)
```
- question: 출력 결과로 맞는 것은?
- answer: A\n['B', 'C']
- explanation: pop(0)은 인덱스 0의 A를 제거하고 반환한다. 남은 B와 C가 앞으로 이동해 리스트는 ['B', 'C']가 되므로 두 출력은 A와 그 리스트다. 범위를 벗어난 인덱스는 IndexError를 내며, 큰 리스트의 앞 원소를 반복 제거하는 작업은 비용이 클 수 있다.
- project_context: 목록 앞에서부터 하나씩 처리하는 코드에서 만날 수 있다.

## PYV99_A1_GAP_013_DICT_SETDEFAULT_EXISTING
- level: 3
- file: python_core_gaps_v99_a1.json
- title: setdefault는 기존 key를 덮어쓰지 않는다
- question_type: output_prediction
- concepts: ["print","dict","setdefault","default"]
- reading_goal: setdefault가 key가 이미 있을 때 기존 값을 유지하는 흐름을 읽는다.
- code:
```python
counts = {"a": 2}
value = counts.setdefault("a", 0)
print(value)
print(counts["a"])
```
- question: 출력 결과로 맞는 것은?
- answer: 2\n2
- explanation: setdefault는 key가 없을 때만 기본값을 넣고, 이미 있으면 기존 값을 유지한다. 이 예제에서는 a key가 이미 있으므로 새 기본값을 덮어쓰지 않고 기존 값 2를 반환한다. counts['a']도 2로 유지된다. 이 메서드는 딕셔너리 누적이나 그룹 만들기에서 자주 쓰인다. 대괄호 대입처럼 무조건 바꾸는 것이 아니라 없을 때만 채운다는 점이 핵심이다. 따라서 출력은 차례대로 ‘2’, ‘2’이다. 보기 표현으로는 ‘2\n2’이 맞다.
- project_context: 그룹별 누적 계산에서 기본값을 안전하게 준비할 때 쓰인다.

## PYV99_A1_GAP_014_DICT_SETDEFAULT_MISSING
- level: 3
- file: python_core_gaps_v99_a1.json
- title: setdefault는 없는 key에 기본값을 넣는다
- question_type: output_prediction
- concepts: ["print","dict","setdefault","default"]
- reading_goal: setdefault가 없는 key에 기본값을 넣고 이후 값을 바꾸는 흐름을 읽는다.
- code:
```python
counts = {}
counts.setdefault("a", 0)
counts["a"] += 1
print(counts["a"])
```
- question: 출력 결과는?
- answer: 1
- explanation: 처음에는 a key가 없어서 기본값 0이 들어간다. 그 다음 1을 더하므로 counts['a']는 1이 된다. setdefault는 dict에 key가 없을 때 기본값을 넣고 그 값을 돌려준다. 중첩 목록을 만들 때 초기화 코드를 줄이는 데 유용하다. dict는 먼저 사용한 key를 확인하고 그 key에 연결된 value가 읽히는지, 새 값으로 바뀌는지, 반복 대상으로 쓰이는지를 순서대로 보면 결과를 정확히 추적할 수 있다.
- project_context: 처음 보는 key를 자동으로 준비한 뒤 개수를 세는 코드와 연결된다.

## PYV99_A1_GAP_015_DICT_POP_REMOVE
- level: 3
- file: python_core_gaps_v99_a1.json
- title: dict.pop으로 key 제거하기
- question_type: output_prediction
- concepts: ["print","dict","pop","key"]
- reading_goal: dict.pop이 값을 꺼내고 dict에서 key를 제거하는 흐름을 읽는다.
- code:
```python
row = {"id": 1, "temp": 99}
removed = row.pop("temp")
print(removed)
print("temp" in row)
```
- question: 출력 결과로 맞는 것은?
- answer: 99\nFalse
- explanation: row.pop('temp')는 value 99를 반환하면서 temp key를 dict에서 제거한다. 따라서 두 출력은 99와 False다. key가 없으면 기본값을 주지 않은 pop은 KeyError를 내므로 선택 key에는 row.pop('temp', default) 같은 계약을 정할 수 있다.
- project_context: 불필요한 임시 필드를 제거하며 값을 따로 저장할 때 쓴다.

## PYV99_A1_GAP_016_SET_DISCARD_SAFE
- level: 3
- file: python_core_gaps_v99_a1.json
- title: discard는 없어도 오류 없이 제거를 시도한다
- question_type: output_prediction
- concepts: ["print","set","discard","remove"]
- reading_goal: discard가 set에 없는 값을 제거하려 해도 오류를 내지 않는 흐름을 읽는다.
- code:
```python
seen = {"a", "b"}
seen.discard("c")
print(sorted(seen))
```
- question: 출력 결과는?
- answer: ['a', 'b']
- explanation: discard는 set에서 값을 제거하려고 시도하지만, 대상 값이 없어도 오류를 내지 않는다. 이 예제에서 c는 seen에 없으므로 set 내용은 그대로 유지된다. remove는 없는 값을 지우려 하면 오류가 날 수 있지만 discard는 조용히 넘어간다. 그래서 이미 있을 수도 있고 없을 수도 있는 값을 안전하게 정리할 때 discard를 쓰면 흐름이 끊기지 않는다. 따라서 출력은 ‘['a', 'b']’이다.
- project_context: 이미 처리한 항목 목록에서 안전하게 제외할 때 discard를 쓸 수 있다.

## PYV99_A1_GAP_017_SET_INTERSECTION
- level: 3
- file: python_core_gaps_v99_a1.json
- title: intersection으로 공통값 찾기
- question_type: output_prediction
- concepts: ["print","set","intersection","sorted"]
- reading_goal: intersection이 두 set에 모두 있는 값을 찾는 흐름을 읽는다.
- code:
```python
a = {"a", "b"}
b = {"b", "c"}
print(sorted(a.intersection(b)))
```
- question: 출력 결과는?
- answer: ['b']
- explanation: a와 b 두 set에 모두 들어 있는 값은 b뿐이다. sorted를 사용해 출력 순서를 안정적으로 만든다. intersection은 두 set에 공통으로 들어 있는 값만 골라낸다. 태그 겹침, 공통 사용자, 공통 파일 확장자처럼 교집합을 볼 때 쓴다.
- project_context: 두 태그 목록의 공통 항목을 찾을 때 쓴다.

## PYV99_A1_GAP_018_SET_DIFFERENCE
- level: 3
- file: python_core_gaps_v99_a1.json
- title: difference로 왼쪽에만 있는 값 찾기
- question_type: output_prediction
- concepts: ["print","set","difference","sorted"]
- reading_goal: difference가 왼쪽 set에만 있는 값을 찾는 흐름을 읽는다.
- code:
```python
a = {"a", "b"}
b = {"b", "c"}
print(sorted(a.difference(b)))
```
- question: 출력 결과는?
- answer: ['a']
- explanation: a.difference(b)는 a에는 있지만 b에는 없는 값만 모은다. 이 예제에서 왼쪽 집합 a에만 있는 값은 a뿐이다. difference는 방향이 중요하므로 a.difference(b)와 b.difference(a)의 결과가 서로 다를 수 있다. 집합 차이는 누락 항목, 새 항목, 남은 작업 목록을 비교할 때 유용하다. 어떤 집합을 기준으로 빼는지 먼저 확인해야 한다.
- project_context: 이미 가진 항목과 새 항목의 차이를 찾을 때 쓰인다.

## PYV99_A1_GAP_019_SET_COMPREHENSION
- level: 3
- file: python_core_gaps_v99_a1.json
- title: set comprehension으로 중복 없는 새 set 만들기
- question_type: output_prediction
- concepts: ["print","set comprehension","set","for"]
- reading_goal: set comprehension이 반복 결과를 중복 없는 set으로 만드는 흐름을 읽는다.
- code:
```python
nums = [1, 2, 2, 3]
squares = {n * n for n in nums}
print(sorted(squares))
```
- question: 출력 결과는?
- answer: [1, 4, 9]
- explanation: 각 숫자를 제곱하면 1, 4, 4, 9가 되지만 set은 중복을 제거하므로 1, 4, 9만 남는다. set comprehension은 반복 결과를 set으로 모아 중복을 제거한다. 리스트 컴프리헨션과 비슷하지만 결과가 순서보다 유일한 값 중심이라는 점을 기억해야 한다.
- project_context: 중복 없는 변환 결과를 만들 때 set comprehension을 사용할 수 있다.

## PYV99_A1_GAP_020_READLINE_READLINES
- level: 3
- file: python_core_gaps_v99_a1.json
- title: readline 다음 readlines 읽기
- question_type: output_prediction
- concepts: ["comment","print","open","readline","readlines","strip"]
- reading_goal: readline으로 첫 줄을 읽은 뒤 readlines가 남은 줄들을 리스트로 읽는 흐름을 확인한다.
- code:
```python
# memo.txt 내용:
# A
# B
with open("memo.txt", "r", encoding="utf-8") as f:
    first = f.readline().strip()
    rest = f.readlines()
print(first)
print(len(rest))
```
- question: 출력 결과로 맞는 것은?
- answer: A\n1
- explanation: readline()이 첫 줄 'A\n'을 읽으면서 파일 위치를 다음 줄로 옮긴다. 이어지는 readlines()는 처음부터 다시 시작하지 않고 남은 B 한 줄만 읽으므로 first는 A, len(rest)는 1이다. strip()은 개행뿐 아니라 양끝 공백도 제거한다는 점도 함께 구분한다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 헤더 한 줄을 먼저 읽고 나머지 데이터를 처리하는 파일 파이프라인과 연결된다.

## PYV99_A1_GAP_021_GLOBAL_ASSIGN
- level: 3
- file: python_core_gaps_v99_a1.json
- title: global로 바깥 변수 바꾸기
- question_type: output_prediction
- concepts: ["def","print","global","scope","function"]
- reading_goal: global이 함수 안에서 바깥 변수를 직접 바꾸게 만드는 흐름을 읽는다.
- code:
```python
count = 0

def add():
    global count
    count = count + 1

add()
print(count)
```
- question: 출력 결과는?
- answer: 1
- explanation: global count는 add 안의 count 대입을 local이 아니라 module 범위의 binding에 적용한다. add()가 이를 1로 바꾸어 print가 1을 출력한다. 전역 상태 변경은 호출 순서에 따라 결과가 달라져 추적과 테스트가 어려울 수 있으므로, 가능하면 값을 반환해 호출자가 저장하는 설계를 우선 고려한다.
- project_context: 상태를 전역 변수로 바꾸는 기존 코드를 읽을 때 global 표시를 놓치면 실행 결과를 잘못 판단할 수 있다.

## PYV99_A1_GAP_022_ABS_COMPARE
- level: 3
- file: python_core_gaps_v99_a1.json
- title: abs로 두 값의 차이 비교하기
- question_type: output_prediction
- concepts: ["print","abs","difference","number"]
- reading_goal: abs가 계산 결과의 부호를 없애고 차이의 크기만 남기는 흐름을 한 번 더 확인한다.
- code:
```python
target = 10
actual = 6
error = abs(target - actual)
print(error)
```
- question: 출력 결과는?
- answer: 4
- explanation: target - actual은 두 값의 차이를 계산한다. 그 결과가 양수든 음수든 abs는 부호를 없애 차이의 크기만 반환한다. 이 예제에서는 차이가 4라서 abs 결과도 4다. abs는 예측값과 실제값의 거리, 좌표 차이, 오차처럼 방향보다 크기가 중요한 상황에서 자주 쓰인다. 원본 값이 바뀌는 것이 아니라 절댓값 결과를 새로 만들어 쓴다고 읽으면 된다.
- project_context: 예측값과 실제값의 오차를 비교하는 코드에서 abs를 자주 사용한다.

## PYV99_A1_GAP_023_ISINSTANCE_INT_BRANCH
- level: 3
- file: python_core_gaps_v99_a1.json
- title: isinstance 결과로 if 분기 읽기
- question_type: output_prediction
- concepts: ["else","print","isinstance","if","int"]
- reading_goal: isinstance 결과가 if 조건에서 True/False로 사용되는 흐름을 읽는다.
- code:
```python
value = 7
if isinstance(value, int):
    print("number")
else:
    print("text")
```
- question: 출력 결과는?
- answer: number
- explanation: value는 실제 int 값 7이다. isinstance(value, int)가 True이므로 if 블록이 실행되고 number가 출력된다. isinstance는 값의 자료형을 확인해 분기할 때 쓴다. 문자열 '7'이었다면 같은 숫자처럼 보여도 int가 아니므로 결과가 달라질 수 있다. 조건문을 읽을 때는 값의 겉모양보다 실제 자료형이 무엇인지 먼저 확인해야 한다.
- project_context: 입력값 검증이나 API 응답 검증에서 타입에 따라 다른 처리를 할 때 쓰인다.

## PYV99_A1_GAP_024_ENDSWITH_FILTER
- level: 3
- file: python_core_gaps_v99_a1.json
- title: endswith로 확장자 필터링하기
- question_type: output_prediction
- concepts: ["if","for","print","endswith","filter","list"]
- reading_goal: endswith 조건을 이용해 특정 확장자 파일만 고르는 흐름을 읽는다.
- code:
```python
files = ["a.json", "b.txt", "c.json"]
selected = []
for name in files:
    if name.endswith(".json"):
        selected.append(name)
print(selected)
```
- question: 출력 결과는?
- answer: ['a.json', 'c.json']
- explanation: 반복문은 각 이름에 대소문자를 구분하는 endswith('.json')을 적용한다. a.json과 c.json만 참이라 같은 순서로 selected에 추가되어 ['a.json', 'c.json']이 출력된다. 이는 이름 문자열 필터이며 파일 존재나 JSON 유효성을 검사하지 않는다.
- project_context: 여러 데이터 파일 중 JSON 파일만 골라 로딩하는 스크립트와 연결된다.

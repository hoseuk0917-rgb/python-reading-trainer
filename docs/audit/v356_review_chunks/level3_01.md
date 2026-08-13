# V356 semantic review — Level 3 chunk 1

Cards 1-20 of 206.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## L03_dict_001
- level: 3
- file: cards_seed_v1.json
- title: dict에서 key로 값 꺼내기
- question_type: blank
- concepts: ["print","dict","key","value"]
- reading_goal: node["kind"]가 kind 값을 꺼낸다는 것을 읽는다.
- code:
```python
node = {"label": "LiDAR", "kind": "Sensor"}
print(node[____])
```
- question: Sensor를 출력하려면 빈칸에 어떤 key를 넣어야 할까?
- answer: "kind"
- explanation: 빈칸에는 value인 "Sensor"가 아니라 그 값을 찾는 key인 "kind"를 넣어야 한다. 그러면 node["kind"]가 "Sensor"를 꺼내고 print가 Sensor를 출력한다. dict 문제에서는 대괄호 안에 넣는 key와 그 key로 꺼낸 value를 구분해야 한다. 대괄호 접근은 key가 없으면 KeyError가 나므로, key가 없을 수도 있을 때는 get()을 고려한다.
- project_context: KG 노드 하나는 dict 형태로 표현되는 경우가 많다.

## L03_get_001
- level: 3
- file: cards_seed_v1.json
- title: dict.get() 읽기
- question_type: output_prediction
- concepts: ["print","dict","get","missing_key"]
- reading_goal: row.get("doc_id")가 doc_id 값을 안전하게 꺼내려는 코드임을 읽는다.
- code:
```python
row = {"label": "Radar"}
value = row.get("doc_id", "NO_DOC")
print(value)
```
- question: row.get('doc_id', 'NO_DOC')의 출력은?
- answer: NO_DOC
- explanation: row 안에 doc_id key가 없기 때문에 get()은 두 번째 인자로 준 기본값 'NO_DOC'을 반환한다. dict.get은 key가 없을 때 오류를 내지 않고 기본값을 돌려준다. 설정값이나 선택 필드를 읽을 때 안전한 fallback을 만들기 좋다.
- project_context: 실제 데이터에는 빠진 필드가 있을 수 있어서 get()이 자주 쓰인다.

## PYV96_A1_REVIEW_025_FUNCTION_RETURN
- level: 3
- file: python_beginner_mixed_review_v96_a1.json
- title: 함수 return 복습
- question_type: output_prediction
- concepts: ["print","def","function","return"]
- reading_goal: 함수 호출 argument가 parameter에 들어가고 return 값이 변수에 저장되는 흐름을 읽는다.
- code:
```python
def add(a, b):
    return a + b

result = add(2, 5)
print(result)
```
- question: 출력 결과는?
- answer: 7
- explanation: result = add(2, 5)를 실행하면 argument 2와 5가 parameter a와 b에 들어간다. 함수 안에서 a + b가 7로 계산되고 return 7이 호출한 곳으로 돌아와 result에 저장된다. 마지막 print(result)가 저장된 7을 출력한다.
- project_context: 함수는 초급에서 중급으로 넘어가는 핵심 연결 개념이다.

## PYV96_A1_REVIEW_026_FUNCTION_NOT_CALLED
- level: 3
- file: python_beginner_mixed_review_v96_a1.json
- title: 함수 정의만 있고 호출 없음
- question_type: output_prediction
- concepts: ["print","def","function","call"]
- reading_goal: 함수는 정의만으로 본문이 실행되지 않고 호출될 때 실행된다는 점을 읽는다.
- code:
```python
def hello():
    print("hi")
```
- question: 화면 출력으로 맞는 것은?
- answer: 아무것도 출력되지 않음
- explanation: hello() 호출이 없으므로 print가 실행되지 않는다. 따라서 화면에는 아무것도 출력되지 않는다. 보기 표현으로는 ‘아무것도 출력되지 않음’이 맞다.
- project_context: def와 call의 차이는 함수 독해의 기본이다.

## PYV96_A1_REVIEW_027_FUNCTION_IF
- level: 3
- file: python_beginner_mixed_review_v96_a1.json
- title: 함수 안 조건문
- question_type: output_prediction
- concepts: ["def","print","function","if","return"]
- reading_goal: 함수 안 조건문에서 어떤 return이 실행되는지 따라간다.
- code:
```python
def label(score):
    if score >= 60:
        return "pass"
    return "retry"

print(label(50))
```
- question: 출력 결과는?
- answer: retry
- explanation: print(label(50))을 계산하려고 먼저 label(50)을 호출하면 argument 50이 parameter score에 들어간다. score >= 60은 False이므로 if 안의 return "pass"는 건너뛰고 다음 return "retry"가 실행된다. 함수가 돌려준 retry를 바깥 print가 출력한다.
- project_context: 조건이 있는 함수는 입력값에 따라 다른 결과를 돌려준다.

## PYV96_A1_REVIEW_028_FUNCTION_LIST_SUM
- level: 3
- file: python_beginner_mixed_review_v96_a1.json
- title: 함수 안 반복 합계
- question_type: output_prediction
- concepts: ["def","print","function","for","return","list"]
- reading_goal: 함수 안 반복문이 리스트 합계를 만들고 return하는 흐름을 읽는다.
- code:
```python
def total(nums):
    result = 0
    for n in nums:
        result = result + n
    return result

print(total([1, 2, 3]))
```
- question: total([1, 2, 3])이 return하는 값은?
- answer: 6
- explanation: total 함수는 result를 0에서 시작한 뒤 nums의 값을 하나씩 더한다. 1, 2, 3을 차례대로 더하면 result는 6이 되고, return result가 그 값을 함수 밖으로 돌려준다. print(total([1, 2, 3]))은 반환된 6을 화면에 출력한다. 이 카드는 반복 합계 과정과 return 값을 분리해서 읽는 연습이다.
- project_context: 함수, 반복, 리스트가 섞인 기본 패턴이다.

## PYV96_A1_REVIEW_029_DICT_COUNT_PATTERN
- level: 3
- file: python_beginner_mixed_review_v96_a1.json
- title: 딕셔너리 개수 세기 패턴
- question_type: output_prediction
- concepts: ["print","dict","get","for","count"]
- reading_goal: 반복하면서 딕셔너리 get 기본값과 +1 누적을 함께 읽는다.
- code:
```python
counts = {}
for ch in "aba":
    counts[ch] = counts.get(ch, 0) + 1
print(counts["a"])
```
- question: 출력 결과는?
- answer: 2
- explanation: counts는 빈 dict로 시작한다. 첫 a에서는 counts.get('a', 0)이 0을 돌려줘 1이 저장되고, b에서는 b가 1로 저장된다. 마지막 a에서는 기존 값 1을 읽어 1을 더하므로 counts['a']가 2가 된다. 반복이 끝난 뒤 print(counts['a'])가 2를 출력한다.
- project_context: 빈도 세기 패턴은 중급 데이터 처리의 입구다.

## PYV96_A1_REVIEW_030_SORTED_REVIEW
- level: 3
- file: python_beginner_mixed_review_v96_a1.json
- title: sorted 복습
- question_type: output_prediction
- concepts: ["print","sorted","list","index"]
- reading_goal: sorted 결과 리스트에서 첫 번째 값을 꺼내는 흐름을 읽는다.
- code:
```python
nums = [3, 1, 2]
ordered = sorted(nums)
print(ordered[0])
```
- question: 출력 결과는?
- answer: 1
- explanation: 정렬 결과는 [1, 2, 3]이고 index 0은 1이다. 정렬 코드는 원본 값과 sorted가 만든 새 순서를 구분하고, 정렬된 결과가 다음 반복이나 index 접근에 어떻게 전달되는지 차례로 보면 최종 순서를 판단할 수 있다.
- project_context: 정렬 후 인덱스로 값을 고르는 코드는 자주 등장한다.

## PYV96_A1_REVIEW_031_ENUMERATE_REVIEW
- level: 3
- file: python_beginner_mixed_review_v96_a1.json
- title: enumerate 복습
- question_type: output_prediction
- concepts: ["print","enumerate","for","index"]
- reading_goal: enumerate가 번호와 값을 함께 주고 start=1이면 첫 번호가 1이 되는 흐름을 읽는다.
- code:
```python
names = ["A", "B"]
for i, name in enumerate(names, start=1):
    print(i, name)
```
- question: enumerate(names, start=1)에서 첫 번째 번호는 무엇인가?
- answer: 1
- explanation: enumerate(names, start=1)은 번호를 0이 아니라 1부터 붙인다. names의 첫 번째 값은 A이고, 그때 i는 1이다. 그래서 실제 첫 줄 출력은 1 A가 되지만, 이 카드는 그중 start=1이 번호를 어떻게 바꾸는지에 초점을 둔다. 값 A와 번호 1을 따로 읽으면 enumerate 흐름을 더 쉽게 확인할 수 있다.
- project_context: 번호 붙은 목록을 만들 때 자주 쓰이는 패턴이다.

## PYV96_A1_REVIEW_032_TRY_EXCEPT_REVIEW
- level: 3
- file: python_beginner_mixed_review_v96_a1.json
- title: try/except 복습
- question_type: output_prediction
- concepts: ["try_except","print","try","except","int"]
- reading_goal: int 변환 실패가 except로 이동하고 기본값이 저장되는 흐름을 읽는다.
- code:
```python
try:
    number = int("x")
except ValueError:
    number = 0
print(number)
```
- question: 출력 결과는?
- answer: 0
- explanation: int('x')가 정수 변환에 실패해 ValueError를 발생시키므로 except 블록이 number를 0으로 설정한다. 그 뒤 try/except 바깥의 print(number)가 0을 출력한다. 기본값 0이 실제 입력 0과 실패를 구분하지 못할 수 있다는 점은 실전 함수 계약에서 따로 고려한다.
- project_context: 입력값을 안전하게 처리하는 코드에서 예외 처리는 기본이다.

## PY3_L03_join_001
- level: 3
- file: python_broad_expansion_v3.json
- title: join()으로 문자열 합치기
- question_type: output_prediction
- concepts: ["print","str","join","list"]
- reading_goal: 리스트의 문자열들을 하나의 문자열로 합치는 코드를 읽는다.
- code:
```python
items = ["UAM", "ADAS", "Robotics"]
text = " | ".join(items)
print(text)
```
- question: 출력은?
- answer: 구분자로 이어진 UAM | ADAS | Robotics
- explanation: join은 리스트 안의 문자열들을 하나의 문자열로 합칠 때 쓴다. 이때 join 앞에 있는 문자열이 각 항목 사이에 들어가는 구분자 역할을 한다. 예를 들어 ','.join(items)는 쉼표로 이어 붙이고, ''.join(items)는 구분자 없이 바로 붙인다. join은 숫자 리스트가 아니라 문자열 목록을 합치는 도구이므로, 항목이 모두 문자열인지도 함께 확인해야 한다. 따라서 출력은 ‘구분자로 이어진 UAM | ADAS | Robotics’이다.
- project_context: 태그, 로그 메시지, 요약 문장을 만들 때 자주 쓰인다.

## PY3_L03_split_001
- level: 3
- file: python_broad_expansion_v3.json
- title: split()으로 문자열 나누기
- question_type: output_prediction
- concepts: ["print","str","split","list"]
- reading_goal: 문자열을 구분자로 나누어 리스트로 만드는 코드를 읽는다.
- code:
```python
text = "LiDAR,Radar,UAM"
items = text.split(",")
print(items[1])
```
- question: 출력은?
- answer: Radar
- explanation: split(',')은 문자열을 쉼표 기준으로 나누어 리스트를 만든다. 그래서 'LiDAR,Radar,UAM'은 0번 LiDAR, 1번 Radar, 2번 UAM 순서의 리스트가 된다. split 결과는 문자열 하나가 아니라 리스트이므로 이후 인덱스로 꺼내거나 반복문으로 하나씩 처리할 수 있다. 기준 문자를 무엇으로 주었는지에 따라 나뉘는 위치가 달라진다.
- project_context: 단순 구분 문자열이나 로그 한 줄에는 쓸 수 있지만, 따옴표·이스케이프 규칙이 있는 실제 CSV는 csv 모듈로 읽어야 한다.

## PY3_L03_strip_001
- level: 3
- file: python_broad_expansion_v3.json
- title: strip()으로 공백 제거
- question_type: output_prediction
- concepts: ["print","str","strip","normalization"]
- reading_goal: raw의 문자열이 strip()을 거쳐 양끝 공백이 제거된 새 문자열로 바뀌어 label에 저장되고 출력되는 흐름을 읽는다.
- code:
```python
raw = "  LiDAR  "
label = raw.strip()
print(label)
```
- question: 출력 의미는?
- answer: 양쪽 공백이 제거된 LiDAR
- explanation: strip()은 문자열 앞뒤의 공백과 줄바꿈을 제거한 새 문자열을 만든다. 사용자가 입력한 값이나 파일에서 읽은 텍스트를 정리할 때 자주 쓴다. 중요한 점은 중간 공백은 그대로 두고 양끝만 정리한다는 것이다. 원본 문자열을 직접 바꾸는 것이 아니라 정리된 결과를 반환하므로, 그 값을 변수에 저장하거나 다음 비교에 사용하는지 확인해야 한다. 따라서 출력은 ‘양쪽 공백이 제거된 LiDAR’이다.
- project_context: 라벨 정규화와 중복 제거에서 매우 자주 쓰인다.

## PY_L03_in_001
- level: 3
- file: python_core_expansion_v1.json
- title: in으로 포함 여부 확인
- question_type: output_prediction
- concepts: ["print","in","list","str","if"]
- reading_goal: "LiDAR" in text가 문자열 포함 여부를 확인하는 코드임을 읽는다.
- code:
```python
text = "LiDAR sensor data"

if "LiDAR" in text:
    print("found")
```
- question: 이 코드가 출력하는 것은?
- answer: found
- explanation: in 연산자는 어떤 값이 문자열, 리스트, set 같은 자료 안에 포함되어 있는지 확인한다. text 안에 'LiDAR'가 있으므로 조건은 True가 되고 print("found")가 실행되어 found가 출력된다. 문자열 검색은 대소문자를 구분하므로 실제 코드에서는 lower() 같은 정규화가 적용됐는지도 확인해야 한다.
- project_context: 문서 안에 특정 키워드가 있는지 확인할 때 쓰인다.

## PY_L03_items_001
- level: 3
- file: python_core_expansion_v1.json
- title: dict.items() 읽기
- question_type: meaning_choice
- concepts: ["print","dict","items","for"]
- reading_goal: dict.items()가 key와 value를 함께 꺼내는 구조임을 읽는다.
- code:
```python
node = {"label": "LiDAR", "kind": "Sensor"}

for key, value in node.items():
    print(key, value)
```
- question: dict.items()는 반복할 때 무엇을 제공하는가?
- answer: (key, value) 쌍
- explanation: items()는 딕셔너리의 각 항목을 (key, value) 쌍으로 제공한다. for key, value in node.items()는 그 두 값을 key와 value 변수에 나누어 담고, print가 label LiDAR와 kind Sensor를 차례로 출력한다. items()가 직접 출력하는 것이 아니라 반복문 본문의 print가 출력한다는 점을 구분해야 한다.
- project_context: JSON 필드 전체를 점검할 때 유용하다.

## PY_L03_slice_001
- level: 3
- file: python_core_expansion_v1.json
- title: 리스트 슬라이싱 읽기
- question_type: output_prediction
- concepts: ["print","list","slicing","index"]
- reading_goal: items[1:3]이 1번부터 3번 전까지 자르는 코드임을 읽는다.
- code:
```python
items = ["A", "B", "C", "D"]
print(items[1:3])
```
- question: 리스트 슬라이싱 [1:3]은 어느 범위를 가져오는가?
- answer: ["B", "C"]
- explanation: 리스트 슬라이싱 [1:3]은 1번 인덱스부터 시작해서 3번 인덱스 바로 전까지 가져온다. 끝 인덱스 값 자체는 포함하지 않는다. 그래서 시작은 포함, 끝은 제외라는 규칙을 먼저 기억해야 한다. 슬라이싱은 원본 리스트 전체가 아니라 일부 구간을 새로 가져오는 문법이다. 시작, 끝, 간격을 차례로 확인하면 어떤 항목이 선택되는지 안정적으로 예측할 수 있다. 따라서 출력은 ‘["B", "C"]’이다.
- project_context: 샘플 일부만 확인하거나 리스트 일부를 잘라볼 때 쓰인다.

## PYV99_A1_GAP_001_MIN_SMALLEST
- level: 3
- file: python_core_gaps_v99_a1.json
- title: min으로 가장 작은 값 찾기
- question_type: output_prediction
- concepts: ["print","min","list","builtin"]
- reading_goal: min이 리스트 안의 값 중 가장 작은 값을 돌려주는 흐름을 읽는다.
- code:
```python
scores = [7, 3, 9]
print(min(scores))
```
- question: 출력 결과는?
- answer: 3
- explanation: min(scores)는 iterable의 원소를 비교해 가장 작은 값 3을 반환하며 원본 리스트의 순서를 바꾸지 않는다. 비교 가능한 원소가 하나 이상 있어야 하며, 빈 iterable에 default 없이 min을 호출하면 ValueError가 난다.
- project_context: 점수, 길이, 비용 같은 숫자 목록에서 가장 작은 값을 찾을 때 쓰인다.

## PYV99_A1_GAP_002_ABS_DISTANCE
- level: 3
- file: python_core_gaps_v99_a1.json
- title: abs로 차이의 크기 읽기
- question_type: output_prediction
- concepts: ["print","abs","number","builtin"]
- reading_goal: abs가 음수 방향을 지우고 크기만 남기는 흐름을 읽는다.
- code:
```python
diff = 2 - 7
print(abs(diff))
```
- question: 출력 결과는?
- answer: 5
- explanation: 먼저 2 - 7이 계산되어 diff에 -5가 저장된다. 다음 abs(diff)는 -5의 부호를 없애 차이의 크기 5를 반환한다. 마지막 print가 그 값 5를 출력한다. abs는 원래 diff 값을 바꾸는 것이 아니라 절댓값 결과를 새로 돌려준다.
- project_context: 예측값과 실제값의 차이를 크기로 비교할 때 abs를 쓸 수 있다.

## PYV99_A1_GAP_003_ROUND_FLOAT
- level: 3
- file: python_core_gaps_v99_a1.json
- title: round로 소수 반올림 읽기
- question_type: output_prediction
- concepts: ["print","round","float","builtin"]
- reading_goal: round가 소수 값을 가까운 정수로 둥글게 만드는 흐름을 읽는다.
- code:
```python
value = 3.6
print(round(value))
```
- question: 출력 결과는?
- answer: 4
- explanation: 3.6은 4에 더 가까워 round(3.6)이 정수 4를 반환한다. 원본 value는 바뀌지 않는다. Python의 round는 정확히 중간인 값에서 무조건 위로 올리는 규칙이 아니라 가장 가까운 짝수 쪽을 고르는 규칙을 쓰며, 이진 부동소수점 표현 때문에 소수 반올림이 예상과 다를 수도 있다.
- project_context: 평균 점수나 진행률을 보기 좋게 표시할 때 round를 사용할 수 있다.

## PYV99_A1_GAP_004_ANY_TRUE
- level: 3
- file: python_core_gaps_v99_a1.json
- title: any로 하나라도 참인지 확인하기
- question_type: output_prediction
- concepts: ["print","any","bool","condition"]
- reading_goal: any가 조건 목록 중 하나라도 True이면 True를 돌려주는 흐름을 읽는다.
- code:
```python
flags = [False, True, False]
print(any(flags))
```
- question: 출력 결과는?
- answer: True
- explanation: any(flags)는 원소를 왼쪽부터 truth value로 검사해 하나라도 참이면 즉시 True를 반환한다. 둘째 원소가 True이므로 결과는 True다. 모든 원소가 거짓이거나 iterable이 비어 있으면 any는 False이며, 모든 원소가 참이어야 하는 all과 기준이 다르다.
- project_context: 검증 항목 중 하나라도 통과했는지 확인하는 코드에서 자주 쓰인다.

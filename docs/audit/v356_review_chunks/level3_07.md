# V356 semantic review — Level 3 chunk 7

Cards 121-140 of 206.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYF95_A3_LOOP_003_WHILE_SUM
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: while로 합계 누적
- question_type: output_prediction
- concepts: ["print","while","accumulate","counter"]
- reading_goal: while 반복에서 total과 i가 함께 바뀌는 흐름을 따라 최종 합계를 계산한다.
- code:
```python
i = 1
total = 0
while i <= 3:
    total = total + i
    i = i + 1
print(total)
```
- question: 출력 결과는?
- answer: 6
- explanation: 1, 2, 3이 total에 누적되어 6이 출력된다. while은 반복 전 초기값을 확인하고 조건 검사 → 본문 실행 → 변수 갱신 순서를 한 번씩 따라가면 반복이 언제 끝나고 마지막 값이 무엇인지 판단할 수 있다.
- project_context: 누적 계산은 점수 합계, 비용 합계, 처리 개수 계산에 자주 등장한다.

## PYF95_A3_LOOP_004_WHILE_LIST_INDEX
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: while로 리스트 인덱스 읽기
- question_type: output_prediction
- concepts: ["print","while","list","index","len"]
- reading_goal: while과 인덱스를 함께 사용해 리스트 값을 차례대로 꺼내는 흐름을 읽는다.
- code:
```python
items = ["a", "b"]
i = 0
while i < len(items):
    print(items[i])
    i = i + 1
```
- question: 출력 순서로 맞는 것은?
- answer: a 다음 b
- explanation: i가 0일 때 a, 1일 때 b가 출력된다. 따라서 출력 순서는 ‘a 다음 b’이다. while은 반복 전 초기값을 확인하고 조건 검사 → 본문 실행 → 변수 갱신 순서를 한 번씩 따라가면 반복이 언제 끝나고 마지막 값이 무엇인지 판단할 수 있다.
- project_context: 파일 목록이나 카드 목록을 인덱스로 순회하는 코드를 이해하는 데 도움이 된다.

## PYF95_A3_LOOP_005_WHILE_COUNTDOWN
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: while로 거꾸로 세기
- question_type: output_prediction
- concepts: ["print","while","counter","update"]
- reading_goal: while 조건이 감소하는 변수와 연결될 때 반복이 언제 멈추는지 읽는다.
- code:
```python
i = 3
while i > 0:
    print(i)
    i = i - 1
```
- question: 출력 순서로 맞는 것은?
- answer: 3, 2, 1 순서로 출력
- explanation: i는 3, 2, 1일 때 출력되고 0이 되면 i > 0이 False가 된다. while은 반복 전 초기값을 확인하고 조건 검사 → 본문 실행 → 변수 갱신 순서를 한 번씩 따라가면 반복이 언제 끝나고 마지막 값이 무엇인지 판단할 수 있다.
- project_context: 카운트다운, 재시도 횟수, 남은 기회 계산은 감소하는 while 패턴으로 나타날 수 있다.

## PYF95_A3_LOOP_006_BREAK_AT_THREE
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: break로 반복 중단
- question_type: output_prediction
- concepts: ["print","for","break","if"]
- reading_goal: break 조건이 참이 되는 순간 반복문이 끝나고 이후 출력이 사라지는 흐름을 읽는다.
- code:
```python
for n in [1, 2, 3, 4]:
    if n == 3:
        break
    print(n)
```
- question: 출력 순서로 맞는 것은?
- answer: 1 다음 2
- explanation: n이 3이 되면 break가 실행되어 3과 4는 출력되지 않는다. 따라서 출력 순서는 ‘1 다음 2’이다. for가 값을 하나씩 꺼내는 순서를 따라가다가 break가 실행되는 조건을 만나면 그 즉시 가장 가까운 반복문이 끝난다는 점까지 포함해 출력과 최종 값을 판단한다.
- project_context: 검색 중 첫 결과를 찾고 멈추는 코드는 break 패턴과 연결된다.

## PYF95_A3_LOOP_007_BREAK_FIND_FIRST
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: 첫 번째 일치 항목 찾기
- question_type: output_prediction
- concepts: ["if","print","for","break","str"]
- reading_goal: 조건에 맞는 첫 번째 값을 찾은 뒤 break로 반복을 멈추는 흐름을 읽는다.
- code:
```python
words = ["cat", "apple", "ant"]
found = ""
for word in words:
    if word.startswith("a"):
        found = word
        break
print(found)
```
- question: 출력 결과는?
- answer: apple
- explanation: a로 시작하는 첫 단어는 apple이고 그 뒤 break로 반복이 끝난다. for가 값을 하나씩 꺼내는 순서를 따라가다가 break가 실행되는 조건을 만나면 그 즉시 가장 가까운 반복문이 끝난다는 점까지 포함해 출력과 최종 값을 판단한다.
- project_context: 데이터 목록에서 첫 조건 만족 항목을 찾는 코드는 실전에서 자주 쓰인다.

## PYF95_A3_LOOP_008_CONTINUE_SKIP_EVEN
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: continue로 짝수 건너뛰기
- question_type: output_prediction
- concepts: ["print","for","continue","if"]
- reading_goal: continue가 실행된 반복에서는 아래 print를 건너뛰고 다음 반복으로 넘어가는 흐름을 읽는다.
- code:
```python
for n in [1, 2, 3, 4]:
    if n % 2 == 0:
        continue
    print(n)
```
- question: 출력 순서로 맞는 것은?
- answer: 1 다음 3
- explanation: 짝수 2와 4에서는 continue 때문에 print가 실행되지 않는다. 따라서 출력 순서는 ‘1 다음 3’이다. for가 현재 값을 변수에 넣는 순서를 따라가고 continue 조건을 만나면 그 반복의 남은 줄을 건너뛴 뒤 다음 값으로 넘어간다는 점을 함께 확인한다.
- project_context: 필터링 반복문은 조건에 맞지 않는 항목을 continue로 건너뛸 수 있다.

## PYF95_A3_LOOP_009_CONTINUE_SKIP_EMPTY
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: 빈 문자열 건너뛰기
- question_type: output_prediction
- concepts: ["if","print","for","continue","str"]
- reading_goal: 빈 문자열일 때 continue가 실행되어 출력 줄을 건너뛰는 흐름을 읽는다.
- code:
```python
items = ["a", "", "b"]
for item in items:
    if item == "":
        continue
    print(item)
```
- question: 출력 순서로 맞는 것은?
- answer: a 다음 b
- explanation: 빈 문자열 반복에서는 print가 실행되지 않으므로 a와 b만 출력된다. 따라서 출력 순서는 ‘a 다음 b’이다. for가 현재 값을 변수에 넣는 순서를 따라가고 continue 조건을 만나면 그 반복의 남은 줄을 건너뛴 뒤 다음 값으로 넘어간다는 점을 함께 확인한다.
- project_context: 입력값 정리나 로그 처리에서 비어 있는 값을 건너뛰는 패턴은 자주 사용된다.

## PYF95_A3_LOOP_010_WHILE_BREAK
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: while 안 break
- question_type: output_prediction
- concepts: ["if","print","while","break","condition"]
- reading_goal: while True 반복이 break 조건에서 멈추는 흐름을 읽는다.
- code:
```python
i = 0
while True:
    if i == 2:
        break
    print(i)
    i = i + 1
```
- question: 출력 순서로 맞는 것은?
- answer: 0 다음 1
- explanation: i가 2가 되면 break가 먼저 실행되어 2는 출력되지 않는다. 따라서 출력 순서는 ‘0 다음 1’이다. while은 반복 전 초기값을 확인하고 조건 검사 → 본문 실행 → 변수 갱신 순서를 한 번씩 따라가면 반복이 언제 끝나고 마지막 값이 무엇인지 판단할 수 있다.
- project_context: 계속 실행되는 루프는 내부 종료 조건을 찾아야 안전하게 이해할 수 있다.

## PYF95_A3_LOOP_011_WHILE_CONTINUE_UPDATE
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: while에서 continue 전 update 확인
- question_type: output_prediction
- concepts: ["if","print","while","continue","update"]
- reading_goal: while 안에서 update가 continue보다 먼저 실행될 때 출력이 어떻게 달라지는지 읽는다.
- code:
```python
i = 0
while i < 3:
    i = i + 1
    if i == 2:
        continue
    print(i)
```
- question: 출력 순서로 맞는 것은?
- answer: 1 다음 3
- explanation: 각 반복의 시작에서 i를 먼저 1 늘린다. i가 2일 때 continue가 아래 print만 건너뛰고 다음 조건 검사로 가므로 1과 3이 출력된다. 갱신 줄이 continue 아래에 있었다면 특정 값에서 갱신이 건너뛰어 무한 반복될 수 있다는 차이가 중요하다.
- project_context: continue가 있는 while문에서는 update 위치를 놓치면 반복 흐름을 잘못 판단하기 쉽다.

## PYF95_A3_LOOP_012_SORTED_NUMBERS
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: sorted로 숫자 정렬
- question_type: output_prediction
- concepts: ["print","sorted","list"]
- reading_goal: sorted가 리스트 값을 오름차순으로 정렬한 새 결과를 만드는 흐름을 읽는다.
- code:
```python
nums = [3, 1, 2]
print(sorted(nums))
```
- question: 출력 결과는?
- answer: [1, 2, 3]
- explanation: sorted(nums)는 [1, 2, 3]을 만든다. 정렬 코드는 원본 값과 sorted가 만든 새 순서를 구분하고, 정렬된 결과가 다음 반복이나 index 접근에 어떻게 전달되는지 차례로 보면 최종 순서를 판단할 수 있다.
- project_context: 랭킹, 점수, 파일명 정렬은 데이터 처리 코드에서 자주 등장한다.

## PYF95_A3_LOOP_013_SORTED_ORIGINAL_UNCHANGED
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: sorted 후 원본 확인
- question_type: output_prediction
- concepts: ["print","sorted","list","mutation"]
- reading_goal: sorted가 새 결과를 만들지만 원본 리스트는 그대로 남는다는 점을 읽는다.
- code:
```python
nums = [3, 1, 2]
ordered = sorted(nums)
print(nums)
```
- question: 출력 결과는?
- answer: [3, 1, 2]
- explanation: sorted(nums)는 정렬된 새 리스트를 반환해 ordered에 저장하고 원래 nums는 바꾸지 않는다. 따라서 print(nums)는 [3, 1, 2]를 출력한다. 정렬 결과를 쓰려면 ordered를 사용하거나 nums에 다시 대입해야 한다.
- project_context: 원본 데이터 보존 여부는 정렬 코드의 중요한 판단 기준이다.

## PYF95_A3_LOOP_014_SORT_METHOD_MUTATES
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: sort는 원본 리스트를 바꾼다
- question_type: output_prediction
- concepts: ["print","sort","list","mutation"]
- reading_goal: list.sort()가 원본 리스트 자체를 정렬한다는 점을 sorted와 비교해 읽는다.
- code:
```python
nums = [3, 1, 2]
nums.sort()
print(nums)
```
- question: 출력 결과는?
- answer: [1, 2, 3]
- explanation: nums.sort()는 기존 리스트 nums의 원소 순서를 직접 바꾸므로 print(nums)는 [1, 2, 3]을 출력한다. sort()의 반환값은 None이므로 result = nums.sort()처럼 저장하면 result가 정렬 리스트가 되지 않는다는 점을 sorted()와 구분해야 한다.
- project_context: 정렬 코드에서 원본이 바뀌는지 새 결과를 받는지 구분해야 버그를 줄일 수 있다.

## PYF95_A3_LOOP_015_SORTED_STRINGS
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: 문자열 리스트 정렬
- question_type: output_prediction
- concepts: ["print","sorted","str","list"]
- reading_goal: 문자열 리스트가 sorted로 사전식 순서처럼 정렬되는 흐름을 읽는다.
- code:
```python
names = ["b", "a", "c"]
print(sorted(names))
```
- question: 출력 결과는?
- answer: ['a', 'b', 'c']
- explanation: a, b, c 순서로 정렬된다. 정렬 코드는 원본 값과 sorted가 만든 새 순서를 구분하고, 정렬된 결과가 다음 반복이나 index 접근에 어떻게 전달되는지 차례로 보면 최종 순서를 판단할 수 있다.
- project_context: 태그, 이름, 파일명 목록을 정렬하는 코드는 자주 등장한다.

## PYF95_A3_LOOP_016_SORTED_REVERSE_OPTION
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: sorted reverse 옵션
- question_type: output_prediction
- concepts: ["print","sorted","reverse","list"]
- reading_goal: sorted의 reverse=True 옵션이 내림차순 정렬 결과를 만드는 흐름을 읽는다.
- code:
```python
nums = [1, 3, 2]
print(sorted(nums, reverse=True))
```
- question: 출력 결과는?
- answer: [3, 2, 1]
- explanation: reverse=True이므로 큰 값부터 [3, 2, 1]이 된다. 정렬 코드는 원본 값과 sorted가 만든 새 순서를 구분하고, 정렬된 결과가 다음 반복이나 index 접근에 어떻게 전달되는지 차례로 보면 최종 순서를 판단할 수 있다.
- project_context: 점수 높은 순 정렬이나 최신순 정렬은 reverse 옵션과 연결된다.

## PYF95_A3_LOOP_017_REVERSED_LIST
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: reversed로 리스트 거꾸로
- question_type: output_prediction
- concepts: ["print","reversed","list"]
- reading_goal: reversed 결과를 list로 바꾸어 거꾸로 된 순서를 확인하는 흐름을 읽는다.
- code:
```python
nums = [1, 2, 3]
print(list(reversed(nums)))
```
- question: 출력 결과는?
- answer: [3, 2, 1]
- explanation: reversed(nums)는 원소를 뒤에서부터 꺼내는 iterator를 반환하며 바로 리스트를 만들지는 않는다. list(...)가 그 순서를 소비해 [3, 2, 1]을 만든다. 원래 nums의 순서는 바뀌지 않는다. ‘reversed로 리스트 거꾸로’에서는 reversed이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.
- project_context: 최근 항목부터 보기처럼 순서를 뒤집어 읽는 코드는 자주 사용된다.

## PYF95_A3_LOOP_018_REVERSED_ORIGINAL
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: reversed 후 원본 유지
- question_type: output_prediction
- concepts: ["print","reversed","list","mutation"]
- reading_goal: reversed가 원본 리스트를 직접 바꾸지 않는다는 점을 읽는다.
- code:
```python
nums = [1, 2, 3]
back = list(reversed(nums))
print(nums)
```
- question: 출력 결과는?
- answer: [1, 2, 3]
- explanation: back은 역순이지만 nums는 그대로 [1, 2, 3]이다. ‘reversed 후 원본 유지’에서는 reversed이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.
- project_context: 원본 순서를 유지하면서 역순 결과만 따로 쓰는 코드를 구분할 수 있어야 한다.

## PYF95_A3_LOOP_019_REVERSED_STRING_JOIN
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: 문자열 reversed와 join
- question_type: output_prediction
- concepts: ["print","reversed","str","join"]
- reading_goal: 문자열도 reversed로 거꾸로 읽고 join으로 다시 문자열을 만들 수 있음을 읽는다.
- code:
```python
text = "abc"
print("".join(reversed(text)))
```
- question: 출력 결과는?
- answer: cba
- explanation: abc를 거꾸로 읽으면 cba가 된다. ‘문자열 reversed와 join’에서는 reversed이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.
- project_context: 텍스트 처리에서 글자 순서를 뒤집거나 검사하는 코드와 연결된다.

## PYF95_A3_LOOP_020_ENUMERATE_BASIC
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: enumerate 기본 번호
- question_type: output_prediction
- concepts: ["for","print","enumerate","index","value"]
- reading_goal: enumerate가 0부터 시작하는 번호와 값을 함께 주는 흐름을 읽는다.
- code:
```python
names = ["A", "B"]
for i, name in enumerate(names):
    print(i, name)
```
- question: 첫 번째 출력으로 맞는 것은?
- answer: 0 A
- explanation: 첫 반복에서 i는 0, name은 A다. for에서는 반복 대상에서 값이 어떤 순서로 변수에 들어오는지 보고, 각 반복에서 실행되는 계산이나 출력까지 한 번씩 적용하면 최종 결과를 안정적으로 판단할 수 있다.
- project_context: 목록을 출력할 때 번호와 값을 함께 보여 주는 코드는 enumerate로 작성할 수 있다.

## PYF95_A3_LOOP_021_ENUMERATE_START_ONE
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: enumerate 시작 번호 바꾸기
- question_type: output_prediction
- concepts: ["for","print","enumerate","start","index"]
- reading_goal: enumerate의 start 옵션이 번호 시작값을 바꾸는 흐름을 읽는다.
- code:
```python
names = ["A", "B"]
for i, name in enumerate(names, start=1):
    print(i, name)
```
- question: 첫 번째 출력으로 맞는 것은?
- answer: 1 A
- explanation: start=1이므로 첫 번호는 1이다. for에서는 반복 대상에서 값이 어떤 순서로 변수에 들어오는지 보고, 각 반복에서 실행되는 계산이나 출력까지 한 번씩 적용하면 최종 결과를 안정적으로 판단할 수 있다.
- project_context: 사용자에게 1번부터 번호를 보여 줄 때 start=1이 자주 쓰인다.

## PYF95_A3_LOOP_022_ENUMERATE_SUM_INDEX
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: enumerate 번호 더하기
- question_type: output_prediction
- concepts: ["for","print","enumerate","index","accumulate"]
- reading_goal: enumerate에서 나온 index 값이 누적 계산에 쓰이는 흐름을 읽는다.
- code:
```python
items = ["x", "y", "z"]
total = 0
for i, item in enumerate(items):
    total = total + i
print(total)
```
- question: 출력 결과는?
- answer: 3
- explanation: i는 0, 1, 2가 되어 합은 3이다. for에서는 반복 대상에서 값이 어떤 순서로 변수에 들어오는지 보고, 각 반복에서 실행되는 계산이나 출력까지 한 번씩 적용하면 최종 결과를 안정적으로 판단할 수 있다.
- project_context: 순서 번호를 점수나 위치 계산에 쓰는 코드는 enumerate와 연결된다.

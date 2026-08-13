# V356 semantic review — Level 3 chunk 8

Cards 141-160 of 206.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYF95_A3_LOOP_023_ENUMERATE_VALUE
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: enumerate에서 값 사용
- question_type: output_prediction
- concepts: ["for","print","enumerate","value"]
- reading_goal: enumerate가 번호와 값을 함께 주지만 코드가 실제로 출력하는 것은 item이라는 점을 읽는다.
- code:
```python
items = ["x", "y"]
for i, item in enumerate(items):
    print(item)
```
- question: 출력 순서로 맞는 것은?
- answer: x 다음 y
- explanation: print는 i가 아니라 item을 출력하므로 x 다음 y다. for에서는 반복 대상에서 값이 어떤 순서로 변수에 들어오는지 보고, 각 반복에서 실행되는 계산이나 출력까지 한 번씩 적용하면 최종 결과를 안정적으로 판단할 수 있다.
- project_context: 반복 변수 여러 개가 있을 때 어떤 변수가 사용되는지 확인해야 한다.

## PYF95_A3_LOOP_024_ZIP_BASIC
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: zip으로 같은 위치끼리 묶기
- question_type: output_prediction
- concepts: ["print","zip","tuple","for"]
- reading_goal: zip이 두 리스트의 같은 위치 값을 묶어 반복 변수에 나누어 주는 흐름을 읽는다.
- code:
```python
names = ["A", "B"]
scores = [10, 20]
for name, score in zip(names, scores):
    print(name, score)
```
- question: 첫 번째 출력으로 맞는 것은?
- answer: A 10
- explanation: 첫 번째 위치끼리 묶여 A와 10이 나온다. for에서는 반복 대상에서 값이 어떤 순서로 변수에 들어오는지 보고, 각 반복에서 실행되는 계산이나 출력까지 한 번씩 적용하면 최종 결과를 안정적으로 판단할 수 있다.
- project_context: 이름과 점수처럼 나란히 있는 두 목록을 함께 처리할 때 zip이 쓰인다.

## PYF95_A3_LOOP_025_ZIP_STOPS_SHORT
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: zip은 짧은 쪽에서 멈춘다
- question_type: output_prediction
- concepts: ["print","zip","length","for"]
- reading_goal: zip이 두 목록 길이가 다를 때 짧은 목록 길이에 맞춰 반복을 멈추는 흐름을 읽는다.
- code:
```python
a = ["x", "y", "z"]
b = [1]
count = 0
for left, right in zip(a, b):
    count = count + 1
print(count)
```
- question: 출력 결과는?
- answer: 1
- explanation: 기본 zip은 입력 중 가장 짧은 iterable이 끝나면 조용히 멈춘다. b에 원소가 하나뿐이라 한 쌍만 만들어지고 count는 1이다. 길이가 반드시 같아야 하는 데이터라면 미리 길이를 검사하거나 지원되는 Python에서는 zip(..., strict=True)로 불일치를 오류로 잡는다. for에서는 반복 대상에서 값이 어떤 순서로 변수에 들어오는지 보고, 각 반복에서 실행되는 계산이나 출력까지 한 번씩 적용하면 최종 결과를 안정적으로 판단할 수 있다.
- project_context: 두 데이터 목록을 나란히 묶을 때 누락된 값이 있는지 확인해야 한다.

## PYF95_A3_LOOP_026_ZIP_TO_LIST
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: zip 결과를 리스트로 보기
- question_type: output_prediction
- concepts: ["print","zip","tuple","list"]
- reading_goal: zip 결과가 같은 위치끼리 묶인 tuple들의 목록처럼 보이는 흐름을 읽는다.
- code:
```python
names = ["A", "B"]
scores = [10, 20]
print(list(zip(names, scores)))
```
- question: 출력 결과로 맞는 것은?
- answer: [('A', 10), ('B', 20)]
- explanation: A와 10, B와 20이 각각 쌍으로 묶인다. tuple은 위치가 의미를 가지므로 0부터 시작하는 index와 unpacking되는 변수의 순서를 맞춰 보고, 각 위치의 값이 이후 어느 식에서 사용되는지 이어서 확인한다.
- project_context: 두 컬럼을 행 단위로 묶는 데이터 처리와 연결된다.

## PYF95_A3_LOOP_027_ENUMERATE_ZIP_COMBO
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: enumerate와 zip 함께 읽기
- question_type: output_prediction
- concepts: ["for","print","enumerate","zip","tuple"]
- reading_goal: zip이 만든 쌍에 enumerate가 번호를 붙이는 중첩 반복 도구 흐름을 읽는다.
- code:
```python
names = ["A", "B"]
scores = [10, 20]
for i, pair in enumerate(zip(names, scores), start=1):
    print(i, pair)
```
- question: 첫 번째 출력으로 맞는 것은?
- answer: 1 ('A', 10)
- explanation: start=1이므로 번호는 1이고 첫 pair는 ('A', 10)이다. for에서는 반복 대상에서 값이 어떤 순서로 변수에 들어오는지 보고, 각 반복에서 실행되는 계산이나 출력까지 한 번씩 적용하면 최종 결과를 안정적으로 판단할 수 있다.
- project_context: 번호가 붙은 표 형태 출력을 만들 때 enumerate와 zip이 함께 쓰일 수 있다.

## PYF95_A3_LOOP_028_SORTED_ENUMERATE
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: 정렬 후 enumerate
- question_type: output_prediction
- concepts: ["for","print","sorted","enumerate","str"]
- reading_goal: sorted로 순서를 바꾼 결과를 enumerate가 번호와 함께 반복하는 흐름을 읽는다.
- code:
```python
names = ["b", "a"]
for i, name in enumerate(sorted(names), start=1):
    print(i, name)
```
- question: sorted(names)로 정렬한 뒤 첫 번째 출력으로 맞는 것은?
- answer: 1 a
- explanation: names는 처음에 ['b', 'a']이지만 sorted(names)를 거치면 ['a', 'b'] 순서가 된다. enumerate(..., start=1)은 정렬된 첫 번째 값 a에 번호 1을 붙인다. 그래서 첫 번째 출력은 1 a이며, 이 카드는 정렬 후 enumerate 흐름을 함께 읽는 연습이다. 원래 순서가 아니라 정렬된 순서를 기준으로 번호가 붙는다는 점이 핵심이다.
- project_context: 정렬된 순위 목록을 만들 때 정렬과 번호 붙이기가 함께 사용된다.

## PYF95_A3_LOOP_029_REVERSED_FOR
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: reversed로 for 반복
- question_type: output_prediction
- concepts: ["print","reversed","for"]
- reading_goal: reversed 결과를 for문이 거꾸로 순회하는 흐름을 읽는다.
- code:
```python
nums = [1, 2, 3]
for n in reversed(nums):
    print(n)
```
- question: 출력 순서로 맞는 것은?
- answer: 3 다음 2 다음 1
- explanation: reversed(nums)는 3, 2, 1 순서로 반복된다. for에서는 반복 대상에서 값이 어떤 순서로 변수에 들어오는지 보고, 각 반복에서 실행되는 계산이나 출력까지 한 번씩 적용하면 최종 결과를 안정적으로 판단할 수 있다.
- project_context: 최근 데이터부터 처리하거나 뒤에서부터 검사할 때 reversed 반복이 사용될 수 있다.

## PYF95_A3_LOOP_030_SORTED_SET
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: set을 sorted로 정렬해 보기
- question_type: output_prediction
- concepts: ["print","set","sorted","list"]
- reading_goal: 순서 없는 set을 sorted로 정렬하면 정렬된 list 결과를 얻는 흐름을 읽는다.
- code:
```python
tags = {"b", "a"}
print(sorted(tags))
```
- question: 출력 결과로 맞는 것은?
- answer: ['a', 'b']
- explanation: set 자체의 반복·표시 순서는 보장되지 않지만 sorted(tags)는 원소를 정렬한 새 리스트를 만든다. 두 문자열은 a, b 순서가 되어 ['a', 'b']가 출력되며 원래 set은 바뀌지 않는다.
- project_context: 중복 제거 후 보기 좋게 정렬하는 코드는 태그나 id 목록 처리에 자주 등장한다.

## PYF95_A3_LOOP_031_CHOOSE_BREAK
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: 반복을 즉시 끝내는 키워드 고르기
- question_type: concept_reading
- concepts: ["if","for","break","loop"]
- reading_goal: break의 의미를 설명 수준에서 판단하고 continue와 구분한다.
- code:
```python
for n in [1, 2, 3]:
    if n == 2:
        break
```
- question: 이 코드에서 break의 역할은?
- answer: 현재 가장 가까운 반복문을 끝낸다
- explanation: n이 2가 되면 break는 자신을 감싼 가장 가까운 for 반복문을 즉시 끝낸다. 중첩 반복문에서는 바깥 반복까지 자동으로 끝내지 않으며, 함수 전체를 끝내는 return과도 다르다.
- project_context: 반복 중단 조건은 검색, 필터링, 안전장치 코드에서 중요하다.

## PYF95_A3_LOOP_032_CHOOSE_CONTINUE
- level: 3
- file: python_foundation_level3_v95_a3_loop_tools.json
- title: 현재 반복만 건너뛰는 키워드 고르기
- question_type: concept_reading
- concepts: ["if","for","print","continue","loop"]
- reading_goal: continue의 의미를 설명 수준에서 판단하고 break와 구분한다.
- code:
```python
for n in [1, 2, 3]:
    if n == 2:
        continue
    print(n)
```
- question: 이 코드에서 continue의 역할은?
- answer: 현재 반복의 남은 줄을 건너뛰고 다음 반복으로 간다
- explanation: n이 2이면 continue는 현재 iteration의 아래 print를 건너뛰고 가장 가까운 for문의 다음 값으로 간다. 반복문 자체를 끝내는 break와 다르며, while에서 쓰면 상태 갱신을 실수로 건너뛰지 않는지 확인해야 한다.
- project_context: 필터링 반복문에서 특정 항목만 건너뛰는 흐름을 읽는 데 필요하다.

## PYF95_A4_FILE_001_OPEN_READ_ALL
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: 파일 전체 읽기
- question_type: output_prediction
- concepts: ["comment","print","open","with","read"]
- reading_goal: with open으로 파일을 열고 read로 전체 내용을 문자열 변수에 저장한 뒤 출력하는 흐름을 읽는다.
- code:
```python
# memo.txt 내용: hello
with open("memo.txt", "r", encoding="utf-8") as f:
    text = f.read()
print(text)
```
- question: 출력 결과는?
- answer: hello
- explanation: read는 파일 내용 hello를 문자열로 읽어 text에 저장한다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 학습 카드, 로그, 설정 파일을 읽는 코드는 파일 전체 읽기 흐름과 연결된다.

## PYF95_A4_FILE_002_READLINE_FIRST
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: 첫 줄 읽기
- question_type: output_prediction
- concepts: ["comment","print","open","readline","strip"]
- reading_goal: readline이 파일의 첫 줄을 읽고 strip이 줄바꿈을 제거하는 흐름을 읽는다.
- code:
```python
# memo.txt 내용:
# A
# B
with open("memo.txt", "r", encoding="utf-8") as f:
    line = f.readline().strip()
print(line)
```
- question: 출력 결과는?
- answer: A
- explanation: readline()은 현재 위치에서 첫 줄 'A\n'을 읽고 strip()은 양끝의 줄바꿈과 다른 공백 문자를 제거해 A를 만든다. 따라서 print는 따옴표 없이 A를 출력한다. 줄 끝 개행만 제거하고 앞뒤 공백은 보존해야 한다면 rstrip('\n')처럼 제거 대상을 좁혀야 한다.
- project_context: 여러 줄 파일에서 첫 줄만 확인하는 코드는 헤더나 제목 처리에 자주 쓰인다.

## PYF95_A4_FILE_003_READLINES_LEN
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: 여러 줄 개수 세기
- question_type: output_prediction
- concepts: ["comment","print","open","readlines","len"]
- reading_goal: readlines가 파일 줄들을 리스트로 만들고 len이 줄 개수를 세는 흐름을 읽는다.
- code:
```python
# memo.txt 내용:
# A
# B
with open("memo.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()
print(len(lines))
```
- question: 출력 결과는?
- answer: 2
- explanation: 파일에는 두 줄이 있으므로 lines 길이는 2다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 데이터 파일의 행 수를 점검하는 검증 코드와 연결된다.

## PYF95_A4_FILE_004_STRIP_LINES
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: 줄 끝 공백 제거하기
- question_type: output_prediction
- concepts: ["comment","for","print","strip","list","append"]
- reading_goal: 파일에서 읽은 줄 끝의 줄바꿈을 strip으로 제거해 새 리스트에 넣는 흐름을 읽는다.
- code:
```python
# lines 값 예시
lines = ["A\n", "B\n"]
clean = []
for line in lines:
    clean.append(line.strip())
print(clean)
```
- question: 출력 결과는?
- answer: ['A', 'B']
- explanation: 반복문이 각 문자열에 strip()을 적용해 양끝 공백과 줄바꿈을 제거한 새 문자열을 clean에 추가한다. 두 입력에서는 A와 B가 남아 ['A', 'B']가 출력된다. 원본 lines의 문자열은 바뀌지 않으며, 개행만 제거하려면 rstrip('\n')처럼 범위를 좁힌다.
- project_context: 텍스트 파일 정제와 데이터 전처리에서 줄 단위 정리는 자주 사용된다.

## PYF95_A4_FILE_005_WRITE_TEXT
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: 파일에 문자열 쓰기
- question_type: output_prediction
- concepts: ["print","open","write","with"]
- reading_goal: write는 파일에 쓰는 동작이고 화면 출력은 별도 print가 만든다는 점을 구분한다.
- code:
```python
with open("out.txt", "w", encoding="utf-8") as f:
    f.write("hi")
print("done")
```
- question: out.txt 파일 안에 저장되는 내용은?
- answer: hi
- explanation: open(..., 'w')는 out.txt가 없으면 만들고, 이미 있으면 여는 순간 기존 내용을 비운다. f.write('hi')는 화면이 아니라 파일에 hi를 쓰고, with를 벗어나며 파일이 닫힌 뒤 print('done')이 콘솔에 done을 출력한다. 따라서 질문의 파일 내용은 hi다.
- project_context: 결과 파일 저장 코드는 화면 출력과 파일 기록을 구분해서 읽어야 한다.

## PYF95_A4_FILE_006_WRITE_RETURN_COUNT
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: write 반환값
- question_type: output_prediction
- concepts: ["print","write","return","file"]
- reading_goal: write가 쓴 글자 수를 반환할 수 있음을 읽고, 파일 내용과 화면 출력 값을 구분한다.
- code:
```python
with open("out.txt", "w", encoding="utf-8") as f:
    n = f.write("hi")
print(n)
```
- question: 출력 결과는?
- answer: 결과는 2이다
- explanation: 문자열 hi의 길이는 2이므로 write 반환값 n은 2다. 따라서 결과는 2이다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 파일 쓰기 결과를 확인하는 코드에서 반환값을 볼 수 있다.

## PYF95_A4_FILE_007_APPEND_MODE
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: append 모드로 뒤에 붙이기
- question_type: output_prediction
- concepts: ["comment","print","open","append","write"]
- reading_goal: append 모드는 파일 뒤에 붙이지만 화면 출력은 print 줄에서 결정된다는 점을 읽는다.
- code:
```python
# out.txt 기존 내용: A
with open("out.txt", "a", encoding="utf-8") as f:
    f.write("B")
print("saved")
```
- question: 화면 출력은?
- answer: saved
- explanation: 파일에는 B가 추가되지만 화면에는 saved가 출력된다. 파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다.
- project_context: 로그 파일처럼 기존 내용 뒤에 기록을 추가하는 코드와 연결된다.

## PYF95_A4_FILE_008_MODE_W_CONCEPT
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: w 모드 의미 고르기
- question_type: concept_reading
- concepts: ["open","write","file mode"]
- reading_goal: 파일 모드 문자열이 파일 작업의 성격을 정한다는 점을 설명 수준에서 판단한다.
- code:
```python
mode = "w"
```
- question: open에서 mode가 'w'일 때 의미로 가장 알맞은 것은?
- answer: 쓰기 모드로 열며, 기존 파일이면 내용을 비운다
- explanation: open에서 mode가 'w'이면 파일을 쓰기 모드로 연다. 파일이 없으면 새로 만들고, 이미 있는 파일을 성공적으로 열면 기존 내용을 비운 뒤 새로 쓰게 된다. 따라서 기존 내용을 보존해야 하는 상황에서는 'w'를 선택하면 안 되며, 질문의 핵심은 기존 파일을 덮어쓰는 쓰기 모드라는 점이다.
- project_context: 파일 모드를 잘못 읽으면 저장 코드의 위험성을 놓칠 수 있다.

## PYF95_A4_FILE_009_MODE_A_CONCEPT
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: a 모드 의미 고르기
- question_type: concept_reading
- concepts: ["open","append","file mode"]
- reading_goal: append 모드가 기존 내용 뒤에 덧붙이는 의미임을 판단한다.
- code:
```python
mode = "a"
```
- question: open에서 mode가 'a'일 때 의미로 가장 알맞은 것은?
- answer: 파일 끝에 추가하며, 없으면 새로 만든다
- explanation: open에서 mode가 'a'이면 append 모드로 파일을 연다. 기존 파일이 있으면 내용을 비우지 않고 파일 끝에 새 내용을 이어 쓰며, 파일이 없으면 새로 만든다. 기존 끝에 줄바꿈이 없으면 새 문자열이 바로 붙을 수 있으므로 필요한 개행이나 구분자는 코드가 직접 써야 한다.
- project_context: 로그나 누적 기록 파일을 다룰 때 append 모드를 이해해야 한다.

## PYF95_A4_FILE_010_WITH_SCOPE
- level: 3
- file: python_foundation_level3_v95_a4_file_exception_path.json
- title: with 블록 범위 읽기
- question_type: concept_reading
- concepts: ["print","with","indentation","file"]
- reading_goal: 들여쓰기를 기준으로 with 블록 안의 파일 작업과 블록 밖의 출력을 구분한다.
- code:
```python
with open("out.txt", "w", encoding="utf-8") as f:
    f.write("A")
print("end")
```
- question: with 블록 안에서 실행되는 줄은?
- answer: f.write("A")
- explanation: 들여쓰기된 f.write('A')만 with 블록 안에서 열린 파일 객체를 사용한다. 블록을 정상적으로 나가거나 중간에 예외가 발생해도 context manager가 파일 닫기를 시도한다. 바깥 print('end')는 파일이 닫힌 뒤 실행된다.
- project_context: 파일을 안전하게 닫는 범위는 들여쓰기와 함께 읽어야 한다.

# V311 explanation MEDIUM 후보 2차 정밀 검토팩

EXPLANATION_MEDIUM_REVIEW_PACK_V311_A1

- 앱 버전: 20260611_v311_a1
- 원본 후보: V307 MEDIUM 632개
- 제외 대상: V309/V310 처리 대상 40개
- 이번 검토팩: 다음 상위 40개
- 출력 TSV: `reports/explanation_medium_review_pack_v311.tsv`

## 1. 목적

V309/V310에서 이미 처리한 상위 40개를 제외하고, V307 MEDIUM 후보 중 다음 우선순위 40개를 검토팩으로 분리한다.
이번 단계는 실제 카드 수정이 아니라, 다음 패치 batch의 근거를 남기는 작업이다.

## 2. 분류 요약

- CHOICE_CONFUSION_REVIEW: 1
- HIGH_PRIORITY_REVIEW: 37
- NORMAL_REVIEW: 2

## 3. 판단 기준

- `HIGH_PRIORITY_REVIEW`: 짧은 출력/결과 정답이라 해설이 정답을 명확히 말해야 하는 후보
- `CHOICE_CONFUSION_REVIEW`: 해설에 다른 보기 후보가 함께 감지된 후보
- `SHORT_EXPLANATION_REVIEW`: 해설이 짧아 근거 부족 가능성이 있는 후보
- `LIKELY_FALSE_POSITIVE_OR_PARAPHRASE`: 정답 문장이 길어 자동 문자열 매칭 오탐 가능성이 큰 후보
- `NORMAL_REVIEW`: 사람이 의미 연결만 확인하면 되는 후보

## 4. 검토 카드

### 1. 문자열 대소문자 비교

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level2_v94_a2_part1.json` #13
- 정답: `check`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> answer가 Yes일 때 이 코드가 출력하는 값은 무엇인가?

**코드**

```python
answer = "Yes"
if answer == "yes":
    print("ok")
else:
    print("check")
```

**보기**

- ok
- check
- Yes
- yes

**현재 해설**

> Yes와 yes는 대소문자가 다르므로 비교 결과가 False가 되어 else가 실행된다. 이 문제는 Level 2에서 조건문이나 리스트 상태를 직접 추적하는 연습이다. 정답은 보기의 익숙한 단어가 아니라, 변수 값과 실행 흐름이 실제로 만든 결과다. 특히 대소문자가 자동으로 같게 처리된다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 변수에 저장된 값, 비교식의 True/False 결과, 들여쓰기된 블록의 실행 여부, 리스트에 들어 있는 현재 값을 순서대로 확인하면 안전하게 판단할 수 있다. 이 독해 습관은 나중에 필터링, 검색 결과 처리, 사용자 입력 검증, 데이터 목록 처리 코드로 그대로 이어진다.

### 2. 들여쓰기 블록 구분

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level2_v94_a2_part1.json` #16
- 정답: `A 다음 B`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> ready가 True일 때 출력 순서로 맞는 것은 무엇인가?

**코드**

```python
ready = True
if ready:
    print("A")
print("B")
```

**보기**

- B만
- A만
- A 다음 B
- 출력 없음

**현재 해설**

> ready가 True라서 A가 출력되고, 들여쓰기 밖의 print("B")도 이어서 실행된다. 이 문제는 Level 2에서 조건문이나 리스트 상태를 직접 추적하는 연습이다. 정답은 보기의 익숙한 단어가 아니라, 변수 값과 실행 흐름이 실제로 만든 결과다. 특히 들여쓰기 밖의 줄까지 if 안쪽으로 보는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 변수에 저장된 값, 비교식의 True/False 결과, 들여쓰기된 블록의 실행 여부, 리스트에 들어 있는 현재 값을 순서대로 확인하면 안전하게 판단할 수 있다. 이 독해 습관은 나중에 필터링, 검색 결과 처리, 사용자 입력 검증, 데이터 목록 처리 코드로 그대로 이어진다.

### 3. 문자열 반복

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level2_v94_a2_part2.json` #9
- 정답: `a 다음 b`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 문자열 반복: 출력 순서로 맞는 것은 무엇인가?

**코드**

```python
for ch in "ab":
    print(ch)
```

**보기**

- ab 한 번
- b 다음 a
- a 다음 b
- 출력 없음

**현재 해설**

> 문자열 ab를 반복하면 첫 글자 a와 둘째 글자 b가 차례대로 나온다. 이 문제는 Level 2에서 반복문 또는 문자열 메서드의 실행 흐름을 직접 추적하는 연습이다. 정답은 보기의 익숙한 모양이 아니라, 코드가 실제로 반복하며 만든 값이나 문자열 메서드가 반환한 결과다. 특히 문자열 전체가 한 번에만 출력된다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 반복 대상, 반복 변수의 순서, append나 누적 변수의 변화, split/strip/replace/lower/upper 같은 메서드가 만든 새 값을 차례대로 확인하면 안전하게 판단할 수 있다. 이 독해 습관은 파일에서 읽은 줄 처리, 사용자 입력 정리, 검색어 정규화, 데이터 목록 가공 코드로 그대로 이어진다.

### 4. 공백 split

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level2_v94_a2_part2.json` #18
- 정답: `'blue'가 된다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 공백 split: items[1]의 출력은 무엇인가?

**코드**

```python
text = "red blue"
items = text.split()
print(items[1])
```

**보기**

- 'red'가 된다
- 'blue'가 된다
- 'red blue'가 된다
- 결과는 1이다

**현재 해설**

> text.split()은 red와 blue 두 조각을 만들고 1번 인덱스는 blue이다. 이 문제는 Level 2에서 반복문 또는 문자열 메서드의 실행 흐름을 직접 추적하는 연습이다. 정답은 보기의 익숙한 모양이 아니라, 코드가 실제로 반복하며 만든 값이나 문자열 메서드가 반환한 결과다. 특히 split 후에도 원래 문자열 전체가 남는다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 반복 대상, 반복 변수의 순서, append나 누적 변수의 변화, split/strip/replace/lower/upper 같은 메서드가 만든 새 값을 차례대로 확인하면 안전하게 판단할 수 있다. 이 독해 습관은 파일에서 읽은 줄 처리, 사용자 입력 정리, 검색어 정규화, 데이터 목록 가공 코드로 그대로 이어진다.

### 5. split 후 반복

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level2_v94_a2_part2.json` #27
- 정답: `A 다음 B`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> split 후 반복: 출력 순서로 맞는 것은 무엇인가?

**코드**

```python
text = "A,B"
items = text.split(",")
for item in items:
    print(item)
```

**보기**

- B 다음 A
- A,B 한 번
- A 다음 B
- 출력 없음

**현재 해설**

> split 결과는 A와 B의 리스트이고 for문이 이를 차례로 출력한다. 이 문제는 Level 2에서 반복문 또는 문자열 메서드의 실행 흐름을 직접 추적하는 연습이다. 정답은 보기의 익숙한 모양이 아니라, 코드가 실제로 반복하며 만든 값이나 문자열 메서드가 반환한 결과다. 특히 split 결과를 반복 대상 리스트로 보지 못하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 반복 대상, 반복 변수의 순서, append나 누적 변수의 변화, split/strip/replace/lower/upper 같은 메서드가 만든 새 값을 차례대로 확인하면 안전하게 판단할 수 있다. 이 독해 습관은 파일에서 읽은 줄 처리, 사용자 입력 정리, 검색어 정규화, 데이터 목록 가공 코드로 그대로 이어진다.

### 6. 함수 정의 후 호출 출력

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a1_functions.json` #1
- 정답: `'hi'가 출력된다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과로 맞는 것은?

**코드**

```python
def hello():
    print("hi")

hello()
```

**보기**

- 'hello'가 출력된다
- 아무것도 출력되지 않음
- 'hi'가 출력된다
- None이 출력된다

**현재 해설**

> hello 함수는 마지막 줄 hello()에서 호출될 때 print("hi")가 실행된다. 이 문제는 Level 3에서 함수 정의와 함수 호출을 분리해서 읽는 연습이다. def 줄은 코드를 묶어 이름을 붙이는 단계이고, 실제 실행은 함수 이름 뒤에 괄호를 붙여 호출하는 줄에서 일어난다. 정답을 고를 때는 함수 안으로 들어가기 전에 먼저 호출 줄의 argument 값을 확인하고, 그 값이 parameter 이름에 들어간다고 생각한 뒤 함수 본문을 한 줄씩 따라가야 한다. 또 print는 화면 출력이고 return은 호출한 자리로 값을 돌려주는 동작이라는 점을 구분해야 한다. 출력된 글자와 변수에 저장된 값이 서로 다를 수 있으므로 실제 실행 흐름을 기준으로 판단한다.

### 7. print만 있는 함수의 반환값

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a1_functions.json` #7
- 정답: `A 다음 None`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 흐름으로 맞는 것은?

**코드**

```python
def show():
    print("A")

result = show()
print(result)
```

**보기**

- None 다음 A
- A만
- A 다음 None
- result만

**현재 해설**

> show()가 A를 출력하고 return이 없어서 result에는 None이 들어간다. 이 문제는 Level 3에서 함수 정의와 함수 호출을 분리해서 읽는 연습이다. def 줄은 코드를 묶어 이름을 붙이는 단계이고, 실제 실행은 함수 이름 뒤에 괄호를 붙여 호출하는 줄에서 일어난다. 정답을 고를 때는 함수 안으로 들어가기 전에 먼저 호출 줄의 argument 값을 확인하고, 그 값이 parameter 이름에 들어간다고 생각한 뒤 함수 본문을 한 줄씩 따라가야 한다. 또 print는 화면 출력이고 return은 호출한 자리로 값을 돌려주는 동작이라는 점을 구분해야 한다. 출력된 글자와 변수에 저장된 값이 서로 다를 수 있으므로 실제 실행 흐름을 기준으로 판단한다.

### 8. return 뒤 줄은 실행되지 않음

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a1_functions.json` #12
- 정답: `'A'가 출력된다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과로 맞는 것은?

**코드**

```python
def pick():
    return "A"
    print("B")

print(pick())
```

**보기**

- 'B'가 출력된다
- 'A' 다음 'B'가 출력된다
- 'A'가 출력된다
- 'B' 다음 'A'가 출력된다

**현재 해설**

> return "A"에서 함수가 끝나므로 print("B")는 실행되지 않는다. 이 문제는 Level 3에서 함수 정의와 함수 호출을 분리해서 읽는 연습이다. def 줄은 코드를 묶어 이름을 붙이는 단계이고, 실제 실행은 함수 이름 뒤에 괄호를 붙여 호출하는 줄에서 일어난다. 정답을 고를 때는 함수 안으로 들어가기 전에 먼저 호출 줄의 argument 값을 확인하고, 그 값이 parameter 이름에 들어간다고 생각한 뒤 함수 본문을 한 줄씩 따라가야 한다. 또 print는 화면 출력이고 return은 호출한 자리로 값을 돌려주는 동작이라는 점을 구분해야 한다. 출력된 글자와 변수에 저장된 값이 서로 다를 수 있으므로 실제 실행 흐름을 기준으로 판단한다.

### 9. keys를 리스트로 보기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a2_dict_tuple_set.json` #7
- 정답: `['a', 'b']`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과로 맞는 것은?

**코드**

```python
data = {"a": 1, "b": 2}
print(list(data.keys()))
```

**보기**

- [1, 2]
- ['a', 'b']
- [('a', 1), ('b', 2)]
- ['a', 1]

**현재 해설**

> keys는 a와 b 같은 key만 보여준다. 이 문제는 Level 3에서 자료구조의 모양과 접근 방식을 분리해서 읽는 연습이다. dict는 key로 value를 찾고, tuple은 순서가 있는 묶음이며, set은 중복 없는 값 모음이다. 정답을 고를 때는 코드가 값을 새로 만드는지, 기존 값을 바꾸는지, key로 꺼내는지, 반복문으로 key와 value를 함께 읽는지 확인해야 한다. 특히 대괄호 접근, get 기본값, keys와 values와 items의 차이, tuple unpacking, set의 중복 제거를 실제 실행 순서대로 따라간다.

### 10. dict를 for로 반복하면 key가 들어온다

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a2_dict_tuple_set.json` #10
- 정답: `A 다음 B`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 순서로 맞는 것은?

**코드**

```python
scores = {"A": 10, "B": 20}
for name in scores:
    print(name)
```

**보기**

- 10 다음 20
- A 다음 B
- A 다음 10
- B 다음 20

**현재 해설**

> dict를 직접 반복하면 key인 A와 B가 차례로 나온다. 이 문제는 Level 3에서 자료구조의 모양과 접근 방식을 분리해서 읽는 연습이다. dict는 key로 value를 찾고, tuple은 순서가 있는 묶음이며, set은 중복 없는 값 모음이다. 정답을 고를 때는 코드가 값을 새로 만드는지, 기존 값을 바꾸는지, key로 꺼내는지, 반복문으로 key와 value를 함께 읽는지 확인해야 한다. 특히 대괄호 접근, get 기본값, keys와 values와 items의 차이, tuple unpacking, set의 중복 제거를 실제 실행 순서대로 따라간다.

### 11. tuple 인덱스로 값 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a2_dict_tuple_set.json` #17
- 정답: `결과는 3이다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
point = (3, 4)
print(point[0])
```

**보기**

- 결과는 4이다
- 결과는 3이다
- 결과는 0이다
- 결과는 (3, 4)이다

**현재 해설**

> point[0]은 첫 번째 값 3이다. 이 문제는 Level 3에서 자료구조의 모양과 접근 방식을 분리해서 읽는 연습이다. dict는 key로 value를 찾고, tuple은 순서가 있는 묶음이며, set은 중복 없는 값 모음이다. 정답을 고를 때는 코드가 값을 새로 만드는지, 기존 값을 바꾸는지, key로 꺼내는지, 반복문으로 key와 value를 함께 읽는지 확인해야 한다. 특히 대괄호 접근, get 기본값, keys와 values와 items의 차이, tuple unpacking, set의 중복 제거를 실제 실행 순서대로 따라간다.

### 12. items 결과를 unpacking하기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a2_dict_tuple_set.json` #21
- 정답: `x 다음 1`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 순서로 맞는 것은?

**코드**

```python
data = {"x": 1}
for key, value in data.items():
    print(key)
    print(value)
```

**보기**

- 1 다음 x
- x 다음 1
- x만
- 1만

**현재 해설**

> key는 x, value는 1이다. 이 문제는 Level 3에서 자료구조의 모양과 접근 방식을 분리해서 읽는 연습이다. dict는 key로 value를 찾고, tuple은 순서가 있는 묶음이며, set은 중복 없는 값 모음이다. 정답을 고를 때는 코드가 값을 새로 만드는지, 기존 값을 바꾸는지, key로 꺼내는지, 반복문으로 key와 value를 함께 읽는지 확인해야 한다. 특히 대괄호 접근, get 기본값, keys와 values와 items의 차이, tuple unpacking, set의 중복 제거를 실제 실행 순서대로 따라간다.

### 13. 처음부터 False인 while

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a3_loop_tools.json` #2
- 정답: `아무것도 출력되지 않음`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
i = 5
while i < 3:
    print(i)
    i = i + 1
```

**보기**

- 5가 출력된다
- 3이 출력된다
- 아무것도 출력되지 않음
- 오류가 발생한다

**현재 해설**

> 처음 i는 5이고 5 < 3은 False이므로 본문이 실행되지 않는다. 이 문제는 Level 3에서 반복 흐름과 반복 보조 도구를 실제 실행 순서대로 읽는 연습이다. while은 조건이 True인 동안 반복하고, break는 반복문을 끝내며, continue는 현재 반복의 남은 줄을 건너뛴다. sorted, reversed, enumerate, zip은 반복 순서나 반복 변수의 모양을 바꾸므로 현재 반복에서 변수에 어떤 값이 들어가는지 먼저 확인해야 한다.

### 14. while로 리스트 인덱스 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a3_loop_tools.json` #4
- 정답: `a 다음 b`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 순서로 맞는 것은?

**코드**

```python
items = ["a", "b"]
i = 0
while i < len(items):
    print(items[i])
    i = i + 1
```

**보기**

- b 다음 a
- a 다음 b
- 0 다음 1
- items

**현재 해설**

> i가 0일 때 a, 1일 때 b가 출력된다. 이 문제는 Level 3에서 반복 흐름과 반복 보조 도구를 실제 실행 순서대로 읽는 연습이다. while은 조건이 True인 동안 반복하고, break는 반복문을 끝내며, continue는 현재 반복의 남은 줄을 건너뛴다. sorted, reversed, enumerate, zip은 반복 순서나 반복 변수의 모양을 바꾸므로 현재 반복에서 변수에 어떤 값이 들어가는지 먼저 확인해야 한다.

### 15. break로 반복 중단

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a3_loop_tools.json` #6
- 정답: `1 다음 2`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 순서로 맞는 것은?

**코드**

```python
for n in [1, 2, 3, 4]:
    if n == 3:
        break
    print(n)
```

**보기**

- 1 다음 2 다음 3
- 1 다음 2
- 3 다음 4
- 4만

**현재 해설**

> n이 3이 되면 break가 실행되어 3과 4는 출력되지 않는다. 이 문제는 Level 3에서 반복 흐름과 반복 보조 도구를 실제 실행 순서대로 읽는 연습이다. while은 조건이 True인 동안 반복하고, break는 반복문을 끝내며, continue는 현재 반복의 남은 줄을 건너뛴다. sorted, reversed, enumerate, zip은 반복 순서나 반복 변수의 모양을 바꾸므로 현재 반복에서 변수에 어떤 값이 들어가는지 먼저 확인해야 한다.

### 16. continue로 짝수 건너뛰기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a3_loop_tools.json` #8
- 정답: `1 다음 3`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 순서로 맞는 것은?

**코드**

```python
for n in [1, 2, 3, 4]:
    if n % 2 == 0:
        continue
    print(n)
```

**보기**

- 2 다음 4
- 1 다음 3
- 1 다음 2 다음 3 다음 4
- 아무것도 출력되지 않음

**현재 해설**

> 짝수 2와 4에서는 continue 때문에 print가 실행되지 않는다. 이 문제는 Level 3에서 반복 흐름과 반복 보조 도구를 실제 실행 순서대로 읽는 연습이다. while은 조건이 True인 동안 반복하고, break는 반복문을 끝내며, continue는 현재 반복의 남은 줄을 건너뛴다. sorted, reversed, enumerate, zip은 반복 순서나 반복 변수의 모양을 바꾸므로 현재 반복에서 변수에 어떤 값이 들어가는지 먼저 확인해야 한다.

### 17. 빈 문자열 건너뛰기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a3_loop_tools.json` #9
- 정답: `a 다음 b`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 순서로 맞는 것은?

**코드**

```python
items = ["a", "", "b"]
for item in items:
    if item == "":
        continue
    print(item)
```

**보기**

- a 다음 빈 문자열 다음 b
- a 다음 b
- 빈 문자열만
- b 다음 a

**현재 해설**

> 빈 문자열 반복에서는 print가 실행되지 않으므로 a와 b만 출력된다. 이 문제는 Level 3에서 반복 흐름과 반복 보조 도구를 실제 실행 순서대로 읽는 연습이다. while은 조건이 True인 동안 반복하고, break는 반복문을 끝내며, continue는 현재 반복의 남은 줄을 건너뛴다. sorted, reversed, enumerate, zip은 반복 순서나 반복 변수의 모양을 바꾸므로 현재 반복에서 변수에 어떤 값이 들어가는지 먼저 확인해야 한다.

### 18. while 안 break

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a3_loop_tools.json` #10
- 정답: `0 다음 1`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 순서로 맞는 것은?

**코드**

```python
i = 0
while True:
    if i == 2:
        break
    print(i)
    i = i + 1
```

**보기**

- 0 다음 1 다음 2
- 0 다음 1
- 2만
- 무한 반복

**현재 해설**

> i가 2가 되면 break가 먼저 실행되어 2는 출력되지 않는다. 이 문제는 Level 3에서 반복 흐름과 반복 보조 도구를 실제 실행 순서대로 읽는 연습이다. while은 조건이 True인 동안 반복하고, break는 반복문을 끝내며, continue는 현재 반복의 남은 줄을 건너뛴다. sorted, reversed, enumerate, zip은 반복 순서나 반복 변수의 모양을 바꾸므로 현재 반복에서 변수에 어떤 값이 들어가는지 먼저 확인해야 한다.

### 19. sort는 원본 리스트를 바꾼다

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a3_loop_tools.json` #14
- 정답: `[1, 2, 3]`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
nums = [3, 1, 2]
nums.sort()
print(nums)
```

**보기**

- [3, 1, 2]
- [1, 2, 3]
- None
- [3, 2, 1]

**현재 해설**

> nums.sort()는 nums 자체를 정렬한다. 이 문제는 Level 3에서 반복 흐름과 반복 보조 도구를 실제 실행 순서대로 읽는 연습이다. while은 조건이 True인 동안 반복하고, break는 반복문을 끝내며, continue는 현재 반복의 남은 줄을 건너뛴다. sorted, reversed, enumerate, zip은 반복 순서나 반복 변수의 모양을 바꾸므로 현재 반복에서 변수에 어떤 값이 들어가는지 먼저 확인해야 한다.

### 20. set을 sorted로 정렬해 보기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a3_loop_tools.json` #30
- 정답: `['a', 'b']`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과로 맞는 것은?

**코드**

```python
tags = {"b", "a"}
print(sorted(tags))
```

**보기**

- ['b', 'a']
- ['a', 'b']
- {'a', 'b'}
- None

**현재 해설**

> sorted(tags)는 정렬된 리스트를 돌려준다. 이 문제는 Level 3에서 반복 흐름과 반복 보조 도구를 실제 실행 순서대로 읽는 연습이다. while은 조건이 True인 동안 반복하고, break는 반복문을 끝내며, continue는 현재 반복의 남은 줄을 건너뛴다. sorted, reversed, enumerate, zip은 반복 순서나 반복 변수의 모양을 바꾸므로 현재 반복에서 변수에 어떤 값이 들어가는지 먼저 확인해야 한다.

### 21. 첫 줄 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a4_file_exception_path.json` #2
- 정답: `'A'가 출력된다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
# memo.txt 내용:
# A
# B
with open("memo.txt", "r", encoding="utf-8") as f:
    line = f.readline().strip()
print(line)
```

**보기**

- 'B'가 출력된다
- 'A'가 출력된다
- 'A B'가 출력된다
- 'memo.txt'가 출력된다

**현재 해설**

> readline은 첫 줄 A를 읽고 strip으로 줄바꿈을 제거한다. 이 문제는 Level 3에서 파일 처리, 경로 처리, 예외 처리의 실행 흐름을 읽는 연습이다. open과 with는 파일을 여는 방식이고, read와 write는 내용을 읽거나 쓰는 동작이다. pathlib Path는 경로를 부품처럼 다루게 해 주며, try/except는 실패할 수 있는 코드의 정상 흐름과 오류 흐름을 나누어 준다. 정답은 코드가 파일을 읽는지 쓰는지, 오류가 발생하는지, except가 실행되는지, Path 속성이 어떤 부분을 가리키는지를 기준으로 고른다.

### 22. write 반환값

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a4_file_exception_path.json` #6
- 정답: `결과는 2이다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
with open("out.txt", "w", encoding="utf-8") as f:
    n = f.write("hi")
print(n)
```

**보기**

- 'hi'가 출력된다
- 결과는 2이다
- 결과는 0이다
- 'out.txt'가 출력된다

**현재 해설**

> 문자열 hi의 길이는 2이므로 write 반환값 n은 2다. 이 문제는 Level 3에서 파일 처리, 경로 처리, 예외 처리의 실행 흐름을 읽는 연습이다. open과 with는 파일을 여는 방식이고, read와 write는 내용을 읽거나 쓰는 동작이다. pathlib Path는 경로를 부품처럼 다루게 해 주며, try/except는 실패할 수 있는 코드의 정상 흐름과 오류 흐름을 나누어 준다. 정답은 코드가 파일을 읽는지 쓰는지, 오류가 발생하는지, except가 실행되는지, Path 속성이 어떤 부분을 가리키는지를 기준으로 고른다.

### 23. 오류가 없을 때 except 건너뛰기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a4_file_exception_path.json` #18
- 정답: `결과는 3이다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
try:
    number = int("3")
    print(number)
except ValueError:
    print("bad")
```

**보기**

- 결과는 'bad'이다
- 결과는 3이다
- 결과는 None이다
- 결과는 ValueError이다

**현재 해설**

> int('3')은 성공하므로 3이 출력되고 except는 실행되지 않는다. 이 문제는 Level 3에서 파일 처리, 경로 처리, 예외 처리의 실행 흐름을 읽는 연습이다. open과 with는 파일을 여는 방식이고, read와 write는 내용을 읽거나 쓰는 동작이다. pathlib Path는 경로를 부품처럼 다루게 해 주며, try/except는 실패할 수 있는 코드의 정상 흐름과 오류 흐름을 나누어 준다. 정답은 코드가 파일을 읽는지 쓰는지, 오류가 발생하는지, except가 실행되는지, Path 속성이 어떤 부분을 가리키는지를 기준으로 고른다.

### 24. safe_int 함수 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a4_file_exception_path.json` #22
- 정답: `결과는 0이다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
def safe_int(text):
    try:
        return int(text)
    except ValueError:
        return 0

print(safe_int("x"))
```

**보기**

- 결과는 'x'이다
- 결과는 0이다
- 결과는 None이다
- 결과는 ValueError이다

**현재 해설**

> int('x')가 실패하므로 except에서 return 0이 실행된다. 이 문제는 Level 3에서 파일 처리, 경로 처리, 예외 처리의 실행 흐름을 읽는 연습이다. open과 with는 파일을 여는 방식이고, read와 write는 내용을 읽거나 쓰는 동작이다. pathlib Path는 경로를 부품처럼 다루게 해 주며, try/except는 실패할 수 있는 코드의 정상 흐름과 오류 흐름을 나누어 준다. 정답은 코드가 파일을 읽는지 쓰는지, 오류가 발생하는지, except가 실행되는지, Path 속성이 어떤 부분을 가리키는지를 기준으로 고른다.

### 25. safe_int 정상 변환

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a4_file_exception_path.json` #23
- 정답: `결과는 7이다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
def safe_int(text):
    try:
        return int(text)
    except ValueError:
        return 0

print(safe_int("7"))
```

**보기**

- 결과는 0이다
- 결과는 7이다
- 결과는 None이다
- 결과는 ValueError이다

**현재 해설**

> int('7')은 성공하므로 7이 return 된다. 이 문제는 Level 3에서 파일 처리, 경로 처리, 예외 처리의 실행 흐름을 읽는 연습이다. open과 with는 파일을 여는 방식이고, read와 write는 내용을 읽거나 쓰는 동작이다. pathlib Path는 경로를 부품처럼 다루게 해 주며, try/except는 실패할 수 있는 코드의 정상 흐름과 오류 흐름을 나누어 준다. 정답은 코드가 파일을 읽는지 쓰는지, 오류가 발생하는지, except가 실행되는지, Path 속성이 어떤 부분을 가리키는지를 기준으로 고른다.

### 26. 파일에서 JSON 읽기 흐름

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a4_file_exception_path.json` #28
- 정답: `읽은 항목 개수인 3`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
# config.json 내용: {"level": 3}
import json
with open("config.json", "r", encoding="utf-8") as f:
    text = f.read()
data = json.loads(text)
print(data["level"])
```

**보기**

- key 이름인 level
- 읽은 항목 개수인 3
- 파일 이름인 config.json
- 변수 이름인 text

**현재 해설**

> 파일 내용 문자열이 dict로 바뀌고 level 값 3이 출력된다. 이 문제는 Level 3에서 파일 처리, 경로 처리, 예외 처리의 실행 흐름을 읽는 연습이다. open과 with는 파일을 여는 방식이고, read와 write는 내용을 읽거나 쓰는 동작이다. pathlib Path는 경로를 부품처럼 다루게 해 주며, try/except는 실패할 수 있는 코드의 정상 흐름과 오류 흐름을 나누어 준다. 정답은 코드가 파일을 읽는지 쓰는지, 오류가 발생하는지, except가 실행되는지, Path 속성이 어떤 부분을 가리키는지를 기준으로 고른다.

### 27. 두 object의 attribute 구분

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level4_v95_a5_oop_basics.json` #6
- 정답: `A 다음 B`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 순서로 맞는 것은?

**코드**

```python
class User:
    def __init__(self, name):
        self.name = name

a = User("A")
b = User("B")
print(a.name)
print(b.name)
```

**보기**

- B 다음 A
- A 다음 B
- A 다음 A
- B 다음 B

**현재 해설**

> a.name은 A이고 b.name은 B다. 이 문제는 Level 4에서 객체지향 기초 코드를 실행 순서대로 읽는 연습이다. class는 설계도이고 object는 class를 호출해서 만든 실제 값이다. self는 method가 실행되는 현재 object를 가리키며, __init__은 object가 만들어질 때 attribute를 준비하는 특별한 method다. 정답을 고를 때는 class 정의만 보고 바로 실행된다고 생각하지 말고, object 생성 줄, attribute 대입, method 호출, return 또는 print 흐름을 차례대로 따라가야 한다.

### 28. method에서 attribute 바꾸기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level4_v95_a5_oop_basics.json` #11
- 정답: `결과는 1이다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
class Counter:
    def __init__(self):
        self.count = 0
    def add(self):
        self.count = self.count + 1

c = Counter()
c.add()
print(c.count)
```

**보기**

- 결과는 0이다
- 결과는 1이다
- 결과는 'add'이다
- 결과는 Counter이다

**현재 해설**

> 초기 count는 0이고 add 한 번으로 1이 된다. 이 문제는 Level 4에서 객체지향 기초 코드를 실행 순서대로 읽는 연습이다. class는 설계도이고 object는 class를 호출해서 만든 실제 값이다. self는 method가 실행되는 현재 object를 가리키며, __init__은 object가 만들어질 때 attribute를 준비하는 특별한 method다. 정답을 고를 때는 class 정의만 보고 바로 실행된다고 생각하지 말고, object 생성 줄, attribute 대입, method 호출, return 또는 print 흐름을 차례대로 따라가야 한다.

### 29. object 리스트 반복

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level4_v95_a5_oop_basics.json` #15
- 정답: `A 다음 B`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 순서로 맞는 것은?

**코드**

```python
class User:
    def __init__(self, name):
        self.name = name

users = [User("A"), User("B")]
for user in users:
    print(user.name)
```

**보기**

- B 다음 A
- A 다음 B
- User 다음 User
- name 다음 name

**현재 해설**

> 첫 object의 name은 A, 두 번째 object의 name은 B다. 이 문제는 Level 4에서 객체지향 기초 코드를 실행 순서대로 읽는 연습이다. class는 설계도이고 object는 class를 호출해서 만든 실제 값이다. self는 method가 실행되는 현재 object를 가리키며, __init__은 object가 만들어질 때 attribute를 준비하는 특별한 method다. 정답을 고를 때는 class 정의만 보고 바로 실행된다고 생각하지 말고, object 생성 줄, attribute 대입, method 호출, return 또는 print 흐름을 차례대로 따라가야 한다.

### 30. object에서 class variable 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level4_v95_a5_oop_basics.json` #17
- 정답: `v1`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
class Config:
    version = "v1"

c = Config()
print(c.version)
```

**보기**

- Config
- v1
- c
- None

**현재 해설**

> c에 version attribute가 따로 없으면 class 쪽 version을 읽을 수 있다. 이 문제는 Level 4에서 객체지향 기초 코드를 실행 순서대로 읽는 연습이다. class는 설계도이고 object는 class를 호출해서 만든 실제 값이다. self는 method가 실행되는 현재 object를 가리키며, __init__은 object가 만들어질 때 attribute를 준비하는 특별한 method다. 정답을 고를 때는 class 정의만 보고 바로 실행된다고 생각하지 말고, object 생성 줄, attribute 대입, method 호출, return 또는 print 흐름을 차례대로 따라가야 한다.

### 31. method parameter 두 개

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level4_v95_a5_oop_basics.json` #22
- 정답: `결과는 5이다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
class Calculator:
    def add(self, a, b):
        return a + b

calc = Calculator()
print(calc.add(2, 3))
```

**보기**

- 결과는 2이다
- 결과는 3이다
- 결과는 5이다
- 결과는 Calculator이다

**현재 해설**

> a는 2, b는 3이므로 add는 5를 return한다. 이 문제는 Level 4에서 객체지향 기초 코드를 실행 순서대로 읽는 연습이다. class는 설계도이고 object는 class를 호출해서 만든 실제 값이다. self는 method가 실행되는 현재 object를 가리키며, __init__은 object가 만들어질 때 attribute를 준비하는 특별한 method다. 정답을 고를 때는 class 정의만 보고 바로 실행된다고 생각하지 말고, object 생성 줄, attribute 대입, method 호출, return 또는 print 흐름을 차례대로 따라가야 한다.

### 32. attribute가 dict일 때

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level4_v95_a5_oop_basics.json` #27
- 정답: `결과는 3이다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
class Profile:
    def __init__(self):
        self.data = {"level": 3}

p = Profile()
print(p.data["level"])
```

**보기**

- 결과는 'level'이다
- 결과는 3이다
- 결과는 'data'이다
- 결과는 Profile이다

**현재 해설**

> p.data는 dict이고 level key의 값은 3이다. 이 문제는 Level 4에서 객체지향 기초 코드를 실행 순서대로 읽는 연습이다. class는 설계도이고 object는 class를 호출해서 만든 실제 값이다. self는 method가 실행되는 현재 object를 가리키며, __init__은 object가 만들어질 때 attribute를 준비하는 특별한 method다. 정답을 고를 때는 class 정의만 보고 바로 실행된다고 생각하지 말고, object 생성 줄, attribute 대입, method 호출, return 또는 print 흐름을 차례대로 따라가야 한다.

### 33. BOM 문제 증상 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_json_error_encoding_beginner_v119_a1.json` #4
- 정답: `BOM이나 인코딩 문제`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> \ufeff 같은 문자가 첫 key에 보이면 무엇을 의심할 수 있는가?

**코드**

```python
data = json.loads(text)
print(list(data.keys())[0])  # '\ufefftitle' 처럼 보일 수 있음
```

**보기**

- for 문이 무한 반복된 문제
- 리스트 길이가 0인 문제
- 함수 이름이 너무 짧은 문제
- BOM이나 인코딩 문제

**현재 해설**

> \ufeff는 BOM이 문자열에 남았을 때 보일 수 있다. 이때 파일을 utf-8-sig로 읽는 방법을 고려할 수 있다. 문제 파일의 첫 글자 주변을 확인하면 원인을 좁힐 수 있다.

### 34. 중첩 dict 값 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_broad_expansion_v3.json` #6
- 정답: `arXiv`
- 우선순위 이유: 핵심 확장 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력은?

**코드**

```python
item = {
    "source": {"name": "arXiv"},
    "meta": {"score": 0.92}
}
print(item["source"]["name"])
```

**보기**

- source
- name
- 0.92
- arXiv

**현재 해설**

> 중첩 dict는 dict 안에 또 다른 dict가 들어 있는 구조다. source key로 안쪽 dict에 들어간 뒤 name 값을 꺼낸다. 중첩 구조는 바깥 key를 먼저 찾고 그 결과 dict에서 다시 안쪽 key를 찾는 순서로 따라가면 된다.

### 35. f-string 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_core_expansion_v1.json` #6
- 정답: `node: LiDAR`
- 우선순위 이유: 핵심 확장 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> f-string의 {name} 자리에는 무엇이 들어가는가?

**코드**

```python
name = "LiDAR"
print(f"node: {name}")
```

**보기**

- node: name
- node: LiDAR
- {name}
- LiDAR: node

**현재 해설**

> f-string은 문자열 안의 중괄호 자리에 변수 값이나 간단한 표현식 결과를 넣는다. 따라서 {name} 자리에는 변수 name에 저장된 실제 값이 들어간다. 일반 문자열처럼 보이지만 앞의 f가 붙어 있기 때문에 중괄호 안이 계산된다는 점이 핵심이다. 로그, 상태 메시지, 출력 문장을 만들 때 자주 쓰이므로 변수 값이 언제 문자열에 들어가는지 확인해야 한다.

### 36. enumerate로 번호와 값 함께 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_core_expansion_v1.json` #10
- 정답: `순번과 값`
- 우선순위 이유: 핵심 확장 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> enumerate()는 반복문에서 무엇을 함께 제공하는가?

**코드**

```python
items = ["UAM", "ADAS"]

for i, item in enumerate(items):
    print(i, item)
```

**보기**

- 값만
- 순번만
- 순번과 값
- 파일명과 경로

**현재 해설**

> enumerate()는 반복 중인 값과 그 값의 인덱스를 함께 제공한다. for i, value처럼 두 변수로 받으면 첫 번째에는 번호, 두 번째에는 실제 값이 들어간다. 리스트의 값만 필요한 경우에는 그냥 for value in items를 쓰면 되지만, 몇 번째 항목인지도 필요하면 enumerate가 편하다. 출력에서 번호와 값이 함께 보이면 인덱스가 0부터 시작하는지도 확인해야 한다.

### 37. discard로 있는 값 제거하기

- 분류: `CHOICE_CONFUSION_REVIEW`
- 파일: `data/lessons/python_core_gaps_v99_a1.json` #25
- 정답: `['ai', 'python']`
- 우선순위 이유: 초급/기초 카드, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 해설이 다른 보기와 섞여 보일 수 있어 보기별 혼란 여부 확인

**질문**

> 출력 결과는?

**코드**

```python
tags = {"python", "ai", "web"}
tags.discard("web")
print(sorted(tags))
```

**보기**

- ['web']
- ['ai', 'python', 'web']
- 오류가 난다
- ['ai', 'python']

**현재 해설**

> discard는 set 안에 값이 있으면 그 값을 제거하고, 값이 없어도 오류 없이 넘어간다. 이 예제에서는 web이 tags 안에 있으므로 제거되고, sorted는 출력 순서를 안정적으로 보여 주기 위해 사용된다. remove와 달리 discard는 없는 값을 지울 때도 예외를 만들지 않는다. 따라서 중복 태그나 선택 항목을 안전하게 정리할 때 자주 쓴다.

### 38. 불안정한 코드 위험 찾기

- 분류: `NORMAL_REVIEW`
- 파일: `data/lessons/cards_seed_v1.json` #12
- 정답: `doc_id가 없는 줄이면 에러가 난다`
- 우선순위 이유: 초기 seed 카드, print/return 결과형
- 확인 포인트: 해설이 정답과 의미상 연결되는지 사람이 샘플 확인

**질문**

> 이 코드가 불안정할 수 있는 이유를 고르시오.

**코드**

```python
with open("chunks.jsonl", "r") as f:
    for line in f:
        row = json.loads(line)
        print(row["doc_id"])
```

**보기**

- encoding이 지정되지 않았다
- json import가 없으면 실행되지 않는다
- doc_id가 없는 줄이면 에러가 난다
- 위험이 없다

**현재 해설**

> row['doc_id']처럼 대괄호 접근을 쓰면 해당 key가 없는 데이터에서 KeyError가 날 수 있다. 불안정한 코드 위험은 당장 오류가 나지 않아도 나중에 실패할 수 있는 부분을 찾는 것이다. 입력값, 예외 처리, 파일 존재 여부를 함께 봐야 한다.

### 39. restore, reset, revert 차이 읽기

- 분류: `NORMAL_REVIEW`
- 파일: `data/lessons/python_dev_environment_foundation_v103_a1.json` #23
- 정답: `git restore`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형
- 확인 포인트: 해설이 정답과 의미상 연결되는지 사람이 샘플 확인

**질문**

> 커밋하지 않은 파일 수정을 되돌릴 때 먼저 고려할 명령은?

**코드**

```python
git restore src/pwa/app.js
git revert 57bf043
```

**보기**

- git push
- pip freeze
- git restore
- nvidia-smi

**현재 해설**

> restore, reset, revert는 모두 되돌리기처럼 보이지만 영향 범위가 다르다. restore는 보통 작업 폴더의 미커밋 변경을 되돌리는 데 쓰고, revert는 이미 커밋된 변경을 취소하는 새 커밋을 만든다. reset은 이력을 움직일 수 있어 더 조심해야 한다. 어떤 명령을 쓰기 전에는 status와 log로 현재 상태와 원격 push 여부를 확인해야 한다.

### 40. type()으로 값의 종류 보기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_core_expansion_v1.json` #2
- 정답: `value의 자료형`
- 우선순위 이유: 핵심 확장 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> type() 함수는 무엇을 확인하는가?

**코드**

```python
value = 3
print(type(value))
```

**보기**

- value의 길이
- value의 자료형
- value의 파일명
- value의 경로

**현재 해설**

> type()은 값이 어떤 자료형인지 확인하는 함수다. 숫자, 문자열, 리스트처럼 값의 종류를 알아야 가능한 연산과 메서드를 안전하게 고를 수 있다. 예를 들어 '3'은 숫자처럼 보이지만 문자열이면 덧셈 방식이 달라진다. 코드를 읽을 때 type()이 보이면 실제 값의 모양보다 파이썬이 판단하는 종류를 확인하는 줄이라고 보면 된다.


## 5. 다음 단계

- V312: V311 검토팩 상위 40개 중 필요한 카드에 정답 연결 문장 보강
- V313 후보: 초급 foundation 계열 반복 장문 해설 축약

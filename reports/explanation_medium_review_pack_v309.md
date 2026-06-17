# V309 explanation MEDIUM 후보 정밀 검토팩

EXPLANATION_MEDIUM_REVIEW_PACK_V309_A1

- 앱 버전: 20260611_v309_a1
- 원본 후보: V307 MEDIUM 632개
- 이번 검토팩: 상위 40개
- 출력 TSV: `reports/explanation_medium_review_pack_v309.tsv`

## 1. 목적

V307에서 나온 MEDIUM 후보를 바로 대량 수정하지 않고, 초반/핵심/짧은 정답/출력형 문제를 우선 추려 사람이 판단할 수 있는 검토팩을 만든다.

## 2. 분류 요약

- HIGH_PRIORITY_REVIEW: 40

## 3. 판단 기준

- `HIGH_PRIORITY_REVIEW`: 짧은 출력/결과 정답이라 해설이 정답을 명확히 말해야 하는 후보
- `CHOICE_CONFUSION_REVIEW`: 해설에 다른 보기 후보가 함께 감지된 후보
- `SHORT_EXPLANATION_REVIEW`: 해설이 짧아 근거 부족 가능성이 있는 후보
- `LIKELY_FALSE_POSITIVE_OR_PARAPHRASE`: 정답 문장이 길어 자동 문자열 매칭 오탐 가능성이 큰 후보
- `NORMAL_REVIEW`: 사람이 의미 연결만 확인하면 되는 후보

## 4. 검토 카드

### 1. JSON 문자열을 dict로 바꾸기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/cards_seed_v1.json` #7
- 정답: `LiDAR`
- 우선순위 이유: 초기 seed 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 이 코드의 출력은?

**코드**

```python
import json

line = "{\"label\": \"LiDAR\", \"kind\": \"Sensor\"}"
row = json.loads(line)
print(row["label"])
```

**보기**

- line
- label
- LiDAR
- Sensor

**현재 해설**

> json.loads()가 JSON 문자열을 dict로 바꾸고, row["label"]로 값을 꺼낸다. JSON 문자열을 dict로 바꾸려면 json.loads를 사용한다. 문자열 형식이 올바른 JSON인지 확인하고, 파싱 실패 가능성도 함께 고려해야 한다.

### 2. 함수 호출 결과 따라가기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/cards_seed_v1.json` #6
- 정답: `lidar`
- 우선순위 이유: 초기 seed 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> strip().lower()를 차례로 적용한 최종 출력은?

**코드**

```python
def normalize_label(label):
    return label.strip().lower()

result = normalize_label("  LiDAR  ")
print(result)
```

**보기**

- LiDAR
-   LiDAR  
- lidar
- LIDAR

**현재 해설**

> strip()이 문자열 양쪽 공백을 먼저 제거하고, lower()가 남은 문자열을 소문자로 바꾸므로 정리된 소문자 값이 출력된다. 체인 형태에서는 왼쪽 메서드의 결과가 오른쪽 메서드의 입력이 된다고 순서대로 따라가면 된다.

### 3. False인 if와 else 없음

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_beginner_mixed_review_v96_a1.json` #8
- 정답: `아무것도 출력되지 않음`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
score = 50
if score >= 60:
    print("pass")
```

**보기**

- pass
- fail
- 50
- 아무것도 출력되지 않음

**현재 해설**

> 50 >= 60은 False이고 else가 없으므로 출력이 없다. 이 문제는 초급 파이썬 코드를 한 줄씩 읽는 복습 문제다. 정답을 고를 때는 문법 이름을 외우는 것보다 실행 순서, 변수의 현재 값, 조건의 True/False, 반복 중 바뀌는 값, 자료구조에 남는 값을 확인해야 한다. 특히 print되는 값과 변수에 저장되는 값은 다를 수 있고, 함수는 호출될 때 실행되어 return 값을 돌려준다.

### 4. 반복으로 리스트 만들기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_beginner_mixed_review_v96_a1.json` #17
- 정답: `[2, 4, 6]`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
result = []
for n in [1, 2, 3]:
    result.append(n * 2)
print(result)
```

**보기**

- [1, 2, 3]
- [2, 4, 6]
- 6
- []

**현재 해설**

> 1, 2, 3을 각각 두 배로 만들어 추가한다. 이 문제는 초급 파이썬 코드를 한 줄씩 읽는 복습 문제다. 정답을 고를 때는 문법 이름을 외우는 것보다 실행 순서, 변수의 현재 값, 조건의 True/False, 반복 중 바뀌는 값, 자료구조에 남는 값을 확인해야 한다. 특히 print되는 값과 변수에 저장되는 값은 다를 수 있고, 함수는 호출될 때 실행되어 return 값을 돌려준다.

### 5. 함수 정의만 있고 호출 없음

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_beginner_mixed_review_v96_a1.json` #26
- 정답: `아무것도 출력되지 않음`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 화면 출력으로 맞는 것은?

**코드**

```python
def hello():
    print("hi")
```

**보기**

- hi
- hello
- None
- 아무것도 출력되지 않음

**현재 해설**

> hello() 호출이 없으므로 print가 실행되지 않는다. 이 문제는 초급 파이썬 코드를 한 줄씩 읽는 복습 문제다. 정답을 고를 때는 문법 이름을 외우는 것보다 실행 순서, 변수의 현재 값, 조건의 True/False, 반복 중 바뀌는 값, 자료구조에 남는 값을 확인해야 한다. 특히 print되는 값과 변수에 저장되는 값은 다를 수 있고, 함수는 호출될 때 실행되어 return 값을 돌려준다.

### 6. 앞자리 0과 int 변환

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_beginner_v94_a1_part2.json` #12
- 정답: `7`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> int("007")을 출력하면 어떤 값이 화면에 보이는가?

**코드**

```python
number = int("007")
print(number)
```

**보기**

- 007
- 7
- 0
- 에러

**현재 해설**

> int()는 문자열을 숫자값으로 바꾸므로 숫자의 의미에 영향을 주지 않는 앞자리 0은 표시되지 않는다. 이 문제는 값이 문자열인지 숫자인지, 그리고 변환 함수가 적용되었는지를 확인하는 초급 독해 연습이다. 정답은 보기의 모양이 아니라 실제 파이썬 실행 규칙이 만든 값이다. 특히 문자열의 표시 모양이 숫자 변환 뒤에도 그대로 남는다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 따옴표 여부, input() 결과의 자료형, int()나 str() 같은 변환 함수, print가 보여 주는 최종 값을 차례대로 확인하면 안전하게 판단할 수 있다. 이 흐름은 나중에 사용자 입력, 설정값, 파일에서 읽은 문자열 데이터를 처리할 때 그대로 이어진다.

### 7. 입력값 저장하기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_beginner_v94_a1_part2.json` #13
- 정답: `Python`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 사용자가 Python을 입력했을 때 print(name)의 출력은 무엇인가?

**코드**

```python
name = input("이름: ")
print(name)
```

**보기**

- name
- 이름:
- Python
- None

**현재 해설**

> input()은 사용자가 입력한 값을 문자열로 받아 name에 저장하고, print(name)은 그 저장된 값을 보여 준다. 이 문제는 값이 문자열인지 숫자인지, 그리고 변환 함수가 적용되었는지를 확인하는 초급 독해 연습이다. 정답은 보기의 모양이 아니라 실제 파이썬 실행 규칙이 만든 값이다. 특히 안내 문구가 변수에 저장된다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 따옴표 여부, input() 결과의 자료형, int()나 str() 같은 변환 함수, print가 보여 주는 최종 값을 차례대로 확인하면 안전하게 판단할 수 있다. 이 흐름은 나중에 사용자 입력, 설정값, 파일에서 읽은 문자열 데이터를 처리할 때 그대로 이어진다.

### 8. 입력값 공백 정리하기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_beginner_v94_a1_part2.json` #19
- 정답: `hi`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 사용자가 양쪽에 공백이 있는 hi를 입력했을 때 clean에 가까운 값은 무엇인가?

**코드**

```python
text = input()
clean = text.strip()
print(clean)
```

**보기**

-  hi 
- text
- hi
- None

**현재 해설**

> text에는 공백이 포함된 문자열이 들어가지만 strip() 결과를 clean에 저장했기 때문에 양쪽 공백이 제거된다. 이 문제는 값이 문자열인지 숫자인지, 그리고 변환 함수가 적용되었는지를 확인하는 초급 독해 연습이다. 정답은 보기의 모양이 아니라 실제 파이썬 실행 규칙이 만든 값이다. 특히 strip이 원본과 결과를 구분하지 않아도 된다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 따옴표 여부, input() 결과의 자료형, int()나 str() 같은 변환 함수, print가 보여 주는 최종 값을 차례대로 확인하면 안전하게 판단할 수 있다. 이 흐름은 나중에 사용자 입력, 설정값, 파일에서 읽은 문자열 데이터를 처리할 때 그대로 이어진다.

### 9. local scope 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_expansion_v10.json` #11
- 정답: `inside`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력은?

**코드**

```python
def outer():
    value = "inside"
    return value

value = "outside"
print(outer())
```

**보기**

- outside
- value
- inside
- 에러

**현재 해설**

> 함수 안에서 만든 변수는 보통 그 함수 안의 지역 변수로 동작한다. outer 함수 안의 local value가 return되어 바깥 값과 구분된다. 지역 변수는 함수 호출이 끝나면 보통 사라지므로 다른 함수나 전역 코드와 이름 충돌을 줄인다.

### 10. json.loads 문자열 파싱

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_expansion_v10.json` #16
- 정답: `2`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력은?

**코드**

```python
import json

text = '{"ok": true, "count": 2}'
data = json.loads(text)
print(data["count"])
```

**보기**

- true
- ok
- 2
- count

**현재 해설**

> json.loads는 JSON 형식의 문자열을 파이썬 dict나 list로 바꾼다. 변환된 dict에서 count key의 값을 꺼낼 수 있다. 문자열이 올바른 JSON 형식이 아니면 파싱 오류가 나므로 입력 형식 검증이 필요하다.

### 11. 환경변수 기본값 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_expansion_v10.json` #28
- 정답: `100`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> RUN_LIMIT이 없으면 value는?

**코드**

```python
import os

value = os.environ.get("RUN_LIMIT", "100")
print(value)
```

**보기**

- 0
- None
- 100
- RUN_LIMIT

**현재 해설**

> 환경변수는 실행 환경에서 값을 가져올 때 사용한다. os.environ.get의 두 번째 인자는 해당 환경변수가 없을 때 쓸 기본값이다. 그래서 RUN_LIMIT이 설정되지 않았을 때도 코드가 멈추지 않고 기본 제한값으로 실행될 수 있다.

### 12. f-string 상태문 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_expansion_v10.json` #43
- 정답: `3/10 done`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력은?

**코드**

```python
def format_status(done, total):
    return f"{done}/{total} done"

print(format_status(3, 10))
```

**보기**

- done/total
- 3
- 3/10 done
- 10

**현재 해설**

> f-string은 문자열 안에 변수 값을 바로 넣을 수 있는 문법이다. done과 total 값이 중괄호 위치에 들어가 상태 문장이 만들어진다. 반복 작업의 진행률이나 상태 로그를 만들 때 f-string을 쓰면 변수 값을 읽기 좋게 섞을 수 있다.

### 13. and 조건

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level2_v94_a2_part1.json` #8
- 정답: `ok`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> age와 score 조건을 모두 만족할 때 출력되는 값은 무엇인가?

**코드**

```python
age = 12
score = 90
if age >= 10 and score >= 80:
    print("ok")
```

**보기**

- age
- score
- ok
- 출력 없음

**현재 해설**

> age >= 10도 True이고 score >= 80도 True이므로 and 전체 조건이 True가 된다. 이 문제는 Level 2에서 조건문이나 리스트 상태를 직접 추적하는 연습이다. 정답은 보기의 익숙한 단어가 아니라, 변수 값과 실행 흐름이 실제로 만든 결과다. 특히 and에서 한쪽만 보면 된다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 변수에 저장된 값, 비교식의 True/False 결과, 들여쓰기된 블록의 실행 여부, 리스트에 들어 있는 현재 값을 순서대로 확인하면 안전하게 판단할 수 있다. 이 독해 습관은 나중에 필터링, 검색 결과 처리, 사용자 입력 검증, 데이터 목록 처리 코드로 그대로 이어진다.

### 14. 조건 전 변수 변경

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level2_v94_a2_part1.json` #12
- 정답: `pass`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> score가 조건문 전에 증가한 뒤 이 코드가 출력하는 값은 무엇인가?

**코드**

```python
score = 50
score = score + 20
if score >= 60:
    print("pass")
```

**보기**

- 50
- 60
- pass
- 출력 없음

**현재 해설**

> score = score + 20 이후 score는 70이므로 score >= 60 조건이 True가 된다. 이 문제는 Level 2에서 조건문이나 리스트 상태를 직접 추적하는 연습이다. 정답은 보기의 익숙한 단어가 아니라, 변수 값과 실행 흐름이 실제로 만든 결과다. 특히 처음 score 50만 보고 조건을 False로 판단하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 변수에 저장된 값, 비교식의 True/False 결과, 들여쓰기된 블록의 실행 여부, 리스트에 들어 있는 현재 값을 순서대로 확인하면 안전하게 판단할 수 있다. 이 독해 습관은 나중에 필터링, 검색 결과 처리, 사용자 입력 검증, 데이터 목록 처리 코드로 그대로 이어진다.

### 15. 문자열 숫자와 숫자 비교

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level2_v94_a2_part1.json` #14
- 정답: `different`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> value가 문자열 10일 때 이 코드의 출력은 무엇인가?

**코드**

```python
value = "10"
if value == 10:
    print("same")
else:
    print("different")
```

**보기**

- same
- different
- 10
- 에러

**현재 해설**

> "10"은 문자열이고 10은 숫자이므로 == 비교 결과는 False가 된다. 이 문제는 Level 2에서 조건문이나 리스트 상태를 직접 추적하는 연습이다. 정답은 보기의 익숙한 단어가 아니라, 변수 값과 실행 흐름이 실제로 만든 결과다. 특히 화면에 비슷해 보이면 같은 값이라고 판단하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 변수에 저장된 값, 비교식의 True/False 결과, 들여쓰기된 블록의 실행 여부, 리스트에 들어 있는 현재 값을 순서대로 확인하면 안전하게 판단할 수 있다. 이 독해 습관은 나중에 필터링, 검색 결과 처리, 사용자 입력 검증, 데이터 목록 처리 코드로 그대로 이어진다.

### 16. int 변환 후 비교

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level2_v94_a2_part1.json` #15
- 정답: `same`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> int 변환 뒤 value == 10 조건이 참일 때 출력은 무엇인가?

**코드**

```python
value = int("10")
if value == 10:
    print("same")
```

**보기**

- different
- 10
- same
- 출력 없음

**현재 해설**

> int("10")은 숫자 10을 만들기 때문에 value == 10 비교 결과가 True가 된다. 이 문제는 Level 2에서 조건문이나 리스트 상태를 직접 추적하는 연습이다. 정답은 보기의 익숙한 단어가 아니라, 변수 값과 실행 흐름이 실제로 만든 결과다. 특히 변환 전 문자열 상태와 변환 후 숫자 상태를 섞어 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 변수에 저장된 값, 비교식의 True/False 결과, 들여쓰기된 블록의 실행 여부, 리스트에 들어 있는 현재 값을 순서대로 확인하면 안전하게 판단할 수 있다. 이 독해 습관은 나중에 필터링, 검색 결과 처리, 사용자 입력 검증, 데이터 목록 처리 코드로 그대로 이어진다.

### 17. return만 있는 함수

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a1_functions.json` #8
- 정답: `아무것도 출력되지 않음`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 이 코드를 실행했을 때 화면 출력은?

**코드**

```python
def make_word():
    return "python"

make_word()
```

**보기**

- python
- make_word
- None
- 아무것도 출력되지 않음

**현재 해설**

> make_word()는 값을 return하지만 화면에 출력하지 않는다. 이 문제는 Level 3에서 함수 정의와 함수 호출을 분리해서 읽는 연습이다. def 줄은 코드를 묶어 이름을 붙이는 단계이고, 실제 실행은 함수 이름 뒤에 괄호를 붙여 호출하는 줄에서 일어난다. 정답을 고를 때는 함수 안으로 들어가기 전에 먼저 호출 줄의 argument 값을 확인하고, 그 값이 parameter 이름에 들어간다고 생각한 뒤 함수 본문을 한 줄씩 따라가야 한다. 또 print는 화면 출력이고 return은 호출한 자리로 값을 돌려주는 동작이라는 점을 구분해야 한다. 출력된 글자와 변수에 저장된 값이 서로 다를 수 있으므로 실제 실행 흐름을 기준으로 판단한다.

### 18. 중첩 dict 값 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a2_dict_tuple_set.json` #14
- 정답: `Seoul`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
user = {"profile": {"city": "Seoul"}}
print(user["profile"]["city"])
```

**보기**

- profile
- city
- Seoul
- {'city': 'Seoul'}

**현재 해설**

> 먼저 profile dict를 꺼내고 그 안에서 city 값을 꺼낸다. 이 문제는 Level 3에서 자료구조의 모양과 접근 방식을 분리해서 읽는 연습이다. dict는 key로 value를 찾고, tuple은 순서가 있는 묶음이며, set은 중복 없는 값 모음이다. 정답을 고를 때는 코드가 값을 새로 만드는지, 기존 값을 바꾸는지, key로 꺼내는지, 반복문으로 key와 value를 함께 읽는지 확인해야 한다. 특히 대괄호 접근, get 기본값, keys와 values와 items의 차이, tuple unpacking, set의 중복 제거를 실제 실행 순서대로 따라간다.

### 19. dict를 JSON 문자열로 바꾸기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level3_v95_a4_file_exception_path.json` #27
- 정답: `str`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
import json
data = {"name": "Mina"}
text = json.dumps(data, ensure_ascii=False)
print(type(text).__name__)
```

**보기**

- dict
- str
- list
- json

**현재 해설**

> json.dumps의 결과 text는 문자열이다. 이 문제는 Level 3에서 파일 처리, 경로 처리, 예외 처리의 실행 흐름을 읽는 연습이다. open과 with는 파일을 여는 방식이고, read와 write는 내용을 읽거나 쓰는 동작이다. pathlib Path는 경로를 부품처럼 다루게 해 주며, try/except는 실패할 수 있는 코드의 정상 흐름과 오류 흐름을 나누어 준다. 정답은 코드가 파일을 읽는지 쓰는지, 오류가 발생하는지, except가 실행되는지, Path 속성이 어떤 부분을 가리키는지를 기준으로 고른다.

### 20. method 안 print 실행

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level4_v95_a5_oop_basics.json` #7
- 정답: `woof`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
class Dog:
    def speak(self):
        print("woof")

pet = Dog()
pet.speak()
```

**보기**

- speak
- woof
- Dog
- None

**현재 해설**

> pet.speak()가 speak method의 print를 실행한다. 이 문제는 Level 4에서 객체지향 기초 코드를 실행 순서대로 읽는 연습이다. class는 설계도이고 object는 class를 호출해서 만든 실제 값이다. self는 method가 실행되는 현재 object를 가리키며, __init__은 object가 만들어질 때 attribute를 준비하는 특별한 method다. 정답을 고를 때는 class 정의만 보고 바로 실행된다고 생각하지 말고, object 생성 줄, attribute 대입, method 호출, return 또는 print 흐름을 차례대로 따라가야 한다.

### 21. method 정의만 있고 호출 없음

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level4_v95_a5_oop_basics.json` #8
- 정답: `아무것도 출력되지 않음`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형, 다른 보기 언급 감지
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 화면 출력으로 맞는 것은?

**코드**

```python
class Dog:
    def speak(self):
        print("woof")

pet = Dog()
```

**보기**

- woof
- Dog
- speak
- 아무것도 출력되지 않음

**현재 해설**

> pet.speak() 호출이 없으므로 print가 실행되지 않는다. 이 문제는 Level 4에서 객체지향 기초 코드를 실행 순서대로 읽는 연습이다. class는 설계도이고 object는 class를 호출해서 만든 실제 값이다. self는 method가 실행되는 현재 object를 가리키며, __init__은 object가 만들어질 때 attribute를 준비하는 특별한 method다. 정답을 고를 때는 class 정의만 보고 바로 실행된다고 생각하지 말고, object 생성 줄, attribute 대입, method 호출, return 또는 print 흐름을 차례대로 따라가야 한다.

### 22. break 복습

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_beginner_mixed_review_v96_a1.json` #24
- 정답: `1만 출력된다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
for n in [1, 2, 3]:
    if n == 2:
        break
    print(n)
```

**보기**

- 1 다음 2가 출력된다
- 2만 출력된다
- 아무것도 출력되지 않음
- 1만 출력된다

**현재 해설**

> n이 1일 때만 출력되고 2에서 break로 멈춘다. 이 문제는 초급 파이썬 코드를 한 줄씩 읽는 복습 문제다. 정답을 고를 때는 문법 이름을 외우는 것보다 실행 순서, 변수의 현재 값, 조건의 True/False, 반복 중 바뀌는 값, 자료구조에 남는 값을 확인해야 한다. 특히 print되는 값과 변수에 저장되는 값은 다를 수 있고, 함수는 호출될 때 실행되어 return 값을 돌려준다.

### 23. try/except 복습

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_beginner_mixed_review_v96_a1.json` #32
- 정답: `결과는 0이다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
try:
    number = int("x")
except ValueError:
    number = 0
print(number)
```

**보기**

- 결과는 'x'이다
- 결과는 0이다
- 결과는 ValueError이다
- 결과는 None이다

**현재 해설**

> int('x')가 실패하므로 except에서 number가 0이 된다. 이 문제는 초급 파이썬 코드를 한 줄씩 읽는 복습 문제다. 정답을 고를 때는 문법 이름을 외우는 것보다 실행 순서, 변수의 현재 값, 조건의 True/False, 반복 중 바뀌는 값, 자료구조에 남는 값을 확인해야 한다. 특히 print되는 값과 변수에 저장되는 값은 다를 수 있고, 함수는 호출될 때 실행되어 return 값을 돌려준다.

### 24. 문자열 나누기 복습

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_beginner_reading_notes_v96_a2.json` #7
- 정답: `'red'가 된다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
text = "red blue"
words = text.split()
print(words[0])
```

**보기**

- 'blue'가 된다
- 'red blue'가 된다
- 결과는 0이다
- 'red'가 된다

**현재 해설**

> 공백 기준 split 결과의 첫 값은 red다. 이 문제는 새 문법을 늘리는 것보다 초급자가 코드를 읽는 순서를 복습하도록 만든 문제다. 먼저 출력 줄을 확인하고, 그 출력에 필요한 변수 값과 자료구조 값을 위에서부터 추적한다. 조건문은 True/False 결과를 판단하고, 반복문은 반복마다 바뀌는 값을 따라가며, 함수는 호출될 때 실행되어 return 값을 돌려준다는 점을 기준으로 정답을 고른다. 이 문제는 새 문법을 늘리는 것보다

### 25. setdefault는 기존 key를 덮어쓰지 않는다

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_core_gaps_v99_a1.json` #13
- 정답: `2\n2`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과로 맞는 것은?

**코드**

```python
counts = {"a": 2}
value = counts.setdefault("a", 0)
print(value)
print(counts["a"])
```

**보기**

- 0\n0
- 2\n0
- 0\n2
- 2\n2

**현재 해설**

> setdefault는 key가 없을 때만 기본값을 넣고, 이미 있으면 기존 값을 유지한다. 이 예제에서는 a key가 이미 있으므로 새 기본값을 덮어쓰지 않고 기존 값 2를 반환한다. counts['a']도 2로 유지된다. 이 메서드는 딕셔너리 누적이나 그룹 만들기에서 자주 쓰인다. 대괄호 대입처럼 무조건 바꾸는 것이 아니라 없을 때만 채운다는 점이 핵심이다.

### 26. dict.pop으로 key 제거하기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_core_gaps_v99_a1.json` #15
- 정답: `99\nFalse`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과로 맞는 것은?

**코드**

```python
row = {"id": 1, "temp": 99}
removed = row.pop("temp")
print(removed)
print("temp" in row)
```

**보기**

- 99\nTrue
- temp\nFalse
- None\nTrue
- 99\nFalse

**현재 해설**

> row.pop('temp')는 temp 값을 99로 꺼내고, temp key를 row에서 제거한다. 그래서 'temp' in row는 False다. pop은 값을 꺼내는 동작과 key 삭제를 동시에 하므로 이후 row 구조가 바뀐다는 점을 기억해야 한다.

### 27. discard는 없어도 오류 없이 제거를 시도한다

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_core_gaps_v99_a1.json` #16
- 정답: `['a', 'b']`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과는?

**코드**

```python
seen = {"a", "b"}
seen.discard("c")
print(sorted(seen))
```

**보기**

- ['c']
- 오류가 난다
- []
- ['a', 'b']

**현재 해설**

> discard는 set에서 값을 제거하려고 시도하지만, 대상 값이 없어도 오류를 내지 않는다. 이 예제에서 c는 seen에 없으므로 set 내용은 그대로 유지된다. remove는 없는 값을 지우려 하면 오류가 날 수 있지만 discard는 조용히 넘어간다. 그래서 이미 있을 수도 있고 없을 수도 있는 값을 안전하게 정리할 때 discard를 쓰면 흐름이 끊기지 않는다.

### 28. readline 다음 readlines 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_core_gaps_v99_a1.json` #20
- 정답: `A\n1`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력 결과로 맞는 것은?

**코드**

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

**보기**

- A\n2
- B\n1
- memo.txt\n2
- A\n1

**현재 해설**

> readline은 현재 위치에서 한 줄만 읽고 파일의 읽기 위치를 다음 줄로 옮긴다. 그 다음 readlines를 호출하면 처음부터 다시 읽는 것이 아니라 남은 줄들만 리스트로 읽는다. 이 예제에서는 첫 줄 A를 이미 읽었기 때문에 rest에는 B만 남고 길이는 1이다. 파일 읽기 문제는 함수 이름뿐 아니라 현재 커서 위치가 계속 이어진다는 점을 함께 추적해야 한다.

### 29. 문자열 이어 붙이기 출력

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_beginner_v94_a1_part1.json` #6
- 정답: `Python`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> print("Py" + "thon")의 실행 결과로 맞는 것은 무엇인가?

**코드**

```python
print("Py" + "thon")
```

**보기**

- Py
- thon
- Python
- Py thon

**현재 해설**

> 두 값이 모두 문자열이므로 +는 산술 계산이 아니라 앞뒤 문자열을 이어 붙이는 역할을 한다. 이 문제는 코드를 위에서 아래로 읽으면서 값이 언제 만들어지고 언제 출력되는지 확인하는 연습이다. 정답은 보기의 익숙한 단어가 아니라 실제 실행 흐름이 만든 값이다. 특히 문자열 더하기에도 자동으로 공백이 생긴다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 변수 값, 따옴표 여부, 계산 순서, print가 실행되는 시점을 차례대로 확인하면 안전하게 판단할 수 있다. 초급 단계에서는 이런 작은 흐름을 정확히 읽는 것이 이후 조건문, 반복문, 파일 처리 코드를 이해하는 기반이 된다.

### 30. 쉼표 출력 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_beginner_v94_a1_part1.json` #7
- 정답: `A B`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> print("A", "B")의 출력에 가장 가까운 것은 무엇인가?

**코드**

```python
print("A", "B")
```

**보기**

- AB
- A,B
- A B
- B A

**현재 해설**

> print()에 쉼표로 두 값을 주면 두 값이 차례로 출력되고, 기본 출력에서는 사이에 공백이 보인다. 이 문제는 코드를 위에서 아래로 읽으면서 값이 언제 만들어지고 언제 출력되는지 확인하는 연습이다. 정답은 보기의 익숙한 단어가 아니라 실제 실행 흐름이 만든 값이다. 특히 쉼표 자체가 반드시 그대로 출력된다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 변수 값, 따옴표 여부, 계산 순서, print가 실행되는 시점을 차례대로 확인하면 안전하게 판단할 수 있다. 초급 단계에서는 이런 작은 흐름을 정확히 읽는 것이 이후 조건문, 반복문, 파일 처리 코드를 이해하는 기반이 된다.

### 31. type() 의미 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_beginner_v94_a1_part2.json` #5
- 정답: `값의 자료형`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> type(value)는 이 코드에서 무엇을 확인하는 함수인가?

**코드**

```python
value = "hello"
print(type(value))
```

**보기**

- 값의 길이
- 파일 경로
- 값의 자료형
- 출력 횟수

**현재 해설**

> type()은 값이 문자열인지 숫자인지 리스트인지 같은 자료형을 확인할 때 사용하는 함수다. 이 문제는 값이 문자열인지 숫자인지, 그리고 변환 함수가 적용되었는지를 확인하는 초급 독해 연습이다. 정답은 보기의 모양이 아니라 실제 파이썬 실행 규칙이 만든 값이다. 특히 type()을 길이나 개수를 세는 함수로 보는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 따옴표 여부, input() 결과의 자료형, int()나 str() 같은 변환 함수, print가 보여 주는 최종 값을 차례대로 확인하면 안전하게 판단할 수 있다. 이 흐름은 나중에 사용자 입력, 설정값, 파일에서 읽은 문자열 데이터를 처리할 때 그대로 이어진다.

### 32. 문자열 반복하기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_beginner_v94_a1_part2.json` #7
- 정답: `'hahaha'가 된다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> text가 "ha"일 때 text * 3의 출력은 무엇인가?

**코드**

```python
text = "ha"
print(text * 3)
```

**보기**

- 'ha3'이 된다
- 결과는 6이다
- 'hahaha'가 된다
- 에러가 난다

**현재 해설**

> 문자열과 정수의 곱셈은 문자열을 정해진 횟수만큼 반복해 새 문자열을 만든다. 이 문제는 값이 문자열인지 숫자인지, 그리고 변환 함수가 적용되었는지를 확인하는 초급 독해 연습이다. 정답은 보기의 모양이 아니라 실제 파이썬 실행 규칙이 만든 값이다. 특히 문자열 길이와 숫자를 곱해 숫자 결과가 나온다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 따옴표 여부, input() 결과의 자료형, int()나 str() 같은 변환 함수, print가 보여 주는 최종 값을 차례대로 확인하면 안전하게 판단할 수 있다. 이 흐름은 나중에 사용자 입력, 설정값, 파일에서 읽은 문자열 데이터를 처리할 때 그대로 이어진다.

### 33. 문자열 길이 세기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_beginner_v94_a1_part2.json` #10
- 정답: `결과는 6이다`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> word가 Python일 때 len(word)의 출력은 무엇인가?

**코드**

```python
word = "Python"
print(len(word))
```

**보기**

- 결과는 5이다
- 결과는 6이다
- 'Python'이 된다
- 'word'가 된다

**현재 해설**

> Python은 P, y, t, h, o, n 여섯 글자로 이루어져 있으므로 len(word)는 6을 반환한다. 이 문제는 값이 문자열인지 숫자인지, 그리고 변환 함수가 적용되었는지를 확인하는 초급 독해 연습이다. 정답은 보기의 모양이 아니라 실제 파이썬 실행 규칙이 만든 값이다. 특히 단어의 의미나 변수 이름을 길이로 세는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 따옴표 여부, input() 결과의 자료형, int()나 str() 같은 변환 함수, print가 보여 주는 최종 값을 차례대로 확인하면 안전하게 판단할 수 있다. 이 흐름은 나중에 사용자 입력, 설정값, 파일에서 읽은 문자열 데이터를 처리할 때 그대로 이어진다.

### 34. 두 입력 이어 붙이기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_beginner_v94_a1_part2.json` #16
- 정답: `AB`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 첫 입력이 A, 둘째 입력이 B일 때 출력은 무엇인가?

**코드**

```python
first = input()
second = input()
print(first + second)
```

**보기**

- A B
- BA
- AB
- 2

**현재 해설**

> first에는 A, second에는 B가 문자열로 저장되고, first + second는 두 문자열을 순서대로 이어 붙인다. 이 문제는 값이 문자열인지 숫자인지, 그리고 변환 함수가 적용되었는지를 확인하는 초급 독해 연습이다. 정답은 보기의 모양이 아니라 실제 파이썬 실행 규칙이 만든 값이다. 특히 두 입력 사이에 자동 공백이 생긴다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 따옴표 여부, input() 결과의 자료형, int()나 str() 같은 변환 함수, print가 보여 주는 최종 값을 차례대로 확인하면 안전하게 판단할 수 있다. 이 흐름은 나중에 사용자 입력, 설정값, 파일에서 읽은 문자열 데이터를 처리할 때 그대로 이어진다.

### 35. 함수 안 메서드 체인 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_expansion_v10.json` #9
- 정답: `lidar`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력은?

**코드**

```python
def normalize(text):
    return text.strip().lower()

print(normalize(" LiDAR "))
```

**보기**

-  LiDAR 
- LiDAR
- lidar
- LIDAR

**현재 해설**

> 함수 체인은 한 결과를 다음 함수나 메서드로 이어 처리하는 방식이다. strip으로 공백을 제거한 뒤 lower로 소문자로 바꾼다. 중간 결과를 머릿속에 적어 두면 여러 메서드가 이어져도 최종 출력이 어떻게 바뀌는지 놓치지 않는다.

### 36. list comprehension 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_expansion_v10.json` #17
- 정답: `[2, 4, 6]`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력은?

**코드**

```python
items = [1, 2, 3]
doubled = [x * 2 for x in items]
print(doubled)
```

**보기**

- [1, 2, 3]
- [1, 4, 9]
- [2, 4, 6]
- 6

**현재 해설**

> 리스트 컴프리헨션은 반복문으로 새 리스트를 만드는 짧은 문법이다. 각 x에 2를 곱한 값을 모아 새로운 리스트를 만든다. list comprehension은 반복문으로 리스트를 만드는 짧은 문법이다. 어떤 값을 꺼내 어떤 형태로 바꿔 새 리스트에 넣는지 보면 된다.

### 37. 조건이 있는 list comprehension

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_expansion_v10.json` #18
- 정답: `[2, 4]`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력은?

**코드**

```python
items = [1, 2, 3, 4]
evens = [x for x in items if x % 2 == 0]
print(evens)
```

**보기**

- [1, 3]
- [1, 2, 3, 4]
- [2, 4]
- []

**현재 해설**

> 리스트 컴프리헨션에는 조건 필터를 붙일 수 있다. x % 2 == 0 조건은 짝수인 값만 통과시켜 결과 리스트에 넣는다. 조건이 있는 list comprehension은 반복 대상 중 조건을 만족하는 값만 새 리스트에 담는다. for 부분과 if 부분을 나누어 읽으면 쉽다.

### 38. assert 기본 읽기

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_expansion_v10.json` #30
- 정답: `ok`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> 출력은?

**코드**

```python
assert 2 + 3 == 5
print("ok")
```

**보기**

- False
- AssertionError
- ok
- 5

**현재 해설**

> assert는 조건이 참인지 확인하는 간단한 검증 문장이다. 조건이 참이면 아무 오류 없이 다음 줄로 계속 실행된다. assert는 조건이 참인지 확인하고 거짓이면 즉시 오류를 내는 검사용 문장이다. 개발 중 가정이 깨졌는지 빠르게 확인하는 데 쓴다.

### 39. 기본 if 거짓

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level2_v94_a2_part1.json` #2
- 정답: `출력 없음`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> score가 40일 때 이 코드의 출력으로 맞는 것은 무엇인가?

**코드**

```python
score = 40
if score >= 60:
    print("pass")
```

**보기**

- pass
- 40
- False
- 출력 없음

**현재 해설**

> score >= 60이 False이므로 if 아래 print 줄은 실행되지 않는다. 이 문제는 Level 2에서 조건문이나 리스트 상태를 직접 추적하는 연습이다. 정답은 보기의 익숙한 단어가 아니라, 변수 값과 실행 흐름이 실제로 만든 결과다. 특히 조건이 거짓이어도 print가 무조건 실행된다고 생각하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 변수에 저장된 값, 비교식의 True/False 결과, 들여쓰기된 블록의 실행 여부, 리스트에 들어 있는 현재 값을 순서대로 확인하면 안전하게 판단할 수 있다. 이 독해 습관은 나중에 필터링, 검색 결과 처리, 사용자 입력 검증, 데이터 목록 처리 코드로 그대로 이어진다.

### 40. 빈 문자열 조건

- 분류: `HIGH_PRIORITY_REVIEW`
- 파일: `data/lessons/python_foundation_level2_v94_a2_part1.json` #6
- 정답: `비어 있음`
- 우선순위 이유: 초급/기초 카드, 정답이 짧아 해설 직접 연결 필요, 코드 결과/흐름 독해형, print/return 결과형
- 확인 포인트: 짧은 출력/결과 정답은 해설이 정답을 명확히 말하는지 우선 확인

**질문**

> text가 빈 문자열일 때 출력되는 문장은 무엇인가?

**코드**

```python
text = ""
if text:
    print("있음")
else:
    print("비어 있음")
```

**보기**

- 있음
- 비어 있음
- text
- 에러

**현재 해설**

> 빈 문자열은 조건문에서 False처럼 취급되므로 else 블록이 실행된다. 이 문제는 Level 2에서 조건문이나 리스트 상태를 직접 추적하는 연습이다. 정답은 보기의 익숙한 단어가 아니라, 변수 값과 실행 흐름이 실제로 만든 결과다. 특히 빈 문자열도 글자가 있다고 보고 True로 판단하는 부분을 조심해야 한다. 비슷한 코드를 만났을 때도 먼저 변수에 저장된 값, 비교식의 True/False 결과, 들여쓰기된 블록의 실행 여부, 리스트에 들어 있는 현재 값을 순서대로 확인하면 안전하게 판단할 수 있다. 이 독해 습관은 나중에 필터링, 검색 결과 처리, 사용자 입력 검증, 데이터 목록 처리 코드로 그대로 이어진다.


## 5. 다음 단계

- V310: 이 검토팩에서 실제 오류/보강 필요로 확인된 카드만 첫 복구 batch 진행
- V311 후보: V307 후보 전체의 오탐률을 반영해 감사 기준 개선

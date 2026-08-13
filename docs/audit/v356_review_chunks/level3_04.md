# V356 semantic review — Level 3 chunk 4

Cards 61-80 of 206.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYF95_A1_FUNC_008_RETURN_NO_PRINT
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: return만 있는 함수
- question_type: output_prediction
- concepts: ["def","function","return","print","function call"]
- reading_goal: return 값이 있어도 그 값을 print하거나 사용하지 않으면 화면 출력이 생기지 않는다는 점을 읽는다.
- code:
```python
def make_word():
    return "python"

make_word()
```
- question: 이 코드를 실행했을 때 화면 출력은?
- answer: 아무것도 출력되지 않음
- explanation: make_word()는 값을 return하지만 화면에 출력하지 않는다. 따라서 화면에는 아무것도 출력되지 않는다. 보기 표현으로는 ‘아무것도 출력되지 않음’이 맞다.
- project_context: 함수 결과를 실제로 사용하는 줄이 있는지 확인하는 습관은 긴 프로그램의 데이터 흐름 추적에 중요하다.

## PYF95_A1_FUNC_009_LOCAL_TOTAL
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수 안 지역 변수 계산
- question_type: output_prediction
- concepts: ["def","function","print","local variable","return","parameter"]
- reading_goal: 함수 안에서 만든 지역 변수 total이 parameter price를 이용해 계산되고 return 되는 흐름을 읽는다.
- code:
```python
def add_fee(price):
    total = price + 100
    return total

print(add_fee(900))
```
- question: 출력 결과는?
- answer: 1000
- explanation: add_fee(900)을 호출하면 price에 900이 들어간다. 함수 안에서 total = 900 + 100을 계산해 지역 변수 total에 1000을 저장하고, return total이 1000을 호출한 곳으로 돌려준다. 바깥 print가 1000을 출력한다.
- project_context: 가격, 점수, 개수처럼 입력값에 규칙을 적용해 새 값을 만드는 함수는 데이터 처리 코드에서 자주 쓰인다.

## PYF95_A1_FUNC_010_ARGUMENT_EXPRESSION
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: argument 자리에 계산식 넣기
- question_type: output_prediction
- concepts: ["def","function","print","argument","return","expression"]
- reading_goal: 함수 호출 괄호 안의 계산식이 먼저 계산된 뒤 parameter에 전달되는 흐름을 읽는다.
- code:
```python
def triple(n):
    return n * 3

print(triple(2 + 1))
```
- question: 출력 결과는?
- answer: 9
- explanation: triple에 값을 넘기기 전에 호출 괄호 안의 2 + 1이 먼저 계산되어 3이 된다. 따라서 n에는 3이 들어가고 함수는 3 * 3인 9를 return한다. 바깥 print가 9를 출력한다.
- project_context: 프로젝트 코드에서는 함수 argument 자리에 변수뿐 아니라 계산식이나 다른 함수 호출이 들어갈 수 있다.

## PYF95_A1_FUNC_011_FUNCTION_IN_FUNCTION
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수 결과를 다른 함수 입력으로 쓰기
- question_type: output_prediction
- concepts: ["def","function","print","return","function call","argument"]
- reading_goal: 안쪽 함수 호출의 return 값이 바깥 함수의 argument로 들어가는 중첩 호출 흐름을 읽는다.
- code:
```python
def double(n):
    return n * 2

def add_one(x):
    return x + 1

print(add_one(double(4)))
```
- question: 출력 결과는?
- answer: 9
- explanation: 가장 안쪽의 double(4)를 먼저 계산한다. n에 4가 들어가 8을 return하고, 그 8이 add_one의 argument가 되어 x에 들어간다. add_one은 8 + 1인 9를 return하고 가장 바깥 print가 9를 출력한다.
- project_context: 데이터 처리 파이프라인에서는 한 함수의 결과가 다음 함수의 입력으로 이어지는 구조가 자주 나타난다.

## PYF95_A1_FUNC_012_RETURN_STOPS_AFTER
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: return 뒤 줄은 실행되지 않음
- question_type: output_prediction
- concepts: ["def","function","return","control flow","print"]
- reading_goal: return을 만난 순간 함수 실행이 끝나고 그 아래 줄이 실행되지 않는 흐름을 읽는다.
- code:
```python
def pick():
    return "A"
    print("B")

print(pick())
```
- question: 출력 결과로 맞는 것은?
- answer: A
- explanation: pick() 안에서 return "A"가 실행되는 순간 함수 호출이 끝나므로 그 아래 print("B")에는 도달하지 않는다. 반환된 문자열 A를 바깥 print가 출력하며 따옴표는 화면에 나오지 않는다.
- project_context: 조건에 따라 함수가 일찍 끝나는 코드를 읽으려면 return 이후 실행 여부를 정확히 판단해야 한다.

## PYF95_A1_FUNC_013_IF_RETURN_TRUE
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 조건에 따라 True 반환하기
- question_type: output_prediction
- concepts: ["def","function","print","if","return","bool","parameter"]
- reading_goal: 함수 안 조건문에서 어떤 return이 실행되는지 판단하고 bool 값이 반환되는 흐름을 읽는다.
- code:
```python
def is_big(n):
    if n > 10:
        return True
    return False

print(is_big(12))
```
- question: 출력 결과는?
- answer: True
- explanation: is_big(12)를 호출하면 n은 12다. 조건 n > 10은 12 > 10이므로 True라서 if 안의 return True가 실행되고 함수가 바로 끝난다. 바깥 print가 반환된 Boolean 값 True를 출력한다.
- project_context: 검증 함수나 필터링 함수는 조건을 판단해 True 또는 False를 돌려주는 구조를 자주 가진다.

## PYF95_A1_FUNC_014_IF_RETURN_FALSE
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 조건이 거짓일 때 아래 return
- question_type: output_prediction
- concepts: ["def","function","print","if","return","bool","parameter"]
- reading_goal: 조건이 False일 때 if 안 return을 건너뛰고 다음 return이 실행되는 흐름을 읽는다.
- code:
```python
def is_big(n):
    if n > 10:
        return True
    return False

print(is_big(7))
```
- question: 출력 결과는?
- answer: False
- explanation: is_big(7)를 호출하면 n은 7이다. 조건 7 > 10은 False라서 if 안의 return True를 건너뛴다. 다음 return False가 실행되어 함수가 False를 돌려주고 바깥 print가 False를 출력한다.
- project_context: 함수 안 조건 분기는 데이터 검증, 권한 확인, 필터링 규칙을 읽을 때 기본이 된다.

## PYF95_A1_FUNC_015_STRING_METHOD_RETURN
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수 안에서 문자열 정리하기
- question_type: output_prediction
- concepts: ["def","function","print","return","strip","lower","parameter"]
- reading_goal: 문자열 argument가 함수 안에서 strip과 lower를 거쳐 새 문자열로 return 되는 흐름을 읽는다.
- code:
```python
def clean(text):
    return text.strip().lower()

print(clean(" Hi "))
```
- question: 출력 결과는?
- answer: hi
- explanation: clean(" Hi ")를 호출하면 text에 앞뒤 공백이 있는 문자열이 들어간다. text.strip()이 공백을 없애 "Hi"를 만들고, 이어지는 lower()가 "hi"로 바꾼다. 함수가 "hi"를 return하고 바깥 print가 hi를 출력한다.
- project_context: 사용자 입력이나 파일 텍스트를 정리하는 함수는 실제 서비스 코드에서 매우 자주 등장한다.

## PYF95_A1_FUNC_016_LIST_LEN_FUNCTION
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 리스트 길이를 반환하는 함수
- question_type: output_prediction
- concepts: ["def","function","print","list","len","return","parameter"]
- reading_goal: 리스트 argument가 parameter에 들어가고 len 결과가 return 되어 출력되는 흐름을 읽는다.
- code:
```python
def count_items(items):
    return len(items)

print(count_items(["a", "b", "c"]))
```
- question: 출력 결과는?
- answer: 3
- explanation: count_items에 ['a', 'b', 'c']가 전달되어 items가 세 항목의 리스트를 가리킨다. len(items)는 항목 수 3을 계산하고 함수가 3을 return한다. 바깥 print가 반환값 3을 출력한다.
- project_context: 카드 수, 파일 수, 검색 결과 수를 세는 함수는 프로젝트 검증 코드에서 자주 사용된다.

## PYF95_A1_FUNC_017_APPEND_INSIDE_FUNCTION
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수 안에서 리스트에 값 추가하기
- question_type: output_prediction
- concepts: ["def","print","list","append","return","function"]
- reading_goal: 함수 안에서 리스트 parameter에 append가 실행되고 변경된 리스트가 return 되는 흐름을 읽는다.
- code:
```python
def add_done(items):
    items.append("done")
    return items

result = add_done(["start"])
print(result)
```
- question: 출력 결과는?
- answer: ['start', 'done']
- explanation: 호출할 때 만든 리스트가 items parameter에 전달되고 append가 그 리스트 자체에 done을 추가한다. 함수가 같은 리스트를 return하므로 result도 변경된 ['start', 'done']을 가리키고 print가 그 내용을 출력한다. append는 새 리스트를 반환하는 함수가 아니라 기존 리스트를 바꾸는 메서드다.
- project_context: 데이터 처리 함수는 입력 리스트에 결과를 추가하거나 새 리스트를 만들어 반환하는 방식으로 자주 작성된다.

## PYF95_A1_FUNC_018_MAKE_LIST_RETURN
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수에서 새 리스트 만들기
- question_type: output_prediction
- concepts: ["def","function","print","list","local variable","return","argument"]
- reading_goal: 두 argument가 parameter에 들어간 뒤 함수 안에서 새 리스트로 묶이고 return 되는 과정을 읽는다.
- code:
```python
def make_pair(a, b):
    pair = [a, b]
    return pair

print(make_pair("x", "y"))
```
- question: 출력 결과는?
- answer: ['x', 'y']
- explanation: make_pair("x", "y")를 호출하면 a에는 x, b에는 y가 들어간다. 함수 안에서 pair = [a, b]가 ['x', 'y']라는 새 리스트를 만들고, return pair가 그 리스트를 돌려준다. 바깥 print가 ['x', 'y']를 출력한다.
- project_context: 여러 값을 하나의 묶음으로 만들어 반환하는 함수는 결과 카드, 로그 행, 설정 객체를 만들 때 자주 쓰인다.

## PYF95_A1_FUNC_019_COUNT_WITH_FOR
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수 안 for문으로 합계 만들기
- question_type: output_prediction
- concepts: ["def","function","print","for","return","list","local variable"]
- reading_goal: 함수 안 반복문에서 지역 변수 result가 누적되고 반복이 끝난 뒤 return 되는 흐름을 읽는다.
- code:
```python
def total(nums):
    result = 0
    for n in nums:
        result = result + n
    return result

print(total([1, 2, 3]))
```
- question: 출력 결과는?
- answer: 6
- explanation: total([1, 2, 3])을 호출하면 result는 0에서 시작한다. 반복하면서 1을 더해 1, 다시 2를 더해 3, 다시 3을 더해 6으로 바뀐다. 반복이 끝난 뒤 return result가 6을 돌려주고 바깥 print가 6을 출력한다.
- project_context: 점수 합계, 비용 합계, 처리 개수 계산처럼 누적 함수는 데이터 분석과 검증 코드에서 매우 자주 쓰인다.

## PYF95_A1_FUNC_020_COUNT_PREFIX
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 조건에 맞는 항목 개수 세기
- question_type: output_prediction
- concepts: ["def","function","print","for","if","return","str"]
- reading_goal: 함수 안 for문과 if문을 함께 읽고 조건에 맞는 항목만 count에 누적되는 흐름을 판단한다.
- code:
```python
def count_a(words):
    count = 0
    for word in words:
        if word.startswith("a"):
            count = count + 1
    return count

print(count_a(["apple", "book", "ant"]))
```
- question: 출력 결과는?
- answer: 2
- explanation: count는 0에서 시작한다. apple은 a로 시작해 count가 1이 되고, book은 조건이 False라 그대로 1이다. ant는 a로 시작해 count가 2가 된다. 반복 뒤 함수가 2를 return하고 바깥 print가 2를 출력한다.
- project_context: 검색 결과 필터링이나 데이터 품질 검사에서는 조건에 맞는 항목 수를 세는 함수가 자주 등장한다.

## PYF95_A1_FUNC_021_DEFAULT_LIKE_SIMPLE
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 기본값처럼 함수 안에서 대체하기
- question_type: output_prediction
- concepts: ["def","function","print","if","return","str"]
- reading_goal: 빈 문자열 argument가 들어왔을 때 조건문 안 return이 실행되어 함수가 일찍 끝나는 흐름을 읽는다.
- code:
```python
def label(text):
    if text == "":
        return "empty"
    return text

print(label(""))
```
- question: 출력 결과는?
- answer: empty
- explanation: label("")을 호출하면 text에는 빈 문자열이 들어간다. text == ""가 True이므로 첫 return "empty"가 실행되고 함수는 그 자리에서 끝난다. 아래 return text에는 도달하지 않으며 바깥 print가 empty를 출력한다.
- project_context: 입력값 검증 함수는 비어 있는 값, 누락된 값, 잘못된 값을 먼저 처리하고 일찍 반환하는 구조를 자주 가진다.

## PYF95_A1_FUNC_022_PARAMETER_NAME_LOCAL
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: parameter 이름은 함수 안 이름표
- question_type: output_prediction
- concepts: ["def","function","print","parameter","local variable","return","upper"]
- reading_goal: 함수 밖 변수와 함수 parameter 이름이 같을 때 어느 이름표가 어느 값을 가리키는지 구분한다.
- code:
```python
name = "outer"

def show(name):
    return name.upper()

print(show("inner"))
print(name)
```
- question: 출력 순서로 맞는 것은?
- answer: INNER 다음 outer
- explanation: 함수 밖 name에는 outer가 저장되어 있다. show("inner")를 호출하는 동안 함수 안의 parameter name은 별도의 지역 이름으로 inner를 가리키고, upper() 결과 INNER를 return한다. 첫 print가 INNER를 출력한 뒤에도 바깥 name은 outer 그대로이므로 둘째 print는 outer를 출력한다.
- project_context: 큰 코드에서 같은 이름이 여러 범위에 등장할 수 있으므로 어느 블록의 이름표인지 구분하는 습관이 필요하다.

## PYF95_A1_FUNC_023_RETURN_USED_IN_IF
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: return 값을 조건문에서 사용하기
- question_type: output_prediction
- concepts: ["else","def","function","print","return","if","bool","function call"]
- reading_goal: 함수의 bool return 값이 if 조건식으로 사용되는 흐름을 읽는다.
- code:
```python
def is_even(n):
    return n % 2 == 0

if is_even(4):
    print("even")
else:
    print("odd")
```
- question: 출력 결과는?
- answer: even
- explanation: is_even(4)를 호출하면 4 % 2는 0이고 0 == 0은 True이므로 함수가 True를 return한다. 이 반환값이 그대로 if의 조건이 되어 if 블록이 선택된다. 따라서 print("even")이 실행되어 even이 출력된다.
- project_context: 검증 함수는 True 또는 False를 돌려주고 그 결과로 다음 행동을 결정하는 코드에 자주 연결된다.

## PYF95_A1_FUNC_024_NO_ARGUMENT_ERROR_READING
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 필요한 argument를 빠뜨린 호출
- question_type: concept_reading
- concepts: ["def","function","return","parameter","argument","error"]
- reading_goal: 함수 정의에 필요한 parameter가 있는데 호출할 때 argument를 넣지 않은 경우 오류가 난다는 점을 읽는다.
- code:
```python
def greet(name):
    return "Hi " + name

greet()
```
- question: 이 코드에 대한 설명으로 맞는 것은?
- answer: 필요한 argument가 없어 오류가 난다
- explanation: greet는 필수 parameter name 하나를 선언했지만 greet() 호출은 argument를 전달하지 않았다. Python은 함수 본문을 실행하기 전에 호출 규칙을 확인하고, 필수 positional argument가 없다는 TypeError를 발생시킨다.
- project_context: 함수 사용 오류를 찾을 때는 정의 줄의 parameter 개수와 호출 줄의 argument 개수를 먼저 비교해야 한다.

## PYF95_A1_FUNC_025_TOO_MANY_ARGUMENTS
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: argument를 너무 많이 넣은 호출
- question_type: concept_reading
- concepts: ["def","function","return","parameter","argument","error"]
- reading_goal: 함수 정의의 parameter 개수보다 호출할 때 넣은 argument가 많으면 오류가 날 수 있음을 판단한다.
- code:
```python
def square(n):
    return n * n

square(2, 3)
```
- question: 이 코드에 대한 설명으로 맞는 것은?
- answer: argument가 너무 많아 오류가 난다
- explanation: square는 positional parameter n 하나만 받는데 square(2, 3)은 argument 두 개를 전달한다. Python은 함수 본문을 실행하기 전에 개수가 맞지 않는다는 TypeError를 발생시킨다.
- project_context: API나 라이브러리 함수를 사용할 때 괄호 안에 넣는 값의 개수와 순서를 맞추는 것은 기본적인 디버깅 포인트다.

## PYF95_A1_FUNC_026_RETURN_STRING_NUMBER
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수가 문자열 숫자를 반환할 때
- question_type: output_prediction
- concepts: ["def","function","print","return","str","type"]
- reading_goal: 함수 return 값이 숫자처럼 보여도 문자열이면 문자열 이어 붙이기가 일어난다는 점을 읽는다.
- code:
```python
def get_count():
    return "3"

value = get_count()
print(value + "1")
```
- question: 출력 결과는?
- answer: 31
- explanation: get_count()는 숫자 3이 아니라 문자열 "3"을 return하므로 value에도 문자열 "3"이 저장된다. value + "1"은 숫자 덧셈이 아니라 문자열 이어 붙이기라서 "31"이 된다. 마지막 print가 31을 출력한다.
- project_context: 입력값과 반환값의 자료형을 확인하는 습관은 계산 오류를 줄이는 데 중요하다.

## PYF95_A1_FUNC_027_RETURN_INT_CONVERT
- level: 3
- file: python_foundation_level3_v95_a1_functions.json
- title: 함수 안에서 int로 바꾸기
- question_type: output_prediction
- concepts: ["def","function","print","int","return","local variable","parameter"]
- reading_goal: 문자열 argument가 함수 안에서 int로 변환되고 계산 결과가 return 되는 흐름을 읽는다.
- code:
```python
def plus_one(text):
    number = int(text)
    return number + 1

print(plus_one("7"))
```
- question: 출력 결과는?
- answer: 8
- explanation: plus_one("7")을 호출하면 text에는 문자열 "7"이 들어간다. int(text)가 이를 정수 7로 바꾸어 number에 저장하고, number + 1은 숫자 계산 7 + 1이므로 8이다. 함수가 8을 return하고 바깥 print가 8을 출력한다.
- project_context: 사용자 입력이나 파일에서 읽은 숫자 문자열을 계산 가능한 숫자로 바꾸는 코드는 실전에서 자주 등장한다.

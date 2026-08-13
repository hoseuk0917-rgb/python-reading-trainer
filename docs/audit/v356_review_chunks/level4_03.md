# V356 semantic review — Level 4 chunk 3

Cards 41-60 of 97.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PYF95_A5_OOP_005_INIT_NAME
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: __init__으로 name 저장
- question_type: output_prediction
- concepts: ["def","function","print","class","__init__","self","attribute"]
- reading_goal: __init__ parameter가 self.name attribute로 저장되고 object에서 읽히는 흐름을 읽는다.
- code:
```python
class User:
    def __init__(self, name):
        self.name = name

u = User("Mina")
print(u.name)
```
- question: 출력 결과는?
- answer: Mina
- explanation: User('Mina')가 먼저 새 instance를 만들고 그 instance가 self로, 문자열 Mina가 name으로 __init__에 전달된다. self.name = name이 instance attribute를 저장하므로 u.name은 Mina다. __init__은 instance를 새로 반환하는 함수가 아니라 생성된 instance를 초기화하며 보통 None을 반환해야 한다.
- project_context: 사용자, 카드, 문제 같은 데이터를 object로 만들 때 초기 attribute 저장이 핵심이다.

## PYF95_A5_OOP_006_INIT_TWO_OBJECTS
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: 두 object의 attribute 구분
- question_type: output_prediction
- concepts: ["def","function","print","class","__init__","object","attribute"]
- reading_goal: 같은 class에서 만든 두 object가 각자 다른 name attribute를 가지는 흐름을 읽는다.
- code:
```python
class User:
    def __init__(self, name):
        self.name = name

a = User("A")
b = User("B")
print(a.name)
print(b.name)
```
- question: 출력 순서로 맞는 것은?
- answer: A 다음 B
- explanation: User('A')와 User('B')는 서로 다른 instance를 만든다. 각 __init__ 호출의 self가 다르므로 a.name은 A, b.name은 B로 독립적으로 저장되어 A 다음 B가 출력된다. 한 instance의 name을 바꿔도 다른 instance의 name은 자동으로 바뀌지 않는다.
- project_context: 여러 사용자나 여러 학습 카드 object를 구분하는 데 필요한 기본 개념이다.

## PYF95_A5_OOP_007_METHOD_PRINT
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: method 안 print 실행
- question_type: output_prediction
- concepts: ["def","function","class","print","method","self","object"]
- reading_goal: object가 method를 호출할 때 method 본문이 실행되는 흐름을 읽는다.
- code:
```python
class Dog:
    def speak(self):
        print("woof")

pet = Dog()
pet.speak()
```
- question: 출력 결과는?
- answer: woof
- explanation: pet.speak()가 speak method의 print를 실행한다. 따라서 출력은 ‘woof’이다.
- project_context: object에 동작을 붙여 사용하는 코드는 method 호출로 읽는다.

## PYF95_A5_OOP_008_METHOD_NOT_CALLED
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: method 정의만 있고 호출 없음
- question_type: output_prediction
- concepts: ["def","function","print","method","call","class"]
- reading_goal: method를 정의해도 호출하지 않으면 본문이 실행되지 않는다는 점을 읽는다.
- code:
```python
class Dog:
    def speak(self):
        print("woof")

pet = Dog()
```
- question: 화면 출력으로 맞는 것은?
- answer: 아무것도 출력되지 않음
- explanation: pet.speak() 호출이 없으므로 print가 실행되지 않는다. 따라서 화면에는 아무것도 출력되지 않는다. 보기 표현으로는 ‘아무것도 출력되지 않음’이 맞다.
- project_context: class 안 method 정의와 실제 method 호출을 구분해야 한다.

## PYF95_A5_OOP_009_METHOD_RETURN
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: method return 값 출력
- question_type: output_prediction
- concepts: ["def","function","class","print","method","return","object"]
- reading_goal: method가 return한 값이 바깥 print로 출력되는 흐름을 읽는다.
- code:
```python
class Box:
    def get_value(self):
        return 3

box = Box()
print(box.get_value())
```
- question: 출력 결과는?
- answer: 3
- explanation: get_value method가 3을 return하고 print가 그 값을 출력한다.
- project_context: object method가 계산 결과를 돌려주는 구조는 서비스 코드에서 자주 등장한다.

## PYF95_A5_OOP_010_METHOD_USES_ATTRIBUTE
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: method에서 attribute 읽기
- question_type: output_prediction
- concepts: ["def","function","return","class","print","method","self","attribute","__init__"]
- reading_goal: method 안 self.name이 현재 object의 attribute를 읽는 흐름을 따라간다.
- code:
```python
class User:
    def __init__(self, name):
        self.name = name
    def greet(self):
        return "Hi " + self.name

u = User("Mina")
print(u.greet())
```
- question: 출력 결과는?
- answer: Hi Mina
- explanation: self.name은 Mina이므로 greet는 Hi Mina를 return한다.
- project_context: 사용자 이름이나 상태를 이용해 메시지를 만드는 method를 이해하는 데 필요하다.

## PYF95_A5_OOP_011_METHOD_CHANGES_ATTRIBUTE
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: method에서 attribute 바꾸기
- question_type: output_prediction
- concepts: ["def","function","class","print","method","attribute","self","__init__"]
- reading_goal: method가 self.count attribute를 읽고 새 값으로 바꾸는 흐름을 읽는다.
- code:
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
- question: 출력 결과는?
- answer: 1
- explanation: Counter()가 count를 0으로 초기화하고 c.add() 호출에서 self가 c에 바인딩된다. method가 c.count를 1로 바꾸므로 print(c.count)는 1을 출력한다. add에는 return이 없어 호출 결과 자체는 None이지만 이 코드는 그 반환값을 출력하지 않는다.
- project_context: 상태를 가진 object는 method 호출로 내부 값이 바뀔 수 있다.

## PYF95_A5_OOP_012_METHOD_CHANGES_TWICE
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: method 두 번 호출
- question_type: output_prediction
- concepts: ["def","function","class","print","method","attribute","state"]
- reading_goal: 같은 object의 method를 여러 번 호출하면 attribute 상태가 누적될 수 있음을 읽는다.
- code:
```python
class Counter:
    def __init__(self):
        self.count = 0
    def add(self):
        self.count = self.count + 1

c = Counter()
c.add()
c.add()
print(c.count)
```
- question: 출력 결과는?
- answer: 2
- explanation: add가 두 번 실행되어 count는 2가 된다.
- project_context: 버튼 클릭 수나 정답 수처럼 누적 상태를 object에 저장할 수 있다.

## PYF95_A5_OOP_013_INIT_TWO_PARAMS
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: __init__ parameter 두 개
- question_type: output_prediction
- concepts: ["def","function","class","print","__init__","parameter","attribute"]
- reading_goal: __init__의 여러 parameter가 각각 attribute로 저장되고 계산에 쓰이는 흐름을 읽는다.
- code:
```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(2, 5)
print(p.x + p.y)
```
- question: 출력 결과는?
- answer: 7
- explanation: x는 2, y는 5이므로 합은 7이다.
- project_context: 좌표나 범위처럼 여러 값을 가진 object를 이해하는 기본 패턴이다.

## PYF95_A5_OOP_014_OBJECTS_IN_LIST
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: object를 리스트에 담기
- question_type: output_prediction
- concepts: ["def","function","class","print","object","list","attribute"]
- reading_goal: 리스트 인덱스로 object를 고른 뒤 attribute를 읽는 두 단계 흐름을 읽는다.
- code:
```python
class User:
    def __init__(self, name):
        self.name = name

users = [User("A"), User("B")]
print(users[1].name)
```
- question: 출력 결과는?
- answer: B
- explanation: users[1]은 두 번째 User object이고 name은 B다.
- project_context: 여러 사용자나 카드 object를 리스트로 관리하는 코드에 필요하다.

## PYF95_A5_OOP_015_LOOP_OBJECTS
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: object 리스트 반복
- question_type: output_prediction
- concepts: ["def","function","class","print","object","for","attribute"]
- reading_goal: object 리스트를 반복하며 각 object의 attribute를 출력하는 흐름을 읽는다.
- code:
```python
class User:
    def __init__(self, name):
        self.name = name

users = [User("A"), User("B")]
for user in users:
    print(user.name)
```
- question: 출력 순서로 맞는 것은?
- answer: A 다음 B
- explanation: 첫 object의 name은 A, 두 번째 object의 name은 B다. 따라서 출력 순서는 ‘A 다음 B’이다.
- project_context: 데이터 목록의 각 object를 순회하는 코드는 앱에서 자주 사용된다.

## PYF95_A5_OOP_016_CLASS_VARIABLE_READ
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: class variable 읽기
- question_type: output_prediction
- concepts: ["print","class variable","class","attribute"]
- reading_goal: class에 직접 붙은 variable을 class 이름으로 읽는 흐름을 이해한다.
- code:
```python
class Config:
    version = "v1"

print(Config.version)
```
- question: 출력 결과는?
- answer: v1
- explanation: Config.version은 class variable version의 값 v1이다.
- project_context: 앱 버전이나 공통 설정값은 class variable처럼 표현될 수 있다.

## PYF95_A5_OOP_017_INSTANCE_READ_CLASS_VARIABLE
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: object에서 class variable 읽기
- question_type: output_prediction
- concepts: ["class","print","class variable","object","attribute"]
- reading_goal: object를 통해 class variable을 읽을 수 있는 간단한 흐름을 읽는다.
- code:
```python
class Config:
    version = "v1"

c = Config()
print(c.version)
```
- question: 출력 결과는?
- answer: v1
- explanation: c.version을 읽을 때 Python은 먼저 c instance에서 version을 찾는다. 해당 instance attribute가 없으므로 class Config로 올라가 class attribute 'v1'을 찾아 출력한다. 이것은 값이 c 안으로 복사됐다는 뜻이 아니라 attribute lookup의 결과다.
- project_context: 공통 설정값과 object별 값을 구분하는 첫 단계다.

## PYF95_A5_OOP_018_INSTANCE_ATTRIBUTE_OVERRIDES
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: object attribute가 class variable과 같은 이름일 때
- question_type: output_prediction
- concepts: ["class","print","class variable","instance attribute","assignment"]
- reading_goal: object에 같은 이름의 attribute를 대입하면 그 object에서는 새 값이 읽히는 흐름을 본다.
- code:
```python
class Config:
    version = "v1"

c = Config()
c.version = "v2"
print(c.version)
```
- question: 출력 결과는?
- answer: v2
- explanation: c.version = 'v2'는 c에 새 instance attribute를 만들어 같은 이름의 class attribute를 가린다. 따라서 c.version은 v2지만 Config.version은 여전히 v1이고 다른 instance는 별도 attribute가 없다면 v1을 읽는다. class attribute 자체를 바꾼 것은 아니다.
- project_context: 공통 기본값과 개별 override를 구분하는 코드 독해에 도움이 된다.

## PYF95_A5_OOP_019_SELF_PARAMETER_NOT_ARGUMENT
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: method 호출에서 self는 자동 연결
- question_type: concept_reading
- concepts: ["def","function","return","class","print","self","method","object"]
- reading_goal: method 호출에서 self가 호출한 object와 자동으로 연결된다는 점을 설명 수준에서 판단한다.
- code:
```python
class Dog:
    def speak(self):
        return "woof"

pet = Dog()
print(pet.speak())
```
- question: pet.speak() 호출에서 self에 해당하는 것은?
- answer: Dog instance인 pet
- explanation: pet.speak()는 bound method 호출이라 Python이 pet을 첫 parameter self로 자동 전달한다. 그래서 호출문에는 별도 argument가 없어 보여도 method 본문의 self는 pet을 가리킨다. self라는 이름은 강한 관례이며 instance method의 첫 parameter 역할이 핵심이다.
- project_context: self를 argument로 직접 넣지 않는 이유를 이해하면 method 호출 형태가 자연스럽게 보인다.

## PYF95_A5_OOP_020_INIT_ARGUMENT_CONNECTION
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: __init__ argument 연결
- question_type: concept_reading
- concepts: ["def","function","class","__init__","argument","parameter"]
- reading_goal: __init__ 호출에서 class 생성 argument가 self 뒤의 parameter로 들어가는 흐름을 이해한다.
- code:
```python
class User:
    def __init__(self, name):
        self.name = name

u = User("Mina")
```
- question: User("Mina")에서 "Mina"는 어디로 들어가는가?
- answer: name parameter
- explanation: User('Mina')에서 새 instance는 self로 자동 전달되고, 코드에 적은 argument 'Mina'는 다음 parameter name에 들어간다. self.name = name이 이 문자열을 instance attribute로 보관한다. 호출할 때 self 값을 별도로 적지 않는다.
- project_context: object 생성 줄과 __init__ 정의 줄을 연결하는 능력이 중요하다.

## PYF95_A5_OOP_021_METHOD_WITH_ARGUMENT
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: method에 argument 전달
- question_type: output_prediction
- concepts: ["def","function","return","class","print","method","argument","self"]
- reading_goal: method 호출에서 self 외의 argument가 parameter에 들어가 return 값에 쓰이는 흐름을 읽는다.
- code:
```python
class Greeter:
    def say(self, word):
        return "Hi " + word

g = Greeter()
print(g.say("Python"))
```
- question: 출력 결과는?
- answer: Hi Python
- explanation: word에 Python이 들어가므로 Hi Python을 return한다.
- project_context: object method도 일반 함수처럼 추가 입력값을 받을 수 있다.

## PYF95_A5_OOP_022_METHOD_TWO_ARGUMENTS
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: method parameter 두 개
- question_type: output_prediction
- concepts: ["def","function","class","print","method","parameter","return"]
- reading_goal: object method에 두 argument를 전달하고 return 결과를 출력하는 흐름을 읽는다.
- code:
```python
class Calculator:
    def add(self, a, b):
        return a + b

calc = Calculator()
print(calc.add(2, 3))
```
- question: 출력 결과는?
- answer: 5
- explanation: calc.add(2, 3)에서 calc는 self로 자동 전달되고 코드에 적은 2와 3은 각각 a와 b에 들어간다. method가 5를 반환하고 바깥 print가 그 값을 출력한다.
- project_context: 계산이나 변환을 method로 묶은 코드에서 자주 보이는 구조다.

## PYF95_A5_OOP_023_METHOD_CALLS_METHOD
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: method가 다른 method를 호출
- question_type: output_prediction
- concepts: ["def","function","class","print","method","self","return"]
- reading_goal: method 안에서 self.word()로 같은 object의 다른 method를 호출하는 흐름을 읽는다.
- code:
```python
class Text:
    def word(self):
        return "hi"
    def shout(self):
        return self.word().upper()

t = Text()
print(t.shout())
```
- question: 출력 결과는?
- answer: HI
- explanation: self.word()는 hi를 return하고 upper로 HI가 된다.
- project_context: class 내부 method들이 서로 연결되는 코드를 읽는 기초다.

## PYF95_A5_OOP_024_ATTRIBUTE_USED_IN_IF
- level: 4
- file: python_foundation_level4_v95_a5_oop_basics.json
- title: attribute를 조건문에서 사용
- question_type: output_prediction
- concepts: ["else","def","function","class","print","attribute","bool","if","__init__"]
- reading_goal: object attribute의 bool 값이 if 조건으로 쓰이는 흐름을 읽는다.
- code:
```python
class User:
    def __init__(self, active):
        self.active = active

u = User(True)
if u.active:
    print("on")
else:
    print("off")
```
- question: 출력 결과는?
- answer: on
- explanation: u.active는 True이므로 on이 출력된다.
- project_context: 사용자 상태나 설정 여부를 object attribute로 판단하는 코드와 연결된다.

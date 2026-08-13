# V356 semantic review — Level 5 chunk 4

Cards 61-80 of 110.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY119_L05_UTF8_SIG_READ_001
- level: 5
- file: python_json_error_encoding_beginner_v119_a1.json
- title: utf-8-sig로 파일 읽기
- question_type: multiple_choice
- concepts: ["import","utf-8-sig","BOM","encoding"]
- reading_goal: BOM이 붙은 UTF-8 파일을 읽을 때 utf-8-sig가 도움이 될 수 있음을 읽는다.
- code:
```python
from pathlib import Path

text = Path('data.json').read_text(encoding='utf-8-sig')
```
- question: encoding='utf-8-sig'를 쓰는 상황으로 알맞은 것은?
- answer: BOM이 붙은 UTF-8 파일을 자연스럽게 읽고 싶을 때
- explanation: utf-8-sig는 UTF-8 파일 앞의 BOM을 처리해 읽는 데 도움이 된다. 외부 도구가 만든 파일에서 가끔 필요하다. BOM이 남으면 첫 글자가 이상하게 보여 파싱이 실패할 수 있다.
- project_context: 외부에서 받은 JSON/CSV 파일을 읽을 때 생기는 보이지 않는 문자 문제를 줄인다.

## PY11_L05_enumerate_002
- level: 5
- file: python_libraries_missing_topics_v11.json
- title: enumerate로 번호와 값 같이 읽기
- question_type: meaning_choice
- concepts: ["print","enumerate","for","index"]
- reading_goal: 반복 중 index와 값을 함께 얻는 코드를 읽는다.
- code:
```python
labels = ["LiDAR", "Radar"]
for idx, label in enumerate(labels):
    print(idx, label)
```
- question: 첫 번째 반복에서 idx와 label은?
- answer: 0과 LiDAR
- explanation: enumerate(labels)는 각 값에 기본 번호 0, 1, ...을 붙여 순서대로 내놓는다. 첫 반복에서 idx에는 0, label에는 첫 값 "LiDAR"가 들어간다. 따라서 첫 print(idx, label)는 번호 0과 문자열 LiDAR를 함께 출력한다.
- project_context: 카드 번호, row 번호, shard 내부 순번을 만들 때 유용하다.

## PY11_L05_zip_002
- level: 5
- file: python_libraries_missing_topics_v11.json
- title: zip으로 두 리스트 묶기
- question_type: output_prediction
- concepts: ["print","zip","list","pair"]
- reading_goal: 두 리스트를 같은 위치끼리 묶는 코드를 읽는다.
- code:
```python
ids = ["n1", "n2"]
labels = ["LiDAR", "Radar"]
print(list(zip(ids, labels))[1])
```
- question: 출력은?
- answer: ('n2', 'Radar')
- explanation: zip은 여러 리스트의 같은 위치 값을 묶어 준다. 두 번째 쌍은 ids의 n2와 labels의 Radar가 함께 묶인 결과다. zip은 짧은 쪽 길이에 맞춰 멈추므로 두 리스트의 길이가 다를 때도 그 특징을 함께 확인해야 한다.
- project_context: id 목록과 label 목록을 함께 처리할 때 쓴다.

## PY129_L05_LOGGING_BASICCONFIG_001
- level: 5
- file: python_logging_verbose_cli_beginner_v129_a1.json
- title: logging 기본 설정 읽기
- question_type: multiple_choice
- concepts: ["import","logging","basicConfig","INFO","log level"]
- reading_goal: logging.basicConfig와 level 설정이 로그 출력 기준을 정한다는 점을 이해한다.
- code:
```python
import logging

logging.basicConfig(level=logging.INFO)
logging.info('처리를 시작합니다')
```
- question: 다음 코드에서 logging.basicConfig(level=logging.INFO)의 역할로 알맞은 것은?
- answer: INFO 이상 로그가 보이도록 기본 설정한다
- explanation: basicConfig(level=logging.INFO)는 루트 로거의 기본 출력 조건을 INFO로 잡아 INFO·WARNING·ERROR·CRITICAL 레코드가 보이게 한다. 이미 핸들러가 설정된 프로세스에서는 아무 변화가 없을 수 있으므로 라이브러리보다 CLI 진입점에서 한 번 설정한다.
- project_context: 

## PY129_L05_LOG_LEVEL_INFO_DEBUG_001
- level: 5
- file: python_logging_verbose_cli_beginner_v129_a1.json
- title: DEBUG와 INFO 구분하기
- question_type: multiple_choice
- concepts: ["DEBUG","INFO","logging level","debugging"]
- reading_goal: DEBUG와 INFO 로그를 사용자 진행 메시지와 개발자 확인 메시지로 구분한다.
- code:
```python
logging.debug('input_path=%s', input_path)
logging.info('파일 처리를 시작합니다')
```
- question: 보통 DEBUG 로그를 INFO 로그보다 자세한 내부 확인용으로 쓰는 이유로 알맞은 것은?
- answer: DEBUG는 개발자가 흐름을 확인할 때 더 자세히 남긴다
- explanation: DEBUG는 변수값, 분기, 내부 흐름처럼 자세한 확인용 메시지에 자주 쓴다. INFO는 사용자가 알아도 좋은 일반 진행 상태에 더 가깝다. 따라서 정답은 ‘DEBUG는 개발자가 흐름을 확인할 때 더 자세히 남긴다’이다.
- project_context: 

## PY129_L05_PRINT_VS_LOGGING_001
- level: 5
- file: python_logging_verbose_cli_beginner_v129_a1.json
- title: print와 logging 차이
- question_type: multiple_choice
- concepts: ["print","logging","log level","CLI UX"]
- reading_goal: print와 logging의 차이를 메시지 분류와 디버깅 관점에서 이해한다.
- code:
```python
print('완료')
logging.info('완료')
logging.debug('rows=%s', len(rows))
```
- question: 작은 CLI 도구가 커질수록 print만 쓰기보다 logging을 쓰면 좋은 이유로 알맞은 것은?
- answer: 메시지 중요도와 자세한 정도를 나눌 수 있어서
- explanation: print는 단순 출력에는 쉽지만 중요도 구분이 약하다. logging은 DEBUG, INFO, WARNING, ERROR처럼 메시지를 단계별로 나눌 수 있다.
- project_context: 

## PY129_L05_PROGRESS_LOG_MESSAGE_001
- level: 5
- file: python_logging_verbose_cli_beginner_v129_a1.json
- title: 처리 진행 로그 남기기
- question_type: multiple_choice
- concepts: ["progress log","logging.info","input_path","output_path"]
- reading_goal: 파일 처리 흐름에서 진행 로그가 문제 위치를 찾는 데 도움이 됨을 이해한다.
- code:
```python
logging.info('읽는 중: %s', input_path)
data = load_data(input_path)
logging.info('저장 중: %s', output_path)
```
- question: 파일 처리 CLI에서 logging.info('읽는 중: %s', input_path) 같은 로그를 남기는 이유는?
- answer: 현재 어느 단계인지 확인하기 위해
- explanation: 진행 로그는 프로그램이 입력 읽기, 처리, 저장 중 어디까지 왔는지 보여 준다. 실패가 났을 때 어느 단계에서 멈췄는지도 찾기 쉽다. 따라서 정답은 ‘현재 어느 단계인지 확인하기 위해’이다.
- project_context: 

## PY129_L05_VERBOSE_ENABLE_DEBUG_001
- level: 5
- file: python_logging_verbose_cli_beginner_v129_a1.json
- title: verbose일 때 DEBUG 켜기
- question_type: multiple_choice
- concepts: ["verbose","logging.DEBUG","logging.INFO","conditional expression"]
- reading_goal: verbose 옵션으로 DEBUG 로그 출력 여부를 조절하는 패턴을 이해한다.
- code:
```python
level = logging.DEBUG if args.verbose else logging.INFO
logging.basicConfig(level=level)
```
- question: 다음 코드에서 args.verbose가 True일 때 일어나는 일로 알맞은 것은?
- answer: DEBUG 로그까지 보이도록 설정한다
- explanation: verbose가 켜지면 level을 logging.DEBUG로 낮춰 더 자세한 로그까지 보이게 한다. verbose가 없으면 INFO 정도만 보이게 둘 수 있다.
- project_context: 

## PY129_L05_VERBOSE_FLAG_STORE_TRUE_001
- level: 5
- file: python_logging_verbose_cli_beginner_v129_a1.json
- title: --verbose 옵션 만들기
- question_type: multiple_choice
- concepts: ["print","argparse","store_true","verbose","boolean flag"]
- reading_goal: store_true 옵션이 CLI에서 켜기/끄기 플래그를 만드는 방식임을 이해한다.
- code:
```python
parser.add_argument('--verbose', action='store_true')
args = parser.parse_args()
print(args.verbose)
```
- question: argparse에서 --verbose 같은 켜기/끄기 옵션에 action='store_true'를 쓰는 이유는?
- answer: 옵션이 있으면 True, 없으면 False로 받기 위해
- explanation: store_true는 --verbose가 입력되면 True, 없으면 False를 만든다. 그래서 자세한 로그를 켤지 말지 분기하기 좋다.
- project_context: 

## PY115_L05_DICT_DEFAULT_RISK_001
- level: 5
- file: python_mutable_default_beginner_v115_a1.json
- title: dict 기본 인자도 조심
- question_type: multiple_choice
- concepts: ["def","function","return","dict","mutable default","cache","side effect"]
- reading_goal: list뿐 아니라 dict 같은 바뀌는 객체도 기본 인자로 직접 두면 위험할 수 있음을 읽는다.
- code:
```python
def remember(key, value, cache={}):
    cache[key] = value
    return cache
```
- question: 이 코드에서 cache={}가 위험할 수 있는 이유는?
- answer: cache가 호출 사이에 공유될 수 있기 때문에
- explanation: def add_flag(flags={})의 빈 dict는 함수가 정의될 때 한 번 만들어지고 이후 호출들이 같은 객체를 재사용한다. 첫 호출이 flags["seen"] = True로 그 dict를 바꾸면 다음 호출에도 변경된 내용이 남는다. 호출마다 새 dict가 필요하면 기본값을 None으로 두고 함수 안에서 새 dict를 만드는 패턴이 안전하다.
- project_context: 캐시나 설정 dict를 다루는 코드에서 의도치 않은 값 공유를 피하는 데 필요하다.

## PY115_L05_IS_NONE_001
- level: 5
- file: python_mutable_default_beginner_v115_a1.json
- title: is None 조건 읽기
- question_type: multiple_choice
- concepts: ["None","if","sentinel","condition"]
- reading_goal: if items is None이 값이 주어지지 않은 기본 상태를 확인하는 조건임을 읽는다.
- code:
```python
if items is None:
    items = []
```
- question: 이 조건문의 의미로 가장 알맞은 것은?
- answer: items가 기본 미지정 상태인지 확인한다
- explanation: None은 값이 없거나 아직 지정되지 않았다는 표시로 자주 쓴다. is None은 그 상태인지 확인하는 읽기 쉬운 조건이다. 빈 문자열이나 0과는 다른 의미다. 따라서 정답은 ‘items가 기본 미지정 상태인지 확인한다’이다.
- project_context: 오류 처리와 옵션 인자 코드를 읽을 때 자주 만나는 패턴이다.

## PY115_L05_NONE_SAFE_PATTERN_001
- level: 5
- file: python_mutable_default_beginner_v115_a1.json
- title: None 기본값 안전 패턴
- question_type: multiple_choice
- concepts: ["if","def","function","return","None","default argument","safe pattern","list"]
- reading_goal: 바뀌는 기본값이 필요할 때 None으로 받고 함수 안에서 새 리스트를 만드는 패턴을 읽는다.
- code:
```python
def add_item(x, items=None):
    if items is None:
        items = []
    items.append(x)
    return items
```
- question: 이 패턴을 쓰는 주된 이유는?
- answer: 매 호출에서 필요하면 새 리스트를 만들기 위해
- explanation: 인자를 생략해 items가 None일 때마다 함수 안에서 새 리스트를 만든다. 호출자가 리스트를 명시적으로 넘긴 경우에는 그 리스트를 그대로 수정하므로, '항상 복사한다'는 뜻은 아니다.
- project_context: 실제 프로젝트에서 기본 인자에 [] 대신 None을 쓰는 이유를 읽을 수 있게 해 준다.

## PY116_L05_CLASS_VARIABLE_SHARED_001
- level: 5
- file: python_oop_gap_beginner_v116_a1.json
- title: class variable 공유 주의
- question_type: multiple_choice
- concepts: ["class","print","class variable","object","shared state"]
- reading_goal: class variable은 여러 객체가 함께 보는 값처럼 쓰일 수 있음을 읽는다.
- code:
```python
class Card:
    kind = 'quiz'

c1 = Card()
c2 = Card()
print(c1.kind, c2.kind)
```
- question: kind = 'quiz'에 대한 설명으로 알맞은 것은?
- answer: 클래스 쪽에 놓인 공통값처럼 읽을 수 있다
- explanation: kind는 클래스에 저장된 속성이라 c1과 c2가 인스턴스 속성을 따로 만들지 않은 동안 같은 Card.kind를 찾아 읽는다. c1.kind에 새 값을 대입하면 그 인스턴스에서만 클래스 값을 가릴 수 있으며, 변경 가능한 클래스 속성은 여러 인스턴스가 실제 객체를 공유할 수 있어 주의한다.
- project_context: 공통 설정과 객체별 값을 구분해서 읽는 데 도움이 된다.

## PY116_L05_DATACLASS_BASIC_001
- level: 5
- file: python_oop_gap_beginner_v116_a1.json
- title: dataclass 기본 읽기
- question_type: multiple_choice
- concepts: ["import","dataclass","class","field","__init__"]
- reading_goal: dataclass가 데이터 보관용 class를 짧게 만드는 도구임을 읽는다.
- code:
```python
from dataclasses import dataclass

@dataclass
class Card:
    title: str
    level: int
```
- question: @dataclass를 쓰는 이유로 알맞은 것은?
- answer: 데이터 중심 class의 반복 코드를 줄이기 위해
- explanation: dataclass는 title, level 같은 필드를 가진 데이터 중심 class를 짧게 만들 수 있게 해 준다. __init__ 같은 반복 코드를 줄여 준다.
- project_context: 카드, 진행상태, 설정값 같은 데이터 모델을 읽는 데 도움이 된다.

## PY116_L05_INHERITANCE_BASIC_001
- level: 5
- file: python_oop_gap_beginner_v116_a1.json
- title: 상속 기본 흐름
- question_type: multiple_choice
- concepts: ["def","function","return","class","print","inheritance","parent class","child class","method"]
- reading_goal: child class가 parent class의 기능을 물려받을 수 있음을 읽는다.
- code:
```python
class Animal:
    def speak(self):
        return 'sound'

class Dog(Animal):
    pass

print(Dog().speak())
```
- question: Dog().speak()가 동작할 수 있는 이유는?
- answer: Dog가 Animal의 메서드를 물려받기 때문에
- explanation: class Dog(Animal):에서 괄호 안의 Animal이 부모 class다. Dog에 speak method를 따로 정의하지 않았으므로 d.speak()를 호출하면 Python이 Dog에서 찾은 뒤 부모 Animal까지 올라가 speak를 찾는다. 그래서 Animal.speak의 반환값 "sound"가 print로 출력된다.
- project_context: 공통 동작을 부모 class에 두고 여러 자식 class에서 재사용하는 구조를 읽는다.

## PY116_L05_OVERRIDE_METHOD_001
- level: 5
- file: python_oop_gap_beginner_v116_a1.json
- title: override로 메서드 바꾸기
- question_type: multiple_choice
- concepts: ["def","function","return","class","override","inheritance","method"]
- reading_goal: 자식 class가 부모와 같은 이름의 메서드를 다시 정의할 수 있음을 읽는다.
- code:
```python
class Animal:
    def speak(self):
        return 'sound'

class Dog(Animal):
    def speak(self):
        return 'bark'
```
- question: Dog의 speak 메서드에 대한 설명으로 알맞은 것은?
- answer: 부모의 speak 이름을 다시 정의한다
- explanation: Dog는 Animal을 상속하지만 같은 이름의 speak method를 자기 class에 다시 정의한다. d.speak()를 호출하면 Python이 먼저 Dog에서 method를 찾기 때문에 부모의 speak 대신 Dog.speak가 실행된다. 그래서 "woof"가 반환되어 print에 출력된다.
- project_context: 같은 인터페이스를 유지하면서 객체마다 다른 행동을 만들 때 필요한 감각이다.

## PY116_L05_SUPER_INIT_001
- level: 5
- file: python_oop_gap_beginner_v116_a1.json
- title: super().__init__ 읽기
- question_type: multiple_choice
- concepts: ["def","function","class","super","__init__","inheritance","reuse"]
- reading_goal: super().__init__이 부모 초기화 로직을 이어 쓰는 호출임을 읽는다.
- code:
```python
class User:
    def __init__(self, name):
        self.name = name

class Admin(User):
    def __init__(self, name, level):
        super().__init__(name)
        self.level = level
```
- question: super().__init__(name)의 역할로 알맞은 것은?
- answer: 부모 User의 초기화 코드를 호출한다
- explanation: super().__init__(name)은 부모 class의 초기화 로직을 이어서 실행한다. 그래서 name 설정은 부모 코드를 재사용하고, Admin은 level만 추가할 수 있다.
- project_context: 기존 객체 구조를 확장할 때 부모 초기화를 놓치지 않는 읽기 훈련이다.

## PY122_L05_BOOLEAN_FILTER_001
- level: 5
- file: python_pandas_beginner_v122_a1.json
- title: 조건으로 행 필터링
- question_type: multiple_choice
- concepts: ["boolean filter","condition","DataFrame"]
- reading_goal: df[df['score'] >= 80]처럼 조건을 만족하는 행만 남기는 pandas 필터링 표현을 읽는다.
- code:
```python
passed = df[df['score'] >= 80]
```
- question: passed = df[df['score'] >= 80]의 결과로 알맞은 것은?
- answer: score가 80 이상인 행만 남긴 표
- explanation: df['score'] >= 80은 True/False 조건을 만들고, df[...]는 그 조건이 True인 행만 남긴다. 조건식의 True 위치가 선택 결과를 결정한다.
- project_context: 표 데이터에서 조건에 맞는 행만 골라내는 기본 흐름이다.

## PY122_L05_COLUMNS_CHECK_001
- level: 5
- file: python_pandas_beginner_v122_a1.json
- title: df.columns로 컬럼 확인
- question_type: multiple_choice
- concepts: ["print","df.columns","column","DataFrame"]
- reading_goal: df.columns가 DataFrame이 가진 실제 컬럼 이름을 확인하는 데 쓰임을 읽는다.
- code:
```python
print(df.columns)
```
- question: df.columns를 출력하는 이유로 알맞은 것은?
- answer: 실제 컬럼 이름을 확인하기 위해
- explanation: df.columns에는 DataFrame이 실제로 가진 열 이름들이 들어 있다. print(df.columns)로 CSV를 읽은 직후 열 이름을 확인하면 이후 df["score"] 같은 접근에서 사용할 key가 정확히 존재하는지 점검할 수 있다. 즉 열 이름 오타나 예상과 다른 스키마를 일찍 찾기 위한 확인이다.
- project_context: pandas 컬럼 선택 전에 실제 열 이름을 확인하는 카드다.

## PY122_L05_SELECT_COLUMN_001
- level: 5
- file: python_pandas_beginner_v122_a1.json
- title: df['컬럼명']으로 열 선택
- question_type: multiple_choice
- concepts: ["column select","DataFrame","pandas"]
- reading_goal: df['score']처럼 대괄호와 컬럼명을 사용해 DataFrame의 한 열을 선택하는 표현을 읽는다.
- code:
```python
scores = df['score']
```
- question: scores = df['score']의 의미로 알맞은 것은?
- answer: score 열 하나를 선택한다
- explanation: df['score']는 DataFrame에서 score라는 열 하나를 가져오는 표현이다. 컬럼명이 실제로 존재해야 한다. 없는 이름을 쓰면 KeyError가 날 수 있다.
- project_context: DataFrame에서 필요한 열만 골라 읽는 기본 표현을 익힌다.

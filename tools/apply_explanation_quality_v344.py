from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src" / "pwa" / "app.js"
INDEX = ROOT / "src" / "pwa" / "index.html"
MARKER = "EXPLANATION_QUALITY_FOUNDATION_V344_A1"
SCRIPT = '<script src="./explanation_support_v344.js?v=20260812_v344_explain1"></script>'
CACHE = "eq=20260812_v344_explain1"

KO_BLOCK = r'''
// === EXPLANATION_QUALITY_FOUNDATION_V344_A1 BEGIN ===
Object.assign(conceptInfo, {
  "print": {definition:"print()는 값을 화면이나 터미널에서 확인할 때 쓰는 함수다. 괄호 안에 변수 이름을 넣으면 그 이름이 가리키는 현재 값을 보여 준다.", example:"name = \"Mina\"\nprint(name)"},
  "len": {definition:"len()은 문자열이나 리스트처럼 여러 내용을 가진 값의 길이를 알려 주는 함수다. 결과는 항목이나 문자의 개수를 나타내는 정수다.", example:"items = [\"a\", \"b\"]\nprint(len(items))"},
  "variable": {definition:"변수는 값을 나중에 다시 쓰기 위해 붙여 두는 이름이다. age = 20에서는 age라는 이름으로 값 20을 다시 사용할 수 있다.", example:"age = 20\nprint(age)"},
  "assignment": {definition:"대입은 오른쪽에서 만든 값을 왼쪽 이름으로 저장해 두는 동작이다. x = 3 뒤에는 x를 사용해 값 3을 다시 읽을 수 있다.", example:"x = 3\nprint(x)"},
  "type": {definition:"자료형(type)은 값의 종류를 뜻한다. 3은 정수(int), \"3\"은 문자열(str)이라서 겉모양이 비슷해도 할 수 있는 일이 다르다.", example:"print(type(3))\nprint(type(\"3\"))"},
  "str": {definition:"문자열(str)은 글자를 다루는 값이다. 따옴표로 감싼 \"3\"은 숫자처럼 보여도 글자이므로 정수 3과 다르게 동작한다.", example:"text = \"3\"\nprint(text)"},
  "int": {definition:"정수(int)는 1, 2, 100처럼 소수점이 없는 숫자다. 숫자 모양의 문자열은 int()로 정수로 바꿀 수 있다.", example:"number = int(\"3\")\nprint(number + 2)"},
  "float": {definition:"실수(float)는 3.5처럼 소수점이 있는 숫자를 다룬다. 숫자 모양의 문자열은 float()로 실수로 바꿀 수 있다.", example:"value = float(\"3.5\")\nprint(value)"},
  "bool": {definition:"bool은 True 또는 False 두 값으로 참과 거짓을 나타내는 자료형이다. if 같은 조건문은 이 참·거짓 판단을 이용해 실행할 코드를 고른다.", example:"ready = True\nif ready:\n    print(\"go\")"},
  "list": {definition:"리스트(list)는 여러 값을 순서대로 모아 두는 자료구조다. 첫 번째 위치는 0번이며, 필요하면 항목을 추가하거나 바꿀 수 있다.", example:"items = [\"a\", \"b\"]\nprint(items[0])"},
  "dict": {definition:"딕셔너리(dict)는 key와 value를 짝으로 저장해 이름표처럼 값을 찾는 자료구조다. data[\"name\"]처럼 key를 지정해 연결된 값을 읽는다.", example:"data = {\"name\": \"Mina\"}\nprint(data[\"name\"])"},
  "for": {definition:"for는 여러 값에서 항목을 하나씩 꺼내 같은 코드 블록을 반복한다. 매 회차마다 꺼낸 값이 반복 변수에 들어간다.", example:"for item in [\"a\", \"b\"]:\n    print(item)"},
  "if": {definition:"if는 조건이 True일 때만 들여쓴 코드 블록을 실행한다. 조건이 False면 그 블록을 건너뛴다.", example:"score = 80\nif score >= 60:\n    print(\"pass\")"},
  "function": {definition:"함수는 여러 줄의 작업에 이름을 붙여 필요할 때 다시 실행할 수 있게 만든 코드 묶음이다. 함수를 호출하면 그 안의 코드가 실행된다.", example:"def greet():\n    print(\"hi\")\n\ngreet()"},
  "def": {definition:"def는 함수를 만들고 이름을 붙이는 문법이다. 들여쓴 함수 본문은 def 줄을 읽을 때가 아니라 그 함수를 호출할 때 실행된다.", example:"def greet():\n    print(\"hi\")\n\ngreet()"},
  "parameter": {definition:"매개변수(parameter)는 함수가 호출될 때 받을 값에 붙여 둔 이름이다. 함수 안에서는 그 이름으로 전달받은 값을 사용한다.", example:"def greet(name):\n    print(name)"},
  "argument": {definition:"인자(argument)는 함수를 호출할 때 실제로 건네는 값이다. greet(\"Mina\")에서는 \"Mina\"가 인자다.", example:"greet(\"Mina\")"},
  "return": {definition:"return은 함수가 만든 결과를 호출한 곳으로 돌려주고 현재 함수 실행을 끝낸다. 돌려받은 값은 변수에 저장하거나 다른 계산에 사용할 수 있다.", example:"def add_one(x):\n    return x + 1\n\nresult = add_one(3)"},
  "scope": {definition:"scope는 변수나 이름을 코드의 어느 위치에서 사용할 수 있는지를 뜻한다. 함수 안에서 만든 지역 변수는 보통 그 함수 안에서 사용한다.", example:"def f():\n    x = 1\n    print(x)"},
  "module": {definition:"모듈은 관련된 Python 코드를 불러와 쓸 수 있도록 묶어 둔 단위다. 보통 import로 필요한 모듈을 불러온다.", example:"import json"},
  "import": {definition:"import는 다른 모듈에 준비된 이름과 기능을 현재 코드에서 사용할 수 있게 불러오는 문법이다.", example:"import json\nprint(json.dumps({\"x\": 1}))"},
  "file": {definition:"파일은 프로그램 밖에 데이터를 저장해 두는 단위다. 파일 코드를 읽을 때는 어떤 파일을 열고, 읽는지 쓰는지, 언제 닫는지를 확인한다.", example:"with open(\"a.txt\") as f:\n    text = f.read()"},
  "open": {definition:"open()은 파일을 읽거나 쓰기 위해 여는 함수다. 경로와 읽기·쓰기 방식(mode)을 확인하고, 보통 with와 함께 사용해 작업 뒤 파일을 닫는다.", example:"with open(\"a.txt\", \"r\", encoding=\"utf-8\") as f:\n    text = f.read()"},
  "exception": {definition:"예외(exception)는 코드를 실행하는 도중 정상 흐름을 계속할 수 없을 때 Python이 알리는 오류 상황이다. try/except로 필요한 예외만 골라 처리할 수 있다.", example:"try:\n    int(\"x\")\nexcept ValueError:\n    print(\"bad\")"},
  "class": {definition:"클래스(class)는 비슷한 객체들이 어떤 데이터와 기능을 가질지 정해 두는 설계다. 클래스를 사용해 실제 객체를 만들 수 있다.", example:"class Dog:\n    pass\n\ndog = Dog()"},
  "object": {definition:"객체(object)는 Python에서 실제로 다루는 하나의 값이다. 문자열, 리스트, 클래스로 만든 값도 모두 객체이며 각 객체는 자기 종류에 맞는 기능을 가질 수 있다.", example:"text = \"hi\"\nitems = [1, 2]"},
  "method": {definition:"메서드(method)는 특정 객체와 연결해 사용하는 함수다. text.strip()처럼 점(.) 앞의 객체에 맞는 기능을 호출한다.", example:"text = \" hi \"\nprint(text.strip())"},
  "mutable": {definition:"가변(mutable)은 만들어진 뒤에도 같은 객체의 내용을 바꿀 수 있다는 뜻이다. 리스트는 append()로 내용을 추가할 수 있는 대표적인 가변 값이다.", example:"items = []\nitems.append(1)"},
  "iterable": {definition:"iterable은 for문처럼 값을 하나씩 차례로 꺼내 볼 수 있는 대상을 뜻한다. 리스트, 문자열, 튜플 등이 대표적인 예다.", example:"for ch in \"abc\":\n    print(ch)"}
});
if (currentLanguage === "en") {
  Object.assign(conceptInfo, {
    "print": {definition:"print() displays a value so you can see it on the screen or terminal. If you pass a variable name, it displays that name's current value.", example:"name = \"Mina\"\nprint(name)"},
    "len": {definition:"len() tells you the length of a value such as a string or list. It returns the number of characters or items as an integer.", example:"items = [\"a\", \"b\"]\nprint(len(items))"},
    "variable": {definition:"A variable is a name attached to a value so you can use that value again later. After age = 20, the name age can be used to read 20 again.", example:"age = 20\nprint(age)"},
    "assignment": {definition:"Assignment stores the value made on the right under the name on the left. After x = 3, later code can use x to read 3 again.", example:"x = 3\nprint(x)"},
    "type": {definition:"A type tells you what kind of value something is. 3 is an int while \"3\" is a str, so values that look similar can behave differently.", example:"print(type(3))\nprint(type(\"3\"))"},
    "str": {definition:"A string (str) is a text value. The quoted value \"3\" looks numeric but is text, so it behaves differently from the integer 3.", example:"text = \"3\""},
    "int": {definition:"An integer (int) is a whole number such as 1, 2, or 100. int() can convert numeric text into an integer.", example:"number = int(\"3\")"},
    "float": {definition:"A float represents a number with a decimal part, such as 3.5. float() can convert numeric text into a float.", example:"value = float(\"3.5\")"},
    "bool": {definition:"A bool is either True or False. Conditions such as if use these truth values to decide which code should run.", example:"ready = True\nif ready:\n    print(\"go\")"},
    "list": {definition:"A list stores several values in order. The first position is 0, and list items can be added or changed when needed.", example:"items = [\"a\", \"b\"]\nprint(items[0])"},
    "dict": {definition:"A dict stores keys and values in pairs so a key can act like a label for finding its value. data[\"name\"] reads the value connected to the key \"name\".", example:"data = {\"name\": \"Mina\"}\nprint(data[\"name\"])"},
    "for": {definition:"for takes values one at a time and repeats the same block. On each pass, the current value is placed in the loop variable.", example:"for item in [\"a\", \"b\"]:\n    print(item)"},
    "if": {definition:"if runs its indented block only when the condition is True. If the condition is False, that block is skipped.", example:"if score >= 60:\n    print(\"pass\")"},
    "function": {definition:"A function gives a name to a group of steps so those steps can be run again when needed. Calling the function runs its body.", example:"def greet():\n    print(\"hi\")\n\ngreet()"},
    "def": {definition:"def creates a function and gives it a name. The indented function body runs when that function is called, not when Python first reads the def line.", example:"def greet():\n    print(\"hi\")\n\ngreet()"},
    "parameter": {definition:"A parameter is a name in a function definition that receives a value when the function is called. The function uses that name to work with the received value.", example:"def greet(name):\n    print(name)"},
    "argument": {definition:"An argument is the actual value passed when a function is called. In greet(\"Mina\"), \"Mina\" is the argument.", example:"greet(\"Mina\")"},
    "return": {definition:"return sends a function's result back to the caller and ends the current function execution. The returned value can be stored or used in another calculation.", example:"def add_one(x):\n    return x + 1\n\nresult = add_one(3)"},
    "scope": {definition:"Scope tells you where in the code a variable or name can be used. A local variable created inside a function is normally used inside that function.", example:"def f():\n    x = 1\n    print(x)"},
    "module": {definition:"A module groups related Python code into an importable unit. import is commonly used to load the module you need.", example:"import json"},
    "import": {definition:"import makes names and features from another module available to the current code.", example:"import json"},
    "file": {definition:"A file stores data outside the running program. When reading file code, check which file is opened, whether it is read or written, and when it is closed.", example:"with open(\"a.txt\") as f:\n    text = f.read()"},
    "open": {definition:"open() opens a file for reading or writing. Check its path and mode, and commonly use it with with so the file is closed after the work finishes.", example:"with open(\"a.txt\", \"r\", encoding=\"utf-8\") as f:\n    text = f.read()"},
    "exception": {definition:"An exception is an error condition Python raises when normal execution cannot continue as written. try/except can handle selected exceptions.", example:"try:\n    int(\"x\")\nexcept ValueError:\n    print(\"bad\")"},
    "class": {definition:"A class describes the data and behavior that similar objects should have. You can use the class to create actual objects.", example:"class Dog:\n    pass\n\ndog = Dog()"},
    "object": {definition:"An object is an actual value Python works with. Strings, lists, and values created from classes are all objects, and each kind can provide its own behavior.", example:"text = \"hi\"\nitems = [1, 2]"},
    "method": {definition:"A method is a function used through a particular object. In text.strip(), strip is a function provided by the string object.", example:"text = \" hi \"\nprint(text.strip())"},
    "mutable": {definition:"Mutable means the contents of the same object can be changed after creation. A list is a common mutable value because append() can add an item to it.", example:"items = []\nitems.append(1)"},
    "iterable": {definition:"An iterable is something whose values can be taken one at a time, as in a for loop. Lists, strings, and tuples are common examples.", example:"for ch in \"abc\":\n    print(ch)"}
  });
}
// === EXPLANATION_QUALITY_FOUNDATION_V344_A1 END ===
'''


def patch_text(text: str) -> tuple[str, int]:
    changes = 0
    if MARKER not in text:
        anchor = "function loadProgress() {"
        if anchor not in text:
            raise RuntimeError("app anchor not found")
        text = text.replace(anchor, KO_BLOCK + "\n" + anchor, 1)
        changes += 1
    return text, changes


def patch_index(text: str) -> tuple[str, int]:
    changes = 0
    if SCRIPT not in text:
        anchor = '<script src="./learning_home_v343.js?v=20260812_v343_a1"></script>'
        if anchor not in text:
            raise RuntimeError("index script anchor not found")
        text = text.replace(anchor, anchor + "\n  " + SCRIPT, 1)
        changes += 1
    app_prefix = '<script src="./app.js?'
    for line in text.splitlines():
        if app_prefix in line and CACHE not in line:
            updated = line.replace('"></script>', '&' + CACHE + '"></script>')
            text = text.replace(line, updated, 1)
            changes += 1
            break
    return text, changes


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    app_text = APP.read_text(encoding="utf-8-sig")
    index_text = INDEX.read_text(encoding="utf-8")
    app_new, app_changes = patch_text(app_text)
    index_new, index_changes = patch_index(index_text)
    changes = app_changes + index_changes

    if args.apply and changes:
        APP.write_text(app_new, encoding="utf-8")
        INDEX.write_text(index_new, encoding="utf-8")

    final_app = app_new if args.apply else app_text
    final_index = index_new if args.apply else index_text
    marker_count = final_app.count(MARKER)
    script_count = final_index.count(SCRIPT)
    cache_ok = CACHE in final_index
    ok = marker_count == 1 and script_count == 1 and cache_ok
    idempotent = changes == 0 if args.check else True

    print("PATCH_VERSION=v344_explanation_quality_a1")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"MARKER_COUNT={marker_count}")
    print(f"SUPPORT_SCRIPT_COUNT={script_count}")
    print(f"CACHE_BUST_PRESENT={cache_ok}")
    if args.check:
        print(f"IDEMPOTENT={idempotent}")
    if not ok or (args.check and not idempotent):
        raise SystemExit("RESULT=FAIL_EXPLANATION_QUALITY_V344_PATCH")
    print("RESULT=PASS_EXPLANATION_QUALITY_V344_PATCH")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

import content_quality_final_pass_v339 as q

VERSION = "v339_quality_final_pass_r2"
R2_MARKER = "CONTENT_QUALITY_BEGINNER_DENSITY_V339_R2"

CURATED_DETAIL_KO = {
    "CS_binary_001": "예를 들어 십진수 2는 이진수로 10이다. 처음에는 변환 공식을 외우기보다 컴퓨터가 0과 1의 조합으로 값을 표현한다는 점만 이해하면 충분하다.",
    "CS_bit_byte_001": "8 bit가 모이면 보통 1 byte가 된다. KB, MB, GB는 byte를 더 큰 단위로 묶어 표시한 것이므로 파일 크기나 메모리 용량을 볼 때 연결해서 생각하면 된다.",
    "CS_integer_001": "파이썬에서 int는 정수를 나타낸다. int('3')은 문자열 '3'을 숫자 3으로 바꾼다. 코드에서 따옴표가 있는지와 int() 변환이 있는지를 먼저 확인하면 문자열 숫자와 실제 숫자를 쉽게 구분할 수 있다.",
    "CS_float_001": "파이썬의 float는 소수 계산에 쓰인다. 0.1 + 0.2 같은 계산이 아주 작은 차이를 보일 수 있는데, 이는 컴퓨터가 모든 소수를 정확히 저장할 수 없기 때문이다. 초급에서는 결과를 비교할 때 이런 작은 차이가 있을 수 있다는 정도만 기억하면 된다.",
    "CS_encoding_utf8_001": "파일을 읽을 때 저장할 때 사용한 인코딩과 같은 인코딩을 써야 글자가 제대로 보인다. 파이썬 코드에서 open(..., encoding='utf-8')이나 read_text(encoding='utf-8')가 보이면 'UTF-8로 글자를 읽는다'고 이해하면 된다.",
    "CS_stack_heap_001": "파이썬을 처음 배울 때 스택과 힙의 내부 구조를 외울 필요는 없다. 먼저 변수 이름이 값을 가리키고, list나 dict 같은 객체는 여러 변수가 같은 대상을 가리킬 수도 있다는 점을 이해하면 이후 copy와 mutable 개념을 배우기 쉬워진다.",
    "CS_compile_interpreter_001": "CPython은 Python 코드를 바로 CPU가 읽는 형태로 실행하는 것이 아니라 먼저 중간 코드(bytecode)로 바꾼다. 그 다음 Python 가상 머신이 그 중간 코드를 실행한다. 처음에는 'Python도 실행 전에 변환 단계가 있다'는 점만 기억하면 충분하다.",
    "CS_type_system_001": "같은 + 기호도 int끼리는 숫자 덧셈, str끼리는 문자열 이어 붙이기로 동작한다. 그래서 코드를 읽을 때는 값의 모양만 보지 말고 따옴표와 int(), str(), type() 같은 변환·확인 코드를 같이 본다.",
    "LANG_python_indent_001": "if, for, while, def, class 뒤의 콜론(:) 다음 줄은 보통 안쪽으로 들여쓴다. 들여쓰기 깊이가 다시 줄어들면 그 코드 블록이 끝났다고 읽으면 된다. 탭과 공백을 섞기보다 같은 방식으로 맞추는 것이 안전하다.",
    "LANG_c_memory_001": "C에서는 메모리 주소를 직접 다루는 포인터를 자주 사용한다. 파이썬을 배우는 단계라면 세부 문법보다 'C는 메모리를 더 직접 제어할 수 있다'는 차이만 알아두면 충분하다.",
    "LANG_java_class_001": "Java에서는 class 안에 값과 메서드를 함께 정의하고, 그 class를 바탕으로 객체를 만든다. 파이썬의 class와 비교하면 큰 개념은 비슷하지만 문법과 타입 규칙은 더 엄격한 편이다.",
    "LANG_javascript_web_001": "웹페이지의 HTML이 구조를 만들고 CSS가 모양을 정한다면 JavaScript는 클릭에 반응하거나 화면 내용을 바꾸는 동작을 맡는다. fetch()로 서버에서 데이터를 가져오는 코드도 자주 볼 수 있다.",
    "LANG_sql_query_001": "SELECT name FROM users는 users 표에서 name 열을 읽는 뜻이다. WHERE age >= 20처럼 WHERE를 붙이면 조건에 맞는 행만 고른다. 처음에는 '어느 표에서 어떤 열을 어떤 조건으로 찾는가'를 순서대로 읽으면 된다.",
}

CURATED_DETAIL_EN = {
    "CS_binary_001": "For example, decimal 2 is binary 10. As a beginner, focus on the idea that computers represent values with patterns of 0 and 1 rather than memorizing conversion formulas first.",
    "CS_bit_byte_001": "Eight bits usually make one byte. KB, MB, and GB group bytes into larger units, so this idea connects directly to file and memory sizes.",
    "CS_integer_001": "Python uses int for whole numbers. int('3') converts the string '3' into the number 3. Check quotation marks and int() conversions when a value looks numeric.",
    "CS_float_001": "Python uses float for decimal calculations. A calculation such as 0.1 + 0.2 can show a tiny difference because not every decimal can be stored exactly. For now, it is enough to know that small precision differences can happen.",
    "CS_encoding_utf8_001": "A file should be read with the same encoding used to save it. When you see open(..., encoding='utf-8') or read_text(encoding='utf-8'), read it as 'interpret the file text as UTF-8.'",
    "CS_compile_interpreter_001": "CPython first changes Python source into an intermediate form called bytecode. The Python virtual machine then executes that bytecode. For a beginner, the key idea is simply that Python also has a conversion step before execution.",
    "CS_type_system_001": "The same + symbol adds numbers for int values but joins text for str values. When reading code, check quotation marks and conversions such as int(), str(), and type() instead of judging only by how a value looks.",
    "LANG_python_indent_001": "After a colon in if, for, while, def, or class, the following block is indented. When the indentation returns to the earlier depth, that block has ended.",
    "LANG_java_class_001": "Java defines data and methods inside classes and creates objects from those classes. The broad idea is similar to Python classes, although Java has stricter syntax and type rules.",
    "LANG_javascript_web_001": "HTML gives a web page structure and CSS gives it appearance; JavaScript handles behavior such as clicks, screen updates, and loading data. fetch() is commonly used to request data from a server.",
    "LANG_sql_query_001": "SELECT name FROM users reads the name column from the users table. Adding WHERE age >= 20 keeps only rows that match the condition. Read SQL as: which table, which columns, and which condition?",
}

EN_CONCEPTS_JS = r'''
if (currentLanguage === "en") {
  Object.assign(conceptInfo, {
    "comment": {definition:"A comment is explanatory text for people reading the code. In Python, text after # is not executed, so it does not directly change the output or calculation.", example:"# explanation\nprint(\"hello\")"},
    "output": {definition:"Output is the result a program shows on the screen or terminal. In Python, print() is the usual way to display a value.", example:"print(\"hello\")"},
    "execution_order": {definition:"Python normally runs code from top to bottom. Track how a value changes before the final print or return.", example:"x = 1\nx = 2\nprint(x)"},
    "assignment": {definition:"Assignment calculates the right side first and stores that value under the name on the left. x = 3 lets later code use x to get 3.", example:"x = 3\nprint(x)"},
    "str": {definition:"A string (str) is a text value. The quoted value \"3\" looks numeric but is text, so it behaves differently from the integer 3.", example:"text = \"3\""},
    "int": {definition:"An integer (int) is a whole number such as 1, 2, or 100. int(\"3\") converts numeric text into the integer 3.", example:"number = int(\"3\")"},
    "float": {definition:"A float represents numbers with a decimal part, such as 3.5. float(\"3.5\") converts numeric text into a float.", example:"value = float(\"3.5\")"},
    "type": {definition:"A type tells you what kind of value something is. 3 is an int while \"3\" is a str, so they can behave differently.", example:"print(type(\"3\"))"},
    "bool": {definition:"A bool is either True or False. Conditions use these truth values to decide which code should run.", example:"active = True"},
    "comparison": {definition:"A comparison checks two values and produces True or False. Common operators include ==, !=, <, >, <=, and >=.", example:"print(3 < 5)"},
    "operator": {definition:"An operator is a symbol that calculates or compares values. + adds numbers but can join strings.", example:"print(2 + 3)"},
    "else": {definition:"else contains the code to run when the earlier if condition is False.", example:"if ready:\n    print(\"go\")\nelse:\n    print(\"wait\")"},
    "while": {definition:"while repeats a block as long as its condition is True. Track the value that changes the condition so you can see when the loop stops.", example:"i = 0\nwhile i < 3:\n    i += 1"},
    "range": {definition:"range() produces numbers for a loop. range(3) produces 0, 1, and 2.", example:"for i in range(3):\n    print(i)"},
    "break": {definition:"break stops the current loop immediately. Code after the loop can still continue.", example:"if found:\n    break"},
    "continue": {definition:"continue skips the rest of the current loop iteration and moves to the next one.", example:"if not item:\n    continue"},
    "tuple": {definition:"A tuple groups values in order. It is similar to a list, but its items cannot be changed after the tuple is created.", example:"point = (10, 20)"},
    "index": {definition:"An index is a position number in ordered data. Python starts counting positions at 0.", example:"items = [\"a\", \"b\"]\nprint(items[0])"},
    "key": {definition:"A dict key is a label used to find a value. In data[\"name\"], \"name\" is the key.", example:"data = {\"name\": \"Mina\"}"},
    "value": {definition:"A value is the actual data stored in a variable or data structure. In a dict, a key is used to retrieve its value.", example:"data = {\"name\": \"Mina\"}"},
    "function": {definition:"A function gives a name to a reusable group of steps. The code inside runs when the function is called.", example:"def greet():\n    print(\"hi\")"},
    "parameter": {definition:"A parameter is the name used inside a function definition to receive an input value.", example:"def greet(name):\n    print(name)"},
    "argument": {definition:"An argument is the actual value passed when a function is called.", example:"greet(\"Mina\")"},
    "scope": {definition:"Scope is the area where a variable name can be used. A variable created inside a function is normally used inside that function.", example:"def f():\n    x = 1"},
    "import": {definition:"import makes code from another module available in the current file.", example:"import json"},
    "module": {definition:"A module is a Python file or library unit that groups related features. import loads a module for use.", example:"import json"},
    "file": {definition:"A file stores data. When reading code, check which file is opened, whether it is read or written, and when it is closed.", example:"with open(\"a.txt\") as f:\n    text = f.read()"},
    "path": {definition:"A path is the address that tells a program where a file or folder is located.", example:"path = \"data/input.txt\""},
    "exception": {definition:"An exception signals that code cannot continue normally. try/except can handle selected exceptions.", example:"try:\n    int(\"x\")\nexcept ValueError:\n    print(\"bad\")"},
    "json": {definition:"JSON is a text format commonly used to store or exchange structured data. { } represents an object and [ ] represents a list.", example:"{\"name\":\"Mina\"}"},
    "csv": {definition:"CSV stores table-like data as text, usually with values separated by commas. One line normally represents one row.", example:"name,score\nMina,90"},
    "input": {definition:"input() returns what the user typed as a string. Convert it with int() or float() when numeric calculation is needed.", example:"age = int(input())"},
    "indentation": {definition:"Indentation is the spaces at the start of a line. Python uses indentation to show which lines belong inside an if, loop, function, or class.", example:"if ready:\n    print(\"go\")"},
    "class": {definition:"A class is a blueprint that groups related data and behavior. Objects can be created from that class.", example:"class Dog:\n    pass"},
    "object": {definition:"An object is an actual value that can contain data and behavior. A value created from a class is an object.", example:"dog = Dog()"},
    "method": {definition:"A method is a function connected to an object. It can read or change that object's data.", example:"items.append(\"a\")"},
    "self": {definition:"self is the conventional name for the current object inside a method.", example:"def show(self):\n    print(self.name)"},
    "None": {definition:"None is Python's special value for 'no value here' or 'no specific result returned.'", example:"result = None"},
    "mutable": {definition:"Mutable means the contents can change after creation. Lists and dicts are common mutable values.", example:"items = []\nitems.append(1)"},
    "print": {definition:"print() displays the value inside its parentheses. If you pass a variable name, Python displays the value stored under that name.", example:"name = \"Mina\"\nprint(name)"},
    "variable": {definition:"A variable is a name attached to a value so the value can be used again later. After x = 3, later code can use x to get 3.", example:"x = 3\nprint(x)"},
    "list": {definition:"A list stores several values in order. The first position is index 0, and append() adds a new value at the end.", example:"items = [\"a\", \"b\"]"},
    "dict": {definition:"A dict stores pairs of keys and values. Use a key as a label to find its value.", example:"data = {\"name\": \"Mina\"}"},
    "for": {definition:"for takes items one at a time and repeats the same block. The current item is placed in the loop variable each time.", example:"for item in [\"a\", \"b\"]:\n    print(item)"},
    "if": {definition:"if runs its indented block only when the condition is True. If the condition is False, that block is skipped.", example:"if score >= 60:\n    print(\"pass\")"},
    "def": {definition:"def creates a function and gives it a name. The function body runs when the function is called.", example:"def greet():\n    print(\"hi\")"},
    "return": {definition:"return ends a function and sends a value back to the caller.", example:"def add(a, b):\n    return a + b"},
    "open": {definition:"open() opens a file for reading or writing. Check the file path and the mode passed to it.", example:"open(\"data.txt\", \"r\")"},
    "with": {definition:"with safely manages resources such as files. A file opened with with is closed automatically when the block ends.", example:"with open(\"a.txt\") as f:\n    text = f.read()"},
    "try_except": {definition:"try/except lets code handle selected errors instead of stopping immediately.", example:"try:\n    int(text)\nexcept ValueError:\n    print(\"bad\")"}
  });
}
'''

def is_beginner(card: dict[str, Any], path: Path) -> bool:
    hint = q.norm(card.get("level_hint")).lower()
    return ("초급" in hint) or ("beginner" in hint) or (not hint and "beginner" in path.name.lower())

def words(text: str) -> set[str]:
    return {x for x in re.findall(r"[0-9A-Za-z가-힣_]+", q.norm(text).casefold()) if len(x) > 1}

def similar(a: str, b: str) -> bool:
    na, nb = q.norm(a).casefold(), q.norm(b).casefold()
    if not na or not nb: return False
    if na == nb or na in nb or nb in na: return True
    wa, wb = words(na), words(nb)
    if wa and wb:
        j = len(wa & wb) / max(1, len(wa | wb))
        if j >= 0.62: return True
    return SequenceMatcher(None, na, nb).ratio() >= 0.80

def unique_semantic(parts: list[str]) -> list[str]:
    out: list[str] = []
    for part in parts:
        for sentence in q.sentences(part):
            if any(similar(sentence, existing) for existing in out):
                continue
            out.append(sentence)
    return out

def cap_sentences(items: list[str], *, max_sentences: int, max_chars: int) -> str:
    out: list[str] = []
    for sentence in items:
        candidate = " ".join(out + [sentence]).strip()
        if out and (len(out) >= max_sentences or len(candidate) > max_chars):
            break
        out.append(sentence)
    text = " ".join(out).strip()
    if len(text) > max_chars:
        text = text[:max_chars - 1].rstrip() + "…"
    return text

def process_sidecards(apply: bool) -> tuple[int, int]:
    changed_files = card_count = 0
    for path in q.files(q.SIDE_DIRS):
        data, changed = q.read_json(path), False
        for card in data:
            card_count += 1
            if not is_beginner(card, path):
                continue
            original_body = q.dedupe(card.get("body"))
            original_detail = q.dedupe(card.get("detail"))
            curated_body = (q.CURATED_EN if q.english(path) else q.CURATED_KO).get(str(card.get("id") or ""))
            if curated_body:
                body = curated_body
            else:
                limit = 220 if q.english(path) else 180
                body = cap_sentences(unique_semantic([original_body]), max_sentences=2, max_chars=limit)
            curated_detail = (CURATED_DETAIL_EN if q.english(path) else CURATED_DETAIL_KO).get(str(card.get("id") or ""))
            if curated_detail:
                detail = curated_detail
            else:
                candidates = unique_semantic([q.subtract(original_body, body), original_detail])
                candidates = [s for s in candidates if not similar(s, body)]
                detail = cap_sentences(candidates, max_sentences=4, max_chars=650 if q.english(path) else 480)
            if body != str(card.get("body") or ""):
                card["body"] = body; changed = True
            old_detail = str(card.get("detail") or "")
            if detail:
                if detail != old_detail: card["detail"] = detail; changed = True
            elif "detail" in card:
                del card["detail"]; changed = True
        if changed:
            changed_files += 1
            if apply: q.write_json(path, data)
    return changed_files, card_count

def patch_app(apply: bool) -> int:
    text = q.APP_PATH.read_text(encoding="utf-8-sig")
    if R2_MARKER in text: return 0
    anchor = "// === " + q.QUALITY_MARKER + " END ==="
    if anchor not in text: raise RuntimeError("R1 quality marker missing")
    insert = anchor + "\n\n// === " + R2_MARKER + " BEGIN ===\n" + EN_CONCEPTS_JS.strip() + "\n// === " + R2_MARKER + " END ==="
    new = text.replace(anchor, insert, 1)
    if apply: q.APP_PATH.write_text(new, encoding="utf-8")
    return int(new != text)

def audit() -> list[str]:
    errors: list[str] = []
    for path in q.files(q.SIDE_DIRS):
        lang = "en" if q.english(path) else "ko"
        for card in q.read_json(path):
            if not is_beginner(card, path): continue
            cid = str(card.get("id") or "")
            body, detail = q.norm(card.get("body")), q.norm(card.get("detail"))
            body_limit = 240 if lang == "en" else 200
            detail_limit = 700 if lang == "en" else 520
            if len(body) > body_limit: errors.append(f"beginner body too long:{lang}:{cid}:{len(body)}")
            if len(detail) > detail_limit: errors.append(f"beginner detail too long:{lang}:{cid}:{len(detail)}")
            if body and detail and similar(body, detail): errors.append(f"beginner body/detail semantically duplicate:{lang}:{cid}")
            ds = q.sentences(detail)
            for i in range(len(ds)):
                for j in range(i + 1, len(ds)):
                    if similar(ds[i], ds[j]): errors.append(f"similar detail sentence:{lang}:{cid}:{i}:{j}"); break
    app = q.APP_PATH.read_text(encoding="utf-8-sig")
    if R2_MARKER not in app: errors.append("R2 app marker missing")
    if 'if (currentLanguage === "en")' not in app[app.find(R2_MARKER):]: errors.append("English beginner concept override missing")
    print(f"QUALITY_VERSION={VERSION}")
    print(f"ERRORS={len(errors)}")
    for error in errors[:200]: print("ERROR=" + error)
    return errors

def main() -> int:
    parser = argparse.ArgumentParser(); group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--apply", action="store_true"); group.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply:
        sf, sc = process_sidecards(True); af = patch_app(True)
        print(f"R2_SIDE_FILES_CHANGED={sf} R2_SIDE_CARDS_SCANNED={sc}")
        print(f"R2_APP_FILES_CHANGED={af}")
    errors = audit()
    print("RESULT=" + ("FAIL_CONTENT_QUALITY_FINAL_PASS_V339_R2" if errors else "PASS_CONTENT_QUALITY_FINAL_PASS_V339_R2"))
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())

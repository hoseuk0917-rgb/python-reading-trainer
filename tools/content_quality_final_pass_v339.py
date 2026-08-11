#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIRS = [ROOT / "data" / "lessons", ROOT / "data_i18n" / "en" / "lessons"]
SIDE_DIRS = [ROOT / "data" / "side_cards", ROOT / "data_i18n" / "en" / "side_cards"]
APP_PATH = ROOT / "src" / "pwa" / "app.js"
INDEX_PATH = ROOT / "src" / "pwa" / "index.html"
VERSION = "v339_quality_final_pass"
DATA_VERSION = "20260812_v339_quality1"
QUALITY_MARKER = "CONTENT_QUALITY_FINAL_PASS_V339"
SPLIT_RE = re.compile(r"(?<=[.!?。])\s+")
SPACE_RE = re.compile(r"\s+")

CURATED_KO = {
    "CS_binary_001": "이진법은 0과 1 두 숫자만 사용해 값을 나타내는 방법이다. 컴퓨터는 내부에서 많은 정보를 이런 0과 1의 조합으로 저장한다.",
    "CS_bit_byte_001": "bit는 0 또는 1 하나를 뜻하고, byte는 보통 bit 8개를 묶은 단위다. 파일 크기나 메모리 크기를 볼 때 자주 만난다.",
    "CS_integer_001": "정수(int)는 1, 2, 100처럼 소수점이 없는 숫자다. 따옴표가 붙은 '10'은 숫자가 아니라 문자열이므로 구분해야 한다.",
    "CS_float_001": "float는 3.5처럼 소수점이 있는 숫자를 다루는 자료형이다. 일부 소수는 컴퓨터에 정확히 저장되지 않아 아주 작은 계산 차이가 생길 수 있다.",
    "CS_encoding_utf8_001": "인코딩은 글자를 파일에 저장할 숫자 규칙으로 바꾸고 다시 글자로 읽는 약속이다. UTF-8은 한글을 포함한 여러 문자를 다룰 때 많이 쓴다.",
    "CS_stack_heap_001": "스택과 힙은 프로그램이 메모리를 사용하는 방식을 설명할 때 쓰는 말이다. 파이썬 초급에서는 이름만 알아두고 변수와 객체가 어떻게 연결되는지 먼저 이해하면 충분하다.",
    "CS_compile_interpreter_001": "컴파일은 코드를 실행하기 쉬운 형태로 미리 바꾸는 과정이고, 인터프리트는 실행하면서 코드를 읽어 처리하는 방식이다. Python도 내부에서 여러 단계를 섞어 사용한다.",
    "CS_type_system_001": "자료형(type)은 값의 종류를 뜻한다. 예를 들어 3은 정수(int), '3'은 문자열(str)이라서 겉모양이 비슷해도 할 수 있는 계산이 다르다.",
    "LANG_python_indent_001": "Python에서는 줄 앞의 공백인 들여쓰기로 어떤 코드가 if·for·함수 안에 속하는지 표시한다. 같은 깊이로 들여쓴 줄은 같은 코드 묶음으로 읽으면 된다.",
    "LANG_c_memory_001": "C는 메모리를 파이썬보다 직접 다루는 언어다. 지금은 포인터 같은 세부 내용보다 '메모리를 더 직접 제어하는 언어'라는 정도만 알아두면 된다.",
    "LANG_java_class_001": "Java는 class를 중심으로 코드를 구성하는 경우가 많다. class는 값을 담고 동작을 정의하는 설계도라고 먼저 이해하면 된다.",
    "LANG_javascript_web_001": "JavaScript는 웹페이지에서 버튼 클릭, 화면 변경, 데이터 불러오기 같은 동작을 만드는 언어다. 브라우저에서 움직이는 기능을 담당한다고 생각하면 쉽다.",
    "LANG_sql_query_001": "SQL은 데이터베이스에 저장된 표에서 원하는 데이터를 찾거나 바꾸기 위한 언어다. SELECT는 데이터를 가져오고 WHERE는 조건을 거는 기본 명령이다.",
    "LANG_cypher_neo4j_001": "Cypher는 그래프 데이터베이스에서 서로 연결된 대상을 찾는 언어다. 처음에는 '노드와 관계를 따라가며 찾는다'는 점만 이해하면 충분하다.",
    "LANG_rust_safety_001": "Rust는 빠른 실행과 메모리 안전성을 함께 중요하게 보는 언어다. 파이썬 초급에서는 '실행 전에 많은 메모리 실수를 잡으려는 언어' 정도로 이해하면 된다.",
    "LANG_go_cloud_001": "Go는 서버와 클라우드 프로그램에서 많이 쓰이는 언어다. 문법이 비교적 단순하고 여러 작업을 동시에 처리하는 기능을 자주 사용한다.",
}
CURATED_EN = {
    "CS_binary_001": "Binary uses only 0 and 1 to represent values. Computers store many kinds of information as patterns of these two digits.",
    "CS_bit_byte_001": "A bit is one 0-or-1 value, and a byte usually groups eight bits. You often see bytes when reading file or memory sizes.",
    "CS_integer_001": "An integer (int) is a whole number such as 1, 2, or 100. The text '10' is a string, not the number 10, so the two behave differently.",
    "CS_float_001": "A float is a number with a decimal part, such as 3.5. Some decimal values cannot be stored exactly, so tiny calculation differences can appear.",
    "CS_encoding_utf8_001": "Encoding is the rule used to turn text into stored bytes and back into text. UTF-8 is a common encoding for Korean, English, and many other characters.",
    "CS_stack_heap_001": "Stack and heap are terms used to explain how a program uses memory. As a beginner, it is enough to know the names and first focus on how variables refer to values.",
    "CS_compile_interpreter_001": "Compilation changes code into a form that is easier to execute, while interpretation processes code as it runs. Python implementations can use more than one of these steps.",
    "CS_type_system_001": "A type tells you what kind of value something is. For example, 3 is an int while '3' is a string, so they can behave differently even if they look similar.",
    "LANG_python_indent_001": "Python uses indentation, the spaces at the start of a line, to show which lines belong inside an if, loop, or function. Lines at the same depth belong to the same block.",
    "LANG_java_class_001": "Java often organizes code around classes. A class is a blueprint that groups data and behavior.",
    "LANG_javascript_web_001": "JavaScript makes web pages react to clicks, update the screen, and load data. Think of it as a language that drives browser behavior.",
    "LANG_sql_query_001": "SQL is used to find or change data stored in database tables. SELECT reads data and WHERE adds a condition.",
}

BEGINNER_CONCEPTS_JS = r'''
Object.assign(conceptInfo, {
  "comment": {definition: "주석은 코드에 설명을 남기는 글이다. Python에서 # 뒤의 내용은 실행되지 않으므로 출력이나 계산 결과를 직접 바꾸지 않는다.", example: "# 설명\nprint(\"hello\")"},
  "output": {definition: "출력은 프로그램이 계산한 결과를 화면이나 터미널에 보여 주는 것이다. Python에서는 보통 print()로 확인한다.", example: "print(\"hello\")"},
  "execution_order": {definition: "Python 코드는 보통 위에서 아래로 한 줄씩 실행된다. 값을 바꾸는 줄이 있다면 마지막 출력 전에 어떤 값이 되었는지 순서대로 따라간다.", example: "x = 1\nx = 2\nprint(x)"},
  "assignment": {definition: "대입은 오른쪽에서 만든 값을 왼쪽 이름에 저장하는 동작이다. x = 3은 x라는 이름으로 3을 다시 사용할 수 있게 한다.", example: "x = 3\nprint(x)"},
  "str": {definition: "문자열(str)은 글자를 다루는 값이다. 따옴표로 감싼 \"3\"은 숫자처럼 보여도 문자열이라서 정수 3과 다르게 동작한다.", example: "text = \"3\"\nprint(text)"},
  "int": {definition: "정수(int)는 1, 2, 100처럼 소수점이 없는 숫자다. int(\"3\")처럼 숫자 모양의 문자열을 정수로 바꿀 수도 있다.", example: "number = int(\"3\")\nprint(number + 2)"},
  "float": {definition: "실수(float)는 3.5처럼 소수점이 있는 숫자를 다룬다. float(\"3.5\")처럼 문자열을 실수로 바꿀 수 있다.", example: "value = float(\"3.5\")"},
  "type": {definition: "자료형(type)은 값의 종류다. 3은 int, \"3\"은 str처럼 겉보기와 실제 종류가 다를 수 있다.", example: "print(type(\"3\"))"},
  "bool": {definition: "bool은 True 또는 False 두 값으로 참과 거짓을 나타낸다. 조건문은 이 판단을 이용해 실행할 코드를 고른다.", example: "active = True"},
  "comparison": {definition: "비교식은 두 값을 비교해 True 또는 False를 만든다. ==, !=, <, >, <=, >= 같은 기호를 사용한다.", example: "print(3 < 5)"},
  "operator": {definition: "연산자는 값으로 계산이나 비교를 하는 기호다. +는 숫자에서는 덧셈, 문자열에서는 이어 붙이기로 동작할 수 있다.", example: "print(2 + 3)"},
  "else": {definition: "else는 앞의 if 조건이 거짓일 때 실행할 코드를 적는 부분이다.", example: "if ready:\n    print(\"go\")\nelse:\n    print(\"wait\")"},
  "while": {definition: "while은 조건이 참인 동안 같은 코드 묶음을 반복한다. 반복 안에서 조건에 쓰는 값이 어떻게 바뀌는지 확인해야 한다.", example: "i = 0\nwhile i < 3:\n    i += 1"},
  "range": {definition: "range()는 반복할 숫자의 흐름을 만든다. range(3)은 0, 1, 2를 차례로 만든다.", example: "for i in range(3):\n    print(i)"},
  "break": {definition: "break는 현재 반복문을 바로 끝낸다. 반복 뒤의 코드는 계속 실행된다.", example: "for x in items:\n    if x == target:\n        break"},
  "continue": {definition: "continue는 현재 반복의 남은 줄을 건너뛰고 다음 반복으로 넘어간다.", example: "for x in items:\n    if not x:\n        continue"},
  "tuple": {definition: "tuple은 여러 값을 순서대로 묶는 자료형이다. list와 비슷하지만 만든 뒤 항목을 바꿀 수 없다.", example: "point = (10, 20)"},
  "index": {definition: "인덱스는 순서가 있는 자료에서 항목의 위치를 나타내는 번호다. Python의 첫 번째 위치는 0이다.", example: "items = [\"a\", \"b\"]\nprint(items[0])"},
  "key": {definition: "dict의 key는 값을 찾기 위한 이름표다. data[\"name\"]에서 \"name\"이 key다.", example: "data = {\"name\": \"Mina\"}"},
  "value": {definition: "value는 변수나 자료구조에 실제로 들어 있는 값이다. dict에서는 key를 이용해 연결된 value를 꺼낸다.", example: "data = {\"name\": \"Mina\"}"},
  "function": {definition: "함수는 여러 줄의 작업을 이름 하나로 묶어 다시 사용할 수 있게 한 코드다. 함수를 호출할 때 안의 코드가 실행된다.", example: "def greet():\n    print(\"hi\")\ngreet()"},
  "parameter": {definition: "매개변수(parameter)는 함수를 만들 때 입력값을 받을 자리에 붙이는 이름이다.", example: "def greet(name):\n    print(name)"},
  "argument": {definition: "인자(argument)는 함수를 호출할 때 실제로 넘기는 값이다.", example: "greet(\"Mina\")"},
  "scope": {definition: "스코프는 변수 이름을 사용할 수 있는 범위다. 함수 안에서 만든 변수는 보통 그 함수 안에서 사용한다.", example: "def f():\n    x = 1"},
  "import": {definition: "import는 다른 모듈에 있는 기능을 현재 코드에서 사용할 수 있게 불러오는 문장이다.", example: "import json"},
  "module": {definition: "모듈은 관련 기능을 모아 둔 Python 파일이나 라이브러리 단위다. import로 불러와 사용한다.", example: "import json"},
  "file": {definition: "파일은 데이터를 저장해 두는 단위다. 코드를 읽을 때는 어떤 파일을 읽는지, 쓰는지, 닫는지를 확인한다.", example: "with open(\"a.txt\") as f:\n    text = f.read()"},
  "path": {definition: "경로(path)는 파일이나 폴더가 어디에 있는지 나타내는 주소다.", example: "path = \"data/input.txt\""},
  "exception": {definition: "예외는 코드를 실행하다 정상적으로 계속할 수 없는 상황을 나타내는 오류 신호다. try/except로 일부 예외를 처리할 수 있다.", example: "try:\n    int(\"x\")\nexcept ValueError:\n    print(\"bad\")"},
  "json": {definition: "JSON은 데이터를 글자 형태로 저장하거나 주고받을 때 많이 쓰는 형식이다. { }는 객체, [ ]는 목록을 나타낸다.", example: "{\"name\":\"Mina\"}"},
  "csv": {definition: "CSV는 값을 쉼표로 나누어 표처럼 저장하는 텍스트 파일 형식이다. 한 줄이 보통 한 행을 뜻한다.", example: "name,score\nMina,90"},
  "input": {definition: "input()은 사용자가 입력한 내용을 문자열로 돌려준다. 숫자 계산을 하려면 필요에 따라 int()나 float()로 바꾼다.", example: "age = int(input())"},
  "indentation": {definition: "들여쓰기는 줄 앞의 공백이다. Python에서는 if, for, 함수 안에 어떤 줄이 속하는지 들여쓰기로 표시한다.", example: "if ready:\n    print(\"go\")"},
  "class": {definition: "class는 관련된 값과 기능을 한 종류로 묶는 설계도다. 그 설계도로 실제 객체를 만들 수 있다.", example: "class Dog:\n    pass"},
  "object": {definition: "객체(object)는 값과 기능을 함께 가진 실제 데이터다. class로 만든 값도 객체다.", example: "dog = Dog()"},
  "method": {definition: "메서드는 객체에 연결되어 그 객체의 값을 사용하거나 바꾸는 함수다.", example: "items.append(\"a\")"},
  "self": {definition: "self는 메서드 안에서 지금 사용 중인 객체 자신을 가리키는 관례적인 이름이다.", example: "def show(self):\n    print(self.name)"},
  "None": {definition: "None은 '값이 아직 없거나 특별히 돌려줄 값이 없음'을 나타내는 Python의 특별한 값이다.", example: "result = None"},
  "mutable": {definition: "mutable은 만든 뒤에도 내용이 바뀔 수 있다는 뜻이다. list와 dict는 대표적인 mutable 자료형이다.", example: "items = []\nitems.append(1)"},
  "print": {definition: "print()는 괄호 안의 값을 화면이나 터미널에 보여 주는 함수다. 변수 이름을 넣으면 그 변수에 들어 있는 값이 출력된다.", example: "name = \"Mina\"\nprint(name)"},
  "variable": {definition: "변수는 값을 나중에 다시 쓰기 위해 붙여 둔 이름이다. x = 3이라고 쓰면 이후에 x를 사용해 3을 다시 꺼내 쓸 수 있다.", example: "x = 3\nprint(x)"},
  "list": {definition: "list는 여러 값을 순서대로 담는 자료다. 첫 번째 항목의 위치 번호는 0이고 append()로 값을 뒤에 추가할 수 있다.", example: "items = [\"a\", \"b\"]\nprint(items[0])"},
  "dict": {definition: "dict는 key라는 이름표와 value라는 값을 짝지어 저장하는 자료다. key를 사용해 원하는 값을 찾는다.", example: "data = {\"name\": \"Mina\"}\nprint(data[\"name\"])"},
  "for": {definition: "for는 여러 항목을 하나씩 꺼내 같은 코드 묶음을 반복한다. 반복할 때마다 현재 항목이 변수에 들어간다.", example: "for item in [\"a\", \"b\"]:\n    print(item)"},
  "if": {definition: "if는 조건이 True일 때만 들여쓴 코드 묶음을 실행한다. 조건이 False면 그 부분을 건너뛴다.", example: "if score >= 60:\n    print(\"pass\")"},
  "def": {definition: "def는 함수에 이름을 붙여 만드는 문장이다. 함수 안의 코드는 함수를 실제로 호출할 때 실행된다.", example: "def greet():\n    print(\"hi\")"},
  "return": {definition: "return은 함수 실행을 끝내고 호출한 곳으로 값을 돌려준다.", example: "def add(a, b):\n    return a + b"},
  "open": {definition: "open()은 파일을 읽거나 쓰기 위해 여는 함수다. 어떤 파일을 어떤 방식으로 여는지 인자를 확인한다.", example: "open(\"data.txt\", \"r\")"},
  "with": {definition: "with는 파일처럼 사용 후 정리가 필요한 대상을 안전하게 쓰는 문법이다. with open(...) 블록이 끝나면 파일이 자동으로 닫힌다.", example: "with open(\"a.txt\") as f:\n    text = f.read()"},
  "try_except": {definition: "try/except는 실행 중 특정 오류가 나면 프로그램을 바로 끝내지 않고 정해 둔 다른 코드를 실행하게 한다.", example: "try:\n    int(text)\nexcept ValueError:\n    print(\"bad\")"}
});
'''

GET_PRIMARY = '''function getPrimaryConceptV306(card, sourceCard) {
  const concepts = getCardConceptsV306(card);
  for (let i = 0; i < concepts.length; i += 1) {
    if (conceptInfo[concepts[i]]) return concepts[i];
  }
  return concepts[0] || "";
}'''

BUILD_INTRO = '''function buildConceptIntroV306(card) {
  const sourceCard = pickConceptIntroSideCardV306(card);
  const primaryConcept = getPrimaryConceptV306(card, sourceCard);
  const concept = primaryConcept && conceptInfo[primaryConcept] ? conceptInfo[primaryConcept] : null;
  const conceptText = concept ? trimConceptIntroTextV306(concept.definition, 220) : "";
  if (conceptText) {
    return {sourceSideCardId:"", concept:primaryConcept || "", title:primaryConcept ? primaryConcept + " 기본 개념" : "개념 안내", body:conceptText, sourceTitle:""};
  }
  const concepts = getCardConceptsV306(card);
  const related = Array.isArray(sourceCard && sourceCard.related_concepts) ? sourceCard.related_concepts.filter(Boolean) : [];
  const meaningful = related.some(function(value) {
    const key = String(value || "").toLowerCase();
    return concepts.indexOf(value) >= 0 && !["python","code","programming","basic"].includes(key);
  });
  if (sourceCard && meaningful) {
    const sideText = buildSafeSideCardIntroTextV306(sourceCard);
    if (sideText) return {sourceSideCardId:sourceCard.id || "", concept:primaryConcept || "", title:sourceCard.title || "개념 안내", body:sideText, sourceTitle:sourceCard.title || ""};
  }
  const goal = trimConceptIntroTextV306(card && card.reading_goal ? card.reading_goal : "", 200);
  if (!goal) return null;
  return {sourceSideCardId:"", concept:primaryConcept || "", title:primaryConcept ? primaryConcept + " 읽기 포인트" : "이 문제의 읽기 포인트", body:goal, sourceTitle:""};
}'''

BONUS = '''function getBonusSideCards(card, alreadyIds) {
  const seen = loadSideSeen();
  const concepts = card.concepts || [];
  const generic = new Set(["python","code","coding","programming","basic","language","syntax"]);
  const pool = sideCards.filter(function(sc) {
    if (!sc || !sc.id || alreadyIds.includes(sc.id)) return false;
    const related = Array.isArray(sc.related_concepts) ? sc.related_concepts : [];
    const overlap = related.some(function(concept) {
      return concepts.includes(concept) && !generic.has(String(concept || "").toLowerCase());
    });
    return overlap && (seen[sc.id] || 0) < 3;
  });
  pool.sort(function(a,b) {
    const ac = seen[a.id] || 0, bc = seen[b.id] || 0;
    if (ac !== bc) return ac - bc;
    return a.id.localeCompare(b.id);
  });
  return pool.slice(0, 2);
}'''

def norm(value: Any) -> str:
    return SPACE_RE.sub(" ", str(value or "")).strip()

def sentences(value: Any) -> list[str]:
    text = norm(value)
    if not text:
        return []
    parts = [x.strip() for x in SPLIT_RE.split(text) if x.strip()]
    return parts or [text]

def dedupe(value: Any) -> str:
    out, seen = [], set()
    for s in sentences(value):
        key = norm(s).casefold()
        if key and key not in seen:
            seen.add(key)
            out.append(s)
    return " ".join(out)

def english(path: Path) -> bool:
    return "data_i18n" in path.parts and "en" in path.parts

def beginner(card: dict[str, Any], path: Path) -> bool:
    hint = norm(card.get("level_hint")).lower()
    return hint in {"초급", "beginner", "basic"} or (not hint and "beginner" in path.name.lower())

def read_json(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8-sig"))
    if not isinstance(data, list):
        raise ValueError(f"{path}: top-level JSON must be a list")
    return data

def write_json(path: Path, data: list[dict[str, Any]]) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def summary_for(card: dict[str, Any], path: Path, body: str) -> str:
    curated = CURATED_EN if english(path) else CURATED_KO
    card_id = str(card.get("id") or "")
    if card_id in curated:
        return curated[card_id]
    limit = 220 if english(path) else 180
    picked = []
    for s in sentences(body):
        candidate = " ".join(picked + [s])
        if picked and len(candidate) > limit:
            break
        picked.append(s)
        if len(picked) >= 2:
            break
    text = " ".join(picked).strip()
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"

def subtract(full: str, short: str) -> str:
    skip = {norm(x).casefold() for x in sentences(short)}
    return " ".join(x for x in sentences(full) if norm(x).casefold() not in skip)

def combine(parts: Iterable[str]) -> str:
    out, seen = [], set()
    for part in parts:
        for s in sentences(part):
            key = norm(s).casefold()
            if key and key not in seen:
                seen.add(key)
                out.append(s)
    return " ".join(out)

def infer_concepts(code: str) -> list[str]:
    lines = str(code or "").splitlines()
    rules = [
        ("comment", any(line.lstrip().startswith("#") for line in lines)),
        ("if", bool(re.search(r"(?m)^\s*if\s+.+:", code))),
        ("else", bool(re.search(r"(?m)^\s*else\s*:", code))),
        ("for", bool(re.search(r"(?m)^\s*for\s+.+\s+in\s+.+:", code))),
        ("while", bool(re.search(r"(?m)^\s*while\s+.+:", code))),
        ("def", bool(re.search(r"(?m)^\s*def\s+\w+\s*\(", code))),
        ("function", bool(re.search(r"(?m)^\s*def\s+\w+\s*\(", code))),
        ("return", bool(re.search(r"(?m)^\s*return\b", code))),
        ("class", bool(re.search(r"(?m)^\s*class\s+\w+", code))),
        ("try_except", "try:" in code or bool(re.search(r"(?m)^\s*except\b", code))),
        ("import", bool(re.search(r"(?m)^\s*(?:from\s+\S+\s+)?import\b", code))),
        ("print", "print(" in code), ("range", "range(" in code),
        ("break", bool(re.search(r"(?m)^\s*break\s*$", code))),
        ("continue", bool(re.search(r"(?m)^\s*continue\s*$", code))),
    ]
    return [name for name, matched in rules if matched]

def files(dirs: list[Path]) -> list[Path]:
    out = []
    for d in dirs:
        if d.exists(): out.extend(sorted(d.glob("*.json")))
    return out

def sentence_counts(paths: list[Path], field: str) -> Counter[str]:
    c = Counter()
    for path in paths:
        for card in read_json(path):
            for s in sentences(card.get(field)):
                key = norm(s)
                if len(key) >= 30: c[key] += 1
    return c

def clean_lesson_text(value: Any, counts: Counter[str]) -> str:
    parts = sentences(value)
    if not parts: return ""
    out, seen = [], set()
    for i, s in enumerate(parts):
        key = norm(s)
        folded = key.casefold()
        if folded in seen: continue
        seen.add(folded)
        if i > 0 and len(key) >= 30 and counts[key] >= 4: continue
        out.append(s)
    return " ".join(out or [parts[0]])

def process_lessons(paths: list[Path], apply: bool) -> tuple[int, int]:
    ex_counts, goal_counts = sentence_counts(paths, "explanation"), sentence_counts(paths, "reading_goal")
    changed_files = card_count = 0
    for path in paths:
        data, changed = read_json(path), False
        for card in data:
            card_count += 1
            old = list(card.get("concepts") or [])
            new = old[:]
            for concept in reversed(infer_concepts(str(card.get("code") or ""))):
                if concept not in new: new.insert(0, concept)
            if new != old:
                card["concepts"] = new; changed = True
            for field, counts in (("explanation", ex_counts), ("reading_goal", goal_counts)):
                if card.get(field):
                    cleaned = clean_lesson_text(card[field], counts)
                    if cleaned != card[field]: card[field] = cleaned; changed = True
        if changed:
            changed_files += 1
            if apply: write_json(path, data)
    return changed_files, card_count

def process_sidecards(paths: list[Path], apply: bool) -> tuple[int, int]:
    changed_files = card_count = 0
    for path in paths:
        data, changed = read_json(path), False
        for card in data:
            card_count += 1
            body, detail = dedupe(card.get("body")), dedupe(card.get("detail"))
            original = body
            if beginner(card, path) and body:
                short = summary_for(card, path, body)
                if short and short != body:
                    body = short
                    detail = combine([subtract(original, short), detail])
            if body and detail:
                body_keys = {norm(x).casefold() for x in sentences(body)}
                detail = " ".join(s for s in sentences(detail) if norm(s).casefold() not in body_keys)
            if body != str(card.get("body") or ""):
                card["body"] = body; changed = True
            old_detail = str(card.get("detail") or "")
            if detail:
                if detail != old_detail: card["detail"] = detail; changed = True
            elif "detail" in card:
                del card["detail"]; changed = True
        if changed:
            changed_files += 1
            if apply: write_json(path, data)
    return changed_files, card_count

def replace_function(source: str, name: str, replacement: str, next_name: str) -> str:
    pattern = re.compile(rf"function {re.escape(name)}\([^)]*\)\s*\{{.*?\n\}}\n\nfunction {re.escape(next_name)}\(", re.S)
    match = pattern.search(source)
    if not match: raise RuntimeError(f"function patch anchor missing: {name}->{next_name}")
    return source[:match.start()] + replacement + "\n\nfunction " + next_name + "(" + source[match.end():]

def patch_app(text: str) -> str:
    text = re.sub(r'const APP_DATA_VERSION = "[^"]+";', f'const APP_DATA_VERSION = "{DATA_VERSION}";', text, count=1)
    if QUALITY_MARKER in text: return text
    anchor = "\n};\n\nfunction loadProgress() {"
    if anchor not in text: raise RuntimeError("conceptInfo insertion anchor missing")
    insert = "\n};\n\n// === " + QUALITY_MARKER + " BEGIN ===\n" + BEGINNER_CONCEPTS_JS.strip() + "\n// === " + QUALITY_MARKER + " END ===\n\nfunction loadProgress() {"
    text = text.replace(anchor, insert, 1)
    text = replace_function(text, "getPrimaryConceptV306", GET_PRIMARY, "pickConceptIntroSideCardV306")
    text = replace_function(text, "buildConceptIntroV306", BUILD_INTRO, "renderConceptIntroV306")
    text = replace_function(text, "getBonusSideCards", BONUS, "normalizeResourceText")
    return text

def process_app(apply: bool) -> int:
    app = APP_PATH.read_text(encoding="utf-8-sig")
    index = INDEX_PATH.read_text(encoding="utf-8-sig")
    new_app = patch_app(app)
    new_index = re.sub(r'<script src="\./app\.js\?v=[^"]+"></script>', f'<script src="./app.js?v={DATA_VERSION}"></script>', index, count=1)
    changed = int(new_app != app) + int(new_index != index)
    if apply:
        if new_app != app: APP_PATH.write_text(new_app, encoding="utf-8")
        if new_index != index: INDEX_PATH.write_text(new_index, encoding="utf-8")
    return changed

def audit() -> list[str]:
    errors = []
    lesson_files, side_files = files(LESSON_DIRS), files(SIDE_DIRS)
    lesson_ids: dict[str, set[str]] = {}; side_ids: dict[str, set[str]] = {}
    for path in lesson_files:
        lang = "en" if english(path) else "ko"; seen = lesson_ids.setdefault(lang, set())
        for card in read_json(path):
            cid = str(card.get("id") or "")
            if not cid: errors.append(f"missing lesson id:{path}")
            elif cid in seen: errors.append(f"duplicate lesson id:{lang}:{cid}")
            seen.add(cid)
            choices, answer = card.get("choices"), card.get("answer")
            if isinstance(choices, list) and choices and not isinstance(answer, list):
                if answer not in choices: errors.append(f"answer not in choices:{cid}")
            code = str(card.get("code") or "")
            if any(line.lstrip().startswith("#") for line in code.splitlines()) and "comment" not in (card.get("concepts") or []):
                errors.append(f"comment concept missing:{cid}")
    for path in side_files:
        lang = "en" if english(path) else "ko"; seen = side_ids.setdefault(lang, set())
        for card in read_json(path):
            cid = str(card.get("id") or "")
            if not cid: errors.append(f"missing side id:{path}")
            elif cid in seen: errors.append(f"duplicate side id:{lang}:{cid}")
            seen.add(cid)
            body, detail = norm(card.get("body")), norm(card.get("detail"))
            if body and detail and body.casefold() == detail.casefold(): errors.append(f"side body/detail duplicate:{lang}:{cid}")
            if beginner(card, path):
                limit = 240 if lang == "en" else 200
                if len(body) > limit: errors.append(f"beginner side body too long:{lang}:{cid}:{len(body)}")
            body_parts = [norm(x).casefold() for x in sentences(body)]
            if len(body_parts) != len(set(body_parts)): errors.append(f"duplicate side sentence:{lang}:{cid}")
    app = APP_PATH.read_text(encoding="utf-8-sig"); index = INDEX_PATH.read_text(encoding="utf-8-sig")
    if QUALITY_MARKER not in app: errors.append("app quality marker missing")
    if f'const APP_DATA_VERSION = "{DATA_VERSION}";' not in app: errors.append("app data version not bumped")
    if f'./app.js?v={DATA_VERSION}' not in index: errors.append("index cache bust not bumped")
    if '"comment": {definition:' not in app: errors.append("comment beginner concept missing")
    begin = app.find("function getBonusSideCards"); end = app.find("function normalizeResourceText")
    if begin < 0 or end < 0 or "const isGeneral =" in app[begin:end]: errors.append("unrelated general bonus policy active")
    ko_l, ko_s = len(lesson_ids.get("ko", set())), len(side_ids.get("ko", set()))
    en_l, en_s = len(lesson_ids.get("en", set())), len(side_ids.get("en", set()))
    if ko_l != 1785: errors.append(f"KO lesson count changed:{ko_l}")
    if ko_s != 440: errors.append(f"KO side count changed:{ko_s}")
    if en_l and en_l != ko_l: errors.append(f"EN lesson parity:{en_l}!={ko_l}")
    if en_s and en_s != ko_s: errors.append(f"EN side parity:{en_s}!={ko_s}")
    print(f"QUALITY_VERSION={VERSION}")
    print(f"LESSON_FILES={len(lesson_files)} SIDE_FILES={len(side_files)}")
    print(f"KO_LESSON_CARDS={ko_l} KO_SIDE_CARDS={ko_s}")
    print(f"EN_LESSON_CARDS={en_l} EN_SIDE_CARDS={en_s}")
    print(f"ERRORS={len(errors)}")
    for error in errors[:200]: print("ERROR=" + error)
    return errors

def main() -> int:
    parser = argparse.ArgumentParser(); group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--apply", action="store_true"); group.add_argument("--check", action="store_true")
    args = parser.parse_args()
    lesson_files, side_files = files(LESSON_DIRS), files(SIDE_DIRS)
    if not lesson_files or not side_files: raise RuntimeError("lesson/side files missing")
    if args.apply:
        lf, lc = process_lessons(lesson_files, True); sf, sc = process_sidecards(side_files, True); af = process_app(True)
        print(f"APPLY_LESSON_FILES_CHANGED={lf} APPLY_LESSON_CARDS_SCANNED={lc}")
        print(f"APPLY_SIDE_FILES_CHANGED={sf} APPLY_SIDE_CARDS_SCANNED={sc}")
        print(f"APPLY_APP_FILES_CHANGED={af}")
    errors = audit()
    print("RESULT=" + ("FAIL_CONTENT_QUALITY_FINAL_PASS_V339" if errors else "PASS_CONTENT_QUALITY_FINAL_PASS_V339"))
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())

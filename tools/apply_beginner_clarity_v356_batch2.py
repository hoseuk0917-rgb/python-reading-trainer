#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON = ROOT / "data/lessons/python_foundation_beginner_v94_a1_part2.json"
APP = ROOT / "src/pwa/app.js"

OVERRIDES = {
    "PYF94_A1_L01_TYPE_001": {
        "reading_goal": "따옴표가 있는 \"3\"과 \"4\"는 문자열이며 +로 이어 붙는다는 것을 확인한다.",
        "explanation": "\"3\"과 \"4\"에는 따옴표가 있으므로 둘 다 문자열이다. 문자열 사이의 +는 숫자 덧셈이 아니라 앞뒤 글자를 이어 붙인다. 그래서 value에는 \"34\"가 저장되고 print(value)는 34를 출력한다.",
    },
    "PYF94_A1_L01_TYPE_002": {
        "reading_goal": "따옴표 없는 숫자 3과 4는 +로 실제 덧셈된다는 것을 확인한다.",
        "explanation": "3과 4에는 따옴표가 없으므로 숫자다. 숫자 사이의 +는 덧셈을 하므로 3 + 4는 7이 된다. value에 7이 저장되고 print(value)는 7을 출력한다.",
    },
    "PYF94_A1_L01_TYPE_003": {
        "reading_goal": "문자열 숫자를 int()로 정수로 바꾼 뒤 계산하는 순서를 확인한다.",
        "explanation": "1줄째 text에는 문자열 \"10\"이 저장된다. 2줄째 int(text)가 \"10\"을 숫자 10으로 바꾸고 그 값을 number에 저장한다. 3줄째 number + 5는 10 + 5이므로 15가 출력된다.",
    },
    "PYF94_A1_L01_TYPE_004": {
        "reading_goal": "숫자를 str()로 문자열로 바꾼 뒤 다른 문자열과 이어 붙이는 순서를 확인한다.",
        "explanation": "1줄째 count에는 숫자 3이 저장된다. 2줄째 str(count)가 숫자 3을 문자열 \"3\"으로 바꾸어 text에 저장한다. 3줄째 문자열 \"3\"과 \"개\"가 이어 붙으므로 3개가 출력된다.",
    },
    "PYF94_A1_L01_TYPE_005": {
        "reading_goal": "type(value)가 value의 값 종류인 자료형을 확인하는 함수라는 것을 확인한다.",
        "explanation": "1줄째 value에는 문자열 \"hello\"가 저장된다. 2줄째 type(value)는 value의 길이나 파일명을 보는 것이 아니라, 현재 값이 문자열인지 숫자인지 같은 자료형을 확인한다. 따라서 정답은 값의 자료형이다.",
    },
    "PYF94_A1_L01_TYPE_006": {
        "reading_goal": "문자열 소수를 float()로 숫자로 바꾼 뒤 소수 계산하는 순서를 확인한다.",
        "explanation": "1줄째 text에는 문자열 \"3.5\"가 저장된다. 2줄째 float(text)가 이를 소수 숫자 3.5로 바꾸어 value에 저장한다. 3줄째 3.5 + 0.5를 계산하므로 4.0이 출력된다.",
    },
    "PYF94_A1_L01_TYPE_007": {
        "reading_goal": "문자열에 정수를 곱하면 그 문자열이 지정한 횟수만큼 반복된다는 것을 확인한다.",
        "explanation": "1줄째 text에 문자열 \"ha\"를 저장한다. 2줄째 text * 3은 문자열 ha를 세 번 반복해 hahaha를 만든다. print()는 그 결과를 보여 주므로 hahaha가 출력된다.",
    },
    "PYF94_A1_L01_TYPE_008": {
        "reading_goal": "문자열 \"2\"와 숫자 2는 모양이 비슷해도 서로 다른 값으로 비교된다는 것을 확인한다.",
        "explanation": "a에는 문자열 \"2\"가 있고 b에는 숫자 2가 있다. ==는 두 값이 같은지 비교하지만 문자열과 숫자는 자료형이 다르다. 따라서 a == b의 결과는 False이고 print()는 False를 출력한다.",
    },
    "PYF94_A1_L01_TYPE_009": {
        "reading_goal": "크기 비교식이 조건의 결과로 True 또는 False를 만든다는 것을 확인한다.",
        "explanation": "1줄째 score에 80을 저장한다. 2줄째 score >= 60은 80이 60 이상인지 묻는 비교식이다. 80은 60 이상이므로 비교 결과는 True이고 print()는 True를 출력한다.",
    },
    "PYF94_A1_L01_TYPE_010": {
        "reading_goal": "len(문자열)이 문자열에 들어 있는 글자 수를 반환한다는 것을 확인한다.",
        "explanation": "1줄째 word에는 문자열 Python이 저장된다. Python은 P, y, t, h, o, n의 여섯 글자다. 따라서 len(word)는 6이고 print()는 6을 출력한다.",
    },
    "PYF94_A1_L01_TYPE_011": {
        "reading_goal": "문자열의 공백도 len()에서 문자 한 개로 세어진다는 것을 확인한다.",
        "explanation": "문자열 \"A B\"에는 A, 공백, B가 들어 있다. 공백도 문자 한 개로 세므로 전체 글자 수는 3개다. 따라서 len(word)는 3이고 3이 출력된다.",
    },
    "PYF94_A1_L01_TYPE_012": {
        "reading_goal": "문자열 \"007\"을 int()로 바꾸면 숫자 7이 된다는 것을 확인한다.",
        "explanation": "int(\"007\")은 글자로 적힌 \"007\"을 정수 값으로 바꾼다. 정수에서는 앞의 0이 숫자의 크기를 바꾸지 않으므로 결과는 7이다. number에 7이 저장되고 print(number)는 7을 출력한다.",
    },
    "PYF94_A1_L01_INPUT_001": {
        "reading_goal": "input()으로 입력한 값이 변수에 저장되고 print()로 다시 출력되는 순서를 확인한다.",
        "explanation": "1줄째 input(\"이름: \")은 먼저 이름: 이라는 안내 문구를 보여 주고 사용자의 입력을 기다린다. 사용자가 Python을 입력하면 문자열 \"Python\"이 name에 저장된다. 2줄째 print(name)은 Python을 출력한다.",
    },
    "PYF94_A1_L01_INPUT_002": {
        "reading_goal": "input() 결과는 문자열이므로 다른 문자열과 +로 이어 붙일 수 있음을 확인한다.",
        "explanation": "사용자가 10을 입력해도 input()의 결과는 문자열 \"10\"이다. 이 값이 age에 저장된다. age + \"살\"은 두 문자열을 이어 붙이므로 print()는 10살을 출력한다.",
    },
    "PYF94_A1_L01_INPUT_003": {
        "reading_goal": "input()의 문자열 결과를 int()로 숫자로 바꾼 뒤 계산하는 순서를 확인한다.",
        "explanation": "사용자가 10을 입력하면 input()은 먼저 문자열 \"10\"을 만든다. 바깥의 int()가 이를 숫자 10으로 바꾸어 age에 저장한다. 그래서 age + 1은 10 + 1로 계산되고 11이 출력된다.",
    },
    "PYF94_A1_L01_INPUT_004": {
        "reading_goal": "두 번 입력한 문자열이 입력 순서대로 이어 붙는 것을 확인한다.",
        "explanation": "첫 번째 input()에서 입력한 A가 first에 저장된다. 두 번째 input()에서 입력한 B가 second에 저장된다. first + second는 A 뒤에 B를 바로 이어 붙이므로 AB가 출력된다.",
    },
    "PYF94_A1_L01_INPUT_005": {
        "reading_goal": "두 입력값을 각각 int()로 숫자로 바꾼 뒤 더하는 순서를 확인한다.",
        "explanation": "첫 입력 3은 int()를 거쳐 숫자 3이 되어 a에 저장된다. 둘째 입력 4도 숫자 4가 되어 b에 저장된다. 따라서 a + b는 3 + 4로 계산되고 7이 출력된다.",
    },
    "PYF94_A1_L01_INPUT_006": {
        "reading_goal": "input()의 안내 문구와 실제로 변수에 저장되는 사용자 입력값을 구분한다.",
        "explanation": "\"도시를 입력하세요: \"는 입력 전에 사용자에게 보여 주는 안내 문구다. 사용자가 Seoul을 입력하면 city에 저장되는 값은 문자열 \"Seoul\"이다. 따라서 print(city)는 Seoul을 출력한다.",
    },
    "PYF94_A1_L01_INPUT_007": {
        "reading_goal": "입력 문자열의 양쪽 공백을 strip()으로 제거해 새 변수에 저장하는 순서를 확인한다.",
        "explanation": "1줄째 text에는 사용자가 입력한 문자열이 공백을 포함한 채 저장된다. 2줄째 text.strip()이 양쪽 공백을 제거한 새 문자열 hi를 만들고 clean에 저장한다. 3줄째 print(clean)은 hi를 출력한다.",
    },
    "PYF94_A1_L01_INPUT_008": {
        "reading_goal": "입력한 문자열과 기준 문자열을 ==로 비교하면 True 또는 False가 나온다는 것을 확인한다.",
        "explanation": "사용자가 yes를 입력하면 answer에 문자열 \"yes\"가 저장된다. 2줄째 answer == \"yes\"는 두 문자열이 같은지 비교한다. 두 값이 같으므로 결과는 True이고 print()는 True를 출력한다.",
    },
    "PYF94_A1_L01_INPUT_009": {
        "reading_goal": "문자열 비교에서는 대문자와 소문자를 서로 다른 글자로 구분한다는 것을 확인한다.",
        "explanation": "사용자가 YES를 입력하면 answer에는 문자열 \"YES\"가 저장된다. 비교 대상은 소문자 \"yes\"다. Python의 문자열 비교는 대소문자를 구분하므로 두 값은 같지 않고 False가 출력된다.",
    },
    "PYF94_A1_L01_INPUT_010": {
        "reading_goal": "input()으로 받은 문자열에도 len()을 사용해 글자 수를 셀 수 있음을 확인한다.",
        "explanation": "사용자가 code를 입력하면 text에 문자열 \"code\"가 저장된다. code는 c, o, d, e의 네 글자다. 따라서 len(text)는 4이고 print()는 4를 출력한다.",
    },
    "PYF94_A1_L01_INPUT_011": {
        "reading_goal": "쉼표가 있는 입력 문자열을 split()으로 나눈 뒤 만들어진 항목 수를 세는 순서를 확인한다.",
        "explanation": "사용자가 A,B,C를 입력하면 text에 그 문자열이 저장된다. text.split(\",\")은 쉼표를 기준으로 나누어 [\"A\", \"B\", \"C\"] 세 항목을 만든다. 따라서 len(items)는 3이고 3이 출력된다.",
    },
    "PYF94_A1_L01_INPUT_012": {
        "reading_goal": "input()으로 받은 값도 다른 변수에 저장해 다시 사용할 수 있음을 확인한다.",
        "explanation": "사용자가 robot을 입력하면 value에 문자열 \"robot\"이 저장된다. 2줄째 copy = value는 value의 현재 값 robot을 copy에도 저장한다. 3줄째 print(copy)는 robot을 출력한다.",
    },
}

CONCEPT_DEFINITIONS = {
    "str": "문자열(str)은 글자를 다루는 값이다. 따옴표로 감싼 \"3\"은 숫자처럼 보여도 문자열이다. 문자열끼리 +를 사용하면 숫자 계산이 아니라 글자를 이어 붙인다.",
    "int": "정수(int)는 3, -1, 100처럼 소수점이 없는 숫자다. int(\"10\")은 문자열 \"10\"을 숫자 10으로 바꾼다.",
    "float": "실수(float)는 3.5처럼 소수점이 있는 숫자를 다룰 때 쓰는 자료형이다. float(\"3.5\")은 문자열 \"3.5\"를 숫자 3.5로 바꾼다.",
    "type": "type(value)는 value가 어떤 자료형인지 확인한다. 예를 들어 type(3)은 int, type(\"3\")은 str인지 확인할 때 쓴다.",
    "input": "input()은 사용자가 입력한 내용을 문자열로 받아 돌려주는 함수다. input(\"이름: \")의 괄호 안 문장은 안내 문구이고, 변수에는 사용자가 실제로 입력한 값이 저장된다.",
    "len": "len(value)는 문자열의 글자 수나 리스트의 항목 수처럼 value 안에 몇 개가 들어 있는지 세어 정수로 돌려준다.",
}


def patch_lesson() -> None:
    cards = json.loads(LESSON.read_text(encoding="utf-8"))
    by_id = {card["id"]: card for card in cards}
    missing = sorted(set(OVERRIDES) - set(by_id))
    if missing:
        raise SystemExit(f"Missing V356 batch2 card ids: {missing}")
    for card_id, fields in OVERRIDES.items():
        by_id[card_id].update(fields)
    LESSON.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"V356_BATCH2_CARDS_UPDATED={len(OVERRIDES)}")


def patch_definition(source: str, key: str, definition: str) -> tuple[str, int]:
    key_pat = re.escape(key)
    pattern = re.compile(
        rf'((?:[\"\']{key_pat}[\"\']|\b{key_pat}\b)\s*:\s*\{{\s*definition\s*:\s*)"(?:\\.|[^"\\])*"'
    )
    escaped = json.dumps(definition, ensure_ascii=False)
    return pattern.subn(lambda m: m.group(1) + escaped, source)


def patch_app() -> None:
    source = APP.read_text(encoding="utf-8")
    total = 0
    for key, definition in CONCEPT_DEFINITIONS.items():
        source, count = patch_definition(source, key, definition)
        if count == 0:
            raise SystemExit(f"V356 batch2 concept definition not found: {key}")
        print(f"V356_BATCH2_CONCEPT_PATCH={key}:{count}")
        total += count
    APP.write_text(source, encoding="utf-8")
    print(f"V356_BATCH2_CONCEPT_DEFINITION_PATCHES={total}")


def main() -> None:
    patch_lesson()
    patch_app()
    print("RESULT=V356_BATCH2_APPLIED")


if __name__ == "__main__":
    main()

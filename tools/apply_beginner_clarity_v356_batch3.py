#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PATCHES = {
    "data/lessons/python_beginner_mixed_review_v96_a1.json": {
        "PYV96_A1_REVIEW_001_VAR_REASSIGN": {
            "reading_goal": "현재 x 값으로 새 값을 계산한 뒤 그 결과를 다시 x에 저장하는 순서를 확인한다.",
            "explanation": "1줄째 x = 2에서 x에 2를 저장한다. 2줄째는 먼저 현재 x 값 2에 3을 더해 5를 만든다. 그 결과 5를 다시 x에 저장한다. 3줄째 print(x)는 현재 값 5를 출력한다.",
        },
        "PYV96_A1_REVIEW_002_PRINT_STRING_NUMBER": {
            "reading_goal": "문자열 \"3\"과 숫자 3은 자료형은 다르지만 print 결과가 같은 모양으로 보일 수 있음을 확인한다.",
            "explanation": "1줄째 x에는 문자열 \"3\"이 저장되고 2줄째 y에는 숫자 3이 저장된다. 3줄째 print(x)는 문자열의 따옴표를 화면에 붙이지 않으므로 3을 보여 준다. 4줄째 print(y)도 숫자 3을 보여 준다. 따라서 출력은 3 다음 3이지만 두 값의 자료형은 서로 다르다.",
        },
        "PYV96_A1_REVIEW_003_TYPE_NAME": {
            "reading_goal": "문자열 값에 type(...).__name__을 사용하면 자료형 이름 str이 나온다는 것을 확인한다.",
            "explanation": "1줄째 value에는 따옴표로 감싼 문자열 \"hello\"가 저장된다. type(value)는 이 값의 자료형을 확인하고, .__name__은 그 자료형의 이름을 꺼낸다. 문자열의 자료형 이름은 str이므로 str이 출력된다.",
        },
        "PYV96_A1_REVIEW_004_INT_ADD": {
            "reading_goal": "두 숫자 변수에 저장된 값을 꺼내 더한 결과를 확인한다.",
            "explanation": "1줄째 a에 2를 저장하고 2줄째 b에 4를 저장한다. 3줄째 a + b는 변수 이름이 아니라 그 안의 값 2와 4를 더한다. 2 + 4는 6이므로 print()는 6을 출력한다.",
        },
        "PYV96_A1_REVIEW_005_STRING_PLUS": {
            "reading_goal": "두 문자열 변수에 +를 사용하면 글자가 순서대로 이어 붙는 것을 확인한다.",
            "explanation": "1줄째 a에는 문자열 \"py\", 2줄째 b에는 문자열 \"thon\"이 저장된다. 두 값이 문자열이므로 a + b는 숫자 덧셈이 아니라 py 뒤에 thon을 붙인다. 따라서 print()는 python을 출력한다.",
        },
        "PYV96_A1_REVIEW_006_BOOL_COMPARE": {
            "reading_goal": "크기 비교식이 True 또는 False 값을 만든다는 것을 실제 숫자로 확인한다.",
            "explanation": "1줄째 score에 80을 저장한다. 2줄째 score >= 60은 80이 60보다 크거나 같은지 비교한다. 이 조건은 맞으므로 비교 결과는 True이고 print()는 True를 출력한다.",
        },
        "PYV96_A1_REVIEW_007_IF_SIMPLE": {
            "reading_goal": "if 조건이 참일 때 들여쓴 코드가 실행되는 것을 확인한다.",
            "explanation": "1줄째 score에 70을 저장한다. 2줄째 score >= 60을 계산하면 True다. 조건이 참이므로 if 아래에 들여쓴 print(\"pass\")가 실행되어 pass가 출력된다.",
        },
        "PYV96_A1_REVIEW_008_IF_FALSE_NO_ELSE": {
            "reading_goal": "if 조건이 거짓이고 else가 없으면 들여쓴 코드가 건너뛰어지는 것을 확인한다.",
            "explanation": "1줄째 score에 50을 저장한다. 2줄째 50 >= 60은 False다. 조건이 거짓이므로 들여쓴 print(\"pass\")는 실행되지 않는다. else나 다른 print도 없으므로 화면에는 아무것도 출력되지 않는다.",
        },
        "PYV96_A1_REVIEW_009_LIST_INDEX_ZERO": {
            "reading_goal": "리스트에서 인덱스 0이 첫 번째 항목을 뜻한다는 것을 확인한다.",
            "explanation": "items에는 a, b, c가 이 순서로 들어 있다. Python 리스트의 위치 번호는 0부터 시작하므로 items[0]은 첫 번째 항목 a다. 따라서 print(items[0])은 a를 출력한다.",
        },
        "PYV96_A1_REVIEW_010_LIST_APPEND_LEN": {
            "reading_goal": "append()로 항목을 추가할 때 리스트 내용과 길이가 어떻게 바뀌는지 확인한다.",
            "explanation": "1줄째 items는 빈 리스트 []다. 첫 append 후에는 ['a']가 되고, 두 번째 append 후에는 ['a', 'b']가 된다. 최종 항목 수는 2개이므로 len(items)는 2이고 2가 출력된다.",
        },
        "PYV96_A1_REVIEW_011_DICT_KEY_VALUE": {
            "reading_goal": "딕셔너리에서 key를 사용해 그 key에 연결된 값을 꺼내는 방법을 확인한다.",
            "explanation": "data에는 name key와 age key가 있다. name key에는 문자열 Mina가 연결되어 있다. data[\"name\"]은 name이라는 글자를 출력하는 코드가 아니라 그 key에 연결된 값 Mina를 꺼내는 코드다. 따라서 Mina가 출력된다.",
        },
        "PYV96_A1_REVIEW_012_DICT_UPDATE": {
            "reading_goal": "딕셔너리의 같은 key에 새 값을 저장하면 기존 값이 바뀌는 것을 확인한다.",
            "explanation": "1줄째 data의 score key에는 1이 저장되어 있다. 2줄째 data[\"score\"] = 3이 같은 key에 새 값 3을 저장한다. 이제 score의 현재 값은 3이므로 3줄째 print(data[\"score\"])는 3을 출력한다.",
        },
    },
    "data/lessons/python_beginner_reading_notes_v96_a2.json": {
        "PYV96_A2_NOTE_001_ASSIGNMENT_TRACE": {
            "reading_goal": "여러 대입문을 위에서 아래로 계산하며 x와 y의 현재 값을 차례로 확인한다.",
            "explanation": "1줄째 x = 1에서 x에 1을 저장한다. 2줄째 x + 4는 1 + 4이므로 5가 되고 그 값을 y에 저장한다. 3줄째 y + 1은 5 + 1이므로 6이 되고 그 값을 다시 x에 저장한다. 따라서 print(x)는 6을 출력한다.",
        },
        "PYV96_A2_NOTE_002_PRINT_NOT_STORE": {
            "reading_goal": "print() 안에서 계산한 결과를 보여 주는 것과 변수에 새 값을 저장하는 것을 구분한다.",
            "explanation": "1줄째 x에 2를 저장한다. 2줄째 print(x + 3)는 2 + 3을 계산해 5를 보여 주지만, 그 5를 x에 저장하는 대입문은 없다. 그래서 x는 계속 2이고 3줄째 print(x)는 2를 출력한다. 출력 순서는 5 다음 2다.",
        },
        "PYV96_A2_NOTE_003_TYPE_STRING_INT": {
            "reading_goal": "따옴표가 있는 숫자 모양의 값은 문자열이며 +로 이어 붙는다는 것을 확인한다.",
            "explanation": "a와 b에는 각각 문자열 \"3\"과 \"4\"가 저장된다. 둘 다 문자열이므로 +는 숫자 덧셈을 하지 않고 두 글자를 이어 붙인다. 따라서 a + b는 \"34\"가 되고 print()는 34를 출력한다.",
        },
        "PYV96_A2_NOTE_004_BOOL_IF": {
            "reading_goal": "Boolean 값 False가 if에서 어느 분기를 선택하게 하는지 확인한다.",
            "explanation": "1줄째 active에는 Boolean 값 False가 저장된다. if active의 조건이 거짓이므로 들여쓴 print(\"on\")은 건너뛴다. 대신 else 블록의 print(\"off\")가 실행되어 off가 출력된다.",
        },
        "PYV96_A2_NOTE_005_LIST_APPEND_INDEX": {
            "reading_goal": "리스트에 항목을 추가한 뒤 인덱스 1로 두 번째 항목을 읽는 순서를 확인한다.",
            "explanation": "1줄째 items는 ['a']다. 2줄째 append('b')가 리스트 끝에 b를 추가해 ['a', 'b']가 된다. 인덱스는 0부터 시작하므로 items[1]은 두 번째 항목 b이고, print()는 b를 출력한다.",
        },
        "PYV96_A2_NOTE_006_DICT_ASSIGN_READ": {
            "reading_goal": "빈 딕셔너리에 새 key와 값을 저장한 뒤 같은 key로 값을 꺼내는 순서를 확인한다.",
            "explanation": "1줄째 data는 빈 딕셔너리 {}다. 2줄째 data[\"name\"] = \"Mina\"가 name key를 만들고 그 key에 Mina를 저장한다. 3줄째 같은 key인 data[\"name\"]을 읽으므로 Mina가 출력된다.",
        },
        "PYV96_A2_NOTE_007_SPLIT_LIGHT": {
            "reading_goal": "split()이 문자열을 여러 항목의 리스트로 나누고 인덱스로 첫 항목을 꺼내는 순서를 확인한다.",
            "explanation": "1줄째 text에는 \"red blue\"가 저장된다. 2줄째 text.split()은 공백을 기준으로 나누어 ['red', 'blue']를 만들고 words에 저장한다. words[0]은 첫 번째 항목 red이므로 print()는 red를 출력한다.",
        },
        "PYV96_A2_NOTE_008_IF_COMPARE": {
            "reading_goal": "비교 결과가 True일 때 if 블록이 실행되고 else는 건너뛰어지는 것을 확인한다.",
            "explanation": "1줄째 age에 10을 저장한다. 2줄째 age < 13은 10 < 13이므로 True다. 따라서 if 아래 print(\"child\")가 실행되어 child가 출력되고, else의 print(\"teen\")은 실행되지 않는다.",
        },
    },
    "data/lessons/python_foundation_expansion_v10.json": {
        "PY10_L01_variable_001": {
            "reading_goal": "변수에 문자열을 저장한 뒤 그 변수 이름으로 저장된 값을 출력하는 방법을 확인한다.",
            "explanation": "1줄째 name = \"LiDAR\"에서 name이라는 변수에 문자열 LiDAR를 저장한다. 2줄째 print(name)은 글자 name을 출력하는 것이 아니라 name에 저장된 값을 읽는다. 따라서 LiDAR가 출력된다.",
        },
        "PY10_L01_reassign_001": {
            "title": "변수 값을 계산해 다시 저장하기",
            "reading_goal": "현재 count 값으로 새 값을 계산한 뒤 그 결과를 다시 count에 저장하는 순서를 확인한다.",
            "explanation": "1줄째 count = 3에서 count에 3을 저장한다. 2줄째는 먼저 현재 count 값 3에 2를 더해 5를 만든다. 그 결과 5를 다시 count에 저장한다. 따라서 3줄째 print(count)는 현재 값 5를 출력한다. 여기서 =는 비교가 아니라 값을 저장하는 대입이다.",
        },
    },
    "data/lessons/python_core_expansion_v1.json": {
        "PY_L01_comment_001": {
            "reading_goal": "#으로 시작하는 주석은 실행되지 않고 실제 코드만 실행된다는 것을 확인한다.",
            "explanation": "1줄째는 #으로 시작하는 주석이라 Python이 실행하지 않는다. 그래서 이 줄의 글자는 화면에 출력되지 않는다. 2줄째 print(\"hello\")만 실행되므로 hello가 출력된다.",
        },
        "PY_L01_type_001": {
            "reading_goal": "type(value)가 value에 저장된 값의 자료형을 확인한다는 것을 실제 출력과 함께 확인한다.",
            "explanation": "1줄째 value에 숫자 3을 저장한다. 따옴표가 없는 3은 정수 int다. 2줄째 type(value)는 현재 값 3의 자료형을 확인해 int를 나타내는 객체를 만들고, print()는 <class 'int'>를 출력한다. 따라서 type()이 확인하는 것은 value의 자료형이다.",
        },
        "PY_L01_cast_001": {
            "reading_goal": "문자열 숫자를 int()로 정수로 바꾼 뒤 덧셈하는 순서를 확인한다.",
            "explanation": "1줄째 raw에는 문자열 \"3\"이 저장된다. 2줄째 int(raw)가 문자열 \"3\"을 숫자 3으로 바꾸어 value에 저장한다. 3줄째 value + 2는 3 + 2로 계산되므로 print()는 5를 출력한다.",
        },
    },
    "data/lessons/cards_seed_v1.json": {
        "L01_len_001": {
            "reading_goal": "리스트의 항목을 직접 세어 len(items)의 결과와 연결한다.",
            "explanation": "1줄째 items에는 UAM, ADAS, Robotics 세 항목이 들어 있다. 2줄째 len(items)는 리스트 안의 항목 수를 세므로 결과는 3이고 그 값을 count에 저장한다. 3줄째 print(count)는 3을 출력한다.",
        },
    },
}


def main() -> None:
    total = 0
    for rel_path, overrides in PATCHES.items():
        path = ROOT / rel_path
        cards = json.loads(path.read_text(encoding="utf-8"))
        by_id = {card["id"]: card for card in cards}
        missing = sorted(set(overrides) - set(by_id))
        if missing:
            raise SystemExit(f"Missing V356 batch3 ids in {rel_path}: {missing}")
        for card_id, fields in overrides.items():
            by_id[card_id].update(fields)
            total += 1
        path.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"V356_BATCH3_FILE={rel_path}|UPDATED={len(overrides)}")
    print(f"V356_BATCH3_CARDS_UPDATED={total}")
    if total != 26:
        raise SystemExit(f"Expected 26 Level 1 cards, got {total}")
    print("RESULT=V356_BATCH3_LEVEL1_REMAINING_APPLIED")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON = ROOT / "data/lessons/python_foundation_beginner_v94_a1_part1.json"
APP = ROOT / "src/pwa/app.js"

OVERRIDES = {
    "PYF94_A1_L01_PRINT_001": {
        "reading_goal": "print(\"Python\")에서 따옴표 안의 글자가 화면에 어떻게 보이는지 확인한다.",
        "explanation": "print(\"Python\")에서 따옴표 안의 Python은 글자 값이다. print()는 그 글자를 화면에 보여 준다. 따옴표는 문자열을 표시하는 문법이므로 출력 결과에는 보이지 않는다. 따라서 Python이 출력된다.",
    },
    "PYF94_A1_L01_PRINT_002": {
        "reading_goal": "변수에 값을 저장한 뒤 print(변수)가 그 저장값을 출력하는 것을 확인한다.",
        "explanation": "1줄째 name = \"Python\"에서 name에 Python을 저장한다. 2줄째 print(name)은 name에 저장된 값을 읽어 화면에 보여 준다. 따라서 Python이 출력된다.",
    },
    "PYF94_A1_L01_PRINT_003": {
        "reading_goal": "print(name)과 print(\"name\")의 차이를 따옴표를 기준으로 구분한다.",
        "explanation": "1줄째에서 name에 Python을 저장한다. 하지만 2줄째는 print(\"name\")이다. 따옴표가 있으므로 변수 name의 값을 찾지 않고 글자 name을 그대로 출력한다. 따라서 출력은 name이다.",
    },
    "PYF94_A1_L01_PRINT_004": {
        "reading_goal": "print가 여러 번 나오면 위에서 아래 순서대로 출력된다는 것을 확인한다.",
        "explanation": "1줄째 print(\"A\")가 먼저 실행되어 A가 출력된다. 그다음 2줄째 print(\"B\")가 실행되어 B가 출력된다. 따라서 출력 순서는 A 다음 B이다.",
    },
    "PYF94_A1_L01_PRINT_005": {
        "reading_goal": "print() 안에 계산식이 있으면 계산 결과가 출력된다는 것을 확인한다.",
        "explanation": "print(2 + 3)에서는 먼저 2 + 3을 계산한다. 계산 결과는 5다. print()가 그 결과를 화면에 보여 주므로 5가 출력된다.",
    },
    "PYF94_A1_L01_PRINT_006": {
        "reading_goal": "문자열 두 개를 +로 더하면 글자가 이어 붙는 것을 확인한다.",
        "explanation": "\"Py\"와 \"thon\"은 둘 다 문자열이다. 문자열 사이의 +는 숫자 덧셈이 아니라 두 글자를 이어 붙인다. 자동으로 공백은 들어가지 않으므로 결과는 Python이다.",
    },
    "PYF94_A1_L01_PRINT_007": {
        "reading_goal": "print()에 쉼표로 여러 값을 넣었을 때 기본 출력 모양을 확인한다.",
        "explanation": "print(\"A\", \"B\")에는 출력할 값이 A와 B 두 개 있다. print()는 기본적으로 두 값 사이에 공백 한 칸을 넣어 보여 준다. 따라서 화면에는 A B처럼 보인다.",
    },
    "PYF94_A1_L01_PRINT_008": {
        "reading_goal": "print가 실행되는 시점에 변수에 들어 있는 값으로 출력을 판단한다.",
        "explanation": "1줄째 x = 1에서 x에 1을 저장한다. 2줄째 print(x)가 실행될 때 x의 값은 아직 1이므로 1이 출력된다. 3줄째 x = 2는 출력이 끝난 뒤 실행되므로 앞의 출력은 바뀌지 않는다.",
    },
    "PYF94_A1_L01_PRINT_009": {
        "reading_goal": "같은 변수에 새 값을 저장하면 다음 코드에서는 새 값이 사용되는 것을 확인한다.",
        "explanation": "1줄째에서 x에 1을 저장한다. 2줄째 x = 2가 실행되면 x의 현재 값은 2로 바뀐다. 3줄째 print(x)는 현재 값 2를 읽으므로 2가 출력된다.",
    },
    "PYF94_A1_L01_PRINT_010": {
        "reading_goal": "빈 문자열은 값이 없는 것이 아니라 글자가 0개인 문자열이라는 점을 확인한다.",
        "explanation": "text = \"\"에서 text에는 빈 문자열이 저장된다. 빈 문자열은 None이나 숫자 0이 아니라 글자가 하나도 없는 문자열 값이다. print(text)를 실행하면 줄은 출력되지만 눈에 보이는 글자는 없다. 따라서 text에 저장된 값은 빈 문자열이다.",
    },
    "PYF94_A1_L01_PRINT_011": {
        "reading_goal": "숫자 3과 문자열 \"3\"은 종류가 달라도 화면에서는 비슷하게 보일 수 있음을 확인한다.",
        "explanation": "1줄째 print(3)은 숫자 3을 출력한다. 2줄째 print(\"3\")은 문자열 3을 출력한다. 두 값의 자료형은 다르지만 print 결과에는 따옴표가 보이지 않으므로 화면에서는 둘 다 3처럼 보인다.",
    },
    "PYF94_A1_L01_PRINT_012": {
        "reading_goal": "현재 변수 값으로 새 값을 계산한 뒤 같은 변수에 다시 저장하는 순서를 확인한다.",
        "explanation": "1줄째 count = 2에서 count에 2를 저장한다. 2줄째 오른쪽 count + 1은 현재 값 2에 1을 더해 3을 만든다. 그 결과 3을 다시 count에 저장한다. 3줄째 print(count)는 현재 값 3을 출력한다.",
    },
    "PYF94_A1_L01_VAR_001": {
        "reading_goal": "변수에 문자열을 저장하고 그 변수 이름으로 저장값을 다시 사용하는 방법을 확인한다.",
        "explanation": "1줄째 label = \"UAM\"에서 label에 문자열 UAM을 저장한다. 2줄째 print(label)은 글자 label을 출력하는 것이 아니라 label에 저장된 값을 읽는다. 따라서 UAM이 출력된다.",
    },
    "PYF94_A1_L01_VAR_002": {
        "reading_goal": "같은 변수에 값을 두 번 저장하면 마지막에 저장한 값이 사용되는 것을 확인한다.",
        "explanation": "1줄째에서 score에 1을 저장한다. 2줄째 score = 5가 실행되면 score의 현재 값은 5로 바뀐다. 3줄째 print(score)는 현재 값 5를 출력한다.",
    },
    "PYF94_A1_L01_VAR_003": {
        "reading_goal": "한 변수에 저장된 값을 다른 변수에 저장한 뒤 그 값을 사용하는 방법을 확인한다.",
        "explanation": "1줄째에서 a에 robot을 저장한다. 2줄째 b = a는 a에 들어 있는 현재 값 robot을 읽어 b에도 저장한다. 3줄째 print(b)는 b에 저장된 robot을 출력한다.",
    },
    "PYF94_A1_L01_VAR_004": {
        "reading_goal": "b = a가 실행된 뒤 a에 새 값을 저장해도 b의 값은 그대로인 경우를 확인한다.",
        "explanation": "1줄째에서 a에 old를 저장한다. 2줄째 b = a가 실행될 때 b에도 현재 값 old가 저장된다. 3줄째에서 a만 new로 바뀐다. b에는 여전히 old가 있으므로 4줄째 print(b)는 old를 출력한다.",
    },
    "PYF94_A1_L01_VAR_005": {
        "reading_goal": "변수에 저장된 숫자를 계산에 사용하고 결과를 새 변수에 저장하는 순서를 확인한다.",
        "explanation": "1줄째 count = 3에서 count에 3을 저장한다. 2줄째 count + 1을 계산하면 4가 되고, 그 결과를 next_count에 저장한다. 3줄째 print(next_count)는 4를 출력한다.",
    },
    "PYF94_A1_L01_VAR_006": {
        "reading_goal": "두 문자열 변수의 값을 이어 붙여 새 변수에 저장하는 순서를 확인한다.",
        "explanation": "1줄째 first에는 Py, 2줄째 second에는 thon을 저장한다. 3줄째 first + second는 두 문자열을 이어 붙여 Python을 만든다. 그 값을 word에 저장했으므로 4줄째 print(word)는 Python을 출력한다.",
    },
    "PYF94_A1_L01_VAR_007": {
        "reading_goal": "따옴표 안에 쓴 이름은 같은 이름의 변수가 있어도 글자 그대로 사용된다는 것을 확인한다.",
        "explanation": "1줄째에서 city에 Seoul을 저장한다. 하지만 2줄째는 print(\"city\")처럼 city에 따옴표가 있다. 그래서 변수 city의 값 Seoul을 읽지 않고 글자 city를 그대로 출력한다.",
    },
    "PYF94_A1_L01_VAR_008": {
        "title": "변수 값을 계산해 다시 저장하기",
        "reading_goal": "현재 n의 값으로 새 값을 계산한 뒤 그 결과를 다시 n에 저장하는 순서를 확인한다.",
        "explanation": "1줄째 n = 10에서 n에 10을 저장한다. 2줄째는 먼저 오른쪽 n + 5를 계산한다. 현재 n은 10이므로 10 + 5 = 15다. 계산 결과 15를 다시 n에 저장한다. 3줄째 print(n)는 현재 값 15를 출력한다.",
    },
    "PYF94_A1_L01_VAR_009": {
        "reading_goal": "서로 다른 두 숫자 변수의 값을 꺼내 계산하는 방법을 확인한다.",
        "explanation": "1줄째 x에 2를 저장하고 2줄째 y에 3을 저장한다. 3줄째 x + y는 2 + 3으로 계산되어 5가 된다. print()가 그 계산 결과 5를 출력한다.",
    },
    "PYF94_A1_L01_VAR_010": {
        "reading_goal": "print가 먼저 실행되면 그 뒤에 변수가 바뀌어도 이미 나온 출력은 바뀌지 않음을 확인한다.",
        "explanation": "1줄째 result에 start를 저장한다. 2줄째 print(result)가 실행될 때 result의 현재 값은 start이므로 start가 출력된다. 3줄째 result = \"end\"는 그 뒤에 실행되므로 이미 나온 출력에는 영향을 주지 않는다.",
    },
    "PYF94_A1_L01_VAR_011": {
        "reading_goal": "같은 변수에 새 값을 저장하면 이전 값 대신 새 값이 사용되는 것을 확인한다.",
        "explanation": "1줄째 mode에 easy를 저장한다. 2줄째 mode = \"hard\"가 실행되면 mode의 현재 값은 hard로 바뀐다. 3줄째 print(mode)는 현재 값 hard를 출력한다.",
    },
    "PYF94_A1_L01_VAR_012": {
        "reading_goal": "변수에는 문자열 하나뿐 아니라 리스트 전체도 저장할 수 있음을 확인한다.",
        "explanation": "1줄째 items에 [\"A\", \"B\"] 리스트 전체를 저장한다. 2줄째 print(items)는 items에 저장된 리스트 전체를 읽어 보여 준다. 따라서 ['A', 'B'] 형태로 출력된다.",
    },
}

CONCEPT_DEFINITIONS = {
    "print": "print()는 괄호 안의 값을 화면에 보여 주는 함수다. print(name)이면 name에 저장된 값을 보여 주고, print(\"name\")이면 글자 name을 그대로 보여 준다.",
    "output": "출력은 프로그램이 계산한 결과가 화면이나 터미널에 보이는 것이다. 기초 문제에서는 print()가 무엇을 보여 주는지 확인하면 된다.",
    "execution_order": "Python 코드는 보통 첫 줄부터 아래로 한 줄씩 실행된다. 각 줄이 실행될 때 변수에 어떤 값이 들어 있는지 순서대로 따라가면 최종 결과를 알 수 있다.",
    "variable": "변수는 값을 나중에 다시 쓰기 위해 붙이는 이름이다. age = 20을 실행하면 이후 age라고 쓸 때 값 20을 사용할 수 있다.",
    "assignment": "대입(assignment)은 = 오른쪽의 값을 먼저 계산한 뒤 그 결과를 왼쪽 변수에 저장하는 것이다. x = 3은 x에 3을 저장한다. x = x + 1은 현재 x 값에 1을 더한 결과를 다시 x에 저장한다.",
}


def patch_lesson() -> None:
    cards = json.loads(LESSON.read_text(encoding="utf-8"))
    by_id = {card["id"]: card for card in cards}
    missing = sorted(set(OVERRIDES) - set(by_id))
    if missing:
        raise SystemExit(f"Missing V356 card ids: {missing}")
    for card_id, fields in OVERRIDES.items():
        by_id[card_id].update(fields)
    LESSON.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"V356_FIRST_BATCH_CARDS_UPDATED={len(OVERRIDES)}")


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
            raise SystemExit(f"V356 concept definition not found: {key}")
        print(f"V356_CONCEPT_PATCH={key}:{count}")
        total += count
    source = re.sub(
        r'const CONTENT_QUALITY_DATA_EPOCH_V339 = "[^"]+";',
        'const CONTENT_QUALITY_DATA_EPOCH_V339 = "20260813_v356_clarity1";',
        source,
        count=1,
    )
    APP.write_text(source, encoding="utf-8")
    print(f"V356_CONCEPT_DEFINITION_PATCHES={total}")


def main() -> None:
    patch_lesson()
    patch_app()
    print("RESULT=V356_FIRST_BATCH_APPLIED")


if __name__ == "__main__":
    main()

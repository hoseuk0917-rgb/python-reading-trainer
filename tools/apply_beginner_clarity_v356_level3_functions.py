#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "data/lessons/python_foundation_level3_v95_a1_functions.json"

PATCHES = {
    "PYF95_A1_FUNC_003_RETURN_ASSIGN": "double(4)를 호출하면 argument 4가 parameter n에 들어간다. 함수 안에서 4 * 2를 계산해 8을 return하고, 그 반환값 8이 result에 저장된다. 마지막 print(result)가 8을 출력한다.",
    "PYF95_A1_FUNC_004_PARAM_STRING": "greet(\"Mina\")를 호출하면 문자열 Mina가 parameter name에 들어간다. 함수 안에서 \"Hi \"와 name의 현재 값 Mina를 이어 붙여 \"Hi Mina\"를 return한다. 바깥 print가 그 반환값을 받아 Hi Mina를 출력한다.",
    "PYF95_A1_FUNC_005_TWO_ARGUMENTS": "add(2, 5)를 호출하면 첫 argument 2는 a에, 둘째 argument 5는 b에 들어간다. 함수는 a + b, 즉 2 + 5를 계산해 7을 return한다. 바깥 print가 반환값 7을 출력한다.",
    "PYF95_A1_FUNC_009_LOCAL_TOTAL": "add_fee(900)을 호출하면 price에 900이 들어간다. 함수 안에서 total = 900 + 100을 계산해 지역 변수 total에 1000을 저장하고, return total이 1000을 호출한 곳으로 돌려준다. 바깥 print가 1000을 출력한다.",
    "PYF95_A1_FUNC_010_ARGUMENT_EXPRESSION": "triple에 값을 넘기기 전에 호출 괄호 안의 2 + 1이 먼저 계산되어 3이 된다. 따라서 n에는 3이 들어가고 함수는 3 * 3인 9를 return한다. 바깥 print가 9를 출력한다.",
    "PYF95_A1_FUNC_011_FUNCTION_IN_FUNCTION": "가장 안쪽의 double(4)를 먼저 계산한다. n에 4가 들어가 8을 return하고, 그 8이 add_one의 argument가 되어 x에 들어간다. add_one은 8 + 1인 9를 return하고 가장 바깥 print가 9를 출력한다.",
    "PYF95_A1_FUNC_013_IF_RETURN_TRUE": "is_big(12)를 호출하면 n은 12다. 조건 n > 10은 12 > 10이므로 True라서 if 안의 return True가 실행되고 함수가 바로 끝난다. 바깥 print가 반환된 Boolean 값 True를 출력한다.",
    "PYF95_A1_FUNC_014_IF_RETURN_FALSE": "is_big(7)를 호출하면 n은 7이다. 조건 7 > 10은 False라서 if 안의 return True를 건너뛴다. 다음 return False가 실행되어 함수가 False를 돌려주고 바깥 print가 False를 출력한다.",
    "PYF95_A1_FUNC_015_STRING_METHOD_RETURN": "clean(\" Hi \")를 호출하면 text에 앞뒤 공백이 있는 문자열이 들어간다. text.strip()이 공백을 없애 \"Hi\"를 만들고, 이어지는 lower()가 \"hi\"로 바꾼다. 함수가 \"hi\"를 return하고 바깥 print가 hi를 출력한다.",
    "PYF95_A1_FUNC_016_LIST_LEN_FUNCTION": "count_items에 ['a', 'b', 'c']가 전달되어 items가 세 항목의 리스트를 가리킨다. len(items)는 항목 수 3을 계산하고 함수가 3을 return한다. 바깥 print가 반환값 3을 출력한다.",
    "PYF95_A1_FUNC_018_MAKE_LIST_RETURN": "make_pair(\"x\", \"y\")를 호출하면 a에는 x, b에는 y가 들어간다. 함수 안에서 pair = [a, b]가 ['x', 'y']라는 새 리스트를 만들고, return pair가 그 리스트를 돌려준다. 바깥 print가 ['x', 'y']를 출력한다.",
    "PYF95_A1_FUNC_019_COUNT_WITH_FOR": "total([1, 2, 3])을 호출하면 result는 0에서 시작한다. 반복하면서 1을 더해 1, 다시 2를 더해 3, 다시 3을 더해 6으로 바뀐다. 반복이 끝난 뒤 return result가 6을 돌려주고 바깥 print가 6을 출력한다.",
    "PYF95_A1_FUNC_020_COUNT_PREFIX": "count는 0에서 시작한다. apple은 a로 시작해 count가 1이 되고, book은 조건이 False라 그대로 1이다. ant는 a로 시작해 count가 2가 된다. 반복 뒤 함수가 2를 return하고 바깥 print가 2를 출력한다.",
    "PYF95_A1_FUNC_021_DEFAULT_LIKE_SIMPLE": "label(\"\")을 호출하면 text에는 빈 문자열이 들어간다. text == \"\"가 True이므로 첫 return \"empty\"가 실행되고 함수는 그 자리에서 끝난다. 아래 return text에는 도달하지 않으며 바깥 print가 empty를 출력한다.",
    "PYF95_A1_FUNC_022_PARAMETER_NAME_LOCAL": "함수 밖 name에는 outer가 저장되어 있다. show(\"inner\")를 호출하는 동안 함수 안의 parameter name은 별도의 지역 이름으로 inner를 가리키고, upper() 결과 INNER를 return한다. 첫 print가 INNER를 출력한 뒤에도 바깥 name은 outer 그대로이므로 둘째 print는 outer를 출력한다.",
    "PYF95_A1_FUNC_023_RETURN_USED_IN_IF": "is_even(4)를 호출하면 4 % 2는 0이고 0 == 0은 True이므로 함수가 True를 return한다. 이 반환값이 그대로 if의 조건이 되어 if 블록이 선택된다. 따라서 print(\"even\")이 실행되어 even이 출력된다.",
    "PYF95_A1_FUNC_026_RETURN_STRING_NUMBER": "get_count()는 숫자 3이 아니라 문자열 \"3\"을 return하므로 value에도 문자열 \"3\"이 저장된다. value + \"1\"은 숫자 덧셈이 아니라 문자열 이어 붙이기라서 \"31\"이 된다. 마지막 print가 31을 출력한다.",
    "PYF95_A1_FUNC_027_RETURN_INT_CONVERT": "plus_one(\"7\")을 호출하면 text에는 문자열 \"7\"이 들어간다. int(text)가 이를 정수 7로 바꾸어 number에 저장하고, number + 1은 숫자 계산 7 + 1이므로 8이다. 함수가 8을 return하고 바깥 print가 8을 출력한다.",
    "PYF95_A1_FUNC_028_FUNCTION_NAME_MEANING": "normalize는 문자열을 비교하거나 저장하기 전에 모양을 일정하게 정리하는 함수다. 입력 text에 strip()을 적용해 앞뒤 공백을 없애고 lower()로 소문자로 바꾼 뒤 새 문자열을 return한다. 예시 호출 normalize(\" YES \")의 반환값은 \"yes\"이므로 ‘문자열을 정리해 비교하기 쉽게 만든다’가 가장 알맞다.",
    "PYF95_A1_FUNC_030_RETURN_LIST_LENGTH_AFTER_CALL": "print의 안쪽부터 계산하면 words()가 먼저 실행되어 ['a', 'b', 'c']를 return한다. 그 반환 리스트가 len의 입력이 되고 항목이 세 개이므로 len(...)은 3이다. 가장 바깥 print가 최종 값 3을 출력한다.",
    "PYF95_A1_FUNC_031_FUNCTION_WITH_RANGE": "repeat_count(4)를 호출하면 count는 0에서 시작한다. range(4)는 0, 1, 2, 3 네 값을 만들어 반복문이 네 번 실행되고, 실행할 때마다 count가 1씩 늘어 0 → 1 → 2 → 3 → 4가 된다. 함수가 4를 return하고 바깥 print가 4를 출력한다.",
}

REVIEWED_IDS = {f"PYF95_A1_FUNC_{i:03d}_{suffix}" for i, suffix in [
    (1, "DEF_CALL_PRINT"), (2, "DEF_NOT_CALLED"), (3, "RETURN_ASSIGN"),
    (4, "PARAM_STRING"), (5, "TWO_ARGUMENTS"), (6, "CALL_TWICE"),
    (7, "PRINT_VS_RETURN_NONE"), (8, "RETURN_NO_PRINT"), (9, "LOCAL_TOTAL"),
    (10, "ARGUMENT_EXPRESSION"), (11, "FUNCTION_IN_FUNCTION"), (12, "RETURN_STOPS_AFTER"),
    (13, "IF_RETURN_TRUE"), (14, "IF_RETURN_FALSE"), (15, "STRING_METHOD_RETURN"),
    (16, "LIST_LEN_FUNCTION"), (17, "APPEND_INSIDE_FUNCTION"), (18, "MAKE_LIST_RETURN"),
    (19, "COUNT_WITH_FOR"), (20, "COUNT_PREFIX"), (21, "DEFAULT_LIKE_SIMPLE"),
    (22, "PARAMETER_NAME_LOCAL"), (23, "RETURN_USED_IN_IF"), (24, "NO_ARGUMENT_ERROR_READING"),
    (25, "TOO_MANY_ARGUMENTS"), (26, "RETURN_STRING_NUMBER"), (27, "RETURN_INT_CONVERT"),
    (28, "FUNCTION_NAME_MEANING"), (29, "CALL_ORDER"), (30, "RETURN_LIST_LENGTH_AFTER_CALL"),
    (31, "FUNCTION_WITH_RANGE"), (32, "FUNCTION_CONTRACT_READING"),
]}


def main() -> None:
    payload = json.loads(PATH.read_text(encoding="utf-8"))
    by_id = {str(card.get("id")): card for card in payload if isinstance(card, dict)}
    actual = set(by_id)
    if actual != REVIEWED_IDS:
        missing = sorted(REVIEWED_IDS - actual)
        unexpected = sorted(actual - REVIEWED_IDS)
        raise SystemExit(f"V356_L3_FUNCTION_ID_MISMATCH missing={missing} unexpected={unexpected}")

    patched = 0
    for card_id, explanation in PATCHES.items():
        if by_id[card_id].get("explanation") != explanation:
            by_id[card_id]["explanation"] = explanation
            patched += 1

    PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"V356_L3_FUNCTION_REVIEWED={len(REVIEWED_IDS)}")
    print(f"V356_L3_FUNCTION_PATCH_TARGETS={len(PATCHES)}")
    print(f"V356_L3_FUNCTION_PATCHED={patched}")


if __name__ == "__main__":
    main()

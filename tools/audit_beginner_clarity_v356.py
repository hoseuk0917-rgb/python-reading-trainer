#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"

LEVEL1_REVIEWED_IDS = {
    *(f"PYF94_A1_L01_PRINT_{i:03d}" for i in range(1, 13)),
    *(f"PYF94_A1_L01_VAR_{i:03d}" for i in range(1, 13)),
    *(f"PYF94_A1_L01_TYPE_{i:03d}" for i in range(1, 13)),
    *(f"PYF94_A1_L01_INPUT_{i:03d}" for i in range(1, 13)),
    *(f"PYV96_A1_REVIEW_{i:03d}_{suffix}" for i, suffix in [
        (1, "VAR_REASSIGN"), (2, "PRINT_STRING_NUMBER"), (3, "TYPE_NAME"),
        (4, "INT_ADD"), (5, "STRING_PLUS"), (6, "BOOL_COMPARE"),
        (7, "IF_SIMPLE"), (8, "IF_FALSE_NO_ELSE"), (9, "LIST_INDEX_ZERO"),
        (10, "LIST_APPEND_LEN"), (11, "DICT_KEY_VALUE"), (12, "DICT_UPDATE"),
    ]),
    *(f"PYV96_A2_NOTE_{i:03d}_{suffix}" for i, suffix in [
        (1, "ASSIGNMENT_TRACE"), (2, "PRINT_NOT_STORE"), (3, "TYPE_STRING_INT"),
        (4, "BOOL_IF"), (5, "LIST_APPEND_INDEX"), (6, "DICT_ASSIGN_READ"),
        (7, "SPLIT_LIGHT"), (8, "IF_COMPARE"),
    ]),
    "PY10_L01_variable_001", "PY10_L01_reassign_001",
    "PY_L01_comment_001", "PY_L01_type_001", "PY_L01_cast_001", "L01_len_001",
}

LEVEL2_REVIEWED_IDS = {
    *(f"PYF94_A2_L02_IF_{i:03d}" for i in range(1, 17)),
    *(f"PYF94_A2_L02_LIST_{i:03d}" for i in range(1, 17)),
    *(f"PYF94_A2_L02_LOOP_{i:03d}" for i in range(1, 17)),
    *(f"PYF94_A2_L02_STR_{i:03d}" for i in range(1, 17)),
    *(f"PYV96_A1_REVIEW_{i:03d}_{suffix}" for i, suffix in [
        (13, "IF_ELSE"), (14, "ELIF_FLOW"), (15, "FOR_SUM"),
        (16, "FOR_COUNT_IF"), (17, "FOR_APPEND"), (18, "RANGE_LOOP"),
        (19, "NESTED_LIST_INDEX"), (20, "DICT_GET_DEFAULT"), (21, "STRING_SPLIT"),
        (22, "JOIN_LIST"), (23, "WHILE_BASIC_REVIEW"), (24, "BREAK_REVIEW"),
    ]),
    *(f"PYV96_A2_NOTE_{i:03d}_{suffix}" for i, suffix in [
        (9, "LOOP_ACCUMULATE"), (10, "WHILE_UPDATE"), (11, "FUNCTION_RETURN_USED"),
        (12, "FUNCTION_RETURN_STOPS"), (13, "DICT_GET_COUNT"), (14, "TRY_EXCEPT_BASIC"),
        (15, "FILE_WRITE_LIGHT"), (16, "MIXED_CHECKLIST"),
    ]),
    "PY_L02_truthy_001", "PY_L02_none_001", "PY_L02_fstring_001",
    "PY10_L02_boolean_compare_001", "PY10_L02_list_append_len_001", "PY10_L02_dict_key_001",
    "L02_var_flow_001", "PY11_L02_float_001",
}

REVIEWED_IDS = LEVEL1_REVIEWED_IDS | LEVEL2_REVIEWED_IDS

ABSTRACT_PATTERNS = {
    "warning_formula": re.compile(r"특히\s+.+조심"),
    "flow_goal": re.compile(r"흐름을\s*읽"),
    "points_to": re.compile(r"가리키"),
    "left_right": re.compile(r"(?:왼쪽|오른쪽)"),
    "simultaneous_math_warning": re.compile(r"수학(?:의)?\s*(?:등식|식)"),
}


def load_cards() -> tuple[list[dict], Counter]:
    cards: list[dict] = []
    file_counts: Counter = Counter()
    for path in sorted(LESSON_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        for card in payload:
            if isinstance(card, dict) and card.get("id"):
                row = dict(card)
                row["__file"] = path.name
                cards.append(row)
                file_counts[path.name] += 1
    return cards, file_counts


def text_of(card: dict, field: str) -> str:
    return str(card.get(field) or "").strip()


def print_coverage(name: str, actual: set[str], reviewed: set[str]) -> None:
    print(f"V356_{name}_ACTUAL={len(actual)}")
    print(f"V356_{name}_REVIEWED={len(reviewed)}")
    print(f"V356_{name}_UNREVIEWED={len(actual - reviewed)}")
    print(f"V356_{name}_WRONG_REVIEW_IDS={len(reviewed - actual)}")
    for card_id in sorted(actual - reviewed):
        print(f"V356_{name}_UNREVIEWED_ID={card_id}")
    for card_id in sorted(reviewed - actual):
        print(f"V356_{name}_WRONG_REVIEW_ID={card_id}")


def main() -> None:
    cards, file_counts = load_cards()
    ids = [str(card["id"]) for card in cards]
    duplicate_ids = sorted(card_id for card_id, count in Counter(ids).items() if count > 1)
    level_counts = Counter(str(card.get("level", "?")) for card in cards)
    actual_level1_ids = {str(card["id"]) for card in cards if str(card.get("level")) == "1"}
    actual_level2_ids = {str(card["id"]) for card in cards if str(card.get("level")) == "2"}

    print(f"V356_LESSON_FILES={len(file_counts)}")
    print(f"V356_TOTAL_CARDS={len(cards)}")
    print(f"V356_DUPLICATE_IDS={len(duplicate_ids)}")
    print("V356_LEVEL_COUNTS=" + ",".join(f"{k}:{v}" for k, v in sorted(level_counts.items())))
    print_coverage("LEVEL1", actual_level1_ids, LEVEL1_REVIEWED_IDS)
    print_coverage("LEVEL2", actual_level2_ids, LEVEL2_REVIEWED_IDS)

    reviewed = [card for card in cards if str(card["id"]) in REVIEWED_IDS]
    print(f"V356_REVIEWED_EXPECTED={len(REVIEWED_IDS)}")
    print(f"V356_REVIEWED_FOUND={len(reviewed)}")

    reviewed_failures: list[str] = []
    for card in reviewed:
        explanation = text_of(card, "explanation")
        goal = text_of(card, "reading_goal")
        if "특히" in explanation or "조심해야" in explanation:
            reviewed_failures.append(f"{card['id']}:warning_formula")
        if "흐름을 읽" in goal:
            reviewed_failures.append(f"{card['id']}:flow_goal")
        if len(explanation) < 45:
            reviewed_failures.append(f"{card['id']}:too_short")
        if card.get("question_type") == "output_prediction" and not re.search(r"(?:출력|보여|화면|정답|결과)", explanation):
            reviewed_failures.append(f"{card['id']}:no_result_language")

    print(f"V356_REVIEWED_FAILURES={len(reviewed_failures)}")
    for item in reviewed_failures[:120]:
        print(f"V356_REVIEWED_FAILURE={item}")

    queue: list[tuple[int, str, str, list[str]]] = []
    pattern_counts = Counter()
    for card in cards:
        fields = " ".join([text_of(card, "title"), text_of(card, "reading_goal"), text_of(card, "explanation")])
        reasons: list[str] = []
        for name, pattern in ABSTRACT_PATTERNS.items():
            if pattern.search(fields):
                reasons.append(name)
                pattern_counts[name] += 1
        explanation = text_of(card, "explanation")
        if len(explanation) > 340:
            reasons.append("long_explanation")
            pattern_counts["long_explanation"] += 1
        level = int(card.get("level") or 999) if str(card.get("level") or "").isdigit() else 999
        if reasons and str(card["id"]) not in REVIEWED_IDS:
            queue.append((level, card["__file"], str(card["id"]), reasons))

    queue.sort(key=lambda row: (row[0], row[1], row[2]))
    print("V356_PATTERN_COUNTS=" + ",".join(f"{k}:{v}" for k, v in sorted(pattern_counts.items())))
    print(f"V356_REVIEW_QUEUE_COUNT={len(queue)}")
    for level, filename, card_id, reasons in queue[:220]:
        print(f"V356_QUEUE=level:{level}|file:{filename}|id:{card_id}|reasons:{'+'.join(reasons)}")

    if duplicate_ids:
        raise SystemExit("RESULT=FAIL_DUPLICATE_CARD_IDS")
    if len(cards) != 1785:
        raise SystemExit(f"RESULT=FAIL_CARD_COUNT_EXPECTED_1785_ACTUAL_{len(cards)}")
    if len(actual_level1_ids) != 74 or actual_level1_ids != LEVEL1_REVIEWED_IDS:
        raise SystemExit("RESULT=FAIL_LEVEL1_REVIEW_COVERAGE")
    if len(actual_level2_ids) != 92 or actual_level2_ids != LEVEL2_REVIEWED_IDS:
        raise SystemExit("RESULT=FAIL_LEVEL2_REVIEW_COVERAGE")
    if len(REVIEWED_IDS) != 166 or len(reviewed) != 166:
        raise SystemExit("RESULT=FAIL_REVIEWED_166_COVERAGE")
    if reviewed_failures:
        raise SystemExit("RESULT=FAIL_REVIEWED_CLARITY")

    print("RESULT=PASS_V356_ALL_LEVEL1_LEVEL2_AND_FULL_INVENTORY")


if __name__ == "__main__":
    main()

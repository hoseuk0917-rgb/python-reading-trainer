#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"

REVIEWED_IDS = {
    *(f"PYF94_A1_L01_PRINT_{i:03d}" for i in range(1, 13)),
    *(f"PYF94_A1_L01_VAR_{i:03d}" for i in range(1, 13)),
    *(f"PYF94_A1_L01_TYPE_{i:03d}" for i in range(1, 13)),
    *(f"PYF94_A1_L01_INPUT_{i:03d}" for i in range(1, 13)),
}

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


def main() -> None:
    cards, file_counts = load_cards()
    ids = [str(card["id"]) for card in cards]
    duplicate_ids = sorted(card_id for card_id, count in Counter(ids).items() if count > 1)
    level_counts = Counter(str(card.get("level", "?")) for card in cards)

    print(f"V356_LESSON_FILES={len(file_counts)}")
    print(f"V356_TOTAL_CARDS={len(cards)}")
    print(f"V356_DUPLICATE_IDS={len(duplicate_ids)}")
    print("V356_LEVEL_COUNTS=" + ",".join(f"{k}:{v}" for k, v in sorted(level_counts.items())))

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
    for item in reviewed_failures[:80]:
        print(f"V356_REVIEWED_FAILURE={item}")

    queue: list[tuple[int, str, str, list[str]]] = []
    pattern_counts = Counter()
    for card in cards:
        fields = " ".join(
            [text_of(card, "title"), text_of(card, "reading_goal"), text_of(card, "explanation")]
        )
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
    for level, filename, card_id, reasons in queue[:160]:
        print(f"V356_QUEUE=level:{level}|file:{filename}|id:{card_id}|reasons:{'+'.join(reasons)}")

    if duplicate_ids:
        raise SystemExit("RESULT=FAIL_DUPLICATE_CARD_IDS")
    if len(cards) != 1785:
        raise SystemExit(f"RESULT=FAIL_CARD_COUNT_EXPECTED_1785_ACTUAL_{len(cards)}")
    if len(reviewed) != len(REVIEWED_IDS):
        raise SystemExit("RESULT=FAIL_REVIEWED_ID_COVERAGE")
    if reviewed_failures:
        raise SystemExit("RESULT=FAIL_REVIEWED_CLARITY")

    print("RESULT=PASS_V356_REVIEWED_BATCHES_AND_FULL_INVENTORY")


if __name__ == "__main__":
    main()

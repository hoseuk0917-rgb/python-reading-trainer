#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
MANIFEST = ROOT / "docs/audit/v356_full_exact_manifest.json"
REVIEW = ROOT / "docs/audit/v356_full_review.json"
LEDGER = ROOT / "docs/audit/v356_line_by_line_progress.md"
EXPECTED_COUNTS = {1: 74, 2: 92, 3: 206, 4: 97, 5: 110, 6: 162, 7: 176, 8: 306, 9: 288, 10: 274}
RESULT_WORDS = re.compile(r"출력|화면|보여|결과|정답|print")
CAUTION = re.compile(r"특히\s+.{0,160}?조심해야")
GENERIC_GOAL = re.compile(r"^(?:코드의\s*)?(?:흐름|구조|의미|동작)을?\s*(?:읽|이해|확인)[^.]*[.]?$")


def compact(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def load_rows():
    rows = []
    for path in sorted(LESSON_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        for card in payload:
            if isinstance(card, dict) and card.get("id") and str(card.get("level", "")).isdigit():
                rows.append((path.name, card, int(card["level"])))
    return rows


def emit(title, detail):
    safe = str(detail).replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")
    print(f"::error title={title}::{safe}")


def main():
    rows = load_rows()
    counts = Counter(level for _, _, level in rows)
    failures = []
    if len(rows) != 1785:
        failures.append(f"TOTAL expected=1785 actual={len(rows)}")
    for level, expected in EXPECTED_COUNTS.items():
        if counts[level] != expected:
            failures.append(f"LEVEL_{level}_COUNT expected={expected} actual={counts[level]}")

    ids = [str(card["id"]) for _, card, _ in rows]
    if len(ids) != len(set(ids)):
        failures.append("DUPLICATE_IDS")

    entries = [
        {"level": level, "file": filename, "id": str(card["id"])}
        for filename, card, level in sorted(rows, key=lambda x: (x[2], x[0], str(x[1]["id"])))
    ]
    if not MANIFEST.exists():
        failures.append("MANIFEST_MISSING")
    else:
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        if manifest.get("count") != 1785 or manifest.get("cards") != entries:
            failures.append("EXACT_MANIFEST_MISMATCH")

    if not REVIEW.exists():
        failures.append("REVIEW_REPORT_MISSING")
        review_cards = []
    else:
        review = json.loads(REVIEW.read_text(encoding="utf-8"))
        review_cards = review.get("cards", [])
        review_keys = [(x.get("level"), x.get("file"), x.get("id")) for x in review_cards]
        expected_keys = [(x["level"], x["file"], x["id"]) for x in entries]
        if review.get("count") != 1785 or review.get("reviewed") != 1785 or review_keys != expected_keys:
            failures.append("REVIEW_EXACT_SET_MISMATCH")
        if any(not x.get("reviewed") for x in review_cards):
            failures.append("UNREVIEWED_CARD_PRESENT")

    missing = []
    caution = []
    generic_goal = []
    output_without_result = []
    too_abstract = []
    for filename, card, level in rows:
        card_id = str(card["id"])
        for field in ("title", "reading_goal", "code", "question", "answer", "explanation", "project_context"):
            if not compact(card.get(field)):
                missing.append(f"L{level}|{filename}|{card_id}|{field}")
        explanation = compact(card.get("explanation"))
        goal = compact(card.get("reading_goal"))
        if CAUTION.search(explanation):
            caution.append(f"L{level}|{filename}|{card_id}")
        if level >= 4 and (len(goal) < 24 or GENERIC_GOAL.match(goal)):
            generic_goal.append(f"L{level}|{filename}|{card_id}")
        if level >= 4 and card.get("question_type") == "output_prediction" and not RESULT_WORDS.search(explanation):
            output_without_result.append(f"L{level}|{filename}|{card_id}")
        if level >= 4 and len(explanation) < 45:
            too_abstract.append(f"L{level}|{filename}|{card_id}|len={len(explanation)}")

    if missing:
        failures.append("MISSING_FIELDS=" + ",".join(missing[:50]))
    if caution:
        failures.append("GENERIC_CAUTION=" + ",".join(caution[:50]))
    if generic_goal:
        failures.append("GENERIC_GOAL=" + ",".join(generic_goal[:50]))
    if output_without_result:
        failures.append("OUTPUT_WITHOUT_RESULT=" + ",".join(output_without_result[:50]))
    if too_abstract:
        failures.append("TOO_ABSTRACT=" + ",".join(too_abstract[:50]))

    ledger = LEDGER.read_text(encoding="utf-8") if LEDGER.exists() else ""
    if "| **Total** | **1785** | **1785** | **complete** |" not in ledger:
        failures.append("LEDGER_NOT_1785_COMPLETE")

    print("V356_FULL_COUNTS=" + ",".join(f"{k}:{counts[k]}" for k in sorted(counts)))
    print(f"V356_FULL_TOTAL={len(rows)}")
    print(f"V356_FULL_REVIEW_ROWS={len(review_cards)}")
    print(f"V356_FULL_MISSING_FIELDS={len(missing)}")
    print(f"V356_FULL_GENERIC_CAUTION={len(caution)}")
    print(f"V356_FULL_GENERIC_GOAL={len(generic_goal)}")
    print(f"V356_FULL_OUTPUT_WITHOUT_RESULT={len(output_without_result)}")
    print(f"V356_FULL_TOO_ABSTRACT={len(too_abstract)}")

    if failures:
        for i, failure in enumerate(failures, 1):
            emit(f"V356 full audit {i}", failure)
            print("FAIL=" + failure)
        raise SystemExit("RESULT=FAIL_V356_FULL_AUDIT")
    print("RESULT=PASS_V356_FULL_1785_AUDIT")


if __name__ == "__main__":
    main()

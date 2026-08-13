#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
MANIFEST = ROOT / "docs/audit/v356_level3_exact_manifest.json"
EXPECTED = 206
MIN_EXPLANATION = 70
MIN_GOAL = 30
FLOW_MARKERS = ("먼저", "그다음", "마지막", "실행", "반복", "조건", "호출", "return", "저장", "출력", "결과", "읽을 때", "확인")
# Static/concept questions can be clear without narrating runtime steps.
# Keep the flow-marker heuristic for execution-oriented question types.
FLOW_EXEMPT_QUESTION_TYPES = {"concept", "concept_reading", "multiple_choice"}


def load_rows():
    rows = []
    for path in sorted(LESSON_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        for card in payload:
            if isinstance(card, dict) and card.get("id") and int(card.get("level", -1)) == 3:
                rows.append((path.name, card))
    return rows


def emit_error(title, detail):
    safe = str(detail).replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")
    print(f"::error title={title}::{safe}")


def main():
    rows = load_rows()
    entries = [
        {"file": filename, "id": str(card["id"])}
        for filename, card in sorted(rows, key=lambda item: (item[0], str(item[1]["id"])))
    ]
    failures = []
    if len(rows) != EXPECTED:
        failures.append(f"LEVEL3_COUNT expected={EXPECTED} actual={len(rows)}")

    ids = [str(card["id"]) for _, card in rows]
    dupes = sorted(card_id for card_id, count in Counter(ids).items() if count > 1)
    if dupes:
        failures.append("DUPLICATE_IDS=" + ",".join(dupes))

    if not MANIFEST.exists():
        failures.append("MANIFEST_MISSING")
    else:
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        if manifest.get("count") != EXPECTED or manifest.get("cards") != entries:
            failures.append("EXACT_MANIFEST_MISMATCH")

    short_explanations = []
    short_goals = []
    flow_weak = []
    missing_fields = []
    generic_formula = []
    for filename, card in rows:
        card_id = str(card.get("id", ""))
        question_type = str(card.get("question_type", "")).strip()
        explanation = re.sub(r"\s+", " ", str(card.get("explanation", "")).strip())
        goal = re.sub(r"\s+", " ", str(card.get("reading_goal", "")).strip())
        for field in ("title", "code", "question", "answer", "project_context"):
            if not str(card.get(field, "")).strip():
                missing_fields.append(f"{filename}|{card_id}|{field}")
        if len(explanation) < MIN_EXPLANATION:
            short_explanations.append(f"{filename}|{card_id}|{len(explanation)}")
        if len(goal) < MIN_GOAL:
            short_goals.append(f"{filename}|{card_id}|{len(goal)}")
        if question_type not in FLOW_EXEMPT_QUESTION_TYPES and not any(marker in explanation for marker in FLOW_MARKERS):
            flow_weak.append(f"{filename}|{card_id}")
        if re.search(r"특히 .{0,80}조심해야", explanation):
            generic_formula.append(f"{filename}|{card_id}")

    if short_explanations:
        failures.append("SHORT_EXPLANATIONS=" + ",".join(short_explanations[:40]))
    if short_goals:
        failures.append("SHORT_READING_GOALS=" + ",".join(short_goals[:40]))
    if flow_weak:
        failures.append("FLOW_WEAK_EXPLANATIONS=" + ",".join(flow_weak[:40]))
    if missing_fields:
        failures.append("MISSING_FIELDS=" + ",".join(missing_fields[:40]))
    if generic_formula:
        failures.append("GENERIC_CAUTION_FORMULA=" + ",".join(generic_formula[:40]))

    print(f"V356_L3_COUNT={len(rows)}")
    print(f"V356_L3_UNIQUE_IDS={len(set(ids))}")
    print(f"V356_L3_SHORT_EXPLANATIONS={len(short_explanations)}")
    print(f"V356_L3_SHORT_READING_GOALS={len(short_goals)}")
    print(f"V356_L3_FLOW_WEAK={len(flow_weak)}")
    print(f"V356_L3_GENERIC_FORMULA={len(generic_formula)}")
    if failures:
        for idx, failure in enumerate(failures, 1):
            emit_error(f"V356 Level3 audit {idx}", failure)
            print("FAIL=" + failure)
        print("RESULT=FAIL_V356_LEVEL3_AUDIT")
        raise SystemExit(1)
    print("RESULT=PASS_V356_LEVEL3_AUDIT")


if __name__ == "__main__":
    main()

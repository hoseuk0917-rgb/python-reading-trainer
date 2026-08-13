#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
OUT = ROOT / "docs/audit/v356_review_ledger.tsv"


def flat(value):
    if value is None:
        return ""
    if isinstance(value, (list, dict)):
        value = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    text = str(value)
    return text.replace("\r", "").replace("\n", "\\n").replace("\t", "\\t")


rows = []
for path in sorted(LESSON_DIR.glob("*.json")):
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        continue
    for card in payload:
        if not isinstance(card, dict) or not card.get("id"):
            continue
        raw_level = str(card.get("level", ""))
        if not raw_level.isdigit():
            continue
        level = int(raw_level)
        if not 3 <= level <= 10:
            continue
        rows.append([
            level,
            path.name,
            flat(card.get("id")),
            flat(card.get("title")),
            flat(card.get("reading_goal")),
            flat(card.get("code")),
            flat(card.get("question")),
            flat(card.get("answer")),
            flat(card.get("explanation")),
            flat(card.get("project_context")),
            flat(card.get("question_type")),
            flat(card.get("concepts")),
        ])

rows.sort(key=lambda row: (int(row[0]), row[1], row[2]))
OUT.parent.mkdir(parents=True, exist_ok=True)
with OUT.open("w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f, delimiter="\t", lineterminator="\n")
    writer.writerow(["level","file","id","title","reading_goal","code","question","answer","explanation","project_context","question_type","concepts"])
    writer.writerows(rows)

counts = {level: 0 for level in range(3, 11)}
for row in rows:
    counts[int(row[0])] += 1
print("V356_REVIEW_LEDGER_COUNTS=" + ",".join(f"{k}:{v}" for k, v in counts.items()))
print(f"V356_REVIEW_LEDGER_ROWS={len(rows)}")
print(f"V356_REVIEW_LEDGER_PATH={OUT.relative_to(ROOT)}")

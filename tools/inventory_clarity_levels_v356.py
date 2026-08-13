#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"

rows = []
for path in sorted(LESSON_DIR.glob("*.json")):
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        continue
    for card in payload:
        if isinstance(card, dict) and card.get("id") and str(card.get("level", "")).isdigit():
            rows.append((int(card["level"]), path.name, str(card["id"])))

counts = Counter(level for level, _, _ in rows)
print("V356_LEVEL_INVENTORY_COUNTS=" + ",".join(f"{k}:{counts[k]}" for k in sorted(counts)))
for level in range(1, 11):
    level_rows = [(filename, card_id) for lv, filename, card_id in rows if lv == level]
    print(f"=== V356_LEVEL_{level}_IDS count={len(level_rows)} ===")
    for filename, card_id in level_rows:
        print(f"V356_LEVEL_ID={level}|{filename}|{card_id}")

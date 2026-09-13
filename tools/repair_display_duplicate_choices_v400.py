# -*- coding: utf-8 -*-
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPAIRS = [
    {
        "path": "data/lessons/cards_seed_v1.json",
        "id": "L05_function_chain_001",
        "old_choices": ["  LiDAR  ", "LiDAR", "lidar", "LIDAR"],
        "old": "  LiDAR  ",
        "new": '원본 문자열(양끝 공백 포함): "  LiDAR  "',
        "answer": "lidar",
    },
    {
        "path": "data/lessons/python_foundation_expansion_v10.json",
        "id": "PY10_L04_function_chain_001",
        "old_choices": ["lidar", "LiDAR", " LiDAR ", "LIDAR"],
        "old": " LiDAR ",
        "new": '원본 문자열(양끝 공백 포함): " LiDAR "',
        "answer": "lidar",
    },
    {
        "path": "data/lessons/python_foundation_expansion_v10.json",
        "id": "PY10_L08_pipeline_steps_001",
        "old_choices": [" LiDAR ", "LiDAR", "lidar", "None"],
        "old": " LiDAR ",
        "new": '원본 문자열(양끝 공백 포함): " LiDAR "',
        "answer": "lidar",
    },
    {
        "path": "data/lessons/python_rag_kg_pipeline_review_v16.json",
        "id": "PY16_L09_dedup_hash_001",
        "old_choices": ["uam safety rule", "UAM   Safety  RULE", "uamsafetyrule", "UAM Safety RULE"],
        "old": "UAM   Safety  RULE",
        "new": '원본 문자열(여러 공백 유지): "UAM   Safety  RULE"',
        "answer": "uam safety rule",
    },
    {
        "path": "data/lessons/python_search_embedding_rag_flow_v43.json",
        "id": "PY43_L06_query_normalization_001",
        "old_choices": ["python search", "Python Search", "  Python Search  ", "PYTHON SEARCH"],
        "old": "  Python Search  ",
        "new": '원본 문자열(양끝 공백 포함): "  Python Search  "',
        "answer": "python search",
    },
    {
        "path": "data_i18n/en/lessons/cards_seed_v1.json",
        "id": "L05_function_chain_001",
        "old_choices": ["  LiDAR  ", "LiDAR", "lidar", "LIDAR"],
        "old": "  LiDAR  ",
        "new": 'Original string (with surrounding spaces): "  LiDAR  "',
        "answer": "lidar",
    },
    {
        "path": "data_i18n/en/lessons/python_foundation_expansion_v10.json",
        "id": "PY10_L04_function_chain_001",
        "old_choices": ["lidar", "LiDAR", " LiDAR ", "LIDAR"],
        "old": " LiDAR ",
        "new": 'Original string (with surrounding spaces): " LiDAR "',
        "answer": "lidar",
    },
    {
        "path": "data_i18n/en/lessons/python_foundation_expansion_v10.json",
        "id": "PY10_L08_pipeline_steps_001",
        "old_choices": [" LiDAR ", "LiDAR", "lidar", "None"],
        "old": " LiDAR ",
        "new": 'Original string (with surrounding spaces): " LiDAR "',
        "answer": "lidar",
    },
    {
        "path": "data_i18n/en/lessons/python_rag_kg_pipeline_review_v16.json",
        "id": "PY16_L09_dedup_hash_001",
        "old_choices": ["uam safety rule", "UAM   Safety  RULE", "uamsafetyrule", "UAM Safety RULE"],
        "old": "UAM   Safety  RULE",
        "new": 'Original string (multiple spaces preserved): "UAM   Safety  RULE"',
        "answer": "uam safety rule",
    },
    {
        "path": "data_i18n/en/lessons/python_search_embedding_rag_flow_v43.json",
        "id": "PY43_L06_query_normalization_001",
        "old_choices": ["python search", "Python Search", "  Python Search  ", "PYTHON SEARCH"],
        "old": "  Python Search  ",
        "new": 'Original string (with surrounding spaces): "  Python Search  "',
        "answer": "python search",
    },
]


def read_payload(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def find_card(payload, card_id: str):
    rows = [row for row in payload if isinstance(row, dict) and row.get("id") == card_id]
    if len(rows) != 1:
        raise RuntimeError(f"CARD_MATCH_COUNT|id={card_id}|count={len(rows)}")
    return rows[0]


def card_span(text: str, card_id: str):
    candidates = [f'"id": "{card_id}"', f'"id":  "{card_id}"']
    starts = [text.find(marker) for marker in candidates if text.find(marker) >= 0]
    if len(starts) != 1:
        raise RuntimeError(f"TEXT_CARD_MATCH_COUNT|id={card_id}|count={len(starts)}")
    start = starts[0]
    next_candidates = [pos for marker in ('\n  {\n    "id":', '\n    {\n        "id":') if (pos := text.find(marker, start + 1)) >= 0]
    end = min(next_candidates) if next_candidates else len(text)
    return start, end


def patch_one(spec):
    path = ROOT / spec["path"]
    payload = read_payload(path)
    card = find_card(payload, spec["id"])
    if card.get("choices") != spec["old_choices"]:
        raise RuntimeError(f"PREIMAGE_CHOICES_MISMATCH|path={spec['path']}|id={spec['id']}|actual={card.get('choices')!r}")
    if card.get("answer") != spec["answer"]:
        raise RuntimeError(f"PREIMAGE_ANSWER_MISMATCH|path={spec['path']}|id={spec['id']}|actual={card.get('answer')!r}")

    text = path.read_text(encoding="utf-8-sig")
    start, end = card_span(text, spec["id"])
    block = text[start:end]
    old_token = json.dumps(spec["old"], ensure_ascii=False)
    new_token = json.dumps(spec["new"], ensure_ascii=False)
    count = block.count(old_token)
    if count != 1:
        raise RuntimeError(f"OLD_CHOICE_TOKEN_COUNT|path={spec['path']}|id={spec['id']}|count={count}|token={old_token}")
    block = block.replace(old_token, new_token, 1)
    path.write_text(text[:start] + block + text[end:], encoding="utf-8")

    after = find_card(read_payload(path), spec["id"])
    expected = [spec["new"] if choice == spec["old"] else choice for choice in spec["old_choices"]]
    if after.get("choices") != expected:
        raise RuntimeError(f"POSTIMAGE_CHOICES_MISMATCH|path={spec['path']}|id={spec['id']}|actual={after.get('choices')!r}")
    if after.get("answer") != spec["answer"]:
        raise RuntimeError(f"POSTIMAGE_ANSWER_MUTATED|path={spec['path']}|id={spec['id']}")
    print(f"REPAIRED|path={spec['path']}|id={spec['id']}|old={spec['old']!r}|new={spec['new']!r}")


def main():
    for spec in REPAIRS:
        patch_one(spec)
    print(f"REPAIR_COUNT={len(REPAIRS)}")
    print("SOURCE_CARD_COUNT=5")
    print("LANGUAGES=ko,en")
    print("RESULT=PASS_DISPLAY_DUPLICATE_CHOICE_REPAIR")


if __name__ == "__main__":
    main()

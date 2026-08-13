#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

from audit_beginner_clarity_v356 import LEVEL1_REVIEWED_IDS, LEVEL2_REVIEWED_IDS

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
L3_MANIFEST = ROOT / "docs/audit/v356_level3_manual_review.json"
L4_MANIFEST = ROOT / "docs/audit/v356_level4_manual_manifest.json"
L5_10_MANIFEST = ROOT / "docs/audit/v356_levels5_10_manual_review.json"
FULL_MANIFEST = ROOT / "docs/audit/v356_full_manual_review.json"
EXPECTED_TOTAL = 1785
EXPECTED_LEVEL_COUNTS = {1: 74, 2: 92, 3: 206, 4: 97, 5: 110, 6: 162, 7: 176, 8: 306, 9: 288, 10: 274}
L4_REWRITE_ISSUES = {'PY121_L04_RESPONSE_TEXT_DEBUG_001': ['QUESTION_EXPLANATION_TYPE_MISMATCH', 'AUTO_TEMPLATE_ARTIFACT'],
 'PY122_L04_HEAD_PREVIEW_001': ['QUESTION_EXPLANATION_TYPE_MISMATCH', 'AUTO_TEMPLATE_ARTIFACT'],
 'PY124_L04_MATCH_NONE_CHECK_001': ['QUESTION_EXPLANATION_TYPE_MISMATCH', 'AUTO_TEMPLATE_ARTIFACT'],
 'PYF95_A5_OOP_023_METHOD_CALLS_METHOD': ['CALL_CHAIN_MISSING', 'EXECUTION_FLOW_MISSING'],
 'PYF95_A5_OOP_024_ATTRIBUTE_USED_IN_IF': ['OBJECT_FLOW_MISSING', 'CONDITION_FLOW_MISSING'],
 'PYF95_A5_OOP_025_ATTRIBUTE_DEFAULT_FALSE': ['OBJECT_FLOW_MISSING', 'EXECUTION_FLOW_MISSING'],
 'PYF95_A5_OOP_027_ATTRIBUTE_DICT': ['DATA_ACCESS_FLOW_MISSING', 'OBJECT_FLOW_MISSING']}


def load_runtime():
    rows = []
    for path in sorted(LESSON_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        for card in payload:
            if not isinstance(card, dict) or not card.get("id"):
                continue
            try:
                level = int(card.get("level"))
            except (TypeError, ValueError):
                continue
            rows.append((level, path.name, str(card["id"])))
    return rows


def normalized_review(level, filename, card_id, decision, issues, fields, review_version):
    return {
        "level": int(level),
        "file": filename,
        "id": card_id,
        "decision": decision,
        "issues": list(issues),
        "fields": list(fields),
        "reviewed": True,
        "rewritten": decision == "REWRITE",
        "review_version": review_version,
    }


def main() -> None:
    rows = load_runtime()
    if len(rows) != EXPECTED_TOTAL:
        raise SystemExit(f"V356_FULL_RUNTIME_COUNT_MISMATCH expected={EXPECTED_TOTAL} actual={len(rows)}")

    level_counts = Counter(level for level, _filename, _card_id in rows)
    if dict(sorted(level_counts.items())) != EXPECTED_LEVEL_COUNTS:
        raise SystemExit(
            f"V356_FULL_LEVEL_COUNTS_MISMATCH expected={EXPECTED_LEVEL_COUNTS} actual={dict(sorted(level_counts.items()))}"
        )

    runtime_ids = [card_id for _level, _filename, card_id in rows]
    duplicate_runtime = sorted(card_id for card_id, count in Counter(runtime_ids).items() if count > 1)
    if duplicate_runtime:
        raise SystemExit("V356_FULL_RUNTIME_DUPLICATES=" + ",".join(duplicate_runtime))
    runtime_by_id = {card_id: (level, filename) for level, filename, card_id in rows}

    actual_l1 = {card_id for level, _filename, card_id in rows if level == 1}
    actual_l2 = {card_id for level, _filename, card_id in rows if level == 2}
    if actual_l1 != set(LEVEL1_REVIEWED_IDS):
        raise SystemExit("V356_FULL_LEVEL1_PRIOR_REVIEW_SET_MISMATCH=True")
    if actual_l2 != set(LEVEL2_REVIEWED_IDS):
        raise SystemExit("V356_FULL_LEVEL2_PRIOR_REVIEW_SET_MISMATCH=True")

    records = []
    for card_id in sorted(LEVEL1_REVIEWED_IDS):
        level, filename = runtime_by_id[card_id]
        records.append(normalized_review(level, filename, card_id, "KEEP", [], [], "v356-prior-human-review-final"))
    for card_id in sorted(LEVEL2_REVIEWED_IDS):
        level, filename = runtime_by_id[card_id]
        records.append(normalized_review(level, filename, card_id, "KEEP", [], [], "v356-prior-human-review-final"))

    if not L3_MANIFEST.exists():
        raise SystemExit("V356_FULL_L3_MANIFEST_MISSING=True")
    l3_payload = json.loads(L3_MANIFEST.read_text(encoding="utf-8"))
    l3_reviews = l3_payload.get("reviews", [])
    if l3_payload.get("reviewed_count") != 206 or len(l3_reviews) != 206:
        raise SystemExit("V356_FULL_L3_REVIEW_COUNT_MISMATCH=True")
    for review in l3_reviews:
        card_id = str(review["id"])
        level, filename = runtime_by_id.get(card_id, (None, None))
        if level != 3 or filename != str(review["file"]):
            raise SystemExit(f"V356_FULL_L3_SCOPE_MISMATCH id={card_id}")
        records.append(
            normalized_review(
                3,
                filename,
                card_id,
                str(review["decision"]),
                review.get("issues", []),
                review.get("fields", []),
                str(l3_payload.get("version", "v356-human-line-by-line-r1")),
            )
        )

    if not L4_MANIFEST.exists():
        raise SystemExit("V356_FULL_L4_MANIFEST_MISSING=True")
    l4_payload = json.loads(L4_MANIFEST.read_text(encoding="utf-8"))
    l4_patch_cards = {str(item["id"]): item for item in l4_payload.get("cards", [])}
    if l4_payload.get("reviewed_count") != 97 or set(l4_patch_cards) != set(L4_REWRITE_ISSUES):
        raise SystemExit("V356_FULL_L4_MANIFEST_MISMATCH=True")
    for level, filename, card_id in sorted((row for row in rows if row[0] == 4), key=lambda r: (r[1], r[2])):
        if card_id in L4_REWRITE_ISSUES:
            item = l4_patch_cards[card_id]
            if str(item["file"]) != filename:
                raise SystemExit(f"V356_FULL_L4_SCOPE_MISMATCH id={card_id}")
            records.append(
                normalized_review(
                    4, filename, card_id, "REWRITE", item.get("issues", []), ["explanation"], "v356-human-line-by-line-r1"
                )
            )
        else:
            records.append(normalized_review(4, filename, card_id, "KEEP", [], [], "v356-human-line-by-line-r1"))

    if not L5_10_MANIFEST.exists():
        raise SystemExit("V356_FULL_L5_10_MANIFEST_MISSING=True")
    l5_payload = json.loads(L5_10_MANIFEST.read_text(encoding="utf-8"))
    l5_reviews = l5_payload.get("reviews", [])
    if l5_payload.get("reviewed_count") != 1316 or len(l5_reviews) != 1316:
        raise SystemExit("V356_FULL_L5_10_REVIEW_COUNT_MISMATCH=True")
    for review in l5_reviews:
        card_id = str(review["id"])
        level, filename = runtime_by_id.get(card_id, (None, None))
        if level != int(review["level"]) or filename != str(review["file"]):
            raise SystemExit(f"V356_FULL_L5_10_SCOPE_MISMATCH id={card_id}")
        records.append(
            normalized_review(
                level,
                filename,
                card_id,
                str(review["decision"]),
                review.get("issues", []),
                review.get("fields", []),
                str(review.get("review_version", l5_payload.get("version", "v356-human-line-by-line-r1"))),
            )
        )

    review_ids = [record["id"] for record in records]
    duplicate_reviews = sorted(card_id for card_id, count in Counter(review_ids).items() if count > 1)
    runtime_set = set(runtime_ids)
    review_set = set(review_ids)
    missing = sorted(runtime_set - review_set)
    extra = sorted(review_set - runtime_set)

    if len(records) != EXPECTED_TOTAL:
        raise SystemExit(f"V356_FULL_REVIEW_COUNT_MISMATCH expected={EXPECTED_TOTAL} actual={len(records)}")
    if duplicate_reviews:
        raise SystemExit("V356_FULL_REVIEW_DUPLICATES=" + ",".join(duplicate_reviews))
    if missing:
        raise SystemExit("V356_FULL_REVIEW_MISSING=" + ",".join(missing))
    if extra:
        raise SystemExit("V356_FULL_REVIEW_EXTRA=" + ",".join(extra))

    records.sort(key=lambda record: (record["level"], record["file"], record["id"]))
    decision_counts = Counter(record["decision"] for record in records)
    per_level = {}
    for level in range(1, 11):
        subset = [record for record in records if record["level"] == level]
        per_level[str(level)] = {
            "reviewed": len(subset),
            "keep": sum(record["decision"] == "KEEP" for record in subset),
            "rewrite": sum(record["decision"] == "REWRITE" for record in subset),
        }

    payload = {
        "version": "v356-full-human-line-by-line-closure-r1",
        "runtime_card_count": EXPECTED_TOTAL,
        "review_record_count": len(records),
        "duplicate_runtime_ids": len(duplicate_runtime),
        "duplicate_review_ids": len(duplicate_reviews),
        "missing_review_ids": len(missing),
        "unknown_review_ids": len(extra),
        "exact_id_set_equal": runtime_set == review_set,
        "level_counts": {str(level): EXPECTED_LEVEL_COUNTS[level] for level in EXPECTED_LEVEL_COUNTS},
        "decision_counts": dict(sorted(decision_counts.items())),
        "per_level": per_level,
        "records": records,
    }
    FULL_MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    if FULL_MANIFEST.exists():
        current = json.loads(FULL_MANIFEST.read_text(encoding="utf-8"))
        if current != payload:
            raise SystemExit("V356_FULL_MANUAL_REVIEW_MANIFEST_CHANGED=True")
        created = False
    else:
        FULL_MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        created = True

    print(f"V356_FULL_RUNTIME_CARDS={EXPECTED_TOTAL}")
    print(f"V356_FULL_MANUAL_REVIEWED={len(records)}")
    print(f"V356_FULL_DUPLICATE_RUNTIME_IDS={len(duplicate_runtime)}")
    print(f"V356_FULL_DUPLICATE_REVIEW_IDS={len(duplicate_reviews)}")
    print(f"V356_FULL_MISSING_REVIEW_IDS={len(missing)}")
    print(f"V356_FULL_UNKNOWN_REVIEW_IDS={len(extra)}")
    print(f"V356_FULL_EXACT_ID_SET_EQUAL={runtime_set == review_set}")
    print(f"V356_FULL_MANIFEST_CREATED={created}")
    print("RESULT=PASS_V356_FULL_MANUAL_EXACT_SET")


if __name__ == "__main__":
    main()

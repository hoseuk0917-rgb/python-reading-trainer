#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "tools"
if str(TOOLS) not in sys.path:
    sys.path.insert(0, str(TOOLS))

import audit_explanation_readiness_r1 as readiness
import audit_source_bundle_mapping_r1 as source_map

EXPECTED_CARD_COUNT = 1785
EXPECTED_RESOLVED_COUNT = 93
EXPECTED_EXPLICIT_DOMAIN_SOURCE_COUNT = 25
EXPECTED_AUTO_DIRECT_OFFICIAL_IDS = {
    "PY12_L08_cv2_threshold_001",
    "PY12_L08_no_grad_001",
    "PY36_L07_task_001",
}
EXPECTED_CLAIM_SHA256 = "482342022af7a1a55ca3a806387684ffd77bb82d82373290ad4327b43d190ecc"


def clean(value: object) -> str:
    return " ".join(str(value or "").replace("\t", " ").replace("\n", " ").split())


def claim_record(card: dict) -> dict:
    cid = str(card["id"])
    concept = card.get("concept_explanation") if isinstance(card.get("concept_explanation"), dict) else {}
    answer_explanation = card.get("answer_explanation") if isinstance(card.get("answer_explanation"), dict) else {}
    explicit = [
        bundle
        for bundle in source_map.CARD_SOURCE_BUNDLES.get(cid, ())
        if bundle.startswith("DOMAIN_")
    ]
    if explicit:
        resolution = "EXPLICIT_DOMAIN_SOURCE"
    elif cid in EXPECTED_AUTO_DIRECT_OFFICIAL_IDS:
        resolution = "AUTO_DIRECT_OFFICIAL"
    else:
        resolution = "LOCAL_OR_PRIMARY_SUFFICIENT"

    return {
        "id": cid,
        "resolution": resolution,
        "code": str(card.get("code") or ""),
        "focus_span": str(card.get("focus_span") or ""),
        "question": clean(card.get("question")),
        "answer": clean(card.get("answer")),
        "concept_what": clean(concept.get("what_it_is")),
        "concept_key": clean(concept.get("key_point")),
        "answer_why": clean(answer_explanation.get("why_correct")),
        "answer_takeaway": clean(answer_explanation.get("takeaway")),
    }


def claim_digest(rows: list[dict]) -> str:
    payload = "\n".join(
        json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        for row in sorted(rows, key=lambda row: row["id"])
    )
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Verify frozen post-rewrite source-mapping resolution R1."
    )
    ap.add_argument("--limit", type=int, default=120)
    args = ap.parse_args()

    cards = readiness.load_cards()
    by_id = {str(card["id"]): card for card in cards}
    resolved_ids = set(source_map.SOURCE_MAPPING_RESOLVED_IDS)

    missing = sorted(resolved_ids - set(by_id))
    rows = [claim_record(by_id[cid]) for cid in sorted(resolved_ids)]
    digest = claim_digest(rows)
    resolution_counts = Counter(row["resolution"] for row in rows)

    explicit_ids = {
        cid
        for cid in resolved_ids
        if any(
            bundle.startswith("DOMAIN_")
            for bundle in source_map.CARD_SOURCE_BUNDLES.get(cid, ())
        )
    }

    missing_bundle_urls = []
    for cid in sorted(explicit_ids):
        for bundle in source_map.CARD_SOURCE_BUNDLES.get(cid, ()):
            if bundle.startswith("DOMAIN_") and bundle not in source_map.BUNDLE_URLS:
                missing_bundle_urls.append(f"{cid}:{bundle}")

    auto_direct_missing = []
    for cid in sorted(EXPECTED_AUTO_DIRECT_OFFICIAL_IDS):
        bundles = set(source_map.supplemental_bundles(by_id[cid]))
        if not any(
            bundle.startswith("PY_STDLIB_") or bundle.startswith("THIRD_PARTY_")
            for bundle in bundles
        ):
            auto_direct_missing.append(cid)

    disposition_counts = Counter()
    unresolved_live = []
    rewrite_live = []
    for card in cards:
        cid = str(card["id"])
        authority = readiness.authority_class(card)
        reasons = readiness.quality_reasons(card)
        disposition = readiness.disposition(reasons, authority, cid)
        disposition_counts[disposition] += 1
        if disposition == "SOURCE_MAPPING_REVIEW":
            unresolved_live.append(cid)
        if disposition in {
            "EXAMPLE_REWRITE",
            "WALKTHROUGH_OR_ANSWER_REWRITE",
            "CONCEPT_EXPLANATION_REWRITE",
        }:
            rewrite_live.append(cid)

    print("SOURCE_MAPPING_RESOLUTION_R1")
    print(f"CARD_COUNT={len(cards)}")
    print(f"RESOLVED_COUNT={len(resolved_ids)}")
    print(f"EXPLICIT_DOMAIN_SOURCE_COUNT={len(explicit_ids)}")
    print(f"AUTO_DIRECT_OFFICIAL_COUNT={len(EXPECTED_AUTO_DIRECT_OFFICIAL_IDS)}")
    print("RESOLUTION_COUNTS=" + json.dumps(dict(sorted(resolution_counts.items())), sort_keys=True))
    print("DISPOSITION_COUNTS=" + json.dumps(dict(sorted(disposition_counts.items())), sort_keys=True))
    print(f"LIVE_SOURCE_MAPPING_REVIEW_COUNT={len(unresolved_live)}")
    print(f"LIVE_REWRITE_COUNT={len(rewrite_live)}")
    print(f"CLAIM_SHA256={digest}")
    print("AUTO_DIRECT_OFFICIAL_IDS=" + ",".join(sorted(EXPECTED_AUTO_DIRECT_OFFICIAL_IDS)))

    for row in rows[:max(0, args.limit)]:
        cid = row["id"]
        explicit = [
            bundle
            for bundle in source_map.CARD_SOURCE_BUNDLES.get(cid, ())
            if bundle.startswith("DOMAIN_")
        ]
        print(
            "RESOLUTION\t"
            + row["resolution"] + "\t"
            + cid + "\t"
            + ("+".join(explicit) or "-") + "\t"
            + row["question"] + "\t"
            + row["answer"]
        )

    if len(cards) != EXPECTED_CARD_COUNT:
        raise SystemExit(f"SOURCE_MAPPING_RESOLUTION_R1=FAIL_CARD_COUNT_{len(cards)}")
    if len(resolved_ids) != EXPECTED_RESOLVED_COUNT:
        raise SystemExit(f"SOURCE_MAPPING_RESOLUTION_R1=FAIL_RESOLVED_COUNT_{len(resolved_ids)}")
    if missing:
        raise SystemExit("SOURCE_MAPPING_RESOLUTION_R1=FAIL_MISSING_IDS_" + ",".join(missing))
    if len(explicit_ids) != EXPECTED_EXPLICIT_DOMAIN_SOURCE_COUNT:
        raise SystemExit(
            f"SOURCE_MAPPING_RESOLUTION_R1=FAIL_EXPLICIT_SOURCE_COUNT_{len(explicit_ids)}"
        )
    if missing_bundle_urls:
        raise SystemExit(
            "SOURCE_MAPPING_RESOLUTION_R1=FAIL_BUNDLE_URLS_"
            + ",".join(missing_bundle_urls)
        )
    if auto_direct_missing:
        raise SystemExit(
            "SOURCE_MAPPING_RESOLUTION_R1=FAIL_AUTO_DIRECT_"
            + ",".join(auto_direct_missing)
        )
    if unresolved_live:
        raise SystemExit(
            "SOURCE_MAPPING_RESOLUTION_R1=FAIL_LIVE_SOURCE_REVIEW_"
            + ",".join(unresolved_live)
        )
    if rewrite_live:
        raise SystemExit(
            "SOURCE_MAPPING_RESOLUTION_R1=FAIL_LIVE_REWRITE_"
            + ",".join(rewrite_live)
        )
    if EXPECTED_CLAIM_SHA256 and digest != EXPECTED_CLAIM_SHA256:
        raise SystemExit(
            "SOURCE_MAPPING_RESOLUTION_R1=FAIL_CLAIM_SHA_"
            + digest
        )

    print("SOURCE_MAPPING_RESOLUTION_R1=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

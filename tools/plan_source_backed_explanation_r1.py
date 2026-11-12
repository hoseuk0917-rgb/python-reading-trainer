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

TARGET_DISPOSITIONS = {
    "CONCEPT_EXPLANATION_REWRITE",
    "WALKTHROUGH_OR_ANSWER_REWRITE",
}
SAFE_AUTHORITIES = {
    "PYTHON_LANGUAGE_AUTHORITY",
    "LOCAL_CODE_AUTHORITY",
}
SOURCE_READY_AUTHORITIES = {
    "STDLIB_API_AUTHORITY",
    "THIRD_PARTY_API_AUTHORITY",
}


def bundle_url(bundle: str) -> str | None:
    if bundle in source_map.BUNDLE_URLS:
        return source_map.BUNDLE_URLS[bundle]
    if bundle.startswith("PY_STDLIB_"):
        module = bundle.removeprefix("PY_STDLIB_").lower()
        return f"https://docs.python.org/3.10/library/{module}.html"
    if bundle.startswith("THIRD_PARTY_"):
        wanted = bundle.removeprefix("THIRD_PARTY_").lower()
        for package, url in source_map.THIRD_PARTY_URLS.items():
            if package.lower() == wanted:
                return url
    return None


def source_record(card: dict) -> dict:
    authority = readiness.authority_class(card)
    reasons = readiness.quality_reasons(card)
    disposition = readiness.disposition(reasons, authority)
    primary = str(card.get("primary_concept") or "")
    primary_bundle = source_map.PRIMARY_BUNDLES.get(primary)
    supplemental = source_map.supplemental_bundles(card)

    urls = []
    if primary_bundle:
        url = bundle_url(primary_bundle)
        if url:
            urls.append({"bundle": primary_bundle, "url": url})

    for bundle in supplemental:
        url = bundle_url(bundle)
        if url and all(item["url"] != url for item in urls):
            urls.append({"bundle": bundle, "url": url})

    source_ready = False
    source_reason = ""
    if authority == "STDLIB_API_AUTHORITY":
        source_ready = any(
            item["bundle"].startswith("PY_STDLIB_")
            for item in urls
        )
        source_reason = "STDLIB_OFFICIAL_DOC" if source_ready else "STDLIB_DOC_GAP"
    elif authority == "THIRD_PARTY_API_AUTHORITY":
        source_ready = any(
            item["bundle"].startswith("THIRD_PARTY_")
            for item in urls
        )
        source_reason = "THIRD_PARTY_OFFICIAL_DOC" if source_ready else "THIRD_PARTY_DOC_GAP"
    elif authority in SAFE_AUTHORITIES:
        source_reason = "SAFE_AUTHORITY_ALREADY_HANDLED"
    elif authority == "DOMAIN_AUTHORITY_REVIEW":
        source_reason = "DOMAIN_CONTEXT_SOURCE_REQUIRED"
    else:
        source_reason = "AUTHORITY_SOURCE_REQUIRED"

    return {
        "id": str(card["id"]),
        "level": int(card.get("level") or 999),
        "file": str(card.get("_file") or ""),
        "title": str(card.get("title") or ""),
        "primary_concept": primary,
        "authority": authority,
        "disposition": disposition,
        "quality_reasons": reasons,
        "primary_bundle": primary_bundle,
        "supplemental_bundles": supplemental,
        "source_urls": urls,
        "source_ready": source_ready,
        "source_reason": source_reason,
    }


def digest(rows: list[dict]) -> str:
    return hashlib.sha256(
        "\n".join(row["id"] for row in rows).encode("utf-8")
    ).hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser(description="Plan source-backed lesson explanation rewrites.")
    ap.add_argument("--limit", type=int, default=40)
    args = ap.parse_args()

    cards = readiness.load_cards()
    rows = [
        source_record(card)
        for card in cards
        if readiness.disposition(
            readiness.quality_reasons(card),
            readiness.authority_class(card),
        ) in TARGET_DISPOSITIONS
    ]
    rows.sort(
        key=lambda row: (
            row["authority"],
            row["disposition"],
            row["primary_concept"],
            row["level"],
            row["id"],
        )
    )

    source_ready = [row for row in rows if row["source_ready"]]
    source_required = [
        row for row in rows
        if not row["source_ready"] and row["authority"] not in SAFE_AUTHORITIES
    ]
    safe_remaining = [row for row in rows if row["authority"] in SAFE_AUTHORITIES]

    authority_counts = Counter(row["authority"] for row in rows)
    disposition_counts = Counter(row["disposition"] for row in rows)
    ready_authority_counts = Counter(row["authority"] for row in source_ready)
    required_reason_counts = Counter(row["source_reason"] for row in source_required)

    print("SOURCE_BACKED_EXPLANATION_PLAN_R1")
    print(f"REWRITE_REMAINING_COUNT={len(rows)}")
    print("REWRITE_AUTHORITY_COUNTS=" + json.dumps(dict(sorted(authority_counts.items())), sort_keys=True))
    print("REWRITE_DISPOSITION_COUNTS=" + json.dumps(dict(sorted(disposition_counts.items())), sort_keys=True))
    print(f"SAFE_REMAINING_COUNT={len(safe_remaining)}")
    print(f"SOURCE_READY_COUNT={len(source_ready)}")
    print("SOURCE_READY_AUTHORITY_COUNTS=" + json.dumps(dict(sorted(ready_authority_counts.items())), sort_keys=True))
    print(f"SOURCE_REQUIRED_COUNT={len(source_required)}")
    print("SOURCE_REQUIRED_REASON_COUNTS=" + json.dumps(dict(sorted(required_reason_counts.items())), sort_keys=True))
    print(f"SOURCE_READY_SELECTION_SHA256={digest(source_ready)}")
    print(f"SOURCE_REQUIRED_SELECTION_SHA256={digest(source_required)}")

    for row in source_ready[:max(0, args.limit)]:
        print(
            "SOURCE_READY\t"
            + row["id"] + "\t"
            + row["authority"] + "\t"
            + row["disposition"] + "\t"
            + (row["primary_bundle"] or "SOURCE_GAP") + "\t"
            + "+".join(item["bundle"] for item in row["source_urls"])
        )

    for row in source_required[:max(0, args.limit)]:
        print(
            "SOURCE_REQUIRED\t"
            + row["id"] + "\t"
            + row["authority"] + "\t"
            + row["disposition"] + "\t"
            + row["source_reason"] + "\t"
            + (row["primary_bundle"] or "SOURCE_GAP") + "\t"
            + "+".join(row["supplemental_bundles"])
        )

    if len(cards) != 1785:
        raise SystemExit(f"SOURCE_BACKED_EXPLANATION_PLAN_R1=FAIL_CARD_COUNT_{len(cards)}")
    if safe_remaining:
        raise SystemExit(
            "SOURCE_BACKED_EXPLANATION_PLAN_R1=FAIL_SAFE_REWRITE_REMAINS_"
            + str(len(safe_remaining))
        )
    if any(row["primary_bundle"] is None for row in rows):
        raise SystemExit("SOURCE_BACKED_EXPLANATION_PLAN_R1=FAIL_PRIMARY_SOURCE_GAP")

    print("SOURCE_BACKED_EXPLANATION_PLAN_R1=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

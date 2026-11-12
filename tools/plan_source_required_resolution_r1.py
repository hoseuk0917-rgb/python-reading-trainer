#!/usr/bin/env python3
from __future__ import annotations

import argparse
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
import plan_source_backed_explanation_r1 as source_plan

EXPECTED_CARD_COUNT = 1785
EXPECTED_SOURCE_REQUIRED_COUNT = 78
EXPECTED_SOURCE_REQUIRED_SHA256 = "615e839871f3e294340630d6871b57298f4c7bfa3b6b01d934c2e5bd51a37c46"


def resolution_record(card: dict) -> dict:
    record = source_plan.source_record(card)
    supplemental = list(record["supplemental_bundles"])
    supplemental_set = set(supplemental)

    official_candidates = [
        item
        for item in record["source_urls"]
        if item["bundle"] in supplemental_set
        and (
            item["bundle"].startswith("PY_STDLIB_")
            or item["bundle"].startswith("THIRD_PARTY_")
        )
    ]

    if official_candidates:
        resolution_class = "OFFICIAL_DOC_CANDIDATE"
    elif record["authority"] == "DOMAIN_AUTHORITY_REVIEW":
        resolution_class = "DOMAIN_EVIDENCE_REQUIRED"
    else:
        resolution_class = "AUTHORITY_IDENTIFICATION_REQUIRED"

    code = str(card.get("code") or "")
    focus = str(card.get("focus_span") or "")
    tree = source_map.parse_code(code)
    aliases = source_map.imports_with_aliases(tree)
    calls = source_map.call_nodes(focus)
    if not calls and tree is not None:
        import ast
        calls = [node for node in ast.walk(tree) if isinstance(node, ast.Call)]

    focus_leaves = sorted({
        source_map.call_leaf(node)
        for node in calls
        if source_map.call_leaf(node)
    })
    focus_roots = sorted({
        aliases.get(source_map.call_root(node), source_map.call_root(node))
        for node in calls
        if source_map.call_root(node)
    })

    return {
        **record,
        "coverage_domain": str(card.get("coverage_domain") or ""),
        "coverage_topics": [str(value) for value in (card.get("coverage_topics") or [])],
        "focus_span": focus,
        "focus_leaves": focus_leaves,
        "focus_roots": focus_roots,
        "resolution_class": resolution_class,
        "official_candidates": official_candidates,
    }


def collect_source_required() -> list[dict]:
    cards = readiness.load_cards()
    rows = [
        resolution_record(card)
        for card in cards
        if readiness.disposition(
            readiness.quality_reasons(card),
            readiness.authority_class(card),
        ) in source_plan.TARGET_DISPOSITIONS
    ]
    rows = [
        row
        for row in rows
        if not row["source_ready"]
        and row["authority"] not in source_plan.SAFE_AUTHORITIES
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
    return rows


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Stdout-only resolution inventory for source-required lesson explanation rewrites."
    )
    ap.add_argument("--limit", type=int, default=120)
    args = ap.parse_args()

    cards = readiness.load_cards()
    rows = collect_source_required()

    resolution_counts = Counter(row["resolution_class"] for row in rows)
    authority_counts = Counter(row["authority"] for row in rows)
    disposition_counts = Counter(row["disposition"] for row in rows)
    domain_counts = Counter(row["coverage_domain"] or "NO_DOMAIN" for row in rows)
    root_counts = Counter(
        root
        for row in rows
        for root in row["focus_roots"]
    )
    reason_counts = Counter(
        reason
        for row in rows
        for reason in row["quality_reasons"]
    )
    digest = source_plan.digest(rows)

    print("SOURCE_REQUIRED_RESOLUTION_R1")
    print(f"CARD_COUNT={len(cards)}")
    print(f"SOURCE_REQUIRED_COUNT={len(rows)}")
    print(f"SOURCE_REQUIRED_SELECTION_SHA256={digest}")
    print("RESOLUTION_COUNTS=" + json.dumps(dict(sorted(resolution_counts.items())), ensure_ascii=False, sort_keys=True))
    print("AUTHORITY_COUNTS=" + json.dumps(dict(sorted(authority_counts.items())), ensure_ascii=False, sort_keys=True))
    print("DISPOSITION_COUNTS=" + json.dumps(dict(sorted(disposition_counts.items())), ensure_ascii=False, sort_keys=True))
    print("DOMAIN_COUNTS=" + json.dumps(dict(sorted(domain_counts.items())), ensure_ascii=False, sort_keys=True))
    print("FOCUS_ROOT_COUNTS=" + json.dumps(dict(sorted(root_counts.items())), ensure_ascii=False, sort_keys=True))
    print("QUALITY_REASON_COUNTS=" + json.dumps(dict(sorted(reason_counts.items())), ensure_ascii=False, sort_keys=True))

    for row in rows[:max(0, args.limit)]:
        candidate_urls = "+".join(
            item["url"] for item in row["official_candidates"]
        ) or "-"
        print(
            "RESOLVE\t"
            + row["resolution_class"] + "\t"
            + row["id"] + "\t"
            + row["authority"] + "\t"
            + row["disposition"] + "\t"
            + (row["coverage_domain"] or "NO_DOMAIN") + "\t"
            + row["primary_concept"] + "\t"
            + ("+".join(row["focus_roots"]) or "-") + "\t"
            + ("+".join(row["focus_leaves"]) or "-") + "\t"
            + ("+".join(row["supplemental_bundles"]) or "-") + "\t"
            + candidate_urls + "\t"
            + row["file"] + "\t"
            + row["title"]
        )

    if len(cards) != EXPECTED_CARD_COUNT:
        raise SystemExit(
            f"SOURCE_REQUIRED_RESOLUTION_R1=FAIL_CARD_COUNT_{len(cards)}"
        )
    if len(rows) != EXPECTED_SOURCE_REQUIRED_COUNT:
        raise SystemExit(
            f"SOURCE_REQUIRED_RESOLUTION_R1=FAIL_REQUIRED_COUNT_{len(rows)}"
        )
    if digest != EXPECTED_SOURCE_REQUIRED_SHA256:
        raise SystemExit(
            "SOURCE_REQUIRED_RESOLUTION_R1=FAIL_SELECTION_SHA_"
            + digest
        )
    if any(row["source_ready"] for row in rows):
        raise SystemExit("SOURCE_REQUIRED_RESOLUTION_R1=FAIL_SOURCE_READY_ROW_PRESENT")

    print("SOURCE_REQUIRED_RESOLUTION_R1=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

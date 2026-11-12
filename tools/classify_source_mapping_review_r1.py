#!/usr/bin/env python3
from __future__ import annotations

import argparse
import ast
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
EXPECTED_REVIEW_COUNT_MAX = 548


def digest(rows: list[dict]) -> str:
    return hashlib.sha256(
        "\n".join(row["id"] for row in rows).encode("utf-8")
    ).hexdigest()


def focus_signals(card: dict) -> tuple[list[str], list[str], set[str]]:
    focus = str(card.get("focus_span") or "")
    code = str(card.get("code") or "")
    tree = source_map.parse_code(code)
    aliases = source_map.imports_with_aliases(tree)
    local_names = source_map.local_callable_names(tree)

    # Important: classify only the declared focus span here.
    # Falling back to every call in the card would let unrelated helper/print
    # calls make a domain-focused card look like a Python/local-code card.
    calls = source_map.call_nodes(focus)

    leaves = sorted({
        source_map.call_leaf(node)
        for node in calls
        if source_map.call_leaf(node)
    })
    roots = sorted({
        aliases.get(source_map.call_root(node), source_map.call_root(node))
        for node in calls
        if source_map.call_root(node)
    })
    return leaves, roots, local_names


def classify(
    card: dict,
    authority: str,
    supplemental: list[str],
    *,
    focus_leaves: list[str],
    local_names: set[str],
) -> str:
    bundles = set(supplemental)

    if authority == "STDLIB_API_AUTHORITY":
        if any(bundle.startswith("PY_STDLIB_") for bundle in bundles):
            return "STDLIB_MAPPING_PRESENT"
        return "STDLIB_MAPPING_GAP"

    if authority == "THIRD_PARTY_API_AUTHORITY":
        if any(bundle.startswith("THIRD_PARTY_") for bundle in bundles):
            return "THIRD_PARTY_MAPPING_PRESENT"
        return "THIRD_PARTY_MAPPING_GAP"

    if authority == "AUTHORITY_REVIEW":
        return "AUTHORITY_NORMALIZATION_REVIEW"

    if authority == "DOMAIN_AUTHORITY_REVIEW":
        leaves = set(focus_leaves)
        if leaves & local_names:
            return "DOMAIN_LOCAL_FOCUS_REVIEW"
        if leaves & (source_map.BUILTIN_CALLS | source_map.BUILTIN_TYPE_METHODS):
            return "DOMAIN_PYTHON_BUILTIN_FOCUS_REVIEW"
        return "DOMAIN_CONTEXT_REVIEW"

    raise RuntimeError(f"unexpected SOURCE_MAPPING_REVIEW authority: {authority}")


def collect_rows() -> list[dict]:
    rows = []
    for card in readiness.load_cards():
        authority = readiness.authority_class(card)
        reasons = readiness.quality_reasons(card)
        disposition = readiness.disposition(reasons, authority)
        if disposition != "SOURCE_MAPPING_REVIEW":
            continue

        primary = str(card.get("primary_concept") or "")
        primary_bundle = source_map.PRIMARY_BUNDLES.get(primary)
        supplemental = source_map.supplemental_bundles(card)
        leaves, roots, local_names = focus_signals(card)
        resolution = classify(
            card,
            authority,
            supplemental,
            focus_leaves=leaves,
            local_names=local_names,
        )

        rows.append({
            "id": str(card["id"]),
            "level": int(card.get("level") or 999),
            "file": str(card.get("_file") or ""),
            "title": str(card.get("title") or ""),
            "authority": authority,
            "primary_concept": primary,
            "primary_bundle": primary_bundle or "SOURCE_GAP",
            "supplemental_bundles": supplemental,
            "coverage_domain": str(card.get("coverage_domain") or ""),
            "focus_span": str(card.get("focus_span") or ""),
            "focus_leaves": leaves,
            "focus_roots": roots,
            "quality_reasons": reasons,
            "resolution_class": resolution,
        })

    rows.sort(
        key=lambda row: (
            row["resolution_class"],
            row["authority"],
            row["primary_concept"],
            row["level"],
            row["id"],
        )
    )
    return rows


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Stdout-only classifier for post-rewrite source-mapping review rows."
    )
    ap.add_argument("--limit", type=int, default=120)
    args = ap.parse_args()

    cards = readiness.load_cards()
    rows = collect_rows()

    resolution_counts = Counter(row["resolution_class"] for row in rows)
    authority_counts = Counter(row["authority"] for row in rows)
    primary_counts = Counter(row["primary_concept"] for row in rows)
    domain_counts = Counter(row["coverage_domain"] or "NO_DOMAIN" for row in rows)
    reason_counts = Counter(
        reason
        for row in rows
        for reason in row["quality_reasons"]
    )
    supplemental_counts = Counter(
        bundle
        for row in rows
        for bundle in row["supplemental_bundles"]
    )
    selection_sha = digest(rows)

    print("SOURCE_MAPPING_REVIEW_CLASSIFIER_R1")
    print(f"CARD_COUNT={len(cards)}")
    print(f"SOURCE_MAPPING_REVIEW_COUNT={len(rows)}")
    print(f"SOURCE_MAPPING_REVIEW_SHA256={selection_sha}")
    print("RESOLUTION_COUNTS=" + json.dumps(dict(sorted(resolution_counts.items())), ensure_ascii=False, sort_keys=True))
    print("AUTHORITY_COUNTS=" + json.dumps(dict(sorted(authority_counts.items())), ensure_ascii=False, sort_keys=True))
    print("PRIMARY_COUNTS=" + json.dumps(dict(sorted(primary_counts.items())), ensure_ascii=False, sort_keys=True))
    print("DOMAIN_COUNTS=" + json.dumps(dict(sorted(domain_counts.items())), ensure_ascii=False, sort_keys=True))
    print("QUALITY_REASON_COUNTS=" + json.dumps(dict(sorted(reason_counts.items())), ensure_ascii=False, sort_keys=True))
    print("SUPPLEMENTAL_COUNTS=" + json.dumps(dict(sorted(supplemental_counts.items())), ensure_ascii=False, sort_keys=True))

    for row in rows[:max(0, args.limit)]:
        print(
            "MAP_REVIEW\t"
            + row["resolution_class"] + "\t"
            + row["id"] + "\t"
            + row["authority"] + "\t"
            + row["primary_concept"] + "\t"
            + row["primary_bundle"] + "\t"
            + (row["coverage_domain"] or "NO_DOMAIN") + "\t"
            + ("+".join(row["focus_roots"]) or "-") + "\t"
            + ("+".join(row["focus_leaves"]) or "-") + "\t"
            + ("+".join(row["supplemental_bundles"]) or "-") + "\t"
            + ("+".join(row["quality_reasons"]) or "-") + "\t"
            + row["file"] + "\t"
            + row["title"]
        )

    if len(cards) != EXPECTED_CARD_COUNT:
        raise SystemExit(
            f"SOURCE_MAPPING_REVIEW_CLASSIFIER_R1=FAIL_CARD_COUNT_{len(cards)}"
        )
    if len(rows) > EXPECTED_REVIEW_COUNT_MAX:
        raise SystemExit(
            f"SOURCE_MAPPING_REVIEW_CLASSIFIER_R1=FAIL_REVIEW_COUNT_GROWTH_{len(rows)}"
        )
    if any(row["primary_bundle"] == "SOURCE_GAP" for row in rows):
        raise SystemExit("SOURCE_MAPPING_REVIEW_CLASSIFIER_R1=FAIL_PRIMARY_SOURCE_GAP")
    if resolution_counts.get("STDLIB_MAPPING_GAP", 0):
        raise SystemExit("SOURCE_MAPPING_REVIEW_CLASSIFIER_R1=FAIL_STDLIB_MAPPING_GAP")
    if resolution_counts.get("THIRD_PARTY_MAPPING_GAP", 0):
        raise SystemExit("SOURCE_MAPPING_REVIEW_CLASSIFIER_R1=FAIL_THIRD_PARTY_MAPPING_GAP")

    print("SOURCE_MAPPING_REVIEW_CLASSIFIER_R1=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

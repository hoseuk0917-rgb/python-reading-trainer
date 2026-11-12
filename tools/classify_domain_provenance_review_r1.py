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
import classify_source_mapping_review_r1 as mapping_review

EXPECTED_CARD_COUNT = 1785
EXPECTED_DOMAIN_REVIEW_COUNT = 93
EXPECTED_PARENT_SHA256 = "7ec2f1dbac1cdf3e70065c4b924d655c9e238efe1a564ac3b3ac0e9a1d144f84"

PYTHON_PRIMARY_ONLY = {
    "argument_passing",
    "assert_statement",
    "assignment",
    "augmented_assignment",
    "boolean_operation",
    "comparison",
    "conditional_expression",
    "elif_clause",
    "except_clause",
    "f_string",
    "from_import_statement",
    "if_statement",
    "list_comprehension",
    "literal",
    "membership_test",
    "return_statement",
    "slice",
    "subscription",
}


def clean(value: object) -> str:
    return " ".join(str(value or "").replace("\t", " ").replace("\n", " ").split())


def digest(rows: list[dict]) -> str:
    return hashlib.sha256(
        "\n".join(row["id"] for row in rows).encode("utf-8")
    ).hexdigest()


def direct_source_bundles(card: dict) -> list[str]:
    code = str(card.get("code") or "")
    focus = str(card.get("focus_span") or "")
    tree = source_map.parse_code(code)
    aliases = source_map.imports_with_aliases(tree)
    calls = source_map.call_nodes(focus)

    bundles: set[str] = set()
    leaves = {
        source_map.call_leaf(node)
        for node in calls
        if source_map.call_leaf(node)
    }

    for node in calls:
        root = source_map.call_root(node)
        resolved = aliases.get(root, root)
        if resolved in source_map.STDLIB_MODULES:
            bundles.add("PY_STDLIB_" + resolved.upper())
        if resolved in source_map.THIRD_PARTY_URLS:
            bundles.add("THIRD_PARTY_" + resolved.upper())

    if leaves & source_map.BUILTIN_CALLS:
        bundles.add("PY_BUILTIN_FUNCTIONS")
    if leaves & source_map.BUILTIN_TYPE_METHODS:
        bundles.add("PY_BUILTIN_TYPES")
    if leaves & source_map.BUILTIN_EXCEPTION_CALLS:
        bundles.add("PY_BUILTIN_EXCEPTIONS")

    for leaf in sorted(leaves):
        bundle = source_map.FOCUS_METHOD_BUNDLES.get(leaf)
        if bundle:
            bundles.add(bundle)

    return sorted(bundles)


def classify(row: dict, card: dict) -> str:
    direct = direct_source_bundles(card)
    if direct:
        return "DIRECT_OFFICIAL_MAPPING_PRESENT"

    focus_calls = row["focus_leaves"]
    primary = row["primary_concept"]

    if focus_calls:
        return "OPAQUE_DOMAIN_CALL_REVIEW"
    if primary == "attribute_access":
        return "DOMAIN_ATTRIBUTE_REVIEW"
    if primary == "decorator":
        return "DOMAIN_DECORATOR_REVIEW"
    if primary in PYTHON_PRIMARY_ONLY:
        return "PYTHON_PRIMARY_MAPPING_PRESENT"
    return "DOMAIN_CONTEXT_REVIEW"


def collect_rows() -> list[dict]:
    cards = readiness.load_cards()
    by_id = {str(card["id"]): card for card in cards}
    parent = mapping_review.collect_rows()

    rows = []
    for row in parent:
        card = by_id[row["id"]]
        direct = direct_source_bundles(card)
        resolution = classify(row, card)
        rows.append({
            **row,
            "direct_source_bundles": direct,
            "domain_resolution_class": resolution,
            "question": clean(card.get("question")),
            "answer": clean(card.get("answer")),
            "focus_span_clean": clean(card.get("focus_span")),
        })

    rows.sort(
        key=lambda row: (
            row["domain_resolution_class"],
            row["primary_concept"],
            row["level"],
            row["id"],
        )
    )
    return rows


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Stdout-only second-stage classifier for normalized domain provenance review."
    )
    ap.add_argument("--limit", type=int, default=120)
    args = ap.parse_args()

    cards = readiness.load_cards()
    parent_rows = mapping_review.collect_rows()
    rows = collect_rows()

    parent_sha = digest(parent_rows)
    resolution_counts = Counter(row["domain_resolution_class"] for row in rows)
    primary_counts = Counter(row["primary_concept"] for row in rows)
    domain_counts = Counter(row["coverage_domain"] or "NO_DOMAIN" for row in rows)
    direct_bundle_counts = Counter(
        bundle
        for row in rows
        for bundle in row["direct_source_bundles"]
    )

    print("DOMAIN_PROVENANCE_REVIEW_R1")
    print(f"CARD_COUNT={len(cards)}")
    print(f"DOMAIN_REVIEW_COUNT={len(rows)}")
    print(f"PARENT_REVIEW_SHA256={parent_sha}")
    print("RESOLUTION_COUNTS=" + json.dumps(dict(sorted(resolution_counts.items())), ensure_ascii=False, sort_keys=True))
    print("PRIMARY_COUNTS=" + json.dumps(dict(sorted(primary_counts.items())), ensure_ascii=False, sort_keys=True))
    print("DOMAIN_COUNTS=" + json.dumps(dict(sorted(domain_counts.items())), ensure_ascii=False, sort_keys=True))
    print("DIRECT_BUNDLE_COUNTS=" + json.dumps(dict(sorted(direct_bundle_counts.items())), ensure_ascii=False, sort_keys=True))

    for row in rows[:max(0, args.limit)]:
        print(
            "DOMAIN_REVIEW\t"
            + row["domain_resolution_class"] + "\t"
            + row["id"] + "\t"
            + row["primary_concept"] + "\t"
            + (row["coverage_domain"] or "NO_DOMAIN") + "\t"
            + ("+".join(row["focus_roots"]) or "-") + "\t"
            + ("+".join(row["focus_leaves"]) or "-") + "\t"
            + ("+".join(row["direct_source_bundles"]) or "-") + "\t"
            + row["focus_span_clean"] + "\t"
            + row["question"] + "\t"
            + row["answer"] + "\t"
            + row["file"] + "\t"
            + row["title"]
        )

    if len(cards) != EXPECTED_CARD_COUNT:
        raise SystemExit(f"DOMAIN_PROVENANCE_REVIEW_R1=FAIL_CARD_COUNT_{len(cards)}")
    if len(rows) != EXPECTED_DOMAIN_REVIEW_COUNT:
        raise SystemExit(f"DOMAIN_PROVENANCE_REVIEW_R1=FAIL_REVIEW_COUNT_{len(rows)}")
    if parent_sha != EXPECTED_PARENT_SHA256:
        raise SystemExit("DOMAIN_PROVENANCE_REVIEW_R1=FAIL_PARENT_SHA_" + parent_sha)
    if any(row["primary_bundle"] == "SOURCE_GAP" for row in rows):
        raise SystemExit("DOMAIN_PROVENANCE_REVIEW_R1=FAIL_PRIMARY_SOURCE_GAP")

    print("DOMAIN_PROVENANCE_REVIEW_R1=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

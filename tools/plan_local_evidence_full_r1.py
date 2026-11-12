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
import plan_source_backed_explanation_r1 as source_plan
import run_lesson_explanation_api_pilot_r1 as api_runner

EXPECTED_CARD_COUNT = 1785
EXPECTED_LOCAL_EVIDENCE_COUNT = 68
EXPECTED_SELECTION_SHA256 = "d0621cf4b8d15eb209b0c0c88744a23788a09297c044fc4344de9473cd087160"


def collect_rows() -> list[dict]:
    rows = []
    for card in readiness.load_cards():
        authority = readiness.authority_class(card)
        reasons = readiness.quality_reasons(card)
        disposition = readiness.disposition(reasons, authority)
        if authority not in api_runner.REVIEW_AUTHORITIES:
            continue
        if disposition not in api_runner.TARGET_DISPOSITIONS:
            continue

        source = source_plan.source_record(card)
        row = dict(source)
        row["patch_targets"] = api_runner.patch_targets_for(reasons)
        rows.append(row)

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


def digest(rows: list[dict]) -> str:
    return hashlib.sha256(
        "\n".join(row["id"] for row in rows).encode("utf-8")
    ).hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=100)
    ap.add_argument("--ids-only", action="store_true")
    args = ap.parse_args()

    cards = readiness.load_cards()
    rows = collect_rows()

    if args.ids_only:
        print(",".join(row["id"] for row in rows))
        return 0

    authority_counts = Counter(row["authority"] for row in rows)
    disposition_counts = Counter(row["disposition"] for row in rows)
    target_counts = Counter(
        "+".join(row["patch_targets"])
        for row in rows
    )
    concept_counts = Counter(row["primary_concept"] for row in rows)
    selection_sha = digest(rows)

    print("LOCAL_EVIDENCE_FULL_PLAN_R1")
    print(f"CARD_COUNT={len(cards)}")
    print(f"LOCAL_EVIDENCE_COUNT={len(rows)}")
    print("LOCAL_EVIDENCE_AUTHORITY_COUNTS=" + json.dumps(dict(sorted(authority_counts.items())), sort_keys=True))
    print("LOCAL_EVIDENCE_DISPOSITION_COUNTS=" + json.dumps(dict(sorted(disposition_counts.items())), sort_keys=True))
    print("LOCAL_EVIDENCE_TARGET_COUNTS=" + json.dumps(dict(sorted(target_counts.items())), sort_keys=True))
    print("LOCAL_EVIDENCE_PRIMARY_COUNTS=" + json.dumps(dict(sorted(concept_counts.items())), sort_keys=True))
    print(f"LOCAL_EVIDENCE_SELECTION_SHA256={selection_sha}")

    for index, row in enumerate(rows[:max(0, args.limit)], start=1):
        print(
            "LOCAL_EVIDENCE_ITEM="
            + str(index) + "|"
            + row["id"] + "|"
            + row["authority"] + "|"
            + row["disposition"] + "|"
            + row["primary_concept"] + "|"
            + "+".join(row["patch_targets"]) + "|"
            + "+".join(row["quality_reasons"])
        )

    if len(cards) != EXPECTED_CARD_COUNT:
        raise SystemExit(f"LOCAL_EVIDENCE_FULL_PLAN_R1=FAIL_CARD_COUNT_{len(cards)}")
    if len(rows) != EXPECTED_LOCAL_EVIDENCE_COUNT:
        raise SystemExit(f"LOCAL_EVIDENCE_FULL_PLAN_R1=FAIL_COUNT_{len(rows)}")
    if selection_sha != EXPECTED_SELECTION_SHA256:
        raise SystemExit(
            "LOCAL_EVIDENCE_FULL_PLAN_R1=FAIL_SELECTION_SHA_"
            + selection_sha
        )
    if any(not row["patch_targets"] for row in rows):
        raise SystemExit("LOCAL_EVIDENCE_FULL_PLAN_R1=FAIL_EMPTY_PATCH_TARGET")
    if any(row["source_ready"] for row in rows):
        raise SystemExit("LOCAL_EVIDENCE_FULL_PLAN_R1=FAIL_SOURCE_READY_ROW")

    print("LOCAL_EVIDENCE_FULL_PLAN_R1=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

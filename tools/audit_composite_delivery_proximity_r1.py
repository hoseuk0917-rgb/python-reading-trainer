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

import audit_learning_sequence_r1 as sequence

EXPECTED_CARD_COUNT = 1785
TARGET_COMPOSITIONS = {"Composite", "Pipeline"}


def load_effective_cards() -> list[dict]:
    app_path = ROOT / "src" / "pwa" / "app.js"
    app_text = app_path.read_text(encoding="utf-8-sig")
    lesson_paths = sequence.extract_paths(
        app_text,
        "lessonFiles",
        "const lessonResults",
    )

    cards: list[dict] = []
    for rel in lesson_paths:
        path = sequence.runtime_path(ROOT, app_path, rel)
        payload = sequence.load_json(path)
        if not isinstance(payload, list):
            raise SystemExit(f"COMPOSITE_DELIVERY_PROXIMITY_R1=FAIL_NOT_LIST_{path}")
        for card in payload:
            if not isinstance(card, dict):
                raise SystemExit(f"COMPOSITE_DELIVERY_PROXIMITY_R1=FAIL_BAD_ROW_{path}")
            row = dict(card)
            row["_source"] = rel
            cards.append(row)

    baseline = sorted(
        cards,
        key=lambda card: (
            card.get("level", 999),
            str(card.get("id", "")),
        ),
    )
    effective = sequence.apply_sequence_config(ROOT, baseline)
    effective = sequence.apply_review_delivery_config(ROOT, effective)
    return effective


def intro_maps(
    cards: list[dict],
    position: dict[str, int],
) -> tuple[dict[str, tuple[int, str]], dict[str, tuple[int, str]]]:
    concept_intro: dict[str, tuple[int, str]] = {}
    call_intro: dict[str, tuple[int, str]] = {}

    for card in cards:
        cid = str(card.get("id", ""))
        pos = position[cid]
        primary = str(card.get("primary_concept", "")).strip()
        focus = str(card.get("focus_span", ""))
        concepts = [
            str(value).strip()
            for value in (card.get("concepts", []) or [])
        ]

        for concept in concepts:
            if not concept or concept in concept_intro:
                continue
            if concept == primary or sequence.focus_introduces_concept(concept, focus):
                concept_intro[concept] = (pos, cid)

        focused = sequence.pedagogic_focus_call_targets(focus)
        if len(focused) == 1:
            target = focused[0]
            if target not in call_intro:
                call_intro[target] = (pos, cid)

    return concept_intro, call_intro


def gap_bucket(gap: int | None) -> str:
    if gap is None:
        return "NO_SAME_LEVEL_ANCHOR"
    if gap <= 1:
        return "GAP_1"
    if gap <= 3:
        return "GAP_2_3"
    if gap <= 7:
        return "GAP_4_7"
    if gap <= 15:
        return "GAP_8_15"
    if gap <= 31:
        return "GAP_16_31"
    return "GAP_32_PLUS"


def main() -> int:
    ap = argparse.ArgumentParser(
        description=(
            "Audit how far Learn-time Composite/Pipeline cards are delivered "
            "after their latest same-level prerequisite introduction."
        )
    )
    ap.add_argument("--limit", type=int, default=120)
    args = ap.parse_args()

    cards = load_effective_cards()
    ids = [str(card.get("id", "")) for card in cards]
    if len(ids) != len(set(ids)):
        raise SystemExit("COMPOSITE_DELIVERY_PROXIMITY_R1=FAIL_DUPLICATE_IDS")

    position = {
        str(card.get("id", "")): index
        for index, card in enumerate(cards, start=1)
    }
    level_by_id = {
        str(card.get("id", "")): card.get("level")
        for card in cards
    }
    concept_intro, call_intro = intro_maps(cards, position)
    prelearn = sequence.load_prelearn_support(ROOT)

    config = sequence.load_json(
        ROOT / "data" / "curriculum" / "learning_sequence_r1.json"
    )
    rule_ids = {
        str(item.get("id", ""))
        for item in (config.get("rules", []) or [])
        if isinstance(item, dict)
    }

    rows: list[dict] = []
    all_composition_counts = Counter()

    for card in cards:
        source = str(card.get("_source", ""))
        composition = sequence.composition_for(card, source)
        delivery = sequence.delivery_for(card, source)
        if composition in TARGET_COMPOSITIONS:
            all_composition_counts[composition] += 1
        if composition not in TARGET_COMPOSITIONS or delivery != "Learn":
            continue

        cid = str(card.get("id", ""))
        pos = position[cid]
        level = card.get("level")
        support = prelearn.get(cid) or {}
        covered_call_targets = {
            str(value).split(".")[-1]
            for value in (support.get("covers_call_targets", []) or [])
        }

        anchors: list[dict] = []

        for concept in sequence.explicit_concept_prereqs(card):
            intro = concept_intro.get(concept)
            if not intro or intro[1] == cid:
                continue
            anchors.append({
                "kind": "concept",
                "prerequisite": concept,
                "position": intro[0],
                "card_id": intro[1],
                "level": level_by_id.get(intro[1]),
            })

        focused_calls = sequence.pedagogic_focus_call_targets(
            str(card.get("focus_span", ""))
        )
        for target in sequence.relevant_pedagogic_call_targets(card):
            if target.split(".")[-1] in covered_call_targets:
                continue
            intro = call_intro.get(target)
            if not intro:
                continue
            if target in focused_calls and len(focused_calls) == 1 and intro[1] == cid:
                continue
            anchors.append({
                "kind": "call_target",
                "prerequisite": target,
                "position": intro[0],
                "card_id": intro[1],
                "level": level_by_id.get(intro[1]),
            })

        same_level = [
            anchor
            for anchor in anchors
            if anchor["level"] == level and anchor["position"] < pos
        ]
        cross_level = [
            anchor
            for anchor in anchors
            if anchor["level"] != level and anchor["position"] < pos
        ]
        latest = max(
            same_level,
            key=lambda anchor: anchor["position"],
            default=None,
        )
        gap = pos - latest["position"] if latest else None

        rows.append({
            "id": cid,
            "position": pos,
            "level": level,
            "composition": composition,
            "title": str(card.get("title", "")),
            "source": source,
            "gap": gap,
            "gap_bucket": gap_bucket(gap),
            "anchor_id": latest["card_id"] if latest else "",
            "anchor_position": latest["position"] if latest else None,
            "anchor_kind": latest["kind"] if latest else "",
            "anchor_prerequisite": latest["prerequisite"] if latest else "",
            "same_level_anchor_count": len(same_level),
            "cross_level_anchor_count": len(cross_level),
            "existing_order_rule": cid in rule_ids,
            "prelearn_support": bool(support),
        })

    bucket_counts = Counter(row["gap_bucket"] for row in rows)
    target_counts = Counter(row["composition"] for row in rows)
    existing_rule_count = sum(row["existing_order_rule"] for row in rows)
    prelearn_count = sum(row["prelearn_support"] for row in rows)

    with_gap = [row for row in rows if row["gap"] is not None]
    with_gap.sort(
        key=lambda row: (
            -int(row["gap"]),
            int(row["level"] or 999),
            row["id"],
        )
    )

    print("COMPOSITE_DELIVERY_PROXIMITY_R1")
    print(f"CARD_COUNT={len(cards)}")
    print(
        "ALL_COMPOSITION_COUNTS="
        + json.dumps(
            dict(sorted(all_composition_counts.items())),
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    print(f"TARGET_LEARN_COUNT={len(rows)}")
    print(
        "TARGET_COMPOSITION_COUNTS="
        + json.dumps(
            dict(sorted(target_counts.items())),
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    print(
        "GAP_BUCKET_COUNTS="
        + json.dumps(
            dict(sorted(bucket_counts.items())),
            ensure_ascii=False,
            sort_keys=True,
        )
    )
    print(f"WITH_SAME_LEVEL_ANCHOR_COUNT={len(with_gap)}")
    print(
        "NO_SAME_LEVEL_ANCHOR_COUNT="
        + str(sum(row["gap"] is None for row in rows))
    )
    print(f"EXISTING_ORDER_RULE_COUNT={existing_rule_count}")
    print(f"PRELEARN_SUPPORT_COUNT={prelearn_count}")

    for row in with_gap[:max(0, args.limit)]:
        print(
            "PROXIMITY\t"
            + str(row["gap"]) + "\t"
            + row["gap_bucket"] + "\t"
            + row["id"] + "\t"
            + f"L{row['level']}" + "\t"
            + row["composition"] + "\t"
            + row["anchor_id"] + "\t"
            + row["anchor_kind"] + ":"
            + row["anchor_prerequisite"] + "\t"
            + ("RULE" if row["existing_order_rule"] else "NO_RULE") + "\t"
            + ("PRELEARN" if row["prelearn_support"] else "NO_PRELEARN") + "\t"
            + row["title"]
        )

    if len(cards) != EXPECTED_CARD_COUNT:
        raise SystemExit(
            f"COMPOSITE_DELIVERY_PROXIMITY_R1=FAIL_CARD_COUNT_{len(cards)}"
        )
    if any(
        row["gap"] is not None and row["gap"] <= 0
        for row in rows
    ):
        raise SystemExit("COMPOSITE_DELIVERY_PROXIMITY_R1=FAIL_NONPOSITIVE_GAP")

    print("COMPOSITE_DELIVERY_PROXIMITY_R1=PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

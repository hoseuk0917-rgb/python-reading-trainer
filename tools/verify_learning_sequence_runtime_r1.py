# -*- coding: utf-8 -*-
from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

from audit_learning_sequence_r1 import build_analysis


ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "data" / "curriculum" / "learning_sequence_r1.json"


def stable_apply(rows: list[dict], config: dict) -> list[dict]:
    original_index = {row["id"]: i for i, row in enumerate(rows)}
    by_id = {row["id"]: row for row in rows}

    levels: list[int] = []
    groups: dict[int, list[dict]] = {}
    for row in rows:
        level = row["level"]
        if level not in groups:
            groups[level] = []
            levels.append(level)
        groups[level].append(row)

    rules_by_level: dict[int, list[dict]] = defaultdict(list)
    seen_rule_ids: set[str] = set()

    for rule in config.get("rules", []):
        cid = rule.get("id")
        after = rule.get("after")
        if not isinstance(cid, str) or not isinstance(after, list):
            raise SystemExit(f"FAIL: malformed rule: {rule}")
        if cid in seen_rule_ids:
            raise SystemExit(f"FAIL: duplicate rule id: {cid}")
        seen_rule_ids.add(cid)

        card = by_id.get(cid)
        if card is None:
            raise SystemExit(f"FAIL: rule card does not exist: {cid}")

        for prerequisite_id in after:
            prerequisite = by_id.get(prerequisite_id)
            if prerequisite is None:
                raise SystemExit(
                    f"FAIL: prerequisite card does not exist: {cid} <- {prerequisite_id}"
                )
            if prerequisite["level"] != card["level"]:
                raise SystemExit(
                    f"FAIL: cross-level rule is not allowed: {cid}(L{card['level']}) "
                    f"<- {prerequisite_id}(L{prerequisite['level']})"
                )

        rules_by_level[card["level"]].append(rule)

    output: list[dict] = []

    for level in levels:
        group = groups[level]
        ids = [row["id"] for row in group]
        adjacency = {cid: [] for cid in ids}
        indegree = {cid: 0 for cid in ids}
        edges: set[tuple[str, str]] = set()

        for rule in rules_by_level.get(level, []):
            cid = rule["id"]
            for prerequisite_id in rule["after"]:
                if prerequisite_id == cid:
                    raise SystemExit(f"FAIL: self dependency: {cid}")
                edge = (prerequisite_id, cid)
                if edge in edges:
                    continue
                edges.add(edge)
                adjacency[prerequisite_id].append(cid)
                indegree[cid] += 1

        queue = sorted(
            [cid for cid in ids if indegree[cid] == 0],
            key=original_index.__getitem__,
        )
        ordered: list[str] = []

        while queue:
            cid = queue.pop(0)
            ordered.append(cid)
            for next_id in adjacency[cid]:
                indegree[next_id] -= 1
                if indegree[next_id] == 0:
                    queue.append(next_id)
                    queue.sort(key=original_index.__getitem__)

        if len(ordered) != len(ids):
            blocked = sorted(cid for cid in ids if indegree[cid] > 0)
            raise SystemExit(f"FAIL: cycle detected in L{level}: {blocked}")

        output.extend(by_id[cid] for cid in ordered)

    return output


def assert_after(position: dict[str, int], card_id: str, prerequisite_id: str) -> None:
    if position[card_id] <= position[prerequisite_id]:
        raise SystemExit(
            f"FAIL: expected {card_id} after {prerequisite_id}, "
            f"got {position[card_id]} <= {position[prerequisite_id]}"
        )


def main() -> None:
    if not CONFIG.is_file():
        raise SystemExit(f"FAIL: missing config: {CONFIG}")

    config = json.loads(CONFIG.read_text(encoding="utf-8-sig"))
    if config.get("schema") != "python-reading-trainer/learning-sequence-r1":
        raise SystemExit(f"FAIL: unexpected schema: {config.get('schema')}")
    if config.get("enabled") is not True:
        raise SystemExit("FAIL: learning sequence R1 must be enabled")
    if config.get("mode") != "within_level_only":
        raise SystemExit(f"FAIL: unexpected mode: {config.get('mode')}")
    if not isinstance(config.get("rules"), list) or not config["rules"]:
        raise SystemExit("FAIL: rules must be a non-empty list")

    analysis = build_analysis(ROOT)
    baseline = analysis["rows"]
    effective = stable_apply(baseline, config)

    if len(baseline) != 1785 or len(effective) != 1785:
        raise SystemExit(
            f"FAIL: card count drift: baseline={len(baseline)} effective={len(effective)}"
        )

    baseline_ids = [row["id"] for row in baseline]
    effective_ids = [row["id"] for row in effective]
    if set(baseline_ids) != set(effective_ids):
        raise SystemExit("FAIL: card id set changed")

    baseline_level = {row["id"]: row["level"] for row in baseline}
    for row in effective:
        if row["level"] != baseline_level[row["id"]]:
            raise SystemExit(f"FAIL: level changed: {row['id']}")

    baseline_pos = {cid: i for i, cid in enumerate(baseline_ids, start=1)}
    effective_pos = {cid: i for i, cid in enumerate(effective_ids, start=1)}

    assert_after(
        effective_pos,
        "PYF94_A1_L01_INPUT_003",
        "PYF94_A1_L01_TYPE_003",
    )
    assert_after(
        effective_pos,
        "PYF94_A1_L01_INPUT_005",
        "PYF94_A1_L01_INPUT_003",
    )
    assert_after(
        effective_pos,
        "PYF95_A1_FUNC_001_DEF_CALL_PRINT",
        "PYF95_A1_FUNC_002_DEF_NOT_CALLED",
    )
    assert_after(
        effective_pos,
        "PYF95_A1_FUNC_003_RETURN_ASSIGN",
        "PYF95_A1_FUNC_008_RETURN_NO_PRINT",
    )
    assert_after(
        effective_pos,
        "PYF95_A1_FUNC_011_FUNCTION_IN_FUNCTION",
        "PYF95_A1_FUNC_003_RETURN_ASSIGN",
    )

    moved = [
        cid
        for cid in baseline_ids
        if baseline_pos[cid] != effective_pos[cid]
    ]

    print("LEARNING_SEQUENCE_RUNTIME_R1")
    print(f"CARD_COUNT={len(effective)}")
    print(f"RULE_COUNT={len(config['rules'])}")
    print(f"MOVED_CARD_COUNT={len(moved)}")
    for cid in moved:
        print(
            "MOVED"
            f"\t{cid}"
            f"\tL{baseline_level[cid]}"
            f"\t{baseline_pos[cid]}->{effective_pos[cid]}"
        )
    print(
        "CANARY_INPUT_INT="
        f"{effective_pos['PYF94_A1_L01_TYPE_003']}"
        f"<{effective_pos['PYF94_A1_L01_INPUT_003']}"
        "=PASS"
    )
    print(
        "CANARY_FUNCTION_DEF_CALL="
        f"{effective_pos['PYF95_A1_FUNC_002_DEF_NOT_CALLED']}"
        f"<{effective_pos['PYF95_A1_FUNC_001_DEF_CALL_PRINT']}"
        "=PASS"
    )
    print("VERIFY_LEARNING_SEQUENCE_RUNTIME_R1=PASS")


if __name__ == "__main__":
    main()

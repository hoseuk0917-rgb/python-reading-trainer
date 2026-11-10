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
        id_set = set(ids)
        prerequisites = {cid: [] for cid in ids}

        for rule in rules_by_level.get(level, []):
            cid = rule["id"]
            for prerequisite_id in rule["after"]:
                if prerequisite_id == cid:
                    raise SystemExit(f"FAIL: self dependency: {cid}")
                if prerequisite_id not in id_set:
                    raise SystemExit(
                        f"FAIL: prerequisite missing from L{level}: {cid} <- {prerequisite_id}"
                    )
                if prerequisite_id in prerequisites[cid]:
                    continue
                prerequisites[cid].append(prerequisite_id)

        state: dict[str, int] = {}
        ordered: list[str] = []
        cycle_detected = False

        def emit_with_prerequisites(cid: str) -> None:
            nonlocal cycle_detected
            status = state.get(cid, 0)
            if status == 2 or cycle_detected:
                return
            if status == 1:
                cycle_detected = True
                return

            state[cid] = 1
            for prerequisite_id in prerequisites[cid]:
                emit_with_prerequisites(prerequisite_id)
            if cycle_detected:
                return
            state[cid] = 2
            ordered.append(cid)

        for cid in ids:
            emit_with_prerequisites(cid)

        if cycle_detected or len(ordered) != len(ids):
            blocked = sorted(cid for cid in ids if state.get(cid, 0) == 1)
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

    expected_prelearn = {
        "PYF95_A2_DTS_009_DICT_ITEMS_LIST": [
            "PYF95_A2_DICT_KEYS_VALUES_ITEMS",
            "PYV158_A1_LIST_CONSTRUCTOR",
        ],
        "PYF95_A3_LOOP_017_REVERSED_LIST": [
            "PYF95_A3_REVERSED_BASIC",
            "PYV158_A1_LIST_CONSTRUCTOR",
        ],
        "PYF95_A3_LOOP_018_REVERSED_ORIGINAL": [
            "PYF95_A3_REVERSED_BASIC",
        ],
        "PY104_L03_LIST_INSERT_001": [
            "PYV104_LIST_EXTEND_INSERT",
        ],
        "PYF95_A3_LOOP_026_ZIP_TO_LIST": [
            "PYF95_A3_ZIP_BASIC",
            "PYV158_A1_LIST_CONSTRUCTOR",
        ],
    }
    prelearn = config.get("prelearn_support", [])
    if not isinstance(prelearn, list):
        raise SystemExit("FAIL: prelearn_support must be a list")

    actual_prelearn: dict[str, list[str]] = {}
    for item in prelearn:
        if not isinstance(item, dict):
            raise SystemExit(f"FAIL: malformed prelearn support: {item}")

        cid = str(item.get("id", ""))
        raw_side_ids = item.get("side_card_ids")
        if isinstance(raw_side_ids, list):
            side_ids = [
                str(value)
                for value in raw_side_ids
                if str(value)
            ]
        else:
            legacy_id = str(item.get("side_card_id", ""))
            side_ids = [legacy_id] if legacy_id else []

        if not cid or not side_ids or len(side_ids) > 2:
            raise SystemExit(f"FAIL: invalid prelearn support side ids: {item}")

        covers = item.get("covers_call_targets", [])
        if not isinstance(covers, list) or not covers:
            raise SystemExit(
                f"FAIL: prelearn support must declare covers_call_targets: {item}"
            )

        actual_prelearn[cid] = side_ids

    if actual_prelearn != expected_prelearn:
        raise SystemExit(
            f"FAIL: unexpected prelearn support mapping: {actual_prelearn}"
        )

    required_core_side_ids = {
        "PYV158_A1_LIST_CONSTRUCTOR",
        "PYV158_A1_BUILTIN_SUM",
    }
    core_side_paths = [
        ROOT / "data" / "side_cards" / "python_unlinked_core_gap_side_cards_v158_a1.json",
        ROOT / "data_i18n" / "en" / "side_cards" / "python_unlinked_core_gap_side_cards_v158_a1.json",
    ]
    for side_path in core_side_paths:
        if not side_path.is_file():
            raise SystemExit(f"FAIL: missing core side-card file: {side_path}")
        payload = json.loads(side_path.read_text(encoding="utf-8-sig"))
        ids = {
            str(item.get("id", ""))
            for item in payload
            if isinstance(item, dict)
        }
        missing = sorted(required_core_side_ids - ids)
        if missing:
            raise SystemExit(
                f"FAIL: missing R2 core side cards in {side_path}: {missing}"
            )

    analysis = build_analysis(ROOT, use_effective_sequence=False)
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
    assert_after(
        effective_pos,
        "PY10_L03_def_return_001",
        "PYF95_A1_FUNC_008_RETURN_NO_PRINT",
    )
    assert_after(
        effective_pos,
        "PYF95_A1_FUNC_020_COUNT_PREFIX",
        "PYV99_A1_GAP_006_STARTSWITH_PREFIX",
    )
    assert_after(
        effective_pos,
        "PYF95_A3_LOOP_007_BREAK_FIND_FIRST",
        "PYV99_A1_GAP_006_STARTSWITH_PREFIX",
    )
    assert_after(
        effective_pos,
        "PY4_L04_all_001",
        "PY4_L04_any_001",
    )
    assert_after(
        effective_pos,
        "PY130_L05_API_KEY_NOT_IN_CODE_001",
        "PY130_L05_ENV_VAR_CONCEPT_001",
    )

    moved = [
        cid
        for cid in baseline_ids
        if baseline_pos[cid] != effective_pos[cid]
    ]

    print("LEARNING_SEQUENCE_RUNTIME_R1")
    print(f"CARD_COUNT={len(effective)}")
    print(f"RULE_COUNT={len(config['rules'])}")
    print(f"PRELEARN_SUPPORT_COUNT={len(prelearn)}")
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
    print(
        "CANARY_R2_DEF_RETURN="
        f"{effective_pos['PYF95_A1_FUNC_008_RETURN_NO_PRINT']}"
        f"<{effective_pos['PY10_L03_def_return_001']}"
        "=PASS"
    )
    print(
        "CANARY_R2_STARTSWITH_FUNCTION="
        f"{effective_pos['PYV99_A1_GAP_006_STARTSWITH_PREFIX']}"
        f"<{effective_pos['PYF95_A1_FUNC_020_COUNT_PREFIX']}"
        "=PASS"
    )
    print(
        "CANARY_R2_STARTSWITH_LOOP="
        f"{effective_pos['PYV99_A1_GAP_006_STARTSWITH_PREFIX']}"
        f"<{effective_pos['PYF95_A3_LOOP_007_BREAK_FIND_FIRST']}"
        "=PASS"
    )
    print(
        "CANARY_R2_GENERATOR_ALL="
        f"{effective_pos['PY4_L04_any_001']}"
        f"<{effective_pos['PY4_L04_all_001']}"
        "=PASS"
    )
    print("CANARY_PRELEARN_SUPPORT_R2=PASS")
    print("CANARY_CORE_SIDE_CARDS_R2=PASS")
    print(
        "CANARY_R2_ENV_SECRET="
        f"{effective_pos['PY130_L05_ENV_VAR_CONCEPT_001']}"
        f"<{effective_pos['PY130_L05_API_KEY_NOT_IN_CODE_001']}"
        "=PASS"
    )
    print("VERIFY_LEARNING_SEQUENCE_RUNTIME_R1=PASS")


if __name__ == "__main__":
    main()

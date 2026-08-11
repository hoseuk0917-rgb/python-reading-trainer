from __future__ import annotations

import re


NODE_WIDTH = 96
LABEL_UNIT_BUDGET = 15
SUBLABEL_UNIT_BUDGET = 24

LANE_X = 40
LANE_Y = 52
LANE_W = 640
LANE_H = 104
LANE_GAP = 20
COL_XS = [88, 220, 300, 430, 500, 625]
OUTSIDE_RIGHT_X = LANE_X + LANE_W + 12
SAFE_CORRIDOR_X = LANE_X + LANE_W + 24
SAFE_LEFT_CORRIDOR_X = LANE_X - 12
FAR_LEFT_CORRIDOR_X = LANE_X - 24
GAP_CORRIDOR_OFFSET = 4
ALT_GAP_CORRIDOR_OFFSET = LANE_GAP - GAP_CORRIDOR_OFFSET
OUTER_APPROACH_OFFSET = 8
TOP_EXTERIOR_Y = LANE_Y - OUTER_APPROACH_OFFSET
BOTTOM_EXTERIOR_Y = LANE_Y + 3 * (LANE_H + LANE_GAP) + LANE_H + OUTER_APPROACH_OFFSET

LABEL_DX_BY_ROLE = {
    "loop_exit": 24,
}
LABEL_DY_BY_ROLE = {
    "continue": 20,
}
FALSE_BRANCH_LABEL_DY = 10

_FULLWIDTH_RANGES = (
    (0x1100, 0x115F),
    (0x2329, 0x232A),
    (0x2E80, 0xA4CF),
    (0xAC00, 0xD7A3),
    (0xF900, 0xFAFF),
    (0xFE10, 0xFE19),
    (0xFE30, 0xFE6F),
    (0xFF01, 0xFF60),
    (0xFFE0, 0xFFE6),
    (0x16FE0, 0x18DFF),
    (0x1AFF0, 0x1AFFF),
    (0x1B000, 0x1B2FF),
    (0x1F000, 0x1FAFF),
    (0x20000, 0x3FFFD),
)


def archify_text_units(value: str) -> int:
    """Mirror Archify v2.13.0 textUnits() for deterministic preflight."""
    total = 0
    for ch in str(value or ""):
        codepoint = ord(ch)
        total += 2 if any(start <= codepoint <= end for start, end in _FULLWIDTH_RANGES) else 1
    return total


def fit_units(value: str, budget: int) -> str:
    text = " ".join(str(value or "").split())
    if archify_text_units(text) <= budget:
        return text
    if budget <= 1:
        return "…"

    out = []
    used = 0
    target = budget - 1
    for ch in text:
        units = archify_text_units(ch)
        if used + units > target:
            break
        out.append(ch)
        used += units
    return "".join(out).rstrip() + "…"


def _leading_call(code: str) -> str:
    match = re.match(r"\s*([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*)\s*\(", code)
    return match.group(1) if match else ""


def compact_node_label(node: dict, locale: str) -> str:
    kind = str(node.get("kind") or "")
    raw = str((node.get("label") or {}).get(locale) or kind)
    code = str(node.get("code") or "").strip()

    if kind == "source":
        raw = "반복 입력" if locale == "ko" else "Loop input"
    elif kind == "try":
        raw = "try 구간" if locale == "ko" else "Try block"
    elif kind == "except":
        raw = "예외 처리" if locale == "ko" else "Handle error"
    elif kind == "process":
        call = _leading_call(code)
        if call:
            short = call.split(".")[-1]
            raw = f"{short} 호출" if locale == "ko" else f"Call {short}"

    return fit_units(raw, LABEL_UNIT_BUDGET)


def compact_node_sublabel(node: dict) -> str:
    code = " ".join(str(node.get("code") or "").split())
    if not code:
        return ""
    if archify_text_units(code) <= SUBLABEL_UNIT_BUDGET:
        return code

    kind = str(node.get("kind") or "")

    if kind == "source":
        methods = re.findall(r"\.([A-Za-z_][A-Za-z0-9_]*)\s*\(", code)
        if methods:
            return fit_units(f"{methods[-1]}(…)", SUBLABEL_UNIT_BUDGET)

    if "=" in code and not code.lstrip().startswith(("if ", "while ", "for ")):
        lhs = code.split("=", 1)[0].strip()
        if lhs:
            return fit_units(f"{lhs} = …", SUBLABEL_UNIT_BUDGET)

    call = _leading_call(code)
    if call:
        return fit_units(f"{call}(…)", SUBLABEL_UNIT_BUDGET)

    return fit_units(code, SUBLABEL_UNIT_BUDGET)


def lane_top(index: int) -> int:
    return LANE_Y + index * (LANE_H + LANE_GAP)


def lane_bottom(index: int) -> int:
    return lane_top(index) + LANE_H


def outside_right_row_blocked(
    visible: list[dict],
    col_by_id: dict[str, int],
    lane_for_node,
    source: dict,
    target: dict,
) -> bool:
    """Detect rows where outside-right would pass through a later unrelated node."""
    source_lane = lane_for_node(source)
    target_lane = lane_for_node(target)
    source_col = col_by_id[source["id"]]
    target_col = col_by_id[target["id"]]

    for node in visible:
        if node["id"] in {source["id"], target["id"]}:
            continue
        lane = lane_for_node(node)
        col = col_by_id[node["id"]]
        if lane == source_lane and col > source_col:
            return True
        if lane == target_lane and col > target_col:
            return True
    return False


def cross_lane_corridor_route(
    source_lane_index: int,
    target_lane_index: int,
    source_col: int,
    target_col: int,
) -> dict:
    """Route a blocked cross-lane edge through a dedicated right corridor."""
    source_x = COL_XS[source_col]
    target_x = COL_XS[target_col]

    if target_lane_index > source_lane_index:
        source_gap_y = lane_bottom(source_lane_index) + GAP_CORRIDOR_OFFSET
        target_gap_y = lane_top(target_lane_index) - GAP_CORRIDOR_OFFSET
        return {
            "fromSide": "bottom",
            "toSide": "top",
            "via": [
                [source_x, source_gap_y],
                [SAFE_CORRIDOR_X, source_gap_y],
                [SAFE_CORRIDOR_X, target_gap_y],
                [target_x, target_gap_y],
            ],
        }

    source_gap_y = lane_top(source_lane_index) - GAP_CORRIDOR_OFFSET
    target_gap_y = lane_bottom(target_lane_index) + GAP_CORRIDOR_OFFSET
    return {
        "fromSide": "top",
        "toSide": "bottom",
        "via": [
            [source_x, source_gap_y],
            [SAFE_CORRIDOR_X, source_gap_y],
            [SAFE_CORRIDOR_X, target_gap_y],
            [target_x, target_gap_y],
        ],
    }


def alternate_left_corridor_route(
    source_lane_index: int,
    target_lane_index: int,
    source_col: int,
    target_col: int,
) -> dict:
    """Separate a second long route onto a farther left exterior corridor."""
    source_x = COL_XS[source_col]
    target_x = COL_XS[target_col]

    if target_lane_index > source_lane_index:
        return {
            "fromSide": "top",
            "toSide": "bottom",
            "via": [
                [source_x, TOP_EXTERIOR_Y],
                [FAR_LEFT_CORRIDOR_X, TOP_EXTERIOR_Y],
                [FAR_LEFT_CORRIDOR_X, BOTTOM_EXTERIOR_Y],
                [target_x, BOTTOM_EXTERIOR_Y],
            ],
        }

    source_gap_y = lane_top(source_lane_index) - ALT_GAP_CORRIDOR_OFFSET
    target_gap_y = lane_bottom(target_lane_index) + ALT_GAP_CORRIDOR_OFFSET
    return {
        "fromSide": "top",
        "toSide": "bottom",
        "via": [
            [source_x, source_gap_y],
            [FAR_LEFT_CORRIDOR_X, source_gap_y],
            [FAR_LEFT_CORRIDOR_X, target_gap_y],
            [target_x, target_gap_y],
        ],
    }


def outer_left_branch_route(
    source_lane_index: int,
    target_lane_index: int,
    source_col: int,
    target_col: int,
) -> dict:
    """Detour an adjacent branch around a long relationship occupying their shared gap.

    Downward branches use the full top/bottom exterior bands so they do not
    intersect incoming edges above the source lane or loop-back labels below
    the target lane. Upward branches retain the smaller local exterior detour.
    """
    if abs(target_lane_index - source_lane_index) != 1:
        raise ValueError(
            f"ARCHIFY_OUTER_BRANCH_REQUIRES_ADJACENT_LANES={source_lane_index}:{target_lane_index}"
        )

    source_x = COL_XS[source_col]
    target_x = COL_XS[target_col]

    if target_lane_index > source_lane_index:
        return {
            "fromSide": "top",
            "toSide": "bottom",
            "via": [
                [source_x, TOP_EXTERIOR_Y],
                [SAFE_LEFT_CORRIDOR_X, TOP_EXTERIOR_Y],
                [SAFE_LEFT_CORRIDOR_X, BOTTOM_EXTERIOR_Y],
                [target_x, BOTTOM_EXTERIOR_Y],
            ],
        }

    source_outer_y = lane_bottom(source_lane_index) + GAP_CORRIDOR_OFFSET
    target_outer_y = lane_top(target_lane_index) - OUTER_APPROACH_OFFSET
    return {
        "fromSide": "bottom",
        "toSide": "top",
        "via": [
            [source_x, source_outer_y],
            [SAFE_LEFT_CORRIDOR_X, source_outer_y],
            [SAFE_LEFT_CORRIDOR_X, target_outer_y],
            [target_x, target_outer_y],
        ],
    }


def apply_label_role_policy(edge: dict, role: str) -> None:
    """Separate semantic labels without changing relationship semantics."""
    if not edge.get("label"):
        return
    dx = LABEL_DX_BY_ROLE.get(role)
    if dx is not None:
        edge["labelDx"] = dx
    dy = LABEL_DY_BY_ROLE.get(role)
    if dy is not None:
        edge["labelDy"] = dy

from __future__ import annotations

from audit_python_reading_graph_ir_v0_1 import CASES
from export_python_reading_archify_layoutsafe_v0_1 import build_archify_workflow
from python_reading_archify_contract_v0_1 import (
    ARCHIFY_ID_RE,
    assert_workflow_ids_archify_safe,
    normalize_workflow_ids,
)
from python_reading_archify_layout_v0_1 import (
    FALSE_BRANCH_LABEL_DY,
    FAR_LEFT_CORRIDOR_X,
    LABEL_DX_BY_ROLE,
    LABEL_DY_BY_ROLE,
    LABEL_UNIT_BUDGET,
    SAFE_CORRIDOR_X,
    SAFE_LEFT_CORRIDOR_X,
    SUBLABEL_UNIT_BUDGET,
    archify_text_units,
)
from python_reading_graph_ir_v0_1 import build_python_reading_graph_ir


def assert_layout_policy(workflow: dict) -> None:
    for node in workflow["nodes"]:
        assert archify_text_units(node["label"]) <= LABEL_UNIT_BUDGET, node
        if node.get("sublabel"):
            assert archify_text_units(node["sublabel"]) <= SUBLABEL_UNIT_BUDGET, node

    has_right_corridor = False
    for edge in workflow["edges"]:
        via = edge.get("via") or []
        if via:
            assert edge.get("fromSide") in {"top", "bottom", "left", "right"}
            assert edge.get("toSide") in {"top", "bottom", "left", "right"}
            for left, right in zip(via, via[1:]):
                assert left[0] == right[0] or left[1] == right[1], edge
            has_right_corridor = has_right_corridor or any(
                point[0] == SAFE_CORRIDOR_X for point in via
            )

        if edge.get("labelDx") is not None:
            assert edge["labelDx"] in set(LABEL_DX_BY_ROLE.values()), edge

        if edge.get("labelDy") in set(LABEL_DY_BY_ROLE.values()) | {FALSE_BRANCH_LABEL_DY}:
            assert edge.get("label"), edge

    if has_right_corridor:
        assert not any(edge.get("route") == "outside-right" for edge in workflow["edges"]), workflow


def main() -> None:
    for name, source in CASES.items():
        ir = build_python_reading_graph_ir(source, f"{name}.py")
        for locale in ("ko", "en"):
            workflow = normalize_workflow_ids(
                build_archify_workflow(
                    ir,
                    locale=locale,
                    output_name=f"{name}.{locale}.html",
                )
            )
            node_ids = {node["id"] for node in workflow["nodes"]}
            assert node_ids
            assert len(node_ids) == len(workflow["nodes"])
            assert len({edge["id"] for edge in workflow["edges"]}) == len(workflow["edges"])
            assert all(ARCHIFY_ID_RE.fullmatch(node_id) for node_id in node_ids)
            assert_workflow_ids_archify_safe(workflow)
            assert_layout_policy(workflow)
            for edge in workflow["edges"]:
                assert edge["from"] in node_ids
                assert edge["to"] in node_ids
            assert "mainPath" not in workflow
            assert all(node["width"] == 96 for node in workflow["nodes"])

            right_corridors = sum(
                1 for edge in workflow["edges"]
                if any(point[0] == SAFE_CORRIDOR_X for point in (edge.get("via") or []))
            )
            left_corridors = sum(
                1 for edge in workflow["edges"]
                if any(
                    point[0] in {SAFE_LEFT_CORRIDOR_X, FAR_LEFT_CORRIDOR_X}
                    for point in (edge.get("via") or [])
                )
            )
            branch_gaps = sum(
                1 for edge in workflow["edges"]
                if len(edge.get("via") or []) == 2
                and not any(
                    point[0] in {
                        SAFE_CORRIDOR_X,
                        SAFE_LEFT_CORRIDOR_X,
                        FAR_LEFT_CORRIDOR_X,
                    }
                    for point in (edge.get("via") or [])
                )
            )
            label_offsets = sum(
                1 for edge in workflow["edges"]
                if edge.get("labelDx") is not None or edge.get("labelDy") in {
                    *LABEL_DY_BY_ROLE.values(),
                    FALSE_BRANCH_LABEL_DY,
                }
            )
            print(
                f"CASE={name} LOCALE={locale} "
                f"NODES={len(workflow['nodes'])} EDGES={len(workflow['edges'])} "
                f"RIGHT_CORRIDORS={right_corridors} LEFT_CORRIDORS={left_corridors} "
                f"BRANCH_GAPS={branch_gaps} LABEL_OFFSETS={label_offsets} "
                "ARCHIFY_IDS=PASS TEXT_FIT=PASS ROUTE_SEPARATION=PASS"
            )
    print("CASES=5")
    print("LOCALES=2")
    print("ARCHIFY_ID_CONTRACT=PASS")
    print("ARCHIFY_TEXT_FIT_CONTRACT=PASS")
    print("ARCHIFY_SHOWCASE_ROUTE_SEPARATION=PASS")
    print("RESULT=PASS_PYTHON_READING_ARCHIFY_PROJECTION_V0_1_AUDIT")


if __name__ == "__main__":
    main()

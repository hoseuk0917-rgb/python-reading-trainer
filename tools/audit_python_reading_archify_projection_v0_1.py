from __future__ import annotations

from audit_python_reading_graph_ir_v0_1 import CASES
from export_python_reading_archify_layoutsafe_v0_1 import build_archify_workflow
from python_reading_archify_contract_v0_1 import (
    ARCHIFY_ID_RE,
    assert_workflow_ids_archify_safe,
    normalize_workflow_ids,
)
from python_reading_archify_layout_v0_1 import (
    LABEL_DX_BY_ROLE,
    LABEL_UNIT_BUDGET,
    SAFE_CORRIDOR_X,
    SUBLABEL_UNIT_BUDGET,
    archify_text_units,
)
from python_reading_graph_ir_v0_1 import build_python_reading_graph_ir


def assert_layout_policy(workflow: dict) -> None:
    for node in workflow["nodes"]:
        assert archify_text_units(node["label"]) <= LABEL_UNIT_BUDGET, node
        if node.get("sublabel"):
            assert archify_text_units(node["sublabel"]) <= SUBLABEL_UNIT_BUDGET, node

    for edge in workflow["edges"]:
        via = edge.get("via") or []
        if via:
            assert edge.get("fromSide") in {"top", "bottom", "left", "right"}
            assert edge.get("toSide") in {"top", "bottom", "left", "right"}
            assert any(point[0] == SAFE_CORRIDOR_X for point in via), edge
            for left, right in zip(via, via[1:]):
                assert left[0] == right[0] or left[1] == right[1], edge

        if edge.get("labelDx") is not None:
            assert edge["labelDx"] in set(LABEL_DX_BY_ROLE.values()), edge


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
            corridor_edges = sum(1 for edge in workflow["edges"] if edge.get("via"))
            shifted_labels = sum(
                1 for edge in workflow["edges"]
                if edge.get("labelDx") in set(LABEL_DX_BY_ROLE.values())
            )
            print(
                f"CASE={name} LOCALE={locale} "
                f"NODES={len(workflow['nodes'])} EDGES={len(workflow['edges'])} "
                f"CORRIDOR_EDGES={corridor_edges} SHIFTED_LABELS={shifted_labels} "
                "ARCHIFY_IDS=PASS TEXT_FIT=PASS CORRIDOR_POLICY=PASS"
            )
    print("CASES=5")
    print("LOCALES=2")
    print("ARCHIFY_ID_CONTRACT=PASS")
    print("ARCHIFY_TEXT_FIT_CONTRACT=PASS")
    print("ARCHIFY_SHOWCASE_CORRIDOR_POLICY=PASS")
    print("RESULT=PASS_PYTHON_READING_ARCHIFY_PROJECTION_V0_1_AUDIT")


if __name__ == "__main__":
    main()

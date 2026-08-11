from __future__ import annotations

from audit_python_reading_graph_ir_v0_1 import CASES
from export_python_reading_archify_v0_1 import build_archify_workflow
from python_reading_archify_contract_v0_1 import (
    ARCHIFY_ID_RE,
    assert_workflow_ids_archify_safe,
    normalize_workflow_ids,
)
from python_reading_graph_ir_v0_1 import build_python_reading_graph_ir


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
            for edge in workflow["edges"]:
                assert edge["from"] in node_ids
                assert edge["to"] in node_ids
            assert "mainPath" not in workflow
            assert all(node["width"] == 96 for node in workflow["nodes"])
            print(
                f"CASE={name} LOCALE={locale} "
                f"NODES={len(workflow['nodes'])} EDGES={len(workflow['edges'])} "
                "ARCHIFY_IDS=PASS"
            )
    print("CASES=5")
    print("LOCALES=2")
    print("ARCHIFY_ID_CONTRACT=PASS")
    print("RESULT=PASS_PYTHON_READING_ARCHIFY_PROJECTION_V0_1_AUDIT")


if __name__ == "__main__":
    main()

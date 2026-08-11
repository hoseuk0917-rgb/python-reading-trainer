from __future__ import annotations

from audit_python_reading_graph_ir_v0_1 import CASES
from export_python_reading_archify_v0_1 import build_archify_workflow
from python_reading_graph_ir_v0_1 import build_python_reading_graph_ir


def main() -> None:
    for name, source in CASES.items():
        ir = build_python_reading_graph_ir(source, f"{name}.py")
        for locale in ("ko", "en"):
            workflow = build_archify_workflow(
                ir,
                locale=locale,
                output_name=f"{name}.{locale}.html",
            )
            node_ids = {node["id"] for node in workflow["nodes"]}
            assert node_ids
            assert len(node_ids) == len(workflow["nodes"])
            assert len({edge["id"] for edge in workflow["edges"]}) == len(workflow["edges"])
            for edge in workflow["edges"]:
                assert edge["from"] in node_ids
                assert edge["to"] in node_ids
            assert "mainPath" not in workflow
            assert all(node["width"] == 96 for node in workflow["nodes"])
            print(
                f"CASE={name} LOCALE={locale} "
                f"NODES={len(workflow['nodes'])} EDGES={len(workflow['edges'])}"
            )
    print("CASES=5")
    print("LOCALES=2")
    print("RESULT=PASS_PYTHON_READING_ARCHIFY_PROJECTION_V0_1_AUDIT")


if __name__ == "__main__":
    main()

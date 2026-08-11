from __future__ import annotations

import argparse
import json
from pathlib import Path

from audit_python_reading_graph_ir_v0_1 import CASES
from export_python_reading_archify_layoutsafe_v0_1 import build_archify_workflow
from python_reading_archify_contract_v0_1 import (
    assert_workflow_ids_archify_safe,
    normalize_workflow_ids,
)
from python_reading_graph_ir_v0_1 import build_python_reading_graph_ir


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Write the 5-case × 2-locale Python Reading Archify validation matrix."
    )
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    root = args.output_dir
    root.mkdir(parents=True, exist_ok=True)
    rows = []

    for name, source in CASES.items():
        case_dir = root / name
        case_dir.mkdir(parents=True, exist_ok=True)

        source_path = case_dir / f"{name}.py"
        ir_path = case_dir / f"{name}.ir.json"
        source_path.write_text(source, encoding="utf-8")

        ir = build_python_reading_graph_ir(source, source_path.name)
        ir_path.write_text(
            json.dumps(ir, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

        for locale in ("ko", "en"):
            workflow_path = case_dir / f"{name}.{locale}.workflow.json"
            html_name = f"{name}.{locale}.html"
            workflow = normalize_workflow_ids(
                build_archify_workflow(
                    ir,
                    locale=locale,
                    output_name=html_name,
                )
            )
            assert_workflow_ids_archify_safe(workflow)
            workflow_path.write_text(
                json.dumps(workflow, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            rows.append({
                "case": name,
                "locale": locale,
                "source": source_path.as_posix(),
                "ir": ir_path.as_posix(),
                "workflow": workflow_path.as_posix(),
                "html": (case_dir / html_name).as_posix(),
                "node_count": len(workflow["nodes"]),
                "edge_count": len(workflow["edges"]),
            })

    manifest = {
        "schema_version": 1,
        "matrix": "python_reading_archify_v0_1",
        "case_count": len(CASES),
        "locale_count": 2,
        "workflow_count": len(rows),
        "rows": rows,
    }
    manifest_path = root / "matrix_manifest.json"
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"OUTPUT_DIR={root}")
    print(f"WORKFLOW_COUNT={len(rows)}")
    print(f"MANIFEST={manifest_path}")
    print("ARCHIFY_ID_CONTRACT=PASS")
    print("ARCHIFY_LAYOUT_POLICY=LAYOUTSAFE_V0_1")
    print("RESULT=PASS_PYTHON_READING_ARCHIFY_MATRIX_GENERATION_V0_1")


if __name__ == "__main__":
    main()

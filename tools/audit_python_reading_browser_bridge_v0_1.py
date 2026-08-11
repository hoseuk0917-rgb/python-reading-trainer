from __future__ import annotations

import re

from audit_python_reading_graph_ir_v0_1 import CASES
from python_reading_browser_bridge_v0_1 import (
    build_browser_archify_projection_payload,
    build_browser_structure_payload,
)

ARCHIFY_ID_RE = re.compile(r"^[a-zA-Z][a-zA-Z0-9_-]*$")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    for name, source in CASES.items():
        structure = build_browser_structure_payload(
            source,
            {"language": "python", "steps": []},
            "python",
            f"{name}.py",
        )

        require(structure["ok"] is True, f"{name}: structure not ok")
        require(structure["kind"] == "python_structure_reconciliation", f"{name}: wrong kind")
        require(structure["language"] == "python", f"{name}: wrong language")
        require(structure["authority"]["canonical_structure"] == "python_ast", f"{name}: wrong authority")
        require(structure["authority"]["rule_only_auto_registration"] is False, f"{name}: rule-only registration enabled")
        require(structure["authority"]["conflict_auto_registration"] is False, f"{name}: conflict registration enabled")
        require(int(structure["summary"]["conflict"]) == 0, f"{name}: unexpected conflict")
        require(structure["privacy"]["browserOnly"] is True, f"{name}: browser privacy missing")
        require(structure["privacy"]["externalApiUsed"] is False, f"{name}: external API flag")
        require(structure["privacy"]["originalInputPersisted"] is False, f"{name}: persistence flag")

        projection_ids = [str(value) for value in structure["executionProjectionNodeIds"]]
        canonical_ids = [str(item["ast"]["node_id"]) for item in structure["canonicalFindings"]]
        require(projection_ids == canonical_ids, f"{name}: canonical order mismatch")
        require(len(projection_ids) == len(set(projection_ids)), f"{name}: duplicate canonical ids")

        projected = build_browser_archify_projection_payload(structure, "ko")
        require(projected["ok"] is True, f"{name}: projection not ok")
        require(projected["kind"] == "python_archify_browser_projection", f"{name}: projection kind")
        require(projected["executionProjectionNodeIds"] == projection_ids, f"{name}: projection authority drift")

        source_ids = [str(value) for value in projected["workflowSourceNodeIds"]]
        mapped_canonical = [str(item["canonicalNodeId"]) for item in projected["workflowIdMap"]]
        mapped_archify = [str(item["archifyNodeId"]) for item in projected["workflowIdMap"]]
        workflow_node_ids = [str(item["id"]) for item in projected["workflow"]["nodes"]]

        require(source_ids == mapped_canonical, f"{name}: source/id-map mismatch")
        require(workflow_node_ids == mapped_archify, f"{name}: render/id-map mismatch")
        require(all(ARCHIFY_ID_RE.fullmatch(value) for value in workflow_node_ids), f"{name}: unsafe node id")
        require(len(workflow_node_ids) == len(set(workflow_node_ids)), f"{name}: duplicate render ids")
        require(set(source_ids).issubset(set(projection_ids)), f"{name}: noncanonical learner node")

        collapsed = [str(value) for value in projected["collapsedAuxiliaryNodeIds"]]
        require(not (set(collapsed) & set(source_ids)), f"{name}: collapsed auxiliary leak")
        require(projected["privacy"]["localServerUsed"] is False, f"{name}: local server marked used")

        print(
            f"CASE={name} "
            f"CANONICAL={len(projection_ids)} "
            f"WORKFLOW_NODES={len(workflow_node_ids)} "
            f"WORKFLOW_EDGES={len(projected['workflow']['edges'])} "
            f"COLLAPSED_AUX={len(collapsed)} "
            "BROWSER_BRIDGE=PASS"
        )

    non_python_blocked = False
    try:
        build_browser_structure_payload("console.log('x')", {"language": "javascript"}, "auto")
    except ValueError as exc:
        non_python_blocked = "python_source_required" in str(exc)
    require(non_python_blocked, "non-Python browser structure input was not blocked")
    print("NON_PYTHON_GUARD=PASS")

    print(f"CASES={len(CASES)}")
    print("RESULT=PASS_PYTHON_READING_BROWSER_BRIDGE_V0_1_AUDIT")


if __name__ == "__main__":
    main()

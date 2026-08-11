from __future__ import annotations

import json
import sys
from typing import Any

from export_python_reading_archify_layoutsafe_v0_1 import build_archify_workflow

VERSION = "v0.1"


def load_envelope() -> dict[str, Any]:
    raw = sys.stdin.read()
    if not raw.strip():
        raise ValueError("stdin JSON envelope is empty")
    value = json.loads(raw)
    if not isinstance(value, dict):
        raise ValueError("stdin JSON envelope must be an object")
    return value


def main() -> None:
    envelope = load_envelope()
    reconciliation = envelope.get("reconciliation") or envelope.get("structure") or {}
    if not isinstance(reconciliation, dict):
        raise ValueError("reconciliation must be an object")

    authority = reconciliation.get("authority") or {}
    if authority.get("canonical_structure") != "python_ast":
        raise ValueError("canonical_structure must be python_ast")
    if authority.get("rule_only_auto_registration") is not False:
        raise ValueError("rule_only_auto_registration must be false")
    if authority.get("conflict_auto_registration") is not False:
        raise ValueError("conflict_auto_registration must be false")

    summary = reconciliation.get("summary") or {}
    if int(summary.get("conflict") or 0) != 0:
        raise ValueError("semantic conflicts must be zero before Archify projection")

    projection_ids = [str(value) for value in (reconciliation.get("execution_projection_node_ids") or [])]
    if not projection_ids:
        raise ValueError("execution_projection_node_ids is empty")
    if len(projection_ids) != len(set(projection_ids)):
        raise ValueError("execution_projection_node_ids contains duplicates")

    ir = reconciliation.get("graph_ir") or {}
    if not isinstance(ir, dict):
        raise ValueError("graph_ir must be an object")

    locale = str(envelope.get("locale") or "ko").lower()
    if locale not in {"ko", "en"}:
        raise ValueError("locale must be ko or en")

    output_name = str(envelope.get("output_name") or "python_execution_archify.html")
    scope_id = envelope.get("scope_id") or None

    workflow = build_archify_workflow(
        ir,
        scope_id=scope_id,
        locale=locale,
        output_name=output_name,
    )

    workflow_node_ids = [str(item.get("id") or "") for item in (workflow.get("nodes") or [])]
    if any(not value for value in workflow_node_ids):
        raise ValueError("workflow contains a node without an id")
    if len(workflow_node_ids) != len(set(workflow_node_ids)):
        raise ValueError("workflow contains duplicate node ids")

    allowed_ids = set(projection_ids)
    outside = [value for value in workflow_node_ids if value not in allowed_ids]
    if outside:
        raise ValueError("workflow contains non-canonical execution nodes: " + ",".join(outside))

    edge_ids = [str(item.get("id") or "") for item in (workflow.get("edges") or [])]
    if any(not value for value in edge_ids):
        raise ValueError("workflow contains an edge without an id")
    if len(edge_ids) != len(set(edge_ids)):
        raise ValueError("workflow contains duplicate edge ids")

    payload = {
        "schema_version": 1,
        "bridge_version": VERSION,
        "locale": locale,
        "scope_id": scope_id or ir.get("primary_scope_id"),
        "canonical_execution_node_ids": projection_ids,
        "workflow_node_ids": workflow_node_ids,
        "workflow": workflow,
    }
    sys.stdout.write(json.dumps(payload, ensure_ascii=False))


if __name__ == "__main__":
    main()

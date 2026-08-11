from __future__ import annotations

import copy
import json
import sys
from typing import Any

from export_python_reading_archify_layoutsafe_v0_1 import (
    apply_layout_policy,
    build_archify_workflow as build_layoutsafe_archify_workflow,
)
from export_python_reading_archify_v0_1 import (
    build_archify_workflow as build_base_archify_workflow,
    hidden,
)
from python_reading_archify_contract_v0_1 import (
    archify_safe_id,
    assert_workflow_ids_archify_safe,
    normalize_workflow_ids,
)

VERSION = "v0.4"


def load_envelope() -> dict[str, Any]:
    raw = sys.stdin.read()
    if not raw.strip():
        raise ValueError("stdin JSON envelope is empty")
    value = json.loads(raw)
    if not isinstance(value, dict):
        raise ValueError("stdin JSON envelope must be an object")
    return value


def prepare_renderer_ir(
    ir: dict[str, Any],
    projection_ids: list[str],
) -> tuple[dict[str, Any], list[str]]:
    """Collapse non-canonical AST helpers in a renderer-only copy.

    The reconciliation projection is the registration authority. Existing Archify
    path projection is allowed to traverse hidden helper nodes, but it must never
    surface one as a learner execution node. Marking only otherwise-visible,
    non-canonical nodes as ``merge`` preserves their control-flow connectivity
    while reusing the exporter's established hidden-node traversal behavior.
    The source Graph IR is never mutated.
    """

    renderer_ir = copy.deepcopy(ir)
    canonical_ids = set(projection_ids)
    collapsed: list[str] = []

    for scope in renderer_ir.get("scopes") or []:
        for node in scope.get("nodes") or []:
            node_id = str(node.get("id") or "")
            if not node_id or node_id in canonical_ids:
                continue
            if hidden(node):
                continue

            original_kind = str(node.get("kind") or "")
            node["kind"] = "merge"
            node["renderer_projection"] = {
                "collapsed_auxiliary": True,
                "original_kind": original_kind,
            }
            collapsed.append(node_id)

    if len(collapsed) != len(set(collapsed)):
        raise ValueError("collapsed auxiliary node ids contain duplicates")

    return renderer_ir, collapsed


def build_canonical_workflow_preserving_r7_layout(
    source_ir: dict[str, Any],
    renderer_ir: dict[str, Any],
    *,
    scope_id: str | None,
    locale: str,
    output_name: str,
) -> tuple[dict[str, Any], dict[str, int]]:
    """Reuse the frozen R7 column allocation while hiding non-canonical helpers.

    R7 was validated with the original Graph IR, where renderer-visible helper
    nodes such as ``loop_source`` can consume a column. If those helpers are
    collapsed before layout, later canonical nodes shift left and can violate
    Archify's minimum node/edge spacing. Build one layout-safe reference from the
    untouched IR, then project the canonical-only renderer copy while preserving
    each surviving node's R7 column. No source IR or global R7 geometry is changed.
    """

    reference = build_layoutsafe_archify_workflow(
        source_ir,
        scope_id=scope_id,
        locale=locale,
        output_name=output_name,
    )
    reference_columns = {
        str(node.get("id") or ""): int(node.get("col"))
        for node in (reference.get("nodes") or [])
        if str(node.get("id") or "")
    }

    workflow = build_base_archify_workflow(
        renderer_ir,
        scope_id=scope_id,
        locale=locale,
        output_name=output_name,
    )

    preserved_columns: dict[str, int] = {}
    for node in workflow.get("nodes") or []:
        node_id = str(node.get("id") or "")
        if node_id not in reference_columns:
            raise ValueError(f"ARCHIFY_R7_LAYOUT_REFERENCE_NODE_MISSING={node_id}")
        node["col"] = reference_columns[node_id]
        preserved_columns[node_id] = reference_columns[node_id]

    workflow = apply_layout_policy(workflow, renderer_ir, scope_id, locale)

    actual_columns = {
        str(node.get("id") or ""): int(node.get("col"))
        for node in (workflow.get("nodes") or [])
    }
    if actual_columns != preserved_columns:
        raise ValueError("ARCHIFY_R7_LAYOUT_COLUMN_PRESERVATION_FAILED")

    return workflow, preserved_columns


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

    renderer_ir, collapsed_auxiliary_node_ids = prepare_renderer_ir(ir, projection_ids)

    workflow, r7_layout_columns = build_canonical_workflow_preserving_r7_layout(
        ir,
        renderer_ir,
        scope_id=scope_id,
        locale=locale,
        output_name=output_name,
    )

    workflow_source_node_ids = [
        str(item.get("id") or "")
        for item in (workflow.get("nodes") or [])
    ]
    if any(not value for value in workflow_source_node_ids):
        raise ValueError("workflow contains a node without an id")
    if len(workflow_source_node_ids) != len(set(workflow_source_node_ids)):
        raise ValueError("workflow contains duplicate source node ids")

    allowed_ids = set(projection_ids)
    outside = [value for value in workflow_source_node_ids if value not in allowed_ids]
    if outside:
        raise ValueError("workflow contains non-canonical execution nodes: " + ",".join(outside))

    leaked_auxiliary = [
        value for value in collapsed_auxiliary_node_ids
        if value in set(workflow_source_node_ids)
    ]
    if leaked_auxiliary:
        raise ValueError(
            "collapsed auxiliary nodes leaked into workflow: " + ",".join(leaked_auxiliary)
        )

    if set(r7_layout_columns) != set(workflow_source_node_ids):
        raise ValueError("R7 layout column map does not match workflow source nodes")

    workflow_id_map = [
        {
            "canonical_node_id": source_id,
            "archify_node_id": archify_safe_id(source_id),
        }
        for source_id in workflow_source_node_ids
    ]
    archify_ids = [item["archify_node_id"] for item in workflow_id_map]
    if len(archify_ids) != len(set(archify_ids)):
        raise ValueError("workflow Archify ID mapping contains collisions")

    workflow = normalize_workflow_ids(workflow)
    assert_workflow_ids_archify_safe(workflow)

    workflow_node_ids = [str(item.get("id") or "") for item in (workflow.get("nodes") or [])]
    if workflow_node_ids != archify_ids:
        raise ValueError("normalized workflow node order does not match ID mapping")

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
        "workflow_source_node_ids": workflow_source_node_ids,
        "workflow_node_ids": workflow_node_ids,
        "workflow_id_map": workflow_id_map,
        "r7_layout_columns": r7_layout_columns,
        "collapsed_auxiliary_node_ids": collapsed_auxiliary_node_ids,
        "workflow": workflow,
    }
    sys.stdout.write(json.dumps(payload, ensure_ascii=False))


if __name__ == "__main__":
    main()

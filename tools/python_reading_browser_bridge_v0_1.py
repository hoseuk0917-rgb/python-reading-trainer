from __future__ import annotations

from typing import Any

from python_reading_reconciliation_v0_1 import reconcile_python_reading_analysis
from python_reading_archify_server_bridge_v0_1 import (
    build_canonical_workflow_preserving_r7_layout,
    prepare_renderer_ir,
)
from python_reading_archify_contract_v0_1 import (
    archify_safe_id,
    assert_workflow_ids_archify_safe,
    normalize_workflow_ids,
)

VERSION = "v0.1"


def _line_count(source: str) -> int:
    if not source:
        return 0
    return len(source.splitlines())


def _detected_language(rule_analysis: dict[str, Any], requested_language: str) -> str:
    return str(
        rule_analysis.get("language")
        or rule_analysis.get("detectedLanguage")
        or requested_language
        or "unknown"
    ).lower()


def build_browser_structure_payload(
    source: str,
    rule_analysis: dict[str, Any],
    requested_language: str = "auto",
    source_name: str = "pwa_input.py",
) -> dict[str, Any]:
    raw = str(source or "")
    if not raw.strip():
        raise ValueError("python_source_empty")
    if not isinstance(rule_analysis, dict):
        raise ValueError("rule_analysis_must_be_object")

    language = _detected_language(rule_analysis, requested_language)
    if language != "python":
        raise ValueError("python_source_required")

    reconciliation = reconcile_python_reading_analysis(
        raw,
        rule_analysis,
        str(source_name or "pwa_input.py"),
    )

    return {
        "ok": True,
        "service": "browser-python-runtime",
        "version": VERSION,
        "kind": "python_structure_reconciliation",
        "language": "python",
        "sourceMeta": {
            "characters": len(raw),
            "lines": _line_count(raw),
            "sourceName": str(source_name or "pwa_input.py"),
        },
        "authority": reconciliation["authority"],
        "summary": reconciliation["summary"],
        "canonicalFindings": reconciliation["canonical_findings"],
        "diagnostics": reconciliation["diagnostics"],
        "astAuxiliary": reconciliation["ast_auxiliary"],
        "executionProjectionNodeIds": reconciliation["execution_projection_node_ids"],
        "graphIr": reconciliation["graph_ir"],
        "ruleAnalysis": rule_analysis,
        "privacy": {
            "browserOnly": True,
            "externalApiUsed": False,
            "originalInputPersisted": False,
            "pythonRuntime": "pyodide",
            "localServerUsed": False,
        },
    }


def _validate_structure_for_projection(structure_payload: dict[str, Any]) -> tuple[list[str], dict[str, Any]]:
    if not isinstance(structure_payload, dict):
        raise ValueError("structure_payload_must_be_object")
    if structure_payload.get("ok") is not True:
        raise ValueError("structure_payload_not_ok")
    if structure_payload.get("kind") != "python_structure_reconciliation":
        raise ValueError("structure_payload_kind_invalid")
    if structure_payload.get("language") != "python":
        raise ValueError("python_source_required")

    authority = structure_payload.get("authority") or {}
    if authority.get("canonical_structure") != "python_ast":
        raise ValueError("canonical_structure_must_be_python_ast")
    if authority.get("rule_only_auto_registration") is not False:
        raise ValueError("rule_only_auto_registration_must_be_false")
    if authority.get("conflict_auto_registration") is not False:
        raise ValueError("conflict_auto_registration_must_be_false")

    summary = structure_payload.get("summary") or {}
    if int(summary.get("conflict") or 0) != 0:
        raise ValueError("semantic_conflict_blocks_archify")

    projection_ids = [
        str(value)
        for value in (structure_payload.get("executionProjectionNodeIds") or [])
    ]
    if not projection_ids:
        raise ValueError("execution_projection_node_ids_empty")
    if len(projection_ids) != len(set(projection_ids)):
        raise ValueError("execution_projection_node_ids_duplicate")

    ir = structure_payload.get("graphIr") or {}
    if not isinstance(ir, dict):
        raise ValueError("graph_ir_must_be_object")

    return projection_ids, ir


def build_browser_archify_projection_payload(
    structure_payload: dict[str, Any],
    locale: str = "ko",
    output_name: str = "python_execution_archify.html",
    scope_id: str | None = None,
) -> dict[str, Any]:
    projection_ids, ir = _validate_structure_for_projection(structure_payload)

    locale = str(locale or "ko").lower()
    if locale not in {"ko", "en"}:
        raise ValueError("locale_must_be_ko_or_en")

    renderer_ir, collapsed_auxiliary_node_ids = prepare_renderer_ir(
        ir,
        projection_ids,
    )

    workflow, r7_layout_columns = build_canonical_workflow_preserving_r7_layout(
        ir,
        renderer_ir,
        scope_id=scope_id,
        locale=locale,
        output_name=str(output_name or "python_execution_archify.html"),
    )

    workflow_source_node_ids = [
        str(item.get("id") or "")
        for item in (workflow.get("nodes") or [])
    ]
    if any(not value for value in workflow_source_node_ids):
        raise ValueError("workflow_source_node_id_missing")
    if len(workflow_source_node_ids) != len(set(workflow_source_node_ids)):
        raise ValueError("workflow_source_node_id_duplicate")

    allowed_ids = set(projection_ids)
    outside = [
        value
        for value in workflow_source_node_ids
        if value not in allowed_ids
    ]
    if outside:
        raise ValueError(
            "workflow_contains_noncanonical_execution_nodes=" + ",".join(outside)
        )

    leaked_auxiliary = [
        value
        for value in collapsed_auxiliary_node_ids
        if value in set(workflow_source_node_ids)
    ]
    if leaked_auxiliary:
        raise ValueError(
            "collapsed_auxiliary_leaked=" + ",".join(leaked_auxiliary)
        )

    if set(r7_layout_columns) != set(workflow_source_node_ids):
        raise ValueError("r7_layout_column_map_mismatch")

    workflow_id_map = [
        {
            "canonicalNodeId": source_id,
            "archifyNodeId": archify_safe_id(source_id),
        }
        for source_id in workflow_source_node_ids
    ]
    archify_ids = [item["archifyNodeId"] for item in workflow_id_map]
    if len(archify_ids) != len(set(archify_ids)):
        raise ValueError("workflow_archify_id_collision")

    normalized_workflow = normalize_workflow_ids(workflow)
    assert_workflow_ids_archify_safe(normalized_workflow)

    workflow_node_ids = [
        str(item.get("id") or "")
        for item in (normalized_workflow.get("nodes") or [])
    ]
    if workflow_node_ids != archify_ids:
        raise ValueError("normalized_workflow_node_order_mismatch")

    edge_ids = [
        str(item.get("id") or "")
        for item in (normalized_workflow.get("edges") or [])
    ]
    if any(not value for value in edge_ids):
        raise ValueError("workflow_edge_id_missing")
    if len(edge_ids) != len(set(edge_ids)):
        raise ValueError("workflow_edge_id_duplicate")

    return {
        "ok": True,
        "kind": "python_archify_browser_projection",
        "bridgeVersion": VERSION,
        "locale": locale,
        "scopeId": scope_id or ir.get("primary_scope_id"),
        "authority": structure_payload.get("authority") or {},
        "summary": structure_payload.get("summary") or {},
        "sourceMeta": structure_payload.get("sourceMeta") or {},
        "executionProjectionNodeIds": projection_ids,
        "workflowSourceNodeIds": workflow_source_node_ids,
        "workflowNodeIds": workflow_node_ids,
        "workflowIdMap": workflow_id_map,
        "r7LayoutColumns": r7_layout_columns,
        "collapsedAuxiliaryNodeIds": collapsed_auxiliary_node_ids,
        "workflow": normalized_workflow,
        "privacy": {
            "browserOnly": True,
            "externalApiUsed": False,
            "originalSourcePersisted": False,
            "temporaryFilesPersisted": False,
            "localServerUsed": False,
        },
    }

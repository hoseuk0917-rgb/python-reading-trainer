from __future__ import annotations

import re


ARCHIFY_ID_RE = re.compile(r"^[a-zA-Z][a-zA-Z0-9_-]*$")


def archify_safe_id(source_id: str) -> str:
    """Map a source IR identifier to Archify's public ID contract."""
    raw = re.sub(r"[^a-zA-Z0-9_-]", "_", str(source_id or ""))
    if not raw or not raw[0].isalpha():
        raw = f"n_{raw}"
    if not ARCHIFY_ID_RE.fullmatch(raw):
        raise ValueError(f"ARCHIFY_ID_NORMALIZATION_FAILED={source_id!r}->{raw!r}")
    return raw


def normalize_workflow_ids(workflow: dict) -> dict:
    """Normalize only renderer-facing IDs; never mutate the source IR."""
    nodes = workflow.get("nodes") or []
    mapping: dict[str, str] = {}

    for node in nodes:
        source_id = str(node.get("id") or "")
        if not source_id:
            raise ValueError("ARCHIFY_NODE_ID_EMPTY")
        target_id = archify_safe_id(source_id)
        if target_id in mapping.values() and mapping.get(source_id) != target_id:
            raise ValueError(f"ARCHIFY_ID_COLLISION={source_id}->{target_id}")
        mapping[source_id] = target_id

    if len(set(mapping.values())) != len(mapping):
        raise ValueError("ARCHIFY_NODE_ID_COLLISION")

    for node in nodes:
        node["id"] = mapping[str(node["id"])]

    for edge in workflow.get("edges") or []:
        source_from = str(edge.get("from") or "")
        source_to = str(edge.get("to") or "")
        if source_from not in mapping:
            raise ValueError(f"ARCHIFY_EDGE_FROM_NOT_VISIBLE={source_from}")
        if source_to not in mapping:
            raise ValueError(f"ARCHIFY_EDGE_TO_NOT_VISIBLE={source_to}")
        edge["from"] = mapping[source_from]
        edge["to"] = mapping[source_to]

    meta = workflow.get("meta") or {}
    for view in meta.get("views") or []:
        focus = []
        for source_id in view.get("focus") or []:
            source_id = str(source_id)
            if source_id not in mapping:
                raise ValueError(f"ARCHIFY_VIEW_FOCUS_NOT_VISIBLE={source_id}")
            focus.append(mapping[source_id])
        view["focus"] = focus

    if "mainPath" in workflow:
        workflow["mainPath"] = [mapping[str(source_id)] for source_id in workflow["mainPath"]]

    return workflow


def assert_workflow_ids_archify_safe(workflow: dict) -> None:
    node_ids = [str(node.get("id") or "") for node in workflow.get("nodes") or []]
    edge_ids = [str(edge.get("id") or "") for edge in workflow.get("edges") or []]

    for value in node_ids + edge_ids:
        if not ARCHIFY_ID_RE.fullmatch(value):
            raise AssertionError(f"ARCHIFY_UNSAFE_ID={value}")

    node_set = set(node_ids)
    if len(node_set) != len(node_ids):
        raise AssertionError("ARCHIFY_DUPLICATE_NODE_ID")

    for edge in workflow.get("edges") or []:
        if edge.get("from") not in node_set:
            raise AssertionError(f"ARCHIFY_EDGE_FROM_UNKNOWN={edge.get('from')}")
        if edge.get("to") not in node_set:
            raise AssertionError(f"ARCHIFY_EDGE_TO_UNKNOWN={edge.get('to')}")

    for view in (workflow.get("meta") or {}).get("views") or []:
        for node_id in view.get("focus") or []:
            if node_id not in node_set:
                raise AssertionError(f"ARCHIFY_VIEW_FOCUS_UNKNOWN={node_id}")

from __future__ import annotations

from export_python_reading_archify_v0_1 import (
    build_archify_workflow as build_base_archify_workflow,
    select_scope,
)
from python_reading_archify_layout_v0_1 import (
    compact_node_label,
    compact_node_sublabel,
    cross_lane_corridor_route,
    outside_right_row_blocked,
)


def _lane_name(node: dict) -> str:
    return str(node["lane"])


def apply_layout_policy(workflow: dict, ir: dict, scope_id: str | None, locale: str) -> dict:
    """Apply renderer-only fit and route policy without changing Python Reading Graph IR."""
    scope = select_scope(ir, scope_id)
    source_nodes = {node["id"]: node for node in scope["nodes"]}

    for node in workflow.get("nodes") or []:
        source = source_nodes.get(node["id"])
        if not source:
            raise ValueError(f"ARCHIFY_LAYOUT_SOURCE_NODE_NOT_FOUND={node['id']}")
        node["label"] = compact_node_label(source, locale)
        sublabel = compact_node_sublabel(source)
        if sublabel:
            node["sublabel"] = sublabel
        else:
            node.pop("sublabel", None)

    nodes = workflow.get("nodes") or []
    node_by_id = {node["id"]: node for node in nodes}
    col_by_id = {node["id"]: int(node["col"]) for node in nodes}
    lane_index = {
        lane["id"]: index
        for index, lane in enumerate(workflow.get("lanes") or [])
    }

    for edge in workflow.get("edges") or []:
        source = node_by_id.get(edge.get("from"))
        target = node_by_id.get(edge.get("to"))
        if not source or not target:
            continue
        source_lane_index = lane_index[source["lane"]]
        target_lane_index = lane_index[target["lane"]]
        if (
            edge.get("route") == "outside-right"
            and abs(target_lane_index - source_lane_index) > 1
            and outside_right_row_blocked(
                nodes,
                col_by_id,
                _lane_name,
                source,
                target,
            )
        ):
            edge.pop("route", None)
            edge.pop("channelX", None)
            edge.pop("channelY", None)
            edge.update(
                cross_lane_corridor_route(
                    source_lane_index,
                    target_lane_index,
                    int(source["col"]),
                    int(target["col"]),
                )
            )
            if edge.get("label"):
                edge["labelSegment"] = 1
                edge["labelDy"] = 10

    return workflow


def build_archify_workflow(
    ir: dict,
    *,
    scope_id: str | None = None,
    locale: str = "ko",
    output_name: str = "python_reading_flow.html",
) -> dict:
    workflow = build_base_archify_workflow(
        ir,
        scope_id=scope_id,
        locale=locale,
        output_name=output_name,
    )
    return apply_layout_policy(workflow, ir, scope_id, locale)

from __future__ import annotations

import argparse
import json
from collections import defaultdict, deque
from pathlib import Path


LANE_ORDER = ["setup", "control", "process", "output"]
LANE_LABELS = {
    "ko": {
        "setup": "준비 / 입력",
        "control": "제어 흐름",
        "process": "데이터 처리",
        "output": "결과",
    },
    "en": {
        "setup": "Setup / input",
        "control": "Control flow",
        "process": "Data processing",
        "output": "Result",
    },
}
HIDDEN_KINDS = {"start", "end", "merge", "continue", "break", "definition"}
IMPORTANT_ROLES = {
    "true", "false", "continue", "break", "loop_back", "loop_exit",
    "exception", "return", "finally",
}
TYPE_BY_KIND = {
    "setup": "database",
    "source": "database",
    "loop": "backend",
    "decision": "backend",
    "try": "security",
    "except": "security",
    "process": "backend",
    "exception": "security",
    "output": "frontend",
    "return": "frontend",
}
VARIANT_BY_ROLE = {
    "true": "emphasis",
    "false": "dashed",
    "continue": "dashed",
    "break": "security",
    "loop_back": "dashed",
    "loop_exit": "emphasis",
    "exception": "security",
    "return": "emphasis",
    "finally": "dashed",
}


def load_json(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8-sig"))
    if not isinstance(data, dict):
        raise ValueError(f"JSON_ROOT_MUST_BE_OBJECT={path}")
    return data


def lane_for(node: dict) -> str:
    kind = node["kind"]
    if kind in {"setup", "source"}:
        return "setup"
    if kind in {"loop", "decision", "try", "except", "exception"}:
        return "control"
    if kind in {"output", "return"}:
        return "output"
    return "process"


def is_import_node(node: dict) -> bool:
    code = str(node.get("code") or "").lstrip()
    return node.get("kind") == "setup" and (
        code.startswith("import ") or code.startswith("from ")
    )


def hidden(node: dict) -> bool:
    return node["kind"] in HIDDEN_KINDS or is_import_node(node)


def projection_rank(node: dict) -> tuple[int, int, str]:
    line = int((node.get("code_span") or {}).get("start_line") or 0)
    line = line if line > 0 else 10**9
    kind_priority = {
        "source": 0,
        "loop": 1,
        "decision": 2,
        "try": 2,
        "except": 3,
        "setup": 4,
        "process": 5,
        "output": 6,
        "return": 6,
    }.get(node.get("kind"), 9)
    return (line, kind_priority, node["id"])


def select_scope(ir: dict, scope_id: str | None) -> dict:
    wanted = scope_id or ir.get("primary_scope_id")
    matches = [scope for scope in ir.get("scopes") or [] if scope.get("id") == wanted]
    if len(matches) != 1:
        raise ValueError(f"ARCHIFY_SCOPE_NOT_FOUND={wanted}")
    return matches[0]


def projected_paths(scope: dict, visible_ids: set[str]) -> list[dict]:
    nodes = {row["id"]: row for row in scope["nodes"]}
    outgoing: dict[str, list[dict]] = defaultdict(list)
    for edge in scope["edges"]:
        outgoing[edge["from"]].append(edge)

    rows: list[dict] = []
    seen: set[tuple[str, str, tuple[str, ...]]] = set()

    for source_id in sorted(visible_ids):
        queue = deque((edge["to"], [edge]) for edge in outgoing.get(source_id, []))
        while queue:
            current, path = queue.popleft()
            if current in visible_ids:
                roles = tuple(
                    edge["role"] for edge in path
                    if edge.get("role") in IMPORTANT_ROLES
                )
                key = (source_id, current, roles)
                if key not in seen and source_id != current:
                    seen.add(key)
                    rows.append({
                        "from": source_id,
                        "to": current,
                        "path": path,
                        "roles": list(roles),
                    })
                continue

            if current not in nodes:
                continue
            for edge in outgoing.get(current, []):
                if len(path) < len(nodes) + 2:
                    queue.append((edge["to"], path + [edge]))

    return rows


def label_for_path(path_row: dict, locale: str) -> str:
    labels = []
    for edge in path_row["path"]:
        role = edge.get("role")
        raw = str(((edge.get("label") or {}).get(locale)) or "").strip()
        if role in IMPORTANT_ROLES and raw and raw not in labels:
            labels.append(raw)
    return " · ".join(labels[:2])


def role_for_path(path_row: dict) -> str:
    roles = path_row["roles"]
    return roles[-1] if roles else "next"


def build_archify_workflow(
    ir: dict,
    *,
    scope_id: str | None = None,
    locale: str = "ko",
    output_name: str = "python_reading_flow.html",
) -> dict:
    if locale not in {"ko", "en"}:
        raise ValueError(f"UNSUPPORTED_LOCALE={locale}")

    scope = select_scope(ir, scope_id)
    source_nodes = {row["id"]: row for row in scope["nodes"]}
    visible = [row for row in scope["nodes"] if not hidden(row)]
    visible.sort(key=projection_rank)

    if not visible:
        raise ValueError("ARCHIFY_NO_VISIBLE_NODES")
    if len(visible) > 18:
        raise ValueError(f"ARCHIFY_SCOPE_NEEDS_SEGMENTATION={len(visible)}")

    col_by_id: dict[str, int] = {}
    occupied: set[tuple[str, int]] = set()
    previous_col = 0
    for index, node in enumerate(visible):
        lane = lane_for(node)
        preferred = min(5, max(previous_col, index))
        candidates = list(range(preferred, 6)) + list(range(0, preferred))
        col = next((c for c in candidates if (lane, c) not in occupied), None)
        if col is None:
            raise ValueError(f"ARCHIFY_LANE_NEEDS_SEGMENTATION={lane}:{node['id']}")
        occupied.add((lane, col))
        col_by_id[node["id"]] = col
        previous_col = min(5, col)

    visible_ids = {row["id"] for row in visible}
    paths = projected_paths(scope, visible_ids)

    components = []
    for node in visible:
        label = str((node.get("label") or {}).get(locale) or node["kind"])
        code = str(node.get("code") or "")
        components.append({
            "id": node["id"],
            "lane": lane_for(node),
            "col": col_by_id[node["id"]],
            "type": TYPE_BY_KIND.get(node["kind"], "backend"),
            "label": label,
            "sublabel": code[:48],
            "width": 96,
        })

    edges = []
    for index, row in enumerate(paths, start=1):
        src = source_nodes[row["from"]]
        dst = source_nodes[row["to"]]
        src_lane = LANE_ORDER.index(lane_for(src))
        dst_lane = LANE_ORDER.index(lane_for(dst))
        src_col = col_by_id[row["from"]]
        dst_col = col_by_id[row["to"]]
        role = role_for_path(row)
        label = label_for_path(row, locale)
        edge = {
            "id": f"p{index:03d}",
            "from": row["from"],
            "to": row["to"],
            "variant": VARIANT_BY_ROLE.get(role, "default"),
        }
        if label:
            edge["label"] = label

        if dst_col < src_col or role in {"continue", "loop_back", "break"}:
            edge.update({
                "route": "bottom-channel",
                "fromSide": "bottom",
                "toSide": "bottom",
            })
            if label:
                edge["labelSegment"] = 1
                edge["labelDy"] = 2
        elif abs(dst_lane - src_lane) > 1:
            edge.update({
                "route": "outside-right",
                "fromSide": "right",
                "toSide": "right",
            })
            if label:
                edge["labelSegment"] = 1
        elif src_lane != dst_lane:
            edge["route"] = "drop"
            if label:
                edge["labelSegment"] = 1

        edges.append(edge)

    focus_all = [node["id"] for node in visible]
    views = [{
        "id": "whole-flow",
        "label": "전체 실행 흐름" if locale == "ko" else "Whole execution flow",
        "focus": focus_all,
        "note": (
            "코드의 주요 실행 경로를 처음부터 결과까지 따라갑니다."
            if locale == "ko"
            else "Follow the main execution path from setup to result."
        ),
    }]

    control_ids = [
        node["id"] for node in visible
        if node["kind"] in {"loop", "decision", "try", "except"}
    ]
    if control_ids:
        views.append({
            "id": "control-flow",
            "label": "조건·반복 보기" if locale == "ko" else "Branches and loops",
            "focus": control_ids,
            "note": (
                "조건, 반복, 예외 경계를 중심으로 봅니다."
                if locale == "ko"
                else "Focus on decisions, loops, and exception boundaries."
            ),
        })

    process_ids = [
        node["id"] for node in visible
        if node["kind"] in {"source", "process", "output", "return"}
    ]
    if process_ids:
        views.append({
            "id": "data-to-result",
            "label": "처리와 결과" if locale == "ko" else "Processing to result",
            "focus": process_ids,
            "note": (
                "입력 준비가 처리와 결과로 이어지는 경로를 봅니다."
                if locale == "ko"
                else "Follow prepared input through processing to the result."
            ),
        })

    imports = [
        node["code"] for node in scope["nodes"]
        if is_import_node(node) and node.get("code")
    ]
    title = (
        f"{scope['qualified_name']} 실행 흐름"
        if locale == "ko"
        else f"{scope['qualified_name']} execution flow"
    )

    return {
        "schema_version": 1,
        "diagram_type": "workflow",
        "meta": {
            "title": title,
            "subtitle": (
                "Python Reading Graph IR에서 생성된 학습용 실행 흐름"
                if locale == "ko"
                else "Learner execution flow projected from Python Reading Graph IR"
            ),
            "animation": "trace",
            "visual_preset": "signal-flow",
            "quality_profile": "standard",
            "views": views,
            "output": output_name,
        },
        "lanes": [
            {"id": lane, "label": LANE_LABELS[locale][lane]}
            for lane in LANE_ORDER
        ],
        "phases": [],
        "groups": [],
        "nodes": components,
        "edges": edges,
        "cards": [
            {
                "dot": "cyan",
                "title": "Source of Truth",
                "items": [
                    "Python Reading Graph IR",
                    f"scope: {scope['qualified_name']}",
                ],
            },
            {
                "dot": "amber",
                "title": "Hidden structure",
                "items": (
                    imports[:4]
                    + [
                        "start/end/merge/continue/break nodes may be collapsed for the learner view."
                    ]
                ),
            },
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Project Python Reading Graph IR v0.1 to Archify Workflow JSON."
    )
    parser.add_argument("ir", type=Path)
    parser.add_argument("--scope")
    parser.add_argument("--locale", choices=["ko", "en"], default="ko")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--html-output-name", default="python_reading_flow.html")
    args = parser.parse_args()

    ir = load_json(args.ir)
    artifact = build_archify_workflow(
        ir,
        scope_id=args.scope,
        locale=args.locale,
        output_name=args.html_output_name,
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(artifact, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"OUTPUT={args.output}")
    print(f"NODE_COUNT={len(artifact['nodes'])}")
    print(f"EDGE_COUNT={len(artifact['edges'])}")
    print("RESULT=PASS_PYTHON_READING_ARCHIFY_PROJECTION_V0_1")


if __name__ == "__main__":
    main()

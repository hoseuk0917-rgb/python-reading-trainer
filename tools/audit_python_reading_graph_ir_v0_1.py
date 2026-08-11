from __future__ import annotations

from python_reading_graph_ir_v0_1 import build_python_reading_graph_ir


CASES = {
    "loop_continue": """import json
from pathlib import Path

rows = []
for line in Path(\"manifest.jsonl\").read_text(encoding=\"utf-8\").splitlines():
    if not line.strip():
        continue
    rows.append(json.loads(line))

print(len(rows))
""",
    "if_else": """score = 82
if score >= 80:
    grade = \"B\"
else:
    grade = \"C\"
print(grade)
""",
    "function_return": """def normalize_name(name):
    cleaned = name.strip().lower()
    return cleaned
""",
    "try_except": """try:
    value = int(text)
    print(value)
except ValueError:
    print(\"invalid\")
""",
    "class_method": """class Counter:
    def increment(self, value):
        result = value + 1
        return result
""",
}


def scope_by_kind(ir, kind):
    return [scope for scope in ir["scopes"] if scope["kind"] == kind]


def kinds(scope):
    return {node["kind"] for node in scope["nodes"]}


def edge_roles(scope):
    return {edge["role"] for edge in scope["edges"]}


def calls(ir):
    return {item["call"] for item in ir["indexes"]["calls"]}


def main() -> None:
    artifacts = {
        name: build_python_reading_graph_ir(source, f"{name}.py")
        for name, source in CASES.items()
    }

    loop = artifacts["loop_continue"]
    loop_scope = scope_by_kind(loop, "module")[0]
    assert {"loop", "decision", "continue", "process", "output"} <= kinds(loop_scope)
    assert {"loop_body", "continue", "loop_back", "loop_exit"} <= edge_roles(loop_scope)
    assert "json.loads" in calls(loop)
    assert "print" in calls(loop)

    branch = artifacts["if_else"]
    branch_scope = scope_by_kind(branch, "module")[0]
    assert "decision" in kinds(branch_scope)
    assert {"true", "false"} <= edge_roles(branch_scope)

    function = artifacts["function_return"]
    function_scopes = scope_by_kind(function, "function")
    assert len(function_scopes) == 1
    assert "return" in kinds(function_scopes[0])
    assert function["primary_scope_id"] == function_scopes[0]["id"]

    exc = artifacts["try_except"]
    exc_scope = scope_by_kind(exc, "module")[0]
    assert {"try", "except"} <= kinds(exc_scope)
    assert "exception" in edge_roles(exc_scope)

    cls = artifacts["class_method"]
    method_scopes = scope_by_kind(cls, "method")
    assert len(method_scopes) == 1
    assert method_scopes[0]["qualified_name"] == "Counter.increment"
    assert "return" in kinds(method_scopes[0])
    assert cls["primary_scope_id"] == method_scopes[0]["id"]

    for name, artifact in artifacts.items():
        for scope in artifact["scopes"]:
            node_ids = {node["id"] for node in scope["nodes"]}
            assert len(node_ids) == len(scope["nodes"]), f"duplicate nodes: {name}:{scope['id']}"
            edge_ids = {edge["id"] for edge in scope["edges"]}
            assert len(edge_ids) == len(scope["edges"]), f"duplicate edges: {name}:{scope['id']}"
            for edge in scope["edges"]:
                assert edge["from"] in node_ids, f"unknown edge source: {name}:{edge}"
                assert edge["to"] in node_ids, f"unknown edge target: {name}:{edge}"

        print(
            f"CASE={name} "
            f"SCOPES={len(artifact['scopes'])} "
            f"CALLS={len(artifact['indexes']['calls'])} "
            f"DATA_DEPS={len(artifact['indexes']['data_dependencies'])}"
        )

    print("CASES=5")
    print("RESULT=PASS_PYTHON_READING_GRAPH_IR_V0_1_AUDIT")


if __name__ == "__main__":
    main()

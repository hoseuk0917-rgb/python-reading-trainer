from __future__ import annotations

import argparse
import ast
import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path

VERSION = "v0.1"
MUTATORS = {
    "append", "extend", "insert", "remove", "pop", "clear", "sort", "reverse",
    "update", "setdefault", "add", "discard",
}


def text(node: ast.AST | None) -> str:
    if node is None:
        return ""
    try:
        return ast.unparse(node)
    except Exception:
        return node.__class__.__name__


def segment(source: str, node: ast.AST) -> str:
    return (ast.get_source_segment(source, node) or text(node)).strip()


def call_name(node: ast.AST) -> str:
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        head = call_name(node.value)
        return f"{head}.{node.attr}" if head else node.attr
    if isinstance(node, ast.Call):
        return call_name(node.func)
    return text(node)


class Facts(ast.NodeVisitor):
    def __init__(self) -> None:
        self.reads: set[str] = set()
        self.writes: set[str] = set()
        self.calls: set[str] = set()

    def visit_Name(self, node: ast.Name) -> None:
        if isinstance(node.ctx, ast.Load):
            self.reads.add(node.id)
        elif isinstance(node.ctx, (ast.Store, ast.Del)):
            self.writes.add(node.id)
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call) -> None:
        self.calls.add(call_name(node.func))
        if (
            isinstance(node.func, ast.Attribute)
            and isinstance(node.func.value, ast.Name)
            and node.func.attr in MUTATORS
        ):
            self.writes.add(node.func.value.id)
        self.generic_visit(node)


def facts(node: ast.AST | None) -> dict:
    if node is None:
        return {"reads": [], "writes": [], "calls": []}
    visitor = Facts()
    visitor.visit(node)
    return {
        "reads": sorted(visitor.reads),
        "writes": sorted(visitor.writes),
        "calls": sorted(x for x in visitor.calls if x),
    }


def targets(node: ast.AST) -> list[str]:
    raw: list[ast.AST] = []
    if isinstance(node, ast.Assign):
        raw = list(node.targets)
    elif isinstance(node, ast.AnnAssign):
        raw = [node.target]
    elif isinstance(node, ast.AugAssign):
        raw = [node.target]
    out: list[str] = []
    for item in raw:
        if isinstance(item, ast.Name):
            out.append(item.id)
        elif isinstance(item, (ast.Tuple, ast.List)):
            out.extend(x.id for x in item.elts if isinstance(x, ast.Name))
        else:
            out.append(text(item))
    return [x for x in out if x]


def labels(node: ast.stmt) -> tuple[str, str, str]:
    if isinstance(node, (ast.Import, ast.ImportFrom)):
        return "setup", "의존성 불러오기", "Load dependency"
    if isinstance(node, (ast.Assign, ast.AnnAssign, ast.AugAssign)):
        name = ", ".join(targets(node)[:3]) or "값"
        return "setup", f"{name} 준비", f"Prepare {name}"
    if isinstance(node, ast.For):
        name = text(node.target)
        return "loop", f"{name} 반복", f"Loop over {name}"
    if isinstance(node, ast.While):
        return "loop", "while 반복", "While loop"
    if isinstance(node, ast.If):
        return "decision", "조건 확인", "Check condition"
    if isinstance(node, ast.Continue):
        return "continue", "다음 반복", "Continue loop"
    if isinstance(node, ast.Break):
        return "break", "반복 종료", "Break loop"
    if isinstance(node, ast.Return):
        return "return", "값 반환", "Return value"
    if isinstance(node, ast.Raise):
        return "exception", "예외 발생", "Raise exception"
    if isinstance(node, ast.Try):
        return "try", "예외 처리 구간", "Try protected block"
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        return "definition", f"{node.name} 함수 정의", f"Define {node.name}"
    if isinstance(node, ast.ClassDef):
        return "definition", f"{node.name} 클래스 정의", f"Define class {node.name}"
    if isinstance(node, ast.Expr) and isinstance(node.value, ast.Call):
        name = call_name(node.value.func)
        if name == "print":
            return "output", "결과 출력", "Print result"
        return "process", f"{name} 호출", f"Call {name}"
    if isinstance(node, ast.With):
        return "process", "컨텍스트 구간 실행", "Enter context block"
    return "process", node.__class__.__name__, node.__class__.__name__


@dataclass
class Loop:
    header: str
    breaks: list[str] = field(default_factory=list)


@dataclass
class Scope:
    id: str
    kind: str
    name: str
    qualified_name: str
    nodes: list[dict] = field(default_factory=list)
    edges: list[dict] = field(default_factory=list)
    returns: list[str] = field(default_factory=list)
    node_no: int = 0
    edge_no: int = 0
    start: str = ""
    end: str = ""

    def node(
        self,
        source: str,
        kind: str,
        ko: str,
        en: str,
        ast_node: ast.AST | None = None,
        *,
        code: str | None = None,
        role: str | None = None,
        confidence: str = "exact",
        fact_override: dict | None = None,
    ) -> str:
        self.node_no += 1
        node_id = f"{self.id}:n{self.node_no:03d}"
        start = int(getattr(ast_node, "lineno", 0) or 0) if ast_node else 0
        end = int(getattr(ast_node, "end_lineno", start) or start) if ast_node else 0
        self.nodes.append({
            "id": node_id,
            "kind": kind,
            "semantic_role": role or kind,
            "label": {"ko": ko, "en": en},
            "code_span": {"start_line": start, "end_line": end},
            "code": code if code is not None else (segment(source, ast_node) if ast_node else ""),
            "facts": fact_override if fact_override is not None else facts(ast_node),
            "confidence": confidence,
        })
        return node_id

    def edge(
        self, src: str, dst: str, role: str = "next",
        ko: str = "", en: str = "", confidence: str = "exact"
    ) -> None:
        self.edge_no += 1
        self.edges.append({
            "id": f"{self.id}:e{self.edge_no:03d}",
            "from": src,
            "to": dst,
            "edge_type": "control",
            "role": role,
            "label": {"ko": ko, "en": en},
            "confidence": confidence,
        })


class Builder:
    def __init__(self, source: str, source_name: str) -> None:
        self.source = source
        self.source_name = source_name
        self.scopes: list[Scope] = []

    def new_scope(self, kind: str, name: str, qualified: str) -> Scope:
        scope = Scope(f"s{len(self.scopes)+1:03d}", kind, name, qualified)
        scope.start = scope.node(self.source, "start", "시작", "Start", role="scope_start")
        scope.end = scope.node(self.source, "end", "끝", "End", role="scope_end")
        self.scopes.append(scope)
        return scope

    def connect(
        self, scope: Scope, frontier: list[str], target: str,
        role: str = "next", ko: str = "", en: str = "", confidence: str = "exact"
    ) -> None:
        for src in frontier:
            scope.edge(src, target, role, ko, en, confidence)

    def block(
        self, scope: Scope, body: list[ast.stmt], frontier: list[str],
        loop: Loop | None = None, first: tuple[str, str, str] = ("next", "", "")
    ) -> list[str]:
        current = frontier
        first_pending = True
        for stmt in body:
            incoming = first if first_pending else ("next", "", "")
            current = self.statement(scope, stmt, current, loop, *incoming)
            first_pending = False
        return current

    def statement(
        self, scope: Scope, stmt: ast.stmt, frontier: list[str], loop: Loop | None,
        incoming_role: str, incoming_ko: str, incoming_en: str
    ) -> list[str]:
        kind, ko, en = labels(stmt)

        if isinstance(stmt, ast.If):
            dec = scope.node(
                self.source, "decision", ko, en, stmt.test,
                code=segment(self.source, stmt.test), role="decision"
            )
            self.connect(scope, frontier, dec, incoming_role, incoming_ko, incoming_en)
            yes = self.block(scope, stmt.body, [dec], loop, ("true", "참", "true"))
            no = (
                self.block(scope, stmt.orelse, [dec], loop, ("false", "거짓", "false"))
                if stmt.orelse else [dec]
            )
            merge = scope.node(
                self.source, "merge", "조건 이후", "After condition", role="branch_merge"
            )
            if yes:
                self.connect(scope, yes, merge, "merge")
            if no == [dec]:
                scope.edge(dec, merge, "false", "거짓", "false")
            elif no:
                self.connect(scope, no, merge, "merge")
            return [merge]

        if isinstance(stmt, ast.For):
            src = scope.node(
                self.source, "source", "반복 입력 준비", "Prepare loop input",
                stmt.iter, code=segment(self.source, stmt.iter), role="loop_source"
            )
            self.connect(scope, frontier, src, incoming_role, incoming_ko, incoming_en)
            write_names = []
            if isinstance(stmt.target, ast.Name):
                write_names = [stmt.target.id]
            elif isinstance(stmt.target, (ast.Tuple, ast.List)):
                write_names = [x.id for x in stmt.target.elts if isinstance(x, ast.Name)]
            header = scope.node(
                self.source, "loop", ko, en, stmt.target,
                code=f"for {text(stmt.target)}", role="loop_header",
                fact_override={"reads": [], "writes": sorted(write_names), "calls": []},
            )
            scope.edge(src, header)
            return self.loop_body(scope, stmt, header, loop)

        if isinstance(stmt, ast.While):
            header = scope.node(
                self.source, "loop", ko, en, stmt.test,
                code=f"while {text(stmt.test)}", role="loop_header"
            )
            self.connect(scope, frontier, header, incoming_role, incoming_ko, incoming_en)
            return self.loop_body(scope, stmt, header, loop)

        if isinstance(stmt, ast.Continue):
            node = scope.node(self.source, kind, ko, en, stmt, role="continue")
            self.connect(scope, frontier, node, incoming_role, incoming_ko, incoming_en)
            if loop:
                scope.edge(node, loop.header, "continue", "continue", "continue")
            return []

        if isinstance(stmt, ast.Break):
            node = scope.node(self.source, kind, ko, en, stmt, role="break")
            self.connect(scope, frontier, node, incoming_role, incoming_ko, incoming_en)
            if loop:
                loop.breaks.append(node)
            return []

        if isinstance(stmt, ast.Return):
            node = scope.node(self.source, kind, ko, en, stmt, role="return")
            self.connect(scope, frontier, node, incoming_role, incoming_ko, incoming_en)
            scope.returns.append(node)
            return []

        if isinstance(stmt, ast.Try):
            gate = scope.node(
                self.source, "try", ko, en, stmt, code="try",
                role="exception_boundary", confidence="structural"
            )
            self.connect(scope, frontier, gate, incoming_role, incoming_ko, incoming_en)
            exits = self.block(scope, stmt.body, [gate], loop, ("try_body", "정상 경로", "normal path"))
            for handler in stmt.handlers:
                exc = text(handler.type) if handler.type else "Exception"
                catch = scope.node(
                    self.source, "except", f"{exc} 처리", f"Handle {exc}", handler,
                    code=f"except {exc}", role="exception_handler", confidence="structural"
                )
                scope.edge(gate, catch, "exception", "예외", "exception", "structural")
                exits += self.block(scope, handler.body, [catch], loop, ("handler_body", "", ""))
            merge = scope.node(
                self.source, "merge", "예외 처리 이후", "After exception handling",
                role="exception_merge"
            )
            self.connect(scope, exits or [gate], merge, "merge")
            current = [merge]
            if stmt.orelse:
                current = self.block(scope, stmt.orelse, current, loop, ("try_else", "", ""))
            if stmt.finalbody:
                current = self.block(scope, stmt.finalbody, current, loop, ("finally", "항상 실행", "finally"))
            return current

        node = scope.node(self.source, kind, ko, en, stmt)
        self.connect(scope, frontier, node, incoming_role, incoming_ko, incoming_en)
        return [node]

    def loop_body(
        self, scope: Scope, stmt: ast.For | ast.While, header: str, outer: Loop | None
    ) -> list[str]:
        context = Loop(header)
        exits = self.block(scope, stmt.body, [header], context, ("loop_body", "반복 실행", "iterate"))
        for node in exits:
            scope.edge(node, header, "loop_back", "다음 반복", "next iteration")
        after = scope.node(self.source, "merge", "반복 이후", "After loop", role="loop_exit")
        scope.edge(header, after, "loop_exit", "반복 종료", "loop finished")
        for node in context.breaks:
            scope.edge(node, after, "break", "break", "break")
        current = [after]
        if stmt.orelse:
            current = self.block(
                scope, stmt.orelse, current, outer,
                ("loop_else", "정상 종료", "normal completion")
            )
        return current

    def build_scope(
        self, body: list[ast.stmt], kind: str, name: str, qualified: str
    ) -> Scope:
        scope = self.new_scope(kind, name, qualified)
        exits = self.block(scope, body, [scope.start])
        for node in exits:
            scope.edge(node, scope.end)
        for node in scope.returns:
            scope.edge(node, scope.end, "return")
        return scope

    def nested(self, tree: ast.Module) -> None:
        def walk(body: list[ast.stmt], parent: str = "", in_class: bool = False) -> None:
            for stmt in body:
                if isinstance(stmt, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    qualified = f"{parent}.{stmt.name}" if parent else stmt.name
                    self.build_scope(stmt.body, "method" if in_class else "function", stmt.name, qualified)
                    walk(stmt.body, qualified, False)
                elif isinstance(stmt, ast.ClassDef):
                    qualified = f"{parent}.{stmt.name}" if parent else stmt.name
                    walk(stmt.body, qualified, True)
                elif isinstance(stmt, ast.If):
                    walk(stmt.body, parent, in_class); walk(stmt.orelse, parent, in_class)
                elif isinstance(stmt, (ast.For, ast.While)):
                    walk(stmt.body, parent, in_class); walk(stmt.orelse, parent, in_class)
                elif isinstance(stmt, ast.Try):
                    walk(stmt.body, parent, in_class)
                    for handler in stmt.handlers:
                        walk(handler.body, parent, in_class)
                    walk(stmt.orelse, parent, in_class); walk(stmt.finalbody, parent, in_class)
        walk(tree.body)

    def build(self) -> dict:
        tree = ast.parse(self.source, filename=self.source_name)
        module = self.build_scope(tree.body, "module", self.source_name, self.source_name)
        self.nested(tree)

        nested = [s for s in self.scopes if s.kind in {"function", "method"}]
        executable_module_nodes = [
            n for n in module.nodes if n["kind"] not in {"start", "end", "definition"}
        ]
        primary = nested[0].id if len(nested) == 1 and not executable_module_nodes else module.id

        call_index: list[dict] = []
        data_index: list[dict] = []
        for scope in self.scopes:
            last_writer: dict[str, str] = {}
            for node in scope.nodes:
                for name in node["facts"]["calls"]:
                    call_index.append({"scope_id": scope.id, "node_id": node["id"], "call": name})
                for name in node["facts"]["reads"]:
                    if name in last_writer and last_writer[name] != node["id"]:
                        data_index.append({
                            "scope_id": scope.id, "from": last_writer[name],
                            "to": node["id"], "name": name,
                        })
                for name in node["facts"]["writes"]:
                    last_writer[name] = node["id"]

        return {
            "schema_version": 1,
            "ir_type": "python_reading_graph",
            "generator_version": VERSION,
            "source": {
                "name": self.source_name,
                "language": "python",
                "sha256": hashlib.sha256(self.source.encode("utf-8")).hexdigest(),
                "line_count": len(self.source.splitlines()),
            },
            "authority": {
                "semantic_source": "python_ast",
                "renderer_authority": False,
                "rule": (
                    "The IR owns extracted code-reading semantics. Renderer-specific "
                    "layout, color, and routing must remain outside this IR."
                ),
            },
            "primary_scope_id": primary,
            "scopes": [{
                "id": s.id,
                "kind": s.kind,
                "name": s.name,
                "qualified_name": s.qualified_name,
                "start_node_id": s.start,
                "end_node_id": s.end,
                "nodes": s.nodes,
                "edges": s.edges,
                "summary": {"node_count": len(s.nodes), "edge_count": len(s.edges)},
            } for s in self.scopes],
            "lenses": {
                "execution": {
                    "source": "scopes[].nodes + scopes[].edges",
                    "preferred_renderer": "archify_workflow",
                },
                "data_flow": {
                    "source": "indexes.data_dependencies",
                    "preferred_renderer": "mermaid",
                    "evaluation_candidate": "archify_dataflow",
                },
                "call_dependency": {
                    "source": "indexes.calls",
                    "preferred_renderer": "mermaid",
                },
                "detail": {
                    "source": "nodes[].code + nodes[].facts + node labels",
                    "preferred_renderer": "trainer_inspector",
                },
            },
            "indexes": {"calls": call_index, "data_dependencies": data_index},
        }


def build_python_reading_graph_ir(source: str, source_name: str = "<memory>") -> dict:
    return Builder(source, source_name).build()


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Python Reading Graph IR v0.1.")
    parser.add_argument("source", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    source = args.source.read_text(encoding="utf-8-sig")
    artifact = build_python_reading_graph_ir(source, args.source.name)
    rendered = json.dumps(artifact, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
        print(f"OUTPUT={args.output}")
    else:
        print(rendered, end="")
    print(f"PRIMARY_SCOPE={artifact['primary_scope_id']}")
    print(f"SCOPE_COUNT={len(artifact['scopes'])}")
    print("RESULT=PASS_PYTHON_READING_GRAPH_IR_V0_1")


if __name__ == "__main__":
    main()

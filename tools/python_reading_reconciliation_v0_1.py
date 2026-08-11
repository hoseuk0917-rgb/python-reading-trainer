from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

from python_reading_graph_ir_v0_1 import build_python_reading_graph_ir

VERSION = "v0.1"

AUXILIARY_ROLES = {
    "scope_start",
    "scope_end",
    "branch_merge",
    "exception_merge",
    "loop_exit",
    "loop_source",
}

COMPATIBLE_FAMILIES = {
    ("process", "call"),
    ("call", "process"),
    ("output", "call"),
    ("call", "output"),
    ("setup", "process"),
    ("process", "setup"),
    ("setup", "call"),
    ("call", "setup"),
    ("exception", "raise"),
    ("raise", "exception"),
}


def normalize_code(value: Any) -> str:
    text = str(value or "").strip()
    text = re.sub(r"\s+", " ", text)
    return text.rstrip(":").strip()


def rule_family_from_code(code: str, title: str = "", fallback: str = "") -> str:
    text = normalize_code(code)
    low = text.lower()
    title_low = str(title or "").lower()

    if re.match(r"^(async\s+def|def)\s+", low) or re.match(r"^class\s+", low):
        return "definition"
    if re.match(r"^(if|elif)\b", low) or low == "else":
        return "decision"
    if re.match(r"^(for|while)\b", low):
        return "loop"
    if low == "continue":
        return "continue"
    if low == "break":
        return "break"
    if re.match(r"^return\b", low):
        return "return"
    if low == "try" or re.match(r"^(except|finally)\b", low):
        return "exception"
    if re.match(r"^raise\b", low):
        return "raise"
    if re.match(r"^(import|from)\b", low):
        return "setup"
    if re.match(r"^[A-Za-z_]\w*(?:\s*:\s*[^=]+)?\s*(?:=|\+=|-=|\*=|/=|//=|%=|\*\*=)", text):
        return "setup"
    if "print(" in low or "print " in low or "output" in title_low or "출력" in title_low:
        return "output"
    if re.search(r"[A-Za-z_][\w.]*\s*\(", text):
        return "call"

    fallback_low = str(fallback or "").lower()
    aliases = {
        "condition": "decision",
        "if": "decision",
        "elif": "decision",
        "else": "decision",
        "for": "loop",
        "while": "loop",
        "function": "definition",
        "python_function": "definition",
        "async_python_function": "definition",
        "method": "definition",
        "return": "return",
        "exception": "exception",
    }
    if fallback_low in aliases:
        return aliases[fallback_low]
    return "process"


def ast_family(node: dict[str, Any]) -> str:
    role = str(node.get("semantic_role") or node.get("kind") or "")
    kind = str(node.get("kind") or "")
    calls = list((node.get("facts") or {}).get("calls") or [])

    if role in AUXILIARY_ROLES:
        return "auxiliary"
    if role == "decision" or kind == "decision":
        return "decision"
    if role == "loop_header" or kind == "loop":
        return "loop"
    if role in {"continue", "break", "return"}:
        return role
    if role in {"exception_boundary", "exception_handler"} or kind in {"try", "except"}:
        return "exception"
    if kind == "exception" or role == "exception":
        return "raise"
    if kind == "definition" or role == "definition":
        return "definition"
    if kind == "setup" or role == "setup":
        return "setup"
    if kind == "output" or role == "output":
        return "output"
    if calls:
        return "call"
    return "process"


def families_compatible(left: str, right: str) -> bool:
    return left == right or (left, right) in COMPATIBLE_FAMILIES


def extract_ast_findings(ir: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    findings: list[dict[str, Any]] = []
    auxiliary: list[dict[str, Any]] = []

    for scope in ir.get("scopes") or []:
        scope_name = str(scope.get("qualified_name") or scope.get("name") or scope.get("id"))
        for node in scope.get("nodes") or []:
            span = node.get("code_span") or {}
            start = int(span.get("start_line") or 0)
            end = int(span.get("end_line") or start or 0)
            family = ast_family(node)
            item = {
                "node_id": node.get("id"),
                "scope_id": scope.get("id"),
                "scope": scope_name,
                "kind": node.get("kind"),
                "semantic_role": node.get("semantic_role"),
                "family": family,
                "start_line": start,
                "end_line": end,
                "code": normalize_code(node.get("code")),
                "label": node.get("label") or {},
                "confidence": node.get("confidence") or "exact",
            }

            if family == "auxiliary" or start <= 0:
                auxiliary.append(item)
            else:
                findings.append(item)

    return findings, auxiliary


def add_rule_finding(
    out: list[dict[str, Any]],
    *,
    source: str,
    line_no: Any,
    code: Any = "",
    title: Any = "",
    raw_kind: Any = "",
    scope_hint: Any = "",
) -> None:
    try:
        line = int(line_no or 0)
    except (TypeError, ValueError):
        line = 0
    if line <= 0:
        return

    code_text = normalize_code(code)
    title_text = normalize_code(title)
    family = rule_family_from_code(code_text, title_text, str(raw_kind or ""))

    out.append({
        "source": source,
        "line_no": line,
        "code": code_text,
        "title": title_text,
        "raw_kind": str(raw_kind or ""),
        "scope_hint": str(scope_hint or ""),
        "family": family,
    })


def extract_rule_findings(rule_analysis: dict[str, Any]) -> tuple[list[dict[str, Any]], int]:
    raw: list[dict[str, Any]] = []

    for step in rule_analysis.get("steps") or []:
        if not isinstance(step, dict):
            continue
        add_rule_finding(
            raw,
            source="steps",
            line_no=step.get("lineNo"),
            code=step.get("code"),
            title=step.get("titleKo") or step.get("title") or step.get("displayTitle"),
            raw_kind=step.get("kind") or step.get("category") or "",
        )

    for flow in rule_analysis.get("functionFlowV326A4") or []:
        if not isinstance(flow, dict):
            continue
        name = str(flow.get("name") or "")
        kind = str(flow.get("kind") or "function")
        line_no = flow.get("lineNo")
        prefix = "async def " if "async" in kind else "def "
        add_rule_finding(
            raw,
            source="functionFlow.definition",
            line_no=line_no,
            code=(prefix + name) if name else "",
            title=name,
            raw_kind=kind,
            scope_hint=name,
        )

        for item in flow.get("loops") or []:
            if isinstance(item, dict):
                add_rule_finding(
                    raw,
                    source="functionFlow.loop",
                    line_no=item.get("lineNo"),
                    code=item.get("code") or item.get("summary"),
                    title=item.get("summary"),
                    raw_kind=item.get("type") or "loop",
                    scope_hint=name,
                )

        for item in flow.get("conditions") or []:
            if isinstance(item, dict):
                condition = str(item.get("condition") or "")
                item_type = str(item.get("type") or "if")
                code = item.get("code") or (item_type + (" " + condition if condition else ""))
                add_rule_finding(
                    raw,
                    source="functionFlow.condition",
                    line_no=item.get("lineNo"),
                    code=code,
                    title=condition,
                    raw_kind=item_type,
                    scope_hint=name,
                )

        for item in flow.get("returns") or []:
            if isinstance(item, dict):
                expr = str(item.get("expr") or "")
                add_rule_finding(
                    raw,
                    source="functionFlow.return",
                    line_no=item.get("lineNo"),
                    code=item.get("code") or ("return " + expr if expr else "return"),
                    title=expr,
                    raw_kind="return",
                    scope_hint=name,
                )

    seen: set[tuple[Any, ...]] = set()
    deduped: list[dict[str, Any]] = []
    duplicate_count = 0
    for item in raw:
        key = (
            item["source"],
            item["line_no"],
            item["family"],
            item["code"].lower(),
            item["scope_hint"].lower(),
        )
        if key in seen:
            duplicate_count += 1
            continue
        seen.add(key)
        item = dict(item)
        item["rule_finding_id"] = f"r{len(deduped)+1:04d}"
        deduped.append(item)

    return deduped, duplicate_count


def code_similarity(rule_code: str, ast_code: str) -> int:
    left = normalize_code(rule_code).lower()
    right = normalize_code(ast_code).lower()
    if not left or not right:
        return 0
    if left == right:
        return 45
    if left in right or right in left:
        return 28

    left_tokens = set(re.findall(r"[A-Za-z_]\w*|==|!=|<=|>=|[-+*/%]=?", left))
    right_tokens = set(re.findall(r"[A-Za-z_]\w*|==|!=|<=|>=|[-+*/%]=?", right))
    if not left_tokens or not right_tokens:
        return 0
    overlap = len(left_tokens & right_tokens) / max(1, len(left_tokens | right_tokens))
    return int(overlap * 20)


def match_score(rule: dict[str, Any], ast_item: dict[str, Any]) -> int:
    line = int(rule["line_no"])
    start = int(ast_item["start_line"])
    end = int(ast_item["end_line"] or start)
    if line < start or line > end:
        return -1

    score = 0
    if line == start:
        score += 100
    else:
        score += 45

    if families_compatible(rule["family"], ast_item["family"]):
        score += 80
    else:
        score -= 35

    score += code_similarity(rule["code"], ast_item["code"])

    span = max(0, end - start)
    score -= min(span, 50)

    scope_hint = str(rule.get("scope_hint") or "").strip().lower()
    if scope_hint and scope_hint in str(ast_item.get("scope") or "").lower():
        score += 20

    return score


def reconcile_python_reading_analysis(
    source: str,
    rule_analysis: dict[str, Any],
    source_name: str = "<memory>",
) -> dict[str, Any]:
    ir = build_python_reading_graph_ir(source, source_name)
    ast_findings, auxiliary = extract_ast_findings(ir)
    rule_findings, rule_duplicate_count = extract_rule_findings(rule_analysis)

    matched_by_ast: dict[str, list[dict[str, Any]]] = defaultdict(list)
    unmatched_rules: list[dict[str, Any]] = []

    for rule in rule_findings:
        scored = sorted(
            (
                (match_score(rule, ast_item), ast_item)
                for ast_item in ast_findings
            ),
            key=lambda item: (
                item[0],
                -max(0, int(item[1]["end_line"]) - int(item[1]["start_line"])),
            ),
            reverse=True,
        )
        best_score, best_ast = scored[0] if scored else (-1, None)

        if best_ast is not None and best_score >= 100 and families_compatible(rule["family"], best_ast["family"]):
            evidence = dict(rule)
            evidence["match_score"] = best_score
            matched_by_ast[str(best_ast["node_id"])].append(evidence)
        else:
            overlaps = [
                item for item in ast_findings
                if int(item["start_line"]) <= int(rule["line_no"]) <= int(item["end_line"])
            ]
            diagnostic = dict(rule)
            diagnostic["status"] = "CONFLICT" if overlaps else "RULE_ONLY"
            diagnostic["auto_register"] = False
            diagnostic["overlapping_ast_node_ids"] = [item["node_id"] for item in overlaps]
            unmatched_rules.append(diagnostic)

    canonical: list[dict[str, Any]] = []
    for ast_item in ast_findings:
        node_id = str(ast_item["node_id"])
        evidences = matched_by_ast.get(node_id, [])
        canonical.append({
            "canonical_id": f"ast:{node_id}",
            "status": "AGREED" if evidences else "AST_ONLY",
            "auto_register": True,
            "ast": ast_item,
            "rule_evidence": evidences,
            "evidence_sources": ["python_ast"] + (["rule_analyzer"] if evidences else []),
        })

    canonical_ids = [item["canonical_id"] for item in canonical]
    if len(canonical_ids) != len(set(canonical_ids)):
        raise AssertionError("duplicate canonical IDs after reconciliation")

    execution_node_ids = [item["ast"]["node_id"] for item in canonical]
    if len(execution_node_ids) != len(set(execution_node_ids)):
        raise AssertionError("duplicate execution node IDs after reconciliation")

    summary = {
        "agreed": sum(1 for item in canonical if item["status"] == "AGREED"),
        "ast_only": sum(1 for item in canonical if item["status"] == "AST_ONLY"),
        "rule_only": sum(1 for item in unmatched_rules if item["status"] == "RULE_ONLY"),
        "conflict": sum(1 for item in unmatched_rules if item["status"] == "CONFLICT"),
        "ast_auxiliary": len(auxiliary),
        "rule_findings": len(rule_findings),
        "rule_duplicates_removed": rule_duplicate_count,
        "canonical_execution_nodes": len(canonical),
    }

    return {
        "schema_version": 1,
        "reconciliation_version": VERSION,
        "source": ir.get("source") or {},
        "authority": {
            "canonical_structure": "python_ast",
            "rule_analyzer_role": "enrichment_and_cross_check",
            "rule_only_auto_registration": False,
            "conflict_auto_registration": False,
            "dedupe_rule": (
                "One canonical execution record per AST node. Multiple rule findings "
                "matching the same AST node are merged into rule_evidence[]."
            ),
        },
        "summary": summary,
        "canonical_findings": canonical,
        "diagnostics": unmatched_rules,
        "ast_auxiliary": auxiliary,
        "execution_projection_node_ids": execution_node_ids,
        "graph_ir": ir,
    }


def load_envelope_from_stdin() -> dict[str, Any]:
    raw = sys.stdin.read()
    if not raw.strip():
        raise ValueError("stdin JSON envelope is empty")
    value = json.loads(raw)
    if not isinstance(value, dict):
        raise ValueError("stdin JSON envelope must be an object")
    return value


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Reconcile Python rule-based analysis with Python Reading Graph IR v0.1."
    )
    parser.add_argument("--stdin", action="store_true", help="Read source and rule_analysis from a JSON envelope on stdin.")
    parser.add_argument("--source", type=Path)
    parser.add_argument("--rule-analysis", type=Path)
    parser.add_argument("--source-name", default="")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    if args.stdin:
        envelope = load_envelope_from_stdin()
        source = str(envelope.get("source") or envelope.get("code") or "")
        rule_analysis = envelope.get("rule_analysis") or envelope.get("ruleAnalysis") or {}
        source_name = str(envelope.get("source_name") or envelope.get("sourceName") or "<memory>")
    else:
        if not args.source or not args.rule_analysis:
            parser.error("--source and --rule-analysis are required unless --stdin is used")
        source = args.source.read_text(encoding="utf-8-sig")
        rule_analysis = json.loads(args.rule_analysis.read_text(encoding="utf-8-sig"))
        source_name = args.source_name or args.source.name

    if not source.strip():
        raise ValueError("Python source is empty")
    if not isinstance(rule_analysis, dict):
        raise ValueError("rule_analysis must be a JSON object")

    artifact = reconcile_python_reading_analysis(source, rule_analysis, source_name)
    rendered = json.dumps(artifact, ensure_ascii=False, indent=2) + "\n"

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
        print(f"OUTPUT={args.output}")
    else:
        print(rendered, end="")

    print(
        "RESULT=PASS_PYTHON_READING_RECONCILIATION_V0_1 "
        f"AGREED={artifact['summary']['agreed']} "
        f"AST_ONLY={artifact['summary']['ast_only']} "
        f"RULE_ONLY={artifact['summary']['rule_only']} "
        f"CONFLICT={artifact['summary']['conflict']} "
        f"RULE_DUPLICATES_REMOVED={artifact['summary']['rule_duplicates_removed']}"
    )


if __name__ == "__main__":
    main()

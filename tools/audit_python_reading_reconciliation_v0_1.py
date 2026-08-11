from __future__ import annotations

import copy
import json
import subprocess
from pathlib import Path

from python_reading_reconciliation_v0_1 import reconcile_python_reading_analysis

ROOT = Path(__file__).resolve().parents[1]
RULE_EXPORTER = ROOT / "tools" / "export_code_explainer_rule_analysis_v0_1.js"

CASES = {
    "loop_continue": """import json
from pathlib import Path

rows = []
for line in Path("manifest.jsonl").read_text(encoding="utf-8").splitlines():
    if not line.strip():
        continue
    rows.append(json.loads(line))

print(len(rows))
""",
    "if_else": """score = 82
if score >= 80:
    grade = "B"
else:
    grade = "C"
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
    print("invalid")
""",
    "class_method": """class Counter:
    def increment(self, value):
        result = value + 1
        return result
""",
}


def run_rule_analyzer(source: str) -> dict:
    completed = subprocess.run(
        ["node", str(RULE_EXPORTER), "--language", "python"],
        input=source,
        text=True,
        encoding="utf-8",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=ROOT,
        check=False,
    )
    assert completed.returncode == 0, completed.stderr
    value = json.loads(completed.stdout)
    assert isinstance(value, dict)
    assert value.get("language") == "python"
    return value


def assert_registration_invariants(artifact: dict) -> None:
    canonical = artifact["canonical_findings"]
    diagnostics = artifact["diagnostics"]
    projection = artifact["execution_projection_node_ids"]

    canonical_ids = [item["canonical_id"] for item in canonical]
    ast_node_ids = [item["ast"]["node_id"] for item in canonical]

    assert len(canonical_ids) == len(set(canonical_ids)), "duplicate canonical IDs"
    assert len(ast_node_ids) == len(set(ast_node_ids)), "duplicate AST registration"
    assert projection == ast_node_ids, "projection must be AST-canonical only"
    assert all(item["status"] in {"AGREED", "AST_ONLY"} for item in canonical)
    assert all(item["auto_register"] is True for item in canonical)
    assert all(item["status"] in {"RULE_ONLY", "CONFLICT"} for item in diagnostics)
    assert all(item["auto_register"] is False for item in diagnostics)

    evidence_ids = []
    for item in canonical:
        for evidence in item["rule_evidence"]:
            evidence_ids.append(evidence["rule_finding_id"])
    assert len(evidence_ids) == len(set(evidence_ids)), "one rule finding matched more than one AST node"


def duplicate_rule_evidence(rule_analysis: dict) -> dict:
    duplicated = copy.deepcopy(rule_analysis)
    if isinstance(duplicated.get("steps"), list):
        duplicated["steps"] = duplicated["steps"] + copy.deepcopy(duplicated["steps"])
    if isinstance(duplicated.get("functionFlowV326A4"), list):
        duplicated["functionFlowV326A4"] = (
            duplicated["functionFlowV326A4"]
            + copy.deepcopy(duplicated["functionFlowV326A4"])
        )
    return duplicated


def main() -> None:
    for name, source in CASES.items():
        rule = run_rule_analyzer(source)
        base = reconcile_python_reading_analysis(source, rule, f"{name}.py")
        assert_registration_invariants(base)

        duplicate = reconcile_python_reading_analysis(
            source,
            duplicate_rule_evidence(rule),
            f"{name}.py",
        )
        assert_registration_invariants(duplicate)

        assert duplicate["summary"]["canonical_execution_nodes"] == base["summary"]["canonical_execution_nodes"]
        assert duplicate["execution_projection_node_ids"] == base["execution_projection_node_ids"]
        assert duplicate["summary"]["agreed"] == base["summary"]["agreed"]
        assert duplicate["summary"]["ast_only"] == base["summary"]["ast_only"]
        if rule.get("steps") or rule.get("functionFlowV326A4"):
            assert duplicate["summary"]["rule_duplicates_removed"] > base["summary"]["rule_duplicates_removed"]

        print(
            f"CASE={name} "
            f"AGREED={base['summary']['agreed']} "
            f"AST_ONLY={base['summary']['ast_only']} "
            f"RULE_ONLY={base['summary']['rule_only']} "
            f"CONFLICT={base['summary']['conflict']} "
            f"CANONICAL={base['summary']['canonical_execution_nodes']} "
            f"DUPLICATE_INJECTION=PASS"
        )

    source = CASES["if_else"]
    rule = run_rule_analyzer(source)
    baseline = reconcile_python_reading_analysis(source, rule, "if_else.py")

    rule_only_input = copy.deepcopy(rule)
    rule_only_input.setdefault("steps", []).append({
        "lineNo": 999,
        "code": "ghost_call()",
        "title": "synthetic unmatched rule finding",
    })
    rule_only = reconcile_python_reading_analysis(source, rule_only_input, "if_else.py")
    assert rule_only["summary"]["rule_only"] >= baseline["summary"]["rule_only"] + 1
    assert rule_only["execution_projection_node_ids"] == baseline["execution_projection_node_ids"]

    conflict_input = copy.deepcopy(rule)
    conflict_input.setdefault("steps", []).append({
        "lineNo": 1,
        "code": "return impossible_here",
        "title": "synthetic conflicting return",
    })
    conflict = reconcile_python_reading_analysis(source, conflict_input, "if_else.py")
    assert conflict["summary"]["conflict"] >= baseline["summary"]["conflict"] + 1
    assert conflict["execution_projection_node_ids"] == baseline["execution_projection_node_ids"]

    print("RULE_ONLY_AUTO_REGISTER_BLOCK=PASS")
    print("CONFLICT_AUTO_REGISTER_BLOCK=PASS")
    print("CANONICAL_AST_NODE_DEDUPE=PASS")
    print("CASES=5")
    print("RESULT=PASS_PYTHON_READING_RECONCILIATION_V0_1_AUDIT")


if __name__ == "__main__":
    main()

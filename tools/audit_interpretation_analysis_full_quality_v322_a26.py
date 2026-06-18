from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SOURCE_FILES = [
    ROOT / "src" / "pwa" / "code_explainer.js",
    ROOT / "src" / "pwa" / "code_explainer_rules.js",
    ROOT / "src" / "pwa" / "command_explainer.js",
    ROOT / "src" / "pwa" / "project_analyzer.js",
    ROOT / "src" / "pwa" / "index.html",
]

OPTIONAL_INPUTS = [
    ROOT / "docs" / "quality" / "interpretation_analysis_coverage_v322_a2.md",
    ROOT / "docs" / "quality" / "interpretation_analysis_existing_inventory_v322_a25.md",
    ROOT / ".tmp" / "interpretation_analysis_coverage_candidates_v322_a2.tsv",
    ROOT / ".tmp" / "interpretation_analysis_existing_inventory_v322_a25.tsv",
]

OUT_MD = ROOT / "docs" / "quality" / "interpretation_analysis_full_quality_audit_v322_a26.md"
OUT_FINDINGS = ROOT / ".tmp" / "interpretation_analysis_full_quality_findings_v322_a26.tsv"
OUT_SAMPLE_PLAN = ROOT / ".tmp" / "interpretation_analysis_full_quality_sample_plan_v322_a26.tsv"

AREAS = {
    "src/pwa/code_explainer.js": "code_explainer",
    "src/pwa/code_explainer_rules.js": "code_explainer_rules",
    "src/pwa/command_explainer.js": "command_explainer",
    "src/pwa/project_analyzer.js": "project_analyzer",
    "src/pwa/index.html": "ui_shell",
}

# Korean keywords are escaped to keep this file ASCII-safe when created by Windows PowerShell.
ABSTRACT_KO = [
    "\ucc98\ub9ac", "\ubd84\uc11d", "\uc124\uc815", "\ud655\uc778",
    "\uad00\ub9ac", "\uc0ac\uc6a9", "\uc2e4\ud589", "\uc5f0\uacb0", "\uad6c\uc131",
]
CONCRETE_KO = [
    "\uc785\ub825", "\ucd9c\ub825", "\uacb0\uacfc", "\ud654\uba74",
    "\ud30c\uc77c", "\ud3f4\ub354", "\ubcc0\uc218", "\uac12",
    "\uc694\uccad", "\uc751\ub2f5", "\uc800\uc7a5", "\uc0ad\uc81c",
    "\uc0dd\uc131", "\ubcc0\uacbd", "\ub2e4\uc74c", "\uba3c\uc800",
    "\uc65c", "\ub54c\ubb38", "\uc608\uc2dc", "\uc704\ud5d8",
]
FALLBACK_WORDS = [
    "unsupported", "fallback", "unknown", "general", "inferred",
    "\ubbf8\uc9c0\uc6d0", "\uc77c\ubc18 \uc124\uba85", "\ucd94\uc815",
    "\uc54c \uc218", "\uc9c0\uc6d0\ud558\uc9c0", "\ud655\uc778\ud544\uc694",
]
EMPTY_STATE_WORDS = [
    "\uc5c6\uc2b5\ub2c8\ub2e4", "\ucc3e\uc9c0 \ubabb", "\ud45c\uc2dc\ud560",
]
BEGINNER_HELP_WORDS = [
    "\uba3c\uc800", "\ub2e4\uc74c", "\ud655\uc778", "\uc608\uc2dc",
    "\uc774\uc720", "\uc704\ud5d8", "\uc785\ub825", "\ucd9c\ub825", "\uacb0\uacfc",
]

EXPECTED_PATTERNS = [
    ("code_explainer", "python", "__init__", ["__init__"], "constructor and object initialization"),
    ("code_explainer", "python", "self", ["self"], "instance state and method receiver"),
    ("code_explainer", "python", "class", ["class "], "class definition"),
    ("code_explainer", "python", "with open", ["with open", "open("], "file context manager"),
    ("code_explainer", "python", "try/except/finally", ["try", "except", "finally"], "exception handling"),
    ("code_explainer", "python", "enumerate", ["enumerate"], "loop index"),
    ("code_explainer", "python", "lambda", ["lambda"], "anonymous function"),
    ("code_explainer", "python", "async/await", ["async", "await"], "async flow"),
    ("code_explainer", "python-lib", "requests", ["requests", "requests.get", "requests.post"], "HTTP client"),
    ("code_explainer", "python-lib", "logging", ["logging", "logger"], "logging"),
    ("code_explainer", "python-lib", "os.environ", ["os.environ", "environ"], "environment variables"),
    ("code_explainer", "python-lib", "pandas", ["pandas", "read_csv", "dataframe", "groupby"], "data analysis"),
    ("code_explainer", "python-lib", "json/csv/path", ["json.load", "json.loads", "csv", "pathlib", "path"], "data and file helpers"),
    ("code_explainer", "js", "fetch/request/response", ["fetch(", "request", "response"], "HTTP flow"),
    ("code_explainer", "js", "DOM event/query", ["addeventlistener", "queryselector", "getelementbyid"], "DOM interaction"),
    ("command_explainer", "powershell", "pipeline", ["|", "pipeline"], "pipeline flow"),
    ("command_explainer", "powershell", "ForEach/Where", ["foreach-object", "where-object"], "PowerShell filtering and loops"),
    ("command_explainer", "powershell", "web request", ["invoke-webrequest", "invoke-restmethod", "iwr", "irm"], "web request command"),
    ("command_explainer", "powershell", "delete/risk", ["remove-item", "rm ", "del ", "rmdir"], "delete commands"),
    ("command_explainer", "git", "history/risk", ["reset --hard", "git clean", "clean -fd", "git rebase", "push --force"], "history or cleanup risk"),
    ("command_explainer", "dev", "dev commands", ["python -m", "pip install", "npm run", "pytest", "wrangler", "docker compose", "poetry", "uv "], "developer tools"),
    ("project_analyzer", "entrypoint", "web entry", ["index.html", "script", "app.js"], "web entrypoint"),
    ("project_analyzer", "entrypoint", "python entry", ["main.py", "app.py", "server.py"], "Python entrypoint"),
    ("project_analyzer", "config", "project config", ["package.json", "wrangler.toml", "pyproject.toml", "requirements.txt"], "config files"),
    ("project_analyzer", "pwa", "PWA", ["manifest", "service worker", "serviceworker"], "PWA files"),
    ("project_analyzer", "guidance", "beginner guidance", ["first", "risk", "validate", "version"], "beginner guidance"),
]

SAMPLE_TESTS = [
    ("code_explainer", "__init__", "python", "class User:\n    def __init__(self, name):\n        self.name = name\n\nu = User('Kim')", "constructor should explain object setup and self.name state"),
    ("code_explainer", "self", "python", "class Counter:\n    def __init__(self):\n        self.count = 0\n    def add(self):\n        self.count += 1", "self should explain instance state change"),
    ("code_explainer", "with open", "python", "with open('data.txt', 'r', encoding='utf-8') as f:\n    text = f.read()", "file open/read/auto-close should be clear"),
    ("code_explainer", "requests", "python", "import requests\nres = requests.get('https://example.com')\nprint(res.status_code)", "HTTP request and response status should be clear"),
    ("code_explainer", "lambda", "python", "scores = [3, 1, 2]\nscores.sort(key=lambda x: x)", "lambda should be explained as temporary function"),
    ("command_explainer", "pipeline", "powershell", "Get-ChildItem . | Where-Object {$_.Extension -eq '.js'} | Select-Object Name", "pipeline should show left-to-right object flow"),
    ("command_explainer", "git clean", "shell", "git clean -fd", "should warn about deleting untracked files"),
    ("command_explainer", "wrangler", "shell", "npx wrangler deploy", "should explain Cloudflare deploy target"),
    ("project_analyzer", "PWA", "project", "index.html + manifest.json + service-worker.js", "should detect PWA relation if files exist"),
]

@dataclass
class Finding:
    severity: str
    area: str
    file: str
    line: int
    category: str
    pattern: str
    evidence: str
    recommendation: str

def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()

def has_korean(text: str) -> bool:
    return any("\uac00" <= ch <= "\ud7a3" for ch in text)

def add(findings: list[Finding], severity: str, area: str, path: Path | str, line: int, category: str, pattern: str, evidence: str, recommendation: str) -> None:
    if isinstance(path, Path):
        file_value = rel(path)
    else:
        file_value = path
    findings.append(Finding(severity, area, file_value, line, category, pattern, " ".join(evidence.strip().split())[:260], recommendation))

def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")

def extract_strings(line: str) -> list[str]:
    results = []
    for pattern in [r'"([^"\\]*(?:\\.[^"\\]*)*)"', r"'([^'\\]*(?:\\.[^'\\]*)*)'", r"`([^`\\]*(?:\\.[^`\\]*)*)`"]:
        for m in re.finditer(pattern, line):
            value = m.group(1)
            if has_korean(value):
                results.append(value)
    return results

def audit_source_metrics(source_texts: dict[Path, str], findings: list[Finding]) -> dict[str, dict[str, int]]:
    metrics: dict[str, dict[str, int]] = {}
    for path, text in source_texts.items():
        r = rel(path)
        lines = text.splitlines()
        functions = re.findall(r"\bfunction\s+([A-Za-z0-9_$]+)\s*\(", text)
        arrows = re.findall(r"\b(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>", text)
        korean_string_count = 0
        fallback_count = 0
        empty_count = 0
        todo_count = 0
        for idx, line in enumerate(lines, 1):
            low = line.lower()
            if "todo" in low or "fixme" in low:
                todo_count += 1
                add(findings, "B", AREAS.get(r, "unknown"), path, idx, "todo_or_fixme", "TODO/FIXME", line, "Review whether this marks unfinished analysis behavior.")
            for s in extract_strings(line):
                korean_string_count += 1
                compact = re.sub(r"\s+", " ", s).strip()
                if any(w.lower() in compact.lower() for w in FALLBACK_WORDS):
                    fallback_count += 1
                    add(findings, "B", AREAS.get(r, "unknown"), path, idx, "fallback_output", "fallback/unsupported/inferred", compact, "Check if the UI explains why this is uncertain and what to inspect next.")
                if any(w in compact for w in EMPTY_STATE_WORDS):
                    empty_count += 1
                    if not any(w in compact for w in BEGINNER_HELP_WORDS):
                        add(findings, "A", AREAS.get(r, "unknown"), path, idx, "empty_state_without_next_action", "empty state", compact, "Add a next action or safe interpretation path for beginners.")
                if any(w in compact for w in ABSTRACT_KO) and not any(w in compact for w in CONCRETE_KO) and len(compact) <= 80:
                    add(findings, "A", AREAS.get(r, "unknown"), path, idx, "abstract_string", "abstract wording", compact, "Add concrete input/output/result/state-change wording.")
        metrics[r] = {
            "lines": len(lines),
            "function_defs": len(functions),
            "arrow_functions": len(arrows),
            "korean_strings": korean_string_count,
            "fallback_strings": fallback_count,
            "empty_state_strings": empty_count,
            "todo_fixme": todo_count,
        }
    return metrics

def audit_expected_patterns(source_texts: dict[Path, str], findings: list[Finding]) -> list[dict[str, object]]:
    joined_by_area: dict[str, str] = defaultdict(str)
    source_files_by_area: dict[str, list[str]] = defaultdict(list)
    for path, text in source_texts.items():
        r = rel(path)
        area = AREAS.get(r, "unknown")
        joined_by_area[area] += "\n" + text.lower()
        source_files_by_area[area].append(r)

    rows = []
    for area, group, pattern, keywords, meaning in EXPECTED_PATTERNS:
        haystack = joined_by_area.get(area, "")
        hits = []
        for kw in keywords:
            count = haystack.count(kw.lower())
            if count:
                hits.append((kw, count))
        hit_count = sum(c for _, c in hits)
        if hit_count == 0:
            status = "absent"
            severity = "C"
            rec = "No direct evidence. Verify with sample output, then consider adding support."
            add(findings, severity, area, area, 0, "expected_pattern_absent", pattern, f"keywords missing: {', '.join(keywords)}", rec)
        elif hit_count <= 2:
            status = "sparse"
            severity = "B"
            rec = "Sparse evidence. Inspect exact block and sample output before patching."
            add(findings, severity, area, area, 0, "expected_pattern_sparse", pattern, f"hits: {hits}", rec)
        else:
            status = "present_or_partial"
        rows.append({
            "area": area,
            "group": group,
            "pattern": pattern,
            "meaning": meaning,
            "status": status,
            "hit_count": hit_count,
            "hits": "; ".join(f"{k}:{c}" for k, c in hits),
            "files": ", ".join(source_files_by_area.get(area, [])),
        })
    return rows

def load_optional_audits(findings: list[Finding]) -> dict[str, object]:
    summary: dict[str, object] = {}
    for path in OPTIONAL_INPUTS:
        summary[rel(path)] = path.exists()

    a2_tsv = ROOT / ".tmp" / "interpretation_analysis_coverage_candidates_v322_a2.tsv"
    if a2_tsv.exists():
        with a2_tsv.open("r", encoding="utf-8", newline="") as handle:
            rows = list(csv.DictReader(handle, delimiter="\t"))
        summary["a2_rows"] = len(rows)
        summary["a2_severity"] = dict(Counter(r.get("severity", "") for r in rows))
        for r in rows:
            if r.get("severity") in {"C", "B"}:
                add(
                    findings,
                    r.get("severity", "B"),
                    "prior_a2",
                    r.get("file", "a2"),
                    int(r.get("line") or 0),
                    "prior_a2_candidate",
                    r.get("pattern", ""),
                    r.get("evidence", ""),
                    "Use A2 only as a candidate list, not as proof of missing support.",
                )

    a25_tsv = ROOT / ".tmp" / "interpretation_analysis_existing_inventory_v322_a25.tsv"
    if a25_tsv.exists():
        with a25_tsv.open("r", encoding="utf-8", newline="") as handle:
            rows = list(csv.DictReader(handle, delimiter="\t"))
        summary["a25_rows"] = len(rows)
        summary["a25_status"] = dict(Counter(r.get("status", "") for r in rows))
        for r in rows:
            if r.get("status") in {"absent", "needs_sample_test"}:
                sev = "C" if r.get("status") == "absent" else "B"
                add(
                    findings,
                    sev,
                    r.get("area", "a25"),
                    "a25_inventory",
                    0,
                    "prior_a25_inventory",
                    r.get("pattern", ""),
                    f"status={r.get('status')} evidence_count={r.get('evidence_count')}",
                    "Run sample output check before patching.",
                )

    return summary

def write_findings(findings: list[Finding]) -> None:
    order = {"C": 0, "B": 1, "A": 2}
    findings.sort(key=lambda f: (order.get(f.severity, 9), f.area, f.file, f.line, f.category, f.pattern))
    OUT_FINDINGS.parent.mkdir(parents=True, exist_ok=True)
    with OUT_FINDINGS.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, delimiter="\t")
        writer.writerow(["severity", "area", "file", "line", "category", "pattern", "evidence", "recommendation"])
        for f in findings:
            writer.writerow([f.severity, f.area, f.file, f.line, f.category, f.pattern, f.evidence, f.recommendation])

def write_sample_plan() -> None:
    OUT_SAMPLE_PLAN.parent.mkdir(parents=True, exist_ok=True)
    with OUT_SAMPLE_PLAN.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, delimiter="\t")
        writer.writerow(["area", "pattern", "language", "sample", "expected_beginner_output"])
        for row in SAMPLE_TESTS:
            writer.writerow(row)

def write_markdown(metrics: dict[str, dict[str, int]], pattern_rows: list[dict[str, object]], optional_summary: dict[str, object], findings: list[Finding]) -> None:
    by_sev = Counter(f.severity for f in findings)
    by_area = Counter(f.area for f in findings)
    by_cat = Counter(f.category for f in findings)

    order = {"C": 0, "B": 1, "A": 2}
    top = sorted(findings, key=lambda f: (order.get(f.severity, 9), f.area, f.file, f.line, f.category, f.pattern))[:120]

    lines = []
    lines.append("# V322-A2.6 full interpretation and analysis quality audit")
    lines.append("")
    lines.append("## Purpose")
    lines.append("")
    lines.append("This audit is a full pre-patch review for beginner-facing interpretation and analysis quality.")
    lines.append("It combines source inventory, user-facing string checks, expected pattern coverage, previous A2/A2.5 findings, and a sample test plan.")
    lines.append("")
    lines.append("## Guardrails")
    lines.append("")
    lines.append("- This audit does not patch runtime code.")
    lines.append("- Do not treat keyword absence alone as proof of missing support.")
    lines.append("- Before V322-A3, inspect exact blocks and run sample outputs for C/B findings.")
    lines.append("- Keep lesson JSON and side-card JSON out of scope.")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append(f"- total findings: {len(findings)}")
    lines.append(f"- C critical or absent/sample-required: {by_sev.get('C', 0)}")
    lines.append(f"- B weak/uncertain/review-needed: {by_sev.get('B', 0)}")
    lines.append(f"- A beginner wording improvement: {by_sev.get('A', 0)}")
    lines.append("")
    lines.append("## Source metrics")
    lines.append("")
    lines.append("| file | lines | function_defs | arrow_functions | korean_strings | fallback_strings | empty_state_strings | todo_fixme |")
    lines.append("|---|---:|---:|---:|---:|---:|---:|---:|")
    for file, m in metrics.items():
        lines.append(f"| {file} | {m['lines']} | {m['function_defs']} | {m['arrow_functions']} | {m['korean_strings']} | {m['fallback_strings']} | {m['empty_state_strings']} | {m['todo_fixme']} |")
    lines.append("")
    lines.append("## Previous audit inputs")
    lines.append("")
    for key, value in optional_summary.items():
        lines.append(f"- {key}: {value}")
    lines.append("")
    lines.append("## Expected pattern coverage")
    lines.append("")
    lines.append("| status | area | group | pattern | hit_count | hits |")
    lines.append("|---|---|---|---|---:|---|")
    for r in sorted(pattern_rows, key=lambda x: (str(x["status"]), str(x["area"]), str(x["pattern"]))):
        hits = str(r["hits"]).replace("|", "\\|")
        lines.append(f"| {r['status']} | {r['area']} | {r['group']} | {r['pattern']} | {r['hit_count']} | {hits} |")
    lines.append("")
    lines.append("## Findings by area")
    lines.append("")
    for key, value in by_area.most_common():
        lines.append(f"- {key}: {value}")
    lines.append("")
    lines.append("## Findings by category")
    lines.append("")
    for key, value in by_cat.most_common():
        lines.append(f"- {key}: {value}")
    lines.append("")
    lines.append("## Top findings")
    lines.append("")
    lines.append("| severity | area | file | line | category | pattern | evidence | recommendation |")
    lines.append("|---|---|---|---:|---|---|---|---|")
    for f in top:
        evidence = f.evidence.replace("|", "\\|")
        rec = f.recommendation.replace("|", "\\|")
        pattern = f.pattern.replace("|", "\\|")
        lines.append(f"| {f.severity} | {f.area} | {f.file} | {f.line} | {f.category} | {pattern} | {evidence} | {rec} |")
    lines.append("")
    lines.append("## Sample output plan for V322-A3 decision")
    lines.append("")
    lines.append("| area | pattern | language | expected output check |")
    lines.append("|---|---|---|---|")
    for area, pattern, language, sample, expected in SAMPLE_TESTS:
        lines.append(f"| {area} | {pattern} | {language} | {expected} |")
    lines.append("")
    lines.append("## Recommended next step")
    lines.append("")
    lines.append("1. Commit this full audit as V322-A2.6 if the output looks reasonable.")
    lines.append("2. Run exact source block extraction for C/B findings, not broad patching.")
    lines.append("3. Run sample outputs for __init__, self, with open, requests, lambda, pipeline, git clean, wrangler, and PWA detection.")
    lines.append("4. Choose one small V322-A3 patch batch only after sample output proves a real quality gap.")
    lines.append("")
    lines.append("## Generated files")
    lines.append("")
    lines.append(f"- findings TSV: {OUT_FINDINGS.relative_to(ROOT).as_posix()}")
    lines.append(f"- sample plan TSV: {OUT_SAMPLE_PLAN.relative_to(ROOT).as_posix()}")
    lines.append(f"- markdown: {OUT_MD.relative_to(ROOT).as_posix()}")
    lines.append("")

    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")

def main() -> None:
    source_texts = {}
    for path in SOURCE_FILES:
        if not path.exists():
            raise FileNotFoundError(path)
        source_texts[path] = read_text(path)

    findings: list[Finding] = []

    optional_summary = load_optional_audits(findings)
    metrics = audit_source_metrics(source_texts, findings)
    pattern_rows = audit_expected_patterns(source_texts, findings)

    write_findings(findings)
    write_sample_plan()
    write_markdown(metrics, pattern_rows, optional_summary, findings)

    print("AUDIT_INTERPRETATION_ANALYSIS_FULL_QUALITY_V322_A26")
    print("SOURCE_FILES", len(SOURCE_FILES))
    print("TOTAL_FINDINGS", len(findings))
    print("MD", OUT_MD.relative_to(ROOT).as_posix())
    print("FINDINGS_TSV", OUT_FINDINGS.relative_to(ROOT).as_posix())
    print("SAMPLE_PLAN_TSV", OUT_SAMPLE_PLAN.relative_to(ROOT).as_posix())
    print("SEVERITY_COUNTS", json.dumps(Counter(f.severity for f in findings), ensure_ascii=True, sort_keys=True))

if __name__ == "__main__":
    main()
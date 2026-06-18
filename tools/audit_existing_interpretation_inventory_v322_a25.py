from __future__ import annotations

import csv
import json
import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TARGET_FILES = [
    ROOT / "src" / "pwa" / "code_explainer.js",
    ROOT / "src" / "pwa" / "code_explainer_rules.js",
    ROOT / "src" / "pwa" / "command_explainer.js",
    ROOT / "src" / "pwa" / "project_analyzer.js",
]

OUT_TSV = ROOT / ".tmp" / "interpretation_analysis_existing_inventory_v322_a25.tsv"
OUT_MD = ROOT / "docs" / "quality" / "interpretation_analysis_existing_inventory_v322_a25.md"

CHECKS = [
    ("code_explainer", "python", "__init__", ["__init__"], "Python constructor / object initialization"),
    ("code_explainer", "python", "self", ["self"], "Python instance variable / method receiver"),
    ("code_explainer", "python", "enumerate", ["enumerate"], "Python loop with index"),
    ("code_explainer", "python", "lambda", ["lambda"], "Python anonymous function"),
    ("code_explainer", "python", "with open", ["with open", "open("], "Python file context manager"),
    ("code_explainer", "python", "try/except/finally", ["try", "except", "finally"], "Python error handling"),
    ("code_explainer", "python", "async/await", ["async", "await"], "Python async flow"),
    ("code_explainer", "python-lib", "requests", ["requests", "requests.get", "requests.post"], "HTTP request library"),
    ("code_explainer", "python-lib", "logging", ["logging", "logger"], "logging output"),
    ("code_explainer", "python-lib", "os.environ", ["os.environ", "environ"], "environment variables"),
    ("code_explainer", "python-lib", "pandas", ["pandas", "read_csv", "dataframe", "groupby"], "pandas data analysis"),
    ("code_explainer", "python-lib", "argparse", ["argparse", "argumentparser"], "CLI argument parser"),
    ("code_explainer", "python-lib", "json/csv/path", ["json.load", "json.loads", "csv", "pathlib", "Path"], "data/file helpers"),
    ("code_explainer", "js", "fetch/response/request", ["fetch(", "response", "request"], "JavaScript or Worker HTTP flow"),
    ("code_explainer", "js", "DOM events", ["addeventlistener", "queryselector", "getelementbyid"], "browser DOM interaction"),
    ("code_explainer", "js", "import/export", ["import ", "export "], "module import/export"),

    ("command_explainer", "powershell", "pipeline", ["|", "pipeline"], "PowerShell pipeline"),
    ("command_explainer", "powershell", "ForEach/Where", ["foreach-object", "where-object", "%", "?"], "PowerShell pipeline blocks"),
    ("command_explainer", "powershell", "web request", ["invoke-webrequest", "invoke-restmethod", "curl", "irm", "iwr"], "PowerShell HTTP calls"),
    ("command_explainer", "powershell", "ConvertFrom-Json", ["convertfrom-json"], "PowerShell JSON parsing"),
    ("command_explainer", "powershell", "Remove-Item", ["remove-item", "rm ", "del ", "rmdir"], "PowerShell deletion"),
    ("command_explainer", "git", "reset/clean/rebase/stash/tag", ["git reset", "reset --hard", "git clean", "clean -fd", "git rebase", "git stash", "git tag"], "Git history and cleanup commands"),
    ("command_explainer", "dev", "python/pip/npm/pytest/wrangler/docker", ["python -m", "pip install", "npm run", "pytest", "wrangler", "docker compose", "poetry", "uv "], "developer command coverage"),

    ("project_analyzer", "entrypoint", "html/js entry", ["index.html", "script", "app.js"], "web app entry points"),
    ("project_analyzer", "entrypoint", "python entry", ["main.py", "app.py", "server.py"], "Python entry points"),
    ("project_analyzer", "config", "package/wrangler/pyproject/requirements", ["package.json", "wrangler.toml", "pyproject.toml", "requirements.txt"], "project config files"),
    ("project_analyzer", "pwa", "manifest/service worker", ["manifest", "service worker", "serviceworker"], "PWA files"),
    ("project_analyzer", "guidance", "first/risk/validate/version", ["first", "risk", "validate", "version"], "beginner guidance and safe edit hints"),
]

@dataclass
class InventoryRow:
    area: str
    group: str
    pattern: str
    status: str
    evidence_count: int
    files: str
    sample_lines: str
    judgement: str

def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()

def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")

def normalize(text: str) -> str:
    return text.lower()

def collect_evidence(keywords: list[str], file_texts: dict[Path, str]) -> tuple[int, list[str], list[str]]:
    count = 0
    files = []
    samples = []

    lowered_keywords = [k.lower() for k in keywords]

    for path, text in file_texts.items():
        lower = text.lower()
        file_hit = False

        for idx, line in enumerate(text.splitlines(), 1):
            low_line = line.lower()
            if any(k in low_line for k in lowered_keywords):
                count += 1
                file_hit = True
                if len(samples) < 8:
                    compact = " ".join(line.strip().split())
                    samples.append(f"{rel(path)}:{idx}: {compact[:160]}")

        if file_hit:
            files.append(rel(path))

    return count, files, samples

def classify(area: str, pattern: str, count: int, samples: list[str]) -> tuple[str, str]:
    sample_text = "\n".join(samples).lower()

    if count == 0:
        return (
            "absent",
            "No direct keyword evidence in target files. Treat as missing until sample-run proves otherwise.",
        )

    # Weak generic mention: keyword exists, but mostly in comments, sample constants, or audit/report-like code.
    if count <= 2:
        return (
            "needs_sample_test",
            "Only sparse evidence exists. Run a sample through the UI/parser before deciding whether to patch.",
        )

    rule_words = ["title", "explain", "summary", "reason", "risk", "pattern", "match", "detect", "confidence", "step"]
    if any(w in sample_text for w in rule_words):
        return (
            "likely_supported_or_partial",
            "Evidence appears near rule/explanation logic. Inspect exact block and sample output to judge quality.",
        )

    return (
        "keyword_only",
        "Keyword exists, but evidence does not prove beginner-facing analysis quality. Needs exact block review.",
    )

def main() -> None:
    file_texts = {}
    for path in TARGET_FILES:
        if not path.exists():
            raise FileNotFoundError(path)
        file_texts[path] = read(path)

    rows: list[InventoryRow] = []

    for area, group, pattern, keywords, description in CHECKS:
        count, files, samples = collect_evidence(keywords, file_texts)
        status, judgement = classify(area, pattern, count, samples)

        rows.append(
            InventoryRow(
                area=area,
                group=group,
                pattern=pattern,
                status=status,
                evidence_count=count,
                files=", ".join(files),
                sample_lines=" || ".join(samples),
                judgement=judgement,
            )
        )

    status_order = {
        "absent": 0,
        "needs_sample_test": 1,
        "keyword_only": 2,
        "likely_supported_or_partial": 3,
    }
    rows.sort(key=lambda r: (status_order.get(r.status, 9), r.area, r.group, r.pattern))

    OUT_TSV.parent.mkdir(parents=True, exist_ok=True)
    OUT_MD.parent.mkdir(parents=True, exist_ok=True)

    with OUT_TSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, delimiter="\t")
        writer.writerow(["area", "group", "pattern", "status", "evidence_count", "files", "sample_lines", "judgement"])
        for r in rows:
            writer.writerow([r.area, r.group, r.pattern, r.status, r.evidence_count, r.files, r.sample_lines, r.judgement])

    by_status = Counter(r.status for r in rows)
    by_area = Counter(r.area for r in rows)

    lines = []
    lines.append("# V322-A2.5 existing interpretation inventory audit")
    lines.append("")
    lines.append("## Purpose")
    lines.append("")
    lines.append("A2 was a broad keyword-based coverage audit. This A2.5 audit checks what is already present in the current code before choosing patches.")
    lines.append("The goal is to separate true gaps from already-supported, partial, or sample-test-needed patterns.")
    lines.append("")
    lines.append("## Scope")
    lines.append("")
    for p in TARGET_FILES:
        lines.append(f"- {rel(p)}")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append(f"- total inventory checks: {len(rows)}")
    for key, value in by_status.most_common():
        lines.append(f"- {key}: {value}")
    lines.append("")
    lines.append("## By area")
    lines.append("")
    for key, value in by_area.most_common():
        lines.append(f"- {key}: {value}")
    lines.append("")
    lines.append("## Inventory table")
    lines.append("")
    lines.append("| status | area | group | pattern | evidence_count | files | judgement |")
    lines.append("|---|---|---|---|---:|---|---|")
    for r in rows:
        files = r.files.replace("|", "\\|")
        judgement = r.judgement.replace("|", "\\|")
        lines.append(f"| {r.status} | {r.area} | {r.group} | {r.pattern} | {r.evidence_count} | {files} | {judgement} |")
    lines.append("")
    lines.append("## Decision rule for next patch")
    lines.append("")
    lines.append("1. Do not patch from A2 keyword misses alone.")
    lines.append("2. First inspect absent and needs_sample_test rows with exact source blocks and sample outputs.")
    lines.append("3. Patch only if the current UI output is generic, wrong, or unsupported for a realistic beginner sample.")
    lines.append("4. Prefer one small patch batch per engine: code_explainer, command_explainer, or project_analyzer.")
    lines.append("5. Keep side-card JSON and lesson JSON out of scope.")
    lines.append("")
    lines.append("## Generated files")
    lines.append("")
    lines.append(f"- TSV: {OUT_TSV.relative_to(ROOT).as_posix()}")
    lines.append(f"- MD: {OUT_MD.relative_to(ROOT).as_posix()}")
    lines.append("")

    OUT_MD.write_text("\n".join(lines), encoding="utf-8")

    print("AUDIT_EXISTING_INTERPRETATION_INVENTORY_V322_A25")
    print("TARGET_FILES", len(TARGET_FILES))
    print("TOTAL_CHECKS", len(rows))
    print("TSV", OUT_TSV.relative_to(ROOT).as_posix())
    print("MD", OUT_MD.relative_to(ROOT).as_posix())
    print("STATUS_COUNTS", json.dumps(by_status, ensure_ascii=True, sort_keys=True))

if __name__ == "__main__":
    main()
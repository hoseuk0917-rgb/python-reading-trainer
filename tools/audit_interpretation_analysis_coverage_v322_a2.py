from __future__ import annotations

import csv
import json
import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TARGETS = [
    ROOT / "src" / "pwa" / "code_explainer.js",
    ROOT / "src" / "pwa" / "command_explainer.js",
    ROOT / "src" / "pwa" / "project_analyzer.js",
]

OUT_TSV = ROOT / ".tmp" / "interpretation_analysis_coverage_candidates_v322_a2.tsv"
OUT_MD = ROOT / "docs" / "quality" / "interpretation_analysis_coverage_v322_a2.md"

# Korean keywords are escaped so this source remains ASCII-safe for Windows PowerShell.
ABSTRACT_KO = [
    "\ucc98\ub9ac", "\ubd84\uc11d", "\uc124\uc815", "\ud655\uc778",
    "\uad00\ub9ac", "\uc0ac\uc6a9", "\uc2e4\ud589", "\uc5f0\uacb0", "\uad6c\uc131",
]
CONCRETE_KO = [
    "\uc785\ub825", "\ucd9c\ub825", "\uacb0\uacfc", "\ud654\uba74",
    "\ud30c\uc77c", "\ud3f4\ub354", "\ubcc0\uc218", "\uac12",
    "\uc694\uccad", "\uc751\ub2f5", "\uc800\uc7a5", "\uc0ad\uc81c",
    "\uc0dd\uc131", "\ubcc0\uacbd", "\ub2e4\uc74c", "\uba3c\uc800",
    "\uc65c", "\ub54c\ubb38",
]
FALLBACK_WORDS = [
    "unsupported", "fallback", "unknown", "general",
    "\ubbf8\uc9c0\uc6d0", "\uc77c\ubc18 \uc124\uba85", "\ucd94\uc815",
    "\uc54c \uc218", "\uc9c0\uc6d0\ud558\uc9c0",
]

EXPECTED_COVERAGE = {
    "src/pwa/code_explainer.js": [
        ("python", "with open", "with open file context manager"),
        ("python", "try", "try except finally exception handling"),
        ("python", "except", "except exception branch"),
        ("python", "finally", "finally cleanup branch"),
        ("python", "class", "class object structure"),
        ("python", "__init__", "__init__ constructor"),
        ("python", "self", "self instance state"),
        ("python", "enumerate", "enumerate loop index"),
        ("python", "lambda", "lambda anonymous function"),
        ("python", "async", "async function"),
        ("python", "await", "await async flow"),
        ("python", "__main__", "python main entrypoint"),
        ("python-lib", "json.load", "json.load"),
        ("python-lib", "csv", "csv reader"),
        ("python-lib", "requests", "requests http"),
        ("python-lib", "pandas", "pandas dataframe"),
        ("python-lib", "argparse", "argparse cli"),
        ("python-lib", "logging", "logging"),
        ("python-lib", "fastapi", "FastAPI routing"),
        ("python-lib", "flask", "Flask routing"),
        ("python-lib", "streamlit", "Streamlit UI"),
        ("python-lib", "os.environ", "environment variable"),
        ("python-lib", "dotenv", "dotenv env file"),
        ("javascript", "fetch", "fetch http"),
        ("javascript", "then", "Promise then catch"),
        ("javascript", "catch", "catch error"),
        ("javascript", "addeventlistener", "DOM event listener"),
        ("javascript", "queryselector", "DOM query selector"),
        ("javascript", "import", "module import"),
        ("javascript", "export", "module export"),
        ("cloudflare", "request", "Cloudflare Request"),
        ("cloudflare", "response", "Cloudflare Response"),
        ("cloudflare", "env", "Cloudflare env binding"),
    ],
    "src/pwa/command_explainer.js": [
        ("powershell", "pipeline", "PowerShell pipeline"),
        ("powershell", "foreach-object", "ForEach-Object loop"),
        ("powershell", "where-object", "Where-Object filter"),
        ("powershell", "invoke-webrequest", "Invoke-WebRequest"),
        ("powershell", "invoke-restmethod", "Invoke-RestMethod"),
        ("powershell", "convertfrom-json", "ConvertFrom-Json"),
        ("powershell", "set-executionpolicy", "Set-ExecutionPolicy"),
        ("powershell", "remove-item", "Remove-Item"),
        ("git", "git reset", "git reset"),
        ("git", "reset --hard", "git reset --hard"),
        ("git", "git clean", "git clean"),
        ("git", "clean -fd", "git clean -fd"),
        ("git", "git rebase", "git rebase"),
        ("git", "git stash", "git stash"),
        ("git", "git tag", "git tag"),
        ("git", "push origin main --tags", "git push tags"),
        ("dev-command", "python -m", "python module run"),
        ("dev-command", "pip install -r", "pip requirements"),
        ("dev-command", "npm run", "npm script"),
        ("dev-command", "wrangler", "Cloudflare wrangler"),
        ("dev-command", "pytest", "pytest"),
        ("dev-command", "docker compose", "docker compose"),
        ("dev-command", "poetry", "poetry"),
        ("dev-command", "uv", "uv tool"),
    ],
    "src/pwa/project_analyzer.js": [
        ("entrypoint", "index.html", "HTML entrypoint"),
        ("entrypoint", "package.json", "Node package"),
        ("entrypoint", "wrangler.toml", "Cloudflare config"),
        ("entrypoint", "pyproject.toml", "Python pyproject"),
        ("entrypoint", "requirements.txt", "Python requirements"),
        ("entrypoint", "main.py", "Python main"),
        ("entrypoint", "app.py", "Python app"),
        ("entrypoint", "server.py", "Python server"),
        ("pwa", "manifest", "PWA manifest"),
        ("pwa", "service worker", "service worker"),
        ("connection", "fetch", "fetch data connection"),
        ("connection", "script", "HTML script connection"),
        ("quality", "version", "version cache bust"),
        ("quality", "validate", "validation command"),
        ("quality", "first", "first file guide"),
        ("quality", "risk", "risky file guide"),
    ],
}

@dataclass
class Candidate:
    file: str
    line: int
    severity: str
    category: str
    pattern: str
    reason: str
    evidence: str
    suggestion: str

def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()

def has_korean(text: str) -> bool:
    return any("\uac00" <= ch <= "\ud7a3" for ch in text)

def extract_string_literals(line: str) -> list[str]:
    result = []
    patterns = [
        r'"([^"\\]*(?:\\.[^"\\]*)*)"',
        r"'([^'\\]*(?:\\.[^'\\]*)*)'",
        r"`([^`\\]*(?:\\.[^`\\]*)*)`",
    ]
    for pattern in patterns:
        for match in re.finditer(pattern, line):
            value = match.group(1)
            if has_korean(value):
                result.append(value)
    return result

def add(cands: list[Candidate], path: Path, line: int, severity: str, category: str, pattern: str, reason: str, evidence: str, suggestion: str) -> None:
    cands.append(
        Candidate(
            file=rel(path),
            line=line,
            severity=severity,
            category=category,
            pattern=pattern,
            reason=reason,
            evidence=" ".join(evidence.strip().split())[:240],
            suggestion=suggestion,
        )
    )

def audit_user_facing_strings(path: Path, text: str, cands: list[Candidate]) -> None:
    generic_endings = [
        "\ucc98\ub9ac\ud569\ub2c8\ub2e4",
        "\ubd84\uc11d\ud569\ub2c8\ub2e4",
        "\uc124\uc815\ud569\ub2c8\ub2e4",
        "\ud655\uc778\ud569\ub2c8\ub2e4",
        "\uc0ac\uc6a9\ud569\ub2c8\ub2e4",
    ]

    for idx, line in enumerate(text.splitlines(), 1):
        if not any(q in line for q in ['"', "'", "`"]):
            continue

        for value in extract_string_literals(line):
            compact = re.sub(r"\s+", " ", value).strip()
            if len(compact) < 8:
                continue

            has_abstract = any(word in compact for word in ABSTRACT_KO)
            has_concrete = any(word in compact for word in CONCRETE_KO)
            has_fallback = any(word.lower() in compact.lower() for word in FALLBACK_WORDS)

            if has_fallback:
                add(
                    cands,
                    path,
                    idx,
                    "B",
                    "fallback_or_uncertain_output",
                    "fallback/unsupported/inferred",
                    "Fallback, unsupported, inferred, or generic explanation output may be a visible quality drop.",
                    compact,
                    "Find the branch that emits this text and add concrete beginner guidance where possible.",
                )

            if has_abstract and not has_concrete and len(compact) <= 80:
                add(
                    cands,
                    path,
                    idx,
                    "A",
                    "abstract_beginner_explanation",
                    "abstract Korean verb without concrete result",
                    "Abstract verbs alone may not tell a beginner what changes after execution.",
                    compact,
                    "Explain input, output, state change, file/screen/network effect, or next check.",
                )

            if any(compact.endswith(ending) or compact.endswith(ending + ".") for ending in generic_endings) and len(compact) < 60:
                add(
                    cands,
                    path,
                    idx,
                    "A",
                    "too_generic_sentence",
                    "generic sentence ending",
                    "The sentence ends at a generic action and may not show cause-action-result.",
                    compact,
                    "Expand it into cause -> action -> result.",
                )

def audit_coverage(path: Path, text: str, cands: list[Candidate]) -> None:
    current = rel(path)
    lowered = text.lower()
    for group, needle, label in EXPECTED_COVERAGE.get(current, []):
        if needle.lower() not in lowered:
            add(
                cands,
                path,
                0,
                "C",
                "coverage_missing_or_unconfirmed",
                needle,
                f"Explicit keyword not found for expected coverage: {label}",
                f"missing keyword: {needle}",
                "Verify whether another rule covers this pattern. If not, add sample-based support in V322-A3 or later.",
            )

def audit_possible_weak_rules(path: Path, text: str, cands: list[Candidate]) -> None:
    for idx, line in enumerate(text.splitlines(), 1):
        raw = line.strip()
        low = raw.lower()

        if "confidence" in low and ("inferred" in low or "unsupported" in low):
            add(
                cands,
                path,
                idx,
                "B",
                "confidence_path_review",
                "confidence inferred/unsupported",
                "Inferred or unsupported paths should explain the reason and limit.",
                raw,
                "Add why it is inferred and what the user should check next.",
            )

        if "risk" in low and any(word in low for word in ["high", "medium", "warning"]):
            if not any(word in low for word in ["because", "reason", "why", "delete", "remove", "overwrite", "history", "remote"]):
                add(
                    cands,
                    path,
                    idx,
                    "A",
                    "risk_reason_review",
                    "risk without visible reason",
                    "Risk level without reason may be hard for beginners to judge.",
                    raw,
                    "Attach a reason such as deletion, history rewrite, remote execution, or global environment change.",
                )

def write_outputs(cands: list[Candidate]) -> None:
    OUT_TSV.parent.mkdir(parents=True, exist_ok=True)
    OUT_MD.parent.mkdir(parents=True, exist_ok=True)

    order = {"C": 0, "B": 1, "A": 2}
    cands = sorted(cands, key=lambda c: (order.get(c.severity, 9), c.file, c.line, c.category, c.pattern))

    with OUT_TSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, delimiter="\t")
        writer.writerow(["file", "line", "severity", "category", "pattern", "reason", "evidence", "suggestion"])
        for c in cands:
            writer.writerow([c.file, c.line, c.severity, c.category, c.pattern, c.reason, c.evidence, c.suggestion])

    by_sev = Counter(c.severity for c in cands)
    by_file = Counter(c.file for c in cands)
    by_cat = Counter(c.category for c in cands)

    top = cands[:80]

    lines = []
    lines.append("# V322-A2 beginner-facing interpretation coverage audit")
    lines.append("")
    lines.append("## Scope")
    lines.append("")
    lines.append("- target: code_explainer, command_explainer, project_analyzer")
    lines.append("- purpose: find beginner explanation quality issues and unsupported/weak coverage candidates.")
    lines.append("- patch policy: this is an audit document. Actual rule/text patches should start in V322-A3 with small batches.")
    lines.append("- side-card JSON and lesson JSON remain out of scope.")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append(f"- total candidates: {len(cands)}")
    lines.append(f"- severity C coverage missing/unconfirmed: {by_sev.get('C', 0)}")
    lines.append(f"- severity B weak/uncertain analysis path: {by_sev.get('B', 0)}")
    lines.append(f"- severity A beginner wording issue: {by_sev.get('A', 0)}")
    lines.append("")
    lines.append("## By file")
    lines.append("")
    for key, value in by_file.most_common():
        lines.append(f"- {key}: {value}")
    lines.append("")
    lines.append("## By category")
    lines.append("")
    for key, value in by_cat.most_common():
        lines.append(f"- {key}: {value}")
    lines.append("")
    lines.append("## Top candidates")
    lines.append("")
    lines.append("| severity | file | line | category | pattern | evidence |")
    lines.append("|---|---|---:|---|---|---|")
    for c in top:
        evidence = c.evidence.replace("|", "\\|")
        pattern = c.pattern.replace("|", "\\|")
        lines.append(f"| {c.severity} | {c.file} | {c.line} | {c.category} | {pattern} | {evidence} |")
    lines.append("")
    lines.append("## Next recommended patch order")
    lines.append("")
    lines.append("1. Reproduce C-grade missing coverage with sample code or command input.")
    lines.append("2. Patch visible B-grade inferred/unsupported user outputs first.")
    lines.append("3. Patch A-grade abstract wording only in small, high-exposure batches.")
    lines.append("4. Keep side-card JSON and lesson JSON untouched.")
    lines.append("")
    lines.append("## Generated files")
    lines.append("")
    lines.append(f"- TSV: {OUT_TSV.relative_to(ROOT).as_posix()}")
    lines.append(f"- MD: {OUT_MD.relative_to(ROOT).as_posix()}")
    lines.append("")

    OUT_MD.write_text("\n".join(lines), encoding="utf-8")

def main() -> None:
    cands: list[Candidate] = []

    for path in TARGETS:
        if not path.exists():
            raise FileNotFoundError(path)
        text = path.read_text(encoding="utf-8")
        audit_user_facing_strings(path, text, cands)
        audit_coverage(path, text, cands)
        audit_possible_weak_rules(path, text, cands)

    write_outputs(cands)

    print("AUDIT_INTERPRETATION_ANALYSIS_COVERAGE_V322_A2")
    print("TARGET_FILES", len(TARGETS))
    print("TOTAL_CANDIDATES", len(cands))
    print("TSV", OUT_TSV.relative_to(ROOT).as_posix())
    print("MD", OUT_MD.relative_to(ROOT).as_posix())
    print("SEVERITY_COUNTS", json.dumps(Counter(c.severity for c in cands), ensure_ascii=True, sort_keys=True))

if __name__ == "__main__":
    main()
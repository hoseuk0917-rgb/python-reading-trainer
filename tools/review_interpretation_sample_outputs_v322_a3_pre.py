from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / ".tmp" / "interpretation_sample_output_audit_v322_a3_pre.json"
REVIEWED_TSV = ROOT / ".tmp" / "interpretation_sample_output_audit_v322_a3_pre_reviewed.tsv"
DOC_PATH = ROOT / "docs" / "quality" / "interpretation_sample_output_audit_v322_a3_pre.md"

def compact(value) -> str:
    if value is None:
        return ""
    return " ".join(str(value).split())

def reviewed_verdict(row: dict) -> tuple[str, str]:
    area = row.get("area", "")
    pattern = row.get("pattern", "")
    result = row.get("result") or {}
    analysis = result.get("analysis") or {}
    score = result.get("score") or {}
    raw_verdict = score.get("verdict", "")
    unsupported = analysis.get("unsupported") or []
    unsupported_count = len(unsupported)

    if area == "code_explainer":
        if unsupported_count > 0:
            if pattern in {"__init__", "self"}:
                return (
                    "weak_candidate",
                    "Raw sample passes broad token checks, but object/instance state lines are still unsupported. Patch state-assignment/object-construction explanation before calling this solved.",
                )
            if pattern == "lambda":
                return (
                    "weak_candidate",
                    "Raw sample passes broad token checks, but lambda sort-key line is still unsupported. Patch list method/lambda explanation before calling this solved.",
                )
            return (
                "weak_candidate",
                "The sample contains unsupported lines. Inspect before patching.",
            )
        return (
            "supported_enough",
            "No unsupported lines were found in this sample. Keep as lower priority unless UI review shows wording problems.",
        )

    if area == "command_explainer":
        summary = compact(analysis.get("summary"))
        first_steps = analysis.get("firstSteps") or []
        blank_step_like = False
        if first_steps:
            first = first_steps[0]
            blank_step_like = not compact(first.get("title") or first.get("summary") or first.get("description") or first.get("command"))

        if summary == "[object Object]" or blank_step_like:
            return (
                "harness_schema_incomplete",
                "The command engine returned an object shape that this harness did not summarize correctly. Do not treat pass_or_partial as proof. Add a command-result schema probe before patching command_explainer.",
            )
        if raw_verdict == "pass_or_partial":
            return (
                "supported_enough",
                "The command sample passed the reviewed checks. Keep as lower priority.",
            )
        return (
            "needs_manual_review",
            "Command result needs manual inspection.",
        )

    if area == "project_analyzer":
        return (
            "static_evidence_present",
            "Static PWA evidence exists, but project_analyzer runtime behavior was not tested. Lower priority unless project analyzer UI misses it.",
        )

    return ("needs_manual_review", "No review rule matched.")

def main() -> None:
    if not JSON_PATH.exists():
        raise FileNotFoundError(JSON_PATH)

    rows = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    reviewed = []

    for row in rows:
        result = row.get("result") or {}
        analysis = result.get("analysis") or {}
        score = result.get("score") or {}
        verdict, recommendation = reviewed_verdict(row)
        unsupported = analysis.get("unsupported") or []

        reviewed.append({
            "area": row.get("area", ""),
            "pattern": row.get("pattern", ""),
            "language": row.get("language", ""),
            "raw_verdict": score.get("verdict", ""),
            "reviewed_verdict": verdict,
            "step_count": analysis.get("stepCount", ""),
            "warning_count": analysis.get("warningCount", ""),
            "unsupported_count": len(unsupported),
            "summary": compact(analysis.get("summary") or analysis.get("note")),
            "recommendation": recommendation,
        })

    REVIEWED_TSV.parent.mkdir(parents=True, exist_ok=True)
    with REVIEWED_TSV.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "area", "pattern", "language", "raw_verdict", "reviewed_verdict",
                "step_count", "warning_count", "unsupported_count", "summary", "recommendation"
            ],
            delimiter="\t",
        )
        writer.writeheader()
        writer.writerows(reviewed)

    counts = Counter(r["reviewed_verdict"] for r in reviewed)

    lines = []
    lines.append("# V322-A3-pre reviewed sample output audit")
    lines.append("")
    lines.append("## Purpose")
    lines.append("")
    lines.append("This document reviews the raw sample-output audit result and corrects over-lenient raw verdicts.")
    lines.append("The raw harness used broad token checks, so pass_or_partial is not enough when unsupported lines remain.")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append(f"- total samples: {len(reviewed)}")
    for key, value in counts.most_common():
        lines.append(f"- {key}: {value}")
    lines.append("")
    lines.append("## Reviewed decision table")
    lines.append("")
    lines.append("| area | pattern | raw verdict | reviewed verdict | steps | unsupported | recommendation |")
    lines.append("|---|---|---|---|---:|---:|---|")
    for r in reviewed:
        rec = r["recommendation"].replace("|", "\\|")
        lines.append(
            f"| {r['area']} | {r['pattern']} | {r['raw_verdict']} | {r['reviewed_verdict']} | "
            f"{r['step_count']} | {r['unsupported_count']} | {rec} |"
        )
    lines.append("")
    lines.append("## Patch decision")
    lines.append("")
    lines.append("### V322-A3 primary patch candidates")
    lines.append("")
    lines.append("- code_explainer: __init__ / self object state assignment")
    lines.append("- code_explainer: lambda used inside list method call such as scores.sort(key=lambda x: x)")
    lines.append("")
    lines.append("### Keep as lower priority for now")
    lines.append("")
    lines.append("- code_explainer: with open")
    lines.append("- code_explainer: requests")
    lines.append("- project_analyzer: PWA static evidence exists, runtime analyzer check can be separate")
    lines.append("")
    lines.append("### Needs separate harness/schema audit before patch")
    lines.append("")
    lines.append("- command_explainer: pipeline")
    lines.append("- command_explainer: git clean -fd")
    lines.append("- command_explainer: npx wrangler deploy")
    lines.append("")
    lines.append("## Guardrail")
    lines.append("")
    lines.append("Do not patch from broad keyword misses alone. Patch only cases where the sample output is unsupported, generic, or misleading.")
    lines.append("Keep side-card JSON and lesson JSON out of scope.")
    lines.append("")
    lines.append("## Generated files")
    lines.append("")
    lines.append(f"- raw JSON: {JSON_PATH.relative_to(ROOT).as_posix()}")
    lines.append(f"- reviewed TSV: {REVIEWED_TSV.relative_to(ROOT).as_posix()}")
    lines.append(f"- reviewed MD: {DOC_PATH.relative_to(ROOT).as_posix()}")
    lines.append("")

    DOC_PATH.parent.mkdir(parents=True, exist_ok=True)
    DOC_PATH.write_text("\n".join(lines), encoding="utf-8")

    print("REVIEW_INTERPRETATION_SAMPLE_OUTPUTS_V322_A3_PRE")
    print("SAMPLES", len(reviewed))
    print("REVIEWED_TSV", REVIEWED_TSV.relative_to(ROOT).as_posix())
    print("DOC", DOC_PATH.relative_to(ROOT).as_posix())
    print("REVIEWED_COUNTS", dict(counts))

if __name__ == "__main__":
    main()
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_VERSION = "20260611_v307_a1"
MARKER = "AUDIT_EXPLANATION_ANSWER_CHOICE_ALIGNMENT_V307_A1"

REPORT = ROOT / "reports" / "explanation_answer_choice_alignment_audit_v307.md"
TSV = ROOT / "reports" / "explanation_answer_choice_alignment_candidates_v307.tsv"

def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

def assert_ok(name, condition, detail=""):
    print(name, "OK" if condition else "FAIL", detail)
    if not condition:
        raise AssertionError(name)

def main():
    root_index = read("index.html")
    index = read("src/pwa/index.html")
    app = read("src/pwa/app.js")
    code = read("src/pwa/code_explainer.js")
    project = read("src/pwa/project_analyzer.js")
    audit = read("tools/audit_explanation_answer_choice_alignment_v307.py")

    assert_ok("ROOT_VERSION_V307", EXPECTED_VERSION in root_index)
    assert_ok("APP_VERSION_V307", f'const APP_DATA_VERSION = "{EXPECTED_VERSION}";' in app)
    assert_ok("STYLE_VERSION_V307", f"style.css?v={EXPECTED_VERSION}" in index)
    assert_ok("APP_SCRIPT_VERSION_V307", f"app.js?v={EXPECTED_VERSION}" in index)
    assert_ok("CODE_SCRIPT_VERSION_V307", f"code_explainer.js?v={EXPECTED_VERSION}" in index)
    assert_ok("COMMAND_SCRIPT_VERSION_V307", f"command_explainer.js?v={EXPECTED_VERSION}" in index)
    assert_ok("PROJECT_SCRIPT_VERSION_V307", f"project_analyzer.js?v={EXPECTED_VERSION}" in index)

    assert_ok("AUDIT_SCRIPT_MARKER_V307", MARKER in audit)
    assert_ok("V306_KEPT", "CONCEPT_INTRO_DEDUP_V306_A1" in app)
    assert_ok("V305_KEPT", "PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1" in project)
    assert_ok("V304_KEPT", "MERMAID_QUALITY_MODE_V304_A1" in code)

    assert_ok("REPORT_EXISTS", REPORT.exists())
    assert_ok("TSV_EXISTS", TSV.exists())

    report = REPORT.read_text(encoding="utf-8")
    tsv = TSV.read_text(encoding="utf-8")

    assert_ok("REPORT_MARKER", MARKER in report)
    assert_ok("REPORT_PASS", "- 총평: PASS" in report)
    assert_ok("REPORT_HIGH_ZERO", "- HIGH_ISSUES: 0" in report)
    assert_ok("REPORT_MEDIUM_PRESENT", "MEDIUM_CANDIDATES:" in report)
    assert_ok("REPORT_NEXT_STEP", "V308" in report and "V309" in report)
    assert_ok("TSV_HEADER", tsv.startswith("severity\tcode\tfile\tindex\tid\ttitle\tanswer\tquestion\tdetail\texplanation_preview"))

    print("V307_EXPLANATION_ANSWER_CHOICE_ALIGNMENT_VERIFY_OK")

if __name__ == "__main__":
    main()

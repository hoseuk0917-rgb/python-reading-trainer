from pathlib import Path
import csv

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_VERSION = "20260611_v310_a1"
MARKER = "EXPLANATION_ANSWER_EXPLICIT_PATCH_V310_A1"

REPORT = ROOT / "reports" / "explanation_answer_explicit_patch_audit_v310.md"
CHANGE_TSV = ROOT / "reports" / "explanation_answer_explicit_patch_changes_v310.tsv"

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
    audit = read("tools/audit_explanation_answer_explicit_patch_v310.py")

    assert_ok("ROOT_VERSION_V310", EXPECTED_VERSION in root_index)
    assert_ok("APP_VERSION_V310", f'const APP_DATA_VERSION = "{EXPECTED_VERSION}";' in app)
    assert_ok("STYLE_VERSION_V310", f"style.css?v={EXPECTED_VERSION}" in index)
    assert_ok("APP_SCRIPT_VERSION_V310", f"app.js?v={EXPECTED_VERSION}" in index)
    assert_ok("CODE_SCRIPT_VERSION_V310", f"code_explainer.js?v={EXPECTED_VERSION}" in index)
    assert_ok("COMMAND_SCRIPT_VERSION_V310", f"command_explainer.js?v={EXPECTED_VERSION}" in index)
    assert_ok("PROJECT_SCRIPT_VERSION_V310", f"project_analyzer.js?v={EXPECTED_VERSION}" in index)

    assert_ok("AUDIT_MARKER_V310", MARKER in audit)
    assert_ok("REPORT_EXISTS", REPORT.exists())
    assert_ok("CHANGE_TSV_EXISTS", CHANGE_TSV.exists())

    report = REPORT.read_text(encoding="utf-8")
    rows = list(csv.DictReader(CHANGE_TSV.open("r", encoding="utf-8", newline=""), delimiter="\t"))

    assert_ok("REPORT_MARKER", MARKER in report)
    assert_ok("REPORT_PASS", "- 총평: PASS" in report)
    assert_ok("REPORT_TARGET_40", "- V309 검토팩 대상: 40" in report)
    assert_ok("REPORT_FAILURE_ZERO", "- 정답 표현 미확인: 0" in report)
    assert_ok("CHANGE_ROWS_40", len(rows) == 40, len(rows))
    assert_ok("HAS_LIDAR_PATCH", any(r["answer"] == "LiDAR" and "LiDAR" in r["new_explanation"] for r in rows))
    assert_ok("HAS_LIDAR_LOWER_PATCH", any(r["answer"] == "lidar" and "lidar" in r["new_explanation"] for r in rows))

    assert_ok("V309_REPORT_KEPT", (ROOT / "reports" / "explanation_medium_review_pack_v309.tsv").exists())
    assert_ok("V308_DATA_KEPT", "len(items)가 리스트의 개수를 구한다는 것을 읽는다." in read("data/lessons/cards_seed_v1.json"))
    assert_ok("V306_FEATURE_KEPT", "CONCEPT_INTRO_DEDUP_V306_A1" in app)
    assert_ok("V305_KEPT", "PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1" in project)
    assert_ok("V304_KEPT", "MERMAID_QUALITY_MODE_V304_A1" in code)

    print("V310_EXPLANATION_ANSWER_EXPLICIT_PATCH_VERIFY_OK")

if __name__ == "__main__":
    main()

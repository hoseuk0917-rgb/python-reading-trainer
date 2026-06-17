import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_VERSION = "20260611_v308_a1"
MARKER = "READING_GOAL_TEMPLATE_CLEANUP_V308_A1"

REPORT = ROOT / "reports" / "reading_goal_template_cleanup_audit_v308.md"
CHANGE_TSV = ROOT / "reports" / "reading_goal_template_cleanup_changes_v308.tsv"

def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

def assert_ok(name, condition, detail=""):
    print(name, "OK" if condition else "FAIL", detail)
    if not condition:
        raise AssertionError(name)

def load_cards(rel):
    data = json.loads((ROOT / rel).read_text(encoding="utf-8"))
    if isinstance(data, list):
        return data
    for key in ["cards", "lessons", "items"]:
        if isinstance(data.get(key), list):
            return data[key]
    return []

def main():
    root_index = read("index.html")
    index = read("src/pwa/index.html")
    app = read("src/pwa/app.js")
    code = read("src/pwa/code_explainer.js")
    project = read("src/pwa/project_analyzer.js")
    audit = read("tools/audit_reading_goal_template_cleanup_v308.py")

    first = load_cards("data/lessons/cards_seed_v1.json")[0]
    first_goal = first.get("reading_goal", "")

    assert_ok("ROOT_VERSION_V308", EXPECTED_VERSION in root_index)
    assert_ok("APP_VERSION_V308", f'const APP_DATA_VERSION = "{EXPECTED_VERSION}";' in app)
    assert_ok("STYLE_VERSION_V308", f"style.css?v={EXPECTED_VERSION}" in index)
    assert_ok("APP_SCRIPT_VERSION_V308", f"app.js?v={EXPECTED_VERSION}" in index)
    assert_ok("CODE_SCRIPT_VERSION_V308", f"code_explainer.js?v={EXPECTED_VERSION}" in index)
    assert_ok("COMMAND_SCRIPT_VERSION_V308", f"command_explainer.js?v={EXPECTED_VERSION}" in index)
    assert_ok("PROJECT_SCRIPT_VERSION_V308", f"project_analyzer.js?v={EXPECTED_VERSION}" in index)

    assert_ok("AUDIT_SCRIPT_MARKER_V308", MARKER in audit)
    assert_ok("FIRST_GOAL_CLEANED", "목표를 바탕으로" not in first_goal and first_goal.endswith("."), first_goal)

    assert_ok("V307_KEPT", "20260611_v307_a1" not in app)
    assert_ok("V306_FEATURE_KEPT", "CONCEPT_INTRO_DEDUP_V306_A1" in app)
    assert_ok("V305_KEPT", "PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1" in project)
    assert_ok("V304_KEPT", "MERMAID_QUALITY_MODE_V304_A1" in code)

    assert_ok("REPORT_EXISTS", REPORT.exists())
    assert_ok("CHANGE_TSV_EXISTS", CHANGE_TSV.exists())

    report = REPORT.read_text(encoding="utf-8")
    changes = CHANGE_TSV.read_text(encoding="utf-8")

    assert_ok("REPORT_MARKER", MARKER in report)
    assert_ok("REPORT_PASS", "- 총평: PASS" in report)
    assert_ok("REPORT_ZERO_BAD_TEMPLATE", "- REMAINING_BAD_TEMPLATE: 0" in report)
    assert_ok("REPORT_NEXT_STEP", "V309" in report and "V310" in report)
    assert_ok("CHANGE_TSV_HEADER", changes.startswith("file\tindex\tid\ttitle\told_reading_goal\tnew_reading_goal"))
    assert_ok("CHANGE_TSV_HAS_FIRST_CARD", "cards_seed_v1.json\t1\t" in changes)

    print("V308_READING_GOAL_TEMPLATE_CLEANUP_VERIFY_OK")

if __name__ == "__main__":
    main()

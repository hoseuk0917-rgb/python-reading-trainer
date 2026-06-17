from pathlib import Path
import csv

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_VERSION = "20260611_v309_a1"
MARKER = "EXPLANATION_MEDIUM_REVIEW_PACK_V309_A1"

REPORT = ROOT / "reports" / "explanation_medium_review_pack_v309.md"
TSV = ROOT / "reports" / "explanation_medium_review_pack_v309.tsv"
SOURCE = ROOT / "reports" / "explanation_answer_choice_alignment_candidates_v307.tsv"

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

    assert_ok("ROOT_VERSION_V309", EXPECTED_VERSION in root_index)
    assert_ok("APP_VERSION_V309", f'const APP_DATA_VERSION = "{EXPECTED_VERSION}";' in app)
    assert_ok("STYLE_VERSION_V309", f"style.css?v={EXPECTED_VERSION}" in index)
    assert_ok("APP_SCRIPT_VERSION_V309", f"app.js?v={EXPECTED_VERSION}" in index)
    assert_ok("CODE_SCRIPT_VERSION_V309", f"code_explainer.js?v={EXPECTED_VERSION}" in index)
    assert_ok("COMMAND_SCRIPT_VERSION_V309", f"command_explainer.js?v={EXPECTED_VERSION}" in index)
    assert_ok("PROJECT_SCRIPT_VERSION_V309", f"project_analyzer.js?v={EXPECTED_VERSION}" in index)

    assert_ok("SOURCE_V307_TSV_EXISTS", SOURCE.exists())
    assert_ok("REPORT_EXISTS", REPORT.exists())
    assert_ok("TSV_EXISTS", TSV.exists())

    report = REPORT.read_text(encoding="utf-8")
    tsv = TSV.read_text(encoding="utf-8")

    rows = list(csv.DictReader(TSV.open("r", encoding="utf-8", newline=""), delimiter="\t"))

    assert_ok("REPORT_MARKER", MARKER in report)
    assert_ok("REPORT_SELECTED_40", "이번 검토팩: 상위 40개" in report)
    assert_ok("TSV_HEADER", tsv.startswith("rank\tscore\treview_class\tfile\tindex\tid\ttitle"))
    assert_ok("TSV_ROWS_40", len(rows) == 40, len(rows))
    assert_ok("HAS_HIGH_PRIORITY", any(r["review_class"] == "HIGH_PRIORITY_REVIEW" for r in rows))
    assert_ok("HAS_SEED_CARD", any("cards_seed_v1.json" in r["file"] for r in rows))

    assert_ok("V308_DATA_KEPT", "len(items)가 리스트의 개수를 구한다는 것을 읽는다." in read("data/lessons/cards_seed_v1.json"))
    assert_ok("V306_FEATURE_KEPT", "CONCEPT_INTRO_DEDUP_V306_A1" in app)
    assert_ok("V305_KEPT", "PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1" in project)
    assert_ok("V304_KEPT", "MERMAID_QUALITY_MODE_V304_A1" in code)

    print("V309_EXPLANATION_MEDIUM_REVIEW_PACK_VERIFY_OK")

if __name__ == "__main__":
    main()

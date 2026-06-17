import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_VERSION = "20260611_v315_a1"
MARKER = "EXPLANATION_MEDIUM_REVIEW_AND_PATCH_V315_A1"

SOURCE = ROOT / "reports" / "explanation_answer_choice_alignment_candidates_v307.tsv"
PREV_PACKS = [
    ROOT / "reports" / "explanation_medium_review_pack_v309.tsv",
    ROOT / "reports" / "explanation_medium_review_pack_v311.tsv",
    ROOT / "reports" / "explanation_medium_review_pack_v313.tsv",
    ROOT / "reports" / "explanation_medium_review_pack_v314.tsv",
]
REVIEW = ROOT / "reports" / "explanation_medium_review_pack_v315.tsv"
CHANGE = ROOT / "reports" / "explanation_answer_explicit_patch_changes_v315.tsv"
SUMMARY_MD = ROOT / "reports" / "explanation_medium_review_and_patch_summary_v315.md"
AUDIT_MD = ROOT / "reports" / "explanation_answer_explicit_patch_audit_v315.md"

def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

def normalize(value):
    text = str(value or "").lower()
    text = re.sub(r"[\s\"'`‘’“”.,:;!?()\[\]{}<>/_\-·|]+", "", text)
    return text

def assert_ok(name, condition, detail=""):
    print(name, "OK" if condition else "FAIL", detail)
    if not condition:
        raise AssertionError(name)

def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))

def get_cards(data):
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for key in ["cards", "lessons", "items"]:
            if isinstance(data.get(key), list):
                return data[key]
    return []

def load_rows(path):
    with path.open("r", encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f, delimiter="\t"))

def key(row):
    return (row["file"].replace("\\", "/"), str(row["index"]))

def main():
    root_index = read("index.html")
    index = read("src/pwa/index.html")
    app = read("src/pwa/app.js")
    code = read("src/pwa/code_explainer.js")
    project = read("src/pwa/project_analyzer.js")

    assert_ok("ROOT_VERSION_V315", EXPECTED_VERSION in root_index)
    assert_ok("APP_VERSION_V315", f'const APP_DATA_VERSION = "{EXPECTED_VERSION}";' in app)
    assert_ok("STYLE_VERSION_V315", f"style.css?v={EXPECTED_VERSION}" in index)
    assert_ok("APP_SCRIPT_VERSION_V315", f"app.js?v={EXPECTED_VERSION}" in index)
    assert_ok("CODE_SCRIPT_VERSION_V315", f"code_explainer.js?v={EXPECTED_VERSION}" in index)
    assert_ok("COMMAND_SCRIPT_VERSION_V315", f"command_explainer.js?v={EXPECTED_VERSION}" in index)
    assert_ok("PROJECT_SCRIPT_VERSION_V315", f"project_analyzer.js?v={EXPECTED_VERSION}" in index)

    for path in [SOURCE, REVIEW, CHANGE, SUMMARY_MD, AUDIT_MD] + PREV_PACKS:
        assert_ok(f"EXISTS_{path.name}", path.exists())

    review_rows = load_rows(REVIEW)
    change_rows = load_rows(CHANGE)
    prev_keys = {key(r) for p in PREV_PACKS for r in load_rows(p)}
    this_keys = {key(r) for r in review_rows}

    assert_ok("REVIEW_ROWS_160", len(review_rows) == 160, len(review_rows))
    assert_ok("CHANGE_ROWS_160", len(change_rows) == 160, len(change_rows))
    assert_ok("NO_OVERLAP_WITH_PREV_PACKS", len(prev_keys & this_keys) == 0, len(prev_keys & this_keys))
    assert_ok("HAS_REVIEW_ROWS", len(review_rows) > 0)
    assert_ok("AUDIT_MARKER", MARKER in AUDIT_MD.read_text(encoding="utf-8"))
    assert_ok("AUDIT_PASS", "- 총평: PASS" in AUDIT_MD.read_text(encoding="utf-8"))
    assert_ok("SUMMARY_MARKER", MARKER in SUMMARY_MD.read_text(encoding="utf-8"))

    failures = []
    for row in change_rows:
        rel = row["file"].replace("\\", "/")
        idx = int(row["index"])
        cards = get_cards(load_json(ROOT / rel))
        card = cards[idx - 1]
        answer = row["answer"]
        explanation = str(card.get("explanation", "") or "")
        if normalize(answer) not in normalize(explanation):
            failures.append(row)

    assert_ok("ANSWER_EXPLICIT_FAILURES_ZERO", len(failures) == 0, len(failures))
    assert_ok("CHANGED_YES_160", sum(1 for r in change_rows if r["changed"] == "YES") == 160)
    assert_ok("V314_KEPT", "EXPLANATION_MEDIUM_REVIEW_AND_PATCH_V314_A1" in (ROOT / "reports" / "explanation_answer_explicit_patch_audit_v314.md").read_text(encoding="utf-8"))
    assert_ok("V306_FEATURE_KEPT", "CONCEPT_INTRO_DEDUP_V306_A1" in app)
    assert_ok("V305_KEPT", "PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1" in project)
    assert_ok("V304_KEPT", "MERMAID_QUALITY_MODE_V304_A1" in code)

    print("V315_EXPLANATION_MEDIUM_REVIEW_AND_PATCH_VERIFY_OK")

if __name__ == "__main__":
    main()

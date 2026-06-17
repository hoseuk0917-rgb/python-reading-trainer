from pathlib import Path
import csv
import json
import re
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]

EXPECTED_VERSION = "20260611_v319_a1"
MARKER = "EXPLANATION_LOW_PATCH_V319_A1"

SOURCE_TSV = ROOT / "reports" / "explanation_low_candidate_reaudit_v318.tsv"
PATCH_TSV = ROOT / "reports" / "explanation_low_patch_targets_v319.tsv"
CHANGE_TSV = ROOT / "reports" / "explanation_low_patch_changes_v319.tsv"
AUDIT_MD = ROOT / "reports" / "explanation_low_patch_audit_v319.md"

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

def load_rows(path):
    with path.open("r", encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f, delimiter="\t"))

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

def main():
    root_index = read("index.html")
    pwa_index = read("src/pwa/index.html")
    app = read("src/pwa/app.js")
    code = read("src/pwa/code_explainer.js")
    project = read("src/pwa/project_analyzer.js")

    assert_ok("ROOT_VERSION_V319", EXPECTED_VERSION in root_index)
    assert_ok("APP_VERSION_V319", f'const APP_DATA_VERSION = "{EXPECTED_VERSION}";' in app)
    assert_ok("STYLE_VERSION_V319", f"style.css?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("APP_SCRIPT_VERSION_V319", f"app.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("CODE_SCRIPT_VERSION_V319", f"code_explainer.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("COMMAND_SCRIPT_VERSION_V319", f"command_explainer.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("PROJECT_SCRIPT_VERSION_V319", f"project_analyzer.js?v={EXPECTED_VERSION}" in pwa_index)

    for path in [SOURCE_TSV, PATCH_TSV, CHANGE_TSV, AUDIT_MD]:
        assert_ok(f"EXISTS_{path.name}", path.exists())

    source_rows = load_rows(SOURCE_TSV)
    patch_rows = load_rows(PATCH_TSV)
    change_rows = load_rows(CHANGE_TSV)

    counts = Counter(r.get("action", "") for r in source_rows)

    assert_ok("SOURCE_LOW_ROWS_219", len(source_rows) == 219, len(source_rows))
    assert_ok("SOURCE_REVIEW_AND_PATCH_11", counts["REVIEW_AND_PATCH"] == 11, counts["REVIEW_AND_PATCH"])
    assert_ok("SOURCE_REVIEW_ONLY_2", counts["REVIEW_ONLY"] == 2, counts["REVIEW_ONLY"])
    assert_ok("SOURCE_NO_ACTION_206", counts["NO_ACTION"] == 206, counts["NO_ACTION"])
    assert_ok("PATCH_ROWS_11", len(patch_rows) == 11, len(patch_rows))
    assert_ok("CHANGE_ROWS_11", len(change_rows) == 11, len(change_rows))

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
    assert_ok("CHANGED_YES_11", sum(1 for r in change_rows if r["changed"] == "YES") == 11)
    assert_ok("AUDIT_MARKER", MARKER in AUDIT_MD.read_text(encoding="utf-8"))
    assert_ok("AUDIT_PASS", "- 총평: PASS" in AUDIT_MD.read_text(encoding="utf-8"))
    assert_ok("V318_KEPT", "EXPLANATION_LOW_CANDIDATE_REAUDIT_V318_A1" in (ROOT / "reports" / "explanation_low_candidate_reaudit_v318.md").read_text(encoding="utf-8"))
    assert_ok("V317_KEPT", "EXPLANATION_MEDIUM_FINAL_REAUDIT_V317_A1" in (ROOT / "reports" / "explanation_medium_final_reaudit_v317.md").read_text(encoding="utf-8"))
    assert_ok("V306_FEATURE_KEPT", "CONCEPT_INTRO_DEDUP_V306_A1" in app)
    assert_ok("V305_KEPT", "PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1" in project)
    assert_ok("V304_KEPT", "MERMAID_QUALITY_MODE_V304_A1" in code)

    print(MARKER)
    print("V319_LOW_PATCH_VERIFY_OK")
    print("SOURCE_LOW_ROWS", len(source_rows))
    print("PATCH_ROWS", len(patch_rows))
    print("CHANGE_ROWS", len(change_rows))
    print("ANSWER_EXPLICIT_FAILURES", len(failures))

if __name__ == "__main__":
    main()

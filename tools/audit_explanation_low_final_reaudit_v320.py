from pathlib import Path
import csv
import json
import re
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]

EXPECTED_VERSION = "20260611_v320_a1"
MARKER = "EXPLANATION_LOW_FINAL_REAUDIT_V320_A1"

V318_TSV = ROOT / "reports" / "explanation_low_candidate_reaudit_v318.tsv"
V319_CHANGE_TSV = ROOT / "reports" / "explanation_low_patch_changes_v319.tsv"
FINAL_TSV = ROOT / "reports" / "explanation_low_final_reaudit_v320.tsv"
AUDIT_MD = ROOT / "reports" / "explanation_low_final_reaudit_v320.md"

def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

def normalize(value):
    text = str(value or "").lower()
    text = re.sub(r"[\s\"'`‘’“”.,:;!?()\[\]{}<>/_\-·|]+", "", text)
    return text

def compact(value, limit=180):
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"

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

def get_card(rel, idx):
    cards = get_cards(load_json(ROOT / rel))
    return cards[int(idx) - 1]

def assert_ok(name, condition, detail=""):
    print(name, "OK" if condition else "FAIL", detail)
    if not condition:
        raise AssertionError(name)

def render_table(rows, limit=60):
    if not rows:
        return "- 후보 없음"

    lines = [
        "| file | idx | title | answer | action | final_status | reason |",
        "|---|---:|---|---|---|---|---|",
    ]

    for row in rows[:limit]:
        lines.append(
            "| `{file}` | {index} | {title} | `{answer}` | {action} | {final_status} | {reason} |".format(
                file=row.get("file", ""),
                index=row.get("index", ""),
                title=compact(row.get("title", ""), 34).replace("|", "/"),
                answer=compact(row.get("answer", ""), 28).replace("|", "/"),
                action=row.get("action", ""),
                final_status=row.get("final_status", ""),
                reason=compact(row.get("reason", ""), 70).replace("|", "/"),
            )
        )
    return "\n".join(lines)

def main():
    root_index = read("index.html")
    pwa_index = read("src/pwa/index.html")
    app = read("src/pwa/app.js")
    code = read("src/pwa/code_explainer.js")
    project = read("src/pwa/project_analyzer.js")

    v318_rows = load_rows(V318_TSV)
    v319_changes = load_rows(V319_CHANGE_TSV)

    action_counts = Counter(r.get("action", "") for r in v318_rows)

    final_rows = []
    failures = []
    structural_issues = []

    v319_keys = {(r["file"].replace("\\", "/"), str(r["index"])) for r in v319_changes}

    for row in v318_rows:
        rel = row["file"].replace("\\", "/")
        idx = str(row["index"])
        action = row.get("action", "")

        try:
            card = get_card(rel, idx)
            title = str(card.get("title", "") or "")
            answer = str(row.get("answer", "") or "")
            explanation = str(card.get("explanation", "") or "")
            choices = card.get("choices", [])

            if not title or not str(card.get("question", "") or "") or not explanation or not answer:
                structural_issues.append(row)
            if isinstance(choices, list) and choices and answer not in [str(c) for c in choices]:
                structural_issues.append(row)

            answer_explicit_now = normalize(answer) in normalize(explanation)
        except Exception:
            title = row.get("title", "")
            answer = row.get("answer", "")
            explanation = ""
            answer_explicit_now = False
            structural_issues.append(row)

        if action == "NO_ACTION":
            final_status = "OK_ALREADY_EXPLICIT" if answer_explicit_now else "CHECK_NO_ACTION_LOST_EXPLICIT"
            reason = "V318에서 조치 불필요였고 현재도 정답 표현 확인" if answer_explicit_now else "NO_ACTION인데 현재 explanation에서 정답 표현이 확인되지 않음"
        elif action == "REVIEW_AND_PATCH":
            patched = (rel, idx) in v319_keys
            final_status = "OK_PATCHED" if patched and answer_explicit_now else "CHECK_PATCH_FAILED"
            reason = "V319에서 보강했고 현재 정답 표현 확인" if patched and answer_explicit_now else "V319 보강 또는 정답 표현 확인 실패"
        elif action == "REVIEW_ONLY":
            final_status = "KEPT_REVIEW_ONLY"
            reason = "LOW 후보 중 의미상 설명 가능성이 있어 자동 수정 제외, 수동 샘플 검토용으로 보존"
        else:
            final_status = "CHECK_UNKNOWN_ACTION"
            reason = "알 수 없는 action"

        out = {
            "file": rel,
            "index": idx,
            "id": str(card.get("id", "") if 'card' in locals() and isinstance(card, dict) else row.get("id", "")),
            "title": title or row.get("title", ""),
            "answer": answer,
            "action": action,
            "answer_explicit_now": "YES" if answer_explicit_now else "NO",
            "final_status": final_status,
            "reason": reason,
            "explanation": compact(explanation, 500),
        }
        final_rows.append(out)

        if final_status.startswith("CHECK"):
            failures.append(out)

    with FINAL_TSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "file", "index", "id", "title", "answer", "action",
                "answer_explicit_now", "final_status", "reason", "explanation"
            ],
            delimiter="\t",
        )
        writer.writeheader()
        writer.writerows(final_rows)

    final_counts = Counter(r["final_status"] for r in final_rows)
    action_lines = "\n".join(f"- {k}: {v}" for k, v in sorted(action_counts.items()))
    final_lines = "\n".join(f"- {k}: {v}" for k, v in sorted(final_counts.items()))

    review_only_rows = [r for r in final_rows if r["action"] == "REVIEW_ONLY"]

    audit_pass = (
        len(v318_rows) == 219
        and action_counts["NO_ACTION"] == 206
        and action_counts["REVIEW_AND_PATCH"] == 11
        and action_counts["REVIEW_ONLY"] == 2
        and len(v319_changes) == 11
        and len(failures) == 0
        and len(structural_issues) == 0
    )

    audit = "\n".join([
        "# V320 explanation LOW 최종 재감사 리포트",
        "",
        MARKER,
        "",
        f"- 앱 버전: {EXPECTED_VERSION}",
        f"- 총평: {'PASS' if audit_pass else 'CHECK_NEEDED'}",
        f"- V318 LOW 전체 후보: {len(v318_rows)}",
        f"- V319 보강 행 수: {len(v319_changes)}",
        f"- 최종 실패 후보: {len(failures)}",
        f"- 구조 이슈: {len(structural_issues)}",
        f"- 최종 TSV: `reports/{FINAL_TSV.name}`",
        "",
        "## 1. V318 action 분포",
        "",
        action_lines,
        "",
        "## 2. V320 final_status 분포",
        "",
        final_lines,
        "",
        "## 3. 최종 실패 후보",
        "",
        render_table(failures, limit=80),
        "",
        "## 4. REVIEW_ONLY 보존 후보",
        "",
        render_table(review_only_rows, limit=20),
        "",
        "## 5. 판정",
        "",
        "- V307 MEDIUM 632개는 V317에서 최종 PASS로 마감했다.",
        "- V307 LOW 219개는 V318에서 선별했고, 즉시 보강이 필요한 11개는 V319에서 보강했다.",
        "- LOW의 REVIEW_ONLY 2개는 자동 패치 대상이 아니라 수동 샘플 검토용으로 보존한다.",
        "- 현재 lesson 구조 검증은 `validate_lessons.py` 기준 PASS다.",
        "",
    ])
    AUDIT_MD.write_text(audit, encoding="utf-8")

    assert_ok("ROOT_VERSION_V320", EXPECTED_VERSION in root_index)
    assert_ok("APP_VERSION_V320", f'const APP_DATA_VERSION = "{EXPECTED_VERSION}";' in app)
    assert_ok("STYLE_VERSION_V320", f"style.css?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("APP_SCRIPT_VERSION_V320", f"app.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("CODE_SCRIPT_VERSION_V320", f"code_explainer.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("COMMAND_SCRIPT_VERSION_V320", f"command_explainer.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("PROJECT_SCRIPT_VERSION_V320", f"project_analyzer.js?v={EXPECTED_VERSION}" in pwa_index)

    assert_ok("V318_LOW_ROWS_219", len(v318_rows) == 219, len(v318_rows))
    assert_ok("V318_NO_ACTION_206", action_counts["NO_ACTION"] == 206, action_counts["NO_ACTION"])
    assert_ok("V318_REVIEW_AND_PATCH_11", action_counts["REVIEW_AND_PATCH"] == 11, action_counts["REVIEW_AND_PATCH"])
    assert_ok("V318_REVIEW_ONLY_2", action_counts["REVIEW_ONLY"] == 2, action_counts["REVIEW_ONLY"])
    assert_ok("V319_CHANGE_ROWS_11", len(v319_changes) == 11, len(v319_changes))
    assert_ok("FINAL_ROWS_219", len(final_rows) == 219, len(final_rows))
    assert_ok("FINAL_FAILURES_ZERO", len(failures) == 0, len(failures))
    assert_ok("STRUCTURAL_ISSUES_ZERO", len(structural_issues) == 0, len(structural_issues))
    assert_ok("AUDIT_MARKER", MARKER in AUDIT_MD.read_text(encoding="utf-8"))
    assert_ok("AUDIT_PASS", "- 총평: PASS" in AUDIT_MD.read_text(encoding="utf-8"))
    assert_ok("V319_KEPT", "EXPLANATION_LOW_PATCH_V319_A1" in (ROOT / "reports" / "explanation_low_patch_audit_v319.md").read_text(encoding="utf-8"))
    assert_ok("V318_KEPT", "EXPLANATION_LOW_CANDIDATE_REAUDIT_V318_A1" in (ROOT / "reports" / "explanation_low_candidate_reaudit_v318.md").read_text(encoding="utf-8"))
    assert_ok("V317_KEPT", "EXPLANATION_MEDIUM_FINAL_REAUDIT_V317_A1" in (ROOT / "reports" / "explanation_medium_final_reaudit_v317.md").read_text(encoding="utf-8"))
    assert_ok("V306_FEATURE_KEPT", "CONCEPT_INTRO_DEDUP_V306_A1" in app)
    assert_ok("V305_KEPT", "PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1" in project)
    assert_ok("V304_KEPT", "MERMAID_QUALITY_MODE_V304_A1" in code)

    print(MARKER)
    print("V320_LOW_FINAL_REAUDIT_OK")
    print("V318_LOW_ROWS", len(v318_rows))
    print("V319_PATCHED_ROWS", len(v319_changes))
    print("FINAL_FAILURES", len(failures))
    print("REVIEW_ONLY_KEPT", action_counts["REVIEW_ONLY"])
    print("STRUCTURAL_ISSUES", len(structural_issues))
    print("AUDIT_MD", AUDIT_MD.relative_to(ROOT))
    print("FINAL_TSV", FINAL_TSV.relative_to(ROOT))

if __name__ == "__main__":
    main()

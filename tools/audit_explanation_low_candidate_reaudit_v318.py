from pathlib import Path
import csv
import json
import re
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]

EXPECTED_VERSION = "20260611_v318_a1"
MARKER = "EXPLANATION_LOW_CANDIDATE_REAUDIT_V318_A1"

SOURCE_TSV = ROOT / "reports" / "explanation_answer_choice_alignment_candidates_v307.tsv"
REPORT_TSV = ROOT / "reports" / "explanation_low_candidate_reaudit_v318.tsv"
AUDIT_MD = ROOT / "reports" / "explanation_low_candidate_reaudit_v318.md"

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
        for name in ["cards", "lessons", "items"]:
            if isinstance(data.get(name), list):
                return data[name]
    return []

def build_card_map():
    card_map = {}
    structural_issues = []

    for path in sorted((ROOT / "data" / "lessons").glob("*.json")):
        rel = str(path.relative_to(ROOT)).replace("\\", "/")
        data = load_json(path)
        cards = get_cards(data)

        for idx, card in enumerate(cards, start=1):
            if not isinstance(card, dict):
                continue

            card_map[(rel, str(idx))] = card

            title = str(card.get("title", "") or "").strip()
            question = str(card.get("question", "") or "").strip()
            explanation = str(card.get("explanation", "") or "").strip()
            answer = str(card.get("answer", "") or "").strip()
            choices = card.get("choices", [])

            if not title or not question or not explanation or not answer:
                structural_issues.append({
                    "file": rel,
                    "index": str(idx),
                    "title": title,
                    "answer": answer,
                    "status": "STRUCTURAL_ISSUE",
                    "action": "FIX_REQUIRED",
                    "reason": "missing title/question/explanation/answer",
                })

            if isinstance(choices, list) and choices and answer not in [str(c) for c in choices]:
                structural_issues.append({
                    "file": rel,
                    "index": str(idx),
                    "title": title,
                    "answer": answer,
                    "status": "STRUCTURAL_ISSUE",
                    "action": "FIX_REQUIRED",
                    "reason": "answer not in choices",
                })

    return card_map, structural_issues

def classify_low_candidate(source_row, card, answer_explicit):
    if not card:
        return "MISSING_CARD", "FIX_REQUIRED", "현재 JSON에서 해당 카드 위치를 찾을 수 없음"

    answer = str(source_row.get("answer", "") or "")
    question = str(card.get("question", "") or source_row.get("question", "") or "")
    title = str(card.get("title", "") or source_row.get("title", "") or "")
    code = str(card.get("code", "") or "")
    detail = str(source_row.get("detail", "") or "")
    explanation = str(card.get("explanation", "") or "")

    if answer_explicit:
        return "OK_ALREADY_EXPLICIT", "NO_ACTION", "현재 explanation에 정답 표현이 직접 확인됨"

    if len(answer) <= 12 and ("print(" in code or "출력" in question or "결과" in question):
        return "POTENTIAL_MISSED_SHORT_RESULT", "REVIEW_AND_PATCH", "짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음"

    if "해설에 언급된 보기 후보" in detail:
        return "CHOICE_CONFUSION_LOW_REVIEW", "REVIEW_ONLY", "다른 보기 언급 가능성이 있어 샘플 검토 필요"

    if len(answer) > 40:
        return "LONG_ANSWER_PARAPHRASE_REVIEW", "REVIEW_ONLY", "정답 문장이 길어 정확 문자열 대신 의미상 설명일 가능성이 큼"

    if len(explanation) < 100:
        return "SHORT_LOW_EXPLANATION_REVIEW", "REVIEW_ONLY", "LOW 후보지만 해설이 짧아 근거 충분성 샘플 확인 권장"

    return "LOW_PRIORITY_PARAPHRASE_REVIEW", "REVIEW_ONLY", "LOW 후보이며 의미상 연결 여부만 샘플 확인 권장"

def render_table(rows, limit=80):
    if not rows:
        return "- 후보 없음"

    lines = [
        "| file | idx | title | answer | status | action | reason |",
        "|---|---:|---|---|---|---|---|",
    ]

    for row in rows[:limit]:
        lines.append(
            "| `{file}` | {index} | {title} | `{answer}` | {status} | {action} | {reason} |".format(
                file=row.get("file", ""),
                index=row.get("index", ""),
                title=compact(row.get("title", ""), 36).replace("|", "/"),
                answer=compact(row.get("answer", ""), 28).replace("|", "/"),
                status=row.get("status", ""),
                action=row.get("action", ""),
                reason=compact(row.get("reason", ""), 70).replace("|", "/"),
            )
        )
    return "\n".join(lines)

def assert_ok(name, condition, detail=""):
    print(name, "OK" if condition else "FAIL", detail)
    if not condition:
        raise AssertionError(name)

def main():
    root_index = read("index.html")
    pwa_index = read("src/pwa/index.html")
    app = read("src/pwa/app.js")
    code = read("src/pwa/code_explainer.js")
    project = read("src/pwa/project_analyzer.js")

    source_rows = load_rows(SOURCE_TSV)
    low_rows = [r for r in source_rows if r.get("severity") == "LOW"]

    card_map, structural_issues = build_card_map()

    report_rows = []
    missing_cards = []

    for src in low_rows:
        rel = src.get("file", "").replace("\\", "/")
        idx = str(src.get("index", ""))
        card = card_map.get((rel, idx))

        answer = str(src.get("answer", "") or "")
        explanation = str(card.get("explanation", "") or "") if card else ""
        answer_explicit = normalize(answer) in normalize(explanation)

        status, action, reason = classify_low_candidate(src, card, answer_explicit)

        if not card:
            missing_cards.append(src)

        report_rows.append({
            "file": rel,
            "index": idx,
            "id": str(card.get("id", "") if card else src.get("id", "")),
            "title": str(card.get("title", "") if card else src.get("title", "")),
            "answer": answer,
            "answer_explicit": "YES" if answer_explicit else "NO",
            "status": status,
            "action": action,
            "reason": reason,
            "question": compact(str(card.get("question", "") if card else src.get("question", "")), 500),
            "detail": compact(str(src.get("detail", "")), 500),
            "explanation": compact(explanation, 500),
        })

    with REPORT_TSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "file", "index", "id", "title", "answer", "answer_explicit",
                "status", "action", "reason", "question", "detail", "explanation"
            ],
            delimiter="\t",
        )
        writer.writeheader()
        writer.writerows(report_rows)

    status_counts = Counter(r["status"] for r in report_rows)
    action_counts = Counter(r["action"] for r in report_rows)

    status_lines = "\n".join(f"- {name}: {count}" for name, count in sorted(status_counts.items()))
    action_lines = "\n".join(f"- {name}: {count}" for name, count in sorted(action_counts.items()))

    patch_candidates = [r for r in report_rows if r["action"] == "REVIEW_AND_PATCH"]
    review_candidates = [r for r in report_rows if r["action"] == "REVIEW_ONLY"]
    no_action_rows = [r for r in report_rows if r["action"] == "NO_ACTION"]

    audit_pass = (
        len(low_rows) == 219
        and len(report_rows) == 219
        and len(missing_cards) == 0
        and len(structural_issues) == 0
    )

    audit = "\n".join([
        "# V318 explanation LOW 후보 재감사/선별 리포트",
        "",
        MARKER,
        "",
        f"- 앱 버전: {EXPECTED_VERSION}",
        f"- 총평: {'PASS' if audit_pass else 'CHECK_NEEDED'}",
        f"- V307 LOW 원본 후보: {len(low_rows)}",
        f"- 재감사 행 수: {len(report_rows)}",
        f"- 현재 JSON 카드 누락: {len(missing_cards)}",
        f"- 현재 JSON 구조 이슈: {len(structural_issues)}",
        f"- 즉시 보강 후보(REVIEW_AND_PATCH): {len(patch_candidates)}",
        f"- 샘플 검토 후보(REVIEW_ONLY): {len(review_candidates)}",
        f"- 조치 불필요(NO_ACTION): {len(no_action_rows)}",
        f"- 상세 TSV: `reports/{REPORT_TSV.name}`",
        "",
        "## 1. status 분포",
        "",
        status_lines if status_lines else "- 없음",
        "",
        "## 2. action 분포",
        "",
        action_lines if action_lines else "- 없음",
        "",
        "## 3. 즉시 보강 후보",
        "",
        render_table(patch_candidates, limit=80),
        "",
        "## 4. 샘플 검토 후보",
        "",
        render_table(review_candidates, limit=80),
        "",
        "## 5. 구조 이슈",
        "",
        render_table(structural_issues, limit=80),
        "",
        "## 6. 판정",
        "",
        "- LOW 후보는 V307 기준 낮은 우선순위 후보이므로, 이번 V318에서는 lesson JSON을 직접 수정하지 않는다.",
        "- `REVIEW_AND_PATCH`가 0이면 LOW 후보는 리포트만 남기고 마감 가능하다.",
        "- `REVIEW_AND_PATCH`가 있으면 V319에서 해당 후보만 소량 보강한다.",
        "- `REVIEW_ONLY`는 정확 문자열이 없더라도 의미상 설명으로 충분할 수 있으므로 전체 자동 보강 대상에서 제외한다.",
        "",
    ])

    AUDIT_MD.write_text(audit, encoding="utf-8")

    assert_ok("ROOT_VERSION_V318", EXPECTED_VERSION in root_index)
    assert_ok("APP_VERSION_V318", f'const APP_DATA_VERSION = "{EXPECTED_VERSION}";' in app)
    assert_ok("STYLE_VERSION_V318", f"style.css?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("APP_SCRIPT_VERSION_V318", f"app.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("CODE_SCRIPT_VERSION_V318", f"code_explainer.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("COMMAND_SCRIPT_VERSION_V318", f"command_explainer.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("PROJECT_SCRIPT_VERSION_V318", f"project_analyzer.js?v={EXPECTED_VERSION}" in pwa_index)

    assert_ok("SOURCE_LOW_219", len(low_rows) == 219, len(low_rows))
    assert_ok("REPORT_ROWS_219", len(report_rows) == 219, len(report_rows))
    assert_ok("MISSING_CARD_ZERO", len(missing_cards) == 0, len(missing_cards))
    assert_ok("STRUCTURAL_ISSUES_ZERO", len(structural_issues) == 0, len(structural_issues))
    assert_ok("AUDIT_MARKER", MARKER in AUDIT_MD.read_text(encoding="utf-8"))
    assert_ok("AUDIT_PASS", "- 총평: PASS" in AUDIT_MD.read_text(encoding="utf-8"))
    assert_ok("TSV_ROWS_219", len(load_rows(REPORT_TSV)) == 219)
    assert_ok("V317_KEPT", "EXPLANATION_MEDIUM_FINAL_REAUDIT_V317_A1" in (ROOT / "reports" / "explanation_medium_final_reaudit_v317.md").read_text(encoding="utf-8"))
    assert_ok("V306_FEATURE_KEPT", "CONCEPT_INTRO_DEDUP_V306_A1" in app)
    assert_ok("V305_KEPT", "PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1" in project)
    assert_ok("V304_KEPT", "MERMAID_QUALITY_MODE_V304_A1" in code)

    print(MARKER)
    print("V318_LOW_CANDIDATE_REAUDIT_OK")
    print("SOURCE_LOW_CANDIDATES", len(low_rows))
    print("REPORT_ROWS", len(report_rows))
    print("REVIEW_AND_PATCH", len(patch_candidates))
    print("REVIEW_ONLY", len(review_candidates))
    print("NO_ACTION", len(no_action_rows))
    print("MISSING_CARDS", len(missing_cards))
    print("STRUCTURAL_ISSUES", len(structural_issues))
    print("AUDIT_MD", AUDIT_MD.relative_to(ROOT))
    print("REPORT_TSV", REPORT_TSV.relative_to(ROOT))

if __name__ == "__main__":
    main()

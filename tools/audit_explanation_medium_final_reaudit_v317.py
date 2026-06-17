from pathlib import Path
import csv
import json
import re
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]

EXPECTED_VERSION = "20260611_v317_a1"
MARKER = "EXPLANATION_MEDIUM_FINAL_REAUDIT_V317_A1"

SOURCE_TSV = ROOT / "reports" / "explanation_answer_choice_alignment_candidates_v307.tsv"
PACKS = [
    ROOT / "reports" / "explanation_medium_review_pack_v309.tsv",
    ROOT / "reports" / "explanation_medium_review_pack_v311.tsv",
    ROOT / "reports" / "explanation_medium_review_pack_v313.tsv",
    ROOT / "reports" / "explanation_medium_review_pack_v314.tsv",
    ROOT / "reports" / "explanation_medium_review_pack_v315.tsv",
    ROOT / "reports" / "explanation_medium_review_pack_v316.tsv",
]

COVERAGE_TSV = ROOT / "reports" / "explanation_medium_final_coverage_v317.tsv"
AUDIT_MD = ROOT / "reports" / "explanation_medium_final_reaudit_v317.md"

def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

def normalize(value):
    text = str(value or "").lower()
    text = re.sub(r"[\s\"'`‘’“”.,:;!?()\[\]{}<>/_\-·|]+", "", text)
    return text

def compact(value, limit=160):
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"

def load_rows(path):
    with path.open("r", encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f, delimiter="\t"))

def key(row):
    return (row["file"].replace("\\", "/"), str(row["index"]))

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
            card_map[(rel, str(idx))] = card

            title = str(card.get("title", "") or "").strip()
            question = str(card.get("question", "") or "").strip()
            explanation = str(card.get("explanation", "") or "").strip()
            answer = str(card.get("answer", "") or "").strip()
            choices = card.get("choices", [])

            if not title or not question or not explanation or not answer:
                structural_issues.append({
                    "file": rel,
                    "index": idx,
                    "id": str(card.get("id", "")),
                    "title": title,
                    "issue": "missing title/question/explanation/answer",
                })

            if isinstance(choices, list) and choices and answer not in [str(c) for c in choices]:
                structural_issues.append({
                    "file": rel,
                    "index": idx,
                    "id": str(card.get("id", "")),
                    "title": title,
                    "issue": "answer not in choices",
                })

    return card_map, structural_issues

def render_table(rows, limit=50):
    if not rows:
        return "- 후보 없음"

    lines = [
        "| file | idx | title | answer | status | issue |",
        "|---|---:|---|---|---|---|",
    ]

    for row in rows[:limit]:
        lines.append(
            "| `{file}` | {index} | {title} | `{answer}` | {status} | {issue} |".format(
                file=row.get("file", ""),
                index=row.get("index", ""),
                title=compact(row.get("title", ""), 38).replace("|", "/"),
                answer=compact(row.get("answer", ""), 30).replace("|", "/"),
                status=row.get("status", ""),
                issue=compact(row.get("issue", ""), 60).replace("|", "/"),
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

    source_rows_all = load_rows(SOURCE_TSV)
    medium_rows = [r for r in source_rows_all if r.get("severity") == "MEDIUM"]
    medium_map = {key(r): r for r in medium_rows}
    medium_keys = set(medium_map)

    pack_rows = []
    pack_key_to_pack = {}

    for pack in PACKS:
        rows = load_rows(pack)
        for row in rows:
            row_key = key(row)
            pack_rows.append((pack.name, row_key, row))
            pack_key_to_pack.setdefault(row_key, []).append(pack.name)

    covered_keys = set(pack_key_to_pack)
    missing_keys = medium_keys - covered_keys
    extra_keys = covered_keys - medium_keys
    duplicate_keys = {k: v for k, v in pack_key_to_pack.items() if len(v) > 1}

    card_map, structural_issues = build_card_map()

    coverage_rows = []
    answer_failures = []

    for row_key in sorted(medium_keys):
        src = medium_map[row_key]
        card = card_map.get(row_key)

        if not card:
            status = "MISSING_CARD"
            issue = "current JSON card not found"
            answer_ok = "NO"
            explanation = ""
        else:
            answer = str(src.get("answer", "") or "")
            explanation = str(card.get("explanation", "") or "")
            ok = normalize(answer) in normalize(explanation)
            status = "OK" if row_key in covered_keys and ok else "CHECK"
            issue = ""
            answer_ok = "YES" if ok else "NO"

            if row_key not in covered_keys:
                issue = "not covered by V309/V311/V313/V314/V315/V316 packs"
            elif not ok:
                issue = "answer expression not found in current explanation"

        out = {
            "file": row_key[0],
            "index": row_key[1],
            "id": str(card.get("id", "") if card else src.get("id", "")),
            "title": str(card.get("title", "") if card else src.get("title", "")),
            "answer": str(src.get("answer", "")),
            "covered_by": ",".join(pack_key_to_pack.get(row_key, [])),
            "answer_explicit": answer_ok,
            "status": status,
            "issue": issue,
            "explanation": compact(explanation, 500),
        }
        coverage_rows.append(out)

        if status != "OK":
            answer_failures.append(out)

    with COVERAGE_TSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "file", "index", "id", "title", "answer",
                "covered_by", "answer_explicit", "status", "issue", "explanation"
            ],
            delimiter="\t",
        )
        writer.writeheader()
        writer.writerows(coverage_rows)

    pack_counts = Counter(pack_name for pack_name, _row_key, _row in pack_rows)
    pack_lines = "\n".join(f"- {name}: {count}" for name, count in sorted(pack_counts.items()))

    audit_pass = (
        len(medium_rows) == 632
        and len(covered_keys & medium_keys) == 632
        and len(missing_keys) == 0
        and len(extra_keys) == 0
        and len(duplicate_keys) == 0
        and len(answer_failures) == 0
        and len(structural_issues) == 0
    )

    audit = "\n".join([
        "# V317 explanation MEDIUM 최종 재감사 리포트",
        "",
        MARKER,
        "",
        f"- 앱 버전: {EXPECTED_VERSION}",
        f"- 총평: {'PASS' if audit_pass else 'CHECK_NEEDED'}",
        f"- V307 MEDIUM 원본 후보: {len(medium_rows)}",
        f"- 처리팩 고유 커버리지: {len(covered_keys & medium_keys)}",
        f"- 누락 후보: {len(missing_keys)}",
        f"- 중복 처리 후보: {len(duplicate_keys)}",
        f"- 원본 MEDIUM 외 추가 후보: {len(extra_keys)}",
        f"- 현재 JSON 정답 표현 미확인: {len(answer_failures)}",
        f"- 현재 JSON 구조 이슈: {len(structural_issues)}",
        f"- 커버리지 TSV: `reports/{COVERAGE_TSV.name}`",
        "",
        "## 1. 처리팩별 행 수",
        "",
        pack_lines,
        "",
        "## 2. 판정",
        "",
        "- V309/V310, V311/V312, V313, V314, V315, V316으로 V307 MEDIUM 후보 632개를 전부 커버했다.",
        "- 현재 JSON 기준으로 각 후보의 explanation에 정답 표현이 직접 확인된다.",
        "- lesson/card 수와 필수 필드는 별도 `validate_lessons.py`로 확인한다.",
        "",
        "## 3. 누락/실패 후보",
        "",
        render_table(answer_failures, limit=80),
        "",
        "## 4. 구조 이슈",
        "",
        render_table(structural_issues, limit=80),
        "",
    ])

    AUDIT_MD.write_text(audit, encoding="utf-8")

    assert_ok("ROOT_VERSION_V317", EXPECTED_VERSION in root_index)
    assert_ok("APP_VERSION_V317", f'const APP_DATA_VERSION = "{EXPECTED_VERSION}";' in app)
    assert_ok("STYLE_VERSION_V317", f"style.css?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("APP_SCRIPT_VERSION_V317", f"app.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("CODE_SCRIPT_VERSION_V317", f"code_explainer.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("COMMAND_SCRIPT_VERSION_V317", f"command_explainer.js?v={EXPECTED_VERSION}" in pwa_index)
    assert_ok("PROJECT_SCRIPT_VERSION_V317", f"project_analyzer.js?v={EXPECTED_VERSION}" in pwa_index)

    assert_ok("SOURCE_MEDIUM_632", len(medium_rows) == 632, len(medium_rows))
    assert_ok("COVERED_MEDIUM_632", len(covered_keys & medium_keys) == 632, len(covered_keys & medium_keys))
    assert_ok("MISSING_MEDIUM_ZERO", len(missing_keys) == 0, len(missing_keys))
    assert_ok("DUPLICATE_MEDIUM_ZERO", len(duplicate_keys) == 0, len(duplicate_keys))
    assert_ok("EXTRA_MEDIUM_ZERO", len(extra_keys) == 0, len(extra_keys))
    assert_ok("ANSWER_EXPLICIT_FAILURES_ZERO", len(answer_failures) == 0, len(answer_failures))
    assert_ok("STRUCTURAL_ISSUES_ZERO", len(structural_issues) == 0, len(structural_issues))
    assert_ok("AUDIT_MARKER", MARKER in AUDIT_MD.read_text(encoding="utf-8"))
    assert_ok("AUDIT_PASS", "- 총평: PASS" in AUDIT_MD.read_text(encoding="utf-8"))
    assert_ok("COVERAGE_ROWS_632", len(load_rows(COVERAGE_TSV)) == 632)
    assert_ok("V316_KEPT", "EXPLANATION_MEDIUM_REVIEW_AND_PATCH_V316_A1" in (ROOT / "reports" / "explanation_answer_explicit_patch_audit_v316.md").read_text(encoding="utf-8"))
    assert_ok("V306_FEATURE_KEPT", "CONCEPT_INTRO_DEDUP_V306_A1" in app)
    assert_ok("V305_KEPT", "PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1" in project)
    assert_ok("V304_KEPT", "MERMAID_QUALITY_MODE_V304_A1" in code)

    print(MARKER)
    print("V317_FINAL_REAUDIT_OK")
    print("SOURCE_MEDIUM_CANDIDATES", len(medium_rows))
    print("COVERED_MEDIUM_CANDIDATES", len(covered_keys & medium_keys))
    print("MISSING_MEDIUM_CANDIDATES", len(missing_keys))
    print("ANSWER_EXPLICIT_FAILURES", len(answer_failures))
    print("STRUCTURAL_ISSUES", len(structural_issues))
    print("AUDIT_MD", AUDIT_MD.relative_to(ROOT))
    print("COVERAGE_TSV", COVERAGE_TSV.relative_to(ROOT))

if __name__ == "__main__":
    main()

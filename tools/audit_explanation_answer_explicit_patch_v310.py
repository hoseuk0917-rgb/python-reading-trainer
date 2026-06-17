import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_VERSION = "20260611_v310_a1"
MARKER = "EXPLANATION_ANSWER_EXPLICIT_PATCH_V310_A1"

SOURCE_TSV = ROOT / "reports" / "explanation_medium_review_pack_v309.tsv"
CHANGE_TSV = ROOT / "reports" / "explanation_answer_explicit_patch_changes_v310.tsv"
REPORT = ROOT / "reports" / "explanation_answer_explicit_patch_audit_v310.md"

def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

def normalize(value):
    text = str(value or "").lower()
    text = re.sub(r"[\s\"'`‘’“”.,:;!?()\[\]{}<>/_\-·|]+", "", text)
    return text

def compact(value, limit=180):
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"

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

def render_table(rows, limit=80):
    if not rows:
        return "- 후보 없음"

    lines = [
        "| rank | file | idx | title | answer | final sentence |",
        "|---:|---|---:|---|---|---|",
    ]

    for row in rows[:limit]:
        lines.append(
            "| {rank} | `{file}` | {index} | {title} | `{answer}` | {sentence} |".format(
                rank=row["rank"],
                file=row["file"],
                index=row["index"],
                title=compact(row["title"], 32).replace("|", "/"),
                answer=compact(row["answer"], 28).replace("|", "/"),
                sentence=compact(row["final_sentence"], 70).replace("|", "/"),
            )
        )
    return "\n".join(lines)

def main():
    app = read("src/pwa/app.js")
    index = read("src/pwa/index.html")
    root_index = read("index.html")

    source_rows = load_rows(SOURCE_TSV)
    change_rows = load_rows(CHANGE_TSV)

    failures = []
    checked = []

    for row in source_rows:
        rel = row["file"].replace("\\", "/")
        idx = int(row["index"])
        cards = get_cards(load_json(ROOT / rel))
        card = cards[idx - 1]

        answer = str(row["answer"] or "")
        explanation = str(card.get("explanation", "") or "")

        ok = normalize(answer) in normalize(explanation)

        checked.append({
            "rank": row["rank"],
            "file": rel,
            "index": row["index"],
            "title": row["title"],
            "answer": answer,
            "final_sentence": next((r["final_sentence"] for r in change_rows if r["rank"] == row["rank"]), ""),
            "ok": ok,
        })

        if not ok:
            failures.append(checked[-1])

    changed_yes = [r for r in change_rows if r["changed"] == "YES"]

    pass_result = (
        EXPECTED_VERSION in root_index
        and f'const APP_DATA_VERSION = "{EXPECTED_VERSION}";' in app
        and f"app.js?v={EXPECTED_VERSION}" in index
        and len(source_rows) == 40
        and len(change_rows) == 40
        and len(failures) == 0
        and len(changed_yes) >= 1
    )

    report = "\n".join([
        "# V310 explanation 정답 연결 문장 명시 패치 감사 리포트",
        "",
        MARKER,
        "",
        f"- 앱 버전: {EXPECTED_VERSION}",
        f"- 총평: {'PASS' if pass_result else 'CHECK_NEEDED'}",
        f"- V309 검토팩 대상: {len(source_rows)}",
        f"- 변경 기록: {len(change_rows)}",
        f"- 실제 explanation 변경: {len(changed_yes)}",
        f"- 정답 표현 미확인: {len(failures)}",
        f"- 변경 TSV: `reports/{CHANGE_TSV.name}`",
        "",
        "## 1. 목적",
        "",
        "V309 검토팩 상위 40개 카드의 정답 후 해설에 정답 표현이 직접 드러나도록 마지막 문장을 보강했다.",
        "정답 선택 이후에 표시되는 `explanation`이므로, 여기서는 `따라서 출력은 ...이다` 같은 명시 문장을 허용한다.",
        "",
        "## 2. 적용 원칙",
        "",
        "- 문제 전 개념 안내에는 정답을 노출하지 않는다.",
        "- 정답 선택 후 해설에는 정답 값을 명확히 써도 된다.",
        "- 기존 해설을 삭제하지 않고 마지막에 정답 연결 문장만 추가한다.",
        "- V309 상위 40개만 우선 처리한다.",
        "",
        "## 3. 변경 목록",
        "",
        render_table(change_rows, limit=80),
        "",
        "## 4. 정답 표현 미확인 후보",
        "",
        "- 후보 없음" if not failures else render_table(failures, limit=80),
        "",
        "## 5. 다음 단계",
        "",
        "- V311: V309/V310 결과를 바탕으로 V307 MEDIUM 후보 중 다음 40개 batch 생성",
        "- V312 후보: 초급 foundation 계열의 반복 템플릿 해설 축약",
        "",
    ])

    REPORT.write_text(report, encoding="utf-8")

    print(MARKER)
    print("REPORT", REPORT.relative_to(ROOT))
    print("CHANGE_TSV", CHANGE_TSV.relative_to(ROOT))
    print("SOURCE_ROWS", len(source_rows))
    print("CHANGE_ROWS", len(change_rows))
    print("CHANGED_YES", len(changed_yes))
    print("ANSWER_EXPLICIT_FAILURES", len(failures))
    print("AUDIT_RESULT", "PASS" if pass_result else "CHECK_NEEDED")

    if not pass_result:
        raise SystemExit(1)

if __name__ == "__main__":
    main()

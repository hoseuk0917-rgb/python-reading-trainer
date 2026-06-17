import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_VERSION = "20260611_v308_a1"
MARKER = "READING_GOAL_TEMPLATE_CLEANUP_V308_A1"

REPORT_PATH = ROOT / "reports" / "reading_goal_template_cleanup_audit_v308.md"
CHANGE_TSV = ROOT / "reports" / "reading_goal_template_cleanup_changes_v308.tsv"

BAD_TEMPLATE_RE = re.compile(
    r"[‘'].+?[’']라는 목표를 바탕으로,\s*코드 단서와 실행 이유를 함께 구분하는 연습입니다\.?"
)

def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

def load_cards(path):
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for key in ["cards", "lessons", "items"]:
            if isinstance(data.get(key), list):
                return data[key]
    return []

def compact(value, limit=120):
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"

def read_changes():
    if not CHANGE_TSV.exists():
        return []
    with CHANGE_TSV.open("r", encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f, delimiter="\t"))

def render_changes(rows, limit=80):
    if not rows:
        return "- 변경 기록 없음"

    lines = [
        "| file | idx | title | before | after |",
        "|---|---:|---|---|---|",
    ]

    for row in rows[:limit]:
        lines.append(
            "| `{file}` | {index} | {title} | {before} | {after} |".format(
                file=row["file"],
                index=row["index"],
                title=compact(row["title"], 30).replace("|", "/"),
                before=compact(row["old_reading_goal"], 54).replace("|", "/"),
                after=compact(row["new_reading_goal"], 54).replace("|", "/"),
            )
        )

    if len(rows) > limit:
        lines.append(f"| ... | ... | ... | ... | 이후 {len(rows) - limit}개는 TSV 참고 |")

    return "\n".join(lines)

def main():
    app = read("src/pwa/app.js")
    root_index = read("index.html")
    index = read("src/pwa/index.html")

    lesson_files = sorted((ROOT / "data" / "lessons").glob("*.json"))

    total_cards = 0
    goals = 0
    bad_rows = []

    for path in lesson_files:
        cards = load_cards(path)
        total_cards += len(cards)
        for idx, card in enumerate(cards, start=1):
            if not isinstance(card, dict):
                continue
            goal = str(card.get("reading_goal", "") or "")
            if goal:
                goals += 1
            if BAD_TEMPLATE_RE.search(goal):
                bad_rows.append({
                    "file": str(path.relative_to(ROOT)).replace("\\", "/"),
                    "index": idx,
                    "title": str(card.get("title", "")),
                    "reading_goal": goal,
                })

    first_cards = load_cards(ROOT / "data" / "lessons" / "cards_seed_v1.json")
    first_goal = first_cards[0].get("reading_goal", "") if first_cards else ""

    changes = read_changes()
    pass_result = (
        EXPECTED_VERSION in root_index
        and f'const APP_DATA_VERSION = "{EXPECTED_VERSION}";' in app
        and f"app.js?v={EXPECTED_VERSION}" in index
        and total_cards == 1785
        and len(bad_rows) == 0
        and "목표를 바탕으로" not in first_goal
    )

    report = "\n".join([
        "# V308 reading_goal 템플릿 문장 정리 감사 리포트",
        "",
        MARKER,
        "",
        f"- 앱 버전: {EXPECTED_VERSION}",
        f"- 총평: {'PASS' if pass_result else 'CHECK_NEEDED'}",
        f"- LESSON_CARDS: {total_cards}",
        f"- READING_GOAL_FIELDS: {goals}",
        f"- CLEANED_READING_GOALS: {len(changes)}",
        f"- REMAINING_BAD_TEMPLATE: {len(bad_rows)}",
        f"- 변경 TSV: `reports/{CHANGE_TSV.name}`",
        "",
        "## 1. 목적",
        "",
        "`reading_goal`이 함수 설명처럼 보이거나 기계적인 문장으로 길게 노출되는 문제를 줄이기 위해,",
        "정확한 목표 문장만 남기고 `~라는 목표를 바탕으로...` 템플릿 꼬리를 제거했다.",
        "",
        "## 2. 적용 원칙",
        "",
        "- 정답을 유도하는 예시를 새로 넣지 않는다.",
        "- `reading_goal`은 문제 전 대표 설명이 아니라 접힌 보조 목표로 유지한다.",
        "- 정확한 학습 목표 문장만 남기고 템플릿 꼬리는 제거한다.",
        "- 코드/정답 해설인 `explanation`은 이번 작업에서 수정하지 않는다.",
        "",
        "## 3. 첫 카드 확인",
        "",
        f"- 첫 카드 reading_goal: `{first_goal}`",
        "",
        "## 4. 변경 샘플",
        "",
        render_changes(changes, limit=80),
        "",
        "## 5. 잔여 템플릿",
        "",
        "- 후보 없음" if not bad_rows else "\n".join(
            f"- `{row['file']}` #{row['index']} {row['title']}: {compact(row['reading_goal'], 100)}"
            for row in bad_rows[:80]
        ),
        "",
        "## 6. 다음 단계",
        "",
        "- V309: V307 MEDIUM 후보 중 실제 오류와 오탐을 분류하고 초반/핵심 카드 복구 batch 진행",
        "- V310 후보: side card 본문 반복 문장/억지 장문 정리",
        "",
    ])

    REPORT_PATH.write_text(report, encoding="utf-8")

    print(MARKER)
    print("REPORT", REPORT_PATH.relative_to(ROOT))
    print("CHANGE_TSV", CHANGE_TSV.relative_to(ROOT))
    print("LESSON_CARDS", total_cards)
    print("READING_GOAL_FIELDS", goals)
    print("CLEANED_READING_GOALS", len(changes))
    print("REMAINING_BAD_TEMPLATE", len(bad_rows))
    print("FIRST_READING_GOAL", first_goal)
    print("AUDIT_RESULT", "PASS" if pass_result else "CHECK_NEEDED")

    if not pass_result:
        raise SystemExit(1)

if __name__ == "__main__":
    main()

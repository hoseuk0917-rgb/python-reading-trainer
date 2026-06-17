import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_VERSION = "20260611_v307_a1"
MARKER = "AUDIT_EXPLANATION_ANSWER_CHOICE_ALIGNMENT_V307_A1"

REPORT_PATH = ROOT / "reports" / "explanation_answer_choice_alignment_audit_v307.md"
TSV_PATH = ROOT / "reports" / "explanation_answer_choice_alignment_candidates_v307.tsv"

TEMPLATE_PHRASES = [
    "이 문제는",
    "정답은 보기의",
    "비슷한 코드를 만났을 때도",
    "차례대로 확인하면",
    "이 독해 습관은",
    "나중에",
    "그대로 이어진다",
]

IGNORE_ANSWER_TEXTS = {
    "",
    "true",
    "false",
    "none",
    "null",
    "yes",
    "no",
    "예",
    "아니오",
    "맞음",
    "틀림",
    "없음",
    "있음",
}

KOREAN_NUMBER_HINTS = {
    "0": ["0", "영", "공", "0개"],
    "1": ["1", "하나", "한 개", "1개", "첫 번째"],
    "2": ["2", "둘", "두 개", "2개", "두 번째"],
    "3": ["3", "셋", "세 개", "3개", "세 번째"],
    "4": ["4", "넷", "네 개", "4개", "네 번째"],
    "5": ["5", "다섯", "다섯 개", "5개"],
    "6": ["6", "여섯", "여섯 개", "6개"],
    "7": ["7", "일곱", "일곱 개", "7개"],
    "8": ["8", "여덟", "여덟 개", "8개"],
    "9": ["9", "아홉", "아홉 개", "9개"],
    "10": ["10", "열", "열 개", "10개"],
}

def read_text(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

def normalize(value):
    text = str(value or "").lower()
    text = text.replace("\\n", " ")
    text = re.sub(r"[\s\"'`‘’“”.,:;!?()\[\]{}<>/_\-·|]+", "", text)
    return text

def compact(value, limit=120):
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"

def load_cards(path):
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for key in ["cards", "lessons", "items"]:
            if isinstance(data.get(key), list):
                return data[key]
    return []

def choice_text(choice):
    if isinstance(choice, str):
        return choice
    if isinstance(choice, dict):
        for key in ["text", "label", "value", "answer", "title"]:
            if key in choice:
                return str(choice[key])
        return json.dumps(choice, ensure_ascii=False)
    return str(choice)

def card_choices(card):
    choices = card.get("choices", [])
    if not isinstance(choices, list):
        return []
    return [choice_text(choice) for choice in choices]

def answer_text(card):
    return str(card.get("answer", "")).strip()

def is_meaningful_answer(answer):
    raw = str(answer or "").strip()
    if normalize(raw) in IGNORE_ANSWER_TEXTS:
        return False
    if len(raw) == 1 and not raw.isdigit():
        return False
    return True

def answer_tokens(answer):
    raw = str(answer or "")
    tokens = re.findall(r"[A-Za-z가-힣0-9_]+", raw)
    return [t for t in tokens if len(t) >= 2 or t.isdigit()]

def answer_mentioned(answer, explanation):
    if not is_meaningful_answer(answer):
        return True

    ans = str(answer or "").strip()
    exp_norm = normalize(explanation)
    ans_norm = normalize(ans)

    if ans_norm and ans_norm in exp_norm:
        return True

    if ans in KOREAN_NUMBER_HINTS:
        return any(normalize(item) in exp_norm for item in KOREAN_NUMBER_HINTS[ans])

    tokens = answer_tokens(ans)
    if tokens:
        hit_count = sum(1 for token in tokens if normalize(token) and normalize(token) in exp_norm)
        if len(tokens) == 1:
            return hit_count == 1
        return hit_count >= max(1, min(2, len(tokens)))

    return False

def choice_mentions(choices, explanation):
    mentioned = []
    exp_norm = normalize(explanation)
    for choice in choices:
        if not is_meaningful_answer(choice):
            continue
        cn = normalize(choice)
        if cn and len(cn) >= 2 and cn in exp_norm:
            mentioned.append(choice)
        elif str(choice).strip() in KOREAN_NUMBER_HINTS:
            if any(normalize(item) in exp_norm for item in KOREAN_NUMBER_HINTS[str(choice).strip()]):
                mentioned.append(choice)
    return mentioned

def template_score(explanation):
    return sum(1 for phrase in TEMPLATE_PHRASES if phrase in str(explanation or ""))

def issue(severity, code, detail, path, index, card):
    return {
        "severity": severity,
        "code": code,
        "detail": detail,
        "file": str(path.relative_to(ROOT)).replace("\\\\", "/"),
        "index": index,
        "id": str(card.get("id", "")),
        "title": str(card.get("title", "")),
        "question": str(card.get("question", "")),
        "answer": answer_text(card),
        "explanation": str(card.get("explanation", "")),
    }

def analyze_card(path, index, card):
    issues = []

    explanation = str(card.get("explanation", "") or "").strip()
    answer = answer_text(card)
    choices = card_choices(card)

    if not explanation:
        issues.append(issue("HIGH", "MISSING_EXPLANATION", "explanation 필드가 비어 있다.", path, index, card))
        return issues

    if not choices:
        issues.append(issue("HIGH", "MISSING_CHOICES", "choices가 비어 있거나 배열이 아니다.", path, index, card))

    if answer and choices:
        normalized_choices = {normalize(choice) for choice in choices}
        if normalize(answer) not in normalized_choices:
            issues.append(issue("HIGH", "ANSWER_NOT_IN_CHOICES", "answer가 choices 안에 없다.", path, index, card))

    if is_meaningful_answer(answer) and not answer_mentioned(answer, explanation):
        mentioned = choice_mentions(choices, explanation)
        detail = "해설에서 정답 표현을 직접 찾기 어렵다."
        if mentioned:
            detail += " 해설에 언급된 보기 후보: " + ", ".join(mentioned[:4])
        issues.append(issue("MEDIUM", "ANSWER_NOT_EXPLICIT_IN_EXPLANATION", detail, path, index, card))

    if len(explanation) < 35:
        issues.append(issue("MEDIUM", "EXPLANATION_TOO_SHORT", "해설이 너무 짧아 정답 근거가 부족할 수 있다.", path, index, card))

    t_score = template_score(explanation)
    if t_score >= 4:
        issues.append(issue("LOW", "TEMPLATE_HEAVY_EXPLANATION", f"반복 템플릿 문장 신호 {t_score}개.", path, index, card))

    if len(explanation) > 620:
        issues.append(issue("LOW", "EXPLANATION_TOO_LONG", f"해설 길이 {len(explanation)}자. 장황함 점검 후보.", path, index, card))

    mentioned_choices = choice_mentions(choices, explanation)
    if len(mentioned_choices) >= 3 and answer_mentioned(answer, explanation):
        issues.append(issue("LOW", "MANY_CHOICES_MENTIONED", "여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다.", path, index, card))

    return issues

def render_issue_table(rows, limit=80):
    if not rows:
        return "- 후보 없음"

    lines = [
        "| severity | code | file | idx | title | answer | detail |",
        "|---|---|---:|---:|---|---|---|",
    ]
    for row in rows[:limit]:
        lines.append(
            "| {severity} | {code} | `{file}` | {index} | {title} | `{answer}` | {detail} |".format(
                severity=row["severity"],
                code=row["code"],
                file=row["file"],
                index=row["index"],
                title=compact(row["title"], 34).replace("|", "/"),
                answer=compact(row["answer"], 24).replace("|", "/"),
                detail=compact(row["detail"], 70).replace("|", "/"),
            )
        )

    if len(rows) > limit:
        lines.append(f"| ... | ... | ... | ... | ... | ... | 이후 {len(rows) - limit}개 후보는 TSV 참고 |")

    return "\n".join(lines)

def main():
    lesson_files = sorted((ROOT / "data" / "lessons").glob("*.json"))

    all_issues = []
    total_cards = 0

    for path in lesson_files:
        cards = load_cards(path)
        total_cards += len(cards)
        for index, card in enumerate(cards, start=1):
            if isinstance(card, dict):
                all_issues.extend(analyze_card(path, index, card))

    severity_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    all_issues.sort(key=lambda row: (severity_order.get(row["severity"], 9), row["file"], row["index"], row["code"]))

    high = [row for row in all_issues if row["severity"] == "HIGH"]
    medium = [row for row in all_issues if row["severity"] == "MEDIUM"]
    low = [row for row in all_issues if row["severity"] == "LOW"]

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)

    with TSV_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, delimiter="\t")
        writer.writerow(["severity", "code", "file", "index", "id", "title", "answer", "question", "detail", "explanation_preview"])
        for row in all_issues:
            writer.writerow([
                row["severity"],
                row["code"],
                row["file"],
                row["index"],
                row["id"],
                row["title"],
                row["answer"],
                row["question"],
                row["detail"],
                compact(row["explanation"], 260),
            ])

    pass_result = len(high) == 0 and total_cards == 1785

    report = "\n".join([
        "# V307 정답 해설 연결성 자동 감사 리포트",
        "",
        MARKER,
        "",
        f"- 앱 버전: {EXPECTED_VERSION}",
        f"- 총평: {'PASS' if pass_result else 'CHECK_NEEDED'}",
        f"- LESSON_CARDS: {total_cards}",
        f"- HIGH_ISSUES: {len(high)}",
        f"- MEDIUM_CANDIDATES: {len(medium)}",
        f"- LOW_CANDIDATES: {len(low)}",
        f"- 후보 TSV: `reports/{TSV_PATH.name}`",
        "",
        "## 1. 목적",
        "",
        "정답 선택 후 보이는 `explanation`이 실제 `answer` 및 `choices`와 연결되는지 자동으로 감사한다.",
        "이번 버전은 데이터를 바로 고치지 않고, 고위험 오류와 중간 점검 후보를 분리해 다음 콘텐츠 복구 작업의 기준을 만든다.",
        "",
        "## 2. 판정 기준",
        "",
        "- HIGH: explanation 없음, choices 없음, answer가 choices에 없음",
        "- MEDIUM: 해설에서 정답 표현을 직접 찾기 어렵거나 해설이 지나치게 짧음",
        "- LOW: 반복 템플릿, 장문 해설, 보기 과다 언급 등 품질 점검 후보",
        "",
        "## 3. HIGH 이슈",
        "",
        render_issue_table(high, limit=80),
        "",
        "## 4. MEDIUM 후보",
        "",
        render_issue_table(medium, limit=80),
        "",
        "## 5. LOW 후보",
        "",
        render_issue_table(low, limit=80),
        "",
        "## 6. 다음 단계",
        "",
        "- V308: `reading_goal` 템플릿 문장 대량 정리",
        "- V309: V307 MEDIUM 후보 중 실제 오탐/실제 오류를 분류하고 첫 복구 batch 진행",
        "- 이후: explanation 선택지별 피드백 UX 또는 오답 선택 시 보강 설명 검토",
        "",
    ])

    REPORT_PATH.write_text(report, encoding="utf-8")

    print(MARKER)
    print("REPORT", REPORT_PATH.relative_to(ROOT))
    print("TSV", TSV_PATH.relative_to(ROOT))
    print("LESSON_CARDS", total_cards)
    print("HIGH_ISSUES", len(high))
    print("MEDIUM_CANDIDATES", len(medium))
    print("LOW_CANDIDATES", len(low))
    print("AUDIT_RESULT", "PASS" if pass_result else "CHECK_NEEDED")

    if not pass_result:
        raise SystemExit(1)

if __name__ == "__main__":
    main()

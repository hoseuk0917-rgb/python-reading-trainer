#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
REVIEW = ROOT / "docs/audit/v356_full_review.json"
TRACE_TYPES = {"output_prediction", "order_choice", "flow"}
TARGET_LEVELS = set(range(4, 11))

GENERATED_FLOW_MARKERS = (
    "try 안에서 실제로 예외가 생기는 줄",
    "코루틴이 만들어지는 지점",
    "함수 정의와 호출을 먼저 구분",
    "객체가 만들어질 때의 초기 속성",
    "조건식을 먼저 True 또는 False로 계산",
    "반복 전 초기값을 적고 조건 검사",
    "반복 대상에서 값이 들어오는 순서",
    "경로를 준비하는 단계",
    "JSON 텍스트가 파싱되어",
    "원본 DataFrame과 선택·필터·집계",
    "입력 배열의 shape와 값",
    "패턴과 대상 문자열을 먼저 구분",
    "요청에 들어가는 URL·인자",
    "add_argument로 정한 옵션",
    "yield에서 값을 하나 내보내며",
    "먼저 사용한 key를 확인",
    "메서드 호출 전의 항목들",
    "오른쪽 식을 먼저 계산해 나온 값",
    "각 줄이 받는 입력과 그 줄이 만든 결과",
)


def compact(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def text_hash(card: dict) -> str:
    payload = {k: card.get(k) for k in ("title", "reading_goal", "code", "question", "answer", "explanation", "project_context")}
    return hashlib.sha256(json.dumps(payload, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()


def split_sentences(text: str) -> list[str]:
    return [x.strip() for x in re.split(r"(?<=[.!?])\s+", compact(text)) if x.strip()]


def generated_nontrace_sentence(sentence: str, title: str) -> bool:
    if not sentence.startswith(f"‘{title}’에서는"):
        return False
    return any(marker in sentence for marker in GENERATED_FLOW_MARKERS)


def replace_answer_as_runtime_result(sentence: str, answer: str, qtype: str) -> tuple[str, bool]:
    if qtype == "output_prediction" or not answer or answer not in sentence:
        return sentence, False
    original = sentence
    sentence = re.sub(r"따라서\s+(?:실제\s+)?출력은", "따라서 이 질문의 정답은", sentence)
    sentence = re.sub(r"(?<!따라서\s)(?:실제\s+)?출력은", "이 질문에서 고를 정답은", sentence)
    sentence = re.sub(r"따라서\s+(?:반환/호출|반환|호출)\s*결과는", "따라서 이 질문의 정답은", sentence)
    return sentence, sentence != original


def main() -> None:
    review = json.loads(REVIEW.read_text(encoding="utf-8")) if REVIEW.exists() else {"cards": []}
    review_map = {(int(row.get("level", -1)), str(row.get("file")), str(row.get("id"))): row for row in review.get("cards", [])}

    changed_files = set()
    changed_cards = 0
    removed_nontrace = 0
    fixed_runtime_labels = 0
    payloads = {}

    for path in sorted(LESSON_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        payloads[path] = payload
        for card in payload:
            if not isinstance(card, dict) or not card.get("id") or not str(card.get("level", "")).isdigit():
                continue
            level = int(card["level"])
            if level not in TARGET_LEVELS:
                continue
            qtype = str(card.get("question_type") or "")
            title = compact(card.get("title"))
            answer = compact(card.get("answer"))
            explanation = compact(card.get("explanation"))
            before_sha = text_hash(card)
            reasons = []

            result = []
            for sentence in split_sentences(explanation):
                if qtype not in TRACE_TYPES and generated_nontrace_sentence(sentence, title):
                    removed_nontrace += 1
                    if "remove_nontrace_execution_addon" not in reasons:
                        reasons.append("remove_nontrace_execution_addon")
                    continue
                sentence, fixed = replace_answer_as_runtime_result(sentence, answer, qtype)
                if fixed:
                    fixed_runtime_labels += 1
                    if "correct_answer_vs_runtime_wording" not in reasons:
                        reasons.append("correct_answer_vs_runtime_wording")
                result.append(sentence)

            new_explanation = " ".join(result).strip()
            if not new_explanation:
                raise SystemExit(f"V356_REPAIR_EMPTIED_EXPLANATION={path.name}|{card['id']}")
            if new_explanation == explanation:
                continue

            card["explanation"] = new_explanation
            after_sha = text_hash(card)
            changed_cards += 1
            changed_files.add(path)

            key = (level, path.name, str(card["id"]))
            row = review_map.get(key)
            if row is not None:
                row["action"] = "rewritten"
                existing = list(row.get("reasons") or [])
                for reason in reasons:
                    if reason not in existing:
                        existing.append(reason)
                row["reasons"] = existing
                row["after_sha256"] = after_sha
                if not row.get("before_sha256"):
                    row["before_sha256"] = before_sha

    for path in sorted(changed_files):
        path.write_text(json.dumps(payloads[path], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if REVIEW.exists():
        review["cards"] = sorted(review_map.values(), key=lambda x: (int(x["level"]), str(x["file"]), str(x["id"])))
        review["semantic_repair_cards"] = changed_cards
        review["semantic_removed_nontrace_addons"] = removed_nontrace
        review["semantic_fixed_runtime_labels"] = fixed_runtime_labels
        REVIEW.write_text(json.dumps(review, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"V356_SEMANTIC_REPAIR_CARDS={changed_cards}")
    print(f"V356_SEMANTIC_REMOVED_NONTRACE={removed_nontrace}")
    print(f"V356_SEMANTIC_FIXED_RUNTIME_LABELS={fixed_runtime_labels}")
    print(f"V356_SEMANTIC_REPAIR_FILES={len(changed_files)}")
    print("RESULT=PASS_V356_SEMANTIC_REPAIR")


if __name__ == "__main__":
    main()

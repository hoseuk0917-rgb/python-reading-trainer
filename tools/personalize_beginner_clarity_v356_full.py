#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
REVIEW = ROOT / "docs/audit/v356_full_review.json"
TARGET_LEVELS = set(range(4, 11))

KEYWORDS = {
    "if", "else", "elif", "for", "while", "def", "return", "try", "except", "finally",
    "with", "as", "import", "from", "in", "and", "or", "not", "is", "lambda", "yield",
    "True", "False", "None", "print", "range", "len", "str", "int", "float", "bool",
    "list", "dict", "set", "tuple", "open", "super", "self",
}


def compact(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def text_hash(card: dict) -> str:
    payload = {k: card.get(k) for k in ("title", "reading_goal", "code", "question", "answer", "explanation", "project_context")}
    return hashlib.sha256(json.dumps(payload, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()


def code_anchor(code: str) -> str:
    patterns = [
        r"\bdef\s+([A-Za-z_]\w*)\s*\(",
        r"\bclass\s+([A-Za-z_]\w*)\s*(?:\(|:)",
        r"(^|\n)\s*([A-Za-z_]\w*)\s*=",
        r"\b([A-Za-z_]\w*)\.(?:append|extend|add|get|items|keys|values|read|write|json|status_code)\b",
    ]
    for idx, pattern in enumerate(patterns):
        match = re.search(pattern, code, re.M)
        if match:
            value = match.group(1 if idx < 2 else 2 if idx == 2 else 1)
            if value and value not in KEYWORDS:
                return value
    for token in re.findall(r"\b[A-Za-z_]\w*\b", code):
        if token not in KEYWORDS and len(token) >= 2:
            return token
    return ""


def short_answer(answer: object) -> str:
    if isinstance(answer, str):
        text = answer.strip()
    else:
        text = json.dumps(answer, ensure_ascii=False, sort_keys=True)
    text = text.replace("\n", "\\n")
    return text if text and len(text) <= 64 else ""


def personalize(sentence: str, card: dict) -> str:
    body = sentence[len("읽을 때는 "):].strip() if sentence.startswith("읽을 때는 ") else sentence
    title = compact(card.get("title")) or "이 카드"
    anchor = code_anchor(str(card.get("code") or ""))
    if anchor:
        first = f"‘{title}’에서는 코드의 `{anchor}`를 기준으로 {body}"
    else:
        first = f"‘{title}’에서는 {body}"
    answer = short_answer(card.get("answer"))
    qtype = str(card.get("question_type") or "")
    if answer and qtype != "output_prediction" and answer not in first:
        first = first.rstrip(". ") + f". 이 순서를 따라가면 이 카드의 정답 `{answer}`가 어느 단계에서 결정되는지도 확인할 수 있다."
    return first


def main() -> None:
    review = json.loads(REVIEW.read_text(encoding="utf-8")) if REVIEW.exists() else {"cards": []}
    review_map = {(int(row.get("level", -1)), str(row.get("file")), str(row.get("id"))): row for row in review.get("cards", [])}

    changed_cards = 0
    changed_files = set()
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
            explanation = compact(card.get("explanation"))
            sentences = [x.strip() for x in re.split(r"(?<=[.!?])\s+", explanation) if x.strip()]
            touched = False
            new_sentences = []
            for sentence in sentences:
                if sentence.startswith("읽을 때는 "):
                    new_sentences.append(personalize(sentence, card))
                    touched = True
                else:
                    new_sentences.append(sentence)
            if not touched:
                continue
            before_sha = text_hash(card)
            new_explanation = " ".join(new_sentences)
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
                reasons = list(row.get("reasons") or [])
                if "personalize_execution_trace" not in reasons:
                    reasons.append("personalize_execution_trace")
                row["reasons"] = reasons
                if not row.get("before_sha256"):
                    row["before_sha256"] = before_sha
                row["after_sha256"] = after_sha

    for path in sorted(changed_files):
        path.write_text(json.dumps(payloads[path], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if REVIEW.exists():
        review["cards"] = sorted(review_map.values(), key=lambda x: (int(x["level"]), str(x["file"]), str(x["id"])))
        review["personalized_execution_trace_cards"] = changed_cards
        REVIEW.write_text(json.dumps(review, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"V356_PERSONALIZED_CARDS={changed_cards}")
    print(f"V356_PERSONALIZED_FILES={len(changed_files)}")
    print("RESULT=PASS_V356_PERSONALIZE")


if __name__ == "__main__":
    main()

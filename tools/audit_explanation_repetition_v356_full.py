#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
TARGET_LEVELS = set(range(4, 11))
MAX_EXACT_LAST_SENTENCE = 24
MAX_GENERIC_PREFIX = 70


def compact(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def last_sentence(text: str) -> str:
    chunks = [x.strip() for x in re.split(r"(?<=[.!?])\s+", compact(text)) if x.strip()]
    return chunks[-1] if chunks else compact(text)


def main() -> None:
    rows = []
    for path in sorted(LESSON_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        for card in payload:
            if not isinstance(card, dict) or not card.get("id"):
                continue
            level = int(card.get("level", -1)) if str(card.get("level", "")).isdigit() else -1
            if level in TARGET_LEVELS:
                rows.append((path.name, card, level))

    tails = Counter()
    tail_cards = defaultdict(list)
    generic_prefix = []
    title_or_answer_absent = []

    for filename, card, level in rows:
        explanation = compact(card.get("explanation"))
        tail = last_sentence(explanation)
        tails[tail] += 1
        tail_cards[tail].append(f"L{level}|{filename}|{card['id']}")
        if tail.startswith("읽을 때는 "):
            generic_prefix.append(f"L{level}|{filename}|{card['id']}")

        # For explanations that were evidently augmented by the V356 flow pass,
        # require at least one concrete anchor from this card (answer, title token,
        # or a literal/code identifier) somewhere in the full explanation.
        if "읽을 때는 " in explanation:
            answer = compact(card.get("answer"))
            title = compact(card.get("title"))
            code = str(card.get("code") or "")
            identifiers = [x for x in re.findall(r"\b[A-Za-z_]\w*\b", code) if x not in {
                "if", "else", "elif", "for", "while", "def", "return", "try", "except",
                "with", "as", "import", "from", "in", "and", "or", "not", "True", "False", "None",
                "print", "range", "len", "str", "int", "float", "list", "dict", "set", "tuple",
            }]
            title_tokens = [x for x in re.split(r"[\s/·:()]+", title) if len(x) >= 3]
            anchors = []
            if answer and len(answer) <= 80:
                anchors.append(answer)
            anchors.extend(title_tokens[:3])
            anchors.extend(identifiers[:4])
            if anchors and not any(anchor in explanation for anchor in anchors):
                title_or_answer_absent.append(f"L{level}|{filename}|{card['id']}")

    repeated = [(tail, count) for tail, count in tails.items() if count > MAX_EXACT_LAST_SENTENCE]
    repeated.sort(key=lambda x: (-x[1], x[0]))

    print(f"V356_REPETITION_TARGET_CARDS={len(rows)}")
    print(f"V356_REPETITION_UNIQUE_TAILS={len(tails)}")
    print(f"V356_REPETITION_GENERIC_PREFIX={len(generic_prefix)}")
    print(f"V356_REPETITION_UNANCHORED={len(title_or_answer_absent)}")
    print(f"V356_REPETITION_OVER_LIMIT={len(repeated)}")
    for tail, count in repeated[:20]:
        print(f"V356_REPEATED_TAIL_COUNT={count}|TAIL={tail}")
        for item in tail_cards[tail][:8]:
            print(f"V356_REPEATED_TAIL_CARD={item}")
    for item in title_or_answer_absent[:60]:
        print(f"V356_UNANCHORED={item}")

    failures = []
    if repeated:
        failures.append(f"EXACT_LAST_SENTENCE_REPETITION={len(repeated)}")
    if len(generic_prefix) > MAX_GENERIC_PREFIX:
        failures.append(f"GENERIC_FLOW_PREFIX_COUNT={len(generic_prefix)}")
    if title_or_answer_absent:
        failures.append(f"UNANCHORED_FLOW_EXPLANATIONS={len(title_or_answer_absent)}")

    if failures:
        for failure in failures:
            print("FAIL=" + failure)
        raise SystemExit("RESULT=FAIL_V356_EXPLANATION_REPETITION")
    print("RESULT=PASS_V356_EXPLANATION_REPETITION")


if __name__ == "__main__":
    main()

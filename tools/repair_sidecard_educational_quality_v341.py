#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SIDE_ROOTS = [ROOT / "data" / "side_cards", ROOT / "data_i18n" / "en" / "side_cards"]
VERSION = "v341_sidecard_educational_repair_a1"
SENTENCE_RE = re.compile(r"(?<=[.!?。！？])\s+")

META_KO = (
    "이 사이드카드", "이 카드에서는", "학습자가", "설명을 보강", "설명 품질", "읽기 노트",
)
META_EN = (
    "this side card", "this card explains", "the learner", "improve the explanation", "explanation quality",
)

CURATED_KO = {
    "LANG_c_memory_001": {
        "body": "C는 메모리 주소와 배열 크기를 파이썬보다 더 직접 다루는 언어다. 그래서 빠르고 세밀하게 제어할 수 있지만 포인터나 범위 실수는 큰 오류로 이어질 수 있다.",
    },
    "LANG_rust_safety_001": {
        "body": "Rust는 C나 C++처럼 빠른 프로그램을 만들면서도 메모리 실수를 줄이도록 규칙을 강하게 검사하는 언어다. 처음에는 '소유권'이라는 규칙으로 값의 사용 범위를 확인한다는 정도만 알아두면 된다.",
    },
    "PYF94_A1_TYPE_STRING_NUMBER": {
        "body": "type()으로 확인하면 '3'은 str이고 3은 int다. 화면에 비슷하게 보여도 자료형이 다르면 같은 연산자가 다르게 동작할 수 있다.",
        "detail": "type('3')은 str을, type(3)은 int를 보여 준다. 그래서 이 카드는 모양이 아니라 실제 자료형을 확인하는 데 초점을 둔다. 문자열끼리 +를 쓰면 이어 붙이고, 숫자끼리 +를 쓰면 덧셈하므로 코드를 읽을 때 따옴표와 type() 결과를 함께 본다.",
    },
}

CURATED_EN = {
    "LANG_c_memory_001": {
        "body": "C works with memory addresses and array sizes more directly than Python. This gives fine control and speed, but pointer or bounds mistakes can cause serious errors.",
    },
    "LANG_rust_safety_001": {
        "body": "Rust aims for C- or C++-like performance while using strict rules to reduce memory mistakes. As a first step, think of ownership as a rule that controls where and how a value may be used.",
    },
    "PYF94_A1_TYPE_STRING_NUMBER": {
        "body": "type() shows that '3' is a str while 3 is an int. Values can look similar on screen but behave differently when their types differ.",
        "detail": "type('3') reports str and type(3) reports int. This card focuses on checking the actual type rather than judging by appearance. With +, strings join text while integers add numbers, so quotation marks and type() results matter when reading code.",
    },
}


def is_en(path: Path) -> bool:
    return "data_i18n" in path.parts


def split_sentences(text: str) -> list[str]:
    value = re.sub(r"\s+", " ", str(text or "")).strip()
    if not value:
        return []
    return [part.strip() for part in SENTENCE_RE.split(value) if part.strip()]


def remove_meta(text: str, lang: str) -> str:
    markers = META_EN if lang == "en" else META_KO
    kept = []
    for sentence in split_sentences(text):
        folded = sentence.casefold()
        if any(marker.casefold() in folded for marker in markers):
            continue
        kept.append(sentence)
    return " ".join(kept).strip()


def compact_body(text: str, detail: str, card_type: str, lang: str) -> str:
    value = re.sub(r"\s+", " ", str(text or "")).strip()
    if not value or not detail:
        return value
    reading_note = str(card_type or "").casefold() == "reading_note"
    limit = (360 if lang == "en" else 260) if reading_note else (520 if lang == "en" else 360)
    if len(value) <= limit:
        return value
    parts = split_sentences(value)
    if not parts:
        return value
    selected: list[str] = []
    total = 0
    for part in parts:
        candidate = (" ".join(selected + [part])).strip()
        if selected and len(candidate) > limit:
            break
        selected.append(part)
        total = len(candidate)
        if len(selected) >= 3:
            break
    return " ".join(selected).strip() or value


def process(apply: bool) -> tuple[int, int, int, int]:
    files_changed = cards_changed = meta_removed = compacted = 0
    for root in SIDE_ROOTS:
        for path in sorted(root.glob("*.json")):
            lang = "en" if is_en(path) else "ko"
            curated = CURATED_EN if lang == "en" else CURATED_KO
            data = json.loads(path.read_text(encoding="utf-8-sig"))
            changed_here = 0
            for card in data:
                before = json.dumps(card, ensure_ascii=False, sort_keys=True)
                cid = str(card.get("id") or "")
                override = curated.get(cid, {})

                for field in ("body", "detail"):
                    if field in override:
                        card[field] = override[field]
                    elif card.get(field):
                        old = str(card[field])
                        cleaned = remove_meta(old, lang)
                        if cleaned != old:
                            meta_removed += 1
                        if cleaned:
                            card[field] = cleaned

                if card.get("body") and card.get("detail"):
                    old_body = str(card["body"])
                    new_body = compact_body(old_body, str(card["detail"]), str(card.get("type") or ""), lang)
                    if new_body != old_body:
                        compacted += 1
                        card["body"] = new_body

                after = json.dumps(card, ensure_ascii=False, sort_keys=True)
                if after != before:
                    cards_changed += 1
                    changed_here += 1

            if changed_here:
                files_changed += 1
                if apply:
                    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    return files_changed, cards_changed, meta_removed, compacted


def main() -> int:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--apply", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()

    files_changed, cards_changed, meta_removed, compacted = process(args.apply)
    print(f"REPAIR_VERSION={VERSION}")
    print(f"FILES_CHANGED={files_changed} CARDS_CHANGED={cards_changed}")
    print(f"META_FIELDS_CLEANED={meta_removed} BODIES_COMPACTED={compacted}")

    if args.check:
        clean = files_changed == 0 and cards_changed == 0
        print(f"SIDECARD_REPAIR_IDEMPOTENT={str(clean)}")
        print("RESULT=" + ("PASS_SIDECARD_EDUCATIONAL_REPAIR_V341_CHECK" if clean else "FAIL_SIDECARD_EDUCATIONAL_REPAIR_V341_CHECK"))
        return 0 if clean else 1

    print("RESULT=PASS_SIDECARD_EDUCATIONAL_REPAIR_V341_APPLY")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

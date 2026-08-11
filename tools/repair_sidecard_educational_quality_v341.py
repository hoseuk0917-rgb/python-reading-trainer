#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SIDE_ROOTS = [ROOT / "data" / "side_cards", ROOT / "data_i18n" / "en" / "side_cards"]
VERSION = "v341_sidecard_educational_repair_a2"
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
    "PYF95_A4_OPEN_READ": {
        "body": "open()은 파일을 열고, read()는 열린 파일의 내용을 문자열로 가져온다. 먼저 어떤 파일을 어떤 모드로 여는지 확인한 뒤 read() 결과가 어느 변수에 저장되는지 따라가면 된다.",
        "detail": "with open('memo.txt', 'r', encoding='utf-8') as f: 다음에 text = f.read()가 있으면 memo.txt 전체 내용이 문자열로 text에 들어간다. 코드를 읽을 때는 파일 경로, 'r' 같은 모드, encoding, 읽은 값을 저장하는 변수를 함께 본다. 큰 파일에서는 전체를 한 번에 읽는 read()가 부담이 될 수도 있으므로 이후 코드가 파일을 어떻게 처리하는지도 확인한다.",
    },
    "PYF95_A4_PATHLIB_PATH": {
        "body": "pathlib의 Path는 파일 경로를 문자열 하나가 아니라 경로의 부품처럼 다루게 해 준다. Path('data') / 'memo.txt'는 data 폴더 아래 memo.txt를 가리키는 경로를 만든다.",
        "detail": "Path 객체에서는 name으로 파일명, suffix로 확장자, stem으로 확장자를 뺀 이름, parent로 부모 폴더를 확인할 수 있다. 문자열을 직접 자르거나 운영체제별 경로 구분자를 붙이는 것보다 의도가 분명하다. 코드를 읽을 때 Path가 단순히 경로를 만들기만 하는지, read_text()처럼 실제 파일 작업까지 이어지는지 구분한다.",
    },
    "PYF95_A5_OBJECT_FLOW": {
        "body": "객체 코드는 'class 정의 → object 생성 → attribute 저장 → method 호출' 순서로 나누어 보면 흐름이 잘 보인다. 먼저 설계도를 읽고, 실제 object가 만들어진 뒤 어떤 값과 동작이 사용되는지 따라간다.",
        "detail": "class 블록에서는 어떤 attribute와 method가 있는지 확인한다. dog = Dog('Momo')처럼 object를 만드는 줄에서는 보통 __init__이 실행되어 초기 attribute가 저장된다. 그 뒤 dog.name이나 dog.speak()처럼 점 표기법이 나오면 어느 object의 값을 읽거나 어떤 method를 호출하는지 연결해서 본다.",
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
    "PYF95_A4_OPEN_READ": {
        "body": "open() opens a file and read() brings the opened file's contents into Python as a string. First identify which file and mode are used, then follow the variable that receives the read result.",
        "detail": "After with open('memo.txt', 'r', encoding='utf-8') as f:, text = f.read() places the whole file contents into text as a string. Read the path, mode, encoding, and destination variable together. For a large file, reading everything at once may be expensive, so also check how the following code processes the content.",
    },
    "PYF95_A4_PATHLIB_PATH": {
        "body": "pathlib.Path treats a file path as structured path parts instead of one manually assembled string. Path('data') / 'memo.txt' builds a path to memo.txt inside the data folder.",
        "detail": "A Path exposes name for the filename, suffix for the extension, stem for the name without the extension, and parent for the containing folder. This is clearer than manually slicing strings or joining platform-specific separators. When reading code, distinguish between building a Path and performing file work such as read_text().",
    },
    "PYF95_A5_OBJECT_FLOW": {
        "body": "Object-oriented code is easier to trace as class definition → object creation → attribute storage → method call. Read the blueprint first, then follow what values and behavior the actual object uses.",
        "detail": "Inside the class block, identify the attributes and methods it defines. At a line such as dog = Dog('Momo'), __init__ commonly sets the object's initial attributes. Later, dot expressions such as dog.name or dog.speak() show which object's data is read or which method is called.",
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
    for part in parts:
        candidate = (" ".join(selected + [part])).strip()
        if selected and len(candidate) > limit:
            break
        selected.append(part)
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

#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

import repair_v4008_beginner_residuals as base

ROOT = Path(__file__).resolve().parents[1]
ORIGINAL_REPAIR = ROOT / "tools/repair_v4008_beginner_residuals.py"

# English runtime examples still contain a small set of Korean comments/output
# literals. Translate the literals consistently in code, choices, answers, and
# prose rather than hiding them at render time.
EXTRA_EN_REPLACEMENTS = (
    ("비어 있음", "empty"),
    ("이 줄은 설명이다", "this line is a comment"),
    ("준비 단계", "preparation step"),
    ("있음", "present"),
    ("없음", "empty"),
)

_original_fix_en_text = base.fix_en_text
_original_fix_ko_text = base.fix_ko_text
_original_patch_known_en_cards = base.patch_known_en_cards
_original_scan_bundle = base.scan_bundle


def fix_en_text_r2(text: str, path: str) -> str:
    out = _original_fix_en_text(text, path)
    for old, new in EXTRA_EN_REPLACEMENTS:
        out = out.replace(old, new)
    return out


def fix_ko_text_r2(text: str, path: str) -> str:
    out = _original_fix_ko_text(text, path)
    if base.is_code_path(path):
        return out
    out = out.replace("focus 이름", "반복 변수")
    out = out.replace("focus 값", "해당 값")
    out = re.sub(r"\bfocus\b", "해당 부분", out, flags=re.I)
    return out


def patch_known_en_cards_r2(by_id: dict[str, dict]) -> None:
    _original_patch_known_en_cards(by_id)

    def card(cid: str) -> dict:
        row = by_id.get(cid)
        if row is None:
            raise SystemExit(f"required English card missing in r2: {cid}")
        return row

    v1 = card("PYF94_A1_L01_VAR_001")
    v1["explanation"] = (
        "In `label = \"UAM\"`, Python first evaluates the string \"UAM\" on the right and stores that value in the variable `label` on the left. "
        "The next line, `print(label)`, reads the current value of `label` and prints `UAM`. "
        "This is assignment: `=` stores a value here; it does not compare two values."
    )

    v3 = card("PYF94_A1_L01_VAR_003")
    v3["answer_explanation"]["common_wrong_choice"]["why_wrong"] = (
        "`b = a` reads the current value stored in `a` and stores that value in `b`; it does not store the letters `a`."
    )

    v4 = card("PYF94_A1_L01_VAR_004")
    v4["explanation"] = (
        "1) `a` initially stores `old`. 2) When `b = a` runs, the current string `old` is stored in `b`. "
        "3) `a` is then reassigned to `new`. 4) That later reassignment changes `a`, not the value already stored in `b`, so `b` remains `old`."
    )

    neg = card("PYF94_A2_L02_LIST_006")
    neg["concept_explanation"]["what_it_is"] = (
        "Negative list indices count from the end: `-1` selects the last item, `-2` the second-to-last item, and so on."
    )
    neg["concept_explanation"]["how_to_read"] = (
        "Read `items[-1]` as ‘the last item in `items`.’ If the index is `-2`, move one position farther left to the second-to-last item."
    )

    param = card("PYF95_A1_FUNC_004_PARAM_STRING")
    param["concept_explanation"]["how_to_read"] = (
        "In `def greet(name):`, `name` is the parameter. When `greet(\"Mina\")` is called, `name` refers to `\"Mina\"` during that call."
    )

    ret = card("PYF95_A1_FUNC_021_DEFAULT_LIKE_SIMPLE")
    ret["teaching_example"]["walkthrough"] = (
        "Because the empty-string condition is True, `return \"missing\"` runs and the function ends immediately; the later `return text` is not reached."
    )

    typ = card("PYV96_A1_REVIEW_003_TYPE_NAME")
    typ["explanation"] = (
        "The variable `value` stores the string \"hello\". Calling `type(value)` returns an object representing the string type `str`; it does not return \"hello\" itself. "
        "That type object is stored in `kind`. The key distinction is between a value and information about that value's data type."
    )
    typ["teaching_example"]["walkthrough"] = (
        "`number` currently stores the integer 7. `type(number)` returns an object representing the integer type `int`, not the number 7 itself."
    )

    app = card("PYV96_A1_REVIEW_010_LIST_APPEND_LEN")
    app["answer_explanation"]["takeaway"] = (
        "After `append()` runs, the existing list has changed. Read the next line using that updated list state."
    )

    strip_card = card("PYF94_A2_L02_STR_003")
    strip_card["question"] = "If `text` is `\"  hi  \"`, what does `text.strip()` return?"


def scan_bundle_r2(bundle: dict, lang: str) -> dict:
    scan = _original_scan_bundle(bundle, lang)
    prefix = f"{lang}_"
    return {key: value for key, value in scan.items() if key.startswith(prefix)}


base.fix_en_text = fix_en_text_r2
base.fix_ko_text = fix_ko_text_r2
base.patch_known_en_cards = patch_known_en_cards_r2
base.scan_bundle = scan_bundle_r2
# On success the base script removes SELF_PATH and the workflow. Point SELF_PATH
# at this follow-up script; remove the original helper immediately afterward.
base.SELF_PATH = Path(__file__).resolve()


if __name__ == "__main__":
    base.main()
    if ORIGINAL_REPAIR.exists():
        ORIGINAL_REPAIR.unlink()
    print("V4008_BEGINNER_RESIDUAL_REPAIR_R2_PASS=True")

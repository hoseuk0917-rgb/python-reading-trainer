from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / "src" / "pwa" / "learning_engine_v340.js"
LOOP = ROOT / "src" / "pwa" / "learning_loop_v340.js"
CASE = ROOT / "tools" / "learning_loop_v340_browser_case.html"

OLD_EXAMPLE_HEAD = '''  function pickSafeExample(card, cards, index, conceptInfo) {\n    const allowed = allowedConceptsAt(cards, index);\n    const candidates = [];\n    listConcepts(card).forEach(function(concept) {\n      const info = conceptInfo && conceptInfo[concept];\n      if (info && info.example) candidates.push({ concept: concept, code: info.example, source: "current" });\n    });'''
NEW_EXAMPLE_HEAD = '''  function pickSafeExample(card, cards, index, conceptInfo, primaryConceptOverride) {\n    const allowed = allowedConceptsAt(cards, index);\n    const candidates = [];\n    const primary = primaryConceptOverride || pickPrimaryConcept(card, conceptInfo);\n    const orderedCurrent = [primary].concat(listConcepts(card).filter(function(concept) {\n      return concept !== primary;\n    }));\n    orderedCurrent.forEach(function(concept) {\n      const info = conceptInfo && conceptInfo[concept];\n      if (info && info.example) candidates.push({ concept: concept, code: info.example, source: "current" });\n    });'''

OLD_REVIEW_HEAD = '''  function makeReviewVariant(card, cards, index, conceptInfo, reviewRow) {\n    const primary = pickPrimaryConcept(card, conceptInfo);'''
NEW_REVIEW_HEAD = '''  function makeReviewVariant(card, cards, index, conceptInfo, reviewRow, primaryConceptOverride) {\n    const primary = primaryConceptOverride || pickPrimaryConcept(card, conceptInfo);'''

OLD_LOOP_EXAMPLE = '''    const example = engine().pickSafeExample(card, cards, index, conceptInfo || {});'''
NEW_LOOP_EXAMPLE = '''    const example = engine().pickSafeExample(card, cards, index, conceptInfo || {}, primaryConcept(card));'''

OLD_LOOP_REVIEW = '''    const variant = e.makeReviewVariant(card, cards, index, conceptInfo || {}, row);\n    const modal = ensureModal("reviewModalV340");'''
NEW_LOOP_REVIEW = '''    const variant = e.makeReviewVariant(card, cards, index, conceptInfo || {}, row, primaryConcept(card));\n    const modal = ensureModal("reviewModalV340");\n    modal.dataset.primaryConcept = variant.primaryConcept || "";'''

OLD_CASE_CLICKABLE = '''    const clickable = example ? example.querySelector(".syntax-v340") : null;\n    check("WORKED_EXAMPLE_HAS_CLICKABLE_KNOWN_SYNTAX", !!clickable, clickable ? "syntax=" + clickable.textContent : "none");\n    if (clickable) clickable.click();'''
NEW_CASE_CLICKABLE = '''    const exampleCode = example ? example.querySelector(".worked-v340-code").textContent : "";\n    check("FIRST_WORKED_EXAMPLE_IS_PRIMARY_LEN", /\\blen\\s*\\(/.test(exampleCode), "code=" + exampleCode.replace(/\\s+/g, " ").slice(0, 120));\n    const clickable = example ? example.querySelector('.syntax-v340[data-concept="len"]') : null;\n    check("WORKED_EXAMPLE_HAS_CLICKABLE_PRIMARY_SYNTAX", !!clickable, clickable ? "syntax=" + clickable.textContent : "none");\n    if (clickable) clickable.click();'''

OLD_CASE_REVIEW = '''    check("VARIANT_REVIEW_MODAL_OPENS", !!reviewModal, reviewModal ? "choices=" + reviewModal.querySelectorAll(".review-v340-choice").length : "not opened");\n    check("VARIANT_REVIEW_NOT_ORIGINAL_QA", !!reviewQuestion && reviewQuestion !== originalQuestion, "original=" + originalQuestion + " | review=" + reviewQuestion);'''
NEW_CASE_REVIEW = '''    check("VARIANT_REVIEW_MODAL_OPENS", !!reviewModal, reviewModal ? "choices=" + reviewModal.querySelectorAll(".review-v340-choice").length : "not opened");\n    check("VARIANT_REVIEW_PRIMARY_IS_LEN", !!reviewModal && reviewModal.dataset.primaryConcept === "len", reviewModal ? "primary=" + reviewModal.dataset.primaryConcept : "missing");\n    check("VARIANT_REVIEW_NOT_ORIGINAL_QA", !!reviewQuestion && reviewQuestion !== originalQuestion, "original=" + originalQuestion + " | review=" + reviewQuestion);'''


def replace_once(text: str, old: str, new: str, name: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise RuntimeError(f"{name}_NOT_FOUND")
    return text.replace(old, new, 1)


def transform_engine(text: str) -> str:
    text = replace_once(text, OLD_EXAMPLE_HEAD, NEW_EXAMPLE_HEAD, "EXAMPLE_PRIMARY")
    text = replace_once(text, OLD_REVIEW_HEAD, NEW_REVIEW_HEAD, "REVIEW_PRIMARY")
    return text


def transform_loop(text: str) -> str:
    text = replace_once(text, OLD_LOOP_EXAMPLE, NEW_LOOP_EXAMPLE, "LOOP_EXAMPLE_PRIMARY")
    text = replace_once(text, OLD_LOOP_REVIEW, NEW_LOOP_REVIEW, "LOOP_REVIEW_PRIMARY")
    return text


def transform_case(text: str) -> str:
    text = replace_once(text, OLD_CASE_CLICKABLE, NEW_CASE_CLICKABLE, "CASE_PRIMARY_EXAMPLE")
    text = replace_once(text, OLD_CASE_REVIEW, NEW_CASE_REVIEW, "CASE_PRIMARY_REVIEW")
    return text


def run_transform(path: Path, transform, apply: bool) -> tuple[bool, bool]:
    old = path.read_text(encoding="utf-8")
    new = transform(old)
    changed = old != new
    if apply and changed:
        path.write_text(new, encoding="utf-8", newline="\n")
    return changed, old == new


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    items = [
        (ENGINE, transform_engine, "ENGINE"),
        (LOOP, transform_loop, "LOOP"),
        (CASE, transform_case, "CASE"),
    ]
    dirty = 0
    for path, transform, label in items:
        changed, clean = run_transform(path, transform, args.apply)
        if args.apply:
            print(f"V340_R3_{label}_CHANGED={changed}")
        else:
            print(f"V340_R3_{label}_IDEMPOTENT={clean}")
            if not clean:
                dirty += 1

    if args.check:
        print(f"ERRORS={dirty}")
        if dirty:
            print("RESULT=FAIL_LEARNING_LOOP_V340_R3_CHECK")
            return 1
        print("RESULT=PASS_LEARNING_LOOP_V340_R3_CHECK")
    else:
        print("RESULT=PASS_LEARNING_LOOP_V340_R3_APPLY")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

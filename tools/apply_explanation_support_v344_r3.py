from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src" / "pwa" / "explanation_support_v344.js"
VERSION = "v344_explanation_support_r3"

STYLE_OLD = ".explanation-term-v344{border:0;background:transparent;color:#2459d3;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px;font:inherit;font-weight:700;padding:0 1px;cursor:pointer}"
STYLE_NEW = ".explanation-term-v344{border:0;background:transparent;color:#2459d3;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px;font:inherit;font-weight:700;padding:0 1px;cursor:pointer;white-space:normal;overflow-wrap:anywhere;word-break:normal;max-width:100%;vertical-align:baseline}"

OPEN_OLD = """  let returnFocus = null;\n  function openTerm(termId, sourceButton) {"""
OPEN_NEW = """  let returnFocus = null;\n  let returnTermId = \"\";\n  function openTerm(termId, sourceButton) {"""

ASSIGN_OLD = """    returnFocus = sourceButton || document.activeElement;"""
ASSIGN_NEW = """    returnFocus = sourceButton || document.activeElement;\n    returnTermId = sourceButton && sourceButton.dataset ? (sourceButton.dataset.term || \"\") : \"\";"""

CLOSE_OLD = """    const focus = returnFocus;\n    returnFocus = null;\n    if (focus && typeof focus.focus === \"function\" && document.contains(focus)) focus.focus();"""
CLOSE_NEW = """    const focus = returnFocus;\n    const termId = returnTermId;\n    returnFocus = null;\n    returnTermId = \"\";\n    window.setTimeout(function () {\n      if (focus && typeof focus.focus === \"function\" && document.contains(focus)) {\n        focus.focus();\n        return;\n      }\n      if (termId) {\n        const fallback = document.querySelector('.explanation-term-v344[data-term="' + CSS.escape(termId) + '"]');\n        if (fallback && typeof fallback.focus === \"function\") fallback.focus();\n      }\n    }, 0);"""

VERSION_OLD = 'const VERSION = "v344_explanation_support_a1";'
VERSION_NEW = f'const VERSION = "{VERSION}";'


def transform(text: str) -> tuple[str, int]:
    changes = 0
    pairs = [
        (STYLE_OLD, STYLE_NEW),
        (OPEN_OLD, OPEN_NEW),
        (ASSIGN_OLD, ASSIGN_NEW),
        (CLOSE_OLD, CLOSE_NEW),
        (VERSION_OLD, VERSION_NEW),
    ]
    for old, new in pairs:
        if new in text:
            continue
        if old not in text:
            raise RuntimeError(f"required anchor not found: {old[:80]!r}")
        text = text.replace(old, new, 1)
        changes += 1
    return text, changes


def validate(text: str) -> bool:
    required = [
        VERSION_NEW,
        "white-space:normal;overflow-wrap:anywhere",
        'let returnTermId = "";',
        'returnTermId = sourceButton && sourceButton.dataset',
        "window.setTimeout(function () {",
        "CSS.escape(termId)",
    ]
    return all(x in text for x in required)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    text = TARGET.read_text(encoding="utf-8")
    new, changes = transform(text)
    if args.apply and changes:
        TARGET.write_text(new, encoding="utf-8")
    final = new if args.apply else text
    ok = validate(final)
    idempotent = changes == 0 if args.check else True

    print("PATCH_VERSION=v344_explanation_support_r3")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"VALID={ok}")
    if args.check:
        print(f"IDEMPOTENT={idempotent}")
    if not ok or (args.check and not idempotent):
        raise SystemExit("RESULT=FAIL_EXPLANATION_SUPPORT_V344_R3")
    print("RESULT=PASS_EXPLANATION_SUPPORT_V344_R3")


if __name__ == "__main__":
    main()

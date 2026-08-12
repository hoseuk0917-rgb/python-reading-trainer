#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "src/pwa/index.html"
PATCH_VERSION = "v346_a1"
CSS_LINE = '  <link rel="stylesheet" href="./study_ui_v346.css?v=20260812_v346_a1">'
JS_LINE = '  <script src="./study_progress_v346.js?v=20260812_v346_a1"></script>'
BASE_STYLE_ANCHOR = '  <link rel="stylesheet" href="./style.css?v=20260811_v338_a1">'
V345_ANCHOR = '  <script src="./study_experience_v345.js?v=20260812_v345_a1"></script>'


def patched_text(text: str) -> str:
    out = text
    if CSS_LINE not in out:
        if BASE_STYLE_ANCHOR not in out:
            raise RuntimeError("base style anchor not found")
        out = out.replace(BASE_STYLE_ANCHOR, BASE_STYLE_ANCHOR + "\n" + CSS_LINE, 1)
    if JS_LINE not in out:
        if V345_ANCHOR not in out:
            raise RuntimeError("V345 script anchor not found")
        out = out.replace(V345_ANCHOR, V345_ANCHOR + "\n" + JS_LINE, 1)
    return out


def validate(text: str) -> tuple[bool, list[str]]:
    errors: list[str] = []
    if text.count("study_ui_v346.css") != 1:
        errors.append(f"study_ui_v346.css count={text.count('study_ui_v346.css')}")
    if text.count("study_progress_v346.js") != 1:
        errors.append(f"study_progress_v346.js count={text.count('study_progress_v346.js')}")
    if text.find("study_ui_v346.css") < text.find("style.css"):
        errors.append("V346 CSS must load after base CSS")
    if text.find("study_progress_v346.js") < text.find("study_experience_v345.js"):
        errors.append("V346 runtime must load after V345")
    return not errors, errors


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()

    before = INDEX.read_text(encoding="utf-8")
    after = patched_text(before)
    changes = 0 if after == before else 1
    if args.apply and changes:
        INDEX.write_text(after, encoding="utf-8")
    target = after if args.apply else before
    valid, errors = validate(target)

    print(f"PATCH_VERSION={PATCH_VERSION}")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"VALID={valid}")
    if args.check:
        print(f"IDEMPOTENT={changes == 0 and valid}")
    for error in errors:
        print("ERROR=" + error)

    ok = valid and (args.apply or changes == 0)
    print("RESULT=" + ("PASS_STUDY_QUALITY_V346_PATCH" if ok else "FAIL_STUDY_QUALITY_V346_PATCH"))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())

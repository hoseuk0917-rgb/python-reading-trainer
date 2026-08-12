#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "src" / "pwa" / "index.html"
CSS_LINE = '  <link rel="stylesheet" href="./consumer_ui_v349.css?v=20260812_v349_a1">\n'
JS_LINE = '  <script src="./consumer_ux_v349.js?v=20260812_v349_a1"></script>\n'
CSS_ANCHOR = '  <link rel="stylesheet" href="./study_ui_v348.css?v=20260812_v348_a1">\n'
JS_ANCHOR = '  <script src="./learning_runtime_v348.js?v=20260812_v348_a1"></script>\n'


def transformed(text: str) -> tuple[str, int]:
    changes = 0
    if CSS_LINE not in text:
        if CSS_ANCHOR not in text:
            raise SystemExit("V349_CSS_ANCHOR_NOT_FOUND")
        text = text.replace(CSS_ANCHOR, CSS_ANCHOR + CSS_LINE, 1)
        changes += 1
    if JS_LINE not in text:
        if JS_ANCHOR not in text:
            raise SystemExit("V349_JS_ANCHOR_NOT_FOUND")
        text = text.replace(JS_ANCHOR, JS_ANCHOR + JS_LINE, 1)
        changes += 1
    return text, changes


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()

    original = INDEX.read_text(encoding="utf-8-sig")
    updated, changes = transformed(original)
    print("=== V349 CONSUMER UX INDEX INTEGRATION ===")
    print(f"INDEX={INDEX.relative_to(ROOT)}")
    print(f"CHANGES={changes}")
    print(f"CSS_PRESENT={CSS_LINE.strip() in updated}")
    print(f"JS_PRESENT={JS_LINE.strip() in updated}")

    if args.check:
        if changes:
            print("IDEMPOTENT=False")
            return 1
        print("IDEMPOTENT=True")
        return 0

    if updated != original:
        INDEX.write_text(updated, encoding="utf-8")
    print("APPLIED=True")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

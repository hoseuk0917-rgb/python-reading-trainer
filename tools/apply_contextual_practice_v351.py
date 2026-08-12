from __future__ import annotations

import argparse
from pathlib import Path

INDEX = Path("src/pwa/index.html")
CSS_LINE = '  <link rel="stylesheet" href="./contextual_practice_v351.css?v=20260813_v351_a1">\n'
JS_LINE = '  <script src="./contextual_practice_v351.js?v=20260813_v351_a1"></script>\n'
CSS_ANCHOR = '  <link rel="stylesheet" href="./learning_flow_v350.css?v=20260812_v350_a1">\n'
JS_ANCHOR = '  <script src="./learning_flow_v350.js?v=20260812_v350_a1"></script>\n'


def transformed(text: str) -> tuple[str, int]:
    changes = 0
    if CSS_LINE not in text:
        if CSS_ANCHOR not in text:
            raise SystemExit("V351_CSS_ANCHOR_NOT_FOUND")
        text = text.replace(CSS_ANCHOR, CSS_ANCHOR + CSS_LINE, 1)
        changes += 1
    if JS_LINE not in text:
        if JS_ANCHOR not in text:
            raise SystemExit("V351_JS_ANCHOR_NOT_FOUND")
        text = text.replace(JS_ANCHOR, JS_ANCHOR + JS_LINE, 1)
        changes += 1
    return text, changes


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()

    original = INDEX.read_text(encoding="utf-8")
    updated, changes = transformed(original)
    css_present = CSS_LINE in updated
    js_present = JS_LINE in updated

    print("=== V351 CONTEXTUAL PRACTICE INDEX INTEGRATION ===")
    print(f"INDEX={INDEX.as_posix()}")
    print(f"CHANGES={changes}")
    print(f"CSS_PRESENT={css_present}")
    print(f"JS_PRESENT={js_present}")

    if args.apply:
        if updated != original:
            INDEX.write_text(updated, encoding="utf-8", newline="\n")
        print("APPLIED=True")
        return 0

    idempotent = changes == 0 and css_present and js_present
    print(f"IDEMPOTENT={idempotent}")
    if not idempotent:
        raise SystemExit(1)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

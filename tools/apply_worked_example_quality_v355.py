# -*- coding: utf-8 -*-
import argparse
from pathlib import Path

CSS_ANCHOR = '  <link rel="stylesheet" href="./interaction_clarity_v353.css?v=20260813_v353_a2">\n'
CSS_LINE = '  <link rel="stylesheet" href="./worked_example_quality_v355.css?v=20260813_v355_a1">\n'
JS_ANCHOR = '  <script src="./interaction_clarity_v353.js?v=20260813_v353_a2"></script>\n'
JS_LINE = '  <script src="./worked_example_quality_v355.js?v=20260813_v355_a1"></script>\n'


def integrate(text: str) -> str:
    out = text
    if CSS_LINE not in out:
        if CSS_ANCHOR not in out:
            raise SystemExit("FAIL: V353 A2 CSS anchor not found")
        out = out.replace(CSS_ANCHOR, CSS_ANCHOR + CSS_LINE, 1)
    if JS_LINE not in out:
        if JS_ANCHOR not in out:
            raise SystemExit("FAIL: V353 A2 JS anchor not found")
        out = out.replace(JS_ANCHOR, JS_ANCHOR + JS_LINE, 1)
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--check", action="store_true")
    parser.add_argument("--root", default=".")
    args = parser.parse_args()

    root = Path(args.root)
    index = root / "src" / "pwa" / "index.html"
    before = index.read_text(encoding="utf-8-sig")
    after = integrate(before)

    css_count = after.count(CSS_LINE.strip())
    js_count = after.count(JS_LINE.strip())
    css_after = after.find(CSS_LINE.strip()) > after.find(CSS_ANCHOR.strip())
    js_after = after.find(JS_LINE.strip()) > after.find(JS_ANCHOR.strip())

    print("=== V355 WORKED EXAMPLE QUALITY INTEGRATION ===")
    print("APPLY=" + str(bool(args.apply)))
    print("CSS_COUNT=" + str(css_count))
    print("JS_COUNT=" + str(js_count))
    print("CSS_AFTER_V353_A2=" + str(css_after))
    print("JS_AFTER_V353_A2=" + str(js_after))
    print("CHANGED=" + str(before != after))

    if css_count != 1 or js_count != 1 or not css_after or not js_after:
        raise SystemExit("FAIL_V355_INTEGRATION_CONTRACT")

    if args.apply:
        if before != after:
            index.write_text(after, encoding="utf-8")
        print("RESULT=V355_INTEGRATED")
        return

    if before != after:
        raise SystemExit("FAIL_V355_NOT_INTEGRATED")
    print("RESULT=PASS_V355_INTEGRATION")


if __name__ == "__main__":
    main()

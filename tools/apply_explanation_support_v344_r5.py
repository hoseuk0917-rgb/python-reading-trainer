from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src" / "pwa" / "explanation_support_v344.js"
VERSION_OLD = 'const VERSION = "v344_explanation_support_r4";'
VERSION_NEW = 'const VERSION = "v344_explanation_support_r5";'
ANCHOR = '      .explanation-refresher-example-v344{background:#f6f8fb;border-radius:10px;padding:10px;white-space:pre-wrap;overflow-wrap:anywhere}\n'
PATCH = '''      #learnView .external-resource-card .side-card-detail,
      #learnView .external-resource-card .side-card-detail *{min-width:0;max-width:100%;white-space:normal!important;overflow-wrap:anywhere!important;word-break:break-word}
'''
MARKER = '#learnView .external-resource-card .side-card-detail *'


def transform(text: str) -> tuple[str, int]:
    changes = 0
    if VERSION_NEW not in text:
        if VERSION_OLD not in text:
            raise RuntimeError("R4 version anchor not found")
        text = text.replace(VERSION_OLD, VERSION_NEW, 1)
        changes += 1
    if MARKER not in text:
        if ANCHOR not in text:
            raise RuntimeError("style anchor not found")
        text = text.replace(ANCHOR, ANCHOR + PATCH, 1)
        changes += 1
    return text, changes


def validate(text: str) -> bool:
    return VERSION_NEW in text and MARKER in text and 'white-space:normal!important' in text and 'overflow-wrap:anywhere!important' in text


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--apply", action="store_true")
    p.add_argument("--check", action="store_true")
    args = p.parse_args()
    if args.apply == args.check:
        p.error("choose exactly one of --apply or --check")
    raw = TARGET.read_text(encoding="utf-8")
    updated, changes = transform(raw)
    if args.apply and changes:
        TARGET.write_text(updated, encoding="utf-8")
    final = updated if args.apply else raw
    ok = validate(final)
    idempotent = changes == 0 if args.check else True
    print("PATCH_VERSION=v344_explanation_support_r5")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"VALID={ok}")
    if args.check:
        print(f"IDEMPOTENT={idempotent}")
    if not ok or (args.check and not idempotent):
        raise SystemExit("RESULT=FAIL_EXPLANATION_SUPPORT_V344_R5")
    print("RESULT=PASS_EXPLANATION_SUPPORT_V344_R5")

if __name__ == "__main__":
    main()

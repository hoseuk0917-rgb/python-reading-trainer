from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "src" / "pwa" / "index.html"
VERSION = "v345_a1"
ANCHOR = '<script src="./explanation_support_v344.js?v=20260812_v344_explain1"></script>'
SCRIPT = '<script src="./study_experience_v345.js?v=20260812_v345_a1"></script>'


def transform(text: str) -> tuple[str, int]:
    if text.count(SCRIPT) == 1:
        return text, 0
    if text.count(SCRIPT) > 1:
        raise RuntimeError("duplicate V345 script tags")
    if text.count(ANCHOR) != 1:
        raise RuntimeError("V344 script anchor not found exactly once")
    return text.replace(ANCHOR, ANCHOR + "\n  " + SCRIPT, 1), 1


def validate(text: str) -> bool:
    return text.count(SCRIPT) == 1 and text.index(ANCHOR) < text.index(SCRIPT)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    raw = INDEX.read_text(encoding="utf-8")
    updated, changes = transform(raw)
    if args.apply and changes:
        INDEX.write_text(updated, encoding="utf-8")
    final = updated if args.apply else raw
    ok = validate(final)
    idempotent = changes == 0 if args.check else True

    print("PATCH_VERSION=v345_a1")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"VALID={ok}")
    if args.check:
        print(f"IDEMPOTENT={idempotent}")
    if not ok or (args.check and not idempotent):
        raise SystemExit("RESULT=FAIL_STUDY_EXPERIENCE_V345_PATCH")
    print("RESULT=PASS_STUDY_EXPERIENCE_V345_PATCH")


if __name__ == "__main__":
    main()

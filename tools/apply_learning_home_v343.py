from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "src" / "pwa" / "index.html"
SCRIPT = '<script src="./learning_home_v343.js?v=20260812_v343_a1"></script>'
ANCHOR = '<script src="./learning_experience_v341.js?v=20260812_v341_a2&h=20260812_v342_a1"></script>'


def apply(text: str) -> tuple[str, bool]:
    if SCRIPT in text:
        return text, False
    if ANCHOR not in text:
        raise SystemExit("V343_ANCHOR_NOT_FOUND")
    return text.replace(ANCHOR, ANCHOR + "\n  " + SCRIPT, 1), True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        raise SystemExit("choose exactly one of --apply/--check")

    raw = INDEX.read_text(encoding="utf-8")
    updated, changed = apply(raw)
    if args.apply and changed:
        INDEX.write_text(updated, encoding="utf-8")

    final = updated if args.apply else raw
    script_count = final.count(SCRIPT)
    anchor_count = final.count(ANCHOR)
    ordered = ANCHOR + "\n  " + SCRIPT in final
    ok = script_count == 1 and anchor_count == 1 and ordered

    print("PATCH_VERSION=v343_learning_home_a1")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={1 if changed else 0}")
    print(f"HOME_SCRIPT_COUNT={script_count}")
    print(f"ANCHOR_COUNT={anchor_count}")
    print(f"SCRIPT_ORDER_OK={ordered}")
    if args.check:
        print(f"IDEMPOTENT={not changed}")
        ok = ok and not changed
    print("RESULT=" + ("PASS_LEARNING_HOME_V343_PATCH" if ok else "FAIL_LEARNING_HOME_V343_PATCH"))
    if not ok:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

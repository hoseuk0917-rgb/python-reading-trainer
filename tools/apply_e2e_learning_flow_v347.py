#!/usr/bin/env python3
"""Wire the V347 end-to-end learning-flow hardening runtime idempotently."""

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "src" / "pwa" / "index.html"
RUNTIME = ROOT / "src" / "pwa" / "learning_flow_hardening_v347.js"
ANCHOR = '  <script src="./study_progress_v346.js?v=20260812_v346_a1"></script>'
SCRIPT = '  <script src="./learning_flow_hardening_v347.js?v=20260812_v347_a8"></script>'
OLD_SCRIPTS = [
    '  <script src="./learning_flow_hardening_v347.js?v=20260812_v347_a1"></script>',
    '  <script src="./learning_flow_hardening_v347.js?v=20260812_v347_a2"></script>',
    '  <script src="./learning_flow_hardening_v347.js?v=20260812_v347_a3"></script>',
    '  <script src="./learning_flow_hardening_v347.js?v=20260812_v347_a4"></script>',
    '  <script src="./learning_flow_hardening_v347.js?v=20260812_v347_a5"></script>',
    '  <script src="./learning_flow_hardening_v347.js?v=20260812_v347_a6"></script>',
    '  <script src="./learning_flow_hardening_v347.js?v=20260812_v347_a7"></script>',
]


def planned_text(text: str) -> str:
    out = text
    for old in OLD_SCRIPTS:
        out = out.replace(old + "\n", "").replace("\n" + old, "")
    count = out.count(SCRIPT)
    if count == 1:
        return out
    if count > 1:
        raise RuntimeError(f"duplicate V347 runtime script: {count}")
    if ANCHOR not in out:
        raise RuntimeError("V346 script anchor not found")
    return out.replace(ANCHOR, ANCHOR + "\n" + SCRIPT, 1)


def validate(text: str) -> bool:
    if not RUNTIME.exists():
        return False
    if text.count(SCRIPT) != 1:
        return False
    if any(old in text for old in OLD_SCRIPTS):
        return False
    return text.index(ANCHOR) < text.index(SCRIPT)


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()

    original = INDEX.read_text(encoding="utf-8")
    target = planned_text(original)
    changes = int(target != original)

    if args.apply and changes:
        INDEX.write_text(target, encoding="utf-8", newline="\n")

    actual = INDEX.read_text(encoding="utf-8") if args.apply else target
    valid = validate(actual)
    idempotent = planned_text(actual) == actual

    print("PATCH_VERSION=v347_a8")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"VALID={valid}")
    if args.check:
        print(f"IDEMPOTENT={idempotent}")

    if not valid or (args.check and changes != 0):
        print("RESULT=FAIL_E2E_LEARNING_FLOW_V347_PATCH")
        return 1
    print("RESULT=PASS_E2E_LEARNING_FLOW_V347_PATCH")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

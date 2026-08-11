#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UI = ROOT / "src" / "pwa" / "learning_experience_v341.js"
VERSION = "v341_r3"
MARKER = "LEARNING_EXPERIENCE_V341_R3_WAIT_FOR_V340_PATH"
OLD = '    if (!ok || !engine() || !Array.isArray(cards) || cards.length === 0) return false;'
NEW = '    if (!ok || !engine() || !Array.isArray(cards) || cards.length === 0 || !document.getElementById("learningPathV340")) return false;'


def patch(text: str) -> str:
    out = text
    if NEW not in out:
        if OLD not in out:
            raise RuntimeError("V341 ready anchor missing")
        out = out.replace(OLD, NEW, 1)
    if MARKER not in out:
        out = out.replace('  // LEARNING_EXPERIENCE_V341_R2_EXACT_MISSION_MAPPING', '  // LEARNING_EXPERIENCE_V341_R2_EXACT_MISSION_MAPPING\n  // ' + MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    errors = []
    if NEW not in text:
        errors.append("V340 learning path readiness guard missing")
    if MARKER not in text:
        errors.append("R3 marker missing")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--apply", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()

    before = UI.read_text(encoding="utf-8-sig")
    after = patch(before)
    changed = int(after != before)
    if args.apply and changed:
        UI.write_text(after, encoding="utf-8")
    final = after if args.apply else before
    errors = audit(final)

    print(f"PATCH_VERSION={VERSION}")
    if args.apply:
        print(f"V341_R3_UI_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_R3_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("R3 not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_R3" if errors else "PASS_LEARNING_EXPERIENCE_V341_R3"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

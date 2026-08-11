#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "tools" / "learning_experience_v341_browser_case.html"
VERSION = "v341_smoke_r4"
MARKER = "V341_SMOKE_R4_RUNTIME_TRACE_REPORT"

OLD_MISSION = '''    if (directMissionError) lines.push("MISSION_DIRECT_ERROR=" + directMissionError.replace(/\\s+/g, " "));
    check("CHECKPOINT_1_IS_SAFE_CHANGE", /작은 기능을 수정한 뒤/.test(question), question);'''
NEW_MISSION = '''    if (directMissionError) lines.push("MISSION_DIRECT_ERROR=" + directMissionError.replace(/\\s+/g, " "));
    lines.push("MISSION_TRACE=" + JSON.stringify(win.__v341MissionTrace || []));
    check("CHECKPOINT_1_IS_SAFE_CHANGE", /작은 기능을 수정한 뒤/.test(question), question);'''

OLD_RESET = '''    check("RESET_CLEARS_V341_STATE", !!resetStateCleared, "value=" + String(win.localStorage.getItem(V341_KEY)));
    check("RESET_PRESERVES_NOTE_SENTINEL", win.localStorage.getItem(NOTE_SENTINEL) === "keep-me", "value=" + String(win.localStorage.getItem(NOTE_SENTINEL)));'''
NEW_RESET = '''    lines.push("RESET_TRACE=" + JSON.stringify(win.__v341ResetTrace || []));
    check("RESET_CLEARS_V341_STATE", !!resetStateCleared, "value=" + String(win.localStorage.getItem(V341_KEY)));
    check("RESET_PRESERVES_NOTE_SENTINEL", win.localStorage.getItem(NOTE_SENTINEL) === "keep-me", "value=" + String(win.localStorage.getItem(NOTE_SENTINEL)));'''


def patch(text: str) -> str:
    out = text
    if NEW_MISSION not in out:
        if OLD_MISSION not in out:
            raise RuntimeError("mission trace report anchor missing")
        out = out.replace(OLD_MISSION, NEW_MISSION, 1)
    if NEW_RESET not in out:
        if OLD_RESET not in out:
            raise RuntimeError("reset trace report anchor missing")
        out = out.replace(OLD_RESET, NEW_RESET, 1)
    if MARKER not in out:
        anchor = "  // V341_SMOKE_R3_MISSION_DIRECT_DIAGNOSTIC"
        if anchor not in out:
            raise RuntimeError("smoke R3 marker missing")
        out = out.replace(anchor, anchor + "\n  // " + MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    errors = []
    for value in ("MISSION_TRACE=", "RESET_TRACE=", MARKER):
        if value not in text:
            errors.append("missing:" + value)
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--apply", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()
    before = CASE.read_text(encoding="utf-8-sig")
    after = patch(before)
    changed = int(after != before)
    if args.apply and changed:
        CASE.write_text(after, encoding="utf-8")
    final = after if args.apply else before
    errors = audit(final)
    print(f"PATCH_VERSION={VERSION}")
    if args.apply:
        print(f"V341_SMOKE_R4_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_SMOKE_R4_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("smoke R4 not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_SMOKE_R4" if errors else "PASS_LEARNING_EXPERIENCE_V341_SMOKE_R4"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

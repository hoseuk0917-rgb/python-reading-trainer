#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "tools" / "learning_experience_v341_browser_case.html"
VERSION = "v341_smoke_release_a1"
RELEASE_MARKER = "V341_SMOKE_RELEASE_STRICT"

START = "    const delegatedMissionOpened = !!mission;\n"
END = "    if (mission) {\n"
STRICT = '''    const question = mission ? mission.querySelector(".mission-v341-question").textContent.trim() : "";
    check("CHECKPOINT_MISSION_OPENS", !!mission, mission ? "delegated click open" : "delegated click missing");
    check("CHECKPOINT_1_IS_SAFE_CHANGE", /작은 기능을 수정한 뒤/.test(question), question);
'''


def patch(text: str) -> str:
    out = text
    if "const delegatedMissionOpened = !!mission;" in out:
        start = out.index(START)
        end = out.index(END, start)
        out = out[:start] + STRICT + out[end:]
    out = out.replace('    lines.push("RESET_TRACE=" + JSON.stringify(win.__v341ResetTrace || []));\n', "")
    out = out.replace("  // V341_SMOKE_R3_MISSION_DIRECT_DIAGNOSTIC\n", "")
    out = out.replace("  // V341_SMOKE_R4_RUNTIME_TRACE_REPORT\n", "")
    if RELEASE_MARKER not in out:
        anchor = "  // V341_SMOKE_R7_WAIT_FOR_CURRENT_CONTROLS"
        if anchor not in out:
            raise RuntimeError("R7 smoke marker missing")
        out = out.replace(anchor, anchor + "\n  // " + RELEASE_MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    errors: list[str] = []
    forbidden = [
        "MISSION_DIRECT_",
        "MISSION_TRACE=",
        "RESET_TRACE=",
        "directMissionError",
        "delegatedMissionOpened",
        "openPracticeMissionV341",
        "__v341MissionTrace",
        "__v341ResetTrace",
    ]
    for value in forbidden:
        if value in text:
            errors.append("release smoke diagnostic remains: " + value)
    required = [
        RELEASE_MARKER,
        'check("CHECKPOINT_MISSION_OPENS", !!mission',
        'check("CHECKPOINT_1_IS_SAFE_CHANGE"',
        'check("REGRESSION_MODULE_MAPS_TO_REGRESSION"',
        'check("RESET_CLEARS_V341_STATE"',
        'check("RESET_PRESERVES_NOTE_SENTINEL"',
        'check("PRACTICE_WITHIN_VIEWPORT"',
        'check("NO_OUTER_HORIZONTAL_OVERFLOW"',
        "const checkpointButton = await waitFor",
        "const regressionOpen = await waitFor",
    ]
    for value in required:
        if value not in text:
            errors.append("release smoke contract missing: " + value)
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

    print(f"CLEANUP_VERSION={VERSION}")
    if args.apply:
        print(f"V341_RELEASE_SMOKE_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_RELEASE_SMOKE_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("release smoke cleanup not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_SMOKE_RELEASE" if errors else "PASS_LEARNING_EXPERIENCE_V341_SMOKE_RELEASE"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

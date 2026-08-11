#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UI = ROOT / "src" / "pwa" / "learning_experience_v341.js"
VERSION = "v341_release_cleanup_a1"
TRACE_MARKER = "LEARNING_EXPERIENCE_V341_R6_RUNTIME_TRACE"
RELEASE_MARKER = "LEARNING_EXPERIENCE_V341_RELEASE_CLEAN"


def patch(text: str) -> str:
    lines: list[str] = []
    for line in text.splitlines():
        if TRACE_MARKER in line:
            continue
        if "window.__v341MissionTrace" in line:
            continue
        if "window.__v341ResetTrace" in line:
            continue
        if "window.openPracticeMissionV341 = openMission;" in line:
            continue
        lines.append(line)
    out = "\n".join(lines) + ("\n" if text.endswith("\n") else "")
    if RELEASE_MARKER not in out:
        anchor = "  // LEARNING_EXPERIENCE_V341_R5_RESET_POSTPROCESS"
        if anchor not in out:
            raise RuntimeError("R5 marker missing for release cleanup")
        out = out.replace(anchor, anchor + "\n  // " + RELEASE_MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    errors: list[str] = []
    forbidden = [
        TRACE_MARKER,
        "__v341MissionTrace",
        "__v341ResetTrace",
        "window.openPracticeMissionV341",
    ]
    for value in forbidden:
        if value in text:
            errors.append("release diagnostic remains: " + value)
    required = [
        RELEASE_MARKER,
        "function openMission(number)",
        "const runtimeEngine = engine();",
        "const mission = runtimeEngine.missionForCheckpoint(number, locale());",
        "const modal = ensureMissionModal();",
        'modal.classList.remove("hidden");',
        "function bindMissionDelegation()",
        'event.target.closest("[data-mission-checkpoint-v341]")',
        "if (number > 0) openMission(number);",
        "function bindResetPostProcess()",
        "const remainingAttempts = attemptedCount();",
        "localStorage.removeItem(STORAGE_KEY);",
    ]
    for value in required:
        if value not in text:
            errors.append("release contract missing: " + value)
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

    print(f"CLEANUP_VERSION={VERSION}")
    if args.apply:
        print(f"V341_RELEASE_UI_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_RELEASE_CLEANUP_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("release cleanup not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_RELEASE_CLEANUP" if errors else "PASS_LEARNING_EXPERIENCE_V341_RELEASE_CLEANUP"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

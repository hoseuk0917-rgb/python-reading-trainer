#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UI = ROOT / "src" / "pwa" / "learning_experience_v341.js"
VERSION = "v341_r5"
MARKER = "LEARNING_EXPERIENCE_V341_R5_RESET_POSTPROCESS"

RESET_FN = '''
  function bindResetPostProcess() {
    if (window.__learningExperienceV341ResetPostProcess) return;
    document.addEventListener("click", function(event) {
      const button = event.target && event.target.closest ? event.target.closest("#resetBtn") : null;
      if (!button) return;
      window.setTimeout(function() {
        const remainingAttempts = attemptedCount();
        if (remainingAttempts !== 0) return;
        localStorage.removeItem(STORAGE_KEY);
        renderLearningSummary();
        renderPractice();
      }, 120);
    }, true);
    window.__learningExperienceV341ResetPostProcess = true;
  }
'''

OLD_READY = '''    patchView();
    bindMissionDelegation();
    observeReviewClicks();'''
NEW_READY = '''    patchView();
    bindMissionDelegation();
    bindResetPostProcess();
    observeReviewClicks();'''


def patch(text: str) -> str:
    out = text
    if "function bindResetPostProcess()" not in out:
        anchor = "\n  function patchAttemptHandlers() {"
        if anchor not in out:
            raise RuntimeError("reset postprocess insertion anchor missing")
        out = out.replace(anchor, RESET_FN + anchor, 1)
    if NEW_READY not in out:
        if OLD_READY not in out:
            raise RuntimeError("ready reset postprocess anchor missing")
        out = out.replace(OLD_READY, NEW_READY, 1)
    if MARKER not in out:
        anchor = "  // LEARNING_EXPERIENCE_V341_R4_STABLE_ACTIONS_RESET"
        if anchor not in out:
            raise RuntimeError("R4 marker missing")
        out = out.replace(anchor, anchor + "\n  // " + MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    errors = []
    required = [
        "function bindResetPostProcess()",
        'event.target.closest("#resetBtn")',
        "const remainingAttempts = attemptedCount();",
        "localStorage.removeItem(STORAGE_KEY);",
        "bindResetPostProcess();",
        MARKER,
    ]
    for value in required:
        if value not in text:
            errors.append("missing: " + value)
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
        print(f"V341_R5_UI_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_R5_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("R5 not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_R5" if errors else "PASS_LEARNING_EXPERIENCE_V341_R5"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

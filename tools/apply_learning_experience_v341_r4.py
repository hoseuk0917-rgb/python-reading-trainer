#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UI = ROOT / "src" / "pwa" / "learning_experience_v341.js"
VERSION = "v341_r4_release3"
MARKER = "LEARNING_EXPERIENCE_V341_R4_STABLE_ACTIONS_RESET"

OLD_CHECKPOINT_BIND = '        button.onclick = function() { openMission(firstPending); };'
NEW_CHECKPOINT_BIND = '        button.dataset.missionCheckpointV341 = String(firstPending);'

OLD_MODULE_BIND = '''      button.onclick = function() {
        openMission(Number(module.missionCheckpoint || 1));
      };'''
NEW_MODULE_BIND = '      button.dataset.missionCheckpointV341 = String(Number(module.missionCheckpoint || 1));'

OLD_RESET_BODY = '''    resetProgress = function() {
      const before = localStorage.getItem(PROGRESS_KEY);
      const result = original.apply(this, arguments);
      const after = localStorage.getItem(PROGRESS_KEY);
      if (before !== null && after === null) {
        localStorage.removeItem(STORAGE_KEY);
        renderLearningSummary();
        renderPractice();
      }
      return result;
    };'''
NEW_RESET_BODY = '''    resetProgress = function() {
      const result = original.apply(this, arguments);
      const progress = safeProgress();
      const remainingAttempts = engine() && Array.isArray(cards)
        ? engine().attemptedCount(cards, progress)
        : 0;
      if (remainingAttempts === 0) {
        localStorage.removeItem(STORAGE_KEY);
        renderLearningSummary();
        renderPractice();
      }
      return result;
    };'''
RESET_CONTRACT_PARTS = (
    "resetProgress = function() {",
    "const result = original.apply(this, arguments);",
    "const progress = safeProgress();",
    "const remainingAttempts = engine() && Array.isArray(cards)",
    "? engine().attemptedCount(cards, progress)",
    "if (remainingAttempts === 0) {",
    "localStorage.removeItem(STORAGE_KEY);",
    "renderLearningSummary();",
    "renderPractice();",
)

DELEGATE_FN = '''
  function bindMissionDelegation() {
    if (window.__learningExperienceV341MissionDelegated) return;
    document.addEventListener("click", function(event) {
      const button = event.target && event.target.closest
        ? event.target.closest("[data-mission-checkpoint-v341]")
        : null;
      if (!button || button.disabled) return;
      const number = Number(button.dataset.missionCheckpointV341 || 0);
      if (number > 0) openMission(number);
    }, true);
    window.__learningExperienceV341MissionDelegated = true;
  }
'''

OLD_READY_START = '''  function ready() {
    injectStyle();
    patchView();
    observeReviewClicks();'''
NEW_READY_START = '''  function ready() {
    injectStyle();
    patchView();
    bindMissionDelegation();
    observeReviewClicks();'''

DEBUG_EXPORT = '  window.openPracticeMissionV341 = openMission;\n'


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise RuntimeError(label + " anchor missing")
    return text.replace(old, new, 1)


def has_reset_contract(text: str) -> bool:
    return all(part in text for part in RESET_CONTRACT_PARTS)


def patch(text: str) -> str:
    out = text
    out = replace_once(out, OLD_CHECKPOINT_BIND, NEW_CHECKPOINT_BIND, "checkpoint mission bind")
    out = replace_once(out, OLD_MODULE_BIND, NEW_MODULE_BIND, "module mission bind")
    if not has_reset_contract(out):
        out = replace_once(out, OLD_RESET_BODY, NEW_RESET_BODY, "reset")
    if "function bindMissionDelegation()" not in out:
        anchor = "\n  function patchAttemptHandlers() {"
        if anchor not in out:
            raise RuntimeError("mission delegation insertion anchor missing")
        out = out.replace(anchor, DELEGATE_FN + anchor, 1)
    if "bindMissionDelegation();" not in out:
        out = replace_once(out, OLD_READY_START, NEW_READY_START, "ready delegation")
    out = out.replace(DEBUG_EXPORT, "")
    if MARKER not in out:
        anchor = "  // LEARNING_EXPERIENCE_V341_R3_WAIT_FOR_V340_PATH"
        if anchor not in out:
            raise RuntimeError("R3 marker anchor missing")
        out = out.replace(anchor, anchor + "\n  // " + MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    errors: list[str] = []
    required = [
        NEW_CHECKPOINT_BIND,
        NEW_MODULE_BIND,
        "function bindMissionDelegation()",
        "bindMissionDelegation();",
        MARKER,
    ]
    for value in required:
        if value not in text:
            errors.append("missing: " + value[:80])
    if not has_reset_contract(text):
        errors.append("functional reset contract missing")
    if OLD_RESET_BODY in text:
        errors.append("old null-key reset logic remains")
    if "window.openPracticeMissionV341" in text:
        errors.append("debug mission export remains")
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
        print(f"V341_R4_UI_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_R4_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("R4 not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_R4" if errors else "PASS_LEARNING_EXPERIENCE_V341_R4"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

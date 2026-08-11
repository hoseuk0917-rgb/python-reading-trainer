#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UI = ROOT / "src" / "pwa" / "learning_experience_v341.js"
VERSION = "v341_r6_trace"
MARKER = "LEARNING_EXPERIENCE_V341_R6_RUNTIME_TRACE"

OLD_OPEN = '''  function openMission(number) {
    if (!engine()) return;
    const mission = engine().missionForCheckpoint(number, locale());
    const modal = ensureMissionModal();'''
NEW_OPEN = '''  function openMission(number) {
    window.__v341MissionTrace = window.__v341MissionTrace || [];
    window.__v341MissionTrace.push("entered:" + String(number));
    const runtimeEngine = engine();
    window.__v341MissionTrace.push("engine:" + Boolean(runtimeEngine));
    if (!runtimeEngine) return;
    const mission = runtimeEngine.missionForCheckpoint(number, locale());
    window.__v341MissionTrace.push("mission:" + String(mission && mission.kind || ""));
    window.__v341MissionTrace.push("modalBefore:" + document.querySelectorAll("#missionModalV341").length);
    const modal = ensureMissionModal();
    window.__v341MissionTrace.push("modalAfterEnsure:" + document.querySelectorAll("#missionModalV341").length);'''

OLD_SHOW = '''    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }'''
NEW_SHOW = '''    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    window.__v341MissionTrace.push("shown:" + String(number) + ":hidden=" + modal.classList.contains("hidden"));
  }'''

OLD_RESET_WRAP = '''    resetProgress = function() {
      const result = original.apply(this, arguments);
      const progress = safeProgress();'''
NEW_RESET_WRAP = '''    resetProgress = function() {
      window.__v341ResetTrace = window.__v341ResetTrace || [];
      window.__v341ResetTrace.push("wrapper-entered");
      const result = original.apply(this, arguments);
      window.__v341ResetTrace.push("original-returned");
      const progress = safeProgress();'''

OLD_RESET_REMAIN = '''      if (remainingAttempts === 0) {
        localStorage.removeItem(STORAGE_KEY);
        renderLearningSummary();'''
NEW_RESET_REMAIN = '''      window.__v341ResetTrace.push("wrapper-remaining:" + String(remainingAttempts));
      if (remainingAttempts === 0) {
        localStorage.removeItem(STORAGE_KEY);
        window.__v341ResetTrace.push("wrapper-storage-removed:" + String(localStorage.getItem(STORAGE_KEY) === null));
        renderLearningSummary();'''

OLD_POST = '''      window.setTimeout(function() {
        const remainingAttempts = attemptedCount();
        if (remainingAttempts !== 0) return;
        localStorage.removeItem(STORAGE_KEY);
        renderLearningSummary();'''
NEW_POST = '''      window.__v341ResetTrace = window.__v341ResetTrace || [];
      window.__v341ResetTrace.push("post-click-seen");
      window.setTimeout(function() {
        const remainingAttempts = attemptedCount();
        window.__v341ResetTrace.push("post-remaining:" + String(remainingAttempts));
        if (remainingAttempts !== 0) return;
        localStorage.removeItem(STORAGE_KEY);
        window.__v341ResetTrace.push("post-storage-removed:" + String(localStorage.getItem(STORAGE_KEY) === null));
        renderLearningSummary();'''


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise RuntimeError(label + " anchor missing")
    return text.replace(old, new, 1)


def patch(text: str) -> str:
    out = text
    out = replace_once(out, OLD_OPEN, NEW_OPEN, "open mission")
    out = replace_once(out, OLD_SHOW, NEW_SHOW, "mission show")
    out = replace_once(out, OLD_RESET_WRAP, NEW_RESET_WRAP, "reset wrapper")
    out = replace_once(out, OLD_RESET_REMAIN, NEW_RESET_REMAIN, "reset remaining")
    out = replace_once(out, OLD_POST, NEW_POST, "reset postprocess")
    if MARKER not in out:
        anchor = "  // LEARNING_EXPERIENCE_V341_R5_RESET_POSTPROCESS"
        if anchor not in out:
            raise RuntimeError("R5 marker missing")
        out = out.replace(anchor, anchor + "\n  // " + MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    required = [
        "window.__v341MissionTrace",
        '"engine:" + Boolean(runtimeEngine)',
        '"modalAfterEnsure:"',
        '"shown:" + String(number)',
        "window.__v341ResetTrace",
        '"wrapper-remaining:"',
        '"post-remaining:"',
        MARKER,
    ]
    return ["missing:" + value for value in required if value not in text]


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
        print(f"V341_R6_TRACE_UI_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_R6_TRACE_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("R6 trace not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_R6_TRACE" if errors else "PASS_LEARNING_EXPERIENCE_V341_R6_TRACE"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

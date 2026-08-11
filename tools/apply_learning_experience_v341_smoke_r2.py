#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "tools" / "learning_experience_v341_browser_case.html"
VERSION = "v341_smoke_r2"
MARKER = "V341_SMOKE_R2_ASYNC_STATE_WAIT"

OLD_SUMMARY = '''    const summaryText = doc.getElementById("learningSummaryV341").textContent.replace(/\\s+/g," ");
    check("SUMMARY_ADVANCES_FROM_REAL_ATTEMPT", /순차 학습\\s*1\\s*\\/\\s*1785/.test(summaryText), summaryText);'''
NEW_SUMMARY = '''    const advancedSummary = await waitFor(() => {
      const node = doc.getElementById("learningSummaryV341");
      const text = node ? node.textContent.replace(/\\s+/g," ") : "";
      return /순차 학습\\s*1\\s*\\/\\s*1785/.test(text) ? text : null;
    }, 4000);
    check("SUMMARY_ADVANCES_FROM_REAL_ATTEMPT", !!advancedSummary, advancedSummary || (doc.getElementById("learningSummaryV341") ? doc.getElementById("learningSummaryV341").textContent.replace(/\\s+/g," ") : "missing"));'''

OLD_CHECKPOINT_CLICK = '''    const checkpointButton = doc.querySelector(".practice-v341-primary");
    if (checkpointButton) checkpointButton.click();'''
NEW_CHECKPOINT_CLICK = '''    const checkpointButton = doc.querySelector(".practice-v341-primary");
    check("CHECKPOINT_BUTTON_ACTION_BOUND", !!checkpointButton && checkpointButton.dataset.missionCheckpointV341 === "1", checkpointButton ? "mission=" + checkpointButton.dataset.missionCheckpointV341 : "missing");
    if (checkpointButton) checkpointButton.click();'''

OLD_RESET_WAIT = '''    if (resetBtn) resetBtn.click();
    await sleep(220);
    check("RESET_CLEARS_V341_STATE", win.localStorage.getItem(V341_KEY) === null, "value=" + String(win.localStorage.getItem(V341_KEY)));
    check("RESET_PRESERVES_NOTE_SENTINEL", win.localStorage.getItem(NOTE_SENTINEL) === "keep-me", "value=" + String(win.localStorage.getItem(NOTE_SENTINEL)));
    const afterResetSummary = doc.getElementById("learningSummaryV341").textContent.replace(/\\s+/g," ");
    check("RESET_RETURNS_V341_SEQUENCE_ZERO", /순차 학습\\s*0\\s*\\/\\s*1785/.test(afterResetSummary), afterResetSummary);'''
NEW_RESET_WAIT = '''    if (resetBtn) resetBtn.click();
    const resetStateCleared = await waitFor(() => win.localStorage.getItem(V341_KEY) === null ? true : null, 4000);
    check("RESET_CLEARS_V341_STATE", !!resetStateCleared, "value=" + String(win.localStorage.getItem(V341_KEY)));
    check("RESET_PRESERVES_NOTE_SENTINEL", win.localStorage.getItem(NOTE_SENTINEL) === "keep-me", "value=" + String(win.localStorage.getItem(NOTE_SENTINEL)));
    const afterResetSummary = await waitFor(() => {
      const node = doc.getElementById("learningSummaryV341");
      const text = node ? node.textContent.replace(/\\s+/g," ") : "";
      return /순차 학습\\s*0\\s*\\/\\s*1785/.test(text) ? text : null;
    }, 4000);
    check("RESET_RETURNS_V341_SEQUENCE_ZERO", !!afterResetSummary, afterResetSummary || "summary not reset");'''

OLD_VIEW = '''    clickTab(doc, "practice");
    await sleep(100);
    const viewRect = doc.getElementById("practiceView").getBoundingClientRect();
    check("PRACTICE_WITHIN_VIEWPORT", viewRect.width > 0 && viewRect.left >= -1 && viewRect.right <= root.clientWidth + 1, "left=" + Math.round(viewRect.left) + " right=" + Math.round(viewRect.right) + " viewport=" + root.clientWidth);
    check("NO_OUTER_HORIZONTAL_OVERFLOW", root.scrollWidth <= root.clientWidth + 2, "scrollWidth=" + root.scrollWidth + " clientWidth=" + root.clientWidth);'''
NEW_VIEW = '''    clickTab(doc, "practice");
    const visiblePractice = await waitFor(() => {
      const view = doc.getElementById("practiceView");
      if (!view || !view.classList.contains("active-view")) return null;
      const rect = view.getBoundingClientRect();
      return rect.width > 0 ? rect : null;
    }, 4000);
    const viewRect = visiblePractice || {left:0,right:0,width:0};
    root = doc.documentElement;
    check("PRACTICE_WITHIN_VIEWPORT", viewRect.width > 0 && viewRect.left >= -1 && viewRect.right <= root.clientWidth + 1, "left=" + Math.round(viewRect.left) + " right=" + Math.round(viewRect.right) + " viewport=" + root.clientWidth);
    check("NO_OUTER_HORIZONTAL_OVERFLOW", root.scrollWidth <= root.clientWidth + 2, "scrollWidth=" + root.scrollWidth + " clientWidth=" + root.clientWidth);'''


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise RuntimeError(label + " anchor missing")
    return text.replace(old, new, 1)


def patch(text: str) -> str:
    out = text
    out = replace_once(out, OLD_SUMMARY, NEW_SUMMARY, "summary wait")
    out = replace_once(out, OLD_CHECKPOINT_CLICK, NEW_CHECKPOINT_CLICK, "checkpoint bind audit")
    out = replace_once(out, OLD_RESET_WAIT, NEW_RESET_WAIT, "reset wait")
    out = replace_once(out, OLD_VIEW, NEW_VIEW, "viewport wait")
    if MARKER not in out:
        anchor = '  const NOTE_SENTINEL = "python-reading-trainer-v341-note-sentinel";'
        if anchor not in out:
            raise RuntimeError("smoke marker anchor missing")
        out = out.replace(anchor, anchor + "\n  // " + MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    errors = []
    for required in (NEW_SUMMARY, NEW_CHECKPOINT_CLICK, NEW_RESET_WAIT, NEW_VIEW, MARKER):
        if required not in text:
            errors.append("missing patched smoke block")
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
        print(f"V341_SMOKE_R2_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_SMOKE_R2_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("smoke R2 not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_SMOKE_R2" if errors else "PASS_LEARNING_EXPERIENCE_V341_SMOKE_R2"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

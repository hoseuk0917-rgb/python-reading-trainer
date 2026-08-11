#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "tools" / "learning_experience_v341_browser_case.html"
VERSION = "v341_smoke_r6"
MARKER = "V341_SMOKE_R6_REACQUIRE_CURRENT_CONTROLS"

OLD_CHECKPOINT = '''    const checkpointButton = doc.querySelector(".practice-v341-primary");
    check("CHECKPOINT_BUTTON_ACTION_BOUND", !!checkpointButton && checkpointButton.dataset.missionCheckpointV341 === "1", checkpointButton ? "mission=" + checkpointButton.dataset.missionCheckpointV341 : "missing");
    if (checkpointButton) checkpointButton.click();'''
NEW_CHECKPOINT = '''    doc = frame.contentDocument;
    win = frame.contentWindow;
    const checkpointButton = doc && doc.querySelector(".practice-v341-primary");
    check("CHECKPOINT_BUTTON_ACTION_BOUND", !!checkpointButton && checkpointButton.dataset.missionCheckpointV341 === "1", checkpointButton ? "mission=" + checkpointButton.dataset.missionCheckpointV341 : "missing");
    if (checkpointButton) {
      const currentButton = frame.contentDocument && frame.contentDocument.querySelector(".practice-v341-primary");
      if (currentButton) currentButton.click();
    }'''

OLD_REGRESSION = '''    const regressionOpen = moduleByTitle(doc, "회귀 테스트");
    check("REGRESSION_MODULE_OPENS_AT_60", !!regressionOpen && !regressionOpen.classList.contains("locked") && !regressionOpen.querySelector("button").disabled, regressionOpen ? regressionOpen.className : "missing");
    if (regressionOpen) regressionOpen.querySelector("button").click();'''
NEW_REGRESSION = '''    doc = frame.contentDocument;
    win = frame.contentWindow;
    const regressionOpen = moduleByTitle(doc, "회귀 테스트");
    check("REGRESSION_MODULE_OPENS_AT_60", !!regressionOpen && !regressionOpen.classList.contains("locked") && !regressionOpen.querySelector("button").disabled, regressionOpen ? regressionOpen.className : "missing");
    if (regressionOpen) {
      const currentRegression = moduleByTitle(frame.contentDocument, "회귀 테스트");
      const currentRegressionButton = currentRegression && currentRegression.querySelector("button");
      if (currentRegressionButton) currentRegressionButton.click();
    }'''

OLD_DUPLICATES = '''    check("NO_DUPLICATE_PRACTICE_DASHBOARD", doc.querySelectorAll("#practiceDashboardV341").length === 1, "count=" + doc.querySelectorAll("#practiceDashboardV341").length);
    check("NO_DUPLICATE_MISSION_MODAL", doc.querySelectorAll("#missionModalV341").length === 1, "count=" + doc.querySelectorAll("#missionModalV341").length);
    check("NO_DUPLICATE_TOAST", doc.querySelectorAll("#toastV341").length === 1, "count=" + doc.querySelectorAll("#toastV341").length);'''
NEW_DUPLICATES = '''    doc = frame.contentDocument;
    win = frame.contentWindow;
    const dashboardCount = doc.querySelectorAll("#practiceDashboardV341").length;
    const modalCount = doc.querySelectorAll("#missionModalV341").length;
    const toastCount = doc.querySelectorAll("#toastV341").length;
    check("NO_DUPLICATE_PRACTICE_DASHBOARD", dashboardCount === 1, "count=" + dashboardCount);
    check("NO_DUPLICATE_MISSION_MODAL", modalCount === 1, "count=" + modalCount);
    check("NO_DUPLICATE_TOAST", toastCount <= 1, "count=" + toastCount + " lazy=true");'''


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise RuntimeError(label + " anchor missing")
    return text.replace(old, new, 1)


def patch(text: str) -> str:
    out = text
    out = replace_once(out, OLD_CHECKPOINT, NEW_CHECKPOINT, "checkpoint current control")
    out = replace_once(out, OLD_REGRESSION, NEW_REGRESSION, "regression current control")
    out = replace_once(out, OLD_DUPLICATES, NEW_DUPLICATES, "duplicate lazy semantics")
    if MARKER not in out:
        anchor = "  // V341_SMOKE_R5_CURRENT_IFRAME_CONTEXT"
        if anchor not in out:
            raise RuntimeError("smoke R5 marker missing")
        out = out.replace(anchor, anchor + "\n  // " + MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    errors = []
    required = [
        "const currentButton = frame.contentDocument",
        "const currentRegression = moduleByTitle(frame.contentDocument",
        "const toastCount = doc.querySelectorAll(\"#toastV341\").length;",
        'check("NO_DUPLICATE_TOAST", toastCount <= 1',
        MARKER,
    ]
    for value in required:
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
        print(f"V341_SMOKE_R6_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_SMOKE_R6_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("smoke R6 not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_SMOKE_R6" if errors else "PASS_LEARNING_EXPERIENCE_V341_SMOKE_R6"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

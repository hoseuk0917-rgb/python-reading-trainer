#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "tools" / "learning_experience_v341_browser_case.html"
VERSION = "v341_smoke_r7"
MARKER = "V341_SMOKE_R7_WAIT_FOR_CURRENT_CONTROLS"

OLD_CHECKPOINT = '''    doc = frame.contentDocument;
    win = frame.contentWindow;
    const checkpointButton = doc && doc.querySelector(".practice-v341-primary");
    check("CHECKPOINT_BUTTON_ACTION_BOUND", !!checkpointButton && checkpointButton.dataset.missionCheckpointV341 === "1", checkpointButton ? "mission=" + checkpointButton.dataset.missionCheckpointV341 : "missing");
    if (checkpointButton) {
      const currentButton = frame.contentDocument && frame.contentDocument.querySelector(".practice-v341-primary");
      if (currentButton) currentButton.click();
    }'''
NEW_CHECKPOINT = '''    doc = frame.contentDocument;
    win = frame.contentWindow;
    const checkpointButton = await waitFor(() => {
      const currentDoc = frame.contentDocument;
      const button = currentDoc && currentDoc.querySelector(`.practice-v341-primary[data-mission-checkpoint-v341="1"]`);
      return button || null;
    }, 4000);
    doc = frame.contentDocument;
    win = frame.contentWindow;
    check("CHECKPOINT_BUTTON_ACTION_BOUND", !!checkpointButton && checkpointButton.dataset.missionCheckpointV341 === "1", checkpointButton ? "mission=" + checkpointButton.dataset.missionCheckpointV341 : "missing");
    if (checkpointButton) checkpointButton.click();'''

OLD_REGRESSION = '''    doc = frame.contentDocument;
    win = frame.contentWindow;
    const regressionOpen = moduleByTitle(doc, "회귀 테스트");
    check("REGRESSION_MODULE_OPENS_AT_60", !!regressionOpen && !regressionOpen.classList.contains("locked") && !regressionOpen.querySelector("button").disabled, regressionOpen ? regressionOpen.className : "missing");
    if (regressionOpen) {
      const currentRegression = moduleByTitle(frame.contentDocument, "회귀 테스트");
      const currentRegressionButton = currentRegression && currentRegression.querySelector("button");
      if (currentRegressionButton) currentRegressionButton.click();
    }'''
NEW_REGRESSION = '''    doc = frame.contentDocument;
    win = frame.contentWindow;
    const regressionOpen = await waitFor(() => {
      const currentDoc = frame.contentDocument;
      const item = currentDoc ? moduleByTitle(currentDoc, "회귀 테스트") : null;
      const button = item && item.querySelector(`button[data-mission-checkpoint-v341="2"]`);
      return item && !item.classList.contains("locked") && button && !button.disabled ? item : null;
    }, 4000);
    doc = frame.contentDocument;
    win = frame.contentWindow;
    const regressionButton = regressionOpen && regressionOpen.querySelector(`button[data-mission-checkpoint-v341="2"]`);
    check("REGRESSION_MODULE_OPENS_AT_60", !!regressionOpen && !!regressionButton, regressionOpen ? regressionOpen.className : "missing");
    if (regressionButton) regressionButton.click();'''


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise RuntimeError(label + " anchor missing")
    return text.replace(old, new, 1)


def patch(text: str) -> str:
    out = text
    out = replace_once(out, OLD_CHECKPOINT, NEW_CHECKPOINT, "checkpoint wait")
    out = replace_once(out, OLD_REGRESSION, NEW_REGRESSION, "regression wait")
    if MARKER not in out:
        anchor = "  // V341_SMOKE_R6_REACQUIRE_CURRENT_CONTROLS"
        if anchor not in out:
            raise RuntimeError("smoke R6 marker missing")
        out = out.replace(anchor, anchor + "\n  // " + MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    errors = []
    required = [
        "const checkpointButton = await waitFor",
        "const regressionOpen = await waitFor",
        'checkpointButton.dataset.missionCheckpointV341 === "1"',
        "const regressionButton = regressionOpen",
        "if (regressionButton) regressionButton.click();",
        "querySelector(`.practice-v341-primary[data-mission-checkpoint-v341=\"1\"]`)",
        "querySelector(`button[data-mission-checkpoint-v341=\"2\"]`)",
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
        print(f"V341_SMOKE_R7_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_SMOKE_R7_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("smoke R7 not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_SMOKE_R7" if errors else "PASS_LEARNING_EXPERIENCE_V341_SMOKE_R7"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

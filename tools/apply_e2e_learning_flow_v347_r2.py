#!/usr/bin/env python3
"""Harden V347 browser-case readiness and semantic focus assertions idempotently."""

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "tools" / "e2e_learning_flow_v347_browser_case.js"

REPLACEMENTS = [
    (
        '    add("REVIEW_DIALOG_FOCUS_RETURNS", doc().activeElement === reviewLauncher, doc().activeElement && `${doc().activeElement.tagName}#${doc().activeElement.id}`);',
        '    const currentReviewLauncher = await requireWait("review focus return", () => {\n'
        '      const current = doc().getElementById("nextActionPrimaryV346");\n'
        '      return current && doc().activeElement === current ? current : null;\n'
        '    }, 2500);\n'
        '    add("REVIEW_DIALOG_FOCUS_RETURNS", !!currentReviewLauncher && doc().activeElement === currentReviewLauncher, doc().activeElement && `${doc().activeElement.tagName}#${doc().activeElement.id}`);',
    ),
    (
        '    clickTopTab("progress");\n'
        '    await requireWait("new-card decision after review", () => win().StudyQualityV346.getNextActionState().kind === "new");\n'
        '    const afterReview = win().StudyQualityV346.getNextActionState();\n'
        '    add("AFTER_REVIEW_RETURNS_TO_SEQUENCE", afterReview.kind === "new" && afterReview.nextIndex === 1, JSON.stringify({ kind: afterReview.kind, next: afterReview.nextIndex }));\n'
        '    doc().getElementById("nextActionPrimaryV346").click();',
        '    clickTopTab("progress");\n'
        '    const nextNewButton = await requireWait("new-card action after review", () => {\n'
        '      const state = win().StudyQualityV346.getNextActionState();\n'
        '      const panel = doc().getElementById("nextActionV346");\n'
        '      const button = doc().getElementById("nextActionPrimaryV346");\n'
        '      return state.kind === "new" && state.nextIndex === 1 && panel && panel.dataset.kind === "new" && button ? button : null;\n'
        '    });\n'
        '    const afterReview = win().StudyQualityV346.getNextActionState();\n'
        '    add("AFTER_REVIEW_RETURNS_TO_SEQUENCE", afterReview.kind === "new" && afterReview.nextIndex === 1, JSON.stringify({ kind: afterReview.kind, next: afterReview.nextIndex }));\n'
        '    nextNewButton.click();',
    ),
    (
        '    add("CHECKPOINT_DIALOG_FOCUS_RETURNS", doc().activeElement === checkpointButton, doc().activeElement && `${doc().activeElement.tagName}.${doc().activeElement.className}`);',
        '    const currentCheckpointButton = await requireWait("checkpoint focus return", () => {\n'
        '      const current = doc().querySelector("[data-mission-checkpoint-v341=\\\'1\\\']");\n'
        '      return current && doc().activeElement === current ? current : null;\n'
        '    }, 2500);\n'
        '    add("CHECKPOINT_DIALOG_FOCUS_RETURNS", !!currentCheckpointButton && doc().activeElement === currentCheckpointButton, doc().activeElement && `${doc().activeElement.tagName}.${doc().activeElement.className}`);',
    ),
]


def transform(text: str) -> tuple[str, int]:
    out = text
    changes = 0
    for old, new in REPLACEMENTS:
        if new in out:
            continue
        if old not in out:
            raise RuntimeError("expected V347 browser-case anchor missing")
        out = out.replace(old, new, 1)
        changes += 1
    return out, changes


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()

    original = TARGET.read_text(encoding="utf-8")
    target, changes = transform(original)
    if args.apply and changes:
        TARGET.write_text(target, encoding="utf-8", newline="\n")

    actual = TARGET.read_text(encoding="utf-8") if args.apply else target
    _, remaining = transform(actual)
    valid = remaining == 0

    print("PATCH_VERSION=v347_r2")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"VALID={valid}")
    if args.check:
        print(f"IDEMPOTENT={valid and changes == 0}")
    if not valid or (args.check and changes != 0):
        print("RESULT=FAIL_E2E_LEARNING_FLOW_V347_R2_PATCH")
        return 1
    print("RESULT=PASS_E2E_LEARNING_FLOW_V347_R2_PATCH")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

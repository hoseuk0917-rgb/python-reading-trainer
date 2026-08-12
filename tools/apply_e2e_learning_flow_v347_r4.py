#!/usr/bin/env python3
"""Add non-mutating review-focus diagnostics to the V347 browser case."""

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "tools" / "e2e_learning_flow_v347_browser_case.js"

OLD = '''    const currentReviewLauncher = doc().getElementById("nextActionPrimaryV346");
    add("REVIEW_DIALOG_FOCUS_RETURNS", !!currentReviewLauncher && doc().activeElement === currentReviewLauncher, doc().activeElement && `${doc().activeElement.tagName}#${doc().activeElement.id}`);'''

NEW = '''    const currentReviewLauncher = doc().getElementById("nextActionPrimaryV346");
    const focusReturned = !!currentReviewLauncher && doc().activeElement === currentReviewLauncher;
    add("REVIEW_DIALOG_FOCUS_RETURNS", focusReturned, doc().activeElement && `${doc().activeElement.tagName}#${doc().activeElement.id}`);
    if (!focusReturned) {
      const progressView = doc().getElementById("progressView");
      const nextPanel = doc().getElementById("nextActionV346");
      const rect = currentReviewLauncher ? currentReviewLauncher.getBoundingClientRect() : null;
      note("REVIEW_FOCUS_CONTEXT", JSON.stringify({
        progressActive: !!(progressView && progressView.classList.contains("active-view")),
        panelKind: nextPanel ? nextPanel.dataset.kind : "",
        buttonConnected: !!(currentReviewLauncher && currentReviewLauncher.isConnected),
        buttonVisible: !!(currentReviewLauncher && visible(currentReviewLauncher)),
        buttonDisabled: !!(currentReviewLauncher && currentReviewLauncher.disabled),
        buttonRect: rect ? [rect.x, rect.y, rect.width, rect.height] : null,
        active: doc().activeElement ? `${doc().activeElement.tagName}#${doc().activeElement.id || ""}` : ""
      }));
      if (currentReviewLauncher) {
        currentReviewLauncher.focus({ preventScroll: true });
        note("REVIEW_MANUAL_FOCUS_PROBE", JSON.stringify({
          accepted: doc().activeElement === currentReviewLauncher,
          active: doc().activeElement ? `${doc().activeElement.tagName}#${doc().activeElement.id || ""}` : ""
        }));
      }
    }'''


def transform(text: str) -> tuple[str, int]:
    if NEW in text:
        return text, 0
    if OLD not in text:
        raise RuntimeError("review-focus diagnostic anchor missing")
    return text.replace(OLD, NEW, 1), 1


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

    print("PATCH_VERSION=v347_r4")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"VALID={valid}")
    if args.check:
        print(f"IDEMPOTENT={valid and changes == 0}")
    if not valid or (args.check and changes != 0):
        print("RESULT=FAIL_E2E_LEARNING_FLOW_V347_R4_PATCH")
        return 1
    print("RESULT=PASS_E2E_LEARNING_FLOW_V347_R4_PATCH")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

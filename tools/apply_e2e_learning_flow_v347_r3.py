#!/usr/bin/env python3
"""Make the V347 checkpoint E2E wait for the rendered V346 action surface."""

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "tools" / "e2e_learning_flow_v347_browser_case.js"

OLD = '''    clickTopTab("progress");
    await requireWait("checkpoint next action", () => {
      const state = win().StudyQualityV346.getNextActionState();
      return state.kind === "checkpoint" && state.pendingCheckpoint === 1 ? state : null;
    });
    const checkpointState = win().StudyQualityV346.getNextActionState();
    add("CARD_30_UNLOCKS_CHECKPOINT_1", checkpointState.kind === "checkpoint" && checkpointState.pendingCheckpoint === 1, JSON.stringify({ kind: checkpointState.kind, pending: checkpointState.pendingCheckpoint, next: checkpointState.nextIndex }));

    doc().getElementById("nextActionPrimaryV346").click();'''

NEW = '''    clickTopTab("progress");
    const checkpointActionButton = await requireWait("checkpoint next action", () => {
      const state = win().StudyQualityV346.getNextActionState();
      const panel = doc().getElementById("nextActionV346");
      const button = doc().getElementById("nextActionPrimaryV346");
      return state.kind === "checkpoint" && state.pendingCheckpoint === 1 && panel && panel.dataset.kind === "checkpoint" && button ? button : null;
    });
    const checkpointState = win().StudyQualityV346.getNextActionState();
    add("CARD_30_UNLOCKS_CHECKPOINT_1", checkpointState.kind === "checkpoint" && checkpointState.pendingCheckpoint === 1, JSON.stringify({ kind: checkpointState.kind, pending: checkpointState.pendingCheckpoint, next: checkpointState.nextIndex }));

    checkpointActionButton.click();'''


def transform(text: str) -> tuple[str, int]:
    if NEW in text:
        return text, 0
    if OLD not in text:
        raise RuntimeError("checkpoint readiness anchor missing")
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

    print("PATCH_VERSION=v347_r3")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"VALID={valid}")
    if args.check:
        print(f"IDEMPOTENT={valid and changes == 0}")
    if not valid or (args.check and changes != 0):
        print("RESULT=FAIL_E2E_LEARNING_FLOW_V347_R3_PATCH")
        return 1
    print("RESULT=PASS_E2E_LEARNING_FLOW_V347_R3_PATCH")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

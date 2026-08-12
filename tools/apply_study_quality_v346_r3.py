#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/pwa/study_progress_v346.js"
PATCH_VERSION = "v346_r3"
OLD = '''  function openLearningCard() {
    goView("learn");
    window.setTimeout(function () {
      const primary = document.querySelector("#learningHomeV343 .home-v343-primary");
      if (primary && visible(primary)) primary.click();
    }, 40);
  }
'''
NEW = '''  function openLearningCard() {
    if (typeof window.openSequentialLearningV343 === "function") {
      window.openSequentialLearningV343();
      return;
    }
    const learnTab = document.querySelector('nav.tabs > .tab-btn[data-view="learn"]');
    if (learnTab) learnTab.click();
    else goView("learn");
  }
'''


def patched_text(text: str) -> str:
    if OLD in text:
        return text.replace(OLD, NEW, 1)
    return text


def validate(text: str) -> tuple[bool, list[str]]:
    errors: list[str] = []
    if OLD in text:
        errors.append("stale fixed-delay learning-card route remains")
    if text.count('typeof window.openSequentialLearningV343 === "function"') != 1:
        errors.append("V343 sequential learning API route must appear exactly once")
    if 'window.openSequentialLearningV343();' not in text:
        errors.append("V343 sequential learning API call missing")
    if 'const learnTab = document.querySelector(\'nav.tabs > .tab-btn[data-view="learn"]\');' not in text:
        errors.append("learn-tab compatibility fallback missing")
    return not errors, errors


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()

    before = TARGET.read_text(encoding="utf-8")
    after = patched_text(before)
    changes = 0 if after == before else 1
    if args.apply and changes:
        TARGET.write_text(after, encoding="utf-8")
    target = after if args.apply else before
    valid, errors = validate(target)

    print(f"PATCH_VERSION={PATCH_VERSION}")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"VALID={valid}")
    if args.check:
        print(f"IDEMPOTENT={changes == 0 and valid}")
    for error in errors:
        print("ERROR=" + error)

    ok = valid and (args.apply or changes == 0)
    print("RESULT=" + ("PASS_STUDY_QUALITY_V346_R3_PATCH" if ok else "FAIL_STUDY_QUALITY_V346_R3_PATCH"))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/pwa/learning_runtime_v348.js"


def replace_once(text: str, old: str, new: str, label: str) -> tuple[str, int]:
    if new in text:
        return text, 0
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected one anchor, found {count}")
    return text.replace(old, new, 1), 1


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    text = TARGET.read_text(encoding="utf-8")
    changes = 0

    old = '''  function refreshLearningSurfaces() {
'''
    new = '''  function cardAttemptedSafe(card) {
    if (!card || !card.id) return false;
    try {
      const progress = typeof loadProgress === "function" ? loadProgress() : { correct: {}, confused: {} };
      return !!((progress.correct && progress.correct[card.id]) || (progress.confused && progress.confused[card.id]));
    } catch (_) {
      return false;
    }
  }

  function refreshLearningSurfaces() {
'''
    text, c = replace_once(text, old, new, "card attempted helper")
    changes += c

    old = '''  function recordAttemptEffects(card, outcome, beforeAttempted) {
'''
    new = '''  function recordAttemptEffects(card, outcome, beforeAttempted, wasAttempted) {
'''
    text, c = replace_once(text, old, new, "attempt effect signature")
    changes += c

    old = '''      if (window.StudyExperienceV345 && typeof window.StudyExperienceV345.recordActivity === "function") {
        const progress = typeof loadProgress === "function" ? loadProgress() : { correct: {}, confused: {} };
        const wasAttempted = Number(beforeAttempted || 0) >= attemptedCountSafe() ? false : !!(
          progress && ((progress.correct && progress.correct[card.id]) || (progress.confused && progress.confused[card.id]))
        );
        window.StudyExperienceV345.recordActivity({
'''
    new = '''      if (window.StudyExperienceV345 && typeof window.StudyExperienceV345.recordActivity === "function") {
        window.StudyExperienceV345.recordActivity({
'''
    text, c = replace_once(text, old, new, "activity snapshot ownership")
    changes += c

    old = '''        const beforeAttempted = attemptedCountSafe();
        window.setTimeout(function () {
          const outcome = choice.classList.contains("correct")
            ? "correct"
            : (choice.classList.contains("wrong") ? "confused" : "");
          if (outcome) recordAttemptEffects(card, outcome, beforeAttempted);
'''
    new = '''        const beforeAttempted = attemptedCountSafe();
        const wasAttempted = cardAttemptedSafe(card);
        window.setTimeout(function () {
          const outcome = choice.classList.contains("correct")
            ? "correct"
            : (choice.classList.contains("wrong") ? "confused" : "");
          if (outcome) recordAttemptEffects(card, outcome, beforeAttempted, wasAttempted);
'''
    text, c = replace_once(text, old, new, "choice attempt snapshot")
    changes += c

    old = '''        const beforeAttempted = attemptedCountSafe();
        window.setTimeout(function () {
          recordAttemptEffects(card, "confused", beforeAttempted);
'''
    new = '''        const beforeAttempted = attemptedCountSafe();
        const wasAttempted = cardAttemptedSafe(card);
        window.setTimeout(function () {
          recordAttemptEffects(card, "confused", beforeAttempted, wasAttempted);
'''
    text, c = replace_once(text, old, new, "again attempt snapshot")
    changes += c

    if args.apply and changes:
        TARGET.write_text(text, encoding="utf-8", newline="\n")

    print("PATCH_VERSION=v348_r2")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print("VALID=True")
    if args.check:
        print(f"IDEMPOTENT={changes == 0}")
        if changes:
            raise SystemExit(1)
    print("RESULT=PASS_LEARNING_RUNTIME_REFACTOR_V348_R2")


if __name__ == "__main__":
    main()

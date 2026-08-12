from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_once(text: str, old: str, new: str, label: str) -> tuple[str, int]:
    if new in text:
        return text, 0
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected one anchor, found {count}")
    return text.replace(old, new, 1), 1


def patch_learning_loop(text: str) -> tuple[str, int]:
    old = '''  function scheduleWrongCard(card) {
    const e = engine();
    if (!e || !card) return;
    saveReviewState(e.scheduleWrong(loadReviewState(), card.id, Date.now()));
    refreshLearningPath();
  }
'''
    new = '''  function scheduleWrongCard(card) {
    // V348 owns lesson-attempt side effects in one delegated event pipeline.
    // Keep the legacy path only as a boot-time fallback if V348 did not load.
    if (window.LearningRuntimeV348) return;
    const e = engine();
    if (!e || !card) return;
    saveReviewState(e.scheduleWrong(loadReviewState(), card.id, Date.now()));
    refreshLearningPath();
  }
'''
    return replace_once(text, old, new, "learning_loop scheduleWrongCard")


def patch_learning_experience(text: str) -> tuple[str, int]:
    changes = 0
    old = '''  function patchAttemptHandlers() {
    if (window.__learningExperienceV341AttemptPatched) return true;
    if (typeof checkAnswer !== "function" || typeof jumpToConfusedOrNext !== "function") return false;
    const originalCheckAnswer = checkAnswer;
    const originalUnsure = jumpToConfusedOrNext;
    checkAnswer = function() {
      const before = attemptedCount();
      const card = typeof getCurrentCard === "function" ? getCurrentCard() : null;
      const result = originalCheckAnswer.apply(this, arguments);
      appendActivity("lesson_attempt", card && card.id);
      const after = attemptedCount();
      maybeToastMilestones(before, after);
      window.setTimeout(function() { renderLearningSummary(); renderPractice(); }, 30);
      return result;
    };
    jumpToConfusedOrNext = function() {
      const before = attemptedCount();
      const card = typeof getCurrentCard === "function" ? getCurrentCard() : null;
      const result = originalUnsure.apply(this, arguments);
      appendActivity("lesson_attempt", card && card.id);
      const after = attemptedCount();
      maybeToastMilestones(before, after);
      window.setTimeout(function() { renderLearningSummary(); renderPractice(); }, 30);
      return result;
    };
    window.__learningExperienceV341AttemptPatched = true;
    return true;
  }
'''
    new = '''  function recordLessonAttempt(cardId, beforeCount) {
    appendActivity("lesson_attempt", cardId || "");
    const after = attemptedCount();
    maybeToastMilestones(Number(beforeCount || 0), after);
    window.setTimeout(function() { renderLearningSummary(); renderPractice(); }, 30);
  }

  function patchAttemptHandlers() {
    // V348 owns the single lesson-attempt event pipeline. V341 now exposes
    // its learning-experience side effect instead of wrapping app handlers.
    if (window.__learningExperienceV341AttemptPatched) return true;
    window.__learningExperienceV341AttemptPatched = true;
    return true;
  }
'''
    text, c = replace_once(text, old, new, "learning_experience attempt wrapper")
    changes += c

    old = '''  window.renderPracticeV341 = renderPractice;
  window.renderLearningSummaryV341 = renderLearningSummary;
})();'''
    new = '''  window.LearningExperienceV341 = Object.freeze({
    version: VERSION,
    recordLessonAttempt: recordLessonAttempt
  });
  window.renderPracticeV341 = renderPractice;
  window.renderLearningSummaryV341 = renderLearningSummary;
})();'''
    text, c = replace_once(text, old, new, "learning_experience API export")
    changes += c
    return text, changes


def patch_study_experience(text: str) -> tuple[str, int]:
    changes = 0
    text, c = replace_once(text, '  let modalReturnFocus = null;\n\n', '', "study_experience modal return state")
    changes += c
    text, c = replace_once(text, '    modalReturnFocus = document.activeElement;\n', '', "study_experience modal opener assignment")
    changes += c

    old = '''    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    const target = actionBox.querySelector("button") || modal.querySelector(".v345-modal-close");
    if (target) target.focus();
  }
'''
    new = '''    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }
'''
    text, c = replace_once(text, old, new, "study_experience open modal focus")
    changes += c

    old = '''  function closeModal() {
    const modal = document.getElementById("studyModalV345");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    const target = modalReturnFocus;
    modalReturnFocus = null;
    if (target && document.contains(target) && typeof target.focus === "function") {
      window.setTimeout(function () { try { target.focus({ preventScroll: true }); } catch (_) { target.focus(); } }, 0);
    }
  }
'''
    new = '''  function closeModal() {
    const modal = document.getElementById("studyModalV345");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }
'''
    text, c = replace_once(text, old, new, "study_experience close modal focus")
    changes += c

    start = text.find('  function visibleDialog() {')
    end = text.find('  function installAnswerActivityHooks() {')
    if start >= 0 and end > start:
        replacement = '''  function enhanceA11y() {
    const result = document.getElementById("resultBox");
    if (result) { result.setAttribute("role", "status"); result.setAttribute("aria-live", "polite"); }
  }

'''
        text = text[:start] + replacement + text[end:]
        changes += 1
    elif 'V348 owns dialog focus' not in text:
        raise RuntimeError("study_experience dialog a11y block anchor missing")

    old = '''  function installAnswerActivityHooks() {
    document.addEventListener("click", function (event) {
      const choice = event.target && event.target.closest ? event.target.closest(".choice-btn") : null;
      if (choice && !choice.disabled) {
        const card = currentCardSafe();
        if (!card) return;
        const p = progressSafe();
        const wasAttempted = !!(p.correct[card.id] || p.confused[card.id]);
        window.setTimeout(function () {
          const outcome = choice.classList.contains("correct") ? "correct" : choice.classList.contains("wrong") ? "confused" : "";
          if (outcome) recordActivity({ cardId: card.id, outcome: outcome, newCard: !wasAttempted });
          if (outcome) revealSupport();
        }, 0);
        return;
      }
      const again = event.target && event.target.closest ? event.target.closest("#againBtn") : null;
      if (again) {
        const card = currentCardSafe();
        if (!card) return;
        const p = progressSafe();
        const wasAttempted = !!(p.correct[card.id] || p.confused[card.id]);
        window.setTimeout(function () {
          recordActivity({ cardId: card.id, outcome: "confused", newCard: !wasAttempted });
          revealSupport();
        }, 0);
      }
    }, true);
  }
'''
    new = '''  function installAnswerActivityHooks() {
    // V348 owns lesson-attempt capture. V345 keeps only the activity API.
    window.__studyExperienceV345AttemptDelegatedToV348 = true;
  }
'''
    text, c = replace_once(text, old, new, "study_experience attempt hooks")
    changes += c

    old = '''    focusEnabled: focusEnabled,
    showSessionSummary: showSessionSummary
  });'''
    new = '''    focusEnabled: focusEnabled,
    showSessionSummary: showSessionSummary,
    recordActivity: recordActivity,
    revealSupport: revealSupport
  });'''
    text, c = replace_once(text, old, new, "study_experience API export")
    changes += c
    return text, changes


def patch_study_progress(text: str) -> tuple[str, int]:
    old = '''  function refresh() {
    renderProgressAction();
    adoptExistingComponents();
  }
'''
    new = '''  function refresh() {
    renderProgressAction();
    // V348 owns shared-component adoption after startup. Retain this only as
    // a boot-time fallback while the final runtime has not loaded yet.
    if (!window.LearningRuntimeV348) adoptExistingComponents();
  }
'''
    return replace_once(text, old, new, "study_progress component adoption")


def patch_index(text: str) -> tuple[str, int]:
    changes = 0
    old = '  <link rel="stylesheet" href="./study_ui_v346.css?v=20260812_v346_a1">\n'
    new = old + '  <link rel="stylesheet" href="./study_ui_v348.css?v=20260812_v348_a1">\n'
    text, c = replace_once(text, old, new, "index V348 CSS")
    changes += c

    old = '  <script src="./study_progress_v346.js?v=20260812_v346_a1"></script>\n  <script src="./learning_flow_hardening_v347.js?v=20260812_v347_a11"></script>\n'
    new = '  <script src="./study_progress_v346.js?v=20260812_v346_a1"></script>\n  <script src="./learning_flow_hardening_v347.js?v=20260812_v347_compat"></script>\n  <script src="./learning_runtime_v348.js?v=20260812_v348_a1"></script>\n'
    text, c = replace_once(text, old, new, "index V348 runtime")
    changes += c
    return text, changes


def compatibility_v347() -> str:
    return '''// === V347 COMPATIBILITY FACADE ===\n(function () {\n  "use strict";\n\n  const VERSION = "v347_compat";\n\n  function runtime() {\n    return window.LearningRuntimeV348 || null;\n  }\n\n  function ensureWrongReview(cardId) {\n    const rt = runtime();\n    if (!rt || typeof rt.recordWrong !== "function" || !cardId) return false;\n    let card = null;\n    try {\n      if (Array.isArray(cards)) card = cards.find(function (row) { return String(row.id || "") === String(cardId); }) || null;\n    } catch (_) {}\n    return card ? rt.recordWrong(card) : false;\n  }\n\n  function focusDialog(modal) {\n    const rt = runtime();\n    return !!(rt && typeof rt.focusDialog === "function" && rt.focusDialog(modal));\n  }\n\n  window.LearningFlowHardeningV347 = Object.freeze({\n    version: VERSION,\n    ensureWrongReview: ensureWrongReview,\n    focusDialog: focusDialog\n  });\n  document.documentElement.dataset.learningFlowV347 = VERSION;\n})();\n'''


def patch_file(path: str, patcher, apply: bool) -> int:
    file_path = ROOT / path
    source = file_path.read_text(encoding="utf-8")
    target, changes = patcher(source)
    if apply and target != source:
        file_path.write_text(target, encoding="utf-8", newline="\n")
    return changes


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    total = 0
    total += patch_file("src/pwa/learning_loop_v340.js", patch_learning_loop, args.apply)
    total += patch_file("src/pwa/learning_experience_v341.js", patch_learning_experience, args.apply)
    total += patch_file("src/pwa/study_experience_v345.js", patch_study_experience, args.apply)
    total += patch_file("src/pwa/study_progress_v346.js", patch_study_progress, args.apply)
    total += patch_file("src/pwa/index.html", patch_index, args.apply)

    v347_path = ROOT / "src/pwa/learning_flow_hardening_v347.js"
    current_v347 = v347_path.read_text(encoding="utf-8")
    target_v347 = compatibility_v347()
    if current_v347 != target_v347:
        total += 1
        if args.apply:
            v347_path.write_text(target_v347, encoding="utf-8", newline="\n")

    print("PATCH_VERSION=v348_a1")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={total}")
    print("VALID=True")
    if args.check:
        print(f"IDEMPOTENT={total == 0}")
        if total != 0:
            raise SystemExit(1)
    print("RESULT=PASS_LEARNING_RUNTIME_REFACTOR_V348")


if __name__ == "__main__":
    main()

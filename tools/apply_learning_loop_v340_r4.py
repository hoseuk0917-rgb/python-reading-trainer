from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src" / "pwa" / "app.js"
CASE = ROOT / "tools" / "learning_loop_v340_browser_case.html"

OLD_RESET = '''function resetProgress() {\n  const ok = confirm("진도만 초기화합니다. 메모는 유지됩니다. 계속할까요?");\n  if (!ok) {\n    return;\n  }\n  localStorage.removeItem(progressKey);\n  renderCard();\n  renderProgress();\n}'''

NEW_RESET = '''function resetProgress() {\n  const ok = confirm("학습 진도와 복습 일정을 초기화합니다. 메모는 유지됩니다. 계속할까요?");\n  if (!ok) {\n    return;\n  }\n\n  localStorage.removeItem(progressKey);\n  localStorage.removeItem("python-reading-trainer-review-v340");\n  localStorage.removeItem("python-reading-trainer-session-v340");\n  try {\n    sessionStorage.removeItem("python-reading-trainer-attempts-v340");\n  } catch (_) {}\n\n  currentIndex = 0;\n  renderCard();\n  renderProgress();\n\n  if (typeof window !== "undefined" && typeof window.refreshLearningPathV340 === "function") {\n    window.refreshLearningPathV340();\n  }\n}'''

OLD_LOOP_EXPORT = '''    document.documentElement.dataset.learningLoopV340 = VERSION;\n    return true;'''
NEW_LOOP_EXPORT = '''    window.refreshLearningPathV340 = refreshLearningPath;\n    document.documentElement.dataset.learningLoopV340 = VERSION;\n    return true;'''

OLD_CASE_END = '''    check("LEGACY_TITLE_DECLARATIVE", /순차 진도와 별개|separate from sequential progress/i.test(legacy.querySelector(".study-tools-title").textContent), legacy.querySelector(".study-tools-title").textContent);\n\n    try { win.eval("renderCard(); renderCard();"); } catch (_) {}'''

NEW_CASE_END = '''    check("LEGACY_TITLE_DECLARATIVE", /순차 진도와 별개|separate from sequential progress/i.test(legacy.querySelector(".study-tools-title").textContent), legacy.querySelector(".study-tools-title").textContent);\n\n    win.confirm = function() { return true; };\n    const resetBtn = doc.getElementById("resetBtn");\n    check("RESET_BUTTON_PRESENT", !!resetBtn, resetBtn ? "present" : "missing");\n    if (resetBtn) resetBtn.click();\n    await sleep(180);\n    const resetNext = nextStat(doc);\n    const resetDue = Number(path.querySelector("[data-role='review'] strong").textContent.trim());\n    const resetSessionCount = path.querySelectorAll("[data-role='session'] button").length;\n    const reviewRaw = win.localStorage.getItem("python-reading-trainer-review-v340");\n    const sessionRaw = win.localStorage.getItem("python-reading-trainer-session-v340");\n    const attemptRaw = win.sessionStorage.getItem("python-reading-trainer-attempts-v340");\n    check("RESET_RETURNS_TO_FIRST_CARD", doc.getElementById("cardTitle").textContent.trim() === firstTitle, "title=" + doc.getElementById("cardTitle").textContent.trim());\n    check("RESET_RETURNS_SEQUENCE_TO_FIRST", /^1\\s*\\/\\s*1785$/.test(resetNext), "next=" + resetNext);\n    check("RESET_CLEARS_DUE_REVIEWS", resetDue === 0, "due=" + resetDue);\n    check("RESET_CLEARS_TODAY_SESSION", resetSessionCount === 0, "count=" + resetSessionCount);\n    check("RESET_CLEARS_REVIEW_STORAGE", reviewRaw === null, "value=" + String(reviewRaw));\n    check("RESET_CLEARS_SESSION_STORAGE", sessionRaw === null && attemptRaw === null, "session=" + String(sessionRaw) + " attempt=" + String(attemptRaw));\n\n    try { win.eval("renderCard(); renderCard();"); } catch (_) {}'''


def replace_once(text: str, old: str, new: str, name: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise RuntimeError(f"{name}_NOT_FOUND")
    return text.replace(old, new, 1)


def transform_app(text: str) -> str:
    return replace_once(text, OLD_RESET, NEW_RESET, "RESET_PROGRESS")


def transform_loop(text: str) -> str:
    return replace_once(text, OLD_LOOP_EXPORT, NEW_LOOP_EXPORT, "LOOP_REFRESH_EXPORT")


def transform_case(text: str) -> str:
    return replace_once(text, OLD_CASE_END, NEW_CASE_END, "CASE_RESET_AUDIT")


def process(path: Path, transform, apply: bool) -> bool:
    old = path.read_text(encoding="utf-8")
    new = transform(old)
    changed = old != new
    if apply and changed:
        path.write_text(new, encoding="utf-8", newline="\n")
    return changed


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    targets = [
        (APP, transform_app, "APP"),
        (ROOT / "src" / "pwa" / "learning_loop_v340.js", transform_loop, "LOOP"),
        (CASE, transform_case, "CASE"),
    ]
    dirty = 0
    for path, transform, label in targets:
        changed = process(path, transform, args.apply)
        if args.apply:
            print(f"V340_R4_{label}_CHANGED={changed}")
        else:
            clean = not changed
            print(f"V340_R4_{label}_IDEMPOTENT={clean}")
            dirty += 0 if clean else 1

    if args.check:
        print(f"ERRORS={dirty}")
        if dirty:
            print("RESULT=FAIL_LEARNING_LOOP_V340_R4_CHECK")
            return 1
        print("RESULT=PASS_LEARNING_LOOP_V340_R4_CHECK")
    else:
        print("RESULT=PASS_LEARNING_LOOP_V340_R4_APPLY")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

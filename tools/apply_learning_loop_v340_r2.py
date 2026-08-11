from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src" / "pwa" / "learning_loop_v340.js"

OLD_TOGGLE = '''  function toggleLegacyTools() {\n    const panel = document.getElementById("studyToolsV7");\n    if (!panel) return;\n    const hidden = panel.classList.toggle("v340-legacy-hidden");\n    localStorage.setItem(LEGACY_PANEL_KEY, hidden ? "hidden" : "shown");\n  }'''

NEW_TOGGLE = '''  function syncLegacyToolsVisibility() {\n    const panel = document.getElementById("studyToolsV7");\n    if (!panel) return false;\n    const state = localStorage.getItem(LEGACY_PANEL_KEY);\n    panel.classList.toggle("v340-legacy-hidden", state !== "shown");\n\n    const title = panel.querySelector(".study-tools-title");\n    if (title) {\n      title.textContent = t("검색·필터 · 순차 진도와 별개", "Search & filters · separate from sequential progress");\n    }\n    return true;\n  }\n\n  function watchLegacyToolsVisibility() {\n    if (window.__learningLoopV340LegacyWatch) return;\n    window.__learningLoopV340LegacyWatch = true;\n\n    if (syncLegacyToolsVisibility()) return;\n\n    let attempts = 0;\n    const timer = window.setInterval(function() {\n      attempts += 1;\n      if (syncLegacyToolsVisibility() || attempts >= 80) {\n        window.clearInterval(timer);\n      }\n    }, 100);\n  }\n\n  function toggleLegacyTools() {\n    const panel = document.getElementById("studyToolsV7");\n    if (!panel) {\n      watchLegacyToolsVisibility();\n      return;\n    }\n    const currentlyHidden = panel.classList.contains("v340-legacy-hidden");\n    localStorage.setItem(LEGACY_PANEL_KEY, currentlyHidden ? "shown" : "hidden");\n    syncLegacyToolsVisibility();\n  }'''

OLD_REFRESH_END = '''    reviewBtn.onclick = function() { if (due[0]) openReview(due[0]); };\n    renderSessionList(box.querySelector("[data-role='session']"));\n  }'''

NEW_REFRESH_END = '''    reviewBtn.onclick = function() { if (due[0]) openReview(due[0]); };\n    renderSessionList(box.querySelector("[data-role='session']"));\n    syncLegacyToolsVisibility();\n  }'''

OLD_INJECT_LEGACY = '''    const legacy = document.getElementById("studyToolsV7");\n    if (legacy && localStorage.getItem(LEGACY_PANEL_KEY) !== "shown") legacy.classList.add("v340-legacy-hidden");\n    refreshLearningPath();'''

NEW_INJECT_LEGACY = '''    syncLegacyToolsVisibility();\n    watchLegacyToolsVisibility();\n    refreshLearningPath();'''

OLD_CONFUSED_END = '''      refreshLearningPath();\n      return result;\n    };\n\n    const originalRender = renderCard;'''

NEW_CONFUSED_END = '''      refreshLearningPath();\n      return result;\n    };\n\n    const againBtn = document.getElementById("againBtn");\n    if (againBtn) {\n      // app.js binds the original function object before this enhancement loads.\n      // Rebind the onclick property so the V340 wrapper actually runs.\n      againBtn.onclick = jumpToConfusedOrNext;\n    }\n\n    const originalRender = renderCard;'''

OLD_STYLE = '''      #studyToolsV7.v340-legacy-hidden { display:none !important; }'''
NEW_STYLE = '''      #studyToolsV7.v340-legacy-hidden { display:none !important; }\n      #studyToolsV7 #studyToolsQuickV272, #studyToolsV7 #studyToolsToday { display:none !important; }'''


def transform(text: str) -> str:
    replacements = [
        (OLD_TOGGLE, NEW_TOGGLE, "LEGACY_TOGGLE_ANCHOR"),
        (OLD_REFRESH_END, NEW_REFRESH_END, "REFRESH_END_ANCHOR"),
        (OLD_INJECT_LEGACY, NEW_INJECT_LEGACY, "INJECT_LEGACY_ANCHOR"),
        (OLD_CONFUSED_END, NEW_CONFUSED_END, "CONFUSED_REBIND_ANCHOR"),
        (OLD_STYLE, NEW_STYLE, "LEGACY_STYLE_ANCHOR"),
    ]
    out = text
    for old, new, name in replacements:
        if new in out:
            continue
        if old not in out:
            raise RuntimeError(f"{name}_NOT_FOUND")
        out = out.replace(old, new, 1)
    return out


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    old = TARGET.read_text(encoding="utf-8")
    new = transform(old)

    if args.check:
        clean = old == new
        print(f"V340_R2_IDEMPOTENT={clean}")
        print(f"ERRORS={0 if clean else 1}")
        if not clean:
            print("ERROR=V340_R2_NOT_APPLIED_OR_NOT_IDEMPOTENT")
            return 1
        print("RESULT=PASS_LEARNING_LOOP_V340_R2_CHECK")
        return 0

    changed = old != new
    if changed:
        TARGET.write_text(new, encoding="utf-8", newline="\n")
    print(f"V340_R2_CHANGED={changed}")
    print("RESULT=PASS_LEARNING_LOOP_V340_R2_APPLY")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

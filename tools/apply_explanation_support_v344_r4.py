from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src" / "pwa" / "explanation_support_v344.js"
VERSION = "v344_explanation_support_r4"

VERSION_OLD = 'const VERSION = "v344_explanation_support_r3";'
VERSION_NEW = f'const VERSION = "{VERSION}";'

OLD_BLOCK = '''    window.setTimeout(function () {\n      if (focus && typeof focus.focus === "function" && document.contains(focus)) {\n        focus.focus();\n        return;\n      }\n      if (termId) {\n        const fallback = document.querySelector('.explanation-term-v344[data-term="' + CSS.escape(termId) + '"]');\n        if (fallback && typeof fallback.focus === "function") fallback.focus();\n      }\n    }, 0);'''

NEW_BLOCK = '''    const active = document.activeElement;\n    if (active && modal.contains(active) && typeof active.blur === "function") active.blur();\n    const restoreFocus = function () {\n      let candidate = focus && document.contains(focus) ? focus : null;\n      if (!candidate && termId) {\n        candidate = document.querySelector('.explanation-term-v344[data-term="' + CSS.escape(termId) + '"]');\n      }\n      if (!candidate || typeof candidate.focus !== "function") return;\n      if (document.activeElement === candidate) return;\n      try { candidate.focus({ preventScroll: true }); }\n      catch (_) { candidate.focus(); }\n    };\n    restoreFocus();\n    if (typeof queueMicrotask === "function") queueMicrotask(restoreFocus);\n    if (typeof window.requestAnimationFrame === "function") {\n      window.requestAnimationFrame(function () {\n        restoreFocus();\n        window.setTimeout(restoreFocus, 0);\n      });\n    } else {\n      window.setTimeout(restoreFocus, 0);\n    }'''


def transform(text: str) -> tuple[str, int]:
    changes = 0
    if VERSION_NEW not in text:
        if VERSION_OLD not in text:
            raise RuntimeError("R3 version anchor not found")
        text = text.replace(VERSION_OLD, VERSION_NEW, 1)
        changes += 1
    if NEW_BLOCK not in text:
        if OLD_BLOCK not in text:
            raise RuntimeError("R3 focus block anchor not found")
        text = text.replace(OLD_BLOCK, NEW_BLOCK, 1)
        changes += 1
    return text, changes


def validate(text: str) -> bool:
    required = [
        VERSION_NEW,
        'modal.contains(active)',
        'const restoreFocus = function ()',
        'queueMicrotask(restoreFocus)',
        'window.requestAnimationFrame(function ()',
        'candidate.focus({ preventScroll: true })',
    ]
    return all(item in text for item in required)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    original = TARGET.read_text(encoding="utf-8")
    updated, changes = transform(original)
    if args.apply and changes:
        TARGET.write_text(updated, encoding="utf-8")
    final = updated if args.apply else original
    ok = validate(final)
    idempotent = changes == 0 if args.check else True

    print("PATCH_VERSION=v344_explanation_support_r4")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"VALID={ok}")
    if args.check:
        print(f"IDEMPOTENT={idempotent}")
    if not ok or (args.check and not idempotent):
        raise SystemExit("RESULT=FAIL_EXPLANATION_SUPPORT_V344_R4")
    print("RESULT=PASS_EXPLANATION_SUPPORT_V344_R4")


if __name__ == "__main__":
    main()

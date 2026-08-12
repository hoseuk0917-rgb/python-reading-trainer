from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src" / "pwa" / "study_experience_v345.js"
VERSION = "v345_r2"

ORDER_ANCHOR = '''    ["outline", "notes"].forEach(function (view) {\n      const btn = nav.querySelector('.tab-btn[data-view="' + view + '"]');\n      if (btn) btn.classList.add("v345-secondary-tab");\n    });\n\n    const wrap = document.createElement("div");'''
ORDER_NEW = '''    ["outline", "notes"].forEach(function (view) {\n      const btn = nav.querySelector('.tab-btn[data-view="' + view + '"]');\n      if (btn) btn.classList.add("v345-secondary-tab");\n    });\n    ["learn", "practice", "progress", "outline", "notes"].forEach(function (view) {\n      const btn = nav.querySelector('.tab-btn[data-view="' + view + '"]');\n      if (btn) nav.appendChild(btn);\n    });\n\n    const wrap = document.createElement("div");'''


def transform(text: str) -> tuple[str, int]:
    changes = 0
    if ORDER_NEW not in text:
        if ORDER_ANCHOR not in text:
            raise RuntimeError("navigation order anchor not found")
        text = text.replace(ORDER_ANCHOR, ORDER_NEW, 1)
        changes += 1
    if "min-height:40px" in text:
        text = text.replace("min-height:40px", "min-height:44px")
        changes += 1
    return text, changes


def validate(text: str) -> bool:
    return (
        ORDER_NEW in text
        and "min-height:40px" not in text
        and text.count("min-height:44px") >= 2
    )


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--apply", action="store_true")
    p.add_argument("--check", action="store_true")
    args = p.parse_args()
    if args.apply == args.check:
        p.error("choose exactly one of --apply or --check")

    raw = TARGET.read_text(encoding="utf-8")
    updated, changes = transform(raw)
    if args.apply and changes:
        TARGET.write_text(updated, encoding="utf-8")
    final = updated if args.apply else raw
    ok = validate(final)
    idempotent = changes == 0 if args.check else True

    print("PATCH_VERSION=v345_r2")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"VALID={ok}")
    if args.check:
        print(f"IDEMPOTENT={idempotent}")
    if not ok or (args.check and not idempotent):
        raise SystemExit("RESULT=FAIL_STUDY_EXPERIENCE_V345_R2_PATCH")
    print("RESULT=PASS_STUDY_EXPERIENCE_V345_R2_PATCH")


if __name__ == "__main__":
    main()

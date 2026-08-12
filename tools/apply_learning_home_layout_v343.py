from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src" / "pwa" / "learning_home_v343.js"
MARKER = "/* V343_SIDE_CARD_OVERFLOW_GUARD */"
ANCHOR = "      #learnView.v343-quiz-mode #learningPathV340 { display:none !important; }\n"
PATCH = """      /* V343_SIDE_CARD_OVERFLOW_GUARD */
      #learnView .side,
      #learnView #sideCards,
      #learnView .side-card,
      #learnView .side-card-body,
      #learnView .side-card-detail,
      #learnView .external-resource-card {
        min-width:0;
        max-width:100%;
        overflow-wrap:anywhere;
        word-break:break-word;
      }
"""


def transform(text: str) -> tuple[str, bool]:
    if MARKER in text:
        return text, False
    if ANCHOR not in text:
        raise SystemExit("V343_LAYOUT_ANCHOR_NOT_FOUND")
    return text.replace(ANCHOR, ANCHOR + PATCH, 1), True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        raise SystemExit("choose exactly one of --apply/--check")

    raw = TARGET.read_text(encoding="utf-8")
    updated, changed = transform(raw)
    if args.apply and changed:
        TARGET.write_text(updated, encoding="utf-8")
    final = updated if args.apply else raw

    marker_count = final.count(MARKER)
    has_wrap = "overflow-wrap:anywhere" in final and "word-break:break-word" in final
    ok = marker_count == 1 and has_wrap
    if args.check:
        ok = ok and not changed

    print("PATCH_VERSION=v343_learning_home_layout_a1")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={1 if changed else 0}")
    print(f"MARKER_COUNT={marker_count}")
    print(f"SAFE_WRAP_PRESENT={has_wrap}")
    if args.check:
        print(f"IDEMPOTENT={not changed}")
    print("RESULT=" + ("PASS_LEARNING_HOME_LAYOUT_V343" if ok else "FAIL_LEARNING_HOME_LAYOUT_V343"))
    if not ok:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

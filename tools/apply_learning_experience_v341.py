#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "src" / "pwa" / "index.html"
VERSION = "v341_a1"

TAB = '    <button class="tab-btn" data-view="practice">실전</button>\n'
VIEW = '''\n  <main id="practiceView" class="wide view">\n    <section class="panel">\n      <div id="practiceDashboardV341"></div>\n    </section>\n  </main>\n\n'''
ENGINE_TAG = '  <script src="./learning_engine_v341.js?v=20260812_v341_a1"></script>\n'
UI_TAG = '  <script src="./learning_experience_v341.js?v=20260812_v341_a1"></script>\n'


def patched(text: str) -> str:
    out = text
    if 'data-view="practice"' not in out:
        anchor = '    <button class="tab-btn" data-view="progress">진행현황</button>\n'
        if anchor not in out:
            raise RuntimeError("practice tab anchor missing")
        out = out.replace(anchor, anchor + TAB, 1)

    if 'id="practiceView"' not in out:
        anchor = '  <main id="notesView" class="wide view">\n'
        if anchor not in out:
            raise RuntimeError("practice view anchor missing")
        out = out.replace(anchor, VIEW + anchor, 1)

    if 'learning_engine_v341.js' not in out:
        anchor = '  <script src="./learning_loop_v340.js?v=20260812_v340_a1"></script>\n'
        if anchor not in out:
            raise RuntimeError("V340 script anchor missing")
        out = out.replace(anchor, anchor + ENGINE_TAG + UI_TAG, 1)

    return out


def audit(text: str) -> list[str]:
    errors: list[str] = []
    if text.count('data-view="practice"') != 1:
        errors.append("practice tab count")
    if text.count('id="practiceView"') != 1:
        errors.append("practice view count")
    if text.count('id="practiceDashboardV341"') != 1:
        errors.append("practice dashboard count")
    if text.count('learning_engine_v341.js') != 1:
        errors.append("V341 engine tag count")
    if text.count('learning_experience_v341.js') != 1:
        errors.append("V341 UI tag count")
    try:
        app = text.index('./app.js?')
        e340 = text.index('./learning_engine_v340.js?')
        l340 = text.index('./learning_loop_v340.js?')
        e341 = text.index('./learning_engine_v341.js?')
        u341 = text.index('./learning_experience_v341.js?')
        if not (app < e340 < l340 < e341 < u341):
            errors.append("script order")
    except ValueError:
        errors.append("script anchor missing")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--apply", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()

    original = INDEX.read_text(encoding="utf-8-sig")
    target = patched(original)
    changed = int(target != original)

    if args.apply and changed:
        INDEX.write_text(target, encoding="utf-8")

    final = target if args.apply else original
    errors = audit(final)

    if args.check:
        idempotent = patched(original) == original
        print(f"V341_INDEX_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("index not integrated/idempotent")
    else:
        print(f"V341_INDEX_CHANGED={changed}")

    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_INTEGRATION" if errors else "PASS_LEARNING_EXPERIENCE_V341_INTEGRATION"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

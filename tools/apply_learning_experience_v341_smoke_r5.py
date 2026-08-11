#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "tools" / "learning_experience_v341_browser_case.html"
VERSION = "v341_smoke_r5"
MARKER = "V341_SMOKE_R5_CURRENT_IFRAME_CONTEXT"

REPLACEMENTS = [
    (
'''    let mission = await waitFor(() => {
      const modal = doc.getElementById("missionModalV341");
      return modal && !modal.classList.contains("hidden") ? modal : null;
    }, 3000);''',
'''    let mission = await waitFor(() => {
      const currentDoc = frame.contentDocument;
      const modal = currentDoc && currentDoc.getElementById("missionModalV341");
      return modal && !modal.classList.contains("hidden") ? modal : null;
    }, 3000);
    doc = frame.contentDocument;
    win = frame.contentWindow;'''),
    (
'''        if (typeof win.openPracticeMissionV341 === "function") {
          win.openPracticeMissionV341(1);
        }''',
'''        win = frame.contentWindow;
        doc = frame.contentDocument;
        if (win && typeof win.openPracticeMissionV341 === "function") {
          win.openPracticeMissionV341(1);
        }'''),
    (
'''      mission = await waitFor(() => {
        const modal = doc.getElementById("missionModalV341");
        return modal && !modal.classList.contains("hidden") ? modal : null;
      }, 1200);''',
'''      mission = await waitFor(() => {
        const currentDoc = frame.contentDocument;
        const modal = currentDoc && currentDoc.getElementById("missionModalV341");
        return modal && !modal.classList.contains("hidden") ? modal : null;
      }, 1200);
      doc = frame.contentDocument;
      win = frame.contentWindow;'''),
    (
'''    const regressionMission = await waitFor(() => {
      const modal = doc.getElementById("missionModalV341");
      return modal && !modal.classList.contains("hidden") ? modal : null;
    }, 3000);''',
'''    const regressionMission = await waitFor(() => {
      const currentDoc = frame.contentDocument;
      const modal = currentDoc && currentDoc.getElementById("missionModalV341");
      return modal && !modal.classList.contains("hidden") ? modal : null;
    }, 3000);
    doc = frame.contentDocument;
    win = frame.contentWindow;
    root = doc.documentElement;'''),
    (
'''    win.localStorage.setItem(NOTE_SENTINEL, "keep-me");
    win.confirm = function() { return true; };
    clickTab(doc, "learning");''',
'''    doc = frame.contentDocument;
    win = frame.contentWindow;
    root = doc.documentElement;
    win.localStorage.setItem(NOTE_SENTINEL, "keep-me");
    win.confirm = function() { return true; };
    clickTab(doc, "learning");'''),
    (
'''    const resetStateCleared = await waitFor(() => win.localStorage.getItem(V341_KEY) === null ? true : null, 4000);''',
'''    const resetStateCleared = await waitFor(() => {
      const currentWin = frame.contentWindow;
      return currentWin && currentWin.localStorage.getItem(V341_KEY) === null ? true : null;
    }, 4000);
    doc = frame.contentDocument;
    win = frame.contentWindow;
    root = doc.documentElement;'''),
    (
'''    const visiblePractice = await waitFor(() => {
      const view = doc.getElementById("practiceView");''',
'''    const visiblePractice = await waitFor(() => {
      const currentDoc = frame.contentDocument;
      const view = currentDoc && currentDoc.getElementById("practiceView");'''),
]


def patch(text: str) -> str:
    out = text
    for old, new in REPLACEMENTS:
        if new in out:
            continue
        if old not in out:
            raise RuntimeError("current iframe context anchor missing: " + old[:80])
        out = out.replace(old, new, 1)
    if MARKER not in out:
        anchor = "  // V341_SMOKE_R4_RUNTIME_TRACE_REPORT"
        if anchor not in out:
            raise RuntimeError("smoke R4 marker missing")
        out = out.replace(anchor, anchor + "\n  // " + MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    required = [
        "const currentDoc = frame.contentDocument;",
        "const currentWin = frame.contentWindow;",
        "doc = frame.contentDocument;",
        "win = frame.contentWindow;",
        MARKER,
    ]
    return ["missing:" + value for value in required if value not in text]


def main() -> int:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--apply", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()
    before = CASE.read_text(encoding="utf-8-sig")
    after = patch(before)
    changed = int(after != before)
    if args.apply and changed:
        CASE.write_text(after, encoding="utf-8")
    final = after if args.apply else before
    errors = audit(final)
    print(f"PATCH_VERSION={VERSION}")
    if args.apply:
        print(f"V341_SMOKE_R5_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_SMOKE_R5_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("smoke R5 not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_SMOKE_R5" if errors else "PASS_LEARNING_EXPERIENCE_V341_SMOKE_R5"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

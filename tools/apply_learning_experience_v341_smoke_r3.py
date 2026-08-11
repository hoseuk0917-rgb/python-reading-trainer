#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "tools" / "learning_experience_v341_browser_case.html"
VERSION = "v341_smoke_r3"
MARKER = "V341_SMOKE_R3_MISSION_DIRECT_DIAGNOSTIC"

OLD = '''    const mission = await waitFor(() => {
      const modal = doc.getElementById("missionModalV341");
      return modal && !modal.classList.contains("hidden") ? modal : null;
    }, 3000);
    const question = mission ? mission.querySelector(".mission-v341-question").textContent.trim() : "";
    check("CHECKPOINT_MISSION_OPENS", !!mission, mission ? "open" : "missing");
    check("CHECKPOINT_1_IS_SAFE_CHANGE", /작은 기능을 수정한 뒤/.test(question), question);'''

NEW = '''    let mission = await waitFor(() => {
      const modal = doc.getElementById("missionModalV341");
      return modal && !modal.classList.contains("hidden") ? modal : null;
    }, 3000);
    const delegatedMissionOpened = !!mission;
    let directMissionError = "";
    if (!mission) {
      try {
        if (typeof win.openPracticeMissionV341 === "function") {
          win.openPracticeMissionV341(1);
        }
      } catch (error) {
        directMissionError = error && error.stack ? error.stack : String(error);
      }
      mission = await waitFor(() => {
        const modal = doc.getElementById("missionModalV341");
        return modal && !modal.classList.contains("hidden") ? modal : null;
      }, 1200);
    }
    const question = mission ? mission.querySelector(".mission-v341-question").textContent.trim() : "";
    check("CHECKPOINT_MISSION_OPENS", delegatedMissionOpened, delegatedMissionOpened ? "delegated click open" : "delegated click missing");
    check("MISSION_DIRECT_EXPORT_PRESENT", typeof win.openPracticeMissionV341 === "function", "type=" + typeof win.openPracticeMissionV341);
    check("MISSION_DIRECT_CALL_DIAGNOSTIC", !!mission || !!directMissionError, mission ? "direct path can open modal" : (directMissionError || "no modal and no thrown error"));
    if (directMissionError) lines.push("MISSION_DIRECT_ERROR=" + directMissionError.replace(/\\s+/g, " "));
    check("CHECKPOINT_1_IS_SAFE_CHANGE", /작은 기능을 수정한 뒤/.test(question), question);'''


def patch(text: str) -> str:
    out = text
    if NEW not in out:
        if OLD not in out:
            raise RuntimeError("mission diagnostic anchor missing")
        out = out.replace(OLD, NEW, 1)
    if MARKER not in out:
        anchor = "  // V341_SMOKE_R2_ASYNC_STATE_WAIT"
        if anchor not in out:
            raise RuntimeError("smoke R2 marker missing")
        out = out.replace(anchor, anchor + "\n  // " + MARKER, 1)
    return out


def audit(text: str) -> list[str]:
    errors = []
    for value in ("delegatedMissionOpened", "MISSION_DIRECT_EXPORT_PRESENT", "MISSION_DIRECT_CALL_DIAGNOSTIC", "MISSION_DIRECT_ERROR", MARKER):
        if value not in text:
            errors.append("missing: " + value)
    return errors


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
        print(f"V341_SMOKE_R3_CHANGED={changed}")
    else:
        idempotent = patch(before) == before
        print(f"V341_SMOKE_R3_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("smoke R3 not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_SMOKE_R3" if errors else "PASS_LEARNING_EXPERIENCE_V341_SMOKE_R3"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / "src" / "pwa" / "learning_engine_v341.js"
UI = ROOT / "src" / "pwa" / "learning_experience_v341.js"
VERSION = "v341_r2"
MARKER = "LEARNING_EXPERIENCE_V341_R2_EXACT_MISSION_MAPPING"

MODULE_REPLACEMENTS = {
    '{ id: "safe_change", threshold: 30,': '{ id: "safe_change", threshold: 30, missionCheckpoint: 1,',
    '{ id: "regression", threshold: 60,': '{ id: "regression", threshold: 60, missionCheckpoint: 2,',
    '{ id: "idempotence", threshold: 90,': '{ id: "idempotence", threshold: 90, missionCheckpoint: 3,',
    '{ id: "test_layers", threshold: 120,': '{ id: "test_layers", threshold: 120, missionCheckpoint: 4,',
    '{ id: "git_review", threshold: 150,': '{ id: "git_review", threshold: 150, missionCheckpoint: 6,',
    '{ id: "ci_gate", threshold: 180,': '{ id: "ci_gate", threshold: 180, missionCheckpoint: 7,',
    '{ id: "reproducibility", threshold: 240,': '{ id: "reproducibility", threshold: 240, missionCheckpoint: 8,',
    '{ id: "baseline_rollback", threshold: 300,': '{ id: "baseline_rollback", threshold: 300, missionCheckpoint: 9,',
}

OLD_INTRO_KO = "Python 순차 학습에서 실제로 쌓인 진도만큼 개발 절차·테스트·리뷰 미션이 열립니다. 점수나 배지가 아니라, 어떤 사고를 실제로 통과했는지를 기록합니다."
NEW_INTRO_KO = "Python 순차 학습에서 실제로 쌓인 진도만큼 개발 절차·테스트·리뷰 미션이 열립니다. 어떤 개발 사고를 실제로 이해하고 통과했는지를 기록합니다."
OLD_INTRO_EN = "Developer workflow, testing, and review missions unlock from actual sequential-learning progress. This records demonstrated reasoning rather than points or badges."
NEW_INTRO_EN = "Developer workflow, testing, and review missions unlock from actual sequential-learning progress. The record shows which developer reasoning skills you have actually demonstrated."

OLD_MAPPING = '''      button.onclick = function() {
        const checkpoint = Math.max(1, Math.ceil(module.threshold / engine().CHECKPOINT_INTERVAL));
        openMission(checkpoint + index);
      };'''
NEW_MAPPING = '''      button.onclick = function() {
        openMission(Number(module.missionCheckpoint || 1));
      };'''


def patch_engine(text: str) -> str:
    out = text
    for old, new in MODULE_REPLACEMENTS.items():
        if new in out:
            continue
        if old not in out:
            raise RuntimeError("engine module anchor missing: " + old)
        out = out.replace(old, new, 1)
    if MARKER not in out:
        out = out.replace('  const VERSION = "v341_a1";', '  const VERSION = "v341_a1";\n  // ' + MARKER, 1)
    return out


def patch_ui(text: str) -> str:
    out = text
    if OLD_INTRO_KO in out:
        out = out.replace(OLD_INTRO_KO, NEW_INTRO_KO, 1)
    elif NEW_INTRO_KO not in out:
        raise RuntimeError("KO intro anchor missing")
    if OLD_INTRO_EN in out:
        out = out.replace(OLD_INTRO_EN, NEW_INTRO_EN, 1)
    elif NEW_INTRO_EN not in out:
        raise RuntimeError("EN intro anchor missing")
    if OLD_MAPPING in out:
        out = out.replace(OLD_MAPPING, NEW_MAPPING, 1)
    elif NEW_MAPPING not in out:
        raise RuntimeError("mission mapping anchor missing")
    if MARKER not in out:
        out = out.replace('  const VERSION = "v341_a1";', '  const VERSION = "v341_a1";\n  // ' + MARKER, 1)
    return out


def audit(engine: str, ui: str) -> list[str]:
    errors: list[str] = []
    for _, new in MODULE_REPLACEMENTS.items():
        if new not in engine:
            errors.append("missing exact mission mapping: " + new)
    if NEW_MAPPING not in ui:
        errors.append("UI exact mission mapping missing")
    if OLD_INTRO_KO in ui or OLD_INTRO_EN in ui:
        errors.append("user-facing badge/points wording remains")
    if "점수나 배지가 아니라" in ui or "points or badges" in ui:
        errors.append("badge wording visible")
    if MARKER not in engine or MARKER not in ui:
        errors.append("R2 marker missing")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--apply", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()

    engine_before = ENGINE.read_text(encoding="utf-8-sig")
    ui_before = UI.read_text(encoding="utf-8-sig")
    engine_after = patch_engine(engine_before)
    ui_after = patch_ui(ui_before)
    engine_changed = int(engine_after != engine_before)
    ui_changed = int(ui_after != ui_before)

    if args.apply:
        if engine_changed:
            ENGINE.write_text(engine_after, encoding="utf-8")
        if ui_changed:
            UI.write_text(ui_after, encoding="utf-8")
        final_engine, final_ui = engine_after, ui_after
    else:
        final_engine, final_ui = engine_before, ui_before

    errors = audit(final_engine, final_ui)
    print(f"PATCH_VERSION={VERSION}")
    if args.apply:
        print(f"V341_R2_ENGINE_CHANGED={engine_changed} V341_R2_UI_CHANGED={ui_changed}")
    else:
        idempotent = patch_engine(engine_before) == engine_before and patch_ui(ui_before) == ui_before
        print(f"V341_R2_IDEMPOTENT={str(idempotent)}")
        if not idempotent:
            errors.append("R2 not integrated/idempotent")
    print(f"ERRORS={len(errors)}")
    for error in errors:
        print("ERROR=" + error)
    print("RESULT=" + ("FAIL_LEARNING_EXPERIENCE_V341_R2" if errors else "PASS_LEARNING_EXPERIENCE_V341_R2"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

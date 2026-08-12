#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src" / "pwa" / "app.js"
INDEX = ROOT / "src" / "pwa" / "index.html"

VERSION = "v341_a2_integration_a3"
A2_EPOCH = "20260812_v341_a2"
V339_EPOCH = "20260812_v339_quality3"
REFERENCE_REL = "../../data/reference_side_cards/python_development_workflow_side_cards_v341_a2.json"
REFERENCE_PATH = f'    "{REFERENCE_REL}",\n'
OLD_REFERENCE_REL = "../../data/side_cards/python_development_workflow_side_cards_v341_a2.json"
OLD_REFERENCE_PATH = f'    "{OLD_REFERENCE_REL}",\n'

KO_OLD = ROOT / "data" / "side_cards" / "python_development_workflow_side_cards_v341_a2.json"
KO_NEW = ROOT / "data" / "reference_side_cards" / "python_development_workflow_side_cards_v341_a2.json"
EN_OLD = ROOT / "data_i18n" / "en" / "side_cards" / "python_development_workflow_side_cards_v341_a2.json"
EN_NEW = ROOT / "data_i18n" / "en" / "reference_side_cards" / "python_development_workflow_side_cards_v341_a2.json"


def reference_move_changes() -> list[str]:
    changes: list[str] = []
    for label, old, new in (("ko_reference_dir", KO_OLD, KO_NEW), ("en_reference_dir", EN_OLD, EN_NEW)):
        if old.exists() and new.exists():
            raise RuntimeError(f"REFERENCE_DUPLICATE_LOCATION:{label}")
        if old.exists() and not new.exists():
            changes.append(label)
        elif not old.exists() and not new.exists():
            raise RuntimeError(f"REFERENCE_FILE_MISSING:{label}")
    return changes


def apply_reference_moves() -> None:
    for old, new in ((KO_OLD, KO_NEW), (EN_OLD, EN_NEW)):
        if old.exists() and not new.exists():
            new.parent.mkdir(parents=True, exist_ok=True)
            old.replace(new)


def patch_app(text: str) -> tuple[str, list[str]]:
    changed: list[str] = []
    out = text

    historical_epoch = f'const CONTENT_QUALITY_DATA_EPOCH_V339 = "{V339_EPOCH}";'
    if historical_epoch not in out:
        raise RuntimeError("V339_HISTORICAL_EPOCH_MISSING")

    # V341 A2 deliberately does not replace the historical V339 data epoch.
    # The reference side-card file is a new URL, while app.js itself receives
    # an A2 cache marker in index.html so the new file list is discovered.
    if OLD_REFERENCE_REL in out:
        out = out.replace(OLD_REFERENCE_PATH, REFERENCE_PATH, 1)
        changed.append("reference_file_location")
    elif REFERENCE_REL not in out:
        anchor = '    "../../data/side_cards/dev_environment_cards_v1.json",\n'
        if anchor not in out:
            raise RuntimeError("REFERENCE_FILE_ANCHOR_NOT_FOUND")
        out = out.replace(anchor, anchor + REFERENCE_PATH, 1)
        changed.append("reference_file")

    if out.count(REFERENCE_REL) != 1:
        raise RuntimeError(f"REFERENCE_FILE_COUNT={out.count(REFERENCE_REL)}")
    if OLD_REFERENCE_REL in out:
        raise RuntimeError("OLD_REFERENCE_PATH_STILL_PRESENT")
    if historical_epoch not in out:
        raise RuntimeError("V339_EPOCH_CHANGED_BY_A2")
    return out, changed


def patch_index(text: str) -> tuple[str, list[str]]:
    changed: list[str] = []
    out = text

    app_base = f'<script src="./app.js?v=20260812_v339_quality1&cq={V339_EPOCH}"></script>'
    app_a2 = f'<script src="./app.js?v=20260812_v339_quality1&cq={V339_EPOCH}&le={A2_EPOCH}"></script>'
    if app_a2 not in out:
        if app_base not in out:
            raise RuntimeError("INDEX_APP_CACHE_ANCHOR_NOT_FOUND")
        out = out.replace(app_base, app_a2, 1)
        changed.append("index_app_a2_cache")

    old_engine = '<script src="./learning_engine_v341.js?v=20260812_v341_a1"></script>'
    new_engine = '<script src="./learning_engine_v341.js?v=20260812_v341_a2"></script>'
    if new_engine not in out:
        if old_engine not in out:
            raise RuntimeError("INDEX_ENGINE_ANCHOR_NOT_FOUND")
        out = out.replace(old_engine, new_engine, 1)
        changed.append("index_engine_cache")

    old_ui = '<script src="./learning_experience_v341.js?v=20260812_v341_a1"></script>'
    new_ui = '<script src="./learning_experience_v341.js?v=20260812_v341_a2"></script>'
    if new_ui not in out:
        if old_ui not in out:
            raise RuntimeError("INDEX_UI_ANCHOR_NOT_FOUND")
        out = out.replace(old_ui, new_ui, 1)
        changed.append("index_ui_cache")

    if out.count(new_engine) != 1 or out.count(new_ui) != 1 or out.count(app_a2) != 1:
        raise RuntimeError("INDEX_SCRIPT_COUNT_INVALID")
    if f'cq={V339_EPOCH}' not in out:
        raise RuntimeError("V339_INDEX_EPOCH_CHANGED_BY_A2")
    return out, changed


def run(apply: bool) -> int:
    app_text = APP.read_text(encoding="utf-8")
    index_text = INDEX.read_text(encoding="utf-8")
    new_app, app_changes = patch_app(app_text)
    new_index, index_changes = patch_index(index_text)
    move_changes = reference_move_changes()
    changes = move_changes + app_changes + index_changes

    print(f"PATCH_VERSION={VERSION}")
    print(f"APPLY={apply}")
    print(f"V339_EPOCH_PRESERVED={V339_EPOCH}")
    print(f"V341_A2_EPOCH={A2_EPOCH}")
    print(f"CHANGES={len(changes)}")
    for item in changes:
        print("CHANGE=" + item)

    if apply:
        apply_reference_moves()
        if new_app != app_text:
            APP.write_text(new_app, encoding="utf-8", newline="\n")
        if new_index != index_text:
            INDEX.write_text(new_index, encoding="utf-8", newline="\n")
        print("RESULT=PASS_LEARNING_EXPERIENCE_V341_A2_APPLY")
        return 0

    if changes:
        print("IDEMPOTENT=False")
        print("RESULT=FAIL_LEARNING_EXPERIENCE_V341_A2_CHECK")
        return 1
    print("IDEMPOTENT=True")
    print("RESULT=PASS_LEARNING_EXPERIENCE_V341_A2_CHECK")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()
    return run(apply=args.apply)


if __name__ == "__main__":
    raise SystemExit(main())

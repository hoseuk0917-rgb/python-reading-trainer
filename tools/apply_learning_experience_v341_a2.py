#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src" / "pwa" / "app.js"
INDEX = ROOT / "src" / "pwa" / "index.html"

VERSION = "v341_a2_integration_a1"
EPOCH = "20260812_v341_a2"
SIDE_PATH = '    "../../data/side_cards/python_development_workflow_side_cards_v341_a2.json",\n'


def patch_app(text: str) -> tuple[str, list[str]]:
    changed: list[str] = []
    out = text

    old_epoch = 'const CONTENT_QUALITY_DATA_EPOCH_V339 = "20260812_v339_quality3";'
    new_epoch = f'const CONTENT_QUALITY_DATA_EPOCH_V339 = "{EPOCH}";'
    if new_epoch not in out:
        if old_epoch not in out:
            raise RuntimeError("APP_EPOCH_ANCHOR_NOT_FOUND")
        out = out.replace(old_epoch, new_epoch, 1)
        changed.append("app_epoch")

    if SIDE_PATH.strip() not in out:
        anchor = '    "../../data/side_cards/dev_environment_cards_v1.json",\n'
        if anchor not in out:
            raise RuntimeError("SIDE_FILE_ANCHOR_NOT_FOUND")
        out = out.replace(anchor, anchor + SIDE_PATH, 1)
        changed.append("side_file")

    if out.count(SIDE_PATH.strip()) != 1:
        raise RuntimeError(f"SIDE_FILE_COUNT={out.count(SIDE_PATH.strip())}")
    return out, changed


def patch_index(text: str) -> tuple[str, list[str]]:
    changed: list[str] = []
    out = text

    old_app = '<script src="./app.js?v=20260812_v339_quality1&cq=20260812_v339_quality3"></script>'
    new_app = f'<script src="./app.js?v=20260812_v339_quality1&cq={EPOCH}"></script>'
    if new_app not in out:
        if old_app not in out:
            raise RuntimeError("INDEX_APP_CACHE_ANCHOR_NOT_FOUND")
        out = out.replace(old_app, new_app, 1)
        changed.append("index_app_cache")

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

    if out.count(new_engine) != 1 or out.count(new_ui) != 1 or out.count(new_app) != 1:
        raise RuntimeError("INDEX_SCRIPT_COUNT_INVALID")
    return out, changed


def run(apply: bool) -> int:
    app_text = APP.read_text(encoding="utf-8")
    index_text = INDEX.read_text(encoding="utf-8")
    new_app, app_changes = patch_app(app_text)
    new_index, index_changes = patch_index(index_text)
    changes = app_changes + index_changes

    print(f"PATCH_VERSION={VERSION}")
    print(f"APPLY={apply}")
    print(f"CHANGES={len(changes)}")
    for item in changes:
        print("CHANGE=" + item)

    if apply:
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

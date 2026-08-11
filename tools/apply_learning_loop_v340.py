from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / "src" / "pwa" / "learning_engine_v340.js"
INDEX = ROOT / "src" / "pwa" / "index.html"

OLD_PROGRESS = '''  function firstUnseenIndex(cards, progress) {\n    const seen = progress && progress.seen ? progress.seen : {};\n    for (let i = 0; i < cards.length; i += 1) {\n      if (!seen[cards[i].id]) return i;\n    }\n    return cards.length;\n  }'''

NEW_PROGRESS = '''  function firstUnseenIndex(cards, progress) {\n    const correct = progress && progress.correct ? progress.correct : {};\n    const confused = progress && progress.confused ? progress.confused : {};\n    for (let i = 0; i < cards.length; i += 1) {\n      const id = cards[i].id;\n      if (!correct[id] && !confused[id]) return i;\n    }\n    return cards.length;\n  }'''

ENGINE_TAG = '  <script src="./learning_engine_v340.js?v=20260812_v340_a1"></script>'
LOOP_TAG = '  <script src="./learning_loop_v340.js?v=20260812_v340_a1"></script>'


def transform_engine(text: str) -> str:
    if NEW_PROGRESS in text:
        return text
    if OLD_PROGRESS not in text:
        raise RuntimeError("FIRST_UNSEEN_ANCHOR_NOT_FOUND")
    return text.replace(OLD_PROGRESS, NEW_PROGRESS, 1)


def transform_index(text: str) -> str:
    if ENGINE_TAG in text and LOOP_TAG in text:
        return text

    lines = text.splitlines()
    app_index = next((i for i, line in enumerate(lines) if '<script src="./app.js?' in line), None)
    if app_index is None:
        raise RuntimeError("APP_SCRIPT_ANCHOR_NOT_FOUND")

    insert = []
    if ENGINE_TAG not in text:
        insert.append(ENGINE_TAG)
    if LOOP_TAG not in text:
        insert.append(LOOP_TAG)
    lines[app_index + 1:app_index + 1] = insert
    suffix = "\n" if text.endswith("\n") else ""
    return "\n".join(lines) + suffix


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_if_changed(path: Path, text: str) -> bool:
    old = read(path)
    if old == text:
        return False
    path.write_text(text, encoding="utf-8", newline="\n")
    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    engine_old = read(ENGINE)
    index_old = read(INDEX)
    engine_new = transform_engine(engine_old)
    index_new = transform_index(index_old)

    if args.check:
        errors = []
        if engine_new != engine_old:
            errors.append("ENGINE_NOT_APPLIED_OR_NOT_IDEMPOTENT")
        if index_new != index_old:
            errors.append("INDEX_NOT_APPLIED_OR_NOT_IDEMPOTENT")
        print(f"V340_ENGINE_IDEMPOTENT={engine_new == engine_old}")
        print(f"V340_INDEX_IDEMPOTENT={index_new == index_old}")
        print(f"ERRORS={len(errors)}")
        if errors:
            for error in errors:
                print(f"ERROR={error}")
            return 1
        print("RESULT=PASS_LEARNING_LOOP_V340_INTEGRATION_CHECK")
        return 0

    engine_changed = write_if_changed(ENGINE, engine_new)
    index_changed = write_if_changed(INDEX, index_new)
    print(f"V340_ENGINE_CHANGED={engine_changed}")
    print(f"V340_INDEX_CHANGED={index_changed}")
    print("RESULT=PASS_LEARNING_LOOP_V340_APPLY")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

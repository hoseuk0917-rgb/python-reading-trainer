from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP_JS = ROOT / "src" / "pwa" / "app.js"
KO_ROOT = ROOT / "data"
EN_ROOT = ROOT / "data_i18n" / "en"

KO_LESSON_OUT = ROOT / "data" / "runtime" / "lesson_bundle_v400_5.json"
EN_LESSON_OUT = ROOT / "data_i18n" / "en" / "runtime" / "lesson_bundle_v400_5.json"
KO_SUPPORT_OUT = ROOT / "data" / "runtime" / "support_bundle_v400_5.json"
EN_SUPPORT_OUT = ROOT / "data_i18n" / "en" / "runtime" / "support_bundle_v400_5.json"


def extract_paths(text: str, variable_name: str, next_marker: str) -> list[str]:
    block_re = re.compile(
        rf"const {re.escape(variable_name)} = \[(.*?)\];\s*\n\s*{re.escape(next_marker)}",
        re.S,
    )
    match = block_re.search(text)
    if not match:
        raise SystemExit(f"{variable_name} block not found in app.js")
    paths = re.findall(r'"(\.\./\.\./data/[^\"]+\.json)"', match.group(1))
    if not paths:
        raise SystemExit(f"no paths found for {variable_name}")
    if len(paths) != len(set(paths)):
        raise SystemExit(f"duplicate path in {variable_name}")
    return paths


def runtime_paths() -> tuple[list[str], list[str], list[str]]:
    text = APP_JS.read_text(encoding="utf-8-sig")
    lessons = extract_paths(text, "lessonFiles", "const lessonResults")
    sides = extract_paths(text, "sideFiles", "const sideResults")
    resources = extract_paths(text, "resourceFiles", "const resourceResults")
    return lessons, sides, resources


def load_file_map(root: Path, language: str, paths: list[str]) -> dict[str, list[dict]]:
    files: dict[str, list[dict]] = {}
    for runtime_path in paths:
        rel = runtime_path.removeprefix("../../data/")
        source = root / rel
        if not source.is_file():
            raise SystemExit(f"missing {language} runtime source: {source}")
        payload = json.loads(source.read_text(encoding="utf-8-sig"))
        if not isinstance(payload, list):
            raise SystemExit(f"runtime source is not a list: {source}")
        files[rel] = payload
    return files


def write_bundle(out: Path, payload: dict) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )


def build_for_language(
    root: Path,
    language: str,
    lesson_paths: list[str],
    side_paths: list[str],
    resource_paths: list[str],
    lesson_out: Path,
    support_out: Path,
) -> tuple[dict, dict]:
    lesson_files = load_file_map(root, language, lesson_paths)
    support_paths = side_paths + resource_paths
    support_files = load_file_map(root, language, support_paths)

    lesson_count = sum(len(rows) for rows in lesson_files.values())
    support_item_count = sum(len(rows) for rows in support_files.values())

    lesson_bundle = {
        "schema": "python-reading-trainer/runtime-lesson-bundle-v1",
        "release": "V400.5",
        "language": language,
        "source_file_count": len(lesson_files),
        "card_count": lesson_count,
        "files": lesson_files,
    }
    support_bundle = {
        "schema": "python-reading-trainer/runtime-support-bundle-v1",
        "release": "V400.5",
        "language": language,
        "source_file_count": len(support_files),
        "side_file_count": len(side_paths),
        "resource_file_count": len(resource_paths),
        "item_count": support_item_count,
        "files": support_files,
    }

    write_bundle(lesson_out, lesson_bundle)
    write_bundle(support_out, support_bundle)
    return lesson_bundle, support_bundle


def main() -> None:
    lesson_paths, side_paths, resource_paths = runtime_paths()

    ko_lesson, ko_support = build_for_language(
        KO_ROOT,
        "ko",
        lesson_paths,
        side_paths,
        resource_paths,
        KO_LESSON_OUT,
        KO_SUPPORT_OUT,
    )
    en_lesson, en_support = build_for_language(
        EN_ROOT,
        "en",
        lesson_paths,
        side_paths,
        resource_paths,
        EN_LESSON_OUT,
        EN_SUPPORT_OUT,
    )

    if ko_lesson["source_file_count"] != en_lesson["source_file_count"]:
        raise SystemExit("KO/EN lesson source file count mismatch")
    if ko_support["source_file_count"] != en_support["source_file_count"]:
        raise SystemExit("KO/EN support source file count mismatch")
    if ko_lesson["card_count"] != 1785 or en_lesson["card_count"] != 1785:
        raise SystemExit(
            f"unexpected card count: ko={ko_lesson['card_count']} en={en_lesson['card_count']}"
        )

    print(f"LESSON_SOURCE_FILE_COUNT={ko_lesson['source_file_count']}")
    print(f"SUPPORT_SOURCE_FILE_COUNT={ko_support['source_file_count']}")
    print(f"SIDE_SOURCE_FILE_COUNT={ko_support['side_file_count']}")
    print(f"RESOURCE_SOURCE_FILE_COUNT={ko_support['resource_file_count']}")
    print(f"KO_CARD_COUNT={ko_lesson['card_count']}")
    print(f"EN_CARD_COUNT={en_lesson['card_count']}")
    print(f"KO_SUPPORT_ITEM_COUNT={ko_support['item_count']}")
    print(f"EN_SUPPORT_ITEM_COUNT={en_support['item_count']}")
    print("RUNTIME_CONTENT_BUNDLE_BUILD_PASS=True")


if __name__ == "__main__":
    main()

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP_JS = ROOT / "src" / "pwa" / "app.js"
KO_ROOT = ROOT / "data"
EN_ROOT = ROOT / "data_i18n" / "en"
KO_OUT = ROOT / "data" / "runtime" / "lesson_bundle_v400_5.json"
EN_OUT = ROOT / "data_i18n" / "en" / "runtime" / "lesson_bundle_v400_5.json"

LESSON_BLOCK_RE = re.compile(r"const lessonFiles = \[(.*?)\];\s*\n\s*const lessonResults", re.S)
PATH_RE = re.compile(r'"(\.\./\.\./data/lessons/[^\"]+\.json)"')


def lesson_paths() -> list[str]:
    text = APP_JS.read_text(encoding="utf-8-sig")
    match = LESSON_BLOCK_RE.search(text)
    if not match:
        raise SystemExit("lessonFiles block not found in app.js")
    paths = PATH_RE.findall(match.group(1))
    if not paths:
        raise SystemExit("no lesson paths found in app.js")
    if len(paths) != len(set(paths)):
        raise SystemExit("duplicate lesson path in app.js")
    return paths


def build(root: Path, out: Path, language: str, paths: list[str]) -> dict:
    files: dict[str, list[dict]] = {}
    total = 0
    for runtime_path in paths:
        rel = runtime_path.removeprefix("../../data/")
        source = root / rel
        if not source.is_file():
            raise SystemExit(f"missing {language} lesson source: {source}")
        payload = json.loads(source.read_text(encoding="utf-8-sig"))
        if not isinstance(payload, list):
            raise SystemExit(f"lesson source is not a list: {source}")
        files[rel] = payload
        total += len(payload)
    bundle = {
        "schema": "python-reading-trainer/runtime-lesson-bundle-v1",
        "release": "V400.5",
        "language": language,
        "source_file_count": len(paths),
        "card_count": total,
        "files": files,
    }
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(bundle, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    return bundle


def main() -> None:
    paths = lesson_paths()
    ko = build(KO_ROOT, KO_OUT, "ko", paths)
    en = build(EN_ROOT, EN_OUT, "en", paths)
    if ko["source_file_count"] != en["source_file_count"]:
        raise SystemExit("KO/EN source file count mismatch")
    if ko["card_count"] != 1785 or en["card_count"] != 1785:
        raise SystemExit(f"unexpected card count: ko={ko['card_count']} en={en['card_count']}")
    print(f"SOURCE_FILE_COUNT={ko['source_file_count']}")
    print(f"KO_CARD_COUNT={ko['card_count']}")
    print(f"EN_CARD_COUNT={en['card_count']}")
    print(f"KO_BUNDLE={KO_OUT.relative_to(ROOT)}")
    print(f"EN_BUNDLE={EN_OUT.relative_to(ROOT)}")
    print("RUNTIME_LESSON_BUNDLE_BUILD_PASS=True")


if __name__ == "__main__":
    main()

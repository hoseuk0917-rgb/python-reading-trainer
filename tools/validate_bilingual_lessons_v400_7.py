from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src" / "pwa" / "app.js"
EXPECTED_CARDS = 1785
REQUIRED_FIELDS = [
    "id",
    "level",
    "title",
    "concepts",
    "reading_goal",
    "code",
    "question_type",
    "question",
    "choices",
    "answer",
    "explanation",
]


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def extract_runtime_paths(text: str, variable_name: str, next_marker: str) -> list[str]:
    pattern = re.compile(
        rf"const {re.escape(variable_name)} = \[(.*?)\];\s*\n\s*{re.escape(next_marker)}",
        re.S,
    )
    match = pattern.search(text)
    if not match:
        raise SystemExit(f"FAIL={variable_name.upper()}_BLOCK_NOT_FOUND")
    paths = re.findall(r'"(\.\./\.\./data/[^\"]+\.json)"', match.group(1))
    if not paths:
        raise SystemExit(f"FAIL={variable_name.upper()}_PATHS_EMPTY")
    return paths


def relative_source(runtime_path: str) -> Path:
    return Path(runtime_path.removeprefix("../../data/"))


def collect_side_cards(payload) -> list[dict]:
    rows: list[dict] = []
    if isinstance(payload, list):
        rows.extend(row for row in payload if isinstance(row, dict))
    elif isinstance(payload, dict):
        for value in payload.values():
            if isinstance(value, list):
                rows.extend(row for row in value if isinstance(row, dict))
    return rows


def validate_language(language: str, source_root: Path, lesson_paths: list[str], side_paths: list[str]):
    failures: list[str] = []
    lessons: list[dict] = []
    sides: list[dict] = []

    for runtime_path in lesson_paths:
        path = source_root / relative_source(runtime_path)
        if not path.is_file():
            failures.append(f"{language}:missing_lesson:{relative_source(runtime_path)}")
            continue
        try:
            payload = load_json(path)
        except Exception as exc:
            failures.append(f"{language}:json_error:{relative_source(runtime_path)}:{type(exc).__name__}")
            continue
        if not isinstance(payload, list):
            failures.append(f"{language}:lesson_not_list:{relative_source(runtime_path)}")
            continue
        lessons.extend(row for row in payload if isinstance(row, dict))

    for runtime_path in side_paths:
        path = source_root / relative_source(runtime_path)
        if not path.is_file():
            failures.append(f"{language}:missing_side:{relative_source(runtime_path)}")
            continue
        try:
            sides.extend(collect_side_cards(load_json(path)))
        except Exception as exc:
            failures.append(f"{language}:side_json_error:{relative_source(runtime_path)}:{type(exc).__name__}")

    ids = [str(card.get("id") or "") for card in lessons]
    side_ids = [str(card.get("id") or "") for card in sides]
    known_ids = set(ids) | set(side_ids)

    duplicates = [key for key, count in Counter(ids).items() if key and count > 1]
    if duplicates:
        failures.append(f"{language}:duplicate_lesson_ids:{duplicates[:10]}")

    if len(lessons) != EXPECTED_CARDS:
        failures.append(f"{language}:card_count:{len(lessons)}")

    for card in lessons:
        cid = str(card.get("id") or "<missing-id>")
        for field in REQUIRED_FIELDS:
            if field not in card:
                failures.append(f"{language}:missing_field:{cid}:{field}")

        if not card.get("concepts"):
            failures.append(f"{language}:empty_concepts:{cid}")

        level = card.get("level")
        if not isinstance(level, int) or not 1 <= level <= 10:
            failures.append(f"{language}:bad_level:{cid}:{level}")

        choices = card.get("choices")
        if not isinstance(choices, list) or not choices:
            failures.append(f"{language}:bad_choices:{cid}")
        elif card.get("question_type") in {"meaning_choice", "order_choice"} and card.get("answer") not in choices:
            failures.append(f"{language}:answer_not_in_choices:{cid}")

        for sid in card.get("side_card_ids", []) or []:
            if sid not in known_ids:
                failures.append(f"{language}:missing_side_ref:{cid}:{sid}")

    return {
        "language": language,
        "lessons": lessons,
        "sides": sides,
        "failures": failures,
    }


def main() -> None:
    app_text = APP.read_text(encoding="utf-8-sig")
    lesson_paths = extract_runtime_paths(app_text, "lessonFiles", "const lessonResults")
    side_paths = extract_runtime_paths(app_text, "sideFiles", "const sideResults")

    if len(lesson_paths) != len(set(lesson_paths)) or len(side_paths) != len(set(side_paths)):
        raise SystemExit("FAIL=DUPLICATE_APP_SOURCE_PATH")

    ko = validate_language("ko", ROOT / "data", lesson_paths, side_paths)
    en = validate_language("en", ROOT / "data_i18n" / "en", lesson_paths, side_paths)

    failures = ko["failures"] + en["failures"]
    ko_cards = ko["lessons"]
    en_cards = en["lessons"]

    ko_ids = [card.get("id") for card in ko_cards]
    en_ids = [card.get("id") for card in en_cards]
    if ko_ids != en_ids:
        failures.append("parity:lesson_id_order_mismatch")

    if len(ko_cards) == len(en_cards):
        for ko_card, en_card in zip(ko_cards, en_cards):
            cid = str(ko_card.get("id") or "<missing-id>")
            for field in ("id", "level", "question_type", "code"):
                if ko_card.get(field) != en_card.get(field):
                    failures.append(f"parity:{field}:{cid}")
            if len(ko_card.get("choices") or []) != len(en_card.get("choices") or []):
                failures.append(f"parity:choice_count:{cid}")
            if (ko_card.get("side_card_ids") or []) != (en_card.get("side_card_ids") or []):
                failures.append(f"parity:side_card_ids:{cid}")

    print(f"LESSON_SOURCE_FILE_COUNT={len(lesson_paths)}")
    print(f"SIDE_SOURCE_FILE_COUNT={len(side_paths)}")
    print(f"KO_CARD_COUNT={len(ko_cards)}")
    print(f"EN_CARD_COUNT={len(en_cards)}")
    print(f"KO_SIDE_CARD_COUNT={len(ko['sides'])}")
    print(f"EN_SIDE_CARD_COUNT={len(en['sides'])}")
    print(f"FAILURE_COUNT={len(failures)}")

    if failures:
        for failure in failures[:50]:
            print(f"FAIL={failure}")
        raise SystemExit(1)

    print("BILINGUAL_LESSON_VALIDATION_PASS=True")


if __name__ == "__main__":
    main()

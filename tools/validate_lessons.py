# -*- coding: utf-8 -*-
import argparse
import json
import re
from collections import Counter
from pathlib import Path


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def collect_side_cards(data):
    cards = []
    if isinstance(data, list):
        cards.extend(data)
    elif isinstance(data, dict):
        for value in data.values():
            if isinstance(value, list):
                cards.extend(value)
    return cards


def main():
    parser = argparse.ArgumentParser(description="Validate python-reading-trainer lesson and side card data.")
    parser.add_argument("--root", default=".", help="Project root directory")
    parser.add_argument("--expected-app-version", default=None)
    parser.add_argument("--expected-lesson-cards", type=int, default=None)
    args = parser.parse_args()

    root = Path(args.root)
    app_path = root / "src" / "pwa" / "app.js"

    if not app_path.exists():
        raise SystemExit(f"FAIL: app.js not found: {app_path}")

    app = app_path.read_text(encoding="utf-8-sig")
    version_match = re.search(r'const APP_DATA_VERSION = "([^"]+)";', app)
    app_version = version_match.group(1) if version_match else None

    lesson_files = re.findall(r'"(\.\./\.\./data/lessons/[^"]+\.json)"', app)
    side_files = re.findall(r'"(\.\./\.\./data/side_cards/[^"]+\.json)"', app)

    lesson_cards = []
    side_cards = []
    missing_files = []
    json_errors = []

    for rel in lesson_files:
        path = (app_path.parent / rel).resolve()
        if not path.exists():
            missing_files.append(rel)
            continue
        try:
            data = load_json(path)
        except Exception as exc:
            json_errors.append((rel, repr(exc)))
            continue
        if not isinstance(data, list):
            json_errors.append((rel, "top-level JSON is not a list"))
            continue
        lesson_cards.extend(data)

    for rel in side_files:
        path = (app_path.parent / rel).resolve()
        if not path.exists():
            missing_files.append(rel)
            continue
        try:
            data = load_json(path)
        except Exception as exc:
            json_errors.append((rel, repr(exc)))
            continue
        side_cards.extend(collect_side_cards(data))

    lesson_ids = [card.get("id") for card in lesson_cards]
    side_ids = [card.get("id") for card in side_cards]
    all_known_ids = set(lesson_ids) | set(side_ids)

    duplicate_lesson_ids = [key for key, value in Counter(lesson_ids).items() if value > 1]
    duplicate_side_ids = [key for key, value in Counter(side_ids).items() if value > 1]

    required_fields = ["id", "level", "title", "concepts", "reading_goal", "code", "question_type", "question", "choices", "answer", "explanation"]
    missing_required = []
    answer_not_in_choices = []
    empty_concepts = []
    bad_levels = []
    missing_side_refs = []

    for card in lesson_cards:
        cid = card.get("id")

        for field in required_fields:
            if field not in card:
                missing_required.append((cid, field))

        if card.get("question_type") in ("meaning_choice", "order_choice"):
            if card.get("answer") not in card.get("choices", []):
                answer_not_in_choices.append(cid)

        if not card.get("concepts"):
            empty_concepts.append(cid)

        level = card.get("level")
        if not isinstance(level, int) or level < 1 or level > 10:
            bad_levels.append(cid)

        for sid in card.get("side_card_ids", []):
            if sid not in all_known_ids:
                missing_side_refs.append((cid, sid))

    failures = []

    if args.expected_app_version and app_version != args.expected_app_version:
        failures.append(f"APP_VERSION expected {args.expected_app_version}, got {app_version}")

    if args.expected_lesson_cards is not None and len(lesson_cards) != args.expected_lesson_cards:
        failures.append(f"LESSON_CARDS expected {args.expected_lesson_cards}, got {len(lesson_cards)}")

    checks = {
        "MISSING FILES": missing_files,
        "JSON ERRORS": json_errors,
        "DUPLICATE LESSON IDS": duplicate_lesson_ids,
        "DUPLICATE SIDE IDS": duplicate_side_ids,
        "MISSING REQUIRED FIELDS": missing_required,
        "ANSWER NOT IN CHOICES": answer_not_in_choices,
        "EMPTY CONCEPTS": empty_concepts,
        "BAD LEVELS": bad_levels,
        "MISSING SIDE CARD REFERENCES": missing_side_refs,
    }

    print("APP_VERSION:", app_version)
    print("LESSON_FILES:", len(lesson_files))
    print("SIDE_FILES:", len(side_files))
    print("LESSON_CARDS:", len(lesson_cards))
    print("SIDE_CARDS:", len(side_cards))
    print()
    print("APP CHECK LAST LESSONS:")
    print(lesson_files[-5:])
    print()

    for name, value in checks.items():
        print(f"{name}:", "OK" if not value else value[:50] if isinstance(value, list) else value)
        if value:
            failures.append(name)

    if failures:
        print()
        print("VALIDATION FAILED")
        for failure in failures:
            print("-", failure)
        raise SystemExit(1)

    print()
    print("VALIDATION OK")


if __name__ == "__main__":
    main()

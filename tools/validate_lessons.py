# -*- coding: utf-8 -*-
import argparse
import json
import re
import unicodedata
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


def display_choice_key(value):
    text = unicodedata.normalize("NFKC", str(value))
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Cf")
    return re.sub(r"\s+", " ", text).strip()


def choice_issue_context(card, source, extra):
    return {
        "id": card.get("id"),
        "source": source,
        "question": card.get("question"),
        "choices": card.get("choices", []),
        "answer": card.get("answer"),
        **extra,
    }


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
    lesson_card_sources = {}
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
        for card in data:
            cid = card.get("id")
            if cid:
                lesson_card_sources[cid] = rel

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
    choices_not_list = []
    too_few_choices = []
    duplicate_choices = []
    display_duplicate_choices = []
    empty_choices = []
    empty_concepts = []
    bad_levels = []
    missing_side_refs = []
    semantic_invariant_errors = []

    for card in lesson_cards:
        cid = card.get("id")
        source = lesson_card_sources.get(cid)

        for field in required_fields:
            if field not in card:
                missing_required.append((cid, field))

        if card.get("question_type") in ("meaning_choice", "order_choice"):
            if card.get("answer") not in card.get("choices", []):
                answer_not_in_choices.append(cid)

        choices = card.get("choices", [])
        if not isinstance(choices, list):
            choices_not_list.append(choice_issue_context(card, source, {"choice_type": type(choices).__name__}))
        else:
            if len(choices) < 2:
                too_few_choices.append(choice_issue_context(card, source, {"choice_count": len(choices)}))

            repeated = [
                choice
                for choice, count in Counter(str(choice) for choice in choices).items()
                if count > 1
            ]
            if repeated:
                duplicate_choices.append(
                    choice_issue_context(card, source, {"duplicates": repeated})
                )

            display_keys = [display_choice_key(choice) for choice in choices]
            repeated_display = [
                key
                for key, count in Counter(display_keys).items()
                if key and count > 1
            ]
            if repeated_display:
                display_duplicate_choices.append(
                    choice_issue_context(card, source, {"display_duplicates": repeated_display})
                )

            blank_positions = [
                index
                for index, choice in enumerate(choices)
                if not display_choice_key(choice)
            ]
            if blank_positions:
                empty_choices.append(
                    choice_issue_context(card, source, {"blank_positions": blank_positions})
                )

        if not card.get("concepts"):
            empty_concepts.append(cid)

        level = card.get("level")
        if not isinstance(level, int) or level < 1 or level > 10:
            bad_levels.append(cid)

        for sid in card.get("side_card_ids", []):
            if sid not in all_known_ids:
                missing_side_refs.append((cid, sid))

    logging_card_id = "PY129_L05_LOG_LEVEL_INFO_DEBUG_001"
    logging_card = next(
        (card for card in lesson_cards if card.get("id") == logging_card_id),
        None,
    )
    if logging_card is None:
        semantic_invariant_errors.append((logging_card_id, "ko_card_missing"))
    else:
        explanation = str(logging_card.get("explanation") or "")
        key_point = str(
            (logging_card.get("concept_explanation") or {}).get("key_point") or ""
        )
        if logging_card.get("answer") != "INFO":
            semantic_invariant_errors.append((logging_card_id, "ko_answer_not_info"))
        if "verbose = False" not in str(logging_card.get("code") or ""):
            semantic_invariant_errors.append((logging_card_id, "ko_code_not_false"))
        if (
            "False" not in explanation
            or "logging.INFO" not in explanation
            or "INFO" not in explanation
            or "현재 값은 True" in explanation
            or "DEBUG가 출력" in explanation
        ):
            semantic_invariant_errors.append((logging_card_id, "ko_explanation_false_branch"))
        if (
            "verbose=False" not in key_point
            or "logging.INFO" not in key_point
            or "verbose=True" in key_point
        ):
            semantic_invariant_errors.append((logging_card_id, "ko_key_point_false_branch"))

    en_logging_path = (
        root
        / "data_i18n"
        / "en"
        / "lessons"
        / "python_logging_verbose_cli_beginner_v129_a1.json"
    )
    if not en_logging_path.exists():
        semantic_invariant_errors.append((logging_card_id, "en_file_missing"))
    else:
        try:
            en_cards = load_json(en_logging_path)
        except Exception as exc:
            semantic_invariant_errors.append((logging_card_id, f"en_json_error:{exc!r}"))
        else:
            en_logging_card = next(
                (
                    card
                    for card in en_cards
                    if isinstance(card, dict) and card.get("id") == logging_card_id
                ),
                None,
            )
            if en_logging_card is None:
                semantic_invariant_errors.append((logging_card_id, "en_card_missing"))
            else:
                en_explanation = str(en_logging_card.get("explanation") or "")
                en_key_point = str(
                    (en_logging_card.get("concept_explanation") or {}).get("key_point") or ""
                )
                if en_logging_card.get("answer") != "INFO":
                    semantic_invariant_errors.append((logging_card_id, "en_answer_not_info"))
                if (
                    "False" not in en_explanation
                    or "logging.INFO" not in en_explanation
                    or "INFO" not in en_explanation
                    or "current value of `verbose` is `True`" in en_explanation
                    or "DEBUG` is printed" in en_explanation
                ):
                    semantic_invariant_errors.append((logging_card_id, "en_explanation_false_branch"))
                if (
                    "verbose=False" not in en_key_point
                    or "logging.INFO" not in en_key_point
                    or "verbose=True" in en_key_point
                ):
                    semantic_invariant_errors.append((logging_card_id, "en_key_point_false_branch"))

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
        "CHOICES NOT LIST": choices_not_list,
        "TOO FEW CHOICES": too_few_choices,
        "DUPLICATE CHOICES": duplicate_choices,
        "DISPLAY DUPLICATE CHOICES": display_duplicate_choices,
        "EMPTY CHOICES": empty_choices,
        "EMPTY CONCEPTS": empty_concepts,
        "BAD LEVELS": bad_levels,
        "MISSING SIDE CARD REFERENCES": missing_side_refs,
        "SEMANTIC INVARIANTS": semantic_invariant_errors,
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

#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP_JS = ROOT / "src/pwa/app.js"
PATCH_VERSION = "v346_future_terminology_a2"

CHOICE_REPLACEMENTS = {
    "ko": {
        "L07_pipeline_001": {
            "API 키를 새로 발급해 저장한다.": "새 폴더를 만든 뒤 파일 이름만 바꾼다."
        },
        "PY_L06_pathlib_glob_001": {
            "API 엔드포인트": "프로그램 실행 로그"
        },
    },
    "en": {
        "L07_pipeline_001": {
            "Generate a new API key and save it.": "Create a new folder and only rename a file."
        },
        "PY_L06_pathlib_glob_001": {
            "API Endpoints": "Program execution logs"
        },
        "PY3_L03_join_001": {
            "Assuming a runtime error has occurred": "The list name \"items\" with brackets"
        },
    },
}

CONCEPT_ADDITIONS = {
    "PY_L09_decorator_001": "api",
    "PY13_L09_tpu_cloud_001": "runtime",
}


def parse_lesson_paths() -> list[str]:
    source = APP_JS.read_text(encoding="utf-8-sig")
    match = re.search(r"const\s+lessonFiles\s*=\s*\[(.*?)\];", source, re.S)
    if not match:
        raise RuntimeError("lessonFiles not found in app.js")
    return re.findall(r'"([^"\n]+\.json)"', match.group(1))


def repo_path(raw: str, language: str) -> Path:
    clean = raw.replace("\\", "/")
    while clean.startswith("../"):
        clean = clean[3:]
    if language == "en":
        if not clean.startswith("data/"):
            raise RuntimeError(f"unexpected lesson path: {raw}")
        clean = "data_i18n/en/" + clean[len("data/") :]
    return ROOT / clean


def load_all(language: str) -> list[tuple[Path, list[dict]]]:
    files: list[tuple[Path, list[dict]]] = []
    for raw in parse_lesson_paths():
        path = repo_path(raw, language)
        value = json.loads(path.read_text(encoding="utf-8-sig"))
        if not isinstance(value, list):
            raise RuntimeError(f"expected list: {path.relative_to(ROOT)}")
        files.append((path, value))
    return files


def patch_language(language: str, files: list[tuple[Path, list[dict]]]) -> tuple[int, int, list[str]]:
    changed_files = 0
    changed_cards = 0
    found_choice_ids: set[str] = set()
    found_concept_ids: set[str] = set()
    errors: list[str] = []

    for path, rows in files:
        file_changed = False
        for row in rows:
            if not isinstance(row, dict):
                continue
            card_id = str(row.get("id", ""))
            card_changed = False

            replacements = CHOICE_REPLACEMENTS.get(language, {}).get(card_id)
            if replacements is not None:
                found_choice_ids.add(card_id)
                choices = row.get("choices")
                if not isinstance(choices, list):
                    errors.append(f"{language}:{card_id}: choices missing")
                else:
                    for old, new in replacements.items():
                        old_count = choices.count(old)
                        new_count = choices.count(new)
                        if old_count == 1:
                            answer_before = row.get("answer")
                            row["choices"] = [new if choice == old else choice for choice in choices]
                            if row.get("answer") != answer_before:
                                errors.append(f"{language}:{card_id}: answer changed unexpectedly")
                            card_changed = True
                            choices = row["choices"]
                        elif old_count == 0 and new_count == 1:
                            pass
                        else:
                            errors.append(
                                f"{language}:{card_id}: expected one old or one new choice; "
                                f"old={old_count} new={new_count}"
                            )

            addition = CONCEPT_ADDITIONS.get(card_id)
            if addition:
                found_concept_ids.add(card_id)
                concepts = row.get("concepts")
                if not isinstance(concepts, list):
                    errors.append(f"{language}:{card_id}: concepts missing")
                elif addition not in concepts:
                    concepts.append(addition)
                    card_changed = True

            if card_changed:
                changed_cards += 1
                file_changed = True

        if file_changed:
            changed_files += 1
            path.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    expected_choice = set(CHOICE_REPLACEMENTS.get(language, {}))
    expected_concept = set(CONCEPT_ADDITIONS)
    if found_choice_ids != expected_choice:
        errors.append(f"{language}: missing choice ids={sorted(expected_choice - found_choice_ids)}")
    if found_concept_ids != expected_concept:
        errors.append(f"{language}: missing concept ids={sorted(expected_concept - found_concept_ids)}")
    return changed_files, changed_cards, errors


def validate(language: str, files: list[tuple[Path, list[dict]]]) -> list[str]:
    errors: list[str] = []
    by_id = {}
    for _, rows in files:
        for row in rows:
            if isinstance(row, dict):
                by_id[str(row.get("id", ""))] = row

    for card_id, replacements in CHOICE_REPLACEMENTS.get(language, {}).items():
        row = by_id.get(card_id)
        if not row:
            errors.append(f"{language}:{card_id}: missing after patch")
            continue
        choices = row.get("choices", [])
        for old, new in replacements.items():
            if old in choices or choices.count(new) != 1:
                errors.append(f"{language}:{card_id}: replacement not canonical")
        if row.get("answer") not in choices:
            errors.append(f"{language}:{card_id}: answer not in choices")

    for card_id, addition in CONCEPT_ADDITIONS.items():
        row = by_id.get(card_id)
        if not row or addition not in (row.get("concepts") or []):
            errors.append(f"{language}:{card_id}: missing concept {addition}")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()

    totals = {"files": 0, "cards": 0}
    all_errors: list[str] = []

    for language in ("ko", "en"):
        files = load_all(language)
        if args.apply:
            changed_files, changed_cards, errors = patch_language(language, files)
            totals["files"] += changed_files
            totals["cards"] += changed_cards
            all_errors.extend(errors)
            files = load_all(language)
        else:
            # Check mode must prove that applying again would make no changes.
            for _, rows in files:
                for row in rows:
                    if not isinstance(row, dict):
                        continue
                    card_id = str(row.get("id", ""))
                    replacements = CHOICE_REPLACEMENTS.get(language, {}).get(card_id, {})
                    choices = row.get("choices", []) if isinstance(row.get("choices"), list) else []
                    for old, new in replacements.items():
                        if old in choices or choices.count(new) != 1:
                            totals["cards"] += 1
                    addition = CONCEPT_ADDITIONS.get(card_id)
                    if addition and addition not in (row.get("concepts") or []):
                        totals["cards"] += 1
            totals["files"] = 0 if totals["cards"] == 0 else -1
        all_errors.extend(validate(language, files))

    print(f"PATCH_VERSION={PATCH_VERSION}")
    print(f"APPLY={args.apply}")
    print(f"FILES_CHANGED={totals['files']}")
    print(f"CARDS_CHANGED={totals['cards']}")
    print(f"ERRORS={len(all_errors)}")
    if args.check:
        print(f"IDEMPOTENT={totals['cards'] == 0 and not all_errors}")
    for error in all_errors:
        print("ERROR=" + error)

    ok = not all_errors and (args.apply or totals["cards"] == 0)
    print("RESULT=" + ("PASS_FUTURE_TERMINOLOGY_REPAIR_V346" if ok else "FAIL_FUTURE_TERMINOLOGY_REPAIR_V346"))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())

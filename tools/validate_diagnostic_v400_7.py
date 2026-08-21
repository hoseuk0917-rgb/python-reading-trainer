from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KO_PATH = ROOT / "data" / "diagnostic" / "diagnostic_v400_2.json"
EN_PATH = ROOT / "data_i18n" / "en" / "diagnostic" / "diagnostic_v400_2.json"
EXPECTED_AXES = {
    "value_flow",
    "branch_condition",
    "loop_collection",
    "function_call_return",
    "file_error_path",
    "object_module",
    "data_processing",
    "project_flow",
}


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def fail(failures: list[str], value: str) -> None:
    failures.append(value)


def main() -> None:
    ko = load(KO_PATH)
    en = load(EN_PATH)
    failures: list[str] = []

    if ko.get("version") != en.get("version"):
        fail(failures, "version_mismatch")
    if ko.get("language") != "ko":
        fail(failures, "ko_language")
    if en.get("language") != "en":
        fail(failures, "en_language")
    if ko.get("axis_count") != 8 or en.get("axis_count") != 8:
        fail(failures, "axis_count")

    ko_stages = ko.get("stages")
    en_stages = en.get("stages")
    if not isinstance(ko_stages, dict) or not isinstance(en_stages, dict):
        raise SystemExit("FAIL=STAGES_NOT_OBJECT")
    if list(ko_stages) != list(en_stages):
        fail(failures, "stage_order_mismatch")

    all_axes: set[str] = set()
    total_questions = 0

    for stage_name in ko_stages:
        ko_stage = ko_stages[stage_name]
        en_stage = en_stages.get(stage_name)
        if not isinstance(ko_stage, dict) or not isinstance(en_stage, dict):
            fail(failures, f"stage_shape:{stage_name}")
            continue

        for field in ("id", "form", "question_count"):
            if ko_stage.get(field) != en_stage.get(field):
                fail(failures, f"stage_parity:{stage_name}:{field}")

        ko_questions = ko_stage.get("questions")
        en_questions = en_stage.get("questions")
        if not isinstance(ko_questions, list) or not isinstance(en_questions, list):
            fail(failures, f"questions_not_list:{stage_name}")
            continue

        if ko_stage.get("question_count") != len(ko_questions):
            fail(failures, f"ko_question_count:{stage_name}")
        if en_stage.get("question_count") != len(en_questions):
            fail(failures, f"en_question_count:{stage_name}")
        if len(ko_questions) != len(en_questions):
            fail(failures, f"question_length_parity:{stage_name}")
            continue

        total_questions += len(ko_questions)

        for index, (ko_q, en_q) in enumerate(zip(ko_questions, en_questions)):
            qid = str(ko_q.get("id") or f"{stage_name}:{index}")
            for field in ("id", "source_card_id", "axis", "level", "code", "correct_index"):
                if ko_q.get(field) != en_q.get(field):
                    fail(failures, f"question_parity:{qid}:{field}")

            axis = ko_q.get("axis")
            if isinstance(axis, str):
                all_axes.add(axis)
            else:
                fail(failures, f"axis_missing:{qid}")

            for language, row in (("ko", ko_q), ("en", en_q)):
                choices = row.get("choices")
                correct_index = row.get("correct_index")
                if not isinstance(choices, list) or len(choices) < 2:
                    fail(failures, f"choices:{language}:{qid}")
                    continue
                if not isinstance(correct_index, int) or not 0 <= correct_index < len(choices):
                    fail(failures, f"correct_index:{language}:{qid}")
                for field in ("title", "question"):
                    if not isinstance(row.get(field), str) or not row.get(field).strip():
                        fail(failures, f"text:{language}:{qid}:{field}")

            if len(ko_q.get("choices") or []) != len(en_q.get("choices") or []):
                fail(failures, f"choice_count_parity:{qid}")

    if all_axes != EXPECTED_AXES:
        fail(failures, "axis_inventory:" + ",".join(sorted(all_axes)))

    print(f"DIAGNOSTIC_VERSION={ko.get('version')}")
    print(f"STAGE_COUNT={len(ko_stages)}")
    print(f"TOTAL_QUESTION_ROWS={total_questions}")
    print(f"AXIS_COUNT={len(all_axes)}")
    print(f"FAILURE_COUNT={len(failures)}")

    if failures:
        for item in failures[:50]:
            print(f"FAIL={item}")
        raise SystemExit(1)

    print("DIAGNOSTIC_PARITY_VALIDATION_PASS=True")


if __name__ == "__main__":
    main()

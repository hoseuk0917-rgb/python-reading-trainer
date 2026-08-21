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


def validate_question_pair(
    failures: list[str],
    ko_q: dict,
    en_q: dict,
    stage_name: str,
    index_label: str,
    expected_axis: str | None = None,
) -> str | None:
    qid = str(ko_q.get("id") or f"{stage_name}:{index_label}")

    for field in ("id", "source_card_id", "axis", "level", "code", "correct_index"):
        if ko_q.get(field) != en_q.get(field):
            fail(failures, f"question_parity:{qid}:{field}")

    axis = ko_q.get("axis")
    if not isinstance(axis, str):
        fail(failures, f"axis_missing:{qid}")
        axis = None
    elif expected_axis is not None and axis != expected_axis:
        fail(failures, f"checkpoint_axis_mismatch:{qid}:{axis}:{expected_axis}")

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

    return axis


def validate_fixed_stage(
    failures: list[str],
    all_axes: set[str],
    ko_stage: dict,
    en_stage: dict,
    stage_name: str,
) -> int:
    for field in ("id", "form", "question_count"):
        if ko_stage.get(field) != en_stage.get(field):
            fail(failures, f"stage_parity:{stage_name}:{field}")

    ko_questions = ko_stage.get("questions")
    en_questions = en_stage.get("questions")

    if not isinstance(ko_questions, list) or not isinstance(en_questions, list):
        fail(failures, f"questions_not_list:{stage_name}")
        return 0

    if ko_stage.get("question_count") != len(ko_questions):
        fail(failures, f"ko_question_count:{stage_name}")
    if en_stage.get("question_count") != len(en_questions):
        fail(failures, f"en_question_count:{stage_name}")
    if len(ko_questions) != len(en_questions):
        fail(failures, f"question_length_parity:{stage_name}")
        return min(len(ko_questions), len(en_questions))

    for index, (ko_q, en_q) in enumerate(zip(ko_questions, en_questions)):
        axis = validate_question_pair(
            failures,
            ko_q,
            en_q,
            stage_name,
            str(index),
        )
        if axis:
            all_axes.add(axis)

    return len(ko_questions)


def validate_checkpoint_stage(
    failures: list[str],
    all_axes: set[str],
    ko_stage: dict,
    en_stage: dict,
) -> int:
    stage_name = "checkpoint"

    for field in ("id", "question_count_min", "question_count_max", "pool_per_axis"):
        if ko_stage.get(field) != en_stage.get(field):
            fail(failures, f"stage_parity:{stage_name}:{field}")

    ko_pool = ko_stage.get("pool")
    en_pool = en_stage.get("pool")

    if not isinstance(ko_pool, dict) or not isinstance(en_pool, dict):
        fail(failures, "checkpoint_pool_not_object")
        return 0

    if list(ko_pool) != list(en_pool):
        fail(failures, "checkpoint_pool_axis_order_mismatch")

    ko_axes = set(ko_pool)
    en_axes = set(en_pool)
    if ko_axes != EXPECTED_AXES:
        fail(failures, "checkpoint_ko_axis_inventory:" + ",".join(sorted(ko_axes)))
    if en_axes != EXPECTED_AXES:
        fail(failures, "checkpoint_en_axis_inventory:" + ",".join(sorted(en_axes)))

    pool_per_axis = ko_stage.get("pool_per_axis")
    total = 0

    for axis in ko_pool:
        ko_questions = ko_pool.get(axis)
        en_questions = en_pool.get(axis)

        if not isinstance(ko_questions, list) or not isinstance(en_questions, list):
            fail(failures, f"checkpoint_axis_not_list:{axis}")
            continue

        if isinstance(pool_per_axis, int):
            if len(ko_questions) != pool_per_axis:
                fail(failures, f"checkpoint_ko_pool_count:{axis}:{len(ko_questions)}")
            if len(en_questions) != pool_per_axis:
                fail(failures, f"checkpoint_en_pool_count:{axis}:{len(en_questions)}")

        if len(ko_questions) != len(en_questions):
            fail(failures, f"checkpoint_pool_length_parity:{axis}")
            continue

        total += len(ko_questions)

        for index, (ko_q, en_q) in enumerate(zip(ko_questions, en_questions)):
            found_axis = validate_question_pair(
                failures,
                ko_q,
                en_q,
                stage_name,
                f"{axis}:{index}",
                expected_axis=axis,
            )
            if found_axis:
                all_axes.add(found_axis)

    minimum = ko_stage.get("question_count_min")
    maximum = ko_stage.get("question_count_max")
    if not isinstance(minimum, int) or not isinstance(maximum, int) or not 0 < minimum <= maximum:
        fail(failures, "checkpoint_question_count_range")

    return total


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

    expected_stages = ["baseline", "checkpoint", "retest"]
    if list(ko_stages) != expected_stages:
        fail(failures, "stage_inventory:" + ",".join(ko_stages))

    all_axes: set[str] = set()
    fixed_question_rows = 0
    checkpoint_pool_rows = 0

    for stage_name in ko_stages:
        ko_stage = ko_stages[stage_name]
        en_stage = en_stages.get(stage_name)

        if not isinstance(ko_stage, dict) or not isinstance(en_stage, dict):
            fail(failures, f"stage_shape:{stage_name}")
            continue

        if stage_name == "checkpoint":
            checkpoint_pool_rows += validate_checkpoint_stage(
                failures,
                all_axes,
                ko_stage,
                en_stage,
            )
        else:
            fixed_question_rows += validate_fixed_stage(
                failures,
                all_axes,
                ko_stage,
                en_stage,
                stage_name,
            )

    if all_axes != EXPECTED_AXES:
        fail(failures, "axis_inventory:" + ",".join(sorted(all_axes)))

    print(f"DIAGNOSTIC_VERSION={ko.get('version')}")
    print(f"STAGE_COUNT={len(ko_stages)}")
    print(f"FIXED_QUESTION_ROWS={fixed_question_rows}")
    print(f"CHECKPOINT_POOL_ROWS={checkpoint_pool_rows}")
    print(f"TOTAL_VALIDATED_QUESTION_ROWS={fixed_question_rows + checkpoint_pool_rows}")
    print(f"AXIS_COUNT={len(all_axes)}")
    print(f"FAILURE_COUNT={len(failures)}")

    if failures:
        for item in failures[:50]:
            print(f"FAIL={item}")
        raise SystemExit(1)

    print("DIAGNOSTIC_PARITY_VALIDATION_PASS=True")


if __name__ == "__main__":
    main()

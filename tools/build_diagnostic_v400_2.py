import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

KO_ROOT = ROOT / "data" / "lessons"
EN_ROOT = ROOT / "data_i18n" / "en" / "lessons"

OUT_KO = (
    ROOT
    / "data"
    / "diagnostic"
    / "diagnostic_v400_2.json"
)

OUT_EN = (
    ROOT
    / "data_i18n"
    / "en"
    / "diagnostic"
    / "diagnostic_v400_2.json"
)

VERSION = "V400.2_DIAGNOSTIC_V2"

AXES = [
    {
        "id": "value_flow",
        "ko": "값·대입 추적",
        "en": "Values & assignment",
        "keywords": [
            "assignment",
            "name_reference",
            "subscription",
            "variable",
            "value",
            "literal",
            "index",
            "len",
            "item_count",
        ],
    },
    {
        "id": "branch_condition",
        "ko": "조건·분기",
        "en": "Conditions & branching",
        "keywords": [
            "if",
            "else",
            "elif",
            "boolean",
            "condition",
            "branch",
            "guard",
            "comparison",
            "truth",
        ],
    },
    {
        "id": "loop_collection",
        "ko": "반복·컬렉션",
        "en": "Loops & collections",
        "keywords": [
            "for",
            "while",
            "loop",
            "iteration",
            "list",
            "dict",
            "set",
            "tuple",
            "comprehension",
            "enumerate",
            "zip",
        ],
    },
    {
        "id": "function_call_return",
        "ko": "함수 호출·반환",
        "en": "Calls & returns",
        "keywords": [
            "call",
            "function",
            "return",
            "def",
            "parameter",
            "argument",
            "scope",
            "lambda",
        ],
    },
    {
        "id": "file_error_path",
        "ko": "파일·예외·경로",
        "en": "Files, errors & paths",
        "keywords": [
            "file",
            "path",
            "open",
            "exception",
            "try",
            "except",
            "error",
            "encoding",
            "mkdir",
        ],
    },
    {
        "id": "object_module",
        "ko": "객체·모듈",
        "en": "Objects & modules",
        "keywords": [
            "class",
            "object",
            "self",
            "method",
            "inheritance",
            "import",
            "module",
            "package",
            "dataclass",
        ],
    },
    {
        "id": "data_processing",
        "ko": "데이터 처리",
        "en": "Data processing",
        "keywords": [
            "pandas",
            "numpy",
            "dataframe",
            "groupby",
            "merge",
            "regex",
            "jsonl",
            "csv",
            "dedup",
            "sort",
            "filter",
        ],
    },
    {
        "id": "project_flow",
        "ko": "프로젝트 코드 흐름",
        "en": "Project code flow",
        "keywords": [
            "api",
            "http",
            "async",
            "database",
            "sql",
            "git",
            "test",
            "pipeline",
            "architecture",
            "repository",
            "rag",
            "cli",
            "deploy",
        ],
    },
]

BASELINE_LEVELS = [3, 6, 9]
CHECKPOINT_LEVELS = [3, 5, 7, 9]
RETEST_LEVELS = [3, 6, 9]

def load_cards(root):
    cards = {}

    for path in sorted(root.glob("*.json")):
        data = json.loads(
            path.read_text(encoding="utf-8")
        )

        if isinstance(data, list):
            rows = data
        elif (
            isinstance(data, dict)
            and isinstance(data.get("cards"), list)
        ):
            rows = data["cards"]
        else:
            continue

        for card in rows:
            if not isinstance(card, dict):
                continue

            card_id = str(
                card.get("id") or ""
            ).strip()

            if card_id:
                cards[card_id] = card

    return cards

def usable(card):
    choices = card.get("choices")

    return (
        isinstance(choices, list)
        and len(choices) >= 2
        and card.get("answer") is not None
        and bool(
            str(
                card.get("question") or ""
            ).strip()
        )
    )

def card_level(card):
    try:
        return int(card.get("level", 5))
    except Exception:
        return 5

def searchable(card):
    parts = [
        card.get("primary_concept", ""),
        card.get("coverage_domain", ""),
        card.get("pedagogical_intent", ""),
        card.get("title", ""),
    ]

    parts.extend(
        card.get("concepts") or []
    )

    parts.extend(
        card.get("coverage_topics") or []
    )

    return " ".join(
        map(str, parts)
    ).lower()

def concept_score(card, keywords):
    text = searchable(card)
    score = 0

    for keyword in keywords:
        pattern = (
            r"(?<![a-z0-9_])"
            + re.escape(keyword)
            + r"(?![a-z0-9_])"
        )

        if re.search(pattern, text):
            score += 1

    return score

def answer_index(card):
    target = json.dumps(
        card.get("answer"),
        ensure_ascii=False,
        sort_keys=True,
    )

    for index, choice in enumerate(
        card.get("choices") or []
    ):
        value = json.dumps(
            choice,
            ensure_ascii=False,
            sort_keys=True,
        )

        if value == target:
            return index

    return -1

def candidate_rows(
    axis,
    ko_cards,
    en_cards,
    used,
):
    rows = []

    common = (
        set(ko_cards)
        & set(en_cards)
    )

    for card_id in common:
        if card_id in used:
            continue

        ko = ko_cards[card_id]
        en = en_cards[card_id]

        if not usable(ko):
            continue

        if not usable(en):
            continue

        if answer_index(ko) < 0:
            continue

        if answer_index(en) < 0:
            continue

        score = concept_score(
            ko,
            axis["keywords"],
        )

        if score <= 0:
            continue

        rows.append(
            {
                "id": card_id,
                "score": score,
                "level": card_level(ko),
            }
        )

    return rows

def pick_for_targets(
    axis,
    targets,
    ko_cards,
    en_cards,
    used,
):
    picked = []

    for target_level in targets:
        candidates = candidate_rows(
            axis,
            ko_cards,
            en_cards,
            used,
        )

        if not candidates:
            raise RuntimeError(
                "NO_CANDIDATE:"
                + axis["id"]
                + ":"
                + str(target_level)
            )

        candidates.sort(
            key=lambda row: (
                -row["score"],
                abs(
                    row["level"]
                    - target_level
                ),
                row["id"],
            )
        )

        chosen = candidates[0]

        used.add(chosen["id"])
        picked.append(chosen["id"])

    return picked

def select_all(
    ko_cards,
    en_cards,
):
    used = set()
    selected = {}

    for axis in AXES:
        axis_id = axis["id"]

        selected[axis_id] = {
            "baseline": pick_for_targets(
                axis,
                BASELINE_LEVELS,
                ko_cards,
                en_cards,
                used,
            ),
            "checkpoint": pick_for_targets(
                axis,
                CHECKPOINT_LEVELS,
                ko_cards,
                en_cards,
                used,
            ),
            "retest": pick_for_targets(
                axis,
                RETEST_LEVELS,
                ko_cards,
                en_cards,
                used,
            ),
        }

    return selected

def remediation_ids(
    axis,
    ko_cards,
    en_cards,
    excluded,
):
    rows = []

    common = (
        set(ko_cards)
        & set(en_cards)
    )

    for card_id in common:
        if card_id in excluded:
            continue

        ko = ko_cards[card_id]
        en = en_cards[card_id]

        if not usable(ko):
            continue

        if not usable(en):
            continue

        score = concept_score(
            ko,
            axis["keywords"],
        )

        if score <= 0:
            continue

        rows.append(
            {
                "id": card_id,
                "score": score,
                "level": card_level(ko),
            }
        )

    rows.sort(
        key=lambda row: (
            -row["score"],
            row["level"],
            row["id"],
        )
    )

    return [
        row["id"]
        for row in rows[:5]
    ]

def make_question(
    card,
    axis_id,
):
    index = answer_index(card)

    if index < 0:
        raise RuntimeError(
            "ANSWER_INDEX_NOT_FOUND:"
            + str(card.get("id"))
        )

    return {
        "id": "DIA_" + str(card["id"]),
        "source_card_id": str(card["id"]),
        "axis": axis_id,
        "level": card.get("level"),
        "title": card.get("title", ""),
        "code": card.get("code", ""),
        "question": card.get("question", ""),
        "choices": card.get("choices") or [],
        "correct_index": index,
    }

def round_robin_questions(
    cards,
    selected,
    stage,
    count_per_axis,
):
    result = []

    for position in range(
        count_per_axis
    ):
        for axis in AXES:
            axis_id = axis["id"]

            card_id = (
                selected[axis_id][stage][
                    position
                ]
            )

            result.append(
                make_question(
                    cards[card_id],
                    axis_id,
                )
            )

    return result

def checkpoint_pool(
    cards,
    selected,
):
    result = {}

    for axis in AXES:
        axis_id = axis["id"]

        result[axis_id] = [
            make_question(
                cards[card_id],
                axis_id,
            )
            for card_id
            in selected[axis_id][
                "checkpoint"
            ]
        ]

    return result

def build_payload(
    language,
    cards,
    ko_cards,
    en_cards,
    selected,
    remediation,
):
    axes = []

    for axis in AXES:
        axis_id = axis["id"]

        ids = remediation[axis_id]

        axes.append(
            {
                "id": axis_id,
                "label": axis[language],
                "remediation": [
                    {
                        "id": card_id,
                        "title": cards[
                            card_id
                        ].get(
                            "title",
                            "",
                        ),
                        "level": cards[
                            card_id
                        ].get(
                            "level"
                        ),
                    }
                    for card_id in ids
                    if card_id in cards
                ],
            }
        )

    return {
        "version": VERSION,
        "language": language,
        "axis_count": 8,
        "stages": {
            "baseline": {
                "id": "baseline",
                "form": "A",
                "question_count": 24,
                "questions": (
                    round_robin_questions(
                        cards,
                        selected,
                        "baseline",
                        3,
                    )
                ),
            },
            "checkpoint": {
                "id": "checkpoint",
                "question_count_min": 6,
                "question_count_max": 8,
                "pool_per_axis": 4,
                "pool": checkpoint_pool(
                    cards,
                    selected,
                ),
            },
            "retest": {
                "id": "retest",
                "form": "B",
                "question_count": 24,
                "questions": (
                    round_robin_questions(
                        cards,
                        selected,
                        "retest",
                        3,
                    )
                ),
            },
        },
        "axes": axes,
    }

def stage_ids(payload):
    baseline = {
        row["source_card_id"]
        for row in payload[
            "stages"
        ]["baseline"]["questions"]
    }

    retest = {
        row["source_card_id"]
        for row in payload[
            "stages"
        ]["retest"]["questions"]
    }

    checkpoint = set()

    for rows in payload[
        "stages"
    ]["checkpoint"]["pool"].values():
        checkpoint.update(
            row["source_card_id"]
            for row in rows
        )

    return (
        baseline,
        checkpoint,
        retest,
    )

def all_questions(payload):
    rows = []

    rows.extend(
        payload["stages"][
            "baseline"
        ]["questions"]
    )

    for axis_rows in payload[
        "stages"
    ]["checkpoint"]["pool"].values():
        rows.extend(axis_rows)

    rows.extend(
        payload["stages"][
            "retest"
        ]["questions"]
    )

    return rows

def main():
    ko_cards = load_cards(
        KO_ROOT
    )

    en_cards = load_cards(
        EN_ROOT
    )

    print(
        "KO_CARD_COUNT="
        + str(len(ko_cards))
    )

    print(
        "EN_CARD_COUNT="
        + str(len(en_cards))
    )

    selected = select_all(
        ko_cards,
        en_cards,
    )

    selected_ids = {
        card_id
        for axis_rows
        in selected.values()
        for stage_rows
        in axis_rows.values()
        for card_id
        in stage_rows
    }

    remediation = {}

    for axis in AXES:
        remediation[
            axis["id"]
        ] = remediation_ids(
            axis,
            ko_cards,
            en_cards,
            selected_ids,
        )

    ko_payload = build_payload(
        "ko",
        ko_cards,
        ko_cards,
        en_cards,
        selected,
        remediation,
    )

    en_payload = build_payload(
        "en",
        en_cards,
        ko_cards,
        en_cards,
        selected,
        remediation,
    )

    ko_base, ko_check, ko_retest = (
        stage_ids(ko_payload)
    )

    overlap = (
        (ko_base & ko_check)
        | (ko_base & ko_retest)
        | (ko_check & ko_retest)
    )

    if overlap:
        raise RuntimeError(
            "STAGE_OVERLAP:"
            + ",".join(
                sorted(overlap)
            )
        )

    if len(ko_base) != 24:
        raise RuntimeError(
            "BASELINE_COUNT"
        )

    if len(ko_check) != 32:
        raise RuntimeError(
            "CHECKPOINT_POOL_COUNT"
        )

    if len(ko_retest) != 24:
        raise RuntimeError(
            "RETEST_COUNT"
        )

    ko_questions = all_questions(
        ko_payload
    )

    en_questions = all_questions(
        en_payload
    )

    if len(ko_questions) != 80:
        raise RuntimeError(
            "KO_TOTAL_SELECTED"
        )

    if len(en_questions) != 80:
        raise RuntimeError(
            "EN_TOTAL_SELECTED"
        )

    parity_failures = []

    for ko_q, en_q in zip(
        ko_questions,
        en_questions,
    ):
        if (
            ko_q["source_card_id"]
            != en_q["source_card_id"]
        ):
            parity_failures.append(
                "source_card_id"
            )
            continue

        card_id = ko_q[
            "source_card_id"
        ]

        if ko_q["axis"] != en_q["axis"]:
            parity_failures.append(
                card_id + ":axis"
            )

        if (
            ko_q["correct_index"]
            != en_q["correct_index"]
        ):
            parity_failures.append(
                card_id
                + ":correct_index"
            )

        if (
            ko_cards[card_id].get(
                "code"
            )
            != en_cards[card_id].get(
                "code"
            )
        ):
            parity_failures.append(
                card_id + ":code"
            )

    if parity_failures:
        for item in parity_failures:
            print(
                "PARITY_FAIL="
                + item
            )

        raise SystemExit(20)

    OUT_KO.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    OUT_EN.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    OUT_KO.write_text(
        json.dumps(
            ko_payload,
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    OUT_EN.write_text(
        json.dumps(
            en_payload,
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    print(
        "BASELINE_FORM_A=24"
    )

    print(
        "CHECKPOINT_POOL=32"
    )

    print(
        "CHECKPOINT_RUNTIME_RANGE=6-8"
    )

    print(
        "RETEST_FORM_B=24"
    )

    print(
        "SELECTED_UNIQUE_CARDS="
        + str(
            len(
                ko_base
                | ko_check
                | ko_retest
            )
        )
    )

    print(
        "STAGE_OVERLAP="
        + str(len(overlap))
    )

    print(
        "KO_EN_PARITY_FAILURES="
        + str(
            len(
                parity_failures
            )
        )
    )

    for axis in AXES:
        axis_id = axis["id"]
        row = selected[axis_id]

        print(
            "AXIS="
            + axis_id
            + "|A="
            + ",".join(
                row["baseline"]
            )
            + "|C="
            + ",".join(
                row["checkpoint"]
            )
            + "|B="
            + ",".join(
                row["retest"]
            )
        )

    print(
        "STATUS="
        "STAGED_DIAGNOSTIC_DATA_V2_PASS"
    )

if __name__ == "__main__":
    main()
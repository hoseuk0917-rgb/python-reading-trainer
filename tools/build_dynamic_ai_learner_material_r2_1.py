from __future__ import annotations

import argparse
import json
import os
import re
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "data" / "dynamic_feed" / "enriched_r2_canary.jsonl"
DEFAULT_OUTPUT = ROOT / "data" / "dynamic_feed" / "learner_r2_1_canary.jsonl"

INPUT_SCHEMA = "python-reading-trainer/dynamic-ai-semantic-enrichment-v1"
OUTPUT_SCHEMA = "python-reading-trainer/dynamic-ai-learner-material-v1"
PROMPT_VERSION = "dynamic-ai-learner-r2-1-v1"
DEFAULT_MODEL = "gpt-6.1-sol"
OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"

ELIGIBLE_DISPOSITIONS = {"KEEP", "CASE_STUDY"}
DIFFICULTIES = ("EASY", "MEDIUM", "HARD")


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def clean_space(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def load_primary_concepts() -> list[str]:
    concepts: set[str] = set()

    for path in sorted((ROOT / "data" / "lessons").glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8-sig"))

        if not isinstance(payload, list):
            continue

        for row in payload:
            concept = row.get("primary_concept")
            if isinstance(concept, str) and concept.strip():
                concepts.add(concept.strip())

    if not concepts:
        raise SystemExit("no primary concepts found")

    return sorted(concepts)


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.is_file():
        raise SystemExit(f"input not found: {path}")

    rows: list[dict[str, Any]] = []
    ids: set[str] = set()

    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue

        row = json.loads(line)

        if row.get("schema") != INPUT_SCHEMA:
            raise SystemExit(f"unexpected input schema at line {line_number}")

        item_id = row.get("id")

        if not isinstance(item_id, str) or not item_id:
            raise SystemExit(f"input id missing at line {line_number}")

        if item_id in ids:
            raise SystemExit(f"duplicate input id: {item_id}")

        ids.add(item_id)
        rows.append(row)

    return rows


def read_existing_output(path: Path) -> set[str]:
    if not path.is_file():
        return set()

    ids: set[str] = set()

    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue

        row = json.loads(line)

        if row.get("schema") != OUTPUT_SCHEMA:
            raise SystemExit(f"unexpected output schema at line {line_number}")

        item_id = row.get("id")

        if not isinstance(item_id, str) or not item_id:
            raise SystemExit(f"output id missing at line {line_number}")

        if item_id in ids:
            raise SystemExit(f"duplicate output id: {item_id}")

        ids.add(item_id)

    return ids


def append_jsonl(path: Path, row: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)

    with path.open("a", encoding="utf-8", newline="\n") as handle:
        handle.write(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n")


def schema_for(concepts: list[str]) -> dict[str, Any]:
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "difficulty": {
                "type": "string",
                "enum": list(DIFFICULTIES),
            },
            "title_ko": {
                "type": "string",
            },
            "easy_one_liner_ko": {
                "type": "string",
            },
            "intuitive_explanation_ko": {
                "type": "string",
            },
            "why_it_is_interesting_ko": {
                "type": "string",
            },
            "terms": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "term": {"type": "string"},
                        "easy_meaning_ko": {"type": "string"},
                    },
                    "required": ["term", "easy_meaning_ko"],
                },
            },
            "python_connections": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "concept_id": {
                            "type": "string",
                            "enum": concepts,
                        },
                        "connection_ko": {
                            "type": "string",
                        },
                    },
                    "required": ["concept_id", "connection_ko"],
                },
            },
            "deeper_explanation_ko": {
                "type": "string",
            },
            "source_boundary_ko": {
                "type": "string",
            },
            "check_question_ko": {
                "type": "string",
            },
            "check_answer_ko": {
                "type": "string",
            },
        },
        "required": [
            "difficulty",
            "title_ko",
            "easy_one_liner_ko",
            "intuitive_explanation_ko",
            "why_it_is_interesting_ko",
            "terms",
            "python_connections",
            "deeper_explanation_ko",
            "source_boundary_ko",
            "check_question_ko",
            "check_answer_ko",
        ],
    }


def extract_output_text(response: dict[str, Any]) -> str:
    parts: list[str] = []

    for item in response.get("output") or []:
        if item.get("type") != "message":
            continue

        for content in item.get("content") or []:
            if content.get("type") == "output_text":
                value = content.get("text")
                if isinstance(value, str):
                    parts.append(value)

    text = "".join(parts).strip()

    if not text:
        raise RuntimeError("OpenAI response contained no output_text")

    return text


def validate_material(
    material: dict[str, Any],
    *,
    allowed_concepts: set[str],
    source_concepts: set[str],
) -> None:
    if material.get("difficulty") not in DIFFICULTIES:
        raise RuntimeError("invalid difficulty")

    for key in (
        "title_ko",
        "easy_one_liner_ko",
        "intuitive_explanation_ko",
        "why_it_is_interesting_ko",
        "deeper_explanation_ko",
        "source_boundary_ko",
        "check_question_ko",
        "check_answer_ko",
    ):
        value = material.get(key)

        if not isinstance(value, str) or not value.strip():
            raise RuntimeError(f"{key} must be non-empty")

    terms = material.get("terms")

    if not isinstance(terms, list):
        raise RuntimeError("terms must be a list")

    for term in terms:
        if not isinstance(term, dict):
            raise RuntimeError("term item must be an object")

        if not clean_space(str(term.get("term") or "")):
            raise RuntimeError("term name missing")

        if not clean_space(str(term.get("easy_meaning_ko") or "")):
            raise RuntimeError("term explanation missing")

    connections = material.get("python_connections")

    if not isinstance(connections, list):
        raise RuntimeError("python_connections must be a list")

    seen: set[str] = set()

    for connection in connections:
        if not isinstance(connection, dict):
            raise RuntimeError("python connection must be an object")

        concept_id = connection.get("concept_id")

        if concept_id not in allowed_concepts:
            raise RuntimeError(f"unknown concept id: {concept_id}")

        if concept_id not in source_concepts:
            raise RuntimeError(
                f"learner layer introduced unapproved concept id: {concept_id}"
            )

        if concept_id in seen:
            raise RuntimeError(f"duplicate python concept: {concept_id}")

        seen.add(concept_id)

        if not clean_space(str(connection.get("connection_ko") or "")):
            raise RuntimeError(f"python connection explanation missing: {concept_id}")


def build_prompt(row: dict[str, Any]) -> str:
    enrichment = row.get("enrichment") or {}

    return "\n".join(
        [
            "You are writing the learner-facing layer for Python Reading Trainer's Dynamic AI Learning Feed.",
            "",
            "The semantic curation stage has already checked the official source.",
            "Use ONLY the supplied curated material below.",
            "Do not add new factual claims, API syntax, benchmark numbers, dates, capabilities, or implementation details.",
            "Do not repair or infer missing source details.",
            "",
            "Target reader:",
            "- A Korean beginner learning Python and AI.",
            "- They may not know AI research jargon.",
            "- They should understand the first two fields without knowing the technical terms in advance.",
            "",
            "Writing order:",
            "1. Easy one-line meaning.",
            "2. Intuitive explanation with a simple concrete example or analogy when useful.",
            "3. Why this item is interesting now.",
            "4. Explain only the technical terms actually needed.",
            "5. Connect only the approved Python concepts supplied in suggested_concepts.",
            "6. Then give a slightly deeper technical explanation.",
            "7. State clearly what the source does NOT establish.",
            "8. End with one very short comprehension question and answer.",
            "",
            "Rules:",
            "- Prefer short Korean sentences.",
            "- Never begin with unexplained acronyms or specialist terms.",
            "- Do not create code examples in this stage.",
            "- Do not force a Python connection when suggested_concepts is empty.",
            "- python_connections may only use concept ids already present in suggested_concepts.",
            "- If disposition is CASE_STUDY, frame it as an applied example rather than a new technical capability.",
            "- Preserve uncertainty and risk notes.",
            "",
            "CURATED ITEM:",
            json.dumps(
                {
                    "id": row.get("id"),
                    "title": row.get("title"),
                    "source_name": row.get("source_name"),
                    "published_at": row.get("published_at"),
                    "disposition": enrichment.get("disposition"),
                    "category": enrichment.get("category"),
                    "learning_value": enrichment.get("learning_value"),
                    "quick_take_ko": enrichment.get("quick_take_ko"),
                    "why_it_matters_ko": enrichment.get("why_it_matters_ko"),
                    "learning_angle_ko": enrichment.get("learning_angle_ko"),
                    "source_grounded_claims": enrichment.get("source_grounded_claims"),
                    "suggested_concepts": enrichment.get("suggested_concepts"),
                    "learner_question_ko": enrichment.get("learner_question_ko"),
                    "risk_notes": enrichment.get("risk_notes"),
                },
                ensure_ascii=False,
                indent=2,
            ),
        ]
    )


def openai_request(
    *,
    api_key: str,
    model: str,
    prompt: str,
    schema: dict[str, Any],
    timeout: int,
) -> dict[str, Any]:
    body = {
        "model": model,
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": prompt,
                    }
                ],
            }
        ],
        "reasoning": {
            "effort": "low",
        },
        "text": {
            "verbosity": "low",
            "format": {
                "type": "json_schema",
                "name": "dynamic_ai_learner_material_r2_1",
                "description": "Beginner-friendly grounded learning material.",
                "strict": True,
                "schema": schema,
            },
        },
        "max_output_tokens": 12000,
    }

    request = urllib.request.Request(
        OPENAI_RESPONSES_URL,
        data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "python-reading-trainer-dynamic-feed-r2-1/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        body_text = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"OpenAI HTTP {exc.code}: {clean_space(body_text)[:1000]}"
        ) from exc

    return json.loads(raw)


def self_test() -> int:
    concepts = ["call", "argument_passing", "literal"]
    schema = schema_for(concepts)

    assert schema["additionalProperties"] is False
    assert (
        schema["properties"]["python_connections"]["items"]["properties"]["concept_id"]["enum"]
        == concepts
    )

    material = {
        "difficulty": "EASY",
        "title_ko": "선택지를 판단하는 AI API",
        "easy_one_liner_ko": "긴 답 대신 여러 선택지 중 무엇이 맞는지 판단하게 하는 기능입니다.",
        "intuitive_explanation_ko": "사진 한 장을 보고 여러 예·아니요 질문에 답하게 하는 것과 비슷합니다.",
        "why_it_is_interesting_ko": "함수 호출과 인자 전달이 실제 AI 서비스에서 어떻게 쓰이는지 볼 수 있습니다.",
        "terms": [
            {
                "term": "API",
                "easy_meaning_ko": "프로그램끼리 정해진 방식으로 요청하고 답을 주고받는 통로입니다.",
            }
        ],
        "python_connections": [
            {
                "concept_id": "call",
                "connection_ko": "기능을 실행하기 위해 함수를 호출하는 구조와 연결됩니다.",
            }
        ],
        "deeper_explanation_ko": "여러 질문을 하나의 입력에 함께 적용하는 구조를 살펴볼 수 있습니다.",
        "source_boundary_ko": "제공된 자료만으로 모든 실제 사용 조건을 확인할 수는 없습니다.",
        "check_question_ko": "이 기능은 긴 글을 생성하는 데 초점이 있나요?",
        "check_answer_ko": "아니요. 여러 선택지를 평가하는 데 초점이 있습니다.",
    }

    validate_material(
        material,
        allowed_concepts=set(concepts),
        source_concepts={"call", "argument_passing"},
    )

    fake_response = {
        "output": [
            {
                "type": "message",
                "content": [
                    {
                        "type": "output_text",
                        "text": '{"difficulty":"EASY"}',
                    }
                ],
            }
        ]
    }

    assert extract_output_text(fake_response) == '{"difficulty":"EASY"}'

    print("DYNAMIC_AI_LEARNER_R2_1_SELF_TEST=PASS")
    return 0


def plan(input_path: Path) -> int:
    rows = read_jsonl(input_path)
    eligible = [
        row
        for row in rows
        if (row.get("enrichment") or {}).get("disposition")
        in ELIGIBLE_DISPOSITIONS
    ]

    print(f"R2_INPUT_COUNT={len(rows)}")
    print(f"R2_1_ELIGIBLE_COUNT={len(eligible)}")

    for index, row in enumerate(eligible, start=1):
        enrichment = row.get("enrichment") or {}
        print(
            f"R2_1_PLAN_ITEM={index}|{row['id']}|"
            f"{enrichment.get('disposition')}|{clean_space(row.get('title') or '')}"
        )

    print("API_CALL_PERFORMED=NO")
    print("DYNAMIC_AI_LEARNER_R2_1_PLAN=PASS")
    return 0


def live(
    *,
    input_path: Path,
    output_path: Path,
    model: str,
    timeout: int,
) -> int:
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()

    if not api_key:
        raise SystemExit("OPENAI_API_KEY is required for --live")

    rows = read_jsonl(input_path)
    concepts = load_primary_concepts()
    allowed_concepts = set(concepts)
    existing_ids = read_existing_output(output_path)

    eligible = [
        row
        for row in rows
        if (row.get("enrichment") or {}).get("disposition")
        in ELIGIBLE_DISPOSITIONS
    ]

    schema = schema_for(concepts)

    completed = 0
    skipped = 0
    total_input_tokens = 0
    total_output_tokens = 0

    for row in eligible:
        item_id = row["id"]

        if item_id in existing_ids:
            print(f"R2_1_ITEM={item_id}|SKIP=ALREADY_GENERATED")
            skipped += 1
            continue

        enrichment = row.get("enrichment") or {}
        source_concepts = set(enrichment.get("suggested_concepts") or [])

        prompt = build_prompt(row)

        response = openai_request(
            api_key=api_key,
            model=model,
            prompt=prompt,
            schema=schema,
            timeout=timeout,
        )

        if response.get("status") not in {"completed", None}:
            incomplete = response.get("incomplete_details") or {}
            usage = response.get("usage") or {}
            output_details = usage.get("output_tokens_details") or {}
            raise RuntimeError(
                "response not completed for "
                f"{item_id}: status={response.get('status')}, "
                f"reason={incomplete.get('reason') or 'unknown'}, "
                f"input_tokens={int(usage.get('input_tokens') or 0)}, "
                f"output_tokens={int(usage.get('output_tokens') or 0)}, "
                f"reasoning_tokens={int(output_details.get('reasoning_tokens') or 0)}"
            )

        material = json.loads(extract_output_text(response))

        validate_material(
            material,
            allowed_concepts=allowed_concepts,
            source_concepts=source_concepts,
        )

        usage = response.get("usage") or {}
        input_tokens = int(usage.get("input_tokens") or 0)
        output_tokens = int(usage.get("output_tokens") or 0)

        total_input_tokens += input_tokens
        total_output_tokens += output_tokens

        output_row = {
            "schema": OUTPUT_SCHEMA,
            "id": item_id,
            "source_id": row.get("source_id"),
            "source_name": row.get("source_name"),
            "title": row.get("title"),
            "url": row.get("url"),
            "published_at": row.get("published_at"),
            "source_r2_response_id": row.get("response_id"),
            "source_r2_prompt_version": row.get("prompt_version"),
            "source_r2_disposition": enrichment.get("disposition"),
            "source_r2_category": enrichment.get("category"),
            "prompt_version": PROMPT_VERSION,
            "model": model,
            "response_id": response.get("id") or "",
            "generated_at": utc_now(),
            "usage": {
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "total_tokens": int(usage.get("total_tokens") or 0),
            },
            "material": material,
        }

        append_jsonl(output_path, output_row)
        existing_ids.add(item_id)
        completed += 1

        print(
            f"R2_1_ITEM={item_id}|DIFFICULTY={material['difficulty']}|"
            f"INPUT_TOKENS={input_tokens}|OUTPUT_TOKENS={output_tokens}"
        )

    print(f"R2_1_COMPLETED_COUNT={completed}")
    print(f"R2_1_SKIPPED_COUNT={skipped}")
    print(f"R2_1_TOTAL_INPUT_TOKENS={total_input_tokens}")
    print(f"R2_1_TOTAL_OUTPUT_TOKENS={total_output_tokens}")
    print(f"R2_1_OUTPUT={output_path}")
    print("DYNAMIC_AI_LEARNER_R2_1_LIVE=PASS")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--timeout", type=int, default=120)
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--plan", action="store_true")
    parser.add_argument("--live", action="store_true")
    args = parser.parse_args()

    modes = sum(bool(value) for value in (args.self_test, args.plan, args.live))

    if modes != 1:
        parser.error("choose exactly one of --self-test, --plan, or --live")

    if args.self_test:
        return self_test()

    if args.plan:
        return plan(args.input)

    return live(
        input_path=args.input,
        output_path=args.output,
        model=args.model,
        timeout=args.timeout,
    )


if __name__ == "__main__":
    raise SystemExit(main())

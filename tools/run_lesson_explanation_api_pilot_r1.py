from __future__ import annotations

import argparse
import codecs
import hashlib
import json
import os
import re
import time
import urllib.error
import urllib.request
from collections import defaultdict
from pathlib import Path
from typing import Any

import audit_explanation_readiness_r1 as readiness

ROOT = Path(__file__).resolve().parents[1]
LESSON_ROOT_KO = ROOT / "data" / "lessons"
LESSON_ROOT_EN = ROOT / "data_i18n" / "en" / "lessons"
SUPPORT_KO = ROOT / "data" / "runtime" / "support_bundle_v400_5.json"
SUPPORT_EN = ROOT / "data_i18n" / "en" / "runtime" / "support_bundle_v400_5.json"
CONTRACT_PATH = ROOT / "docs" / "LESSON_EXPLANATION_CONTRACT_V1.md"

DEFAULT_MODEL = "gpt-6.1-sol"
OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"
PROMPT_VERSION = "lesson-explanation-api-pilot-r1-v2"
RESULT_SCHEMA = "python-reading-trainer/lesson-explanation-api-pilot-r1"

TARGET_DISPOSITIONS = {
    "CONCEPT_EXPLANATION_REWRITE",
    "WALKTHROUGH_OR_ANSWER_REWRITE",
}
SAFE_AUTHORITIES = {
    "PYTHON_LANGUAGE_AUTHORITY",
    "LOCAL_CODE_AUTHORITY",
}
REVIEW_AUTHORITIES = {
    "AUTHORITY_REVIEW",
    "DOMAIN_AUTHORITY_REVIEW",
}

CONCEPT_REASONS = {
    "MISSING_CONCEPT_EXPLANATION",
    "EASY_OR_DEFINITION_THIN",
    "EASY_BRIDGE_REVIEW",
    "MENTAL_MODEL_OR_READ_GUIDE_THIN",
    "MISSING_KEY_POINT",
    "MISSING_CONFUSION",
}
TEACHING_REASONS = {
    "MISSING_TEACHING_EXAMPLE",
    "WALKTHROUGH_THIN",
}
ANSWER_REASONS = {
    "ANSWER_TRACE_THIN",
    "WHY_CORRECT_THIN",
    "WRONG_CHOICE_REASONING_THIN",
    "TAKEAWAY_THIN",
}

GOLD_IDS = {
    # Initial 10-card V1 canary.
    "PYF94_A1_L01_VAR_001",
    "PYF94_A1_L01_PRINT_001",
    "PYF94_A1_L01_INPUT_001",
    "L01_len_001",
    "PY3_L03_strip_001",
    "PYF94_A2_L02_IF_001",
    "PYF94_A2_L02_LOOP_001",
    "PYF94_A2_L02_LIST_001",
    "PYF95_A1_FUNC_004_PARAM_STRING",
    "PYF95_A1_FUNC_003_RETURN_ASSIGN",
    # Assignment A1.
    "PYV96_A1_REVIEW_001_VAR_REASSIGN",
    "PYV96_A2_NOTE_001_ASSIGNMENT_TRACE",
    "PYF94_A1_L01_PRINT_009",
    "PYF94_A1_L01_PRINT_012",
    "PYF94_A1_L01_VAR_002",
    "PYF94_A1_L01_VAR_003",
    "PYF94_A1_L01_VAR_004",
    "PYF94_A1_L01_VAR_005",
    "PYF94_A1_L01_VAR_008",
    "PYF94_A1_L01_VAR_011",
    "PY10_L01_variable_001",
    "PY10_L01_reassign_001",
    # Assignment A2.
    "L02_var_flow_001",
    "PY58_L09_publish_step_001",
    "PY103_L09_cuda_oom_batch_001",
    "PY32_L10_config_location_001",
    "PYF94_A2_L02_LOOP_012",
    "PYF94_A2_L02_LOOP_015",
    "PYF95_A4_FILE_010_WITH_SCOPE",
    "PYV96_A3_SCOPE_005_LOCAL_DOES_NOT_CHANGE_OUTER",
    "PY48_L07_setup_python_action_001",
    # Representative R3 expansion.
    "PYF95_A1_FUNC_002_DEF_NOT_CALLED",
    "PYF95_A1_FUNC_005_TWO_ARGUMENTS",
    "PYF95_A1_FUNC_008_RETURN_NO_PRINT",
    "PYF95_A2_DTS_026_SET_UNION",
    "PYF95_A4_FILE_001_OPEN_READ_ALL",
    "PYF95_A4_FILE_004_STRIP_LINES",
    "PYF95_A4_FILE_017_TRY_EXCEPT_VALUE_ERROR",
    "PYF95_A4_FILE_020_EXCEPTION_AS_E",
    "PYF95_A4_FILE_032_CHOOSE_PATHLIB_REASON",
    "PY121_L04_RESPONSE_TEXT_DEBUG_001",
    "PY11_L06_datetime_now_001",
    "PY122_L04_READ_CSV_BASIC_001",
    "PY26_L07_async_await_basic_001",
    "PYF95_A5_OOP_001_CLASS_ONLY",
    "PYF95_A5_OOP_004_CHANGE_ATTRIBUTE",
}

if len(GOLD_IDS) != 46:
    raise RuntimeError(f"unexpected GOLD id count: {len(GOLD_IDS)}")


def clean_space(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def load_all_cards(root: Path) -> tuple[dict[str, dict[str, Any]], dict[str, list[dict[str, Any]]]]:
    by_id: dict[str, dict[str, Any]] = {}
    by_file: dict[str, list[dict[str, Any]]] = {}

    for path in sorted(root.glob("*.json")):
        payload = load_json(path)
        if not isinstance(payload, list):
            continue

        rows: list[dict[str, Any]] = []

        for index, card in enumerate(payload):
            if not isinstance(card, dict) or not card.get("id"):
                continue
            row = dict(card)
            row["_file"] = path.name
            row["_index"] = index
            cid = str(row["id"])
            if cid in by_id:
                raise SystemExit(f"duplicate card id under {root}: {cid}")
            by_id[cid] = row
            rows.append(row)

        by_file[path.name] = rows

    return by_id, by_file


def load_support_index(path: Path) -> dict[str, dict[str, Any]]:
    payload = load_json(path)
    out: dict[str, dict[str, Any]] = {}

    for filename, rows in (payload.get("files") or {}).items():
        if not isinstance(rows, list):
            continue
        for row in rows:
            if not isinstance(row, dict) or not row.get("id"):
                continue
            cid = str(row["id"])
            item = dict(row)
            item["_file"] = filename
            out[cid] = item

    return out


def authority_and_reasons(card: dict[str, Any]) -> tuple[str, list[str], str]:
    authority = readiness.authority_class(card)
    reasons = readiness.quality_reasons(card)
    disposition = readiness.disposition(reasons, authority)
    return authority, reasons, disposition


def patch_targets_for(reasons: list[str]) -> list[str]:
    reasons_set = set(reasons)
    targets: list[str] = []

    if reasons_set & CONCEPT_REASONS:
        targets.append("concept_explanation")

    if (
        reasons_set & TEACHING_REASONS
        or any(reason.startswith("TEACHING_EXAMPLE_") for reason in reasons)
    ):
        targets.append("teaching_example")

    if reasons_set & ANSWER_REASONS:
        targets.append("answer_explanation")

    return targets


def round_robin(rows: list[dict[str, Any]], limit: int) -> list[dict[str, Any]]:
    buckets: dict[str, list[dict[str, Any]]] = defaultdict(list)

    for row in rows:
        buckets[str(row.get("primary_concept") or "UNKNOWN")].append(row)

    for values in buckets.values():
        values.sort(key=lambda row: (int(row.get("level") or 999), str(row["id"])))

    keys = sorted(buckets)
    selected: list[dict[str, Any]] = []

    while len(selected) < limit:
        progressed = False
        for key in keys:
            if buckets[key]:
                selected.append(buckets[key].pop(0))
                progressed = True
                if len(selected) >= limit:
                    break
        if not progressed:
            break

    return selected


def select_pilot(limit: int) -> list[dict[str, Any]]:
    if limit < 1 or limit > 425:
        raise SystemExit("rewrite batch limit must be between 1 and 425")

    concept_rows: list[dict[str, Any]] = []
    answer_rows: list[dict[str, Any]] = []

    for card in readiness.load_cards():
        cid = str(card["id"])
        if cid in GOLD_IDS:
            continue

        authority, reasons, disposition = authority_and_reasons(card)
        if authority not in SAFE_AUTHORITIES:
            continue
        if disposition not in TARGET_DISPOSITIONS:
            continue

        row = dict(card)
        row["_authority"] = authority
        row["_reasons"] = list(reasons)
        row["_disposition"] = disposition
        row["_patch_targets"] = patch_targets_for(reasons)

        if not row["_patch_targets"]:
            raise SystemExit(f"no patch target for selected rewrite card: {cid}")

        if disposition == "CONCEPT_EXPLANATION_REWRITE":
            concept_rows.append(row)
        elif disposition == "WALKTHROUGH_OR_ANSWER_REWRITE":
            answer_rows.append(row)

    concept_target = round(limit * 266 / 425)
    answer_target = limit - concept_target

    concept_selected = round_robin(concept_rows, min(concept_target, len(concept_rows)))
    answer_selected = round_robin(answer_rows, min(answer_target, len(answer_rows)))

    selected = concept_selected + answer_selected

    if len(selected) < limit:
        selected_ids = {str(row["id"]) for row in selected}
        leftovers = [
            row
            for row in concept_rows + answer_rows
            if str(row["id"]) not in selected_ids
        ]
        selected.extend(round_robin(leftovers, limit - len(selected)))

    if len(selected) != limit:
        raise SystemExit(
            f"not enough safe rewrite candidates: requested={limit} selected={len(selected)}"
        )

    order = {
        "CONCEPT_EXPLANATION_REWRITE": 0,
        "WALKTHROUGH_OR_ANSWER_REWRITE": 1,
    }
    selected.sort(
        key=lambda row: (
            order.get(str(row["_disposition"]), 9),
            str(row.get("primary_concept") or ""),
            int(row.get("level") or 999),
            str(row["id"]),
        )
    )
    return selected


def select_explicit(selection_ids: list[str]) -> list[dict[str, Any]]:
    if not selection_ids:
        raise SystemExit("explicit selection may not be empty")
    if len(selection_ids) != len(set(selection_ids)):
        raise SystemExit("explicit selection contains duplicate card IDs")

    by_id = {
        str(card["id"]): card
        for card in readiness.load_cards()
    }
    selected: list[dict[str, Any]] = []

    for cid in selection_ids:
        card = by_id.get(cid)
        if card is None:
            raise SystemExit(f"explicit selection card not found: {cid}")
        if cid in GOLD_IDS:
            raise SystemExit(f"explicit selection may not rewrite GOLD card: {cid}")

        authority, reasons, disposition = authority_and_reasons(card)
        if authority not in REVIEW_AUTHORITIES:
            raise SystemExit(
                f"explicit local-evidence selection requires review authority: "
                f"{cid} authority={authority}"
            )
        if disposition not in TARGET_DISPOSITIONS:
            raise SystemExit(
                f"explicit selection is not a current rewrite candidate: "
                f"{cid} disposition={disposition}"
            )

        row = dict(card)
        row["_authority"] = authority
        row["_reasons"] = list(reasons)
        row["_disposition"] = disposition
        row["_patch_targets"] = patch_targets_for(reasons)

        if not row["_patch_targets"]:
            raise SystemExit(f"no patch target for explicit rewrite card: {cid}")
        if "teaching_example" in row["_patch_targets"]:
            raise SystemExit(
                f"explicit local-evidence selection may not rewrite teaching examples: {cid}"
            )

        selected.append(row)

    return selected


def local_evidence_instructions(authority: str) -> list[str]:
    if authority not in REVIEW_AUTHORITIES:
        return []
    return [
        "",
        "LOCAL EVIDENCE MODE — MANDATORY:",
        "- The current card code, frozen question/answer, current explanations, connected support, and contract are the factual boundary.",
        "- Coverage-domain labels and names such as FastAPI, OAuth, RAG, PWA, HTTP, model, service, or worker are context labels, not permission to add external product/framework behavior.",
        "- Do not add or strengthen claims about real APIs, protocols, lifecycles, security properties, architecture best practices, or library behavior unless that behavior is explicitly encoded in the supplied card/support evidence.",
        "- For concept_explanation rewrites, preserve the current factual meaning and add the beginner bridge; do not broaden the claim.",
        "- For answer_explanation rewrites, derive every step from visible Python execution, local values, branches, calls, assignments, and returns.",
        "- Treat undefined helper names as opaque local functions. You may describe only the dataflow visible in this code, not their hidden implementation.",
        "- If a domain rationale is not derivable from the supplied evidence, omit that rationale and explain the Python/code-level reason instead.",
    ]


def public_card(card: dict[str, Any]) -> dict[str, Any]:
    keys = [
        "id",
        "level",
        "title",
        "primary_concept",
        "concepts",
        "reading_goal",
        "code",
        "question_type",
        "question",
        "choices",
        "answer",
        "focus_span",
        "focus_mode",
        "coverage_domain",
        "coverage_topics",
        "pedagogical_intent",
        "side_card_ids",
        "concept_explanation",
        "teaching_example",
        "answer_explanation",
    ]
    return {key: card.get(key) for key in keys if key in card}


def support_for(card: dict[str, Any], index: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for sid in card.get("side_card_ids") or []:
        item = index.get(str(sid))
        if item:
            out.append(
                {
                    key: value
                    for key, value in item.items()
                    if not key.startswith("_")
                }
            )
    return out


def build_gold_by_primary(cards: dict[str, dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    out: dict[str, list[dict[str, Any]]] = defaultdict(list)
    missing = sorted(cid for cid in GOLD_IDS if cid not in cards)
    if missing:
        raise SystemExit(f"GOLD ids missing from current corpus: {missing}")

    for cid in sorted(GOLD_IDS):
        card = cards[cid]
        out[str(card.get("primary_concept") or "")].append(card)

    return out


def one_gold_reference(
    target: dict[str, Any],
    ko_gold: dict[str, list[dict[str, Any]]],
    en_cards: dict[str, dict[str, Any]],
) -> dict[str, Any] | None:
    primary = str(target.get("primary_concept") or "")
    for card in ko_gold.get(primary, []):
        cid = str(card["id"])
        if cid == str(target["id"]):
            continue
        en = en_cards.get(cid)
        if not en:
            continue
        return {
            "note": "Example only. CONTRACT V1 remains the authority.",
            "ko": {
                "id": cid,
                "primary_concept": primary,
                "concept_explanation": card.get("concept_explanation"),
                "teaching_example": card.get("teaching_example"),
                "answer_explanation": card.get("answer_explanation"),
            },
            "en": {
                "id": cid,
                "primary_concept": primary,
                "concept_explanation": en.get("concept_explanation"),
                "teaching_example": en.get("teaching_example"),
                "answer_explanation": en.get("answer_explanation"),
            },
        }
    return None


def concept_schema() -> dict[str, Any]:
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "what_it_is": {"type": "string"},
            "how_to_read": {"type": "string"},
            "key_point": {"type": "string"},
            "common_mistake": {"type": "string"},
        },
        "required": ["what_it_is", "how_to_read", "key_point", "common_mistake"],
    }


def teaching_schema() -> dict[str, Any]:
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "code": {"type": "string"},
            "walkthrough": {"type": "string"},
        },
        "required": ["code", "walkthrough"],
    }


def answer_schema() -> dict[str, Any]:
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "step_by_step": {"type": "string"},
            "why_correct": {"type": "string"},
            "common_wrong_choice": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "choice": {"type": "string"},
                    "why_wrong": {"type": "string"},
                    "misread_step": {"type": "string"},
                },
                "required": ["choice", "why_wrong", "misread_step"],
            },
            "takeaway": {"type": "string"},
        },
        "required": [
            "step_by_step",
            "why_correct",
            "common_wrong_choice",
            "takeaway",
        ],
    }


def patch_schema(targets: list[str]) -> dict[str, Any]:
    properties: dict[str, Any] = {}
    for target in targets:
        if target == "concept_explanation":
            properties[target] = concept_schema()
        elif target == "teaching_example":
            properties[target] = teaching_schema()
        elif target == "answer_explanation":
            properties[target] = answer_schema()
        else:
            raise RuntimeError(f"unknown patch target: {target}")

    return {
        "type": "object",
        "additionalProperties": False,
        "properties": properties,
        "required": list(targets),
    }


def response_schema(targets: list[str]) -> dict[str, Any]:
    bilingual_patch = patch_schema(targets)
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "ko": bilingual_patch,
            "en": bilingual_patch,
            "quality": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "confidence": {
                        "type": "string",
                        "enum": ["HIGH", "MEDIUM", "LOW"],
                    },
                    "grounding_note": {"type": "string"},
                },
                "required": ["confidence", "grounding_note"],
            },
        },
        "required": ["ko", "en", "quality"],
    }


def build_prompt(
    *,
    contract: str,
    ko_card: dict[str, Any],
    en_card: dict[str, Any],
    authority: str,
    reasons: list[str],
    targets: list[str],
    ko_support: list[dict[str, Any]],
    en_support: list[dict[str, Any]],
    gold_reference: dict[str, Any] | None,
) -> str:
    preserved = {
        "id": ko_card.get("id"),
        "primary_concept": ko_card.get("primary_concept"),
        "code": ko_card.get("code"),
        "question": ko_card.get("question"),
        "choices": ko_card.get("choices"),
        "answer": ko_card.get("answer"),
        "focus_span": ko_card.get("focus_span"),
    }

    instructions = [
        "You are rewriting exactly one bilingual lesson card for Python Reading Trainer.",
        "LESSON_EXPLANATION_CONTRACT_V1 below is the highest quality authority.",
        "The card identity, question code, question, choices, correct answer, routing, level, and target concept are frozen.",
        "Return ONLY the explanation groups named in PATCH_TARGETS. The JSON schema enforces that boundary.",
        "Do not invent or correct unrelated facts.",
        "Do not add external-library/API claims beyond supplied card/support evidence.",
        "For Python language semantics, be technically exact and conservative.",
        "The Korean and English outputs must be semantic equivalents, not independent rewrites.",
        "",
    ]
    instructions.extend(local_evidence_instructions(authority))
    instructions.extend([
        "Quality requirements:",
        "- Beginner must understand the easy layer before knowing specialist terms.",
        "- concept_explanation.what_it_is: easy meaning first, then exact technical definition.",
        "- Korean what_it_is must explicitly contain '쉽게 말하면:' and '정확한 정의:'.",
        "- English what_it_is must explicitly contain 'Easy meaning:' and 'Exact definition:'.",
        "- how_to_read must include an intuitive mental model and concrete reading of this card.",
        "- key_point must expose execution/value flow and the result where deterministic.",
        "- common_mistake must address a genuine beginner misread.",
        "- teaching_example must demonstrate the SAME target concept, not merely similar syntax.",
        "- teaching_example walkthrough must read the code line by line and state execution/result.",
        "- answer_explanation must reconstruct why the correct answer follows from execution.",
        "- common_wrong_choice.choice must exactly copy one provided wrong choice in that language.",
        "- Prefer precise, useful prose over length for its own sake, but do not make later cards thinner.",
        "- Previously rewritten GOLD is an example only; never override the V1 contract with its style.",
        "",
        f"AUTHORITY_CLASS={authority}",
        f"QUALITY_REASONS={json.dumps(reasons, ensure_ascii=False)}",
        f"PATCH_TARGETS={json.dumps(targets, ensure_ascii=False)}",
        "",
        "FROZEN CORE:",
        json.dumps(preserved, ensure_ascii=False, indent=2),
        "",
        "CURRENT KOREAN CARD:",
        json.dumps(public_card(ko_card), ensure_ascii=False, indent=2),
        "",
        "CURRENT ENGLISH CARD:",
        json.dumps(public_card(en_card), ensure_ascii=False, indent=2),
        "",
        "CONNECTED KOREAN SUPPORT:",
        json.dumps(ko_support, ensure_ascii=False, indent=2),
        "",
        "CONNECTED ENGLISH SUPPORT:",
        json.dumps(en_support, ensure_ascii=False, indent=2),
        "",
        "SAME-PRIMARY GOLD EXAMPLE (optional):",
        json.dumps(gold_reference, ensure_ascii=False, indent=2),
        "",
        "LESSON_EXPLANATION_CONTRACT_V1:",
        contract,
    ])
    return "\n".join(instructions)


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


def openai_request(
    *,
    api_key: str,
    model: str,
    prompt: str,
    schema: dict[str, Any],
    timeout: int,
) -> dict[str, Any]:
    last_error: Exception | None = None
    cumulative_input_tokens = 0
    cumulative_output_tokens = 0
    cumulative_reasoning_tokens = 0
    cumulative_total_tokens = 0

    for attempt in range(1, 4):
        attempt_prompt = prompt
        if attempt > 1:
            attempt_prompt += (
                "\n\nRECOVERY NOTE: A previous generation exceeded the output budget. "
                "Return only the required JSON schema. Keep every explanation field concise, "
                "avoid repeated clauses, and do not restate the contract."
            )

        body = {
            "model": model,
            "input": [
                {
                    "role": "user",
                    "content": [{"type": "input_text", "text": attempt_prompt}],
                }
            ],
            "reasoning": {"effort": "low"},
            "text": {
                "verbosity": "low",
                "format": {
                    "type": "json_schema",
                    "name": "lesson_explanation_api_pilot_r1",
                    "description": "Bilingual V1 lesson explanation patch for one frozen card.",
                    "strict": True,
                    "schema": schema,
                },
            },
            "max_output_tokens": 4000,
        }
        encoded = json.dumps(body, ensure_ascii=False).encode("utf-8")

        request = urllib.request.Request(
            OPENAI_RESPONSES_URL,
            data=encoded,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "python-reading-trainer-lesson-explanation-pilot/1.0",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                payload = json.loads(response.read().decode("utf-8"))

            usage = payload.get("usage") or {}
            details = usage.get("output_tokens_details") or {}
            cumulative_input_tokens += int(usage.get("input_tokens") or 0)
            cumulative_output_tokens += int(usage.get("output_tokens") or 0)
            cumulative_reasoning_tokens += int(details.get("reasoning_tokens") or 0)
            cumulative_total_tokens += int(
                usage.get("total_tokens")
                or (
                    int(usage.get("input_tokens") or 0)
                    + int(usage.get("output_tokens") or 0)
                )
            )

            payload["_pilot_request_attempts"] = attempt
            payload["_pilot_cumulative_usage"] = {
                "input_tokens": cumulative_input_tokens,
                "output_tokens": cumulative_output_tokens,
                "total_tokens": cumulative_total_tokens,
                "output_tokens_details": {
                    "reasoning_tokens": cumulative_reasoning_tokens,
                },
            }

            if payload.get("status") == "incomplete":
                incomplete = payload.get("incomplete_details") or {}
                reason = incomplete.get("reason") or "unknown"
                last_error = RuntimeError(
                    f"OpenAI incomplete response: reason={reason} attempt={attempt}"
                )
                if reason == "max_output_tokens" and attempt < 3:
                    time.sleep((2, 5, 10)[attempt - 1])
                    continue

            return payload
        except urllib.error.HTTPError as exc:
            body_text = exc.read().decode("utf-8", errors="replace")
            message = f"OpenAI HTTP {exc.code}: {clean_space(body_text)[:1200]}"
            last_error = RuntimeError(message)
            if exc.code not in {408, 409, 429, 500, 502, 503, 504} or attempt == 3:
                raise last_error from exc
        except TimeoutError as exc:
            last_error = RuntimeError(f"OpenAI read timeout: {exc}")
            if attempt == 3:
                raise last_error from exc
        except urllib.error.URLError as exc:
            last_error = RuntimeError(f"OpenAI URL error: {exc}")
            if attempt == 3:
                raise last_error from exc

        time.sleep((2, 5, 10)[attempt - 1])

    raise RuntimeError(f"OpenAI request failed: {last_error}")


def required_target_calls(card: dict[str, Any]) -> set[str]:
    focus_calls = set(readiness.call_leafs(str(card.get("focus_span", ""))))
    return readiness.specific_target_call_required(card, focus_calls)


def validate_patch(
    *,
    patch: dict[str, Any],
    card: dict[str, Any],
    targets: list[str],
    language: str,
) -> None:
    if set(patch) != set(targets):
        raise RuntimeError(
            f"{card['id']} {language}: patch keys mismatch "
            f"expected={targets} actual={sorted(patch)}"
        )

    if "concept_explanation" in targets:
        concept = patch["concept_explanation"]
        for key in ("what_it_is", "how_to_read", "key_point", "common_mistake"):
            if not clean_space(str(concept.get(key) or "")):
                raise RuntimeError(f"{card['id']} {language}: empty concept field {key}")

        what = str(concept["what_it_is"])
        if language == "ko":
            if "쉽게 말하면:" not in what or "정확한 정의:" not in what:
                raise RuntimeError(f"{card['id']} ko: easy/exact definition labels missing")
        else:
            if "Easy meaning:" not in what or "Exact definition:" not in what:
                raise RuntimeError(f"{card['id']} en: easy/exact definition labels missing")

    if "teaching_example" in targets:
        example = patch["teaching_example"]
        code = str(example.get("code") or "")
        walkthrough = str(example.get("walkthrough") or "")
        if not code.strip() or len(walkthrough.strip()) < 55:
            raise RuntimeError(f"{card['id']} {language}: thin teaching example")

        primary = str(card.get("primary_concept") or "")
        if not readiness.has_primary_syntax(primary, code):
            raise RuntimeError(
                f"{card['id']} {language}: teaching example misses primary syntax {primary}"
            )

        required = required_target_calls(card)
        if required:
            example_calls = set(readiness.call_leafs(code))
            if not (required & example_calls):
                raise RuntimeError(
                    f"{card['id']} {language}: teaching example misses target call "
                    f"{sorted(required)}"
                )

    if "answer_explanation" in targets:
        answer = patch["answer_explanation"]
        for key in ("step_by_step", "why_correct", "takeaway"):
            if not clean_space(str(answer.get(key) or "")):
                raise RuntimeError(f"{card['id']} {language}: empty answer field {key}")

        wrong = answer.get("common_wrong_choice") or {}
        for key in ("choice", "why_wrong", "misread_step"):
            if not clean_space(str(wrong.get(key) or "")):
                raise RuntimeError(f"{card['id']} {language}: empty wrong-choice field {key}")

        choices = [str(value) for value in card.get("choices") or []]
        correct = str(card.get("answer") or "")
        wrong_choice = str(wrong["choice"])
        if wrong_choice not in choices or wrong_choice == correct:
            raise RuntimeError(
                f"{card['id']} {language}: common_wrong_choice is not an exact wrong option"
            )


def json_string_end(text: str, start: int) -> int:
    if start >= len(text) or text[start] != '"':
        raise RuntimeError("JSON string start not found")

    escaped = False
    for index in range(start + 1, len(text)):
        char = text[index]
        if escaped:
            escaped = False
        elif char == "\\":
            escaped = True
        elif char == '"':
            return index
    raise RuntimeError("unterminated JSON string")


def object_end(text: str, start: int) -> int:
    if text[start] != "{":
        raise RuntimeError("JSON object start not found")

    depth = 0
    in_string = False
    escaped = False

    for index in range(start, len(text)):
        char = text[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue

        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index

    raise RuntimeError("unterminated JSON object")


def card_span(raw: str, card_id: str) -> tuple[int, int]:
    marker = re.search(
        rf'"id"\s*:\s*{re.escape(json.dumps(card_id, ensure_ascii=False))}',
        raw,
    )
    if not marker:
        raise RuntimeError(f"card id not found in raw JSON: {card_id}")

    start = raw.rfind("{", 0, marker.start())
    if start < 0:
        raise RuntimeError(f"card object start not found: {card_id}")

    return start, object_end(raw, start) + 1


def group_span(card_text: str, group: str) -> tuple[int, int]:
    marker = re.search(rf'"{re.escape(group)}"\s*:\s*\{{', card_text)
    if not marker:
        raise RuntimeError(f"group not found: {group}")

    start = card_text.find("{", marker.start())
    return start, object_end(card_text, start) + 1


def replace_string_property(text: str, key: str, value: str) -> str:
    marker = re.search(rf'"{re.escape(key)}"\s*:\s*', text)
    if not marker:
        raise RuntimeError(f"string property not found: {key}")

    start = marker.end()
    while start < len(text) and text[start].isspace():
        start += 1

    end = json_string_end(text, start)
    return text[:start] + json.dumps(value, ensure_ascii=False) + text[end + 1 :]


def patch_group_text(group_text: str, group: str, value: dict[str, Any]) -> str:
    out = group_text

    if group == "concept_explanation":
        for key in ("what_it_is", "how_to_read", "key_point", "common_mistake"):
            out = replace_string_property(out, key, str(value[key]))
        return out

    if group == "teaching_example":
        for key in ("code", "walkthrough"):
            out = replace_string_property(out, key, str(value[key]))
        return out

    if group == "answer_explanation":
        for key in ("step_by_step", "why_correct", "choice", "why_wrong", "misread_step", "takeaway"):
            source = value
            if key in {"choice", "why_wrong", "misread_step"}:
                source = value["common_wrong_choice"]
            out = replace_string_property(out, key, str(source[key]))
        return out

    raise RuntimeError(f"unsupported group: {group}")


def read_raw_preserving_bom(path: Path) -> tuple[str, bool]:
    data = path.read_bytes()
    has_bom = data.startswith(codecs.BOM_UTF8)
    if has_bom:
        data = data[len(codecs.BOM_UTF8) :]
    return data.decode("utf-8"), has_bom


def write_raw_preserving_bom(path: Path, text: str, has_bom: bool) -> None:
    encoded = text.encode("utf-8")
    if has_bom:
        encoded = codecs.BOM_UTF8 + encoded
    path.write_bytes(encoded)


def apply_file_patches(
    *,
    path: Path,
    results: list[dict[str, Any]],
    language: str,
) -> None:
    raw, has_bom = read_raw_preserving_bom(path)
    original_payload = json.loads(raw)
    before_map = {str(row["id"]): row for row in original_payload}

    patches = []
    for result in results:
        cid = str(result["id"])
        start, end = card_span(raw, cid)
        patches.append((start, end, cid, result[language], result["patch_targets"]))

    patches.sort(reverse=True, key=lambda item: item[0])

    for start, end, cid, patch, targets in patches:
        card_text = raw[start:end]
        for group in targets:
            gs, ge = group_span(card_text, group)
            updated_group = patch_group_text(card_text[gs:ge], group, patch[group])
            card_text = card_text[:gs] + updated_group + card_text[ge:]
        raw = raw[:start] + card_text + raw[end:]

    updated_payload = json.loads(raw)
    after_map = {str(row["id"]): row for row in updated_payload}
    selected_ids = {str(result["id"]) for result in results}
    allowed_by_id = {
        str(result["id"]): set(result["patch_targets"])
        for result in results
    }

    if set(before_map) != set(after_map):
        raise RuntimeError(f"{path}: card id inventory changed")

    for cid in before_map:
        before = before_map[cid]
        after = after_map[cid]
        keys = set(before) | set(after)
        diff = {
            key
            for key in keys
            if json.dumps(before.get(key), ensure_ascii=False, sort_keys=True)
            != json.dumps(after.get(key), ensure_ascii=False, sort_keys=True)
        }

        if cid not in selected_ids:
            if diff:
                raise RuntimeError(f"{path}: unrelated card changed: {cid} {sorted(diff)}")
            continue

        forbidden = diff - allowed_by_id[cid]
        if forbidden:
            raise RuntimeError(f"{path}: frozen fields changed for {cid}: {sorted(forbidden)}")
        if not diff:
            raise RuntimeError(f"{path}: selected card had no semantic change: {cid}")

    write_raw_preserving_bom(path, raw, has_bom)


def target_quality_reasons(
    card: dict[str, Any],
    targets: list[str] | set[str],
) -> set[str]:
    reasons = set(readiness.quality_reasons(card))
    targets_set = set(targets)
    relevant: set[str] = set()

    if "concept_explanation" in targets_set:
        relevant.update(reason for reason in reasons if reason in CONCEPT_REASONS)

    if "teaching_example" in targets_set:
        relevant.update(reason for reason in reasons if reason in TEACHING_REASONS)
        relevant.update(
            reason
            for reason in reasons
            if reason.startswith("TEACHING_EXAMPLE_")
        )

    if "answer_explanation" in targets_set:
        relevant.update(reason for reason in reasons if reason in ANSWER_REASONS)

    return relevant


def validate_generated_target_quality(
    *,
    card: dict[str, Any],
    patch: dict[str, Any],
    targets: list[str],
    language: str,
) -> None:
    candidate = dict(card)
    for target in targets:
        candidate[target] = patch[target]

    remaining = target_quality_reasons(candidate, targets)
    if remaining:
        raise RuntimeError(
            f"{card['id']} {language}: target quality reasons remain: "
            f"{sorted(remaining)}"
        )


def validate_after_apply(
    *,
    selected: list[dict[str, Any]],
    en_cards_before: dict[str, dict[str, Any]],
) -> None:
    ko_after, _ = load_all_cards(LESSON_ROOT_KO)
    en_after, _ = load_all_cards(LESSON_ROOT_EN)

    for selected_row in selected:
        cid = str(selected_row["id"])
        targets = set(selected_row["_patch_targets"])

        ko = ko_after[cid]
        en = en_after[cid]

        remaining_ko = target_quality_reasons(ko, targets)
        remaining_en = target_quality_reasons(en, targets)

        if remaining_ko:
            raise RuntimeError(f"{cid}: KO target quality reasons remain: {sorted(remaining_ko)}")
        if remaining_en:
            raise RuntimeError(f"{cid}: EN target quality reasons remain: {sorted(remaining_en)}")

        before_en = en_cards_before[cid]
        for key in ("id", "code", "question", "choices", "answer", "primary_concept", "level"):
            if json.dumps(before_en.get(key), ensure_ascii=False, sort_keys=True) != json.dumps(
                en.get(key), ensure_ascii=False, sort_keys=True
            ):
                raise RuntimeError(f"{cid}: EN frozen field changed: {key}")

        if not targets:
            raise RuntimeError(f"{cid}: no targets after apply")


def validate_resume_results(
    *,
    rows: list[dict[str, Any]],
    selected: list[dict[str, Any]],
    ko_cards: dict[str, dict[str, Any]],
    en_cards: dict[str, dict[str, Any]],
    selection_sha: str,
    model: str,
) -> list[dict[str, Any]]:
    if len(rows) > len(selected):
        raise RuntimeError(
            f"resume result count exceeds selection: {len(rows)}>{len(selected)}"
        )

    validated: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    seen_indexes: set[int] = set()

    for row in rows:
        row_index = int(row.get("index") or 0)
        if row_index < 1 or row_index > len(selected):
            raise RuntimeError(f"resume index out of range: {row_index}")
        if row_index in seen_indexes:
            raise RuntimeError(f"duplicate resume index: {row_index}")
        seen_indexes.add(row_index)

        selected_row = selected[row_index - 1]
        cid = str(selected_row["id"])
        targets = list(selected_row["_patch_targets"])

        if row.get("schema") != RESULT_SCHEMA:
            raise RuntimeError(f"{cid}: resume schema mismatch")
        if row.get("prompt_version") != PROMPT_VERSION:
            raise RuntimeError(f"{cid}: resume prompt version mismatch")
        if row.get("selection_sha256") != selection_sha:
            raise RuntimeError(f"{cid}: resume selection hash mismatch")
        if str(row.get("id") or "") != cid:
            raise RuntimeError(
                f"resume id mismatch at {row_index}: expected={cid} actual={row.get('id')}"
            )
        if cid in seen_ids:
            raise RuntimeError(f"{cid}: duplicate resume result")
        seen_ids.add(cid)

        if row.get("model") != model:
            raise RuntimeError(
                f"{cid}: resume model mismatch expected={model} actual={row.get('model')}"
            )
        if list(row.get("patch_targets") or []) != targets:
            raise RuntimeError(f"{cid}: resume patch targets mismatch")
        if str(row.get("file") or "") != str(selected_row["_file"]):
            raise RuntimeError(f"{cid}: resume file mismatch")
        if row.get("authority") != selected_row["_authority"]:
            raise RuntimeError(f"{cid}: resume authority mismatch")
        if row.get("disposition_before") != selected_row["_disposition"]:
            raise RuntimeError(f"{cid}: resume disposition mismatch")
        if list(row.get("quality_reasons_before") or []) != list(selected_row["_reasons"]):
            raise RuntimeError(f"{cid}: resume quality reasons mismatch")

        ko_card = ko_cards.get(cid)
        en_card = en_cards.get(cid)
        if not ko_card or not en_card:
            raise RuntimeError(f"{cid}: resume card missing from current corpus")

        validate_patch(
            patch=row.get("ko") or {},
            card=ko_card,
            targets=targets,
            language="ko",
        )
        validate_patch(
            patch=row.get("en") or {},
            card=en_card,
            targets=targets,
            language="en",
        )
        validate_generated_target_quality(
            card=ko_card,
            patch=row.get("ko") or {},
            targets=targets,
            language="ko",
        )
        validate_generated_target_quality(
            card=en_card,
            patch=row.get("en") or {},
            targets=targets,
            language="en",
        )

        quality = row.get("quality") or {}
        if quality.get("confidence") not in {"HIGH", "MEDIUM", "LOW"}:
            raise RuntimeError(f"{cid}: resume quality confidence invalid")
        if not clean_space(str(quality.get("grounding_note") or "")):
            raise RuntimeError(f"{cid}: resume grounding note missing")

        usage = row.get("usage") or {}
        input_tokens = int(usage.get("input_tokens") or 0)
        output_tokens = int(usage.get("output_tokens") or 0)
        if input_tokens + output_tokens <= 0:
            raise RuntimeError(f"{cid}: resume token usage missing")

        attempts = int(row.get("request_attempts") or 1)
        if attempts < 1 or attempts > 3:
            raise RuntimeError(f"{cid}: resume request attempts invalid: {attempts}")

        validated.append(row)

    return sorted(validated, key=lambda row: int(row["index"]))


def load_resume_results(
    *,
    path: Path | None,
    selected: list[dict[str, Any]],
    ko_cards: dict[str, dict[str, Any]],
    en_cards: dict[str, dict[str, Any]],
    selection_sha: str,
    model: str,
) -> list[dict[str, Any]]:
    if path is None:
        return []
    if not path.exists():
        raise RuntimeError(f"resume result path not found: {path}")

    rows = [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    return validate_resume_results(
        rows=rows,
        selected=selected,
        ko_cards=ko_cards,
        en_cards=en_cards,
        selection_sha=selection_sha,
        model=model,
    )


def self_test() -> int:
    assert len(GOLD_IDS) == 46
    assert not local_evidence_instructions("PYTHON_LANGUAGE_AUTHORITY")
    local_mode = local_evidence_instructions("DOMAIN_AUTHORITY_REVIEW")
    assert any("LOCAL EVIDENCE MODE" in line for line in local_mode)
    assert any("opaque local functions" in line for line in local_mode)

    sample = (
        '[\n  {\n    "id": "A",\n'
        '    "concept_explanation": {"what_it_is": "old", "how_to_read": "old2", '
        '"key_point": "old3", "common_mistake": "old4"},\n'
        '    "teaching_example": {"code": "x = 1", "walkthrough": "old walk"},\n'
        '    "answer_explanation": {"step_by_step": "old step", "why_correct": "old why", '
        '"common_wrong_choice": {"choice": "B", "why_wrong": "old wrong", '
        '"misread_step": "old miss"}, "takeaway": "old take"}\n  }\n]\n'
    )
    start, end = card_span(sample, "A")
    card = sample[start:end]
    gs, ge = group_span(card, "concept_explanation")
    patched = patch_group_text(
        card[gs:ge],
        "concept_explanation",
        {
            "what_it_is": "쉽게 말하면: new\n정확한 정의: exact",
            "how_to_read": "new read",
            "key_point": "new point",
            "common_mistake": "new mistake",
        },
    )
    card = card[:gs] + patched + card[ge:]
    parsed = json.loads("[" + card + "]")[0]
    assert parsed["concept_explanation"]["key_point"] == "new point"

    schema = response_schema(["concept_explanation", "answer_explanation"])
    assert schema["additionalProperties"] is False
    assert set(schema["properties"]["ko"]["required"]) == {
        "concept_explanation",
        "answer_explanation",
    }

    original_urlopen = urllib.request.urlopen
    original_sleep = time.sleep
    retry_attempts = 0

    class FakeResponse:
        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            return False

        def read(self):
            return b'{"status":"completed"}'

    def fake_urlopen(request, timeout):
        nonlocal retry_attempts
        retry_attempts += 1
        if retry_attempts < 3:
            raise TimeoutError("simulated read timeout")
        return FakeResponse()

    try:
        urllib.request.urlopen = fake_urlopen
        time.sleep = lambda _: None
        retry_response = openai_request(
            api_key="test-key",
            model="test-model",
            prompt="test",
            schema={
                "type": "object",
                "properties": {},
                "required": [],
                "additionalProperties": False,
            },
            timeout=1,
        )
    finally:
        urllib.request.urlopen = original_urlopen
        time.sleep = original_sleep

    assert retry_attempts == 3
    assert retry_response["status"] == "completed"

    incomplete_attempts = 0

    class IncompleteThenSuccessResponse(FakeResponse):
        def __init__(self, payload):
            self.payload = payload

        def read(self):
            return json.dumps(self.payload).encode("utf-8")

    def fake_incomplete_urlopen(request, timeout):
        nonlocal incomplete_attempts
        incomplete_attempts += 1
        if incomplete_attempts < 3:
            return IncompleteThenSuccessResponse(
                {
                    "status": "incomplete",
                    "incomplete_details": {"reason": "max_output_tokens"},
                    "usage": {
                        "input_tokens": 100,
                        "output_tokens": 8000,
                        "total_tokens": 8100,
                        "output_tokens_details": {"reasoning_tokens": 0},
                    },
                }
            )
        return IncompleteThenSuccessResponse(
            {
                "status": "completed",
                "usage": {
                    "input_tokens": 100,
                    "output_tokens": 50,
                    "total_tokens": 150,
                    "output_tokens_details": {"reasoning_tokens": 0},
                },
            }
        )

    try:
        urllib.request.urlopen = fake_incomplete_urlopen
        time.sleep = lambda _: None
        incomplete_response = openai_request(
            api_key="test-key",
            model="test-model",
            prompt="test",
            schema={
                "type": "object",
                "properties": {},
                "required": [],
                "additionalProperties": False,
            },
            timeout=1,
        )
    finally:
        urllib.request.urlopen = original_urlopen
        time.sleep = original_sleep

    assert incomplete_attempts == 3
    assert incomplete_response["status"] == "completed"
    assert incomplete_response["_pilot_request_attempts"] == 3
    assert incomplete_response["_pilot_cumulative_usage"]["input_tokens"] == 300
    assert incomplete_response["_pilot_cumulative_usage"]["output_tokens"] == 16050

    resume_selected = [
        {
            "id": "RESUME_UNUSED",
            "_patch_targets": ["concept_explanation"],
            "_file": "resume.json",
            "_authority": "PYTHON_LANGUAGE_AUTHORITY",
            "_disposition": "CONCEPT_EXPLANATION_REWRITE",
            "_reasons": ["EASY_BRIDGE_REVIEW"],
        },
        {
            "id": "RESUME_TEST",
            "_patch_targets": ["concept_explanation"],
            "_file": "resume.json",
            "_authority": "PYTHON_LANGUAGE_AUTHORITY",
            "_disposition": "CONCEPT_EXPLANATION_REWRITE",
            "_reasons": ["EASY_BRIDGE_REVIEW"],
        },
    ]
    resume_ko_card = {
        "id": "RESUME_TEST",
        "primary_concept": "literal",
        "focus_span": "1",
        "choices": ["1", "2"],
        "answer": "1",
    }
    resume_en_card = dict(resume_ko_card)
    resume_row = {
        "schema": RESULT_SCHEMA,
        "prompt_version": PROMPT_VERSION,
        "selection_sha256": "resume-sha",
        "index": 2,
        "id": "RESUME_TEST",
        "file": "resume.json",
        "authority": "PYTHON_LANGUAGE_AUTHORITY",
        "disposition_before": "CONCEPT_EXPLANATION_REWRITE",
        "quality_reasons_before": ["EASY_BRIDGE_REVIEW"],
        "patch_targets": ["concept_explanation"],
        "model": "test-model",
        "request_attempts": 1,
        "usage": {
            "input_tokens": 10,
            "output_tokens": 5,
            "reasoning_tokens": 0,
            "total_tokens": 15,
        },
        "ko": {
            "concept_explanation": {
                "what_it_is": "쉽게 말하면: 코드에 직접 적힌 값을 그대로 사용하는 것입니다.\n정확한 정의: 리터럴은 소스 코드에 직접 표현된 고정된 값입니다.",
                "how_to_read": "오른쪽에 직접 적힌 숫자 1을 먼저 읽고, 그 값이 왼쪽 이름 x에 연결된다고 따라갑니다.",
                "key_point": "이 예에서는 정수 리터럴 1이 평가되고 그 결과가 x에 저장됩니다.",
                "common_mistake": "숫자 1과 문자열 '1'은 서로 다른 값이라는 점을 혼동하기 쉽습니다.",
            }
        },
        "en": {
            "concept_explanation": {
                "what_it_is": "Easy meaning: the code uses a value written directly in the source.\nExact definition: a literal is a fixed value represented directly in source code.",
                "how_to_read": "Read the number 1 on the right first, then follow that evaluated value as it becomes bound to the name x.",
                "key_point": "This example evaluates the integer literal 1 and stores that resulting value in x.",
                "common_mistake": "It is easy to confuse the number 1 with the string '1', but they are different values.",
            }
        },
        "quality": {
            "confidence": "HIGH",
            "grounding_note": "Synthetic resume self-test.",
        },
    }
    validated_resume = validate_resume_results(
        rows=[resume_row],
        selected=resume_selected,
        ko_cards={"RESUME_TEST": resume_ko_card},
        en_cards={"RESUME_TEST": resume_en_card},
        selection_sha="resume-sha",
        model="test-model",
    )
    assert len(validated_resume) == 1

    scoped_card = {
        "id": "SCOPED_TEST",
        "primary_concept": "literal",
        "focus_span": "1",
        "code": "x = 1",
        "choices": ["1", "2"],
        "answer": "1",
        "concept_explanation": {
            "what_it_is": "A parameter expression binds an object reference.",
            "how_to_read": "Read the value in the statement before continuing.",
            "key_point": "The code uses the value 1.",
            "common_mistake": "Do not confuse the literal with a string.",
        },
        "teaching_example": {
            "code": "x = 1",
            "walkthrough": "The statement assigns the literal value 1 to x and leaves x referring to that value.",
        },
        "answer_explanation": {
            "step_by_step": "The code evaluates the literal 1 and assigns that value to x.",
            "why_correct": "The value in the code is the integer 1.",
            "common_wrong_choice": {
                "choice": "2",
                "why_wrong": "The code never evaluates the literal 2.",
                "misread_step": "This reads a value that is not present in the code.",
            },
            "takeaway": "Read the literal value that actually appears in the statement.",
        },
    }
    assert "EASY_BRIDGE_REVIEW" in target_quality_reasons(
        scoped_card,
        ["concept_explanation"],
    )
    assert not target_quality_reasons(
        scoped_card,
        ["answer_explanation"],
    )

    print("LESSON_EXPLANATION_API_PILOT_R1_SELF_TEST=PASS")
    return 0


def plan(
    limit: int,
    *,
    selection_ids: list[str] | None = None,
) -> int:
    if selection_ids is not None:
        if len(selection_ids) != limit:
            raise SystemExit(
                f"explicit selection count must equal limit: "
                f"selection={len(selection_ids)} limit={limit}"
            )
        selected = select_explicit(selection_ids)
    else:
        selected = select_pilot(limit)
    disposition_counts: dict[str, int] = defaultdict(int)
    authority_counts: dict[str, int] = defaultdict(int)
    concept_counts: dict[str, int] = defaultdict(int)

    for row in selected:
        disposition_counts[str(row["_disposition"])] += 1
        authority_counts[str(row["_authority"])] += 1
        concept_counts[str(row.get("primary_concept") or "UNKNOWN")] += 1

    digest = hashlib.sha256(
        "\n".join(str(row["id"]) for row in selected).encode("utf-8")
    ).hexdigest()

    print(f"GOLD_REFERENCE_COUNT={len(GOLD_IDS)}")
    print(f"PILOT_LIMIT={limit}")
    print(f"PILOT_EXPLICIT_SELECTION={'YES' if selection_ids is not None else 'NO'}")
    print("PILOT_DISPOSITION_COUNTS=" + json.dumps(dict(sorted(disposition_counts.items())), sort_keys=True))
    print("PILOT_AUTHORITY_COUNTS=" + json.dumps(dict(sorted(authority_counts.items())), sort_keys=True))
    print("PILOT_PRIMARY_CONCEPT_COUNTS=" + json.dumps(dict(sorted(concept_counts.items())), sort_keys=True))
    print(f"PILOT_SELECTION_SHA256={digest}")

    for index, row in enumerate(selected, start=1):
        print(
            "PILOT_ITEM="
            f"{index}|{row['id']}|{row['_disposition']}|{row['_authority']}|"
            f"{row.get('primary_concept')}|{'+'.join(row['_patch_targets'])}|"
            f"{'+'.join(row['_reasons'])}"
        )

    print("API_CALL_PERFORMED=NO")
    print("LESSON_EXPLANATION_API_PILOT_R1_PLAN=PASS")
    return 0


def live(
    *,
    limit: int,
    model: str,
    timeout: int,
    result_path: Path,
    hold_path: Path,
    resume_result_path: Path | None,
    selection_ids: list[str] | None,
    max_total_tokens: int,
    max_holds: int,
) -> int:
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("OPENAI_API_KEY is required for --live")

    if selection_ids is not None:
        if len(selection_ids) != limit:
            raise SystemExit(
                f"explicit selection count must equal limit: "
                f"selection={len(selection_ids)} limit={limit}"
            )
        selected = select_explicit(selection_ids)
    else:
        selected = select_pilot(limit)
    ko_cards, _ = load_all_cards(LESSON_ROOT_KO)
    en_cards, _ = load_all_cards(LESSON_ROOT_EN)
    ko_support_index = load_support_index(SUPPORT_KO)
    en_support_index = load_support_index(SUPPORT_EN)
    ko_gold = build_gold_by_primary(ko_cards)
    contract = CONTRACT_PATH.read_text(encoding="utf-8-sig")

    selection_sha = hashlib.sha256(
        "\n".join(str(row["id"]) for row in selected).encode("utf-8")
    ).hexdigest()

    resume_results = load_resume_results(
        path=resume_result_path,
        selected=selected,
        ko_cards=ko_cards,
        en_cards=en_cards,
        selection_sha=selection_sha,
        model=model,
    )

    result_path.parent.mkdir(parents=True, exist_ok=True)
    hold_path.parent.mkdir(parents=True, exist_ok=True)
    if result_path.exists():
        result_path.unlink()
    if hold_path.exists():
        hold_path.unlink()

    results: list[dict[str, Any]] = list(resume_results)
    result_by_index = {
        int(row["index"]): row
        for row in results
    }
    holds: list[dict[str, Any]] = []
    total_input_tokens = sum(
        int((row.get("usage") or {}).get("input_tokens") or 0)
        for row in results
    )
    total_output_tokens = sum(
        int((row.get("usage") or {}).get("output_tokens") or 0)
        for row in results
    )
    total_reasoning_tokens = sum(
        int((row.get("usage") or {}).get("reasoning_tokens") or 0)
        for row in results
    )

    if results:
        with result_path.open("w", encoding="utf-8", newline="\n") as handle:
            for row in results:
                handle.write(
                    json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n"
                )
        print(f"PILOT_RESUME_COUNT={len(results)}")
        print(f"PILOT_RESUME_LAST_INDEX={max(result_by_index)}")
        print(f"PILOT_RESUME_LAST_ID={result_by_index[max(result_by_index)]['id']}")

    current_total = total_input_tokens + total_output_tokens
    if current_total > max_total_tokens:
        raise RuntimeError(
            f"pilot token guard exceeded before resume: "
            f"{current_total}>{max_total_tokens}"
        )

    for index, selected_row in enumerate(selected, start=1):
        if index in result_by_index:
            print(
                f"PILOT_SKIP={index}/{limit}|{selected_row['id']}|"
                "RESUME_VALIDATED"
            )
            continue
        cid = str(selected_row["id"])
        ko_card = ko_cards[cid]
        en_card = en_cards.get(cid)
        if not en_card:
            raise RuntimeError(f"English card missing: {cid}")

        targets = list(selected_row["_patch_targets"])
        prompt = build_prompt(
            contract=contract,
            ko_card=ko_card,
            en_card=en_card,
            authority=str(selected_row["_authority"]),
            reasons=list(selected_row["_reasons"]),
            targets=targets,
            ko_support=support_for(ko_card, ko_support_index),
            en_support=support_for(en_card, en_support_index),
            gold_reference=one_gold_reference(selected_row, ko_gold, en_cards),
        )

        response: dict[str, Any] | None = None
        try:
            response = openai_request(
                api_key=api_key,
                model=model,
                prompt=prompt,
                schema=response_schema(targets),
                timeout=timeout,
            )

            if response.get("status") not in {"completed", None}:
                incomplete = response.get("incomplete_details") or {}
                usage = response.get("_pilot_cumulative_usage") or response.get("usage") or {}
                details = usage.get("output_tokens_details") or {}
                raise RuntimeError(
                    f"{cid}: response status={response.get('status')} "
                    f"reason={incomplete.get('reason') or 'unknown'} "
                    f"attempts={response.get('_pilot_request_attempts') or 1} "
                    f"input_tokens={usage.get('input_tokens')} "
                    f"output_tokens={usage.get('output_tokens')} "
                    f"reasoning_tokens={details.get('reasoning_tokens')}"
                )

            generated = json.loads(extract_output_text(response))
            validate_patch(
                patch=generated["ko"],
                card=ko_card,
                targets=targets,
                language="ko",
            )
            validate_patch(
                patch=generated["en"],
                card=en_card,
                targets=targets,
                language="en",
            )
            validate_generated_target_quality(
                card=ko_card,
                patch=generated["ko"],
                targets=targets,
                language="ko",
            )
            validate_generated_target_quality(
                card=en_card,
                patch=generated["en"],
                targets=targets,
                language="en",
            )
        except (RuntimeError, json.JSONDecodeError) as exc:
            usage = {}
            if response is not None:
                usage = response.get("_pilot_cumulative_usage") or response.get("usage") or {}

            hold_input_tokens = int(usage.get("input_tokens") or 0)
            hold_output_tokens = int(usage.get("output_tokens") or 0)
            hold_reasoning_tokens = int(
                (usage.get("output_tokens_details") or {}).get("reasoning_tokens") or 0
            )
            total_input_tokens += hold_input_tokens
            total_output_tokens += hold_output_tokens
            total_reasoning_tokens += hold_reasoning_tokens

            hold = {
                "schema": RESULT_SCHEMA,
                "prompt_version": PROMPT_VERSION,
                "selection_sha256": selection_sha,
                "index": index,
                "id": cid,
                "file": str(selected_row["_file"]),
                "primary_concept": selected_row.get("primary_concept"),
                "authority": selected_row["_authority"],
                "disposition_before": selected_row["_disposition"],
                "quality_reasons_before": selected_row["_reasons"],
                "patch_targets": targets,
                "model": model,
                "status": "HOLD",
                "error_type": type(exc).__name__,
                "error": clean_space(str(exc))[:2000],
                "usage": {
                    "input_tokens": hold_input_tokens,
                    "output_tokens": hold_output_tokens,
                    "reasoning_tokens": hold_reasoning_tokens,
                    "total_tokens": int(usage.get("total_tokens") or 0),
                },
            }
            holds.append(hold)
            with hold_path.open("a", encoding="utf-8", newline="\n") as handle:
                handle.write(
                    json.dumps(hold, ensure_ascii=False, separators=(",", ":")) + "\n"
                )

            print(
                f"PILOT_HOLD={index}/{limit}|{cid}|"
                f"{type(exc).__name__}|{clean_space(str(exc))[:500]}"
            )

            if len(holds) > max_holds:
                raise RuntimeError(
                    f"rewrite hold limit exceeded: {len(holds)}>{max_holds}"
                ) from exc

            current_total = total_input_tokens + total_output_tokens
            if current_total > max_total_tokens:
                raise RuntimeError(
                    f"pilot token guard exceeded: {current_total}>{max_total_tokens}"
                )
            continue

        usage = response.get("_pilot_cumulative_usage") or response.get("usage") or {}
        input_tokens = int(usage.get("input_tokens") or 0)
        output_tokens = int(usage.get("output_tokens") or 0)
        reasoning_tokens = int(
            (usage.get("output_tokens_details") or {}).get("reasoning_tokens") or 0
        )

        total_input_tokens += input_tokens
        total_output_tokens += output_tokens
        total_reasoning_tokens += reasoning_tokens

        if int(usage.get("total_tokens") or (input_tokens + output_tokens)) <= 0:
            raise RuntimeError(f"{cid}: missing token usage")

        result = {
            "schema": RESULT_SCHEMA,
            "prompt_version": PROMPT_VERSION,
            "selection_sha256": selection_sha,
            "index": index,
            "id": cid,
            "file": str(selected_row["_file"]),
            "primary_concept": selected_row.get("primary_concept"),
            "authority": selected_row["_authority"],
            "disposition_before": selected_row["_disposition"],
            "quality_reasons_before": selected_row["_reasons"],
            "patch_targets": targets,
            "side_card_ids": ko_card.get("side_card_ids") or [],
            "model": model,
            "response_id": response.get("id") or "",
            "request_attempts": int(response.get("_pilot_request_attempts") or 1),
            "usage": {
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "reasoning_tokens": reasoning_tokens,
                "total_tokens": int(usage.get("total_tokens") or 0),
            },
            "ko": generated["ko"],
            "en": generated["en"],
            "quality": generated["quality"],
        }
        results.append(result)
        result_by_index[index] = result

        with result_path.open("a", encoding="utf-8", newline="\n") as handle:
            handle.write(json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n")

        current_total = total_input_tokens + total_output_tokens
        print(
            f"PILOT_RESULT={index}/{limit}|{cid}|"
            f"{selected_row['_disposition']}|{'+'.join(targets)}|"
            f"INPUT_TOKENS={input_tokens}|OUTPUT_TOKENS={output_tokens}|"
            f"REASONING_TOKENS={reasoning_tokens}"
        )

        if current_total > max_total_tokens:
            raise RuntimeError(
                f"pilot token guard exceeded: {current_total}>{max_total_tokens}"
            )

    results.sort(key=lambda row: int(row["index"]))
    successful_selected = [
        selected[int(result["index"]) - 1]
        for result in results
    ]

    en_before = {cid: dict(card) for cid, card in en_cards.items()}

    by_file: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for result in results:
        by_file[str(result["file"])].append(result)

    for filename, file_results in sorted(by_file.items()):
        apply_file_patches(
            path=LESSON_ROOT_KO / filename,
            results=file_results,
            language="ko",
        )
        apply_file_patches(
            path=LESSON_ROOT_EN / filename,
            results=file_results,
            language="en",
        )

    validate_after_apply(selected=successful_selected, en_cards_before=en_before)

    print(f"PILOT_RESULT_COUNT={len(results)}")
    print(f"PILOT_HOLD_COUNT={len(holds)}")
    if holds:
        print("PILOT_HOLD_IDS=" + ",".join(str(row["id"]) for row in holds))
    print(f"PILOT_TOTAL_INPUT_TOKENS={total_input_tokens}")
    print(f"PILOT_TOTAL_OUTPUT_TOKENS={total_output_tokens}")
    print(f"PILOT_TOTAL_REASONING_TOKENS={total_reasoning_tokens}")
    print(f"PILOT_RESULT_PATH={result_path}")
    print(f"PILOT_HOLD_PATH={hold_path}")
    if holds:
        print("LESSON_EXPLANATION_API_PILOT_R1_LIVE=PASS_WITH_HOLDS")
    else:
        print("LESSON_EXPLANATION_API_PILOT_R1_LIVE=PASS")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=100)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--timeout", type=int, default=180)
    parser.add_argument("--result-path", type=Path, default=Path("lesson-explanation-api-pilot-r1.jsonl"))
    parser.add_argument("--hold-path", type=Path, default=Path("lesson-explanation-api-pilot-r1-holds.jsonl"))
    parser.add_argument("--resume-result-path", type=Path)
    parser.add_argument(
        "--selection-ids",
        default="",
        help="Optional comma-separated review-authority card IDs for LOCAL EVIDENCE MODE.",
    )
    parser.add_argument("--max-total-tokens", type=int, default=1_500_000)
    parser.add_argument("--max-holds", type=int, default=5)
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--plan", action="store_true")
    parser.add_argument("--live", action="store_true")
    args = parser.parse_args()

    selection_ids = [
        value.strip()
        for value in args.selection_ids.split(",")
        if value.strip()
    ] or None

    modes = sum(bool(value) for value in (args.self_test, args.plan, args.live))
    if modes != 1:
        parser.error("choose exactly one of --self-test, --plan, or --live")

    if args.self_test:
        return self_test()
    if args.plan:
        return plan(args.limit, selection_ids=selection_ids)
    return live(
        limit=args.limit,
        model=args.model,
        timeout=args.timeout,
        result_path=args.result_path,
        hold_path=args.hold_path,
        resume_result_path=args.resume_result_path,
        selection_ids=selection_ids,
        max_total_tokens=args.max_total_tokens,
        max_holds=args.max_holds,
    )


if __name__ == "__main__":
    raise SystemExit(main())

# -*- coding: utf-8 -*-
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def spec(path, card_id, old_choices, new_choices, answer, *, new_answer=None, old_common_wrong=None, new_common_wrong=None):
    return {
        "path": path,
        "id": card_id,
        "old_choices": old_choices,
        "new_choices": new_choices,
        "old_answer": answer,
        "new_answer": answer if new_answer is None else new_answer,
        "old_common_wrong": old_common_wrong,
        "new_common_wrong": new_common_wrong,
    }


REPAIRS = [
    # KO: display-equivalent choices hidden by browser whitespace rendering.
    spec(
        "data/lessons/cards_seed_v1.json",
        "L05_function_chain_001",
        ["  LiDAR  ", "LiDAR", "lidar", "LIDAR"],
        ['원본 문자열(양끝 공백 포함): "  LiDAR  "', "LiDAR", "lidar", "LIDAR"],
        "lidar",
    ),
    spec(
        "data/lessons/python_foundation_expansion_v10.json",
        "PY10_L04_function_chain_001",
        ["lidar", "LiDAR", " LiDAR ", "LIDAR"],
        ["lidar", "LiDAR", '원본 문자열(양끝 공백 포함): " LiDAR "', "LIDAR"],
        "lidar",
    ),
    spec(
        "data/lessons/python_foundation_expansion_v10.json",
        "PY10_L08_pipeline_steps_001",
        [" LiDAR ", "LiDAR", "lidar", "None"],
        ['원본 문자열(양끝 공백 포함): " LiDAR "', "LiDAR", "lidar", "None"],
        "lidar",
    ),
    spec(
        "data/lessons/python_rag_kg_pipeline_review_v16.json",
        "PY16_L09_dedup_hash_001",
        ["uam safety rule", "UAM   Safety  RULE", "uamsafetyrule", "UAM Safety RULE"],
        ["uam safety rule", '원본 문자열(여러 공백 유지): "UAM   Safety  RULE"', "uamsafetyrule", "UAM Safety RULE"],
        "uam safety rule",
    ),
    spec(
        "data/lessons/python_search_embedding_rag_flow_v43.json",
        "PY43_L06_query_normalization_001",
        ["python search", "Python Search", "  Python Search  ", "PYTHON SEARCH"],
        ["python search", "Python Search", '원본 문자열(양끝 공백 포함): "  Python Search  "', "PYTHON SEARCH"],
        "python search",
    ),

    # EN counterparts of the five KO display-equivalent defects.
    spec(
        "data_i18n/en/lessons/cards_seed_v1.json",
        "L05_function_chain_001",
        ["  LiDAR  ", "LiDAR", "lidar", "LIDAR"],
        ['Original string (with surrounding spaces): "  LiDAR  "', "LiDAR", "lidar", "LIDAR"],
        "lidar",
    ),
    spec(
        "data_i18n/en/lessons/python_foundation_expansion_v10.json",
        "PY10_L04_function_chain_001",
        ["lidar", "LiDAR", " LiDAR ", "LIDAR"],
        ["lidar", "LiDAR", 'Original string (with surrounding spaces): " LiDAR "', "LIDAR"],
        "lidar",
    ),
    spec(
        "data_i18n/en/lessons/python_foundation_expansion_v10.json",
        "PY10_L08_pipeline_steps_001",
        [" LiDAR ", "LiDAR", "lidar", "None"],
        ['Original string (with surrounding spaces): " LiDAR "', "LiDAR", "lidar", "None"],
        "lidar",
    ),
    spec(
        "data_i18n/en/lessons/python_rag_kg_pipeline_review_v16.json",
        "PY16_L09_dedup_hash_001",
        ["uam safety rule", "UAM   Safety  RULE", "uamsafetyrule", "UAM Safety RULE"],
        ["uam safety rule", 'Original string (multiple spaces preserved): "UAM   Safety  RULE"', "uamsafetyrule", "UAM Safety RULE"],
        "uam safety rule",
    ),
    spec(
        "data_i18n/en/lessons/python_search_embedding_rag_flow_v43.json",
        "PY43_L06_query_normalization_001",
        ["python search", "Python Search", "  Python Search  ", "PYTHON SEARCH"],
        ["python search", "Python Search", 'Original string (with surrounding spaces): "  Python Search  "', "PYTHON SEARCH"],
        "python search",
    ),

    # EN: blank choices or translation-collapse duplicates found by the strengthened bilingual audit.
    spec(
        "data_i18n/en/lessons/python_broad_expansion_v3.json",
        "PY3_L03_strip_001",
        ["lidar", "", "LiDAR", "LiDAR"],
        ["lidar", 'empty string ""', "LiDAR", 'original string (with surrounding spaces): "  LiDAR  "'],
        "LiDAR",
        old_common_wrong="LiDAR",
        new_common_wrong='original string (with surrounding spaces): "  LiDAR  "',
    ),
    spec(
        "data_i18n/en/lessons/python_rag_kg_pipeline_review_v16.json",
        "PY16_L08_metadata_normalize_001",
        ["", "legacy-7", "doc_id", "None"],
        ['empty string ""', "legacy-7", "doc_id", "None"],
        "legacy-7",
        old_common_wrong="",
        new_common_wrong='empty string ""',
    ),
    spec(
        "data_i18n/en/lessons/python_function_design_io_v30.json",
        "PY30_L08_guard_clause_001",
        ["", "<h2></h2>", "KeyError", "None"],
        ['empty string ""', "<h2></h2>", "KeyError", "None"],
        "",
        new_answer='empty string ""',
    ),
    spec(
        "data_i18n/en/lessons/python_pwa_install_update_ux_v51.json",
        "PY51_L06_install_prompt_001",
        ["Install the app", "", "True", "install_available"],
        ["Install the app", 'empty string ""', "True", "install_available"],
        "Install the app",
    ),
    spec(
        "data_i18n/en/lessons/python_pwa_install_update_ux_v51.json",
        "PY51_L08_offline_notice_001",
        ["Offline", "", "False", "online"],
        ["Offline", 'empty string ""', "False", "online"],
        "Offline",
        old_common_wrong="",
        new_common_wrong='empty string ""',
    ),
    spec(
        "data_i18n/en/lessons/python_pwa_install_update_ux_v51.json",
        "PY51_L08_online_recovered_notice_001",
        ["Reconnected", "", "True", "online"],
        ["Reconnected", 'empty string ""', "True", "online"],
        "Reconnected",
        old_common_wrong="",
        new_common_wrong='empty string ""',
    ),
    spec(
        "data_i18n/en/lessons/python_accessibility_a11y_ui_v52.json",
        "PY52_L07_screen_reader_text_001",
        ["Correct Answer Selection Results", "", "True", "sr_text"],
        ["Correct Answer Selection Results", 'empty string ""', "True", "sr_text"],
        "Correct Answer Selection Results",
    ),
    spec(
        "data_i18n/en/lessons/python_data_governance_copyright_v57.json",
        "PY57_L09_license_unknown_001",
        ["hold_license_unknown", "ready", "", "license_unknown"],
        ["hold_license_unknown", "ready", 'empty string ""', "license_unknown"],
        "hold_license_unknown",
    ),
    spec(
        "data_i18n/en/lessons/python_i18n_locale_language_toggle_v62.json",
        "PY62_L07_translation_dict_001",
        ["Next", "Next", "en-US", "next"],
        ["Next", 'ko-KR value: "다음"', "en-US", "next"],
        "Next",
        old_common_wrong="Next",
        new_common_wrong='ko-KR value: "다음"',
    ),
    spec(
        "data_i18n/en/lessons/python_i18n_locale_language_toggle_v62.json",
        "PY62_L08_fallback_locale_001",
        ["", "Start Learning", "title", "ko-KR"],
        ['empty string ""', "Start Learning", "title", "ko-KR"],
        "Start Learning",
        old_common_wrong="",
        new_common_wrong='empty string ""',
    ),
    spec(
        "data_i18n/en/lessons/python_i18n_locale_language_toggle_v62.json",
        "PY62_L09_bilingual_hint_001",
        ["Cache", "cache (cache)", "{ko_term}({en_term})", "Cache"],
        ["캐시(cache)", "cache(캐시)", "{ko_term}({en_term})", "캐시"],
        "Cache",
        new_answer="캐시(cache)",
        old_common_wrong="cache (cache)",
        new_common_wrong="cache(캐시)",
    ),
    spec(
        "data_i18n/en/lessons/python_foundation_beginner_v94_a1_part2.json",
        "PYF94_A1_L01_INPUT_007",
        ['"  hi  "', '"hi"', '"hi"', "None"],
        ['"  hi  "', '"hi"', 'empty string ""', "None"],
        '"hi"',
    ),
    spec(
        "data_i18n/en/lessons/python_foundation_level2_v94_a2_part2.json",
        "PYF94_A2_L02_STR_010",
        ["YES", "yes", "YES", "Yes"],
        ["YES", "yes", 'original string (with surrounding spaces): " YES "', "Yes"],
        "yes",
    ),
    spec(
        "data_i18n/en/lessons/python_foundation_level3_v95_a1_functions.json",
        "PYF95_A1_FUNC_015_STRING_METHOD_RETURN",
        ["Hi", "Hi", "hi", "HI"],
        ['original string (with surrounding spaces): " Hi "', "Hi", "hi", "HI"],
        "hi",
    ),
    spec(
        "data_i18n/en/lessons/python_foundation_level3_v95_a1_functions.json",
        "PYF95_A1_FUNC_028_FUNCTION_NAME_MEANING",
        ["yes", "YES", "YES", "None"],
        ["yes", "YES", 'original string (with surrounding spaces): " YES "', "None"],
        "yes",
    ),
    spec(
        "data_i18n/en/lessons/python_regex_beginner_v124_a1.json",
        "PY124_L06_REGEX_SAFE_FLOW_001",
        ["user@example.com", "", "email", "None"],
        ["user@example.com", 'empty string ""', "email", "None"],
        "user@example.com",
    ),
]


def read_payload(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def find_card(payload, card_id: str):
    rows = [row for row in payload if isinstance(row, dict) and row.get("id") == card_id]
    if len(rows) != 1:
        raise RuntimeError(f"CARD_MATCH_COUNT|id={card_id}|count={len(rows)}")
    return rows[0]


def card_span(text: str, card_id: str):
    candidates = [f'"id": "{card_id}"', f'"id":  "{card_id}"']
    starts = [text.find(marker) for marker in candidates if text.find(marker) >= 0]
    if len(starts) != 1:
        raise RuntimeError(f"TEXT_CARD_MATCH_COUNT|id={card_id}|count={len(starts)}")
    start = starts[0]
    next_candidates = [
        pos
        for marker in ('\n  {\n    "id":', '\n    {\n        "id":')
        if (pos := text.find(marker, start + 1)) >= 0
    ]
    end = min(next_candidates) if next_candidates else len(text)
    return start, end


def matching_end(text: str, start: int, opener: str, closer: str):
    if start < 0 or start >= len(text) or text[start] != opener:
        raise RuntimeError(f"BAD_CONTAINER_START|opener={opener}|start={start}")
    depth = 0
    in_string = False
    escaped = False
    for index in range(start, len(text)):
        ch = text[index]
        if in_string:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == '"':
                in_string = False
            continue
        if ch == '"':
            in_string = True
        elif ch == opener:
            depth += 1
        elif ch == closer:
            depth -= 1
            if depth == 0:
                return index + 1
    raise RuntimeError(f"UNTERMINATED_CONTAINER|opener={opener}|start={start}")


def value_span_after_key(text: str, key: str, start: int = 0, end: int | None = None):
    limit = len(text) if end is None else end
    marker = json.dumps(key) + ":"
    key_pos = text.find(marker, start, limit)
    if key_pos < 0:
        # Allow arbitrary whitespace between the quoted key and colon.
        quoted = json.dumps(key)
        key_pos = text.find(quoted, start, limit)
        if key_pos < 0:
            raise RuntimeError(f"KEY_NOT_FOUND|key={key}")
        colon = text.find(":", key_pos + len(quoted), limit)
        if colon < 0:
            raise RuntimeError(f"KEY_COLON_NOT_FOUND|key={key}")
        value_start = colon + 1
    else:
        value_start = key_pos + len(marker)
    while value_start < limit and text[value_start].isspace():
        value_start += 1
    if value_start >= limit:
        raise RuntimeError(f"VALUE_NOT_FOUND|key={key}")

    ch = text[value_start]
    if ch == "[":
        value_end = matching_end(text, value_start, "[", "]")
    elif ch == "{":
        value_end = matching_end(text, value_start, "{", "}")
    elif ch == '"':
        _, consumed = json.JSONDecoder().raw_decode(text[value_start:limit])
        value_end = value_start + consumed
    else:
        _, consumed = json.JSONDecoder().raw_decode(text[value_start:limit])
        value_end = value_start + consumed
    return value_start, value_end


def format_list_like(original_region: str, values: list[str]):
    encoded = [json.dumps(value, ensure_ascii=False) for value in values]
    if "\n" not in original_region:
        return "[" + ", ".join(encoded) + "]"

    lines = original_region.splitlines()
    item_indent = None
    for line in lines[1:]:
        stripped = line.lstrip()
        if stripped and stripped != "]":
            item_indent = line[: len(line) - len(stripped)]
            break
    if item_indent is None:
        item_indent = "  "

    closing_line = lines[-1]
    closing_indent = closing_line[: len(closing_line) - len(closing_line.lstrip())]
    return "[\n" + item_indent + (",\n" + item_indent).join(encoded) + "\n" + closing_indent + "]"


def replace_field_value(block: str, key: str, old_value, new_value, *, search_start: int = 0, search_end: int | None = None):
    value_start, value_end = value_span_after_key(block, key, search_start, search_end)
    raw = block[value_start:value_end]
    actual = json.loads(raw)
    if actual != old_value:
        raise RuntimeError(f"FIELD_PREIMAGE_MISMATCH|key={key}|expected={old_value!r}|actual={actual!r}")
    replacement = json.dumps(new_value, ensure_ascii=False)
    return block[:value_start] + replacement + block[value_end:]


def replace_choices(block: str, old_choices: list[str], new_choices: list[str]):
    value_start, value_end = value_span_after_key(block, "choices")
    raw = block[value_start:value_end]
    actual = json.loads(raw)
    if actual != old_choices:
        raise RuntimeError(f"CHOICES_PREIMAGE_MISMATCH|expected={old_choices!r}|actual={actual!r}")
    replacement = format_list_like(raw, new_choices)
    return block[:value_start] + replacement + block[value_end:]


def replace_common_wrong(block: str, old_value: str, new_value: str):
    marker = '"common_wrong_choice"'
    marker_pos = block.find(marker)
    if marker_pos < 0:
        raise RuntimeError("COMMON_WRONG_BLOCK_NOT_FOUND")
    brace = block.find("{", marker_pos + len(marker))
    if brace < 0:
        raise RuntimeError("COMMON_WRONG_BRACE_NOT_FOUND")
    object_end = matching_end(block, brace, "{", "}")
    return replace_field_value(block, "choice", old_value, new_value, search_start=brace, search_end=object_end)


def patch_one(repair):
    path = ROOT / repair["path"]
    before_payload = read_payload(path)
    before = find_card(before_payload, repair["id"])
    if before.get("choices") != repair["old_choices"]:
        raise RuntimeError(
            f"PREIMAGE_CHOICES_MISMATCH|path={repair['path']}|id={repair['id']}|actual={before.get('choices')!r}"
        )
    if before.get("answer") != repair["old_answer"]:
        raise RuntimeError(
            f"PREIMAGE_ANSWER_MISMATCH|path={repair['path']}|id={repair['id']}|actual={before.get('answer')!r}"
        )
    if repair["old_common_wrong"] is not None:
        actual_common = ((before.get("answer_explanation") or {}).get("common_wrong_choice") or {}).get("choice")
        if actual_common != repair["old_common_wrong"]:
            raise RuntimeError(
                f"PREIMAGE_COMMON_WRONG_MISMATCH|path={repair['path']}|id={repair['id']}|actual={actual_common!r}"
            )

    text = path.read_text(encoding="utf-8-sig")
    start, end = card_span(text, repair["id"])
    block = text[start:end]
    block = replace_choices(block, repair["old_choices"], repair["new_choices"])
    if repair["new_answer"] != repair["old_answer"]:
        block = replace_field_value(block, "answer", repair["old_answer"], repair["new_answer"])
    if repair["old_common_wrong"] is not None:
        block = replace_common_wrong(block, repair["old_common_wrong"], repair["new_common_wrong"])
    path.write_text(text[:start] + block + text[end:], encoding="utf-8")

    after = find_card(read_payload(path), repair["id"])
    if after.get("choices") != repair["new_choices"]:
        raise RuntimeError(
            f"POSTIMAGE_CHOICES_MISMATCH|path={repair['path']}|id={repair['id']}|actual={after.get('choices')!r}"
        )
    if after.get("answer") != repair["new_answer"]:
        raise RuntimeError(
            f"POSTIMAGE_ANSWER_MISMATCH|path={repair['path']}|id={repair['id']}|actual={after.get('answer')!r}"
        )
    if repair["old_common_wrong"] is not None:
        actual_common = ((after.get("answer_explanation") or {}).get("common_wrong_choice") or {}).get("choice")
        if actual_common != repair["new_common_wrong"]:
            raise RuntimeError(
                f"POSTIMAGE_COMMON_WRONG_MISMATCH|path={repair['path']}|id={repair['id']}|actual={actual_common!r}"
            )

    print(
        "REPAIRED"
        f"|path={repair['path']}"
        f"|id={repair['id']}"
        f"|choices={repair['old_choices']!r}->{repair['new_choices']!r}"
        f"|answer={repair['old_answer']!r}->{repair['new_answer']!r}"
    )


def main():
    seen = set()
    for repair in REPAIRS:
        key = (repair["path"], repair["id"])
        if key in seen:
            raise RuntimeError(f"DUPLICATE_REPAIR_SPEC|path={repair['path']}|id={repair['id']}")
        seen.add(key)
        patch_one(repair)

    conceptual_ids = {repair["id"] for repair in REPAIRS}
    print(f"REPAIR_VARIANT_COUNT={len(REPAIRS)}")
    print(f"UNIQUE_CARD_ID_COUNT={len(conceptual_ids)}")
    print("LANGUAGES=ko,en")
    print("RESULT=PASS_EXHAUSTIVE_CHOICE_REPAIR")


if __name__ == "__main__":
    main()

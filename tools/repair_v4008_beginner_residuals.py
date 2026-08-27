#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP_JS = ROOT / "src/pwa/app.js"
SW_JS = ROOT / "src/pwa/sw_v400_1.js"
KO_ROOT = ROOT / "data"
EN_ROOT = ROOT / "data_i18n/en"
AUDIT_OUT = ROOT / "docs/audits/v4008_beginner_residual_repair.json"
SELF_PATH = ROOT / "tools/repair_v4008_beginner_residuals.py"
WORKFLOW_PATH = ROOT / ".github/workflows/oneoff-v4008-beginner-residual-repair.yml"

EXPECTED_CARD_COUNT = 1785
EXPECTED_SOURCE_FILE_COUNT = 98
BEGINNER_MAX_LEVEL = 3

VISIBLE_ROOT_KEYS = (
    "title",
    "reading_goal",
    "code",
    "question",
    "choices",
    "answer",
    "explanation",
    "project_context",
    "concept_explanation",
    "teaching_example",
    "answer_explanation",
    "target_statement",
    "focus_span",
)

AUTHOR_TOKEN_EN = {
    "sequence_operation": "operation on a sequence",
    "name_reference": "reading a variable's current value",
    "attribute_access": "attribute access with a dot",
    "argument_passing": "passing an argument",
    "parameter_definition": "defining a parameter",
    "function_definition": "defining a function",
    "return_statement": "return statement",
    "if_statement": "if statement",
    "else_clause": "else branch",
    "for_statement": "for loop",
    "while_statement": "while loop",
    "membership_test": "membership check",
    "identity_test": "identity check",
    "boolean_operation": "Boolean operation",
    "conditional_expression": "conditional expression",
    "unary_operation": "unary operation",
    "await_expression": "await expression",
    "async_function_definition": "async function definition",
    "augmented_assignment": "augmented assignment",
    "match_statement": "match statement",
    "case_clause": "case branch",
}

AUTHOR_TOKEN_KO = {
    "sequence_operation": "값을 순서대로 처리하는 연산",
    "name_reference": "변수의 현재 값 읽기",
    "attribute_access": "점(.)으로 속성 읽기",
    "argument_passing": "함수에 값 전달하기",
    "parameter_definition": "함수가 받을 값 정하기",
    "function_definition": "함수 정의하기",
    "return_statement": "return으로 결과 돌려주기",
    "if_statement": "if 조건문",
    "else_clause": "else 분기",
    "for_statement": "for 반복문",
    "while_statement": "while 반복문",
    "membership_test": "포함 여부 확인",
    "identity_test": "같은 객체인지 확인",
    "boolean_operation": "참·거짓 연산",
    "conditional_expression": "조건에 따라 값 고르기",
    "unary_operation": "하나의 값에 적용하는 연산",
    "await_expression": "비동기 결과 기다리기",
    "async_function_definition": "비동기 함수 정의하기",
    "augmented_assignment": "기존 값을 계산해 다시 저장하기",
    "match_statement": "match로 경우 나누기",
    "case_clause": "case 분기",
}

KO_TEMPLATE_DESC = {
    "call": "함수 호출은 괄호 안의 값을 확인한 뒤 함수가 돌려주는 결과를 읽습니다.",
    "assignment": "값 저장은 오른쪽 값을 먼저 계산한 뒤 왼쪽 대상에 저장하는 흐름으로 읽습니다.",
    "literal": "코드에 직접 적힌 숫자나 문자열은 그 자체가 값으로 사용됩니다.",
    "subscription": "대괄호 조회는 대괄호 안의 key나 위치를 이용해 실제 값을 꺼냅니다.",
    "attribute_access": "점(.) 뒤의 이름을 읽어 객체의 속성이나 메서드를 찾는 표현입니다.",
    "for_statement": "for 반복문은 대상에서 값을 하나씩 꺼내 같은 코드 블록을 반복해서 실행합니다.",
    "if_statement": "if 조건문은 조건의 True/False를 먼저 판단한 뒤 실행할 분기를 고릅니다.",
    "membership_test": "in과 not in은 값이나 key가 대상 안에 포함되어 있는지 확인합니다.",
    "name_reference": "변수 이름을 만나면 그 시점에 변수에 저장된 현재 값을 찾아 읽습니다.",
    "sequence_operation": "문자열이나 리스트처럼 순서가 있는 값은 연산 뒤 어떤 결과가 만들어지는지 따라가며 읽습니다.",
    "return_statement": "return은 함수 안에서 만든 결과를 함수 밖의 호출 지점으로 돌려줍니다.",
}

EN_EXACT_TRANSLATIONS = {
    "비교라고 읽기": "Read it as a comparison",
    "이전 값": "Previous value",
    "계산 전 값": "Value before calculation",
    "숫자 덧셈 또는 자동 공백": "Numeric addition or an automatic space",
    "변수 값": "The variable's value",
    "문자열처럼 이어 붙이기": "Concatenate as strings",
    "나중 값 미리 적용": "Use a later value too early",
    "첫 항목만 보기": "Look only at the first item",
    "변환 전 문자열": "The string before conversion",
    "숫자와 문자열을 같은 종류로 보기": "Treat the number and string as the same type",
    "값 내용과 자료형 혼동": "Confuse the value with its data type",
    "숫자 곱셈으로 보기": "Treat it as numeric multiplication",
    "겉모양만 비교": "Compare only how the values look",
    "글자 하나 빠뜨리기": "Miss one character",
    "공백 빼고 세기": "Count without the space",
    "문자열 모양 그대로 유지": "Keep the original string form",
    "안내 문구를 저장값으로 보기": "Treat the prompt as the stored value",
    "숫자 모양을 정수로 보기": "Treat number-looking input as an integer",
    "안쪽 결과에서 멈추기": "Stop at the inner result",
    "프롬프트와 반환값 혼동": "Confuse the prompt with the return value",
    "원본과 결과를 같다고 보기": "Assume the original and result are the same",
    "대소문자 무시": "Ignore letter case",
    "기준 문자도 결과 항목으로 보기": "Treat the separator as part of the result",
    "변수 이름": "The variable name",
    "오류": "Error",
}

EN_PROMPT_REPLACEMENTS = (
    ("이름을 입력하세요: ", "Enter a name: "),
    ("이름을 입력하세요:", "Enter a name:"),
    ("도시를 입력하세요: ", "Enter a city: "),
    ("도시를 입력하세요:", "Enter a city:"),
    ("나이를 입력하세요: ", "Enter age: "),
    ("나이를 입력하세요:", "Enter age:"),
    ("개수를 입력하세요: ", "Enter a count: "),
    ("개수를 입력하세요:", "Enter a count:"),
    ("이름: ", "Name: "),
    ("이름:", "Name:"),
    ("도시: ", "City: "),
    ("도시:", "City:"),
    ("나이: ", "Age: "),
    ("나이:", "Age:"),
    ("개수: ", "Count: "),
    ("개수:", "Count:"),
)

EN_FORBIDDEN_PHRASES = (
    "Point of Misinterpretation:",
    "Point of misinterpretation:",
    "Common Misinterpretation:",
    "Common misinterpretation:",
    "A common source of confusion:",
    "As you can see,",
    "I explicitly specified",
    "You can interpret this as",
    "When I look at this, I interpret it as",
)

EN_KNOWN_BAD_PHRASES = (
    "inside `like`",
    "variable \".\"",
    "outer `input()` is executed once more after `int()`",
    "inner `int()` must first create the value that `input()` will modify",
    "`Sensor` What should",
    "What is the result of `text` when",
    "What is the result of `yes` when",
    "`value` When `None`",
)


def extract_paths(text: str, variable_name: str, next_marker: str) -> list[str]:
    block_re = re.compile(
        rf"const {re.escape(variable_name)} = \[(.*?)\];\s*\n\s*{re.escape(next_marker)}",
        re.S,
    )
    match = block_re.search(text)
    if not match:
        raise SystemExit(f"{variable_name} block not found in app.js")
    paths = re.findall(r'"(\.\./\.\./data/[^\"]+\.json)"', match.group(1))
    if not paths:
        raise SystemExit(f"no paths found for {variable_name}")
    if len(paths) != len(set(paths)):
        raise SystemExit(f"duplicate path in {variable_name}")
    return paths


def lesson_paths() -> list[str]:
    text = APP_JS.read_text(encoding="utf-8-sig")
    return extract_paths(text, "lessonFiles", "const lessonResults")


def load_sources(root: Path, paths: list[str]) -> tuple[dict[Path, list[dict]], list[tuple[Path, dict]]]:
    payloads: dict[Path, list[dict]] = {}
    rows: list[tuple[Path, dict]] = []
    for runtime_path in paths:
        rel = runtime_path.removeprefix("../../data/")
        path = root / rel
        payload = json.loads(path.read_text(encoding="utf-8-sig"))
        if not isinstance(payload, list):
            raise SystemExit(f"lesson source is not a list: {path}")
        payloads[path] = payload
        for card in payload:
            if isinstance(card, dict) and card.get("id"):
                rows.append((path, card))
    return payloads, rows


def level_of(card: dict) -> int:
    try:
        return int(card.get("level", 999))
    except Exception:
        return 999


def is_code_path(path: str) -> bool:
    return path == "code" or path == "target_statement" or path == "focus_span" or path.endswith(".code")


def normalize_double_backticks(text: str) -> str:
    previous = None
    current = text
    while previous != current:
        previous = current
        current = re.sub(r"``([^`\n]+)``", r"`\1`", current)
    return current


def replace_author_tokens(text: str, mapping: dict[str, str]) -> str:
    out = text
    for token, label in mapping.items():
        out = re.sub(rf"`{re.escape(token)}`", label, out)
        out = re.sub(rf"\b{re.escape(token)}\b", label, out)
    return out


def fix_en_text(text: str, path: str) -> str:
    out = normalize_double_backticks(text)

    stripped = out.strip()
    if stripped in EN_EXACT_TRANSLATIONS:
        return EN_EXACT_TRANSLATIONS[stripped]

    for old, new in EN_PROMPT_REPLACEMENTS:
        out = out.replace(old, new)

    out = re.sub(r"(\d+)\s*살", r"\1 years old", out)
    out = out.replace('"살"', '" years old"').replace("'살'", "' years old'")

    if is_code_path(path):
        return out

    phrase_replacements = (
        ("Point of Misinterpretation:", "Where it went wrong:"),
        ("Point of misinterpretation:", "Where it went wrong:"),
        ("Common Misinterpretation:", "Where it went wrong:"),
        ("Common misinterpretation:", "Where it went wrong:"),
        ("A common source of confusion:", "Common mistake:"),
        ("Commonly confusing incorrect answer:", "Common mistake:"),
        ("Commonly confusing incorrect answers:", "Common mistakes:"),
        ("I explicitly specified", "The code explicitly specifies"),
        ("You can interpret this as", "Read this as"),
        ("When I look at this, I interpret it as", "Read this as"),
        ("inside `like`", "inside the parentheses"),
    )
    for old, new in phrase_replacements:
        out = out.replace(old, new)
    out = re.sub(r"\bAs you can see,\s*", "", out)

    out = replace_author_tokens(out, AUTHOR_TOKEN_EN)

    out = re.sub(
        r"^(`[^`]+`)\s+This is a function that\b",
        r"\1 is a function that",
        out,
    )
    out = re.sub(
        r"^(`[^`]+`)\s+It is a function that\b",
        r"\1 is a function that",
        out,
    )
    out = re.sub(
        r"^(`[^`]+`)\s+It is a \*\*function that\b",
        r"\1 is a **function that",
        out,
    )
    out = re.sub(
        r"^`[^`]+`\s+(It(?:’|')s easy\b)",
        r"\1",
        out,
    )
    out = re.sub(r"\s+([,.;:?!])", r"\1", out)
    return out.strip()


def template_desc_ko(match: re.Match[str]) -> str:
    token = match.group(1)
    return KO_TEMPLATE_DESC.get(
        token,
        "이 카드에서는 코드가 값을 처리하는 순서와 최종 결과를 연결해서 읽습니다.",
    )


def fix_ko_text(text: str, path: str) -> str:
    out = normalize_double_backticks(text)
    if is_code_path(path):
        return out

    out = out.replace(
        "focus 표현식의 실제 평가 순서와 맞지 않는다.",
        "코드가 실제로 계산되는 순서와 맞지 않습니다.",
    )
    out = out.replace(
        "중간값과 최종 결과를 한 단계로 합쳐 읽지 않는다.",
        "중간값과 최종 결과를 구분해서 읽어야 합니다.",
    )
    out = re.sub(r"이번 카드는\s+([A-Za-z_][A-Za-z0-9_]*)\s+문법을 읽는다\.", template_desc_ko, out)
    out = replace_author_tokens(out, AUTHOR_TOKEN_KO)
    out = out.replace("bound method", "호출하기 전의 메서드 객체")
    out = out.replace("focus 표현식", "해당 코드")
    return out.strip()


def map_node(node, lang: str, path: str):
    if isinstance(node, str):
        return fix_en_text(node, path) if lang == "en" else fix_ko_text(node, path)
    if isinstance(node, list):
        return [map_node(value, lang, f"{path}[{idx}]") for idx, value in enumerate(node)]
    if isinstance(node, dict):
        return {key: map_node(value, lang, f"{path}.{key}") for key, value in node.items()}
    return node


def apply_visible_transform(card: dict, lang: str) -> None:
    for key in VISIBLE_ROOT_KEYS:
        if key in card:
            card[key] = map_node(card[key], lang, key)


def clean_focus(value: object) -> str:
    text = str(value or "").strip()
    while text.startswith("`") and text.endswith("`") and len(text) >= 2:
        text = text[1:-1].strip()
    return text


def rewrite_ko_focus_question(card: dict) -> None:
    question = str(card.get("question", ""))
    if "focus 표현식" not in question:
        return
    focus = clean_focus(card.get("focus_span") or card.get("target_statement") or "이 코드")
    qtype = str(card.get("question_type", ""))
    if qtype == "output_prediction":
        card["question"] = f"`{focus}`를 실행했을 때 결과로 맞는 것은?"
    elif qtype == "meaning_choice":
        card["question"] = f"`{focus}`의 의미로 맞는 것은?"
    elif qtype == "blank":
        card["question"] = f"`{focus}`에서 빈칸에 들어갈 내용으로 맞는 것은?"
    else:
        card["question"] = f"`{focus}`를 읽은 설명으로 맞는 것은?"


def patch_known_en_cards(by_id: dict[str, dict]) -> None:
    def card(cid: str) -> dict:
        if cid not in by_id:
            raise SystemExit(f"required English card missing: {cid}")
        return by_id[cid]

    l02 = card("L02_var_flow_001")
    l02["explanation"] = (
        "1) `label` stores the string \"LiDAR\". 2) `name = label` reads the current value of `label`, "
        "which is \"LiDAR\". 3) That value is stored in `name`. 4) `print(name)` prints `LiDAR`. "
        "Common mistake: `label` is a variable name, not the literal text \"label\"; without quotes, Python reads its stored value."
    )

    l03d = card("L03_dict_001")
    l03d["question"] = "What should go in `node[____]` to retrieve `Sensor`?"
    l03d["teaching_example"]["walkthrough"] = (
        "Using the key `\"kind\"` returns its associated value, `\"Sensor\"`. "
        "Put the key—not the desired value—inside the square brackets."
    )

    l03g = card("L03_get_001")
    l03g["question"] = "What does `row.get(\"doc_id\", \"NO_DOC\")` return?"
    l03g["explanation"] = (
        "1) `row` contains only the `label` key. 2) `get()` looks for `doc_id`. "
        "3) Because `doc_id` is missing, the second argument, `NO_DOC`, is returned. "
        "4) `value` stores `NO_DOC`, and `print(value)` prints it. "
        "Common mistake: `get()` can return `None` when no default is supplied, but this call explicitly provides `NO_DOC`."
    )
    l03g["answer_explanation"]["common_wrong_choice"]["why_wrong"] = (
        "This call explicitly provides `NO_DOC` as the second argument, so `get()` returns that default value when `doc_id` is missing."
    )

    p = card("PYF94_A1_L01_PRINT_001")
    p["concept_explanation"]["how_to_read"] = (
        "For `print(a + b)`, evaluate `a + b` first. After that calculation finishes, `print()` displays the result."
    )

    v = card("PYF94_A1_L01_VAR_007")
    v["title"] = "Quotation marks make `\"city\"` a string, not a variable"
    v["reading_goal"] = "Use quotation marks to distinguish a literal string from a variable lookup."
    v["concept_explanation"]["what_it_is"] = (
        "Text inside quotation marks is a string value. Even if a variable has the same name, Python does not look up that variable when the name is quoted."
    )
    v["concept_explanation"]["how_to_read"] = (
        "Read `\"city\"` as the literal text `city`. Read unquoted `city` as a variable whose current value must be looked up."
    )
    v["concept_explanation"]["common_mistake"] = (
        "It is easy to treat `city` and `\"city\"` as the same thing. `city` is a variable; `\"city\"` is literal text."
    )

    i2 = card("PYF94_A1_L01_INPUT_002")
    i2["title"] = "`input()` stores number-looking input as text by default"
    i2["explanation"] = (
        "Even if the user types `10`, `input()` returns the string \"10\". That string is stored in `age`, "
        "so `print(age)` displays 10. The important point is the data type: the stored value is text until code such as `int(age)` converts it."
    )
    i2["answer_explanation"]["step_by_step"] = (
        "The user types 10. `input()` returns the string \"10\", and that string is stored in `age`. "
        "Then `print(age)` displays the stored text."
    )

    i3 = card("PYF94_A1_L01_INPUT_003")
    i3["concept_explanation"]["common_mistake"] = (
        "It is easy to stop after the inner `input()` call and forget the outer `int()`. "
        "Python first gets a string from `input()`, then `int()` converts that string to an integer."
    )
    i3["answer_explanation"]["common_wrong_choice"]["why_wrong"] = (
        "The string returned by `input()` is only the inner result. The outer `int()` then converts it to the integer 10 before the value is stored in `age`."
    )

    i7 = card("PYF94_A1_L01_INPUT_007")
    i7["question"] = "If `text` is `\"  hi  \"`, what does `text.strip()` return?"

    i8 = card("PYF94_A1_L01_INPUT_008")
    i8["question"] = "If the user enters `yes`, what does `answer == \"yes\"` return?"

    n = card("PY_L02_none_001")
    n["question"] = "If `value` is `None`, what does `value is None` return?"

    s = card("PY3_L03_strip_001")
    s["question"] = "If `raw` is `\"  LiDAR  \"`, what does `raw.strip()` return?"


def patch_known_ko_cards(by_id: dict[str, dict]) -> None:
    overrides = {
        "PYF95_A2_DTS_008_DICT_VALUES_LIST": (
            "`data.values`처럼 괄호 없이 점(.) 뒤 이름만 읽으면 메서드를 아직 실행하지 않고, 나중에 호출할 수 있는 메서드 객체를 가리킵니다."
        ),
        "PYF95_A2_DTS_010_DICT_FOR_KEYS": (
            "`for name in scores:`처럼 dict를 직접 반복하면 key가 하나씩 반복 변수에 들어옵니다."
        ),
        "PYF95_A2_DTS_011_DICT_FOR_ITEMS": (
            "`scores.items()`는 `(key, value)` 쌍을 만들고, `for name, score ...`는 각 쌍의 첫 값과 둘째 값을 두 변수에 나눠 담습니다."
        ),
        "PYF95_A2_DTS_012_DICT_IN_KEY_TRUE": (
            "`\"name\" in user`는 dict에 `name`이라는 key가 있는지 확인해 `True` 또는 `False`를 만듭니다."
        ),
    }
    for cid, sentence in overrides.items():
        row = by_id.get(cid)
        if row is None:
            raise SystemExit(f"required Korean card missing: {cid}")
        row.setdefault("concept_explanation", {})["what_it_is"] = sentence


def mutate_language(payloads: dict[Path, list[dict]], rows: list[tuple[Path, dict]], lang: str) -> tuple[int, set[Path]]:
    before = {path: copy.deepcopy(payload) for path, payload in payloads.items()}
    by_id = {str(card.get("id")): card for _, card in rows if card.get("id")}

    if lang == "en":
        patch_known_en_cards(by_id)
    else:
        patch_known_ko_cards(by_id)

    for _, card in rows:
        if level_of(card) > BEGINNER_MAX_LEVEL:
            continue
        if lang == "ko":
            rewrite_ko_focus_question(card)
        apply_visible_transform(card, lang)

    changed_files: set[Path] = set()
    changed_cards = 0
    for path, payload in payloads.items():
        if payload != before[path]:
            changed_files.add(path)
            before_cards = {str(c.get("id")): c for c in before[path] if isinstance(c, dict) and c.get("id")}
            for c in payload:
                if not isinstance(c, dict) or not c.get("id"):
                    continue
                if c != before_cards.get(str(c.get("id"))):
                    changed_cards += 1
            path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return changed_cards, changed_files


def iter_visible_strings(card: dict):
    def walk(node, path: str):
        if isinstance(node, str):
            yield path, node
        elif isinstance(node, list):
            for idx, value in enumerate(node):
                yield from walk(value, f"{path}[{idx}]")
        elif isinstance(node, dict):
            for key, value in node.items():
                yield from walk(value, f"{path}.{key}")

    for key in VISIBLE_ROOT_KEYS:
        if key in card:
            yield from walk(card[key], key)


def empty_scan() -> dict:
    return {
        "en_hangul": [],
        "en_double_backtick": [],
        "en_author_token": [],
        "en_forbidden_phrase": [],
        "en_known_bad": [],
        "ko_focus": [],
        "ko_internal_template": [],
        "ko_author_token": [],
        "ko_bound_method": [],
    }


def add_issue(scan: dict, category: str, rel: str, card: dict, field: str, sample: str, detail: object = None) -> None:
    if len(scan[category]) >= 80:
        return
    item = {
        "file": rel,
        "id": card.get("id"),
        "field": field,
        "sample": sample[:260],
    }
    if detail is not None:
        item["detail"] = detail
    scan[category].append(item)


def scan_bundle(bundle: dict, lang: str) -> dict:
    scan = empty_scan()
    en_author_re = re.compile(r"\b(?:" + "|".join(re.escape(x) for x in AUTHOR_TOKEN_EN) + r")\b")
    ko_author_re = re.compile(r"\b(?:" + "|".join(re.escape(x) for x in AUTHOR_TOKEN_KO) + r")\b")

    for rel, cards in bundle.get("files", {}).items():
        for card in cards:
            if not isinstance(card, dict) or level_of(card) > BEGINNER_MAX_LEVEL:
                continue
            for field, value in iter_visible_strings(card):
                code_field = is_code_path(field)
                if lang == "en":
                    if re.search(r"[가-힣]", value):
                        add_issue(scan, "en_hangul", rel, card, field, value)
                    if "``" in value:
                        add_issue(scan, "en_double_backtick", rel, card, field, value)
                    if not code_field:
                        tokens = sorted(set(en_author_re.findall(value)))
                        if tokens:
                            add_issue(scan, "en_author_token", rel, card, field, value, tokens)
                        hits = [phrase for phrase in EN_FORBIDDEN_PHRASES if phrase in value]
                        if hits:
                            add_issue(scan, "en_forbidden_phrase", rel, card, field, value, hits)
                        bad = [phrase for phrase in EN_KNOWN_BAD_PHRASES if phrase in value]
                        if bad:
                            add_issue(scan, "en_known_bad", rel, card, field, value, bad)
                else:
                    if not code_field:
                        if re.search(r"\bfocus\b", value, re.I):
                            add_issue(scan, "ko_focus", rel, card, field, value)
                        if "이번 카드는" in value and "문법" in value:
                            add_issue(scan, "ko_internal_template", rel, card, field, value)
                        tokens = sorted(set(ko_author_re.findall(value)))
                        if tokens:
                            add_issue(scan, "ko_author_token", rel, card, field, value, tokens)
                        if "bound method" in value:
                            add_issue(scan, "ko_bound_method", rel, card, field, value)
    return scan


def scan_counts(scan: dict) -> dict[str, int]:
    return {key: len(value) for key, value in scan.items()}


def bump_cache() -> None:
    text = SW_JS.read_text(encoding="utf-8-sig")
    old_release = 'const RELEASE = "20260827_v400_8_beginner_quality4";'
    old_cache = 'const CACHE_NAME = "python-reading-trainer-v400-8-beginner-quality4-20260827";'
    if text.count(old_release) != 1 or text.count(old_cache) != 1:
        raise SystemExit("unexpected V400.8 cache marker before residual repair")
    text = text.replace(old_release, 'const RELEASE = "20260827_v400_8_beginner_quality5";', 1)
    text = text.replace(old_cache, 'const CACHE_NAME = "python-reading-trainer-v400-8-beginner-quality5-20260827";', 1)
    SW_JS.write_text(text, encoding="utf-8")


def load_bundle(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    paths = lesson_paths()
    if len(paths) != EXPECTED_SOURCE_FILE_COUNT:
        raise SystemExit(f"unexpected lesson source file count: {len(paths)}")

    ko_payloads, ko_rows = load_sources(KO_ROOT, paths)
    en_payloads, en_rows = load_sources(EN_ROOT, paths)
    if len(ko_rows) != EXPECTED_CARD_COUNT or len(en_rows) != EXPECTED_CARD_COUNT:
        raise SystemExit(f"card count mismatch before repair: ko={len(ko_rows)} en={len(en_rows)}")

    # Record expanded pre-repair scan from the current runtime bundles when available.
    pre_ko_bundle = load_bundle(ROOT / "data/runtime/lesson_bundle_v400_5.json")
    pre_en_bundle = load_bundle(ROOT / "data_i18n/en/runtime/lesson_bundle_v400_5.json")
    pre_ko = scan_bundle(pre_ko_bundle, "ko")
    pre_en = scan_bundle(pre_en_bundle, "en")

    ko_changed_cards, ko_changed_files = mutate_language(ko_payloads, ko_rows, "ko")
    en_changed_cards, en_changed_files = mutate_language(en_payloads, en_rows, "en")

    subprocess.run([sys.executable, "tools/build_runtime_lesson_bundle_v400_5.py"], cwd=ROOT, check=True)

    ko_bundle = load_bundle(ROOT / "data/runtime/lesson_bundle_v400_5.json")
    en_bundle = load_bundle(ROOT / "data_i18n/en/runtime/lesson_bundle_v400_5.json")
    if ko_bundle.get("card_count") != EXPECTED_CARD_COUNT or en_bundle.get("card_count") != EXPECTED_CARD_COUNT:
        raise SystemExit("card count regression after rebuild")
    if ko_bundle.get("source_file_count") != EXPECTED_SOURCE_FILE_COUNT or en_bundle.get("source_file_count") != EXPECTED_SOURCE_FILE_COUNT:
        raise SystemExit("source file count regression after rebuild")

    post_ko = scan_bundle(ko_bundle, "ko")
    post_en = scan_bundle(en_bundle, "en")
    post_counts = scan_counts(post_ko)
    for key, value in scan_counts(post_en).items():
        post_counts[key] = value

    bump_cache()

    report = {
        "schema": "python-reading-trainer/v4008-beginner-residual-repair-v1",
        "scope": "all learner-visible structured fields, including code, on Level 1-3 cards; KO/EN runtime corpus",
        "ko_card_count": ko_bundle["card_count"],
        "en_card_count": en_bundle["card_count"],
        "ko_source_file_count": ko_bundle["source_file_count"],
        "en_source_file_count": en_bundle["source_file_count"],
        "changed": {
            "ko_cards": ko_changed_cards,
            "ko_files": len(ko_changed_files),
            "en_cards": en_changed_cards,
            "en_files": len(en_changed_files),
        },
        "pre_counts": {**scan_counts(pre_ko), **scan_counts(pre_en)},
        "post_counts": post_counts,
        "post_samples": {
            **{k: v for k, v in post_ko.items() if v},
            **{k: v for k, v in post_en.items() if v},
        },
        "confirmed_semantic_repairs": [
            "L02 variable-value explanation malformed token cleanup",
            "L03 dict.get default-value semantic correction",
            "PYF94 quoted city variable/string distinction",
            "PYF94 input string semantics and Korean prompt localization",
            "PYF94 nested int(input()) execution-order correction",
            "PYF94 strip/comparison question grammar",
            "PY_L02 None question grammar",
            "PY3_L03 strip question grammar",
            "KO generated focus wording replacement",
            "KO internal author-token and template cleanup",
            "EN Hangul residue and double-backtick cleanup",
        ],
    }
    AUDIT_OUT.parent.mkdir(parents=True, exist_ok=True)
    AUDIT_OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print("=== V400.8 BEGINNER RESIDUAL REPAIR ===")
    print(f"KO_CHANGED_CARDS={ko_changed_cards}")
    print(f"KO_CHANGED_FILES={len(ko_changed_files)}")
    print(f"EN_CHANGED_CARDS={en_changed_cards}")
    print(f"EN_CHANGED_FILES={len(en_changed_files)}")
    for key in sorted(post_counts):
        print(f"POST_{key.upper()}={post_counts[key]}")

    blocking = {key: value for key, value in post_counts.items() if value != 0}
    if blocking:
        print("BLOCKING_RESIDUALS=" + json.dumps(blocking, ensure_ascii=False, sort_keys=True))
        for category, items in report["post_samples"].items():
            print(f"RESIDUAL_SAMPLE_CATEGORY={category}")
            for item in items[:12]:
                print(json.dumps(item, ensure_ascii=False))
        raise SystemExit("learner-visible residuals remain")

    # One-shot repair: successful commit should contain only product/audit changes.
    if SELF_PATH.exists():
        SELF_PATH.unlink()
    if WORKFLOW_PATH.exists():
        WORKFLOW_PATH.unlink()

    print("V4008_BEGINNER_RESIDUAL_REPAIR_PASS=True")


if __name__ == "__main__":
    main()

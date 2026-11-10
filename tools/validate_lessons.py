# -*- coding: utf-8 -*-
import argparse
import ast
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


def nonempty_value(value):
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict, tuple, set)):
        return bool(value)
    return value is not None


def flatten_text(value):
    if isinstance(value, str):
        return value
    if isinstance(value, dict):
        return " ".join(flatten_text(item) for item in value.values())
    if isinstance(value, (list, tuple)):
        return " ".join(flatten_text(item) for item in value)
    return "" if value is None else str(value)


def load_english_lesson_cards(root: Path, lesson_files):
    cards = []
    sources = {}
    missing = []
    errors = []

    for rel in lesson_files:
        filename = Path(rel).name
        path = root / "data_i18n" / "en" / "lessons" / filename
        if not path.exists():
            missing.append(filename)
            continue
        try:
            payload = load_json(path)
        except Exception as exc:
            errors.append((filename, repr(exc)))
            continue
        if not isinstance(payload, list):
            errors.append((filename, "top-level JSON is not a list"))
            continue
        for card in payload:
            if not isinstance(card, dict) or not card.get("id"):
                continue
            cards.append(card)
            sources[card.get("id")] = f"data_i18n/en/lessons/{filename}"

    return cards, sources, missing, errors


def teaching_primary_syntax_status(card):
    primary = str(card.get("primary_concept") or "").strip()
    teaching = card.get("teaching_example") or {}
    code = str(teaching.get("code") or "").strip()
    if not code:
        return "MISSING"

    try:
        tree = ast.parse(code)
    except SyntaxError:
        return "PARSE_ERROR"

    nodes = list(ast.walk(tree))

    def any_node(*types):
        return any(isinstance(node, types) for node in nodes)

    if primary == "call":
        return "PASS" if any_node(ast.Call) else "FAIL"
    if primary == "argument_passing":
        return "PASS" if any(
            isinstance(node, ast.Call) and (node.args or node.keywords)
            for node in nodes
        ) else "FAIL"
    if primary == "parameter_definition":
        return "PASS" if any(
            isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
            and (
                node.args.args
                or node.args.posonlyargs
                or node.args.kwonlyargs
                or node.args.vararg
                or node.args.kwarg
            )
            for node in nodes
        ) else "FAIL"
    if primary == "return_statement":
        return "PASS" if any_node(ast.Return) else "FAIL"
    if primary == "function_definition":
        return "PASS" if any_node(ast.FunctionDef) else "FAIL"
    if primary == "async_function_definition":
        return "PASS" if any_node(ast.AsyncFunctionDef) else "FAIL"
    if primary == "class_definition":
        return "PASS" if any_node(ast.ClassDef) else "FAIL"
    if primary == "assignment":
        return "PASS" if any_node(ast.Assign, ast.AnnAssign, ast.NamedExpr) else "FAIL"
    if primary == "augmented_assignment":
        return "PASS" if any_node(ast.AugAssign) else "FAIL"
    if primary == "subscription":
        return "PASS" if any_node(ast.Subscript) else "FAIL"
    if primary == "slice":
        return "PASS" if any_node(ast.Slice) else "FAIL"
    if primary == "attribute_access":
        return "PASS" if any_node(ast.Attribute) else "FAIL"
    if primary == "name_reference":
        return "PASS" if any_node(ast.Name) else "FAIL"
    if primary == "literal":
        return "PASS" if any_node(ast.Constant, ast.List, ast.Tuple, ast.Dict, ast.Set) else "FAIL"
    if primary == "if_statement":
        return "PASS" if any_node(ast.If) else "FAIL"
    if primary == "elif_clause":
        return "PASS" if any(
            isinstance(node, ast.If)
            and node.orelse
            and isinstance(node.orelse[0], ast.If)
            for node in nodes
        ) else "FAIL"
    if primary == "else_clause":
        return "PASS" if any(
            isinstance(node, (ast.If, ast.For, ast.While, ast.Try))
            and bool(getattr(node, "orelse", []))
            for node in nodes
        ) else "FAIL"
    if primary == "conditional_expression":
        return "PASS" if any_node(ast.IfExp) else "FAIL"
    if primary == "for_statement":
        return "PASS" if any_node(ast.For, ast.AsyncFor) else "FAIL"
    if primary == "while_statement":
        return "PASS" if any_node(ast.While) else "FAIL"
    if primary == "break_statement":
        return "PASS" if any_node(ast.Break) else "FAIL"
    if primary == "continue_statement":
        return "PASS" if any_node(ast.Continue) else "FAIL"
    if primary == "try_statement":
        return "PASS" if any_node(ast.Try) else "FAIL"
    if primary == "except_clause":
        return "PASS" if any(
            isinstance(node, ast.Try) and bool(node.handlers)
            for node in nodes
        ) else "FAIL"
    if primary == "try_else_clause":
        return "PASS" if any(
            isinstance(node, ast.Try) and bool(node.orelse)
            for node in nodes
        ) else "FAIL"
    if primary == "finally_clause":
        return "PASS" if any(
            isinstance(node, ast.Try) and bool(node.finalbody)
            for node in nodes
        ) else "FAIL"
    if primary == "with_statement":
        return "PASS" if any_node(ast.With) else "FAIL"
    if primary == "async_with_statement":
        return "PASS" if any_node(ast.AsyncWith) else "FAIL"
    if primary == "raise_statement":
        return "PASS" if any_node(ast.Raise) else "FAIL"
    if primary == "assert_statement":
        return "PASS" if any_node(ast.Assert) else "FAIL"
    if primary == "lambda_expression":
        return "PASS" if any_node(ast.Lambda) else "FAIL"
    if primary == "list_comprehension":
        return "PASS" if any_node(ast.ListComp) else "FAIL"
    if primary == "dict_comprehension":
        return "PASS" if any_node(ast.DictComp) else "FAIL"
    if primary == "set_comprehension":
        return "PASS" if any_node(ast.SetComp) else "FAIL"
    if primary == "generator_expression":
        return "PASS" if any_node(ast.GeneratorExp) else "FAIL"
    if primary == "await_expression":
        return "PASS" if any_node(ast.Await) else "FAIL"
    if primary == "yield_expression":
        return "PASS" if any_node(ast.Yield, ast.YieldFrom) else "FAIL"
    if primary == "decorator":
        return "PASS" if any(
            isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef))
            and bool(node.decorator_list)
            for node in nodes
        ) else "FAIL"
    if primary == "import_statement":
        return "PASS" if any_node(ast.Import) else "FAIL"
    if primary == "from_import_statement":
        return "PASS" if any_node(ast.ImportFrom) else "FAIL"
    if primary == "f_string":
        return "PASS" if any_node(ast.JoinedStr) else "FAIL"
    if primary == "comparison":
        return "PASS" if any_node(ast.Compare) else "FAIL"
    if primary == "membership_test":
        return "PASS" if any(
            isinstance(node, ast.Compare)
            and any(isinstance(op, (ast.In, ast.NotIn)) for op in node.ops)
            for node in nodes
        ) else "FAIL"
    if primary == "identity_test":
        return "PASS" if any(
            isinstance(node, ast.Compare)
            and any(isinstance(op, (ast.Is, ast.IsNot)) for op in node.ops)
            for node in nodes
        ) else "FAIL"
    if primary == "boolean_operation":
        return "PASS" if any_node(ast.BoolOp) else "FAIL"
    if primary == "arithmetic":
        return "PASS" if any_node(ast.BinOp) else "FAIL"
    if primary == "unary_operation":
        return "PASS" if any_node(ast.UnaryOp) else "FAIL"
    if primary == "matrix_multiplication":
        return "PASS" if any(
            isinstance(node, ast.BinOp) and isinstance(node.op, ast.MatMult)
            for node in nodes
        ) else "FAIL"
    if primary == "pass_statement":
        return "PASS" if any_node(ast.Pass) else "FAIL"
    if primary == "global_statement":
        return "PASS" if any_node(ast.Global) else "FAIL"
    if primary == "match_statement" and hasattr(ast, "Match"):
        return "PASS" if any_node(ast.Match) else "FAIL"

    return "NOT_CHECKED"


def boolean_contradiction_details(card, language):
    code = str(card.get("code") or "")
    prose = " ".join(
        [
            str(card.get("explanation") or ""),
            str((card.get("concept_explanation") or {}).get("key_point") or ""),
        ]
    )
    details = []
    assignments = re.findall(
        r"(?m)^\s*([A-Za-z_]\w*)\s*=\s*(True|False)\s*(?:#.*)?$",
        code,
    )
    tick = chr(96)

    for name, actual in assignments:
        opposite = "False" if actual == "True" else "True"
        if language == "ko":
            patterns = [
                f"{name}의 현재 값은 {opposite}",
                f"{name}는 {opposite}다",
                f"{name}는 {opposite}입니다",
                f"{name}={opposite}이므로",
                f"{name} = {opposite}이므로",
            ]
        else:
            patterns = [
                f"current value of {tick}{name}{tick} is {tick}{opposite}{tick}",
                f"current value of {name} is {opposite}",
                f"Since {tick}{name}{tick} is {opposite}",
                f"Because {tick}{name}{tick} is {opposite}",
            ]

        if any(pattern in prose for pattern in patterns):
            details.append(f"{name}={actual} but prose states {opposite}")

    return details


def explanation_readiness_rows(cards, sources, language):
    metrics = Counter()
    candidates = []
    ce_fields = ["what_it_is", "how_to_read", "key_point", "common_mistake"]
    te_fields = ["code", "walkthrough"]
    ae_fields = ["step_by_step", "why_correct", "takeaway"]
    tick = chr(96)

    for card in cards:
        cid = str(card.get("id") or "")
        source = sources.get(cid, "")
        metrics["TOTAL"] += 1

        ce = card.get("concept_explanation")
        te = card.get("teaching_example")
        ae = card.get("answer_explanation")

        if isinstance(ce, dict):
            metrics["CONCEPT_EXPLANATION_OBJECT"] += 1
        if isinstance(te, dict):
            metrics["TEACHING_EXAMPLE_OBJECT"] += 1
        if isinstance(ae, dict):
            metrics["ANSWER_EXPLANATION_OBJECT"] += 1

        missing = []
        for field in ce_fields:
            if not nonempty_value((ce or {}).get(field) if isinstance(ce, dict) else None):
                missing.append(f"concept_explanation.{field}")
            else:
                metrics[f"CE_{field.upper()}"] += 1
        for field in te_fields:
            if not nonempty_value((te or {}).get(field) if isinstance(te, dict) else None):
                missing.append(f"teaching_example.{field}")
            else:
                metrics[f"TE_{field.upper()}"] += 1
        for field in ae_fields:
            if not nonempty_value((ae or {}).get(field) if isinstance(ae, dict) else None):
                missing.append(f"answer_explanation.{field}")
            else:
                metrics[f"AE_{field.upper()}"] += 1

        wrong_choice = (
            (ae or {}).get("common_wrong_choice")
            if isinstance(ae, dict)
            else None
        )
        if isinstance(wrong_choice, dict) and any(
            nonempty_value(wrong_choice.get(field))
            for field in ["choice", "why_wrong", "misread_step"]
        ):
            metrics["AE_COMMON_WRONG_CHOICE"] += 1
        else:
            missing.append("answer_explanation.common_wrong_choice")

        if not missing:
            metrics["RICH_COMPLETE"] += 1
        else:
            candidates.append(
                (language, cid, "MISSING_RICH_FIELDS", source, ",".join(missing))
            )

        syntax_status = teaching_primary_syntax_status(card)
        metrics[f"TEACHING_SYNTAX_{syntax_status}"] += 1
        if syntax_status in {"FAIL", "PARSE_ERROR", "MISSING"}:
            candidates.append(
                (
                    language,
                    cid,
                    "TEACHING_PRIMARY_SYNTAX_" + syntax_status,
                    source,
                    str(card.get("primary_concept") or ""),
                )
            )

        for detail in boolean_contradiction_details(card, language):
            candidates.append(
                (language, cid, "BOOLEAN_LITERAL_CONTRADICTION", source, detail)
            )

        rich_blob = " ".join(
            [
                str(card.get("explanation") or ""),
                flatten_text(ce),
                flatten_text(te),
                flatten_text(ae),
            ]
        )

        if language == "ko":
            placeholder_markers = [
                "target의 메서드 호출",
                "target의 함수 호출",
                "target 메서드 호출",
            ]
        else:
            placeholder_markers = [
                "Calling the " + tick + "target" + tick + " method",
                "Calling the target method",
            ]

        if any(marker in rich_blob for marker in placeholder_markers):
            candidates.append(
                (language, cid, "PLACEHOLDER_TEXT", source, "target placeholder")
            )

        if re.search(
            r"\x60\x60\s+(?:targets|returns|fills|removes|selects)\b",
            rich_blob,
            flags=re.IGNORECASE,
        ):
            candidates.append(
                (language, cid, "BROKEN_INLINE_MARKUP", source, "double-backtick fragment")
            )

        code = str(card.get("code") or "")
        mock_names = re.findall(
            r"class\s+((?:Demo|Mock|Local)[A-Za-z_]\w*)",
            code,
        )
        if mock_names:
            domain_blob = " ".join(
                [
                    str(card.get("title") or ""),
                    str(card.get("project_context") or ""),
                    str(card.get("coverage_domain") or ""),
                    " ".join(str(value) for value in (card.get("coverage_topics") or [])),
                    rich_blob,
                ]
            )
            external_terms = [
                "pandas",
                "DataFrame",
                "Series",
                "FastAPI",
                "response_model",
                "embedding",
                "vector",
                "torch",
                "sklearn",
                "requests",
                "Pydantic",
                "NumPy",
                "numpy",
            ]
            if any(term.lower() in domain_blob.lower() for term in external_terms):
                if language == "ko":
                    boundary_markers = [
                        "모의",
                        "로컬",
                        "local",
                        "stub",
                        "실제",
                        "아닙",
                        "아니다",
                    ]
                else:
                    boundary_markers = [
                        "mock",
                        "local",
                        "stub",
                        "not actual",
                        "not an actual",
                        "not a real",
                        "different object type",
                    ]
                if not any(
                    marker.lower() in rich_blob.lower()
                    for marker in boundary_markers
                ):
                    candidates.append(
                        (
                            language,
                            cid,
                            "MOCK_EXTERNAL_BOUNDARY_REVIEW",
                            source,
                            ",".join(mock_names),
                        )
                    )

    return metrics, candidates


def print_explanation_readiness(root, lesson_files, lesson_cards, lesson_card_sources, limit):
    en_cards, en_sources, en_missing, en_errors = load_english_lesson_cards(
        root,
        lesson_files,
    )
    ko_metrics, ko_candidates = explanation_readiness_rows(
        lesson_cards,
        lesson_card_sources,
        "KO",
    )
    en_metrics, en_candidates = explanation_readiness_rows(
        en_cards,
        en_sources,
        "EN",
    )

    ko_ids = {str(card.get("id") or "") for card in lesson_cards}
    en_ids = {str(card.get("id") or "") for card in en_cards}
    candidates = ko_candidates + en_candidates
    issue_counts = Counter(row[2] for row in candidates)

    print()
    print("EXPLANATION_READINESS_R1")
    print(f"KO_TOTAL={ko_metrics['TOTAL']}")
    print(f"EN_TOTAL={en_metrics['TOTAL']}")
    print(f"EN_MISSING_FILES={len(en_missing)}")
    print(f"EN_JSON_ERRORS={len(en_errors)}")
    print(f"KO_ONLY_IDS={len(ko_ids - en_ids)}")
    print(f"EN_ONLY_IDS={len(en_ids - ko_ids)}")

    metric_keys = [
        "RICH_COMPLETE",
        "CONCEPT_EXPLANATION_OBJECT",
        "TEACHING_EXAMPLE_OBJECT",
        "ANSWER_EXPLANATION_OBJECT",
        "CE_WHAT_IT_IS",
        "CE_HOW_TO_READ",
        "CE_KEY_POINT",
        "CE_COMMON_MISTAKE",
        "TE_CODE",
        "TE_WALKTHROUGH",
        "AE_STEP_BY_STEP",
        "AE_WHY_CORRECT",
        "AE_TAKEAWAY",
        "AE_COMMON_WRONG_CHOICE",
        "TEACHING_SYNTAX_PASS",
        "TEACHING_SYNTAX_FAIL",
        "TEACHING_SYNTAX_PARSE_ERROR",
        "TEACHING_SYNTAX_MISSING",
        "TEACHING_SYNTAX_NOT_CHECKED",
    ]
    for key in metric_keys:
        print(f"KO_{key}={ko_metrics[key]}")
        print(f"EN_{key}={en_metrics[key]}")

    print(
        "READINESS_ISSUE_COUNTS="
        + json.dumps(dict(sorted(issue_counts.items())), ensure_ascii=False)
    )
    print(f"READINESS_CANDIDATE_COUNT={len(candidates)}")

    safe_limit = max(0, int(limit))
    for language, cid, issue, source, detail in candidates[:safe_limit]:
        clean_detail = re.sub(r"[\r\n\t]+", " ", str(detail)).strip()
        print(
            "READINESS_CANDIDATE"
            f"\t{language}"
            f"\t{cid}"
            f"\t{issue}"
            f"\t{source}"
            f"\t{clean_detail}"
        )

    if en_missing:
        print("EN_MISSING_FILE_SAMPLE=" + ",".join(en_missing[:20]))
    if en_errors:
        print(
            "EN_JSON_ERROR_SAMPLE="
            + json.dumps(en_errors[:20], ensure_ascii=False)
        )
    if ko_ids - en_ids:
        print("KO_ONLY_ID_SAMPLE=" + ",".join(sorted(ko_ids - en_ids)[:20]))
    if en_ids - ko_ids:
        print("EN_ONLY_ID_SAMPLE=" + ",".join(sorted(en_ids - ko_ids)[:20]))

    print("EXPLANATION_READINESS_R1=COMPLETE_NON_BLOCKING")
    print()


def main():
    parser = argparse.ArgumentParser(description="Validate python-reading-trainer lesson and side card data.")
    parser.add_argument("--root", default=".", help="Project root directory")
    parser.add_argument("--expected-app-version", default=None)
    parser.add_argument("--expected-lesson-cards", type=int, default=None)
    parser.add_argument("--explanation-readiness", action="store_true")
    parser.add_argument("--explanation-readiness-limit", type=int, default=200)
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

    pandas_fill_id = "PY122_L06_ISNA_FILLNA_001"
    pandas_drop_id = "PY122_L06_DROPNA_FLOW_001"

    pandas_fill = next(
        (card for card in lesson_cards if card.get("id") == pandas_fill_id),
        None,
    )
    if pandas_fill is None:
        semantic_invariant_errors.append((pandas_fill_id, "ko_card_missing"))
    else:
        fill_explanation = str(pandas_fill.get("explanation") or "")
        fill_why = str(
            (pandas_fill.get("answer_explanation") or {}).get("why_correct") or ""
        )
        if "DemoSeries" not in fill_explanation or "pandas" not in fill_explanation:
            semantic_invariant_errors.append((pandas_fill_id, "ko_mock_context_missing"))
        if "target의 메서드 호출" in fill_explanation or "target의 메서드 호출" in fill_why:
            semantic_invariant_errors.append((pandas_fill_id, "ko_target_placeholder"))
        if pandas_fill.get("answer") != "score 값의 None을 0으로 채운 결과를 만든다":
            semantic_invariant_errors.append((pandas_fill_id, "ko_answer_drift"))

    pandas_drop = next(
        (card for card in lesson_cards if card.get("id") == pandas_drop_id),
        None,
    )
    if pandas_drop is None:
        semantic_invariant_errors.append((pandas_drop_id, "ko_card_missing"))
    else:
        drop_explanation = str(pandas_drop.get("explanation") or "")
        if "class DemoFrame(list)" not in str(pandas_drop.get("code") or ""):
            semantic_invariant_errors.append((pandas_drop_id, "ko_mock_code_missing"))
        if pandas_drop.get("answer") != "score 값이 None인 행을 제외한 새 DemoFrame":
            semantic_invariant_errors.append((pandas_drop_id, "ko_answer_not_demoframe"))
        if "DemoFrame" not in drop_explanation or "pandas DataFrame" not in drop_explanation:
            semantic_invariant_errors.append((pandas_drop_id, "ko_mock_real_boundary_missing"))

    en_pandas_path = (
        root
        / "data_i18n"
        / "en"
        / "lessons"
        / "python_pandas_beginner_v122_a1.json"
    )
    if not en_pandas_path.exists():
        semantic_invariant_errors.append(("PY122", "en_file_missing"))
    else:
        try:
            en_pandas_cards = load_json(en_pandas_path)
        except Exception as exc:
            semantic_invariant_errors.append(("PY122", f"en_json_error:{exc!r}"))
        else:
            en_fill = next(
                (
                    card
                    for card in en_pandas_cards
                    if isinstance(card, dict) and card.get("id") == pandas_fill_id
                ),
                None,
            )
            en_drop = next(
                (
                    card
                    for card in en_pandas_cards
                    if isinstance(card, dict) and card.get("id") == pandas_drop_id
                ),
                None,
            )

            if en_fill is None:
                semantic_invariant_errors.append((pandas_fill_id, "en_card_missing"))
            else:
                en_fill_blob = " ".join(
                    [
                        str(en_fill.get("explanation") or ""),
                        str((en_fill.get("concept_explanation") or {}).get("common_mistake") or ""),
                        str((en_fill.get("answer_explanation") or {}).get("why_correct") or ""),
                    ]
                )
                target_placeholder = (
                    "Calling the " + chr(96) + "target" + chr(96) + " method"
                )
                broken_marker = chr(96) * 2 + " targets"
                if "DemoSeries" not in en_fill_blob or "pandas" not in en_fill_blob:
                    semantic_invariant_errors.append((pandas_fill_id, "en_mock_context_missing"))
                if target_placeholder in en_fill_blob or broken_marker in en_fill_blob:
                    semantic_invariant_errors.append((pandas_fill_id, "en_placeholder_or_broken_markup"))
                en_fill_answer = str(en_fill.get("answer") or "").replace(chr(96), "")
                if en_fill_answer != "Create a result where None values under score are filled with 0":
                    semantic_invariant_errors.append((pandas_fill_id, "en_answer_drift"))

            if en_drop is None:
                semantic_invariant_errors.append((pandas_drop_id, "en_card_missing"))
            else:
                en_drop_explanation = str(en_drop.get("explanation") or "")
                en_drop_wrong = str(
                    ((en_drop.get("answer_explanation") or {}).get("common_wrong_choice") or {}).get("why_wrong") or ""
                )
                en_drop_answer = str(en_drop.get("answer") or "").replace(chr(96), "")
                if en_drop_answer != "A new DemoFrame excluding rows whose score value is None":
                    semantic_invariant_errors.append((pandas_drop_id, "en_answer_not_demoframe"))
                if "DemoFrame" not in en_drop_explanation or "pandas DataFrame" not in en_drop_explanation:
                    semantic_invariant_errors.append((pandas_drop_id, "en_mock_real_boundary_missing"))
                if "Deleting rows is a different syntax" in en_drop_wrong:
                    semantic_invariant_errors.append((pandas_drop_id, "en_row_column_mismatch"))

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

    if args.explanation_readiness:
        print_explanation_readiness(
            root,
            lesson_files,
            lesson_cards,
            lesson_card_sources,
            args.explanation_readiness_limit,
        )

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

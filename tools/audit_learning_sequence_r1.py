# -*- coding: utf-8 -*-
from __future__ import annotations

import argparse
import ast
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any


GATED_CONCEPTS = {
    "argument_passing",
    "return_statement",
    "function_definition",
    "parameter_definition",
    "if_statement",
    "elif_clause",
    "else_clause",
    "for_statement",
    "while_statement",
    "break_statement",
    "continue_statement",
    "subscription",
    "slice",
    "list_comprehension",
    "dict_comprehension",
    "set_comprehension",
    "generator_expression",
    "lambda_expression",
    "except_clause",
    "try_statement",
    "try_else_clause",
    "finally_clause",
    "with_statement",
    "async_with_statement",
    "await_expression",
    "class_definition",
    "decorator",
    "raise_statement",
    "yield_expression",
}

IGNORE_CALL_TARGETS = {
    "print",
}

QUALIFIED_CALL_ROOTS = {
    "asyncio", "cv2", "fitz", "gr", "Image", "json", "logging", "math", "np", "os",
    "Path", "pd", "pytesseract", "random", "requests", "statistics", "st", "subprocess",
    "torch", "uvicorn",
}

GENERIC_REFERENCE_TERMS = {
    "call", "assignment", "name_reference", "literal", "attribute_access",
    "argument_passing", "read_execution_order", "identify_meaning", "trace_state",
}

PIPELINE_RE = re.compile(
    r"(pipeline|파이프라인|load\s*[→>-].*filter|"
    r"retrieve.*rerank|embed.*search|draft.*review.*validate|"
    r"load_documents.*make_chunks.*embed_chunks)",
    re.I | re.S,
)
REVIEW_RE = re.compile(r"(review|복습|daily[_ -]?review|reading[_ -]?note)", re.I)
VARIANT_RE = re.compile(
    r"(variant|변형|두 번|다른 값|다른 입력|true 경로|false 경로|"
    r"대문자와 소문자|재사용|다시 호출)",
    re.I,
)


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def extract_paths(app_text: str, variable_name: str, next_marker: str) -> list[str]:
    pattern = re.compile(
        rf"const {re.escape(variable_name)} = \[(.*?)\];\s*\n\s*{re.escape(next_marker)}",
        re.S,
    )
    match = pattern.search(app_text)
    if not match:
        raise SystemExit(f"FAIL: {variable_name} block not found in app.js")
    paths = re.findall(r'"(\.\./\.\./data/[^\"]+\.json)"', match.group(1))
    if len(paths) != len(set(paths)):
        raise SystemExit(f"FAIL: duplicate path in {variable_name}")
    return paths


def runtime_path(root: Path, app_path: Path, rel: str) -> Path:
    return (app_path.parent / rel).resolve()


def collect_side_cards(payload: Any) -> list[dict]:
    if isinstance(payload, list):
        return [row for row in payload if isinstance(row, dict)]
    if isinstance(payload, dict):
        rows: list[dict] = []
        for value in payload.values():
            if isinstance(value, list):
                rows.extend(row for row in value if isinstance(row, dict))
        return rows
    return []


def dotted_name(node: ast.AST) -> str | None:
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        left = dotted_name(node.value)
        return f"{left}.{node.attr}" if left else node.attr
    return None


def call_key(name: str) -> str:
    parts = name.split(".")
    if len(parts) == 1:
        return name
    if parts[0] in QUALIFIED_CALL_ROOTS or parts[0][:1].isupper():
        return name
    return parts[-1]


def call_targets(code: str) -> list[str]:
    try:
        tree = ast.parse(code or "")
    except SyntaxError:
        return []
    targets: list[str] = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.Call):
            continue
        name = dotted_name(node.func)
        if not name:
            continue
        key = call_key(name)
        if key not in IGNORE_CALL_TARGETS:
            targets.append(key)
    return sorted(set(targets))


def focus_call_targets(focus: str) -> list[str]:
    if not focus:
        return []
    try:
        tree = ast.parse(focus, mode="eval")
    except SyntaxError:
        try:
            tree = ast.parse(focus)
        except SyntaxError:
            return []
    targets: list[str] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            name = dotted_name(node.func)
            if name:
                key = call_key(name)
                if key not in IGNORE_CALL_TARGETS:
                    targets.append(key)
    return sorted(set(targets))


def nested_call_count(code: str) -> int:
    try:
        tree = ast.parse(code or "")
    except SyntaxError:
        return 0
    count = 0
    for node in ast.walk(tree):
        if not isinstance(node, ast.Call):
            continue
        for child in ast.iter_child_nodes(node):
            if isinstance(child, ast.Call):
                count += 1
                break
            if any(isinstance(grand, ast.Call) for grand in ast.walk(child)):
                count += 1
                break
    return count


def focus_introduces_concept(concept: str, focus: str) -> bool:
    text = (focus or "").strip()
    patterns = {
        "function_definition": r"^def\s+",
        "return_statement": r"^return\b",
        "if_statement": r"^if\s+",
        "elif_clause": r"^elif\s+",
        "else_clause": r"^else\s*:",
        "for_statement": r"^for\s+",
        "while_statement": r"^while\s+",
        "except_clause": r"^except\b",
        "try_statement": r"^try\s*:",
        "finally_clause": r"^finally\s*:",
        "with_statement": r"^with\s+",
        "async_with_statement": r"^async\s+with\s+",
        "await_expression": r"\bawait\s+",
        "class_definition": r"^class\s+",
        "decorator": r"^@",
        "raise_statement": r"^raise\b",
        "yield_expression": r"^yield\b",
    }
    pattern = patterns.get(concept)
    return bool(pattern and re.search(pattern, text))


def normalize_terms(values: list[Any]) -> set[str]:
    return {
        str(value).strip().lower()
        for value in values
        if str(value).strip()
    }


def delivery_for(card: dict, source: str) -> str:
    blob = " ".join(
        [
            source,
            str(card.get("id", "")),
            str(card.get("title", "")),
            str(card.get("pedagogical_intent", "")),
        ]
    )
    return "Review" if REVIEW_RE.search(blob) else "Learn"


def explicit_concept_prereqs(card: dict) -> list[str]:
    primary = str(card.get("primary_concept", "")).strip()
    prereqs: list[str] = []
    for concept in card.get("concepts", []) or []:
        concept = str(concept).strip()
        if concept and concept != primary and concept in GATED_CONCEPTS:
            prereqs.append(concept)
    return sorted(set(prereqs))


def composition_for(card: dict, source: str) -> str:
    title = str(card.get("title", ""))
    goal = str(card.get("reading_goal", ""))
    blob = f"{title}\n{goal}\n{card.get('code', '')}"

    concept_prereqs = explicit_concept_prereqs(card)
    focused_calls = focus_call_targets(str(card.get("focus_span", "")))
    nested = nested_call_count(str(card.get("code", "")))

    if PIPELINE_RE.search(blob):
        return "Pipeline"
    if VARIANT_RE.search(f"{title}\n{goal}") and len(concept_prereqs) <= 1 and len(focused_calls) <= 1:
        return "Variant"

    dependency_width = len(concept_prereqs) + max(0, len(focused_calls) - 1)
    if dependency_width >= 2 or nested >= 2:
        return "Composite"
    if dependency_width == 1 or nested == 1:
        return "Bridge"
    return "Atomic"


def side_reference_candidates(card: dict, side_cards: list[dict], limit: int = 3) -> list[dict]:
    direct_ids = {
        str(value).strip()
        for value in (card.get("side_card_ids", []) or [])
        if str(value).strip()
    }
    card_terms = normalize_terms(card.get("concepts", []) or []) - GENERIC_REFERENCE_TERMS
    primary = str(card.get("primary_concept", "")).strip().lower()
    if primary in GENERIC_REFERENCE_TERMS:
        primary = ""
    calls = normalize_terms(call_targets(str(card.get("code", ""))))
    calls = {
        term.split(".")[-1]
        for term in calls
        if term.split(".")[-1] not in GENERIC_REFERENCE_TERMS
    }

    scored: list[tuple[int, str, str, dict]] = []

    for side in side_cards:
        sid = str(side.get("id", "")).strip()
        if not sid:
            continue
        related = normalize_terms(side.get("related_concepts", []) or [])
        score = 0
        match_type = "SUGGESTED"

        if sid in direct_ids:
            score += 100
            match_type = "DIRECT"

        if primary and primary in related:
            score += 8
        score += 4 * len(card_terms & related)
        score += 3 * len(calls & related)

        if score <= 0:
            continue
        scored.append((score, sid, match_type, side))

    scored.sort(key=lambda item: (-item[0], item[1]))
    return [
        {
            "id": sid,
            "score": score,
            "match_type": match_type,
            "title": side.get("title", ""),
            "when_to_show": side.get("when_to_show", ""),
        }
        for score, sid, match_type, side in scored[:limit]
    ]

def build_analysis(root: Path) -> dict:
    app_path = root / "src" / "pwa" / "app.js"
    if not app_path.is_file():
        raise SystemExit(f"FAIL: app.js not found: {app_path}")
    app_text = app_path.read_text(encoding="utf-8-sig")

    lesson_paths = extract_paths(app_text, "lessonFiles", "const lessonResults")
    side_paths = extract_paths(app_text, "sideFiles", "const sideResults")

    cards: list[dict] = []
    side_cards: list[dict] = []

    for rel in lesson_paths:
        path = runtime_path(root, app_path, rel)
        payload = load_json(path)
        if not isinstance(payload, list):
            raise SystemExit(f"FAIL: lesson source is not a list: {path}")
        for card in payload:
            if not isinstance(card, dict):
                raise SystemExit(f"FAIL: lesson row is not an object: {path}")
            row = dict(card)
            row["_source"] = rel
            cards.append(row)

    for rel in side_paths:
        path = runtime_path(root, app_path, rel)
        side_cards.extend(collect_side_cards(load_json(path)))

    ids = [str(card.get("id", "")) for card in cards]
    duplicates = sorted(key for key, count in Counter(ids).items() if key and count > 1)
    if duplicates:
        raise SystemExit(f"FAIL: duplicate lesson ids: {duplicates[:20]}")

    runtime_cards = sorted(cards, key=lambda card: (card.get("level", 999), str(card.get("id", ""))))
    position = {str(card.get("id")): index for index, card in enumerate(runtime_cards, start=1)}

    concept_intro: dict[str, tuple[int, str]] = {}
    call_intro: dict[str, tuple[int, str]] = {}

    for card in runtime_cards:
        cid = str(card.get("id", ""))
        pos = position[cid]
        primary = str(card.get("primary_concept", "")).strip()
        focus = str(card.get("focus_span", ""))
        concepts = [str(value).strip() for value in (card.get("concepts", []) or [])]

        for concept in concepts:
            if not concept or concept in concept_intro:
                continue
            if concept == primary or focus_introduces_concept(concept, focus):
                concept_intro[concept] = (pos, cid)

        focused = focus_call_targets(focus)
        if len(focused) == 1:
            target = focused[0]
            if target not in call_intro:
                call_intro[target] = (pos, cid)

    rows: list[dict] = []

    for card in runtime_cards:
        cid = str(card.get("id", ""))
        pos = position[cid]
        concept_prereqs = explicit_concept_prereqs(card)
        all_calls = call_targets(str(card.get("code", "")))
        focused_calls = focus_call_targets(str(card.get("focus_span", "")))

        order_reasons: list[dict] = []

        for concept in concept_prereqs:
            intro = concept_intro.get(concept)
            if intro and intro[0] > pos:
                order_reasons.append(
                    {
                        "kind": "concept",
                        "prerequisite": concept,
                        "intro_card": intro[1],
                        "intro_position": intro[0],
                    }
                )

        for target in all_calls:
            intro = call_intro.get(target)
            if not intro:
                continue
            if target in focused_calls and len(focused_calls) == 1 and intro[1] == cid:
                continue
            if intro[0] > pos:
                order_reasons.append(
                    {
                        "kind": "call_target",
                        "prerequisite": target,
                        "intro_card": intro[1],
                        "intro_position": intro[0],
                    }
                )

        easy_refs = side_reference_candidates(card, side_cards)
        rows.append(
            {
                "position": pos,
                "id": cid,
                "level": card.get("level"),
                "composition": composition_for(card, str(card.get("_source", ""))),
                "delivery": delivery_for(card, str(card.get("_source", ""))),
                "primary_concept": card.get("primary_concept"),
                "concept_prerequisites": concept_prereqs,
                "call_targets": all_calls,
                "sequence_status": "ORDER_REVIEW" if order_reasons else "PREREQ_OK",
                "order_reasons": order_reasons,
                "easy_reference_status": (
                    "DIRECT"
                    if any(ref.get("match_type") == "DIRECT" for ref in easy_refs)
                    else "SUGGESTED"
                    if easy_refs
                    else "UNMATCHED"
                ),
                "easy_reference_candidates": easy_refs,
                "source": card.get("_source"),
                "title": card.get("title"),
            }
        )

    return {
        "lesson_file_count": len(lesson_paths),
        "side_file_count": len(side_paths),
        "card_count": len(runtime_cards),
        "side_card_count": len(side_cards),
        "rows": rows,
    }


def canary_result(rows_by_id: dict[str, dict]) -> dict[str, Any]:
    input_int = rows_by_id.get("PYF94_A1_L01_INPUT_003")
    strip_lower = rows_by_id.get("PYF94_A2_L02_STR_010")
    function_first = rows_by_id.get("PYF95_A1_FUNC_001_DEF_CALL_PRINT")

    checks: dict[str, Any] = {}

    if not input_int:
        checks["INPUT_INT_BEFORE_INT"] = {"pass": False, "reason": "card missing"}
    else:
        missing = {
            reason["prerequisite"]
            for reason in input_int["order_reasons"]
        }
        checks["INPUT_INT_BEFORE_INT"] = {
            "pass": "int" in missing,
            "status": input_int["sequence_status"],
            "missing": sorted(missing),
        }

    if not strip_lower:
        checks["STRIP_LOWER_AFTER_ATOMICS"] = {"pass": False, "reason": "card missing"}
    else:
        checks["STRIP_LOWER_AFTER_ATOMICS"] = {
            "pass": strip_lower["sequence_status"] == "PREREQ_OK",
            "status": strip_lower["sequence_status"],
            "reasons": strip_lower["order_reasons"],
        }

    if not function_first:
        checks["FUNCTION_CALL_BEFORE_DEF"] = {"pass": False, "reason": "card missing"}
    else:
        missing = {
            reason["prerequisite"]
            for reason in function_first["order_reasons"]
        }
        checks["FUNCTION_CALL_BEFORE_DEF"] = {
            "pass": "function_definition" in missing,
            "status": function_first["sequence_status"],
            "missing": sorted(missing),
        }

    return checks


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Audit learning composition, prerequisites, sequence timing, and easy-reference matches."
    )
    parser.add_argument("--root", default=".", help="Project root directory")
    parser.add_argument("--json", action="store_true", help="Print the full analysis as JSON to stdout")
    parser.add_argument("--limit", type=int, default=40, help="ORDER_REVIEW rows to print in text mode")
    parser.add_argument(
        "--strict-order",
        action="store_true",
        help="Exit non-zero when any ORDER_REVIEW rows remain",
    )
    args = parser.parse_args()

    analysis = build_analysis(Path(args.root).resolve())
    rows = analysis["rows"]
    rows_by_id = {row["id"]: row for row in rows}
    canaries = canary_result(rows_by_id)

    role_counts = Counter(row["composition"] for row in rows)
    delivery_counts = Counter(row["delivery"] for row in rows)
    sequence_counts = Counter(row["sequence_status"] for row in rows)
    easy_reference_matched = sum(bool(row["easy_reference_candidates"]) for row in rows)
    easy_reference_direct = sum(row["easy_reference_status"] == "DIRECT" for row in rows)
    easy_reference_suggested = sum(row["easy_reference_status"] == "SUGGESTED" for row in rows)

    summary = {
        "schema": "python-reading-trainer/learning-sequence-audit-r1",
        "lesson_file_count": analysis["lesson_file_count"],
        "side_file_count": analysis["side_file_count"],
        "card_count": analysis["card_count"],
        "side_card_count": analysis["side_card_count"],
        "composition_counts": dict(sorted(role_counts.items())),
        "delivery_counts": dict(sorted(delivery_counts.items())),
        "sequence_counts": dict(sorted(sequence_counts.items())),
        "easy_reference_matched_cards": easy_reference_matched,
        "easy_reference_direct_cards": easy_reference_direct,
        "easy_reference_suggested_cards": easy_reference_suggested,
        "easy_reference_unmatched_cards": len(rows) - easy_reference_matched,
        "canaries": canaries,
    }

    hard_failures: list[str] = []
    if analysis["lesson_file_count"] != 98:
        hard_failures.append(
            f"LESSON_FILE_COUNT expected 98, got {analysis['lesson_file_count']}"
        )
    if analysis["card_count"] != 1785:
        hard_failures.append(f"CARD_COUNT expected 1785, got {analysis['card_count']}")
    for name, result in canaries.items():
        if not result.get("pass"):
            hard_failures.append(f"CANARY {name} failed: {result}")

    if args.json:
        print(json.dumps({"summary": summary, "rows": rows}, ensure_ascii=False, indent=2))
    else:
        print("LEARNING_SEQUENCE_R1")
        print(f"LESSON_FILES={analysis['lesson_file_count']}")
        print(f"SIDE_FILES={analysis['side_file_count']}")
        print(f"CARDS={analysis['card_count']}")
        print(f"SIDE_CARDS={analysis['side_card_count']}")
        print("COMPOSITION_COUNTS=" + json.dumps(summary["composition_counts"], ensure_ascii=False, sort_keys=True))
        print("DELIVERY_COUNTS=" + json.dumps(summary["delivery_counts"], ensure_ascii=False, sort_keys=True))
        print("SEQUENCE_COUNTS=" + json.dumps(summary["sequence_counts"], ensure_ascii=False, sort_keys=True))
        print(f"EASY_REFERENCE_MATCHED={easy_reference_matched}")
        print(f"EASY_REFERENCE_DIRECT={easy_reference_direct}")
        print(f"EASY_REFERENCE_SUGGESTED={easy_reference_suggested}")
        print(f"EASY_REFERENCE_UNMATCHED={len(rows) - easy_reference_matched}")
        for name, result in canaries.items():
            print(f"CANARY_{name}={'PASS' if result.get('pass') else 'FAIL'} {json.dumps(result, ensure_ascii=False, sort_keys=True)}")

        order_rows = [row for row in rows if row["sequence_status"] == "ORDER_REVIEW"]
        print(f"ORDER_REVIEW_COUNT={len(order_rows)}")
        for row in order_rows[: max(0, args.limit)]:
            reasons = ",".join(
                f"{reason['kind']}:{reason['prerequisite']}->{reason['intro_card']}"
                for reason in row["order_reasons"]
            )
            refs = ",".join(ref["id"] for ref in row["easy_reference_candidates"])
            print(
                "\t".join(
                    [
                        "ORDER_REVIEW",
                        str(row["position"]),
                        row["id"],
                        f"L{row['level']}",
                        row["composition"],
                        row["delivery"],
                        reasons,
                        f"EASY_REF={refs}",
                        str(row["title"]),
                    ]
                )
            )

    if hard_failures:
        print("AUDIT_LEARNING_SEQUENCE_R1=FAIL")
        for failure in hard_failures:
            print("FAILURE=" + failure)
        raise SystemExit(1)

    if args.strict_order and any(row["sequence_status"] == "ORDER_REVIEW" for row in rows):
        print("AUDIT_LEARNING_SEQUENCE_R1=ORDER_REVIEW_REMAINS")
        raise SystemExit(2)

    print("AUDIT_LEARNING_SEQUENCE_R1=PASS")


if __name__ == "__main__":
    main()

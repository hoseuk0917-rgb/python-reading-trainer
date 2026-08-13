#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"

AUGMENTED = re.compile(r"‘[^’]+’에서는(?:\s+코드의\s+`[^`]+`를\s+기준으로)?\s+")
WRONG_OUTPUT = re.compile(r"(?:따라서\s+)?(?:실제\s+)?출력은\s*[`'‘\"]")
WRONG_RETURN = re.compile(r"따라서\s+(?:반환|호출|반환/호출)\s*결과는")


def compact(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def main() -> None:
    rows = []
    for path in sorted(LESSON_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        for card in payload:
            if isinstance(card, dict) and card.get("id"):
                rows.append((path.name, card))

    qtypes = Counter(str(card.get("question_type") or "") for _, card in rows)
    print("V356_QUESTION_TYPES=" + ",".join(f"{k}:{v}" for k, v in sorted(qtypes.items())))

    non_output_wrong_output = []
    non_trace_augmented = []
    definition_only_flow = []
    conceptual_return_wording = []

    for filename, card in rows:
        level = int(card.get("level", -1)) if str(card.get("level", "")).isdigit() else -1
        if level < 4:
            continue
        qtype = str(card.get("question_type") or "")
        explanation = compact(card.get("explanation"))
        code = str(card.get("code") or "")
        cid = str(card.get("id"))
        key = f"L{level}|{filename}|{cid}|type={qtype}"

        if qtype != "output_prediction" and WRONG_OUTPUT.search(explanation):
            non_output_wrong_output.append(key)
        if qtype not in {"output_prediction", "order_choice"} and AUGMENTED.search(explanation):
            non_trace_augmented.append(key)

        has_def = bool(re.search(r"(^|\n)\s*def\s+[A-Za-z_]\w*\s*\(", code, re.M))
        # Strip definition lines and method declarations; look for an actual call expression in executable lines.
        executable = "\n".join(line for line in code.splitlines() if not re.match(r"\s*(?:def|class)\s+", line))
        has_call = bool(re.search(r"\b[A-Za-z_]\w*\s*\([^\n]*\)", executable))
        if has_def and not has_call and "호출할 때 전달한 값" in explanation:
            definition_only_flow.append(key)

        if qtype not in {"output_prediction", "order_choice"} and WRONG_RETURN.search(explanation):
            conceptual_return_wording.append(key)

    print(f"V356_NON_OUTPUT_WRONG_OUTPUT={len(non_output_wrong_output)}")
    print(f"V356_NON_TRACE_AUGMENTED={len(non_trace_augmented)}")
    print(f"V356_DEFINITION_ONLY_CALL_FLOW={len(definition_only_flow)}")
    print(f"V356_CONCEPTUAL_RETURN_WORDING={len(conceptual_return_wording)}")
    for label, values in [
        ("WRONG_OUTPUT", non_output_wrong_output),
        ("NON_TRACE_AUGMENTED", non_trace_augmented),
        ("DEFINITION_ONLY_FLOW", definition_only_flow),
        ("CONCEPTUAL_RETURN", conceptual_return_wording),
    ]:
        for item in values[:80]:
            print(f"V356_{label}={item}")

    failures = []
    if non_output_wrong_output:
        failures.append(f"NON_OUTPUT_WRONG_OUTPUT={len(non_output_wrong_output)}")
    if non_trace_augmented:
        failures.append(f"NON_TRACE_AUGMENTED={len(non_trace_augmented)}")
    if definition_only_flow:
        failures.append(f"DEFINITION_ONLY_CALL_FLOW={len(definition_only_flow)}")
    if conceptual_return_wording:
        failures.append(f"CONCEPTUAL_RETURN_WORDING={len(conceptual_return_wording)}")
    if failures:
        for failure in failures:
            print("FAIL=" + failure)
        raise SystemExit("RESULT=FAIL_V356_QUESTION_SEMANTICS")
    print("RESULT=PASS_V356_QUESTION_SEMANTICS")


if __name__ == "__main__":
    main()

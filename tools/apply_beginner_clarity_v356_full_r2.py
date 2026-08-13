#!/usr/bin/env python3
from __future__ import annotations

import re
import apply_beginner_clarity_v356_full as base

TRACE_TYPES = {"output_prediction", "order_choice", "flow"}


def conceptual_goal(feats: set[str]) -> str:
    if "try" in feats:
        return "try와 except가 각각 어떤 상황을 처리하도록 나뉘어 있는지 확인한다."
    if "async" in feats:
        return "async와 await가 일반 함수 호출과 무엇이 다른지 코드에서 확인한다."
    if "function" in feats:
        return "함수 정의에서 매개변수와 return이 각각 어떤 역할을 맡는지 확인한다."
    if "class" in feats:
        return "class 정의에서 속성과 메서드가 어떤 역할로 함께 묶여 있는지 확인한다."
    if "if" in feats:
        return "조건식과 각 분기가 어떤 상황을 나타내는지 코드에서 확인한다."
    if "while" in feats or "for" in feats:
        return "반복문에서 반복 대상·조건과 본문이 각각 어떤 역할을 하는지 확인한다."
    if "file" in feats:
        return "경로와 파일 열기·읽기·쓰기 코드가 각각 어떤 역할을 하는지 확인한다."
    if "json" in feats:
        return "JSON 데이터와 Python의 dict·list가 어디에서 서로 바뀌는지 확인한다."
    if "pandas" in feats:
        return "DataFrame에서 선택·변환·집계 코드가 각각 무엇을 하려는지 확인한다."
    if "numpy" in feats:
        return "배열의 값과 shape를 바꾸거나 계산하는 코드의 역할을 확인한다."
    if "regex" in feats:
        return "정규식 패턴과 대상 문자열이 각각 무엇을 뜻하는지 확인한다."
    if "http" in feats:
        return "요청 코드와 응답 확인 코드가 각각 어떤 역할을 하는지 구분한다."
    if "argparse" in feats:
        return "명령줄 옵션을 정의하는 부분과 입력값을 사용하는 부분을 구분한다."
    if "generator" in feats:
        return "yield가 return과 다르게 실행 상태를 남기는 이유를 코드에서 확인한다."
    if "dict" in feats:
        return "dict에서 key와 value가 어떤 관계로 사용되는지 코드에서 확인한다."
    if "collection" in feats:
        return "리스트·집합 메서드가 원본 항목을 어떻게 바꾸는지 확인한다."
    return "질문에서 묻는 개념이 코드의 어느 부분에 나타나는지 확인한다."


def improve_r2(card: dict, level: int) -> list[str]:
    reasons: list[str] = []
    code = str(card.get("code") or "")
    feats = base.features(code)
    goal = base.compact(card.get("reading_goal"))
    explanation = base.compact(card.get("explanation"))
    qtype = str(card.get("question_type") or "")

    cleaned = base.CAUTION.sub("", explanation).strip()
    if cleaned != explanation and cleaned:
        explanation = cleaned
        card["explanation"] = explanation
        reasons.append("remove_generic_caution")

    if base.needs_goal_rewrite(goal):
        card["reading_goal"] = base.goal_for(feats) if qtype in TRACE_TYPES else conceptual_goal(feats)
        reasons.append("concretize_reading_goal")

    if qtype == "output_prediction" and not base.RESULT_WORDS.search(explanation):
        explanation = (explanation.rstrip(". ") + ". " + base.result_sentence(card.get("answer"))).strip()
        card["explanation"] = explanation
        reasons.append("state_final_output")

    # Execution-order scaffolding is useful only when the learner is actually
    # tracing execution/result order. Concept/meaning questions must not receive
    # a generic call/return trace merely because the sample contains def/if/for.
    if qtype in TRACE_TYPES and (len(explanation) < 65 or base.structural_missing(explanation, feats)):
        detail = base.flow_for(feats)
        if detail not in explanation:
            explanation = (explanation.rstrip(". ") + ". " + detail).strip()
            card["explanation"] = explanation
            reasons.append("add_execution_trace")

    if not base.compact(card.get("project_context")):
        card["project_context"] = base.project_context(feats, level)
        reasons.append("add_project_context")
    return reasons


def main() -> None:
    base.improve = improve_r2
    base.main()


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
MANIFEST = ROOT / "docs/audit/v356_level3_exact_manifest.json"
MANUAL_REVIEW_MANIFEST = ROOT / "docs/audit/v356_level3_manual_review.json"
EXPECTED_LEVEL3_COUNT = 206
MIN_EXPLANATION_LENGTH = 70
MIN_GOAL_LENGTH = 30
FLOW_MARKERS = ("먼저", "그다음", "마지막", "실행", "반복", "조건", "호출", "return", "저장", "출력", "결과", "읽을 때", "확인")


def load_level3_cards():
    rows = []
    payloads = {}
    for path in sorted(LESSON_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        payloads[path] = payload
        for card in payload:
            if isinstance(card, dict) and card.get("id") and int(card.get("level", -1)) == 3:
                rows.append((path, card))
    return rows, payloads


def exact_entries(rows):
    return [
        {"file": path.name, "id": str(card["id"])}
        for path, card in sorted(rows, key=lambda item: (item[0].name, str(item[1]["id"])))
    ]


def ensure_manifest(entries):
    if len(entries) != EXPECTED_LEVEL3_COUNT:
        raise SystemExit(f"V356_L3_COUNT_MISMATCH expected={EXPECTED_LEVEL3_COUNT} actual={len(entries)}")
    ids = [entry["id"] for entry in entries]
    if len(ids) != len(set(ids)):
        raise SystemExit("V356_L3_DUPLICATE_IDS=True")
    if MANIFEST.exists():
        payload = json.loads(MANIFEST.read_text(encoding="utf-8"))
        expected = payload.get("cards", []) if isinstance(payload, dict) else []
        if expected != entries:
            raise SystemExit("V356_L3_EXACT_SET_CHANGED=True")
        return False
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "version": "v356",
        "level": 3,
        "count": EXPECTED_LEVEL3_COUNT,
        "cards": entries,
    }
    MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return True


def manual_final_ids():
    if not MANUAL_REVIEW_MANIFEST.exists():
        return set()
    payload = json.loads(MANUAL_REVIEW_MANIFEST.read_text(encoding="utf-8"))
    reviews = payload.get("reviews", []) if isinstance(payload, dict) else []
    return {
        str(review.get("id", ""))
        for review in reviews
        if isinstance(review, dict) and review.get("decision") == "REWRITE" and review.get("id")
    }


def concepts(card):
    return [str(x).strip() for x in card.get("concepts", []) if str(x).strip()]


def core_concept(card):
    skip = {"print", "str", "int", "float", "bool", "list", "tuple", "dict", "set", "value", "output"}
    for concept in concepts(card):
        if concept.lower() not in skip:
            return concept
    values = concepts(card)
    return values[0] if values else "코드 흐름"


def flow_detail(card):
    code = str(card.get("code", ""))
    low = code.lower()
    cset = {c.lower() for c in concepts(card)}
    title = str(card.get("title", "이 코드")).strip()

    if "try:" in low or "except " in low or "try_except" in cset:
        return "먼저 try 블록에서 실제로 예외가 생기는 줄을 찾고, 그 예외 종류가 except와 맞는지 확인하면 정상 흐름과 예외 흐름 중 어느 쪽이 이어지는지 판단할 수 있다."
    if "json." in low or "json" in cset:
        return "JSON을 읽을 때는 문자열이나 파일 내용이 json 함수에서 파이썬 값으로 바뀌는 지점을 먼저 찾고, 변환 뒤 자료형에서 key나 index로 어떤 값을 꺼내는지 순서대로 확인한다."
    if "open(" in low or "path(" in low or "read_text" in low or "write_text" in low or "pathlib" in cset:
        return "파일 코드는 경로를 만드는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 따로 나누어 보면 각 변수에 무엇이 들어가는지와 마지막 결과를 놓치지 않는다."
    if re.search(r"(^|\n)\s*def\s+", code) or "function" in cset or "return" in cset:
        return "함수 코드는 정의와 호출을 구분한 뒤 argument가 parameter에 들어가는 순간, 함수 안의 계산, return으로 돌아오는 값을 차례로 연결하면 바깥 코드의 결과까지 추적할 수 있다."
    if re.search(r"(^|\n)\s*while\s+", code):
        return "while은 반복 전 초기값을 확인하고 조건 검사 → 본문 실행 → 변수 갱신 순서를 한 번씩 따라가면 반복이 언제 끝나고 마지막 값이 무엇인지 판단할 수 있다."
    if re.search(r"(^|\n)\s*for\s+", code):
        if "break" in low:
            return "for가 값을 하나씩 꺼내는 순서를 따라가다가 break가 실행되는 조건을 만나면 그 즉시 가장 가까운 반복문이 끝난다는 점까지 포함해 출력과 최종 값을 판단한다."
        if "continue" in low:
            return "for가 현재 값을 변수에 넣는 순서를 따라가고 continue 조건을 만나면 그 반복의 남은 줄을 건너뛴 뒤 다음 값으로 넘어간다는 점을 함께 확인한다."
        return "for에서는 반복 대상에서 값이 어떤 순서로 변수에 들어오는지 보고, 각 반복에서 실행되는 계산이나 출력까지 한 번씩 적용하면 최종 결과를 안정적으로 판단할 수 있다."
    if "[" in code and ("dict" in cset or ".get(" in low or ".items(" in low or ".keys(" in low or ".values(" in low):
        return "dict는 먼저 사용한 key를 확인하고 그 key에 연결된 value가 읽히는지, 새 값으로 바뀌는지, 반복 대상으로 쓰이는지를 순서대로 보면 결과를 정확히 추적할 수 있다."
    if "set" in cset or "{" in code and "}" in code:
        return "set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다."
    if "tuple" in cset:
        return "tuple은 위치가 의미를 가지므로 0부터 시작하는 index와 unpacking되는 변수의 순서를 맞춰 보고, 각 위치의 값이 이후 어느 식에서 사용되는지 이어서 확인한다."
    if "sorted(" in low or "sorted" in cset:
        return "정렬 코드는 원본 값과 sorted가 만든 새 순서를 구분하고, 정렬된 결과가 다음 반복이나 index 접근에 어떻게 전달되는지 차례로 보면 최종 순서를 판단할 수 있다."
    if "enumerate(" in low or "enumerate" in cset:
        return "enumerate는 반복 값과 번호를 함께 만들므로 시작 번호가 지정되었는지 먼저 확인하고, 각 번호와 값이 어느 변수에 들어가는지 순서대로 대응시키면 된다."
    if "zip(" in low or "zip" in cset:
        return "zip은 같은 위치의 값들을 한 쌍씩 묶으므로 첫 번째끼리, 두 번째끼리 대응시킨 뒤 그 쌍이 반복문이나 list에서 어떤 모양으로 사용되는지 확인한다."
    if "range(" in low or "range" in cset:
        return "range는 시작값은 포함하고 끝값은 포함하지 않는다는 규칙을 먼저 적용한 뒤, 실제로 만들어지는 값들을 반복문에 한 번씩 넣어 보면 실행 횟수와 결과를 확인할 수 있다."
    if re.search(r"(^|\n)\s*if\s+", code) or "if" in cset:
        return "조건문은 먼저 비교식의 True/False를 계산하고, 그 결과에 따라 실제로 실행되는 들여쓰기 블록만 따라가면 실행되지 않는 분기와 결과를 섞지 않게 된다."

    concept = core_concept(card)
    return f"‘{title}’에서는 {concept}이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다."


def improve_card(card):
    changed = False
    title = str(card.get("title", "이 코드")).strip()
    concept = core_concept(card)
    goal = str(card.get("reading_goal", "")).strip()
    if len(goal) < MIN_GOAL_LENGTH:
        new_goal = f"{title} 코드에서 {concept} 관련 값이 어떤 순서로 바뀌고 최종 결과로 이어지는지 확인한다."
        if new_goal != goal:
            card["reading_goal"] = new_goal
            changed = True

    explanation = re.sub(r"\s+", " ", str(card.get("explanation", "")).strip())
    cleaned = re.sub(r"(?:^|(?<=\. )).*?특히 .{0,120}?조심해야[^.]*\.?\s*", "", explanation).strip()
    if cleaned != explanation and cleaned:
        explanation = cleaned
        card["explanation"] = explanation
        changed = True
    needs_flow = not any(marker in explanation for marker in FLOW_MARKERS)
    if len(explanation) < MIN_EXPLANATION_LENGTH or needs_flow:
        detail = flow_detail(card)
        if detail not in explanation:
            explanation = (explanation.rstrip(". ") + ". " + detail).strip()
            card["explanation"] = explanation
            changed = True

    if not str(card.get("project_context", "")).strip():
        low = (title + " " + str(card.get("code", "")) + " " + " ".join(concepts(card))).lower()
        if "venv" in low or "virtual" in low:
            card["project_context"] = "프로젝트마다 패키지 버전을 분리하는 가상환경을 이해하면 재현 가능한 Python 실행 환경을 구성하고 의존성 충돌을 줄일 수 있다."
        else:
            card["project_context"] = f"{concept}을 실제 코드의 실행 흐름과 연결해 읽는 능력은 Python 프로젝트에서 값과 동작을 정확히 추적하는 데 쓰인다."
        changed = True
    return changed


def main():
    rows, payloads = load_level3_cards()
    entries = exact_entries(rows)
    manifest_created = ensure_manifest(entries)
    human_final = manual_final_ids()
    changed_cards = 0
    changed_files = set()
    for path, card in rows:
        if str(card.get("id", "")) in human_final:
            continue
        if improve_card(card):
            changed_cards += 1
            changed_files.add(path)
    for path in sorted(changed_files):
        path.write_text(json.dumps(payloads[path], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"V356_L3_EXACT_COUNT={len(entries)}")
    print(f"V356_L3_MANIFEST_CREATED={manifest_created}")
    print(f"V356_L3_HUMAN_FINAL_SKIPPED={len(human_final)}")
    print(f"V356_L3_CHANGED_CARDS={changed_cards}")
    print(f"V356_L3_CHANGED_FILES={len(changed_files)}")
    print("RESULT=PASS_V356_LEVEL3_APPLY")


if __name__ == "__main__":
    main()

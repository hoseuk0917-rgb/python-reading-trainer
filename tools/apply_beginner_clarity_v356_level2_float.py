#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "data/lessons/python_libraries_missing_topics_v11.json"
CARD_ID = "PY11_L02_float_001"

READING_GOAL = "3 / 2를 먼저 계산하고 / 연산의 결과가 소수형 숫자 1.5가 되는 것을 확인한다."
EXPLANATION = (
    "1줄째 score = 3 / 2에서는 먼저 3을 2로 나눈다. Python의 / 연산자는 정수끼리 나누어도 "
    "소수형 숫자(float)를 결과로 만든다. 3 / 2는 1.5이므로 score에 1.5가 저장된다. "
    "2줄째 print(score)는 현재 값 1.5를 출력한다. 정수 몫만 필요할 때 사용하는 //와 구분하면 된다."
)


def main() -> None:
    cards = json.loads(PATH.read_text(encoding="utf-8"))
    matches = [card for card in cards if str(card.get("id")) == CARD_ID]
    if len(matches) != 1:
        raise SystemExit(f"Expected one {CARD_ID}, got {len(matches)}")
    matches[0]["reading_goal"] = READING_GOAL
    matches[0]["explanation"] = EXPLANATION
    PATH.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"V356_LEVEL2_FLOAT_UPDATED={CARD_ID}")
    print("RESULT=PASS_V356_LEVEL2_FLOAT_APPLIED")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PATCHES = {
    "data/lessons/python_foundation_level2_v94_a2_part1.json": {
        "PYF94_A2_L02_LIST_004": "처음 []에 A를 append하면 ['A']가 된다. 이어서 B를 append하면 ['A', 'B']가 된다. 인덱스 1은 두 번째 항목이므로 items[1]은 B다. 마지막 print(items[1])가 그 값을 화면에 보여 주므로 B가 출력된다.",
        "PYF94_A2_L02_LIST_015": "name에는 문자열 Python이 저장되어 있다. items.append(name)은 글자 name을 넣는 것이 아니라 name의 현재 값 Python을 리스트에 넣는다. 따라서 items는 ['Python']이 되고 items[0]은 Python이다. 마지막 print(items[0])가 Python을 출력한다.",
    },
    "data/lessons/python_foundation_level2_v94_a2_part2.json": {
        "PYF94_A2_L02_LOOP_005": "n이 1일 때 2, n이 2일 때 3, n이 3일 때 4를 append한다. 그래서 반복이 끝난 뒤 result는 [2, 3, 4]가 된다. 마지막 print(result)는 이 리스트 전체를 출력한다.",
        "PYF94_A2_L02_LOOP_010": "n이 1과 2일 때는 n > 2가 False라 append하지 않는다. n이 3과 4일 때만 조건이 True라 두 값이 차례로 추가된다. 따라서 result는 [3, 4]가 되고 마지막 print(result)가 [3, 4]를 출력한다.",
        "PYF94_A2_L02_LOOP_016": "n이 1일 때는 1을 append한다. n이 2일 때는 continue가 실행되어 아래 append를 건너뛴다. n이 3일 때는 3을 append한다. 따라서 result는 [1, 3]이 되고 마지막 print(result)가 [1, 3]을 출력한다.",
        "PYF94_A2_L02_STR_012": "text.split(',')은 문자열 1,2,3을 ['1', '2', '3'] 세 조각으로 나눈다. for문이 세 조각을 하나씩 result에 append하므로 result의 항목 수도 3개다. len(result)는 3이고 마지막 print(len(result))가 3을 출력한다.",
    },
}


def main() -> None:
    patched = 0
    for relative_path, replacements in PATCHES.items():
        path = ROOT / relative_path
        payload = json.loads(path.read_text(encoding="utf-8"))
        by_id = {str(card.get("id")): card for card in payload if isinstance(card, dict)}
        missing = sorted(set(replacements) - set(by_id))
        if missing:
            raise SystemExit(f"MISSING_V356_LEVEL2_RESULT_IDS={relative_path}:{','.join(missing)}")
        for card_id, explanation in replacements.items():
            card = by_id[card_id]
            if card.get("explanation") != explanation:
                card["explanation"] = explanation
                patched += 1
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"V356_LEVEL2_RESULT_CLOSURE_PATCHED={patched}")
    print(f"V356_LEVEL2_RESULT_CLOSURE_EXPECTED_IDS={sum(len(v) for v in PATCHES.values())}")


if __name__ == "__main__":
    main()

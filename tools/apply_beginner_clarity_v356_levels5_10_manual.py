#!/usr/bin/env python3
from __future__ import annotations

import json

from apply_beginner_clarity_v356_levels5_10_manual_impl import LESSON_DIR, PATCHES, main

CARD_ID = "PY31_L08_method_001"
PATCHES[CARD_ID]["old_explanation"] = (
    "method는 class 안에 정의되어 객체와 함께 동작하는 함수다. self를 받으면 객체 자신의 상태나 속성에 접근할 수 있다. "
    "display_title 같은 이름은 객체의 데이터를 보기 좋은 제목 형태로 만들어 주는 동작으로 해석할 수 있다. "
    "따라서 반환/호출 결과는 ‘Card 객체가 사용할 수 있는 method’이다."
)
PATCHES[CARD_ID]["new_explanation"] = (
    "method는 class 안에 정의되어 그 class의 object가 사용할 수 있는 함수다. "
    "card.display_title()을 호출하면 card가 self로 연결되고, self.title이 f-string에 들어가 ‘카드: ...’ 형태의 문자열을 만든다. "
    "따라서 display_title은 Card 객체의 데이터를 이용해 표시용 제목을 반환하는 method다."
)


def rebase_old_explanations_to_current_runtime() -> None:
    rebased = []
    for card_id, patch in PATCHES.items():
        path = LESSON_DIR / patch["file"]
        payload = json.loads(path.read_text(encoding="utf-8"))
        matches = [
            card for card in payload
            if isinstance(card, dict) and str(card.get("id", "")) == card_id
        ]
        if len(matches) != 1:
            raise SystemExit(
                f"V356_L5_10_REBASE_ID_OCCURRENCE_MISMATCH id={card_id} file={path.name} count={len(matches)}"
            )
        card = matches[0]
        if int(card.get("level", -1)) != int(patch["level"]):
            raise SystemExit(
                f"V356_L5_10_REBASE_LEVEL_MISMATCH id={card_id} expected={patch['level']} actual={card.get('level')}"
            )
        current = str(card.get("explanation", ""))
        if current == patch["new_explanation"] or current == patch["old_explanation"]:
            continue
        patch["old_explanation"] = current
        rebased.append(card_id)
    print(f"V356_L5_10_RUNTIME_REBASE_COUNT={len(rebased)}")
    if rebased:
        print("V356_L5_10_RUNTIME_REBASED_IDS=" + ",".join(sorted(rebased)))


if __name__ == "__main__":
    rebase_old_explanations_to_current_runtime()
    main()

#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "tools/apply_beginner_clarity_v356_levels5_10_manual.py"

BAD_NEW = "method는 class 안에 정의되어 object의 상태나 동작을 다루는 함수다. card.mark_done()을 호출하면 card object가 self로 전달되고 mark_done 안에서 self.done = True가 같은 instance의 done attribute를 바꾼다. 따라서 호출 뒤 card.done은 True다."
BAD_OLD = "method는 class 안에 정의된 함수로, 보통 object의 상태를 읽거나 바꾼다. mark_done은 같은 instance의 done 속성을 True로 변경한다. method를 호출하면 첫 parameter self에 해당 object가 자동으로 연결된다. 따라서 반환/호출 결과는 ‘True’이다."
CURRENT_OLD = "method는 class 안에 정의되어 객체와 함께 동작하는 함수다. self를 받으면 객체 자신의 상태나 속성에 접근할 수 있다. display_title 같은 이름은 객체의 데이터를 보기 좋은 제목 형태로 만들어 주는 동작으로 해석할 수 있다. 따라서 반환/호출 결과는 ‘Card 객체가 사용할 수 있는 method’이다."
CORRECT_NEW = "method는 class 안에 정의되어 그 class의 object가 사용할 수 있는 함수다. card.display_title()을 호출하면 card가 self로 연결되고, self.title이 f-string에 들어가 ‘카드: ...’ 형태의 문자열을 만든다. 따라서 display_title은 Card 객체의 데이터를 이용해 표시용 제목을 반환하는 method다."


def replace_once_or_confirm(text: str, old: str, new: str, label: str) -> tuple[str, bool]:
    old_count = text.count(old)
    new_count = text.count(new)
    if old_count == 1:
        return text.replace(old, new, 1), True
    if old_count == 0 and new_count == 1:
        return text, False
    raise SystemExit(
        f"V356_L5_10_REPAIR_AUTHORITY_MISMATCH label={label} old_count={old_count} new_count={new_count}"
    )


def repair_source() -> bool:
    text = TARGET.read_text(encoding="utf-8")
    text, changed_new = replace_once_or_confirm(text, BAD_NEW, CORRECT_NEW, "new_explanation")
    text, changed_old = replace_once_or_confirm(text, BAD_OLD, CURRENT_OLD, "old_explanation")
    changed = changed_new or changed_old
    if changed:
        TARGET.write_text(text, encoding="utf-8")
    print(f"V356_L5_10_PATCH_AUTHORITY_REPAIRED={changed}")
    return changed


def run_target() -> None:
    spec = importlib.util.spec_from_file_location("v356_levels5_10_manual_repaired", TARGET)
    if spec is None or spec.loader is None:
        raise SystemExit("V356_L5_10_REPAIR_IMPORT_SPEC_FAILED=True")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.main()


def main() -> None:
    repair_source()
    run_target()


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "docs/audit/v356_level4_manual_manifest.json"
EXPECTED_PATCH_COUNT = 7

PATCHES = {
    "PYF95_A5_OOP_023_METHOD_CALLS_METHOD": {
        "file": "python_foundation_level4_v95_a5_oop_basics.json",
        "issues": ["CALL_CHAIN_MISSING", "EXECUTION_FLOW_MISSING"],
        "old_explanation": "self.word()는 hi를 return하고 upper로 HI가 된다.",
        "new_explanation": "t.shout()를 호출하면 shout의 self는 t를 가리킨다. shout 안의 self.word()가 같은 object의 word method를 호출해 문자열 \"hi\"를 돌려준다. 이어서 \"hi\".upper()가 \"HI\"를 만들고 shout가 그 값을 return한다. 마지막으로 바깥 print가 \"HI\"를 출력한다.",
    },
    "PYF95_A5_OOP_024_ATTRIBUTE_USED_IN_IF": {
        "file": "python_foundation_level4_v95_a5_oop_basics.json",
        "issues": ["OBJECT_FLOW_MISSING", "CONDITION_FLOW_MISSING"],
        "old_explanation": "u.active는 True이므로 on이 출력된다.",
        "new_explanation": "User(True)를 호출하면 True가 active parameter로 들어가고 self.active = active가 u의 active attribute에 True를 저장한다. 다음 if u.active:에서 이 값이 True이므로 if 블록의 print(\"on\")이 실행되고 else 블록은 건너뛴다. 따라서 on이 출력된다.",
    },
    "PYF95_A5_OOP_025_ATTRIBUTE_DEFAULT_FALSE": {
        "file": "python_foundation_level4_v95_a5_oop_basics.json",
        "issues": ["OBJECT_FLOW_MISSING", "EXECUTION_FLOW_MISSING"],
        "old_explanation": "__init__에서 self.active가 False로 저장된다.",
        "new_explanation": "User()를 호출하면 새 User instance가 만들어지고 __init__의 self가 그 instance를 가리킨다. self.active = False가 active attribute의 초기값을 False로 저장하고, 생성이 끝난 뒤 그 object가 u에 연결된다. 마지막 print(u.active)가 저장된 False를 읽어 출력한다.",
    },
    "PYF95_A5_OOP_027_ATTRIBUTE_DICT": {
        "file": "python_foundation_level4_v95_a5_oop_basics.json",
        "issues": ["DATA_ACCESS_FLOW_MISSING", "OBJECT_FLOW_MISSING"],
        "old_explanation": "p.data는 dict이고 level key의 값은 3이다. 따라서 결과는 3이다.",
        "new_explanation": "Profile()을 만들 때 __init__이 {\"level\": 3} 딕셔너리를 self.data에 저장하고 생성된 object가 p에 연결된다. p.data는 그 딕셔너리를 가리키고, 이어지는 [\"level\"]이 level key에 연결된 값 3을 꺼낸다. 그래서 print(p.data[\"level\"])은 3을 출력한다.",
    },
    "PY122_L04_HEAD_PREVIEW_001": {
        "file": "python_pandas_beginner_v122_a1.json",
        "issues": ["QUESTION_EXPLANATION_TYPE_MISMATCH", "AUTO_TEMPLATE_ARTIFACT"],
        "old_explanation": "df.head()는 DataFrame의 앞부분을 보여 준다. 파일을 읽은 직후 행과 열이 예상대로 들어왔는지 확인할 때 유용하다. 따라서 출력은 ‘데이터 앞부분을 빠르게 확인하기 위해’이다.",
        "new_explanation": "df.head()는 DataFrame의 앞부분을 보여 준다. CSV를 읽은 직후 사용하면 실제 열 이름과 몇 개의 행이 예상한 형태로 들어왔는지 빠르게 확인할 수 있다. 따라서 이 코드에서 df.head()를 사용하는 이유는 데이터를 본격적으로 처리하기 전에 앞부분을 점검하기 위해서다.",
    },
    "PY124_L04_MATCH_NONE_CHECK_001": {
        "file": "python_regex_beginner_v124_a1.json",
        "issues": ["QUESTION_EXPLANATION_TYPE_MISMATCH", "AUTO_TEMPLATE_ARTIFACT"],
        "old_explanation": "re.search()가 패턴을 찾지 못하면 None을 돌려준다. None에는 group()이 없으므로 if m으로 먼저 확인한 뒤 값을 읽어야 안전하다. 따라서 출력은 ‘매치가 없을 때 group() 오류를 줄이기 위해’이다.",
        "new_explanation": "re.search()가 패턴을 찾으면 match object를 돌려주지만 찾지 못하면 None을 돌려준다. 따라서 먼저 if m:으로 실제 match object가 있는지 확인해야 한다. 이 확인 없이 m.group(0)을 호출하면 m이 None일 때 오류가 난다. 즉 if m:은 매치가 있을 때만 group을 읽도록 하는 안전 확인이다.",
    },
    "PY121_L04_RESPONSE_TEXT_DEBUG_001": {
        "file": "python_requests_api_beginner_v121_a1.json",
        "issues": ["QUESTION_EXPLANATION_TYPE_MISMATCH", "AUTO_TEMPLATE_ARTIFACT"],
        "old_explanation": "response.text는 서버가 돌려준 원문 응답이다. JSON이 아니라 에러 HTML이나 안내문이 왔는지 확인할 때 도움이 된다. 따라서 출력은 ‘실제 응답 내용을 일부 확인하기 위해’이다.",
        "new_explanation": "response.status_code로 HTTP 상태를 먼저 확인한 뒤 response.text[:200]은 서버가 돌려준 원문 응답의 앞 200자만 보여 준다. API가 예상한 JSON 대신 오류 HTML이나 안내 문구를 돌려줬는지 빠르게 확인할 수 있어 디버깅에 유용하다. 따라서 이 줄의 목적은 실제 응답 내용을 일부 직접 확인하는 것이다.",
    },
}


def expected_manifest() -> dict:
    cards = []
    for card_id, patch in sorted(PATCHES.items()):
        cards.append(
            {
                "file": patch["file"],
                "id": card_id,
                "decision": "REWRITE",
                "issues": patch["issues"],
            }
        )
    return {
        "version": "v356",
        "level": 4,
        "reviewed_count": 97,
        "keep_count": 90,
        "rewrite_count": EXPECTED_PATCH_COUNT,
        "cards": cards,
    }


def ensure_manifest() -> bool:
    payload = expected_manifest()
    if MANIFEST.exists():
        current = json.loads(MANIFEST.read_text(encoding="utf-8"))
        if current != payload:
            raise SystemExit("V356_L4_MANUAL_MANIFEST_MISMATCH=True")
        return False
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return True


def load_payload(path: Path) -> list:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        raise SystemExit(f"V356_L4_EXPECTED_LIST file={path.name}")
    return payload


def main() -> None:
    if len(PATCHES) != EXPECTED_PATCH_COUNT:
        raise SystemExit(
            f"V356_L4_PATCH_COUNT_MISMATCH expected={EXPECTED_PATCH_COUNT} actual={len(PATCHES)}"
        )

    manifest_created = ensure_manifest()
    payload_cache: dict[Path, list] = {}
    original_cache: dict[Path, list] = {}
    found_counts = {card_id: 0 for card_id in PATCHES}
    changed_ids: list[str] = []

    for card_id, patch in PATCHES.items():
        path = ROOT / "data/lessons" / patch["file"]
        if path not in payload_cache:
            payload_cache[path] = load_payload(path)
            original_cache[path] = copy.deepcopy(payload_cache[path])

        for card in payload_cache[path]:
            if not isinstance(card, dict) or str(card.get("id", "")) != card_id:
                continue
            found_counts[card_id] += 1
            current = str(card.get("explanation", ""))
            old = patch["old_explanation"]
            new = patch["new_explanation"]
            if current == new:
                continue
            if current != old:
                raise SystemExit(
                    f"V356_L4_OLD_EXPLANATION_MISMATCH id={card_id} file={path.name} current={current!r}"
                )
            card["explanation"] = new
            changed_ids.append(card_id)

    wrong_counts = {card_id: count for card_id, count in found_counts.items() if count != 1}
    if wrong_counts:
        raise SystemExit(f"V356_L4_ID_OCCURRENCE_MISMATCH={wrong_counts}")

    changed_files: list[Path] = []
    for path, payload in payload_cache.items():
        before = original_cache[path]
        for old_card, new_card in zip(before, payload):
            if old_card == new_card:
                continue
            old_without = dict(old_card)
            new_without = dict(new_card)
            old_without.pop("explanation", None)
            new_without.pop("explanation", None)
            if old_without != new_without:
                raise SystemExit(
                    f"V356_L4_NON_EXPLANATION_CHANGE id={new_card.get('id')} file={path.name}"
                )
        if before != payload:
            path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            changed_files.append(path)

    for card_id, patch in PATCHES.items():
        path = ROOT / "data/lessons" / patch["file"]
        payload = load_payload(path)
        matches = [card for card in payload if isinstance(card, dict) and str(card.get("id", "")) == card_id]
        if len(matches) != 1 or matches[0].get("explanation") != patch["new_explanation"]:
            raise SystemExit(f"V356_L4_POST_APPLY_VERIFY_FAILED id={card_id}")

    print(f"V356_L4_MANUAL_EXACT_COUNT={len(PATCHES)}")
    print(f"V356_L4_MANUAL_MANIFEST_CREATED={manifest_created}")
    print(f"V356_L4_MANUAL_CHANGED={len(changed_ids)}")
    print(f"V356_L4_MANUAL_CHANGED_FILES={len(changed_files)}")
    if changed_ids:
        print("V356_L4_MANUAL_CHANGED_IDS=" + ",".join(sorted(changed_ids)))
    print("RESULT=PASS_V356_LEVEL4_MANUAL_APPLY")


if __name__ == "__main__":
    main()

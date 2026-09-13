# -*- coding: utf-8 -*-
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET_IDS = [
    "PY3_L03_strip_001",
    "PY16_L08_metadata_normalize_001",
    "PY30_L08_guard_clause_001",
    "PY51_L06_install_prompt_001",
    "PY51_L08_offline_notice_001",
    "PY51_L08_online_recovered_notice_001",
    "PY52_L07_screen_reader_text_001",
    "PY57_L09_license_unknown_001",
    "PY62_L07_translation_dict_001",
    "PY62_L08_fallback_locale_001",
    "PY62_L09_bilingual_hint_001",
    "PYF94_A1_L01_INPUT_007",
    "PYF94_A2_L02_STR_010",
    "PYF95_A1_FUNC_015_STRING_METHOD_RETURN",
    "PYF95_A1_FUNC_028_FUNCTION_NAME_MEANING",
    "PY124_L06_REGEX_SAFE_FLOW_001",
]


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def collect(root: Path):
    found = {}
    for path in sorted(root.glob("*.json")):
        payload = load(path)
        if not isinstance(payload, list):
            continue
        for card in payload:
            if isinstance(card, dict) and card.get("id") in TARGET_IDS:
                cid = card["id"]
                if cid in found:
                    raise RuntimeError(f"DUPLICATE_TARGET|id={cid}|a={found[cid]['source']}|b={path.name}")
                wrong = ((card.get("answer_explanation") or {}).get("common_wrong_choice") or {})
                found[cid] = {
                    "source": path.name,
                    "id": cid,
                    "code": card.get("code"),
                    "question": card.get("question"),
                    "choices": card.get("choices"),
                    "answer": card.get("answer"),
                    "common_wrong_choice": wrong.get("choice"),
                    "common_wrong_why": wrong.get("why_wrong"),
                }
    return found


def main():
    ko = collect(ROOT / "data" / "lessons")
    en = collect(ROOT / "data_i18n" / "en" / "lessons")
    missing = []
    for cid in TARGET_IDS:
        if cid not in ko:
            missing.append(f"KO:{cid}")
        if cid not in en:
            missing.append(f"EN:{cid}")
        print("=== TARGET", cid, "===")
        print("KO=" + json.dumps(ko.get(cid), ensure_ascii=False, sort_keys=True))
        print("EN=" + json.dumps(en.get(cid), ensure_ascii=False, sort_keys=True))
    print(f"TARGET_COUNT={len(TARGET_IDS)}")
    print(f"KO_FOUND={len(ko)}")
    print(f"EN_FOUND={len(en)}")
    print(f"MISSING_COUNT={len(missing)}")
    for item in missing:
        print("MISSING=" + item)
    if missing:
        raise SystemExit(1)
    print("RESULT=PASS_CHOICE_DEFECT_EXTRACTION")


if __name__ == "__main__":
    main()

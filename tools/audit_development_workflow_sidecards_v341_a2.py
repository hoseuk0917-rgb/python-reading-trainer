#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KO = ROOT / "data" / "reference_side_cards" / "python_development_workflow_side_cards_v341_a2.json"
EN = ROOT / "data_i18n" / "en" / "reference_side_cards" / "python_development_workflow_side_cards_v341_a2.json"
APP = ROOT / "src" / "pwa" / "app.js"
INDEX = ROOT / "src" / "pwa" / "index.html"
UI = ROOT / "src" / "pwa" / "learning_experience_v341.js"
ENGINE = ROOT / "src" / "pwa" / "learning_engine_v341.js"

VERSION = "v341_a2_development_workflow_reference_audit"
V339_EPOCH = "20260812_v339_quality3"
A2_EPOCH = "20260812_v341_a2"
EXPECTED_IDS = {
    "DEVFLOW_OVERVIEW_001", "DEVFLOW_REQUIREMENT_001", "DEVFLOW_REPRODUCE_001",
    "DEVFLOW_BASELINE_001", "DEVFLOW_IMPACT_001", "DEVFLOW_BRANCH_001",
    "DEVFLOW_SMALL_CHANGE_001", "DEVFLOW_DEBUG_LOOP_001", "DEVFLOW_IDEMPOTENCE_001",
    "DEVFLOW_TEST_LAYERS_001", "DEVFLOW_REGRESSION_001", "DEVFLOW_DIFF_REVIEW_001",
    "DEVFLOW_CI_GATE_001", "DEVFLOW_RELEASE_EVIDENCE_001", "DEVFLOW_ROLLBACK_001",
    "DEVFLOW_POST_RELEASE_001",
}
EXPECTED_PHASES = {"before": 5, "during": 4, "verify": 4, "release": 3}
OLD_PRACTICE_IDS = (
    "safe_change", "regression", "idempotence", "test_layers", "git_review", "ci_gate",
    "reproducibility", "baseline_rollback",
)


def read(path: Path) -> list[dict]:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    errors: list[str] = []
    ko = read(KO)
    en = read(EN)

    if len(ko) != 16:
        errors.append(f"KO_COUNT={len(ko)}")
    if len(en) != 16:
        errors.append(f"EN_COUNT={len(en)}")

    ko_ids = {str(row.get("id") or "") for row in ko}
    en_ids = {str(row.get("id") or "") for row in en}
    if ko_ids != EXPECTED_IDS:
        errors.append("KO_ID_SET_MISMATCH")
    if en_ids != EXPECTED_IDS:
        errors.append("EN_ID_SET_MISMATCH")
    if ko_ids != en_ids:
        errors.append("KO_EN_ID_PARITY_FAIL")

    for lang, rows in (("ko", ko), ("en", en)):
        phases = Counter(str(row.get("phase") or "") for row in rows)
        if dict(phases) != EXPECTED_PHASES:
            errors.append(f"{lang.upper()}_PHASES={dict(phases)}")
        sequences = sorted(int(row.get("sequence") or 0) for row in rows)
        if sequences != list(range(1, 17)):
            errors.append(f"{lang.upper()}_SEQUENCE={sequences}")
        bodies: set[str] = set()
        for row in rows:
            cid = str(row.get("id") or "")
            if row.get("type") != "development_workflow":
                errors.append(f"BAD_TYPE:{lang}:{cid}")
            for field in ("title", "body", "detail", "related_concepts", "level_hint", "when_to_show"):
                if not row.get(field):
                    errors.append(f"MISSING_{field.upper()}:{lang}:{cid}")
            body = str(row.get("body") or "").strip()
            detail = str(row.get("detail") or "").strip()
            normalized = " ".join(body.lower().split())
            if normalized in bodies:
                errors.append(f"DUPLICATE_BODY:{lang}:{cid}")
            bodies.add(normalized)
            if body and detail and " ".join(detail.lower().split()) == normalized:
                errors.append(f"BODY_DETAIL_DUPLICATE:{lang}:{cid}")
            if lang == "ko" and len(body) > 200:
                errors.append(f"BODY_TOO_LONG:{lang}:{cid}:{len(body)}")
            if lang == "ko" and len(detail) > 460:
                errors.append(f"DETAIL_TOO_LONG:{lang}:{cid}:{len(detail)}")
            if lang == "en" and len(body) > 240:
                errors.append(f"BODY_TOO_LONG:{lang}:{cid}:{len(body)}")
            if lang == "en" and len(detail) > 620:
                errors.append(f"DETAIL_TOO_LONG:{lang}:{cid}:{len(detail)}")

    app = APP.read_text(encoding="utf-8")
    index = INDEX.read_text(encoding="utf-8")
    ui = UI.read_text(encoding="utf-8")
    engine = ENGINE.read_text(encoding="utf-8")
    side_path = '../../data/reference_side_cards/python_development_workflow_side_cards_v341_a2.json'
    if app.count(side_path) != 1:
        errors.append(f"APP_REFERENCE_FILE_COUNT={app.count(side_path)}")
    if '../../data/side_cards/python_development_workflow_side_cards_v341_a2.json' in app:
        errors.append("REFERENCE_LEAKED_INTO_FROZEN_V339_SIDE_DIR")
    if f'const CONTENT_QUALITY_DATA_EPOCH_V339 = "{V339_EPOCH}";' not in app:
        errors.append("V339_HISTORICAL_DATA_EPOCH_NOT_PRESERVED")
    expected_app_tag_fragment = f'app.js?v=20260812_v339_quality1&cq={V339_EPOCH}&le={A2_EPOCH}'
    if expected_app_tag_fragment not in index:
        errors.append("V341_A2_APP_CACHE_LAYER_MISSING")
    if f'content_quality_semantics.js?v={V339_EPOCH}' not in index:
        errors.append("V339_SEMANTIC_CACHE_LAYER_NOT_PRESERVED")
    if 'learning_engine_v341.js?v=20260812_v341_a2' not in index or 'learning_experience_v341.js?v=20260812_v341_a2' not in index:
        errors.append("V341_A2_RUNTIME_CACHE_LAYER_MISSING")
    if 'card.type === "development_workflow"' not in ui:
        errors.append("UI_REFERENCE_FILTER_MISSING")
    if 'developmentWorkflowReferenceV341' not in ui:
        errors.append("UI_REFERENCE_SECTION_MISSING")
    if 'Python 실전 주제' not in ui:
        errors.append("PYTHON_PRACTICE_HEADING_MISSING")

    module_block = engine.split("const PRACTICE_MODULES = [", 1)[1].split("];", 1)[0] if "const PRACTICE_MODULES = [" in engine else ""
    if not module_block:
        errors.append("PRACTICE_MODULE_BLOCK_MISSING")
    for old_id in OLD_PRACTICE_IDS:
        if f'id: "{old_id}"' in module_block:
            errors.append(f"DEV_WORKFLOW_LEAKED_INTO_PRACTICE:{old_id}")

    print(f"AUDIT_VERSION={VERSION}")
    print(f"KO_REFERENCE_CARDS={len(ko)} EN_REFERENCE_CARDS={len(en)}")
    print("PHASE_COUNTS=" + ",".join(f"{k}:{EXPECTED_PHASES[k]}" for k in ("before", "during", "verify", "release")))
    print(f"V339_EPOCH={V339_EPOCH} V341_A2_EPOCH={A2_EPOCH}")
    print(f"ERRORS={len(errors)}")
    for item in errors[:200]:
        print("ERROR=" + item)
    print("RESULT=" + ("FAIL_DEVELOPMENT_WORKFLOW_SIDECARDS_V341_A2" if errors else "PASS_DEVELOPMENT_WORKFLOW_SIDECARDS_V341_A2"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src/pwa/app.js"
KO_ROOT = ROOT / "data"
EN_ROOT = ROOT / "data_i18n/en"
AUDIT = ROOT / "docs/audits/v4008_beginner_residual_repair.json"
SELF = ROOT / "tools/repair_v4008_code_parity.py"
WORKFLOW = ROOT / ".github/workflows/oneoff-v4008-code-parity-repair.yml"

TARGET_IDS = [
    "PY_L01_comment_001",
    "PY_L02_truthy_001",
    "PY_L02_none_001",
    "PYF94_A1_L01_INPUT_001",
    "PYF94_A1_L01_INPUT_002",
    "PYF94_A1_L01_INPUT_003",
    "PYF94_A1_L01_INPUT_006",
    "PYF94_A2_L02_IF_006",
    "PYF94_A2_L02_IF_007",
    "PYF94_A2_L02_LIST_008",
    "PYF94_A2_L02_LIST_009",
    "PYF95_A4_FILE_001_OPEN_READ_ALL",
    "PYF95_A4_FILE_002_READLINE_FIRST",
    "PYF95_A4_FILE_003_READLINES_LEN",
    "PYF95_A4_FILE_007_APPEND_MODE",
    "PYF95_A4_FILE_015_PATH_READ_TEXT",
    "PYF95_A4_FILE_028_JSON_FILE_FLOW",
    "PYF95_A4_FILE_029_PATH_JSON_FLOW",
    "PYV99_A1_GAP_020_READLINE_READLINES",
]
TARGET_SET = set(TARGET_IDS)

# Only synchronize literal/code mentions that changed inside the canonical code.
# Ordinary Korean prose is intentionally left Korean.
LITERAL_MAP = {
    "이 줄은 설명이다": "this line is a comment",
    "준비 단계": "preparation step",
    "이름을 입력하세요: ": "Enter a name: ",
    "이름을 입력하세요:": "Enter a name:",
    "도시를 입력하세요: ": "Enter a city: ",
    "도시를 입력하세요:": "Enter a city:",
    "나이를 입력하세요: ": "Enter age: ",
    "나이를 입력하세요:": "Enter age:",
    "개수를 입력하세요: ": "Enter a count: ",
    "개수를 입력하세요:": "Enter a count:",
    "이름: ": "Name: ",
    "이름:": "Name:",
    "도시: ": "City: ",
    "도시:": "City:",
    "나이: ": "Age: ",
    "나이:": "Age:",
    "개수: ": "Count: ",
    "개수:": "Count:",
    "label()은 text를 채울 값이 없어 정상 호출이 아니다.": "label() is not a valid call here because no value is provided for text.",
    "out.txt 기존 내용:": "existing out.txt contents:",
    "memo.txt 내용:": "memo.txt contents:",
    "config.json 내용:": "config.json contents:",
    "민아": "Mina",
}
SHORT_LITERAL_MAP = {
    "있음": "present",
    "없음": "empty",
    "비어 있음": "empty",
}

AUTHOR_TOKEN_RE = re.compile(
    r"\b(?:name_reference|sequence_operation|attribute_access|argument_passing|parameter_definition|"
    r"function_definition|return_statement|if_statement|else_clause|for_statement|while_statement|"
    r"membership_test|identity_test|boolean_operation|conditional_expression)\b"
)
EN_FORBIDDEN = (
    "Point of Misinterpretation:",
    "A common source of confusion:",
    "As you can see,",
    "I explicitly specified",
    "You can interpret this as",
    "When I look at this, I interpret it as",
    "inside `like`",
    "outer `input()` is executed once more after `int()`",
    "inner `int()` must first create the value that `input()` will modify",
)


def extract_paths() -> list[str]:
    text = APP.read_text(encoding="utf-8-sig")
    match = re.search(r"const lessonFiles = \[(.*?)\];\s*\n\s*const lessonResults", text, re.S)
    if not match:
        raise SystemExit("lessonFiles block not found")
    paths = re.findall(r'"(\.\./\.\./data/[^\"]+\.json)"', match.group(1))
    if len(paths) != 98 or len(paths) != len(set(paths)):
        raise SystemExit(f"unexpected lesson path contract: {len(paths)}")
    return paths


def load_language(root: Path, paths: list[str]):
    payloads: dict[Path, list[dict]] = {}
    index: dict[str, tuple[Path, dict]] = {}
    for runtime_path in paths:
        rel = runtime_path.removeprefix("../../data/")
        path = root / rel
        payload = json.loads(path.read_text(encoding="utf-8-sig"))
        if not isinstance(payload, list):
            raise SystemExit(f"not a list: {path}")
        payloads[path] = payload
        for card in payload:
            if isinstance(card, dict) and card.get("id"):
                cid = str(card["id"])
                if cid in index:
                    raise SystemExit(f"duplicate id: {cid}")
                index[cid] = (path, card)
    if len(index) != 1785:
        raise SystemExit(f"unexpected card count at {root}: {len(index)}")
    return payloads, index


def replace_code_mentions(value):
    if isinstance(value, str):
        out = value
        for old, new in LITERAL_MAP.items():
            out = out.replace(old, new)
        for old, new in SHORT_LITERAL_MAP.items():
            # Short everyday Korean words are replaced only when they are clearly
            # represented as code/output literals, never in normal prose.
            out = out.replace(f"`{old}`", f"`{new}`")
            out = out.replace(f'"{old}"', f'"{new}"')
            out = out.replace(f"“{old}”", f"“{new}”")
            if out.strip() == old:
                out = new
        return out
    if isinstance(value, list):
        return [replace_code_mentions(v) for v in value]
    if isinstance(value, dict):
        return {k: replace_code_mentions(v) for k, v in value.items()}
    return value


def visible_strings(card: dict, *, include_code: bool):
    roots = (
        "title", "reading_goal", "question", "choices", "answer", "explanation",
        "project_context", "concept_explanation", "teaching_example", "answer_explanation",
        "target_statement", "focus_span",
    )
    if include_code:
        roots = ("code",) + roots

    def walk(node, path: str):
        if isinstance(node, str):
            if include_code or not (path == "code" or path.endswith(".code")):
                yield path, node
        elif isinstance(node, list):
            for i, v in enumerate(node):
                yield from walk(v, f"{path}[{i}]")
        elif isinstance(node, dict):
            for k, v in node.items():
                yield from walk(v, f"{path}.{k}")

    for root in roots:
        if root in card:
            yield from walk(card[root], root)


def main() -> None:
    paths = extract_paths()
    ko_payloads, ko = load_language(KO_ROOT, paths)
    _, en = load_language(EN_ROOT, paths)

    missing = TARGET_SET - set(ko) | TARGET_SET - set(en)
    if missing:
        raise SystemExit(f"missing target ids: {sorted(missing)}")

    current_mismatches = {
        cid for cid in ko
        if ko[cid][1].get("code") != en[cid][1].get("code")
    }
    if current_mismatches != TARGET_SET:
        raise SystemExit(
            "unexpected code parity mismatch set: "
            + json.dumps({
                "expected": TARGET_IDS,
                "actual": sorted(current_mismatches),
            }, ensure_ascii=False)
        )

    changed_files: set[Path] = set()
    details = []
    for cid in TARGET_IDS:
        ko_path, ko_card = ko[cid]
        _, en_card = en[cid]
        old_ko_code = str(ko_card.get("code") or "")
        canonical_code = str(en_card.get("code") or "")
        if re.search(r"[가-힣]", canonical_code):
            raise SystemExit(f"canonical EN code still contains Hangul: {cid}")

        # The EN code was already language-cleaned in the previous repair. Make
        # that exact code the bilingual canonical code so the existing parity
        # contract remains intact without reintroducing Hangul into EN.
        ko_card["code"] = canonical_code

        # target_statement/focus_span are learner-facing code excerpts. Keep them
        # aligned with the canonical EN excerpt where the prior localized literal
        # made them diverge.
        for field in ("target_statement", "focus_span"):
            ko_value = ko_card.get(field)
            en_value = en_card.get(field)
            if isinstance(ko_value, str) and isinstance(en_value, str) and ko_value != en_value:
                if re.search(r"[가-힣]", ko_value) or ko_value not in canonical_code:
                    ko_card[field] = en_value

        # Update only explicit mentions of changed code literals in the Korean
        # learner prose/choices. This avoids sentences such as "값이 없음" ->
        # "값이 empty" while keeping shown code and its quoted literals coherent.
        for field in (
            "question", "choices", "answer", "explanation", "project_context",
            "concept_explanation", "teaching_example", "answer_explanation",
        ):
            if field in ko_card:
                ko_card[field] = replace_code_mentions(ko_card[field])

        changed_files.add(ko_path)
        details.append({
            "id": cid,
            "file": str(ko_path.relative_to(KO_ROOT)).replace("\\", "/"),
            "old_ko_code": old_ko_code,
            "canonical_code": canonical_code,
        })

    for path in sorted(changed_files):
        path.write_text(json.dumps(ko_payloads[path], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    subprocess.run([sys.executable, "tools/build_runtime_lesson_bundle_v400_5.py"], cwd=ROOT, check=True)
    subprocess.run([sys.executable, "tools/validate_lessons.py"], cwd=ROOT, check=True)
    subprocess.run([sys.executable, "tools/validate_bilingual_lessons_v400_7.py"], cwd=ROOT, check=True)

    # Strong final invariants on the actual rebuilt runtime corpus.
    ko_bundle = json.loads((ROOT / "data/runtime/lesson_bundle_v400_5.json").read_text(encoding="utf-8"))
    en_bundle = json.loads((ROOT / "data_i18n/en/runtime/lesson_bundle_v400_5.json").read_text(encoding="utf-8"))
    if (ko_bundle.get("card_count"), en_bundle.get("card_count")) != (1785, 1785):
        raise SystemExit("runtime card-count regression")
    if (ko_bundle.get("source_file_count"), en_bundle.get("source_file_count")) != (98, 98):
        raise SystemExit("runtime source-file-count regression")

    runtime_ko = {}
    runtime_en = {}
    for rows in ko_bundle.get("files", {}).values():
        for card in rows:
            runtime_ko[str(card.get("id"))] = card
    for rows in en_bundle.get("files", {}).values():
        for card in rows:
            runtime_en[str(card.get("id"))] = card

    parity_left = [cid for cid in runtime_ko if runtime_ko[cid].get("code") != runtime_en[cid].get("code")]
    if parity_left:
        raise SystemExit(f"code parity remains: {parity_left[:30]}")

    # Learner prose quality scan. Primary/teaching code is intentionally excluded
    # here because code parity is a separate, stronger bilingual contract.
    en_residuals = []
    ko_residuals = []
    for cid, card in runtime_en.items():
        try:
            level = int(card.get("level", 999))
        except Exception:
            level = 999
        if level > 3:
            continue
        for field, text in visible_strings(card, include_code=False):
            if field in {"target_statement", "focus_span"}:
                # Code excerpts are covered by canonical-code/parity checks.
                continue
            issues = []
            if re.search(r"[가-힣]", text):
                issues.append("hangul")
            if "``" in text:
                issues.append("double_backtick")
            tokens = sorted(set(AUTHOR_TOKEN_RE.findall(text)))
            if tokens:
                issues.append("author_token:" + ",".join(tokens))
            bad = [p for p in EN_FORBIDDEN if p in text]
            if bad:
                issues.append("forbidden:" + "|".join(bad))
            if issues:
                en_residuals.append({"id": cid, "field": field, "issues": issues, "sample": text[:240]})

    for cid, card in runtime_ko.items():
        try:
            level = int(card.get("level", 999))
        except Exception:
            level = 999
        if level > 3:
            continue
        for field, text in visible_strings(card, include_code=False):
            if field in {"target_statement", "focus_span"}:
                continue
            issues = []
            if re.search(r"\bfocus\b", text, re.I):
                issues.append("focus")
            if "이번 카드는" in text and "문법" in text:
                issues.append("internal_template")
            tokens = sorted(set(AUTHOR_TOKEN_RE.findall(text)))
            if tokens:
                issues.append("author_token:" + ",".join(tokens))
            if "bound method" in text:
                issues.append("bound_method")
            if issues:
                ko_residuals.append({"id": cid, "field": field, "issues": issues, "sample": text[:240]})

    if en_residuals or ko_residuals:
        print("EN_RESIDUALS=" + json.dumps(en_residuals[:30], ensure_ascii=False))
        print("KO_RESIDUALS=" + json.dumps(ko_residuals[:30], ensure_ascii=False))
        raise SystemExit("learner prose residuals remain after parity repair")

    audit = json.loads(AUDIT.read_text(encoding="utf-8-sig")) if AUDIT.exists() else {}
    audit["code_parity_repair"] = {
        "strategy": "Use the language-clean EN code as the shared KO/EN canonical code for the exact 19 parity failures; keep learner prose localized.",
        "target_count": len(TARGET_IDS),
        "changed_ko_source_file_count": len(changed_files),
        "post_code_parity_failure_count": 0,
        "post_en_beginner_prose_residual_count": 0,
        "post_ko_beginner_prose_residual_count": 0,
        "details": details,
    }
    audit["release_gate_verification"] = {
        "status": "PENDING_NORMAL_V400_GATE_AFTER_PARITY_REPAIR",
        "note": "The repair workflow validates bilingual parity locally before committing. A separate docs-only push will trigger the normal V400 release workflow because GitHub suppresses recursive workflow triggers from GITHUB_TOKEN pushes."
    }
    AUDIT.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Successful product commit must not leave one-shot repair machinery behind.
    if SELF.exists():
        SELF.unlink()
    if WORKFLOW.exists():
        WORKFLOW.unlink()

    print(f"PARITY_TARGET_COUNT={len(TARGET_IDS)}")
    print(f"PARITY_CHANGED_KO_FILES={len(changed_files)}")
    print("POST_CODE_PARITY_FAILURE_COUNT=0")
    print("POST_EN_BEGINNER_PROSE_RESIDUAL_COUNT=0")
    print("POST_KO_BEGINNER_PROSE_RESIDUAL_COUNT=0")
    print("V4008_CODE_PARITY_REPAIR_PASS=True")


if __name__ == "__main__":
    main()

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KO_ROOT = ROOT / "data" / "lessons"
EN_ROOT = ROOT / "data_i18n" / "en" / "lessons"
VERSION = "v343_context_repair_r2"

TARGET_ID = "PY103_L08_requirements_install_001"
TARGET_FILE = "python_dev_environment_foundation_v103_a1.json"

KO_REWRITE = {
    "reading_goal": "requirements.txt가 Python 패키지 목록을 제공하지만 전체 실행환경까지 모두 고정하는 것은 아님을 이해한다.",
    "question": "이 명령으로 패키지를 설치한 뒤에도 별도로 확인해야 할 항목으로 가장 적절한 것은?",
    "choices": [
        "Python 버전과 필요한 시스템 도구",
        "GitHub 프로필 사진",
        "브라우저 탭 개수",
        "GPU 팬 색상",
    ],
    "answer": "Python 버전과 필요한 시스템 도구",
    "explanation": "requirements.txt는 pip가 설치할 Python 패키지 목록을 제공한다. 하지만 Python 자체의 버전이나 apt로 설치하는 시스템 도구까지 기록하지는 않는다. 새 환경에서는 패키지 설치 후 Python 버전, 외부 도구, import와 프로젝트 검증도 함께 확인해야 한다.",
    "project_context": "새 장비에서 requirements.txt를 설치한 뒤 실제 실행환경이 충분히 재현됐는지 확인하는 카드다.",
}

EN_REWRITE = {
    "reading_goal": "Understand that requirements.txt provides a Python package list but does not capture the entire execution environment.",
    "question": "After installing packages with this command, which item should still be checked separately?",
    "choices": [
        "The Python version and required system tools",
        "The GitHub profile picture",
        "The number of browser tabs",
        "The color of the GPU fan",
    ],
    "answer": "The Python version and required system tools",
    "explanation": "requirements.txt tells pip which Python packages to install. It does not record the Python interpreter version or system tools installed with a package manager such as apt. After installation, also verify the Python version, external tools, imports, and the project's own validation checks.",
    "project_context": "This card checks whether a new machine is truly ready after installing requirements.txt, rather than treating the file as a complete environment snapshot.",
}

# High-confidence meta sentences inherited from earlier generated English expansion.
# They explain how the dataset was designed or repeat a generic solving routine rather
# than explaining the card's actual code. Specific caution sentences are preserved.
EXPLANATION_PATTERNS = [
    r"\s*This problem is (?:a |an )?(?:beginner-level|basic) reading comprehension exercise[^.]*\.",
    r"\s*This problem is (?:a |an )?Level \d+ exercise[^.]*\.",
    r"\s*This problem,? (?:from )?Level \d+,? is an exercise[^.]*\.",
    r"\s*This problem is an exercise in Level \d+[^.]*\.",
    r"\s*The correct answer is determined by (?:the )?(?:actual values|value) produced by Python[’']s (?:actual )?execution rules, not by (?:the appearance of the options|how the options appear)\.",
    r"\s*When encountering similar code, you can safely [^.]*\.",
    r"\s*When selecting the correct answer, you should first [^.]*\.",
    r"\s*This reading habit directly translates (?:into|to) [^.]*\.",
    r"\s*Since the (?:printed characters|characters printed on the screen) and the values stored in variables may differ, the judgment should be based on the actual execution flow\.",
    r"\s*In the context of the options, [^.]*\.",
]

GOAL_PATTERNS = [
    r"\s*(?:Also|Additionally),? (?:do not|don[’']t|I don[’']t) just look at [^.]*?(?:converted|conversion has been made)\.",
    r"\s*(?:Also|Additionally),? [^.]*check(?:s|ing)? (?:the |their )?data type[^.]*converted\.",
    r"\s*It also evaluates the truth value of the conditional expression or the current state of the list line by line to determine the final output or selection result\.",
    r"\s*Also,? follow the true/false (?:values|status) of the conditional expression or the current state of the list line by line to determine the final output or selection result\.",
    r"\s*In particular, (?:examine|pay close attention to) the function definition line, the call line, [^.]*\.",
]


def clean_spaces(text: str) -> str:
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    return text.strip()


def remove_patterns(text: str, patterns: list[str], min_len: int) -> tuple[str, int]:
    original = str(text or "")
    updated = original
    removed = 0
    for pattern in patterns:
        updated2, n = re.subn(pattern, "", updated, flags=re.IGNORECASE)
        if n:
            removed += n
            updated = updated2
    updated = clean_spaces(updated)
    if removed and len(updated) >= min_len:
        return updated, removed
    return original, 0


def rewrite_target(root: Path, replacement: dict, apply_changes: bool) -> tuple[int, bool]:
    path = root / TARGET_FILE
    payload = json.loads(path.read_text(encoding="utf-8"))
    matches = [card for card in payload if isinstance(card, dict) and card.get("id") == TARGET_ID]
    if len(matches) != 1:
        raise RuntimeError(f"target count {root}: {len(matches)}")
    card = matches[0]
    changed = any(card.get(k) != v for k, v in replacement.items())
    if changed:
        card.update(replacement)
        if apply_changes:
            path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 1 if changed else 0, changed


def clean_english(apply_changes: bool) -> tuple[int, int, int]:
    changed_files = 0
    changed_cards = 0
    removed_sentences = 0
    for path in sorted(EN_ROOT.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        file_changed = False
        for card in payload:
            if not isinstance(card, dict):
                continue
            card_changed = False
            exp, n1 = remove_patterns(str(card.get("explanation") or ""), EXPLANATION_PATTERNS, 35)
            goal, n2 = remove_patterns(str(card.get("reading_goal") or ""), GOAL_PATTERNS, 20)
            if n1 and exp != card.get("explanation"):
                card["explanation"] = exp
                card_changed = True
                removed_sentences += n1
            if n2 and goal != card.get("reading_goal"):
                card["reading_goal"] = goal
                card_changed = True
                removed_sentences += n2
            if card_changed:
                changed_cards += 1
                file_changed = True
        if file_changed:
            changed_files += 1
            if apply_changes:
                path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return changed_files, changed_cards, removed_sentences


def target_is_distinct() -> bool:
    rows = []
    for root in (KO_ROOT, EN_ROOT):
        for path in root.glob("*.json"):
            try:
                payload = json.loads(path.read_text(encoding="utf-8"))
            except Exception:
                continue
            if not isinstance(payload, list):
                continue
            for card in payload:
                if not isinstance(card, dict):
                    continue
                if card.get("code") == "python -m pip install -r requirements.txt":
                    rows.append((root.name, card.get("id"), card.get("question"), card.get("answer")))
    # Same command may deliberately recur; question+answer must not be identical now.
    pairs = [(str(q).strip().lower(), str(a).strip().lower()) for _, _, q, a in rows]
    return len(pairs) == len(set(pairs))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        raise SystemExit("choose exactly one of --apply/--check")

    ko_change, _ = rewrite_target(KO_ROOT, KO_REWRITE, args.apply)
    en_change, _ = rewrite_target(EN_ROOT, EN_REWRITE, args.apply)
    files, cards, removed = clean_english(args.apply)

    # Re-evaluate on disk in --apply mode after the write; in --check mode no writes are expected.
    if args.apply:
        ko_pending, _ = rewrite_target(KO_ROOT, KO_REWRITE, False)
        en_pending, _ = rewrite_target(EN_ROOT, EN_REWRITE, False)
    else:
        ko_pending, en_pending = ko_change, en_change

    total_pending = ko_pending + en_pending
    distinct = target_is_distinct() if total_pending == 0 else False
    any_change = bool(ko_change or en_change or files or cards or removed)
    if args.apply:
        # Changes reported here are what this invocation actually wrote.
        pass

    print(f"REPAIR_VERSION={VERSION}")
    print(f"APPLY={args.apply}")
    print(f"TARGET_KO_CHANGED={ko_change}")
    print(f"TARGET_EN_CHANGED={en_change}")
    print(f"EN_FILES_CHANGED={files}")
    print(f"EN_CARDS_CHANGED={cards}")
    print(f"META_SENTENCES_REMOVED={removed}")
    print(f"TARGET_PENDING={total_pending}")
    print(f"REQUIREMENTS_PROBLEMS_DISTINCT={distinct}")
    if args.check:
        print(f"IDEMPOTENT={not any_change}")
    ok = distinct and total_pending == 0 and (not args.check or not any_change)
    print("RESULT=" + ("PASS_CORPUS_CONTEXT_REPAIR_V343_R2" if ok else "FAIL_CORPUS_CONTEXT_REPAIR_V343_R2"))
    if not ok:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

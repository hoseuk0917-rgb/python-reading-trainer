from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EN_ROOT = ROOT / "data_i18n" / "en" / "lessons"
KO_ROOT = ROOT / "data" / "lessons"
VERSION = "v343_context_repair_r4"

EXPLANATION_PATTERNS = [
    r"\s*This is a review question that involves reading beginner-level Python code line by line\.",
    r"\s*This is a review problem for beginner-level Python, where you read the code line by line\.",
    r"\s*This Level \d+ problem is an exercise in [^.]*\.",
    r"\s*This problem in Level \d+ is an exercise in [^.]*\.",
    r"\s*When selecting the correct answer, rather than simply memorizing syntax names, you should check [^.]*\.",
    r"\s*When selecting the correct answer, rather than memorizing the names of grammatical constructs, you should check [^.]*\.",
    r"\s*When selecting the correct answer, rather than memorizing syntax names, you should check [^.]*\.",
    r"\s*Even when encountering similar code, you can make a safe judgment by first checking, in order:[^.]*\.",
    r"\s*The correct answer is not a familiar word from the options, but rather the actual result produced by the variable values and execution flow\.",
    r"\s*The correct answer isn[’']t a familiar word from the options, but rather the result actually produced by the variable values and the flow of execution\.",
    r"\s*The correct answer is not a familiar word from the options, but rather the result actually produced by the variable values and execution flow\.",
    r"\s*Even\s*$",
]

READING_GOAL_PATTERNS = [
    r"\s*It also evaluates the truth value of (?:a|the) conditional expression or the current state of (?:a|the) list(?: by stepping through it)? line by line to determine the final output or selection result\.",
    r"\s*It also evaluates the true/false (?:value|status|values) of (?:a|the) conditional expression or the current state of (?:a|the) list line by line to determine the final output or selection result\.",
    r"\s*It also evaluates the truth values of the conditional expressions or the current state of the list line by line to determine the final output or selection result\.",
    r"\s*We also determine the final output or selection result by stepping through the truth value of the conditional expression or the current state of the list line by line\.",
    r"\s*I also determine the final output or selection result by stepping through the true/false values of the conditional expression or the current state of the list line by line\.",
    r"\s*I also determine the final output or selection result by stepping through the list line by line, checking the truth value of the conditional expression or the current state of the list\.",
    r"\s*Also, step through the true/false values of the conditional expressions or the current state of the list line by line to determine the final output or selection result\.",
    r"\s*Also, evaluate the truth value of the conditional expression or the current state of the list line by line to determine the final output or selection result\.",
    r"\s*In particular, distinguish between the (?:initial|first) value, the value (?:that )?(?:changed|changes|was changed) (?:midway|in the middle), and the (?:final|last) output line, and (?:examine|verify|check) [^.]*\.",
]

REPEATED_SCOPE_SENTENCE = "Arguments are passed to the function as parameters, and the return value is sent back to the caller."
REMOVE_REPEATED_SCOPE_FROM = {
    "PYV96_A3_SCOPE_001_DEF_NOT_CALL",
    "PYV96_A3_SCOPE_014_DEFAULT_ARGUMENT",
}

KO_TARGET_ID = "PY26_L09_checkpoint_resume_001"
KO_TARGET_FILE = "python_async_batch_queue_v26.json"
KO_TARGET_EXPLANATION = (
    "done에 있는 id는 `continue`로 건너뛴다. 대량의 id를 다룬다면 `done`을 set으로 만들어 membership 검사를 빠르게 하는 편이 좋다. "
    "주의할 점은 `process(item)`의 외부 작업이 성공한 뒤 checkpoint 기록만 실패하는 경우다. 그러면 재실행 때 같은 item이 다시 처리될 수 있다. "
    "따라서 외부 작업을 재실행해도 안전하게 만들거나, 결과 저장과 checkpoint 기록을 하나의 원자적 작업으로 묶는 방법을 고려한다. "
    "여러 worker가 동시에 실행된다면 같은 id를 둘 이상이 가져가지 않도록 claim 방식도 필요하다."
)


def clean_spaces(text: str) -> str:
    text = re.sub(r"[ \t]+", " ", str(text or ""))
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    return text.strip()


def remove_patterns(text: str, patterns: list[str], min_len: int) -> tuple[str, int]:
    original = str(text or "")
    updated = original
    removed = 0
    for pattern in patterns:
        updated, count = re.subn(pattern, "", updated, flags=re.IGNORECASE)
        removed += count
    updated = clean_spaces(updated)
    if removed and len(updated) >= min_len:
        return updated, removed
    return original, 0


def clean_english(apply_changes: bool) -> tuple[int, int, int, int]:
    files_changed = 0
    cards_changed = 0
    clauses_removed = 0
    repeated_removed = 0
    for path in sorted(EN_ROOT.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        file_changed = False
        for card in payload:
            if not isinstance(card, dict):
                continue
            changed = False
            exp, n1 = remove_patterns(str(card.get("explanation") or ""), EXPLANATION_PATTERNS, 28)
            goal, n2 = remove_patterns(str(card.get("reading_goal") or ""), READING_GOAL_PATTERNS, 18)
            if n1 and exp != card.get("explanation"):
                card["explanation"] = exp
                clauses_removed += n1
                changed = True
            if n2 and goal != card.get("reading_goal"):
                card["reading_goal"] = goal
                clauses_removed += n2
                changed = True
            cid = str(card.get("id", ""))
            if cid in REMOVE_REPEATED_SCOPE_FROM and REPEATED_SCOPE_SENTENCE in str(card.get("explanation") or ""):
                card["explanation"] = clean_spaces(str(card["explanation"]).replace(REPEATED_SCOPE_SENTENCE, ""))
                repeated_removed += 1
                changed = True
            if changed:
                cards_changed += 1
                file_changed = True
        if file_changed:
            files_changed += 1
            if apply_changes:
                path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return files_changed, cards_changed, clauses_removed, repeated_removed


def rewrite_ko_target(apply_changes: bool) -> int:
    path = KO_ROOT / KO_TARGET_FILE
    payload = json.loads(path.read_text(encoding="utf-8"))
    matches = [c for c in payload if isinstance(c, dict) and c.get("id") == KO_TARGET_ID]
    if len(matches) != 1:
        raise RuntimeError(f"KO target count={len(matches)}")
    card = matches[0]
    if card.get("explanation") == KO_TARGET_EXPLANATION:
        return 0
    card["explanation"] = KO_TARGET_EXPLANATION
    if apply_changes:
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 1


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        raise SystemExit("choose exactly one of --apply/--check")

    files, cards, clauses, repeated = clean_english(args.apply)
    ko = rewrite_ko_target(args.apply)
    changed = bool(files or cards or clauses or repeated or ko)

    print(f"REPAIR_VERSION={VERSION}")
    print(f"APPLY={args.apply}")
    print(f"EN_FILES_CHANGED={files}")
    print(f"EN_CARDS_CHANGED={cards}")
    print(f"GENERIC_CLAUSES_REMOVED={clauses}")
    print(f"REPEATED_SCOPE_SENTENCES_REMOVED={repeated}")
    print(f"KO_TARGET_CHANGED={ko}")
    if args.check:
        print(f"IDEMPOTENT={not changed}")
    ok = not args.check or not changed
    print("RESULT=" + ("PASS_CORPUS_CONTEXT_REPAIR_V343_R4" if ok else "FAIL_CORPUS_CONTEXT_REPAIR_V343_R4"))
    if not ok:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

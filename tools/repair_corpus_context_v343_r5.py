from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EN_ROOT = ROOT / "data_i18n" / "en" / "lessons"
VERSION = "v343_context_repair_r5"

# Final manually reviewed dense candidates. These rewrites keep the technical
# content but make each card explain its own code first, in short causal steps.
TARGET_EXPLANATIONS = {
    "PYF94_A2_L02_STR_014": (
        "`lower()` returns a new lowercase string and stores it in `lowered`. "
        "It does not change the original variable `text`, so `print(text)` still outputs `YES`."
    ),
    "PYF95_A1_FUNC_022_PARAMETER_NAME_LOCAL": (
        "The parameter `name` receives `inner` only inside `show`, so `name.upper()` returns `INNER`. "
        "The outer variable named `name` is a different binding and remains `outer`."
    ),
    "PYF95_A2_DTS_006_DICT_GET_MISSING": (
        "The dictionary has no `grade` key, so `user.get('grade', 'unknown')` returns the provided default `unknown`. "
        "Unlike `user['grade']`, this `get` call does not raise `KeyError` when the key is missing."
    ),
    "PYF95_A5_OOP_010_METHOD_USES_ATTRIBUTE": (
        "`User('Mina')` stores `Mina` in the new object's `name` attribute. "
        "When `u.greet()` runs, `self` refers to `u`, so `self.name` is `Mina` and the method returns `Hi Mina`."
    ),
    "PYF95_A5_OOP_014_OBJECTS_IN_LIST": (
        "`users[1]` selects the second `User` object in the list. "
        "That object was created with the name `B`, so its `.name` attribute is `B`."
    ),
    "PYF95_A5_OOP_021_METHOD_WITH_ARGUMENT": (
        "In `g.say('Python')`, `g` is bound to `self` automatically and the explicit argument `Python` is assigned to `word`. "
        "The method returns `Hi Python`, which the outer `print` displays."
    ),
    "PYF95_A5_OOP_023_METHOD_CALLS_METHOD": (
        "`t.shout()` calls `self.word()` on the same object. "
        "`word()` returns `hi`, and `.upper()` converts that returned string to `HI`, which is printed."
    ),
    "PYF95_A5_OOP_025_ATTRIBUTE_DEFAULT_FALSE": (
        "Creating `User()` runs `__init__`, which stores `False` in `u.active`. "
        "The final `print(u.active)` therefore outputs `False`."
    ),
    "PY6_L06_gitignore_001": (
        "The `.env` pattern helps prevent an untracked `.env` file from being added by normal Git commands, which reduces the risk of committing API keys. "
        "It does not protect a file that Git already tracks. If a secret was committed or pushed, rotate it; `.gitignore` is not a secret store."
    ),
    "PY6_L06_requirements_001": (
        "A `requirements.txt` file lists Python packages that can be installed with a command such as `pip install -r requirements.txt`. "
        "Here, `==` requests the shown versions of FastAPI, Uvicorn, and pandas. "
        "This still does not fix the Python version, operating system, or every transitive dependency, so exact environment reproduction may need a lock file or additional environment metadata."
    ),
    "PY6_L09_service_worker_install_001": (
        "During the install event, `event.waitUntil(...)` keeps installation pending until its Promise settles. "
        "`caches.open('app-v1')` opens the named Cache or creates it if it does not exist. "
        "This snippet does not cache any files because it never calls `add`, `addAll`, or `put`; offline reads also need a fetch strategy that uses the cache."
    ),
    "PY16_L09_sentence_chunking_001": (
        "`current[-2:]` keeps the last two sentences from the chunk that was just completed. "
        "Those sentences become the beginning of the next chunk, creating a two-sentence overlap across the boundary. "
        "Overlap can preserve context, but it also duplicates text in search results, and it only works as intended if the input sentences were split correctly."
    ),
}

# High-confidence residual boilerplate seen during the manual review. These
# clauses are not card-specific explanations; many mention loops or lists on
# cards that contain neither.
EXPLANATION_PATTERNS = [
    r"\s*Even\s+This reading habit (?:carries|applies)[^.]*\.",
    r"\s*This reading habit (?:carries|applies) directly[^.]*\.",
    r"\s*The correct answer is not the familiar (?:format|pattern) (?:shown|seen) in the options, but rather [^.]*\.",
    r"\s*The correct answer is not a familiar (?:format|pattern|word) (?:shown|seen|from) the options, but rather [^.]*\.",
]

READING_GOAL_PATTERNS = [
    # Level-2 string/loop expansion tail: generic checklist, often unrelated to
    # the actual card. Keep the preceding specific learning objective.
    r"\s*(?:Also|Additionally),? (?:you can |I |we |it )?(?:follow|track|examine|determine|step through)[^.]*?(?:number of iterations|loop count)[^.]*?(?:final output|state of the list)[^.]*\.",
    r"\s*(?:Also|Additionally),? [^.]*?(?:current value of the loop variable)[^.]*?(?:final output|state of the list)[^.]*\.",
    r"\s*It also tracks the number of iterations, the current value of the loop variable, and the results produced by string methods line by line to determine the final output or the state of the list\.",
    # OOP expansion tail: the same full curriculum checklist was appended to
    # many cards after an already-specific first sentence.
    r"\s*In particular, (?:we(?:’|')ll |I(?:’|')ll )?(?:examine|review|look at) the difference between class definitions? and object creation, [^.]*?(?:dot notation|using dot notation)\.",
    r"\s*In particular, (?:examine|review) the difference between class definitions? and object creation, [^.]*?(?:dot notation|using dot notation)\.",
]


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


def process(apply_changes: bool) -> tuple[int, int, int, int, set[str]]:
    files_changed = 0
    cards_changed = 0
    clauses_removed = 0
    targeted_changed = 0
    found_targets: set[str] = set()

    for path in sorted(EN_ROOT.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        file_changed = False
        for card in payload:
            if not isinstance(card, dict):
                continue
            cid = str(card.get("id", ""))
            changed = False

            if cid in TARGET_EXPLANATIONS:
                found_targets.add(cid)
                desired = TARGET_EXPLANATIONS[cid]
                if card.get("explanation") != desired:
                    card["explanation"] = desired
                    targeted_changed += 1
                    changed = True

            exp, n1 = remove_patterns(str(card.get("explanation") or ""), EXPLANATION_PATTERNS, 25)
            goal, n2 = remove_patterns(str(card.get("reading_goal") or ""), READING_GOAL_PATTERNS, 18)
            if n1 and exp != card.get("explanation"):
                card["explanation"] = exp
                clauses_removed += n1
                changed = True
            if n2 and goal != card.get("reading_goal"):
                card["reading_goal"] = goal
                clauses_removed += n2
                changed = True

            if changed:
                cards_changed += 1
                file_changed = True

        if file_changed:
            files_changed += 1
            if apply_changes:
                path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    return files_changed, cards_changed, clauses_removed, targeted_changed, found_targets


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        raise SystemExit("choose exactly one of --apply/--check")

    files, cards, clauses, targeted, found = process(args.apply)
    missing = sorted(set(TARGET_EXPLANATIONS) - found)
    changed = bool(files or cards or clauses or targeted)

    print(f"REPAIR_VERSION={VERSION}")
    print(f"APPLY={args.apply}")
    print(f"EN_FILES_CHANGED={files}")
    print(f"EN_CARDS_CHANGED={cards}")
    print(f"GENERIC_CLAUSES_REMOVED={clauses}")
    print(f"TARGET_REWRITES={targeted}")
    print(f"TARGETS_FOUND={len(found)}")
    print(f"TARGETS_MISSING={len(missing)}")
    if missing:
        print("MISSING_TARGET_IDS=" + ",".join(missing))
    if args.check:
        print(f"IDEMPOTENT={not changed}")

    ok = not missing and (not args.check or not changed)
    print("RESULT=" + ("PASS_CORPUS_CONTEXT_REPAIR_V343_R5" if ok else "FAIL_CORPUS_CONTEXT_REPAIR_V343_R5"))
    if not ok:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

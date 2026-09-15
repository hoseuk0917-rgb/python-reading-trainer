#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SEARCH_TERMS = (
    "같은 문법 예제",
    "Same grammar",
    "teaching_example",
    "teachingExample",
    "count = 4",
    "count = 9",
)

KEYWORDS = {
    "if", "for", "while", "def", "return", "with", "try", "except",
    "elif", "else", "lambda", "yield", "raise", "assert", "import", "from",
}

CALL_EXCLUSIONS = {"print"}


def load_cards(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for key in ("cards", "lessons", "items"):
            value = data.get(key)
            if isinstance(value, list):
                return value
    raise ValueError(f"Unsupported lesson structure: {path}")


def named_grammar_signals(card: dict) -> set[str]:
    focus = str(card.get("focus_span") or card.get("target_statement") or "")
    signals: set[str] = set()

    for name in re.findall(r"\.([A-Za-z_]\w*)\s*\(", focus):
        signals.add(f"method:{name}")

    scrubbed = re.sub(r"\.[A-Za-z_]\w*\s*\(", "(", focus)
    for name in re.findall(r"\b([A-Za-z_]\w*)\s*\(", scrubbed):
        if name not in KEYWORDS and name not in CALL_EXCLUSIONS:
            signals.add(f"call:{name}")

    stripped = focus.strip()
    for kw in ("if", "for", "while", "def", "return", "with", "try", "except", "lambda"):
        if re.search(rf"\b{kw}\b", stripped):
            signals.add(f"kw:{kw}")

    return signals


def example_satisfies_signal(example_code: str, signal: str) -> bool:
    kind, value = signal.split(":", 1)
    if kind == "method":
        return re.search(rf"\.{re.escape(value)}\s*\(", example_code) is not None
    if kind == "call":
        return re.search(rf"(?<!\.)\b{re.escape(value)}\s*\(", example_code) is not None
    if kind == "kw":
        return re.search(rf"\b{re.escape(value)}\b", example_code) is not None
    return True


def normalize_code(text: str) -> str:
    return "\n".join(line.rstrip() for line in str(text).strip().splitlines()).strip()


def audit_language(label: str, lesson_dir: Path):
    files = sorted(lesson_dir.glob("*.json"))
    cards = []
    for path in files:
        for card in load_cards(path):
            if isinstance(card, dict):
                cards.append((path, card))

    missing = []
    malformed = []
    exact_same = []
    named_checked = []
    named_mismatch = []
    strip_cards = []

    for path, card in cards:
        cid = str(card.get("id", "<missing-id>"))
        teaching = card.get("teaching_example")
        if not isinstance(teaching, dict):
            missing.append((cid, path.name, "missing-object"))
            continue

        code = teaching.get("code")
        walkthrough = teaching.get("walkthrough")
        if not isinstance(code, str) or not code.strip() or not isinstance(walkthrough, str) or not walkthrough.strip():
            malformed.append((cid, path.name, type(code).__name__, type(walkthrough).__name__))
            continue

        source_code = str(card.get("code") or "")
        if normalize_code(source_code) == normalize_code(code):
            exact_same.append((cid, path.name))

        signals = named_grammar_signals(card)
        if signals:
            failed = sorted(s for s in signals if not example_satisfies_signal(code, s))
            named_checked.append((cid, path.name, sorted(signals)))
            if failed:
                named_mismatch.append((cid, path.name, sorted(signals), failed, card.get("focus_span"), code))

        if ".strip(" in source_code or ".strip(" in str(card.get("focus_span") or ""):
            strip_cards.append((
                cid,
                path.name,
                card.get("focus_span"),
                code,
                walkthrough,
            ))

    print(f"=== {label} LESSON AUDIT ===")
    print(f"LESSON_FILE_COUNT={len(files)}")
    print(f"CARD_COUNT={len(cards)}")
    print(f"TEACHING_EXAMPLE_MISSING_COUNT={len(missing)}")
    print(f"TEACHING_EXAMPLE_MALFORMED_COUNT={len(malformed)}")
    print(f"TEACHING_EXAMPLE_EXACT_SOURCE_DUP_COUNT={len(exact_same)}")
    print(f"NAMED_GRAMMAR_CHECKED_COUNT={len(named_checked)}")
    print(f"NAMED_GRAMMAR_MISMATCH_COUNT={len(named_mismatch)}")
    print(f"STRIP_CARD_COUNT={len(strip_cards)}")

    if missing:
        print("--- MISSING TEACHING EXAMPLES ---")
        for row in missing[:200]:
            print("MISSING|" + "|".join(map(str, row)))
    if malformed:
        print("--- MALFORMED TEACHING EXAMPLES ---")
        for row in malformed[:200]:
            print("MALFORMED|" + "|".join(map(str, row)))
    if exact_same:
        print("--- EXACT SOURCE DUPLICATES ---")
        for row in exact_same[:200]:
            print("EXACT_DUP|" + "|".join(map(str, row)))
    if named_mismatch:
        print("--- NAMED GRAMMAR MISMATCHES ---")
        for cid, fname, signals, failed, focus, code in named_mismatch[:300]:
            compact = code.replace("\n", "\\n")
            print(
                "GRAMMAR_MISMATCH|"
                f"ID={cid}|FILE={fname}|SIGNALS={signals}|FAILED={failed}|"
                f"FOCUS={focus!r}|EXAMPLE={compact}"
            )

    print("--- STRIP CARDS ---")
    for cid, fname, focus, code, walkthrough in strip_cards:
        compact_code = code.replace("\n", "\\n")
        compact_walkthrough = walkthrough.replace("\n", " ")
        print(
            "STRIP_CARD|"
            f"ID={cid}|FILE={fname}|FOCUS={focus!r}|"
            f"EXAMPLE={compact_code}|"
            f"WALKTHROUGH={compact_walkthrough}"
        )

    return {
        "files": len(files),
        "cards": len(cards),
        "missing": len(missing),
        "malformed": len(malformed),
        "exact_same": len(exact_same),
        "named_checked": len(named_checked),
        "named_mismatch": len(named_mismatch),
        "strip_cards": len(strip_cards),
    }


def source_forensics():
    print("=== UI SOURCE FORENSICS ===")
    roots = [ROOT / "src" / "pwa"]
    matches = []
    for base in roots:
        for path in sorted(base.rglob("*")):
            if not path.is_file() or path.suffix.lower() not in {".js", ".html", ".css"}:
                continue
            try:
                lines = path.read_text(encoding="utf-8").splitlines()
            except UnicodeDecodeError:
                continue
            hit_indexes = []
            for idx, line in enumerate(lines):
                if any(term in line for term in SEARCH_TERMS):
                    hit_indexes.append(idx)
            for idx in hit_indexes:
                start = max(0, idx - 10)
                end = min(len(lines), idx + 11)
                matches.append((path, idx + 1, start + 1, end, lines[start:end]))

    print(f"UI_SOURCE_MATCH_COUNT={len(matches)}")
    for path, line_no, start, end, excerpt in matches:
        rel = path.relative_to(ROOT)
        print(f"--- SOURCE_MATCH|PATH={rel}|LINE={line_no}|CONTEXT={start}-{end} ---")
        for n, line in enumerate(excerpt, start=start):
            print(f"{rel}:{n}: {line}")

    return len(matches)


def main():
    print("=== SAME GRAMMAR EXAMPLE V400 EXHAUSTIVE AUDIT ===")
    print("READ_ONLY=True")
    print("REPOSITORY_MUTATION=False")
    print("BROWSER_EXECUTION=False")

    source_match_count = source_forensics()
    ko = audit_language("KO", ROOT / "data" / "lessons")
    en = audit_language("EN", ROOT / "data_i18n" / "en" / "lessons")

    print("=== SUMMARY ===")
    print(f"UI_SOURCE_MATCH_COUNT={source_match_count}")
    print(f"KO_CARD_COUNT={ko['cards']}")
    print(f"EN_CARD_COUNT={en['cards']}")
    print(f"TOTAL_CARD_VARIANTS={ko['cards'] + en['cards']}")
    print(f"KO_NAMED_GRAMMAR_MISMATCH_COUNT={ko['named_mismatch']}")
    print(f"EN_NAMED_GRAMMAR_MISMATCH_COUNT={en['named_mismatch']}")
    print(f"KO_TEACHING_EXAMPLE_MISSING_COUNT={ko['missing']}")
    print(f"EN_TEACHING_EXAMPLE_MISSING_COUNT={en['missing']}")
    print("RESULT=AUDIT_COMPLETE")


if __name__ == "__main__":
    main()

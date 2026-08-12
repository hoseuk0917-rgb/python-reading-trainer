from __future__ import annotations

import argparse
import collections
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs" / "quality" / "v343_corpus_context_review.md"
KO_ROOT = ROOT / "data" / "lessons"
EN_ROOT = ROOT / "data_i18n" / "en" / "lessons"

FIELDS = ("reading_goal", "question", "explanation", "project_context")


def norm(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip().lower()


def paragraphs(value: object) -> list[str]:
    return [p.strip() for p in re.split(r"\n\s*\n+", str(value or "")) if p.strip()]


def dedupe_paragraphs(value: object) -> tuple[str, int]:
    rows = paragraphs(value)
    if not rows:
        return str(value or ""), 0
    seen: set[str] = set()
    out: list[str] = []
    removed = 0
    for p in rows:
        key = norm(p)
        if key in seen:
            removed += 1
            continue
        seen.add(key)
        out.append(p)
    return "\n\n".join(out), removed


def split_sentences(text: str) -> list[str]:
    return [s.strip() for s in re.split(r"(?<=[.!?。다요])\s+", str(text or "")) if s.strip()]


def sentence_lengths(text: str) -> list[int]:
    return [len(s) for s in split_sentences(text)]


def load_cards(root: Path) -> tuple[list[tuple[Path, dict]], list[str]]:
    cards: list[tuple[Path, dict]] = []
    errors: list[str] = []
    for path in sorted(root.glob("*.json")):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"json:{path.name}:{exc}")
            continue
        if not isinstance(payload, list):
            errors.append(f"not-list:{path.name}")
            continue
        for card in payload:
            if isinstance(card, dict):
                cards.append((path, card))
    return cards, errors


def anchor_text(value: object) -> str:
    text = str(value or "").lower()
    text = re.sub(r"[_\-./]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def card_risks(card: dict, lang: str) -> list[str]:
    """Contextual/educational signals only; canonical structure stays in validate_lessons.py."""
    risks: list[str] = []
    title = norm(card.get("title"))
    goal = norm(card.get("reading_goal"))
    q = norm(card.get("question"))
    exp = norm(card.get("explanation"))
    code = norm(card.get("code"))

    if goal and exp and goal == exp:
        risks.append("goal_equals_explanation")
    if q and goal and q == goal:
        risks.append("question_equals_goal")
    if q and exp and q == exp:
        risks.append("question_equals_explanation")
    if title and q and title == q:
        risks.append("title_equals_question")

    # Preserve whitespace and case here. Cards such as " hi " vs "hi" and
    # "YES" vs "yes" intentionally test exactly those differences.
    choices = [str(v) for v in card.get("choices", [])]
    if len(choices) != len(set(choices)):
        risks.append("duplicate_choices_candidate")
    if not exp:
        risks.append("missing_explanation_candidate")
    if not q:
        risks.append("missing_question_candidate")
    if code and q and len(code) < 4:
        risks.append("very_short_code")

    dense_limit = 170 if lang == "ko" else 240
    if any(length > dense_limit for length in sentence_lengths(str(card.get("explanation") or ""))):
        risks.append("dense_explanation_sentence")

    # Concept tags are English metadata. Literal anchoring is useful only for the
    # English mirror; applying it to Korean text created predictable false positives.
    if lang == "en":
        blob = anchor_text(" ".join([title, goal, q, exp, code]))
        concepts = [anchor_text(c) for c in card.get("concepts", []) if anchor_text(c)]
        aliases = {
            "comment": ["comment", "#"],
            "indentation": ["indent", "indentation"],
            "assignment": ["assignment", "assign", "="],
            "condition": ["condition", "if"],
            "loop": ["loop", "for", "while"],
            "function": ["function", "def"],
            "type": ["type", "data type"],
        }
        anchored = False
        for concept in concepts:
            tokens = aliases.get(concept, [concept])
            parts = [p for p in concept.split() if len(p) >= 3]
            tokens = list(dict.fromkeys(tokens + parts))
            if any(token and anchor_text(token) in blob for token in tokens):
                anchored = True
                break
        if concepts and not anchored:
            risks.append("declared_concepts_not_textually_anchored")
    return risks


def repeated_sentence_groups() -> list[tuple[str, str, int, list[str]]]:
    groups: list[tuple[str, str, int, list[str]]] = []
    for lang, root in (("ko", KO_ROOT), ("en", EN_ROOT)):
        seen: dict[str, list[str]] = collections.defaultdict(list)
        display: dict[str, str] = {}
        rows, _ = load_cards(root)
        for _, card in rows:
            cid = str(card.get("id", ""))
            for sentence in split_sentences(str(card.get("explanation") or "")):
                key = norm(sentence)
                if len(key) < 70:
                    continue
                seen[key].append(cid)
                display[key] = sentence
        for key, ids in seen.items():
            if len(ids) >= 3:
                groups.append((lang, display[key], len(ids), ids[:8]))
    return sorted(groups, key=lambda row: (-row[2], row[0], row[1]))


def run(apply_changes: bool) -> tuple[int, int, int, list[str], collections.Counter, list[tuple[str, str, str, list[str]]], list[tuple[str, str, int, list[str]]]]:
    total = 0
    changed_cards = 0
    changed_files: set[Path] = set()
    all_findings: list[tuple[str, str, str, list[str]]] = []
    hard_errors: list[str] = []

    for lang, root in (("ko", KO_ROOT), ("en", EN_ROOT)):
        _, load_errors = load_cards(root)
        hard_errors.extend(f"{lang}:{e}" for e in load_errors)
        file_payloads: dict[Path, list[dict]] = {}
        for path in sorted(root.glob("*.json")):
            try:
                payload = json.loads(path.read_text(encoding="utf-8"))
            except Exception:
                continue
            if isinstance(payload, list):
                file_payloads[path] = payload

        for path, payload in file_payloads.items():
            file_changed = False
            for card in payload:
                if not isinstance(card, dict):
                    continue
                total += 1
                card_changed = False
                for field in FIELDS:
                    if not card.get(field):
                        continue
                    updated, removed = dedupe_paragraphs(card[field])
                    if removed:
                        card[field] = updated
                        card_changed = True
                risks = card_risks(card, lang)
                if risks:
                    all_findings.append((lang, path.name, str(card.get("id", "")), risks))
                if card_changed:
                    changed_cards += 1
                    file_changed = True
            if file_changed:
                changed_files.add(path)
                if apply_changes:
                    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Whole-card duplicate signals. Same code is allowed, but the same code,
    # question, and answer is a strong indication that the learner is repeating
    # the same task rather than seeing a variation.
    for lang, root in (("ko", KO_ROOT), ("en", EN_ROOT)):
        rows, _ = load_cards(root)
        exact = collections.defaultdict(list)
        question_code = collections.defaultdict(list)
        for path, card in rows:
            exp = norm(card.get("explanation"))
            if exp and len(exp) >= 80:
                exact[exp].append((path.name, str(card.get("id", ""))))
            key = (norm(card.get("question")), norm(card.get("code")), norm(card.get("answer")))
            if key[0] and key[1]:
                question_code[key].append((path.name, str(card.get("id", ""))))
        for group in exact.values():
            if len(group) >= 2:
                for fname, cid in group:
                    all_findings.append((lang, fname, cid, [f"duplicate_explanation_group_{len(group)}"]))
        for group in question_code.values():
            if len(group) >= 2:
                for fname, cid in group:
                    all_findings.append((lang, fname, cid, [f"duplicate_problem_group_{len(group)}"]))

    repeated = repeated_sentence_groups()
    counts = collections.Counter(r for _, _, _, risks in all_findings for r in risks)
    lines = [
        "# V343 Corpus Context Review",
        "",
        "This report is a contextual/educational review queue. Structural validity remains governed by `tools/validate_lessons.py`.",
        "",
        f"- lesson cards scanned (KO+EN): {total}",
        f"- auto-fixed cards: {changed_cards}",
        f"- files changed: {len(changed_files)}",
        f"- hard read/parse errors: {len(hard_errors)}",
        f"- review candidates: {len(all_findings)}",
        f"- repeated explanation sentence groups (3+): {len(repeated)}",
        "",
        "## Finding counts",
        "",
    ]
    for key, count in counts.most_common():
        lines.append(f"- `{key}`: {count}")
    lines.extend(["", "## Repeated explanation sentences", ""])
    if repeated:
        for lang, sentence, count, ids in repeated[:60]:
            short = sentence if len(sentence) <= 260 else sentence[:257] + "..."
            lines.append(f"- `{lang}` · {count} cards · {', '.join(ids)} · {short}")
    else:
        lines.append("- none")
    lines.extend(["", "## Highest-priority candidates", ""])
    priority = {
        "goal_equals_explanation": 8,
        "question_equals_explanation": 8,
        "question_equals_goal": 7,
        "duplicate_problem_group": 7,
        "duplicate_explanation_group": 6,
        "declared_concepts_not_textually_anchored": 4,
        "dense_explanation_sentence": 3,
        "duplicate_choices_candidate": 3,
        "title_equals_question": 2,
        "very_short_code": 1,
    }
    scored = []
    for row in all_findings:
        score = sum(max((v for k, v in priority.items() if r.startswith(k)), default=1) for r in row[3])
        scored.append((score, row))
    for score, (lang, fname, cid, risks) in sorted(scored, key=lambda x: (-x[0], x[1][0], x[1][1], x[1][2]))[:300]:
        lines.append(f"- score {score} · `{lang}` · `{fname}` · `{cid}` · {', '.join(risks)}")
    lines.extend(["", "## Hard read/parse errors", ""])
    if hard_errors:
        lines.extend(f"- {e}" for e in hard_errors[:200])
    else:
        lines.append("- none")
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return total, changed_cards, len(changed_files), hard_errors, counts, all_findings, repeated


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        raise SystemExit("choose exactly one of --apply/--check")
    total, changed_cards, changed_files, hard_errors, counts, findings, repeated = run(args.apply)
    print("REVIEW_VERSION=v343_context_review_a3")
    print(f"APPLY={args.apply}")
    print(f"CARDS_SCANNED={total}")
    print(f"CARDS_CHANGED={changed_cards}")
    print(f"FILES_CHANGED={changed_files}")
    print(f"HARD_READ_PARSE_ERRORS={len(hard_errors)}")
    print(f"REVIEW_CANDIDATES={len(findings)}")
    print(f"REPEATED_SENTENCE_GROUPS={len(repeated)}")
    for key, count in counts.most_common(20):
        print(f"FINDING_{key.upper()}={count}")
    if args.check:
        print(f"IDEMPOTENT={changed_cards == 0}")
    ok = not hard_errors and (not args.check or changed_cards == 0)
    print("RESULT=" + ("PASS_CONTENT_CONTEXT_REVIEW_V343" if ok else "FAIL_CONTENT_CONTEXT_REVIEW_V343"))
    if not ok:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

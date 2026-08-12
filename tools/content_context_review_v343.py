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


def sentence_lengths(text: str) -> list[int]:
    return [len(s.strip()) for s in re.split(r"(?<=[.!?。다요])\s+", text) if s.strip()]


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


def card_risks(card: dict, lang: str) -> list[str]:
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
    choices = [norm(v) for v in card.get("choices", [])]
    if len(choices) != len(set(choices)):
        risks.append("duplicate_choices")
    answer = norm(card.get("answer"))
    if answer and choices and answer not in choices:
        risks.append("answer_not_in_choices")
    if not exp:
        risks.append("missing_explanation")
    if not q:
        risks.append("missing_question")
    if code and q and len(code) < 4:
        risks.append("very_short_code")
    dense_limit = 170 if lang == "ko" else 240
    if any(length > dense_limit for length in sentence_lengths(str(card.get("explanation") or ""))):
        risks.append("dense_explanation_sentence")
    # If none of the declared concepts is even weakly anchored anywhere, this is a useful manual-review signal.
    blob = " ".join([title, goal, q, exp, code])
    concepts = [norm(c) for c in card.get("concepts", []) if norm(c)]
    aliases = {
        "comment": ["comment", "주석", "#"],
        "indentation": ["indent", "들여쓰기"],
        "assignment": ["assignment", "대입", "="],
        "condition": ["condition", "조건", "if"],
        "loop": ["loop", "반복", "for", "while"],
        "function": ["function", "함수", "def"],
        "type": ["type", "자료형"],
    }
    if concepts:
        anchored = False
        for c in concepts:
            tokens = aliases.get(c, [c.replace("_", " "), c])
            if any(token and token in blob for token in tokens):
                anchored = True
                break
        if not anchored:
            risks.append("declared_concepts_not_textually_anchored")
    return risks


def run(apply_changes: bool) -> tuple[int, int, int, list[str]]:
    total = 0
    changed_cards = 0
    changed_files: set[Path] = set()
    all_findings: list[tuple[str, str, str, list[str]]] = []
    hard_errors: list[str] = []

    for lang, root in (("ko", KO_ROOT), ("en", EN_ROOT)):
        card_rows, load_errors = load_cards(root)
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
                if any(r in risks for r in ("duplicate_choices", "answer_not_in_choices", "missing_explanation", "missing_question")):
                    hard_errors.append(f"{lang}:{path.name}:{card.get('id')}:{','.join(risks)}")
                if card_changed:
                    changed_cards += 1
                    file_changed = True
            if file_changed:
                changed_files.add(path)
                if apply_changes:
                    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Whole-card duplicate signals. These are review candidates, not automatic edits.
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

    counts = collections.Counter(r for _, _, _, risks in all_findings for r in risks)
    lines = [
        "# V343 Corpus Context Review",
        "",
        f"- lesson cards scanned (KO+EN): {total}",
        f"- auto-fixed cards: {changed_cards}",
        f"- files changed: {len(changed_files)}",
        f"- hard errors: {len(hard_errors)}",
        f"- review candidates: {len(all_findings)}",
        "",
        "## Finding counts",
        "",
    ]
    for key, count in counts.most_common():
        lines.append(f"- `{key}`: {count}")
    lines.extend(["", "## Highest-priority candidates", ""])
    priority = {
        "goal_equals_explanation": 7,
        "question_equals_explanation": 7,
        "duplicate_problem_group": 7,
        "duplicate_explanation_group": 6,
        "declared_concepts_not_textually_anchored": 4,
        "dense_explanation_sentence": 3,
        "title_equals_question": 2,
    }
    scored = []
    for row in all_findings:
        score = sum(max((v for k, v in priority.items() if r.startswith(k)), default=1) for r in row[3])
        scored.append((score, row))
    for score, (lang, fname, cid, risks) in sorted(scored, key=lambda x: (-x[0], x[1][0], x[1][1], x[1][2]))[:250]:
        lines.append(f"- score {score} · `{lang}` · `{fname}` · `{cid}` · {', '.join(risks)}")
    lines.extend(["", "## Hard errors", ""])
    if hard_errors:
        lines.extend(f"- {e}" for e in hard_errors[:200])
    else:
        lines.append("- none")
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return total, changed_cards, len(changed_files), hard_errors


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        raise SystemExit("choose exactly one of --apply/--check")
    total, changed_cards, changed_files, hard_errors = run(args.apply)
    print("REVIEW_VERSION=v343_context_review_a1")
    print(f"APPLY={args.apply}")
    print(f"CARDS_SCANNED={total}")
    print(f"CARDS_CHANGED={changed_cards}")
    print(f"FILES_CHANGED={changed_files}")
    print(f"HARD_ERRORS={len(hard_errors)}")
    if args.check:
        print(f"IDEMPOTENT={changed_cards == 0}")
    ok = not hard_errors and (not args.check or changed_cards == 0)
    print("RESULT=" + ("PASS_CONTENT_CONTEXT_REVIEW_V343" if ok else "FAIL_CONTENT_CONTEXT_REVIEW_V343"))
    if not ok:
        raise SystemExit(1)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Corpus-wide guard for opaque future terminology in learner-facing text.

The V346 contract does not ban a difficult term before its formal lesson. It bans
*opaque* use: before the term's first curriculum introduction, the term must
appear only in text surfaces covered by the V344 quick-refresher glossary.
Question/title/choice surfaces are intentionally stricter because the refresher
does not rewrite those controls.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP_JS = ROOT / "src/pwa/app.js"
SUPPORT_JS = ROOT / "src/pwa/explanation_support_v344.js"

SUPPORTED_LESSON_FIELDS = {"reading_goal", "explanation", "project_context"}
STRICT_LESSON_FIELDS = {"title", "question", "choices"}
SIDECARD_FIELDS = {"title", "body", "detail"}

# The glossary key itself is always tried as a concept tag. These additions map
# terminology to the curriculum concept that makes the word expected knowledge.
TERM_CONCEPTS = {
    "bytecode": {"bytecode"},
    "cpython": {"cpython"},
    "compile": {"compile", "compiler"},
    "interpreter": {"interpreter"},
    "iterable": {"iterable"},
    "iterator": {"iterator", "iter"},
    "object": {"object", "class"},
    "reference": {"reference", "variable", "assignment"},
    "protocol": {"protocol"},
    "argument": {"argument", "function", "def"},
    "parameter": {"parameter", "function", "def"},
    "scope": {"scope", "function", "def"},
    "module": {"module", "import"},
    "exception": {"exception", "try_except", "raise"},
    "serialization": {"serialization", "json.loads", "json.dumps"},
    "runtime": {"runtime"},
    "cache": {"cache"},
    "dependency": {"dependency", "requirements"},
    "package": {"package", "pip"},
    "venv": {"venv"},
    "api": {"api", "requests"},
    "attribute": {"attribute", "class", "object"},
    "method": {"method", "class", "object"},
    "instance": {"instance", "class", "object"},
    "mutable": {"mutable"},
    "immutable": {"immutable"},
    "encoding": {"encoding", "file", "open"},
    "utf8": {"utf8", "encoding"},
    "stdlib": {"stdlib", "module", "import"},
    "envvar": {"envvar", "env", "environment_variable"},
    "process": {"process"},
}

# These translations are ordinary words in many contexts. The less ambiguous
# alias for the same glossary entry is still audited.
AMBIGUOUS_ALIASES = {"범위", "process"}


def parse_path_array(source: str, name: str) -> list[str]:
    match = re.search(rf"const\s+{re.escape(name)}\s*=\s*\[(.*?)\];", source, re.S)
    if not match:
        raise RuntimeError(f"could not find {name} in app.js")
    return re.findall(r'"([^"\n]+\.json)"', match.group(1))


def repo_path(raw: str, english: bool = False) -> Path:
    clean = raw.replace("\\", "/")
    while clean.startswith("../"):
        clean = clean[3:]
    if english:
        if not clean.startswith("data/"):
            raise RuntimeError(f"unexpected data path: {raw}")
        clean = "data_i18n/en/" + clean[len("data/") :]
    return ROOT / clean


def load_rows(paths: list[str], english: bool = False) -> list[dict]:
    rows: list[dict] = []
    for raw in paths:
        path = repo_path(raw, english=english)
        if not path.is_file():
            raise RuntimeError(f"missing file: {path.relative_to(ROOT)}")
        value = json.loads(path.read_text(encoding="utf-8-sig"))
        if not isinstance(value, list):
            raise RuntimeError(f"expected list: {path.relative_to(ROOT)}")
        rows.extend(row for row in value if isinstance(row, dict))
    return rows


def parse_glossary(source: str) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    pattern = re.compile(
        r"^\s{4}([A-Za-z0-9_]+):\s*\{\s*aliases:\s*(\[[^\]]*\])",
        re.M | re.S,
    )
    for match in pattern.finditer(source):
        key = match.group(1).lower()
        try:
            aliases = json.loads(match.group(2))
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"could not parse glossary aliases for {key}: {exc}") from exc
        out[key] = [str(alias) for alias in aliases if str(alias).strip()]
    return out


def normalize_concept(value: object) -> str:
    return str(value or "").strip().lower().replace("-", "_")


def first_intro_indices(cards: list[dict], glossary: dict[str, list[str]]) -> dict[str, int | None]:
    first: dict[str, int | None] = {key: None for key in glossary}
    for index, card in enumerate(cards):
        concepts = {normalize_concept(x) for x in card.get("concepts", []) if x is not None}
        for key in glossary:
            if first[key] is not None:
                continue
            expected = {normalize_concept(x) for x in TERM_CONCEPTS.get(key, {key})}
            if concepts & expected:
                first[key] = index
    return first


def alias_regex(alias: str) -> re.Pattern[str] | None:
    alias = alias.strip()
    if not alias or alias in AMBIGUOUS_ALIASES:
        return None
    escaped = re.escape(alias)
    if re.search(r"[A-Za-z]", alias):
        return re.compile(rf"(?<![A-Za-z0-9_]){escaped}(?![A-Za-z0-9_])", re.I)
    return re.compile(escaped)


def term_hits(text: object, glossary: dict[str, list[str]]) -> set[str]:
    value = str(text or "")
    if not value:
        return set()
    hits: set[str] = set()
    for key, aliases in glossary.items():
        for alias in aliases:
            pattern = alias_regex(alias)
            if pattern and pattern.search(value):
                hits.add(key)
                break
    return hits


def flatten_field(row: dict, field: str) -> str:
    value = row.get(field, "")
    if isinstance(value, list):
        return "\n".join(str(item) for item in value)
    return str(value or "")


def earliest_sidecard_links(cards: list[dict]) -> dict[str, int]:
    out: dict[str, int] = {}
    for index, card in enumerate(cards):
        for side_id in card.get("side_card_ids", []) or []:
            side_id = str(side_id)
            out.setdefault(side_id, index)
    return out


def audit_language(
    label: str,
    cards: list[dict],
    sidecards: list[dict],
    glossary: dict[str, list[str]],
) -> dict:
    first = first_intro_indices(cards, glossary)
    side_first = earliest_sidecard_links(cards)
    errors: list[str] = []
    supported_future = Counter()
    strict_future = Counter()
    side_future = Counter()
    all_mentions = Counter()

    for index, card in enumerate(cards):
        card_id = str(card.get("id", f"index:{index}"))
        for field in SUPPORTED_LESSON_FIELDS | STRICT_LESSON_FIELDS:
            text = flatten_field(card, field)
            hits = term_hits(text, glossary)
            for key in hits:
                all_mentions[key] += 1
                intro = first.get(key)
                if intro is None or index >= intro:
                    continue
                if field in SUPPORTED_LESSON_FIELDS:
                    supported_future[key] += 1
                else:
                    strict_future[key] += 1
                    errors.append(
                        f"{label}: FUTURE_TERM_UNSUPPORTED card={card_id} index={index+1} "
                        f"field={field} term={key} intro={intro+1}"
                    )

    unlinked_sidecards = 0
    for side in sidecards:
        side_id = str(side.get("id", ""))
        link_index = side_first.get(side_id)
        if link_index is None:
            unlinked_sidecards += 1
        for field in SIDECARD_FIELDS:
            hits = term_hits(flatten_field(side, field), glossary)
            for key in hits:
                all_mentions[key] += 1
                intro = first.get(key)
                if link_index is not None and intro is not None and link_index < intro:
                    # Entire rendered side-card surface is V344 refresher-enabled.
                    side_future[key] += 1

    return {
        "label": label,
        "cards": len(cards),
        "sidecards": len(sidecards),
        "first": first,
        "errors": errors,
        "supported_future": supported_future,
        "strict_future": strict_future,
        "side_future": side_future,
        "all_mentions": all_mentions,
        "unlinked_sidecards": unlinked_sidecards,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--report-only", action="store_true")
    args = parser.parse_args()

    app_source = APP_JS.read_text(encoding="utf-8-sig")
    support_source = SUPPORT_JS.read_text(encoding="utf-8-sig")
    lesson_paths = parse_path_array(app_source, "lessonFiles")
    side_paths = parse_path_array(app_source, "sideFiles")
    glossary = parse_glossary(support_source)

    if len(glossary) < 25:
        raise RuntimeError(f"glossary parse unexpectedly small: {len(glossary)}")

    required_selectors = ["#readingGoal", "#resultBox", "#projectContext", "#sideCards .side-card"]
    missing_selectors = [selector for selector in required_selectors if selector not in support_source]

    ko_cards = load_rows(lesson_paths, english=False)
    en_cards = load_rows(lesson_paths, english=True)
    ko_side = load_rows(side_paths, english=False)
    en_side = load_rows(side_paths, english=True)

    results = [
        audit_language("KO", ko_cards, ko_side, glossary),
        audit_language("EN", en_cards, en_side, glossary),
    ]

    errors = []
    if missing_selectors:
        errors.append("V344_MISSING_TARGET_SELECTORS=" + ",".join(missing_selectors))
    for result in results:
        errors.extend(result["errors"])

    ko_ids = [str(row.get("id", "")) for row in ko_cards]
    en_ids = [str(row.get("id", "")) for row in en_cards]
    if ko_ids != en_ids:
        errors.append("KO_EN_LESSON_ORDER_ID_PARITY=FAIL")
    ko_side_ids = [str(row.get("id", "")) for row in ko_side]
    en_side_ids = [str(row.get("id", "")) for row in en_side]
    if ko_side_ids != en_side_ids:
        errors.append("KO_EN_SIDECARD_ORDER_ID_PARITY=FAIL")

    print("=== PRT V346 TERMINOLOGY LEAKAGE AUDIT ===")
    print(f"GLOSSARY_TERMS={len(glossary)}")
    print("GLOSSARY_KEYS=" + ",".join(sorted(glossary)))
    print(f"LESSON_FILES={len(lesson_paths)} SIDE_FILES={len(side_paths)}")
    print(f"KO_LESSON_CARDS={len(ko_cards)} EN_LESSON_CARDS={len(en_cards)}")
    print(f"KO_SIDE_CARDS={len(ko_side)} EN_SIDE_CARDS={len(en_side)}")
    print("V344_REQUIRED_TARGETS=" + ("PASS" if not missing_selectors else "FAIL:" + ",".join(missing_selectors)))
    print("KO_EN_LESSON_ORDER_ID_PARITY=" + ("PASS" if ko_ids == en_ids else "FAIL"))
    print("KO_EN_SIDECARD_ORDER_ID_PARITY=" + ("PASS" if ko_side_ids == en_side_ids else "FAIL"))

    for result in results:
        formal = sum(1 for value in result["first"].values() if value is not None)
        supported = sum(result["supported_future"].values())
        side_supported = sum(result["side_future"].values())
        strict = sum(result["strict_future"].values())
        print(f"{result['label']}_FORMAL_INTRO_TERMS={formal}")
        print(f"{result['label']}_SUPPORTED_FUTURE_LESSON_MENTIONS={supported}")
        print(f"{result['label']}_SUPPORTED_FUTURE_SIDECARD_MENTIONS={side_supported}")
        print(f"{result['label']}_UNSUPPORTED_FUTURE_TERMINOLOGY={strict}")
        print(f"{result['label']}_UNLINKED_SIDECARDS={result['unlinked_sidecards']}")
        top = result["supported_future"] + result["side_future"]
        print(
            f"{result['label']}_FUTURE_SUPPORTED_TOP=" +
            ",".join(f"{key}:{count}" for key, count in top.most_common(12))
        )

    if errors:
        print(f"ERRORS={len(errors)}")
        for line in errors[:80]:
            print("ERROR=" + line)
        if len(errors) > 80:
            print(f"ERROR_TRUNCATED={len(errors)-80}")
        if args.report_only:
            print("RESULT=REPORT_TERMINOLOGY_LEAKAGE_V346")
            return 0
        print("RESULT=FAIL_TERMINOLOGY_LEAKAGE_V346")
        return 1

    print("ERRORS=0")
    print("RESULT=PASS_TERMINOLOGY_LEAKAGE_V346")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

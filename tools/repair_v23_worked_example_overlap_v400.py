#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
R2 = ROOT / "src/pwa/worked_example_quality_v355_r2.js"
AUDIT = ROOT / "tools/audit_effective_same_syntax_v400.js"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"REPAIR_GUARD_FAIL|{label}|COUNT={count}")
    return text.replace(old, new, 1)


def patch_r2() -> None:
    text = R2.read_text(encoding="utf-8")
    if "function isV23RichCard(card)" in text:
        print("R2_ALREADY_PATCHED=True")
        return

    text = replace_once(
        text,
        "  function currentContext() {\n",
        "  function isV23RichCard(card) {\n"
        "    return Boolean(\n"
        "      card &&\n"
        "      card.authoring_version === \"V2.3\" &&\n"
        "      card.concept_explanation &&\n"
        "      card.teaching_example &&\n"
        "      card.answer_explanation\n"
        "    );\n"
        "  }\n\n"
        "  function currentContext() {\n",
        "R2_INSERT_V23_HELPER",
    )

    text = replace_once(
        text,
        "    const ctx = currentContext();\n"
        "    const selected = selectCurrentExample(ctx);\n"
        "    if (!ctx || !selected) {\n",
        "    const ctx = currentContext();\n"
        "    if (ctx && isV23RichCard(ctx.card)) {\n"
        "      hideOwnedBox();\n"
        "      return false;\n"
        "    }\n"
        "    const selected = selectCurrentExample(ctx);\n"
        "    if (!ctx || !selected) {\n",
        "R2_RECONCILE_V23_SUPPRESSION",
    )

    text = replace_once(
        text,
        "    cardsValue.forEach(function (card, index) {\n"
        "      const ctx = { cardsValue: cardsValue, index: index, card: card, conceptInfoValue: conceptInfoValue };\n",
        "    cardsValue.forEach(function (card, index) {\n"
        "      if (isV23RichCard(card)) return;\n"
        "      const ctx = { cardsValue: cardsValue, index: index, card: card, conceptInfoValue: conceptInfoValue };\n",
        "R2_DISTINCT_AUDIT_V23_SKIP",
    )

    text = replace_once(
        text,
        "    const stats = { total: cardsValue.length, candidates: 0, shown: 0, missing: [], duplicate: [] };\n",
        "    const stats = { total: cardsValue.length, v23Suppressed: 0, candidates: 0, shown: 0, missing: [], duplicate: [] };\n",
        "R2_EFFECTIVE_AUDIT_STATS",
    )

    text = replace_once(
        text,
        "    cardsValue.forEach(function(card, index) {\n"
        "      const ctx = { cardsValue: cardsValue, index: index, card: card, conceptInfoValue: conceptInfoValue };\n",
        "    cardsValue.forEach(function(card, index) {\n"
        "      if (isV23RichCard(card)) { stats.v23Suppressed += 1; return; }\n"
        "      const ctx = { cardsValue: cardsValue, index: index, card: card, conceptInfoValue: conceptInfoValue };\n",
        "R2_EFFECTIVE_AUDIT_V23_SKIP",
    )

    R2.write_text(text, encoding="utf-8")
    print("R2_PATCHED=True")


def patch_audit() -> None:
    text = AUDIT.read_text(encoding="utf-8")
    if "v23LegacyPanelSuppressed" in text:
        print("AUDIT_ALREADY_PATCHED=True")
        return

    text = replace_once(
        text,
        "function focusText(card) {\n"
        "  return String(card.focus_span || card.target_statement || \"\").trim();\n"
        "}\n\n",
        "function focusText(card) {\n"
        "  return String(card.focus_span || card.target_statement || \"\").trim();\n"
        "}\n\n"
        "function isV23RichCard(card) {\n"
        "  return Boolean(\n"
        "    card &&\n"
        "    card.authoring_version === \"V2.3\" &&\n"
        "    card.concept_explanation &&\n"
        "    card.teaching_example &&\n"
        "    card.answer_explanation\n"
        "  );\n"
        "}\n\n",
        "AUDIT_INSERT_V23_HELPER",
    )

    text = replace_once(
        text,
        "    hasPanelCandidate: 0,\n"
        "    selected: 0,\n",
        "    v23LegacyPanelSuppressed: 0,\n"
        "    hasPanelCandidate: 0,\n"
        "    selected: 0,\n",
        "AUDIT_STATS_V23_SUPPRESSED",
    )

    text = replace_once(
        text,
        "    const primary = pickPrimary(card || {}, conceptInfo);\n",
        "    if (isV23RichCard(card)) {\n"
        "      stats.v23LegacyPanelSuppressed += 1;\n"
        "      return;\n"
        "    }\n\n"
        "    const primary = pickPrimary(card || {}, conceptInfo);\n",
        "AUDIT_RUNTIME_V23_SUPPRESSION",
    )

    text = replace_once(
        text,
        "  console.log(`KO_EFFECTIVE_PANEL_MISMATCH_COUNT=${ko.stats.exactSyntaxMismatch}`);\n"
        "  console.log(`EN_EFFECTIVE_PANEL_MISMATCH_COUNT=${en.stats.exactSyntaxMismatch}`);\n",
        "  console.log(`KO_V23_LEGACY_PANEL_SUPPRESSED_COUNT=${ko.stats.v23LegacyPanelSuppressed}`);\n"
        "  console.log(`EN_V23_LEGACY_PANEL_SUPPRESSED_COUNT=${en.stats.v23LegacyPanelSuppressed}`);\n"
        "  console.log(`KO_EFFECTIVE_PANEL_MISMATCH_COUNT=${ko.stats.exactSyntaxMismatch}`);\n"
        "  console.log(`EN_EFFECTIVE_PANEL_MISMATCH_COUNT=${en.stats.exactSyntaxMismatch}`);\n",
        "AUDIT_SUMMARY_V23_SUPPRESSED",
    )

    AUDIT.write_text(text, encoding="utf-8")
    print("AUDIT_PATCHED=True")


def main() -> None:
    print("=== V23 WORKED EXAMPLE OVERLAP REPAIR V400 ===")
    print("TARGET=LEGACY_WORKED_EXAMPLE_BOUNDARY_ONLY")
    patch_r2()
    patch_audit()
    print("RESULT=REPAIR_APPLIED")


if __name__ == "__main__":
    main()

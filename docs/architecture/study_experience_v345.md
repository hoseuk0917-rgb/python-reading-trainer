# Study Experience V345

## Goal

V345 hardens the product as a long-running study application without changing the V339-V344 learning semantics.

## Product decisions

- Primary navigation order: Learn → Practice → Progress.
- Support navigation: Outline → Notes.
- Analysis utilities live under one Tools menu: Code explainer, Command explainer, Project analyzer.
- No XP, badges, coins, streak punishment, ranking, or loot mechanics.
- Achievement feedback is evidence based: today's answered cards, new cards, correct attempts, cards that need another look, next sequential position, and checkpoint distance.

## Focus study contract

Focus mode is enabled by default during quiz study.

Before an answer, the visible priority is:

1. current card identity/progress
2. code
3. question
4. choices

Concept notes, reading goals, side cards, project context, and study-tool surfaces stay hidden until either:

- the learner presses Show help, or
- the learner answers / marks the card as Not sure.

The next card returns to the pre-answer focused state.

## Backup and restore contract

The Progress view exposes full study-data JSON backup and restore.

The backup includes only origin storage keys owned by this app:

- keys beginning with `python-reading-trainer-`
- keys beginning with `pythonReadingTrainer.`

This includes progress, review state, learning experience state, V345 activity evidence, language preference, study-tool state, card notes, and concept notes when they use the app namespaces.

Restore must:

- validate schema/version
- reject foreign storage keys
- reject oversized payloads
- show a preview before writing
- clear/replace only app-owned keys
- preserve unrelated origin localStorage/sessionStorage keys

## Accessibility contract

- top navigation uses tablist/tab semantics and updates `aria-selected`
- keyboard navigation supports Left/Right/Home/End across top tabs
- tools menu exposes menu semantics
- answer result is a polite live region
- keyboard focus uses a visible focus ring
- V345 and known existing dialogs can close with Escape
- active dialogs trap Tab focus
- touch controls use a 44px minimum height where V345 hardening applies
- reduced-motion preferences are honored

## Regression policy

V345 must keep all V339-V344 gates passing, including real-browser V343 learning-home and V344 explanation-refresher smoke tests. The V345 patchers must be idempotent before release.

# Python Reading Trainer Screen Contract R1.1

Status: implementation contract
Functional authority: existing V343–V400 runtime and frozen lesson contracts
Visual authority: R1.1 reference image and `PRT_PRODUCT_DESIGN_SYSTEM_R1_1.md`

## Shared contract

All viewports expose the same functions and live data. Only layout and progressive disclosure change. Existing element IDs, semantic buttons, localStorage keys, event listeners, Escape/focus-return behavior, and current public/local access policies must remain intact.

Loading states keep the current placeholder or empty renderer. Errors remain visible in the screen that owns them. Empty states explain that no records exist and do not fabricate sample learner data.

## A. Home / Learning Home

**Purpose:** communicate the learner's current state and next action within three seconds.

**Preserved behavior:** next sequential card, attempted/total progress, due review count, next/open checkpoint, weekly cards/study days, recent concepts, Practice, Diagnostic, Outline, and V343/V346 navigation behavior.

**Hierarchy:** current/next learning → compact overall progress → primary CTA → review/checkpoint → secondary entries → recent concepts.

- Desktop: current action and explanation occupy the main column; a compact live-data progress card occupies the secondary column.
- Tablet landscape: two columns remain with reduced padding.
- Tablet portrait: progress stacks under the introduction and before the next-action card.
- Mobile: one column, full-width primary CTA, details remain progressive disclosure.
- Interaction: the existing learning CTA, diagnostic entry, Practice action, and details toggle retain their listeners.
- Empty/loading/error: existing loading and no-card paths remain authoritative; no example totals are substituted.
- Do not change: sequence order, review delivery, checkpoint calculation, weekly calculation, or card data.

## B. Learn / Quiz Card

**Purpose:** support focused code reading and answer practice.

**Preserved behavior:** level/status, title, concept explanation, reading goal, code, question, choices, result, previous, not sure, next, side cards, project context, memo, support, review behavior.

**Hierarchy:** concept/reading → code → question → response/result → next action.

- Desktop: strong main learning column; support is optional and narrower.
- Tablet landscape: main column remains dominant; support may stack when space is insufficient.
- Tablet portrait/mobile: one-column quiz; support uses the existing disclosure/sheet behavior.
- Interaction: answer buttons, previous/not sure/next, focus mode, support, memo save, and Escape behavior remain unchanged.
- Empty/loading/error: existing card loading and fallback code text remain.
- Do not change: answer normalization, correctness, progress marking, review scheduling, card identity/content, or memo keys.

## C. Outline

**Purpose:** browse concepts and open related learning cards.

**Preserved behavior:** concept list, progress metadata, definition/example, related cards, concept memo.

**Hierarchy:** concept browse list → selected concept definition/example → related cards → memo.

- Desktop: two-column concept browse and sticky detail.
- Tablet landscape: two columns when comfortable.
- Tablet portrait/mobile: detail stacks below the list; no squeezed side panel.
- Interaction: concept and related-card buttons keep existing navigation.
- Empty/loading/error: existing “no related cards” and default concept selection remain.
- Do not change: concept routing, definitions, examples, lesson links, or memo key.

## D. Progress

**Purpose:** make the next study action explicit, then show progress detail.

**Preserved behavior:** V346 actual-state priority, review/new/checkpoint/complete states, remaining new cards, due reviews, checkpoint, weekly cards, study days, today's summary, per-level totals.

**Hierarchy:** “What to do now” → action CTA → supporting counts → overall/per-level detail.

- Desktop/tablet landscape: wide action card followed by multi-column metrics.
- Tablet portrait/mobile: metrics stack or form a compact two-column grid without overflow.
- Interaction: primary next action and today's summary retain V346 handlers.
- Empty/loading/error: zero values are valid runtime values; never replaced with samples.
- Do not change: action-state ordering or calculations.

## E. Practice

**Purpose:** apply only concepts currently allowed by the learning runtime.

**Preserved behavior:** unlocked modules, contextual practice, checkpoints, missions, results, return path, current/learned concept constraints.

- Desktop/tablet landscape: grouped module cards with primary mission area.
- Tablet portrait/mobile: single-column cards and full-width mission actions.
- Interaction: existing contextual offer, later, mission, checkpoint, and result controls remain.
- Empty/loading/error: existing locked/empty module messaging remains.
- Do not change: eligibility, checkpoint unlocks, mission data, or result logic.

## F. Diagnostic

**Purpose:** show the current diagnostic stage and next decision clearly.

**Preserved behavior:** profile, screening, foundation decision, baseline, checkpoint, retest, complete/result; question counts, scoring, axes, recommendations.

- Desktop: four-part progress track, focused diagnostic card, results below.
- Tablet landscape: four steps remain readable.
- Tablet portrait: steps wrap/reflow without clipping.
- Mobile: two-by-two step track, one-column questions/results.
- Interaction: all profile selection, unknown, stage transition, learning, and result buttons remain semantic and unchanged.
- Empty/loading/error: current fetch-error renderer remains visible.
- Do not change: storage key, authority checks, placement/scoring, question pools, or stage order.

## G. Notes

**Purpose:** review browser-local card and concept notes in one place.

**Preserved behavior:** refresh, Markdown download, card/concept notes, browser-local storage.

- Desktop/tablet: wide list with clearly separated records.
- Mobile: one-column records; note bodies wrap while code-like content remains readable.
- Empty/loading/error: existing no-notes message remains.
- Do not change: memo prefixes, export format, or storage location.

## H. Code Explainer

**Purpose:** explain pasted code beginner-first.

**Preserved behavior:** result first, main function, plain-language purpose, real code-name labels, simple flow, warnings, detailed analysis, related cards, Mermaid/export.

- Desktop: full-width input, result and diagram in two columns.
- Tablet landscape: result and diagram may remain two columns.
- Tablet portrait/mobile: input → result → diagram in one column.
- Interaction: analyze, language, samples, filters, copy/export, details, and large diagram remain.
- Empty/loading/error: existing muted placeholders and analyzer errors remain.
- Do not change: analysis rules or V328 beginner-first ordering; advanced details stay available and collapsed.

## I. Command Explainer

**Purpose:** answer safety, effect, checks, and additional context in that order.

**Preserved behavior:** static-only analysis, safety groups, warnings, steps, next checks, samples, and detailed context.

- Desktop/tablet landscape: input and result can share two columns.
- Tablet portrait/mobile: one column with the analyze action prominent.
- Empty/loading/error: existing placeholders remain.
- Do not change: safety classification or command execution policy; commands are never executed.

## J. Project Analyzer

**Purpose:** identify project type, first files, likely execution, unknowns, and safe read-only confirmation.

**Preserved behavior:** root input, probe generation/copy, pasted output, summary/detail, structure diagram, all detailed analysis.

- Desktop/tablet landscape: two-column cards.
- Tablet portrait/mobile: ordered one-column flow; controls become full-width when needed.
- Empty/loading/error: existing probe and analysis placeholders remain.
- Do not change: read-only probe design, parsing, cross-file analysis, or detailed data.

## K. Developer Workbench

**Purpose:** execute the established find/filter → select → edit → validate → diff → save/stage → next workflow.

**Preserved behavior:** all fields, filters, quick validation, Current/Draft diff, Draft save + Staged, previous/next, advanced editor, and storage keys.

- Desktop: dense browser/editor/side panels are allowed.
- Tablet: browser and editor stack when space is limited.
- Mobile: one-column workbench with scrollable list and diff.
- Empty/loading/error: current no-results, no-selection, parse-error, and card-load messages remain.
- Do not change: field paths, card ID immutability, draft payload, staged index, auth, or export contract.

## L. Local Admin

**Purpose:** inspect operational/content status and route authorized local work to learning or Developer tools.

**Preserved behavior:** search/filter, pagination, detail, change queue, learning/Developer open actions, Escape close, local-only entry.

- Desktop: summary, toolbar, table, and detail form a dense multi-column workspace.
- Tablet/mobile: toolbar and main panels stack; table remains internally scrollable.
- Empty/loading/error: existing empty queue/detail and failed-open behavior remain.
- Do not change: local-host gate, public Admin hiding, remote auth policy, data source, or staged storage contract.

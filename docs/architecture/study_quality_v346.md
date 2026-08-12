# Study Quality V346

## Scope

V346 closes three quality gaps without changing the V340/V341 learning semantics:

1. Progress should answer **what should I do next?** before showing raw statistics.
2. Difficult terminology must not appear as unexplained future knowledge.
3. Repeated study UI styling should move toward reusable components and tokens.

## 1. Next-action progress contract

The existing progress dashboard and V345 backup controls remain available. V346 prepends one read-only next-action surface.

Priority is deterministic:

1. due spaced reviews,
2. an unlocked but unfinished 30-card checkpoint,
3. the first unseen card in the fixed sequential curriculum,
4. completion/consolidation summary.

The V346 runtime does not write progress, review, checkpoint, or activity state. It reads existing V340/V341 state and invokes existing UI actions. V345's today's-summary API is reused instead of duplicated.

## 2. Future terminology guard

A difficult term is not automatically forbidden before its formal lesson. The defect is an **opaque future term**.

For every KO/EN lesson and sidecard file loaded by `app.js`:

- title/question/choice surfaces are strict because V344 does not annotate those controls;
- reading goal, answer explanation, project context, and rendered sidecards may contain a future difficult term only when V344's quick-refresher glossary covers the term;
- the audit derives curriculum order from the same `lessonFiles` list used by the app;
- KO/EN lesson and sidecard ID/order parity remain mandatory;
- code blocks are excluded because code syntax is already governed by the V340 learned-syntax boundary.

The governed terminology set is the V344 refresher glossary itself. This keeps authoring, runtime support, and audit policy aligned.

## 3. Shared study UI components

`study_ui_v346.css` introduces reusable tokens and components:

- `prt-surface`
- `prt-action` / `prt-action--primary`
- `prt-stat-grid` / `prt-stat`
- `prt-dialog`
- layout helpers (`prt-stack`, `prt-inline`)

V346 uses these directly and adopts them onto key V340/V341/V345 surfaces at runtime. Legacy selectors remain for backward compatibility; V346 does not require a risky full CSS rewrite.

## Release gates

- V346 integration patch is idempotent.
- V346 runtime is read-only with respect to learning state.
- terminology leakage audit passes for the full KO/EN corpus.
- V339 through V345 regression gates stay green.
- real Chrome passes at desktop and 390 px width.
- final closure run produces no generated changes before main is fast-forwarded.

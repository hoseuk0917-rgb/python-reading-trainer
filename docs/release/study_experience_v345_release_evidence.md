# Study Experience V345 Release Evidence

## Product commit

- Validated product commit: `4178d142ba9e8dcb1d44997a599c56e52741261f`
- V345 closure workflow run: `31578286506`
- Closure result: success
- Integration apply on final generated state: `CHANGES=0`
- Integration check: `IDEMPOTENT=True`
- R2 navigation/accessibility apply on final generated state: `CHANGES=0`
- R2 check: `IDEMPOTENT=True`
- Final workflow commit step: `V345_ALREADY_CLEAN=True`

## Product decisions

- Top-level navigation is ordered as Learn → Practice → Progress → Outline → Notes → Tools.
- Code explainer, Command explainer, and Project analyzer are grouped under Tools.
- Focus study mode is on by default for quiz study. Before answering, it prioritizes code, question, and choices. Supporting explanation surfaces can be opened manually and are revealed automatically after an answer.
- The learning home exposes an evidence-based daily study summary. There are no XP, coins, badges, rankings, loot, or streak punishment.
- The Progress view exposes full study-data JSON backup and restore for app-owned storage keys only.
- Restore validates schema/version, rejects foreign keys and oversized payloads, previews the restore, and preserves unrelated origin storage.

## Accessibility

- tablist/tab semantics and `aria-selected`
- Left/Right/Home/End navigation across top tabs
- Tools menu semantics
- polite live region for answer feedback
- visible keyboard focus ring
- Escape close and Tab focus containment for V345 modal behavior
- 44px minimum hardened control height
- reduced-motion support

## Regression evidence

The final closure run passed:

- lesson validator: 1,785 lesson cards / 440 core side cards
- V339 content-quality gates including 3,764 / 3,764 relevant direct side-card links
- V340 learning-loop regression
- V341 learning-experience regression
- V342 full curriculum hardening regression
- V343 3,570-card context/corpus regression and real-browser learning-home smoke
- V344 explanation-quality/explainer regression and real-browser refresher smoke

## V345 real-browser evidence

Desktop and narrow Chrome both passed the full V345 behavior case.

Verified behavior includes:

- navigation order `learn,practice,progress,outline,notes`
- Tools group contains `code,command,project`
- backup includes app-owned keys and excludes foreign keys
- restore rejects foreign keys
- restore recovers app-owned state while preserving unrelated storage and notes
- focus mode hides supporting material before an answer
- Show help reveals supporting material
- answering reveals supporting material
- the next card returns to focused pre-answer state
- daily activity evidence increments after a real answer
- daily summary modal renders and closes with Escape
- backup/restore UI appears in Progress
- Tools menu navigates to the actual tool views
- keyboard ArrowRight moves to the next top tab
- KO and EN UI pass
- no horizontal overflow

Desktop viewport evidence: `1154 / 1154`.
Narrow viewport evidence: `454 / 454`.

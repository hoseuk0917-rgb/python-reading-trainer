# Consumer UX simplification V349

## Purpose
V349 is a presentation and interaction simplification pass. It does not remove learning content, analysis tools, progress data, notes, or review behavior. The goal is to reduce the number of simultaneous choices and make the current learner action visually dominant.

## UX policy
- Four persistent primary destinations only: Learn, Practice, Tools, My learning.
- Existing Outline, Progress, Notes, Code explainer, Command explainer, and Project analyzer remain available through progressive-disclosure menus.
- Reset progress and language controls move under the header overflow menu instead of competing with the learning action.
- Quiz mode defaults to one focused learning column. Side cards, project context, and memo remain available through Support.
- Study-card search and queue controls remain available but collapsed until requested.
- Learning Home defaults to the next recommended action; detailed stats and secondary actions are collapsed.
- Advanced copy/export/sample controls in analysis tools are collapsed while core input + analyze actions stay visible.
- Mobile uses four bottom navigation targets for thumb reach and preserves an exact 390 px no-horizontal-overflow contract.

## Non-goals
- No lesson or side-card rewrite.
- No change to review scheduling, checkpoint rules, scoring, backup/restore, or local storage contracts.
- No feature deletion.
- No change to V348 attempt/dialog ownership.

## Release gates
- V349 integration applicator is idempotent.
- V339-V348 quality and runtime audits remain green.
- Existing V343-V347 real-browser regressions remain green.
- V349 desktop and 390 px browser smoke verifies four primary navigation items, progressive disclosure, focused quiz layout, menu Escape/focus return, and no horizontal overflow.

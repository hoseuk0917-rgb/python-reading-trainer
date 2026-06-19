# V328-A1 beginner-first code explanation UX

## Scope

This patch adds a beginner-first panel to the top of the code explanation result area.

It does not replace the analysis engine.

## Changed behavior

The top code explanation area now starts with:

1. What result the code likely makes.
2. Which function appears to make the clearest result.
3. Function purpose cards in beginner-facing Korean.
4. Code name labels.
5. A short execution flow.

The old numeric quick summary is preserved, but moved under a collapsed details section named `기존 숫자 요약 보기`.

## Implementation

Main target:

- `src/pwa/code_explainer.js`

Added marker:

- `BEGINNER_FIRST_CODE_UX_V328_A1`

New renderer:

- `renderBeginnerFirstPanelV328A1(result)`

The function is integrated through `renderQuickReport(result)` because `codeQuickReport` is the current top summary container in the code explanation view.

## Non-goals

This patch does not yet collapse all old detailed sections.

Follow-up V328-A2 should collapse:

- confidence details
- data flow
- call flow
- long function analysis
- related cards
- Mermaid source
- internal-tag style details

## Validation

Run:

- `node --check src/pwa/code_explainer.js`
- `node --check src/pwa/app.js`
- `node --check tools/smoke_beginner_first_code_ux_v328_a1.js`
- `node tools/smoke_beginner_first_code_ux_v328_a1.js`
- `python tools/validate_lessons.py`

## A1 cleanup decision

If no useful beginner-first result can be inferred, the beginner-first panel should not be shown.

This prevents meaningless fallback text such as "follow the return or output line" from appearing on PowerShell or other non-function snippets.

V328-A2 should handle broader layout cleanup:

- collapse advanced detail sections by default
- make Mermaid visible through a clearer expand or overlay flow
- expose related cards and internal analysis only at the point where the user asks for more detail

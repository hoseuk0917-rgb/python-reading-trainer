# V328-A2 advanced detail collapse and Mermaid reveal UX

## Scope

V328-A2 reduces first-screen overload in the code explanation view.

The analysis engine is preserved. This patch changes default layout and reveal behavior only.

## Changed behavior

- Existing advanced details are closed by default.
- Mermaid flowchart rendering is no longer automatic.
- The user sees the flowchart reveal button first.
- The code explanation view uses a single-column layout on wide screens.
- The Mermaid panel moves below the explanation instead of occupying a fixed right column.

## Markers

- ADVANCED_DETAILS_CLOSED_V328_A2_1
- MERMAID_ALWAYS_REVEAL_BUTTON_V328_A2_2
- MERMAID_BELOW_RESULT_LAYOUT_V328_A2_3
- CODE_EXPLAINER_SINGLE_COLUMN_V328_A2_4

## Validation

- node --check src/pwa/code_explainer.js
- node --check src/pwa/app.js
- node --check tools/smoke_advanced_details_collapsed_v328_a2.js
- node tools/smoke_advanced_details_collapsed_v328_a2.js
- python tools/validate_lessons.py

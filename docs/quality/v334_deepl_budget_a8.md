# V334-A8 DeepL Character Budget

Purpose: estimate whether DeepL API Free monthly quota can cover extracted Korean copy.

DeepL API Free reference limit: 500,000 source characters per month.

## Recommended Strategy

- Do not translate all extracted rows at once.
- Translate `v334_high_priority` first.
- If budget remains, translate `v334_explainer`.
- Keep `all_rows` as a freeze inventory, not as the first DeepL batch.

## Packs

| pack | rows | source chars | % of 500k | average chars/row |
|---|---:|---:|---:|---:|
| all_rows | 2869 | 76810 | 15.4% | 27 |
| all_high_priority | 763 | 22861 | 4.6% | 30 |
| all_explainer | 728 | 19517 | 3.9% | 27 |
| v334_marker_rows | 300 | 5553 | 1.1% | 19 |
| v334_high_priority | 182 | 2939 | 0.6% | 16 |
| v334_explainer | 182 | 2939 | 0.6% | 16 |

## By Category

| category | rows | source chars |
|---|---:|---:|
| general-copy | 1315 | 29563 |
| unknown-action-ui | 572 | 21412 |
| javascript-explainer | 242 | 7699 |
| app-ui | 254 | 6318 |
| python-explainer | 210 | 5434 |
| sql-explainer | 108 | 2629 |
| css-explainer | 93 | 1676 |
| devops-explainer | 45 | 1296 |
| powershell-explainer | 30 | 783 |

## By V334 Marker

| marker | rows | source chars |
|---|---:|---:|
| GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7 | 64 | 1659 |
| GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5 | 59 | 1080 |
| GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6 | 61 | 822 |
| GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4 | 44 | 800 |
| GENERAL_JS_SYNTHESIS_V334_A3 | 36 | 677 |
| GENERAL_BEGINNER_SYNTHESIS_V334_A2 | 36 | 515 |

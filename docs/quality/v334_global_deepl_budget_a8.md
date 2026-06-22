# V334-A8 Global DeepL Budget

Purpose: estimate DeepL character use after including lesson cards, side cards, curriculum, resources, and PWA/UX copy.

Reference limit used: DeepL API Free 500,000 source characters per month.

## Packs

| pack | rows | source chars | % of 500k | avg chars | file |
|---|---:|---:|---:|---:|---|
| global_all_rows | 20633 | 1107454 | 221.49% | 54 | docs/quality/translation_packs/v334_a8_global_all_rows.jsonl |
| global_high_priority | 13923 | 768241 | 153.65% | 55 | docs/quality/translation_packs/v334_a8_global_high_priority.jsonl |
| global_data_rows | 17764 | 1030644 | 206.13% | 58 | docs/quality/translation_packs/v334_a8_global_data_rows.jsonl |
| global_lesson_side_rows | 17614 | 1027835 | 205.57% | 58 | - |
| global_code_rows | 2869 | 76810 | 15.36% | 27 | - |
| global_v334_marker_rows | 300 | 5553 | 1.11% | 19 | docs/quality/translation_packs/v334_a8_global_v334_marker_rows.jsonl |

## Recommendation

- If `global_all_rows` is under 500k chars, full translation is technically within the monthly free quota.
- Still apply translations by reviewed category: app UX, V334 explainer, lesson cards, side cards.
- Keep the JSONL output as translation memory and review input before patching source files.

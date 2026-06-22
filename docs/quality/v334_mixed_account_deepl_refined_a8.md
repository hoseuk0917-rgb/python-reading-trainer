# V334-A8 Refined Mixed DeepL Packs

Purpose: remove obvious code/noise fragments before spending DeepL quota.

## Result

| metric | value |
|---|---:|
| input rows | 16354 |
| input chars | 1016634 |
| refined rows | 15077 |
| refined chars | 992342 |
| removed rows | 1277 |
| removed chars | 24292 |
| my account chars | 489999 |
| wife account chars | 502343 |
| overflow chars | 0 |
| fits mixed accounts safe | YES |

## Output Files

| pack | file |
|---|---|
| refined unique candidates | docs/quality/translation_packs/mixed_account_refined/v334_a8_deepl_refined_unique_candidates.jsonl |
| my API Free refined pack | docs/quality/translation_packs/mixed_account_refined/v334_a8_deepl_my_api_free_500k_refined.jsonl |
| wife Developer refined pack | docs/quality/translation_packs/mixed_account_refined/v334_a8_deepl_wife_developer_1m_refined.jsonl |
| overflow | docs/quality/translation_packs/mixed_account_refined/v334_a8_deepl_refined_overflow.jsonl |
| removed noise review | docs/quality/translation_packs/mixed_account_refined/v334_a8_deepl_removed_noise_review.jsonl |

## Refined by Category

| category | rows | chars |
|---|---:|---:|
| lesson-card-copy | 12351 | 627381 |
| side-card-copy | 1575 | 318781 |
| unknown-action-ui | 439 | 19081 |
| javascript-explainer | 143 | 6512 |
| app-ux-copy | 186 | 5962 |
| python-explainer | 120 | 4530 |
| general-code-copy | 67 | 3128 |
| sql-explainer | 57 | 2288 |
| css-explainer | 49 | 1337 |
| resource-copy | 29 | 1303 |
| devops-explainer | 28 | 1028 |
| curriculum-copy | 20 | 519 |
| powershell-explainer | 13 | 492 |

## Removed by Category

| category | rows | chars |
|---|---:|---:|
| general-code-copy | 922 | 21385 |
| unknown-action-ui | 95 | 932 |
| javascript-explainer | 61 | 526 |
| app-ux-copy | 56 | 401 |
| python-explainer | 49 | 348 |
| sql-explainer | 43 | 305 |
| css-explainer | 33 | 265 |
| devops-explainer | 10 | 76 |
| powershell-explainer | 8 | 54 |

## Policy

- Use refined packs for actual DeepL calls.
- Keep removed noise review for audit only.
- Do not apply translations directly to source files until review/QA.

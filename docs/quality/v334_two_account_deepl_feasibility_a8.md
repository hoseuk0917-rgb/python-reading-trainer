# V334-A8 Two-Account DeepL Feasibility

Purpose: check whether the global Korean copy can fit into two DeepL API Free accounts after dedupe and non-user-facing filtering.

## Result

| metric | value |
|---|---:|
| global rows | 20633 |
| global chars | 1107454 |
| raw candidate rows | 20302 |
| raw candidate chars | 1098491 |
| unique candidate rows | 16354 |
| unique candidate chars | 1016634 |
| dedupe saved chars | 81857 |
| account 1 chars | 489999 |
| account 2 chars | 489996 |
| overflow chars | 36639 |
| fits two accounts safe 490k each | NO |
| fits two accounts hard 500k each | NO |

## Output Files

| pack | file |
|---|---|
| unique candidates | docs/quality/translation_packs/two_account/v334_a8_deepl_unique_candidates.jsonl |
| account 1 | docs/quality/translation_packs/two_account/v334_a8_deepl_account_1.jsonl |
| account 2 | docs/quality/translation_packs/two_account/v334_a8_deepl_account_2.jsonl |
| overflow | docs/quality/translation_packs/two_account/v334_a8_deepl_overflow_next_month_or_manual.jsonl |

## Policy

- Translate each unique Korean string once, then apply the result to all mapped locations after review.
- Exclude schema files, JSON parse errors, internal IDs, and obvious code/regex noise from the two-account feasibility pack.
- Keep code tokens and JSON keys unchanged.
- If overflow is zero, two DeepL Free accounts can cover the current user-facing translation memory in one month.
- If overflow remains, process overflow next month or translate it manually.

## Account 1 by Category

| category | rows | chars |
|---|---:|---:|
| lesson-card-copy | 8964 | 442982 |
| unknown-action-ui | 534 | 20013 |
| javascript-explainer | 204 | 7038 |
| app-ux-copy | 242 | 6363 |
| python-explainer | 169 | 4878 |
| sql-explainer | 100 | 2593 |
| general-code-copy | 83 | 2587 |
| css-explainer | 82 | 1602 |
| devops-explainer | 38 | 1104 |
| powershell-explainer | 21 | 546 |
| side-card-copy | 36 | 293 |

## Account 2 by Category

| category | rows | chars |
|---|---:|---:|
| side-card-copy | 1339 | 294198 |
| lesson-card-copy | 2992 | 173872 |
| general-code-copy | 906 | 21926 |

## Overflow by Category

| category | rows | chars |
|---|---:|---:|
| side-card-copy | 200 | 24290 |
| lesson-card-copy | 395 | 10527 |
| resource-copy | 29 | 1303 |
| curriculum-copy | 20 | 519 |

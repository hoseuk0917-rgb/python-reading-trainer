# V334-A8 Mixed DeepL Account Feasibility

Purpose: split unique Korean translation candidates across one 500k/month API Free account and one 1M lifetime Developer-style account.

## Result

| metric | value |
|---|---:|
| source unique rows | 16354 |
| source unique chars | 1016634 |
| my account safe limit | 490000 |
| wife account safe limit | 980000 |
| my account chars | 489999 |
| wife account chars | 526635 |
| overflow chars | 0 |
| fits mixed accounts safe | YES |

## Output Files

| pack | file |
|---|---|
| my API Free 500k pack | docs/quality/translation_packs/mixed_account/v334_a8_deepl_my_api_free_500k.jsonl |
| wife Developer 1M pack | docs/quality/translation_packs/mixed_account/v334_a8_deepl_wife_developer_1m.jsonl |
| overflow | docs/quality/translation_packs/mixed_account/v334_a8_deepl_mixed_overflow.jsonl |

## My Account by Category

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

## Wife Account by Category

| category | rows | chars |
|---|---:|---:|
| side-card-copy | 1539 | 318488 |
| lesson-card-copy | 3387 | 184399 |
| general-code-copy | 906 | 21926 |
| resource-copy | 29 | 1303 |
| curriculum-copy | 20 | 519 |

## Overflow by Category

| category | rows | chars |
|---|---:|---:|

## Policy

- Use the 500k/month API Free account first.
- Use the 1M lifetime Developer-style account for the remainder.
- Keep both API keys local only.
- Translate JSONL packs first, then review before applying translations to source files.

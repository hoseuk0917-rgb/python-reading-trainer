# V356 line-by-line beginner clarity audit

This file is the completion ledger for the manual semantic review of the Korean lesson corpus.

Completion means the card was read as a whole (`title -> concept context -> reading_goal -> code -> question -> explanation`) and judged against beginner comprehensibility. A card may be kept unchanged when already clear; reviewed does not mean rewritten.

| Level | Corpus cards | Reviewed | Status |
|---|---:|---:|---|
| 1 | 74 | 74 | complete |
| 2 | 92 | 92 | complete |
| 3 | 206 | 0 | in progress |
| 4 | 97 | 0 | pending |
| 5 | 110 | 0 | pending |
| 6 | 162 | 0 | pending |
| 7 | 176 | 0 | pending |
| 8 | 306 | 0 | pending |
| 9 | 288 | 0 | pending |
| 10 | 274 | 0 | pending |
| **Total** | **1785** | **166** | **in progress** |

## Review rules

1. A learner should not need to decode the explanation before decoding the code.
2. For execution-trace cards, explain the actual values in execution order (current value -> operation -> stored/returned value -> output).
3. Introduce the concrete behavior before a technical label when the label is new at that level.
4. Do not use generic warning boilerplate such as `특히 ~ 조심해야 한다` in place of an explanation.
5. Distinguish display (`print`), storage/assignment, return values, mutation, branch choice, iteration, indexing/key lookup, and exceptions with the concrete values from the card.
6. Do not lengthen already-clear explanations merely to satisfy a size rule.
7. Keep answer-revealing details out of pre-answer concept guidance; exact values belong in the post-answer explanation.
8. Full V356 closure requires exact-set review coverage of all 1,785 card IDs plus existing regression gates.

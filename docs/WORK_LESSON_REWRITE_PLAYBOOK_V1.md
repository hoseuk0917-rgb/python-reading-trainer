# WORK LESSON REWRITE PLAYBOOK V1

Status: ACTIVE
Authority contract: `docs/LESSON_EXPLANATION_CONTRACT_V1.md`

This playbook defines how ChatGPT Work should improve lesson explanations through GitHub without allowing the quality standard to drift.

---

## 1. Repository authority

Repository:

`hoseuk0917-rgb/python-reading-trainer`

Base branch:

`main`

Do not edit `main` directly during lesson rewriting.

For the first canary pass, use a dedicated branch such as:

`work/lesson-explanation-v1-canary`

For later batches, use one branch per bounded batch.

---

## 2. Source-of-truth order

When instructions appear to conflict, use this priority:

1. `docs/LESSON_EXPLANATION_CONTRACT_V1.md`
2. Current lesson schema and validators in the repository
3. This playbook
4. Current task prompt
5. Previously rewritten cards

Previously rewritten cards are **examples only**. They are never the authority.

---

## 3. One-card-at-a-time rule

Even when multiple cards are scheduled in one Work run, the decision unit is exactly one card.

Required loop:

```text
read contract
→ inspect one card
→ identify actual target concept
→ rewrite only that card
→ self-check against contract
→ validate
→ record result
→ move to next card
```

Do not rewrite several cards first and validate later.

Do not apply broad search-and-replace to explanation prose.

Do not mass-generate templated explanations across cards.

---

## 4. Canary phase

The first run must modify exactly **10 representative cards** and then stop.

Do not continue to the remaining corpus automatically.

The 10-card canary should represent these concept families where suitable cards exist:

1. assignment / variable binding
2. function call / `print()`
3. `input()` and string return
4. `len()` and count-vs-index confusion
5. string method such as `.strip()`
6. `if` and block/indentation behavior
7. `for` iteration
8. indexing or slicing
9. function definition / parameter
10. `return` and returned value

Selection rules:

- Prefer beginner-facing cards.
- Prefer cards whose current explanations are representative rather than unusual edge cases.
- Avoid selecting two cards that teach essentially the same concept.
- Include both simple and structurally harder examples.
- Do not select a card merely because its prose is easy to rewrite.
- Record the selected card IDs before modification.
- If a concept family does not exist in a suitable beginner card, choose the nearest distinct core Python concept and record the substitution.

---

## 5. Allowed rewrite scope

Primary editable fields:

- `concept_explanation`
- `teaching_example`
- `answer_explanation`

Preserve by default:

- card ID
- question code
- correct answer
- choices
- lesson order
- concept identity / routing
- prerequisites
- learning objective

If a separate defect is discovered in a preserved field:

1. do not silently fix it as part of prose rewriting,
2. record it in the Work report,
3. leave it unchanged unless the task explicitly expands scope.

---

## 6. Definition discipline

Every rewritten concept must contain both:

### Easy meaning

A one-line beginner-facing explanation.

### Exact definition

A one-line technically accurate Python definition using real terminology.

The easy meaning may use an analogy.
The exact definition must describe actual semantics.

Do not merge these two layers into one vague sentence.

---

## 7. Same-concept teaching example rule

A `teaching_example` must demonstrate the target concept itself.

Examples:

- `.strip()` → another actual `.strip()` call
- `len()` → another actual `len()` call
- indexing → another actual indexing operation
- `return` → another actual returned-value flow

A generic assignment, variable rename, or coincidental function call is not enough.

If no safe same-concept example can be written without introducing unlearned concepts, keep the example smaller rather than broader.

---

## 8. Drift prevention

Before every card, re-check the V1 contract.

Never reason:

> “The last few cards were shorter, so this one can be shorter too.”

Never reason:

> “This wording style has become the pattern, so I will reuse it.”

Instead ask:

> “Does this card independently satisfy V1?”

The 1st, 10th, 100th, and last card must be judged against the same contract.

If throughput pressure conflicts with explanation quality, reduce batch size. Do not reduce the standard.

---

## 9. Validation after each card

After each card edit:

1. ensure the JSON remains valid,
2. confirm the correct answer still matches the question,
3. confirm the teaching example uses the same target concept,
4. re-read the full rewritten card against the V1 checklist,
5. ensure no unrelated card changed.

If GitHub-connected Work cannot execute local validators directly, use the repository's Pull Request checks as the executable validator and do not merge while checks fail.

---

## 10. Validation after the canary batch

After exactly 10 cards:

- stop rewriting,
- review the diff card by card,
- run or trigger existing lesson validators,
- open a PR,
- report the 10 card IDs,
- summarize any blocked or ambiguous cases,
- report any separate defects discovered but intentionally not changed,
- wait for user approval before expanding to the next batch.

The canary is a quality calibration stage, not a speed test.

---

## 11. Commit / PR discipline

Preferred pattern:

- one bounded branch,
- small commits with clear intent,
- no direct push to `main`,
- no unrelated refactors,
- no schema changes unless separately approved,
- no bulk formatting changes.

For the canary, a single PR containing the 10 reviewed cards is acceptable, but the internal review must still be one card at a time.

---

## 12. Required Work report

At the end of a run, report:

```text
CONTRACT=LESSON_EXPLANATION_CONTRACT_V1
BASE_BRANCH=main
WORK_BRANCH=<branch>
CARDS_PLANNED=<n>
CARDS_COMPLETED=<n>
CARDS_BLOCKED=<n>
UNRELATED_FILES_CHANGED=<n>
VALIDATION_STATUS=<status>
PR=<number/url if created>
```

For each completed card, include:

- card ID,
- target concept,
- why the original explanation was insufficient,
- what was improved,
- whether code/answer/identity was preserved.

For blocked cards, explain the exact ambiguity instead of guessing.

---

## 13. Expansion after canary approval

Only after the user approves the canary quality:

- continue in bounded batches,
- keep one-card-at-a-time review,
- keep V1 frozen,
- keep the same acceptance checklist,
- keep PRs small enough for review,
- stop if later output becomes noticeably thinner than canary quality.

Do not jump directly from 10 cards to an unreviewed 1,785-card rewrite.

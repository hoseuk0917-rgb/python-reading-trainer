# Python Reading Trainer V340 learning-loop release evidence

Date: 2026-08-12 KST

## Release lineage

- V339 base main: `137956ab9738759fb2c3fe074fe34cc6571e7b70`
- V340 validated feature candidate: `4b37a0391965f30b78124faa1f6ac3e160bf8272`
- Integration relation before main update: ahead 23 / behind 0; merge-base exactly V339 base main.
- Main was advanced to the V340 candidate without force.

## Learning contract

- New lesson cards follow the original 1,785-card order.
- Merely browsing cards does not advance sequential progress.
- Today's learning starts at the next attempted-position boundary and keeps new-card order fixed.
- Search/filter tools remain available but are explicitly separate from sequential progress.
- Worked examples are shown after answering and prefer the semantic primary concept.
- Named clickable syntax is limited to concepts introduced by the current point in the sequence.
- Clicking highlighted syntax opens explanation-only UI.
- Wrong/unsure outcomes schedule a transformed retrieval-practice review rather than replaying the exact original question and answer.
- Correct review spacing uses 1 / 3 / 7 / 14 day intervals; failed review returns after 10 minutes.
- Every third attempt can show a short active-recall prompt.
- Progress reset clears sequential progress, V340 review schedule, today's V340 session, and active-recall attempt state while preserving learner memos.

## Regression evidence

Final zero-change workflow: `31526550427`

- R1/R2/R3/R4 apply: zero changes.
- R1/R2/R3/R4 idempotence: PASS.
- V340 learning-engine audit: PASS.
- Existing lesson validation: 1,785 lesson cards / 440 side cards PASS.
- V339 KO/EN content-quality and semantic-alignment gates: PASS.
- Desktop 1200px real Chrome smoke: PASS.
- Narrow 390px real Chrome smoke: PASS.
- Primary first-card worked example: `len()` PASS.
- Primary first-card transformed review concept: `len` PASS.
- Reset consistency and no-horizontal-overflow checks: PASS.
- Final marker: `FINAL_V340_ZERO_CHANGE_GATE=True`.
- Final state: `V340_INTEGRATION_ALREADY_CLEAN=True`.

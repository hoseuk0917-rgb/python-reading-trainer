# Python Reading Trainer — Full Lesson Concept & Source Coverage Audit R1

Date: 2026-11-06  
Authority: `docs/LESSON_EXPLANATION_CONTRACT_V1.md` (**FROZEN; unchanged**)  
Base: `main`  
Audit branch: `audit/lesson-source-coverage-r1-20261106`  
Status: **COMPLETE for structural inventory; PROVISIONAL for source coverage; NOT DONE for per-card educational verification.**

## 1. Scope and evidence

- Read all 98 Korean JSON lesson files in `data/lessons/`, and all 98 English JSON lesson files in `data_i18n/en/lessons/`.
- Counted KO **1,785** and EN **1,785** cards, each with **1,785 unique IDs**.
- KO vs EN exact ID set parity: **PASS (0 missing / 0 extra)**.
- KO vs EN `primary_concept` parity for corresponding cards: **PASS (0 differences)**.
- Three structured explanation fields (`concept_explanation`, `teaching_example`, `answer_explanation`) exist in each KO and EN card: **0 structurally missing**.
- Files that could not be read: **0**. Duplicated KO/EN IDs: **0**.
- **These checks do not verify language semantic equivalence, code/answer correctness, readability, or lesson quality.**

## 2. Observed taxonomy distribution

- **55 distinct `primary_concept` identifiers**. Top: `call` 410, `subscription` 141, `assignment` 113, `argument_passing` 104, `literal` 94, `comparison` 87, `if_statement` 87, `for_statement` 68.
- **3,448 literal `coverage_topics` strings**, of which **2,397 occur only once**. These are raw labels, *not* 3,448 verified unique learning concepts. Potential spelling, granularity, and synonym fragmentation is a review hypothesis.
- For the 410 `call` cards, a heuristic `focus_span` function-token extraction produced **281 distinct tokens**; not an AST-normalized distinct API count.
- Per-level card counts: L1 74, L2 92, L3 206, L4 97, L5 110, L6 162, L7 176, L8 306, L9 288, L10 274.
- Important distinction: syntax-level `primary_concept`, specific operation/API, and applied domain must be **separate axes**. The current broad `call` bucket alone cannot prove `len()`, `.strip()`, `json.loads()`, and third-party APIs have appropriate concept-specific teaching material.

## 3. Provisional evidence-source map (no content copied)

File: `card_source_candidate_map.json` (one record for **each of the 1,785 KO card IDs** and a linked registry of **36** source keys).

- Technical document family candidate for all **1,785**: Python Language Reference / built-in documentation. This is *broad category-level linking*, NOT passage-by-passage verification.
- **1,287** have at least one proposed PY4E educational chapter match. **498** have no match within the *initial curated PY4E set*.
- **285** were heuristically flagged as requiring further third-party/platform/domain-specific primary documentation. **110** of these also lack a matching PY4E educational chapter.
- These counts are source-search workload, **not proof** that 498 cards have no educational explanation or that 285 are factually defective.
- Every entry explicitly carries `verification_status=CANDIDATE_ONLY_NOT_EXCERPT_CHECKED`. None are reported as approved source-to-card evidence.

Confirmed source license families for content reuse planning:

- Python documentation: **PSF License v2**; notices and derivative change description as applicable: https://docs.python.org/3/license.html
- PY4E textbook: **CC BY 4.0** (author attribution, license link, indication of modifications): https://www.py4e.com/book
- The Carpentries programming lesson: **CC BY 4.0 for instructional material**, **MIT for example software unless otherwise stated**: https://swcarpentry.github.io/python-novice-inflammation/instructor/LICENSE.html

**No external explanation, exercise, or code has been copied into production lesson cards.** A domain's technical documentation is not assumed to have a reuse license merely because its URL is accessible.

## 4. Gap findings and expansion proposals

### A. Highest priority — improve mapping specificity, not card count

1. Normalize raw topic aliases into a controlled `specific_concept` / `domain_topic` crosswalk (proposal only; no production schema change).
2. Disambiguate `call` and `subscription` by *actual target operation*, using `focus_span`, code semantics and question intent, rather than generic `primary_concept` alone.
3. Add the precise source page/section, extracted factual claim, licensed quotation/adaptation status, and independent check to each card's evidence ledger.
4. For the 498 PY4E-unmatched items, use appropriate licensed manuals or primary docs; do not force PY4E citations onto unrelated advanced topics.

### B. Concept candidates needing pedagogical coverage review

Observed as `primary_concept` frequencies, not total appearances anywhere in example code:

| Concept | Count | Review decision |
|---|---:|---|
| `while_statement` | 6 | Consider more beginner-to-intermediate trace exercises; distinguish termination and variable updates |
| `type_annotation` | 2 | Strong candidate for practical-code-reading bridge |
| `yield_expression` | 2 | Candidate for iterator/generator concepts after prerequisites |
| `match_statement` | 2 | Optional modern-Python branch reading module; current examples are higher level |
| `async_function_definition` | 1 | Review async/await prerequisites; `await_expression` already has 16 cards |
| `nonlocal_statement` | 0 | Check relevance and prerequisites before introducing |
| `del_statement` | 0 | Candidate only; no evidence this should precede basic topics |
| `named_expression` (walrus) | 0 | Advanced optional; defer unless real-code demand supports it |

A **0 primary-concept count** is *not proof of zero mentions* in unrelated code. Actual necessity, prerequisite sequencing and overlap with existing cards still require human review.

### C. Curriculum balance

The L8–L10 levels have **868 cards** in total (306+288+274), while L1–L2 have **166**. This describes distribution, not a demonstrated learner deficiency. Compare difficulty, redundancy and prerequisite readiness before adding beginner cards.

### D. Other audit risks

- Korean-English ID/primary parity does **not** establish semantic parity of teaching and explanation prose.
- `concept_explanation`/example/answer fields being present does **not** mean Contract V1 quality is satisfied.
- The PY4E chapter candidate rules are heuristic, sometimes overly broad for applied examples.
- A technical documentation URL is not equivalent to a verified source passage supporting the card's precise claim.

## 5. Action gate before explanation rewriting

1. Human-review the concept taxonomy and source candidate rules, particularly `call` and `subscription`.
2. Prioritize accurate pinpoint sources for **498** educational-unmatched items and **285** domain-source flagged items, tracking overlap.
3. Select high-value beginner and high-risk advanced samples and verify exact source sections, semantic correctness, license and attribution requirements.
4. Evaluate expansion candidates against actual learner outcomes. Add or split topics **only after gap evidence**, without changing FROZEN V1.
5. Only then resume rewriting at one card per decision unit, with KO/EN meaning parity and existing validation checks.

## 6. Inventory and validation artifacts

- `inventory_ko_01.json` … `inventory_ko_07.json`: full 1,785-card Korean structural inventory.
- `inventory_en_01.json` … `inventory_en_07.json`: full 1,785-card English structural inventory and per-segment ID deltas.
- `card_source_candidate_map.json`: per-card source candidate ledger and registry.
- This report. All files live under `reports/lesson_source_coverage_r1/` on the dedicated audit branch.

No lesson content, runtime, test scripts, schema, or FROZEN contract were changed. No merge was performed.

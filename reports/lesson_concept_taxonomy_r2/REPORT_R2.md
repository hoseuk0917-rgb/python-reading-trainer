# Python Reading Trainer — R2 Full Concept Taxonomy & Gap Audit

**Date:** 2026-11-06  
**State:** Structural mapping COMPLETE, semantic/educational decisions PENDING  
**Authority:** `docs/LESSON_EXPLANATION_CONTRACT_V1.md` — **FROZEN, unchanged**  
**Base:** R1 audit branch `audit/lesson-source-coverage-r1-20261106` (Draft PR #27)  
**R2 branch:** `audit/lesson-concept-taxonomy-r2-20261106`

## 1. Reproducible inputs and safeguards

- Re-read **98 Korean source lesson JSON files** from `main` and persisted per-file blob SHAs plus actual card `code`, `focus_span`, `question`, `answer`, and `teaching_example.code`.
- All **1,785** cards were captured, with **0 file-read errors**. Mapping IDs **1,785 / 1,785** unique, and all mapped original `primary_concept` values matched the original evidence.
- R1 already verified that the 98 English files have the same 1,785 IDs and matching `primary_concept` IDs. R2 **did not** assert English explanation semantic parity.
- No lesson card, answer, order, validator, schema, frozen contract, or runtime code was changed.

### Automated model

A non-mutating crosswalk was derived from real code + `focus_span`, not topic labels alone:

1. **Syntax family:** categorical grouping of existing `primary_concept` IDs, preserving those IDs unchanged.
2. **Specific operation candidate:** e.g. `call:len`, `call:.strip`, `call:json.loads`, `subscription:numeric_index`, `assignment:subscript_target`.
3. **Domain hint:** approximate file-name grouping, **not a verified semantic domain**.
4. **Confidence and reason codes:** parser/ambiguity review queue; no automatic authority to change cards.

**The classifier uses deterministic textual patterns, NOT a Python AST.** A candidate operation is a working analytical label, not a formally validated independent learning concept.

## 2. R2 totals

| Measure | Observed |
|---|---:|
| Cards mapped | **1,785** |
| Distinct existing `primary_concept` IDs | **55** |
| Syntax families | **13** |
| Distinct specific-operation **candidates** | **359** |
| Automatically high-confidence matches | **529** |
| Medium-confidence candidates | **1,242** |
| Parser/structure review required | **14** |
| Raw topic labels | **3,448** |
| Provisional normalized label keys | **3,131** |
| Potential topic-alias groups | **308** |

**Important:** 308 candidate alias groups must NOT be automatically merged. The observed `Path` / `path` / `PATH` collision is a case-sensitivity hazard.

### Syntax family distribution

| Family | Cards | PY4E candidate missing (R1) |
|---|---:|---:|
| Function semantics | 602 | 163 |
| Operators/expressions | 306 | 32 |
| Data access | 208 | 82 |
| Control flow | 189 | 3 |
| Values/names | 128 | 12 |
| Assignment/binding | 113 | 43 |
| Exception flow | 98 | 77 |
| Data construction/comprehension | 67 | 25 |
| Classes/type-related | 27 | 25 |
| Imports | 17 | 14 |
| Asynchronous execution | 17 | 15 |
| Resource/context managers | 12 | 6 |
| Namespace scope | 1 | 1 |

These unmatched figures mean **no candidate from the first curated PY4E chapter rules**, not absence of published learning material, not a defective card, and not permission to reuse text.

## 3. Concrete follow-up findings

**A. Granularity:** `call` currently covers **410 cards**. Automated specificity helps identify different functions and methods, but **278** potential receiver/call ownership cases remain unverified. For `subscription`, **20** card receivers lacked an unambiguous locally inferred value type. Distinguish syntax vs specific operation vs domain before deciding on new card IDs.

**B. Direct parser review queue:** **14** cards require examination of the full question and focus; this is not a confirmed count of incorrect cards. Examples:

- `PY12_L06_winget_install_001`: focus `parts`, `primary_concept=call`, question about `subprocess.list2cmdline(parts)`.
- `PY12_L08_fastapi_cors_001`: focus `app.add_middleware` versus a method call in the code.
- `PY9_REVIEW_AI_API_005`: focus only `["content"]`, which needs its surrounding dictionary/index context.
- `PY103_L08_chmod_executable_001`: `|=` bitwise augmented assignment not covered by the first simplistic operator parser.

These highlight parser limitations and possible intent/focus alignment questions; neither outcome is assumed without human examination.

**C. Target-concept example lexical probe:** For **107** cards with a clearly recognized common function/method (e.g., `print`, `len`, `.strip`, `json.loads`), the same target token appeared in `teaching_example.code` in **107/107** cases. This lexical check does **not** establish that the teaching example is conceptually good or that all 1,785 cards pass V1.

**D. Exact reused code:** **14** code-text groups cover **32** cards. A repeated example may be legitimate if cards ask different questions; do not delete or merge without target-concept review.

**E. Legacy curriculum vs actual levels:** Relative to `data/curriculum/curriculum_v1.json` nominal levels, earliest observed `if`, `for`, `while`, `def`, `return`, `with`, `import`, and `try` primary-target cards appear at earlier levels in the current corpus. This is an **authority/version drift hypothesis**, NOT a proven learning-order failure. Confirm whether that original level map is still normative before altering prerequisites.

## 4. Concept expansion decisions: proposals, not approved mutations

| Topic | Evidence | Proposal |
|---|---|---|
| Actual function/method meaning | 410 `call` primary cards, mixed APIs | **Priority 0: split into concept/source mapping**, not automatic new lessons |
| Type annotations | 2 primary-target cards; 14 source-code appearances by lexical probe | **Priority 1: assess explanation/prerequisite coverage**, likely useful for reading real Python |
| Async function definition | 1 primary-target; 16 `await_expression` primary cards; 21 code appearances of `async def` | **Priority 1: check async def → coroutine → await learning bridge** |
| Exception flow | 98 cards; 77 lacking PY4E candidate source | **Priority 1 for R3 source discovery**, not necessarily new cards |
| Class/type semantics | 27 cards; 25 lacking PY4E candidate source | **Priority 1 for R3 source discovery**, then determine teaching gaps |
| `while` loop behavior | 6 primary-target, 12 code appearances | **Priority 2: verify finite-loop and update/termination coverage**, expand only on evidence |
| `yield` / generators | 2 `yield_expression` primary-target | **Priority 2: optional advanced concept bridge** |
| `match` | 2 primary-target | **Priority 3: optional modern syntax module** |
| `nonlocal`, `del`, `:=` | Zero observed statement occurrences in source code probe | **Defer** unless scope/real-code use cases justify new lessons |

**Rule:** A low primary-card count or zero lexical occurrence is NOT, alone, evidence that a learner needs additional cards. Check whether another card already provides the relevant explanation, prerequisite, contrast case, and transfer exercise.

## 5. R3 action gates and acceptance criteria

1. **Human adjudication:** resolve 14 structural exception cases; do not mutate originals based on classifier output.
2. **Terminology:** evaluate 308 topic alias proposals, especially case-sensitive identifiers and API names; keep a confirmed alias dictionary separate from existing tags.
3. **Evidence retrieval:** focus first on class/type, async, exception, imports and domain-specific cards; add precise official section and reuse-right evidence, not generic homepage citations.
4. **Curriculum:** reconcile `curriculum_v1.json` with present lesson levels, supported by dated upstream decisions.
5. **Expansion:** decide `EXISTING_SUFFICIENT`, `EXPLANATION_ENHANCEMENT`, `PREREQUISITE_BRIDGE`, or `NEW_CONCEPT_NEEDED` with at least one actual card and source example supporting each decision.
6. **Before rewrite:** perform independent Python execution/answer checks and full FROZEN V1 review for affected cards. None was claimed in R2.

## 6. Files added by R2

All under `reports/lesson_concept_taxonomy_r2/`:

- `original_evidence_ko_01.json` … `07.json` — original code/questions/exercises per card and source blob SHAs.
- `card_taxonomy_candidates.json` — full 1,785-card syntax/operation/domain candidate crosswalk with confidence and review reasons.
- `topic_alias_candidates.json` — raw topic vocabulary and proposed, unapproved aliases.
- `review_queue_and_gap_probes.json` — 14 parser review cases, lexical same-target exercise probe, exact-code reuse groups, and coverage probes.
- `concept_coverage_matrix.json` — per-family/operation/level/domain counts joined to R1 provisional sources.
- `REPORT_R2.md` — this report.

**Validation completed:** file counts, unique IDs, source primary-concept parity, crosswalk JSON parse, R1 source-map joins, non-destructive diff scope. **Not claimed:** AST validation, execution tests, explanatory quality PASS, license compliance for copied passages (none copied), and human signoff.

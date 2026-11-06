# R2.1 I1 — Full Card × Four-Item Source Candidate Join

Date: 2026-11-06  
State: **I1 STRUCTURAL IMPLEMENTATION COMPLETE; V1 INDEPENDENT VALIDATION PENDING; R3 SOURCE PASSAGE VERIFICATION NOT STARTED**

## Scope and input authority

- 1,785 distinct KO card IDs, each with four separate source-evidence slots: `TECH_DEFINITION`, `TECH_EXPLANATION`, `EXAMPLE`, `EASY_EXPLANATION` (**7,140 records**).
- Uses R1 Draft PR #27 `card_source_candidate_map.json` unchanged (36 source keys and per-card reference candidates).
- Uses R2 Draft PR #28 `card_taxonomy_candidates.json` unchanged, including all 1,785 automated classification candidates (not human-approved), plus 7 KO original-evidence input segments.
- For each of 98 live `data/lessons/*.json` original files, fetched the file on `main`, checked its Git blob SHA against the frozen R2 source-file manifest, and preserved the raw `side_card_ids` for each card.
- Additional topic-only resource hints were searched against the existing files `data/resources/python_external_resource_cards_v97_a2.json` and `data/resources/ai_tool_learning_resource_cards_v98_a1.json`. A hint is **NOT** a direct link, evidence, or recommendation.
- `docs/LESSON_EXPLANATION_CONTRACT_V1.md` is **FROZEN**. No existing lesson/answer/side-card/schema/runtime/contract was modified.

## Output artifacts

Seven checkpoints: `slot_map_ko_01.json` ... `slot_map_ko_07.json`, containing respectively **262, 259, 232, 379, 234, 214, 205** cards. All stored under `reports/lesson_evidence_slots_r2_1/`.

Every card record includes source file/blob SHA, raw primary concept, R2 syntax family and specific-operation candidate, confidence/review reasons, original `focus_span`, existing `side_card_ids`, tentative external-resource hints, R1 domain-source-needed flag, and four independent slot objects.

Each slot preserves R1 candidate source keys, status, and placeholders for later exact section, supported claim, and license review. **No passage-level approval has been claimed.**

## I1 whole-corpus self-check — structural only

| Measure | Result |
|---|---:|
| Original KO source files read / expected | 98 / 98 |
| Source SHA or read errors | 0 |
| Card records / expected | 1,785 / 1,785 |
| Unique card IDs | 1,785 |
| R1 missing IDs | 0 |
| R2 missing IDs | 0 |
| Extra or duplicate card IDs | 0 |
| Mandatory slot records / expected | 7,140 / 7,140 |
| Missing mandatory slot fields | 0 |
| Cards with at least one existing side-card reference | 1,447 |
| Cards with topic-only resource catalogue hints | 88 |
| R1 domain-source-needed flags preserved | 285 |

### Four-item candidate-only source status

| Slot | BROAD_ONLY | MISSING in R1 candidate set | PINPOINT_VERIFIED |
|---|---:|---:|---:|
| TECH_DEFINITION | 1,785 | 0 | 0 |
| TECH_EXPLANATION | 1,785 | 0 | 0 |
| EXAMPLE | 1,287 | 498 | 0 |
| EASY_EXPLANATION | 1,287 | 498 | 0 |

The 498 records for EXAMPLE and EASY_EXPLANATION are **not confirmed pedagogical gaps**. They merely lack a matching entry from R1's curated PY4E educational chapter candidates; other existing side-card/resource content or other sources may apply. An R1 source-key candidate is a broad link (e.g. reference page/educational chapter), **not a precise passage or item-level support claim**.

`TECH_DEFINITION` and `TECH_EXPLANATION` each receive R1 technical reference categories and thus are wholly BROAD_ONLY. This is **not evidence that 1,785 definitions or explanations are correct**.

## Gates / NEXT

1. **V1 independent check, separate from this implementation:** re-read all seven output chunks and R1/R2, independently check 1,785 IDs, four slots, source key sets, original `side_card_ids`, 98 manifest SHAs and source preservation. Resolve referenced side-card IDs against the existing side-card registry (not done by I1); report broken/ambiguous IDs. Check the 88 topic-only hints are not incorrectly treated as verified. Do not merge before review.
2. **R3 pinpoint source investigation, separate design/implementation/validation:** for each card × slot, inspect exact original source document section and claim, distinguish sufficient vs too broad/mismatch, verify license and example execution. Search for *missing slot-specific evidence*, not indiscriminate new sources.
3. **R4/R5:** evaluate actual learning gaps, prerequisites and curriculum only after grounded evidence.
4. **R6:** rewrite KO/EN explanations under frozen V1. Existing markdown V1 contract/playbook are Work quality instructions, **not** a new per-card Markdown-file storage format.

## PR relationship

This branch is based on R2 Draft PR #28 head, which is itself stacked on R1 Draft PR #27. Do not merge out of order or retarget without confirming the ancestor/base diff. Report-only changes; all source production files unchanged.

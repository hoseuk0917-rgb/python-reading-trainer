# V1 Independent Structural & Reference Validation — Python Reading Trainer R2.1

Date: 2026-11-06  
Validation state: **PASS_STRUCTURAL_AND_REFERENCE_ONLY**  
Scope: all **1,785** KO lesson IDs, all **1,785** EN lesson IDs; **7,140** analytical candidate slots.  
Production baseline pinned: `4f9a626b386c71ea6801d4ed9a1e16b62e217531`.  
I1 Draft PR #30 is not modified; this is an independent report-only validation branch.

## 1. Independent results

| Predicate | Observed | Gate |
|---|---:|---|
| R1/R2/PR #30 mapped ID coverage | 1785/1,785 | PASS |
| 4-item candidate slot records | 7140/7,140 | PASS |
| R1 source-key sets, R2 classifications, SHA provenance | 0 mismatches | PASS |
| KO original JSON source files fetched | 98/98 | PASS |
| KO source card IDs and original-side/coding fields checked | 1785/1,785, 0 errors | PASS |
| EN original JSON source files fetched | 98/98 | PASS |
| EN IDs, primary concept, level and 3 explanation field structures | 1785/1,785, 0 errors | PASS |
| EN-vs-KO side-card references | 0 differing cards | PASS |
| EN-vs-KO focus_span | 0 differing cards | PASS |
| Registered side-card files | 51 | PASS |
| Registered unique side-card IDs | 456, 0 duplicate | PASS |
| Referenced side-card links (KO) | 1882, 0 broken | PASS |
| Unreferenced side-card IDs | 79 | REVIEW; not an error |
| External resource entries in two existing catalogues | 27 | metadata only |
| Candidate resource hints (not direct citations) | 247 links across 88 cards | PASS (LEXICAL ONLY) |

### Slot-level candidates (not verified evidence)

| Required source-evidence slot | BROAD_ONLY | MISSING in R1 candidate subset | PINPOINT_VERIFIED |
|---|---:|---:|---:|
| TECH_DEFINITION | 1,785 | 0 | 0 |
| TECH_EXPLANATION | 1,785 | 0 | 0 |
| EXAMPLE | 1,287 | 498 | 0 |
| EASY_EXPLANATION | 1,287 | 498 | 0 |

**Critical limitation:** the status MISSING means only that no matching source candidate was present in R1's **curated PY4E educational chapter mapping**, not that other existing teaching resources or external documents have been checked and found empty. Neither BROAD_ONLY nor MISSING is a measured failure of a card's present explanation.

## 2. Validation receipts

- `V1A_CROSSWALK.json`: independent R1/R2 IDs, provenance, source keys, source file blob SHA and slot-state checks for 1,785 card records.
- `side_registry_01.json` ... `04.json`: all 51 side-card JSON files read directly at pinned original revision, parsed and checked for duplicate IDs.
- `V1B_SIDE_RESOLUTION.json`: all 1882 original side references resolved against all 456 IDs; 79 unreferenced candidates preserved, **not deleted**.
- `original_ko_check_01.json` ... `07.json`: independently re-read all 98 original KO source files, compare original primary/level/focus/side IDs and source code, question, answer and teaching_example code against I1 and R2 source data.
- `original_en_check_01.json` ... `07.json`: independently re-read all 98 English source files, check ID/primary/level/concepts/required structured explanation fields and compare side IDs/focus with KO mapping. **Did not perform KO–EN prose semantic parity**.
- `V1B_RESOURCE_HINTS.json`: re-evaluate topic-only candidate matches against existing 27 resource metadata records. All links explicitly remain `RELATED_TOPIC_ONLY_NOT_VERIFIED`.

## 3. NOT validated; R3/R4/R6 gates remain

- Exact source page/anchor and technical claim support for any of the 7,140 items.
- External content license/permissions, quotation/adaptation rights or the factual validity of side-card/external resource content.
- Whether cited technical documents are sufficiently specific rather than broad reference categories.
- Python example execution, output/answer correctness, lesson pedagogical adequacy, prerequisite sufficiency, whether beginner-friendly easy explanation actually works, and KO–EN semantic equivalence.
- The 14 R2 parser exceptions and 278 potential call ownership/20 subscription-type ambiguities remain candidate review items, not corrected by a structural source join.
- The 79 unused registered side IDs may provide useful content; do not delete or infer educational insufficiency from lack of a direct lesson ID reference.

## 4. Next independent phase: R3 slot-specific evidence

Design → fetch/compare precise original source passages → verify reuse rights → mark each card's four slots individually → seek additional source only for BROAD_ONLY / absent / mismatched slots. Preserve all 1,785 IDs and their KO+EN pairs. A source candidate or same-chapter match cannot be promoted to `PINPOINT_VERIFIED` without source location and actual claim comparison.

No original learning card, side-card, external resource, runtime, validator, frozen Markdown V1 explanation contract, or prior audit PR has been modified. Do not merge this stacked validation PR until user review and merge-order consideration.

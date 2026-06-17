# Handoff — python-reading-trainer after V320

QUALITY_RECOVERY_DOCS_HANDOFF_V321_A1

## Repository

- Local path: `D:\projects\python-reading-trainer`
- GitHub repo: `hoseuk0917-rgb/python-reading-trainer`
- Current completed app version before this docs pass: `20260611_v320_a1`
- Docs pass target app version: `20260611_v321_a1`

## Last completed functional/quality state

- HEAD before docs pass: `c22696f`
- Tag before docs pass: `quality-v320-low-explanation-final-reaudit-a1-20260611`
- Working tree at V320: clean
- Origin/main: pushed
- Validation: `VALIDATION OK`

## Counts

- `LESSON_FILES 98`
- `SIDE_FILES 50`
- `LESSON_CARDS 1785`
- `SIDE_CARDS 440`

## Closed quality track

The V307 explanation/answer alignment track is closed.

### MEDIUM

- V307 found `MEDIUM_CANDIDATES 632`.
- V309/V310 processed 40.
- V311/V312 processed 40.
- V313 processed 80.
- V314 processed 120.
- V315 processed 160.
- V316 processed 192.
- Total: `632`.
- V317 final reaudit passed:
  - covered 632
  - missing 0
  - duplicate 0
  - answer-expression failures 0
  - structural issues 0

### LOW

- V307 found `LOW_CANDIDATES 219`.
- V318 classified:
  - `NO_ACTION 206`
  - `REVIEW_AND_PATCH 11`
  - `REVIEW_ONLY 2`
- V319 patched the 11 `REVIEW_AND_PATCH` rows.
- V320 final reaudit passed:
  - `OK_ALREADY_EXPLICIT 206`
  - `OK_PATCHED 11`
  - `KEPT_REVIEW_ONLY 2`
  - final failures 0
  - structural issues 0

## Key reports

- `reports/explanation_answer_choice_alignment_candidates_v307.tsv`
- `reports/explanation_medium_final_reaudit_v317.md`
- `reports/explanation_medium_final_coverage_v317.tsv`
- `reports/explanation_low_candidate_reaudit_v318.md`
- `reports/explanation_low_candidate_reaudit_v318.tsv`
- `reports/explanation_low_patch_audit_v319.md`
- `reports/explanation_low_patch_changes_v319.tsv`
- `reports/explanation_low_final_reaudit_v320.md`
- `reports/explanation_low_final_reaudit_v320.tsv`

## Do not redo

Do not reopen the V307 MEDIUM batch work unless a new audit finds a new issue. The old V307 MEDIUM and LOW candidates have already been closed by later evidence.

## Recommended next session

1. Pull latest if another environment was used.
2. Confirm app version and status.
3. Optionally run live GitHub Pages smoke.
4. Start a new quality track: side-card repeated phrase cleanup.

## Quick verification commands

- `Set-Location "D:\projects\python-reading-trainer"`
- `git status --short`
- `git --no-pager log --oneline -8`
- `python "tools\validate_lessons.py" --expected-app-version 20260611_v321_a1 --expected-lesson-cards 1785`

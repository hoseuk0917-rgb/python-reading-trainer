# Python Reading Trainer V343 Release Evidence

- Release date: 2026-08-12
- Validated feature SHA: `76b828a1e939f8db2b989d3dc7ef295984ff15f9`
- Feature branch: `feat/home-and-corpus-review-v343`
- Base main SHA: `e5935990b7f2789fa2e366434582ba379b709b76`
- Integration: pure fast-forward (`ahead=25`, `behind=0`, merge-base = base main)

## Learning home

- Learn view opens as a learning home rather than exposing card 1 regardless of progress.
- With cards 1-2 completed, the home correctly presents card `3 / 1785` as the next sequential lesson.
- `3번부터 이어서 학습` opens card 3.
- Clicking the Learn tab from another view returns to the learning home.
- Intentional browsing/searching can still display an earlier card without rewriting sequential progress.
- Desktop and narrow Chrome smoke both pass.
- Horizontal overflow: desktop `1154/1154`, narrow `454/454`.

## Corpus contextual review

- KO lesson cards scanned: 1,785.
- EN lesson cards scanned: 1,785.
- Total contextual scan: 3,570 cards.
- Final review candidates: 0.
- Final repeated explanation sentence groups: 0.
- Final contextual repair stages R2-R5 are idempotent (`0` changes on final rerun).
- Canonical lesson validation remains authoritative for structural correctness and passes.

## Regression gates

- V339 content quality and semantic side-card alignment: PASS.
- V340 sequential learning/review/example regression: PASS.
- V341 practice/mastery/development-reference/side-card educational quality: PASS.
- V342 checkpoint/mastery/future-syntax hardening: PASS.
- V343 desktop/narrow real-browser home smoke: PASS.
- Final workflow reports `V343_ALREADY_CLEAN=True`.

This commit adds release evidence only; product/runtime data was already validated at the feature SHA above.

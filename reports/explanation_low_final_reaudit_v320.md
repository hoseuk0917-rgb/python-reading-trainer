# V320 explanation LOW 최종 재감사 리포트

EXPLANATION_LOW_FINAL_REAUDIT_V320_A1

- 앱 버전: 20260611_v320_a1
- 총평: PASS
- V318 LOW 전체 후보: 219
- V319 보강 행 수: 11
- 최종 실패 후보: 0
- 구조 이슈: 0
- 최종 TSV: `reports/explanation_low_final_reaudit_v320.tsv`

## 1. V318 action 분포

- NO_ACTION: 206
- REVIEW_AND_PATCH: 11
- REVIEW_ONLY: 2

## 2. V320 final_status 분포

- KEPT_REVIEW_ONLY: 2
- OK_ALREADY_EXPLICIT: 206
- OK_PATCHED: 11

## 3. 최종 실패 후보

- 후보 없음

## 4. REVIEW_ONLY 보존 후보

| file | idx | title | answer | action | final_status | reason |
|---|---:|---|---|---|---|---|
| `data/lessons/python_foundation_beginner_v94_a1_part1.json` | 24 | 리스트를 변수에 저장하기 | `['A', 'B']가 출력된다` | REVIEW_ONLY | KEPT_REVIEW_ONLY | LOW 후보 중 의미상 설명 가능성이 있어 자동 수정 제외, 수동 샘플 검토용으로 보존 |
| `data/lessons/python_foundation_level2_v94_a2_part2.json` | 5 | 반복 중 값 변환 append | `[2, 3, 4]가 된다` | REVIEW_ONLY | KEPT_REVIEW_ONLY | LOW 후보 중 의미상 설명 가능성이 있어 자동 수정 제외, 수동 샘플 검토용으로 보존 |

## 5. 판정

- V307 MEDIUM 632개는 V317에서 최종 PASS로 마감했다.
- V307 LOW 219개는 V318에서 선별했고, 즉시 보강이 필요한 11개는 V319에서 보강했다.
- LOW의 REVIEW_ONLY 2개는 자동 패치 대상이 아니라 수동 샘플 검토용으로 보존한다.
- 현재 lesson 구조 검증은 `validate_lessons.py` 기준 PASS다.

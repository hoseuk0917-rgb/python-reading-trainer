# V317 explanation MEDIUM 최종 재감사 리포트

EXPLANATION_MEDIUM_FINAL_REAUDIT_V317_A1

- 앱 버전: 20260611_v317_a1
- 총평: PASS
- V307 MEDIUM 원본 후보: 632
- 처리팩 고유 커버리지: 632
- 누락 후보: 0
- 중복 처리 후보: 0
- 원본 MEDIUM 외 추가 후보: 0
- 현재 JSON 정답 표현 미확인: 0
- 현재 JSON 구조 이슈: 0
- 커버리지 TSV: `reports/explanation_medium_final_coverage_v317.tsv`

## 1. 처리팩별 행 수

- explanation_medium_review_pack_v309.tsv: 40
- explanation_medium_review_pack_v311.tsv: 40
- explanation_medium_review_pack_v313.tsv: 80
- explanation_medium_review_pack_v314.tsv: 120
- explanation_medium_review_pack_v315.tsv: 160
- explanation_medium_review_pack_v316.tsv: 192

## 2. 판정

- V309/V310, V311/V312, V313, V314, V315, V316으로 V307 MEDIUM 후보 632개를 전부 커버했다.
- 현재 JSON 기준으로 각 후보의 explanation에 정답 표현이 직접 확인된다.
- lesson/card 수와 필수 필드는 별도 `validate_lessons.py`로 확인한다.

## 3. 누락/실패 후보

- 후보 없음

## 4. 구조 이슈

- 후보 없음

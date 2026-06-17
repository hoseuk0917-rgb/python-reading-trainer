# V318 explanation LOW 후보 재감사/선별 리포트

EXPLANATION_LOW_CANDIDATE_REAUDIT_V318_A1

- 앱 버전: 20260611_v318_a1
- 총평: PASS
- V307 LOW 원본 후보: 219
- 재감사 행 수: 219
- 현재 JSON 카드 누락: 0
- 현재 JSON 구조 이슈: 0
- 즉시 보강 후보(REVIEW_AND_PATCH): 11
- 샘플 검토 후보(REVIEW_ONLY): 2
- 조치 불필요(NO_ACTION): 206
- 상세 TSV: `reports/explanation_low_candidate_reaudit_v318.tsv`

## 1. status 분포

- LOW_PRIORITY_PARAPHRASE_REVIEW: 2
- OK_ALREADY_EXPLICIT: 206
- POTENTIAL_MISSED_SHORT_RESULT: 11

## 2. action 분포

- NO_ACTION: 206
- REVIEW_AND_PATCH: 11
- REVIEW_ONLY: 2

## 3. 즉시 보강 후보

| file | idx | title | answer | status | action | reason |
|---|---:|---|---|---|---|---|
| `data/lessons/python_foundation_beginner_v94_a1_part1.json` | 4 | 두 줄 출력 순서 읽기 | `A 다음 B` | POTENTIAL_MISSED_SHORT_RESULT | REVIEW_AND_PATCH | 짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음 |
| `data/lessons/python_foundation_beginner_v94_a1_part1.json` | 17 | 숫자 변수 계산하기 | `4가 출력된다` | POTENTIAL_MISSED_SHORT_RESULT | REVIEW_AND_PATCH | 짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음 |
| `data/lessons/python_foundation_level2_v94_a2_part1.json` | 7 | 값 있는 문자열 조건 | `있음` | POTENTIAL_MISSED_SHORT_RESULT | REVIEW_AND_PATCH | 짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음 |
| `data/lessons/python_foundation_level2_v94_a2_part1.json` | 24 | 빈 리스트 조건 | `없음` | POTENTIAL_MISSED_SHORT_RESULT | REVIEW_AND_PATCH | 짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음 |
| `data/lessons/python_foundation_level2_v94_a2_part1.json` | 25 | 값 있는 리스트 조건 | `있음` | POTENTIAL_MISSED_SHORT_RESULT | REVIEW_AND_PATCH | 짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음 |
| `data/lessons/python_foundation_level2_v94_a2_part2.json` | 1 | 리스트 반복 출력 | `A 다음 B` | POTENTIAL_MISSED_SHORT_RESULT | REVIEW_AND_PATCH | 짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음 |
| `data/lessons/python_foundation_level2_v94_a2_part2.json` | 8 | 반복 후 바깥 출력 | `A, B, end` | POTENTIAL_MISSED_SHORT_RESULT | REVIEW_AND_PATCH | 짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음 |
| `data/lessons/python_foundation_level2_v94_a2_part2.json` | 10 | 조건과 반복 결합 | `[3, 4]만 남는다` | POTENTIAL_MISSED_SHORT_RESULT | REVIEW_AND_PATCH | 짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음 |
| `data/lessons/python_foundation_level2_v94_a2_part2.json` | 16 | 반복 중 continue | `[1, 3]` | POTENTIAL_MISSED_SHORT_RESULT | REVIEW_AND_PATCH | 짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음 |
| `data/lessons/python_foundation_level2_v94_a2_part2.json` | 25 | lower 후 비교 | `True` | POTENTIAL_MISSED_SHORT_RESULT | REVIEW_AND_PATCH | 짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음 |
| `data/lessons/python_foundation_level2_v94_a2_part2.json` | 31 | 문자열 길이와 split 개수 | `3 다음 2` | POTENTIAL_MISSED_SHORT_RESULT | REVIEW_AND_PATCH | 짧은 출력/결과 정답인데 현재 explanation에 정답 표현이 직접 보이지 않음 |

## 4. 샘플 검토 후보

| file | idx | title | answer | status | action | reason |
|---|---:|---|---|---|---|---|
| `data/lessons/python_foundation_beginner_v94_a1_part1.json` | 24 | 리스트를 변수에 저장하기 | `['A', 'B']가 출력된다` | LOW_PRIORITY_PARAPHRASE_REVIEW | REVIEW_ONLY | LOW 후보이며 의미상 연결 여부만 샘플 확인 권장 |
| `data/lessons/python_foundation_level2_v94_a2_part2.json` | 5 | 반복 중 값 변환 append | `[2, 3, 4]가 된다` | LOW_PRIORITY_PARAPHRASE_REVIEW | REVIEW_ONLY | LOW 후보이며 의미상 연결 여부만 샘플 확인 권장 |

## 5. 구조 이슈

- 후보 없음

## 6. 판정

- LOW 후보는 V307 기준 낮은 우선순위 후보이므로, 이번 V318에서는 lesson JSON을 직접 수정하지 않는다.
- `REVIEW_AND_PATCH`가 0이면 LOW 후보는 리포트만 남기고 마감 가능하다.
- `REVIEW_AND_PATCH`가 있으면 V319에서 해당 후보만 소량 보강한다.
- `REVIEW_ONLY`는 정확 문자열이 없더라도 의미상 설명으로 충분할 수 있으므로 전체 자동 보강 대상에서 제외한다.

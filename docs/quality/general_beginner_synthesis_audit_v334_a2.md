# V334-A2 General Beginner Synthesis Audit

Purpose: verify that a non-preloaded Python list/dict filter example gets a real synthesis explanation.

## Summary

| metric | value |
|---|---:|
| checks | 8 |
| failed | 0 |
| steps | 6 |
| unknown actions | 0 |
| unsupported items | 0 |

## Checks

- OK summary_not_generic
- OK mentions_students
- OK mentions_passed
- OK mentions_score_condition
- OK mentions_expected_output
- OK mentions_selected_names
- OK no_data_literal_unsupported
- OK no_generic_unsupported_action

## Output

요약: students 목록에서 score가 80 이상인지 확인하고, 조건을 만족하는 항목의 name 값을 passed에 모아 출력합니다. 출력 결과는 ['Min', 'Sol']입니다.

단계:
1. students에 데이터 목록 저장
   - students에는 여러 항목이 들어 있습니다. 각 항목은 score 같은 값을 가진 데이터 묶음입니다.
2. passed를 빈 리스트로 준비
   - 조건을 통과한 name 값을 나중에 담기 위해 빈 리스트를 만듭니다.
3. students를 하나씩 확인
   - student 변수에 목록의 항목이 하나씩 들어오고, 아래 들여쓰기 블록이 반복 실행됩니다.
4. score 조건 검사
   - student["score"] 값으로 score가 80 이상인지 확인합니다.
5. 조건을 통과한 name 추가
   - 조건이 맞으면 student["name"] 값을 passed에 추가합니다. 이 예시에서는 다음 값이 들어갑니다: Min, Sol.
6. 최종 결과 출력
   - passed에 모인 값을 화면에 보여줍니다. 출력 결과는 ['Min', 'Sol']입니다.

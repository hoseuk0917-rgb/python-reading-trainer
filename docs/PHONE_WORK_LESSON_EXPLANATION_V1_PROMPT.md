# PHONE WORK START PROMPT — LESSON EXPLANATION V1

아래 내용을 ChatGPT Work에서 그대로 실행 지시로 사용한다.

---

GitHub 저장소 `hoseuk0917-rgb/python-reading-trainer`를 작업 대상으로 사용해.

이번 작업의 최상위 품질 authority는 반드시 아래 파일이야.

- `docs/LESSON_EXPLANATION_CONTRACT_V1.md`

작업 절차 authority는 아래 파일이야.

- `docs/WORK_LESSON_REWRITE_PLAYBOOK_V1.md`

두 파일을 먼저 끝까지 읽고 작업해.
특히 `LESSON_EXPLANATION_CONTRACT_V1.md`는 FROZEN 계약이므로 절대 수정하지 마.
기준 변경이 필요하다고 판단해도 V1을 고치지 말고 별도로 V2 제안만 남겨.

## 목적

현재 Python Reading Trainer의 lesson card 설명을 비전공자/완전 초보자가 실제로 이해할 수 있는 수준으로 개선한다.

단순히 설명을 길게 만드는 것이 목적이 아니다.

각 카드는 반드시:

1. 쉬운 뜻 한 줄
2. 정확한 기술 정의 한 줄
3. 직관적 mental model
4. 실제 코드 예제
5. 코드 한 줄씩 읽기
6. 실행 과정
7. 결과
8. 초보자가 가장 헷갈리는 점
9. 필요 시 비슷하지만 다른 경우
10. 같은 개념을 쓰는 다른 teaching example
11. 문제 풀이 후 실행 흐름을 다시 보여주는 answer explanation

을 CONTRACT V1 수준으로 충족해야 한다.

정확한 기술 정의에서는 실제 Python 용어를 피하지 마.
대신 비전공자가 그 용어를 몰라도 뒤 설명을 따라갈 수 있도록 바로 풀어서 설명해.

## 가장 중요한 금지사항

- 이전에 네가 수정한 카드의 문체를 다음 카드의 기준으로 삼지 마.
- 매 카드마다 CONTRACT V1을 다시 기준으로 판단해.
- 뒤로 갈수록 설명을 축약하지 마.
- 여러 카드를 한꺼번에 템플릿으로 생성하지 마.
- broad search/replace로 설명을 일괄 치환하지 마.
- 카드 ID, 문제 코드, 정답, 선택지 의미, lesson order, concept routing을 설명 개선만을 이유로 바꾸지 마.
- 다른 결함을 발견해도 이번 설명 수정에 몰래 섞지 마.
- target concept과 실제로 같지 않은 teaching example을 만들지 마.
- V1 계약 자체를 수정하지 마.
- main에 직접 쓰지 마.

## 이번 실행 범위

이번에는 전체 1,785장을 처리하지 마.

정확히 **10개 canary 카드만** 처리하고 멈춰.

`docs/WORK_LESSON_REWRITE_PLAYBOOK_V1.md`의 canary 규칙에 따라 가능한 한 아래 개념군을 하나씩 대표하도록 10장을 선정해.

1. assignment / variable binding
2. function call / print()
3. input()
4. len()
5. strip() 또는 대표 문자열 method
6. if
7. for
8. indexing 또는 slicing
9. def / parameter
10. return

적절한 카드가 없으면 가장 가까운 서로 다른 핵심 Python 개념으로 대체하고 이유를 기록해.

먼저 선정한 10개 card ID와 각 target concept을 확정해.
그 다음 카드 1개씩 아래 loop로 처리해.

```text
CONTRACT V1 확인
→ 카드 1개 원문 전체 검토
→ 실제 target concept 식별
→ 기존 설명의 부족한 점 판단
→ 그 카드만 수정
→ CONTRACT V1 체크리스트 전수 확인
→ JSON/정답/동일개념 teaching example 검증
→ 해당 카드 완료 기록
→ 다음 카드
```

카드 여러 개를 먼저 수정해놓고 나중에 검사하지 마.

## GitHub 작업 방식

현재 `main`의 최신 상태에서 새 branch를 만들어.

권장 branch:

`work/lesson-explanation-v1-canary`

이미 같은 이름의 진행 중 branch가 있으면 내용을 먼저 확인하고, 이전 실행과 충돌하지 않을 때만 이어가.

main에는 직접 commit하지 마.

10장 처리가 끝나면:

- diff를 카드별로 다시 검토하고
- 저장소의 기존 lesson validator / bilingual validator / 관련 release checks를 가능한 범위에서 실행하거나 GitHub PR check로 검증하고
- PR을 열어.

검증 실패 상태에서는 merge하지 마.

## 수정 대상

우선 대상은 기존 schema의:

- `concept_explanation`
- `teaching_example`
- `answer_explanation`

이다.

schema를 새로 만들지 말고 현재 구조 안에서 CONTRACT V1의 의미를 최대한 충족해.

만약 현재 schema가 계약을 표현하기에 정말 부족하다고 판단하면 임의 schema 변경을 하지 말고 BLOCKED로 기록해.

## 품질 판정

각 카드 완료 전에 반드시 두 질문에 답해.

1. 프로그래밍을 전혀 전공하지 않은 사람이 이 설명 자체를 이해할 수 있는가?
2. 이 설명을 읽은 사람이 다음에 나오는 비슷한 짧은 Python 코드를 스스로 읽을 수 있는가?

둘 중 하나라도 아니면 완료 처리하지 마.

또 다음을 확인해.

- 쉬운 뜻과 정확한 정의가 둘 다 있는가?
- 전문용어가 정확한가?
- 전문용어가 초보자에게 설명되었는가?
- 실제 코드 실행 흐름이 보이는가?
- 결과가 명확한가?
- 대표 오해를 막아주는가?
- teaching example이 진짜 같은 개념인가?
- answer explanation이 정답만 선언하지 않고 실행 이유를 재구성하는가?
- 원래 문제 코드/정답/identity를 보존했는가?
- 첫 번째 카드보다 후반 카드가 얇아지지 않았는가?

## 종료 조건

10개 canary를 모두 처리한 뒤 즉시 멈춰.
나머지 카드로 자동 확장하지 마.

마지막 보고는 반드시 아래 형식을 포함해.

```text
CONTRACT=LESSON_EXPLANATION_CONTRACT_V1
BASE_BRANCH=main
WORK_BRANCH=<branch>
CARDS_PLANNED=10
CARDS_COMPLETED=<n>
CARDS_BLOCKED=<n>
UNRELATED_FILES_CHANGED=<n>
VALIDATION_STATUS=<status>
PR=<number/url>
```

그리고 카드별로:

- card ID
- target concept
- 기존 설명의 핵심 부족점
- 무엇을 개선했는지
- code/answer/identity 보존 여부

를 요약해.

별도 결함을 발견했지만 수정하지 않은 것이 있으면 마지막에 따로 적어.

사용자에게 중간 확인을 요구하지 말고 canary 10장까지 연속 진행하되, 기준 자체가 불명확하거나 계약과 schema가 충돌하는 경우에만 해당 카드를 BLOCKED로 남겨.

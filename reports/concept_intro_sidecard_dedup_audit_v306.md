# V306 상단 개념 안내 / 사이드카드 중복 제거 감사 리포트

AUDIT_CONCEPT_INTRO_SIDECARD_DEDUP_V306_A1

- 앱 버전: 20260611_v306_a1
- 총평: PASS
- 목적: 문제 상단에는 정답을 유도하지 않는 일반 개념 설명만 보여주고, 그 설명에 사용한 사이드카드는 같은 화면의 사이드 추천에서 중복 제거한다.

## 1. 결론

- `reading_goal`은 상단 대표 설명에서 빠지고 접힌 `읽기 목표`로 이동했다.
- 문제 상단에는 `conceptIntro` 영역을 두어 일반 개념 설명만 보여준다.
- 상단 개념 안내는 side card 또는 conceptInfo에서 가져오되, 예시·출력·정답처럼 보이는 문장은 걸러낸다.
- 상단 개념 안내에 사용한 side card id는 `renderSideCards`로 전달되어 직접 연결/보너스/랜덤 사이드카드에서 제외된다.
- 정답 후 `explanation`은 현재 문제 기준 해설로 유지한다.

## 2. 자동 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v306_a1 |
| root index version | Y | 20260611_v306_a1 |
| style cache version | Y | style cache busting |
| app script version | Y | app cache busting |
| code script version | Y | code cache busting |
| command script version | Y | command cache busting |
| project script version | Y | project cache busting |
| V306 marker | Y | concept intro dedup marker |
| concept intro container | Y | top concept intro slot |
| reading goal folded | Y | reading_goal moved into details |
| concept intro renderer | Y | renderer installed |
| answer leak guard | Y | example-like text filter |
| side card picker | Y | side card source picked |
| render card uses intro | Y | card render passes excluded side card id |
| side dedup | Y | side card dedup notice |
| random card excludes intro | Y | random background excludes used intro card |
| style marker | Y | V306 styles |
| first card still has explanation | Y | first len card explanation intact |
| V305 project analyzer kept | Y | V305 kept |
| V304 code explainer kept | Y | V304 kept |

## 3. 표시 역할 분리

- 문제 전: 개념 안내 = 일반 개념, 정답 누설 금지
- 문제 전: 읽기 목표 = 접힌 보조 정보
- 문제 후: explanation = 현재 코드와 정답 연결 해설
- 사이드 영역: 상단에 이미 쓴 side card는 중복 표시하지 않음

## 4. 다음 단계

- V307: 정답 선택 후 explanation이 answer/choices와 연결되는지 자동 감사
- V308 후보: reading_goal 템플릿 문장 대량 정리

# V300 코드도구 상위 메뉴 설계 감사 리포트

AUDIT_CODE_TOOLS_HUB_DESIGN_V300_A1

- 앱 버전: 20260611_v300_a1
- 총평: PASS
- 목적: 코드해석 / 명령어해석 / 프로젝트분석을 당장 합치지 않고, 나중에 `코드도구` 상위 메뉴로 묶기 위한 설계를 확정한다.

## 1. 결론

- 현재 3개 메뉴는 사용자 입장에서는 헷갈릴 수 있다.
- 하지만 입력 방식과 분석 목적이 다르므로 엔진을 하나로 합치면 회귀 위험이 크다.
- 따라서 엔진은 분리 유지하고, UI에서만 `코드도구` 상위 메뉴와 3개 하위 모드로 정리하는 방향이 맞다.
- V300에서는 실제 UI 대개편을 하지 않고 설계 판단만 리포트로 고정한다.

## 2. 자동 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v300_a1 |
| root index version | Y | 20260611_v300_a1 |
| style cache version | Y | style cache busting |
| app script version | Y | app cache busting |
| code script version | Y | code cache busting |
| command script version | Y | command cache busting |
| project script version | Y | project cache busting |
| three views still present | Y | existing views kept |
| three engines still present | Y | engine files kept |
| V298 layout lineage kept | Y | width align lineage |
| V299 capability report exists | Y | V299 basis report |
| design rows prepared | Y | 3 modes |
| design principles prepared | Y | 7 principles |
| future UI text prepared | Y | 3 guide lines |
| not-now list prepared | Y | 4 guardrails |
| roadmap prepared | Y | 6 steps |

## 3. 코드도구 하위 모드 설계

| 내부 모드 | 사용자 표시명 | 입력 대상 | 유지할 엔진 | 분리 유지 이유 |
|---|---|---|---|---|
| code_piece | 코드 한 조각 해석 | Python / JavaScript / 설정파일 / 짧은 코드 붙여넣기 | code_explainer.js | 언어별 코드 패턴 설명과 Mermaid 초안이 목적 |
| terminal_command | 터미널 명령 해석 | PowerShell / Bash / Git / 삭제 / 권한 명령 붙여넣기 | command_explainer.js | 실행 전 안전 확인과 위험 명령 가드가 목적 |
| project_structure | 프로젝트 구조 분석 | 프로젝트 파일 목록 / 폴더 구조 / 핵심 파일 묶음 | project_analyzer.js | 단일 코드가 아니라 전체 프로젝트 지도가 목적 |

## 4. 설계 원칙

- 엔진은 합치지 않는다. 입력 방식과 분석 목적이 다르기 때문이다.
- 사용자 화면에서는 `코드도구`라는 상위 묶음으로 정리한다.
- 하위 모드는 `코드 한 조각 해석`, `터미널 명령 해석`, `프로젝트 구조 분석` 3개로 둔다.
- 기존 route/view id인 `codeView`, `commandView`, `projectView`는 당장 유지한다.
- 나중에 UI를 바꿀 때도 내부 엔진 파일명은 유지해 회귀 위험을 줄인다.
- 각 모드 카드 상단에는 `언제 쓰는 기능인지` 한 줄 안내를 붙인다.
- 명령어 안전 해석은 코드해석과 겹치더라도 명령어해석 모드로 유도한다.

## 5. 사용자 안내 문구 초안

- `코드를 붙여넣고 줄별로 이해하고 싶을 때` → 코드 한 조각 해석
- `터미널에 치기 전 안전한지 알고 싶을 때` → 터미널 명령 해석
- `프로젝트 폴더 전체가 어떻게 생겼는지 보고 싶을 때` → 프로젝트 구조 분석

## 6. 지금 하지 않을 것

- 상단 내비게이션을 즉시 대규모 변경하지 않는다.
- 3개 엔진 파일을 하나로 합치지 않는다.
- 현재 검증된 V288~V299 기능을 한 번에 리팩터링하지 않는다.
- Mermaid 정밀도 개선과 메뉴 통합을 한 커밋에 섞지 않는다.

## 7. 권장 최종 구조

```text
코드도구
├─ 코드 한 조각 해석
│  ├─ 사용 상황: 코드를 붙여넣고 순서대로 이해하고 싶을 때
│  └─ 엔진: code_explainer.js
├─ 터미널 명령 해석
│  ├─ 사용 상황: 명령어를 실행하기 전에 안전한지 알고 싶을 때
│  └─ 엔진: command_explainer.js
└─ 프로젝트 구조 분석
   ├─ 사용 상황: 프로젝트 폴더 전체 구조와 핵심 파일을 보고 싶을 때
   └─ 엔진: project_analyzer.js
```

## 8. 다음 단계

- V301: 코드해석 화면에 지원 범위/한계 안내 박스 추가
- V302: Python 함수 정밀 해석 강화
- V303: JavaScript 이벤트/비동기 구조 강화
- V304: Mermaid 품질 모드 분리
- V305: 프로젝트분석 import/reference/call 후보 그래프 강화
- V306: 코드도구 상위 메뉴 실제 UI 전환 여부 결정

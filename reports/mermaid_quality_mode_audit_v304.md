# V304 Mermaid 품질 모드 분리 감사 리포트

AUDIT_MERMAID_QUALITY_MODE_V304_A1

- 앱 버전: 20260611_v304_a1
- 총평: PASS
- 목적: 코드해석의 Mermaid 결과를 하나의 도식으로만 보지 않고, 간단 개요도/함수 흐름도/이벤트 흐름도로 구분한다.

## 1. 결론

- V304는 Mermaid를 `simple_overview`, `function_flow`, `event_flow` 3개 품질 모드로 분리한다.
- Python 함수 해석 결과는 기본적으로 함수 흐름도 모드로 읽게 한다.
- JavaScript 이벤트/DOM/fetch/Promise 신호가 있으면 이벤트/비동기 흐름도 모드로 읽게 한다.
- 기존 Mermaid 텍스트 자체를 무리하게 바꾸지 않고, IR에 `mermaidQualityModeV304` 메타데이터와 설명 step을 추가한다.
- V302 Python 정밀 해석과 V303 JavaScript 정밀 해석은 그대로 유지한다.

## 2. 자동 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v304_a1 |
| root index version | Y | 20260611_v304_a1 |
| style cache version | Y | style cache busting |
| app script version | Y | app cache busting |
| code script version | Y | code cache busting |
| command script version | Y | command cache busting |
| project script version | Y | project cache busting |
| V304 marker | Y | Mermaid quality mode marker |
| mode registry | Y | three Mermaid modes |
| mode chooser | Y | mode selection logic |
| mode guide builder | Y | mode guide metadata |
| apply mode | Y | mode metadata applied to IR |
| step guidance | Y | user-facing step guidance |
| wrapper installed | Y | interpretation wrapper |
| V303 JS precision kept | Y | V303 kept |
| V302 Python precision kept | Y | V302 kept |
| V301 scope notice kept | Y | V301 UI notice kept |

## 3. Mermaid 모드 정의

- simple_overview: 코드 전체의 큰 역할을 짧게 보여주는 간단 개요도
- function_flow: 입력, 조건, 반복, 호출, 반환 순서를 보여주는 함수 흐름도
- event_flow: 클릭/입력 이벤트, DOM 변경, fetch/await/Promise 흐름을 보여주는 이벤트/비동기 흐름도

## 4. 다음 단계

- V305: 프로젝트분석 import/reference/call 후보 그래프 강화
- V306: 코드도구 상위 메뉴 실제 UI 전환 여부 결정

# V301 코드해석 지원 범위/한계 안내 박스 감사 리포트

AUDIT_CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1

- 앱 버전: 20260611_v301_a1
- 총평: PASS
- 목적: 코드해석 화면에 이 기능이 잘하는 것과 한계를 명확히 보여준다.

## 1. 결론

- V301은 엔진 기능을 추가하지 않고 코드해석 화면의 안내성을 개선한다.
- 사용자가 코드해석을 모든 언어 완전 파서나 정밀 호출 그래프 도구로 오해하지 않도록 한계를 명시한다.
- 터미널 명령은 명령어해석, 프로젝트 전체 구조는 프로젝트분석으로 유도한다.
- V300의 `코드도구` 상위 메뉴 설계와 연결되는 첫 번째 실제 UI 안내 작업이다.

## 2. 자동 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v301_a1 |
| root index version | Y | 20260611_v301_a1 |
| style cache version | Y | style cache busting |
| app script version | Y | app cache busting |
| code script version | Y | code cache busting |
| command script version | Y | command cache busting |
| project script version | Y | project cache busting |
| V301 notice marker | Y | notice marker in codeView |
| V301 style marker | Y | style marker |
| notice title | Y | user-facing title |
| notice strengths | Y | strengths listed |
| notice limits | Y | limits listed |
| routing guidance | Y | other menus guided |
| responsive style | Y | mobile supported |
| three engines kept | Y | engine files kept |
| V300 design report exists | Y | V300 basis report |
| V299 gap report exists | Y | V299 basis report |
| V298 layout lineage kept | Y | layout lineage kept |

## 3. 화면에 추가된 안내 요지

- 잘하는 것: 붙여넣은 코드 설명, Python 함수 흐름, JavaScript 기본 구조, 설정파일 패턴, Mermaid 초안
- 한계: 모든 언어 완전 파싱 아님, 전체 함수 호출 그래프/데이터 흐름 정밀 분석 아님
- 분기 안내: 터미널 명령은 명령어해석, 프로젝트 전체 구조는 프로젝트분석

## 4. 다음 단계

- V302: Python 함수 정밀 해석 강화
- V303: JavaScript 이벤트/비동기 구조 강화
- V304: Mermaid 품질 모드 분리
- V305: 프로젝트분석 import/reference/call 후보 그래프 강화

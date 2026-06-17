# V305 프로젝트분석 연결 후보 그래프 강화 감사 리포트

AUDIT_PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1

- 앱 버전: 20260611_v305_a1
- 총평: PASS
- 목적: 프로젝트분석의 import/reference/call 후보 그래프를 종류·신뢰도·근거 중심으로 더 읽기 쉽게 강화한다.

## 1. 결론

- V305는 기존 V265 파일 간 연결 후보, V266 노이즈 필터, V267 그룹 보기, V269 파일 중심 필터, V271 연결 상세 패널을 유지한다.
- probe의 reference 후보 감지를 src/href/fetch/import/from/require/dynamic import/CSS @import까지 넓혔다.
- 연결 후보를 script/import, style/css, data/fetch, document/html, file reference, call-to-symbol 등으로 분류한다.
- 연결 후보 전체 수, high/medium/low 신뢰도, 연결 종류, 중심 파일 요약 카드를 추가한다.
- Mermaid 연결 그래프는 후보 그래프임을 명시하고 kind + confidence 중심 라벨을 사용한다.

## 2. 자동 감사 체크

| check | pass | detail |
|---|---|---|
| app version | Y | 20260611_v305_a1 |
| root index version | Y | 20260611_v305_a1 |
| style cache version | Y | style cache busting |
| app script version | Y | app cache busting |
| code script version | Y | code cache busting |
| command script version | Y | command cache busting |
| project script version | Y | project cache busting |
| project analyzer version | Y | internal project analyzer version |
| V305 marker | Y | connection candidate graph marker |
| reference extractor widened | Y | src/href/fetch/import/require/css import candidates |
| kind classifier | Y | connection kind classification |
| summary cards | Y | graph summary cards |
| candidate notice | Y | candidate graph warning |
| mermaid override | Y | candidate graph mermaid override |
| render wrapper | Y | cross-file panel wrapper |
| V271 detail panel kept | Y | existing evidence panel kept |
| V269 focus filter kept | Y | existing focus filter kept |
| style marker | Y | V305 CSS |
| V304 code explainer kept | Y | V304 kept |
| V303 JS precision kept | Y | V303 kept |
| V302 Python precision kept | Y | V302 kept |

## 3. V305 연결 후보 종류

- public_api: window 객체 / 공개 API 후보
- script_or_import: script src, import, require, dynamic import 후보
- style_reference: CSS link 또는 @import 후보
- data_reference: fetch 또는 JSON/YAML/CSV 데이터 후보
- document_reference: HTML/Markdown 문서 후보
- file_reference: 기타 파일 참조 후보
- call_to_symbol: 호출명과 심볼 소유 파일을 맞춘 함수 호출 후보

## 4. 주의

- 이 결과는 정밀 AST 또는 런타임 호출 그래프가 아니다.
- 동적 import, 번들러 alias, 런타임 생성 경로, 이벤트 기반 간접 호출은 놓칠 수 있다.
- 따라서 V305 표시는 '확정 연결'이 아니라 '검토 후보'로 읽어야 한다.

## 5. 다음 단계

- V306: 코드도구 상위 메뉴 실제 UI 전환 여부 결정
- V307 후보: 프로젝트분석 결과에서 코드해석으로 보내는 브릿지 UX 추가 보강

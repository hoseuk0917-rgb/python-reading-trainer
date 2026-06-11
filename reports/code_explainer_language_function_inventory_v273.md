# V273-B 코드해석 언어/함수 인벤토리 부록

AUDIT_CODE_EXPLAINER_LANGUAGE_FUNCTION_INVENTORY_V273_B1

- 목적: V273 핵심 커버리지 20개 외에, 실제 코드해석기와 학습 데이터가 어느 언어/함수 주제를 넓게 품고 있는지 확인
- 판단: 모든 함수를 UI에 한꺼번에 넣기보다, 리포트/부록에는 넓게 기록하고 학습 화면에는 핵심만 단계적으로 노출하는 방식이 적절함

## 1. 언어 신호 인벤토리

| language | status | evidence tokens |
|---|---|---|
| Python | FOUND_SIGNAL | python, py, argparse, pathlib |
| JavaScript | FOUND_SIGNAL | javascript, js, function, async, fetch |
| HTML | FOUND_SIGNAL | html, <script, <div, document |
| CSS | FOUND_SIGNAL | css, classList, style, selector |
| JSON | FOUND_SIGNAL | json |
| PowerShell | FOUND_SIGNAL | powershell, Set-Location |
| Bash/Shell | FOUND_SIGNAL | shell |
| Markdown | FOUND_SIGNAL | markdown, md, README |
| YAML | FOUND_SIGNAL | yaml |

## 2. code_explainer.js 함수 인벤토리

- 전체 함수/화살표 함수 후보: 147

| version bucket | count |
|---|---:|
| unversioned | 54 |
| V251 | 13 |
| V252 | 8 |
| V253 | 1 |
| V254 | 8 |
| V256 | 11 |
| V257 | 11 |
| V259 | 13 |
| V260 | 6 |
| V261 | 9 |
| V262 | 5 |
| V272 | 8 |

## 3. 학습 데이터 주제 인벤토리

- 검사 파일 수: 148

| topic | files with signal |
|---|---:|
| 조건문 if | 93 |
| JSON | 93 |
| async/await/fetch | 79 |
| 반복문 for/while | 62 |
| Python 함수/def | 61 |
| 파일/open/path | 61 |
| JavaScript 함수 | 42 |
| 예외/try/except | 37 |
| 배열 map/filter/reduce | 33 |
| CLI/argparse | 26 |
| PowerShell | 25 |
| localStorage | 18 |
| DOM/event | 14 |
| Bash/Shell | 8 |

## 4. 운영 원칙

- 커버리지 감사 리포트에는 넓게 넣는다.
- 학습 UI에는 초보자가 바로 이해할 핵심만 먼저 보여준다.
- 고급/드문 함수는 접기 영역, 검색, 상세 보기, 감사 리포트에 둔다.
- 다음 보강은 누락 함수 무한 추가보다, 자주 나오는 함수의 설명 품질과 예시 품질을 높이는 쪽이 우선이다.

## 5. V274 제안

- V274-A: Python 예외/CLI/파일/JSON 설명 품질 보강
- V274-B: JavaScript async/export/class/DOM 설명 품질 보강
- V274-C: PowerShell/Bash 명령어 해석을 별도 모드로 둘지 검토

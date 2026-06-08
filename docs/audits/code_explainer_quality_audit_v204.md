# V204 코드해석 품질 감사 2차

- version: `20260608_v203_a1`
- git_head: `cbbc887 Add code explainer data and call flow analysis`
- git_status: `?? .tmp/`

## Feature Gates
- OK app_version_v203
- OK confidence_summary
- OK unsupported_items
- OK data_flow
- OK call_flow
- OK mermaid_data_call_subgraphs
- OK ui_flow_panel
- OK css_flow_panel
- OK smoke_v203_sample

## 언어별 요약
| language | samples | steps | dataFlow samples | callFlow samples | unsupported samples | dataFlow count | callFlow count | unsupported count |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| python | 2 | 14 | 2 | 2 | 0 | 10 | 5 | 0 |
| powershell | 1 | 6 | 1 | 1 | 1 | 4 | 1 | 1 |
| javascript | 1 | 6 | 1 | 1 | 1 | 5 | 2 | 1 |
| workers | 1 | 6 | 1 | 1 | 0 | 5 | 2 | 0 |
| java | 1 | 13 | 1 | 1 | 0 | 5 | 8 | 0 |

## 샘플별 결과
### python_function_data_file_json
- language: python
- steps: 11
- confidence: {"exact":8,"inferred":3}
- unsupportedCount: 0
- dataFlowCount: 7
- callFlowCount: 4
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true
- dataFlow preview:
  - line 4 · 생성/저장 · rows · rows에 [] 결과를 저장합니다.
  - line 6 · 가공 · rows · rows 값을 추가하거나 갱신합니다.
  - line 7 · 반환 · return · 함수 밖으로 결과를 돌려줍니다.
  - line 9 · 생성/저장 · result · result에 clean([" A ", " B "]) 결과를 저장합니다.
  - line 10 · 생성/저장 · payload · payload에 json.dumps(result, ensure_ascii=False) 결과를 저장합니다.
- callFlow preview:
  - line 3 · 정의 · clean · 사용자 함수 정의입니다.
  - line 9 · 호출 · clean → line 3 · 사용자 정의 함수/메서드를 호출합니다.
  - line 12 · 호출 · open → 내장/라이브러리 · 내장 함수나 라이브러리 기능을 호출합니다.
  - line 15 · 호출 · print → 내장/라이브러리 · 내장 함수나 라이브러리 기능을 호출합니다.

### powershell_file_json_pipeline
- language: powershell
- steps: 6
- confidence: {"inferred":1,"exact":4,"unsupported":1}
- unsupportedCount: 1
- dataFlowCount: 4
- callFlowCount: 1
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true
- dataFlow preview:
  - line 1 · 생성/저장 · root · root에 "D:\projects\python-reading-trainer" 결과를 저장합니다.
  - line 3 · 생성/저장 · files · files에 Get-ChildItem .\src -Recurse -Filter *.js 결과를 저장합니다.
  - line 4 · 생성/저장 · summary · summary에 $files | Select-Object Name, Length | ConvertTo-Json 결과를 저장합니다.
  - line 5 · 파일 저장 · file · 처리 결과를 파일에 저장합니다.
- callFlow preview:
  - line 5 · 호출 · json → 내장/라이브러리 · 내장 함수나 라이브러리 기능을 호출합니다.
- unsupported preview:
  - line 5 · $summary | Set-Content .\.tmp\summary.js · $summary | Set-Content .\.tmp\summary.json -Encoding UTF8

### javascript_dom_function_storage
- language: javascript
- steps: 6
- confidence: {"exact":4,"unsupported":1,"inferred":1}
- unsupportedCount: 1
- dataFlowCount: 5
- callFlowCount: 2
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true
- dataFlow preview:
  - line 2 · 반환 · return · 함수 밖으로 결과를 돌려줍니다.
  - line 5 · 생성/저장 · input · input에 document.getElementById("memo") 결과를 저장합니다.
  - line 6 · 생성/저장 · value · value에 normalize(input.value) 결과를 저장합니다.
  - line 7 · 가공 · localStorage · localStorage 값을 추가하거나 갱신합니다.
  - line 8 · 출력/응답 · output · 처리 결과를 화면이나 응답으로 내보냅니다.
- callFlow preview:
  - line 1 · 정의 · normalize · 사용자 함수/핸들러 정의입니다.
  - line 6 · 호출 · normalize → line 1 · 사용자 정의 함수/메서드를 호출합니다.
- unsupported preview:
  - line 2 · return value.trim().toLowerCase(); · return value.trim().toLowerCase();

### workers_fetch_d1_response
- language: workers
- steps: 6
- confidence: {"exact":6}
- unsupportedCount: 0
- dataFlowCount: 5
- callFlowCount: 2
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true
- dataFlow preview:
  - line 3 · 생성/저장 · url · url에 new URL(request.url) 결과를 저장합니다.
  - line 4 · 생성/저장 · id · id에 url.searchParams.get("id") 결과를 저장합니다.
  - line 5 · 생성/저장 · row · row에 await env.DB.prepare("SELECT * FROM items WHERE id = ?").bind(id).first() 결과를 저장합니다.
  - line 6 · 반환 · return · 함수 밖으로 결과를 돌려줍니다.
  - line 6 · 출력/응답 · output · 처리 결과를 화면이나 응답으로 내보냅니다.
- callFlow preview:
  - line 2 · 호출 · fetch → 내장/라이브러리 · 내장 함수나 라이브러리 기능을 호출합니다.
  - line 6 · 호출 · json → 내장/라이브러리 · 내장 함수나 라이브러리 기능을 호출합니다.

### java_file_method_exception
- language: java
- steps: 13
- confidence: {"exact":12,"inferred":1}
- unsupportedCount: 0
- dataFlowCount: 5
- callFlowCount: 8
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true
- dataFlow preview:
  - line 7 · 생성/저장 · text · text에 Files.readString(Path.of(path)) 결과를 저장합니다.
  - line 8 · 반환 · return · 함수 밖으로 결과를 돌려줍니다.
  - line 13 · 생성/저장 · text · text에 readText("input.txt") 결과를 저장합니다.
  - line 14 · 출력/응답 · output · 처리 결과를 화면이나 응답으로 내보냅니다.
  - line 16 · 출력/응답 · output · 처리 결과를 화면이나 응답으로 내보냅니다.
- callFlow preview:
  - line 6 · 정의 · readText · Java 메서드 정의입니다.
  - line 11 · 정의 · main · Java 메서드 정의입니다.
  - line 6 · 호출 · readText → line 6 · 사용자 정의 함수/메서드를 호출합니다.
  - line 7 · 호출 · readString → 내장/라이브러리 · 내장 함수나 라이브러리 기능을 호출합니다.
  - line 11 · 호출 · main → line 11 · 사용자 정의 함수/메서드를 호출합니다.

### python_unknown_mixed
- language: python
- steps: 3
- confidence: {"inferred":2,"exact":1}
- unsupportedCount: 0
- dataFlowCount: 3
- callFlowCount: 1
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true
- dataFlow preview:
  - line 1 · 생성/저장 · data · data에 [1, 2, 3] 결과를 저장합니다.
  - line 2 · 생성/저장 · result · result에 mystery_transform(data) 결과를 저장합니다.
  - line 3 · 출력/응답 · output · 처리 결과를 화면이나 응답으로 내보냅니다.
- callFlow preview:
  - line 3 · 호출 · print → 내장/라이브러리 · 내장 함수나 라이브러리 기능을 호출합니다.

## Issues
- 없음

## Recommendation
V203 기능 게이트와 대표 샘플 감사가 통과했습니다. V205는 흐름 정밀도 보강으로 진행해도 됩니다.

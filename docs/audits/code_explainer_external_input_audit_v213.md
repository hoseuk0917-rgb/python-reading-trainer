# V213 코드해석 external input node 과탐 감사

- version: 20260608_v212_a1
- git_head: d81f137 Improve code explainer Mermaid external input flow
- git_status: ?? .tmp/

## Feature Gates
- OK version_v212
- OK rules_v212_marker
- OK external_input_marker
- OK ui_v212_marker
- OK smoke_v212

## 감사 요약
- hardFailures: 0

## Hard Failures
- 없음

## 샘플별 결과
### python_dict_no_external_input_v213
- language: python
- hardNotes: 없음
- expectedExternalInputs: []
- actualExternalInputs: []
- unsupported: []
- dataFlow:
  - line 1 · 생성/저장 · raw · 생성 ["raw"] · 사용 []
  - line 2 · 생성/저장 · cleaned · 생성 ["cleaned"] · 사용 ["raw"]
  - line 3 · 생성/저장 · payload · 생성 ["payload"] · 사용 ["cleaned"]
  - line 4 · 출력/응답 · output · 생성 ["output"] · 사용 ["payload"]
- mermaidPreview:
  -   subgraph DATA_FLOW[데이터 흐름]
  -   DF1["생성/저장 · raw · 생성:raw"]
  -   class DF1 dataStep;
  -   DF2["생성/저장 · cleaned · 생성:cleaned · 사용:raw"]
  -   class DF2 dataStep;
  -   DF3["생성/저장 · payload · 생성:payload · 사용:cleaned"]
  -   class DF3 dataStep;
  -   DF4["출력/응답 · output · 생성:output · 사용:payload"]
  -   class DF4 dataStep;
  -   DF1 -->|사용:raw| DF2
  -   DF2 -->|사용:cleaned| DF3
  -   DF3 -->|사용:payload| DF4
  -   START_NODE -.데이터.-> DF1

### javascript_object_no_external_input_v213
- language: javascript
- hardNotes: 없음
- expectedExternalInputs: []
- actualExternalInputs: []
- unsupported: []
- dataFlow:
  - line 1 · 생성/저장 · raw · 생성 ["raw"] · 사용 []
  - line 2 · 생성/저장 · cleaned · 생성 ["cleaned"] · 사용 ["raw"]
  - line 3 · 생성/저장 · payload · 생성 ["payload"] · 사용 ["cleaned"]
  - line 4 · 출력/응답 · output · 생성 ["output"] · 사용 ["payload"]
- mermaidPreview:
  -   subgraph DATA_FLOW[데이터 흐름]
  -   DF1["생성/저장 · raw · 생성:raw"]
  -   class DF1 dataStep;
  -   DF2["생성/저장 · cleaned · 생성:cleaned · 사용:raw"]
  -   class DF2 dataStep;
  -   DF3["생성/저장 · payload · 생성:payload · 사용:cleaned"]
  -   class DF3 dataStep;
  -   DF4["출력/응답 · output · 생성:output · 사용:payload"]
  -   class DF4 dataStep;
  -   DF1 -->|사용:raw| DF2
  -   DF2 -->|사용:cleaned| DF3
  -   DF3 -->|사용:payload| DF4
  -   START_NODE -.데이터.-> DF1

### powershell_declared_vars_no_external_input_v213
- language: powershell
- hardNotes: 없음
- expectedExternalInputs: []
- actualExternalInputs: []
- unsupported: []
- dataFlow:
  - line 1 · 생성/저장 · out · 생성 ["out"] · 사용 []
  - line 2 · 생성/저장 · result · 생성 ["result"] · 사용 []
  - line 3 · 파일 저장 · file · 생성 ["file"] · 사용 ["result","out"]
- mermaidPreview:
  -   subgraph DATA_FLOW[데이터 흐름]
  -   DF1["생성/저장 · out · 생성:out"]
  -   class DF1 dataStep;
  -   DF2["생성/저장 · result · 생성:result"]
  -   class DF2 dataStep;
  -   DF3["파일 저장 · file · 생성:file · 사용:result,out"]
  -   class DF3 dataStep;
  -   DF1 -.흐름.-> DF2
  -   DF2 -->|사용:result| DF3
  -   DF1 -->|사용:out| DF3
  -   START_NODE -.데이터.-> DF1

### java_parameter_external_input_only_v213
- language: java
- hardNotes: 없음
- expectedExternalInputs: ["fileName"]
- actualExternalInputs: ["fileName"]
- unsupported: []
- dataFlow:
  - line 6 · 생성/저장 · text · 생성 ["text"] · 사용 ["fileName"]
  - line 7 · 반환 · return · 생성 ["return"] · 사용 ["text"]
- mermaidPreview:
  -   subgraph DATA_FLOW[데이터 흐름]
  -   DF1["생성/저장 · text · 생성:text · 사용:fileName"]
  -   class DF1 dataStep;
  -   DF2["반환 · return · 생성:return · 사용:text"]
  -   class DF2 dataStep;
  -   DI1(["입력 · fileName"])
  -   class DI1 dataStep;
  -   DI1 -->|사용:fileName| DF1
  -   DF1 -->|사용:text| DF2
  -   START_NODE -.데이터.-> DF1

### javascript_function_param_external_input_v213
- language: javascript
- hardNotes: 없음
- expectedExternalInputs: ["input"]
- actualExternalInputs: ["input"]
- unsupported: []
- dataFlow:
  - line 2 · 생성/저장 · cleaned · 생성 ["cleaned"] · 사용 ["input"]
  - line 3 · 반환 · return · 생성 ["return"] · 사용 ["cleaned"]
- mermaidPreview:
  -   subgraph DATA_FLOW[데이터 흐름]
  -   DF1["생성/저장 · cleaned · 생성:cleaned · 사용:input"]
  -   class DF1 dataStep;
  -   DF2["반환 · return · 생성:return · 사용:cleaned"]
  -   class DF2 dataStep;
  -   DI1(["입력 · input"])
  -   class DI1 dataStep;
  -   DI1 -->|사용:input| DF1
  -   DF1 -->|사용:cleaned| DF2
  -   START_NODE -.데이터.-> DF1

### python_function_param_external_input_v213
- language: python
- hardNotes: 없음
- expectedExternalInputs: ["text"]
- actualExternalInputs: ["text"]
- unsupported: []
- dataFlow:
  - line 2 · 생성/저장 · cleaned · 생성 ["cleaned"] · 사용 ["text"]
  - line 3 · 반환 · return · 생성 ["return"] · 사용 ["cleaned"]
- mermaidPreview:
  -   subgraph DATA_FLOW[데이터 흐름]
  -   DF1["생성/저장 · cleaned · 생성:cleaned · 사용:text"]
  -   class DF1 dataStep;
  -   DF2["반환 · return · 생성:return · 사용:cleaned"]
  -   class DF2 dataStep;
  -   DI1(["입력 · text"])
  -   class DI1 dataStep;
  -   DI1 -->|사용:text| DF1
  -   DF1 -->|사용:cleaned| DF2
  -   START_NODE -.데이터.-> DF1

## Recommendation
V212 external input node 기준선은 안정적입니다. 다음 단계는 감사 리포트 보존 또는 코드해석 샘플 확장입니다.

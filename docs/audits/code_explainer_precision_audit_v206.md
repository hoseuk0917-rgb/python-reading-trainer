# V206 코드해석 정밀도 감사 3차

- version: 20260608_v205_a1
- git_head: 577c8dd Improve code explainer flow precision
- git_status: ?? .tmp/

## Feature Gates
- OK version_v205
- OK rules_v205_marker
- OK ps_setcontent
- OK ps_convert_json_fix
- OK js_return_fix
- OK unknown_assignment
- OK python_assignment_token
- OK call_self_guard
- OK smoke_v205

## 감사 요약
- hardFailures: 0
- candidateNotes: 7

## 후보 이슈
- powershell_param_object_literal_noise: candidate: noisy unsupported/step around [string]$Root
- powershell_param_object_literal_noise: candidate: noisy unsupported/step around [pscustomobject]@
- powershell_param_object_literal_noise: candidate: noisy unsupported/step around path = $_
- python_unknown_nested_call_candidate: candidate: unknown call not marked unsupported: mystery_transform
- python_unknown_chain_candidate: candidate: unknown call not marked unsupported: transform
- javascript_unknown_nested_call_candidate: candidate: unknown call not marked unsupported: mysteryTransform
- java_object_static_call_precision_candidate: candidate: callFlow name missing or not explicit: of

## 샘플별 결과
### baseline_v205_python_unknown_assignment
- purpose: V205에서 고친 대입문 오른쪽 unknown call이 계속 unsupported로 잡히는지 확인
- language: python
- steps: 3
- confidence: {"inferred":1,"unsupported":1,"exact":1}
- unsupported: 1 / ["mystery_transform"]
- dataFlow: 3 / ["data","result","output"]
- callFlow: 1 / ["print"]
- selfCallCount: 0
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true

### powershell_param_object_literal_noise
- purpose: param block 내부 타입 선언과 pscustomobject literal 내부 줄이 미지원으로 과하게 보이는지 확인
- language: powershell
- steps: 9
- confidence: {"exact":6,"unsupported":3}
- unsupported: 3 / ["[string]$Root = \".\"","[pscustomobject]@{","path"]
- dataFlow: 4 / ["ErrorActionPreference","files","result","file"]
- callFlow: 7 / ["Get-ChildItem","Where-Object","ForEach-Object","ForEach-Object","Test-Path","ConvertTo-Json","Set-Content"]
- selfCallCount: 0
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true
- candidateNotes:
  - candidate: noisy unsupported/step around [string]$Root
  - candidate: noisy unsupported/step around [pscustomobject]@
  - candidate: noisy unsupported/step around path = $_

### powershell_convert_json_setcontent_v205_regression
- purpose: ConvertTo-Json | Set-Content 우선 처리와 Set-Content callFlow가 유지되는지 확인
- language: powershell
- steps: 3
- confidence: {"exact":3}
- unsupported: 0 / []
- dataFlow: 3 / ["items","summary","file"]
- callFlow: 4 / ["Get-ChildItem","Select-Object","ConvertTo-Json","Set-Content"]
- selfCallCount: 0
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true

### javascript_return_chain_v205_regression
- purpose: return value.trim().toLowerCase()가 미지원이 아니라 값 반환으로 유지되는지 확인
- language: javascript
- steps: 4
- confidence: {"exact":2,"inferred":2}
- unsupported: 0 / []
- dataFlow: 3 / ["return","value","output"]
- callFlow: 2 / ["normalize","normalize"]
- selfCallCount: 0
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true

### python_unknown_nested_call_candidate
- purpose: unknown call이 대입문의 최상위가 아니라 함수 인자 안에 있을 때 미탐되는지 확인
- language: python
- steps: 3
- confidence: {"inferred":2,"exact":1}
- unsupported: 0 / []
- dataFlow: 3 / ["data","result","output"]
- callFlow: 1 / ["print"]
- selfCallCount: 0
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true
- candidateNotes:
  - candidate: unknown call not marked unsupported: mystery_transform

### python_unknown_chain_candidate
- purpose: loader().transform(data) 같은 체인 호출을 unknown으로 볼지 후보 확인
- language: python
- steps: 3
- confidence: {"inferred":1,"unsupported":1,"exact":1}
- unsupported: 1 / ["loader"]
- dataFlow: 3 / ["data","result","output"]
- callFlow: 1 / ["print"]
- selfCallCount: 0
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true
- candidateNotes:
  - candidate: unknown call not marked unsupported: transform

### javascript_unknown_nested_call_candidate
- purpose: JS 대입문 오른쪽 unknown wrapper call 처리 후보 확인
- language: javascript
- steps: 3
- confidence: {"inferred":1,"unsupported":1,"exact":1}
- unsupported: 1 / ["const result = knownWrapper(mysteryTrans"]
- dataFlow: 3 / ["data","result","output"]
- callFlow: 0 / []
- selfCallCount: 0
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: false
- candidateNotes:
  - candidate: unknown call not marked unsupported: mysteryTransform

### java_object_static_call_precision_candidate
- purpose: Java 객체 메서드 호출과 static/라이브러리 호출 구분 후보 확인
- language: java
- steps: 10
- confidence: {"exact":9,"inferred":1}
- unsupported: 0 / []
- dataFlow: 4 / ["text","return","text","output"]
- callFlow: 5 / ["readText","main","readString","readText","println"]
- selfCallCount: 0
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true
- candidateNotes:
  - candidate: callFlow name missing or not explicit: of

### producer_consumer_candidate
- purpose: 변수별 producer/consumer 연결을 UI에 더 자세히 보여줄 필요가 있는지 확인
- language: python
- steps: 4
- confidence: {"inferred":3,"exact":1}
- unsupported: 0 / []
- dataFlow: 4 / ["raw","cleaned","payload","output"]
- callFlow: 1 / ["print"]
- selfCallCount: 0
- mermaid DATA_FLOW: true
- mermaid CALL_FLOW: true

## Recommendation
V207 후보로 candidateNotes를 우선순위화해 보강하세요.

# V322-A2.6 full interpretation and analysis quality audit

## Purpose

This audit is a full pre-patch review for beginner-facing interpretation and analysis quality.
It combines source inventory, user-facing string checks, expected pattern coverage, previous A2/A2.5 findings, and a sample test plan.

## Guardrails

- This audit does not patch runtime code.
- Do not treat keyword absence alone as proof of missing support.
- Before V322-A3, inspect exact blocks and run sample outputs for C/B findings.
- Keep lesson JSON and side-card JSON out of scope.

## Summary

- total findings: 551
- C critical or absent/sample-required: 44
- B weak/uncertain/review-needed: 51
- A beginner wording improvement: 456

## Source metrics

| file | lines | function_defs | arrow_functions | korean_strings | fallback_strings | empty_state_strings | todo_fixme |
|---|---:|---:|---:|---:|---:|---:|---:|
| src/pwa/code_explainer.js | 5108 | 177 | 0 | 622 | 14 | 15 | 0 |
| src/pwa/code_explainer_rules.js | 3045 | 54 | 0 | 1177 | 3 | 3 | 0 |
| src/pwa/command_explainer.js | 2402 | 63 | 0 | 264 | 4 | 4 | 0 |
| src/pwa/project_analyzer.js | 2239 | 93 | 0 | 161 | 0 | 5 | 0 |
| src/pwa/index.html | 388 | 0 | 0 | 6 | 0 | 0 | 0 |

## Previous audit inputs

- docs/quality/interpretation_analysis_coverage_v322_a2.md: True
- docs/quality/interpretation_analysis_existing_inventory_v322_a25.md: True
- .tmp/interpretation_analysis_coverage_candidates_v322_a2.tsv: True
- .tmp/interpretation_analysis_existing_inventory_v322_a25.tsv: True
- a2_rows: 207
- a2_severity: {'C': 33, 'B': 21, 'A': 153}
- a25_rows: 28
- a25_status: {'absent': 2, 'needs_sample_test': 4, 'likely_supported_or_partial': 22}

## Expected pattern coverage

| status | area | group | pattern | hit_count | hits |
|---|---|---|---|---:|---|
| absent | code_explainer | python | __init__ | 0 |  |
| absent | code_explainer | python | enumerate | 0 |  |
| absent | code_explainer | python | lambda | 0 |  |
| absent | code_explainer | python-lib | logging | 0 |  |
| absent | code_explainer | python-lib | requests | 0 |  |
| absent | code_explainer | python | self | 0 |  |
| absent | command_explainer | powershell | ForEach/Where | 0 |  |
| absent | command_explainer | powershell | web request | 0 |  |
| absent | project_analyzer | pwa | PWA | 0 |  |
| present_or_partial | code_explainer | js | DOM event/query | 44 | addeventlistener:19; queryselector:12; getelementbyid:13 |
| present_or_partial | code_explainer | python | async/await | 147 | async:80; await:67 |
| present_or_partial | code_explainer | python | class | 7 | class :7 |
| present_or_partial | code_explainer | js | fetch/request/response | 44 | fetch(:2; request:30; response:12 |
| present_or_partial | code_explainer | python-lib | json/csv/path | 60 | json.load:11; json.loads:6; csv:1; pathlib:7; path:35 |
| present_or_partial | code_explainer | python | try/except/finally | 86 | try:58; except:18; finally:10 |
| present_or_partial | code_explainer | python | with open | 3 | with open:2; open(:1 |
| present_or_partial | command_explainer | powershell | delete/risk | 18 | remove-item:12; rm :6 |
| present_or_partial | command_explainer | git | history/risk | 7 | reset --hard:1; git clean:5; clean -fd:1 |
| present_or_partial | command_explainer | powershell | pipeline | 254 | \|:254 |
| present_or_partial | project_analyzer | guidance | beginner guidance | 41 | first:15; validate:9; version:17 |
| present_or_partial | project_analyzer | entrypoint | web entry | 24 | index.html:10; script:8; app.js:6 |
| sparse | code_explainer | python-lib | os.environ | 1 | environ:1 |
| sparse | code_explainer | python-lib | pandas | 2 | pandas:2 |
| sparse | command_explainer | dev | dev commands | 2 | pip install:2 |
| sparse | project_analyzer | config | project config | 1 | package.json:1 |
| sparse | project_analyzer | entrypoint | python entry | 2 | app.py:2 |

## Findings by area

- code_explainer_rules: 295
- code_explainer: 110
- command_explainer: 60
- prior_a2: 54
- project_analyzer: 32

## Findings by category

- abstract_string: 440
- prior_a2_candidate: 54
- fallback_output: 21
- empty_state_without_next_action: 16
- expected_pattern_absent: 9
- prior_a25_inventory: 6
- expected_pattern_sparse: 5

## Top findings

| severity | area | file | line | category | pattern | evidence | recommendation |
|---|---|---|---:|---|---|---|---|
| C | code_explainer | a25_inventory | 0 | prior_a25_inventory | __init__ | status=absent evidence_count=0 | Run sample output check before patching. |
| C | code_explainer | code_explainer | 0 | expected_pattern_absent | __init__ | keywords missing: __init__ | No direct evidence. Verify with sample output, then consider adding support. |
| C | code_explainer | code_explainer | 0 | expected_pattern_absent | enumerate | keywords missing: enumerate | No direct evidence. Verify with sample output, then consider adding support. |
| C | code_explainer | code_explainer | 0 | expected_pattern_absent | lambda | keywords missing: lambda | No direct evidence. Verify with sample output, then consider adding support. |
| C | code_explainer | code_explainer | 0 | expected_pattern_absent | logging | keywords missing: logging, logger | No direct evidence. Verify with sample output, then consider adding support. |
| C | code_explainer | code_explainer | 0 | expected_pattern_absent | requests | keywords missing: requests, requests.get, requests.post | No direct evidence. Verify with sample output, then consider adding support. |
| C | code_explainer | code_explainer | 0 | expected_pattern_absent | self | keywords missing: self | No direct evidence. Verify with sample output, then consider adding support. |
| C | command_explainer | command_explainer | 0 | expected_pattern_absent | ForEach/Where | keywords missing: foreach-object, where-object | No direct evidence. Verify with sample output, then consider adding support. |
| C | command_explainer | command_explainer | 0 | expected_pattern_absent | web request | keywords missing: invoke-webrequest, invoke-restmethod, iwr, irm | No direct evidence. Verify with sample output, then consider adding support. |
| C | prior_a2 | src/pwa/code_explainer.js | 0 | prior_a2_candidate | __init__ | missing keyword: __init__ | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/code_explainer.js | 0 | prior_a2_candidate | enumerate | missing keyword: enumerate | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/code_explainer.js | 0 | prior_a2_candidate | flask | missing keyword: flask | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/code_explainer.js | 0 | prior_a2_candidate | lambda | missing keyword: lambda | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/code_explainer.js | 0 | prior_a2_candidate | logging | missing keyword: logging | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/code_explainer.js | 0 | prior_a2_candidate | os.environ | missing keyword: os.environ | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/code_explainer.js | 0 | prior_a2_candidate | requests | missing keyword: requests | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/code_explainer.js | 0 | prior_a2_candidate | self | missing keyword: self | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/code_explainer.js | 0 | prior_a2_candidate | streamlit | missing keyword: streamlit | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | convertfrom-json | missing keyword: convertfrom-json | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | docker compose | missing keyword: docker compose | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | foreach-object | missing keyword: foreach-object | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | git rebase | missing keyword: git rebase | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | git stash | missing keyword: git stash | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | invoke-restmethod | missing keyword: invoke-restmethod | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | invoke-webrequest | missing keyword: invoke-webrequest | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | npm run | missing keyword: npm run | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | pipeline | missing keyword: pipeline | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | poetry | missing keyword: poetry | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | pytest | missing keyword: pytest | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | python -m | missing keyword: python -m | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | set-executionpolicy | missing keyword: set-executionpolicy | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | uv | missing keyword: uv | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | where-object | missing keyword: where-object | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/command_explainer.js | 0 | prior_a2_candidate | wrangler | missing keyword: wrangler | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/project_analyzer.js | 0 | prior_a2_candidate | main.py | missing keyword: main.py | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/project_analyzer.js | 0 | prior_a2_candidate | manifest | missing keyword: manifest | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/project_analyzer.js | 0 | prior_a2_candidate | pyproject.toml | missing keyword: pyproject.toml | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/project_analyzer.js | 0 | prior_a2_candidate | requirements.txt | missing keyword: requirements.txt | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/project_analyzer.js | 0 | prior_a2_candidate | risk | missing keyword: risk | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/project_analyzer.js | 0 | prior_a2_candidate | server.py | missing keyword: server.py | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/project_analyzer.js | 0 | prior_a2_candidate | service worker | missing keyword: service worker | Use A2 only as a candidate list, not as proof of missing support. |
| C | prior_a2 | src/pwa/project_analyzer.js | 0 | prior_a2_candidate | wrangler.toml | missing keyword: wrangler.toml | Use A2 only as a candidate list, not as proof of missing support. |
| C | project_analyzer | a25_inventory | 0 | prior_a25_inventory | manifest/service worker | status=absent evidence_count=0 | Run sample output check before patching. |
| C | project_analyzer | project_analyzer | 0 | expected_pattern_absent | PWA | keywords missing: manifest, service worker, serviceworker | No direct evidence. Verify with sample output, then consider adding support. |
| B | code_explainer | a25_inventory | 0 | prior_a25_inventory | lambda | status=needs_sample_test evidence_count=2 | Run sample output check before patching. |
| B | code_explainer | a25_inventory | 0 | prior_a25_inventory | requests | status=needs_sample_test evidence_count=2 | Run sample output check before patching. |
| B | code_explainer | a25_inventory | 0 | prior_a25_inventory | self | status=needs_sample_test evidence_count=2 | Run sample output check before patching. |
| B | code_explainer | a25_inventory | 0 | prior_a25_inventory | with open | status=needs_sample_test evidence_count=2 | Run sample output check before patching. |
| B | code_explainer | code_explainer | 0 | expected_pattern_sparse | os.environ | hits: [('environ', 1)] | Sparse evidence. Inspect exact block and sample output before patching. |
| B | code_explainer | code_explainer | 0 | expected_pattern_sparse | pandas | hits: [('pandas', 2)] | Sparse evidence. Inspect exact block and sample output before patching. |
| B | code_explainer | src/pwa/code_explainer.js | 202 | fallback_output | fallback/unsupported/inferred | 자동 감지는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다. | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 380 | fallback_output | fallback/unsupported/inferred | 추정 해석 | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 381 | fallback_output | fallback/unsupported/inferred | 일반 설명 | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 382 | fallback_output | fallback/unsupported/inferred | 추정 해석 | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 4492 | fallback_output | fallback/unsupported/inferred | / 추정 | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 4492 | fallback_output | fallback/unsupported/inferred | / 미지원 | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 4495 | fallback_output | fallback/unsupported/inferred | 미지원/확인필요: | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 4613 | fallback_output | fallback/unsupported/inferred | </strong><small>미지원</small></span> | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 4614 | fallback_output | fallback/unsupported/inferred | </strong><small>확인필요</small></span> | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 4631 | fallback_output | fallback/unsupported/inferred | <p class="muted">미지원 함수/명령은 따로 감지되지 않았습니다.</p> | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 4636 | fallback_output | fallback/unsupported/inferred | </strong><small>추정</small></span> | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 4637 | fallback_output | fallback/unsupported/inferred | </strong><small>미지원</small></span> | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 4640 | fallback_output | fallback/unsupported/inferred | <summary>미지원/확인필요 함수·명령</summary> | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer | src/pwa/code_explainer.js | 4909 | fallback_output | fallback/unsupported/inferred | 분석하면 확실/추정/미지원 단계가 표시됩니다. | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer_rules | src/pwa/code_explainer_rules.js | 224 | fallback_output | fallback/unsupported/inferred | 추정 | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer_rules | src/pwa/code_explainer_rules.js | 225 | fallback_output | fallback/unsupported/inferred | 미지원 | Check if the UI explains why this is uncertain and what to inspect next. |
| B | code_explainer_rules | src/pwa/code_explainer_rules.js | 226 | fallback_output | fallback/unsupported/inferred | 추정 | Check if the UI explains why this is uncertain and what to inspect next. |
| B | command_explainer | command_explainer | 0 | expected_pattern_sparse | dev commands | hits: [('pip install', 2)] | Sparse evidence. Inspect exact block and sample output before patching. |
| B | command_explainer | src/pwa/command_explainer.js | 833 | fallback_output | fallback/unsupported/inferred | 알 수 없는 명령 | Check if the UI explains why this is uncertain and what to inspect next. |
| B | command_explainer | src/pwa/command_explainer.js | 966 | fallback_output | fallback/unsupported/inferred | 알 수 없는 명령 | Check if the UI explains why this is uncertain and what to inspect next. |
| B | command_explainer | src/pwa/command_explainer.js | 1889 | fallback_output | fallback/unsupported/inferred | 미지원 셸 | Check if the UI explains why this is uncertain and what to inspect next. |
| B | command_explainer | src/pwa/command_explainer.js | 1897 | fallback_output | fallback/unsupported/inferred | 지원하지 않는 셸입니다. PowerShell 또는 Bash/Shell을 선택해 주세요. | Check if the UI explains why this is uncertain and what to inspect next. |
| B | prior_a2 | src/pwa/code_explainer.js | 202 | prior_a2_candidate | fallback/unsupported/inferred | 자동 감지는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다. | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 380 | prior_a2_candidate | confidence inferred/unsupported | if (confidence === "inferred") return "추정 해석"; | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 381 | prior_a2_candidate | confidence inferred/unsupported | if (confidence === "unsupported") return "일반 설명"; | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 387 | prior_a2_candidate | confidence inferred/unsupported | if (confidence === "unsupported") return "confidence-unsupported"; | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 388 | prior_a2_candidate | confidence inferred/unsupported | return "confidence-inferred"; | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 551 | prior_a2_candidate | confidence inferred/unsupported | const confidence = step.confidence \|\| "inferred"; | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 614 | prior_a2_candidate | confidence inferred/unsupported | const confidence = step.confidence \|\| "inferred"; | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 4492 | prior_a2_candidate | confidence inferred/unsupported | lines.push("확신도: 확실 " + (confidence.exact \|\| 0) + " / 추정 " + (confidence.inferred \|\| 0) + " / 미지원 " + (confidence.unsupported \|\| 0)); | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 4495 | prior_a2_candidate | fallback/unsupported/inferred | 미지원/확인필요: | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 4613 | prior_a2_candidate | confidence inferred/unsupported | '<span class="code-report-chip"><strong>' + (confidence.unsupported \|\| 0) + '</strong><small>미지원</small></span>' + | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 4613 | prior_a2_candidate | fallback/unsupported/inferred | </strong><small>미지원</small></span> | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 4631 | prior_a2_candidate | fallback/unsupported/inferred | <p class="muted">미지원 함수/명령은 따로 감지되지 않았습니다.</p> | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 4636 | prior_a2_candidate | confidence inferred/unsupported | '<span class="code-confidence-chip confidence-inferred"><strong>' + (confidence.inferred \|\| 0) + '</strong><small>추정</small></span>' + | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 4636 | prior_a2_candidate | fallback/unsupported/inferred | </strong><small>추정</small></span> | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 4637 | prior_a2_candidate | confidence inferred/unsupported | '<span class="code-confidence-chip confidence-unsupported"><strong>' + (confidence.unsupported \|\| 0) + '</strong><small>미지원</small></span>' + | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 4637 | prior_a2_candidate | fallback/unsupported/inferred | </strong><small>미지원</small></span> | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 4640 | prior_a2_candidate | fallback/unsupported/inferred | <summary>미지원/확인필요 함수·명령</summary> | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/code_explainer.js | 4909 | prior_a2_candidate | fallback/unsupported/inferred | 분석하면 확실/추정/미지원 단계가 표시됩니다. | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/command_explainer.js | 833 | prior_a2_candidate | fallback/unsupported/inferred | 알 수 없는 명령 | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/command_explainer.js | 966 | prior_a2_candidate | fallback/unsupported/inferred | 알 수 없는 명령 | Use A2 only as a candidate list, not as proof of missing support. |
| B | prior_a2 | src/pwa/command_explainer.js | 1897 | prior_a2_candidate | fallback/unsupported/inferred | 지원하지 않는 셸입니다. PowerShell 또는 Bash/Shell을 선택해 주세요. | Use A2 only as a candidate list, not as proof of missing support. |
| B | project_analyzer | project_analyzer | 0 | expected_pattern_sparse | project config | hits: [('package.json', 1)] | Sparse evidence. Inspect exact block and sample output before patching. |
| B | project_analyzer | project_analyzer | 0 | expected_pattern_sparse | python entry | hits: [('app.py', 2)] | Sparse evidence. Inspect exact block and sample output before patching. |
| A | code_explainer | src/pwa/code_explainer.js | 213 | abstract_string | abstract wording | pyproject.toml은 Python 프로젝트 메타데이터와 도구 설정을 중심으로 설명합니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 214 | abstract_string | abstract wording | YAML은 들여쓰기 기반 설정 키, 목록, 서비스 설정을 중심으로 설명합니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 217 | abstract_string | abstract wording | INI 설정은 섹션과 key=value 설정을 중심으로 설명합니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 241 | abstract_string | abstract wording | INI 설정 | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 242 | abstract_string | abstract wording | TOML 설정 | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 258 | abstract_string | abstract wording | 사용자가 언어를 직접 선택했습니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 283 | abstract_string | abstract wording | Cloudflare env 바인딩 사용이 보입니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 299 | abstract_string | abstract wording | actions/checkout 같은 GitHub Action 사용이 보입니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 319 | abstract_string | abstract wording | Python build-system 설정이 보입니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 324 | abstract_string | abstract wording | 들여쓰기 기반 설정 구조가 보입니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 340 | abstract_string | abstract wording | INI key=value 설정이 보입니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 348 | abstract_string | abstract wording | 감지가 애매하면 언어 드롭다운에서 직접 선택해 다시 분석하세요. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 511 | abstract_string | abstract wording | 관련 보충 카드가 아직 연결되지 않았습니다. 위의 단계별 해석만으로도 학습을 진행할 수 있습니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 593 | abstract_string | abstract wording | 개만 표시했습니다. 전체 순서는 복사 리포트와 Mermaid 원문에서 함께 확인할 수 있습니다.</p> | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 641 | abstract_string | abstract wording | <p class="muted">표시할 해석 단계가 없습니다. 언어 선택이나 코드 범위를 확인한 뒤 다시 분석해 보세요.</p> | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 662 | abstract_string | abstract wording | 개 단계는 리포트 복사 또는 Mermaid 원문에서 이어서 확인하세요. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 1008 | abstract_string | abstract wording | 조건을 확인합니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 1012 | abstract_string | abstract wording | 호출을 실행합니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 1109 | abstract_string | abstract wording | 예외가 발생했을 때 대체 흐름으로 처리합니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 1133 | abstract_string | abstract wording | JSON 데이터를 읽거나 변환하는 처리입니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 1211 | abstract_string | abstract wording | 사용 라이브러리/모듈: | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 1489 | abstract_string | abstract wording | 조건을 확인합니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 1491 | abstract_string | abstract wording | 조건을 확인합니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 1518 | abstract_string | abstract wording | 호출을 실행합니다. | Add concrete input/output/result/state-change wording. |
| A | code_explainer | src/pwa/code_explainer.js | 1575 | abstract_string | abstract wording | JavaScript 코드 흐름을 함수 단위로 묶어 실행하는 함수로 보입니다. | Add concrete input/output/result/state-change wording. |

## Sample output plan for V322-A3 decision

| area | pattern | language | expected output check |
|---|---|---|---|
| code_explainer | __init__ | python | constructor should explain object setup and self.name state |
| code_explainer | self | python | self should explain instance state change |
| code_explainer | with open | python | file open/read/auto-close should be clear |
| code_explainer | requests | python | HTTP request and response status should be clear |
| code_explainer | lambda | python | lambda should be explained as temporary function |
| command_explainer | pipeline | powershell | pipeline should show left-to-right object flow |
| command_explainer | git clean | shell | should warn about deleting untracked files |
| command_explainer | wrangler | shell | should explain Cloudflare deploy target |
| project_analyzer | PWA | project | should detect PWA relation if files exist |

## Recommended next step

1. Commit this full audit as V322-A2.6 if the output looks reasonable.
2. Run exact source block extraction for C/B findings, not broad patching.
3. Run sample outputs for __init__, self, with open, requests, lambda, pipeline, git clean, wrangler, and PWA detection.
4. Choose one small V322-A3 patch batch only after sample output proves a real quality gap.

## Generated files

- findings TSV: .tmp/interpretation_analysis_full_quality_findings_v322_a26.tsv
- sample plan TSV: .tmp/interpretation_analysis_full_quality_sample_plan_v322_a26.tsv
- markdown: docs/quality/interpretation_analysis_full_quality_audit_v322_a26.md

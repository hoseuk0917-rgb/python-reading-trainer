# V322-A2 beginner-facing interpretation coverage audit

## Scope

- target: code_explainer, command_explainer, project_analyzer
- purpose: find beginner explanation quality issues and unsupported/weak coverage candidates.
- patch policy: this is an audit document. Actual rule/text patches should start in V322-A3 with small batches.
- side-card JSON and lesson JSON remain out of scope.

## Summary

- total candidates: 207
- severity C coverage missing/unconfirmed: 33
- severity B weak/uncertain analysis path: 21
- severity A beginner wording issue: 153

## By file

- src/pwa/code_explainer.js: 104
- src/pwa/command_explainer.js: 75
- src/pwa/project_analyzer.js: 28

## By category

- abstract_beginner_explanation: 118
- coverage_missing_or_unconfirmed: 33
- too_generic_sentence: 29
- fallback_or_uncertain_output: 11
- confidence_path_review: 10
- risk_reason_review: 6

## Top candidates

| severity | file | line | category | pattern | evidence |
|---|---|---:|---|---|---|
| C | src/pwa/code_explainer.js | 0 | coverage_missing_or_unconfirmed | __init__ | missing keyword: __init__ |
| C | src/pwa/code_explainer.js | 0 | coverage_missing_or_unconfirmed | enumerate | missing keyword: enumerate |
| C | src/pwa/code_explainer.js | 0 | coverage_missing_or_unconfirmed | flask | missing keyword: flask |
| C | src/pwa/code_explainer.js | 0 | coverage_missing_or_unconfirmed | lambda | missing keyword: lambda |
| C | src/pwa/code_explainer.js | 0 | coverage_missing_or_unconfirmed | logging | missing keyword: logging |
| C | src/pwa/code_explainer.js | 0 | coverage_missing_or_unconfirmed | os.environ | missing keyword: os.environ |
| C | src/pwa/code_explainer.js | 0 | coverage_missing_or_unconfirmed | requests | missing keyword: requests |
| C | src/pwa/code_explainer.js | 0 | coverage_missing_or_unconfirmed | self | missing keyword: self |
| C | src/pwa/code_explainer.js | 0 | coverage_missing_or_unconfirmed | streamlit | missing keyword: streamlit |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | convertfrom-json | missing keyword: convertfrom-json |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | docker compose | missing keyword: docker compose |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | foreach-object | missing keyword: foreach-object |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | git rebase | missing keyword: git rebase |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | git stash | missing keyword: git stash |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | invoke-restmethod | missing keyword: invoke-restmethod |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | invoke-webrequest | missing keyword: invoke-webrequest |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | npm run | missing keyword: npm run |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | pipeline | missing keyword: pipeline |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | poetry | missing keyword: poetry |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | pytest | missing keyword: pytest |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | python -m | missing keyword: python -m |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | set-executionpolicy | missing keyword: set-executionpolicy |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | uv | missing keyword: uv |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | where-object | missing keyword: where-object |
| C | src/pwa/command_explainer.js | 0 | coverage_missing_or_unconfirmed | wrangler | missing keyword: wrangler |
| C | src/pwa/project_analyzer.js | 0 | coverage_missing_or_unconfirmed | main.py | missing keyword: main.py |
| C | src/pwa/project_analyzer.js | 0 | coverage_missing_or_unconfirmed | manifest | missing keyword: manifest |
| C | src/pwa/project_analyzer.js | 0 | coverage_missing_or_unconfirmed | pyproject.toml | missing keyword: pyproject.toml |
| C | src/pwa/project_analyzer.js | 0 | coverage_missing_or_unconfirmed | requirements.txt | missing keyword: requirements.txt |
| C | src/pwa/project_analyzer.js | 0 | coverage_missing_or_unconfirmed | risk | missing keyword: risk |
| C | src/pwa/project_analyzer.js | 0 | coverage_missing_or_unconfirmed | server.py | missing keyword: server.py |
| C | src/pwa/project_analyzer.js | 0 | coverage_missing_or_unconfirmed | service worker | missing keyword: service worker |
| C | src/pwa/project_analyzer.js | 0 | coverage_missing_or_unconfirmed | wrangler.toml | missing keyword: wrangler.toml |
| B | src/pwa/code_explainer.js | 202 | fallback_or_uncertain_output | fallback/unsupported/inferred | 자동 감지는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다. |
| B | src/pwa/code_explainer.js | 380 | confidence_path_review | confidence inferred/unsupported | if (confidence === "inferred") return "추정 해석"; |
| B | src/pwa/code_explainer.js | 381 | confidence_path_review | confidence inferred/unsupported | if (confidence === "unsupported") return "일반 설명"; |
| B | src/pwa/code_explainer.js | 387 | confidence_path_review | confidence inferred/unsupported | if (confidence === "unsupported") return "confidence-unsupported"; |
| B | src/pwa/code_explainer.js | 388 | confidence_path_review | confidence inferred/unsupported | return "confidence-inferred"; |
| B | src/pwa/code_explainer.js | 551 | confidence_path_review | confidence inferred/unsupported | const confidence = step.confidence \|\| "inferred"; |
| B | src/pwa/code_explainer.js | 614 | confidence_path_review | confidence inferred/unsupported | const confidence = step.confidence \|\| "inferred"; |
| B | src/pwa/code_explainer.js | 4492 | confidence_path_review | confidence inferred/unsupported | lines.push("확신도: 확실 " + (confidence.exact \|\| 0) + " / 추정 " + (confidence.inferred \|\| 0) + " / 미지원 " + (confidence.unsupported \|\| 0)); |
| B | src/pwa/code_explainer.js | 4495 | fallback_or_uncertain_output | fallback/unsupported/inferred | 미지원/확인필요: |
| B | src/pwa/code_explainer.js | 4613 | confidence_path_review | confidence inferred/unsupported | '<span class="code-report-chip"><strong>' + (confidence.unsupported \|\| 0) + '</strong><small>미지원</small></span>' + |
| B | src/pwa/code_explainer.js | 4613 | fallback_or_uncertain_output | fallback/unsupported/inferred | </strong><small>미지원</small></span> |
| B | src/pwa/code_explainer.js | 4631 | fallback_or_uncertain_output | fallback/unsupported/inferred | <p class="muted">미지원 함수/명령은 따로 감지되지 않았습니다.</p> |
| B | src/pwa/code_explainer.js | 4636 | confidence_path_review | confidence inferred/unsupported | '<span class="code-confidence-chip confidence-inferred"><strong>' + (confidence.inferred \|\| 0) + '</strong><small>추정</small></span>' + |
| B | src/pwa/code_explainer.js | 4636 | fallback_or_uncertain_output | fallback/unsupported/inferred | </strong><small>추정</small></span> |
| B | src/pwa/code_explainer.js | 4637 | confidence_path_review | confidence inferred/unsupported | '<span class="code-confidence-chip confidence-unsupported"><strong>' + (confidence.unsupported \|\| 0) + '</strong><small>미지원</small></span>' + |
| B | src/pwa/code_explainer.js | 4637 | fallback_or_uncertain_output | fallback/unsupported/inferred | </strong><small>미지원</small></span> |
| B | src/pwa/code_explainer.js | 4640 | fallback_or_uncertain_output | fallback/unsupported/inferred | <summary>미지원/확인필요 함수·명령</summary> |
| B | src/pwa/code_explainer.js | 4909 | fallback_or_uncertain_output | fallback/unsupported/inferred | 분석하면 확실/추정/미지원 단계가 표시됩니다. |
| B | src/pwa/command_explainer.js | 833 | fallback_or_uncertain_output | fallback/unsupported/inferred | 알 수 없는 명령 |
| B | src/pwa/command_explainer.js | 966 | fallback_or_uncertain_output | fallback/unsupported/inferred | 알 수 없는 명령 |
| B | src/pwa/command_explainer.js | 1897 | fallback_or_uncertain_output | fallback/unsupported/inferred | 지원하지 않는 셸입니다. PowerShell 또는 Bash/Shell을 선택해 주세요. |
| A | src/pwa/code_explainer.js | 213 | abstract_beginner_explanation | abstract Korean verb without concrete result | pyproject.toml은 Python 프로젝트 메타데이터와 도구 설정을 중심으로 설명합니다. |
| A | src/pwa/code_explainer.js | 214 | abstract_beginner_explanation | abstract Korean verb without concrete result | YAML은 들여쓰기 기반 설정 키, 목록, 서비스 설정을 중심으로 설명합니다. |
| A | src/pwa/code_explainer.js | 217 | abstract_beginner_explanation | abstract Korean verb without concrete result | INI 설정은 섹션과 key=value 설정을 중심으로 설명합니다. |
| A | src/pwa/code_explainer.js | 258 | abstract_beginner_explanation | abstract Korean verb without concrete result | 사용자가 언어를 직접 선택했습니다. |
| A | src/pwa/code_explainer.js | 283 | abstract_beginner_explanation | abstract Korean verb without concrete result | Cloudflare env 바인딩 사용이 보입니다. |
| A | src/pwa/code_explainer.js | 299 | abstract_beginner_explanation | abstract Korean verb without concrete result | actions/checkout 같은 GitHub Action 사용이 보입니다. |
| A | src/pwa/code_explainer.js | 319 | abstract_beginner_explanation | abstract Korean verb without concrete result | Python build-system 설정이 보입니다. |
| A | src/pwa/code_explainer.js | 324 | abstract_beginner_explanation | abstract Korean verb without concrete result | 들여쓰기 기반 설정 구조가 보입니다. |
| A | src/pwa/code_explainer.js | 340 | abstract_beginner_explanation | abstract Korean verb without concrete result | INI key=value 설정이 보입니다. |
| A | src/pwa/code_explainer.js | 348 | abstract_beginner_explanation | abstract Korean verb without concrete result | 감지가 애매하면 언어 드롭다운에서 직접 선택해 다시 분석하세요. |
| A | src/pwa/code_explainer.js | 372 | risk_reason_review | risk without visible reason | if (risk === "high") return "위험"; |
| A | src/pwa/code_explainer.js | 373 | risk_reason_review | risk without visible reason | if (risk === "medium") return "주의"; |
| A | src/pwa/code_explainer.js | 511 | abstract_beginner_explanation | abstract Korean verb without concrete result | 관련 보충 카드가 아직 연결되지 않았습니다. 위의 단계별 해석만으로도 학습을 진행할 수 있습니다. |
| A | src/pwa/code_explainer.js | 573 | risk_reason_review | risk without visible reason | return step.risk === "medium" \|\| step.risk === "high"; |
| A | src/pwa/code_explainer.js | 593 | abstract_beginner_explanation | abstract Korean verb without concrete result | 개만 표시했습니다. 전체 순서는 복사 리포트와 Mermaid 원문에서 함께 확인할 수 있습니다.</p> |
| A | src/pwa/code_explainer.js | 641 | abstract_beginner_explanation | abstract Korean verb without concrete result | <p class="muted">표시할 해석 단계가 없습니다. 언어 선택이나 코드 범위를 확인한 뒤 다시 분석해 보세요.</p> |
| A | src/pwa/code_explainer.js | 662 | abstract_beginner_explanation | abstract Korean verb without concrete result | 개 단계는 리포트 복사 또는 Mermaid 원문에서 이어서 확인하세요. |
| A | src/pwa/code_explainer.js | 681 | risk_reason_review | risk without visible reason | item.className = "warning-item risk-" + step.risk; |
| A | src/pwa/code_explainer.js | 1008 | abstract_beginner_explanation | abstract Korean verb without concrete result | 조건을 확인합니다. |
| A | src/pwa/code_explainer.js | 1008 | too_generic_sentence | generic sentence ending | 조건을 확인합니다. |
| A | src/pwa/code_explainer.js | 1012 | abstract_beginner_explanation | abstract Korean verb without concrete result | 호출을 실행합니다. |
| A | src/pwa/code_explainer.js | 1109 | abstract_beginner_explanation | abstract Korean verb without concrete result | 예외가 발생했을 때 대체 흐름으로 처리합니다. |
| A | src/pwa/code_explainer.js | 1109 | too_generic_sentence | generic sentence ending | 예외가 발생했을 때 대체 흐름으로 처리합니다. |
| A | src/pwa/code_explainer.js | 1133 | abstract_beginner_explanation | abstract Korean verb without concrete result | JSON 데이터를 읽거나 변환하는 처리입니다. |
| A | src/pwa/code_explainer.js | 1211 | abstract_beginner_explanation | abstract Korean verb without concrete result | 사용 라이브러리/모듈: |
| A | src/pwa/code_explainer.js | 1489 | abstract_beginner_explanation | abstract Korean verb without concrete result | 조건을 확인합니다. |

## Next recommended patch order

1. Reproduce C-grade missing coverage with sample code or command input.
2. Patch visible B-grade inferred/unsupported user outputs first.
3. Patch A-grade abstract wording only in small, high-exposure batches.
4. Keep side-card JSON and lesson JSON untouched.

## Generated files

- TSV: .tmp/interpretation_analysis_coverage_candidates_v322_a2.tsv
- MD: docs/quality/interpretation_analysis_coverage_v322_a2.md

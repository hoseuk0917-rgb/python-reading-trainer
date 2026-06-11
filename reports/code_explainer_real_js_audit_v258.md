# V258 실제 JS 코드해석 감사 리포트

- app_version: `20260611_v258_a1`
- audit_scope: 실제 `src/pwa/*.js` 핵심 파일을 코드해석기에 입력해 함수 추출/표시/흐름도/관련카드 반응을 점검
- generated_by: `tools/audit_code_explainer_real_js_v258.js`

## 1. 요약

| file | 후보 함수 | 표시 함수 | 표시율 | 함수 섹션 | Mermaid | 관련카드 |
|---|---:|---:|---:|---|---|---|
| src/pwa/app.js | 123 | 10 | 8% | Y | Y | Y |
| src/pwa/code_explainer.js | 106 | 12 | 11% | Y | Y | Y |
| src/pwa/project_analyzer.js | 56 | 12 | 21% | Y | Y | Y |
| src/pwa/code_explainer_rules.js | 54 | 9 | 17% | Y | Y | Y |

## 2. 파일별 상세

### src/pwa/app.js

- lines: `3165`
- chars: `107202`
- candidate_functions: `123`
- shown_in_output: `10`
- covered_kinds: `function`

#### 표시된 후보 함수

| name | kind | line |
|---|---|---:|
| withDataVersion | function | 2 |
| loadProgress | function | 122 |
| saveProgress | function | 139 |
| normalizeAnswer | function | 143 |
| getSideCardById | function | 150 |
| loadSideSeen | function | 158 |
| saveSideSeen | function | 170 |
| markSideSeen | function | 174 |
| getBonusSideCards | function | 180 |
| normalizeResourceText | function | 212 |

#### 화면에 보이지 않은 후보 함수

| name | kind | line |
|---|---|---:|
| getExternalResourceMatches | function | 216 |
| renderExternalResources | function | 289 |
| getCurrentCard | function | 350 |
| setView | function | 354 |
| renderCard | function | 383 |
| renderMobileSideTeaser | function | 419 |
| getSideText | function | 447 |
| getSideDetail | function | 451 |
| getFullText | function | 465 |
| closeOtherItems | function | 480 |
| renderSideCards | function | 562 |
| getSideText | function | 590 |
| getSideDetail | function | 594 |
| makeSectionTitle | function | 608 |
| makeSideCard | function | 627 |
| pickRandomBackgroundCard | function | 677 |

#### 패턴 신호

- source_has_arrow: `false`
- source_has_async: `true`
- source_has_fetch: `true`
- source_has_try_catch: `true`
- source_has_dom_event: `true`
- source_has_json: `true`
- output_has_function_section: `true`
- output_has_mermaid: `true`
- output_has_related_cards: `true`

#### 추천 보강 방향

- 후보 함수 일부가 화면 해석 결과에 보이지 않는다. 함수 표시 상한 또는 미지원 패턴 가능성.
- DOM/event 패턴이 원문에 있으나 개념 표시가 약하다.

### src/pwa/code_explainer.js

- lines: `2993`
- chars: `101972`
- candidate_functions: `106`
- shown_in_output: `12`
- covered_kinds: `function`

#### 표시된 후보 함수

| name | kind | line |
|---|---|---:|
| el | function | 188 |
| updateLanguageHint | function | 192 |
| languageLabel | function | 222 |
| getDetectionReasons | function | 247 |
| add | function | 251 |
| renderDetectionDetails | function | 351 |
| riskLabel | function | 369 |
| confidenceLabel | function | 377 |
| confidenceClass | function | 383 |
| escapeHtml | function | 389 |
| normalizeSearchText | function | 397 |
| extractRelatedKeywords | function | 402 |

#### 화면에 보이지 않은 후보 함수

| name | kind | line |
|---|---|---:|
| scoreSideCardForKeywords | function | 438 |
| findRelatedCards | function | 473 |
| renderRelatedCards | function | 500 |
| renderStepMeta | function | 546 |
| shouldShowRiskOnly | function | 562 |
| getVisibleSteps | function | 567 |
| renderLongStepNoticeElement | function | 575 |
| renderStepItem | function | 611 |
| renderSteps | function | 629 |
| renderWarnings | function | 665 |
| countByValue | function | 685 |
| formatCountSummary | function | 696 |
| getSourceStats | function | 711 |
| splitFunctionParamsV251 | function | 732 |
| pythonIndentLengthV251 | function | 741 |
| stripPythonCommentV251 | function | 746 |

#### 패턴 신호

- source_has_arrow: `true`
- source_has_async: `true`
- source_has_fetch: `true`
- source_has_try_catch: `true`
- source_has_dom_event: `true`
- source_has_json: `false`
- output_has_function_section: `true`
- output_has_mermaid: `true`
- output_has_related_cards: `true`

#### 추천 보강 방향

- 후보 함수 일부가 화면 해석 결과에 보이지 않는다. 함수 표시 상한 또는 미지원 패턴 가능성.
- arrow function 후보가 있으나 해석 결과에 충분히 반영되지 않은 것으로 보인다.
- try/catch 원문 대비 개념 표시가 약하다.

### src/pwa/project_analyzer.js

- lines: `1463`
- chars: `56725`
- candidate_functions: `56`
- shown_in_output: `12`
- covered_kinds: `function`

#### 표시된 후보 함수

| name | kind | line |
|---|---|---:|
| el | function | 8 |
| escapeHtml | function | 12 |
| quotePowerShellSingle | function | 20 |
| probePythonCode | function | 24 |
| buildProbeCommand | function | 439 |
| getLineValue | function | 494 |
| parseMarkdownCount | function | 500 |
| parseEnvironmentAudit | function | 507 |
| normalizeJsonCounts | function | 521 |
| normalizeJsonEnvironment | function | 531 |
| parseProjectReportJson | function | 547 |
| parseProbeOutput | function | 594 |

#### 화면에 보이지 않은 후보 함수

| name | kind | line |
|---|---|---:|
| extractMermaid | function | 643 |
| statusLabel | function | 662 |
| renderRoleCounts | function | 668 |
| renderEnvironmentAudit | function | 682 |
| buildRecommendations | function | 698 |
| renderProjectMermaid | function | 720 |
| objectEntries | function | 755 |
| renderDataSection | function | 760 |
| renderKeyFiles | function | 773 |
| candidateBundleDisplayLabel | function | 784 |
| renderCandidateBundles | function | 794 |
| inferBridgeSnippetLanguage | function | 803 |
| buildProjectCodeBridgeSnippet | function | 811 |
| encodeProjectCodeBridgePayload | function | 849 |
| decodeProjectCodeBridgePayload | function | 859 |
| findProjectCodeBridgeSnippet | function | 867 |

#### 패턴 신호

- source_has_arrow: `true`
- source_has_async: `true`
- source_has_fetch: `false`
- source_has_try_catch: `true`
- source_has_dom_event: `true`
- source_has_json: `true`
- output_has_function_section: `true`
- output_has_mermaid: `true`
- output_has_related_cards: `true`

#### 추천 보강 방향

- 후보 함수 일부가 화면 해석 결과에 보이지 않는다. 함수 표시 상한 또는 미지원 패턴 가능성.
- arrow function 후보가 있으나 해석 결과에 충분히 반영되지 않은 것으로 보인다.
- try/catch 원문 대비 개념 표시가 약하다.

### src/pwa/code_explainer_rules.js

- lines: `3046`
- chars: `143184`
- candidate_functions: `54`
- shown_in_output: `9`
- covered_kinds: `function`

#### 표시된 후보 함수

| name | kind | line |
|---|---|---:|
| stripFence | function | 4 |
| cleanLine | function | 15 |
| isBlankOrComment | function | 19 |
| isStructuralOnlyLine | function | 34 |
| detectLanguage | function | 49 |
| riskOf | function | 137 |
| confidenceForStep | function | 198 |
| confidenceLabel | function | 220 |
| makeStep | function | 227 |

#### 화면에 보이지 않은 후보 함수

| name | kind | line |
|---|---|---:|
| logicalLines | function | 240 |
| explainPowerShellLine | function | 276 |
| explainPythonLine | function | 601 |
| explainJavaScriptLine | function | 920 |
| explainPackageJsonLine | function | 1378 |
| explainGitHubActionsLine | function | 1407 |
| explainDockerfileLine | function | 1445 |
| explainEnvFileLine | function | 1478 |
| explainRequirementsLine | function | 1493 |
| explainPyprojectLine | function | 1510 |
| explainYamlLine | function | 1536 |
| explainMarkdownLine | function | 1556 |
| explainGitignoreLine | function | 1586 |
| explainIniLine | function | 1606 |
| explainTomlLine | function | 1623 |
| explainJavaLine | function | 1660 |

#### 패턴 신호

- source_has_arrow: `true`
- source_has_async: `true`
- source_has_fetch: `false`
- source_has_try_catch: `true`
- source_has_dom_event: `true`
- source_has_json: `false`
- output_has_function_section: `true`
- output_has_mermaid: `true`
- output_has_related_cards: `true`

#### 추천 보강 방향

- 후보 함수 일부가 화면 해석 결과에 보이지 않는다. 함수 표시 상한 또는 미지원 패턴 가능성.
- arrow function 후보가 있으나 해석 결과에 충분히 반영되지 않은 것으로 보인다.
- try/catch 원문 대비 개념 표시가 약하다.

## 3. 결론

- V258은 기능 추가보다 실제 프로젝트 파일 대상 감사 리포트 생성에 초점을 둔다.
- 이 리포트의 `화면에 보이지 않은 후보 함수` 목록이 다음 V259 보강 후보가 된다.
- 특히 표시 상한, 객체 리터럴 메서드, 이벤트 콜백, 대형 파일 요약 품질을 다음 단계에서 볼 수 있다.

V258_REAL_JS_AUDIT_OK

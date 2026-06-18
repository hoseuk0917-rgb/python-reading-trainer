# V323-A3 project_analyzer PWA runtime sample audit

## Purpose

Runs a synthetic PWA project report through ProjectAnalyzer.parseProbeOutput, cross-file link building, and renderProbeAnalysis before deciding whether to patch PWA detection.

## Summary

- total checks: 5
- PASS: 3
- WARN: 2
- decision: PATCH_CANDIDATE

## Checks

| check | status | evidence |
|---|---|---|
| project_analyzer_export | PASS | ProjectAnalyzer exported |
| parse_synthetic_pwa_json | PASS | inputMode=json; root=D:/sample/pwa-app |
| cross_file_links_include_pwa_assets | WARN | links=2; manifestLink=false; swLink=true |
| render_includes_pwa_assets_without_object_leak | PASS | manifestRendered=true; swRendered=true; pwaWord=true; objectLeak=false |
| source_has_explicit_pwa_semantic_detection | WARN | sourceHasPwaSemantic=false |

## Details

### project_analyzer_export

- status: PASS
- evidence: ProjectAnalyzer exported

buildCodeBridgeSnippet, buildCrossFileLinksV265, buildProbeCommand, enrichCrossFileLinksWithEvidenceV271, filterCrossFileLinksByFocusV269, filterCrossFileLinksV266, getCrossFileAvailableFilesV269, getCrossFileFocusV269, groupCrossFileLinksV267, parseProbeOutput, refresh, renderCrossFileDetailPanelV271, renderProbeAnalysis, setCrossFileFocusV269

### parse_synthetic_pwa_json

- status: PASS
- evidence: inputMode=json; root=D:/sample/pwa-app

keyFiles=index.html, manifest.webmanifest, sw.js, src/pwa/app.js, package.json

### cross_file_links_include_pwa_assets

- status: WARN
- evidence: links=2; manifestLink=false; swLink=true

[{"from":"index.html","to":"src/pwa/app.js","symbol":"src/pwa/app.js","kind":"file-reference","count":1,"confidence":"high","reason":"명확한 파일 간 연결 신호"},{"from":"src/pwa/app.js","to":"sw.js","symbol":"sw.js","kind":"file-reference","count":1,"confidence":"high","reason":"명확한 파일 간 연결 신호"}]

### render_includes_pwa_assets_without_object_leak

- status: PASS
- evidence: manifestRendered=true; swRendered=true; pwaWord=true; objectLeak=false

<div class="project-summary-grid"><div class="summary-card"><div class="summary-num">6</div><div class="summary-label">파일 수</div></div><div class="summary-card"><div class="summary-num">-</div><div class="summary-label">lesson 파일</div></div><div class="summary-card"><div class="summary-num">-</div><div class="summary-label">side 파일</div></div><div class="summary-card"><div class="summary-num">-</div><div class="summary-label">lesson 카드</div></div></div> 
<div class="project-detail-section"><h3>기본 상태</h3><p><strong>Root:</strong> D:/sample/pwa-app</p><p><strong>Git:</strong> sample-pwa-runtime-audit</p><p><strong>Status:</strong> clean</p><p><strong>입력 방식:</strong> json</p></div><div class="project-detail-section"><h3>환경 감사</h3><div class="project-env-list"><div class="project-env-row"><strong>Python</strong><span>python</span></div><div class="project-env-row"><strong>Git</strong><span>git version sample</span></div><div class="project-env-row"><strong>Node</strong><span>v22</span></div><div class="project-env-row"><strong>pip</strong><span>pip sample</span></div><div class="project-env-row"><strong>필요 pip 패키지</strong><span>none</span></div><div class="project-env-row"><strong>표준 라이브러리만 사용</strong><span>true</span></div></div></div><div class="project-detail-section"><h3>역할별 파일 수</h3><div class="project-mini-grid"><div class="project-mini-card"><strong>1</strong><span>html_entry</span></div><div class="project-mini-card"><strong>2</strong><span>pwa_app</span></div><div class="project-mini-card"><strong>2</strong><span>json_config_or_data</span></div><div class="project-mini-card"><strong>1</strong><span>source_or_script</span></div></div></div><div class="project-detail-section"><h3>함수 호출 후보</h3><p>호출 후보가 감지된 파일 수: 2</p></div><div class="project-detail-section project-usage-hint"><h3>붙여넣기 품질 안내</h3><div class="project-hint-grid"><div class="project-hint-card"><strong>현재 입력</strong><span>JSON report 전체</span></div><div class="project-hint-card"><strong>추천 입력</strong><span>project_probe_v199.json 전체 붙여넣기</span></div><div class="project-hint-card"><strong>왜 필요한가</strong><span>핵심 파일, 함수/클래스, 호출 후보, 참조 후보를 더 정확히 볼 수 있습니다.</span></div></div><p class="muted">JSON repor

### source_has_explicit_pwa_semantic_detection

- status: WARN
- evidence: sourceHasPwaSemantic=false

Runtime can render provided PWA files, but source does not appear to explicitly detect manifest/service-worker semantics from generic project contents.

## Decision

ProjectAnalyzer can render provided PWA files, but explicit PWA semantic detection is still missing. A narrow V323 patch should add manifest/service-worker detection or labeling only after confirming the intended UI location.

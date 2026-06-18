# V323-A2 explainer warning triage audit

## Purpose

Triages the three WARN items from V323-A1 before making functional patches.

## Version

- app version observed: 20260618_v322_a4b4a

## Summary

- total warnings triaged: 3
- LIKELY_AUDIT_GAP: 1
- NEEDS_RUNTIME_SAMPLE: 2

## Triage table

| area | warning | verdict | next action | evidence |
|---|---|---|---|---|
| code_explainer | python_file_api_rules_missing_with_open | LIKELY_AUDIT_GAP | Replace literal token check with runtime sample audit for with open / requests / json / csv / Path. | withOpen=true; openEvidence=true; requests=true; dataApis=true |
| project_analyzer | pwa_manifest_service_worker_missing_literals | NEEDS_RUNTIME_SAMPLE | Run a synthetic PWA file-map through project_analyzer before patching. | manifest=false; serviceWorker=false; pwa=true |
| ui_renderer | object_stringification_risk_scan_triage | NEEDS_RUNTIME_SAMPLE | Create a V323-A3 DOM/render sample audit before patching renderer code. | candidates=22; reviewNeeded=20 |

## Details

### python_file_api_rules_missing_with_open

- area: code_explainer
- verdict: LIKELY_AUDIT_GAP
- next action: Replace literal token check with runtime sample audit for with open / requests / json / csv / Path.
- evidence: withOpen=true; openEvidence=true; requests=true; dataApis=true

56:if (/"scripts"\s*:\s*\{/.test(text) && /"(dependencies|devDependencies)"\s*:/.test(text)) return "package_json"; || 60:if (/\benv\.(DB|KV|R2|AI)\b/.test(text) || /Response\.json/.test(text) || /ctx\.waitUntil|caches\.default/.test(text)) return "workers"; || 62:if (/Set-Location|Copy-Item|Remove-Item|Compress-Archive|Expand-Archive|Get-Date|New-Item|Test-Path|Select-String/i.test(text)) return "powershell"; || 302:if (/Test-Path/i.test(value)) { || 308:if (/Join-Path/i.test(value)) { || 313:// POWERSHELL_CSV_PIPELINE_RULES_V215_A1 || 314:if (/Import-Csv/i.test(value)) { || 315:return makeStep(lineNo, t, "CSV 읽기 결과 저장", "$" + name + " 변수에 CSV 파일을 읽은 표 형태 데이터를 저장합니다. CSV 첫 줄은 보통 열 이름으로 쓰이고, 이후 파이프라인에서 그룹/정렬/선택 처리를 할 수 있습니다.", risk); || 317:if (/Group-Object|Sort-Object|Select-Object|Export-Csv/i.test(value)) { || 318:return makeStep(lineNo, t, "CSV 파이프라인 요약 저장", "$" + name + " 변수에 CSV 데이터를 파이프라인으로 넘겨 그룹, 정렬, 선택 같은 처리를 한 결과를 저장합니다. 어느 열을 기준으로 묶고 정렬하는지 확인해야 합니다.", risk); || 321:if (/ConvertFrom-Json|ConvertTo-Json/i.test(value)) { || 322:return makeStep(lineNo, t, "JSON 처리 결과 저장", "$" + name + " 변수에 JSON을 PowerShell 객체로 바꾸거나 객체를 JSON 문자열로 바꾼 결과를 저장합니다.", risk); || 342:return makeStep(lineNo, t, "입력 파라미터 정의", "스크립트를 실행할 때 받을 입력값을 정의합니다. 예: -Path, -Port 같은 옵션을 명확히 정할 수 있습니다.", risk); || 349:return makeStep(lineNo, t, "PowerShell 객체 만들기", "여러 속성을 가진 사용자 정의 객체를 만들기 시작합니다. 보고서 행이나 JSON 변환용 데이터를 구성할 때 자주 씁니다.", risk); || 361:return makeStep(lineNo, t, "여러 줄 문자열 경계", "here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다.", risk); || 363:if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t) && /\bExport-Csv\b/i.test(t)) { || 364:return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk); || 379:// POWERSHELL_CONVERT_JSON_SET_CONTENT_V205_FIX || 380:if (/\bConvertTo-Json\b/i.test(t) && /\|\s*Set-Content\b/i.test(t)) { || 381:return makeStep(lineNo, t, "객체를 JSON으로 변환 후 파일 저장", "PowerShell 객체를 JSON 문자열로 바꾼 뒤 파일에 저장합니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있고, Set-Content는 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk); || 407:if (/\bConvertFrom-Json\b/i.test(t)) { || 408:return makeStep(lineNo, t, "JSON을 객체로 변환", "JSON 문자열을 PowerShell 객체로 바꿔서 속성처럼 접근할 수 있게 합니다.", risk); || 410:if (/\bConvertTo-Json\b/i.test(t)) { || 411:return makeStep(lineNo, t, "객체를 JSON으로 변환", "PowerShell 객체를 JSON 문자열로 바꿉니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있습니다.", risk); || 413:if (/\bImport-Csv\b/i.test(t)) { || 414:return makeStep(lineNo, t, "CSV 읽기", "CSV 파일을 행 단위 객체 목록으로 읽습니다. 첫 줄은 보통 컬럼명으로 사용됩니다.", risk); || 416:if (/\bExport-Csv\b/i.test(t)) { || 417:return makeStep(lineNo, t, "CSV 저장", "PowerShell 객체 목록을 CSV 파일로 저장합니다. -NoTypeInformation 여부와 인코딩을 확인합니다.", risk); || 419:if (/\bConvertFrom-Csv\b/i.test(t)) { || 420:return makeStep(lineNo, t, "CSV 문자열 변환", "CSV 형식 문자열을 PowerShell 객체 목록으로 바꿉니다.", risk);

### pwa_manifest_service_worker_missing_literals

- area: project_analyzer
- verdict: NEEDS_RUNTIME_SAMPLE
- next action: Run a synthetic PWA file-map through project_analyzer before patching.
- evidence: manifest=false; serviceWorker=false; pwa=true

46:"KEY_FILES = ['index.html', 'src/pwa/index.html', 'src/pwa/app.js', 'src/pwa/code_explainer.js', 'src/pwa/code_explainer_rules.js', 'src/pwa/project_analyzer.js', 'src/pwa/style.css', 'tools/validate_lessons.py', 'tools/code_explainer_smoke_v171.js']", || 86:"    if r in ['src/pwa/app.js', 'src/pwa/code_explainer.js', 'src/pwa/code_explainer_rules.js', 'src/pwa/project_analyzer.js']:", || 87:"        return 'pwa_core_js'", || 88:"    if r in ['src/pwa/index.html', 'index.html']:", || 90:"    if r == 'src/pwa/style.css':", || 252:"        elif rel_path.startswith('src/pwa/'):", || 253:"            role = 'pwa_app'", || 331:"mermaid_lines = ['flowchart TD', '  ROOT[project root]', '  ROOT --> PWA[src/pwa]', '  ROOT --> DATA[data]', '  ROOT --> TOOLS[tools]', '  PWA --> APP[app.js]', '  PWA --> CE[code_explainer.js]', '  PWA --> PA[project_analyzer.js]', '  PWA --> RULES[code_explainer_rules.js]', '  PWA --> STYLE[style.css]', '  DATA --> LESSONS[lessons JSON]', '  DATA --> SIDES[side_cards JSON]', '  TOOLS --> VALIDATE[validate/smoke/verify]', '  CE --> RULES', '  PA --> TOOLS', '  APP --> LESSONS', '  APP --> SIDES']", || 336:"    if p == 'src/pwa/app.js':", || 338:"    if p == 'src/pwa/code_explainer.js':", || 340:"    if p == 'src/pwa/code_explainer_rules.js':", || 342:"    if p == 'src/pwa/project_analyzer.js':", || 344:"    if p.startswith('src/pwa/'):", || 369:"    'candidate_bundles': {'code_explainer_diagram': ['src/pwa/index.html', 'src/pwa/code_explainer.js', 'src/pwa/code_explainer_rules.js', 'src/pwa/style.css'], 'project_analyzer': ['src/pwa/index.html', 'src/pwa/project_analyzer.js', 'src/pwa/style.css'], 'learning_card_data': ['data/lessons', 'data/side_cards', 'tools/validate_lessons.py'], 'verification_smoke': verify_files},", || 715:items.push("코드해석/다이어그램 수정 시 src/pwa/index.html, code_explainer.js, code_explainer_rules.js, style.css, smoke/verify 스크립트를 같이 봐야 합니다."); || 1024:if (p === "src/pwa/app.js") return 0; || 1025:if (p === "src/pwa/code_explainer.js") return 1; || 1026:if (p === "src/pwa/code_explainer_rules.js") return 2; || 1027:if (p === "src/pwa/project_analyzer.js") return 3; || 1028:if (p.startsWith("src/pwa/")) return 4; || 1239:normalizeProjectPathV265("src/pwa/" + normalized.replace(/^src\/pwa\//, "")), || 1333:lines.push('  ' + idFor(file) + '["' + file.replace("src/pwa/", "") + '"]'); || 1598:escapeHtml(filePath.replace("src/pwa/", "")) + || 1758:return item.filePath.replace("src/pwa/", "") + " " + item.count; || 1806:const label = file.replace("src/pwa/", ""); || 1924:["프로젝트분석", ["src/pwa/index.html", "src/pwa/project_analyzer.js", "src/pwa/style.css", "tools/verify_project_analyzer_v198.py"]], || 1925:["코드해석/다이어그램", ["src/pwa/code_explainer.js", "src/pwa/code_explainer_rules.js", "tools/code_explainer_smoke_v171.js"]], || 1927:["버전/배포", ["index.html", "src/pwa/index.html", "src/pwa/app.js"]]

### object_stringification_risk_scan_triage

- area: ui_renderer
- verdict: NEEDS_RUNTIME_SAMPLE
- next action: Create a V323-A3 DOM/render sample audit before patching renderer code.
- evidence: candidates=22; reviewNeeded=20

code_explainer:523:NEEDS_RUNTIME_SAMPLE:title.textContent = card.title || card.id || "사이드카드"; || code_explainer:527:NEEDS_RUNTIME_SAMPLE:body.textContent = card.body || card.summary || card.description || ""; || code_explainer:533:NEEDS_RUNTIME_SAMPLE:summary.textContent = "자세히 보기"; || code_explainer:536:NEEDS_RUNTIME_SAMPLE:detailBody.textContent = card.detail || card.body || ""; || code_explainer:682:NEEDS_RUNTIME_SAMPLE:item.textContent = "line " + step.lineNo + " · " + riskLabel(step.risk) + " · " + step.title + " · " + step.code; || code_explainer:3363:NEEDS_RUNTIME_SAMPLE:box.innerHTML = rendered && rendered.svg ? rendered.svg : '<p class="muted">렌더링 결과가 비어 있습니다.</p>'; || code_explainer:4134:NEEDS_RUNTIME_SAMPLE:box.innerHTML = rendered && rendered.svg ? rendered.svg : ""; || code_explainer:4732:INTENTIONAL_SVG_HTML:diagram.innerHTML = result.svg; || code_explainer:4814:NEEDS_RUNTIME_SAMPLE:summary.innerHTML = '<strong>' + languageLabel(result.language) + '</strong><br>' + || code_explainer:4888:NEEDS_RUNTIME_SAMPLE:summary.textContent = "아직 분석한 코드가 없습니다."; || code_explainer:4892:NEEDS_RUNTIME_SAMPLE:warnings.textContent = "위험 명령이 감지되면 여기에 표시됩니다."; || code_explainer:4894:NEEDS_RUNTIME_SAMPLE:if (steps) steps.innerHTML = ""; || code_explainer:5002:NEEDS_RUNTIME_SAMPLE:body.innerHTML = svg; || project_analyzer:758:INTENTIONAL_SVG_HTML:diagram.innerHTML = result.svg; || project_analyzer:2045:NEEDS_RUNTIME_SAMPLE:summary.innerHTML = || project_analyzer:2168:NEEDS_RUNTIME_SAMPLE:summary.textContent = "아직 분석 결과가 없습니다."; || command_explainer:1146:NEEDS_RUNTIME_SAMPLE:box.innerHTML = result.warnings.map(function(step) { || command_explainer:1896:NEEDS_RUNTIME_SAMPLE:box.innerHTML = dangerGuideHtmlV286 + safetyChecklistHtmlV290 + actionGuideHtmlV285 + result.steps.map(function(step, index) { || command_explainer:1924:NEEDS_RUNTIME_SAMPLE:box.innerHTML = result.nextChecks.map(function(check) { || command_explainer:1989:NEEDS_RUNTIME_SAMPLE:summary.textContent = "아직 분석한 명령어가 없습니다."; || command_explainer:1993:NEEDS_RUNTIME_SAMPLE:warnings.textContent = "위험 명령이 감지되면 여기에 표시됩니다."; || command_explainer:1995:NEEDS_RUNTIME_SAMPLE:if (steps) steps.innerHTML = "";

## Decision

- Do not make more wording-only command patches from V323-A1.
- Treat code_explainer file API warning as an audit design issue unless a runtime sample fails.
- Treat project_analyzer PWA warning as the strongest functional candidate for the next runtime audit.
- Treat object-stringification warning as a UI render-sample candidate, not an immediate patch.

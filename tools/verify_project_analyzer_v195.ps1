param(
  [string]$Version = "20260606_v195_a1",
  [int]$Port = 5173,
  [string]$ReportPath = ".tmp\code_explainer_smoke_report_v195_a1.json",
  [switch]$SkipLocalHttp
)

$ErrorActionPreference = "Stop"

function Invoke-Step {
  param(
    [string]$Name,
    [scriptblock]$Block
  )

  Write-Host ""
  Write-Host "=== $Name ==="
  & $Block

  if ($LASTEXITCODE -ne $null -and $LASTEXITCODE -ne 0) {
    throw "$Name failed with exit code $LASTEXITCODE"
  }
}

function Assert-Contains {
  param(
    [string]$Path,
    [string]$Needle,
    [string]$Name
  )

  $text = Get-Content $Path -Raw -Encoding UTF8

  if (-not $text.Contains($Needle)) {
    throw "STATIC_CHECK_FAIL $Name"
  }

  Write-Host "STATIC_OK $Name"
}

function Get-ReportCount {
  param(
    [object]$Counts,
    [string]$Name
  )

  if ($null -eq $Counts) {
    return 0
  }

  $prop = $Counts.PSObject.Properties[$Name]
  if ($null -eq $prop) {
    return 0
  }

  return [int]$prop.Value
}

Invoke-Step "node syntax code_explainer_rules.js" {
  node --check .\src\pwa\code_explainer_rules.js
}

Invoke-Step "node syntax code_explainer.js" {
  node --check .\src\pwa\code_explainer.js
}

Invoke-Step "node syntax project_analyzer.js" {
  node --check .\src\pwa\project_analyzer.js
}

Invoke-Step "node syntax smoke script" {
  node --check .\tools\code_explainer_smoke_v171.js
}

Invoke-Step "lesson validation" {
  python tools/validate_lessons.py --expected-app-version $Version --expected-lesson-cards 1785
}

Invoke-Step "code explainer smoke samples with report" {
  if (-not (Test-Path ".tmp")) {
    New-Item -ItemType Directory -Force ".tmp" | Out-Null
  }

  node .\tools\code_explainer_smoke_v171.js --report $ReportPath
}

Write-Host ""
Write-Host "=== static markers ==="
Assert-Contains ".\src\pwa\app.js" $Version "APP_VERSION"
Assert-Contains ".\src\pwa\index.html" "code_explainer.js?v=$Version" "UI_SCRIPT_VERSION"
Assert-Contains ".\src\pwa\index.html" 'id="codeExplainerVersion" class="badge">V195</span>' "BADGE_V195"

Assert-Contains ".\src\pwa\index.html" "codeDetectionDetails" "DETECTION_DETAILS_BOX"
Assert-Contains ".\src\pwa\code_explainer.js" "function getDetectionReasons" "DETECTION_REASON_FUNCTION"
Assert-Contains ".\src\pwa\code_explainer.js" "function renderDetectionDetails" "DETECTION_RENDER_FUNCTION"
Assert-Contains ".\src\pwa\code_explainer.js" "detectionReasons" "DETECTION_REPORT_DATA"
Assert-Contains ".\src\pwa\style.css" "CODE EXPLAINER DETECTION UX V185-A2 START" "DETECTION_UX_CSS"

Assert-Contains ".\src\pwa\index.html" "codeStructureOverview" "STRUCTURE_OVERVIEW_BOX"
Assert-Contains ".\src\pwa\code_explainer.js" "LONG_CODE_OVERVIEW_V186_A3" "LONG_CODE_OVERVIEW"
Assert-Contains ".\src\pwa\code_explainer.js" "function getSourceStats" "SOURCE_STATS_FUNCTION"
Assert-Contains ".\src\pwa\code_explainer.js" "function buildLongCodeOverview" "BUILD_LONG_OVERVIEW_FUNCTION"
Assert-Contains ".\src\pwa\code_explainer.js" "function extractCodeOutline" "EXTRACT_CODE_OUTLINE_FUNCTION"
Assert-Contains ".\src\pwa\code_explainer.js" "function renderStructureOverview" "RENDER_STRUCTURE_OVERVIEW_FUNCTION"
Assert-Contains ".\src\pwa\code_explainer.js" "TEXT_REPORT_LONG_OVERVIEW_V187_A2" "TEXT_REPORT_LONG_OVERVIEW"
Assert-Contains ".\src\pwa\style.css" "CODE EXPLAINER LONG OVERVIEW V186-A3 START" "LONG_OVERVIEW_CSS"\nAssert-Contains ".\src\pwa\code_explainer_rules.js" "MERMAID_FLOW_QUALITY_V191_A1" "MERMAID_FLOW_QUALITY"\nAssert-Contains ".\src\pwa\code_explainer_rules.js" "function mermaidNodeLine" "MERMAID_NODE_LINE_FUNCTION"\nAssert-Contains ".\src\pwa\code_explainer_rules.js" "function mermaidClassForStep" "MERMAID_CLASS_FUNCTION"\nAssert-Contains ".\tools\code_explainer_smoke_v171.js" "MERMAID_FLOW_SMOKE_V191_A1" "MERMAID_FLOW_SMOKE"\nAssert-Contains ".\tools\code_explainer_smoke_v171.js" "mustMermaidContain" "MERMAID_ASSERTION"\nAssert-Contains ".\src\pwa\index.html" "DIAGRAM_UX_V192_A1" "DIAGRAM_UX_HTML"\nAssert-Contains ".\src\pwa\index.html" "diagramLargeModal" "DIAGRAM_LARGE_MODAL"\nAssert-Contains ".\src\pwa\index.html" "downloadDiagramSvgBtn" "DIAGRAM_DOWNLOAD_BUTTON"\nAssert-Contains ".\src\pwa\code_explainer.js" "DIAGRAM_EXPORT_UX_V192_A1" "DIAGRAM_EXPORT_UX"\nAssert-Contains ".\src\pwa\code_explainer.js" "function downloadDiagramSvg" "DIAGRAM_DOWNLOAD_FUNCTION"\nAssert-Contains ".\src\pwa\code_explainer.js" "function openLargeDiagram" "DIAGRAM_LARGE_FUNCTION"\nAssert-Contains ".\src\pwa\style.css" "DIAGRAM_EXPORT_UX_V192_A1 START" "DIAGRAM_EXPORT_CSS"\nAssert-Contains ".\src\pwa\index.html" "data-view=\"project\"" "PROJECT_ANALYZER_TAB"\nAssert-Contains ".\src\pwa\index.html" "projectRootInput" "PROJECT_ROOT_INPUT"\nAssert-Contains ".\src\pwa\index.html" "project_analyzer.js?v=$Version" "PROJECT_ANALYZER_SCRIPT"\nAssert-Contains ".\src\pwa\app.js" "window.ProjectAnalyzer" "PROJECT_ANALYZER_APP_REFRESH"\nAssert-Contains ".\src\pwa\project_analyzer.js" "PROJECT_ANALYZER_VERSION" "PROJECT_ANALYZER_VERSION"\nAssert-Contains ".\src\pwa\project_analyzer.js" "function buildProbeCommand" "PROJECT_BUILD_COMMAND"\nAssert-Contains ".\src\pwa\project_analyzer.js" "function parseProbeOutput" "PROJECT_PARSE_OUTPUT"\nAssert-Contains ".\src\pwa\project_analyzer.js" "function renderProbeAnalysis" "PROJECT_RENDER_ANALYSIS"\nAssert-Contains ".\src\pwa\project_analyzer.js" "MERMAID_START" "PROJECT_MERMAID_OUTPUT"\nAssert-Contains ".\src\pwa\style.css" "PROJECT ANALYZER V195-A1 START" "PROJECT_ANALYZER_CSS"\nAssert-Contains ".\src\pwa\project_analyzer.js" "ENV_AUDIT_V194_A1" "PROJECT_ENV_AUDIT"\nAssert-Contains ".\src\pwa\project_analyzer.js" "$RequiredPipPackages" "PROJECT_PIP_PACKAGE_AUDIT"\nAssert-Contains ".\src\pwa\project_analyzer.js" "CALL_CANDIDATES_V194_A1" "PROJECT_CALL_CANDIDATES"\nAssert-Contains ".\src\pwa\project_analyzer.js" "function parseEnvironmentAudit" "PROJECT_ENV_PARSE"\nAssert-Contains ".\src\pwa\project_analyzer.js" "function renderEnvironmentAudit" "PROJECT_ENV_RENDER"\nAssert-Contains ".\src\pwa\style.css" "PROJECT ANALYZER ENV V195-A1 START" "PROJECT_ENV_CSS"\nAssert-Contains ".\src\pwa\project_analyzer.js" "JSON_REPORT_PARSE_V195_A1" "PROJECT_JSON_PARSE"\nAssert-Contains ".\src\pwa\project_analyzer.js" "function parseProjectReportJson" "PROJECT_JSON_PARSE_FUNCTION"\nAssert-Contains ".\src\pwa\project_analyzer.js" "function renderJsonReportSections" "PROJECT_JSON_RENDER_FUNCTION"\nAssert-Contains ".\src\pwa\project_analyzer.js" "function renderCallCandidateDetails" "PROJECT_CALL_DETAIL_RENDER"\nAssert-Contains ".\src\pwa\project_analyzer.js" "function renderReferenceDetails" "PROJECT_REF_RENDER"\nAssert-Contains ".\src\pwa\style.css" "PROJECT ANALYZER JSON REPORT V195-A1 START" "PROJECT_JSON_CSS"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "PYTHON_RISK_GUARD_V187_A2" "PYTHON_RISK_GUARD"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "PYTHON_ENTRY_ERROR_RULES_V187_A2" "PYTHON_ENTRY_ERROR_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "PYTHON_DEEP_RULES_V187_A2" "PYTHON_DEEP_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "PYTHON_META_GUARD_V187_A2" "PYTHON_META_GUARD"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "POWERSHELL_RISK_GUARD_V188_A2" "POWERSHELL_RISK_GUARD"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "POWERSHELL_VAR_RULES_V188_A2" "POWERSHELL_VAR_RULES"\nAssert-Contains ".\src\pwa\code_explainer_rules.js" "POWERSHELL_EARLY_PREF_RULE_V188_A2" "POWERSHELL_EARLY_PREF_RULE"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "POWERSHELL_DEEP_RULES_V188_A2" "POWERSHELL_DEEP_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "POWERSHELL_META_GUARD_V188_A2" "POWERSHELL_META_GUARD"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "JS_MODULE_DETECT_GUARD_V189_A2" "JS_MODULE_DETECT_GUARD"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "JS_WORKERS_RISK_GUARD_V189_A2" "JS_WORKERS_RISK_GUARD"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "WORKERS_STORAGE_QUEUE_RULES_V189_A2" "WORKERS_STORAGE_QUEUE_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "JS_WORKERS_DEEP_RULES_V189_A2" "JS_WORKERS_DEEP_RULES"\nAssert-Contains ".\src\pwa\code_explainer_rules.js" "JS_WORKERS_AWAIT_JSON_RULE_V189_A2" "JS_WORKERS_AWAIT_JSON_RULE"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "JS_WORKERS_META_GUARD_V189_A2" "JS_WORKERS_META_GUARD"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "JAVA_RISK_GUARD_V190_A2" "JAVA_RISK_GUARD"\nAssert-Contains ".\src\pwa\code_explainer_rules.js" "JAVA_DETECT_GUARD_V190_A2" "JAVA_DETECT_GUARD"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "JAVA_DEEP_RULES_V190_A2" "JAVA_DEEP_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "JAVA_METHOD_STREAM_RULES_V190_A2" "JAVA_METHOD_STREAM_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "JAVA_META_GUARD_V190_A2" "JAVA_META_GUARD"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "java_collection_stream_error_flow" "JAVA_DEEP_SMOKE_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "javascript_async_dom_array" "JAVASCRIPT_DEEP_SMOKE_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "workers_async_storage_queue" "WORKERS_DEEP_SMOKE_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "powershell_pipeline_json_process" "POWERSHELL_DEEP_SMOKE_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "python_error_csv_env_logging" "PYTHON_DEEP_SMOKE_SAMPLE"

Assert-Contains ".\tools\code_explainer_smoke_v171.js" "REPORT_WRITTEN" "SMOKE_REPORT_WRITER"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "markdown_readme_basic" "MARKDOWN_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "gitignore_basic" "GITIGNORE_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "ini_file_basic" "INI_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "toml_general_config" "TOML_SAMPLE"

if (-not (Test-Path $ReportPath)) {
  throw "REPORT_NOT_FOUND $ReportPath"
}

Write-Host ""
Write-Host "=== report summary ==="
$report = Get-Content $ReportPath -Raw -Encoding UTF8 | ConvertFrom-Json

if ($report.failed -ne 0) {
  throw "REPORT_HAS_FAILURES $($report.failed)"
}

$report.samples |
  Select-Object `
    name,
    language,
    stepCount,
    warningCount,
    flowSummary |
  Format-Table -AutoSize

Write-Host ""
Write-Host "=== report category/tag compact ==="
foreach ($sample in $report.samples) {
  $categories = ($sample.categoryKeyCounts.PSObject.Properties |
    Sort-Object Name |
    ForEach-Object { "$($_.Name):$($_.Value)" }) -join ", "

  $tags = ($sample.tagKeyCounts.PSObject.Properties |
    Sort-Object Name |
    ForEach-Object { "$($_.Name):$($_.Value)" }) -join ", "

  Write-Host "SAMPLE_REPORT $($sample.name)"
  Write-Host "  categories: $categories"
  Write-Host "  tags: $tags"
}

Write-Host ""
Write-Host "=== regression gates ==="

$processLimits = @{
  "javascript_dom_storage" = 0
  "workers_d1_api" = 0
  "workers_storage_cache_cors" = 2
  "java_basic_flow" = 1
  "python_argparse_path_subprocess" = 0
  "python_fastapi_endpoint" = 0
  "powershell_node_npm_flow" = 0
  "package_json_npm_scripts" = 0
  "github_actions_workflow" = 0
}

foreach ($sample in $report.samples) {
  if ($processLimits.ContainsKey($sample.name)) {
    $actual = Get-ReportCount $sample.categoryKeyCounts "process"
    $limit = [int]$processLimits[$sample.name]

    if ($actual -gt $limit) {
      throw "PROCESS_NOISE_TOO_HIGH $($sample.name) process=$actual limit=$limit"
    }

    Write-Host "PROCESS_GATE_OK $($sample.name) process=$actual limit=$limit"
  }
}

foreach ($sample in $report.samples) {
  if ($sample.name -eq "python_api_csv_loop") {
    $actual = Get-ReportCount $sample.categoryKeyCounts "error_handling"
    if ($actual -gt 0) {
      throw "CATEGORY_NOISE_TOO_HIGH $($sample.name) error_handling=$actual limit=0"
    }
    Write-Host "CATEGORY_GATE_OK $($sample.name) error_handling=$actual limit=0"
  }

  if ($sample.name -eq "python_argparse_path_subprocess") {
    $actual = Get-ReportCount $sample.categoryKeyCounts "database"
    if ($actual -gt 0) {
      throw "CATEGORY_NOISE_TOO_HIGH $($sample.name) database=$actual limit=0"
    }
    Write-Host "CATEGORY_GATE_OK $($sample.name) database=$actual limit=0"
  }

  if ($sample.name -eq "github_actions_workflow") {
    $actual = Get-ReportCount $sample.categoryKeyCounts "package_config"
    if ($actual -gt 0) {
      throw "CATEGORY_NOISE_TOO_HIGH $($sample.name) package_config=$actual limit=0"
    }
    Write-Host "CATEGORY_GATE_OK $($sample.name) package_config=$actual limit=0"
  }

  if ($sample.name -eq "yaml_general_services") {
    $actual = Get-ReportCount $sample.tagKeyCounts "unknown"
    if ($actual -gt 0) {
      throw "TAG_NOISE_TOO_HIGH $($sample.name) unknown=$actual limit=0"
    }
    Write-Host "TAG_GATE_OK $($sample.name) unknown=$actual limit=0"
  }

  if ($sample.name -in @("markdown_readme_basic", "gitignore_basic", "ini_file_basic", "toml_general_config")) {
    $actual = Get-ReportCount $sample.tagKeyCounts "unknown"
    if ($actual -gt 0) {
      throw "TAG_NOISE_TOO_HIGH $($sample.name) unknown=$actual limit=0"
    }
    Write-Host "TAG_GATE_OK $($sample.name) unknown=$actual limit=0"
  }
}

if (-not $SkipLocalHttp) {
  Write-Host ""
  Write-Host "=== local http assets ==="

  $server = $null

  try {
    $server = Start-Process `
      -FilePath "python" `
      -ArgumentList @("-m", "http.server", [string]$Port, "--bind", "127.0.0.1") `
      -PassThru `
      -WindowStyle Hidden

    Start-Sleep -Seconds 2

    $urls = @(
      "http://127.0.0.1:$Port/src/pwa/index.html?v=$Version",
      "http://127.0.0.1:$Port/src/pwa/app.js?v=$Version",
      "http://127.0.0.1:$Port/src/pwa/code_explainer.js?v=$Version",
      "http://127.0.0.1:$Port/src/pwa/project_analyzer.js?v=$Version",
      "http://127.0.0.1:$Port/src/pwa/code_explainer_rules.js?v=$Version",
      "http://127.0.0.1:$Port/src/pwa/style.css?v=$Version"
    )

    foreach ($url in $urls) {
      $response = Invoke-WebRequest -Uri $url -UseBasicParsing
      if ($response.StatusCode -ne 200) {
        throw "LOCAL_HTTP_BAD_STATUS $($response.StatusCode) $url"
      }

      Write-Host "LOCAL_OK 200 $url"
    }
  }
  finally {
    if ($null -ne $server -and -not $server.HasExited) {
      Stop-Process -Id $server.Id -Force
    }
  }
}

Write-Host ""
Write-Host "V195_PROJECT_ANALYZER_VERIFY_OK"

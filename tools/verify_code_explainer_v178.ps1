param(
  [string]$Version = "20260606_v178_a1",
  [int]$Port = 5173,
  [string]$ReportPath = ".tmp\code_explainer_smoke_report_v178.json",
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
  if ($text -notlike "*$Needle*") {
    throw "STATIC_CHECK_FAIL $Name"
  }
  Write-Host "STATIC_OK $Name"
}

Write-Host "VERIFY_VERSION $Version"
Write-Host "REPORT_PATH $ReportPath"

Invoke-Step "node syntax app.js" {
  node --check .\src\pwa\app.js
}

Invoke-Step "node syntax code_explainer_rules.js" {
  node --check .\src\pwa\code_explainer_rules.js
}

Invoke-Step "node syntax code_explainer.js" {
  node --check .\src\pwa\code_explainer.js
}

Invoke-Step "node syntax smoke script" {
  node --check .\tools\code_explainer_smoke_v171.js
}

Invoke-Step "lesson validation" {
  python tools/validate_lessons.py --expected-app-version $Version --expected-lesson-cards 1785
}

Invoke-Step "code explainer smoke samples with report" {
  node .\tools\code_explainer_smoke_v171.js --report $ReportPath
}

Write-Host ""
Write-Host "=== static markers ==="
Assert-Contains ".\src\pwa\app.js" $Version "APP_VERSION"
Assert-Contains ".\src\pwa\index.html" "code_explainer.js?v=$Version" "UI_SCRIPT_VERSION"
Assert-Contains ".\src\pwa\index.html" 'id="codeExplainerVersion" class="badge">V178</span>' "BADGE_V178"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "REPORT_WRITTEN" "SMOKE_REPORT_WRITER"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "categoryCounts" "CATEGORY_COUNTS"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "tagCounts" "TAG_COUNTS"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "categoryKeyCounts" "CATEGORY_KEY_COUNTS"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "tagKeyCounts" "TAG_KEY_COUNTS"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "python_argparse_path_subprocess" "PYTHON_ARGPARSE_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "python_fastapi_endpoint" "PYTHON_FASTAPI_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "powershell_node_npm_flow" "POWERSHELL_NODE_NPM_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "package_json_npm_scripts" "PACKAGE_JSON_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "github_actions_workflow" "GITHUB_ACTIONS_SAMPLE"

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
Write-Host "=== process noise gates ==="

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
    $limit = 0

    if ($actual -gt $limit) {
      throw "CATEGORY_NOISE_TOO_HIGH $($sample.name) error_handling=$actual limit=$limit"
    }

    Write-Host "CATEGORY_GATE_OK $($sample.name) error_handling=$actual limit=$limit"
  }
}

foreach ($sample in $report.samples) {
  if ($sample.name -eq "python_argparse_path_subprocess") {
    $actual = Get-ReportCount $sample.categoryKeyCounts "database"
    $limit = 0

    if ($actual -gt $limit) {
      throw "CATEGORY_NOISE_TOO_HIGH $($sample.name) database=$actual limit=$limit"
    }

    Write-Host "CATEGORY_GATE_OK $($sample.name) database=$actual limit=$limit"
  }

  if ($sample.name -eq "github_actions_workflow") {
    $actual = Get-ReportCount $sample.categoryKeyCounts "package_config"
    $limit = 0

    if ($actual -gt $limit) {
      throw "CATEGORY_NOISE_TOO_HIGH $($sample.name) package_config=$actual limit=$limit"
    }

    Write-Host "CATEGORY_GATE_OK $($sample.name) package_config=$actual limit=$limit"
  }
}


if (-not $SkipLocalHttp) {
  Write-Host ""
  Write-Host "=== local http assets ==="

  $root = "http://127.0.0.1:$Port"
  $urls = @(
    "$root/src/pwa/index.html?v=$Version",
    "$root/src/pwa/app.js?v=$Version",
    "$root/src/pwa/code_explainer.js?v=$Version",
    "$root/src/pwa/code_explainer_rules.js?v=$Version",
    "$root/src/pwa/style.css?v=$Version"
  )

  foreach ($url in $urls) {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing
    if ($response.StatusCode -ne 200) {
      throw "LOCAL_HTTP_FAIL $url"
    }
    Write-Host "LOCAL_OK $($response.StatusCode) $url"
  }
}

Write-Host ""
Write-Host "V178_CODE_EXPLAINER_VERIFY_OK"

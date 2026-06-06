param(
  [string]$Version = "20260606_v173_a2",
  [int]$Port = 5173,
  [string]$ReportPath = ".tmp\code_explainer_smoke_report_v173.json",
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
Assert-Contains ".\src\pwa\index.html" 'id="codeExplainerVersion" class="badge">V173</span>' "BADGE_V173"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "REPORT_WRITTEN" "SMOKE_REPORT_WRITER"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "categoryCounts" "CATEGORY_COUNTS"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "tagCounts" "TAG_COUNTS"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "categoryKeyCounts" "CATEGORY_KEY_COUNTS"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "tagKeyCounts" "TAG_KEY_COUNTS"

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
Write-Host "V173_CODE_EXPLAINER_VERIFY_OK"

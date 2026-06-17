$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

function Invoke-NativeChecked {
  param(
    [Parameter(Mandatory=$true)]
    [string]$Label,

    [Parameter(Mandatory=$true)]
    [scriptblock]$Command
  )

  & $Command
  if ($LASTEXITCODE -ne 0) {
    throw "$Label failed with exit code $LASTEXITCODE"
  }
}

$ExpectedVersion = "20260611_v321_a1"
$Marker = "QUALITY_RECOVERY_DOCS_HANDOFF_V321_A1"

Write-Host "=== V321 QUALITY RECOVERY DOCS VERIFY ==="

$required = @(
  "README.md",
  "docs\quality_recovery_v306_v320.md",
  "docs\handoff_20260617_python_reading_trainer_v320.md",
  "reports\explanation_medium_final_reaudit_v317.md",
  "reports\explanation_low_final_reaudit_v320.md"
)

foreach ($path in $required) {
  if (!(Test-Path $path)) {
    throw "missing required file: $path"
  }
  Write-Host "EXISTS_$path OK"
}

$rootIndex = Get-Content "index.html" -Raw -Encoding UTF8
$pwaIndex = Get-Content "src\pwa\index.html" -Raw -Encoding UTF8
$app = Get-Content "src\pwa\app.js" -Raw -Encoding UTF8
$readme = Get-Content "README.md" -Raw -Encoding UTF8
$quality = Get-Content "docs\quality_recovery_v306_v320.md" -Raw -Encoding UTF8
$handoff = Get-Content "docs\handoff_20260617_python_reading_trainer_v320.md" -Raw -Encoding UTF8

if (!$rootIndex.Contains($ExpectedVersion)) { throw "root index version missing" }
if (!$pwaIndex.Contains($ExpectedVersion)) { throw "pwa index version missing" }
if (!$app.Contains("const APP_DATA_VERSION = `"$ExpectedVersion`";")) { throw "app version missing" }

foreach ($text in @($readme, $quality, $handoff)) {
  if (!$text.Contains($Marker)) {
    throw "marker missing in docs"
  }
}

Invoke-NativeChecked "node check app" {
  node --check "src\pwa\app.js"
}

Invoke-NativeChecked "node check code explainer" {
  node --check "src\pwa\code_explainer.js"
}

Invoke-NativeChecked "node check command explainer" {
  node --check "src\pwa\command_explainer.js"
}

Invoke-NativeChecked "node check project analyzer" {
  node --check "src\pwa\project_analyzer.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v321_a1 --expected-lesson-cards 1785
}

Write-Host "V321_QUALITY_RECOVERY_DOCS_VERIFY_OK"

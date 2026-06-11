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

Write-Host "=== V265 PROJECT ANALYZER CROSS FILE LINK VERIFY ==="

Invoke-NativeChecked "node check project_analyzer" { node --check "src\pwa\project_analyzer.js" }
Invoke-NativeChecked "node check app" { node --check "src\pwa\app.js" }
Invoke-NativeChecked "node check verifier" { node --check "tools\verify_project_analyzer_v265.js" }

Invoke-NativeChecked "V265 project analyzer verifier" {
  node "tools\verify_project_analyzer_v265.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v265_a1 --expected-lesson-cards 1785
}

Write-Host "V265_PROJECT_ANALYZER_CROSS_FILE_LINK_VERIFY_SCRIPT_OK"

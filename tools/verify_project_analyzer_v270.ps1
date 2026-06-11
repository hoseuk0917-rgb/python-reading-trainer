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

Write-Host "=== V270 PROJECT ANALYZER CROSS FILE FOCUS FILTER AUDIT VERIFY ==="

Invoke-NativeChecked "node check project_analyzer" { node --check "src\pwa\project_analyzer.js" }
Invoke-NativeChecked "node check audit" { node --check "tools\audit_project_analyzer_cross_file_focus_filter_v270.js" }
Invoke-NativeChecked "node check verifier" { node --check "tools\verify_project_analyzer_v270.js" }

Invoke-NativeChecked "run V270 audit" {
  node "tools\audit_project_analyzer_cross_file_focus_filter_v270.js"
}

Invoke-NativeChecked "V270 verifier" {
  node "tools\verify_project_analyzer_v270.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v270_a1 --expected-lesson-cards 1785
}

Write-Host "V270_PROJECT_ANALYZER_CROSS_FILE_FOCUS_FILTER_AUDIT_VERIFY_SCRIPT_OK"

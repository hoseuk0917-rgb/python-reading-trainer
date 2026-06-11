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

Write-Host "=== V273 CODE EXPLAINER COVERAGE AUDIT VERIFY ==="

Invoke-NativeChecked "node check audit" { node --check "tools\audit_code_explainer_coverage_v273.js" }
Invoke-NativeChecked "node check verifier" { node --check "tools\verify_code_explainer_v273.js" }

Invoke-NativeChecked "run V273 audit" {
  node "tools\audit_code_explainer_coverage_v273.js"
}

Invoke-NativeChecked "V273 verifier" {
  node "tools\verify_code_explainer_v273.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v273_a1 --expected-lesson-cards 1785
}

Write-Host "V273_CODE_EXPLAINER_COVERAGE_AUDIT_VERIFY_SCRIPT_OK"

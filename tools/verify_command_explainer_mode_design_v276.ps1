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

Write-Host "=== V276 COMMAND EXPLAINER MODE DESIGN VERIFY ==="

Invoke-NativeChecked "node check audit" {
  node --check "tools\audit_command_explainer_mode_design_v276.js"
}

Invoke-NativeChecked "node check verifier" {
  node --check "tools\verify_command_explainer_mode_design_v276.js"
}

Invoke-NativeChecked "run V276 audit" {
  node "tools\audit_command_explainer_mode_design_v276.js"
}

Invoke-NativeChecked "V276 verifier" {
  node "tools\verify_command_explainer_mode_design_v276.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v276_a1 --expected-lesson-cards 1785
}

Write-Host "V276_COMMAND_EXPLAINER_MODE_DESIGN_VERIFY_SCRIPT_OK"

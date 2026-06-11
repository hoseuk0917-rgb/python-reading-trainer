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

Write-Host "=== V290 COMMAND EXPLAINER SAFETY CHECKLIST VERIFY ==="

Invoke-NativeChecked "node check command_explainer" {
  node --check "src\pwa\command_explainer.js"
}

Invoke-NativeChecked "node check audit" {
  node --check "tools\audit_command_explainer_safety_checklist_v290.js"
}

Invoke-NativeChecked "node check verifier" {
  node --check "tools\verify_command_explainer_v290.js"
}

Invoke-NativeChecked "run V290 audit" {
  node "tools\audit_command_explainer_safety_checklist_v290.js"
}

Invoke-NativeChecked "V290 verifier" {
  node "tools\verify_command_explainer_v290.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v290_a1 --expected-lesson-cards 1785
}

Write-Host "V290_COMMAND_EXPLAINER_SAFETY_CHECKLIST_VERIFY_SCRIPT_OK"

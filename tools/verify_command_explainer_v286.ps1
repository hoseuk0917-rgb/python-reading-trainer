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

Write-Host "=== V286 COMMAND EXPLAINER DANGER FLOW GUIDE VERIFY ==="

Invoke-NativeChecked "node check command_explainer" {
  node --check "src\pwa\command_explainer.js"
}

Invoke-NativeChecked "node check audit" {
  node --check "tools\audit_command_explainer_danger_flow_guide_v286.js"
}

Invoke-NativeChecked "node check verifier" {
  node --check "tools\verify_command_explainer_v286.js"
}

Invoke-NativeChecked "run V286 audit" {
  node "tools\audit_command_explainer_danger_flow_guide_v286.js"
}

Invoke-NativeChecked "V286 verifier" {
  node "tools\verify_command_explainer_v286.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v286_a1 --expected-lesson-cards 1785
}

Write-Host "V286_COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_VERIFY_SCRIPT_OK"

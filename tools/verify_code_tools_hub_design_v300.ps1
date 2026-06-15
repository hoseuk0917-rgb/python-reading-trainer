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

Write-Host "=== V300 CODE TOOLS HUB DESIGN VERIFY ==="

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

Invoke-NativeChecked "node check audit" {
  node --check "tools\audit_code_tools_hub_design_v300.js"
}

Invoke-NativeChecked "node check verifier" {
  node --check "tools\verify_code_tools_hub_design_v300.js"
}

Invoke-NativeChecked "run V300 audit" {
  node "tools\audit_code_tools_hub_design_v300.js"
}

Invoke-NativeChecked "V300 verifier" {
  node "tools\verify_code_tools_hub_design_v300.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v300_a1 --expected-lesson-cards 1785
}

Write-Host "V300_CODE_TOOLS_HUB_DESIGN_VERIFY_SCRIPT_OK"

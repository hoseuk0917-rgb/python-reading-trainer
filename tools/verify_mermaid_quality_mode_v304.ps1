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

Write-Host "=== V304 MERMAID QUALITY MODE VERIFY ==="

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
  node --check "tools\audit_mermaid_quality_mode_v304.js"
}

Invoke-NativeChecked "node check verifier" {
  node --check "tools\verify_mermaid_quality_mode_v304.js"
}

Invoke-NativeChecked "run V304 audit" {
  node "tools\audit_mermaid_quality_mode_v304.js"
}

Invoke-NativeChecked "V304 verifier" {
  node "tools\verify_mermaid_quality_mode_v304.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v304_a1 --expected-lesson-cards 1785
}

Write-Host "V304_MERMAID_QUALITY_MODE_VERIFY_SCRIPT_OK"

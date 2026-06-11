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

Write-Host "=== V262 CODE EXPLAINER CALLGRAPH VERIFY ==="

Invoke-NativeChecked "node check code_explainer" { node --check "src\pwa\code_explainer.js" }
Invoke-NativeChecked "node check code_explainer_rules" { node --check "src\pwa\code_explainer_rules.js" }
Invoke-NativeChecked "node check app" { node --check "src\pwa\app.js" }
Invoke-NativeChecked "node check verifier" { node --check "tools\verify_code_explainer_v262.js" }

Invoke-NativeChecked "V262 callgraph verifier" {
  node "tools\verify_code_explainer_v262.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v262_a1 --expected-lesson-cards 1785
}

Write-Host "V262_CODE_EXPLAINER_VERIFY_SCRIPT_OK"

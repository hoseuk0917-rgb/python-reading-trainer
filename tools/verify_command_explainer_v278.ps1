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

Write-Host "=== V278 COMMAND EXPLAINER BASH VERIFY ==="

Invoke-NativeChecked "node check command_explainer" {
  node --check "src\pwa\command_explainer.js"
}

Invoke-NativeChecked "node check app" {
  node --check "src\pwa\app.js"
}

Invoke-NativeChecked "node check verifier" {
  node --check "tools\verify_command_explainer_v278.js"
}

Invoke-NativeChecked "V278 verifier" {
  node "tools\verify_command_explainer_v278.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v278_a1 --expected-lesson-cards 1785
}

Write-Host "V278_COMMAND_EXPLAINER_BASH_VERIFY_SCRIPT_OK"

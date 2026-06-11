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

Write-Host "=== V289 COMMAND EXPLAINER SAMPLE DESCRIPTION VERIFY ==="

Invoke-NativeChecked "node check command_explainer" {
  node --check "src\pwa\command_explainer.js"
}

Invoke-NativeChecked "node check audit" {
  node --check "tools\audit_command_explainer_sample_description_v289.js"
}

Invoke-NativeChecked "node check verifier" {
  node --check "tools\verify_command_explainer_v289.js"
}

Invoke-NativeChecked "run V289 audit" {
  node "tools\audit_command_explainer_sample_description_v289.js"
}

Invoke-NativeChecked "V289 verifier" {
  node "tools\verify_command_explainer_v289.js"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v289_a1 --expected-lesson-cards 1785
}

Write-Host "V289_COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_VERIFY_SCRIPT_OK"

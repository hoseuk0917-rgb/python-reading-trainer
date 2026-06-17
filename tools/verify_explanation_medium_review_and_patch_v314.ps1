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

Write-Host "=== V314 EXPLANATION MEDIUM REVIEW AND PATCH VERIFY ==="

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

Invoke-NativeChecked "python compile audit" {
  python -m py_compile "tools\audit_explanation_medium_review_and_patch_v314.py"
}

Invoke-NativeChecked "run V314 audit" {
  python "tools\audit_explanation_medium_review_and_patch_v314.py"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v314_a1 --expected-lesson-cards 1785
}

Write-Host "V314_EXPLANATION_MEDIUM_REVIEW_AND_PATCH_VERIFY_SCRIPT_OK"

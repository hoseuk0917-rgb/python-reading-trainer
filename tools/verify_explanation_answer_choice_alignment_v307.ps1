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

Write-Host "=== V307 EXPLANATION ANSWER CHOICE ALIGNMENT VERIFY ==="

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
  python -m py_compile "tools\audit_explanation_answer_choice_alignment_v307.py"
}

Invoke-NativeChecked "python compile verifier" {
  python -m py_compile "tools\verify_explanation_answer_choice_alignment_v307.py"
}

Invoke-NativeChecked "run V307 audit" {
  python "tools\audit_explanation_answer_choice_alignment_v307.py"
}

Invoke-NativeChecked "run V307 verifier" {
  python "tools\verify_explanation_answer_choice_alignment_v307.py"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v307_a1 --expected-lesson-cards 1785
}

Write-Host "V307_EXPLANATION_ANSWER_CHOICE_ALIGNMENT_VERIFY_SCRIPT_OK"

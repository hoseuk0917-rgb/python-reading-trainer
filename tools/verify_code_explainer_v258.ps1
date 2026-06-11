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

Write-Host "=== V258 REAL JS CODE EXPLAINER AUDIT VERIFY ==="

$ReportPath = "reports\code_explainer_real_js_audit_v258.md"

Invoke-NativeChecked "node check code_explainer" { node --check "src\pwa\code_explainer.js" }
Invoke-NativeChecked "node check code_explainer_rules" { node --check "src\pwa\code_explainer_rules.js" }
Invoke-NativeChecked "node check app" { node --check "src\pwa\app.js" }
Invoke-NativeChecked "node check V258 audit" { node --check "tools\audit_code_explainer_real_js_v258.js" }

Invoke-NativeChecked "V258 real JS audit" {
  node "tools\audit_code_explainer_real_js_v258.js" --out $ReportPath
}

if (-not (Test-Path $ReportPath)) {
  throw "V258 audit report was not created: $ReportPath"
}

$Report = Get-Content $ReportPath -Raw -Encoding UTF8
if (-not $Report.Contains("V258_REAL_JS_AUDIT_OK")) {
  throw "V258 audit report missing OK marker"
}

if (-not $Report.Contains("src/pwa/app.js")) {
  throw "V258 audit report missing app.js row"
}

if (-not $Report.Contains("src/pwa/code_explainer.js")) {
  throw "V258 audit report missing code_explainer.js row"
}

Invoke-NativeChecked "lesson validation" {
  python "tools\validate_lessons.py" --expected-app-version 20260611_v258_a1 --expected-lesson-cards 1785
}

Write-Host "V258_REAL_JS_AUDIT_VERIFY_SCRIPT_OK"

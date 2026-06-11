$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "=== V255 CODE EXPLAINER VERIFY ==="

node --check "src\pwa\code_explainer.js"
node --check "src\pwa\code_explainer_rules.js"
node --check "src\pwa\app.js"
node --check "tools\verify_code_explainer_v255.js"

node "tools\verify_code_explainer_v255.js"

python "tools\validate_lessons.py" --expected-app-version 20260611_v255_a1 --expected-lesson-cards 1785

Write-Host "V255_CODE_EXPLAINER_VERIFY_SCRIPT_OK"

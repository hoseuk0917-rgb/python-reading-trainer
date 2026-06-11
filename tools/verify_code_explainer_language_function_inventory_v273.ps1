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

Write-Host "=== V273-B CODE EXPLAINER LANGUAGE FUNCTION INVENTORY VERIFY ==="

Invoke-NativeChecked "node check inventory audit" {
  node --check "tools\audit_code_explainer_language_function_inventory_v273.js"
}

Invoke-NativeChecked "node check inventory verifier" {
  node --check "tools\verify_code_explainer_language_function_inventory_v273.js"
}

Invoke-NativeChecked "run V273-B inventory audit" {
  node "tools\audit_code_explainer_language_function_inventory_v273.js"
}

Invoke-NativeChecked "V273-B inventory verifier" {
  node "tools\verify_code_explainer_language_function_inventory_v273.js"
}

Write-Host "V273_CODE_EXPLAINER_LANGUAGE_FUNCTION_INVENTORY_VERIFY_SCRIPT_OK"

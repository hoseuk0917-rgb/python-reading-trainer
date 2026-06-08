param(
  [string]$Version = "20260608_v210_a1"
)

$ErrorActionPreference = "Stop"

python .\tools\verify_code_explainer_v210.py --version $Version
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

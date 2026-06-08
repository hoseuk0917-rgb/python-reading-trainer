param(
  [string]$Version = "20260608_v202_a1"
)

$ErrorActionPreference = "Stop"

python .\tools\verify_code_explainer_v202.py --version $Version
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

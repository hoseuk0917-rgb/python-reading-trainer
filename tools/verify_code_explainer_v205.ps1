param(
  [string]$Version = "20260608_v205_a1"
)

$ErrorActionPreference = "Stop"

python .\tools\verify_code_explainer_v205.py --version $Version
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

param(
  [string]$Version = "20260609_v216_a1"
)

$ErrorActionPreference = "Stop"

python .\tools\verify_code_explainer_v216.py --version $Version
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

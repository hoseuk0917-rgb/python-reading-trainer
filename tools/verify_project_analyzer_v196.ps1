param(
  [string]$Version = "20260606_v196_a1",
  [int]$Port = 5173,
  [switch]$SkipLocalHttp
)

$ErrorActionPreference = "Stop"

$argsList = @(
  ".\tools\verify_project_analyzer_v196.py",
  "--version",
  $Version,
  "--port",
  [string]$Port
)

if ($SkipLocalHttp) {
  $argsList += "--skip-local-http"
}

python @argsList
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

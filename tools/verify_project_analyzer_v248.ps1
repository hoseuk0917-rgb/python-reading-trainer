param(
  [string]$Version = "20260611_v248_a1",
  [string]$ExpectedLessonCards = "1785",
  [switch]$SkipRuntime
)

$ErrorActionPreference = "Stop"

$argsList = @(
  ".\tools\verify_project_analyzer_v248.py",
  "--version",
  $Version,
  "--expected-lesson-cards",
  $ExpectedLessonCards
)

if ($SkipRuntime) {
  $argsList += "--skip-runtime"
}

python @argsList
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

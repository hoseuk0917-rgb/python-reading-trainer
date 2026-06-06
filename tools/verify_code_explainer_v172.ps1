param(
  [string]$Version = "20260606_v172_a2",
  [int]$Port = 5173,
  [switch]$SkipLocalHttp
)

$ErrorActionPreference = "Stop"

function Invoke-Step {
  param(
    [string]$Name,
    [scriptblock]$Block
  )

  Write-Host ""
  Write-Host "=== $Name ==="
  & $Block

  if ($LASTEXITCODE -ne $null -and $LASTEXITCODE -ne 0) {
    throw "$Name failed with exit code $LASTEXITCODE"
  }
}

function Assert-Contains {
  param(
    [string]$Path,
    [string]$Needle,
    [string]$Name
  )

  $text = Get-Content $Path -Raw -Encoding UTF8
  if ($text -notlike "*$Needle*") {
    throw "STATIC_CHECK_FAIL $Name"
  }
  Write-Host "STATIC_OK $Name"
}

Write-Host "VERIFY_VERSION $Version"

Invoke-Step "node syntax app.js" {
  node --check .\src\pwa\app.js
}

Invoke-Step "node syntax code_explainer_rules.js" {
  node --check .\src\pwa\code_explainer_rules.js
}

Invoke-Step "node syntax code_explainer.js" {
  node --check .\src\pwa\code_explainer.js
}

Invoke-Step "node syntax smoke script" {
  node --check .\tools\code_explainer_smoke_v171.js
}

Invoke-Step "lesson validation" {
  python tools/validate_lessons.py --expected-app-version $Version --expected-lesson-cards 1785
}

Invoke-Step "code explainer smoke samples" {
  node .\tools\code_explainer_smoke_v171.js
}

Write-Host ""
Write-Host "=== static markers ==="
Assert-Contains ".\src\pwa\app.js" $Version "APP_VERSION"
Assert-Contains ".\src\pwa\index.html" "code_explainer.js?v=$Version" "UI_SCRIPT_VERSION"
Assert-Contains ".\src\pwa\index.html" 'id="codeExplainerVersion" class="badge">V172</span>' "BADGE_V172"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "powershell_risky_web_wrangler" "POWERSHELL_EXTENDED_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "python_api_csv_loop" "PYTHON_EXTENDED_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "workers_storage_cache_cors" "WORKERS_EXTENDED_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "java_basic_flow" "JAVA_SAMPLE"

if (-not $SkipLocalHttp) {
  Write-Host ""
  Write-Host "=== local http assets ==="

  $root = "http://127.0.0.1:$Port"
  $urls = @(
    "$root/src/pwa/index.html?v=$Version",
    "$root/src/pwa/app.js?v=$Version",
    "$root/src/pwa/code_explainer.js?v=$Version",
    "$root/src/pwa/code_explainer_rules.js?v=$Version",
    "$root/src/pwa/style.css?v=$Version"
  )

  foreach ($url in $urls) {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing
    if ($response.StatusCode -ne 200) {
      throw "LOCAL_HTTP_FAIL $url"
    }
    Write-Host "LOCAL_OK $($response.StatusCode) $url"
  }
}

Write-Host ""
Write-Host "V172_CODE_EXPLAINER_VERIFY_OK"

param(
    [Parameter(Mandatory = $true)]
    [string]$ExpectedBase,

    [string]$MainRoot = "D:\projects\python-reading-trainer"
)

$ErrorActionPreference = "Stop"

if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$FeatureBranch = "feat/browser-native-python-archify"
$ExpectedMain = "6e5dfa75a85547110eedd27ae6efb8be7d9c13d3"
$RepoRoot = (git rev-parse --show-toplevel).Trim()
$SmokeProxy = Join-Path $RepoRoot "tools\local_prt_pwa_smoke_proxy_v0_1.js"
$Harness = Join-Path $RepoRoot "tools\pwa_browser_native_archify_visual_smoke_harness_v0_1.html"
$Index = Join-Path $RepoRoot "src\pwa\index.html"
$Worker = Join-Path $RepoRoot "src\pwa\python_browser_worker.mjs"
$Runtime = Join-Path $RepoRoot "src\pwa\python_browser_runtime.js"
$Renderer = Join-Path $RepoRoot "src\pwa\python_archify_browser_renderer.js"
$Structure = Join-Path $RepoRoot "src\pwa\python_structure_bridge.js"
$Lens = Join-Path $RepoRoot "src\pwa\python_execution_lens.js"
$ProxyPort = 3377
$ForbiddenPrtPort = 3388
$HarnessUrl = "http://127.0.0.1:$ProxyPort/tools/pwa_browser_native_archify_visual_smoke_harness_v0_1.html"

function Test-TcpPortOpen {
    param([int]$Port)
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $task = $client.ConnectAsync("127.0.0.1", $Port)
        if (-not $task.Wait(250)) { return $false }
        return $client.Connected
    }
    catch { return $false }
    finally { $client.Dispose() }
}

function Wait-StaticFile {
    param(
        [string]$Url,
        [string]$Marker,
        [int]$Attempts = 80
    )
    for ($i = 0; $i -lt $Attempts; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200 -and $response.Content -match $Marker) {
                return $response
            }
        }
        catch {
        }
        Start-Sleep -Milliseconds 125
    }
    throw "STATIC_FILE_TIMEOUT=$Url"
}

Write-Host "=== B3 BROWSER-NATIVE ARCHIFY NO-LOCAL-SERVER VISUAL SMOKE ==="
Write-Host "EXPECTED_BASE=$ExpectedBase"
Write-Host "EXPECTED_MAIN=$ExpectedMain"
Write-Host "LOCAL_PRT_SERVER_START_PLANNED=False"
Write-Host "LOCAL_PRT_PORT_3388_MUST_BE_FREE=True"
Write-Host "SMOKE_STATIC_PORT=$ProxyPort"
Write-Host "REPO_WRITE_PLANNED=False"

Write-Host "`n=== 1. SAFETY PREFLIGHT ==="

if (-not $RepoRoot) { throw "ABORT=REPO_ROOT_NOT_FOUND" }
$Branch = (git -C $RepoRoot branch --show-current).Trim()
$Head = (git -C $RepoRoot rev-parse HEAD).Trim()
$Status = @(git -C $RepoRoot status --porcelain)
$MainHead = (git -C $MainRoot rev-parse HEAD).Trim()
$MainStatus = @(git -C $MainRoot status --porcelain)

Write-Host "REPO_ROOT=$RepoRoot"
Write-Host "FEATURE_BRANCH_LOCAL=$Branch"
Write-Host "FEATURE_HEAD=$Head"
Write-Host "MAIN_HEAD=$MainHead"

if ($Branch -ne $FeatureBranch) { throw "ABORT=WRONG_FEATURE_BRANCH" }
if ($Head -ne $ExpectedBase) { throw "ABORT=UNEXPECTED_FEATURE_HEAD" }
if ($Status.Count -gt 0) { throw "ABORT=FEATURE_NOT_CLEAN" }
if ($MainHead -ne $ExpectedMain) { throw "ABORT=MAIN_HEAD_CHANGED" }
if ($MainStatus.Count -gt 0) { throw "ABORT=MAIN_NOT_CLEAN" }

foreach ($File in @($SmokeProxy, $Harness, $Index, $Worker, $Runtime, $Renderer, $Structure, $Lens)) {
    if (-not (Test-Path -LiteralPath $File -PathType Leaf)) {
        throw "ABORT=REQUIRED_FILE_NOT_FOUND:$File"
    }
}

if (Test-TcpPortOpen -Port $ProxyPort) { throw "ABORT=PORT_3377_ALREADY_IN_USE" }
if (Test-TcpPortOpen -Port $ForbiddenPrtPort) { throw "ABORT=LOCAL_PRT_PORT_3388_MUST_BE_OFF" }

$IndexText = [System.IO.File]::ReadAllText($Index)
$RequiredScriptLines = @(
    '<script src="./python_browser_runtime.js?v=20260812_b3a1"></script>',
    '<script src="./python_archify_browser_renderer.js?v=20260812_b3a1"></script>',
    '<script src="./python_structure_bridge.js?v=20260812_b3a1"></script>',
    '<script src="./python_execution_lens.js?v=20260812_b3a1"></script>'
)
foreach ($Line in $RequiredScriptLines) {
    if (([regex]::Matches($IndexText, [regex]::Escape($Line))).Count -ne 1) {
        throw "ABORT=B3_SCRIPT_NOT_WIRED_EXACTLY_ONCE:$Line"
    }
}
Write-Host "LOCAL_PREFLIGHT=PASS"

Write-Host "`n=== 2. REMOTE AUTHORITY ==="
git -C $RepoRoot fetch origin $FeatureBranch main
if ($LASTEXITCODE -ne 0) { throw "ABORT=FETCH_FAILED" }
$RemoteFeature = (git -C $RepoRoot rev-parse "origin/$FeatureBranch").Trim()
$RemoteMain = (git -C $RepoRoot rev-parse origin/main).Trim()
Write-Host "REMOTE_FEATURE_HEAD=$RemoteFeature"
Write-Host "REMOTE_MAIN_HEAD=$RemoteMain"
if ($RemoteFeature -ne $ExpectedBase) { throw "ABORT=REMOTE_FEATURE_MOVED" }
if ($RemoteMain -ne $ExpectedMain) { throw "ABORT=REMOTE_MAIN_MOVED" }
Write-Host "REMOTE_AUTHORITY=PASS"

Write-Host "`n=== 3. STATIC CHECKS ==="
foreach ($Js in @($SmokeProxy, $Runtime, $Renderer, $Structure, $Lens)) {
    node --check $Js
    if ($LASTEXITCODE -ne 0) { throw "ABORT=NODE_CHECK_FAILED:$Js" }
}
node --check $Worker
if ($LASTEXITCODE -ne 0) { throw "ABORT=WORKER_NODE_CHECK_FAILED" }

node (Join-Path $RepoRoot "tools\audit_pwa_python_browser_runtime_v0_1.js")
if ($LASTEXITCODE -ne 0) { throw "ABORT=BROWSER_RUNTIME_AUDIT_FAILED" }
node (Join-Path $RepoRoot "tools\audit_pwa_python_archify_browser_renderer_v0_1.js")
if ($LASTEXITCODE -ne 0) { throw "ABORT=BROWSER_RENDERER_AUDIT_FAILED" }
node (Join-Path $RepoRoot "tools\audit_pwa_python_browser_native_integration_v0_1.js")
if ($LASTEXITCODE -ne 0) { throw "ABORT=BROWSER_INTEGRATION_AUDIT_FAILED" }
Write-Host "STATIC_CHECKS=PASS"

$TempRoot = Join-Path $env:TEMP ("prt-browser-archify-b3-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $TempRoot | Out-Null
$ProxyOut = Join-Path $TempRoot "proxy.stdout.log"
$ProxyErr = Join-Path $TempRoot "proxy.stderr.log"
$ProxyProcess = $null
$OldProxyPort = $env:PRT_SMOKE_PROXY_PORT
$OldTargetPort = $env:PRT_SMOKE_TARGET_PORT

try {
    Write-Host "`n=== 4. START STATIC SMOKE SERVER ONLY ==="
    $env:PRT_SMOKE_PROXY_PORT = [string]$ProxyPort
    $env:PRT_SMOKE_TARGET_PORT = [string]$ForbiddenPrtPort

    $ProxyProcess = Start-Process `
        -FilePath "node" `
        -ArgumentList @($SmokeProxy) `
        -WorkingDirectory $RepoRoot `
        -RedirectStandardOutput $ProxyOut `
        -RedirectStandardError $ProxyErr `
        -WindowStyle Hidden `
        -PassThru

    [void](Wait-StaticFile -Url "http://127.0.0.1:$ProxyPort/src/pwa/index.html" -Marker "python_browser_runtime\.js")
    [void](Wait-StaticFile -Url "http://127.0.0.1:$ProxyPort/src/pwa/python_browser_worker.mjs" -Marker "PYODIDE_VERSION")
    [void](Wait-StaticFile -Url "http://127.0.0.1:$ProxyPort/tools/python_reading_browser_bridge_v0_1.py" -Marker "build_browser_structure_payload")
    [void](Wait-StaticFile -Url $HarnessUrl -Marker "BROWSER-NATIVE ARCHIFY B3")

    if (Test-TcpPortOpen -Port $ForbiddenPrtPort) {
        throw "ABORT=LOCAL_PRT_PORT_3388_BECAME_ACTIVE"
    }

    Write-Host "STATIC_SERVER_PID=$($ProxyProcess.Id)"
    Write-Host "PWA_INDEX_STATIC=PASS"
    Write-Host "MODULE_WORKER_STATIC=PASS"
    Write-Host "PYTHON_BROWSER_BRIDGE_STATIC=PASS"
    Write-Host "LOCAL_PRT_SERVER_RUNNING=False"

    Write-Host "`n=== 5. OPEN BROWSER HARNESS ==="
    Write-Host "HARNESS_URL=$HarnessUrl"
    Start-Process $HarnessUrl
    Write-Host "BROWSER_OPEN_REQUESTED=True"
    Write-Host ""
    Write-Host "첫 실행은 Pyodide WebAssembly 다운로드 때문에 수십 초 걸릴 수 있습니다."
    Write-Host "Desktop / Narrow 모두 끝난 뒤 맨 아래 '결과 복사'를 눌러 결과를 이 대화에 붙여넣으세요."
    Write-Host "핵심: STRUCTURE_RUNTIME_BROWSER, EXECUTION_RUNTIME_BROWSER, LOCAL_ENDPOINT_CALLS_ZERO가 모두 PASS여야 합니다."
    Write-Host ""

    [void](Read-Host "결과를 복사한 뒤 static smoke server를 종료하려면 Enter")

    Write-Host "`n=== 6. SESSION COMPLETE ==="
    Write-Host "RESULT=B3_BROWSER_NATIVE_VISUAL_SMOKE_SESSION_CLOSED"
}
finally {
    if ($null -ne $ProxyProcess -and -not $ProxyProcess.HasExited) {
        Stop-Process -Id $ProxyProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if ($null -eq $OldProxyPort) { Remove-Item Env:PRT_SMOKE_PROXY_PORT -ErrorAction SilentlyContinue } else { $env:PRT_SMOKE_PROXY_PORT = $OldProxyPort }
    if ($null -eq $OldTargetPort) { Remove-Item Env:PRT_SMOKE_TARGET_PORT -ErrorAction SilentlyContinue } else { $env:PRT_SMOKE_TARGET_PORT = $OldTargetPort }

    Write-Host "STATIC_SERVER_STOPPED=True"
    Write-Host "LOCAL_PRT_SERVER_STARTED=False"
    Write-Host "TRACKED_REPO_WRITE=False"
    Write-Host "TEMP_LOG_ROOT=$TempRoot"
}

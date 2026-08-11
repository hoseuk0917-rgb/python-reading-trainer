param(
    [Parameter(Mandatory = $true)]
    [string]$ExpectedBase,

    [Parameter(Mandatory = $true)]
    [string]$ArchifyRoot,

    [string]$MainRoot = "D:\projects\python-reading-trainer"
)

$ErrorActionPreference = "Stop"

$FeatureBranch = "feat/python-reading-graph-ir"
$ExpectedMain = "fd018ef05c5a716cbddbe72a305ec58880e355dc"
$RepoRoot = (git rev-parse --show-toplevel).Trim()
$LocalServer = Join-Path $RepoRoot "tools\local_prt_server.js"
$SmokeProxy = Join-Path $RepoRoot "tools\local_prt_pwa_smoke_proxy_v0_1.js"
$Harness = Join-Path $RepoRoot "tools\pwa_archify_visual_smoke_harness_v0_1.html"
$Lens = Join-Path $RepoRoot "src\pwa\python_execution_lens.js"
$Index = Join-Path $RepoRoot "src\pwa\index.html"
$PrtPort = 3388
$ProxyPort = 3377
$HarnessUrl = "http://127.0.0.1:$ProxyPort/tools/pwa_archify_visual_smoke_harness_v0_1.html"

function Test-TcpPortOpen {
    param([int]$Port)
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $task = $client.ConnectAsync("127.0.0.1", $Port)
        if (-not $task.Wait(250)) {
            return $false
        }
        return $client.Connected
    }
    catch {
        return $false
    }
    finally {
        $client.Dispose()
    }
}

function Wait-JsonHealth {
    param(
        [string]$Url,
        [int]$Attempts = 80
    )
    for ($i = 0; $i -lt $Attempts; $i++) {
        try {
            $value = Invoke-RestMethod -Uri $Url -Method Get -TimeoutSec 2
            if ($value.ok -eq $true) {
                return $value
            }
        }
        catch {
        }
        Start-Sleep -Milliseconds 125
    }
    throw "HEALTH_TIMEOUT=$Url"
}

Write-Host "=== PWA ARCHIFY EXECUTION LENS B2C VISUAL SMOKE RUNNER ==="
Write-Host "EXPECTED_BASE=$ExpectedBase"
Write-Host "ARCHIFY_ROOT=$ArchifyRoot"
Write-Host "MAIN_WRITE_PLANNED=False"
Write-Host "FEATURE_WRITE_PLANNED=False"
Write-Host "PWA_WRITE_PLANNED=False"
Write-Host "LOCAL_PRT_PORT=$PrtPort"
Write-Host "SMOKE_PROXY_PORT=$ProxyPort"

Write-Host "`n=== 1. SAFETY PREFLIGHT ==="

if (-not $RepoRoot) {
    throw "ABORT=REPO_ROOT_NOT_FOUND"
}

$Head = (git -C $RepoRoot rev-parse HEAD).Trim()
$Status = @(git -C $RepoRoot status --porcelain)
$MainHead = (git -C $MainRoot rev-parse HEAD).Trim()
$MainStatus = @(git -C $MainRoot status --porcelain)

Write-Host "REPO_ROOT=$RepoRoot"
Write-Host "HEAD=$Head"
Write-Host "MAIN_HEAD=$MainHead"

if ($Head -ne $ExpectedBase) {
    throw "ABORT=UNEXPECTED_EVAL_HEAD"
}
if ($Status.Count -gt 0) {
    Write-Host "EVAL_STATUS="
    $Status
    throw "ABORT=EVAL_NOT_CLEAN"
}
if ($MainHead -ne $ExpectedMain) {
    throw "ABORT=UNEXPECTED_MAIN_HEAD"
}
if ($MainStatus.Count -gt 0) {
    Write-Host "MAIN_STATUS="
    $MainStatus
    throw "ABORT=MAIN_NOT_CLEAN"
}
if (-not (Test-Path -LiteralPath $ArchifyRoot -PathType Container)) {
    throw "ABORT=ARCHIFY_ROOT_NOT_FOUND"
}
foreach ($file in @($LocalServer, $SmokeProxy, $Harness, $Lens, $Index)) {
    if (-not (Test-Path -LiteralPath $file -PathType Leaf)) {
        throw "ABORT=REQUIRED_FILE_NOT_FOUND=$file"
    }
}

$IndexText = [System.IO.File]::ReadAllText($Index)
$LensLine = '<script src="./python_execution_lens.js?v=20260812_v338_archify_b2b"></script>'
$LensCount = ([regex]::Matches($IndexText, [regex]::Escape($LensLine))).Count
Write-Host "PWA_LENS_SCRIPT_COUNT=$LensCount"
if ($LensCount -ne 1) {
    throw "ABORT=PWA_LENS_NOT_WIRED_EXACTLY_ONCE"
}

if (Test-TcpPortOpen -Port $ProxyPort) {
    throw "ABORT=PORT_3377_ALREADY_IN_USE"
}
if (Test-TcpPortOpen -Port $PrtPort) {
    throw "ABORT=PORT_3388_ALREADY_IN_USE"
}

Write-Host "LOCAL_PREFLIGHT=PASS"

Write-Host "`n=== 2. REMOTE AUTHORITY ==="

git -C $RepoRoot fetch origin $FeatureBranch
if ($LASTEXITCODE -ne 0) {
    throw "ABORT=FETCH_FAILED"
}
$RemoteHead = (git -C $RepoRoot rev-parse "origin/$FeatureBranch").Trim()
Write-Host "REMOTE_FEATURE_HEAD=$RemoteHead"
if ($RemoteHead -ne $ExpectedBase) {
    throw "ABORT=REMOTE_FEATURE_MOVED"
}
Write-Host "REMOTE_AUTHORITY=PASS"

Write-Host "`n=== 3. STATIC CHECKS ==="
node --check $LocalServer
if ($LASTEXITCODE -ne 0) { throw "ABORT=LOCAL_SERVER_NODE_CHECK_FAILED" }
node --check $SmokeProxy
if ($LASTEXITCODE -ne 0) { throw "ABORT=SMOKE_PROXY_NODE_CHECK_FAILED" }
node --check $Lens
if ($LASTEXITCODE -ne 0) { throw "ABORT=LENS_NODE_CHECK_FAILED" }
Write-Host "STATIC_CHECKS=PASS"

$TempRoot = Join-Path $env:TEMP ("prt-archify-b2c-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $TempRoot | Out-Null
$PrtOut = Join-Path $TempRoot "prt.stdout.log"
$PrtErr = Join-Path $TempRoot "prt.stderr.log"
$ProxyOut = Join-Path $TempRoot "proxy.stdout.log"
$ProxyErr = Join-Path $TempRoot "proxy.stderr.log"
$PrtProcess = $null
$ProxyProcess = $null

$OldLocalHost = $env:PRT_LOCAL_HOST
$OldLocalPort = $env:PRT_LOCAL_PORT
$OldArchifyRoot = $env:PRT_ARCHIFY_ROOT
$OldProxyPort = $env:PRT_SMOKE_PROXY_PORT
$OldTargetPort = $env:PRT_SMOKE_TARGET_PORT

try {
    Write-Host "`n=== 4. START REAL LOCAL PRT SERVER ON 3388 ==="
    $env:PRT_LOCAL_HOST = "127.0.0.1"
    $env:PRT_LOCAL_PORT = [string]$PrtPort
    $env:PRT_ARCHIFY_ROOT = $ArchifyRoot

    $PrtProcess = Start-Process `
        -FilePath "node" `
        -ArgumentList @($LocalServer) `
        -WorkingDirectory $RepoRoot `
        -RedirectStandardOutput $PrtOut `
        -RedirectStandardError $PrtErr `
        -WindowStyle Hidden `
        -PassThru

    $PrtHealth = Wait-JsonHealth -Url "http://127.0.0.1:$PrtPort/health"
    if ($PrtHealth.engines.pythonArchifyExecution -ne $true) {
        throw "ABORT=PRT_ARCHIFY_ENGINE_NOT_HEALTHY"
    }
    Write-Host "REAL_PRT_HEALTH=PASS"
    Write-Host "REAL_PRT_PID=$($PrtProcess.Id)"

    Write-Host "`n=== 5. START SAME-ORIGIN SMOKE PROXY ON 3377 ==="
    $env:PRT_SMOKE_PROXY_PORT = [string]$ProxyPort
    $env:PRT_SMOKE_TARGET_PORT = [string]$PrtPort

    $ProxyProcess = Start-Process `
        -FilePath "node" `
        -ArgumentList @($SmokeProxy) `
        -WorkingDirectory $RepoRoot `
        -RedirectStandardOutput $ProxyOut `
        -RedirectStandardError $ProxyErr `
        -WindowStyle Hidden `
        -PassThru

    $ProxyHealth = Wait-JsonHealth -Url "http://127.0.0.1:$ProxyPort/health"
    if ($ProxyHealth.engines.pythonArchifyExecution -ne $true) {
        throw "ABORT=PROXY_ARCHIFY_ENGINE_NOT_HEALTHY"
    }

    $IndexResponse = Invoke-WebRequest -Uri "http://127.0.0.1:$ProxyPort/src/pwa/index.html" -UseBasicParsing -TimeoutSec 4
    if ($IndexResponse.StatusCode -ne 200 -or $IndexResponse.Content -notmatch "python_execution_lens\.js") {
        throw "ABORT=PROXY_PWA_INDEX_SMOKE_FAILED"
    }

    $HarnessResponse = Invoke-WebRequest -Uri $HarnessUrl -UseBasicParsing -TimeoutSec 4
    if ($HarnessResponse.StatusCode -ne 200 -or $HarnessResponse.Content -notmatch "B2C VISUAL SMOKE") {
        throw "ABORT=HARNESS_STATIC_SMOKE_FAILED"
    }

    Write-Host "SMOKE_PROXY_HEALTH=PASS"
    Write-Host "SMOKE_PROXY_PID=$($ProxyProcess.Id)"
    Write-Host "PWA_INDEX_VIA_PROXY=PASS"
    Write-Host "HARNESS_VIA_PROXY=PASS"

    Write-Host "`n=== 6. OPEN BROWSER HARNESS ==="
    Write-Host "HARNESS_URL=$HarnessUrl"
    Start-Process $HarnessUrl
    Write-Host "BROWSER_OPEN_REQUESTED=True"
    Write-Host ""
    Write-Host "브라우저가 열리면 자동으로 Desktop 1200px / Narrow 390px 검사를 실행합니다."
    Write-Host "두 화면의 Archify SVG도 눈으로 확인한 뒤 '결과 복사'를 눌러 이 대화에 붙여넣으세요."
    Write-Host "확인할 항목: 잘림 없음, 글자 판독 가능, Archify 카드가 Mermaid 위, Mermaid 유지, 좁은 화면 가로 넘침 없음."
    Write-Host ""

    [void](Read-Host "결과를 복사한 뒤 서버를 종료하려면 Enter")

    Write-Host "`n=== 7. SESSION COMPLETE ==="
    Write-Host "RESULT=VISUAL_SMOKE_SESSION_CLOSED"
}
finally {
    if ($null -ne $ProxyProcess -and -not $ProxyProcess.HasExited) {
        Stop-Process -Id $ProxyProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if ($null -ne $PrtProcess -and -not $PrtProcess.HasExited) {
        Stop-Process -Id $PrtProcess.Id -Force -ErrorAction SilentlyContinue
    }

    if ($null -eq $OldLocalHost) { Remove-Item Env:PRT_LOCAL_HOST -ErrorAction SilentlyContinue } else { $env:PRT_LOCAL_HOST = $OldLocalHost }
    if ($null -eq $OldLocalPort) { Remove-Item Env:PRT_LOCAL_PORT -ErrorAction SilentlyContinue } else { $env:PRT_LOCAL_PORT = $OldLocalPort }
    if ($null -eq $OldArchifyRoot) { Remove-Item Env:PRT_ARCHIFY_ROOT -ErrorAction SilentlyContinue } else { $env:PRT_ARCHIFY_ROOT = $OldArchifyRoot }
    if ($null -eq $OldProxyPort) { Remove-Item Env:PRT_SMOKE_PROXY_PORT -ErrorAction SilentlyContinue } else { $env:PRT_SMOKE_PROXY_PORT = $OldProxyPort }
    if ($null -eq $OldTargetPort) { Remove-Item Env:PRT_SMOKE_TARGET_PORT -ErrorAction SilentlyContinue } else { $env:PRT_SMOKE_TARGET_PORT = $OldTargetPort }

    Write-Host "SERVERS_STOPPED=True"
    Write-Host "TRACKED_REPO_WRITE=False"
    Write-Host "TEMP_LOG_ROOT=$TempRoot"
}

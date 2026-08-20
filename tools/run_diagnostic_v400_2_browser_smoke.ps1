$ErrorActionPreference = "Stop"

$Repo = "D:\projects\python-reading-trainer-r2-diagnostic"
$HttpPort = 3382
$CdpPort = 9332

$Stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$Audit = "$Repo\_audit\v400_2_diagnostic_browser_smoke_$Stamp"

New-Item `
    -ItemType Directory `
    -Path $Audit `
    -Force |
    Out-Null

$Profile = Join-Path `
    $env:TEMP `
    "prt_diag_v4002_$Stamp"

$HttpProcess = $null
$BrowserProcess = $null
$Socket = $null
$CdpId = 0

function Wait-Http {
    param(
        [string]$Url,
        [int]$Seconds = 20
    )

    $Deadline = (
        Get-Date
    ).AddSeconds($Seconds)

    while ((Get-Date) -lt $Deadline) {
        try {
            $Response = Invoke-WebRequest `
                -Uri $Url `
                -UseBasicParsing `
                -TimeoutSec 2

            if ($Response.StatusCode -eq 200) {
                return $true
            }
        }
        catch {
        }

        Start-Sleep -Milliseconds 250
    }

    return $false
}

function Receive-CdpMessage {
    $Buffer = New-Object byte[] 262144
    $Builder = New-Object System.Text.StringBuilder

    do {
        $Segment = [ArraySegment[byte]]::new(
            $Buffer
        )

        $Result = $Socket.ReceiveAsync(
            $Segment,
            [Threading.CancellationToken]::None
        ).GetAwaiter().GetResult()

        if (
            $Result.MessageType -eq
            [System.Net.WebSockets.WebSocketMessageType]::Close
        ) {
            throw "CDP_SOCKET_CLOSED"
        }

        if ($Result.Count -gt 0) {
            [void]$Builder.Append(
                [Text.Encoding]::UTF8.GetString(
                    $Buffer,
                    0,
                    $Result.Count
                )
            )
        }
    }
    while (-not $Result.EndOfMessage)

    return $Builder.ToString()
}

function Invoke-Cdp {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Method,

        [hashtable]$Params = @{}
    )

    $script:CdpId += 1
    $Id = $script:CdpId

    $Payload = @{
        id = $Id
        method = $Method
        params = $Params
    } |
    ConvertTo-Json `
        -Compress `
        -Depth 30

    $Bytes = [Text.Encoding]::UTF8.GetBytes(
        $Payload
    )

    $Socket.SendAsync(
        [ArraySegment[byte]]::new($Bytes),
        [System.Net.WebSockets.WebSocketMessageType]::Text,
        $true,
        [Threading.CancellationToken]::None
    ).GetAwaiter().GetResult()

    while ($true) {
        $Raw = Receive-CdpMessage

        if (-not $Raw) {
            continue
        }

        $Message = $Raw |
            ConvertFrom-Json

        if (
            $null -ne $Message.id -and
            [int]$Message.id -eq $Id
        ) {
            if ($null -ne $Message.error) {
                throw (
                    "CDP_ERROR:{0}" -f `
                    $Message.error.message
                )
            }

            return $Message
        }
    }
}

function Invoke-Js {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Expression
    )

    $Response = Invoke-Cdp `
        -Method "Runtime.evaluate" `
        -Params @{
            expression = $Expression
            returnByValue = $true
            awaitPromise = $true
        }

    if (
        $null -ne
        $Response.result.exceptionDetails
    ) {
        throw "JS_EVALUATION_EXCEPTION"
    }

    return $Response.result.result.value
}

function Wait-Js {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Expression,

        [int]$Seconds = 20
    )

    $Deadline = (
        Get-Date
    ).AddSeconds($Seconds)

    while ((Get-Date) -lt $Deadline) {
        try {
            $Value = Invoke-Js `
                -Expression (
                    "(function(){try{return !!(" +
                    $Expression +
                    ");}catch(e){return false;}})()"
                )

            if ($Value -eq $true) {
                return $true
            }
        }
        catch {
        }

        Start-Sleep -Milliseconds 200
    }

    return $false
}

function Invoke-Stage {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Stage,

        [Parameter(Mandatory=$true)]
        [int]$Minimum,

        [Parameter(Mandatory=$true)]
        [int]$Maximum
    )

    if (
        -not (
            Wait-Js `
                -Expression `
                "document.querySelector('.diagnostic-progress-v4002') !== null" `
                -Seconds 10
        )
    ) {
        throw "STAGE_PROGRESS_NOT_FOUND:$Stage"
    }

    $Total = [int](
        Invoke-Js `
            -Expression @"
(function(){
    const el = document.querySelector(
        '.diagnostic-progress-v4002'
    );
    if (!el) return 0;
    const parts = el.textContent.split('/');
    return Number(parts[1].trim());
})()
"@
    )

    Write-Host (
        "STAGE={0}|QUESTION_COUNT={1}" -f `
        $Stage,
        $Total
    )

    if (
        $Total -lt $Minimum -or
        $Total -gt $Maximum
    ) {
        throw (
            "STAGE_COUNT_INVALID:{0}:{1}" -f `
            $Stage,
            $Total
        )
    }

    for ($I = 1; $I -le $Total; $I++) {
        if (
            -not (
                Wait-Js `
                    -Expression `
                    "document.querySelector('.diagnostic-choice-v4002') !== null" `
                    -Seconds 5
            )
        ) {
            throw (
                "CHOICE_NOT_FOUND:{0}:{1}" -f `
                $Stage,
                $I
            )
        }

        $Clicked = Invoke-Js `
            -Expression @"
(function(){
    const button = document.querySelector(
        '.diagnostic-choice-v4002'
    );
    if (!button) return false;
    button.click();
    return true;
})()
"@

        if ($Clicked -ne $true) {
            throw (
                "CHOICE_CLICK_FAILED:{0}:{1}" -f `
                $Stage,
                $I
            )
        }
    }

    if (
        -not (
            Wait-Js `
                -Expression `
                "document.getElementById('diagnosticNextStageV4002') !== null" `
                -Seconds 10
        )
    ) {
        throw (
            "RESULT_SCREEN_NOT_FOUND:{0}" -f `
            $Stage
        )
    }

    $StoredTotal = [int](
        Invoke-Js `
            -Expression (
                "(function(){" +
                "const c=JSON.parse(localStorage.getItem(" +
                "'python-reading-trainer-diagnostic-v400-2')||'{}');" +
                "return c['" + $Stage + "'] ? " +
                "Number(c['" + $Stage + "'].total||0) : 0;" +
                "})()"
            )
    )

    $AxisCount = [int](
        Invoke-Js `
            -Expression (
                "(function(){" +
                "const c=JSON.parse(localStorage.getItem(" +
                "'python-reading-trainer-diagnostic-v400-2')||'{}');" +
                "const r=c['" + $Stage + "'];" +
                "return r && r.axis_scores ? " +
                "Object.keys(r.axis_scores).length : 0;" +
                "})()"
            )
    )

    Write-Host (
        "STAGE={0}|STORED_TOTAL={1}|AXES={2}|PASS={3}" -f `
        $Stage,
        $StoredTotal,
        $AxisCount,
        (
            $StoredTotal -eq $Total -and
            $AxisCount -ge 3
        )
    )

    if ($StoredTotal -ne $Total) {
        throw (
            "STORED_TOTAL_MISMATCH:{0}" -f `
            $Stage
        )
    }

    return $Total
}

function Start-NextStage {
    $Clicked = Invoke-Js `
        -Expression @"
(function(){
    const button = document.getElementById(
        'diagnosticNextStageV4002'
    );
    if (!button) return false;
    button.click();
    return true;
})()
"@

    if ($Clicked -ne $true) {
        throw "NEXT_STAGE_CLICK_FAILED"
    }
}

function Test-Locale {
    param(
        [Parameter(Mandatory=$true)]
        [ValidateSet("ko", "en")]
        [string]$Language
    )

    $Url = (
        "http://127.0.0.1:{0}/src/pwa/index.html?lang={1}&diagnosticSmoke={2}" -f `
        $HttpPort,
        $Language,
        [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    )

    [void](
        Invoke-Cdp `
            -Method "Page.navigate" `
            -Params @{
                url = $Url
            }
    )

    if (
        -not (
            Wait-Js `
                -Expression `
                "document.readyState === 'complete' && window.PRTDiagnosticV4002 && document.querySelector('[data-view=`"diagnostic`"]')" `
                -Seconds 30
        )
    ) {
        throw (
            "APP_LOAD_FAILED:{0}" -f `
            $Language
        )
    }

    $ActualLanguage = [string](
        Invoke-Js `
            -Expression `
            "String(document.documentElement.lang || '').toLowerCase()"
    )

    Write-Host (
        "LOCALE={0}|HTML_LANG={1}" -f `
        $Language,
        $ActualLanguage
    )

    if (
        $Language -eq "en" -and
        -not $ActualLanguage.StartsWith("en")
    ) {
        throw "EN_LANGUAGE_ACTIVATION_FAILED"
    }

    if (
        $Language -eq "ko" -and
        -not $ActualLanguage.StartsWith("ko")
    ) {
        throw "KO_LANGUAGE_ACTIVATION_FAILED"
    }

    [void](
        Invoke-Js `
            -Expression `
            "localStorage.removeItem('python-reading-trainer-diagnostic-v400-2'); true"
    )

    $TabText = [string](
        Invoke-Js `
            -Expression `
            "document.querySelector('[data-view=`"diagnostic`"]').textContent.trim()"
    )

    Write-Host (
        "LOCALE={0}|TAB_TEXT={1}" -f `
        $Language,
        $TabText
    )

    $Opened = Invoke-Js `
        -Expression @"
(function(){
    const tab = document.querySelector(
        '[data-view="diagnostic"]'
    );
    if (!tab) return false;
    tab.click();
    return true;
})()
"@

    if ($Opened -ne $true) {
        throw "DIAGNOSTIC_TAB_CLICK_FAILED"
    }

    if (
        -not (
            Wait-Js `
                -Expression `
                "document.getElementById('diagnosticPrimaryV4002') !== null" `
                -Seconds 15
        )
    ) {
        throw "DIAGNOSTIC_HOME_NOT_RENDERED"
    }

    $Started = Invoke-Js `
        -Expression @"
(function(){
    const button = document.getElementById(
        'diagnosticPrimaryV4002'
    );
    if (!button) return false;
    button.click();
    return true;
})()
"@

    if ($Started -ne $true) {
        throw "BASELINE_START_FAILED"
    }

    $Baseline = Invoke-Stage `
        -Stage "baseline" `
        -Minimum 24 `
        -Maximum 24

    Start-NextStage

    $Checkpoint = Invoke-Stage `
        -Stage "checkpoint" `
        -Minimum 6 `
        -Maximum 8

    Start-NextStage

    $Retest = Invoke-Stage `
        -Stage "retest" `
        -Minimum 24 `
        -Maximum 24

    $Summary = Invoke-Js `
        -Expression @"
(function(){
    const c = JSON.parse(
        localStorage.getItem(
            'python-reading-trainer-diagnostic-v400-2'
        ) || '{}'
    );

    const baseline =
        c.baseline && Array.isArray(c.baseline.question_ids)
            ? c.baseline.question_ids
            : [];

    const checkpoint =
        c.checkpoint && Array.isArray(c.checkpoint.question_ids)
            ? c.checkpoint.question_ids
            : [];

    const retest =
        c.retest && Array.isArray(c.retest.question_ids)
            ? c.retest.question_ids
            : [];

    const all = [
        ...baseline,
        ...checkpoint,
        ...retest
    ];

    return {
        baseline: baseline.length,
        checkpoint: checkpoint.length,
        retest: retest.length,
        total: all.length,
        unique: new Set(all).size,
        overlap: all.length - new Set(all).size,
        completed:
            !!c.baseline &&
            !!c.checkpoint &&
            !!c.retest,
        doneSteps:
            document.querySelectorAll(
                '.diagnostic-stage-step-v4002.done'
            ).length
    };
})()
"@

    Write-Host (
        "LOCALE={0}|BASELINE={1}|CHECKPOINT={2}|RETEST={3}|TOTAL={4}|UNIQUE={5}|OVERLAP={6}|DONE={7}|STEPS={8}" -f `
        $Language,
        $Summary.baseline,
        $Summary.checkpoint,
        $Summary.retest,
        $Summary.total,
        $Summary.unique,
        $Summary.overlap,
        $Summary.completed,
        $Summary.doneSteps
    )

    $Pass = (
        [int]$Summary.baseline -eq 24 -and
        [int]$Summary.checkpoint -ge 6 -and
        [int]$Summary.checkpoint -le 8 -and
        [int]$Summary.retest -eq 24 -and
        [int]$Summary.overlap -eq 0 -and
        $Summary.completed -eq $true -and
        [int]$Summary.doneSteps -eq 3
    )

    Write-Host (
        "LOCALE={0}|E2E_PASS={1}" -f `
        $Language,
        $Pass
    )

    if (-not $Pass) {
        throw (
            "LOCALE_E2E_FAILED:{0}" -f `
            $Language
        )
    }

    return @{
        language = $Language
        baseline = [int]$Summary.baseline
        checkpoint = [int]$Summary.checkpoint
        retest = [int]$Summary.retest
        overlap = [int]$Summary.overlap
        pass = $Pass
    }
}

try {
    Write-Host "=== V400.2 DIAGNOSTIC BROWSER E2E ==="
    Write-Host "SOURCE_CARD_MUTATION_PLANNED=False"
    Write-Host "DEVELOPER_MODE_MUTATION=False"

    $BrowserCandidates = @(
        "C:\Program Files\Google\Chrome\Application\chrome.exe",
        "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        "C:\Program Files\Naver\Naver Whale\Application\whale.exe"
    )

    $Browser = $BrowserCandidates |
        Where-Object {
            Test-Path `
                -LiteralPath $_ `
                -PathType Leaf
        } |
        Select-Object -First 1

    if (-not $Browser) {
        Write-Host "STATUS=BLOCKED_BROWSER_NOT_FOUND"
        exit 20
    }

    Write-Host "BROWSER=$Browser"

    $Python = (
        Get-Command python -ErrorAction Stop
    ).Source

    $HttpOut = "$Audit\http_stdout.log"
    $HttpErr = "$Audit\http_stderr.log"

    $HttpProcess = Start-Process `
        -FilePath $Python `
        -ArgumentList @(
            "-m",
            "http.server",
            "$HttpPort",
            "--bind",
            "127.0.0.1"
        ) `
        -WorkingDirectory $Repo `
        -RedirectStandardOutput $HttpOut `
        -RedirectStandardError $HttpErr `
        -WindowStyle Hidden `
        -PassThru

    $IndexUrl = (
        "http://127.0.0.1:{0}/src/pwa/index.html" -f `
        $HttpPort
    )

    if (
        -not (
            Wait-Http `
                -Url $IndexUrl `
                -Seconds 20
        )
    ) {
        Write-Host "STATUS=BLOCKED_HTTP_SERVER"
        exit 21
    }

    Write-Host "HTTP_SERVER_READY=True"

    New-Item `
        -ItemType Directory `
        -Path $Profile `
        -Force |
        Out-Null

    $BrowserProcess = Start-Process `
        -FilePath $Browser `
        -ArgumentList @(
            "--headless=new",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check",
            "--remote-debugging-port=$CdpPort",
            "--user-data-dir=$Profile",
            "about:blank"
        ) `
        -WindowStyle Hidden `
        -PassThru

    $DebugUrl = (
        "http://127.0.0.1:{0}/json/list" -f `
        $CdpPort
    )

    $Deadline = (
        Get-Date
    ).AddSeconds(20)

    $Target = $null

    while (
        (Get-Date) -lt $Deadline -and
        $null -eq $Target
    ) {
        try {
            $RawTargets = Invoke-RestMethod `
                -Uri $DebugUrl `
                -TimeoutSec 2

            $Targets = @()

            if ($RawTargets -is [System.Array]) {
                foreach ($Item in $RawTargets) {
                    $Targets += $Item
                }
            }
            else {
                $Targets = @($RawTargets)
            }

            $Target = @(
                $Targets |
                Where-Object {
                    $_.type -eq "page"
                } |
                Select-Object -First 1
            ) | Select-Object -First 1
        }
        catch {
        }

        if ($null -eq $Target) {
            Start-Sleep -Milliseconds 250
        }
    }

    if ($null -eq $Target) {
        Write-Host "STATUS=BLOCKED_CDP_TARGET"
        exit 22
    }

    $WsValues = @(
        $Target.webSocketDebuggerUrl
    )

    $WsUrl = [string](
        $WsValues |
        Where-Object {
            -not [string]::IsNullOrWhiteSpace(
                [string]$_
            )
        } |
        Select-Object -First 1
    )

    Write-Host "CDP_TARGET_TYPE=$($Target.GetType().FullName)"
    Write-Host "CDP_WS_VALUE_COUNT=$($WsValues.Count)"
    Write-Host "CDP_WS_URL_PRESENT=$(-not [string]::IsNullOrWhiteSpace($WsUrl))"

    if ([string]::IsNullOrWhiteSpace($WsUrl)) {
        throw "CDP_WEBSOCKET_URL_MISSING"
    }

    $WsUri = [Uri]::new(
        $WsUrl,
        [UriKind]::Absolute
    )

    $Socket = [System.Net.WebSockets.ClientWebSocket]::new()

    $Socket.ConnectAsync(
        $WsUri,
        [Threading.CancellationToken]::None
    ).GetAwaiter().GetResult()

    Write-Host "CDP_CONNECTED=True"

    [void](
        Invoke-Cdp `
            -Method "Runtime.enable"
    )

    [void](
        Invoke-Cdp `
            -Method "Page.enable"
    )

    $Ko = Test-Locale -Language "ko"
    $En = Test-Locale -Language "en"

    $Overall = (
        $Ko.pass -eq $true -and
        $En.pass -eq $true
    )

    Write-Host ""
    Write-Host "=== FINAL ==="
    Write-Host "KO_E2E_PASS=$($Ko.pass)"
    Write-Host "EN_E2E_PASS=$($En.pass)"
    Write-Host "KO_STAGE_OVERLAP=$($Ko.overlap)"
    Write-Host "EN_STAGE_OVERLAP=$($En.overlap)"
    Write-Host "FULL_BROWSER_E2E_PASS=$Overall"
    Write-Host "AUDIT=$Audit"

    if (-not $Overall) {
        Write-Host "STATUS=R2_DIAGNOSTIC_BROWSER_E2E_FAIL"
        exit 23
    }

    Write-Host "STATUS=R2_DIAGNOSTIC_BROWSER_E2E_PASS"
}
catch {
    Write-Host (
        "ERROR={0}" -f `
        $_.Exception.Message
    )

    Write-Host "STATUS=R2_DIAGNOSTIC_BROWSER_E2E_BLOCKED"
    exit 30
}
finally {
    if ($null -ne $Socket) {
        try {
            $Socket.Dispose()
        }
        catch {
        }
    }

    if (
        $null -ne $BrowserProcess -and
        -not $BrowserProcess.HasExited
    ) {
        Stop-Process `
            -Id $BrowserProcess.Id `
            -Force `
            -ErrorAction SilentlyContinue
    }

    if (
        $null -ne $HttpProcess -and
        -not $HttpProcess.HasExited
    ) {
        Stop-Process `
            -Id $HttpProcess.Id `
            -Force `
            -ErrorAction SilentlyContinue
    }
}
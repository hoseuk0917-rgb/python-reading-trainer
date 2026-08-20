$ErrorActionPreference = "Stop"

$Repo = "D:\projects\python-reading-trainer-r2-diagnostic"
$HttpPort = 3384
$CdpPort = 9334

$Stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$Audit = "$Repo\_audit\v400_2_r21_compact_e2e_$Stamp"
$Profile = Join-Path $env:TEMP "prt_r21_compact_$Stamp"

New-Item -ItemType Directory -Path $Audit -Force | Out-Null

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
            $Details = $Response.result.exceptionDetails
            $DetailText = [string]$Details.text
            $DetailLine = [string]$Details.lineNumber
            $DetailColumn = [string]$Details.columnNumber

            if ($null -ne $Details.exception) {
                if (-not [string]::IsNullOrWhiteSpace([string]$Details.exception.description)) {
                    $DetailText = [string]$Details.exception.description
                }
                elseif (-not [string]::IsNullOrWhiteSpace([string]$Details.exception.value)) {
                    $DetailText = [string]$Details.exception.value
                }
            }

            $DetailText = $DetailText -replace "[\r\n]+", " | "

            throw ("JS_EVALUATION_EXCEPTION|LINE={0}|COLUMN={1}|DETAIL={2}" -f $DetailLine,$DetailColumn,$DetailText)
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



function Test-RemediationLocale {
    param(
        [ValidateSet("ko", "en")]
        [string]$Language
    )

    $Url = (
        "http://127.0.0.1:{0}/src/pwa/index.html?lang={1}&r21={2}" -f `
        $HttpPort,
        $Language,
        [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    )

    Write-Host ("NAVIGATE_REQUEST={0}" -f $Url)

    $NavigateResult = Invoke-Cdp `
        -Method "Page.navigate" `
        -Params @{
            url = $Url
        }

    $NavigateError = ""

    if (
        $null -ne $NavigateResult.result -and
        $null -ne $NavigateResult.result.errorText
    ) {
        $NavigateError = [string]$NavigateResult.result.errorText
    }

    Write-Host ("NAVIGATE_ERROR={0}" -f $NavigateError)

    Start-Sleep -Milliseconds 500

    $HrefAfterNavigate = Invoke-Js `
        -Expression 'String(location.href)'

    $TitleAfterNavigate = Invoke-Js `
        -Expression 'String(document.title || "")'

    Write-Host ("HREF_AFTER_NAVIGATE={0}" -f $HrefAfterNavigate)
    Write-Host ("TITLE_AFTER_NAVIGATE={0}" -f $TitleAfterNavigate)

    $Ready = Wait-Js `
        -Expression `
        "window.PRTDiagnosticRemediationV4002 && window.PRTDiagnosticV4002 && typeof cards !== 'undefined' && Array.isArray(cards) && cards.length === 1785" `
        -Seconds 30

    if (-not $Ready) {
        $ProbeState = Invoke-Js -Expression 'document.readyState'
        $ProbeLang = Invoke-Js -Expression 'String(document.documentElement.lang || "")'
        $ProbeDiag = Invoke-Js -Expression '!!window.PRTDiagnosticV4002'
        $ProbeRem = Invoke-Js -Expression '!!window.PRTDiagnosticRemediationV4002'
        $ProbeTab = Invoke-Js -Expression '!!document.querySelector("[data-view=diagnostic]")'
        $ProbeCardType = Invoke-Js -Expression '(function(){try{return typeof cards;}catch(e){return "error";}})()'
        $ProbeCardCount = Invoke-Js -Expression '(function(){try{return Array.isArray(cards) ? cards.length : -1;}catch(e){return -2;}})()'
        $ProbeDiagScript = Invoke-Js -Expression 'Array.from(document.scripts).filter(function(s){return String(s.src).indexOf("diagnostic_v400_2.js")>=0;}).length'
        $ProbeRemScript = Invoke-Js -Expression 'Array.from(document.scripts).filter(function(s){return String(s.src).indexOf("diagnostic_remediation_v400_2.js")>=0;}).length'

        Write-Host ("READY_PROBE=STATE:{0}|LANG:{1}|DIAG_BRIDGE:{2}|REM_BRIDGE:{3}|TAB:{4}|CARDS_TYPE:{5}|CARD_COUNT:{6}|DIAG_SCRIPT:{7}|REM_SCRIPT:{8}" -f $ProbeState,$ProbeLang,$ProbeDiag,$ProbeRem,$ProbeTab,$ProbeCardType,$ProbeCardCount,$ProbeDiagScript,$ProbeRemScript)

        throw "APP_READY_FAILED:$Language"
    }

    $FlowJs = @"
(async function () {
    function sleep(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }

    async function waitFor(fn, timeout) {
        const started = Date.now();

        while (Date.now() - started < timeout) {
            try {
                if (fn()) {
                    return true;
                }
            } catch (_) {
            }

            await sleep(40);
        }

        return false;
    }

    const isEn = String(
        document.documentElement.lang || ""
    ).toLowerCase().startsWith("en");

    const DIAG =
        "python-reading-trainer-diagnostic-v400-2";

    const REM =
        "python-reading-trainer-diagnostic-remediation-v400-2";

    const TOOLS =
        "python-reading-trainer-study-tools-v7";

    const QUEUE =
        "python-reading-trainer-study-queue-progress-v7-2";

    [DIAG, REM, TOOLS, QUEUE].forEach(function(key) {
        localStorage.removeItem(key);
    });

    const now = new Date().toISOString();

    const axisScores = {
        value_flow: {
            correct: 3,
            total: 3
        },
        branch_condition: {
            correct: 3,
            total: 3
        },
        loop_collection: {
            correct: 2,
            total: 3
        },
        function_call_return: {
            correct: 2,
            total: 3
        },
        file_error_path: {
            correct: 1,
            total: 3
        },
        object_module: {
            correct: 1,
            total: 3
        },
        data_processing: {
            correct: 0,
            total: 3
        },
        project_flow: {
            correct: 0,
            total: 3
        }
    };

    localStorage.setItem(
        DIAG,
        JSON.stringify({
            version: "V400.2_DIAGNOSTIC_V2",
            cycle_started_at: now,
            baseline: {
                completed_at: now,
                score: 12,
                total: 24,
                axis_scores: axisScores,
                question_ids: [],
                responses: {}
            },
            checkpoint: null,
            retest: null
        })
    );

    const tab = document.querySelector(
        '[data-view="diagnostic"]'
    );

    if (!tab) {
        throw new Error("DIAGNOSTIC_TAB_MISSING");
    }

    tab.click();

    const reportReady = await waitFor(
        function() {
            return (
                document.getElementById(
                    "diagnosticFullReportV4002"
                )
                && document.getElementById(
                    "diagnosticTailoredStartV4002"
                )
                && document.querySelectorAll(
                    ".diagnostic-report-grid-v4002 article"
                ).length === 3
                && document.querySelectorAll(
                    ".diagnostic-focus-btn-v4002"
                ).length >= 4
            );
        },
        10000
    );

    if (!reportReady) {
        throw new Error("REPORT_NOT_READY");
    }

    const report = {
        exists: true,
        sections:
            document.querySelectorAll(
                ".diagnostic-report-grid-v4002 article"
            ).length,
        focusButtons:
            document.querySelectorAll(
                ".diagnostic-focus-btn-v4002"
            ).length
    };

    document.getElementById(
        "diagnosticTailoredStartV4002"
    ).click();

    const tailoredReady = await waitFor(
        function() {
            const tools = JSON.parse(
                localStorage.getItem(TOOLS) || "{}"
            );

            const rem = JSON.parse(
                localStorage.getItem(REM) || "{}"
            );

            return (
                Array.isArray(tools.queueIds)
                && tools.queueIds.length === 10
                && rem.last_queue
                && Array.isArray(
                    rem.last_queue.queue_ids
                )
                && rem.last_queue.queue_ids.length === 10
            );
        },
        10000
    );

    if (!tailoredReady) {
        throw new Error("TAILORED_QUEUE_NOT_READY");
    }

    let tools = JSON.parse(
        localStorage.getItem(TOOLS)
    );

    let rem = JSON.parse(
        localStorage.getItem(REM)
    );

    const dataUrl = isEn
        ? "../../data_i18n/en/diagnostic/diagnostic_v400_2.json"
        : "../../data/diagnostic/diagnostic_v400_2.json";

    const data = await fetch(
        dataUrl,
        {
            cache: "no-store"
        }
    ).then(function(response) {
        return response.json();
    });

    const excluded = new Set();

    data.stages.baseline.questions
        .concat(
            data.stages.retest.questions
        )
        .forEach(function(row) {
            excluded.add(
                row.source_card_id
            );
        });

    Object.keys(
        data.stages.checkpoint.pool
    ).forEach(function(axisId) {
        data.stages.checkpoint.pool[
            axisId
        ].forEach(function(row) {
            excluded.add(
                row.source_card_id
            );
        });
    });

    const ids = tools.queueIds || [];

    const counts =
        rem.last_queue.axis_counts || {};

    const strong =
        Number(counts.value_flow || 0)
        + Number(counts.branch_condition || 0);

    const developing =
        Number(counts.loop_collection || 0)
        + Number(counts.function_call_return || 0);

    const weak =
        Number(counts.file_error_path || 0)
        + Number(counts.object_module || 0);

    const critical =
        Number(counts.data_processing || 0)
        + Number(counts.project_flow || 0);

    const tailored = {
        count: ids.length,
        unique: new Set(ids).size,
        overlap:
            ids.filter(function(id) {
                return excluded.has(id);
            }).length,
        strong: strong,
        developing: developing,
        weak: weak,
        critical: critical
    };

    tab.click();

    let focusAxis = null;

    const focusClicked = await waitFor(
        function() {
            const button =
                document.querySelector(
                    ".diagnostic-focus-btn-v4002"
                );

            if (!button) {
                return false;
            }

            const axis = button.dataset.axis;

            if (!axis) {
                return false;
            }

            focusAxis = axis;
            button.click();

            return true;
        },
        10000
    );

    if (!focusClicked || !focusAxis) {
        throw new Error("FOCUS_BUTTON_NOT_READY");
    }

    const focusQueueReady = await waitFor(
        function() {
            const value = JSON.parse(
                localStorage.getItem(REM) || "{}"
            );

            return (
                value.last_queue
                && value.last_queue.focus_axis
                    === focusAxis
                && Array.isArray(
                    value.last_queue.queue_ids
                )
                && value.last_queue
                    .queue_ids.length === 10
            );
        },
        10000
    );

    if (!focusQueueReady) {
        throw new Error("FOCUS_QUEUE_NOT_READY");
    }

    rem = JSON.parse(
        localStorage.getItem(REM)
    );

    const focusCounts =
        rem.last_queue.axis_counts || {};

    const focusIds =
        rem.last_queue.queue_ids || [];

    const focusCount =
        Number(
            focusCounts[focusAxis] || 0
        );

    const otherCount =
        Object.keys(focusCounts)
            .filter(function(key) {
                return key !== focusAxis;
            })
            .reduce(function(sum, key) {
                return (
                    sum
                    + Number(
                        focusCounts[key] || 0
                    )
                );
            }, 0);

    const focus = {
        axis: focusAxis,
        count: focusCount,
        other: otherCount,
        unique:
            new Set(focusIds).size,
        overlap:
            focusIds.filter(
                function(id) {
                    return excluded.has(id);
                }
            ).length
    };

    tools = JSON.parse(
        localStorage.getItem(TOOLS)
    );

    localStorage.setItem(
        QUEUE,
        JSON.stringify({
            doneIds:
                tools.queueIds || []
        })
    );

    window
        .PRTDiagnosticRemediationV4002
        .refresh();

    const checkpointText = isEn
            ? "Checkpoint"
            : "\uC911\uAC04 \uC810\uAC80";

    const checkpointPrompt =
        await waitFor(
            function() {
                const button =
                    document.getElementById(
                        "diagnosticPromptActionV4002"
                    );

                return (
                    button
                    && button.textContent
                        .indexOf(
                            checkpointText
                        ) >= 0
                );
            },
            5000
        );

    const cycle = JSON.parse(
        localStorage.getItem(DIAG)
    );

    cycle.checkpoint = {
        completed_at:
            new Date(
                Date.now() - 1000
            ).toISOString(),
        score: 3,
        total: 6,
        axis_scores: {
            data_processing: {
                correct: 1,
                total: 2
            },
            project_flow: {
                correct: 1,
                total: 2
            },
            object_module: {
                correct: 1,
                total: 2
            }
        },
        question_ids: [],
        responses: {}
    };

    localStorage.setItem(
        DIAG,
        JSON.stringify(cycle)
    );

    const beforeGeneration =
        JSON.parse(
            localStorage.getItem(REM)
            || "{}"
        ).generated_count || 0;

    window
        .PRTDiagnosticRemediationV4002
        .startTailored();

    const postCheckpointReady =
        await waitFor(
            function() {
                const value = JSON.parse(
                    localStorage.getItem(REM)
                    || "{}"
                );

                return (
                    Number(
                        value.generated_count
                        || 0
                    ) > beforeGeneration
                    && value.last_queue
                    && Array.isArray(
                        value.last_queue.queue_ids
                    )
                    && value.last_queue
                        .queue_ids.length === 10
                );
            },
            10000
        );

    if (!postCheckpointReady) {
        throw new Error(
            "POST_CHECKPOINT_QUEUE_NOT_READY"
        );
    }

    tools = JSON.parse(
        localStorage.getItem(TOOLS)
    );

    localStorage.setItem(
        QUEUE,
        JSON.stringify({
            doneIds:
                tools.queueIds || []
        })
    );

    window
        .PRTDiagnosticRemediationV4002
        .refresh();

    const retestText = isEn
            ? "Final retest"
            : "\uCD5C\uC885 \uC7AC\uC9C4\uB2E8";

    const retestPrompt =
        await waitFor(
            function() {
                const button =
                    document.getElementById(
                        "diagnosticPromptActionV4002"
                    );

                return (
                    button
                    && button.textContent
                        .indexOf(
                            retestText
                        ) >= 0
                );
            },
            5000
        );

    return {
        htmlLang:
            String(
                document.documentElement.lang
                || ""
            ),
        report: report,
        tailored: tailored,
        focus: focus,
        checkpointPrompt:
            checkpointPrompt,
        retestPrompt:
            retestPrompt
    };
})()
"@

        Write-Host ""
        $FlowDebug = Join-Path $Audit ("flowjs_{0}.js" -f $Language)

        [IO.File]::WriteAllText(
            $FlowDebug,
            $FlowJs,
            [Text.UTF8Encoding]::new($false)
        )

        $NodeOutput = @(
            & node --check $FlowDebug 2>&1
        )

        $FlowNodeRc = $LASTEXITCODE

        if ($FlowNodeRc -ne 0) {
            $NodeError = (
                ($NodeOutput -join " ") -replace "\s+", " "
            ).Trim()

            throw (
                "FLOWJS_NODE_SYNTAX_FAILED:{0}|{1}" -f `
                $Language,
                $NodeError
            )
        }

        Write-Host "FLOWJS_NODE_SYNTAX_PASS=True"

    $Result = Invoke-Js `
        -Expression $FlowJs

    $TailoredPass = (
        [int]$Result.tailored.count -eq 10 -and
        [int]$Result.tailored.unique -eq 10 -and
        [int]$Result.tailored.overlap -eq 0 -and
        [int]$Result.tailored.critical -gt [int]$Result.tailored.strong -and
        [int]$Result.tailored.weak -ge [int]$Result.tailored.strong
    )

    $FocusPass = (
        [int]$Result.focus.count -eq 10 -and
        [int]$Result.focus.other -eq 0 -and
        [int]$Result.focus.unique -eq 10 -and
        [int]$Result.focus.overlap -eq 0
    )

    $ReportPass = (
        $Result.report.exists -eq $true -and
        [int]$Result.report.sections -eq 3 -and
        [int]$Result.report.focusButtons -ge 4
    )

    $Pass = (
        $ReportPass -and
        $TailoredPass -and
        $FocusPass -and
        $Result.checkpointPrompt -eq $true -and
        $Result.retestPrompt -eq $true
    )

    Write-Host (
        "LOCALE={0}|REPORT={1}|SECTIONS={2}|FOCUS_BUTTONS={3}" -f `
        $Language,
        $ReportPass,
        $Result.report.sections,
        $Result.report.focusButtons
    )

    Write-Host (
        "LOCALE={0}|TAILORED=10|UNIQUE={1}|OVERLAP={2}|STRONG={3}|DEVELOPING={4}|WEAK={5}|CRITICAL={6}|PASS={7}" -f `
        $Language,
        $Result.tailored.unique,
        $Result.tailored.overlap,
        $Result.tailored.strong,
        $Result.tailored.developing,
        $Result.tailored.weak,
        $Result.tailored.critical,
        $TailoredPass
    )

    Write-Host (
        "LOCALE={0}|FOCUS_AXIS={1}|FOCUS_COUNT={2}|OTHER={3}|OVERLAP={4}|PASS={5}" -f `
        $Language,
        $Result.focus.axis,
        $Result.focus.count,
        $Result.focus.other,
        $Result.focus.overlap,
        $FocusPass
    )

    Write-Host (
        "LOCALE={0}|CHECKPOINT_PROMPT={1}|RETEST_PROMPT={2}" -f `
        $Language,
        $Result.checkpointPrompt,
        $Result.retestPrompt
    )

    Write-Host (
        "LOCALE={0}|R21_E2E_PASS={1}" -f `
        $Language,
        $Pass
    )

    return $Pass
}

$FullPass = $false

try {
    Write-Host "=== V400.2 R2.1 COMPACT BROWSER E2E ==="

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
        throw "BROWSER_NOT_FOUND"
    }

    Write-Host "BROWSER=$Browser"

    $Python = (
        Get-Command python -ErrorAction Stop
    ).Source

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
        -RedirectStandardOutput "$Audit\http_stdout.log" `
        -RedirectStandardError "$Audit\http_stderr.log" `
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
        throw "HTTP_SERVER_FAILED"
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

    $Deadline = (Get-Date).AddSeconds(20)
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
                    if ($Item -is [System.Array]) {
                        foreach ($Nested in $Item) {
                            $Targets += $Nested
                        }
                    }
                    else {
                        $Targets += $Item
                    }
                }
            }
            else {
                $Targets = @($RawTargets)
            }

            $PageTargets = @(
                $Targets |
                    Where-Object {
                        $null -ne $_ -and
                        [string]$_.type -eq "page"
                    }
            )

            $Target = @(
                $PageTargets |
                    Where-Object {
                        [string]$_.url -eq "about:blank"
                    }
            ) | Select-Object -First 1

            if ($null -eq $Target) {
                $Target = @(
                    $PageTargets |
                        Where-Object {
                            $UrlText = [string]$_.url

                            -not $UrlText.StartsWith("chrome-extension://") -and
                            -not $UrlText.StartsWith("devtools://")
                        }
                ) | Select-Object -First 1
            }

            if ($null -eq $Target) {
                $Target = @(
                    $PageTargets
                ) | Select-Object -First 1
            }
        }
        catch {
        }

        if ($null -eq $Target) {
            Start-Sleep -Milliseconds 250
        }
    }

    if ($null -eq $Target) {
        throw "CDP_TARGET_FAILED"
    }

    $WsUrl = [string](
        @(
            $Target.webSocketDebuggerUrl
        ) |
        Select-Object -First 1
    )

    if (
        [string]::IsNullOrWhiteSpace(
            $WsUrl
        )
    ) {
        throw "CDP_WS_URL_MISSING"
    }

    $Socket = [System.Net.WebSockets.ClientWebSocket]::new()

    $Socket.ConnectAsync(
        [Uri]::new(
            $WsUrl,
            [UriKind]::Absolute
        ),
        [Threading.CancellationToken]::None
    ).GetAwaiter().GetResult() |
    Out-Null

    Write-Host "CDP_CONNECTED=True"

    [void](
        Invoke-Cdp `
            -Method "Runtime.enable"
    )

    [void](
        Invoke-Cdp `
            -Method "Page.enable"
    )

    $Ko = Test-RemediationLocale `
        -Language "ko"

    $En = Test-RemediationLocale `
        -Language "en"

    $FullPass = (
        $Ko -eq $true -and
        $En -eq $true
    )

    Write-Host ""
    Write-Host "KO_R21_E2E_PASS=$Ko"
    Write-Host "EN_R21_E2E_PASS=$En"
    Write-Host "FULL_R21_E2E_PASS=$FullPass"
    Write-Host "AUDIT=$Audit"
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

if (-not $FullPass) {
    throw "R21_COMPACT_E2E_FAILED"
}

Write-Host "STATUS=R21_REMEDIATION_BROWSER_E2E_PASS"

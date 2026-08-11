param(
    [Parameter(Mandatory = $true)]
    [string]$ExpectedBase,

    [Parameter(Mandatory = $true)]
    [string]$ArchifyRoot,

    [string]$MainRoot = "D:\projects\python-reading-trainer",

    [switch]$PushFeature
)

$ErrorActionPreference = "Stop"

if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ServerPath = Join-Path $RepoRoot "tools\local_prt_server.js"
$RendererPath = Join-Path $RepoRoot "tools\local_prt_python_archify_execution_renderer_v0_1.js"
$AuditPath = Join-Path $RepoRoot "tools\audit_local_prt_python_archify_execution_endpoint_v0_1.js"
$PythonProjectionBridge = Join-Path $RepoRoot "tools\python_reading_archify_server_bridge_v0_1.py"
$FeatureBranch = "feat/python-reading-graph-ir"
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$Committed = $false

function Replace-ExactOnce {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text,
        [Parameter(Mandatory = $true)]
        [string]$Old,
        [Parameter(Mandatory = $true)]
        [string]$New,
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    $Count = ([regex]::Matches($Text, [regex]::Escape($Old))).Count
    Write-Host "$Name`_ANCHOR_COUNT=$Count"
    if ($Count -ne 1) {
        throw "ABORT=$Name`_ANCHOR_COUNT_$Count"
    }
    return $Text.Replace($Old, $New)
}

Write-Host "=== LOCAL PRT PYTHON ARCHIFY EXECUTION ENDPOINT B2A R2 ==="
Write-Host "EXPECTED_BASE=$ExpectedBase"
Write-Host "ARCHIFY_ROOT=$ArchifyRoot"
Write-Host "FEATURE_BRANCH=$FeatureBranch"
Write-Host "MAIN_WRITE_PLANNED=False"
Write-Host "PWA_WRITE_PLANNED=False"
Write-Host "GRAPH_IR_SEMANTICS_WRITE_PLANNED=False"
Write-Host "ARCHIFY_GEOMETRY_WRITE_PLANNED=False"
Write-Host "LOCAL_SERVER_WRITE_PLANNED=True"
Write-Host "PUSH_FEATURE=$($PushFeature.IsPresent)"

Write-Host "`n=== 1. SAFETY PREFLIGHT ==="

$Head = git -C $RepoRoot rev-parse HEAD
$Status = @(git -C $RepoRoot status --porcelain)
$MainHead = git -C $MainRoot rev-parse HEAD
$MainStatus = @(git -C $MainRoot status --porcelain)

Write-Host "REPO_ROOT=$RepoRoot"
Write-Host "HEAD=$Head"
Write-Host "MAIN_HEAD=$MainHead"

if ($Head -ne $ExpectedBase) { throw "ABORT=UNEXPECTED_EVAL_HEAD" }
if ($Status.Count -gt 0) {
    Write-Host "EVAL_STATUS="
    $Status
    throw "ABORT=EVAL_NOT_CLEAN"
}
if ($MainStatus.Count -gt 0) {
    Write-Host "MAIN_STATUS="
    $MainStatus
    throw "ABORT=MAIN_NOT_CLEAN"
}
if (-not (Test-Path -LiteralPath $ArchifyRoot -PathType Container)) {
    throw "ABORT=ARCHIFY_ROOT_NOT_FOUND"
}
foreach ($Required in @($ServerPath, $RendererPath, $AuditPath, $PythonProjectionBridge)) {
    if (-not (Test-Path -LiteralPath $Required -PathType Leaf)) {
        throw "ABORT=REQUIRED_FILE_NOT_FOUND:$Required"
    }
}
Write-Host "LOCAL_PREFLIGHT=PASS"

Write-Host "`n=== 2. REMOTE AUTHORITY CHECK ==="

git -C $RepoRoot fetch origin $FeatureBranch
if ($LASTEXITCODE -ne 0) { throw "ABORT=FETCH_FAILED" }
$RemoteHead = git -C $RepoRoot rev-parse "origin/$FeatureBranch"
Write-Host "REMOTE_FEATURE_HEAD=$RemoteHead"
if ($RemoteHead -ne $ExpectedBase) { throw "ABORT=UNEXPECTED_REMOTE_FEATURE_HEAD" }
Write-Host "REMOTE_AUTHORITY=PASS"

$Original = [System.IO.File]::ReadAllText($ServerPath)
$Text = $Original

try {
    Write-Host "`n=== 3. EXACT SERVER PATCH ==="

    $Text = Replace-ExactOnce `
        -Text $Text `
        -Name "VERSION" `
        -Old 'const VERSION = "v338_reconcile_a1";' `
        -New 'const VERSION = "v338_archify_b2a";'

    $Text = Replace-ExactOnce `
        -Text $Text `
        -Name "RENDERER_IMPORT" `
        -Old 'const vm = require("vm");' `
        -New @'
const vm = require("vm");
const { renderPythonExecution } = require("./local_prt_python_archify_execution_renderer_v0_1.js");
'@.TrimEnd()

    $Text = Replace-ExactOnce `
        -Text $Text `
        -Name "HEALTH_ENGINE" `
        -Old @'
      pythonAst: true,
      pythonReconciliation: true
'@.TrimEnd() `
        -New @'
      pythonAst: true,
      pythonReconciliation: true,
      pythonArchifyExecution: true
'@.TrimEnd()

    $Text = Replace-ExactOnce `
        -Text $Text `
        -Name "HEALTH_NEXT" `
        -Old '    next: "V338 reconciliation A1 adds a localhost Python AST + rule-analyzer structural endpoint without replacing /analyze-code."' `
        -New '    next: "V338 Archify B2A adds verified localhost Archify execution rendering over canonical Python reconciliation output."'

    $Handler = @'
async function handleRenderPythonExecution(req, res) {
  const body = await readJsonBody(req);
  const source = body.source || body.code || body.text || "";
  const language = body.language || body.requestedLanguage || "auto";
  const sourceName = body.sourceName || body.source_name || "<memory>.py";
  const locale = body.locale || "ko";

  if (!String(source).trim()) {
    sendJson(req, res, 400, {
      ok: false,
      service: SERVICE,
      version: VERSION,
      error: "missing_source",
      message: "POST /render-python-execution requires a non-empty source, code, or text field."
    });
    return;
  }

  const structurePayload = await buildPythonStructurePayload(
    String(source),
    String(language),
    String(sourceName)
  );
  const payload = await renderPythonExecution({
    repoRoot: ROOT,
    structurePayload,
    locale: String(locale)
  });
  payload.service = SERVICE;
  payload.version = VERSION;
  payload.route = "POST /render-python-execution";
  payload.privacy = Object.assign({}, payload.privacy || {}, {
    localhostOnly: host === "127.0.0.1" || host === "localhost"
  });
  sendJson(req, res, 200, payload);
}

async function handleAnalyzeCode(req, res) {
'@

    $Text = Replace-ExactOnce `
        -Text $Text `
        -Name "RENDER_HANDLER" `
        -Old 'async function handleAnalyzeCode(req, res) {' `
        -New $Handler.TrimEnd()

    $Text = Replace-ExactOnce `
        -Text $Text `
        -Name "RENDER_ROUTE" `
        -Old @'
  if (req.method === "POST" && url.pathname === "/analyze-python-structure") {
    await handleAnalyzePythonStructure(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/proofy/explain") {
'@.TrimEnd() `
        -New @'
  if (req.method === "POST" && url.pathname === "/analyze-python-structure") {
    await handleAnalyzePythonStructure(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/render-python-execution") {
    await handleRenderPythonExecution(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/proofy/explain") {
'@.TrimEnd()

    $EndpointPairOld = @'
      "POST /analyze-python-structure",
      "POST /proofy/explain"
'@.TrimEnd()
    $EndpointPairNew = @'
      "POST /analyze-python-structure",
      "POST /render-python-execution",
      "POST /proofy/explain"
'@.TrimEnd()

    $EndpointPairCount = ([regex]::Matches($Text, [regex]::Escape($EndpointPairOld))).Count
    Write-Host "ENDPOINT_ARRAY_PAIR_ANCHOR_COUNT=$EndpointPairCount"
    if ($EndpointPairCount -ne 2) {
        throw "ABORT=ENDPOINT_ARRAY_PAIR_ANCHOR_COUNT_$EndpointPairCount"
    }
    $Text = $Text.Replace($EndpointPairOld, $EndpointPairNew)

    $ListenPairOld = @'
      "http://" + host + ":" + port + "/analyze-python-structure",
      "http://" + host + ":" + port + "/proofy/explain"
'@.TrimEnd()
    $ListenPairNew = @'
      "http://" + host + ":" + port + "/analyze-python-structure",
      "http://" + host + ":" + port + "/render-python-execution",
      "http://" + host + ":" + port + "/proofy/explain"
'@.TrimEnd()

    $Text = Replace-ExactOnce `
        -Text $Text `
        -Name "LISTEN_ENDPOINT_ARRAY" `
        -Old $ListenPairOld `
        -New $ListenPairNew

    [System.IO.File]::WriteAllText($ServerPath, $Text, $Utf8NoBom)
    Write-Host "SERVER_PATCH_APPLIED=True"

    Write-Host "`n=== 4. CHANGE SCOPE VERIFY ==="
    $Changed = @(git -C $RepoRoot status --porcelain)
    $ChangedPaths = @(
        $Changed | ForEach-Object {
            if ($_ -match '^..\s+(.+)$') { $Matches[1] }
        }
    )
    $ChangedPaths | ForEach-Object { Write-Host "CHANGED=$_" }
    if ($ChangedPaths.Count -ne 1 -or $ChangedPaths[0] -ne "tools/local_prt_server.js") {
        throw "ABORT=UNEXPECTED_CHANGE_SCOPE"
    }
    Write-Host "ONLY_LOCAL_SERVER_CHANGED=True"

    Write-Host "`n=== 5. STATIC CHECKS ==="
    node --check $ServerPath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=SERVER_NODE_CHECK_FAILED" }
    node --check $RendererPath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=RENDERER_NODE_CHECK_FAILED" }
    node --check $AuditPath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=ARCHIFY_AUDIT_NODE_CHECK_FAILED" }

    python -m py_compile `
        (Join-Path $RepoRoot "tools\python_reading_graph_ir_v0_1.py") `
        (Join-Path $RepoRoot "tools\python_reading_reconciliation_v0_1.py") `
        (Join-Path $RepoRoot "tools\python_reading_reconciliation_server_bridge_v0_1.py") `
        $PythonProjectionBridge
    if ($LASTEXITCODE -ne 0) { throw "ABORT=PYTHON_COMPILE_FAILED" }
    Write-Host "STATIC_CHECKS=PASS"

    Write-Host "`n=== 6. RECONCILIATION REGRESSION ==="
    python (Join-Path $RepoRoot "tools\audit_python_reading_reconciliation_v0_1.py")
    if ($LASTEXITCODE -ne 0) { throw "ABORT=RECONCILIATION_REGRESSION_FAILED" }

    Write-Host "`n=== 7. STRUCTURE ENDPOINT REGRESSION ==="
    node (Join-Path $RepoRoot "tools\audit_local_prt_python_structure_endpoint_v0_1.js")
    if ($LASTEXITCODE -ne 0) { throw "ABORT=STRUCTURE_ENDPOINT_REGRESSION_FAILED" }

    Write-Host "`n=== 8. REAL ARCHIFY EXECUTION ENDPOINT AUDIT ==="
    $PriorArchifyRoot = $env:PRT_ARCHIFY_ROOT
    try {
        $env:PRT_ARCHIFY_ROOT = $ArchifyRoot
        node $AuditPath
        if ($LASTEXITCODE -ne 0) { throw "ABORT=ARCHIFY_EXECUTION_ENDPOINT_AUDIT_FAILED" }
    }
    finally {
        if ($null -eq $PriorArchifyRoot) {
            Remove-Item Env:PRT_ARCHIFY_ROOT -ErrorAction SilentlyContinue
        } else {
            $env:PRT_ARCHIFY_ROOT = $PriorArchifyRoot
        }
    }

    Write-Host "`n=== 9. COMMIT ==="
    git -C $RepoRoot add -- tools/local_prt_server.js
    if ($LASTEXITCODE -ne 0) { throw "ABORT=GIT_ADD_FAILED" }
    git -C $RepoRoot commit -m "Wire verified Archify execution rendering into local PRT server"
    if ($LASTEXITCODE -ne 0) { throw "ABORT=GIT_COMMIT_FAILED" }
    $Committed = $true
    $NewHead = git -C $RepoRoot rev-parse HEAD
    Write-Host "NEW_LOCAL_HEAD=$NewHead"
    Write-Host "COMMIT=PASS"

    if ($PushFeature) {
        Write-Host "`n=== 10. FAST-FORWARD PUSH ==="
        git -C $RepoRoot fetch origin $FeatureBranch
        if ($LASTEXITCODE -ne 0) { throw "ABORT=PRE_PUSH_FETCH_FAILED" }
        $RemoteBefore = git -C $RepoRoot rev-parse "origin/$FeatureBranch"
        Write-Host "REMOTE_BEFORE_PUSH=$RemoteBefore"
        if ($RemoteBefore -ne $ExpectedBase) { throw "ABORT=REMOTE_MOVED_BEFORE_PUSH" }
        git -C $RepoRoot push origin "HEAD:$FeatureBranch"
        if ($LASTEXITCODE -ne 0) { throw "ABORT=FEATURE_PUSH_FAILED" }
        git -C $RepoRoot fetch origin $FeatureBranch
        $RemoteAfter = git -C $RepoRoot rev-parse "origin/$FeatureBranch"
        Write-Host "REMOTE_AFTER_PUSH=$RemoteAfter"
        if ($RemoteAfter -ne $NewHead) { throw "ABORT=REMOTE_HEAD_MISMATCH_AFTER_PUSH" }
        Write-Host "FEATURE_PUSH=PASS"
    }

    Write-Host "`n=== 11. FINAL SAFETY ==="
    $FinalMainHead = git -C $MainRoot rev-parse HEAD
    $FinalMainStatus = @(git -C $MainRoot status --porcelain)
    $FinalEvalStatus = @(git -C $RepoRoot status --porcelain)
    Write-Host "FINAL_MAIN_HEAD=$FinalMainHead"
    Write-Host "FINAL_EVAL_HEAD=$(git -C $RepoRoot rev-parse HEAD)"
    if ($FinalMainHead -ne $MainHead) { throw "ABORT=MAIN_HEAD_CHANGED" }
    if ($FinalMainStatus.Count -gt 0) { throw "ABORT=MAIN_WORKTREE_CHANGED" }
    if ($FinalEvalStatus.Count -gt 0) { throw "ABORT=EVAL_WORKTREE_NOT_CLEAN" }
    Write-Host "MAIN_HEAD_UNCHANGED=True"
    Write-Host "MAIN_WORKTREE_CLEAN=True"
    Write-Host "EVAL_WORKTREE_CLEAN=True"
    Write-Host "RESULT=PASS_LOCAL_PRT_PYTHON_ARCHIFY_EXECUTION_ENDPOINT_B2A_R2"
    Write-Host "NEW_FEATURE_HEAD=$NewHead"
}
catch {
    if (-not $Committed) {
        [System.IO.File]::WriteAllText($ServerPath, $Original, $Utf8NoBom)
        Write-Host "SERVER_PATCH_ROLLED_BACK=True"
        $RollbackStatus = @(git -C $RepoRoot status --porcelain)
        if ($RollbackStatus.Count -eq 0) {
            Write-Host "ROLLBACK_WORKTREE_CLEAN=True"
        } else {
            Write-Host "ROLLBACK_STATUS="
            $RollbackStatus
        }
    }
    throw
}

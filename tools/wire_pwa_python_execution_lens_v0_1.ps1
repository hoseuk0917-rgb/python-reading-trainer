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

$FeatureBranch = "feat/python-reading-graph-ir"
$ExpectedMain = "fd018ef05c5a716cbddbe72a305ec58880e355dc"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$IndexPath = Join-Path $RepoRoot "src\pwa\index.html"
$StructureBridgePath = Join-Path $RepoRoot "src\pwa\python_structure_bridge.js"
$LensPath = Join-Path $RepoRoot "src\pwa\python_execution_lens.js"
$StructureAuditPath = Join-Path $RepoRoot "tools\audit_pwa_python_structure_bridge_v0_1.js"
$LensAuditPath = Join-Path $RepoRoot "tools\audit_pwa_python_execution_lens_v0_1.js"
$EndpointAuditPath = Join-Path $RepoRoot "tools\audit_local_prt_python_archify_execution_endpoint_v0_1.js"
$Utf8Bom = New-Object System.Text.UTF8Encoding($true)
$Committed = $false

$RulesLine = '  <script src="./code_explainer_rules.js?v=20260811_v338_a1"></script>'
$BridgeLine = '  <script src="./python_structure_bridge.js?v=20260811_v338_reconcile_b1"></script>'
$LensLine = '  <script src="./python_execution_lens.js?v=20260812_v338_archify_b2b"></script>'
$ExplainerLine = '  <script src="./code_explainer.js?v=20260811_v338_a1"></script>'

Write-Host "=== PWA PYTHON ARCHIFY EXECUTION LENS B2B ==="
Write-Host "EXPECTED_BASE=$ExpectedBase"
Write-Host "ARCHIFY_ROOT=$ArchifyRoot"
Write-Host "FEATURE_BRANCH=$FeatureBranch"
Write-Host "MAIN_WRITE_PLANNED=False"
Write-Host "PWA_INDEX_WRITE_PLANNED=True"
Write-Host "PWA_EXISTING_ANALYZER_WRITE_PLANNED=False"
Write-Host "MERMAID_RENDERER_WRITE_PLANNED=False"
Write-Host "GRAPH_IR_SEMANTICS_WRITE_PLANNED=False"
Write-Host "ARCHIFY_GEOMETRY_WRITE_PLANNED=False"
Write-Host "PUSH_FEATURE=$($PushFeature.IsPresent)"

Write-Host "`n=== 1. SAFETY PREFLIGHT ==="

$Head = (git -C $RepoRoot rev-parse HEAD).Trim()
$Status = @(git -C $RepoRoot status --porcelain)
$MainHead = (git -C $MainRoot rev-parse HEAD).Trim()
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
if ($MainHead -ne $ExpectedMain) { throw "ABORT=UNEXPECTED_MAIN_HEAD" }
if ($MainStatus.Count -gt 0) {
    Write-Host "MAIN_STATUS="
    $MainStatus
    throw "ABORT=MAIN_NOT_CLEAN"
}
if (-not (Test-Path -LiteralPath $ArchifyRoot -PathType Container)) {
    throw "ABORT=ARCHIFY_ROOT_NOT_FOUND"
}
foreach ($Required in @(
    $IndexPath,
    $StructureBridgePath,
    $LensPath,
    $StructureAuditPath,
    $LensAuditPath,
    $EndpointAuditPath
)) {
    if (-not (Test-Path -LiteralPath $Required -PathType Leaf)) {
        throw "ABORT=REQUIRED_FILE_NOT_FOUND:$Required"
    }
}

$Original = [System.IO.File]::ReadAllText($IndexPath)
$MermaidIdCount = ([regex]::Matches($Original, [regex]::Escape('id="mermaidDiagram"'))).Count
$MermaidImportCount = ([regex]::Matches($Original, [regex]::Escape('import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";'))).Count
Write-Host "MERMAID_DIAGRAM_ID_COUNT=$MermaidIdCount"
Write-Host "MERMAID_IMPORT_COUNT=$MermaidImportCount"
if ($MermaidIdCount -ne 1 -or $MermaidImportCount -ne 1) {
    throw "ABORT=MERMAID_BASELINE_CONTRACT_FAILED"
}
Write-Host "LOCAL_PREFLIGHT=PASS"

Write-Host "`n=== 2. REMOTE AUTHORITY CHECK ==="

git -C $RepoRoot fetch origin $FeatureBranch
if ($LASTEXITCODE -ne 0) { throw "ABORT=FETCH_FAILED" }
$RemoteHead = (git -C $RepoRoot rev-parse "origin/$FeatureBranch").Trim()
Write-Host "REMOTE_FEATURE_HEAD=$RemoteHead"
if ($RemoteHead -ne $ExpectedBase) { throw "ABORT=REMOTE_FEATURE_MOVED" }
Write-Host "REMOTE_AUTHORITY=PASS"

try {
    Write-Host "`n=== 3. PRE-WIRING CONTRACT AUDITS ==="

    node --check $StructureBridgePath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=STRUCTURE_BRIDGE_NODE_CHECK_FAILED" }
    node --check $LensPath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=LENS_NODE_CHECK_FAILED" }
    node --check $StructureAuditPath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=STRUCTURE_AUDIT_NODE_CHECK_FAILED" }
    node --check $LensAuditPath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=LENS_AUDIT_NODE_CHECK_FAILED" }
    node --check $EndpointAuditPath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=ENDPOINT_AUDIT_NODE_CHECK_FAILED" }

    node $StructureAuditPath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=STRUCTURE_BRIDGE_REGRESSION_FAILED" }

    node $LensAuditPath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=PWA_EXECUTION_LENS_CONTRACT_FAILED" }

    $PriorArchifyRoot = $env:PRT_ARCHIFY_ROOT
    try {
        $env:PRT_ARCHIFY_ROOT = $ArchifyRoot
        node $EndpointAuditPath
        if ($LASTEXITCODE -ne 0) { throw "ABORT=ARCHIFY_ENDPOINT_REGRESSION_FAILED" }
    }
    finally {
        if ($null -eq $PriorArchifyRoot) {
            Remove-Item Env:PRT_ARCHIFY_ROOT -ErrorAction SilentlyContinue
        } else {
            $env:PRT_ARCHIFY_ROOT = $PriorArchifyRoot
        }
    }
    Write-Host "PRE_WIRING_AUDITS=PASS"

    Write-Host "`n=== 4. EXACT INDEX WIRING ==="

    $Text = $Original
    if ($Text.Contains($LensLine)) { throw "ABORT=LENS_ALREADY_WIRED" }

    $NewLine = if ($Text.Contains("`r`n")) { "`r`n" } else { "`n" }
    $Anchor = $BridgeLine + $NewLine + $ExplainerLine
    $Replacement = $BridgeLine + $NewLine + $LensLine + $NewLine + $ExplainerLine
    $AnchorCount = ([regex]::Matches($Text, [regex]::Escape($Anchor))).Count
    Write-Host "SCRIPT_ANCHOR_COUNT=$AnchorCount"
    if ($AnchorCount -ne 1) { throw "ABORT=EXPECTED_SCRIPT_ANCHOR_NOT_UNIQUE" }

    $Patched = $Text.Replace($Anchor, $Replacement)
    [System.IO.File]::WriteAllText($IndexPath, $Patched, $Utf8Bom)
    Write-Host "INDEX_PATCH_APPLIED=True"

    Write-Host "`n=== 5. CHANGE SCOPE + LOAD ORDER ==="

    $Changed = @(git -C $RepoRoot diff --name-only)
    $Changed | ForEach-Object { Write-Host "CHANGED=$_" }
    if ($Changed.Count -ne 1 -or $Changed[0] -ne "src/pwa/index.html") {
        throw "ABORT=UNEXPECTED_LOCAL_CHANGE_SCOPE"
    }

    $IndexNow = [System.IO.File]::ReadAllText($IndexPath)
    $RulesPos = $IndexNow.IndexOf($RulesLine)
    $BridgePos = $IndexNow.IndexOf($BridgeLine)
    $LensPos = $IndexNow.IndexOf($LensLine)
    $ExplainerPos = $IndexNow.IndexOf($ExplainerLine)
    if ($RulesPos -lt 0 -or $BridgePos -lt 0 -or $LensPos -lt 0 -or $ExplainerPos -lt 0) {
        throw "ABORT=SCRIPT_WIRING_LINE_MISSING"
    }
    if (-not ($RulesPos -lt $BridgePos -and $BridgePos -lt $LensPos -and $LensPos -lt $ExplainerPos)) {
        throw "ABORT=SCRIPT_LOAD_ORDER_WRONG"
    }

    $MermaidIdCountAfter = ([regex]::Matches($IndexNow, [regex]::Escape('id="mermaidDiagram"'))).Count
    $MermaidImportCountAfter = ([regex]::Matches($IndexNow, [regex]::Escape('import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";'))).Count
    if ($MermaidIdCountAfter -ne $MermaidIdCount -or $MermaidImportCountAfter -ne $MermaidImportCount) {
        throw "ABORT=MERMAID_INDEX_REGRESSION"
    }

    Write-Host "SCRIPT_ORDER=RULES_THEN_STRUCTURE_BRIDGE_THEN_ARCHIFY_LENS_THEN_EXPLAINER"
    Write-Host "MERMAID_INDEX_PRESERVED=True"
    Write-Host "ONLY_INDEX_CHANGED=True"

    Write-Host "`n=== 6. POST-WIRING AUDITS ==="

    node $LensAuditPath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=POST_WIRING_LENS_AUDIT_FAILED" }
    node $StructureAuditPath
    if ($LASTEXITCODE -ne 0) { throw "ABORT=POST_WIRING_STRUCTURE_REGRESSION_FAILED" }

    git -C $RepoRoot diff --check
    if ($LASTEXITCODE -ne 0) { throw "ABORT=DIFF_CHECK_FAILED" }
    Write-Host "POST_WIRING_AUDITS=PASS"

    Write-Host "`n=== 7. COMMIT ==="

    git -C $RepoRoot add -- "src/pwa/index.html"
    if ($LASTEXITCODE -ne 0) { throw "ABORT=GIT_ADD_FAILED" }
    git -C $RepoRoot commit -m "Wire Archify execution lens into PWA"
    if ($LASTEXITCODE -ne 0) { throw "ABORT=GIT_COMMIT_FAILED" }
    $Committed = $true

    $NewHead = (git -C $RepoRoot rev-parse HEAD).Trim()
    $PostCommitStatus = @(git -C $RepoRoot status --porcelain)
    Write-Host "NEW_LOCAL_HEAD=$NewHead"
    if ($PostCommitStatus.Count -gt 0) {
        Write-Host "POST_COMMIT_STATUS="
        $PostCommitStatus
        throw "ABORT=WORKTREE_NOT_CLEAN_AFTER_COMMIT"
    }
    Write-Host "COMMIT=PASS"

    if ($PushFeature.IsPresent) {
        Write-Host "`n=== 8. FAST-FORWARD PUSH ==="

        git -C $RepoRoot fetch origin $FeatureBranch
        if ($LASTEXITCODE -ne 0) { throw "ABORT=PRE_PUSH_FETCH_FAILED" }
        $RemoteBeforePush = (git -C $RepoRoot rev-parse "origin/$FeatureBranch").Trim()
        Write-Host "REMOTE_BEFORE_PUSH=$RemoteBeforePush"
        if ($RemoteBeforePush -ne $ExpectedBase) { throw "ABORT=REMOTE_MOVED_BEFORE_PUSH" }

        git -C $RepoRoot push origin "HEAD:refs/heads/$FeatureBranch"
        if ($LASTEXITCODE -ne 0) { throw "ABORT=FEATURE_PUSH_FAILED" }

        git -C $RepoRoot fetch origin $FeatureBranch
        if ($LASTEXITCODE -ne 0) { throw "ABORT=POST_PUSH_FETCH_FAILED" }
        $RemoteAfterPush = (git -C $RepoRoot rev-parse "origin/$FeatureBranch").Trim()
        Write-Host "REMOTE_AFTER_PUSH=$RemoteAfterPush"
        if ($RemoteAfterPush -ne $NewHead) { throw "ABORT=REMOTE_HEAD_MISMATCH_AFTER_PUSH" }
        Write-Host "FEATURE_PUSH=PASS"
    }

    Write-Host "`n=== 9. FINAL SAFETY ==="

    $FinalMainHead = (git -C $MainRoot rev-parse HEAD).Trim()
    $FinalMainStatus = @(git -C $MainRoot status --porcelain)
    $FinalEvalHead = (git -C $RepoRoot rev-parse HEAD).Trim()
    $FinalEvalStatus = @(git -C $RepoRoot status --porcelain)

    Write-Host "FINAL_MAIN_HEAD=$FinalMainHead"
    Write-Host "FINAL_EVAL_HEAD=$FinalEvalHead"
    if ($FinalMainHead -ne $ExpectedMain) { throw "ABORT=MAIN_HEAD_CHANGED" }
    if ($FinalMainStatus.Count -gt 0) { throw "ABORT=MAIN_WORKTREE_CHANGED" }
    if ($FinalEvalHead -ne $NewHead) { throw "ABORT=EVAL_HEAD_CHANGED_AFTER_COMMIT" }
    if ($FinalEvalStatus.Count -gt 0) { throw "ABORT=EVAL_WORKTREE_CHANGED_AFTER_COMMIT" }

    Write-Host "MAIN_HEAD_UNCHANGED=True"
    Write-Host "MAIN_WORKTREE_CLEAN=True"
    Write-Host "EVAL_WORKTREE_CLEAN=True"
    Write-Host "RESULT=PASS_PWA_PYTHON_ARCHIFY_EXECUTION_LENS_B2B"
    Write-Host "NEW_FEATURE_HEAD=$NewHead"
}
catch {
    if (-not $Committed) {
        [System.IO.File]::WriteAllText($IndexPath, $Original, $Utf8Bom)
        Write-Host "INDEX_PATCH_ROLLED_BACK=True"
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

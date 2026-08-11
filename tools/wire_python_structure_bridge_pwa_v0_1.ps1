param(
    [Parameter(Mandatory = $true)]
    [string]$ExpectedBase,

    [switch]$PushFeature
)

$ErrorActionPreference = "Stop"

$FeatureBranch = "feat/python-reading-graph-ir"
$ExpectedMain = "fd018ef05c5a716cbddbe72a305ec58880e355dc"
$MainRoot = "D:\projects\python-reading-trainer"
$RepoRoot = (git rev-parse --show-toplevel).Trim()

if (-not $RepoRoot) {
    throw "ABORT=REPO_ROOT_NOT_FOUND"
}

$IndexPath = Join-Path $RepoRoot "src\pwa\index.html"
$BridgePath = Join-Path $RepoRoot "src\pwa\python_structure_bridge.js"
$AuditPath = Join-Path $RepoRoot "tools\audit_pwa_python_structure_bridge_v0_1.js"

$RulesLine = '  <script src="./code_explainer_rules.js?v=20260811_v338_a1"></script>'
$BridgeLine = '  <script src="./python_structure_bridge.js?v=20260811_v338_reconcile_b1"></script>'
$ExplainerLine = '  <script src="./code_explainer.js?v=20260811_v338_a1"></script>'

Write-Host "=== PWA PYTHON STRUCTURE BRIDGE WIRING V0.1 ==="
Write-Host "EXPECTED_BASE=$ExpectedBase"
Write-Host "FEATURE_BRANCH=$FeatureBranch"
Write-Host "MAIN_WRITE_PLANNED=False"
Write-Host "PWA_INDEX_WRITE_PLANNED=True"
Write-Host "PWA_OTHER_EXISTING_FILE_WRITE_PLANNED=False"
Write-Host "ARCHIFY_RENDERER_WRITE_PLANNED=False"
Write-Host "RULE_ANALYZER_WRITE_PLANNED=False"
Write-Host "MERMAID_RENDERER_WRITE_PLANNED=False"
Write-Host "PUSH_FEATURE=$($PushFeature.IsPresent)"

Write-Host "`n=== 1. SAFETY PREFLIGHT ==="

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

if (-not (Test-Path -LiteralPath $IndexPath -PathType Leaf)) {
    throw "ABORT=PWA_INDEX_NOT_FOUND"
}

if (-not (Test-Path -LiteralPath $BridgePath -PathType Leaf)) {
    throw "ABORT=BRIDGE_FILE_NOT_FOUND"
}

if (-not (Test-Path -LiteralPath $AuditPath -PathType Leaf)) {
    throw "ABORT=BRIDGE_AUDIT_NOT_FOUND"
}

Write-Host "LOCAL_PREFLIGHT=PASS"

Write-Host "`n=== 2. REMOTE AUTHORITY CHECK ==="

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

Write-Host "`n=== 3. EXACT INDEX ANCHOR CHECK ==="

$Utf8Bom = New-Object System.Text.UTF8Encoding($true)
$Text = [System.IO.File]::ReadAllText($IndexPath)

if ($Text.Contains($BridgeLine)) {
    throw "ABORT=BRIDGE_ALREADY_WIRED"
}

$NewLine = if ($Text.Contains("`r`n")) { "`r`n" } else { "`n" }
$Anchor = $RulesLine + $NewLine + $ExplainerLine
$Replacement = $RulesLine + $NewLine + $BridgeLine + $NewLine + $ExplainerLine

$AnchorCount = ([regex]::Matches($Text, [regex]::Escape($Anchor))).Count
Write-Host "ANCHOR_COUNT=$AnchorCount"

if ($AnchorCount -ne 1) {
    throw "ABORT=EXPECTED_SCRIPT_ANCHOR_NOT_UNIQUE"
}

$Patched = $Text.Replace($Anchor, $Replacement)
[System.IO.File]::WriteAllText($IndexPath, $Patched, $Utf8Bom)

Write-Host "INDEX_PATCH_APPLIED=True"

Write-Host "`n=== 4. CHANGE SCOPE VERIFY ==="

$Changed = @(git -C $RepoRoot diff --name-only)
$Changed | ForEach-Object { Write-Host "CHANGED=$_" }

if ($Changed.Count -ne 1 -or $Changed[0] -ne "src/pwa/index.html") {
    throw "ABORT=UNEXPECTED_LOCAL_CHANGE_SCOPE"
}

$IndexNow = [System.IO.File]::ReadAllText($IndexPath)
$RulesPos = $IndexNow.IndexOf($RulesLine)
$BridgePos = $IndexNow.IndexOf($BridgeLine)
$ExplainerPos = $IndexNow.IndexOf($ExplainerLine)

if ($RulesPos -lt 0 -or $BridgePos -lt 0 -or $ExplainerPos -lt 0) {
    throw "ABORT=SCRIPT_WIRING_LINE_MISSING"
}

if (-not ($RulesPos -lt $BridgePos -and $BridgePos -lt $ExplainerPos)) {
    throw "ABORT=SCRIPT_LOAD_ORDER_WRONG"
}

Write-Host "SCRIPT_ORDER=RULES_THEN_BRIDGE_THEN_EXPLAINER"
Write-Host "ONLY_INDEX_CHANGED=True"

Write-Host "`n=== 5. STATIC + CONTRACT AUDIT ==="

node --check $BridgePath
if ($LASTEXITCODE -ne 0) {
    throw "ABORT=BRIDGE_NODE_CHECK_FAILED"
}

node --check $AuditPath
if ($LASTEXITCODE -ne 0) {
    throw "ABORT=BRIDGE_AUDIT_NODE_CHECK_FAILED"
}

node $AuditPath
if ($LASTEXITCODE -ne 0) {
    throw "ABORT=BRIDGE_CONTRACT_AUDIT_FAILED"
}

git -C $RepoRoot diff --check
if ($LASTEXITCODE -ne 0) {
    throw "ABORT=DIFF_CHECK_FAILED"
}

Write-Host "STATIC_AND_CONTRACT_AUDIT=PASS"

Write-Host "`n=== 6. COMMIT ==="

git -C $RepoRoot add -- "src/pwa/index.html"
if ($LASTEXITCODE -ne 0) {
    throw "ABORT=GIT_ADD_FAILED"
}

git -C $RepoRoot commit -m "Wire Python structure reconciliation sidecar into PWA"
if ($LASTEXITCODE -ne 0) {
    throw "ABORT=GIT_COMMIT_FAILED"
}

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
    Write-Host "`n=== 7. FAST-FORWARD PUSH ==="

    git -C $RepoRoot fetch origin $FeatureBranch
    if ($LASTEXITCODE -ne 0) {
        throw "ABORT=PREFLIGHT_PUSH_FETCH_FAILED"
    }

    $RemoteBeforePush = (git -C $RepoRoot rev-parse "origin/$FeatureBranch").Trim()
    Write-Host "REMOTE_BEFORE_PUSH=$RemoteBeforePush"

    if ($RemoteBeforePush -ne $ExpectedBase) {
        throw "ABORT=REMOTE_MOVED_BEFORE_PUSH"
    }

    git -C $RepoRoot push origin "HEAD:refs/heads/$FeatureBranch"
    if ($LASTEXITCODE -ne 0) {
        throw "ABORT=FEATURE_PUSH_FAILED"
    }

    git -C $RepoRoot fetch origin $FeatureBranch
    if ($LASTEXITCODE -ne 0) {
        throw "ABORT=POST_PUSH_FETCH_FAILED"
    }

    $RemoteAfterPush = (git -C $RepoRoot rev-parse "origin/$FeatureBranch").Trim()
    Write-Host "REMOTE_AFTER_PUSH=$RemoteAfterPush"

    if ($RemoteAfterPush -ne $NewHead) {
        throw "ABORT=REMOTE_HEAD_MISMATCH_AFTER_PUSH"
    }

    Write-Host "FEATURE_PUSH=PASS"
}

Write-Host "`n=== 8. FINAL SAFETY ==="

$FinalMainHead = (git -C $MainRoot rev-parse HEAD).Trim()
$FinalMainStatus = @(git -C $MainRoot status --porcelain)
$FinalEvalHead = (git -C $RepoRoot rev-parse HEAD).Trim()
$FinalEvalStatus = @(git -C $RepoRoot status --porcelain)

Write-Host "FINAL_MAIN_HEAD=$FinalMainHead"
Write-Host "FINAL_EVAL_HEAD=$FinalEvalHead"

if ($FinalMainHead -ne $ExpectedMain) {
    throw "ABORT=MAIN_HEAD_CHANGED"
}
if ($FinalMainStatus.Count -gt 0) {
    throw "ABORT=MAIN_WORKTREE_CHANGED"
}
if ($FinalEvalHead -ne $NewHead) {
    throw "ABORT=EVAL_HEAD_CHANGED_AFTER_COMMIT"
}
if ($FinalEvalStatus.Count -gt 0) {
    throw "ABORT=EVAL_WORKTREE_CHANGED_AFTER_COMMIT"
}

Write-Host "MAIN_HEAD_UNCHANGED=True"
Write-Host "MAIN_WORKTREE_CLEAN=True"
Write-Host "EVAL_WORKTREE_CLEAN=True"
Write-Host "RESULT=PASS_PWA_PYTHON_STRUCTURE_BRIDGE_WIRING_V0_1"
Write-Host "NEW_FEATURE_HEAD=$NewHead"

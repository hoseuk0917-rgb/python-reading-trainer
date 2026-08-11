param(
    [Parameter(Mandatory = $true)]
    [string]$ExpectedBase,

    [string]$MainRoot = "D:\projects\python-reading-trainer",

    [switch]$PushFeature
)

$ErrorActionPreference = "Stop"

if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$FeatureBranch = "feat/browser-native-python-archify"
$ExpectedMain = "6e5dfa75a85547110eedd27ae6efb8be7d9c13d3"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$IndexPath = Join-Path $RepoRoot "src\pwa\index.html"
$Utf8Bom = New-Object System.Text.UTF8Encoding($true)
$Committed = $false

$RulesLine = '  <script src="./code_explainer_rules.js?v=20260811_v338_a1"></script>'
$OldBridgeLine = '  <script src="./python_structure_bridge.js?v=20260811_v338_reconcile_b1"></script>'
$OldLensLine = '  <script src="./python_execution_lens.js?v=20260812_v338_archify_b2b"></script>'
$BrowserRuntimeLine = '  <script src="./python_browser_runtime.js?v=20260812_b3a1"></script>'
$BrowserRendererLine = '  <script src="./python_archify_browser_renderer.js?v=20260812_b3a1"></script>'
$NewBridgeLine = '  <script src="./python_structure_bridge.js?v=20260812_b3a1"></script>'
$NewLensLine = '  <script src="./python_execution_lens.js?v=20260812_b3a1"></script>'
$ExplainerLine = '  <script src="./code_explainer.js?v=20260811_v338_a1"></script>'

$AuditCommands = @(
    @{ Name = "BROWSER_BRIDGE"; Kind = "python"; Path = "tools\audit_python_reading_browser_bridge_v0_1.py" },
    @{ Name = "BROWSER_RUNTIME"; Kind = "node"; Path = "tools\audit_pwa_python_browser_runtime_v0_1.js" },
    @{ Name = "BROWSER_RENDERER"; Kind = "node"; Path = "tools\audit_pwa_python_archify_browser_renderer_v0_1.js" },
    @{ Name = "STRUCTURE_BRIDGE_REGRESSION"; Kind = "node"; Path = "tools\audit_pwa_python_structure_bridge_v0_1.js" },
    @{ Name = "EXECUTION_LENS_REGRESSION"; Kind = "node"; Path = "tools\audit_pwa_python_execution_lens_v0_1.js" },
    @{ Name = "BROWSER_NATIVE_INTEGRATION"; Kind = "node"; Path = "tools\audit_pwa_python_browser_native_integration_v0_1.js" }
)

function Invoke-Audits([string]$Phase) {
    Write-Host "`n=== $Phase ==="

    foreach ($Audit in $AuditCommands) {
        $Path = Join-Path $RepoRoot $Audit.Path
        if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
            throw "ABORT=AUDIT_FILE_MISSING:$($Audit.Name)"
        }

        Write-Host "--- $($Audit.Name) ---"
        if ($Audit.Kind -eq "python") {
            python $Path
        }
        else {
            node --check $Path
            if ($LASTEXITCODE -ne 0) {
                throw "ABORT=NODE_CHECK_FAILED:$($Audit.Name)"
            }
            node $Path
        }

        if ($LASTEXITCODE -ne 0) {
            throw "ABORT=AUDIT_FAILED:$($Audit.Name)"
        }
        Write-Host "$($Audit.Name)=PASS"
    }
}

Write-Host "=== B3 BROWSER-NATIVE PYTHON ARCHIFY PWA WIRING ==="
Write-Host "EXPECTED_BASE=$ExpectedBase"
Write-Host "EXPECTED_MAIN=$ExpectedMain"
Write-Host "FEATURE_BRANCH=$FeatureBranch"
Write-Host "MAIN_WRITE_PLANNED=False"
Write-Host "PWA_INDEX_WRITE_PLANNED=True"
Write-Host "GRAPH_IR_SEMANTICS_WRITE_PLANNED=False"
Write-Host "MERMAID_WRITE_PLANNED=False"
Write-Host "LOCAL_SERVER_WRITE_PLANNED=False"
Write-Host "PUSH_FEATURE=$($PushFeature.IsPresent)"

Write-Host "`n=== 1. SAFETY PREFLIGHT ==="

$Head = (git -C $RepoRoot rev-parse HEAD).Trim()
$Branch = (git -C $RepoRoot branch --show-current).Trim()
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
if (-not (Test-Path -LiteralPath $IndexPath -PathType Leaf)) { throw "ABORT=INDEX_NOT_FOUND" }

$Original = [System.IO.File]::ReadAllText($IndexPath)
$MermaidIdBefore = ([regex]::Matches($Original, [regex]::Escape('id="mermaidDiagram"'))).Count
$MermaidImportBefore = ([regex]::Matches($Original, [regex]::Escape('import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";'))).Count
if ($MermaidIdBefore -ne 1 -or $MermaidImportBefore -ne 1) {
    throw "ABORT=MERMAID_BASELINE_CONTRACT_FAILED"
}

foreach ($Line in @($RulesLine, $OldBridgeLine, $OldLensLine, $ExplainerLine)) {
    if (([regex]::Matches($Original, [regex]::Escape($Line))).Count -ne 1) {
        throw "ABORT=EXPECTED_OLD_SCRIPT_LINE_NOT_UNIQUE:$Line"
    }
}
if ($Original.Contains($BrowserRuntimeLine) -or $Original.Contains($BrowserRendererLine)) {
    throw "ABORT=BROWSER_NATIVE_ALREADY_WIRED"
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

try {
    Invoke-Audits "3. PRE-WIRING BROWSER + REGRESSION AUDITS"

    Write-Host "`n=== 4. EXACT INDEX WIRING ==="
    $NewLine = if ($Original.Contains("`r`n")) { "`r`n" } else { "`n" }
    $OldBlock = @(
        $RulesLine,
        $OldBridgeLine,
        $OldLensLine,
        $ExplainerLine
    ) -join $NewLine
    $NewBlock = @(
        $RulesLine,
        $BrowserRuntimeLine,
        $BrowserRendererLine,
        $NewBridgeLine,
        $NewLensLine,
        $ExplainerLine
    ) -join $NewLine

    if (([regex]::Matches($Original, [regex]::Escape($OldBlock))).Count -ne 1) {
        throw "ABORT=OLD_SCRIPT_BLOCK_NOT_UNIQUE"
    }

    $Patched = $Original.Replace($OldBlock, $NewBlock)
    [System.IO.File]::WriteAllText($IndexPath, $Patched, $Utf8Bom)
    Write-Host "INDEX_PATCH_APPLIED=True"

    Write-Host "`n=== 5. LOAD ORDER + CHANGE SCOPE ==="
    $Changed = @(git -C $RepoRoot diff --name-only)
    $Changed | ForEach-Object { Write-Host "CHANGED=$_" }
    if ($Changed.Count -ne 1 -or $Changed[0] -ne "src/pwa/index.html") {
        throw "ABORT=UNEXPECTED_LOCAL_CHANGE_SCOPE"
    }

    $Now = [System.IO.File]::ReadAllText($IndexPath)
    $Positions = @(
        $Now.IndexOf($RulesLine),
        $Now.IndexOf($BrowserRuntimeLine),
        $Now.IndexOf($BrowserRendererLine),
        $Now.IndexOf($NewBridgeLine),
        $Now.IndexOf($NewLensLine),
        $Now.IndexOf($ExplainerLine)
    )
    if ($Positions | Where-Object { $_ -lt 0 }) { throw "ABORT=SCRIPT_LINE_MISSING_AFTER_WIRING" }
    for ($i = 1; $i -lt $Positions.Count; $i++) {
        if ($Positions[$i] -le $Positions[$i - 1]) { throw "ABORT=BROWSER_NATIVE_SCRIPT_ORDER_FAILED" }
    }

    $MermaidIdAfter = ([regex]::Matches($Now, [regex]::Escape('id="mermaidDiagram"'))).Count
    $MermaidImportAfter = ([regex]::Matches($Now, [regex]::Escape('import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";'))).Count
    if ($MermaidIdAfter -ne $MermaidIdBefore -or $MermaidImportAfter -ne $MermaidImportBefore) {
        throw "ABORT=MERMAID_REGRESSION"
    }

    Write-Host "SCRIPT_ORDER=RULES_BROWSER_RUNTIME_BROWSER_RENDERER_STRUCTURE_LENS_EXPLAINER"
    Write-Host "MERMAID_PRESERVED=True"
    Write-Host "ONLY_INDEX_CHANGED=True"

    Invoke-Audits "6. POST-WIRING BROWSER + REGRESSION AUDITS"

    Write-Host "`n=== 7. BASE APP VALIDATION ==="
    python (Join-Path $RepoRoot "tools\validate_lessons.py")
    if ($LASTEXITCODE -ne 0) { throw "ABORT=LESSON_VALIDATION_FAILED" }
    git -C $RepoRoot diff --check
    if ($LASTEXITCODE -ne 0) { throw "ABORT=DIFF_CHECK_FAILED" }
    Write-Host "BASE_APP_VALIDATION=PASS"

    Write-Host "`n=== 8. COMMIT ==="
    git -C $RepoRoot add -- "src/pwa/index.html"
    if ($LASTEXITCODE -ne 0) { throw "ABORT=GIT_ADD_FAILED" }
    git -C $RepoRoot commit -m "Wire browser-native Python Archify into PWA"
    if ($LASTEXITCODE -ne 0) { throw "ABORT=GIT_COMMIT_FAILED" }
    $Committed = $true

    $NewHead = (git -C $RepoRoot rev-parse HEAD).Trim()
    $PostCommitStatus = @(git -C $RepoRoot status --porcelain)
    if ($PostCommitStatus.Count -gt 0) { throw "ABORT=FEATURE_DIRTY_AFTER_COMMIT" }
    Write-Host "NEW_FEATURE_HEAD=$NewHead"
    Write-Host "COMMIT=PASS"

    if ($PushFeature.IsPresent) {
        Write-Host "`n=== 9. GUARDED FEATURE PUSH ==="
        git -C $RepoRoot fetch origin $FeatureBranch main
        if ($LASTEXITCODE -ne 0) { throw "ABORT=PRE_PUSH_FETCH_FAILED" }
        $RemoteFeatureBeforePush = (git -C $RepoRoot rev-parse "origin/$FeatureBranch").Trim()
        $RemoteMainBeforePush = (git -C $RepoRoot rev-parse origin/main).Trim()
        if ($RemoteFeatureBeforePush -ne $ExpectedBase) { throw "ABORT=REMOTE_FEATURE_MOVED_BEFORE_PUSH" }
        if ($RemoteMainBeforePush -ne $ExpectedMain) { throw "ABORT=REMOTE_MAIN_MOVED_BEFORE_PUSH" }

        git -C $RepoRoot push origin "HEAD:refs/heads/$FeatureBranch"
        if ($LASTEXITCODE -ne 0) { throw "ABORT=FEATURE_PUSH_FAILED" }
        git -C $RepoRoot fetch origin $FeatureBranch
        if ($LASTEXITCODE -ne 0) { throw "ABORT=POST_PUSH_FETCH_FAILED" }
        $RemoteAfter = (git -C $RepoRoot rev-parse "origin/$FeatureBranch").Trim()
        if ($RemoteAfter -ne $NewHead) { throw "ABORT=REMOTE_FEATURE_HEAD_MISMATCH" }
        Write-Host "FEATURE_PUSH=PASS"
    }

    Write-Host "`n=== 10. FINAL SAFETY ==="
    $FinalMain = (git -C $MainRoot rev-parse HEAD).Trim()
    $FinalMainStatus = @(git -C $MainRoot status --porcelain)
    $FinalFeatureStatus = @(git -C $RepoRoot status --porcelain)
    if ($FinalMain -ne $ExpectedMain) { throw "ABORT=MAIN_CHANGED" }
    if ($FinalMainStatus.Count -gt 0) { throw "ABORT=MAIN_DIRTY" }
    if ($FinalFeatureStatus.Count -gt 0) { throw "ABORT=FEATURE_DIRTY" }

    Write-Host "MAIN_HEAD_UNCHANGED=True"
    Write-Host "MAIN_WORKTREE_CLEAN=True"
    Write-Host "FEATURE_WORKTREE_CLEAN=True"
    Write-Host "RESULT=PASS_B3_BROWSER_NATIVE_PWA_WIRING"
    Write-Host "NEW_FEATURE_HEAD=$NewHead"
}
catch {
    if (-not $Committed) {
        [System.IO.File]::WriteAllText($IndexPath, $Original, $Utf8Bom)
        Write-Host "INDEX_PATCH_ROLLED_BACK=True"
        $RollbackStatus = @(git -C $RepoRoot status --porcelain)
        Write-Host "ROLLBACK_WORKTREE_CLEAN=$($RollbackStatus.Count -eq 0)"
    }
    throw
}

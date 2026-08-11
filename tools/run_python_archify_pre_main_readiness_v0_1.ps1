param(
    [Parameter(Mandatory = $true)]
    [string]$ExpectedBase,

    [Parameter(Mandatory = $true)]
    [string]$ArchifyRoot,

    [string]$MainRoot = "D:\projects\python-reading-trainer"
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
$ExecutionLensPath = Join-Path $RepoRoot "src\pwa\python_execution_lens.js"
$LocalServerPath = Join-Path $RepoRoot "tools\local_prt_server.js"
$RendererPath = Join-Path $RepoRoot "tools\local_prt_python_archify_execution_renderer_v0_1.js"
$GraphIrAuditPath = Join-Path $RepoRoot "tools\audit_python_reading_graph_ir_v0_1.py"
$ProjectionAuditPath = Join-Path $RepoRoot "tools\audit_python_reading_archify_projection_v0_1.py"
$ReconciliationAuditPath = Join-Path $RepoRoot "tools\audit_python_reading_reconciliation_v0_1.py"
$StructureEndpointAuditPath = Join-Path $RepoRoot "tools\audit_local_prt_python_structure_endpoint_v0_1.js"
$ArchifyEndpointAuditPath = Join-Path $RepoRoot "tools\audit_local_prt_python_archify_execution_endpoint_v0_1.js"
$StructureBridgeAuditPath = Join-Path $RepoRoot "tools\audit_pwa_python_structure_bridge_v0_1.js"
$ExecutionLensAuditPath = Join-Path $RepoRoot "tools\audit_pwa_python_execution_lens_v0_1.js"
$LessonValidatorPath = Join-Path $RepoRoot "tools\validate_lessons.py"
$B2CEvidencePath = Join-Path $RepoRoot "docs\quality\python_archify_b2c_visual_smoke_20260812.md"

$RulesLine = '  <script src="./code_explainer_rules.js?v=20260811_v338_a1"></script>'
$BridgeLine = '  <script src="./python_structure_bridge.js?v=20260811_v338_reconcile_b1"></script>'
$LensLine = '  <script src="./python_execution_lens.js?v=20260812_v338_archify_b2b"></script>'
$ExplainerLine = '  <script src="./code_explainer.js?v=20260811_v338_a1"></script>'
$MermaidImport = 'import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";'

$RequiredAncestors = [ordered]@{
    R7_ARCHIFY_MATRIX = "33c94d945417a6b88c041087531d38fd78378443"
    RECONCILIATION_GATE = "d395d0217a5c4a9a7f024f95fca178a907a7e108"
    PWA_STRUCTURE_B1 = "c857edc9b76105a93f83ed404b368eeb10eed9e1"
    ARCHIFY_ENDPOINT_B2A = "6827b850c1c2846eb9c81555ec332daf23be9ca6"
    PWA_LENS_B2B = "c65cfb8cfc4ba442a3a238de9a9f744f6cab0847"
    B2C_FINAL_HARNESS = "e56f57c116ac43c806b45015a1ac573acefdd12c"
}

function Invoke-NativeGate {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][scriptblock]$Command
    )

    Write-Host "`n--- $Name ---"
    & $Command
    if ($LASTEXITCODE -ne 0) {
        throw "ABORT=${Name}_FAILED"
    }
    Write-Host "$Name=PASS"
}

Write-Host "=== PYTHON ARCHIFY PRE-MAIN READINESS V0.1 ==="
Write-Host "EXPECTED_BASE=$ExpectedBase"
Write-Host "EXPECTED_MAIN=$ExpectedMain"
Write-Host "ARCHIFY_ROOT=$ArchifyRoot"
Write-Host "MAIN_WRITE_PLANNED=False"
Write-Host "FEATURE_WRITE_PLANNED=False"
Write-Host "PAGES_DEPLOY_PLANNED=False"
Write-Host "READ_ONLY_GATE=True"

Write-Host "`n=== 1. SAFETY + REMOTE AUTHORITY ==="

$Head = (git -C $RepoRoot rev-parse HEAD).Trim()
$Status = @(git -C $RepoRoot status --porcelain)
$MainHead = (git -C $MainRoot rev-parse HEAD).Trim()
$MainStatus = @(git -C $MainRoot status --porcelain)

Write-Host "REPO_ROOT=$RepoRoot"
Write-Host "FEATURE_HEAD=$Head"
Write-Host "MAIN_HEAD=$MainHead"

if ($Head -ne $ExpectedBase) { throw "ABORT=UNEXPECTED_FEATURE_HEAD" }
if ($Status.Count -gt 0) {
    Write-Host "FEATURE_STATUS="
    $Status
    throw "ABORT=FEATURE_WORKTREE_NOT_CLEAN"
}
if ($MainHead -ne $ExpectedMain) { throw "ABORT=UNEXPECTED_MAIN_HEAD" }
if ($MainStatus.Count -gt 0) {
    Write-Host "MAIN_STATUS="
    $MainStatus
    throw "ABORT=MAIN_WORKTREE_NOT_CLEAN"
}
if (-not (Test-Path -LiteralPath $ArchifyRoot -PathType Container)) {
    throw "ABORT=ARCHIFY_ROOT_NOT_FOUND"
}

git -C $RepoRoot fetch origin $FeatureBranch
if ($LASTEXITCODE -ne 0) { throw "ABORT=FEATURE_FETCH_FAILED" }
$RemoteHead = (git -C $RepoRoot rev-parse "origin/$FeatureBranch").Trim()
Write-Host "REMOTE_FEATURE_HEAD=$RemoteHead"
if ($RemoteHead -ne $ExpectedBase) { throw "ABORT=REMOTE_FEATURE_MOVED" }
Write-Host "SAFETY_AND_REMOTE_AUTHORITY=PASS"

Write-Host "`n=== 2. REQUIRED FILES + LINEAGE ==="

$RequiredFiles = @(
    $IndexPath,
    $StructureBridgePath,
    $ExecutionLensPath,
    $LocalServerPath,
    $RendererPath,
    $GraphIrAuditPath,
    $ProjectionAuditPath,
    $ReconciliationAuditPath,
    $StructureEndpointAuditPath,
    $ArchifyEndpointAuditPath,
    $StructureBridgeAuditPath,
    $ExecutionLensAuditPath,
    $LessonValidatorPath,
    $B2CEvidencePath
)
foreach ($Required in $RequiredFiles) {
    if (-not (Test-Path -LiteralPath $Required -PathType Leaf)) {
        throw "ABORT=REQUIRED_FILE_NOT_FOUND:$Required"
    }
}
Write-Host "REQUIRED_FILES=PASS"

foreach ($Item in $RequiredAncestors.GetEnumerator()) {
    git -C $RepoRoot merge-base --is-ancestor $Item.Value $Head
    if ($LASTEXITCODE -ne 0) {
        throw "ABORT=MISSING_REQUIRED_ANCESTOR:$($Item.Key):$($Item.Value)"
    }
    Write-Host "ANCESTOR_$($Item.Key)=PASS:$($Item.Value)"
}
Write-Host "LINEAGE=PASS"

Write-Host "`n=== 3. INDEX + RENDERER ROLE CONTRACT ==="

$IndexText = [System.IO.File]::ReadAllText($IndexPath)
$RulesCount = ([regex]::Matches($IndexText, [regex]::Escape($RulesLine))).Count
$BridgeCount = ([regex]::Matches($IndexText, [regex]::Escape($BridgeLine))).Count
$LensCount = ([regex]::Matches($IndexText, [regex]::Escape($LensLine))).Count
$ExplainerCount = ([regex]::Matches($IndexText, [regex]::Escape($ExplainerLine))).Count
$MermaidIdCount = ([regex]::Matches($IndexText, [regex]::Escape('id="mermaidDiagram"'))).Count
$MermaidImportCount = ([regex]::Matches($IndexText, [regex]::Escape($MermaidImport))).Count

Write-Host "RULES_SCRIPT_COUNT=$RulesCount"
Write-Host "STRUCTURE_BRIDGE_SCRIPT_COUNT=$BridgeCount"
Write-Host "ARCHIFY_LENS_SCRIPT_COUNT=$LensCount"
Write-Host "EXPLAINER_SCRIPT_COUNT=$ExplainerCount"
Write-Host "MERMAID_DIAGRAM_ID_COUNT=$MermaidIdCount"
Write-Host "MERMAID_IMPORT_COUNT=$MermaidImportCount"

if ($RulesCount -ne 1 -or $BridgeCount -ne 1 -or $LensCount -ne 1 -or $ExplainerCount -ne 1) {
    throw "ABORT=PWA_SCRIPT_CARDINALITY_FAILED"
}
if ($MermaidIdCount -ne 1 -or $MermaidImportCount -ne 1) {
    throw "ABORT=MERMAID_PRESERVATION_FAILED"
}

$RulesPos = $IndexText.IndexOf($RulesLine)
$BridgePos = $IndexText.IndexOf($BridgeLine)
$LensPos = $IndexText.IndexOf($LensLine)
$ExplainerPos = $IndexText.IndexOf($ExplainerLine)
if (-not ($RulesPos -lt $BridgePos -and $BridgePos -lt $LensPos -and $LensPos -lt $ExplainerPos)) {
    throw "ABORT=PWA_SCRIPT_ORDER_FAILED"
}
Write-Host "SCRIPT_ORDER=RULES_THEN_STRUCTURE_BRIDGE_THEN_ARCHIFY_LENS_THEN_EXPLAINER"
Write-Host "MERMAID_PRESERVED=True"

$ServerText = [System.IO.File]::ReadAllText($LocalServerPath)
if ($ServerText -notmatch '/render-python-execution') { throw "ABORT=ARCHIFY_RENDER_ROUTE_MISSING" }
if ($ServerText -notmatch '/analyze-python-structure') { throw "ABORT=STRUCTURE_ROUTE_MISSING" }
Write-Host "LOCAL_SERVER_ROUTES=PASS"

$LensText = [System.IO.File]::ReadAllText($ExecutionLensPath)
if ($LensText -notmatch 'sandbox') { throw "ABORT=LENS_SANDBOX_GUARD_MISSING" }
if ($LensText -notmatch 'srcdoc') { throw "ABORT=LENS_SRCDOC_RENDER_MISSING" }
if ($LensText -notmatch 'python-reading-structure-ready') { throw "ABORT=LENS_STRUCTURE_EVENT_MISSING" }
Write-Host "LENS_SECURITY_AND_EVENT_CONTRACT=PASS"

Write-Host "`n=== 4. STATIC SYNTAX ==="

Invoke-NativeGate -Name "NODE_CHECK_STRUCTURE_BRIDGE" -Command { node --check $StructureBridgePath }
Invoke-NativeGate -Name "NODE_CHECK_EXECUTION_LENS" -Command { node --check $ExecutionLensPath }
Invoke-NativeGate -Name "NODE_CHECK_LOCAL_SERVER" -Command { node --check $LocalServerPath }
Invoke-NativeGate -Name "NODE_CHECK_ARCHIFY_RENDERER" -Command { node --check $RendererPath }
Invoke-NativeGate -Name "NODE_CHECK_STRUCTURE_ENDPOINT_AUDIT" -Command { node --check $StructureEndpointAuditPath }
Invoke-NativeGate -Name "NODE_CHECK_ARCHIFY_ENDPOINT_AUDIT" -Command { node --check $ArchifyEndpointAuditPath }
Invoke-NativeGate -Name "NODE_CHECK_STRUCTURE_BRIDGE_AUDIT" -Command { node --check $StructureBridgeAuditPath }
Invoke-NativeGate -Name "NODE_CHECK_EXECUTION_LENS_AUDIT" -Command { node --check $ExecutionLensAuditPath }
Write-Host "STATIC_SYNTAX=PASS"

Write-Host "`n=== 5. GRAPH IR + ARCHIFY PROJECTION + RECONCILIATION ==="

Invoke-NativeGate -Name "GRAPH_IR_AUDIT" -Command { python $GraphIrAuditPath }
Invoke-NativeGate -Name "ARCHIFY_PROJECTION_AUDIT" -Command { python $ProjectionAuditPath }
Invoke-NativeGate -Name "RECONCILIATION_AUDIT" -Command { python $ReconciliationAuditPath }
Write-Host "SEMANTIC_AND_PROJECTION_GATES=PASS"

Write-Host "`n=== 6. LOCAL ENDPOINT REGRESSIONS ==="

Invoke-NativeGate -Name "STRUCTURE_ENDPOINT_AUDIT" -Command { node $StructureEndpointAuditPath }

$PriorArchifyRoot = $env:PRT_ARCHIFY_ROOT
try {
    $env:PRT_ARCHIFY_ROOT = $ArchifyRoot
    Invoke-NativeGate -Name "REAL_ARCHIFY_ENDPOINT_AUDIT" -Command { node $ArchifyEndpointAuditPath }
}
finally {
    if ($null -eq $PriorArchifyRoot) {
        Remove-Item Env:PRT_ARCHIFY_ROOT -ErrorAction SilentlyContinue
    } else {
        $env:PRT_ARCHIFY_ROOT = $PriorArchifyRoot
    }
}
Write-Host "LOCAL_ENDPOINT_REGRESSIONS=PASS"

Write-Host "`n=== 7. PWA SIDECAR REGRESSIONS ==="

Invoke-NativeGate -Name "PWA_STRUCTURE_BRIDGE_AUDIT" -Command { node $StructureBridgeAuditPath }
Invoke-NativeGate -Name "PWA_EXECUTION_LENS_AUDIT" -Command { node $ExecutionLensAuditPath }
Write-Host "PWA_SIDECAR_REGRESSIONS=PASS"

Write-Host "`n=== 8. BASE APP VALIDATION ==="

Invoke-NativeGate -Name "LESSON_VALIDATION" -Command { python $LessonValidatorPath }
Invoke-NativeGate -Name "FEATURE_DIFF_CHECK" -Command { git -C $RepoRoot diff --check "$ExpectedMain..$Head" }
Write-Host "BASE_APP_VALIDATION=PASS"

Write-Host "`n=== 9. B2C VISUAL EVIDENCE CONTRACT ==="

$B2CText = [System.IO.File]::ReadAllText($B2CEvidencePath)
$B2CRequiredMarkers = @(
    'RESULT=PASS_PWA_ARCHIFY_EXECUTION_LENS_B2C_VISUAL_SMOKE',
    'Desktop 1200px',
    'Narrow 390px',
    'NO_OUTER_HORIZONTAL_OVERFLOW=PASS',
    'VIEWPORT_HEIGHT_POLICY=PASS',
    'SANDBOX_STATIC=PASS',
    'SVG_VIEWBOX_PRESENT=PASS',
    'CANONICAL_PAYLOAD_PRESENT=PASS',
    'e56f57c116ac43c806b45015a1ac573acefdd12c'
)
foreach ($Marker in $B2CRequiredMarkers) {
    if (-not $B2CText.Contains($Marker)) {
        throw "ABORT=B2C_EVIDENCE_MARKER_MISSING:$Marker"
    }
}
Write-Host "B2C_VISUAL_EVIDENCE=PASS"

Write-Host "`n=== 10. FINAL CLEANLINESS + RELEASE DECISION ==="

$FinalHead = (git -C $RepoRoot rev-parse HEAD).Trim()
$FinalStatus = @(git -C $RepoRoot status --porcelain)
$FinalMainHead = (git -C $MainRoot rev-parse HEAD).Trim()
$FinalMainStatus = @(git -C $MainRoot status --porcelain)
$FinalRemoteHead = (git -C $RepoRoot rev-parse "origin/$FeatureBranch").Trim()

Write-Host "FINAL_FEATURE_HEAD=$FinalHead"
Write-Host "FINAL_REMOTE_FEATURE_HEAD=$FinalRemoteHead"
Write-Host "FINAL_MAIN_HEAD=$FinalMainHead"

if ($FinalHead -ne $ExpectedBase) { throw "ABORT=FEATURE_HEAD_CHANGED_DURING_GATE" }
if ($FinalRemoteHead -ne $ExpectedBase) { throw "ABORT=REMOTE_FEATURE_CHANGED_DURING_GATE" }
if ($FinalStatus.Count -gt 0) { throw "ABORT=FEATURE_WORKTREE_CHANGED_DURING_GATE" }
if ($FinalMainHead -ne $ExpectedMain) { throw "ABORT=MAIN_HEAD_CHANGED_DURING_GATE" }
if ($FinalMainStatus.Count -gt 0) { throw "ABORT=MAIN_WORKTREE_CHANGED_DURING_GATE" }

Write-Host "FEATURE_HEAD_STABLE=True"
Write-Host "FEATURE_WORKTREE_CLEAN=True"
Write-Host "MAIN_HEAD_UNCHANGED=True"
Write-Host "MAIN_WORKTREE_CLEAN=True"
Write-Host "PAGES_DEPLOY_PERFORMED=False"
Write-Host "READINESS_DECISION=READY_FOR_CONTROLLED_MAIN_INTEGRATION"
Write-Host "RESULT=PASS_PYTHON_ARCHIFY_PRE_MAIN_READINESS_V0_1"

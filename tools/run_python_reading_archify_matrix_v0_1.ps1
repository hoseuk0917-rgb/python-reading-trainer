param(
    [Parameter(Mandatory = $true)]
    [string]$ArchifyRoot
)

$ErrorActionPreference = "Stop"

if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$RepoRoot = Split-Path -Parent $PSScriptRoot
$OutputRoot = Join-Path $RepoRoot ".tmp\python_reading_archify_matrix_v0_1"
$ArchifyCli = Join-Path $ArchifyRoot "archify\bin\archify.mjs"
$ArtifactChecker = Join-Path $ArchifyRoot "archify\scripts\check-render-output.mjs"
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-Utf8NoBomFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $false)]
        [object[]]$Lines
    )

    $Text = ""
    if ($null -ne $Lines) {
        $Text = (@($Lines) | ForEach-Object { [string]$_ }) -join [Environment]::NewLine
    }
    if ($Text.Length -gt 0) {
        $Text += [Environment]::NewLine
    }
    [System.IO.File]::WriteAllText($Path, $Text, $Utf8NoBom)
}

Set-Location $RepoRoot

Write-Host "=== PYTHON READING GRAPH IR + ARCHIFY MATRIX V0.1 ==="
Write-Host "REPO_ROOT=$RepoRoot"
Write-Host "ARCHIFY_ROOT=$ArchifyRoot"
Write-Host "TRACKED_SOURCE_WRITE_PLANNED=False"
Write-Host "OUTPUT_ROOT=$OutputRoot"
Write-Host "RECEIPT_ENCODING=UTF-8-NO-BOM"

if (-not (Test-Path -LiteralPath $ArchifyCli -PathType Leaf)) {
    throw "ABORT=ARCHIFY_CLI_NOT_FOUND"
}

if (-not (Test-Path -LiteralPath $ArtifactChecker -PathType Leaf)) {
    throw "ABORT=ARCHIFY_ARTIFACT_CHECKER_NOT_FOUND"
}

$BeforeStatus = git status --porcelain
if ($BeforeStatus) {
    Write-Host "CURRENT_STATUS="
    $BeforeStatus
    throw "ABORT=WORKTREE_NOT_CLEAN"
}

Write-Host "`n=== 1. IR REFERENCE AUDIT ==="

python tools/audit_python_reading_graph_ir_v0_1.py
if ($LASTEXITCODE -ne 0) {
    throw "ABORT=IR_REFERENCE_AUDIT_FAILED"
}

Write-Host "`n=== 2. PROJECTION STRUCTURE AUDIT ==="

python tools/audit_python_reading_archify_projection_v0_1.py
if ($LASTEXITCODE -ne 0) {
    throw "ABORT=PROJECTION_STRUCTURE_AUDIT_FAILED"
}

Write-Host "`n=== 3. WRITE 5 CASE x 2 LOCALE MATRIX ==="

Remove-Item -LiteralPath $OutputRoot -Recurse -Force -ErrorAction SilentlyContinue

python tools/generate_python_reading_archify_matrix_v0_1.py `
    --output-dir $OutputRoot

if ($LASTEXITCODE -ne 0) {
    throw "ABORT=MATRIX_GENERATION_FAILED"
}

$WorkflowFiles = @(
    Get-ChildItem `
        -LiteralPath $OutputRoot `
        -Recurse `
        -Filter "*.workflow.json" |
    Sort-Object FullName
)

Write-Host "WORKFLOW_FILES=$($WorkflowFiles.Count)"

if ($WorkflowFiles.Count -ne 10) {
    throw "ABORT=UNEXPECTED_WORKFLOW_COUNT"
}

Write-Host "`n=== 4. ARCHIFY STANDARD + SHOWCASE + DELIVERY ==="

$Rows = @()
$FailureCount = 0

foreach ($Workflow in $WorkflowFiles) {
    $Base = $Workflow.FullName.Substring(
        0,
        $Workflow.FullName.Length - ".workflow.json".Length
    )

    $StandardReceipt = "$Base.standard.json"
    $ShowcaseReceipt = "$Base.showcase.json"
    $DeliveryReceipt = "$Base.delivery.json"
    $Html = "$Base.html"
    $ArtifactReceipt = "$Base.artifact-check.txt"

    $StandardOutput = @(
        & node $ArchifyCli `
            validate workflow `
            $Workflow.FullName `
            --quality standard `
            --json 2>&1
    )
    $StandardExit = $LASTEXITCODE
    Write-Utf8NoBomFile -Path $StandardReceipt -Lines $StandardOutput

    $ShowcaseOutput = @(
        & node $ArchifyCli `
            validate workflow `
            $Workflow.FullName `
            --quality showcase `
            --json 2>&1
    )
    $ShowcaseExit = $LASTEXITCODE
    Write-Utf8NoBomFile -Path $ShowcaseReceipt -Lines $ShowcaseOutput

    $DeliveryExit = 99
    $ArtifactExit = 99

    if ($StandardExit -eq 0) {
        $DeliveryOutput = @(
            & node $ArchifyCli `
                deliver workflow `
                $Workflow.FullName `
                $Html `
                --quality standard `
                --json 2>&1
        )
        $DeliveryExit = $LASTEXITCODE
        Write-Utf8NoBomFile -Path $DeliveryReceipt -Lines $DeliveryOutput

        if ($DeliveryExit -eq 0) {
            $ArtifactOutput = @(
                & node $ArtifactChecker $Html 2>&1
            )
            $ArtifactExit = $LASTEXITCODE
            Write-Utf8NoBomFile -Path $ArtifactReceipt -Lines $ArtifactOutput
        }
    }

    $Passed = (
        $StandardExit -eq 0 -and
        $ShowcaseExit -eq 0 -and
        $DeliveryExit -eq 0 -and
        $ArtifactExit -eq 0
    )

    if (-not $Passed) {
        $FailureCount += 1
    }

    $Rows += [pscustomobject]@{
        Workflow = $Workflow.Name
        Standard = $StandardExit
        Showcase = $ShowcaseExit
        Delivery = $DeliveryExit
        Artifact = $ArtifactExit
        Passed = $Passed
        StandardReceipt = $StandardReceipt
        ShowcaseReceipt = $ShowcaseReceipt
    }
}

$Rows | Select-Object Workflow, Standard, Showcase, Delivery, Artifact, Passed | Format-Table -AutoSize

Write-Host "FAILURE_COUNT=$FailureCount"

if ($FailureCount -ne 0) {
    Write-Host "`n=== 4B. FAILED WORKFLOW STANDARD RECEIPTS ==="

    foreach ($Row in @($Rows | Where-Object { -not $_.Passed })) {
        Write-Host "`n--- $($Row.Workflow) ---"
        Write-Host "STANDARD_EXIT=$($Row.Standard)"
        Write-Host "SHOWCASE_EXIT=$($Row.Showcase)"

        if (Test-Path -LiteralPath $Row.StandardReceipt -PathType Leaf) {
            Get-Content -LiteralPath $Row.StandardReceipt -Raw -Encoding UTF8
        } else {
            Write-Host "STANDARD_RECEIPT_MISSING=$($Row.StandardReceipt)"
        }
    }
}

Write-Host "`n=== 5. REPO SAFETY ==="

$AfterStatus = git status --porcelain

if ($AfterStatus) {
    Write-Host "UNEXPECTED_STATUS="
    $AfterStatus
    throw "ABORT=REPO_CHANGED"
}

Write-Host "WORKTREE_CLEAN=True"
Write-Host "TRACKED_SOURCE_MODIFIED=False"

if ($FailureCount -ne 0) {
    Write-Host "RESULT=REVIEW_REQUIRED_PYTHON_READING_ARCHIFY_MATRIX_V0_1"
    throw "ABORT=ARCHIFY_MATRIX_HAS_FAILURES"
}

Write-Host "RESULT=PASS_PYTHON_READING_ARCHIFY_MATRIX_V0_1"

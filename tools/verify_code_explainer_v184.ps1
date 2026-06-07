param(
  [string]$Version = "20260606_v184_a3",
  [int]$Port = 5173,
  [string]$ReportPath = ".tmp\code_explainer_smoke_report_v184_a3.json",
  [switch]$SkipLocalHttp
)

$ErrorActionPreference = "Stop"

function Invoke-Step {
  param(
    [string]$Name,
    [scriptblock]$Block
  )

  Write-Host ""
  Write-Host "=== $Name ==="
  & $Block

  if ($LASTEXITCODE -ne $null -and $LASTEXITCODE -ne 0) {
    throw "$Name failed with exit code $LASTEXITCODE"
  }
}

function Assert-Contains($Path, $Needle, $Name) {
  $text = Get-Content $Path -Raw -Encoding UTF8

  if (-not $text.Contains($Needle)) {
    throw "STATIC_CHECK_FAIL $Name"
  }

  Write-Host "STATIC_OK $Name"
}
Invoke-Step "node syntax code_explainer_rules.js" {
  node --check .\src\pwa\code_explainer_rules.js
}

Invoke-Step "node syntax code_explainer.js" {
  node --check .\src\pwa\code_explainer.js
}

Invoke-Step "node syntax smoke script" {
  node --check .\tools\code_explainer_smoke_v171.js
}

Invoke-Step "lesson validation" {
  python tools/validate_lessons.py --expected-app-version $Version --expected-lesson-cards 1785
}

Invoke-Step "code explainer smoke samples with report" {
  node .\tools\code_explainer_smoke_v171.js --report $ReportPath
}

Write-Host ""
Write-Host "=== static markers ==="
Assert-Contains ".\src\pwa\app.js" $Version "APP_VERSION"
Assert-Contains ".\src\pwa\index.html" "code_explainer.js?v=$Version" "UI_SCRIPT_VERSION"
Assert-Contains ".\src\pwa\index.html" 'id="codeExplainerVersion" class="badge">V184</span>' "BADGE_V184"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "REPORT_WRITTEN" "SMOKE_REPORT_WRITER"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "categoryCounts" "CATEGORY_COUNTS"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "tagCounts" "TAG_COUNTS"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "categoryKeyCounts" "CATEGORY_KEY_COUNTS"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "tagKeyCounts" "TAG_KEY_COUNTS"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "python_argparse_path_subprocess" "PYTHON_ARGPARSE_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "python_fastapi_endpoint" "PYTHON_FASTAPI_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "powershell_node_npm_flow" "POWERSHELL_NODE_NPM_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "package_json_npm_scripts" "PACKAGE_JSON_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "github_actions_workflow" "GITHUB_ACTIONS_SAMPLE"
Assert-Contains ".\src\pwa\index.html" "copyCodeReportBtn" "COPY_REPORT_BUTTON"
Assert-Contains ".\src\pwa\index.html" "codeQuickReport" "QUICK_REPORT_BOX"
Assert-Contains ".\src\pwa\code_explainer.js" "function buildPlainTextReport" "TEXT_REPORT_BUILDER"
Assert-Contains ".\src\pwa\code_explainer.js" "function copyCodeReport" "COPY_REPORT_FUNCTION"
Assert-Contains ".\src\pwa\style.css" "CODE EXPLAINER REPORT UX V179-A1 START" "REPORT_UX_CSS"
Assert-Contains ".\src\pwa\index.html" "showRiskOnlyToggle" "RISK_ONLY_TOGGLE"
Assert-Contains ".\src\pwa\code_explainer.js" "function shouldShowRiskOnly" "RISK_ONLY_FUNCTION"
Assert-Contains ".\src\pwa\code_explainer.js" "function getVisibleSteps" "VISIBLE_STEPS_FUNCTION"
Assert-Contains ".\src\pwa\code_explainer.js" "SOURCE_CODE_PREVIEW_V180_A4" "REPORT_SOURCE_PREVIEW"
Assert-Contains ".\src\pwa\style.css" "CODE EXPLAINER FILTER UX V180-A4 START" "FILTER_UX_CSS"
Assert-Contains ".\src\pwa\index.html" 'value="dockerfile"' "DOCKERFILE_OPTION"
Assert-Contains ".\src\pwa\index.html" 'value="env_file"' "ENV_FILE_OPTION"
Assert-Contains ".\src\pwa\index.html" 'value="requirements_txt"' "REQUIREMENTS_OPTION"
Assert-Contains ".\src\pwa\index.html" 'value="pyproject_toml"' "PYPROJECT_OPTION"
Assert-Contains ".\src\pwa\index.html" 'value="yaml"' "YAML_OPTION"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "function explainDockerfileLine" "DOCKERFILE_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "function explainEnvFileLine" "ENV_FILE_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "function explainRequirementsLine" "REQUIREMENTS_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "function explainPyprojectLine" "PYPROJECT_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "function explainYamlLine" "YAML_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "CONFIG_META_GUARD_V184_A1" "CONFIG_META_GUARD"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "YAML_TAG_GUARD_V184_A1" "YAML_TAG_GUARD"
Assert-Contains ".\src\pwa\index.html" 'value="markdown"' "MARKDOWN_OPTION"
Assert-Contains ".\src\pwa\index.html" 'value="gitignore"' "GITIGNORE_OPTION"
Assert-Contains ".\src\pwa\index.html" 'value="ini_file"' "INI_OPTION"
Assert-Contains ".\src\pwa\index.html" 'value="toml"' "TOML_OPTION"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "function explainMarkdownLine" "MARKDOWN_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "function explainGitignoreLine" "GITIGNORE_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "function explainIniLine" "INI_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "function explainTomlLine" "TOML_RULES"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "DOC_CONFIG_META_GUARD_V184_A3" "DOC_CONFIG_META_GUARD"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "wholeFence" "STRIP_FENCE_WHOLE_ONLY"
Assert-Contains ".\src\pwa\code_explainer_rules.js" "INI_DETECT_GUARD_V184_A3" "INI_DETECT_GUARD"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "markdown_readme_basic" "MARKDOWN_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "gitignore_basic" "GITIGNORE_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "ini_file_basic" "INI_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "toml_general_config" "TOML_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "dockerfile_basic" "DOCKERFILE_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "env_file_secret_config" "ENV_FILE_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "requirements_txt_versions" "REQUIREMENTS_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "pyproject_toml_project_tool" "PYPROJECT_SAMPLE"
Assert-Contains ".\tools\code_explainer_smoke_v171.js" "yaml_general_services" "YAML_SAMPLE"

if (-not (Test-Path $ReportPath)) {
  throw "REPORT_NOT_FOUND $ReportPath"
}

Write-Host ""
Write-Host "=== report summary ==="
$report = Get-Content $ReportPath -Raw -Encoding UTF8 | ConvertFrom-Json

if ($report.failed -ne 0) {
  throw "REPORT_HAS_FAILURES $($report.failed)"
}

$report.samples |
  Select-Object `
    name,
    language,
    stepCount,
    warningCount,
    flowSummary |
  Format-Table -AutoSize

Write-Host ""
Write-Host "=== report category/tag compact ==="
foreach ($sample in $report.samples) {
  $categories = ($sample.categoryKeyCounts.PSObject.Properties |
    Sort-Object Name |
    ForEach-Object { "$($_.Name):$($_.Value)" }) -join ", "

  $tags = ($sample.tagKeyCounts.PSObject.Properties |
    Sort-Object Name |
    ForEach-Object { "$($_.Name):$($_.Value)" }) -join ", "

  Write-Host "SAMPLE_REPORT $($sample.name)"
  Write-Host "  categories: $categories"
  Write-Host "  tags: $tags"
}

Write-Host ""
Write-Host "=== process noise gates ==="

function Get-ReportCount {
  param(
    [object]$Counts,
    [string]$Name
  )

  if ($null -eq $Counts) {
    return 0
  }

  $prop = $Counts.PSObject.Properties[$Name]
  if ($null -eq $prop) {
    return 0
  }

  return [int]$prop.Value
}

$processLimits = @{
  "javascript_dom_storage" = 0
  "workers_d1_api" = 0
  "workers_storage_cache_cors" = 2
  "java_basic_flow" = 1
  "python_argparse_path_subprocess" = 0
  "python_fastapi_endpoint" = 0
  "powershell_node_npm_flow" = 0
  "package_json_npm_scripts" = 0
  "github_actions_workflow" = 0
}

foreach ($sample in $report.samples) {
  if ($processLimits.ContainsKey($sample.name)) {
    $actual = Get-ReportCount $sample.categoryKeyCounts "process"
    $limit = [int]$processLimits[$sample.name]

    if ($actual -gt $limit) {
      throw "PROCESS_NOISE_TOO_HIGH $($sample.name) process=$actual limit=$limit"
    }

    Write-Host "PROCESS_GATE_OK $($sample.name) process=$actual limit=$limit"
  }
}

foreach ($sample in $report.samples) {
  if ($sample.name -eq "python_api_csv_loop") {
    $actual = Get-ReportCount $sample.categoryKeyCounts "error_handling"
    $limit = 0

    if ($actual -gt $limit) {
      throw "CATEGORY_NOISE_TOO_HIGH $($sample.name) error_handling=$actual limit=$limit"
    }

    Write-Host "CATEGORY_GATE_OK $($sample.name) error_handling=$actual limit=$limit"
  }
}

foreach ($sample in $report.samples) {
  if ($sample.name -eq "python_argparse_path_subprocess") {
    $actual = Get-ReportCount $sample.categoryKeyCounts "database"
    $limit = 0

    if ($actual -gt $limit) {
      throw "CATEGORY_NOISE_TOO_HIGH $($sample.name) database=$actual limit=$limit"
    }

    Write-Host "CATEGORY_GATE_OK $($sample.name) database=$actual limit=$limit"
  }

  if ($sample.name -eq "github_actions_workflow") {
    $actual = Get-ReportCount $sample.categoryKeyCounts "package_config"
    $limit = 0

    if ($actual -gt $limit) {
      throw "CATEGORY_NOISE_TOO_HIGH $($sample.name) package_config=$actual limit=$limit"
    }

    Write-Host "CATEGORY_GATE_OK $($sample.name) package_config=$actual limit=$limit"
  }
}


Write-Host ""
Write-Host "=== config meta noise gates ==="

$configCategoryLimits = @{
  "dockerfile_basic" = @{"cicd" = 0}
  "env_file_secret_config" = @{"version_control" = 0; "database" = 0}
  "requirements_txt_versions" = @{"web_server" = 0}
  "pyproject_toml_project_tool" = @{"condition" = 0}
}

foreach ($sample in $report.samples) {
  if ($configCategoryLimits.ContainsKey($sample.name)) {
    $limits = $configCategoryLimits[$sample.name]

    foreach ($categoryName in $limits.Keys) {
      $actual = Get-ReportCount $sample.categoryKeyCounts $categoryName
      $limit = [int]$limits[$categoryName]

      if ($actual -gt $limit) {
        throw "CATEGORY_NOISE_TOO_HIGH $($sample.name) $categoryName=$actual limit=$limit"
      }

      Write-Host "CATEGORY_GATE_OK $($sample.name) $categoryName=$actual limit=$limit"
    }
  }
}



Write-Host ""
Write-Host "=== yaml tag noise gates ==="

foreach ($sample in $report.samples) {
  if ($sample.name -eq "yaml_general_services") {
    $actual = Get-ReportCount $sample.tagKeyCounts "unknown"
    $limit = 0

    if ($actual -gt $limit) {
      throw "TAG_NOISE_TOO_HIGH $($sample.name) unknown=$actual limit=$limit"
    }

    Write-Host "TAG_GATE_OK $($sample.name) unknown=$actual limit=$limit"

    foreach ($tagName in @("yaml", "service", "container", "port", "env_var", "volume", "list")) {
      $count = Get-ReportCount $sample.tagKeyCounts $tagName
      Write-Host "TAG_SEEN $($sample.name) $tagName=$count"
    }
  }
}



Write-Host ""
Write-Host "=== document/config tag noise gates ==="

foreach ($sample in $report.samples) {
  if (@("markdown_readme_basic", "gitignore_basic", "ini_file_basic", "toml_general_config") -contains $sample.name) {
    $actual = Get-ReportCount $sample.tagKeyCounts "unknown"
    $limit = 0

    if ($actual -gt $limit) {
      throw "TAG_NOISE_TOO_HIGH $($sample.name) unknown=$actual limit=$limit"
    }

    Write-Host "TAG_GATE_OK $($sample.name) unknown=$actual limit=$limit"
  }
}


if (-not $SkipLocalHttp) {
  Write-Host ""
  Write-Host "=== local http assets ==="

  $root = "http://127.0.0.1:$Port"
  $urls = @(
    "$root/src/pwa/index.html?v=$Version",
    "$root/src/pwa/app.js?v=$Version",
    "$root/src/pwa/code_explainer.js?v=$Version",
    "$root/src/pwa/code_explainer_rules.js?v=$Version",
    "$root/src/pwa/style.css?v=$Version"
  )

  foreach ($url in $urls) {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing
    if ($response.StatusCode -ne 200) {
      throw "LOCAL_HTTP_FAIL $url"
    }
    Write-Host "LOCAL_OK $($response.StatusCode) $url"
  }
}

Write-Host ""
Write-Host "V184_CODE_EXPLAINER_VERIFY_OK"

# V322-A4 command_explainer schema audit

## Purpose

This audit inspects the runtime output shape of command_explainer before any V322-A4 patch.
A3-pre showed `[object Object]` for PowerShell/git/wrangler samples, so the first question is whether the engine is weak or whether the harness was reading the wrong result field.

## Summary

- engine present: true
- exported keys: 40
- candidate functions: analyzePowerShellV277, analyzeBashV278, isDangerRawCommandV286, classifyPowerShellLineV277, classifyBashLineV278, detectCommandLanguageV277
- sample commands: 5
- invocation rows: 90
- object_schema_present: 50
- object_stringification_risk: 10
- text_output: 30

## Exported keys

- actionGuideOrderV285
- analyzeBashV278
- analyzePowerShellV277
- beginnerTermsV281
- bindSafetyChecklistCopyV290
- buildActionGuideV285
- buildDangerGuideV286
- buildSafetyChecklistV290
- buildSampleSafetyGroupsV294
- classifyBashLineV278
- classifyDangerStepV291
- classifyPowerShellLineV277
- dangerFlowStepsV286
- detectCommandLanguageV277
- enhanceResultForBeginnersV281
- enhanceResultGitFlowWordingV282
- enhanceStepForBeginnersV281
- enhanceStepGitFlowWordingV282
- getSafetyGroupMetaV293
- getSafetyGroupsV292
- getSampleV288
- gitFlowWordingV282
- init
- isDangerRawCommandV286
- loadSampleV288
- refresh
- renderActionGuideV285
- renderDangerGuideV286
- renderDangerGuideV287
- renderExtraNotesV283
- renderSafetyChecklistV290
- renderSampleDescriptionV289
- renderSampleSafetyGroupsV294
- renderV277
- sampleBashV278
- sampleCatalogV288
- samplePowerShellV277
- syncSampleShellV288
- updateSampleDescriptionV289
- version

## Invocation table

| sample | language | function | signature | ok | verdict | shape | keys/text |
|---|---|---|---|---|---|---|---|
| powershell_pipeline | powershell | analyzePowerShellV277 | string | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| powershell_pipeline | powershell | analyzePowerShellV277 | object | true | object_stringification_risk | object | version, language, steps, warnings, summary, nextChecks |
| powershell_pipeline | powershell | analyzePowerShellV277 | string_language | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| powershell_pipeline | powershell | analyzeBashV278 | string | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| powershell_pipeline | powershell | analyzeBashV278 | object | true | object_stringification_risk | object | version, language, steps, warnings, summary, nextChecks |
| powershell_pipeline | powershell | analyzeBashV278 | string_language | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| powershell_pipeline | powershell | isDangerRawCommandV286 | string | true | text_output | boolean | false |
| powershell_pipeline | powershell | isDangerRawCommandV286 | object | true | text_output | boolean | false |
| powershell_pipeline | powershell | isDangerRawCommandV286 | string_language | true | text_output | boolean | false |
| powershell_pipeline | powershell | classifyPowerShellLineV277 | string | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_pipeline | powershell | classifyPowerShellLineV277 | object | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_pipeline | powershell | classifyPowerShellLineV277 | string_language | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_pipeline | powershell | classifyBashLineV278 | string | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_pipeline | powershell | classifyBashLineV278 | object | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_pipeline | powershell | classifyBashLineV278 | string_language | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_pipeline | powershell | detectCommandLanguageV277 | string | true | text_output | string | powershell |
| powershell_pipeline | powershell | detectCommandLanguageV277 | object | true | text_output | string | powershell |
| powershell_pipeline | powershell | detectCommandLanguageV277 | string_language | true | text_output | string | powershell |
| git_clean | powershell | analyzePowerShellV277 | string | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| git_clean | powershell | analyzePowerShellV277 | object | true | object_stringification_risk | object | version, language, steps, warnings, summary, nextChecks |
| git_clean | powershell | analyzePowerShellV277 | string_language | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| git_clean | powershell | analyzeBashV278 | string | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| git_clean | powershell | analyzeBashV278 | object | true | object_stringification_risk | object | version, language, steps, warnings, summary, nextChecks |
| git_clean | powershell | analyzeBashV278 | string_language | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| git_clean | powershell | isDangerRawCommandV286 | string | true | text_output | boolean | true |
| git_clean | powershell | isDangerRawCommandV286 | object | true | text_output | boolean | false |
| git_clean | powershell | isDangerRawCommandV286 | string_language | true | text_output | boolean | true |
| git_clean | powershell | classifyPowerShellLineV277 | string | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| git_clean | powershell | classifyPowerShellLineV277 | object | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| git_clean | powershell | classifyPowerShellLineV277 | string_language | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| git_clean | powershell | classifyBashLineV278 | string | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| git_clean | powershell | classifyBashLineV278 | object | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| git_clean | powershell | classifyBashLineV278 | string_language | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| git_clean | powershell | detectCommandLanguageV277 | string | true | text_output | string | powershell |
| git_clean | powershell | detectCommandLanguageV277 | object | true | text_output | string | powershell |
| git_clean | powershell | detectCommandLanguageV277 | string_language | true | text_output | string | powershell |
| wrangler_deploy | powershell | analyzePowerShellV277 | string | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| wrangler_deploy | powershell | analyzePowerShellV277 | object | true | object_stringification_risk | object | version, language, steps, warnings, summary, nextChecks |
| wrangler_deploy | powershell | analyzePowerShellV277 | string_language | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| wrangler_deploy | powershell | analyzeBashV278 | string | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| wrangler_deploy | powershell | analyzeBashV278 | object | true | object_stringification_risk | object | version, language, steps, warnings, summary, nextChecks |
| wrangler_deploy | powershell | analyzeBashV278 | string_language | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| wrangler_deploy | powershell | isDangerRawCommandV286 | string | true | text_output | boolean | false |
| wrangler_deploy | powershell | isDangerRawCommandV286 | object | true | text_output | boolean | false |
| wrangler_deploy | powershell | isDangerRawCommandV286 | string_language | true | text_output | boolean | false |
| wrangler_deploy | powershell | classifyPowerShellLineV277 | string | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| wrangler_deploy | powershell | classifyPowerShellLineV277 | object | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| wrangler_deploy | powershell | classifyPowerShellLineV277 | string_language | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| wrangler_deploy | powershell | classifyBashLineV278 | string | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| wrangler_deploy | powershell | classifyBashLineV278 | object | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| wrangler_deploy | powershell | classifyBashLineV278 | string_language | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| wrangler_deploy | powershell | detectCommandLanguageV277 | string | true | text_output | string | powershell |
| wrangler_deploy | powershell | detectCommandLanguageV277 | object | true | text_output | string | powershell |
| wrangler_deploy | powershell | detectCommandLanguageV277 | string_language | true | text_output | string | powershell |
| powershell_web_request | powershell | analyzePowerShellV277 | string | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| powershell_web_request | powershell | analyzePowerShellV277 | object | true | object_stringification_risk | object | version, language, steps, warnings, summary, nextChecks |
| powershell_web_request | powershell | analyzePowerShellV277 | string_language | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| powershell_web_request | powershell | analyzeBashV278 | string | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| powershell_web_request | powershell | analyzeBashV278 | object | true | object_stringification_risk | object | version, language, steps, warnings, summary, nextChecks |
| powershell_web_request | powershell | analyzeBashV278 | string_language | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| powershell_web_request | powershell | isDangerRawCommandV286 | string | true | text_output | boolean | false |
| powershell_web_request | powershell | isDangerRawCommandV286 | object | true | text_output | boolean | false |
| powershell_web_request | powershell | isDangerRawCommandV286 | string_language | true | text_output | boolean | false |
| powershell_web_request | powershell | classifyPowerShellLineV277 | string | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_web_request | powershell | classifyPowerShellLineV277 | object | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_web_request | powershell | classifyPowerShellLineV277 | string_language | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_web_request | powershell | classifyBashLineV278 | string | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_web_request | powershell | classifyBashLineV278 | object | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_web_request | powershell | classifyBashLineV278 | string_language | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| powershell_web_request | powershell | detectCommandLanguageV277 | string | true | text_output | string | powershell |
| powershell_web_request | powershell | detectCommandLanguageV277 | object | true | text_output | string | powershell |
| powershell_web_request | powershell | detectCommandLanguageV277 | string_language | true | text_output | string | powershell |
| bash_pipeline | bash | analyzePowerShellV277 | string | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| bash_pipeline | bash | analyzePowerShellV277 | object | true | object_stringification_risk | object | version, language, steps, warnings, summary, nextChecks |
| bash_pipeline | bash | analyzePowerShellV277 | string_language | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| bash_pipeline | bash | analyzeBashV278 | string | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| bash_pipeline | bash | analyzeBashV278 | object | true | object_stringification_risk | object | version, language, steps, warnings, summary, nextChecks |
| bash_pipeline | bash | analyzeBashV278 | string_language | true | object_schema_present | object | version, language, steps, warnings, summary, nextChecks |
| bash_pipeline | bash | isDangerRawCommandV286 | string | true | text_output | boolean | false |
| bash_pipeline | bash | isDangerRawCommandV286 | object | true | text_output | boolean | false |
| bash_pipeline | bash | isDangerRawCommandV286 | string_language | true | text_output | boolean | false |
| bash_pipeline | bash | classifyPowerShellLineV277 | string | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| bash_pipeline | bash | classifyPowerShellLineV277 | object | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| bash_pipeline | bash | classifyPowerShellLineV277 | string_language | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| bash_pipeline | bash | classifyBashLineV278 | string | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| bash_pipeline | bash | classifyBashLineV278 | object | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| bash_pipeline | bash | classifyBashLineV278 | string_language | true | object_schema_present | object | line, command, group, risk, raw, meaning, fileImpact, nextCheck |
| bash_pipeline | bash | detectCommandLanguageV277 | string | true | text_output | string | bash |
| bash_pipeline | bash | detectCommandLanguageV277 | object | true | text_output | string | powershell |
| bash_pipeline | bash | detectCommandLanguageV277 | string_language | true | text_output | string | bash |

## Detailed raw previews

### powershell_pipeline / analyzePowerShellV277 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "Get-ChildItem",
      "group": "미분류",
      "risk": "unknown",
      "raw": "Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help Get-ChildItem"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help Get-ChildItem"
  ]
}
```

### powershell_pipeline / analyzePowerShellV277 / object

- ok: true
- verdict: object_stringification_risk
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "[object",
      "group": "미분류",
      "risk": "unknown",
      "raw": "[object Object]",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help [object"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help [object"
  ]
}
```

### powershell_pipeline / analyzePowerShellV277 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "Get-ChildItem",
      "group": "미분류",
      "risk": "unknown",
      "raw": "Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help Get-ChildItem"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help Get-ChildItem"
  ]
}
```

### powershell_pipeline / analyzeBashV278 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "Get-ChildItem",
      "group": "미분류",
      "risk": "unknown",
      "raw": "Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-ChildItem --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-ChildItem --help"
  ]
}
```

### powershell_pipeline / analyzeBashV278 / object

- ok: true
- verdict: object_stringification_risk
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "[object",
      "group": "미분류",
      "risk": "unknown",
      "raw": "[object Object]",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: [object --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: [object --help"
  ]
}
```

### powershell_pipeline / analyzeBashV278 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "Get-ChildItem",
      "group": "미분류",
      "risk": "unknown",
      "raw": "Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-ChildItem --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-ChildItem --help"
  ]
}
```

### powershell_pipeline / isDangerRawCommandV286 / string

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### powershell_pipeline / isDangerRawCommandV286 / object

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### powershell_pipeline / isDangerRawCommandV286 / string_language

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### powershell_pipeline / classifyPowerShellLineV277 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "Get-ChildItem",
  "group": "미분류",
  "risk": "unknown",
  "raw": "Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length",
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help Get-ChildItem"
}
```

### powershell_pipeline / classifyPowerShellLineV277 / object

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "[object",
  "group": "미분류",
  "risk": "unknown",
  "raw": {
    "command": "Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length",
    "language": "powershell",
    "shell": "powershell"
  },
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help [object"
}
```

### powershell_pipeline / classifyPowerShellLineV277 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "line": "powershell",
  "command": "Get-ChildItem",
  "group": "미분류",
  "risk": "unknown",
  "raw": "Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length",
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help Get-ChildItem"
}
```

### powershell_pipeline / classifyBashLineV278 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "Get-ChildItem",
  "group": "미분류",
  "risk": "unknown",
  "raw": "Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length",
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-ChildItem --help"
}
```

### powershell_pipeline / classifyBashLineV278 / object

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "[object",
  "group": "미분류",
  "risk": "unknown",
  "raw": {
    "command": "Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length",
    "language": "powershell",
    "shell": "powershell"
  },
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: [object --help"
}
```

### powershell_pipeline / classifyBashLineV278 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "line": "powershell",
  "command": "Get-ChildItem",
  "group": "미분류",
  "risk": "unknown",
  "raw": "Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length",
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-ChildItem --help"
}
```

### powershell_pipeline / detectCommandLanguageV277 / string

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### powershell_pipeline / detectCommandLanguageV277 / object

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### powershell_pipeline / detectCommandLanguageV277 / string_language

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### git_clean / analyzePowerShellV277 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "git",
      "group": "미분류",
      "risk": "unknown",
      "raw": "git clean -fd",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help git"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help git"
  ]
}
```

### git_clean / analyzePowerShellV277 / object

- ok: true
- verdict: object_stringification_risk
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "[object",
      "group": "미분류",
      "risk": "unknown",
      "raw": "[object Object]",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help [object"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help [object"
  ]
}
```

### git_clean / analyzePowerShellV277 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "git",
      "group": "미분류",
      "risk": "unknown",
      "raw": "git clean -fd",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help git"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help git"
  ]
}
```

### git_clean / analyzeBashV278 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "git",
      "group": "미분류",
      "risk": "unknown",
      "raw": "git clean -fd",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: git --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: git --help"
  ]
}
```

### git_clean / analyzeBashV278 / object

- ok: true
- verdict: object_stringification_risk
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "[object",
      "group": "미분류",
      "risk": "unknown",
      "raw": "[object Object]",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: [object --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: [object --help"
  ]
}
```

### git_clean / analyzeBashV278 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "git",
      "group": "미분류",
      "risk": "unknown",
      "raw": "git clean -fd",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: git --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: git --help"
  ]
}
```

### git_clean / isDangerRawCommandV286 / string

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
true
```

### git_clean / isDangerRawCommandV286 / object

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### git_clean / isDangerRawCommandV286 / string_language

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
true
```

### git_clean / classifyPowerShellLineV277 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "git",
  "group": "미분류",
  "risk": "unknown",
  "raw": "git clean -fd",
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help git"
}
```

### git_clean / classifyPowerShellLineV277 / object

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "[object",
  "group": "미분류",
  "risk": "unknown",
  "raw": {
    "command": "git clean -fd",
    "language": "powershell",
    "shell": "powershell"
  },
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help [object"
}
```

### git_clean / classifyPowerShellLineV277 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "line": "powershell",
  "command": "git",
  "group": "미분류",
  "risk": "unknown",
  "raw": "git clean -fd",
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help git"
}
```

### git_clean / classifyBashLineV278 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "git",
  "group": "미분류",
  "risk": "unknown",
  "raw": "git clean -fd",
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: git --help"
}
```

### git_clean / classifyBashLineV278 / object

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "[object",
  "group": "미분류",
  "risk": "unknown",
  "raw": {
    "command": "git clean -fd",
    "language": "powershell",
    "shell": "powershell"
  },
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: [object --help"
}
```

### git_clean / classifyBashLineV278 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "line": "powershell",
  "command": "git",
  "group": "미분류",
  "risk": "unknown",
  "raw": "git clean -fd",
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: git --help"
}
```

### git_clean / detectCommandLanguageV277 / string

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### git_clean / detectCommandLanguageV277 / object

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### git_clean / detectCommandLanguageV277 / string_language

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### wrangler_deploy / analyzePowerShellV277 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "npx",
      "group": "미분류",
      "risk": "unknown",
      "raw": "npx wrangler deploy",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help npx"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help npx"
  ]
}
```

### wrangler_deploy / analyzePowerShellV277 / object

- ok: true
- verdict: object_stringification_risk
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "[object",
      "group": "미분류",
      "risk": "unknown",
      "raw": "[object Object]",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help [object"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help [object"
  ]
}
```

### wrangler_deploy / analyzePowerShellV277 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "npx",
      "group": "미분류",
      "risk": "unknown",
      "raw": "npx wrangler deploy",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help npx"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help npx"
  ]
}
```

### wrangler_deploy / analyzeBashV278 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "npx",
      "group": "미분류",
      "risk": "unknown",
      "raw": "npx wrangler deploy",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: npx --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: npx --help"
  ]
}
```

### wrangler_deploy / analyzeBashV278 / object

- ok: true
- verdict: object_stringification_risk
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "[object",
      "group": "미분류",
      "risk": "unknown",
      "raw": "[object Object]",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: [object --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: [object --help"
  ]
}
```

### wrangler_deploy / analyzeBashV278 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "npx",
      "group": "미분류",
      "risk": "unknown",
      "raw": "npx wrangler deploy",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: npx --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: npx --help"
  ]
}
```

### wrangler_deploy / isDangerRawCommandV286 / string

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### wrangler_deploy / isDangerRawCommandV286 / object

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### wrangler_deploy / isDangerRawCommandV286 / string_language

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### wrangler_deploy / classifyPowerShellLineV277 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "npx",
  "group": "미분류",
  "risk": "unknown",
  "raw": "npx wrangler deploy",
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help npx"
}
```

### wrangler_deploy / classifyPowerShellLineV277 / object

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "[object",
  "group": "미분류",
  "risk": "unknown",
  "raw": {
    "command": "npx wrangler deploy",
    "language": "powershell",
    "shell": "powershell"
  },
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help [object"
}
```

### wrangler_deploy / classifyPowerShellLineV277 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "line": "powershell",
  "command": "npx",
  "group": "미분류",
  "risk": "unknown",
  "raw": "npx wrangler deploy",
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help npx"
}
```

### wrangler_deploy / classifyBashLineV278 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "npx",
  "group": "미분류",
  "risk": "unknown",
  "raw": "npx wrangler deploy",
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: npx --help"
}
```

### wrangler_deploy / classifyBashLineV278 / object

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "[object",
  "group": "미분류",
  "risk": "unknown",
  "raw": {
    "command": "npx wrangler deploy",
    "language": "powershell",
    "shell": "powershell"
  },
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: [object --help"
}
```

### wrangler_deploy / classifyBashLineV278 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "line": "powershell",
  "command": "npx",
  "group": "미분류",
  "risk": "unknown",
  "raw": "npx wrangler deploy",
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: npx --help"
}
```

### wrangler_deploy / detectCommandLanguageV277 / string

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### wrangler_deploy / detectCommandLanguageV277 / object

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### wrangler_deploy / detectCommandLanguageV277 / string_language

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### powershell_web_request / analyzePowerShellV277 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "Invoke-WebRequest",
      "group": "미분류",
      "risk": "unknown",
      "raw": "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help Invoke-WebRequest"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help Invoke-WebRequest"
  ]
}
```

### powershell_web_request / analyzePowerShellV277 / object

- ok: true
- verdict: object_stringification_risk
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "[object",
      "group": "미분류",
      "risk": "unknown",
      "raw": "[object Object]",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help [object"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help [object"
  ]
}
```

### powershell_web_request / analyzePowerShellV277 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "Invoke-WebRequest",
      "group": "미분류",
      "risk": "unknown",
      "raw": "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help Invoke-WebRequest"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help Invoke-WebRequest"
  ]
}
```

### powershell_web_request / analyzeBashV278 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "Invoke-WebRequest",
      "group": "미분류",
      "risk": "unknown",
      "raw": "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Invoke-WebRequest --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Invoke-WebRequest --help"
  ]
}
```

### powershell_web_request / analyzeBashV278 / object

- ok: true
- verdict: object_stringification_risk
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "[object",
      "group": "미분류",
      "risk": "unknown",
      "raw": "[object Object]",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: [object --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: [object --help"
  ]
}
```

### powershell_web_request / analyzeBashV278 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "Invoke-WebRequest",
      "group": "미분류",
      "risk": "unknown",
      "raw": "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Invoke-WebRequest --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Invoke-WebRequest --help"
  ]
}
```

### powershell_web_request / isDangerRawCommandV286 / string

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### powershell_web_request / isDangerRawCommandV286 / object

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### powershell_web_request / isDangerRawCommandV286 / string_language

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### powershell_web_request / classifyPowerShellLineV277 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "Invoke-WebRequest",
  "group": "미분류",
  "risk": "unknown",
  "raw": "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help Invoke-WebRequest"
}
```

### powershell_web_request / classifyPowerShellLineV277 / object

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "[object",
  "group": "미분류",
  "risk": "unknown",
  "raw": {
    "command": "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
    "language": "powershell",
    "shell": "powershell"
  },
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help [object"
}
```

### powershell_web_request / classifyPowerShellLineV277 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "line": "powershell",
  "command": "Invoke-WebRequest",
  "group": "미분류",
  "risk": "unknown",
  "raw": "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help Invoke-WebRequest"
}
```

### powershell_web_request / classifyBashLineV278 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "Invoke-WebRequest",
  "group": "미분류",
  "risk": "unknown",
  "raw": "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Invoke-WebRequest --help"
}
```

### powershell_web_request / classifyBashLineV278 / object

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "[object",
  "group": "미분류",
  "risk": "unknown",
  "raw": {
    "command": "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
    "language": "powershell",
    "shell": "powershell"
  },
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: [object --help"
}
```

### powershell_web_request / classifyBashLineV278 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "line": "powershell",
  "command": "Invoke-WebRequest",
  "group": "미분류",
  "risk": "unknown",
  "raw": "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Invoke-WebRequest --help"
}
```

### powershell_web_request / detectCommandLanguageV277 / string

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### powershell_web_request / detectCommandLanguageV277 / object

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### powershell_web_request / detectCommandLanguageV277 / string_language

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### bash_pipeline / analyzePowerShellV277 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "cat",
      "group": "미분류",
      "risk": "unknown",
      "raw": "cat app.log | grep ERROR | sort | uniq -c",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help cat"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help cat"
  ]
}
```

### bash_pipeline / analyzePowerShellV277 / object

- ok: true
- verdict: object_stringification_risk
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "[object",
      "group": "미분류",
      "risk": "unknown",
      "raw": "[object Object]",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help [object"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help [object"
  ]
}
```

### bash_pipeline / analyzePowerShellV277 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "powershell",
  "steps": [
    {
      "line": 1,
      "command": "cat",
      "group": "미분류",
      "risk": "unknown",
      "raw": "cat app.log | grep ERROR | sort | uniq -c",
      "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: Get-Help cat"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "PowerShell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: Get-Help cat"
  ]
}
```

### bash_pipeline / analyzeBashV278 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "cat",
      "group": "파일 읽기",
      "risk": "safe",
      "raw": "cat app.log | grep ERROR | sort | uniq -c",
      "meaning": "파일 내용을 터미널에 출력합니다.",
      "fileImpact": "파일을 읽기만 하며 보통 수정하지 않습니다.",
      "nextCheck": "head -n 20 <파일>"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 1,
    "caution": 0,
    "danger": 0,
    "unknown": 0,
    "groups": {
      "파일 읽기": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 0개입니다."
  },
  "nextChecks": [
    "head -n 20 <파일>"
  ]
}
```

### bash_pipeline / analyzeBashV278 / object

- ok: true
- verdict: object_stringification_risk
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "[object",
      "group": "미분류",
      "risk": "unknown",
      "raw": "[object Object]",
      "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
      "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
      "nextCheck": "명령 도움말 확인: [object --help"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 0,
    "caution": 0,
    "danger": 0,
    "unknown": 1,
    "groups": {
      "미분류": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 1개입니다."
  },
  "nextChecks": [
    "명령 도움말 확인: [object --help"
  ]
}
```

### bash_pipeline / analyzeBashV278 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "version",     "language",     "steps",     "warnings",     "summary",     "nextChecks"   ] }

Raw preview:

```text
{
  "version": "20260611_v297_a1",
  "language": "bash",
  "steps": [
    {
      "line": 1,
      "command": "cat",
      "group": "파일 읽기",
      "risk": "safe",
      "raw": "cat app.log | grep ERROR | sort | uniq -c",
      "meaning": "파일 내용을 터미널에 출력합니다.",
      "fileImpact": "파일을 읽기만 하며 보통 수정하지 않습니다.",
      "nextCheck": "head -n 20 <파일>"
    }
  ],
  "warnings": [],
  "summary": {
    "total": 1,
    "safe": 1,
    "caution": 0,
    "danger": 0,
    "unknown": 0,
    "groups": {
      "파일 읽기": 1
    },
    "text": "Bash/Shell 명령 1개를 작업 순서대로 분석했습니다. 위험 0개, 주의 0개, 미확인 0개입니다."
  },
  "nextChecks": [
    "head -n 20 <파일>"
  ]
}
```

### bash_pipeline / isDangerRawCommandV286 / string

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### bash_pipeline / isDangerRawCommandV286 / object

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### bash_pipeline / isDangerRawCommandV286 / string_language

- ok: true
- verdict: text_output
- shape: {   "type": "boolean" }

Raw preview:

```text
false
```

### bash_pipeline / classifyPowerShellLineV277 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "cat",
  "group": "미분류",
  "risk": "unknown",
  "raw": "cat app.log | grep ERROR | sort | uniq -c",
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help cat"
}
```

### bash_pipeline / classifyPowerShellLineV277 / object

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "[object",
  "group": "미분류",
  "risk": "unknown",
  "raw": {
    "command": "cat app.log | grep ERROR | sort | uniq -c",
    "language": "bash",
    "shell": "bash"
  },
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help [object"
}
```

### bash_pipeline / classifyPowerShellLineV277 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "line": "bash",
  "command": "cat",
  "group": "미분류",
  "risk": "unknown",
  "raw": "cat app.log | grep ERROR | sort | uniq -c",
  "meaning": "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: Get-Help cat"
}
```

### bash_pipeline / classifyBashLineV278 / string

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "cat",
  "group": "파일 읽기",
  "risk": "safe",
  "raw": "cat app.log | grep ERROR | sort | uniq -c",
  "meaning": "파일 내용을 터미널에 출력합니다.",
  "fileImpact": "파일을 읽기만 하며 보통 수정하지 않습니다.",
  "nextCheck": "head -n 20 <파일>"
}
```

### bash_pipeline / classifyBashLineV278 / object

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "command": "[object",
  "group": "미분류",
  "risk": "unknown",
  "raw": {
    "command": "cat app.log | grep ERROR | sort | uniq -c",
    "language": "bash",
    "shell": "bash"
  },
  "meaning": "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
  "fileImpact": "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
  "nextCheck": "명령 도움말 확인: [object --help"
}
```

### bash_pipeline / classifyBashLineV278 / string_language

- ok: true
- verdict: object_schema_present
- shape: {   "type": "object",   "keys": [     "line",     "command",     "group",     "risk",     "raw",     "meaning",     "fileImpact",     "nextCheck"   ] }

Raw preview:

```text
{
  "line": "bash",
  "command": "cat",
  "group": "파일 읽기",
  "risk": "safe",
  "raw": "cat app.log | grep ERROR | sort | uniq -c",
  "meaning": "파일 내용을 터미널에 출력합니다.",
  "fileImpact": "파일을 읽기만 하며 보통 수정하지 않습니다.",
  "nextCheck": "head -n 20 <파일>"
}
```

### bash_pipeline / detectCommandLanguageV277 / string

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"bash"
```

### bash_pipeline / detectCommandLanguageV277 / object

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"powershell"
```

### bash_pipeline / detectCommandLanguageV277 / string_language

- ok: true
- verdict: text_output
- shape: {   "type": "string" }

Raw preview:

```text
"bash"
```

## Next decision

- If useful fields exist but the prior harness printed `[object Object]`, patch the audit/extraction layer first.
- If the schema is correct but command content is generic or missing risk warnings, patch command_explainer rules next.
- Keep lesson JSON and side-card JSON out of scope.

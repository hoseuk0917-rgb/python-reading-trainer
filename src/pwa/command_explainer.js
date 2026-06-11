// COMMAND_EXPLAINER_POWERSHELL_V277_A1
// COMMAND_EXPLAINER_VERSION_TEXT_V277_A1 20260611_v277_a1
(function() {
  const COMMAND_EXPLAINER_VERSION = "20260611_v277_a1";

  const POWERSHELL_SAMPLE_V277 = `Set-Location "D:\\projects\\python-reading-trainer"

if (Test-Path ".tmp") {
  Remove-Item ".tmp" -Recurse -Force
}

New-Item -ItemType Directory -Force -Path ".tmp" | Out-Null
Get-Content "src\\pwa\\app.js" -Raw -Encoding UTF8
python ".tmp\\script.py"
git status --short
git diff --check
git add src\\pwa\\app.js
git commit -m "Update app"
git tag quality-test
git push origin main --tags`;

  const POWERSHELL_RULES_V277 = [
    {
      id: "set_location",
      command: "Set-Location",
      group: "작업 위치",
      risk: "safe",
      pattern: /^\s*Set-Location\b/i,
      meaning: "작업 폴더를 이동합니다. 이후 명령은 이 폴더를 기준으로 실행됩니다.",
      fileImpact: "파일을 직접 바꾸지는 않지만, 뒤 명령의 기준 위치를 바꿉니다.",
      nextCheck: "Get-Location"
    },
    {
      id: "test_path",
      command: "Test-Path",
      group: "파일 확인",
      risk: "safe",
      pattern: /^\s*Test-Path\b/i,
      meaning: "파일이나 폴더가 존재하는지 확인합니다.",
      fileImpact: "읽기 전용 확인이라 파일을 수정하지 않습니다.",
      nextCheck: "Test-Path <확인할 경로>"
    },
    {
      id: "remove_item",
      command: "Remove-Item",
      group: "파일 삭제",
      risk: "danger",
      pattern: /^\s*Remove-Item\b/i,
      meaning: "파일이나 폴더를 삭제합니다.",
      fileImpact: "대상 파일/폴더가 사라질 수 있습니다. -Recurse는 하위 항목까지, -Force는 강제로 처리한다는 뜻입니다.",
      nextCheck: "Test-Path <삭제 대상 경로>"
    },
    {
      id: "new_item",
      command: "New-Item",
      group: "파일 생성",
      risk: "safe",
      pattern: /^\s*New-Item\b/i,
      meaning: "새 파일이나 폴더를 만듭니다.",
      fileImpact: "새 항목을 생성합니다. 이미 있으면 -Force 옵션에 따라 덮어쓰거나 유지될 수 있습니다.",
      nextCheck: "Test-Path <생성한 경로>"
    },
    {
      id: "get_content",
      command: "Get-Content",
      group: "파일 읽기",
      risk: "safe",
      pattern: /^\s*Get-Content\b/i,
      meaning: "파일 내용을 읽어서 출력합니다.",
      fileImpact: "파일을 읽기만 하며 보통 수정하지 않습니다.",
      nextCheck: "Get-Content <파일> -TotalCount 20"
    },
    {
      id: "set_content",
      command: "Set-Content",
      group: "파일 쓰기",
      risk: "caution",
      pattern: /^\s*Set-Content\b/i,
      meaning: "파일 내용을 새 값으로 씁니다.",
      fileImpact: "기존 파일 내용이 바뀌거나 새 파일이 만들어질 수 있습니다.",
      nextCheck: "git diff -- <파일>"
    },
    {
      id: "python",
      command: "python",
      group: "스크립트 실행",
      risk: "caution",
      pattern: /^\s*(?:&\s*)?python(?:\.exe)?\b/i,
      meaning: "Python 스크립트나 Python 명령을 실행합니다.",
      fileImpact: "실행하는 스크립트 내용에 따라 파일 생성/수정/삭제가 일어날 수 있습니다.",
      nextCheck: "스크립트 실행 후 git status --short"
    },
    {
      id: "git_status",
      command: "git status",
      group: "Git 확인",
      risk: "safe",
      pattern: /^\s*git\s+status\b/i,
      meaning: "Git 작업트리의 변경 상태를 확인합니다.",
      fileImpact: "확인 명령이라 파일을 직접 수정하지 않습니다.",
      nextCheck: "git status --short"
    },
    {
      id: "git_diff",
      command: "git diff",
      group: "Git 확인",
      risk: "safe",
      pattern: /^\s*git\s+diff\b/i,
      meaning: "Git에서 추적 중인 변경 내용을 비교해서 보여줍니다.",
      fileImpact: "확인 명령이라 파일을 직접 수정하지 않습니다.",
      nextCheck: "git diff --check"
    },
    {
      id: "git_add",
      command: "git add",
      group: "Git 반영 준비",
      risk: "caution",
      pattern: /^\s*git\s+add\b/i,
      meaning: "변경 파일을 다음 커밋에 포함되도록 스테이징합니다.",
      fileImpact: "파일 내용은 바꾸지 않지만 Git의 스테이징 상태가 바뀝니다.",
      nextCheck: "git status --short"
    },
    {
      id: "git_commit",
      command: "git commit",
      group: "Git 기록",
      risk: "caution",
      pattern: /^\s*git\s+commit\b/i,
      meaning: "스테이징된 변경을 로컬 Git 기록으로 저장합니다.",
      fileImpact: "작업트리 파일을 직접 바꾸지는 않지만, 로컬 커밋 기록이 생깁니다.",
      nextCheck: "git --no-pager log --oneline -3"
    },
    {
      id: "git_tag",
      command: "git tag",
      group: "Git 기록",
      risk: "caution",
      pattern: /^\s*git\s+tag\b/i,
      meaning: "현재 커밋에 이름표를 붙입니다.",
      fileImpact: "파일 내용은 바꾸지 않지만 Git 태그 기록이 생깁니다.",
      nextCheck: "git tag --list"
    },
    {
      id: "git_push",
      command: "git push",
      group: "Git 원격 반영",
      risk: "caution",
      pattern: /^\s*git\s+push\b/i,
      meaning: "로컬 커밋이나 태그를 GitHub 같은 원격 저장소로 보냅니다.",
      fileImpact: "로컬 파일은 직접 바꾸지 않지만 원격 저장소 상태가 바뀝니다.",
      nextCheck: "git status --short"
    },
    {
      id: "out_null",
      command: "Out-Null",
      group: "출력 제어",
      risk: "safe",
      pattern: /\|\s*Out-Null\b/i,
      meaning: "앞 명령의 출력 결과를 화면에 보이지 않게 버립니다.",
      fileImpact: "출력만 숨깁니다. 앞쪽 명령의 파일 영향은 그대로입니다.",
      nextCheck: "필요하면 Out-Null을 빼고 다시 실행해 출력 확인"
    }
  ];

  function escapeHtmlV277(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getCommandElV277(id) {
    return document.getElementById(id);
  }

  function getRiskLabelV277(risk) {
    if (risk === "danger") return "위험";
    if (risk === "caution") return "주의";
    if (risk === "unknown") return "미확인";
    return "안전";
  }

  function getRiskClassV277(risk) {
    if (risk === "danger") return "bad";
    if (risk === "caution") return "warn";
    if (risk === "unknown") return "muted";
    return "good";
  }

  function isPowerShellCommentV277(line) {
    return /^\s*#/.test(line);
  }

  function isPowerShellControlLineV277(line) {
    return /^\s*(if|else|elseif|for|foreach|while|switch)\b/i.test(line) ||
      /^\s*[{}]\s*$/.test(line) ||
      /^\s*}\s*(else|elseif)\b/i.test(line);
  }

  function buildControlStepV277(line, lineNumber) {
    return {
      line: lineNumber,
      command: "조건/블록",
      group: "흐름 제어",
      risk: "safe",
      raw: line,
      meaning: "조건문이나 블록 구조입니다. 중괄호 안의 명령이 조건에 따라 실행됩니다.",
      fileImpact: "이 줄 자체는 보통 파일을 바꾸지 않고, 안쪽 명령의 실행 여부를 결정합니다.",
      nextCheck: ""
    };
  }

  function classifyPowerShellLineV277(line, lineNumber) {
    const trimmed = String(line || "").trim();

    if (!trimmed) {
      return null;
    }

    if (isPowerShellCommentV277(trimmed)) {
      return {
        line: lineNumber,
        command: "주석",
        group: "메모",
        risk: "safe",
        raw: line,
        meaning: "실행되지 않는 설명 줄입니다.",
        fileImpact: "파일을 수정하지 않습니다.",
        nextCheck: ""
      };
    }

    if (isPowerShellControlLineV277(trimmed)) {
      return buildControlStepV277(line, lineNumber);
    }

    const primaryRule = POWERSHELL_RULES_V277.find(function(rule) {
      return rule.pattern.test(trimmed);
    });

    let rule = primaryRule;

    if (!rule) {
      const pipeRule = POWERSHELL_RULES_V277.find(function(item) {
        return item.id === "out_null" && item.pattern.test(trimmed);
      });

      if (pipeRule) {
        rule = pipeRule;
      }
    }

    if (!rule) {
      const first = trimmed.split(/\s+/)[0] || "알 수 없는 명령";
      return {
        line: lineNumber,
        command: first,
        group: "미분류",
        risk: "unknown",
        raw: line,
        meaning: "아직 V277 규칙에 없는 PowerShell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
        fileImpact: "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
        nextCheck: "명령 도움말 확인: Get-Help " + first
      };
    }

    let risk = rule.risk;
    let fileImpact = rule.fileImpact;

    if (rule.id === "remove_item") {
      if (/-Recurse\b/i.test(trimmed) || /-Force\b/i.test(trimmed)) {
        risk = "danger";
        fileImpact += " 현재 줄에는 -Recurse 또는 -Force가 있어 삭제 범위가 커질 수 있습니다.";
      }
    }

    if (rule.id !== "out_null" && /\|\s*Out-Null\b/i.test(trimmed)) {
      fileImpact += " 뒤의 `| Out-Null`은 실행 결과 출력만 숨깁니다.";
    }

    return {
      line: lineNumber,
      command: rule.command,
      group: rule.group,
      risk: risk,
      raw: line,
      meaning: rule.meaning,
      fileImpact: fileImpact,
      nextCheck: rule.nextCheck || ""
    };
  }

  function analyzePowerShellV277(source) {
    const lines = String(source || "").split(/\r?\n/);
    const steps = lines.map(function(line, index) {
      return classifyPowerShellLineV277(line, index + 1);
    }).filter(Boolean);

    const warnings = steps.filter(function(step) {
      return step.risk === "danger" || step.risk === "caution";
    });

    const dangerous = steps.filter(function(step) { return step.risk === "danger"; }).length;
    const caution = steps.filter(function(step) { return step.risk === "caution"; }).length;
    const safe = steps.filter(function(step) { return step.risk === "safe"; }).length;
    const unknown = steps.filter(function(step) { return step.risk === "unknown"; }).length;

    const nextChecks = Array.from(new Set(steps.map(function(step) {
      return step.nextCheck;
    }).filter(Boolean)));

    const groups = {};
    steps.forEach(function(step) {
      groups[step.group] = (groups[step.group] || 0) + 1;
    });

    return {
      version: COMMAND_EXPLAINER_VERSION,
      language: "powershell",
      steps: steps,
      warnings: warnings,
      summary: {
        total: steps.length,
        safe: safe,
        caution: caution,
        danger: dangerous,
        unknown: unknown,
        groups: groups,
        text: "PowerShell 명령 " + steps.length + "개를 작업 순서대로 분석했습니다. 위험 " + dangerous + "개, 주의 " + caution + "개, 미확인 " + unknown + "개입니다."
      },
      nextChecks: nextChecks
    };
  }

  function detectCommandLanguageV277(source) {
    const text = String(source || "");
    if (/Set-Location|Remove-Item|New-Item|Get-Content|Test-Path|\$env:|Out-Null/i.test(text)) {
      return "powershell";
    }
    if (/\brm\s+-rf\b|\bmkdir\s+-p\b|^\s*cd\s+/m.test(text)) {
      return "bash";
    }
    return "powershell";
  }

  function renderCommandSummaryV277(result) {
    const box = getCommandElV277("commandSummary");
    if (!box) return;

    box.className = "code-summary";
    box.innerHTML =
      '<div><strong>' + escapeHtmlV277(result.summary.text) + '</strong></div>' +
      '<div class="muted">그룹: ' + escapeHtmlV277(Object.keys(result.summary.groups).map(function(key) {
        return key + " " + result.summary.groups[key] + "개";
      }).join(" · ")) + '</div>';
  }

  function renderCommandWarningsV277(result) {
    const box = getCommandElV277("commandWarnings");
    if (!box) return;

    if (!result.warnings.length) {
      box.className = "code-warnings muted";
      box.textContent = "위험/주의 명령이 없습니다.";
      return;
    }

    box.className = "code-warnings";
    box.innerHTML = result.warnings.map(function(step) {
      return '<div class="code-warning-item ' + getRiskClassV277(step.risk) + '">' +
        '<strong>' + escapeHtmlV277(getRiskLabelV277(step.risk)) + ' · line ' + step.line + ' · ' + step.command + '</strong>' +
        '<div>' + escapeHtmlV277(step.fileImpact) + '</div>' +
      '</div>';
    }).join("");
  }

  function renderCommandStepsV277(result) {
    const box = getCommandElV277("commandSteps");
    if (!box) return;

    if (!result.steps.length) {
      box.innerHTML = '<p class="muted">분석할 명령어가 없습니다.</p>';
      return;
    }

    box.innerHTML = result.steps.map(function(step, index) {
      return '<div class="code-step command-step-v277">' +
        '<div class="code-step-title">' +
          '<span class="badge">' + (index + 1) + '</span> ' +
          '<strong>line ' + step.line + ' · ' + escapeHtmlV277(step.command) + '</strong> ' +
          '<span class="badge ' + getRiskClassV277(step.risk) + '">' + escapeHtmlV277(getRiskLabelV277(step.risk)) + '</span>' +
        '</div>' +
        '<pre class="code-block small-code">' + escapeHtmlV277(step.raw) + '</pre>' +
        '<div><strong>의미:</strong> ' + escapeHtmlV277(step.meaning) + '</div>' +
        '<div><strong>파일/ Git 영향:</strong> ' + escapeHtmlV277(step.fileImpact) + '</div>' +
      '</div>';
    }).join("");
  }

  function renderCommandNextChecksV277(result) {
    const box = getCommandElV277("commandNextChecks");
    if (!box) return;

    if (!result.nextChecks.length) {
      box.className = "code-related-cards muted";
      box.textContent = "추천 확인 명령이 없습니다.";
      return;
    }

    box.className = "code-related-cards";
    box.innerHTML = result.nextChecks.map(function(check) {
      return '<pre class="code-block small-code">' + escapeHtmlV277(check) + '</pre>';
    }).join("");
  }

  function renderCommandAnalysisV277(result) {
    renderCommandSummaryV277(result);
    renderCommandWarningsV277(result);
    renderCommandStepsV277(result);
    renderCommandNextChecksV277(result);
  }

  function analyzeCommandInputV277() {
    const input = getCommandElV277("commandInput");
    const shell = getCommandElV277("commandShellSelect");
    const source = input ? input.value : "";
    const selected = shell ? shell.value : "powershell";
    const detected = selected === "auto" ? detectCommandLanguageV277(source) : selected;

    if (detected !== "powershell") {
      renderCommandAnalysisV277({
        language: detected,
        steps: [],
        warnings: [{ line: 1, command: "Bash/Shell", risk: "caution", fileImpact: "Bash/Shell 해석은 V278에서 구현 예정입니다." }],
        summary: {
          total: 0,
          safe: 0,
          caution: 1,
          danger: 0,
          unknown: 0,
          groups: {},
          text: "Bash/Shell은 V278에서 별도 구현 예정입니다. V277은 PowerShell 1차 해석만 지원합니다."
        },
        nextChecks: []
      });
      return;
    }

    renderCommandAnalysisV277(analyzePowerShellV277(source));
  }

  function loadPowerShellSampleV277() {
    const input = getCommandElV277("commandInput");
    if (input) {
      input.value = POWERSHELL_SAMPLE_V277;
    }
    analyzeCommandInputV277();
  }

  function clearCommandInputV277() {
    const input = getCommandElV277("commandInput");
    if (input) {
      input.value = "";
    }

    const summary = getCommandElV277("commandSummary");
    const warnings = getCommandElV277("commandWarnings");
    const steps = getCommandElV277("commandSteps");
    const next = getCommandElV277("commandNextChecks");

    if (summary) {
      summary.className = "code-summary muted";
      summary.textContent = "아직 분석한 명령어가 없습니다.";
    }
    if (warnings) {
      warnings.className = "code-warnings muted";
      warnings.textContent = "위험 명령이 감지되면 여기에 표시됩니다.";
    }
    if (steps) steps.innerHTML = "";
    if (next) {
      next.className = "code-related-cards muted";
      next.textContent = "분석 후 추천 확인 명령이 표시됩니다.";
    }
  }

  function injectCommandExplainerStyleV277() {
    if (document.getElementById("commandExplainerStyleV277")) return;
    const style = document.createElement("style");
    style.id = "commandExplainerStyleV277";
    style.textContent = `
      .command-explainer-grid { align-items: start; }
      .command-step-v277 { margin-bottom: 12px; }
      .code-warning-item {
        border: 1px solid rgba(148, 163, 184, 0.4);
        border-radius: 12px;
        padding: 10px;
        margin-bottom: 8px;
        background: rgba(248, 250, 252, 0.8);
      }
      .code-warning-item.bad { border-color: rgba(239, 68, 68, 0.5); background: rgba(254, 242, 242, 0.9); }
      .code-warning-item.warn { border-color: rgba(245, 158, 11, 0.5); background: rgba(255, 251, 235, 0.9); }
      .badge.good { background: #dcfce7; color: #166534; }
      .badge.warn { background: #fef3c7; color: #92400e; }
      .badge.bad { background: #fee2e2; color: #991b1b; }
    `;
    document.head.appendChild(style);
  }

  function initCommandExplainerV277() {
    injectCommandExplainerStyleV277();

    const version = getCommandElV277("commandExplainerVersion");
    if (version) {
      version.textContent = "V277";
    }

    const analyzeBtn = getCommandElV277("analyzeCommandBtn");
    const sampleBtn = getCommandElV277("loadCommandSampleBtn");
    const clearBtn = getCommandElV277("clearCommandBtn");

    if (analyzeBtn) analyzeBtn.onclick = analyzeCommandInputV277;
    if (sampleBtn) sampleBtn.onclick = loadPowerShellSampleV277;
    if (clearBtn) clearBtn.onclick = clearCommandInputV277;
  }

  function refreshCommandExplainerV277() {
    const version = getCommandElV277("commandExplainerVersion");
    if (version) {
      version.textContent = "V277";
    }
  }

  window.CommandExplainer = {
    version: COMMAND_EXPLAINER_VERSION,
    samplePowerShellV277: POWERSHELL_SAMPLE_V277,
    analyzePowerShellV277: analyzePowerShellV277,
    classifyPowerShellLineV277: classifyPowerShellLineV277,
    detectCommandLanguageV277: detectCommandLanguageV277,
    renderV277: renderCommandAnalysisV277,
    init: initCommandExplainerV277,
    refresh: refreshCommandExplainerV277
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCommandExplainerV277);
  } else {
    initCommandExplainerV277();
  }
})();

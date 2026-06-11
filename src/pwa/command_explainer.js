// COMMAND_EXPLAINER_POWERSHELL_V277_A1
// COMMAND_EXPLAINER_BASH_V278_A1
// COMMAND_EXPLAINER_UI_USABILITY_AUDIT_V280_A1
// COMMAND_EXPLAINER_BEGINNER_TERMS_V281_A1
// COMMAND_EXPLAINER_GIT_FLOW_WORDING_V282_A1
// COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_V283_A1
// COMMAND_EXPLAINER_MOBILE_COMPACT_AUDIT_V284_A1
// COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1
// COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_V286_A1
// COMMAND_EXPLAINER_DANGER_COLLAPSE_V287_A1
// COMMAND_EXPLAINER_VERSION_TEXT_V287_A1 20260611_v287_a1
(function() {
  const COMMAND_EXPLAINER_VERSION = "20260611_v287_a1";

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


  const BASH_SAMPLE_V278 = `cd ~/python-reading-trainer

if [ -d ".tmp" ]; then
  rm -rf ".tmp"
fi

mkdir -p .tmp
cat src/pwa/app.js
grep "APP_DATA_VERSION" src/pwa/app.js
chmod +x tools/run.sh
sudo apt update
python3 .tmp/script.py
git status --short
git diff --check
git add src/pwa/app.js
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


  const BASH_RULES_V278 = [
    {
      id: "cd",
      command: "cd",
      group: "작업 위치",
      risk: "safe",
      pattern: /^\s*cd\b/i,
      meaning: "작업 폴더를 이동합니다. 이후 명령은 이 폴더를 기준으로 실행됩니다.",
      fileImpact: "파일을 직접 바꾸지는 않지만, 뒤 명령의 기준 위치를 바꿉니다.",
      nextCheck: "pwd"
    },
    {
      id: "rm_rf",
      command: "rm -rf",
      group: "파일 삭제",
      risk: "danger",
      pattern: /^\s*rm\s+.*(?:-rf|-fr|-r\s+-f|-f\s+-r)\b/i,
      meaning: "파일이나 폴더를 강제로 삭제합니다.",
      fileImpact: "대상 파일/폴더가 사라질 수 있습니다. -r은 하위 폴더까지, -f는 확인 없이 강제로 처리한다는 뜻입니다.",
      nextCheck: "test -e <삭제 대상 경로>; echo $?"
    },
    {
      id: "mkdir",
      command: "mkdir",
      group: "파일 생성",
      risk: "safe",
      pattern: /^\s*mkdir\b/i,
      meaning: "새 폴더를 만듭니다.",
      fileImpact: "새 폴더를 생성합니다. -p는 중간 폴더가 없어도 같이 만들고, 이미 있으면 오류를 줄입니다.",
      nextCheck: "test -d <생성한 폴더>; echo $?"
    },
    {
      id: "cat",
      command: "cat",
      group: "파일 읽기",
      risk: "safe",
      pattern: /^\s*cat\b/i,
      meaning: "파일 내용을 터미널에 출력합니다.",
      fileImpact: "파일을 읽기만 하며 보통 수정하지 않습니다.",
      nextCheck: "head -n 20 <파일>"
    },
    {
      id: "grep",
      command: "grep",
      group: "텍스트 검색",
      risk: "safe",
      pattern: /^\s*grep\b/i,
      meaning: "파일이나 출력 내용에서 특정 문자열을 찾습니다.",
      fileImpact: "검색 명령이라 보통 파일을 수정하지 않습니다.",
      nextCheck: "grep -n <검색어> <파일>"
    },
    {
      id: "chmod",
      command: "chmod",
      group: "권한 변경",
      risk: "caution",
      pattern: /^\s*chmod\b/i,
      meaning: "파일의 실행/읽기/쓰기 권한을 바꿉니다.",
      fileImpact: "파일 내용은 바꾸지 않지만, 실행 가능 여부 같은 권한 상태가 바뀝니다.",
      nextCheck: "ls -l <파일>"
    },
    {
      id: "sudo",
      command: "sudo",
      group: "관리자 권한",
      risk: "danger",
      pattern: /^\s*sudo\b/i,
      meaning: "관리자 권한으로 명령을 실행합니다.",
      fileImpact: "시스템 파일, 패키지, 권한 상태가 바뀔 수 있으므로 실행 전 명령 의미를 반드시 확인해야 합니다.",
      nextCheck: "실행 전 명령 도움말 확인: <명령> --help"
    },
    {
      id: "python3",
      command: "python3",
      group: "스크립트 실행",
      risk: "caution",
      pattern: /^\s*python3\b/i,
      meaning: "Python 3 스크립트나 Python 명령을 실행합니다.",
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
    }
  ];



  const COMMAND_BEGINNER_TERMS_V281 = {
    staging: "스테이징은 커밋하기 전에 '이번 기록에 넣을 파일'을 고르는 준비 단계입니다.",
    commit: "커밋은 현재 변경사항을 Git 안에 하나의 저장 기록으로 남기는 일입니다.",
    tag: "태그는 특정 커밋에 버전 이름표를 붙여 나중에 쉽게 찾게 하는 표시입니다.",
    remote: "원격 저장소는 내 컴퓨터 밖의 GitHub 저장소처럼 팀이나 배포용으로 쓰는 저장 위치입니다.",
    admin: "관리자 권한은 일반 사용자보다 더 강한 권한이라 시스템 설정이나 중요한 파일도 바꿀 수 있습니다.",
    forceDelete: "강제 삭제는 확인을 줄이고 바로 지우는 방식이라 경로를 잘못 쓰면 복구가 어려울 수 있습니다.",
    executePermission: "실행 권한은 파일을 프로그램처럼 실행할 수 있게 허용하는 설정입니다.",
    workingDirectory: "작업 폴더는 현재 명령이 기준으로 삼는 위치입니다. 상대경로는 이 위치를 기준으로 해석됩니다.",
    scriptRun: "스크립트 실행은 파일 안의 여러 명령을 한 번에 실행하는 것이어서, 내부 내용을 먼저 확인하는 편이 안전합니다."
  };

  function buildCommandBeginnerNoteV281(step) {
    if (!step || !step.command) {
      return "";
    }

    const command = String(step.command || "");
    const group = String(step.group || "");
    const risk = String(step.risk || "");
    const notes = [];

    if (command === "Set-Location" || command === "cd") {
      notes.push(COMMAND_BEGINNER_TERMS_V281.workingDirectory);
    }

    if (command === "Remove-Item" || command === "rm -rf") {
      notes.push(COMMAND_BEGINNER_TERMS_V281.forceDelete);
    }

    if (command === "chmod") {
      notes.push(COMMAND_BEGINNER_TERMS_V281.executePermission);
    }

    if (command === "sudo") {
      notes.push(COMMAND_BEGINNER_TERMS_V281.admin);
    }

    if (command === "python" || command === "python3") {
      notes.push(COMMAND_BEGINNER_TERMS_V281.scriptRun);
    }

    if (command === "git add") {
      notes.push(COMMAND_BEGINNER_TERMS_V281.staging);
    }

    if (command === "git commit") {
      notes.push(COMMAND_BEGINNER_TERMS_V281.commit);
    }

    if (command === "git tag") {
      notes.push(COMMAND_BEGINNER_TERMS_V281.tag);
    }

    if (command === "git push") {
      notes.push(COMMAND_BEGINNER_TERMS_V281.remote);
    }

    if (group === "관리자 권한" && !notes.includes(COMMAND_BEGINNER_TERMS_V281.admin)) {
      notes.push(COMMAND_BEGINNER_TERMS_V281.admin);
    }

    if (risk === "danger" && !notes.some(function(note) { return note.includes("복구"); })) {
      notes.push("위험 명령은 실행 전에 대상 경로와 옵션을 한 번 더 확인해야 합니다.");
    }

    return Array.from(new Set(notes)).join(" ");
  }

  function enhanceCommandStepForBeginnersV281(step) {
    const beginnerNote = buildCommandBeginnerNoteV281(step);
    if (!beginnerNote) {
      return step;
    }

    return Object.assign({}, step, {
      beginnerNote: beginnerNote
    });
  }

  function enhanceCommandResultForBeginnersV281(result) {
    const steps = (result && Array.isArray(result.steps) ? result.steps : []).map(enhanceCommandStepForBeginnersV281);
    const warnings = steps.filter(function(step) {
      return step.risk === "danger" || step.risk === "caution";
    });

    return Object.assign({}, result, {
      steps: steps,
      warnings: warnings,
      beginnerGlossary: COMMAND_BEGINNER_TERMS_V281
    });
  }



  const COMMAND_GIT_FLOW_WORDING_V282 = {
    "git status": {
      label: "상태 확인",
      note: "현재 어떤 파일이 바뀌었는지 먼저 확인하는 단계입니다."
    },
    "git diff": {
      label: "변경 비교",
      note: "저장하기 전에 실제로 무엇이 바뀌었는지 비교해 보는 단계입니다."
    },
    "git add": {
      label: "준비",
      note: "이번 저장 기록에 넣을 변경 파일을 고르는 단계입니다."
    },
    "git commit": {
      label: "저장",
      note: "준비된 변경사항을 내 컴퓨터 Git 기록에 저장하는 단계입니다."
    },
    "git tag": {
      label: "이름표",
      note: "중요한 저장 기록에 버전 이름표를 붙이는 단계입니다."
    },
    "git push": {
      label: "업로드",
      note: "내 컴퓨터에 저장된 커밋이나 태그를 GitHub 같은 원격 저장소로 올리는 단계입니다."
    }
  };

  function buildCommandGitFlowNoteV282(step) {
    if (!step || !step.command) {
      return null;
    }

    const flow = COMMAND_GIT_FLOW_WORDING_V282[String(step.command || "")];
    if (!flow) {
      return null;
    }

    return {
      label: flow.label,
      note: flow.note
    };
  }

  function enhanceCommandStepGitFlowWordingV282(step) {
    const flow = buildCommandGitFlowNoteV282(step);
    if (!flow) {
      return step;
    }

    return Object.assign({}, step, {
      gitFlowLabelV282: flow.label,
      gitFlowNoteV282: flow.note
    });
  }

  function enhanceCommandResultGitFlowWordingV282(result) {
    const steps = (result && Array.isArray(result.steps) ? result.steps : []).map(enhanceCommandStepGitFlowWordingV282);
    const warnings = steps.filter(function(step) {
      return step.risk === "danger" || step.risk === "caution";
    });

    return Object.assign({}, result, {
      steps: steps,
      warnings: warnings,
      gitFlowWording: COMMAND_GIT_FLOW_WORDING_V282
    });
  }


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


  function isBashCommentV278(line) {
    return /^\s*#/.test(line);
  }

  function isBashControlLineV278(line) {
    return /^\s*(if|then|else|elif|fi|for|while|do|done|case|esac)\b/i.test(line) ||
      /^\s*\[\s+.+\s+\]\s*;?\s*(then)?\s*$/i.test(line);
  }

  function buildBashControlStepV278(line, lineNumber) {
    return {
      line: lineNumber,
      command: "조건/블록",
      group: "흐름 제어",
      risk: "safe",
      raw: line,
      meaning: "Bash 조건문이나 반복문 구조입니다. 조건에 따라 안쪽 명령이 실행됩니다.",
      fileImpact: "이 줄 자체는 보통 파일을 바꾸지 않고, 안쪽 명령의 실행 여부를 결정합니다.",
      nextCheck: ""
    };
  }

  function classifyBashLineV278(line, lineNumber) {
    const trimmed = String(line || "").trim();

    if (!trimmed) {
      return null;
    }

    if (isBashCommentV278(trimmed)) {
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

    if (isBashControlLineV278(trimmed)) {
      return buildBashControlStepV278(line, lineNumber);
    }

    const rule = BASH_RULES_V278.find(function(item) {
      return item.pattern.test(trimmed);
    });

    if (!rule) {
      const first = trimmed.split(/\s+/)[0] || "알 수 없는 명령";
      return {
        line: lineNumber,
        command: first,
        group: "미분류",
        risk: "unknown",
        raw: line,
        meaning: "아직 V278 규칙에 없는 Bash/Shell 명령입니다. 명령 이름과 옵션을 따로 확인해야 합니다.",
        fileImpact: "파일을 바꾸는지 확실하지 않으므로 실행 전 의미를 확인해야 합니다.",
        nextCheck: "명령 도움말 확인: " + first + " --help"
      };
    }

    let risk = rule.risk;
    let fileImpact = rule.fileImpact;

    if (rule.id === "rm_rf") {
      risk = "danger";
      fileImpact += " 현재 줄은 rm 계열 삭제 명령이라 실행 전 경로를 반드시 확인해야 합니다.";
    }

    if (rule.id === "sudo") {
      risk = "danger";
      fileImpact += " sudo는 관리자 권한으로 실행되므로 시스템 변경 가능성이 큽니다.";
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

  function analyzeBashV278(source) {
    const lines = String(source || "").split(/\r?\n/);
    const steps = lines.map(function(line, index) {
      return classifyBashLineV278(line, index + 1);
    }).filter(Boolean);

    const warnings = steps.filter(function(step) {
      return step.risk === "danger" || step.risk === "caution";
    });

    const danger = steps.filter(function(step) { return step.risk === "danger"; }).length;
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
      language: "bash",
      steps: steps,
      warnings: warnings,
      summary: {
        total: steps.length,
        safe: safe,
        caution: caution,
        danger: danger,
        unknown: unknown,
        groups: groups,
        text: "Bash/Shell 명령 " + steps.length + "개를 작업 순서대로 분석했습니다. 위험 " + danger + "개, 주의 " + caution + "개, 미확인 " + unknown + "개입니다."
      },
      nextChecks: nextChecks
    };
  }


  function detectCommandLanguageV277(source) {
    const text = String(source || "");
    if (/Set-Location|Remove-Item|New-Item|Get-Content|Test-Path|\$env:|Out-Null/i.test(text)) {
      return "powershell";
    }
    if (/\brm\s+.*(?:-rf|-fr|-r\s+-f|-f\s+-r)\b|\bmkdir\s+-p\b|^\s*cd\s+|\bchmod\b|\bsudo\b|\bpython3\b|\bgrep\b|\bcat\b/m.test(text)) {
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


  function renderCommandExtraNotesV283(step) {
    if (!step) {
      return "";
    }

    const notes = [];
    const summaryParts = [];

    if (step.gitFlowNoteV282) {
      if (step.gitFlowLabelV282) {
        summaryParts.push("Git: " + step.gitFlowLabelV282);
      } else {
        summaryParts.push("Git 흐름");
      }

      notes.push(
        '<div class="git-flow-note-v282"><strong>Git 흐름:</strong> <span class="git-flow-label-v282">' +
        escapeHtmlV277(step.gitFlowLabelV282 || "흐름") +
        '</span> — ' +
        escapeHtmlV277(step.gitFlowNoteV282) +
        '</div>'
      );
    }

    if (step.beginnerNote) {
      summaryParts.push("초보자 메모");
      notes.push(
        '<div class="beginner-note-v281"><strong>초보자 메모:</strong> ' +
        escapeHtmlV277(step.beginnerNote) +
        '</div>'
      );
    }

    if (!notes.length) {
      return "";
    }

    return (
      '<details class="command-extra-note-v283">' +
      '<summary>' + escapeHtmlV277(summaryParts.join(" / ") || "추가 설명 보기") + '</summary>' +
      '<div class="command-extra-note-body-v283">' + notes.join("") + '</div>' +
      '</details>'
    );
  }



  const COMMAND_ACTION_GUIDE_ORDER_V285 = [
    {
      command: "git status",
      label: "확인",
      action: "현재 어떤 파일이 바뀌었는지 먼저 확인합니다."
    },
    {
      command: "git diff",
      label: "비교",
      action: "저장하기 전에 실제 변경 내용을 비교합니다."
    },
    {
      command: "git add",
      label: "준비",
      action: "이번 저장 기록에 넣을 파일을 고릅니다."
    },
    {
      command: "git commit",
      label: "저장",
      action: "준비한 변경사항을 내 컴퓨터 Git 기록에 저장합니다."
    },
    {
      command: "git push",
      label: "업로드",
      action: "저장한 기록을 GitHub 같은 원격 저장소로 올립니다."
    }
  ];

  function buildCommandActionGuideV285(result) {
    const steps = result && Array.isArray(result.steps) ? result.steps : [];
    const presentCommands = new Set(steps.map(function(step) {
      return step.command;
    }));

    const items = COMMAND_ACTION_GUIDE_ORDER_V285.filter(function(item) {
      return presentCommands.has(item.command);
    });

    return {
      items: items,
      flowText: items.map(function(item) { return item.label; }).join(" → ")
    };
  }

  function renderCommandActionGuideV285(result) {
    const guide = buildCommandActionGuideV285(result);

    if (!guide.items.length) {
      return "";
    }

    return (
      '<div class="command-action-guide-v285">' +
        '<div class="command-action-guide-title-v285">다음 실행 흐름: ' + escapeHtmlV277(guide.flowText) + '</div>' +
        '<div class="command-action-guide-items-v285">' +
          guide.items.map(function(item, index) {
            return (
              '<div class="command-action-guide-item-v285">' +
                '<span class="badge">' + (index + 1) + '</span>' +
                '<strong>' + escapeHtmlV277(item.label) + '</strong>' +
                '<code>' + escapeHtmlV277(item.command) + '</code>' +
                '<span>' + escapeHtmlV277(item.action) + '</span>' +
              '</div>'
            );
          }).join("") +
        '</div>' +
      '</div>'
    );
  }



  const COMMAND_DANGER_FLOW_STEPS_V286 = [
    {
      label: "대상 확인",
      action: "삭제하거나 되돌릴 경로/브랜치/파일 이름이 맞는지 먼저 확인합니다."
    },
    {
      label: "백업 확인",
      action: "되돌릴 수 없는 작업이면 커밋, 복사본, 백업, 원격 저장 상태를 먼저 확인합니다."
    },
    {
      label: "실행",
      action: "명령 의미와 옵션을 이해한 뒤 필요한 경우에만 실행합니다."
    },
    {
      label: "결과 확인",
      action: "실행 후 파일 존재 여부, git status, 로그를 확인합니다."
    }
  ];

  function isDangerRawCommandV286(raw) {
    const text = String(raw || "");
    return /Remove-Item\b/i.test(text) ||
      /\brm\s+.*(?:-rf|-fr|-r\s+-f|-f\s+-r)\b/i.test(text) ||
      /\bsudo\b/i.test(text) ||
      /\bgit\s+reset\s+--hard\b/i.test(text) ||
      /\bgit\s+clean\s+.*(?:-fd|-df|-f\s+-d|-d\s+-f)\b/i.test(text);
  }

  function getDangerReasonV286(step) {
    const command = String(step && step.command || "");
    const raw = String(step && step.raw || "");

    if (command === "Remove-Item" || /Remove-Item\b/i.test(raw)) {
      return "파일/폴더 삭제 명령입니다. -Recurse 또는 -Force가 있으면 삭제 범위가 커질 수 있습니다.";
    }

    if (command === "rm -rf" || /\brm\s+.*(?:-rf|-fr|-r\s+-f|-f\s+-r)\b/i.test(raw)) {
      return "강제 삭제 명령입니다. 경로를 잘못 쓰면 복구가 어려울 수 있습니다.";
    }

    if (command === "sudo" || /\bsudo\b/i.test(raw)) {
      return "관리자 권한 명령입니다. 시스템 설정이나 중요한 파일이 바뀔 수 있습니다.";
    }

    if (/\bgit\s+reset\s+--hard\b/i.test(raw)) {
      return "Git 변경사항을 강제로 되돌릴 수 있는 명령입니다. 커밋되지 않은 작업이 사라질 수 있습니다.";
    }

    if (/\bgit\s+clean\s+.*(?:-fd|-df|-f\s+-d|-d\s+-f)\b/i.test(raw)) {
      return "Git이 추적하지 않는 파일/폴더를 삭제할 수 있는 명령입니다.";
    }

    if (step && step.risk === "danger") {
      return "위험 명령으로 분류되었습니다. 실행 전 대상과 옵션을 다시 확인해야 합니다.";
    }

    return "";
  }

  function buildCommandDangerGuideV286(result) {
    const steps = result && Array.isArray(result.steps) ? result.steps : [];
    const items = steps.filter(function(step) {
      return step && (step.risk === "danger" || isDangerRawCommandV286(step.raw));
    }).map(function(step) {
      return Object.assign({}, step, {
        dangerReasonV286: getDangerReasonV286(step)
      });
    });

    return {
      items: items,
      flowText: COMMAND_DANGER_FLOW_STEPS_V286.map(function(item) { return item.label; }).join(" → ")
    };
  }

  function renderCommandDangerGuideV286(result) {
    const guide = buildCommandDangerGuideV286(result);

    if (!guide.items.length) {
      return "";
    }

    return (
      '<div class="command-danger-guide-v286">' +
        '<div class="command-danger-guide-title-v286">위험 명령 실행 전 확인: ' + escapeHtmlV277(guide.flowText) + '</div>' +
        '<div class="command-danger-guide-flow-v286">' +
          COMMAND_DANGER_FLOW_STEPS_V286.map(function(item, index) {
            return (
              '<div class="command-danger-guide-flow-item-v286">' +
                '<span class="badge bad">' + (index + 1) + '</span>' +
                '<strong>' + escapeHtmlV277(item.label) + '</strong>' +
                '<span>' + escapeHtmlV277(item.action) + '</span>' +
              '</div>'
            );
          }).join("") +
        '</div>' +
        '<div class="command-danger-guide-targets-v286">' +
          guide.items.map(function(step) {
            return (
              '<div class="command-danger-guide-target-v286">' +
                '<strong>line ' + escapeHtmlV277(step.line) + ' · ' + escapeHtmlV277(step.command) + '</strong>' +
                '<pre class="code-block small-code">' + escapeHtmlV277(step.raw) + '</pre>' +
                '<div>' + escapeHtmlV277(step.dangerReasonV286 || "실행 전 확인이 필요한 명령입니다.") + '</div>' +
              '</div>'
            );
          }).join("") +
        '</div>' +
      '</div>'
    );
  }



  function renderCommandDangerGuideV287(result) {
    const guide = buildCommandDangerGuideV286(result);

    if (!guide.items.length) {
      return "";
    }

    const summaryText = "위험 명령 " + guide.items.length + "개 감지";

    return (
      '<details class="command-danger-guide-v286 command-danger-guide-collapsible-v287">' +
        '<summary>' +
          '<span class="command-danger-summary-title-v287">' + escapeHtmlV277(summaryText) + '</span>' +
          '<span class="command-danger-summary-flow-v287">' + escapeHtmlV277(guide.flowText) + '</span>' +
        '</summary>' +
        '<div class="command-danger-guide-expanded-v287">' +
          '<div class="command-danger-guide-title-v286">실행 전 확인 흐름: ' + escapeHtmlV277(guide.flowText) + '</div>' +
          '<div class="command-danger-guide-flow-v286">' +
            COMMAND_DANGER_FLOW_STEPS_V286.map(function(item, index) {
              return (
                '<div class="command-danger-guide-flow-item-v286">' +
                  '<span class="badge bad">' + (index + 1) + '</span>' +
                  '<strong>' + escapeHtmlV277(item.label) + '</strong>' +
                  '<span>' + escapeHtmlV277(item.action) + '</span>' +
                '</div>'
              );
            }).join("") +
          '</div>' +
          '<div class="command-danger-guide-targets-v286">' +
            guide.items.map(function(step) {
              return (
                '<div class="command-danger-guide-target-v286">' +
                  '<strong>line ' + escapeHtmlV277(step.line) + ' · ' + escapeHtmlV277(step.command) + '</strong>' +
                  '<pre class="code-block small-code">' + escapeHtmlV277(step.raw) + '</pre>' +
                  '<div>' + escapeHtmlV277(step.dangerReasonV286 || "실행 전 확인이 필요한 명령입니다.") + '</div>' +
                '</div>'
              );
            }).join("") +
          '</div>' +
        '</div>' +
      '</details>'
    );
  }


  function renderCommandStepsV277(result) {
    const box = getCommandElV277("commandSteps");
    if (!box) return;

    if (!result.steps.length) {
      box.innerHTML = '<p class="muted">분석할 명령어가 없습니다.</p>';
      return;
    }

    const dangerGuideHtmlV286 = renderCommandDangerGuideV287(result);
    const actionGuideHtmlV285 = renderCommandActionGuideV285(result);

    box.innerHTML = dangerGuideHtmlV286 + actionGuideHtmlV285 + result.steps.map(function(step, index) {
      return '<div class="code-step command-step-v277">' +
        '<div class="code-step-title">' +
          '<span class="badge">' + (index + 1) + '</span> ' +
          '<strong>line ' + step.line + ' · ' + escapeHtmlV277(step.command) + '</strong> ' +
          '<span class="badge ' + getRiskClassV277(step.risk) + '">' + escapeHtmlV277(getRiskLabelV277(step.risk)) + '</span>' +
        '</div>' +
        '<pre class="code-block small-code">' + escapeHtmlV277(step.raw) + '</pre>' +
        '<div><strong>의미:</strong> ' + escapeHtmlV277(step.meaning) + '</div>' +
        '<div><strong>파일/ Git 영향:</strong> ' + escapeHtmlV277(step.fileImpact) + '</div>' +
        renderCommandExtraNotesV283(step) +
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
    const beginnerResult = enhanceCommandResultForBeginnersV281(result);
    const flowResult = enhanceCommandResultGitFlowWordingV282(beginnerResult);
    renderCommandSummaryV277(flowResult);
    renderCommandWarningsV277(flowResult);
    renderCommandStepsV277(flowResult);
    renderCommandNextChecksV277(flowResult);
  }

  function analyzeCommandInputV277() {
    const input = getCommandElV277("commandInput");
    const shell = getCommandElV277("commandShellSelect");
    const source = input ? input.value : "";
    const selected = shell ? shell.value : "powershell";
    const detected = selected === "auto" ? detectCommandLanguageV277(source) : selected;

    if (detected === "bash") {
      renderCommandAnalysisV277(analyzeBashV278(source));
      return;
    }

    if (detected !== "powershell") {
      renderCommandAnalysisV277({
        language: detected,
        steps: [],
        warnings: [{ line: 1, command: "미지원 셸", risk: "caution", fileImpact: "현재 V278은 PowerShell과 Bash/Shell 1차 해석만 지원합니다." }],
        summary: {
          total: 0,
          safe: 0,
          caution: 1,
          danger: 0,
          unknown: 0,
          groups: {},
          text: "지원하지 않는 셸입니다. PowerShell 또는 Bash/Shell을 선택해 주세요."
        },
        nextChecks: []
      });
      return;
    }

    renderCommandAnalysisV277(analyzePowerShellV277(source));
  }

  function loadPowerShellSampleV277() {
    const input = getCommandElV277("commandInput");
    const shell = getCommandElV277("commandShellSelect");
    if (input) {
      input.value = shell && shell.value === "bash" ? BASH_SAMPLE_V278 : POWERSHELL_SAMPLE_V277;
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
      .beginner-note-v281 {
        margin-top: 8px;
        padding: 8px 10px;
        border-radius: 10px;
        background: rgba(239, 246, 255, 0.9);
        border: 1px solid rgba(59, 130, 246, 0.25);
      }
      .git-flow-note-v282 {
        margin-top: 8px;
        padding: 8px 10px;
        border-radius: 10px;
        background: rgba(240, 253, 244, 0.9);
        border: 1px solid rgba(34, 197, 94, 0.25);
      }
      .git-flow-label-v282 {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 999px;
        background: rgba(22, 163, 74, 0.12);
        font-weight: 800;
      }
      .command-extra-note-v283 {
        margin-top: 8px;
        padding: 8px 10px;
        border-radius: 10px;
        background: rgba(248, 250, 252, 0.92);
        border: 1px solid rgba(148, 163, 184, 0.35);
      }
      .command-extra-note-v283 summary {
        cursor: pointer;
        font-weight: 800;
        color: #166534;
        min-height: 34px;
        display: flex;
        align-items: center;
        line-height: 1.45;
        overflow-wrap: anywhere;
      }
      .command-extra-note-v283 summary:focus-visible {
        outline: 3px solid rgba(34, 197, 94, 0.35);
        outline-offset: 3px;
        border-radius: 8px;
      }
      .command-extra-note-body-v283 {
        margin-top: 8px;
      }
      .command-action-guide-v285 {
        margin: 0 0 14px 0;
        padding: 12px;
        border-radius: 14px;
        background: rgba(240, 249, 255, 0.92);
        border: 1px solid rgba(14, 165, 233, 0.25);
      }
      .command-action-guide-title-v285 {
        font-weight: 900;
        margin-bottom: 10px;
        color: #075985;
      }
      .command-action-guide-items-v285 {
        display: grid;
        gap: 8px;
      }
      .command-action-guide-item-v285 {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        line-height: 1.5;
      }
      .command-action-guide-item-v285 code {
        padding: 2px 6px;
        border-radius: 8px;
        background: rgba(15, 23, 42, 0.06);
      }
      .command-danger-guide-v286 {
        margin: 0 0 14px 0;
        padding: 12px;
        border-radius: 14px;
        background: rgba(254, 242, 242, 0.94);
        border: 1px solid rgba(239, 68, 68, 0.3);
      }
      .command-danger-guide-title-v286 {
        font-weight: 900;
        margin-bottom: 10px;
        color: #991b1b;
      }
      .command-danger-guide-flow-v286,
      .command-danger-guide-targets-v286 {
        display: grid;
        gap: 8px;
      }
      .command-danger-guide-flow-v286 {
        margin-bottom: 10px;
      }
      .command-danger-guide-flow-item-v286 {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        line-height: 1.5;
      }
      .command-danger-guide-target-v286 {
        padding: 10px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.75);
        border: 1px solid rgba(239, 68, 68, 0.18);
      }
      .command-danger-guide-collapsible-v287 {
        padding: 0;
        overflow: hidden;
      }
      .command-danger-guide-collapsible-v287 summary {
        cursor: pointer;
        min-height: 44px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        line-height: 1.45;
        color: #991b1b;
        font-weight: 900;
        overflow-wrap: anywhere;
      }
      .command-danger-guide-collapsible-v287 summary:focus-visible {
        outline: 3px solid rgba(239, 68, 68, 0.28);
        outline-offset: 3px;
        border-radius: 10px;
      }
      .command-danger-summary-flow-v287 {
        font-weight: 700;
        color: #7f1d1d;
        opacity: 0.86;
      }
      .command-danger-guide-expanded-v287 {
        padding: 0 12px 12px 12px;
      }
      @media (max-width: 640px) {
        .command-extra-note-v283 {
          padding: 10px 10px;
        }
        .command-extra-note-v283 summary {
          min-height: 42px;
          font-size: 0.94rem;
        }
        .beginner-note-v281,
        .git-flow-note-v282 {
          padding: 9px 10px;
          line-height: 1.55;
        }
        .git-flow-label-v282 {
          margin-right: 2px;
        }
        .command-action-guide-v285 {
          padding: 10px;
        }
        .command-action-guide-item-v285 {
          align-items: flex-start;
        }
        .command-action-guide-item-v285 span:last-child {
          flex-basis: 100%;
          margin-left: 32px;
        }
        .command-danger-guide-v286 {
          padding: 10px;
        }
        .command-danger-guide-flow-item-v286 {
          align-items: flex-start;
        }
        .command-danger-guide-flow-item-v286 span:last-child {
          flex-basis: 100%;
          margin-left: 32px;
        }
        .command-danger-guide-collapsible-v287 summary {
          min-height: 46px;
          padding: 12px 10px;
          align-items: flex-start;
        }
        .command-danger-summary-flow-v287 {
          flex-basis: 100%;
        }
        .command-danger-guide-expanded-v287 {
          padding: 0 10px 10px 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function initCommandExplainerV277() {
    injectCommandExplainerStyleV277();

    const version = getCommandElV277("commandExplainerVersion");
    if (version) {
      version.textContent = "V278";
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
      version.textContent = "V278";
    }
  }

  window.CommandExplainer = {
    version: COMMAND_EXPLAINER_VERSION,
    samplePowerShellV277: POWERSHELL_SAMPLE_V277,
    sampleBashV278: BASH_SAMPLE_V278,
    beginnerTermsV281: COMMAND_BEGINNER_TERMS_V281,
    enhanceResultForBeginnersV281: enhanceCommandResultForBeginnersV281,
    enhanceStepForBeginnersV281: enhanceCommandStepForBeginnersV281,
    gitFlowWordingV282: COMMAND_GIT_FLOW_WORDING_V282,
    enhanceResultGitFlowWordingV282: enhanceCommandResultGitFlowWordingV282,
    enhanceStepGitFlowWordingV282: enhanceCommandStepGitFlowWordingV282,
    renderExtraNotesV283: renderCommandExtraNotesV283,
    actionGuideOrderV285: COMMAND_ACTION_GUIDE_ORDER_V285,
    buildActionGuideV285: buildCommandActionGuideV285,
    renderActionGuideV285: renderCommandActionGuideV285,
    dangerFlowStepsV286: COMMAND_DANGER_FLOW_STEPS_V286,
    buildDangerGuideV286: buildCommandDangerGuideV286,
    renderDangerGuideV286: renderCommandDangerGuideV286,
    renderDangerGuideV287: renderCommandDangerGuideV287,
    isDangerRawCommandV286: isDangerRawCommandV286,
    analyzePowerShellV277: analyzePowerShellV277,
    analyzeBashV278: analyzeBashV278,
    classifyPowerShellLineV277: classifyPowerShellLineV277,
    classifyBashLineV278: classifyBashLineV278,
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

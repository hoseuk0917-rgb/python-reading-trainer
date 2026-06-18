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
// COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1
// COMMAND_EXPLAINER_SAMPLE_DESCRIPTIONS_V289_A1
// COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_V289_A1
// COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1
// COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1
// COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1
// COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1
// COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1
// COMMAND_EXPLAINER_FULL_REGRESSION_AUDIT_V295_A1
// COMMAND_EXPLAINER_MANUAL_QA_CHECKLIST_V296_A1
// COMMAND_EXPLAINER_SCREEN_UX_TUNE_V297_A1
// COMMAND_EXPLAINER_VERSION_TEXT_V297_A1 20260611_v297_a1
// COMMAND_EXPLAINER_PIPELINE_LIST_V322_A4B1
// COMMAND_EXPLAINER_WEB_REQUEST_OUTFILE_V322_A4B2
// COMMAND_EXPLAINER_WRANGLER_DEPLOY_V322_A4B3
// COMMAND_EXPLAINER_GIT_CLEAN_V322_A4B4
(function() {
  const COMMAND_EXPLAINER_VERSION = "20260618_v322_a4b4";

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


  const COMMAND_SAMPLE_CATALOG_V288 = {
    git_save_flow: {
      label: "Git 저장 흐름",
      shell: "powershell",
      description: "변경 확인부터 GitHub 업로드까지의 기본 저장 흐름입니다.",
      source: `Set-Location "D:\\projects\\python-reading-trainer"

git status --short
git diff --check
git add src\\pwa\\app.js
git commit -m "Update app"
git tag quality-test
git push origin main --tags`
    },
    danger_delete_flow: {
      label: "위험 삭제 명령",
      shell: "powershell",
      description: "삭제/강제 정리 명령을 실행하기 전 확인해야 하는 흐름입니다.",
      source: `Set-Location "D:\\projects\\python-reading-trainer"

if (Test-Path ".tmp") {
  Remove-Item ".tmp" -Recurse -Force
}

git clean -fd
git status --short`
    },
    venv_run_flow: {
      label: "가상환경 실행",
      shell: "powershell",
      description: "가상환경을 켜고 Python 검증 명령을 실행하는 흐름입니다.",
      source: `Set-Location "D:\\projects\\python-reading-trainer"

.\\.venv\\Scripts\\Activate.ps1
python --version
pip install -r requirements.txt
python tools\\validate_lessons.py --expected-app-version 20260611_v297_a1 --expected-lesson-cards 1785`
    },
    verify_commit_flow: {
      label: "검증/커밋 루틴",
      shell: "powershell",
      description: "검증 스크립트 실행 후 diff 확인, add, commit까지 이어지는 루틴입니다.",
      source: `Set-Location "D:\\projects\\python-reading-trainer"

.\\tools\\verify_command_explainer_v287.ps1
git diff --check
git status --short
git add src\\pwa\\command_explainer.js
git commit -m "Update command explainer"`
    },
    bash_git_save_flow: {
      label: "Bash Git 흐름",
      shell: "bash",
      description: "Bash/Shell에서 변경 확인부터 push까지의 기본 Git 흐름입니다.",
      source: `cd ~/python-reading-trainer

git status --short
git diff --check
git add src/pwa/app.js
git commit -m "Update app"
git tag quality-test
git push origin main --tags`
    },
    bash_venv_run_flow: {
      label: "Bash 가상환경 실행",
      shell: "bash",
      description: "Bash/Shell에서 가상환경을 켜고 Python 검증 명령을 실행하는 흐름입니다.",
      source: `cd ~/python-reading-trainer

python3 -m venv .venv
source .venv/bin/activate
python3 --version
pip install -r requirements.txt
python3 tools/validate_lessons.py --expected-app-version 20260611_v297_a1 --expected-lesson-cards 1785`
    }
  };

  function getCommandSampleV288(sampleId, shellValue) {
    const id = String(sampleId || "auto_by_shell");

    if (id !== "auto_by_shell" && COMMAND_SAMPLE_CATALOG_V288[id]) {
      return Object.assign({ id: id }, COMMAND_SAMPLE_CATALOG_V288[id]);
    }

    if (String(shellValue || "powershell") === "bash") {
      return {
        id: "auto_bash",
        label: "현재 셸 기본 Bash 예제",
        shell: "bash",
        description: "현재 Bash/Shell 선택에 맞춘 기본 예제입니다.",
        source: BASH_SAMPLE_V278
      };
    }

    return {
      id: "auto_powershell",
      label: "현재 셸 기본 PowerShell 예제",
      shell: "powershell",
      description: "현재 PowerShell 선택에 맞춘 기본 예제입니다.",
      source: POWERSHELL_SAMPLE_V277
    };
  }


  function buildCommandSampleSafetyGroupsV294(sample) {
    const item = sample || getCommandSampleV288("auto_by_shell", "powershell");

    if (!item || !item.source) {
      return [];
    }

    try {
      const shell = item.shell === "bash" ? "bash" : "powershell";
      const rawResult = shell === "bash"
        ? analyzeBashV278(item.source)
        : analyzePowerShellV277(item.source);
      const beginnerResult = enhanceCommandResultForBeginnersV281(rawResult);
      const flowResult = enhanceCommandResultGitFlowWordingV282(beginnerResult);
      const checklist = buildCommandSafetyChecklistV290(flowResult);

      if (!checklist || !checklist.commands || !checklist.commands.length) {
        return [];
      }

      return getCommandSafetyGroupsV292(checklist);
    } catch (error) {
      return [];
    }
  }

  function renderCommandSampleSafetyGroupsV294(sample) {
    const groups = buildCommandSampleSafetyGroupsV294(sample);

    if (!groups.length) {
      return "";
    }

    return (
      '<div class="command-sample-safety-groups-v294">' +
        '<div class="command-sample-safety-title-v294">분석하면 먼저 보여줄 안전 확인 그룹</div>' +
        '<div class="command-sample-safety-badges-v294">' +
          groups.map(function(group) {
            return '<span class="badge command-sample-safety-badge-v294">' + escapeHtmlV277(group.title) + '</span>';
          }).join("") +
        '</div>' +
        '<div class="command-sample-safety-hint-v294">예제를 불러와 분석하면 결과 위쪽에 이 안전 확인 그룹들이 표시됩니다.</div>' +
      '</div>'
    );
  }

  function renderCommandSampleDescriptionV289(sample) {
    const item = sample || getCommandSampleV288("auto_by_shell", "powershell");
    const shellLabel = item.shell === "bash" ? "Bash/Shell" : "PowerShell";
    const safetyGroupsHtml = renderCommandSampleSafetyGroupsV294(item);

    return (
      '<div class="command-sample-description-title-v289">' +
        escapeHtmlV277(item.label || "명령어 예제") +
        '<span class="badge command-sample-shell-badge-v289">' + escapeHtmlV277(shellLabel) + '</span>' +
      '</div>' +
      '<div class="command-sample-description-text-v289">' +
        escapeHtmlV277(item.description || "선택한 예제의 명령 흐름을 연습합니다.") +
      '</div>' +
      safetyGroupsHtml
    );
  }


  function updateCommandSampleDescriptionV289(sampleId) {
    const box = getCommandElV277("commandSampleDescription");
    const shell = getCommandElV277("commandShellSelect");
    const sampleSelect = getCommandElV277("commandSampleSelect");

    if (!box) {
      return;
    }

    const selectedId = sampleId || (sampleSelect ? sampleSelect.value : "auto_by_shell");
    const sample = getCommandSampleV288(selectedId, shell ? shell.value : "powershell");

    box.className = "command-sample-description-v289";
    box.innerHTML = renderCommandSampleDescriptionV289(sample);
  }


  function syncCommandSampleShellV288() {
    const sampleSelect = getCommandElV277("commandSampleSelect");
    const shell = getCommandElV277("commandShellSelect");

    if (!sampleSelect || !shell) {
      updateCommandSampleDescriptionV289();
      return;
    }

    const sample = getCommandSampleV288(sampleSelect.value, shell.value);
    if (sample && sample.shell && sampleSelect.value !== "auto_by_shell") {
      shell.value = sample.shell;
    }

    updateCommandSampleDescriptionV289(sampleSelect.value);
  }

  function loadCommandSampleV288(sampleId) {
    const input = getCommandElV277("commandInput");
    const shell = getCommandElV277("commandShellSelect");
    const sampleSelect = getCommandElV277("commandSampleSelect");
    const selectedId = sampleId || (sampleSelect ? sampleSelect.value : "auto_by_shell");
    const sample = getCommandSampleV288(selectedId, shell ? shell.value : "powershell");

    if (shell && sample.shell) {
      shell.value = sample.shell;
    }

    if (sampleSelect && sampleId && sampleId !== "auto_by_shell" && COMMAND_SAMPLE_CATALOG_V288[sampleId]) {
      sampleSelect.value = sampleId;
    }

    if (input) {
      input.value = sample.source;
    }

    updateCommandSampleDescriptionV289(selectedId);
    analyzeCommandInputV277();
  }


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
      id: "get_child_item_v322_a4b1",
      command: "Get-ChildItem",
      group: "\ud30c\uc77c \ubaa9\ub85d",
      risk: "safe",
      pattern: /^\s*(?:Get-ChildItem|gci|dir|ls)\b/i,
      meaning: "\ud604\uc7ac \ud3f4\ub354\ub098 \uc9c0\uc815\ud55c \uacbd\ub85c\uc758 \ud30c\uc77c/\ud3f4\ub354 \ubaa9\ub85d\uc744 \uac00\uc838\uc635\ub2c8\ub2e4.",
      fileImpact: "\ubaa9\ub85d\uc744 \uc77d\ub294 \uba85\ub839\uc774\ub77c \ubcf4\ud1b5 \ud30c\uc77c\uc744 \uc218\uc815\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4. -File\uc740 \ud30c\uc77c\ub9cc \ubcf4\uaca0\ub2e4\ub294 \ub73b\uc785\ub2c8\ub2e4.",
      nextCheck: "Get-ChildItem -File | Select-Object -First 5 Name, Length"
    },
    {
      id: "invoke_web_request_v322_a4b2",
      command: "Invoke-WebRequest",
      group: "\ub124\ud2b8\uc6cc\ud06c \ub2e4\uc6b4\ub85c\ub4dc",
      risk: "caution",
      pattern: /^\s*(?:Invoke-WebRequest|iwr|wget|curl)\b/i,
      meaning: "\uc6f9 \uc8fc\uc18c\ub85c HTTP \uc694\uccad\uc744 \ubcf4\ub0b4\uace0 \uacb0\uacfc\ub97c \ubc1b\uc544\uc635\ub2c8\ub2e4. -OutFile\uc774 \uc788\uc73c\uba74 \ubc1b\uc740 \ub0b4\uc6a9\uc744 \ud30c\uc77c\ub85c \uc800\uc7a5\ud569\ub2c8\ub2e4.",
      fileImpact: "-OutFile\uc744 \uc4f0\uba74 \uc9c0\uc815\ud55c \ud30c\uc77c\uc774 \uc0c8\ub85c \ub9cc\ub4e4\uc5b4\uc9c0\uac70\ub098 \uae30\uc874 \ud30c\uc77c\uc774 \ub36e\uc5b4\uc368\uc9c8 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uba85\ub839\uc758 raw \uc904\uc5d0\uc11c \uc2e4\uc81c -OutFile \uacbd\ub85c\ub97c \ud655\uc778\ud558\uc138\uc694.",
      nextCheck: "Test-Path <OutFile path>; git diff -- <OutFile path>"
    },
    {
      id: "wrangler_deploy_v322_a4b3",
      command: "npx wrangler deploy",
      group: "Cloudflare \ubc30\ud3ec",
      risk: "caution",
      pattern: /^\s*npx\s+wrangler\s+deploy\b/i,
      meaning: "Cloudflare Wrangler\ub85c Workers/Pages \ucf54\ub4dc\ub97c \uc6d0\uaca9 \ud658\uacbd\uc5d0 deploy\ud569\ub2c8\ub2e4. \uc131\uacf5\ud558\uba74 Cloudflare\uc758 \ubc30\ud3ec \uc0c1\ud0dc\uac00 \ubc14\ub014 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
      fileImpact: "\ub85c\uceec \ud30c\uc77c\uc744 \uc9c1\uc811 \uc0ad\uc81c\ud558\ub294 \uba85\ub839\uc740 \uc544\ub2c8\uc9c0\ub9cc, \uc6d0\uaca9 Cloudflare \uc11c\ube44\uc2a4\uc5d0 \uc2e4\uc81c \ubc30\ud3ec\ub97c \ubc18\uc601\ud560 \uc218 \uc788\uc73c\ubbc0\ub85c \uc2e4\ud589 \uc804 \uacc4\uc815/\ud504\ub85c\uc81d\ud2b8/\ud658\uacbd\uc744 \ud655\uc778\ud574\uc57c \ud569\ub2c8\ub2e4.",
      nextCheck: "npx wrangler deployments list; npx wrangler whoami"
    },
    {
      id: "git_clean_v322_a4b4",
      command: "git clean",
      group: "Git \uc704\ud5d8 \uc815\ub9ac",
      risk: "danger",
      pattern: /^\s*git\s+clean\b/i,
      meaning: "git clean\uc740 Git\uc774 \ucd94\uc801\ud558\uc9c0 \uc54a\ub294 untracked \ud30c\uc77c/\ud3f4\ub354\ub97c \uc791\uc5c5 \ud3f4\ub354\uc5d0\uc11c \uc815\ub9ac\ud558\ub294 \uba85\ub839\uc785\ub2c8\ub2e4. -fd\ub294 \ud30c\uc77c\uacfc \ud3f4\ub354 \uc0ad\uc81c\ub97c \uc2e4\ud589\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
      fileImpact: "untracked \ud30c\uc77c/\ud3f4\ub354\ub97c \uc0ad\uc81c\ud560 \uc218 \uc788\uace0, \uc0ad\uc81c \ud6c4 Git\uc73c\ub85c \ubcf5\uad6c\ud558\uae30 \uc5b4\ub824\uc6b8 \uc218 \uc788\uc2b5\ub2c8\ub2e4. -x \uc635\uc158\uc774 \uc788\uc73c\uba74 ignored \ud30c\uc77c\uae4c\uc9c0 \ud3ec\ud568\ub420 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc2e4\ud589 \uc804\ub294 \ubc18\ub4dc\uc2dc dry-run\uc778 git clean -fdn\uc73c\ub85c \ubbf8\ub9ac\ubcf4\uae30\ud558\uc138\uc694.",
      nextCheck: "git clean -fdn; git status --short"
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

    if (/\|/.test(trimmed) && /(?:Get-ChildItem|gci|dir|ls|Where-Object|Select-Object)/i.test(trimmed)) {
      const pipePartsV322A4B1 = trimmed.split("|").map(function(part) {
        return part.trim();
      }).filter(Boolean);
      const hasWhereV322A4B1 = /\|\s*Where-Object\b/i.test(trimmed);
      const hasSelectV322A4B1 = /\|\s*Select-Object\b/i.test(trimmed);

      return {
        line: lineNumber,
        command: "PowerShell pipeline",
        group: "\ud30c\uc774\ud504\ub77c\uc778",
        risk: "safe",
        raw: line,
        meaning: "PowerShell pipeline\uc785\ub2c8\ub2e4. \uc67c\ucabd \uba85\ub839\uc758 \uacb0\uacfc \uac1d\uccb4\uac00 \uc624\ub978\ucabd \uba85\ub839\uc73c\ub85c \uc21c\uc11c\ub300\ub85c \ub118\uc5b4\uac11\ub2c8\ub2e4." +
          (hasWhereV322A4B1 ? " Where-Object\ub294 \uc870\uac74\uc5d0 \ub9de\ub294 \ud56d\ubaa9\ub9cc \ud1b5\uacfc\uc2dc\ud0b5\ub2c8\ub2e4." : "") +
          (hasSelectV322A4B1 ? " Select-Object\ub294 \ud544\uc694\ud55c \uc18d\uc131\uc774\ub098 \uc77c\ubd80 \ud56d\ubaa9\ub9cc \uace8\ub77c \ubcf4\uc5ec\uc90d\ub2c8\ub2e4." : ""),
        fileImpact: "\uc774 \uc870\ud569\uc740 \uc8fc\ub85c \ubaa9\ub85d \uc870\ud68c, \uc870\uac74 \ud544\ud130\ub9c1, \ud45c\uc2dc \ud56d\ubaa9 \uc120\ud0dd \ud750\ub984\uc785\ub2c8\ub2e4. \uc0ad\uc81c/\uc4f0\uae30 \uba85\ub839\uc774 \uc5c6\ub2e4\uba74 \ubcf4\ud1b5 \ud30c\uc77c\uc744 \uc218\uc815\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
        nextCheck: "pipeline steps: " + pipePartsV322A4B1.join(" -> ")
      };
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



  function getCommandResultShellV290(result) {
    const value = String((result && result.shell) || (result && result.kind) || "").toLowerCase();

    if (value.indexOf("bash") >= 0 || value.indexOf("shell") >= 0) {
      return "bash";
    }

    const sourceParts = [];

    if (result && result.source) {
      sourceParts.push(String(result.source));
    }

    if (result && result.raw) {
      sourceParts.push(String(result.raw));
    }

    if (result && Array.isArray(result.steps)) {
      result.steps.forEach(function(step) {
        if (step && step.raw) {
          sourceParts.push(String(step.raw));
        }
        if (step && step.command) {
          sourceParts.push(String(step.command));
        }
      });
    }

    const probe = sourceParts.join("\n").toLowerCase();

    if (
      /(^|\n)\s*cd\s+~\//.test(probe) ||
      /(^|\n)\s*source\s+\.venv\/bin\/activate\b/.test(probe) ||
      /(^|\n)\s*rm\s+-/.test(probe) ||
      /(^|\n)\s*sudo\s+/.test(probe) ||
      /(^|\n)\s*ls\s+-/.test(probe)
    ) {
      return "bash";
    }

    return "powershell";
  }


  function extractQuotedOrPathV290(raw, commandName) {
    const text = String(raw || "");
    const quoted = text.match(/["']([^"']+)["']/);
    if (quoted && quoted[1]) {
      return quoted[1];
    }

    const parts = text.trim().split(/\s+/);
    const commandIndex = parts.findIndex(function(part) {
      return part.toLowerCase() === String(commandName || "").toLowerCase();
    });

    if (commandIndex < 0) {
      return "";
    }

    for (let index = commandIndex + 1; index < parts.length; index += 1) {
      const part = parts[index];
      if (!part || part.startsWith("-")) {
        continue;
      }
      return part;
    }

    return "";
  }


  function normalizeSafetyCommandsV290(commands) {
    const seen = {};
    return commands.filter(function(command) {
      const key = String(command || "").trim();
      if (!key || seen[key]) {
        return false;
      }
      seen[key] = true;
      return true;
    });
  }

  function classifyDangerChecklistStepV291(step) {
    const raw = String((step && step.raw) || "");
    const lower = raw.toLowerCase();

    if (step && step.command === "Remove-Item") {
      return "remove_item";
    }

    if (/\brm\s+/.test(lower)) {
      return "rm";
    }

    if (/\bgit\s+clean\b/.test(lower)) {
      return "git_clean";
    }

    if (/\bgit\s+reset\s+--hard\b/.test(lower)) {
      return "git_reset_hard";
    }

    if (/\bsudo\b/.test(lower)) {
      return "sudo";
    }

    return "generic";
  }

  function pushTargetInspectionCommandsV291(commands, shell, target) {
    const safeTarget = target || ".";

    if (shell === "bash") {
      commands.push('test -e "' + safeTarget + '" && echo "target exists"');
      commands.push('ls -la "' + safeTarget + '"');
      commands.push('find "' + safeTarget + '" -maxdepth 2 -print | head -50');
      commands.push('du -sh "' + safeTarget + '" 2>/dev/null');
      return;
    }

    commands.push('Test-Path "' + safeTarget + '"');
    commands.push('Get-Item -Force "' + safeTarget + '"');
    commands.push('Get-ChildItem -Force "' + safeTarget + '" | Select-Object -First 20');
    commands.push('(Get-ChildItem -Force "' + safeTarget + '" -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count');
  }

  function pushBackupBranchCommandsV291(commands, shell) {
    if (shell === "bash") {
      commands.push('backup_branch="backup/before-reset-$(date +%Y%m%d-%H%M%S)"');
      commands.push('git branch "$backup_branch"');
      commands.push('git branch --list "backup/before-reset-*"');
      return;
    }

    commands.push("$backupBranch = \"backup/before-reset-$(Get-Date -Format 'yyyyMMdd-HHmmss')\"");
    commands.push("git branch $backupBranch");
    commands.push('git branch --list "backup/before-reset-*"');
  }

  function buildCommandSafetyChecklistV290(result) {
    const guide = buildCommandDangerGuideV286(result);

    if (!guide.items.length) {
      return {
        shell: getCommandResultShellV290(result),
        commands: [],
        items: [],
        notes: [],
        commandText: "",
        title: "안전 실행 체크리스트"
      };
    }

    const shell = getCommandResultShellV290(result);
    const commands = [];
    const notes = [];

    if (shell === "bash") {
      commands.push("pwd");
      commands.push("git status --short");
      commands.push("git diff --check");
      commands.push("git branch --show-current");
    } else {
      commands.push("Get-Location");
      commands.push("git status --short");
      commands.push("git diff --check");
      commands.push("git branch --show-current");
    }

    guide.items.forEach(function(step) {
      const raw = String(step.raw || "");
      const type = classifyDangerChecklistStepV291(step);

      if (type === "remove_item") {
        const target = extractQuotedOrPathV290(raw, "Remove-Item") || ".";
        pushTargetInspectionCommandsV291(commands, "powershell", target);
        notes.push("Remove-Item 실행 전 삭제 대상의 존재 여부, 목록, 재귀 대상 개수를 확인합니다.");
        return;
      }

      if (type === "rm") {
        const target = extractQuotedOrPathV290(raw, "rm") || ".";
        pushTargetInspectionCommandsV291(commands, "bash", target);
        notes.push("rm 실행 전 삭제 대상의 존재 여부, 목록, 크기를 확인합니다.");
        return;
      }

      if (type === "git_clean") {
        commands.push("git clean -nd");
        commands.push("git clean -ndx");
        commands.push("git status --short");
        notes.push("git clean 실행 전에는 삭제 예정 목록만 보여주는 dry-run을 먼저 실행합니다.");
        return;
      }

      if (type === "git_reset_hard") {
        commands.push("git log --oneline -5");
        commands.push("git status --short");
        pushBackupBranchCommandsV291(commands, shell);
        notes.push("git reset --hard 실행 전 현재 HEAD 기준 백업 브랜치를 먼저 만들어 둡니다.");
        return;
      }

      if (type === "sudo") {
        if (shell === "bash") {
          commands.push("whoami");
          commands.push("groups");
          commands.push("sudo -l");
        } else {
          commands.push("whoami");
        }
        notes.push("sudo 실행 전 현재 사용자와 권한 범위를 확인합니다.");
        return;
      }

      notes.push("위험 명령 실행 전 대상과 현재 상태를 먼저 확인합니다.");
    });

    const safeCommands = normalizeSafetyCommandsV290(commands);

    return {
      shell: shell,
      commands: safeCommands,
      items: guide.items,
      notes: normalizeSafetyCommandsV290(notes),
      commandText: safeCommands.join("\n"),
      title: "안전 실행 체크리스트"
    };
  }


  function getCommandSafetyGroupKeyV292(command) {
    const text = String(command || "").trim();

    if (!text) {
      return "common";
    }

    if (
      text === "whoami" ||
      text === "groups" ||
      text === "sudo -l"
    ) {
      return "permission";
    }

    if (
      text.indexOf("backup/before-reset") >= 0 ||
      text.indexOf("$backupBranch") >= 0 ||
      text.indexOf("backup_branch") >= 0 ||
      text === "git branch $backupBranch" ||
      text === 'git branch "$backup_branch"' ||
      text.indexOf('git branch --list "backup/before-reset-*"') >= 0 ||
      text.indexOf("git log --oneline") === 0
    ) {
      return "git_recovery";
    }

    if (
      text.indexOf("Test-Path") === 0 ||
      text.indexOf("Get-Item") === 0 ||
      text.indexOf("Get-ChildItem") === 0 ||
      text.indexOf("Measure-Object") >= 0 ||
      text.indexOf("test -e") === 0 ||
      text.indexOf("ls -la") === 0 ||
      text.indexOf("find ") === 0 ||
      text.indexOf("du -sh") === 0 ||
      text.indexOf("git clean") === 0
    ) {
      return "delete";
    }

    return "common";
  }

  function getCommandSafetyGroupMetaV292(key) {
    const meta = {
      common: {
        title: "공통 확인",
        description: "현재 위치, 브랜치, Git 변경 상태를 먼저 확인합니다.",
        reason: "현재 위치와 브랜치를 모르면 안전한 명령도 엉뚱한 폴더에서 실행될 수 있습니다."
      },
      delete: {
        title: "삭제 계열",
        description: "파일이나 폴더가 실제로 무엇인지, 몇 개인지, 얼마나 큰지 확인합니다.",
        reason: "삭제 명령은 되돌리기 어렵기 때문에 대상 경로와 범위를 먼저 눈으로 확인해야 합니다."
      },
      git_recovery: {
        title: "Git 복구 계열",
        description: "되돌리기 전에 최근 커밋과 백업 브랜치를 확인합니다.",
        reason: "reset이나 되돌리기 작업 전에는 돌아갈 지점을 남겨야 실수해도 복구할 수 있습니다."
      },
      permission: {
        title: "권한 계열",
        description: "관리자 권한 실행 전 현재 사용자와 권한 범위를 확인합니다.",
        reason: "sudo 같은 권한 명령은 시스템 범위에 영향을 줄 수 있어서 실행 주체를 먼저 확인해야 합니다."
      }
    };

    return meta[key] || meta.common;
  }

  function getCommandSafetyGroupsV292(checklist) {
    const order = ["common", "delete", "git_recovery", "permission"];
    const grouped = {
      common: [],
      delete: [],
      git_recovery: [],
      permission: []
    };

    (checklist.commands || []).forEach(function(command) {
      const key = getCommandSafetyGroupKeyV292(command);
      grouped[key].push(command);
    });

    return order.map(function(key) {
      const meta = getCommandSafetyGroupMetaV292(key);
      return {
        key: key,
        title: meta.title,
        description: meta.description,
        reason: meta.reason,
        commands: grouped[key]
      };
    }).filter(function(group) {
      return group.commands.length > 0;
    });
  }

  function renderCommandSafetyGroupV292(group) {
    const reasonHtml = group.reason
      ? '<em class="command-safety-group-reason-v293">먼저 확인하는 이유: ' + escapeHtmlV277(group.reason) + '</em>'
      : "";

    return (
      '<section class="command-safety-group-v292 command-safety-group-' + escapeHtmlV277(group.key) + '-v292">' +
        '<div class="command-safety-group-head-v292">' +
          '<strong>' + escapeHtmlV277(group.title) + '</strong>' +
          '<span>' + escapeHtmlV277(group.description) + '</span>' +
          reasonHtml +
        '</div>' +
        '<pre class="code-block small-code command-safety-group-code-v292">' + escapeHtmlV277(group.commands.join("\n")) + '</pre>' +
      '</section>'
    );
  }


  function renderCommandSafetyChecklistV290(result) {
    const checklist = buildCommandSafetyChecklistV290(result);

    if (!checklist.commands.length) {
      return "";
    }

    const shellLabel = checklist.shell === "bash" ? "Bash/Shell" : "PowerShell";
    const groups = getCommandSafetyGroupsV292(checklist);
    const groupHtml = groups.map(renderCommandSafetyGroupV292).join("");
    const noteHtml = checklist.notes.length
      ? '<ul class="command-safety-notes-v290">' + checklist.notes.map(function(note) {
          return '<li>' + escapeHtmlV277(note) + '</li>';
        }).join("") + '</ul>'
      : "";

    return (
      '<details class="command-safety-checklist-v290 command-safety-checklist-grouped-v292" open>' +
        '<summary>' +
          '<span class="command-safety-title-v290">위험 명령 실행 전 안전 확인</span>' +
          '<span class="badge command-safety-shell-v290">' + escapeHtmlV277(shellLabel) + '</span>' +
          '<span class="badge command-safety-group-count-v292">' + groups.length + '개 그룹</span>' +
        '</summary>' +
        '<div class="command-safety-body-v290">' +
          '<p>아래 명령은 삭제/초기화 명령이 아니라 현재 상태를 먼저 확인하는 안전 확인 명령입니다. 그룹별로 확인하면 실수 가능성을 줄일 수 있습니다.</p>' +
          '<button type="button" class="mini-btn command-safety-copy-btn-v290" data-command-safety-copy-v290>안전 확인 명령 전체 복사</button>' +
          '<pre hidden class="code-block small-code command-safety-code-v290 command-safety-copy-source-v292">' + escapeHtmlV277(checklist.commandText) + '</pre>' +
          '<div class="command-safety-groups-v292">' +
            groupHtml +
          '</div>' +
          noteHtml +
        '</div>' +
      '</details>'
    );
  }


  function copyTextToClipboardV290(text, button) {
    const value = String(text || "");

    function markDone() {
      if (button) {
        const original = button.textContent;
        button.textContent = "복사됨";
        setTimeout(function() {
          button.textContent = original || "안전 확인 명령 복사";
        }, 1200);
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(markDone).catch(function() {
        fallbackCopyTextV290(value);
        markDone();
      });
      return;
    }

    fallbackCopyTextV290(value);
    markDone();
  }

  function fallbackCopyTextV290(text) {
    if (typeof document === "undefined" || !document.createElement || !document.body) {
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = String(text || "");
    textarea.setAttribute("readonly", "readonly");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
    } catch (error) {
      // Ignore copy fallback errors. The code block remains visible for manual copy.
    }

    document.body.removeChild(textarea);
  }

  function bindCommandSafetyChecklistCopyV290(root) {
    if (!root || !root.querySelectorAll) {
      return;
    }

    const buttons = root.querySelectorAll("[data-command-safety-copy-v290]");
    Array.prototype.forEach.call(buttons, function(button) {
      button.onclick = function() {
        const wrapper = button.closest ? button.closest(".command-safety-checklist-v290") : null;
        const code = wrapper && wrapper.querySelector ? wrapper.querySelector(".command-safety-code-v290") : null;
        copyTextToClipboardV290(code ? code.textContent : "", button);
      };
    });
  }


  function renderCommandStepsV277(result) {
    const box = getCommandElV277("commandSteps");
    if (!box) return;

    if (!result.steps.length) {
      box.innerHTML = '<p class="muted">분석할 명령어가 없습니다.</p>';
      return;
    }

    const dangerGuideHtmlV286 = renderCommandDangerGuideV287(result);
    const safetyChecklistHtmlV290 = renderCommandSafetyChecklistV290(result);
    const actionGuideHtmlV285 = renderCommandActionGuideV285(result);

    box.innerHTML = dangerGuideHtmlV286 + safetyChecklistHtmlV290 + actionGuideHtmlV285 + result.steps.map(function(step, index) {
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

    bindCommandSafetyChecklistCopyV290(box);
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
    loadCommandSampleV288("auto_by_shell");
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

    updateCommandSampleDescriptionV289();
  }

  function injectCommandExplainerStyleV277() {
    if (document.getElementById("commandExplainerStyleV277")) return;
    const style = document.createElement("style");
    style.id = "commandExplainerStyleV277";
    style.textContent = `
      .command-explainer-grid { align-items: start; }
      .command-sample-select-v288 {
        min-width: 180px;
      }
      .command-sample-description-v289 {
        margin: 8px 0 10px 0;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(240, 249, 255, 0.88);
        border: 1px solid rgba(14, 165, 233, 0.22);
        line-height: 1.55;
      }
      .command-sample-description-title-v289 {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        font-weight: 900;
        color: #075985;
      }
      .command-sample-shell-badge-v289 {
        background: rgba(14, 165, 233, 0.14);
        color: #075985;
      }
      .command-sample-description-text-v289 {
        margin-top: 4px;
        color: #334155;
      }
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
        .command-sample-select-v288 {
          min-width: 100%;
        }
        .command-sample-description-v289 {
          padding: 10px;
          margin-top: 8px;
        }
        .command-sample-description-title-v289 {
          align-items: flex-start;
        }
        .command-safety-checklist-v290 summary {
          min-height: 46px;
          padding: 12px 10px;
          align-items: flex-start;
        }
        .command-safety-body-v290 {
          padding: 0 10px 10px 10px;
        }
        .command-safety-copy-btn-v290 {
          width: 100%;
        }
      }

      .command-safety-group-count-v292 {
        background: rgba(15, 23, 42, 0.08);
        color: #334155;
      }
      .command-safety-groups-v292 {
        display: grid;
        gap: 10px;
        margin-top: 8px;
      }
      .command-safety-group-v292 {
        border-radius: 12px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.72);
        overflow: hidden;
      }
      .command-safety-group-head-v292 {
        display: grid;
        gap: 3px;
        padding: 10px 10px 0 10px;
      }
      .command-safety-group-head-v292 strong {
        color: #78350f;
        font-size: 0.96rem;
      }
      .command-safety-group-head-v292 span {
        color: #64748b;
        font-size: 0.88rem;
        line-height: 1.45;
      }
      .command-safety-group-code-v292 {
        margin: 8px 10px 10px 10px;
        white-space: pre-wrap;
      }
      @media (max-width: 640px) {
        .command-safety-groups-v292 {
          gap: 8px;
        }
        .command-safety-group-head-v292 {
          padding: 9px 9px 0 9px;
        }
        .command-safety-group-code-v292 {
          margin: 8px 9px 9px 9px;
        }
      }

      .command-safety-group-reason-v293 {
        display: block;
        margin-top: 3px;
        color: #92400e;
        font-style: normal;
        font-size: 0.86rem;
        line-height: 1.45;
      }
      @media (max-width: 640px) {
        .command-safety-group-reason-v293 {
          font-size: 0.84rem;
        }
      }

      .command-sample-safety-groups-v294 {
        margin-top: 8px;
        padding: 8px 10px;
        border-radius: 10px;
        background: rgba(255, 251, 235, 0.86);
        border: 1px solid rgba(245, 158, 11, 0.24);
      }
      .command-sample-safety-title-v294 {
        font-weight: 900;
        color: #92400e;
        margin-bottom: 6px;
      }
      .command-sample-safety-badges-v294 {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 6px;
      }
      .command-sample-safety-badge-v294 {
        background: rgba(245, 158, 11, 0.15);
        color: #92400e;
      }
      .command-sample-safety-hint-v294 {
        color: #64748b;
        font-size: 0.88rem;
        line-height: 1.45;
      }
      @media (max-width: 640px) {
        .command-sample-safety-groups-v294 {
          padding: 8px;
        }
        .command-sample-safety-badges-v294 {
          gap: 5px;
        }
      }

      /* COMMAND_EXPLAINER_SCREEN_UX_TUNE_V297_A1 */
      .command-explainer-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 16px;
        align-items: start;
      }
      .command-explainer-grid > * {
        min-width: 0;
      }
      .command-safety-checklist-v290 summary {
        gap: 8px;
      }
      .command-safety-body-v290 > p {
        margin-top: 0;
        color: #475569;
        line-height: 1.55;
      }
      .command-safety-copy-btn-v290 {
        font-weight: 900;
        border-color: rgba(245, 158, 11, 0.38);
        background: rgba(255, 251, 235, 0.95);
        color: #92400e;
      }
      .command-safety-group-reason-v293 {
        padding: 5px 8px;
        border-radius: 8px;
        background: rgba(245, 158, 11, 0.09);
      }
      @media (max-width: 900px) {
        .command-explainer-grid {
          grid-template-columns: 1fr;
        }
      }

`;
    document.head.appendChild(style);
  }

  function initCommandExplainerV277() {
    injectCommandExplainerStyleV277();

    const version = getCommandElV277("commandExplainerVersion");
    if (version) {
      version.textContent = "V297";
    }

    const analyzeBtn = getCommandElV277("analyzeCommandBtn");
    const sampleBtn = getCommandElV277("loadCommandSampleBtn");
    const sampleSelect = getCommandElV277("commandSampleSelect");
    const clearBtn = getCommandElV277("clearCommandBtn");

    if (analyzeBtn) analyzeBtn.onclick = analyzeCommandInputV277;
    if (sampleBtn) sampleBtn.onclick = function() { loadCommandSampleV288(); };
    if (sampleSelect) sampleSelect.onchange = syncCommandSampleShellV288;
    if (clearBtn) clearBtn.onclick = clearCommandInputV277;

    updateCommandSampleDescriptionV289();
  }

  function refreshCommandExplainerV277() {
    const version = getCommandElV277("commandExplainerVersion");
    if (version) {
      version.textContent = "V297";
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
    sampleCatalogV288: COMMAND_SAMPLE_CATALOG_V288,
    getSampleV288: getCommandSampleV288,
    loadSampleV288: loadCommandSampleV288,
    syncSampleShellV288: syncCommandSampleShellV288,
    renderSampleDescriptionV289: renderCommandSampleDescriptionV289,
    updateSampleDescriptionV289: updateCommandSampleDescriptionV289,
    buildSafetyChecklistV290: buildCommandSafetyChecklistV290,
    renderSafetyChecklistV290: renderCommandSafetyChecklistV290,
    bindSafetyChecklistCopyV290: bindCommandSafetyChecklistCopyV290,
    classifyDangerStepV291: classifyDangerChecklistStepV291,
    getSafetyGroupsV292: getCommandSafetyGroupsV292,
    getSafetyGroupMetaV293: getCommandSafetyGroupMetaV292,
    buildSampleSafetyGroupsV294: buildCommandSampleSafetyGroupsV294,
    renderSampleSafetyGroupsV294: renderCommandSampleSafetyGroupsV294,
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

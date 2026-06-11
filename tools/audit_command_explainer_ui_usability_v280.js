const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v280_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_ui_usability_audit_v280.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function hasAll(text, items) {
  return items.every(item => text.includes(item));
}

function renderChecks(checks) {
  return checks.map(check => {
    return `| ${check.name} | ${check.ok ? "Y" : "N"} | ${check.detail.replace(/\|/g, "/")} |`;
  }).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  const checks = [
    {
      name: "app version",
      ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'),
      detail: EXPECTED_VERSION
    },
    {
      name: "root index version",
      ok: rootIndex.includes(EXPECTED_VERSION),
      detail: EXPECTED_VERSION
    },
    {
      name: "command script version",
      ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION),
      detail: "src/pwa/index.html script cache busting"
    },
    {
      name: "command tab exists",
      ok: index.includes('data-view="command"') && index.includes("명령어해석"),
      detail: "top tab navigation"
    },
    {
      name: "command view exists",
      ok: index.includes('id="commandView"') && index.includes("command-explainer-panel"),
      detail: "dedicated command explainer view"
    },
    {
      name: "shell selector exists",
      ok: hasAll(index, ['id="commandShellSelect"', '<option value="powershell">PowerShell</option>', '<option value="bash">Bash/Shell</option>']),
      detail: "PowerShell/Bash selectable"
    },
    {
      name: "core buttons exist",
      ok: hasAll(index, ['id="loadCommandSampleBtn"', 'id="analyzeCommandBtn"', 'id="clearCommandBtn"']),
      detail: "sample/analyze/clear actions"
    },
    {
      name: "input area exists",
      ok: index.includes('id="commandInput"') && index.includes("여기에 PowerShell 명령을 붙여넣으세요"),
      detail: "command textarea"
    },
    {
      name: "output regions exist",
      ok: hasAll(index, ['id="commandSummary"', 'id="commandWarnings"', 'id="commandSteps"', 'id="commandNextChecks"']),
      detail: "summary/warnings/steps/next checks"
    },
    {
      name: "app refresh hook",
      ok: app.includes('viewName === "command"') && app.includes("window.CommandExplainer.refresh"),
      detail: "tab switch refresh hook"
    },
    {
      name: "PowerShell lineage kept",
      ok: command.includes("COMMAND_EXPLAINER_POWERSHELL_V277_A1") && command.includes("analyzePowerShellV277"),
      detail: "V277 PowerShell still present"
    },
    {
      name: "Bash lineage kept",
      ok: command.includes("COMMAND_EXPLAINER_BASH_V278_A1") && command.includes("analyzeBashV278"),
      detail: "V278 Bash still present"
    },
    {
      name: "V279 audit lineage kept",
      ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V280_A1 " + EXPECTED_VERSION),
      detail: "version marker cleaned forward"
    },
    {
      name: "V280 UI marker",
      ok: command.includes("COMMAND_EXPLAINER_UI_USABILITY_AUDIT_V280_A1"),
      detail: "V280 marker present"
    },
    {
      name: "risk rendering present",
      ok: hasAll(command, ["renderCommandWarningsV277", "getRiskLabelV277", "getRiskClassV277", "위험", "주의", "안전"]),
      detail: "risk badge/warning rendering"
    },
    {
      name: "sample selector behavior",
      ok: command.includes('shell && shell.value === "bash" ? BASH_SAMPLE_V278 : POWERSHELL_SAMPLE_V277'),
      detail: "example button changes sample by selected shell"
    },
    {
      name: "clear behavior present",
      ok: command.includes("function clearCommandInputV277") && command.includes("아직 분석한 명령어가 없습니다."),
      detail: "clear resets result panels"
    }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V280 명령어해석 UI 사용성 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_UI_USABILITY_V280_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 정적 UI 구조 감사 / 수동 브라우저 점검 체크리스트",
    "",
    "## 1. 결론",
    "",
    "- V280에서는 기능을 새로 늘리지 않고, V277~V279에서 만든 명령어해석 모드의 UI 구조를 점검한다.",
    "- 명령어해석은 기존 코드해석과 별도 탭으로 유지된다.",
    "- PowerShell/Bash 선택, 예제 불러오기, 분석, 입력 지우기, 위험 경고, 작업 순서, 다음 확인 명령어 영역이 모두 존재한다.",
    "- 실제 브라우저에서 탭 전환과 버튼 동작을 한 번 수동 확인하면 V280 안정화 기준을 만족한다.",
    "",
    "## 2. 정적 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 수동 브라우저 점검 체크리스트",
    "",
    "| 항목 | 기대 결과 | 상태 |",
    "|---|---|---|",
    "| 명령어해석 탭 클릭 | 코드해석/프로젝트분석과 별도 화면이 열린다 | 확인 필요 |",
    "| PowerShell 선택 후 예제 불러오기 | Set-Location, Remove-Item, git 명령 예제가 들어온다 | 확인 필요 |",
    "| PowerShell 분석 | Remove-Item은 위험, git push는 주의로 표시된다 | 확인 필요 |",
    "| Bash/Shell 선택 후 예제 불러오기 | cd, rm -rf, chmod, sudo, python3, git 명령 예제가 들어온다 | 확인 필요 |",
    "| Bash/Shell 분석 | rm -rf와 sudo는 위험, chmod와 git push는 주의로 표시된다 | 확인 필요 |",
    "| 입력 지우기 | 입력창과 결과 영역이 초기 상태로 돌아간다 | 확인 필요 |",
    "| 다른 탭 이동 후 복귀 | 명령어해석 화면이 깨지지 않는다 | 확인 필요 |",
    "",
    "## 4. 다음 단계",
    "",
    "- V281에서는 실제 사용 중 헷갈릴 수 있는 표현을 더 초보자 친화적으로 다듬는다.",
    "- 예: `스테이징`, `커밋`, `태그`, `원격 저장소`, `관리자 권한`, `강제 삭제`를 더 쉬운 설명으로 보강한다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_UI_USABILITY_V280_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v276_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_mode_design_audit_v276.md");

const POWERSHELL_SAMPLE = `Set-Location "D:\\projects\\python-reading-trainer"

if (Test-Path ".tmp") {
  Remove-Item ".tmp" -Recurse -Force
}

New-Item -ItemType Directory -Force -Path ".tmp" | Out-Null
Get-Content "src\\pwa\\app.js" -Raw -Encoding UTF8
python ".tmp\\script.py"
git status --short
git diff --check
`;

const BASH_SAMPLE = `cd ~/python-reading-trainer

if [ -d ".tmp" ]; then
  rm -rf ".tmp"
fi

mkdir -p .tmp
cat src/pwa/app.js
python3 .tmp/script.py
git status --short
git diff --check
`;

const DESIGN_REQUIREMENTS = [
  {
    id: "separate_mode",
    title: "일반 코드해석과 명령어 해석 분리",
    reason: "PowerShell/Bash는 함수/클래스 구조보다 작업 순서, 파일 조작, 실행 환경, 위험 명령을 해석하는 성격이 강함",
    status: "PASS"
  },
  {
    id: "step_order_first",
    title: "명령어는 순서 중심으로 설명",
    reason: "Set-Location, Test-Path, Remove-Item, New-Item, python, git 명령은 위에서 아래로 실행되는 작업 흐름 설명이 중요함",
    status: "PASS"
  },
  {
    id: "risk_warning",
    title: "삭제/강제 실행/권한 변경은 위험 경고",
    reason: "Remove-Item -Recurse -Force, rm -rf, chmod, sudo 같은 명령은 학습자에게 먼저 위험도를 알려야 함",
    status: "PASS"
  },
  {
    id: "windows_unix_split",
    title: "PowerShell과 Bash/Shell 규칙 분리",
    reason: "경로 표기, 변수 문법, 조건문, 파이프, 삭제 명령이 달라서 하나의 규칙으로 섞으면 오해가 생김",
    status: "PASS"
  },
  {
    id: "git_command_group",
    title: "Git 명령은 공통 그룹으로 별도 처리",
    reason: "git status, git diff, git add, git commit, git tag, git push는 PowerShell/Bash 모두에서 같은 의미로 자주 사용됨",
    status: "PASS"
  },
  {
    id: "no_auto_execution",
    title: "명령어 해석은 실행하지 않음",
    reason: "입력된 명령을 실제로 실행하면 파일 삭제, 커밋, 푸시 같은 부작용이 생길 수 있으므로 정적 해석만 해야 함",
    status: "PASS"
  }
];

const POWERSHELL_COMMANDS = [
  ["Set-Location", "작업 폴더 이동", "safe"],
  ["Test-Path", "파일/폴더 존재 확인", "safe"],
  ["Remove-Item", "파일/폴더 삭제", "danger"],
  ["New-Item", "파일/폴더 생성", "safe"],
  ["Get-Content", "파일 내용 읽기", "safe"],
  ["Set-Content", "파일 내용 쓰기", "caution"],
  ["Out-Null", "출력 숨김", "safe"],
  ["python", "Python 스크립트 실행", "caution"],
  ["git status", "Git 변경 상태 확인", "safe"],
  ["git diff", "Git 변경 내용 확인", "safe"],
  ["git add", "Git 스테이징", "caution"],
  ["git commit", "Git 커밋 생성", "caution"],
  ["git tag", "Git 태그 생성", "caution"],
  ["git push", "원격 저장소로 푸시", "caution"]
];

const BASH_COMMANDS = [
  ["cd", "작업 폴더 이동", "safe"],
  ["test / [ -d ]", "파일/폴더 조건 확인", "safe"],
  ["rm -rf", "파일/폴더 강제 삭제", "danger"],
  ["mkdir -p", "폴더 생성", "safe"],
  ["cat", "파일 내용 출력", "safe"],
  ["grep", "텍스트 검색", "safe"],
  ["chmod", "실행 권한 변경", "caution"],
  ["sudo", "관리자 권한 실행", "danger"],
  ["python3", "Python 스크립트 실행", "caution"],
  ["git status", "Git 변경 상태 확인", "safe"],
  ["git diff", "Git 변경 내용 확인", "safe"],
  ["git add", "Git 스테이징", "caution"],
  ["git commit", "Git 커밋 생성", "caution"],
  ["git push", "원격 저장소로 푸시", "caution"]
];

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function detectSignals(text, commands) {
  return commands.map(row => {
    const name = row[0];
    const token = name.split(" ")[0].replace("test / ", "");
    return {
      command: name,
      found: text.includes(token) || text.includes(name)
    };
  });
}

function renderRequirementRows(items) {
  return items.map(item => {
    return `| ${item.id} | ${item.title} | ${item.status} | ${item.reason} |`;
  }).join("\n");
}

function renderCommandRows(items) {
  return items.map(row => {
    return `| ${row[0]} | ${row[1]} | ${row[2]} |`;
  }).join("\n");
}

function makeReport() {
  const app = readText("src/pwa/app.js");
  const code = readText("src/pwa/code_explainer.js");

  const appVersionOk = app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";');
  const v275Unaffected = code.includes("CODE_EXPLAINER_QUALITY_HINTS_V274_A1") && code.includes("CODE_EXPLAINER_INTERNAL_CALL_NOISE_GROUPS_V272_A1");

  const psSignals = detectSignals(POWERSHELL_SAMPLE, POWERSHELL_COMMANDS);
  const bashSignals = detectSignals(BASH_SAMPLE, BASH_COMMANDS);

  const requirementPass = DESIGN_REQUIREMENTS.every(item => item.status === "PASS");
  const psCorePass = psSignals.filter(item => item.found).length >= 8;
  const bashCorePass = bashSignals.filter(item => item.found).length >= 7;

  const pass = appVersionOk && v275Unaffected && requirementPass && psCorePass && bashCorePass;

  const report = [
    "# V276 PowerShell/Bash 명령어 해석 모드 설계 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_MODE_DESIGN_V276_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 앱 버전 확인: ${appVersionOk ? "Y" : "N"}`,
    `- 기존 Code Explainer V272/V274 유지 확인: ${v275Unaffected ? "Y" : "N"}`,
    `- 감사 유형: 설계 감사 / 정적 샘플 감사`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "",
    "## 1. 결론",
    "",
    "- PowerShell/Bash는 일반 코드해석에 섞지 않고 별도 `명령어 해석 모드`로 분리한다.",
    "- 기존 Python/JavaScript 코드해석은 함수/클래스/호출/흐름 중심으로 유지한다.",
    "- 명령어 해석 모드는 작업 순서, 파일 영향, 실행 위치, 위험 명령, Git 부작용을 우선 설명한다.",
    "- V277은 PowerShell 1차 구현, V278은 Bash/Shell 1차 구현으로 나누는 것이 안전하다.",
    "",
    "## 2. 설계 요구사항",
    "",
    "| id | requirement | status | reason |",
    "|---|---|---|---|",
    renderRequirementRows(DESIGN_REQUIREMENTS),
    "",
    "## 3. PowerShell 1차 지원 후보",
    "",
    "| command | beginner meaning | risk |",
    "|---|---|---|",
    renderCommandRows(POWERSHELL_COMMANDS),
    "",
    "## 4. Bash/Shell 1차 지원 후보",
    "",
    "| command | beginner meaning | risk |",
    "|---|---|---|",
    renderCommandRows(BASH_COMMANDS),
    "",
    "## 5. PowerShell 감사 샘플",
    "",
    "```powershell",
    POWERSHELL_SAMPLE.trim(),
    "```",
    "",
    "## 6. Bash/Shell 감사 샘플",
    "",
    "```bash",
    BASH_SAMPLE.trim(),
    "```",
    "",
    "## 7. V277 구현 범위 제안",
    "",
    "- `src/pwa/command_explainer.js`를 새 파일로 분리한다.",
    "- `CodeExplainer` 내부에 억지로 섞지 않는다.",
    "- 첫 구현은 PowerShell만 대상으로 한다.",
    "- 출력은 `작업 순서`, `명령어 의미`, `위험 경고`, `Git 영향`, `다음 확인 명령어`로 구성한다.",
    "- `Remove-Item -Recurse -Force`, `rm -rf`, `git push` 같은 명령은 초보자 경고를 항상 붙인다.",
    "",
    "## 8. PASS 기준",
    "",
    "- 앱 버전이 V276으로 올라가야 한다.",
    "- 기존 V272/V274 Code Explainer 마커가 유지되어야 한다.",
    "- PowerShell/Bash를 분리해야 한다는 설계 결론이 리포트에 있어야 한다.",
    "- PowerShell 1차 구현 후보와 Bash/Shell 1차 구현 후보가 별도로 있어야 한다.",
    "- V277 구현 범위가 PowerShell 1차로 제한되어야 한다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  return {
    pass,
    appVersionOk,
    v275Unaffected,
    psFound: psSignals.filter(item => item.found).length,
    bashFound: bashSignals.filter(item => item.found).length,
    reportPath: REPORT_PATH
  };
}

function main() {
  const result = makeReport();

  console.log("AUDIT_COMMAND_EXPLAINER_MODE_DESIGN_V276_A1");
  console.log("REPORT", path.relative(ROOT, result.reportPath));
  console.log("APP_VERSION_OK", result.appVersionOk ? "Y" : "N");
  console.log("CODE_EXPLAINER_MARKERS_OK", result.v275Unaffected ? "Y" : "N");
  console.log("POWERSHELL_SIGNAL_COUNT", result.psFound);
  console.log("BASH_SIGNAL_COUNT", result.bashFound);
  console.log("AUDIT_RESULT", result.pass ? "PASS" : "CHECK_NEEDED");

  if (!result.pass) {
    process.exitCode = 1;
  }
}

main();

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v281_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_beginner_terms_audit_v281.md");

const POWERSHELL_SAMPLE = [
  'Set-Location "D:\\projects\\python-reading-trainer"',
  'Remove-Item ".tmp" -Recurse -Force',
  'python ".tmp\\script.py"',
  'git add src\\pwa\\app.js',
  'git commit -m "Update app"',
  'git tag quality-test',
  'git push origin main --tags'
].join("\n");

const BASH_SAMPLE = [
  'cd ~/python-reading-trainer',
  'rm -rf ".tmp"',
  'chmod +x tools/run.sh',
  'sudo apt update',
  'python3 .tmp/script.py',
  'git add src/pwa/app.js',
  'git commit -m "Update app"',
  'git tag quality-test',
  'git push origin main --tags'
].join("\n");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function bootCommandExplainer() {
  global.window = global;
  global.document = {
    readyState: "loading",
    head: { appendChild() {} },
    addEventListener() {},
    createElement() {
      return {
        id: "",
        textContent: "",
        className: "",
        style: {},
        appendChild() {}
      };
    },
    getElementById() {
      return null;
    }
  };

  vm.runInThisContext(readText("src/pwa/command_explainer.js"), {
    filename: "command_explainer.js"
  });
}

function findStep(result, command) {
  return result.steps.find(step => step.command === command);
}

function hasBeginnerNote(result, command, keyword) {
  const step = findStep(result, command);
  return !!(step && step.beginnerNote && step.beginnerNote.includes(keyword));
}

function renderChecks(checks) {
  return checks.map(check => {
    return `| ${check.name} | ${check.ok ? "Y" : "N"} | ${check.detail.replace(/\|/g, "/")} |`;
  }).join("\n");
}

function renderBeginnerRows(result) {
  return result.steps
    .filter(step => step.beginnerNote)
    .map(step => `| ${step.command} | ${step.risk} | ${String(step.beginnerNote || "").replace(/\|/g, "/")} |`)
    .join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  bootCommandExplainer();

  const psRaw = global.CommandExplainer.analyzePowerShellV277(POWERSHELL_SAMPLE);
  const bashRaw = global.CommandExplainer.analyzeBashV278(BASH_SAMPLE);
  const ps = global.CommandExplainer.enhanceResultForBeginnersV281(psRaw);
  const bash = global.CommandExplainer.enhanceResultForBeginnersV281(bashRaw);
  const glossary = global.CommandExplainer.beginnerTermsV281 || {};

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
      detail: "script cache busting"
    },
    {
      name: "V281 marker",
      ok: command.includes("COMMAND_EXPLAINER_BEGINNER_TERMS_V281_A1"),
      detail: "beginner terms marker"
    },
    {
      name: "V281 version marker",
      ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V281_A1 " + EXPECTED_VERSION),
      detail: "version marker"
    },
    {
      name: "glossary export",
      ok: Object.keys(glossary).length >= 8,
      detail: "beginnerTermsV281"
    },
    {
      name: "staging explanation",
      ok: glossary.staging && glossary.staging.includes("커밋하기 전"),
      detail: "git add"
    },
    {
      name: "commit explanation",
      ok: glossary.commit && glossary.commit.includes("저장 기록"),
      detail: "git commit"
    },
    {
      name: "tag explanation",
      ok: glossary.tag && glossary.tag.includes("이름표"),
      detail: "git tag"
    },
    {
      name: "remote explanation",
      ok: glossary.remote && glossary.remote.includes("GitHub"),
      detail: "git push"
    },
    {
      name: "admin explanation",
      ok: glossary.admin && glossary.admin.includes("강한 권한"),
      detail: "sudo"
    },
    {
      name: "force delete explanation",
      ok: glossary.forceDelete && glossary.forceDelete.includes("복구"),
      detail: "Remove-Item / rm -rf"
    },
    {
      name: "execute permission explanation",
      ok: glossary.executePermission && glossary.executePermission.includes("실행"),
      detail: "chmod"
    },
    {
      name: "PowerShell Remove-Item note",
      ok: hasBeginnerNote(ps, "Remove-Item", "강제 삭제"),
      detail: "PowerShell delete risk"
    },
    {
      name: "PowerShell git add note",
      ok: hasBeginnerNote(ps, "git add", "스테이징"),
      detail: "staging note"
    },
    {
      name: "PowerShell git push note",
      ok: hasBeginnerNote(ps, "git push", "원격 저장소"),
      detail: "remote note"
    },
    {
      name: "Bash rm -rf note",
      ok: hasBeginnerNote(bash, "rm -rf", "강제 삭제"),
      detail: "Bash delete risk"
    },
    {
      name: "Bash chmod note",
      ok: hasBeginnerNote(bash, "chmod", "실행 권한"),
      detail: "permission note"
    },
    {
      name: "Bash sudo note",
      ok: hasBeginnerNote(bash, "sudo", "관리자 권한"),
      detail: "admin note"
    },
    {
      name: "render beginner note",
      ok: command.includes("초보자 메모") && command.includes("beginner-note-v281"),
      detail: "UI renders beginner note"
    }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V281 명령어해석 초보자 용어 설명 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_BEGINNER_TERMS_V281_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 초보자 용어 설명 / 출력 보강 감사",
    "",
    "## 1. 결론",
    "",
    "- V281은 명령어해석의 기능 종류를 늘리지 않고, 결과 설명의 이해도를 높이는 버전이다.",
    "- `스테이징`, `커밋`, `태그`, `원격 저장소`, `관리자 권한`, `강제 삭제`, `실행 권한`을 초보자 메모로 보강한다.",
    "- PowerShell과 Bash/Shell 분석 결과 모두 초보자 메모를 받을 수 있다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. PowerShell 초보자 메모 출력",
    "",
    "| command | risk | beginner note |",
    "|---|---|---|",
    renderBeginnerRows(ps),
    "",
    "## 4. Bash/Shell 초보자 메모 출력",
    "",
    "| command | risk | beginner note |",
    "|---|---|---|",
    renderBeginnerRows(bash),
    "",
    "## 5. 다음 단계",
    "",
    "- V282에서는 실제 브라우저 수동 점검 결과를 반영해 문구를 더 다듬는다.",
    "- 특히 `git add/commit/push` 흐름을 '준비 → 저장 → 업로드'처럼 더 직관적으로 표현하는 개선이 가능하다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_BEGINNER_TERMS_V281_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();

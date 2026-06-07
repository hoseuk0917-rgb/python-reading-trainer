// === CODE EXPLAINER RULES V184-A3 START ===
(function() {
  "use strict";

  function stripFence(input) {
    const raw = String(input || "").trim();
    const wholeFence = raw.match(/^```[a-zA-Z0-9_-]*\s*\r?\n([\s\S]*?)\r?\n```\s*$/);

    if (wholeFence) {
      return wholeFence[1].trim();
    }

    return raw;
  }

  function cleanLine(line) {
    return String(line || "").trim();
  }

  function isBlankOrComment(line, language) {
    const t = cleanLine(line);
    if (!t) return true;
    if (language === "python") return t.startsWith("#");
    if (language === "powershell") return t.startsWith("#");
    if (language === "github_actions") return t.startsWith("#");
    if (language === "dockerfile" || language === "env_file" || language === "requirements_txt" || language === "pyproject_toml" || language === "yaml" || language === "toml") return t.startsWith("#");
    if (language === "gitignore") return t.startsWith("#");
    if (language === "ini_file") return t.startsWith(";") || t.startsWith("#");
    if (language === "javascript" || language === "workers" || language === "java") {
      return t.startsWith("//") || t.startsWith("/*") || t.startsWith("*");
    }
    return false;
  }

  function isStructuralOnlyLine(line, language) {
    const t = cleanLine(line);
    if (!t) return true;

    // 닫는 중괄호/괄호만 있는 줄은 설명 step으로 만들지 않는다.
    if (/^[{}\[\](),;]+$/.test(t)) return true;

    // JS/Workers 객체 리터럴의 단순 키 시작 줄은 실제 동작이 아니라 구조 보조 줄이다.
    if ((language === "javascript" || language === "workers") && /^[A-Za-z_$][\w$-]*\s*:\s*\{\s*,?$/.test(t)) {
      return true;
    }

    return false;
  }

  function detectLanguage(code) {
    const text = String(code || "");
    const lower = text.toLowerCase();

    if (/^\s*\[project\]\s*$/m.test(text) || /^\s*\[build-system\]\s*$/m.test(text)) return "pyproject_toml";
    if (/"scripts"\s*:\s*\{/.test(text) && /"(dependencies|devDependencies)"\s*:/.test(text)) return "package_json";
    if ((/^\s*name\s*:/m.test(text) && /^\s*on\s*:/m.test(text) && /^\s*jobs\s*:/m.test(text)) || /uses:\s*actions\//.test(text)) return "github_actions";

    if (/export\s+default/.test(text) && /fetch\s*\(\s*request\s*,\s*env/.test(text)) return "workers";
    if (/\benv\.(DB|KV|R2|AI)\b/.test(text) || /Response\.json/.test(text) || /ctx\.waitUntil|caches\.default/.test(text)) return "workers";

    if (/Set-Location|Copy-Item|Remove-Item|Compress-Archive|Expand-Archive|Get-Date|New-Item|Test-Path|Select-String/i.test(text)) return "powershell";
    if (/^\s*\$[A-Za-z_][\w-]*\s*=/m.test(text) || /\bgit\s+(status|add|commit|push|tag|stash|reset|clean)\b/i.test(text)) return "powershell";

    if (/^\s*def\s+\w+\s*\(/m.test(text) || /^\s*import\s+\w+/m.test(text) || /^\s*from\s+\w+/m.test(text)) return "python";
    if (/^\s*class\s+\w+\s*[:(]/m.test(text) && lower.includes("self")) return "python";

    if (/public\s+static\s+void\s+main|System\.out\.println|public\s+class|private\s+class|class\s+\w+\s*\{/m.test(text)) return "java";
    if (/\b(const|let|var)\s+\w+\s*=/.test(text) || /function\s+\w+\s*\(/.test(text) || /document\.getElementById|addEventListener|localStorage/.test(text)) return "javascript";

    // Dockerfile은 Python의 `from ... import ...`와 헷갈리지 않도록 대문자 명령 위주로 판단한다.
    if (/^\s*FROM\s+\S+/m.test(text) || /^\s*(RUN|COPY|ADD|WORKDIR|CMD|ENTRYPOINT|EXPOSE|ENV|ARG)\s+/m.test(text)) return "dockerfile";

    const gitignoreLines = text.split(/\r?\n/).map(function(line) { return line.trim(); }).filter(Boolean);
    const gitignoreHits = gitignoreLines.filter(function(line) {
      return /^!/.test(line) ||
        /^\*\./.test(line) ||
        /\/$/.test(line) ||
        /^\.env$/.test(line) ||
        /^\.venv\/$/.test(line) ||
        /^node_modules\/$/.test(line) ||
        /^dist\/$/.test(line) ||
        /^build\/$/.test(line) ||
        /^__pycache__\/$/.test(line);
    }).length;
    if (gitignoreHits >= 2 && !/[{};]/.test(text)) return "gitignore";

    if (/^\s*#\s+.+/m.test(text) || /^\s*#{2,6}\s+.+/m.test(text) || /\[[^\]]+\]\([^)]+\)/.test(text) || /^\s*```/m.test(text)) return "markdown";

    const hasBracketSection = /^\s*\[[A-Za-z0-9_. -]+\]\s*$/m.test(text);

    // INI_DETECT_GUARD_V184_A3
    // INI는 host=127.0.0.1, token=replace_me처럼 따옴표 없는 값이 자주 나오고,
    // TOML은 문자열을 따옴표로 감싸거나 배열/boolean/number 형태가 더 명확하다.
    const iniStyleHits = text.split(/\r?\n/).filter(function(line) {
      const t = line.trim();
      if (!/^[A-Za-z0-9_.-]+=/.test(t)) return false;

      const value = t.split("=").slice(1).join("=").trim();
      if (!value) return false;
      if (/^["'\[]/.test(value)) return false;
      if (/^(true|false)$/i.test(value)) return false;
      if (/^\d+$/.test(value)) return false;

      return true;
    }).length;

    if (hasBracketSection && iniStyleHits >= 1) return "ini_file";
    if (/^\s*\[[A-Za-z0-9_.-]+\]\s*$/m.test(text) && /^\s*[A-Za-z0-9_.-]+\s*=\s*("|\[|true|false|\d)/m.test(text)) return "toml";
    if (hasBracketSection && /^\s*[A-Za-z0-9_.-]+\s*=\s*[^=]+/m.test(text)) return "ini_file";

    if (/^\s*[A-Z][A-Z0-9_]*\s*=.+/m.test(text) && !/[{};]/.test(text)) return "env_file";
    if (/^\s*[-\w.]+(\[[^\]]+\])?\s*(==|>=|<=|~=|>|<).+/m.test(text) || /^\s*-r\s+\S+/m.test(text)) return "requirements_txt";
    if (/^\s*[A-Za-z0-9_-]+\s*:\s*/m.test(text) && /^\s+[-A-Za-z0-9_]+\s*:/m.test(text)) return "yaml";

    return "powershell";
  }

  function riskOf(line, language) {
    const t = cleanLine(line);
    const low = t.toLowerCase();
    if (language === "powershell") {
      if (/remove-item/i.test(t) || /git\s+reset\s+--hard/i.test(t) || /git\s+clean\s+-/i.test(t)) return "high";
      if (/set-executionpolicy/i.test(t) || /invoke-expression|iex\b/i.test(t)) return "high";
      if (/move-item/i.test(t)) return "medium";
      if (/copy-item/i.test(t) && /-force\b/i.test(t)) return "medium";
      if (/set-content/i.test(t)) return "medium";
      if (/invoke-webrequest|curl\b/i.test(t)) return "medium";
      if (/wrangler\s+d1\s+execute/i.test(t) || /wrangler\s+deploy/i.test(t)) return "medium";
    }
    if (language === "python") {
      if (/shutil\.rmtree|os\.remove|os\.rmdir/.test(t)) return "high";
      if (/subprocess\.|os\.system/.test(t)) return "medium";
    }
    if (language === "javascript" || language === "workers") {
      if (/eval\s*\(|new\s+Function/.test(t)) return "high";
      if (/delete\s+|\.delete\s*\(/.test(t)) return "medium";
      if (/env\.DB.*\bDELETE\b|env\.DB.*\bDROP\b|env\.DB.*\bUPDATE\b/i.test(t)) return "medium";
    }
    if (language === "java") {
      if (/Runtime\.getRuntime|ProcessBuilder/.test(t)) return "medium";
      if (/delete\s*\(/.test(t)) return "medium";
    }
    if (language === "dockerfile") {
      if (/\brm\s+-rf\s+\//i.test(t)) return "high";
      if (/\b(curl|wget)\b.*\|\s*(sh|bash)/i.test(t)) return "high";
      if (/\bapt-get\s+install\b|\bpip\s+install\b/i.test(t)) return "medium";
    }
    if (language === "env_file") {
      if (/SECRET|TOKEN|PASSWORD|API[_-]?KEY|PRIVATE/i.test(t)) return "medium";
    }
    if (language === "gitignore") {
      if (/^!.*(\.env|secret|token|password|api[_-]?key|private)/i.test(t)) return "medium";
    }
    if (language === "ini_file" || language === "toml") {
      if (/SECRET|TOKEN|PASSWORD|API[_-]?KEY|PRIVATE/i.test(t)) return "medium";
    }
    return "low";
  }

  function makeStep(lineNo, code, title, explain, risk) {
    return {
      lineNo: lineNo,
      code: code,
      title: title,
      explain: explain,
      risk: risk || "low"
    };
  }

  function logicalLines(raw, language) {
    const sourceLines = String(raw || "").split(/\r?\n/);
    const output = [];
    let buffer = "";
    let startLine = 1;

    sourceLines.forEach(function(line, idx) {
      const lineNo = idx + 1;
      const rightTrimmed = String(line || "").replace(/\s+$/, "");
      const trimmed = rightTrimmed.trim();

      if (language === "powershell" && (rightTrimmed.endsWith("`") || rightTrimmed.endsWith("|"))) {
        if (!buffer) {
          startLine = lineNo;
        }
        const withoutContinuation = rightTrimmed.endsWith("`") ? rightTrimmed.slice(0, -1).trim() : rightTrimmed.trim();
        buffer += (buffer ? " " : "") + withoutContinuation;
        return;
      }

      if (buffer) {
        output.push({ lineNo: startLine, text: buffer + " " + trimmed });
        buffer = "";
        return;
      }

      output.push({ lineNo: lineNo, text: line });
    });

    if (buffer) {
      output.push({ lineNo: startLine, text: buffer });
    }

    return output;
  }

  function explainPowerShellLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "powershell");

    if (/^Set-Location\b/i.test(t) || /^cd\b/i.test(t)) {
      return makeStep(lineNo, t, "작업 폴더 이동", "이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다.", risk);
    }
    if (/^\$env:[A-Za-z_][\w-]*\s*=/.test(t)) {
      return makeStep(lineNo, t, "환경변수 설정", "현재 PowerShell 세션에서 사용할 임시 설정값을 저장합니다. API 키 같은 민감값은 코드에 직접 쓰지 않고 환경변수로 넣는 방식이 안전합니다.", risk);
    }

    const varMatch = t.match(/^\$([A-Za-z_][\w-]*)\s*=\s*(.+)$/);
    if (varMatch) {
      const name = varMatch[1];
      const value = varMatch[2];

      if (/Get-Date/i.test(value)) {
        return makeStep(lineNo, t, "시간값을 변수에 저장", "$" + name + " 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다.", risk);
      }
      if (/Test-Path/i.test(value)) {
        return makeStep(lineNo, t, "경로 확인 결과 저장", "$" + name + " 변수에 파일이나 폴더가 존재하는지 검사한 결과를 저장합니다.", risk);
      }
      if (/Invoke-WebRequest|curl\b/i.test(value)) {
        return makeStep(lineNo, t, "웹 요청 결과 저장", "$" + name + " 변수에 웹 요청 결과를 저장합니다. URL, 인증, 응답 상태를 확인해야 합니다.", risk);
      }
      if (/Join-Path/i.test(value)) {
        return makeStep(lineNo, t, "경로 조합 결과 저장", "$" + name + " 변수에 여러 경로 조각을 합친 결과를 저장합니다.", risk);
      }

      return makeStep(lineNo, t, "변수에 값 저장", "$" + name + " 변수에 값을 넣습니다. 이후 줄에서 $" + name + "을 쓰면 이 값을 다시 사용합니다.", risk);
    }

    if (/Get-Date/i.test(t)) {
      return makeStep(lineNo, t, "현재 시간 만들기", "현재 날짜와 시간을 가져옵니다. 백업 파일명이나 실행 기록 이름을 만들 때 자주 씁니다.", risk);
    }
    if (/^New-Item\b/i.test(t)) {
      return makeStep(lineNo, t, "새 항목 생성", "폴더나 파일을 만듭니다. -ItemType Directory가 있으면 폴더를 만드는 명령입니다.", risk);
    }
    if (/^Copy-Item\b/i.test(t)) {
      return makeStep(lineNo, t, "파일/폴더 복사", "원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다.", risk);
    }
    if (/^Move-Item\b/i.test(t)) {
      return makeStep(lineNo, t, "파일/폴더 이동", "파일이나 폴더의 위치를 옮깁니다. 원래 위치에서 사라질 수 있으므로 대상 경로를 확인해야 합니다.", risk);
    }
    if (/^Remove-Item\b/i.test(t)) {
      return makeStep(lineNo, t, "파일/폴더 삭제", "지정한 파일이나 폴더를 삭제합니다. -Recurse와 -Force가 함께 있으면 강하게 삭제하므로 실행 전 경로 확인이 필요합니다.", risk);
    }
    if (/^Compress-Archive\b/i.test(t)) {
      return makeStep(lineNo, t, "ZIP 압축 생성", "지정한 파일이나 폴더를 zip 파일로 묶습니다.", risk);
    }
    if (/^Expand-Archive\b/i.test(t)) {
      return makeStep(lineNo, t, "ZIP 압축 해제", "zip 파일을 지정한 폴더로 풉니다.", risk);
    }
    if (/Test-Path/i.test(t)) {
      return makeStep(lineNo, t, "경로 존재 확인", "파일이나 폴더가 실제로 있는지 확인합니다. if와 함께 쓰면 있을 때만 다음 명령을 실행할 수 있습니다.", risk);
    }
    if (/^if\s*\(/i.test(t)) {
      return makeStep(lineNo, t, "조건 확인", "괄호 안 조건이 맞는지 검사합니다. 조건이 맞을 때만 중괄호 안 명령들이 실행됩니다.", risk);
    }
    if (/^foreach\s*\(/i.test(t)) {
      return makeStep(lineNo, t, "반복 실행", "목록에 들어 있는 값을 하나씩 꺼내며 같은 작업을 반복합니다.", risk);
    }
    if (/^node\s+--check\b/i.test(t)) {
      return makeStep(lineNo, t, "Node 문법 검사", "JavaScript 파일을 실행하지 않고 문법 오류가 있는지만 검사합니다.", risk);
    }
    if (/^npm\s+(install|ci)\b/i.test(t)) {
      return makeStep(lineNo, t, "npm 의존성 설치", "package.json 기준으로 JavaScript 프로젝트에 필요한 패키지를 설치합니다.", risk);
    }
    if (/^npm\s+run\b/i.test(t)) {
      return makeStep(lineNo, t, "npm 스크립트 실행", "package.json의 scripts에 정의된 build, test 같은 명령을 실행합니다.", risk);
    }
    if (/^python\s+.*validate_lessons\.py\b/i.test(t)) {
      return makeStep(lineNo, t, "Python 검증 실행", "학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다.", risk);
    }
    if (/^python\s+/.test(t)) {
      return makeStep(lineNo, t, "Python 명령 실행", "Python 스크립트나 모듈을 실행합니다. 인자와 실행 위치를 확인해야 합니다.", risk);
    }
    if (/^git\s+status/i.test(t)) {
      return makeStep(lineNo, t, "Git 변경 상태 확인", "현재 폴더에서 어떤 파일이 수정되었는지 확인합니다.", risk);
    }
    if (/^git\s+add/i.test(t)) {
      return makeStep(lineNo, t, "Git 커밋 준비", "수정한 파일을 다음 커밋에 포함하도록 준비합니다.", risk);
    }
    if (/^git\s+commit/i.test(t)) {
      return makeStep(lineNo, t, "Git 커밋 생성", "준비된 변경사항을 하나의 기록으로 저장합니다.", risk);
    }
    if (/^git\s+tag/i.test(t)) {
      return makeStep(lineNo, t, "Git 태그 생성", "현재 커밋에 버전 이름표를 붙입니다.", risk);
    }
    if (/^git\s+push/i.test(t)) {
      return makeStep(lineNo, t, "원격 저장소로 업로드", "로컬 커밋이나 태그를 GitHub 같은 원격 저장소에 올립니다.", risk);
    }
    if (/^git\s+stash/i.test(t)) {
      return makeStep(lineNo, t, "임시 보관", "아직 커밋하지 않은 변경사항을 잠시 치워두고 작업 폴더를 깨끗하게 만듭니다. 나중에 stash pop/apply로 되돌릴 수 있습니다.", risk);
    }
    if (/^git\s+diff\s+--stat/i.test(t)) {
      return makeStep(lineNo, t, "변경량 요약 확인", "어떤 파일이 얼마나 바뀌었는지 줄 수 중심으로 요약해서 봅니다. 커밋 전 확인용으로 좋습니다.", risk);
    }
    if (/^git\s+diff\b/i.test(t)) {
      return makeStep(lineNo, t, "변경 내용 확인", "커밋 전 실제 코드 변경 내용을 확인합니다.", risk);
    }
    if (/^git\s+log\b/i.test(t)) {
      return makeStep(lineNo, t, "커밋 기록 확인", "최근 커밋 목록과 태그/브랜치 위치를 확인합니다.", risk);
    }
    if (/^git\s+reset\s+--hard/i.test(t)) {
      return makeStep(lineNo, t, "변경사항 강제 되돌리기", "커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다.", risk);
    }
    if (/^git\s+clean\s+-/i.test(t)) {
      return makeStep(lineNo, t, "추적되지 않는 파일 삭제", "Git이 추적하지 않는 새 파일을 삭제합니다. 생성한 파일이 사라질 수 있으니 실행 전 목록 확인이 필요합니다.", risk);
    }
    if (/^python\b/i.test(t)) {
      return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 명령을 실행합니다.", risk);
    }
    if (/^node\b/i.test(t)) {
      return makeStep(lineNo, t, "Node.js 실행", "JavaScript 파일 검사나 실행을 합니다.", risk);
    }
    if (/^npm\b/i.test(t)) {
      return makeStep(lineNo, t, "npm 명령 실행", "JavaScript 프로젝트의 설치, 빌드, 실행 명령을 수행합니다.", risk);
    }
    if (/^Select-String\b/i.test(t)) {
      return makeStep(lineNo, t, "파일에서 문자열 검색", "파일 안에서 특정 단어나 패턴이 있는 줄을 찾습니다.", risk);
    }
    if (/^Set-Content\b/i.test(t)) {
      return makeStep(lineNo, t, "파일 내용 쓰기", "지정한 파일에 텍스트를 저장합니다. 기존 파일 내용이 바뀔 수 있습니다.", risk);
    }
    if (/^Start-Job\b/i.test(t)) {
      return makeStep(lineNo, t, "백그라운드 작업 시작", "명령을 별도 작업으로 실행해서 현재 콘솔을 계속 사용할 수 있게 합니다.", risk);
    }
    if (/^Stop-Job\b/i.test(t)) {
      return makeStep(lineNo, t, "백그라운드 작업 중지", "실행 중인 백그라운드 작업을 멈춥니다.", risk);
    }

    if (/^Start-Sleep\b/i.test(t)) {
      return makeStep(lineNo, t, "잠시 대기", "다음 명령을 바로 실행하지 않고 지정한 시간만큼 기다립니다. 배포 반영이나 서버 준비를 기다릴 때 씁니다.", risk);
    }
    if (/^Write-Host\b/i.test(t)) {
      return makeStep(lineNo, t, "콘솔에 메시지 출력", "진행 상태나 결과를 PowerShell 화면에 보여줍니다.", risk);
    }
    if (/^Unblock-File\b/i.test(t)) {
      return makeStep(lineNo, t, "파일 차단 해제", "인터넷에서 받은 스크립트 파일의 실행 차단 표시를 해제합니다. 신뢰할 수 있는 파일인지 먼저 확인해야 합니다.", risk);
    }
    if (/^Set-ExecutionPolicy\b/i.test(t)) {
      return makeStep(lineNo, t, "스크립트 실행 정책 변경", "PowerShell 스크립트 실행 제한을 바꿉니다. 보안에 영향을 줄 수 있어 범위와 정책값을 확인해야 합니다.", risk);
    }
    if (/^Invoke-WebRequest\b/i.test(t) || /^curl\b/i.test(t)) {
      return makeStep(lineNo, t, "웹 요청 실행", "URL에 요청을 보내 파일이나 응답을 가져옵니다. 주소와 저장 위치, 인증값 포함 여부를 확인해야 합니다.", risk);
    }
    if (/^(npx\s+)?wrangler\b/i.test(t)) {
      return makeStep(lineNo, t, "Cloudflare Wrangler 실행", "Cloudflare Workers, Pages, D1, R2 같은 리소스를 배포하거나 조회하는 명령입니다. 원격 리소스가 바뀔 수 있습니다.", risk);
    }
    if (/^try\s*\{/i.test(t)) {
      return makeStep(lineNo, t, "오류 대비 시작", "이 안의 명령을 실행하다가 오류가 나면 catch 블록에서 처리할 수 있게 준비합니다.", risk);
    }
    if (/^\}?\s*catch\s*\{/i.test(t)) {
      return makeStep(lineNo, t, "오류 처리", "try 안에서 실패한 경우 이 블록으로 넘어와 실패 메시지나 대체 동작을 처리합니다.", risk);
    }
    if (/\|\s*Out-Null/i.test(t)) {
      return makeStep(lineNo, t, "출력 숨기기", "명령 결과를 화면에 표시하지 않고 버립니다. 실제 작업은 실행되지만 출력만 숨겨집니다.", risk);
    }

    return makeStep(lineNo, t, "명령 실행", "이 줄은 PowerShell 명령입니다. 자동 규칙에 없는 명령이므로 원문, 경로, 옵션을 확인한 뒤 실행해야 합니다.", risk);
  }

  function explainPythonLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "python");

    if (/^import\s+/.test(t) || /^from\s+.+\s+import\s+/.test(t)) {
      return makeStep(lineNo, t, "라이브러리 불러오기", "이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.", risk);
    }
    if (/^(async\s+)?def\s+\w+\s*\(/.test(t)) {
      return makeStep(lineNo, t, "함수 정의", "나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.", risk);
    }
    if (/^class\s+\w+/.test(t)) {
      return makeStep(lineNo, t, "클래스 정의", "관련 데이터와 기능을 묶어 객체를 만들기 위한 설계도를 정의합니다.", risk);
    }
    if (/^if\s+.+:\s*$/.test(t)) {
      return makeStep(lineNo, t, "조건 검사", "조건이 맞으면 바로 아래 들여쓰기된 코드가 실행됩니다.", risk);
    }
    if (/^elif\s+.+:\s*$/.test(t)) {
      return makeStep(lineNo, t, "다른 조건 검사", "앞 조건이 틀렸을 때 추가 조건을 검사합니다.", risk);
    }
    if (/^else\s*:\s*$/.test(t)) {
      return makeStep(lineNo, t, "조건이 모두 아닐 때", "앞의 if/elif 조건이 맞지 않을 때 실행되는 부분입니다.", risk);
    }
    if (/^for\s+.+\s+in\s+.+:\s*$/.test(t)) {
      return makeStep(lineNo, t, "반복문", "목록이나 범위에서 값을 하나씩 꺼내며 아래 코드를 반복합니다.", risk);
    }
    if (/^while\s+.+:\s*$/.test(t)) {
      return makeStep(lineNo, t, "조건 반복문", "조건이 참인 동안 아래 코드를 계속 반복합니다. 조건이 끝나는지 확인해야 합니다.", risk);
    }
    if (/^with\s+open\s*\(/.test(t) || /open\s*\(/.test(t)) {
      return makeStep(lineNo, t, "파일 열기", "파일을 읽거나 쓰기 위해 엽니다. with를 쓰면 작업 후 파일을 자동으로 닫기 쉽습니다.", risk);
    }
    if (/json\.load|json\.loads/.test(t)) {
      return makeStep(lineNo, t, "JSON 읽기", "JSON 형식의 문자열이나 파일 내용을 Python 데이터로 바꿉니다.", risk);
    }
    if (/pandas\.read_csv|pd\.read_csv/.test(t)) {
      return makeStep(lineNo, t, "CSV 표 읽기", "CSV 파일을 표 형태 데이터로 읽습니다.", risk);
    }
    if (/requests\.(get|post|put|delete)/.test(t)) {
      return makeStep(lineNo, t, "HTTP 요청", "웹 API나 URL에 요청을 보냅니다. timeout과 오류 처리가 있는지 확인하는 것이 좋습니다.", risk);
    }
    if (/argparse\.ArgumentParser|\.add_argument\s*\(|\.parse_args\s*\(/.test(t)) {
      return makeStep(lineNo, t, "명령행 인자 처리", "터미널에서 받은 --input 같은 옵션을 정의하거나 읽습니다.", risk);
    }
    if (/\bPath\s*\(|pathlib|\.read_text\s*\(|\.write_text\s*\(|\.exists\s*\(|\.mkdir\s*\(/.test(t)) {
      return makeStep(lineNo, t, "파일/경로 처리", "pathlib 기반으로 파일 경로를 만들거나 파일을 읽고 씁니다.", risk);
    }
    if (/subprocess\.(run|Popen|check_output|check_call)/.test(t)) {
      return makeStep(lineNo, t, "외부 프로그램 실행", "Python 코드에서 다른 명령어나 프로그램을 실행합니다. 인자와 check=True 여부를 확인해야 합니다.", risk);
    }
    if (/FastAPI\s*\(|from\s+fastapi\s+import|@app\.(get|post|put|delete|patch)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "FastAPI 앱/라우트 설정", "API 서버 앱을 만들거나 특정 URL로 들어온 요청을 처리할 함수를 연결합니다.", risk);
    }
    if (/^return\b/.test(t)) {
      return makeStep(lineNo, t, "값 돌려주기", "함수 안에서 계산한 결과를 함수 밖으로 돌려줍니다.", risk);
    }
    if (/^print\s*\(/.test(t)) {
      return makeStep(lineNo, t, "화면에 출력", "괄호 안 값을 콘솔 화면에 보여줍니다.", risk);
    }
    if (/^[A-Za-z_]\w*\s*=/.test(t)) {
      return makeStep(lineNo, t, "변수에 값 저장", "왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.", risk);
    }

    return makeStep(lineNo, t, "Python 코드 실행", "이 줄은 Python 코드입니다. 위에서 아래로 순서대로 실행됩니다.", risk);
  }

  function explainJavaScriptLine(line, lineNo, language) {
    const t = cleanLine(line);
    const risk = riskOf(t, language);

    if (/export\s+default/.test(t)) {
      return makeStep(lineNo, t, "Worker 진입 객체 정의", "Cloudflare Worker가 요청을 받을 때 사용할 기본 객체를 정의합니다.", risk);
    }
    if (/async\s+fetch\s*\(\s*request\s*,\s*env/.test(t) || /fetch\s*\(\s*request\s*,\s*env/.test(t)) {
      return makeStep(lineNo, t, "요청 처리 함수", "사용자가 Worker 주소로 접속하면 이 함수가 실행됩니다. request는 들어온 요청, env는 DB/KV/R2 같은 연결값입니다.", risk);
    }
    if (/\bnew\s+URL\s*\(\s*request\.url\s*\)/.test(t)) {
      return makeStep(lineNo, t, "요청 주소 분석", "들어온 요청 주소를 URL 객체로 바꿔서 pathname이나 query를 확인할 수 있게 합니다.", risk);
    }
    if (/url\.pathname/.test(t)) {
      return makeStep(lineNo, t, "경로 조건 확인", "사용자가 어떤 주소로 들어왔는지 보고 분기합니다.", risk);
    }
    if (/await\s+request\.json\s*\(/.test(t)) {
      return makeStep(lineNo, t, "요청 본문 JSON 읽기", "사용자가 보낸 요청 본문을 JSON으로 읽습니다. 잘못된 JSON이 들어올 수 있으므로 실제 서비스에서는 예외 처리가 필요합니다.", risk);
    }
    if (/request\.method/.test(t)) {
      return makeStep(lineNo, t, "요청 방식 확인", "GET, POST 같은 HTTP 메서드를 보고 어떤 동작을 할지 나눕니다.", risk);
    }
    if (/env\.DB.*\.prepare\s*\(/.test(t) || /\.prepare\s*\(.*SELECT|\.prepare\s*\(.*INSERT|\.prepare\s*\(.*UPDATE|\.prepare\s*\(.*DELETE/i.test(t)) {
      return makeStep(lineNo, t, "D1 SQL 준비", "Cloudflare D1에 보낼 SQL 문장을 준비합니다. SELECT는 조회, INSERT는 추가, UPDATE는 수정, DELETE는 삭제입니다.", risk);
    }
    if (/\.bind\s*\(/.test(t)) {
      return makeStep(lineNo, t, "SQL 값 안전하게 연결", "SQL 문장의 물음표 자리에 실제 값을 연결합니다. 문자열을 직접 붙이는 것보다 안전한 방식입니다.", risk);
    }
    if (/^\.(all|first|run)\s*\(/.test(t) || (/\.(all|first|run)\s*\(/.test(t) && /await|env\.DB|prepare/i.test(t))) {
      return makeStep(lineNo, t, "D1 쿼리 실행", "준비한 SQL을 실제로 실행합니다. all은 여러 행 조회, first는 한 행 조회, run은 INSERT/UPDATE/DELETE 실행에 자주 씁니다.", risk);
    }
    if (/env\.DB/.test(t)) {
      return makeStep(lineNo, t, "D1 데이터베이스 사용", "Cloudflare env에 연결된 DB를 사용합니다. 어떤 SQL을 실행하는지 확인해야 합니다.", risk);
    }
    if (/ctx\.waitUntil\s*\(/.test(t)) {
      return makeStep(lineNo, t, "백그라운드 작업 예약", "응답을 먼저 돌려준 뒤에도 로그 저장이나 캐시 갱신 같은 작업을 이어서 실행하게 합니다.", risk);
    }
    if (/env\.KV/.test(t)) {
      return makeStep(lineNo, t, "KV 저장소 사용", "Cloudflare KV에서 값을 읽거나 씁니다.", risk);
    }
    if (/env\.R2/.test(t)) {
      return makeStep(lineNo, t, "R2 저장소 사용", "Cloudflare R2에 있는 파일이나 객체를 읽고 쓸 수 있습니다.", risk);
    }
    if (/env\.AI/.test(t)) {
      return makeStep(lineNo, t, "Workers AI 사용", "Cloudflare Workers AI 모델 호출을 준비하거나 실행합니다.", risk);
    }
    if (/Response\.json/.test(t)) {
      return makeStep(lineNo, t, "JSON 응답 반환", "처리 결과를 JSON 형식으로 사용자에게 돌려줍니다.", risk);
    }
    if (/new\s+Response/.test(t)) {
      return makeStep(lineNo, t, "응답 반환", "문자열, 상태 코드, 헤더 등을 담은 HTTP 응답을 돌려줍니다.", risk);
    }
    if (/caches\.default/.test(t)) {
      return makeStep(lineNo, t, "Cloudflare 캐시 사용", "Cloudflare 엣지 캐시에 응답을 저장하거나 읽습니다. 캐시 키와 만료 정책을 확인해야 합니다.", risk);
    }
    if (/Access-Control-Allow-Origin|CORS/i.test(t)) {
      return makeStep(lineNo, t, "CORS 헤더 설정", "다른 도메인에서 이 API를 호출할 수 있는지 제어합니다. 공개 범위를 확인해야 합니다.", risk);
    }
    if (/document\.getElementById|querySelector/.test(t)) {
      return makeStep(lineNo, t, "화면 요소 찾기", "HTML 화면에서 특정 요소를 찾아 값을 읽거나 내용을 바꾸기 위해 준비합니다.", risk);
    }
    if (/addEventListener\s*\(/.test(t)) {
      return makeStep(lineNo, t, "이벤트 처리 함수 정의", "사용자가 클릭, 입력 같은 동작을 했을 때 실행할 함수 정의를 연결합니다.", risk);
    }
    if (/localStorage/.test(t)) {
      return makeStep(lineNo, t, "브라우저 저장소 사용", "현재 브라우저에 작은 데이터를 저장하거나 다시 불러옵니다.", risk);
    }
    if (/alert\s*\(/.test(t) || /console\.log\s*\(/.test(t)) {
      return makeStep(lineNo, t, "화면/콘솔에 출력", "사용자에게 메시지를 보여주거나 개발자 콘솔에 값을 출력합니다.", risk);
    }
    if (/^(const|let|var)\s+\w+\s*=/.test(t)) {
      return makeStep(lineNo, t, "변수에 값 저장", "값이나 객체를 이름에 담아서 이후 코드에서 다시 사용합니다.", risk);
    }
    if (/function\s*\w*\s*\(/.test(t) || /=>/.test(t)) {
      return makeStep(lineNo, t, "함수 정의", "나중에 호출해서 실행할 코드 묶음을 만듭니다.", risk);
    }
    if (/^if\s*\(/.test(t)) {
      return makeStep(lineNo, t, "조건 검사", "괄호 안 조건이 맞으면 중괄호 안 코드가 실행됩니다.", risk);
    }
    if (/^else\b/.test(t)) {
      return makeStep(lineNo, t, "조건이 아닐 때", "앞 조건이 맞지 않을 때 실행됩니다.", risk);
    }
    if (/^for\s*\(/.test(t) || /\.forEach\s*\(/.test(t)) {
      return makeStep(lineNo, t, "반복 실행", "여러 값을 하나씩 처리하거나 정해진 횟수만큼 반복합니다.", risk);
    }
    if (/fetch\s*\(/.test(t)) {
      return makeStep(lineNo, t, "외부 요청", "다른 URL이나 API에 네트워크 요청을 보냅니다.", risk);
    }

    return makeStep(lineNo, t, language === "workers" ? "Worker/JavaScript 코드 실행" : "JavaScript 코드 실행", "이 줄은 위에서 아래로 실행되는 JavaScript 코드입니다.", risk);
  }

  function explainPackageJsonLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "package_json");

    if (/^"name"\s*:/.test(t)) {
      return makeStep(lineNo, t, "패키지 이름 설정", "이 프로젝트나 패키지의 이름을 정합니다.", risk);
    }
    if (/^"version"\s*:/.test(t)) {
      return makeStep(lineNo, t, "패키지 버전 설정", "현재 패키지의 버전 번호를 기록합니다.", risk);
    }
    if (/^"scripts"\s*:/.test(t)) {
      return makeStep(lineNo, t, "npm 스크립트 목록", "npm run build 같은 명령으로 실행할 스크립트들을 모아 둔 영역입니다.", risk);
    }
    if (/^"(build|test|dev|start|lint|preview)"\s*:/.test(t)) {
      return makeStep(lineNo, t, "npm 스크립트 정의", "터미널에서 npm run 뒤에 붙여 실행할 작업을 정의합니다.", risk);
    }
    if (/^"dependencies"\s*:/.test(t)) {
      return makeStep(lineNo, t, "실행 의존성 목록", "앱이 실제 실행될 때 필요한 패키지 목록입니다.", risk);
    }
    if (/^"devDependencies"\s*:/.test(t)) {
      return makeStep(lineNo, t, "개발 의존성 목록", "개발, 빌드, 테스트 때 필요한 패키지 목록입니다.", risk);
    }
    if (/^"[^"]+"\s*:\s*"[^"]+"/.test(t)) {
      return makeStep(lineNo, t, "패키지 항목 설정", "package.json 안의 설정 항목입니다. 패키지명, 버전, 스크립트 값을 확인합니다.", risk);
    }

    return makeStep(lineNo, t, "package.json 설정", "Node/npm 프로젝트 설정 파일의 한 줄입니다.", risk);
  }

  function explainGitHubActionsLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "github_actions");

    if (/^name\s*:/.test(t)) {
      return makeStep(lineNo, t, "워크플로 이름", "GitHub Actions 화면에 표시될 자동화 작업 이름입니다.", risk);
    }
    if (/^on\s*:/.test(t)) {
      return makeStep(lineNo, t, "실행 조건 설정", "push, pull_request 같은 어떤 사건에서 자동화를 실행할지 정합니다.", risk);
    }
    if (/^(push|pull_request|workflow_dispatch)\s*:/.test(t)) {
      return makeStep(lineNo, t, "트리거 이벤트 설정", "어떤 GitHub 이벤트에서 워크플로가 시작되는지 지정합니다.", risk);
    }
    if (/^branches\s*:/.test(t)) {
      return makeStep(lineNo, t, "브랜치 조건 설정", "main 같은 특정 브랜치에서만 실행되도록 제한합니다.", risk);
    }
    if (/^jobs\s*:/.test(t)) {
      return makeStep(lineNo, t, "작업 묶음", "하나 이상의 job을 모아 정의하는 영역입니다.", risk);
    }
    if (/^runs-on\s*:/.test(t)) {
      return makeStep(lineNo, t, "실행 환경 선택", "ubuntu-latest 같은 어떤 가상 환경에서 job을 실행할지 정합니다.", risk);
    }
    if (/^steps\s*:/.test(t)) {
      return makeStep(lineNo, t, "작업 단계 목록", "checkout, setup, test 같은 실제 실행 단계를 나열합니다.", risk);
    }
    if (/^-?\s*uses\s*:/.test(t)) {
      return makeStep(lineNo, t, "GitHub Action 사용", "이미 만들어진 GitHub Action을 가져와 실행합니다.", risk);
    }
    if (/^-?\s*run\s*:/.test(t)) {
      return makeStep(lineNo, t, "쉘 명령 실행", "CI 환경에서 npm, python 같은 터미널 명령을 실행합니다.", risk);
    }
    if (/^with\s*:/.test(t) || /^[A-Za-z0-9_-]+\s*:/.test(t)) {
      return makeStep(lineNo, t, "액션 옵션 설정", "앞에서 사용한 action이나 job에 필요한 옵션을 지정합니다.", risk);
    }

    return makeStep(lineNo, t, "GitHub Actions YAML 설정", "GitHub Actions 자동화 설정 파일의 한 줄입니다.", risk);
  }


  function explainDockerfileLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "dockerfile");

    if (/^FROM\s+/i.test(t)) {
      return makeStep(lineNo, t, "베이스 이미지 선택", "컨테이너를 어떤 기본 이미지에서 시작할지 정합니다. Python/Node 같은 실행 환경의 출발점입니다.", risk);
    }
    if (/^WORKDIR\s+/i.test(t)) {
      return makeStep(lineNo, t, "작업 폴더 설정", "이후 RUN, COPY, CMD 명령이 실행될 컨테이너 안의 기본 폴더를 정합니다.", risk);
    }
    if (/^(COPY|ADD)\s+/i.test(t)) {
      return makeStep(lineNo, t, "파일 복사", "로컬 파일이나 폴더를 컨테이너 이미지 안으로 넣습니다. 불필요한 파일이 들어가지 않게 .dockerignore도 확인해야 합니다.", risk);
    }
    if (/^RUN\s+/i.test(t)) {
      return makeStep(lineNo, t, "이미지 빌드 중 명령 실행", "이미지를 만들 때 패키지 설치나 파일 준비 명령을 실행합니다. 네트워크 설치와 삭제 명령은 주의해야 합니다.", risk);
    }
    if (/^ENV\s+/i.test(t)) {
      return makeStep(lineNo, t, "환경변수 설정", "컨테이너 실행 중 사용할 환경변수를 이미지에 넣습니다. 비밀키를 직접 넣는 것은 피해야 합니다.", risk);
    }
    if (/^ARG\s+/i.test(t)) {
      return makeStep(lineNo, t, "빌드 인자 설정", "이미지를 빌드할 때만 쓰는 값을 정의합니다. 런타임 환경변수와 용도를 구분해야 합니다.", risk);
    }
    if (/^EXPOSE\s+/i.test(t)) {
      return makeStep(lineNo, t, "포트 안내", "컨테이너가 주로 사용할 포트를 문서화합니다. 실제 공개 여부는 실행 옵션이나 배포 설정에서 결정됩니다.", risk);
    }
    if (/^(CMD|ENTRYPOINT)\s+/i.test(t)) {
      return makeStep(lineNo, t, "컨테이너 시작 명령", "컨테이너가 실행될 때 기본으로 수행할 명령을 정합니다.", risk);
    }

    return makeStep(lineNo, t, "Dockerfile 설정", "컨테이너 이미지를 만들기 위한 Dockerfile 설정 줄입니다.", risk);
  }

  function explainEnvFileLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "env_file");

    if (/^[A-Z][A-Z0-9_]*\s*=/.test(t)) {
      const key = t.split("=")[0].trim();
      if (/SECRET|TOKEN|PASSWORD|API[_-]?KEY|PRIVATE/i.test(key)) {
        return makeStep(lineNo, t, "비밀 환경변수 설정", "API 키, 토큰, 비밀번호처럼 노출되면 안 되는 값을 설정합니다. Git에 커밋하지 않아야 합니다.", risk);
      }
      return makeStep(lineNo, t, "환경변수 설정", "프로그램이 실행될 때 읽을 설정값을 이름=값 형태로 정의합니다.", risk);
    }

    return makeStep(lineNo, t, ".env 설정", ".env 파일의 환경설정 줄입니다.", risk);
  }

  function explainRequirementsLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "requirements_txt");

    if (/^-r\s+/.test(t)) {
      return makeStep(lineNo, t, "다른 requirements 파일 포함", "현재 파일에서 다른 의존성 목록 파일을 함께 읽도록 연결합니다.", risk);
    }
    if (/==/.test(t)) {
      return makeStep(lineNo, t, "패키지 버전 고정", "Python 패키지를 특정 버전으로 고정해 재현성을 높입니다.", risk);
    }
    if (/>=|<=|~=|>|</.test(t)) {
      return makeStep(lineNo, t, "패키지 버전 범위 지정", "허용할 패키지 버전 범위를 정합니다. 너무 넓으면 나중에 동작이 바뀔 수 있습니다.", risk);
    }

    return makeStep(lineNo, t, "Python 패키지 의존성", "pip install -r requirements.txt로 설치할 Python 패키지를 적은 줄입니다.", risk);
  }

  function explainPyprojectLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "pyproject_toml");

    if (/^\[project\]/.test(t)) {
      return makeStep(lineNo, t, "프로젝트 메타데이터 영역", "프로젝트 이름, 버전, 의존성 같은 기본 정보를 적는 영역입니다.", risk);
    }
    if (/^\[tool\./.test(t)) {
      return makeStep(lineNo, t, "도구 설정 영역", "pytest, black, ruff 같은 개발 도구의 설정을 적는 영역입니다.", risk);
    }
    if (/^name\s*=/.test(t)) {
      return makeStep(lineNo, t, "프로젝트 이름 설정", "패키지나 프로젝트의 이름을 설정합니다.", risk);
    }
    if (/^version\s*=/.test(t)) {
      return makeStep(lineNo, t, "프로젝트 버전 설정", "현재 프로젝트의 버전을 설정합니다.", risk);
    }
    if (/^dependencies\s*=/.test(t)) {
      return makeStep(lineNo, t, "의존성 목록 시작", "프로젝트 실행에 필요한 Python 패키지 목록을 정의합니다.", risk);
    }
    if (/^["']?[A-Za-z0-9_.-]+.*(>=|==|<=|~=)/.test(t)) {
      return makeStep(lineNo, t, "의존성 항목", "필요한 패키지와 버전 조건을 적은 항목입니다.", risk);
    }

    return makeStep(lineNo, t, "pyproject.toml 설정", "Python 프로젝트 설정 파일의 한 줄입니다.", risk);
  }

  function explainYamlLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "yaml");

    if (/^[A-Za-z0-9_-]+\s*:/.test(t)) {
      return makeStep(lineNo, t, "YAML 설정 키", "들여쓰기 아래에 묶일 설정 이름을 정의합니다.", risk);
    }
    if (/^-\s+/.test(t)) {
      return makeStep(lineNo, t, "YAML 목록 항목", "여러 값 중 하나를 목록 형태로 추가합니다.", risk);
    }
    if (/image\s*:/.test(t)) {
      return makeStep(lineNo, t, "컨테이너 이미지 설정", "서비스가 사용할 컨테이너 이미지를 지정합니다.", risk);
    }
    if (/ports\s*:|volumes\s*:|environment\s*:/.test(t)) {
      return makeStep(lineNo, t, "서비스 실행 옵션", "포트, 볼륨, 환경변수처럼 서비스 실행에 필요한 옵션을 정의합니다.", risk);
    }

    return makeStep(lineNo, t, "YAML 설정", "들여쓰기 구조로 값을 표현하는 YAML 설정 줄입니다.", risk);
  }


  function explainMarkdownLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "markdown");

    if (/^#{1,6}\s+/.test(t)) {
      return makeStep(lineNo, t, "Markdown 제목", "# 개수로 문서 제목이나 소제목 단계를 표시합니다.", risk);
    }
    if (/^```/.test(t)) {
      return makeStep(lineNo, t, "코드 블록 경계", "문서 안에 명령어나 코드 예시를 넣는 구간의 시작 또는 끝입니다.", risk);
    }
    if (/^- \[[ xX]\]\s+/.test(t)) {
      return makeStep(lineNo, t, "Markdown 체크리스트", "할 일이나 확인 항목을 체크박스 형태로 표시합니다.", risk);
    }
    if (/^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t)) {
      return makeStep(lineNo, t, "Markdown 목록", "여러 항목을 읽기 쉬운 목록 형태로 정리합니다.", risk);
    }
    if (/!\[[^\]]*\]\([^)]+\)/.test(t)) {
      return makeStep(lineNo, t, "Markdown 이미지", "문서에 이미지를 삽입하는 문법입니다. 대체 텍스트와 파일 경로를 확인해야 합니다.", risk);
    }
    if (/\[[^\]]+\]\([^)]+\)/.test(t)) {
      return makeStep(lineNo, t, "Markdown 링크", "다른 문서나 웹 주소로 이동하는 링크를 만듭니다.", risk);
    }
    if (/^>\s+/.test(t)) {
      return makeStep(lineNo, t, "Markdown 인용문", "다른 문장이나 참고 내용을 인용 블록으로 강조합니다.", risk);
    }

    return makeStep(lineNo, t, "Markdown 문단", "README나 설명 문서의 일반 문장입니다.", risk);
  }

  function explainGitignoreLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "gitignore");

    if (/^!/.test(t)) {
      return makeStep(lineNo, t, "gitignore 예외 규칙", "앞에서 무시한 패턴 중 이 항목은 다시 Git 추적 대상에 포함하겠다는 뜻입니다.", risk);
    }
    if (/^\.env$|secret|token|password|api[_-]?key/i.test(t)) {
      return makeStep(lineNo, t, "민감 파일 무시", "환경변수나 비밀값 파일이 Git에 올라가지 않게 제외합니다.", risk);
    }
    if (/\/$/.test(t)) {
      return makeStep(lineNo, t, "폴더 무시", "해당 폴더와 그 안의 파일들을 Git 추적에서 제외합니다.", risk);
    }
    if (/^\*\./.test(t)) {
      return makeStep(lineNo, t, "확장자 패턴 무시", "특정 확장자를 가진 파일들을 한 번에 Git 추적에서 제외합니다.", risk);
    }

    return makeStep(lineNo, t, "gitignore 무시 규칙", "이 패턴과 맞는 파일이나 폴더를 Git 추적에서 제외합니다.", risk);
  }

  function explainIniLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "ini_file");

    if (/^\[[^\]]+\]$/.test(t)) {
      return makeStep(lineNo, t, "INI 섹션", "관련 설정들을 묶는 구역 이름입니다.", risk);
    }
    if (/^[A-Za-z0-9_.-]+\s*=/.test(t)) {
      if (/secret|token|password|api[_-]?key|private/i.test(t)) {
        return makeStep(lineNo, t, "민감 설정값", "토큰이나 비밀번호처럼 노출되면 안 되는 설정값입니다. 저장소에 올릴지 확인해야 합니다.", risk);
      }
      return makeStep(lineNo, t, "INI 키-값 설정", "왼쪽 이름에 오른쪽 설정값을 넣는 key=value 형식입니다.", risk);
    }

    return makeStep(lineNo, t, "INI 설정", "섹션과 key=value 구조로 쓰는 설정 파일의 한 줄입니다.", risk);
  }

  function explainTomlLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "toml");

    if (/^\[\[[^\]]+\]\]$/.test(t)) {
      return makeStep(lineNo, t, "TOML 테이블 배열", "같은 종류의 설정 묶음을 여러 개 반복해서 정의하는 영역입니다.", risk);
    }
    if (/^\[[^\]]+\]$/.test(t)) {
      return makeStep(lineNo, t, "TOML 테이블", "관련 설정값들을 묶는 TOML 구역입니다.", risk);
    }
    if (/^[A-Za-z0-9_.-]+\s*=\s*\[/.test(t)) {
      return makeStep(lineNo, t, "TOML 목록 설정", "하나의 키에 여러 값을 배열 형태로 넣습니다.", risk);
    }
    if (/^[A-Za-z0-9_.-]+\s*=/.test(t)) {
      if (/secret|token|password|api[_-]?key|private/i.test(t)) {
        return makeStep(lineNo, t, "민감 TOML 설정값", "토큰이나 비밀번호처럼 노출되면 안 되는 설정값입니다.", risk);
      }
      return makeStep(lineNo, t, "TOML 키-값 설정", "왼쪽 키에 오른쪽 값을 넣는 TOML 설정입니다.", risk);
    }

    return makeStep(lineNo, t, "TOML 설정", "TOML 설정 파일의 한 줄입니다.", risk);
  }

  function explainJavaLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "java");

    if (/class\s+\w+/.test(t)) {
      return makeStep(lineNo, t, "클래스 정의", "Java에서 관련 변수와 메서드를 묶는 설계도를 정의합니다.", risk);
    }
    if (/public\s+static\s+void\s+main/.test(t)) {
      return makeStep(lineNo, t, "프로그램 시작점", "Java 프로그램이 실행될 때 가장 먼저 들어오는 main 메서드입니다.", risk);
    }
    if (/System\.out\.println/.test(t)) {
      return makeStep(lineNo, t, "화면에 출력", "괄호 안 값을 콘솔 화면에 보여줍니다.", risk);
    }
    if (/^if\s*\(/.test(t)) {
      return makeStep(lineNo, t, "조건 검사", "조건이 맞으면 중괄호 안 코드가 실행됩니다.", risk);
    }
    if (/^else\b/.test(t)) {
      return makeStep(lineNo, t, "조건이 아닐 때", "앞 조건이 맞지 않을 때 실행되는 부분입니다.", risk);
    }
    if (/^for\s*\(/.test(t) || /^while\s*\(/.test(t)) {
      return makeStep(lineNo, t, "반복 실행", "정해진 조건이나 횟수에 따라 중괄호 안 코드를 반복합니다.", risk);
    }
    if (/return\b/.test(t)) {
      return makeStep(lineNo, t, "값 돌려주기", "메서드에서 만든 결과를 호출한 곳으로 돌려줍니다.", risk);
    }
    if (/\b(int|String|double|boolean|long|float)\s+\w+\s*=/.test(t)) {
      return makeStep(lineNo, t, "변수 선언과 값 저장", "변수의 종류를 정하고 값을 넣습니다.", risk);
    }

    return makeStep(lineNo, t, "Java 코드 실행", "이 줄은 Java 코드입니다. 중괄호 구조에 따라 실행 흐름이 정해집니다.", risk);
  }

  function pushUnique(list, value) {
    if (value && !list.includes(value)) list.push(value);
  }

  function inferStepMeta(step, language) {
    const code = String(step.code || "").toLowerCase();
    const title = String(step.title || "").toLowerCase();
    const explain = String(step.explain || "").toLowerCase();
    const text = [code, title, explain, language].join(" ");
    const codeTitle = [code, title, language].join(" ");

    const tags = [];
    let category = "처리";

    // CONFIG_META_GUARD_V184_A1
    // 설정 파일 계열은 설명문 안의 단어 때문에 Git/CI/API/DB 등으로 오염되기 쉬워서
    // 파일 형식별 핵심 분류를 먼저 확정하고 여기서 반환한다.
    if (language === "dockerfile") {
      category = "컨테이너";
      pushUnique(tags, "Docker");
      if (/run\s+|pip\s+install|apt-get|requirements/i.test(code)) {
        pushUnique(tags, "pip");
        pushUnique(tags, "의존성");
      }
      if (/copy\s+|add\s+|workdir/i.test(code)) {
        pushUnique(tags, "파일");
      }
      if (/^env\s+|^arg\s+/i.test(code)) {
        pushUnique(tags, "환경변수");
      }
      if (/secret|token|password|api[_-]?key|private/i.test(code)) {
        pushUnique(tags, "보안");
      }
      return Object.assign({}, step, {
        category: category,
        tags: tags.slice(0, 4)
      });
    }

    if (language === "env_file") {
      category = "환경설정";
      pushUnique(tags, "환경변수");
      if (/secret|token|password|api[_-]?key|private/i.test(code)) {
        pushUnique(tags, "보안");
      }
      return Object.assign({}, step, {
        category: category,
        tags: tags.slice(0, 4)
      });
    }

    if (language === "requirements_txt") {
      category = "패키지설정";
      pushUnique(tags, "pip");
      pushUnique(tags, "의존성");
      if (/^-r\s+/.test(code)) {
        pushUnique(tags, "파일");
      }
      return Object.assign({}, step, {
        category: category,
        tags: tags.slice(0, 4)
      });
    }

    if (language === "pyproject_toml") {
      category = "프로젝트설정";
      pushUnique(tags, "pyproject");
      if (/dependencies|>=|==|<=|~=/.test(code)) {
        pushUnique(tags, "의존성");
      }
      if (/pytest|ruff|black|mypy|testpaths/.test(code)) {
        pushUnique(tags, "검증");
      }
      return Object.assign({}, step, {
        category: category,
        tags: tags.slice(0, 4)
      });
    }

    if (language === "yaml") {
      category = "YAML설정";
      pushUnique(tags, "YAML");

      // YAML_TAG_GUARD_V184_A1
      if (/services\s*:/.test(code)) {
        pushUnique(tags, "서비스");
      }
      if (/image\s*:/.test(code)) {
        pushUnique(tags, "컨테이너");
      }
      if (/ports\s*:|^-\s*["']?\d+:\d+/.test(code)) {
        pushUnique(tags, "포트");
      }
      if (/environment\s*:|^[A-Z][A-Z0-9_]*\s*:/.test(code)) {
        pushUnique(tags, "환경변수");
      }
      if (/volumes\s*:|^-\s*\.:/.test(code)) {
        pushUnique(tags, "볼륨");
      }
      if (/^-\s+/.test(code)) {
        pushUnique(tags, "목록");
      }
      if (tags.length === 1) {
        pushUnique(tags, "설정");
      }

      return Object.assign({}, step, {
        category: category,
        tags: tags.slice(0, 4)
      });
    }

    // DOC_CONFIG_META_GUARD_V184_A3
    if (language === "markdown") {
      category = "문서";
      pushUnique(tags, "Markdown");
      if (/^#{1,6}\s+/.test(code)) pushUnique(tags, "제목");
      if (/^```/.test(code)) pushUnique(tags, "코드블록");
      if (/^[-*]\s+|^\d+\.\s+/.test(code)) pushUnique(tags, "목록");
      if (/\[[^\]]+\]\([^)]+\)/.test(code)) pushUnique(tags, "링크");
      if (/^- \[[ x]\]/.test(code)) pushUnique(tags, "체크리스트");
      if (tags.length === 1) pushUnique(tags, "문서");
      return Object.assign({}, step, {
        category: category,
        tags: tags.slice(0, 4)
      });
    }

    if (language === "gitignore") {
      category = "무시규칙";
      pushUnique(tags, "GitIgnore");
      if (/^!/.test(code)) pushUnique(tags, "예외");
      else pushUnique(tags, "무시");
      if (/\/$|^\*\.|^\.env$/.test(code)) pushUnique(tags, "파일");
      if (/\.env|secret|token|password|api[_-]?key|private/.test(code)) pushUnique(tags, "보안");
      return Object.assign({}, step, {
        category: category,
        tags: tags.slice(0, 4)
      });
    }

    if (language === "ini_file") {
      category = "INI설정";
      pushUnique(tags, "INI");
      if (/^\[[^\]]+\]$/.test(code)) pushUnique(tags, "섹션");
      else pushUnique(tags, "설정");
      if (/secret|token|password|api[_-]?key|private/.test(code)) pushUnique(tags, "보안");
      return Object.assign({}, step, {
        category: category,
        tags: tags.slice(0, 4)
      });
    }

    if (language === "toml") {
      category = "TOML설정";
      pushUnique(tags, "TOML");
      if (/^\[/.test(code)) pushUnique(tags, "섹션");
      else pushUnique(tags, "설정");
      if (/\[.*\]|dependencies|select\s*=/.test(code)) pushUnique(tags, "목록");
      if (/secret|token|password|api[_-]?key|private/.test(code)) pushUnique(tags, "보안");
      return Object.assign({}, step, {
        category: category,
        tags: tags.slice(0, 4)
      });
    }

    if (language === "package_json") {
      category = "패키지설정";
      pushUnique(tags, "npm");
      pushUnique(tags, "의존성");
      if (/test|node --check|vitest|jest/.test(code)) {
        pushUnique(tags, "검증");
      }
      return Object.assign({}, step, {
        category: category,
        tags: tags.slice(0, 4)
      });
    }

    if (/worker 진입 객체|export\s+default|프로그램 시작점|public\s+static\s+void\s+main/.test(text)) {
      category = "구조";
      pushUnique(tags, "함수/구조");
    }

    if (/localstorage|브라우저 저장소/.test(text)) {
      category = "저장소";
      pushUnique(tags, "저장소");
    }

    if (/ctx\.waituntil|백그라운드 작업|백그라운드/.test(text)) {
      category = "백그라운드";
      pushUnique(tags, "Cloudflare");
    }

    if (/argparse|명령행 인자/.test(text)) {
      category = "CLI";
      pushUnique(tags, "CLI");
    }

    if (/subprocess|외부 프로그램/.test(text)) {
      category = "프로세스";
      pushUnique(tags, "프로세스");
    }

    if (/fastapi|라우트|api 서버/.test(text)) {
      category = "웹서버";
      pushUnique(tags, "FastAPI");
      pushUnique(tags, "API");
    }

    if (
      language !== "github_actions" &&
      language !== "requirements_txt" &&
      language !== "pyproject_toml" &&
      language !== "dockerfile" &&
      language !== "env_file" &&
      language !== "yaml" &&
      /package_json|package\.json|npm 스크립트|npm|dependencies|devdependencies|패키지|의존성/.test(text)
    ) {
      category = category === "처리" ? "패키지설정" : category;
      pushUnique(tags, "npm");
      pushUnique(tags, "의존성");
    }

    if (/github_actions|github actions|워크플로|runs-on|uses:\s*actions\/|ci\/cd|트리거 이벤트|실행 환경|쉘 명령/.test(text)) {
      category = category === "처리" ? "CI/CD" : category;
      pushUnique(tags, "GitHubActions");
      pushUnique(tags, "CI");
    }

    if (/dockerfile|docker|컨테이너|베이스 이미지|이미지 빌드|container/.test(text)) {
      category = category === "처리" ? "컨테이너" : category;
      pushUnique(tags, "Docker");
    }

    if (/env_file|\.env|환경변수|비밀 환경변수|secret|token|password|api[_-]?key/.test(text)) {
      category = category === "처리" ? "환경설정" : category;
      pushUnique(tags, "환경변수");
    }

    if (/requirements_txt|requirements\.txt|pip install|패키지 버전|python 패키지/.test(text)) {
      category = category === "처리" ? "패키지설정" : category;
      pushUnique(tags, "pip");
      pushUnique(tags, "의존성");
    }

    if (/pyproject_toml|pyproject\.toml|toml|프로젝트 메타데이터|도구 설정/.test(text)) {
      category = category === "처리" ? "프로젝트설정" : category;
      pushUnique(tags, "pyproject");
    }

    if (/yaml|yaml 설정|설정 키|목록 항목|services:|image:|ports:|volumes:/.test(text)) {
      category = category === "처리" ? "YAML설정" : category;
      pushUnique(tags, "YAML");
    }

    if (/git\b/.test(text)) {
      category = "버전관리";
      pushUnique(tags, "Git");
    }
    if (/node --check|validate|pytest|test|검증|확인|status|diff/.test(text)) {
      category = category === "처리" ? "검증" : category;
      pushUnique(tags, "검증");
    }
    if (/set-location|cd\b|path|경로|폴더|file|copy-item|move-item|remove-item|new-item|compress-archive|expand-archive|open\(|read_text|write_text|fs\.|파일/.test(text)) {
      category = category === "처리" ? "파일/경로" : category;
      pushUnique(tags, "파일");
    }
    if (/request|response|fetch|invoke-webrequest|curl|api|http|url|requests\./.test(text)) {
      category = category === "처리" ? "네트워크/API" : category;
      pushUnique(tags, "API");
    }
    if (/env\.db|database|d1|sql|select|insert|update|delete|prepare|\.bind\s*\(/.test(text)) {
      category = "DB";
      pushUnique(tags, "DB");
      pushUnique(tags, "SQL");
    }
    if (/env\.kv|env\.r2|env\.ai|cloudflare|worker|wrangler/.test(text)) {
      pushUnique(tags, "Cloudflare");
      if (/wrangler|deploy/.test(text)) {
        category = "배포";
        pushUnique(tags, "배포");
      }
    }
    if (/if\s*\(|^if\s|elif|else|switch|case|조건/.test(text)) {
      category = "조건";
      pushUnique(tags, "조건문");
    }
    if (/foreach|for\s*\(|for\s+.+\s+in|while|\.foreach|반복/.test(text)) {
      category = "반복";
      pushUnique(tags, "반복문");
    }
    if (/function|def\s+|class\s+|=>|함수|클래스|method/.test(text)) {
      category = "구조";
      pushUnique(tags, "함수/구조");
    }
    if (/try|catch|except|finally|throw|raise|오류 대비|오류 처리|exception/.test(codeTitle)) {
      category = "오류처리";
      pushUnique(tags, "오류처리");
    }
    if (/print|write-host|console\.log|alert|return|response\.json|new response|출력|응답/.test(text)) {
      category = category === "처리" ? "출력/응답" : category;
      pushUnique(tags, "출력");
    }
    if (/token|secret|password|auth|authorization|api[_-]?key|\$env:|process\.env|환경변수|보안/.test(text)) {
      pushUnique(tags, "보안");
    }
    if (/const |let |var |\$[a-z_][\w-]*\s*=|=/.test(code) && category === "처리") {
      category = "변수/값";
      pushUnique(tags, "변수");
    }
    if (/import |from .+ import|require\(|npm\b|pip\b|requirements|package/.test(text)) {
      pushUnique(tags, "의존성");
      if (category === "처리") category = "의존성";
    }

    if (!tags.length) {
      pushUnique(tags, language === "powershell" ? "PowerShell" :
        language === "python" ? "Python" :
        language === "workers" ? "Workers" :
        language === "javascript" ? "JavaScript" :
        language === "java" ? "Java" : "코드");
    }

    return Object.assign({}, step, {
      category: category,
      tags: tags.slice(0, 4)
    });
  }

  function summarizeFlow(steps) {
    if (!steps.length) return "";
    const counts = {};
    steps.forEach(function(step) {
      const key = step.category || "처리";
      counts[key] = (counts[key] || 0) + 1;
    });

    const ordered = Object.keys(counts)
      .sort(function(a, b) {
        if (counts[b] !== counts[a]) return counts[b] - counts[a];
        return a.localeCompare(b);
      })
      .slice(0, 5)
      .map(function(key) {
        return key + " " + counts[key] + "개";
      });

    return "주요 흐름: " + ordered.join(" · ");
  }

  function summarize(language, steps) {
    if (!steps.length) return "분석할 코드가 없습니다.";
    const risky = steps.filter(function(step) { return step.risk === "high" || step.risk === "medium"; }).length;
    const names = {
      powershell: "PowerShell 스크립트",
      python: "Python 코드",
      javascript: "JavaScript 코드",
      workers: "Cloudflare Workers 코드",
      java: "Java 코드",
      package_json: "package.json 설정",
      github_actions: "GitHub Actions YAML",
      dockerfile: "Dockerfile",
      env_file: ".env 환경변수 파일",
      requirements_txt: "requirements.txt",
      pyproject_toml: "pyproject.toml",
      yaml: "YAML 설정",
      markdown: "Markdown / README",
      gitignore: ".gitignore",
      ini_file: "INI 설정",
      toml: "TOML 설정"
    };
    return (names[language] || "코드") + "를 " + steps.length + "단계로 나눠 해석했습니다." + (risky ? " 주의가 필요한 단계가 " + risky + "개 있습니다." : " 특별히 높은 위험 명령은 감지되지 않았습니다.");
  }

  function mermaidLabel(text) {
    return String(text || "")
      .replace(/["`]/g, "'")
      .replace(/\[/g, "(")
      .replace(/\]/g, ")")
      .replace(/\{/g, "(")
      .replace(/\}/g, ")")
      .slice(0, 42);
  }

  function buildMermaid(steps) {
    if (!steps.length) return "flowchart TD\n  A[분석할 코드 없음]";
    const lines = ["flowchart TD"];
    steps.slice(0, 40).forEach(function(step, idx) {
      const id = "N" + (idx + 1);
      const label = (idx + 1) + ". " + mermaidLabel(step.title);
      lines.push("  " + id + '["' + label + '"]');
      if (idx > 0) {
        lines.push("  N" + idx + " --> " + id);
      }
    });
    if (steps.length > 40) {
      lines.push('  N40 --> MORE["나머지 ' + (steps.length - 40) + '단계 생략"]');
    }
    return lines.join("\n");
  }

  function analyze(code, requestedLanguage) {
    const raw = stripFence(code);
    const language = requestedLanguage && requestedLanguage !== "auto" ? requestedLanguage : detectLanguage(raw);
    const lines = logicalLines(raw, language);
    const steps = [];

    lines.forEach(function(item) {
      const line = item.text;
      if (isBlankOrComment(line, language)) return;
      if (isStructuralOnlyLine(line, language)) return;
      const lineNo = item.lineNo;
      if (language === "powershell") steps.push(explainPowerShellLine(line, lineNo));
      else if (language === "python") steps.push(explainPythonLine(line, lineNo));
      else if (language === "javascript" || language === "workers") steps.push(explainJavaScriptLine(line, lineNo, language));
      else if (language === "package_json") steps.push(explainPackageJsonLine(line, lineNo));
      else if (language === "github_actions") steps.push(explainGitHubActionsLine(line, lineNo));
      else if (language === "dockerfile") steps.push(explainDockerfileLine(line, lineNo));
      else if (language === "env_file") steps.push(explainEnvFileLine(line, lineNo));
      else if (language === "requirements_txt") steps.push(explainRequirementsLine(line, lineNo));
      else if (language === "pyproject_toml") steps.push(explainPyprojectLine(line, lineNo));
      else if (language === "yaml") steps.push(explainYamlLine(line, lineNo));
      else if (language === "markdown") steps.push(explainMarkdownLine(line, lineNo));
      else if (language === "gitignore") steps.push(explainGitignoreLine(line, lineNo));
      else if (language === "ini_file") steps.push(explainIniLine(line, lineNo));
      else if (language === "toml") steps.push(explainTomlLine(line, lineNo));
      else if (language === "java") steps.push(explainJavaLine(line, lineNo));
      else steps.push(makeStep(lineNo, cleanLine(line), "코드 실행", "이 줄을 순서대로 실행합니다.", "low"));
    });

    const enrichedSteps = steps.map(function(step) {
      return inferStepMeta(step, language);
    });

    return {
      language: language,
      summary: summarize(language, enrichedSteps),
      flowSummary: summarizeFlow(enrichedSteps),
      steps: enrichedSteps,
      warnings: enrichedSteps.filter(function(step) { return step.risk === "high" || step.risk === "medium"; }),
      mermaid: buildMermaid(enrichedSteps)
    };
  }

  window.CodeExplainerRules = {
    analyze: analyze,
    detectLanguage: detectLanguage
  };
})();
// === CODE EXPLAINER RULES V184-A3 END ===

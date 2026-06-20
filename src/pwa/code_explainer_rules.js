// === CODE EXPLAINER RULES V215-A1 START ===
// FUNCTION_FLOW_ADVISOR_V326_A4 def return for if with open getattr globals importlib callback handler
// === CODE EXPLAINER RULES V212-A1 START ===
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
    // PACKAGE_JSON_AUTO_DETECT_V329_A3
    if (/"scripts"\s*:\s*\{/.test(text) && /"(name|version|dependencies|devDependencies)"\s*:/.test(text)) return "package_json";
    if (/^\s*\{\s*$/m.test(text) && /"scripts"\s*:\s*\{/.test(text) && /"name"\s*:\s*"/.test(text)) return "package_json";
    if ((/^\s*name\s*:/m.test(text) && /^\s*on\s*:/m.test(text) && /^\s*jobs\s*:/m.test(text)) || /uses:\s*actions\//.test(text)) return "github_actions";

    if (/export\s+default/.test(text) && /fetch\s*\(\s*request\s*,\s*env/.test(text)) return "workers";
    if (/\benv\.(DB|KV|R2|AI)\b/.test(text) || /Response\.json/.test(text) || /ctx\.waitUntil|caches\.default/.test(text)) return "workers";

    if (/Set-Location|Copy-Item|Remove-Item|Compress-Archive|Expand-Archive|Get-Date|New-Item|Test-Path|Select-String/i.test(text)) return "powershell";
    if (/^\s*\$[A-Za-z_][\w-]*\s*=/m.test(text) || /\bgit\s+(status|add|commit|push|tag|stash|reset|clean)\b/i.test(text)) return "powershell";

    // REACT_JSX_DETECT_V232_A1
    if (
      /\bReactDOM\b|\bReact\b|\buse(State|Effect|Memo|Callback|Ref|Context)\s*\(/.test(text) ||
      /<\s*[A-Za-z][A-Za-z0-9.]*[\s>][\s\S]*>|className=|onClick=|onChange=|onSubmit=/.test(text)
    ) return "javascript";

    // JS_MODULE_DETECT_GUARD_V189_A2
    if (/^\s*import\s+.+\s+from\s+["'][^"']+["']/m.test(text) || /^\s*export\s+(async\s+)?(function|const|let|class)\b/m.test(text)) return "javascript";

    // JAVA_DETECT_GUARD_V190_A2
    if (/^\s*package\s+[A-Za-z_][\w.]*\s*;/m.test(text)) return "java";
    if (/^\s*import\s+java[\w.*]*\s*;/m.test(text)) return "java";
    if (/public\s+class|private\s+class|protected\s+class|class\s+\w+\s*\{/m.test(text)) return "java";
    if (/public\s+static\s+void\s+main|System\.(out|err)\.println|\b(List|Map|Set|Queue)<[^>]+>/.test(text)) return "java";

    // PYTHON_PANDAS_NUMPY_DETECT_V231_A1
    if (/^\s*(?:import|from)\s+(?:pandas|numpy)\b/m.test(text) || /\b(?:pd|pandas|np|numpy)\./.test(text)) return "python";
    if (/^\s*def\s+\w+\s*\(/m.test(text) || /^\s*import\s+\w+/m.test(text) || /^\s*from\s+\w+/m.test(text)) return "python";
    if (/^\s*class\s+\w+\s*[:(]/m.test(text) && lower.includes("self")) return "python";

    if (/public\s+static\s+void\s+main|System\.out\.println|public\s+class|private\s+class|class\s+\w+\s*\{/m.test(text)) return "java";
    if (/\b(const|let|var)\s+\w+\s*=/.test(text) || /function\s+\w+\s*\(/.test(text) || /document\.getElementById|addEventListener|localStorage|\bprocess\.env\b/.test(text)) return "javascript";

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


    // TOML_CLOUDFLARE_DETECT_V215_A1
    if (/^\s*\[\[(d1_databases|r2_buckets)\]\]\s*$/m.test(text)) return "toml";
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
      // POWERSHELL_RISK_GUARD_V188_A2
      if (/remove-item/i.test(t) || /git\s+reset\s+--hard/i.test(t) || /git\s+clean\s+-/i.test(t)) return "high";
      if (/set-executionpolicy/i.test(t) || /invoke-expression|iex\b/i.test(t)) return "high";
      if (/stop-process/i.test(t) && /-force\b/i.test(t)) return "medium";
      if (/start-process/i.test(t) && /-verb\s+runas/i.test(t)) return "medium";
      if (/invoke-restmethod|invoke-webrequest|curl\b|wget\b/i.test(t)) return "medium";
      if (/out-file|add-content/i.test(t) && /-force\b|>>|>/.test(t)) return "medium";
      if (/move-item/i.test(t)) return "medium";
      if (/copy-item/i.test(t) && /-force\b/i.test(t)) return "medium";
      if (/set-content/i.test(t)) return "medium";
      if (/invoke-webrequest|curl\b/i.test(t)) return "medium";
      if (/wrangler\s+d1\s+execute/i.test(t) || /wrangler\s+deploy/i.test(t)) return "medium";
    }
    if (language === "python") {
      // PYTHON_RISK_GUARD_V187_A2
      if (/eval\s*\(|exec\s*\(/.test(t)) return "high";
      if (/shutil\.rmtree|os\.remove|os\.rmdir|\.unlink\s*\(|\.rmdir\s*\(/.test(t)) return "high";
      if (/subprocess\.|os\.system/.test(t)) return "medium";
      if (/pickle\.load|yaml\.load\s*\(/.test(t)) return "medium";
      if (/SECRET|TOKEN|PASSWORD|API[_-]?KEY|PRIVATE/i.test(t) && /os\.environ|os\.getenv|getenv\s*\(|load_dotenv/.test(t)) return "medium";
    }
    if (language === "javascript" || language === "workers") {
      // JS_WORKERS_RISK_GUARD_V189_A2
      if (/eval\s*\(|new\s+Function/.test(t)) return "high";
      if (/delete\s+|\.delete\s*\(/.test(t)) return "medium";
      if (/innerHTML\s*=/.test(t)) return "medium";
      if (/localStorage\.clear|sessionStorage\.clear|indexedDB\.deleteDatabase/.test(t)) return "medium";
      if (/env\.KV.*\.delete|env\.R2.*\.delete|caches\.default\.delete/.test(t)) return "medium";
      if (/env\.DB.*\bDELETE\b|env\.DB.*\bDROP\b|env\.DB.*\bUPDATE\b/i.test(t)) return "medium";
    }
    if (language === "java") {
      // JAVA_RISK_GUARD_V190_A2
      if (/Runtime\.getRuntime|ProcessBuilder/.test(t)) return "medium";
      if (/System\.exit\s*\(/.test(t)) return "medium";
      if (/delete\s*\(/.test(t)) return "medium";
      if (/Files\.delete|Files\.deleteIfExists/.test(t)) return "medium";
      if (/DriverManager\.getConnection|PreparedStatement|Statement\s+/.test(t)) return "medium";
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

  // CONFIDENCE_LABEL_RULES_V217_A1
  function confidenceForStep(title, explain) {
    const t = String(title || "");
    const e = String(explain || "");

    if (/자동 규칙에 없는/.test(e)) {
      return "unsupported";
    }

    if (/^(코드 실행|Python 코드 실행|JavaScript 코드 실행|Worker\/JavaScript 코드 실행|명령 실행|Python 명령 실행)$/.test(t)) {
      return "unsupported";
    }

    if (/미등록 함수/.test(t)) {
      return "unsupported";
    }

    if (/변수에 값 저장|값 반환|값 돌려주기|Markdown 문단|YAML 설정|TOML 설정|INI 설정|객체 속성 설정|문자열 데이터 항목|예제 코드 문자열|블록\/객체 닫기|딕셔너리 항목 설정|함수 호출|입력 파라미터 선언|문자열\/HTML 조각|예제\/문서 문자열|객체\/배열 값 항목|변수 선언|오류 발생|반복 다음 항목으로 이동|코드블록 경계|예제 명령 문자열|배열 데이터 항목|조건부 UI 조각|반응형 화면 조건 확인|DOM 스타일 설정|중첩 객체 값 갱신|배열\/문자열 길이 계산|객체 메서드 호출|블록\/콜백 닫기|조건\/표현식 경계|정규식 조건 검사|UI 조각 연결|콜백 결과 저장|Blob 파일 데이터 생성|화면\/콘솔에 출력|메서드 체인 이어쓰기/.test(t)) {
      return "inferred";
    }

    return "exact";
  }

  function confidenceLabel(confidence) {
    if (confidence === "exact") return "확실";
    if (confidence === "inferred") return "추정";
    if (confidence === "unsupported") return "미지원";
    return "추정";
  }

  function makeStep(lineNo, code, title, explain, risk) {
    const confidence = confidenceForStep(title, explain);
    return {
      lineNo: lineNo,
      code: code,
      title: title,
      explain: explain,
      risk: risk || "low",
      confidence: confidence,
      confidenceLabel: confidenceLabel(confidence)
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

    // POWERSHELL_FOREACH_PIPELINE_PRIORITY_V329_A5
    if (/\|/.test(t) && /\bForEach-Object\b/i.test(t)) {
      return makeStep(lineNo, t, "각 항목 반복 처리", "파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.", risk);
    }

    if (/^Set-Location\b/i.test(t) || /^cd\b/i.test(t)) {
      return makeStep(lineNo, t, "작업 폴더 이동", "이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다.", risk);
    }
    if (/^\$env:[A-Za-z_][\w-]*\s*=/.test(t)) {
      return makeStep(lineNo, t, "환경변수 설정", "현재 PowerShell 세션에서 사용할 임시 설정값을 저장합니다. API 키 같은 민감값은 코드에 직접 쓰지 않고 환경변수로 넣는 방식이 안전합니다.", risk);
    }

    // POWERSHELL_EARLY_PREF_RULE_V188_A2
    if (/^\$ErrorActionPreference\s*=/.test(t)) {
      return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);
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


      // POWERSHELL_CSV_PIPELINE_RULES_V215_A1
      if (/Import-Csv/i.test(value)) {
        return makeStep(lineNo, t, "CSV 읽기 결과 저장", "$" + name + " 변수에 CSV 파일을 읽은 표 형태 데이터를 저장합니다. CSV 첫 줄은 보통 열 이름으로 쓰이고, 이후 파이프라인에서 그룹/정렬/선택 처리를 할 수 있습니다.", risk);
      }
      if (/Group-Object|Sort-Object|Select-Object|Export-Csv/i.test(value)) {
        return makeStep(lineNo, t, "CSV 파이프라인 요약 저장", "$" + name + " 변수에 CSV 데이터를 파이프라인으로 넘겨 그룹, 정렬, 선택 같은 처리를 한 결과를 저장합니다. 어느 열을 기준으로 묶고 정렬하는지 확인해야 합니다.", risk);
      }
      // POWERSHELL_VAR_RULES_V188_A2
      if (/ConvertFrom-Json|ConvertTo-Json/i.test(value)) {
        return makeStep(lineNo, t, "JSON 처리 결과 저장", "$" + name + " 변수에 JSON을 PowerShell 객체로 바꾸거나 객체를 JSON 문자열로 바꾼 결과를 저장합니다.", risk);
      }
      if (/Get-Content/i.test(value)) {
        return makeStep(lineNo, t, "파일 내용 읽기 결과 저장", "$" + name + " 변수에 파일 내용을 읽은 결과를 저장합니다. -Raw가 있으면 파일 전체를 하나의 문자열로 읽습니다.", risk);
      }
      if (/Get-ChildItem|Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|\|/i.test(value)) {
        return makeStep(lineNo, t, "파이프라인 결과 저장", "$" + name + " 변수에 여러 명령을 파이프(|)로 이어 처리한 결과를 저장합니다. 각 단계가 어떤 데이터를 넘기는지 순서대로 확인해야 합니다.", risk);
      }
      if (/Start-Process/i.test(value)) {
        return makeStep(lineNo, t, "프로세스 실행 결과 저장", "$" + name + " 변수에 실행한 외부 프로그램의 프로세스 정보를 저장합니다. 나중에 종료하거나 상태를 확인할 때 씁니다.", risk);
      }

      return makeStep(lineNo, t, "변수에 값 저장", "$" + name + " 변수에 값을 넣습니다. 이후 줄에서 $" + name + "을 쓰면 이 값을 다시 사용합니다.", risk);
    }

    if (/Get-Date/i.test(t)) {
      return makeStep(lineNo, t, "현재 시간 만들기", "현재 날짜와 시간을 가져옵니다. 백업 파일명이나 실행 기록 이름을 만들 때 자주 씁니다.", risk);
    }
    // POWERSHELL_DEEP_RULES_V188_A2
    if (/^param\s*\(/i.test(t)) {
      return makeStep(lineNo, t, "입력 파라미터 정의", "스크립트를 실행할 때 받을 입력값을 정의합니다. 예: -Path, -Port 같은 옵션을 명확히 정할 수 있습니다.", risk);
    }
    // POWERSHELL_PARAM_OBJECT_LITERAL_V207_A1
    if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*\s*=/.test(t)) {
      return makeStep(lineNo, t, "입력 파라미터 기본값", "param 블록 안에서 파라미터의 타입과 기본값을 정합니다. 실행할 때 같은 이름의 옵션을 주면 이 기본값 대신 입력값이 사용됩니다.", risk);
    }
    if (/^\[pscustomobject\]@\{/.test(t)) {
      return makeStep(lineNo, t, "PowerShell 객체 만들기", "여러 속성을 가진 사용자 정의 객체를 만들기 시작합니다. 보고서 행이나 JSON 변환용 데이터를 구성할 때 자주 씁니다.", risk);
    }
    if (/^[A-Za-z_][\w-]*\s*=\s*(\$_|[^=]+)$/.test(t) && !/^\$/.test(t)) {
      return makeStep(lineNo, t, "객체 속성 값 설정", "PowerShell 객체 안에서 속성 이름과 값을 연결합니다. 왼쪽은 속성명, 오른쪽은 저장할 값입니다.", risk);
    }
    if (/^\$ErrorActionPreference\s*=/.test(t)) {
      return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);
    }
    if (/^function\s+[A-Za-z_][\w-]*/i.test(t)) {
      return makeStep(lineNo, t, "함수 정의", "반복해서 쓸 PowerShell 명령 묶음을 이름으로 정의합니다. 이 줄만으로 내부 명령이 바로 실행되지는 않습니다.", risk);
    }
    if (/^@['"]/.test(t) || /^['"]@/.test(t)) {
      return makeStep(lineNo, t, "여러 줄 문자열 경계", "here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다.", risk);
    }
    if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t) && /\bExport-Csv\b/i.test(t)) {
      return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
    }
    if (/\|\s*(Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|Format-Table|Out-Null)\b/i.test(t)) {
      return makeStep(lineNo, t, "파이프라인 처리", "앞 명령의 결과를 뒤 명령으로 넘기며 필터링, 반복, 선택, 정렬, 집계, 표 표시 같은 처리를 이어서 수행합니다.", risk);
    }
    if (/^Get-ChildItem\b/i.test(t) || /^dir\b/i.test(t) || /^ls\b/i.test(t)) {
      return makeStep(lineNo, t, "파일 목록 가져오기", "폴더 안의 파일과 하위 폴더 목록을 가져옵니다. -Recurse가 있으면 하위 폴더까지 넓게 탐색합니다.", risk);
    }
    if (/^Get-Content\b/i.test(t)) {
      return makeStep(lineNo, t, "파일 내용 읽기", "텍스트 파일 내용을 읽습니다. -Raw는 전체 파일을 한 문자열로 읽고, 없으면 줄 단위로 읽는 경우가 많습니다.", risk);
    }
    // POWERSHELL_SET_CONTENT_PIPELINE_V205_A1
    if (/^Out-File\b/i.test(t) || /\|\s*Out-File\b/i.test(t)) {
      return makeStep(lineNo, t, "파일로 출력 저장", "화면에 나올 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로를 확인해야 합니다.", risk);
    }
    // POWERSHELL_CONVERT_JSON_SET_CONTENT_V205_FIX
    if (/\bConvertTo-Json\b/i.test(t) && /\|\s*Set-Content\b/i.test(t)) {
      return makeStep(lineNo, t, "객체를 JSON으로 변환 후 파일 저장", "PowerShell 객체를 JSON 문자열로 바꾼 뒤 파일에 저장합니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있고, Set-Content는 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
    }
    if (/^Set-Content\b/i.test(t) || /\|\s*Set-Content\b/i.test(t)) {
      return makeStep(lineNo, t, "파일에 내용 저장", "값이나 파이프라인 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
    }
    if (/^Add-Content\b/i.test(t) || /\|\s*Add-Content\b/i.test(t)) {
      return makeStep(lineNo, t, "파일에 내용 추가", "기존 파일 끝에 새 내용을 덧붙입니다. 로그나 누적 기록을 남길 때 씁니다.", risk);
    }
    if (/\bWhere-Object\b/i.test(t)) {
      return makeStep(lineNo, t, "조건으로 필터링", "파이프라인으로 넘어온 항목 중 조건에 맞는 것만 남깁니다. $_는 현재 항목을 뜻합니다.", risk);
    }
    if (/\bForEach-Object\b/i.test(t)) {
      return makeStep(lineNo, t, "각 항목 반복 처리", "파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.", risk);
    }
    if (/\bSelect-Object\b/i.test(t)) {
      return makeStep(lineNo, t, "필요한 속성 선택", "객체에서 필요한 컬럼/속성만 고르거나 처음/마지막 일부만 선택합니다.", risk);
    }
    if (/\bSort-Object\b/i.test(t)) {
      return makeStep(lineNo, t, "정렬", "파이프라인 데이터의 순서를 특정 속성 기준으로 정렬합니다.", risk);
    }
    if (/\bGroup-Object\b/i.test(t)) {
      return makeStep(lineNo, t, "그룹별 묶기", "같은 값을 가진 항목끼리 묶어서 개수나 그룹별 처리를 할 수 있게 합니다.", risk);
    }
    if (/\bMeasure-Object\b/i.test(t)) {
      return makeStep(lineNo, t, "개수/합계 측정", "항목 개수, 합계, 평균 같은 간단한 통계를 계산합니다.", risk);
    }
    if (/\bConvertFrom-Json\b/i.test(t)) {
      return makeStep(lineNo, t, "JSON을 객체로 변환", "JSON 문자열을 PowerShell 객체로 바꿔서 속성처럼 접근할 수 있게 합니다.", risk);
    }
    if (/\bConvertTo-Json\b/i.test(t)) {
      return makeStep(lineNo, t, "객체를 JSON으로 변환", "PowerShell 객체를 JSON 문자열로 바꿉니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있습니다.", risk);
    }
    if (/\bImport-Csv\b/i.test(t)) {
      return makeStep(lineNo, t, "CSV 읽기", "CSV 파일을 행 단위 객체 목록으로 읽습니다. 첫 줄은 보통 컬럼명으로 사용됩니다.", risk);
    }
    if (/\bExport-Csv\b/i.test(t)) {
      return makeStep(lineNo, t, "CSV 저장", "PowerShell 객체 목록을 CSV 파일로 저장합니다. -NoTypeInformation 여부와 인코딩을 확인합니다.", risk);
    }
    if (/\bConvertFrom-Csv\b/i.test(t)) {
      return makeStep(lineNo, t, "CSV 문자열 변환", "CSV 형식 문자열을 PowerShell 객체 목록으로 바꿉니다.", risk);
    }
    if (/^Invoke-RestMethod\b/i.test(t)) {
      return makeStep(lineNo, t, "REST API 호출", "웹 API에 요청을 보내고 JSON 응답을 PowerShell 객체로 바로 읽는 데 자주 씁니다. URL, 메서드, 인증값을 확인해야 합니다.", risk);
    }
    if (/^Start-Process\b/i.test(t)) {
      return makeStep(lineNo, t, "외부 프로그램 실행", "별도 프로세스로 프로그램을 실행합니다. -PassThru가 있으면 프로세스 정보를 받아 나중에 종료/확인할 수 있습니다.", risk);
    }
    if (/^Get-Process\b/i.test(t)) {
      return makeStep(lineNo, t, "프로세스 조회", "현재 실행 중인 프로그램 목록이나 특정 프로세스 상태를 확인합니다.", risk);
    }
    if (/^Stop-Process\b/i.test(t)) {
      return makeStep(lineNo, t, "프로세스 종료", "실행 중인 프로세스를 종료합니다. -Force가 있으면 강제로 종료하므로 대상 ID를 반드시 확인해야 합니다.", risk);
    }
    if (/^Wait-Job\b/i.test(t)) {
      return makeStep(lineNo, t, "작업 완료 대기", "백그라운드 작업이 끝날 때까지 기다립니다.", risk);
    }
    if (/^Receive-Job\b/i.test(t)) {
      return makeStep(lineNo, t, "작업 결과 받기", "백그라운드 작업이 만든 결과를 현재 콘솔로 가져옵니다.", risk);
    }
    if (/^throw\b/i.test(t)) {
      return makeStep(lineNo, t, "오류 발생시키기", "조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다.", risk);
    }
    if (/^exit\b/i.test(t)) {
      return makeStep(lineNo, t, "스크립트 종료", "현재 스크립트나 프로세스를 지정한 종료 코드와 함께 끝냅니다.", risk);
    }
    if (/^return\b/i.test(t)) {
      return makeStep(lineNo, t, "값 반환", "함수나 스크립트 블록에서 결과를 돌려주고 이후 흐름을 끝냅니다.", risk);
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
      return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 모듈을 실행합니다. 인자와 실행 위치를 확인해야 합니다.", risk);
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

    // POWERSHELL_VERIFY_SCRIPT_RULES_V219_A1
    if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*,?$/.test(t)) {
      return makeStep(lineNo, t, "입력 파라미터 선언", "param 블록 안에서 입력값의 타입과 이름을 선언합니다. 실행할 때 같은 이름의 옵션으로 값을 받을 수 있습니다.", risk);
    }
    if (/^&\s+\$[A-Za-z_][\w-]*/.test(t)) {
      return makeStep(lineNo, t, "스크립트블록 실행", "변수에 담긴 PowerShell 스크립트블록을 실행합니다. 검증 단계나 콜백처럼 전달된 명령 묶음을 실행할 때 쓰입니다.", risk);
    }
    if (/^Invoke-Step\b/i.test(t)) {
      return makeStep(lineNo, t, "검증 단계 실행", "이름을 붙인 검증 단계를 실행합니다. 중괄호 안의 명령 묶음을 실행하고 성공/실패를 단계별로 보여주는 흐름입니다.", risk);
    }
    if (/^Assert-Contains\b/i.test(t)) {
      return makeStep(lineNo, t, "문자열 포함 검증", "파일이나 텍스트 안에 기대한 문자열이 들어 있는지 확인합니다. 버전, 마커, 샘플 이름 검증에 자주 쓰입니다.", risk);
    }
    if (/^["'][^"']*["'],?$/.test(t)) {
      return makeStep(lineNo, t, "문자열 데이터 항목", "배열이나 목록 안에 들어 있는 문자열 값입니다. URL, 파일 경로, 버전 붙은 리소스 주소처럼 데이터로 쓰일 수 있습니다.", risk);
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

    // POWERSHELL_CSV_PIPELINE_DIRECT_V215_A1
    if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t)) {
      return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
    }
    if (/\|\s*Out-Null/i.test(t)) {
      return makeStep(lineNo, t, "출력 숨기기", "명령 결과를 화면에 표시하지 않고 버립니다. 실제 작업은 실행되지만 출력만 숨겨집니다.", risk);
    }
    if (/\|\s*Format-Table\b/i.test(t)) {
      return makeStep(lineNo, t, "표 형태로 출력", "파이프라인 결과를 표 형태로 화면에 보여줍니다. 검증 리포트나 요약 데이터를 읽기 좋게 표시할 때 씁니다.", risk);
    }

    return makeStep(lineNo, t, "명령 실행", "이 줄은 PowerShell 명령입니다. 자동 규칙에 없는 명령이므로 원문, 경로, 옵션을 확인한 뒤 실행해야 합니다.", risk);
  }

  function explainPythonLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "python");

    // FASTAPI_IMPORT_RULES_V230_A1
    if (/^from\s+fastapi\s+import\s+/.test(t)) {
      return makeStep(lineNo, t, "FastAPI 기능 불러오기", "FastAPI, APIRouter, Depends, HTTPException, Query, Body 같은 API 서버 구성 기능을 가져옵니다. 앱 생성, 라우트 연결, 요청값 검증, 오류 응답 처리에 쓰입니다.", risk);
    }
    if (/^from\s+pydantic\s+import\s+.*BaseModel/.test(t)) {
      return makeStep(lineNo, t, "Pydantic 모델 기능 불러오기", "API 요청과 응답 데이터의 모양을 정의하고 검증하기 위한 BaseModel 기능을 가져옵니다.", risk);
    }
    if (/^import\s+/.test(t) || /^from\s+.+\s+import\s+/.test(t)) {
      return makeStep(lineNo, t, "라이브러리 불러오기", "이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.", risk);
    }
    // PYTHON_INIT_METHOD_RULE_V322_A3
    if (/^(async\s+)?def\s+__init__\s*\(/.test(t)) {
      return makeStep(lineNo, t, "\uac1d\uccb4 \ucd08\uae30\ud654 \uba54\uc11c\ub4dc \uc815\uc758", "__init__ \uba54\uc11c\ub4dc\ub294 \uc0c8 \uac1d\uccb4\uac00 \ub9cc\ub4e4\uc5b4\uc9c8 \ub54c \ucc98\uc74c \uc2e4\ud589\ub418\uba70 self.name\ucc98\ub7fc \uac1d\uccb4\uac00 \uae30\uc5b5\ud560 \uc18d\uc131\uc758 \ucd08\uae30\uac12\uc744 \uc900\ube44\ud569\ub2c8\ub2e4.", risk);
    }

    if (/^(async\s+)?def\s+\w+\s*\(/.test(t)) {
      return makeStep(lineNo, t, "함수 정의", "나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.", risk);
    }
    // PYDANTIC_BASEMODEL_RULE_V230_A1
    if (/^class\s+\w+\s*\(\s*BaseModel\s*\)\s*:/.test(t)) {
      return makeStep(lineNo, t, "Pydantic 데이터 모델 정의", "FastAPI에서 요청 본문이나 응답 JSON의 필드 구조를 정의합니다. 아래 들여쓰기된 필드 이름과 자료형이 API 데이터 규격이 됩니다.", risk);
    }
    if (/^class\s+\w+/.test(t)) {
      return makeStep(lineNo, t, "클래스 정의", "관련 데이터와 기능을 묶어 객체를 만들기 위한 설계도를 정의합니다.", risk);
    }
    // PYDANTIC_FIELD_RULE_V230_A2
    if (/^[A-Za-z_]\w*\s*:\s*[A-Za-z_][\w.\[\], |]*(?:\s*=\s*.+)?$/.test(t)) {
      return makeStep(lineNo, t, "Pydantic 모델 필드 정의", "데이터 모델 안의 필드 이름과 자료형을 정의합니다. FastAPI에서는 요청 본문이나 응답 JSON에 어떤 값이 들어갈 수 있는지 정하는 규격으로 쓰입니다.", risk);
    }


    // PYTHON_PATH_RE_DATE_COPY_RULES_V215_A1
    if (/re\.(findall|search|match|sub|split)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "정규식 검색/치환", "re 모듈의 정규식으로 문자열 안에서 패턴을 찾거나 바꿉니다. 찾는 패턴, 대상 문자열, 결과가 리스트인지 문자열인지 확인해야 합니다.", risk);
    }
    if (/datetime\.(now|today|utcnow)\s*\(/.test(t) && /\.strftime\s*\(/.test(t)) {
      return makeStep(lineNo, t, "날짜/시간 생성 / 날짜 문자열 포맷", "현재 날짜나 시간을 만든 뒤 datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
    }
    if (/datetime\.(now|today|utcnow)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "날짜/시간 생성", "현재 날짜나 시간을 만듭니다. 파일명, 로그 시각, 실행 시각 표시처럼 시간 기준 값을 만들 때 사용합니다.", risk);
    }
    if (/\.strftime\s*\(/.test(t)) {
      return makeStep(lineNo, t, "날짜 문자열 포맷", "datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
    }
    if (/shutil\.(copy|copy2|copyfile)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "파일 복사", "shutil로 파일을 다른 위치나 다른 이름으로 복사합니다. 원본 경로와 대상 경로가 맞는지, 같은 이름을 덮어쓰지 않는지 확인해야 합니다.", risk);
    }
    // PYTHON_ENTRY_ERROR_RULES_V187_A2
    if (/^if\s+__name__\s*==\s*["']__main__["']\s*:\s*$/.test(t)) {
      return makeStep(lineNo, t, "직접 실행 진입점", "이 파일을 직접 실행했을 때만 아래 들여쓰기 코드가 실행됩니다. 다른 파일에서 import할 때는 실행되지 않게 분리하는 패턴입니다.", risk);
    }
    if (/^try\s*:\s*$/.test(t)) {
      return makeStep(lineNo, t, "예외 처리 시작", "아래 코드를 실행하다가 문제가 생기면 except/finally 구간에서 처리할 수 있게 준비합니다.", risk);
    }
    if (/^except\b.*:\s*$/.test(t)) {
      return makeStep(lineNo, t, "예외 잡기", "try 안에서 발생한 오류를 잡아 사용자 친화적인 메시지나 대체 동작을 실행합니다. 너무 넓은 except는 실제 오류를 숨길 수 있습니다.", risk);
    }
    if (/^finally\s*:\s*$/.test(t)) {
      return makeStep(lineNo, t, "마지막 정리", "성공/실패와 관계없이 마지막에 실행되는 정리 구간입니다. 파일 닫기, 로그 출력, 임시 상태 정리에 자주 씁니다.", risk);
    }
    if (/^raise\s+SystemExit\b/.test(t)) {
      return makeStep(lineNo, t, "친절한 종료", "CLI 도구에서 오류 메시지를 보여주고 프로그램을 종료합니다. 사용자에게 무엇이 문제인지 알려줄 때 씁니다.", risk);
    }
    // FASTAPI_HTTP_EXCEPTION_RULE_V230_A1
    if (/^raise\s+HTTPException\s*\(/.test(t) || /HTTPException\s*\(/.test(t)) {
      return makeStep(lineNo, t, "FastAPI HTTP 오류 응답", "API 요청을 처리할 수 없을 때 상태 코드와 detail 메시지를 담아 HTTP 오류 응답을 만듭니다. status_code와 detail 내용이 사용자에게 보여져도 되는지 확인해야 합니다.", risk);
    }
    if (/^raise\b/.test(t)) {
      return makeStep(lineNo, t, "예외 발생시키기", "조건이 맞지 않거나 계속 진행하면 위험할 때 의도적으로 오류를 발생시킵니다.", risk);
    }
    if (/^assert\s+/.test(t)) {
      return makeStep(lineNo, t, "조건 검증", "반드시 참이어야 하는 조건을 검사합니다. 테스트나 내부 검증에는 유용하지만 사용자 입력 검증을 이것만으로 처리하면 부족할 수 있습니다.", risk);
    }
    // PYTHON_BUILTIN_MAPPING_V228_A1
    if (/\bnext\s*\(/.test(t)) {
      return makeStep(lineNo, t, "next 값 꺼내기", "반복 가능한 값에서 다음 항목을 하나 꺼냅니다. 두 번째 기본값을 넣으면 더 이상 값이 없을 때 오류 대신 그 값을 돌려줄 수 있습니다.", risk);
    }
    if (/\biter\s*\(/.test(t)) {
      return makeStep(lineNo, t, "반복자 만들기", "리스트, 튜플, 파일 같은 반복 가능한 값을 next로 하나씩 꺼낼 수 있는 반복자 형태로 바꿉니다.", risk);
    }
    if (/\breversed\s*\(/.test(t)) {
      return makeStep(lineNo, t, "거꾸로 반복하기", "순서가 있는 값을 뒤에서 앞으로 읽는 반복자를 만듭니다. 실제 리스트가 필요한 경우 list(reversed(...))처럼 감싸는지 확인합니다.", risk);
    }
    if (/\bround\s*\(/.test(t)) {
      return makeStep(lineNo, t, "반올림 계산", "숫자를 정해진 자리수로 반올림합니다. 두 번째 인자가 있으면 소수 몇 자리까지 남길지 정합니다.", risk);
    }
    if (/\babs\s*\(/.test(t)) {
      return makeStep(lineNo, t, "절댓값 계산", "음수와 양수의 부호를 제외하고 크기만 가져옵니다. 거리, 차이, 오차 계산에서 자주 씁니다.", risk);
    }
    if (/\bisinstance\s*\(/.test(t)) {
      return makeStep(lineNo, t, "자료형 확인", "값이 특정 자료형인지 검사합니다. 문자열, 숫자, 리스트처럼 입력 종류에 따라 다르게 처리할 때 씁니다.", risk);
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
    if (/^continue\s*$/.test(t)) {
      return makeStep(lineNo, t, "다음 반복으로 건너뛰기", "현재 반복에서 남은 코드를 실행하지 않고 다음 항목 처리로 넘어갑니다. 조건에 맞지 않는 파일이나 데이터를 제외할 때 자주 씁니다.", risk);
    }
    // PYTHON_ITER_JSON_RULES_V201_A1
    if (/^for\s+.+\s+in\s+range\s*\(/.test(t)) {
      return makeStep(lineNo, t, "range 반복", "range는 정해진 횟수나 숫자 범위를 만들어 반복할 때 씁니다. 시작값, 끝값, step이 의도한 범위인지 확인해야 합니다.", risk);
    }
    if (/^for\s+.+\s+in\s+enumerate\s*\(/.test(t)) {
      return makeStep(lineNo, t, "enumerate 반복", "enumerate는 목록의 값과 함께 순서 번호를 같이 꺼내 반복합니다. 인덱스와 실제 값이 각각 어디에 들어가는지 확인해야 합니다.", risk);
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
    if (/json\.dump\s*\(/.test(t)) {
      return makeStep(lineNo, t, "JSON 파일 쓰기", "Python 딕셔너리나 리스트를 JSON 형식으로 파일에 저장합니다. ensure_ascii, indent, 파일 인코딩을 확인해야 합니다.", risk);
    }
    if (/json\.dumps\s*\(/.test(t)) {
      return makeStep(lineNo, t, "JSON 문자열 만들기", "Python 딕셔너리나 리스트를 JSON 문자열로 바꿉니다. API 응답, 로그, 파일 저장 전에 자주 씁니다.", risk);
    }
    if (/json\.load|json\.loads/.test(t)) {
      return makeStep(lineNo, t, "JSON 읽기", "JSON 형식의 문자열이나 파일 내용을 Python 데이터로 바꿉니다.", risk);
    }
    // PANDAS_NUMPY_MAPPING_V231_A1
    if (/pandas\.read_(csv|excel|json)\s*\(|pd\.read_(csv|excel|json)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "pandas 파일 읽기", "CSV, Excel, JSON 같은 표 형태 파일을 pandas DataFrame으로 읽습니다. 파일 경로, 인코딩, 구분자, 헤더 행이 맞는지 확인해야 합니다.", risk);
    }
    if (/pd\.DataFrame\s*\(|pandas\.DataFrame\s*\(|pd\.Series\s*\(|pandas\.Series\s*\(/.test(t)) {
      return makeStep(lineNo, t, "pandas 표 만들기", "리스트나 딕셔너리 데이터를 pandas DataFrame 또는 Series 구조로 바꿉니다. 이후 필터링, 집계, 저장 같은 표 데이터 처리를 할 수 있습니다.", risk);
    }
    if (/pd\.concat\s*\(|pandas\.concat\s*\(/.test(t)) {
      return makeStep(lineNo, t, "pandas 표 이어붙이기", "여러 DataFrame을 위아래 또는 좌우로 이어 붙입니다. axis 방향과 인덱스 중복 여부를 확인해야 합니다.", risk);
    }
    if (/\.head\s*\(|\.tail\s*\(|\.info\s*\(|\.describe\s*\(|\.shape\b|\.columns\b/.test(t)) {
      return makeStep(lineNo, t, "pandas 미리보기/요약", "표 데이터의 앞뒤 일부, 열 이름, 크기, 자료형, 통계 요약을 확인합니다. 본격 처리 전에 데이터 구조를 점검하는 단계입니다.", risk);
    }
    if (/\.loc\s*\[|\.iloc\s*\[/.test(t)) {
      return makeStep(lineNo, t, "pandas 행/열 선택", "loc 또는 iloc으로 표에서 필요한 행과 열을 선택합니다. loc은 이름 기준, iloc은 위치 번호 기준이라는 차이를 확인해야 합니다.", risk);
    }
    if (/\.sort_values\s*\(|\.value_counts\s*\(/.test(t)) {
      return makeStep(lineNo, t, "pandas 정렬/빈도 계산", "표 데이터를 특정 열 기준으로 정렬하거나 값별 개수를 셉니다. 어떤 열을 기준으로 보는지 확인해야 합니다.", risk);
    }
    if (/\.isna\s*\(|\.notna\s*\(|\.fillna\s*\(|\.dropna\s*\(|\.astype\s*\(/.test(t)) {
      return makeStep(lineNo, t, "pandas 결측값/자료형 처리", "비어 있는 값 확인, 채우기, 제거, 자료형 변환을 수행합니다. 원본 데이터가 바뀌는지와 변환 실패 가능성을 확인해야 합니다.", risk);
    }
    if (/\.groupby\s*\(/.test(t)) {
      return makeStep(lineNo, t, "pandas 그룹 집계", "특정 열 값을 기준으로 행을 묶고 합계, 평균, 개수 같은 집계를 계산합니다. 그룹 기준 열과 집계 대상 열을 함께 확인해야 합니다.", risk);
    }
    if (/pd\.merge\s*\(|pandas\.merge\s*\(|\.merge\s*\(|\.join\s*\(/.test(t)) {
      return makeStep(lineNo, t, "pandas 표 병합", "공통 열이나 인덱스를 기준으로 두 표를 합칩니다. 조인 방식, 중복 행, 누락값 발생 여부를 확인해야 합니다.", risk);
    }
    if (/np\.array\s*\(|numpy\.array\s*\(/.test(t)) {
      return makeStep(lineNo, t, "NumPy 배열 만들기", "리스트 같은 값을 NumPy 배열로 바꿉니다. 수치 계산, 벡터 연산, 형태 변경을 빠르게 처리하기 위한 기본 구조입니다.", risk);
    }
    if (/np\.(zeros|ones|arange|linspace)\s*\(|numpy\.(zeros|ones|arange|linspace)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "NumPy 기본 배열 생성", "0이나 1로 채운 배열, 일정 간격 숫자 배열을 만듭니다. shape, 시작값, 끝값, 간격 조건을 확인해야 합니다.", risk);
    }
    if (/np\.(mean|median|std|sum|min|max)\s*\(|numpy\.(mean|median|std|sum|min|max)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "NumPy 통계 계산", "배열의 평균, 중앙값, 표준편차, 합계, 최솟값, 최댓값 같은 통계값을 계산합니다. axis 기준이 있는지 확인해야 합니다.", risk);
    }
    if (/\.reshape\s*\(/.test(t)) {
      return makeStep(lineNo, t, "NumPy 형태 변경", "배열의 전체 원소 수는 유지하면서 행과 열 모양을 바꿉니다. 바꾸려는 shape가 원소 개수와 맞는지 확인해야 합니다.", risk);
    }
    if (/np\.where\s*\(|numpy\.where\s*\(/.test(t)) {
      return makeStep(lineNo, t, "NumPy 조건 선택", "조건이 참일 때와 거짓일 때 사용할 값을 골라 새 배열을 만듭니다. 벡터화된 if 처리처럼 자주 씁니다.", risk);
    }
    if (/np\.random\.(rand|randn|randint|choice|seed)\s*\(|numpy\.random\.(rand|randn|randint|choice|seed)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "NumPy 무작위 값", "배열 형태의 난수나 무작위 선택값을 만듭니다. 재현 가능한 결과가 필요하면 seed 설정 여부를 확인해야 합니다.", risk);
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

    // PYTHON_STDLIB_COMMON_MAPPING_V228_A1
    if (/traceback\.(format_exc|print_exc|extract_tb|format_exception)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "traceback 오류 정보 처리", "예외가 발생했을 때 호출 경로와 오류 위치 정보를 문자열로 만들거나 출력합니다. 디버깅 로그와 오류 보고에 자주 씁니다.", risk);
    }
    if (/\btime\.(time|sleep|perf_counter|strftime|localtime)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "time 시간 처리", "현재 시각을 구하거나 잠시 멈추거나 실행 시간을 재는 표준 라이브러리 기능입니다. 대기 시간과 측정 기준을 확인해야 합니다.", risk);
    }
    if (/^@dataclass\b|dataclasses\.dataclass\s*\(/.test(t)) {
      return makeStep(lineNo, t, "dataclass 데이터 클래스", "반복해서 쓰는 데이터 묶음 클래스를 간단히 정의하게 해줍니다. 필드 이름과 기본값이 객체 구조를 결정합니다.", risk);
    }
    if (/\b(defaultdict|Counter|deque)\s*\(|collections\.(defaultdict|Counter|deque)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "collections 자료구조", "defaultdict, Counter, deque 같은 표준 자료구조를 만듭니다. 기본값, 개수 세기, 빠른 큐 처리를 할 때 자주 씁니다.", risk);
    }
    if (/itertools\.(product|chain|combinations|permutations|cycle|count|islice)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "itertools 반복 조합", "반복 가능한 값들을 조합하거나 이어 붙이거나 필요한 만큼 잘라 쓰는 표준 라이브러리 기능입니다. 반복 규모가 커질 수 있어 범위를 확인해야 합니다.", risk);
    }
    if (/random\.(choice|shuffle|randint|random|sample|seed)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "random 무작위 처리", "목록에서 고르기, 섞기, 난수 만들기 같은 무작위 동작을 합니다. 재현이 필요하면 seed 설정 여부를 확인합니다.", risk);
    }

    // PYTHON_DEEP_RULES_V187_A2
    if (/load_dotenv\s*\(/.test(t)) {
      return makeStep(lineNo, t, "환경변수 파일 로드", ".env 파일에 있는 설정값을 현재 Python 실행 환경으로 불러옵니다. 실제 비밀값은 저장소에 올리지 않아야 합니다.", risk);
    }
    if (/os\.environ|os\.getenv|getenv\s*\(/.test(t)) {
      return makeStep(lineNo, t, "환경변수 읽기", "API 키, DB 주소, 실행 옵션처럼 코드 밖에서 주입한 설정값을 읽습니다. 값이 없을 때의 처리도 확인해야 합니다.", risk);
    }
    if (/logging\.basicConfig|logging\.getLogger|logger\s*=/.test(t)) {
      return makeStep(lineNo, t, "로깅 설정", "실행 중 상태, 오류, 처리 결과를 기록하기 위한 로그 설정을 준비합니다.", risk);
    }
    if (/logger\.(debug|info|warning|error|exception)|logging\.(debug|info|warning|error|exception)/.test(t)) {
      return makeStep(lineNo, t, "로그 남기기", "진행 상태나 오류 정보를 로그로 남깁니다. print보다 운영 상황 추적에 적합합니다.", risk);
    }
    if (/csv\.DictReader\s*\(/.test(t)) {
      return makeStep(lineNo, t, "CSV 딕셔너리 읽기", "CSV의 첫 줄을 컬럼명으로 보고 각 행을 딕셔너리 형태로 읽습니다. 컬럼 이름 오타를 확인해야 합니다.", risk);
    }
    if (/csv\.DictWriter\s*\(/.test(t)) {
      return makeStep(lineNo, t, "CSV 딕셔너리 쓰기", "딕셔너리 데이터를 정해진 fieldnames 순서대로 CSV에 저장할 준비를 합니다.", risk);
    }
    if (/csv\.reader\s*\(/.test(t)) {
      return makeStep(lineNo, t, "CSV 행 읽기", "CSV 파일을 행 단위 목록으로 읽습니다. 컬럼명보다는 위치 번호로 접근하는 방식입니다.", risk);
    }
    if (/csv\.writer\s*\(/.test(t)) {
      return makeStep(lineNo, t, "CSV 행 쓰기", "목록 형태의 행 데이터를 CSV 파일에 저장할 준비를 합니다.", risk);
    }
    if (/\.writeheader\s*\(/.test(t)) {
      return makeStep(lineNo, t, "CSV 헤더 쓰기", "CSV 파일의 첫 줄에 컬럼명을 기록합니다.", risk);
    }
    if (/\.writerow\s*\(/.test(t) || /\.writerows\s*\(/.test(t)) {
      return makeStep(lineNo, t, "CSV 행 쓰기", "하나 이상의 데이터 행을 CSV 파일에 기록합니다.", risk);
    }
    if (/\.append\s*\(/.test(t)) {
      return makeStep(lineNo, t, "목록에 항목 추가", "리스트 끝에 새 값을 하나 추가합니다. 반복문 안에서 결과를 모을 때 자주 씁니다.", risk);
    }
    if (/\.extend\s*\(/.test(t) || /\.update\s*\(/.test(t)) {
      return makeStep(lineNo, t, "자료구조 확장/갱신", "리스트나 딕셔너리에 여러 값을 추가하거나 기존 값을 갱신합니다.", risk);
    }
    if (/\bPath\s*\([^)]*\)\.open\s*\(|\.open\s*\([^)]*encoding=/.test(t)) {
      return makeStep(lineNo, t, "pathlib 파일 열기", "Path 객체를 통해 파일을 읽거나 쓰기 위해 엽니다. with와 함께 쓰면 자동으로 닫혀 안전합니다.", risk);
    }
    if (/\.glob\s*\(|\.rglob\s*\(|\.iterdir\s*\(/.test(t)) {
      return makeStep(lineNo, t, "파일 목록 검색", "폴더 안의 파일 목록을 패턴이나 반복으로 찾습니다. 처리 대상이 너무 넓지 않은지 확인해야 합니다.", risk);
    }
    if (/pd\.DataFrame|pandas\.DataFrame/.test(t)) {
      return makeStep(lineNo, t, "표 데이터 만들기", "리스트나 딕셔너리 데이터를 pandas DataFrame 표 구조로 바꿉니다.", risk);
    }
    if (/\.to_csv\s*\(|\.to_json\s*\(|\.to_excel\s*\(/.test(t)) {
      return makeStep(lineNo, t, "표 데이터 저장", "DataFrame이나 표 데이터를 파일로 저장합니다. 저장 경로와 덮어쓰기 여부를 확인해야 합니다.", risk);
    }
    if (/\.groupby\s*\(/.test(t)) {
      return makeStep(lineNo, t, "그룹별 집계", "특정 컬럼 값을 기준으로 데이터를 묶어서 합계, 평균, 개수 같은 통계를 계산할 준비를 합니다.", risk);
    }
    if (/\.merge\s*\(|\.join\s*\(/.test(t)) {
      return makeStep(lineNo, t, "표 병합", "두 표를 공통 키나 인덱스 기준으로 합칩니다. 중복 키와 누락값을 확인해야 합니다.", risk);
    }
    if (/\.fillna\s*\(|\.dropna\s*\(/.test(t)) {
      return makeStep(lineNo, t, "결측값 처리", "비어 있는 값을 채우거나 제거합니다. 데이터가 사라지는지 확인해야 합니다.", risk);
    }
    if (/\.raise_for_status\s*\(/.test(t)) {
      return makeStep(lineNo, t, "HTTP 오류 확인", "API 응답이 실패 상태 코드이면 예외를 발생시켜 문제를 조기에 드러냅니다.", risk);
    }
    if (/\.json\s*\(/.test(t) && !/json\.load|json\.loads/.test(t)) {
      return makeStep(lineNo, t, "응답 JSON 변환", "웹 API 응답 본문을 Python 딕셔너리나 리스트로 변환합니다.", risk);
    }
    if (/^await\s+|asyncio\.run|asyncio\.gather|asyncio\.create_task/.test(t)) {
      return makeStep(lineNo, t, "비동기 실행", "네트워크 요청이나 오래 걸리는 작업을 기다리거나 동시에 실행합니다. await 위치와 예외 처리를 확인해야 합니다.", risk);
    }
    if (/\bPath\s*\(|pathlib|\.read_text\s*\(|\.write_text\s*\(|\.exists\s*\(|\.mkdir\s*\(/.test(t)) {
      return makeStep(lineNo, t, "파일/경로 처리", "pathlib 기반으로 파일 경로를 만들거나 파일을 읽고 씁니다.", risk);
    }
    if (/subprocess\.(run|Popen|check_output|check_call)/.test(t)) {
      return makeStep(lineNo, t, "외부 프로그램 실행", "Python 코드에서 다른 명령어나 프로그램을 실행합니다. 인자와 check=True 여부를 확인해야 합니다.", risk);
    }
    // FASTAPI_ROUTE_AND_PARAM_RULES_V230_A1
    if (/\bFastAPI\s*\(/.test(t)) {
      return makeStep(lineNo, t, "FastAPI 앱 생성", "HTTP 요청을 받을 API 서버 앱 객체를 만듭니다. 이후 @app.get, @app.post 같은 라우트가 이 앱에 연결됩니다.", risk);
    }
    if (/\bAPIRouter\s*\(/.test(t)) {
      return makeStep(lineNo, t, "FastAPI 라우터 생성", "API 경로들을 묶어서 관리할 라우터 객체를 만듭니다. prefix, tags 같은 옵션으로 URL 그룹을 나눌 수 있습니다.", risk);
    }
    if (/@(?:app|router)\.(get|post|put|delete|patch)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "FastAPI 라우트 연결", "특정 HTTP 메서드와 URL 경로로 들어온 요청을 바로 아래 함수에 연결합니다. response_model, status_code, 경로 파라미터가 있는지 확인해야 합니다.", risk);
    }
    if (/\bDepends\s*\(/.test(t)) {
      return makeStep(lineNo, t, "FastAPI 의존성 주입", "요청 처리 전에 인증, DB 연결, 공통 검증 같은 보조 함수를 실행해 결과를 함수 인자로 넣습니다.", risk);
    }
    if (/\b(Query|Body|Path)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "FastAPI 요청값 검증 설정", "쿼리 문자열, 요청 본문, 경로 파라미터의 기본값과 검증 조건을 설정합니다. 필수 여부와 기본값을 확인해야 합니다.", risk);
    }
    if (/uvicorn\.run\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Uvicorn 서버 실행", "FastAPI 앱을 실제 HTTP 서버로 실행합니다. host, port, reload 옵션을 확인해야 합니다.", risk);
    }
    if (/FastAPI\s*\(|from\s+fastapi\s+import|@app\.(get|post|put|delete|patch)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "FastAPI 앱/라우트 설정", "API 서버 앱을 만들거나 특정 URL로 들어온 요청을 처리할 함수를 연결합니다.", risk);
    }
    // PYTHON_VERIFY_DATA_RULES_V219_A1
    if (/^["'][^"']+["']\s*:/.test(t)) {
      return makeStep(lineNo, t, "딕셔너리 항목 설정", "딕셔너리 안에서 키와 값을 연결하는 데이터 줄입니다. 검증 항목 이름과 검사 결과를 묶어 저장할 때 자주 나옵니다.", risk);
    }
    if (/^return\b/.test(t)) {
      return makeStep(lineNo, t, "값 돌려주기", "함수 안에서 계산한 결과를 함수 밖으로 돌려줍니다.", risk);
    }
    if (/^print\s*\(/.test(t)) {
      return makeStep(lineNo, t, "화면에 출력", "괄호 안 값을 콘솔 화면에 보여줍니다.", risk);
    }
    if (/^(run|must|main)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "검증 함수 호출", "검증 스크립트 안에서 미리 정의된 보조 함수를 실행합니다. 명령 실행, 조건 확인, 메인 흐름 시작처럼 검증 절차를 묶어 호출할 때 쓰입니다.", risk);
    }
    // PYTHON_OBJECT_LAMBDA_RULES_V322_A3
    const selfAssignMatchV322 = t.match(/^self\.([A-Za-z_]\w*)\s*([+\-*/%]?=)\s*(.+)$/);
    if (selfAssignMatchV322) {
      const attrNameV322 = selfAssignMatchV322[1];
      const opV322 = selfAssignMatchV322[2];
      const valueV322 = selfAssignMatchV322[3];
      if (opV322 === "=") {
        return makeStep(lineNo, t, "\uc778\uc2a4\ud134\uc2a4 \uc18d\uc131 \uc800\uc7a5", "self." + attrNameV322 + "\uc5d0 \uac12\uc744 \uc800\uc7a5\ud574 \uc774 \uac1d\uccb4\uac00 \uae30\uc5b5\ud560 \uc0c1\ud0dc\ub97c \ub9cc\ub4ed\ub2c8\ub2e4. \uc624\ub978\ucabd \uac12(" + valueV322 + ")\uc774 \ub098\uc911\uc5d0 \uba54\uc11c\ub4dc\uc5d0\uc11c \ub2e4\uc2dc \uc0ac\uc6a9\ub420 \uc218 \uc788\uc2b5\ub2c8\ub2e4.", risk);
      }
      return makeStep(lineNo, t, "\uc778\uc2a4\ud134\uc2a4 \uc18d\uc131 \uac31\uc2e0", "self." + attrNameV322 + "\uac12\uc744 \uae30\uc874 \uac12\uc744 \uae30\uc900\uc73c\ub85c \ubc14\uafb8\ub294 \uc904\uc785\ub2c8\ub2e4. +=\ucc98\ub7fc \uac31\uc2e0 \uc5f0\uc0b0\uc790\ub294 \uac1d\uccb4\uc758 \uc0c1\ud0dc\uac00 \uc2e4\uc81c\ub85c \ubcc0\ud55c\ub2e4\ub294 \ub73b\uc785\ub2c8\ub2e4.", risk);
    }

    const objectCreateMatchV322 = t.match(/^([A-Za-z_]\w*)\s*=\s*([A-Z][A-Za-z_]\w*)\s*\((.*)\)\s*$/);
    if (objectCreateMatchV322) {
      return makeStep(lineNo, t, "\uac1d\uccb4 \uc0dd\uc131 \uacb0\uacfc \uc800\uc7a5", objectCreateMatchV322[2] + " \ud074\ub798\uc2a4\ub85c \uc0c8 \uac1d\uccb4\ub97c \ub9cc\ub4e4\uace0, \uadf8 \uacb0\uacfc\ub97c " + objectCreateMatchV322[1] + " \ubcc0\uc218\uc5d0 \uc800\uc7a5\ud569\ub2c8\ub2e4. \uc774\ub54c \ud074\ub798\uc2a4\uc758 __init__ \uba54\uc11c\ub4dc\uac00 \ucd08\uae30\uac12\uc744 \uc124\uc815\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.", risk);
    }

    if (/^[A-Za-z_]\w*(?:\[[^\]]+\])?\.(?:sort)\s*\([^)]*key\s*=\s*lambda\b/.test(t) || /\bsorted\s*\([^)]*key\s*=\s*lambda\b/.test(t)) {
      return makeStep(lineNo, t, "lambda \uc815\ub82c \uae30\uc900 \uc0ac\uc6a9", "lambda\ub85c \uc7a0\uae50 \uc4f8 \ud568\uc218\ub97c \ub9cc\ub4e4\uc5b4 \uc815\ub82c \uae30\uc900(key)\uc73c\ub85c \ub118\uae41\ub2c8\ub2e4. \ubaa9\ub85d\uc744 \uc815\ub82c\ud560 \ub54c \uac01 \ud56d\ubaa9\uc5d0\uc11c \uc5b4\ub5a4 \uac12\uc744 \uae30\uc900\uc73c\ub85c \ubcfc\uc9c0 \uc815\ud558\ub294 \uc904\uc785\ub2c8\ub2e4.", risk);
    }

    if (/^[A-Za-z_]\w*\s*=/.test(t)) {
      return makeStep(lineNo, t, "변수에 값 저장", "왼쪽 이름에 오른쪽 값을 넣습니다. 이후 코드에서 이 이름으로 값을 다시 사용할 수 있습니다.", risk);
    }

    // PYTHON_PLUS_EQUALS_ACCUMULATOR_V328_A3_2

    if (/^[A-Za-z_][A-Za-z0-9_]*(?:\[[^\]]+\]|\.[A-Za-z_][A-Za-z0-9_]*)?\s*\+=\s*.+$/.test(t)) {

      return makeStep(lineNo, t, "누적 더하기", "왼쪽 변수에 오른쪽 값을 더해서 다시 저장합니다. 합계, 점수, 개수를 쌓아 갈 때 자주 씁니다.", risk);

    }

    return makeStep(lineNo, t, "Python 코드 실행", "이 줄은 Python 코드입니다. 위에서 아래로 순서대로 실행됩니다.", risk);
  }

  function explainJavaScriptLine(line, lineNo, language) {
    const t = cleanLine(line);
    const risk = riskOf(t, language);

    // JAVASCRIPT_DATA_NODE_FILE_RULES_V218_A1
    if (/^["']use strict["'];?$/.test(t)) {
      return makeStep(lineNo, t, "엄격 모드 선언", "JavaScript 파일을 더 엄격한 규칙으로 실행하게 하는 선언입니다. 실수로 전역 변수를 만들거나 조용히 넘어가는 오류를 줄이는 데 도움이 됩니다.", risk);
    }
    if (/^(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*require\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Node.js 모듈 불러오기", "require로 fs, path 같은 Node.js 모듈을 불러와 변수에 저장합니다. 이후 파일 처리, 경로 처리, 프로세스 실행 등에 사용됩니다.", risk);
    }
    if (/\bfs\.(readFileSync|writeFileSync|existsSync|mkdirSync|readdirSync|statSync|readFile|writeFile)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Node.js 파일 처리", "fs 모듈로 파일이나 폴더를 읽고 쓰거나 존재 여부를 확인합니다. 읽는 경로와 덮어쓰기 여부를 확인해야 합니다.", risk);
    }
    if (/\bpath\.(join|resolve|basename|dirname|extname)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Node.js 경로 처리", "path 모듈로 파일 경로를 안전하게 합치거나 파일명, 폴더명, 확장자를 계산합니다. Windows와 Linux 경로 차이를 줄이는 데 도움이 됩니다.", risk);
    }
    if (/\b(?:cp|child_process)\.(execFileSync|execSync|spawn|spawnSync)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "외부 명령 실행", "Node.js에서 git, node, python 같은 외부 명령을 실행합니다. 실행 명령, 인자, 작업 폴더, 실패 시 동작을 확인해야 합니다.", risk);
    }
    if (/\bvm\.(createContext|runInContext)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "격리 실행 컨텍스트 사용", "Node.js vm 모듈로 코드를 별도 컨텍스트에서 실행합니다. 분석기나 테스트용 샌드박스를 만들 때 쓰지만 실행 대상 코드의 신뢰성을 확인해야 합니다.", risk);
    }

    // JAVASCRIPT_CORS_HEADER_RULE_V216_A1_FIX
    if (/["']Access-Control-Allow-Origin["']\s*:/.test(t)) {
      return makeStep(lineNo, t, "CORS 헤더 설정", "브라우저의 다른 출처 요청을 허용할지 정하는 응답 헤더입니다. 별표(*)는 모든 출처를 허용하므로 공개 범위가 맞는지 확인해야 합니다.", risk);
    }
    // JAVASCRIPT_UI_DATA_FALLBACK_RULES_V220_A1
    // JAVASCRIPT_REMAINING_FALLBACK_RULES_V221_A1
    // JAVASCRIPT_LEFTOVER_FRAGMENT_RULES_V222_A1
    if (/^(?:\\`){3}[A-Za-z0-9_-]*$|^(?:\\`){3}$|^`{3}[A-Za-z0-9_-]*$|^`{3}$/.test(t)) {
      return makeStep(lineNo, t, "코드블록 경계", "문서나 예제 문자열 안에서 코드 블록의 시작 또는 끝을 표시합니다. 실행 명령이 아니라 표시용 경계입니다.", risk);
    }
    if (/^(?:\};?|\}\);?|\},\s*\d+\);?|\}\s*)(?:\\`|`|[,;])?$/.test(t)) {
      return makeStep(lineNo, t, "블록/콜백 닫기", "앞에서 시작한 객체, 함수, 콜백, 예제 문자열 블록을 닫는 경계 줄입니다. 새 동작을 실행하기보다 구조를 마무리합니다.", risk);
    }
    if (/^\)\s*\{?$/.test(t) || /^\}\)\s*:\s*\[\];?$/.test(t)) {
      return makeStep(lineNo, t, "조건/표현식 경계", "여러 줄로 나뉜 조건식이나 삼항 연산자 표현식을 마무리하는 경계 줄입니다. 앞줄의 조건과 함께 읽어야 합니다.", risk);
    }
    if (/^\/.*\/[gimsuy]*\.test\([^)]+\)\s*(?:\|\||&&)?;?$/.test(t) || /\.(match|replace|split)\s*\(\/.+\/[gimsuy]*\)/.test(t)) {
      return makeStep(lineNo, t, "정규식 조건 검사", "정규식으로 문자열 형태를 검사하거나 특정 패턴을 찾습니다. 파일명, 코드펜스, 설정 줄처럼 형식 판별에 자주 쓰입니다.", risk);
    }
    if (/^\(?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)?\s*\?\s*['"`]<[^>]+>/.test(t) || /^\(.*\?\s*['"`]<[^>]+>/.test(t) || /^[?:]\s*['"`]<[^>]+>/.test(t)) {
      return makeStep(lineNo, t, "조건부 UI 조각", "삼항 연산자의 조건에 따라 화면에 넣을 HTML 조각을 고르는 부분입니다. 어떤 상태에서 어떤 안내 문구가 보이는지 확인합니다.", risk);
    }
    if (/^[A-Za-z_$][\w$]*\s*(?:\+|;)$/.test(t)) {
      return makeStep(lineNo, t, "UI 조각 연결", "앞뒤 HTML 문자열 조각을 이어 붙이거나 이미 만든 조각을 결과에 포함합니다. 화면 렌더링 문자열을 조립하는 줄입니다.", risk);
    }
    if (/^(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*picker\([^)]*\);?$/.test(t)) {
      return makeStep(lineNo, t, "콜백 결과 저장", "전달받은 picker 콜백 함수를 실행해 분류 키나 값을 꺼내 변수에 저장합니다. countByValue 같은 집계 도우미에서 자주 쓰입니다.", risk);
    }
    if (/^(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*new\s+Blob\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Blob 파일 데이터 생성", "문자열이나 SVG 같은 내용을 브라우저에서 다운로드 가능한 Blob 데이터로 만듭니다. 이후 URL.createObjectURL이나 링크 클릭으로 저장할 수 있습니다.", risk);
    }
    if (/^console\.(log|error|warn)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "화면/콘솔에 출력", "개발자 콘솔에 값이나 오류 메시지를 출력합니다. 디버깅, 스모크 테스트 실패 원인 확인, 상태 보고에 쓰입니다.", risk);
    }
    if (/^\.(?:toLowerCase|toUpperCase|trim|collect)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "메서드 체인 이어쓰기", "앞줄의 문자열, 배열, 스트림 처리 결과에 메서드를 이어 붙입니다. 여러 줄 체인에서는 앞 단계의 결과가 이 줄로 넘어옵니다.", risk);
    }
    if (/^(?:private\s+final\s+|public\s+(?:void|List<|String)|static\s+String\s+|interface\s+\w+|enum\s+\w+|with\s+.+:|except\s+\w+|raise\s+\w+|async\s+def\s+|@[A-Za-z_][\w.]*\(|for\s+\w+,\s*\w+\s+in\s+enumerate\(|[A-Z][A-Za-z0-9_<>, ?]+\s+\w+\s*=\s*).*/.test(t)) {
      return makeStep(lineNo, t, "예제 코드 문자열", "JavaScript 파일 안에 샘플로 들어 있는 Python, Java 같은 다른 언어 코드입니다. 현재 JavaScript로 직접 실행되는 줄이 아니라 테스트 샘플이나 문서 문자열일 수 있습니다.", risk);
    }
    if (/^throw\s+new\s+Error\s*\(/.test(t)) {
      return makeStep(lineNo, t, "오류 발생", "조건이 맞지 않거나 검증에 실패했을 때 Error를 만들어 실행을 중단합니다. 실패 원인을 메시지로 남기는 방어 코드입니다.", risk);
    }
    if (/^continue;?$/.test(t)) {
      return makeStep(lineNo, t, "반복 다음 항목으로 이동", "현재 반복의 남은 처리를 건너뛰고 다음 항목으로 넘어갑니다. 어떤 조건에서 건너뛰는지 함께 확인해야 합니다.", risk);
    }
    if (/^\\?`{3}[A-Za-z0-9_-]*$|^\\?`{3}$/.test(t)) {
      return makeStep(lineNo, t, "코드블록 경계", "문서나 예제 문자열 안에서 코드 블록의 시작 또는 끝을 표시합니다. 실행 명령이 아니라 표시용 경계입니다.", risk);
    }
    if (/^(?:npm|node|python|npx)\s+/.test(t) || /^(?:Write-Host|Remove-Item|Invoke-RestMethod|Where-Object|ForEach-Object|Stop-Process)\b/.test(t) || /^\$[A-Za-z_]\w*\s*\|/.test(t)) {
      return makeStep(lineNo, t, "예제 명령 문자열", "JavaScript 파일 안에 들어 있는 PowerShell, npm, node, python 같은 예제 명령입니다. 현재 JavaScript 줄로 직접 실행되는 것이 아니라 테스트 샘플이나 문서 문자열일 수 있습니다.", risk);
    }
    if (/^(?:\.env|!\S+|[A-Za-z0-9_.-]+\/|__pycache__\/?)(?:`|,)?$/.test(t) || /^[A-Za-z0-9_.-]+\s*=\s*[^;]+$/.test(t)) {
      return makeStep(lineNo, t, "예제/문서 문자열", "문서, 설정 예시, .gitignore 예시처럼 문자열 안에 들어 있는 파일명이나 설정 줄입니다. 현재 JavaScript 명령으로 직접 실행되는 줄은 아닐 수 있습니다.", risk);
    }
    if (/^\[(?:["'`][^"'`]+["'`]|[A-Za-z_$][\w$]*|\[)/.test(t)) {
      return makeStep(lineNo, t, "배열 데이터 항목", "배열 안에 들어가는 한 행의 데이터입니다. 라벨과 값, 키워드 묶음, 파일 묶음 같은 설정 목록을 구성합니다.", risk);
    }
    if (/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\[[^\]]+\])+(?:\s*\|\|\s*.+)?,?$/.test(t)) {
      return makeStep(lineNo, t, "객체/배열 값 항목", "객체나 배열 안에 들어가는 값 항목입니다. 없을 때 기본값을 쓰는 표현이 함께 붙을 수 있습니다.", risk);
    }
    if (/^[?:]\s*.+/.test(t)) {
      return makeStep(lineNo, t, "조건부 UI 조각", "삼항 연산자의 ? 또는 : 쪽에 놓인 화면 문구나 HTML 조각입니다. 조건에 따라 어떤 문구를 보여줄지 나누는 부분입니다.", risk);
    }
    if (/^window\.matchMedia\b/.test(t)) {
      return makeStep(lineNo, t, "반응형 화면 조건 확인", "브라우저 화면 너비 같은 미디어 조건을 확인합니다. 모바일/데스크톱 UI를 나누는 데 자주 씁니다.", risk);
    }
    if (/\.style\.[A-Za-z_$][\w$]*\s*=/.test(t)) {
      return makeStep(lineNo, t, "DOM 스타일 설정", "화면 요소의 style 값을 직접 바꿉니다. 진행률 막대 너비처럼 사용자에게 보이는 시각 상태를 갱신합니다.", risk);
    }
    if (/^[A-Za-z_$][\w$]*(?:(?:\.(?!(?:textContent|innerHTML|value|className|style)\b)[A-Za-z_$][\w$]*)|\[[^\]]+\])+\s*=\s*.+/.test(t)) {
      return makeStep(lineNo, t, "중첩 객체 값 갱신", "객체 안의 객체나 배열 항목처럼 깊은 위치의 값을 바꿉니다. 진도, 정답 수, 마지막 학습 시각 같은 상태 저장에 자주 쓰입니다.", risk);
    }
    if (/^\}\)\.length;?$/.test(t)) {
      return makeStep(lineNo, t, "배열/문자열 길이 계산", "앞에서 filter나 map 같은 처리를 끝낸 뒤 length로 개수를 계산하는 줄입니다.", risk);
    }
    // REACT_MAPPING_V232_A1
    // REACT_HOOK_CLOSURE_RENDER_FIX_V232_A2
    if (/^\}?\s*,\s*\[[^\]]*\]\s*\)\s*;?$/.test(t)) {
      return makeStep(lineNo, t, "React Hook 의존성 닫기", "useEffect, useMemo, useCallback 같은 Hook의 콜백 함수와 의존성 배열을 마무리합니다. 배열 안의 값이 바뀔 때만 Hook이 다시 실행됩니다.", risk);
    }
    if (/\.render\s*\(/.test(t) && /<\s*[A-Z][A-Za-z0-9_$]*/.test(t)) {
      return makeStep(lineNo, t, "React 화면 렌더링", "React 컴포넌트를 실제 브라우저 화면에 렌더링합니다. 앱의 시작점에서 루트 컴포넌트를 붙일 때 사용합니다.", risk);
    }
    if (/^import\s+React\b/.test(t) || /^import\s+\{[^}]*\buse(State|Effect|Memo|Callback|Ref|Context)\b[^}]*\}\s+from\s+["']react["']/.test(t) || /^import\s+.+\s+from\s+["']react["']/.test(t)) {
      return makeStep(lineNo, t, "React 기능 불러오기", "React 컴포넌트와 useState, useEffect 같은 Hook 기능을 가져옵니다. 화면을 컴포넌트 단위로 만들고 상태 변화에 따라 다시 그리기 위한 준비 단계입니다.", risk);
    }
    if (/^import\s+\{[^}]*\bcreateRoot\b[^}]*\}\s+from\s+["']react-dom\/client["']/.test(t)) {
      return makeStep(lineNo, t, "React DOM 렌더링 기능 불러오기", "React 컴포넌트를 실제 브라우저 DOM에 붙이기 위한 createRoot 기능을 가져옵니다.", risk);
    }
    if (/^(?:function\s+[A-Z][A-Za-z0-9_$]*\s*\(|(?:const|let|var)\s+[A-Z][A-Za-z0-9_$]*\s*=\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>)/.test(t)) {
      return makeStep(lineNo, t, "React 컴포넌트 정의", "대문자로 시작하는 화면 조각 함수를 정의합니다. React에서는 이런 컴포넌트를 조합해서 페이지 화면을 만듭니다.", risk);
    }
    if (/\buseState\s*\(/.test(t)) {
      return makeStep(lineNo, t, "React 상태값 만들기", "컴포넌트 안에서 바뀔 수 있는 상태값과 그 값을 바꾸는 setter 함수를 만듭니다. 값이 바뀌면 화면이 다시 렌더링될 수 있습니다.", risk);
    }
    // REACT_SETTER_DIRECT_CALL_FIX_V232_A3
    if (/^set[A-Z][A-Za-z0-9_$]*\s*\(/.test(t)) {
      return makeStep(lineNo, t, "React 상태 변경", "useState로 만든 setter 함수를 호출해 상태값을 바꿉니다. 이전 값에 의존하면 함수형 업데이트가 필요한지 확인해야 합니다.", risk);
    }
    if (/\buseEffect\s*\(/.test(t)) {
      return makeStep(lineNo, t, "React 효과 처리", "렌더링 이후 실행할 작업을 등록합니다. API 요청, 이벤트 연결, 타이머 같은 부수 효과를 넣으며 의존성 배열을 확인해야 합니다.", risk);
    }
    if (/\buseMemo\s*\(/.test(t)) {
      return makeStep(lineNo, t, "React 계산값 재사용", "비용이 큰 계산 결과를 의존성 값이 바뀔 때만 다시 계산하도록 저장합니다. 의존성 배열이 빠지면 오래된 값이 남을 수 있습니다.", risk);
    }
    if (/\buseCallback\s*\(/.test(t)) {
      return makeStep(lineNo, t, "React 콜백 재사용", "함수 자체를 의존성 값이 바뀔 때만 다시 만들도록 합니다. 자식 컴포넌트 렌더링 최적화나 이벤트 핸들러 전달에 자주 씁니다.", risk);
    }
    if (/\buseRef\s*\(/.test(t)) {
      return makeStep(lineNo, t, "React 참조값 만들기", "렌더링 사이에 유지되는 참조 객체를 만듭니다. DOM 요소를 가리키거나 다시 렌더링을 일으키지 않는 값을 저장할 때 씁니다.", risk);
    }
    if (/\buseContext\s*\(/.test(t)) {
      return makeStep(lineNo, t, "React 컨텍스트 읽기", "상위에서 제공한 Context 값을 현재 컴포넌트에서 읽습니다. 테마, 로그인 사용자, 전역 설정 같은 값을 전달할 때 씁니다.", risk);
    }
    // REACT_JSX_BEFORE_PROPS_FIX_V232_A3
    if (!/^return\b/.test(t) && /\bprops\.[A-Za-z_$][\w$]*/.test(t)) {
      return makeStep(lineNo, t, "React props 읽기", "부모 컴포넌트가 넘겨준 값을 읽습니다. props는 보통 현재 컴포넌트가 직접 바꾸지 않고 화면 표시나 조건 분기에 사용합니다.", risk);
    }
    if (/return\s*\(?\s*</.test(t) || /<\s*[A-Za-z][A-Za-z0-9.]*[\s>]/.test(t) || /\b(className|onClick|onChange|onSubmit|ref)=/.test(t)) {
      return makeStep(lineNo, t, "JSX 화면 구조", "React 컴포넌트가 화면에 보여줄 JSX 구조를 작성합니다. className은 CSS 클래스, onClick 같은 속성은 이벤트 처리 함수 연결에 쓰입니다.", risk);
    }
    if (/\bReactDOM\.createRoot\s*\(|\bcreateRoot\s*\(/.test(t)) {
      return makeStep(lineNo, t, "React 루트 생성", "React 앱을 붙일 브라우저 DOM 위치를 기준으로 렌더링 루트를 만듭니다. 보통 document.getElementById('root') 같은 요소를 넘깁니다.", risk);
    }
    if (/\.render\s*\(/.test(t) && /<\s*[A-Z][A-Za-z0-9_$]*/.test(t)) {
      return makeStep(lineNo, t, "React 화면 렌더링", "React 컴포넌트를 실제 브라우저 화면에 렌더링합니다. 앱의 시작점에서 루트 컴포넌트를 붙일 때 사용합니다.", risk);
    }

    if (
      !/(?:addEventListener|setItem|getItem|classList\.|appendChild|insertBefore|preventDefault|waitUntil|\.ack\s*\(|console\.(?:log|error|warn)|Response\.json|new\s+Response|fetch\s*\(|\.json\s*\(|\.ok\b|\.status\b|env\.KV\.|env\.R2\.|env\.QUEUE\.|env\.VECTORIZE\.|env\.AI\.)/.test(t) &&
      /^(?:window\.)?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)+\s*\(/.test(t)
    ) {
      return makeStep(lineNo, t, "객체 메서드 호출", "window나 객체에 붙어 있는 메서드를 실행합니다. 화면 갱신, 분석기 새로고침, 이벤트 해제 같은 동작일 수 있습니다.", risk);
    }

    const embeddedText = t.replace(/^["'`]\s*/, "").replace(/["'`],?\s*$/, "");
    if (!/^return\b/.test(t) && /^(?:\$[A-Za-z_][\w-]*\s*=|Set-Location\b|New-Item\b|Copy-Item\b|Compress-Archive\b|git\s+|from\s+[\w.]+\s+import\b|import\s+\w+|def\s+\w+\s*\(|return\s+|with\s+open\s*\(|for\s+\w+\s+in\s+|if\s+.+:|elif\s+.+:|else:|[A-Za-z_]\w*\s*=\s*[^=;]+$|print\s*\(|public\s+class\b|public\s+static\b|int\s+\w+\s*=|System\.out\.println|FROM\s+|WORKDIR\b|COPY\s+|RUN\s+|ENV\s+|EXPOSE\s+|CMD\s+|image:\s|ports:\s|volumes:\s|- uses:|- run:|- ["']?\d+:\d+["']?|services:|jobs:|steps:|runs-on:|node-version:|[A-Za-z_][\w-]*:\s*$|[A-Z][A-Z0-9_]*=|\[[A-Za-z0-9_. -]+\]|#{1,6}\s+|```|uvicorn\[|pandas[<>=~]|python-dotenv|-r\s+\S+)/.test(embeddedText)) {
      return makeStep(lineNo, t, "문자열 데이터 항목", "배열이나 객체 안에 들어 있는 문자열 데이터입니다. JavaScript 문자열 안에 Python, YAML, TOML, 설정 파일 예제 코드가 들어 있을 수도 있으므로 실제 실행 줄인지 구분해서 봅니다.", risk);
    }
    if (/^["'`].*["'`]?\s*\+?$/.test(t) || /^['"`]?\s*<\/?[A-Za-z][^>]*>/.test(t) || /^\$\{[^}]+\}/.test(t)) {
      return makeStep(lineNo, t, "문자열/HTML 조각", "화면에 넣을 HTML 문자열, 템플릿 문자열, 메시지 조각입니다. 실제 실행 명령이라기보다 UI 출력 내용을 조립하는 데이터 줄일 수 있습니다.", risk);
    }
    if (/^[-*]\s+/.test(t) || /^```/.test(t) || /^[가-힣][^;{}]*$/.test(t)) {
      return makeStep(lineNo, t, "예제/문서 문자열", "JavaScript 문자열 안에 들어 있는 문서, 목록, 예제 코드 내용입니다. 현재 파일의 JavaScript 명령으로 직접 실행되는 줄은 아닐 수 있습니다.", risk);
    }
    if (/^"(?:\\.|[^"\\])*",?$/.test(t) || /^'(?:\\.|[^'\\])*',?$/.test(t) || /^`(?:\\.|[^`\\])*`,?$/.test(t)) {
      return makeStep(lineNo, t, "문자열 데이터 항목", "배열이나 객체 안에 들어 있는 문자열 데이터입니다. JavaScript 문자열 안에 Python, YAML, TOML, 설정 파일 예제 코드가 들어 있을 수도 있으므로 실제 실행 줄인지 구분해서 봅니다.", risk);
    }
    if (/^["'][^"']+["']\s*:\s*/.test(t) || /^[A-Za-z_$][\w$]*\s*:\s*.+,?$/.test(t)) {
      return makeStep(lineNo, t, "객체 속성 설정", "객체 안에서 이름과 값을 연결하는 데이터 설정 줄입니다. 설정값, 예제 문자열, 화면 문구, 계산 결과를 담을 때 자주 나옵니다.", risk);
    }
    if (/^(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*[\{\[]/.test(t)) {
      return makeStep(lineNo, t, "객체/배열 초기화", "여러 설정값이나 항목을 담기 위해 객체나 배열을 새로 만듭니다. 이후 줄에서 속성과 항목이 채워지는지 확인합니다.", risk);
    }
    if (/^(?:let|const|var)\s+[A-Za-z_$][\w$]*;?$/.test(t)) {
      return makeStep(lineNo, t, "변수 선언", "나중에 값을 넣어 사용할 이름을 미리 선언합니다. 아직 실제 데이터가 들어간 것은 아닐 수 있습니다.", risk);
    }
    if (/^[A-Za-z_$][\w$]*(?:\[[^\]]+\]|\.(?!(?:textContent|innerHTML|value|className)\b)[A-Za-z_$][\w$]*)\s*(?:=|\+=|-=|\+\+|--)/.test(t)) {
      return makeStep(lineNo, t, "객체 값 갱신", "객체의 특정 속성이나 배열/딕셔너리 형태의 항목 값을 바꿉니다. 기존 값을 덮어쓰는지, 누적하는지 확인해야 합니다.", risk);
    }
    if (/^[A-Za-z_$][\w$]*\s*(?:=|\+=|-=)\s*/.test(t)) {
      return makeStep(lineNo, t, "변수 값 갱신", "이미 선언된 변수에 새 값을 넣거나 기존 값에 더해 갱신합니다. 상태값, 인덱스, 계산 결과를 바꾸는 흐름입니다.", risk);
    }
    if (!/^return\b/.test(t) && /\.filter\s*\(/.test(t)) {
      return makeStep(lineNo, t, "배열 필터링", "배열에서 조건에 맞는 항목만 골라 새 배열을 만듭니다. 어떤 조건으로 제외하거나 남기는지 확인해야 합니다.", risk);
    }
    if (!/^return\b/.test(t) && /\.map\s*\(/.test(t)) {
      return makeStep(lineNo, t, "배열 변환", "배열의 각 항목을 다른 값으로 바꿔 새 배열을 만듭니다. 원본 항목에서 어떤 값만 뽑거나 계산하는지 확인합니다.", risk);
    }
    if (!/^return\b/.test(t) && (/^\.(replace|replaceAll|join|split|slice|sort|reduce)\s*\(/.test(t) || /\.(replace|replaceAll|join|split|slice|sort|reduce)\s*\(/.test(t))) {
      return makeStep(lineNo, t, "문자열/배열 메서드 처리", "문자열이나 배열에 메서드를 이어 붙여 변환, 필터링, 정렬, 결합 같은 처리를 합니다. 앞 단계의 결과가 다음 메서드로 넘어갑니다.", risk);
    }
    if (/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)?,?$/.test(t)) {
      return makeStep(lineNo, t, "객체/배열 값 항목", "객체나 배열 안에 들어가는 값 항목입니다. 앞뒤 줄의 중괄호나 대괄호와 함께 데이터 묶음을 구성합니다.", risk);
    }
    if (!/^return\b/.test(t) && /^(?:\$[A-Za-z_][\w-]*\s*=|Set-Location\b|New-Item\b|Copy-Item\b|Compress-Archive\b|git\s+|from\s+[\w.]+\s+import\b|import\s+\w+|def\s+\w+\s*\(|with\s+open\s*\(|for\s+\w+\s+in\s+|if\s+.+:|elif\s+.+:|else:|[A-Za-z_]\w*\s*=\s*[^=;]+$|print\s*\(|public\s+class\b|public\s+static\b|int\s+\w+\s*=|System\.out\.println|FROM\s+|WORKDIR\b|COPY\s+|RUN\s+|ENV\s+|EXPOSE\s+|CMD\s+|image:\s|ports:\s|volumes:\s|- uses:|- run:|- ["']?\d+:\d+["']?|services:|jobs:|steps:|runs-on:|node-version:|[A-Za-z_][\w-]*:\s*$|[A-Z][A-Z0-9_]*=|\[[A-Za-z0-9_. -]+\]|#{1,6}\s+|```|uvicorn\[|pandas[<>=~]|python-dotenv|-r\s+\S+)/.test(t)) {
      return makeStep(lineNo, t, "예제 코드 문자열", "JavaScript 파일 안에 샘플로 들어 있는 다른 언어 코드나 설정 파일 내용입니다. 이 줄 자체가 현재 JavaScript로 실행되는 것이 아니라 화면 표시나 테스트 샘플로 쓰일 수 있습니다.", risk);
    }
    if (/^\}?\s*else\s*\{?$/.test(t)) {
      return makeStep(lineNo, t, "조건 분기", "앞 조건이 맞지 않을 때 실행할 흐름으로 넘어갑니다. if와 else가 어떤 상태를 나누는지 함께 봐야 합니다.", risk);
    }
    if (/^\}\);?$/.test(t) || /^[}\])]+[,;]?$/.test(t)) {
      return makeStep(lineNo, t, "블록/객체 닫기", "앞에서 시작한 함수 호출, 객체, 배열, 블록을 닫는 경계 줄입니다. 새 동작을 실행하기보다 구조를 마무리합니다.", risk);
    }

    // JAVASCRIPT_DOM_ASYNC_RULES_V215_A1
    if (/new\s+URLSearchParams\s*\(|URLSearchParams\s*\(/.test(t)) {
      return makeStep(lineNo, t, "URL 쿼리 파라미터 읽기", "URL의 ?id=... 같은 검색 파라미터를 읽기 위한 객체를 만듭니다. 주소에서 어떤 값을 꺼내 이후 요청이나 화면 처리에 쓰는지 확인합니다.", risk);
    }
    if (/document\.createElement\s*\(/.test(t)) {
      return makeStep(lineNo, t, "DOM 요소 생성", "브라우저 화면에 넣을 HTML 요소를 JavaScript로 새로 만듭니다. 만든 요소는 아직 화면에 붙은 것이 아니므로 appendChild 같은 삽입 단계가 이어지는지 봐야 합니다.", risk);
    }
    if (/\.textContent\s*=/.test(t)) {
      return makeStep(lineNo, t, "DOM 텍스트 설정", "화면 요소 안에 표시할 텍스트를 설정합니다. 사용자에게 보이는 문구나 버튼 라벨을 바꾸는 단계입니다.", risk);
    }
    if (/\.(className|innerHTML|value)\s*=/.test(t)) {
      return makeStep(lineNo, t, "DOM 표시 속성 설정", "화면 요소의 CSS 클래스, HTML 내용, 입력값 같은 표시 속성을 설정합니다. 사용자에게 보이는 UI 상태를 바꾸는 단계입니다.", risk);
    }
    if (/\.setAttribute\s*\(/.test(t)) {
      return makeStep(lineNo, t, "DOM 속성 설정", "화면 요소에 aria-expanded 같은 HTML 속성을 설정합니다. 접근성, 상태 표시, 동작 제어에 쓰입니다.", risk);
    }
    if (/\.appendChild\s*\(/.test(t) || /\.insertBefore\s*\(/.test(t)) {
      return makeStep(lineNo, t, "DOM 요소 삽입", "만들어 둔 화면 요소를 body나 다른 부모 요소 안에 실제로 붙입니다. 이 단계 이후 브라우저 화면에 요소가 나타납니다.", risk);
    }
    if (/\.preventDefault\s*\(/.test(t)) {
      return makeStep(lineNo, t, "이벤트 기본 동작 방지", "클릭이나 제출 이벤트의 기본 브라우저 동작을 막습니다. 페이지 이동이나 폼 제출을 막고 JavaScript 흐름으로 처리하려는 의도입니다.", risk);
    }
    if (/Promise\.all\s*\(/.test(t)) {
      return makeStep(lineNo, t, "비동기 병렬 처리", "여러 비동기 작업을 동시에 시작하고 모두 끝날 때까지 기다립니다. fetch 요청 여러 개를 묶어 처리할 때 자주 씁니다.", risk);
    }

    // WORKERS_SCHEDULED_QUEUE_AI_VECTOR_RULES_V215_A1
    if (/async\s+scheduled\s*\(/.test(t)) {
      return makeStep(lineNo, t, "스케줄 실행 함수", "Cloudflare Workers Cron Trigger가 정해진 시간에 호출하는 scheduled 핸들러입니다. 보통 주기 작업, 백필, 큐 투입을 시작합니다.", risk);
    }
    if (/async\s+queue\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Queue 소비 함수", "Cloudflare Queue에 들어온 메시지 묶음을 처리하는 소비자 핸들러입니다. batch.messages를 반복하며 각 메시지를 처리합니다.", risk);
    }
    if (/env\.AI\.run\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Workers AI 실행", "Cloudflare Workers AI 모델을 호출합니다. 입력 텍스트, 모델 이름, 응답 데이터 구조를 확인해야 합니다.", risk);
    }
    if (/env\.[A-Z0-9_]*VECTORIZE\.upsert\s*\(/.test(t) || /env\.VECTORIZE\.upsert\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Vectorize 벡터 저장", "Cloudflare Vectorize 인덱스에 임베딩 벡터를 저장하거나 갱신합니다. id와 values가 검색에 쓸 수 있는 형태인지 확인해야 합니다.", risk);
    }
    if (/message\.ack\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Queue 메시지 처리 완료", "Queue 메시지를 정상 처리했다고 확인합니다. ack 이후에는 같은 메시지가 다시 처리되지 않는 흐름입니다.", risk);
    }

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
    // WORKERS_STORAGE_QUEUE_RULES_V189_A2
    if (/env\.KV\.get\s*\(/.test(t)) {
      return makeStep(lineNo, t, "KV 값 읽기", "Cloudflare KV에서 키에 해당하는 값을 읽습니다. json 옵션을 쓰면 객체 형태로 받을 수 있습니다.", risk);
    }
    if (/env\.KV\.put\s*\(/.test(t)) {
      return makeStep(lineNo, t, "KV 값 저장", "Cloudflare KV에 키와 값을 저장합니다. TTL이나 만료 정책이 필요한지 확인해야 합니다.", risk);
    }
    if (/env\.KV\.delete\s*\(/.test(t)) {
      return makeStep(lineNo, t, "KV 값 삭제", "Cloudflare KV에서 특정 키의 값을 삭제합니다. 복구가 어려울 수 있으니 키를 확인해야 합니다.", risk);
    }
    if (/env\.R2\.get\s*\(/.test(t)) {
      return makeStep(lineNo, t, "R2 객체 읽기", "Cloudflare R2 버킷에서 파일/객체를 읽습니다. 키 경로와 null 처리 여부를 확인해야 합니다.", risk);
    }
    if (/env\.R2\.put\s*\(/.test(t)) {
      return makeStep(lineNo, t, "R2 객체 저장", "Cloudflare R2 버킷에 파일/객체를 저장합니다. 덮어쓰기 여부와 Content-Type을 확인해야 합니다.", risk);
    }
    if (/env\.R2\.delete\s*\(/.test(t)) {
      return makeStep(lineNo, t, "R2 객체 삭제", "Cloudflare R2 버킷의 객체를 삭제합니다. 대상 키를 반드시 확인해야 합니다.", risk);
    }
    if (/env\.QUEUE\.send\s*\(/.test(t) || /env\.[A-Z0-9_]*QUEUE\.send\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Queue 메시지 전송", "Cloudflare Queue에 나중에 처리할 메시지를 넣습니다. 소비자 Worker가 어떤 형식의 메시지를 기대하는지 확인해야 합니다.", risk);
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
    if (/caches\.default\.match\s*\(/.test(t)) {
      return makeStep(lineNo, t, "캐시 응답 조회", "Cloudflare 캐시에서 기존 응답이 있는지 확인합니다. 캐시 hit이면 원본 API나 DB를 다시 호출하지 않을 수 있습니다.", risk);
    }
    if (/caches\.default\.put\s*\(/.test(t)) {
      return makeStep(lineNo, t, "응답 캐시에 저장", "응답을 Cloudflare 엣지 캐시에 저장합니다. 캐시 키와 만료 조건을 확인해야 합니다.", risk);
    }
    if (/caches\.default\.delete\s*\(/.test(t)) {
      return makeStep(lineNo, t, "캐시 삭제", "Cloudflare 캐시에서 특정 응답을 삭제합니다. 캐시 키가 맞는지 확인해야 합니다.", risk);
    }
    if (/caches\.default/.test(t)) {
      return makeStep(lineNo, t, "Cloudflare 캐시 사용", "Cloudflare 엣지 캐시에 응답을 저장하거나 읽습니다. 캐시 키와 만료 정책을 확인해야 합니다.", risk);
    }
    if (/Access-Control-Allow-Origin|CORS/i.test(t)) {
      return makeStep(lineNo, t, "CORS 헤더 설정", "다른 도메인에서 이 API를 호출할 수 있는지 제어합니다. 공개 범위를 확인해야 합니다.", risk);
    }

    // JS_WORKERS_DEEP_RULES_V189_A2
    if (/^import\s+.+\s+from\s+["']/.test(t)) {
      return makeStep(lineNo, t, "모듈 불러오기", "다른 JavaScript 파일이나 패키지에서 필요한 기능을 가져옵니다.", risk);
    }
    if (/^export\s+(async\s+)?(function|const|let|class)\b/.test(t)) {
      return makeStep(lineNo, t, "모듈로 내보내기", "다른 파일에서 import해서 사용할 수 있도록 함수, 값, 클래스를 공개합니다.", risk);
    }
    if (/DOMContentLoaded/.test(t)) {
      return makeStep(lineNo, t, "DOM 준비 후 실행", "HTML 문서 구조가 준비된 뒤에 화면 요소를 찾고 이벤트를 연결합니다.", risk);
    }
    if (/url\.searchParams\.get\s*\(/.test(t) || /\.searchParams\.get\s*\(/.test(t)) {
      return makeStep(lineNo, t, "쿼리 문자열 읽기", "URL의 ?id= 같은 검색 파라미터 값을 읽습니다. 값이 없을 때의 처리가 필요합니다.", risk);
    }
    if (/^try\s*\{/.test(t)) {
      return makeStep(lineNo, t, "오류 대비 시작", "아래 코드에서 오류가 나면 catch/finally로 넘어가 처리할 수 있게 준비합니다.", risk);
    }
    if (/^\}?\s*catch\s*\(/.test(t) || /^\}?\s*catch\s*\{/.test(t)) {
      return makeStep(lineNo, t, "오류 처리", "try 안에서 발생한 오류를 잡아 로그를 남기거나 사용자에게 실패 응답을 돌려줍니다.", risk);
    }
    if (/^\}?\s*finally\s*\{/.test(t)) {
      return makeStep(lineNo, t, "마지막 정리", "성공/실패와 관계없이 마지막에 실행되는 정리 구간입니다.", risk);
    }
    // JS_WORKERS_AWAIT_JSON_RULE_V189_A2
    if (/\bawait\b.*\.json\s*\(/.test(t) && !/Response\.json/.test(t)) {
      return makeStep(lineNo, t, "응답 JSON 변환", "fetch 응답 본문을 JavaScript 객체로 변환합니다. 응답이 JSON이 아니면 오류가 날 수 있습니다.", risk);
    }
    if (/^await\s+/.test(t) || /\bawait\b/.test(t)) {
      if (/fetch\s*\(/.test(t)) {
        return makeStep(lineNo, t, "비동기 외부 요청", "fetch 요청이 끝날 때까지 기다립니다. 네트워크 실패와 응답 상태 확인이 필요합니다.", risk);
      }
      return makeStep(lineNo, t, "비동기 작업 대기", "Promise가 끝날 때까지 기다린 뒤 다음 줄을 실행합니다. 실패하면 catch로 넘어갈 수 있습니다.", risk);
    }
    if (/Promise\.(all|allSettled|race|any)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Promise 묶음 처리", "여러 비동기 작업을 함께 실행하거나 가장 먼저 끝나는 작업을 기다립니다.", risk);
    }
    if (/\.classList\.(add|remove|toggle|contains)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "CSS 클래스 변경", "화면 요소의 클래스를 추가, 제거, 토글하거나 확인해서 스타일이나 상태 표시를 바꿉니다.", risk);
    }
    if (/\.(push|add|set|delete)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "자료구조 항목 갱신", "배열, Set, Map 같은 자료구조에 항목을 추가하거나 값을 설정합니다. 누적되는 데이터가 무엇인지 확인해야 합니다.", risk);
    }
    if (/\.(get|has)\s*\(/.test(t) && /(Map|map|Set|set|localStorage|sessionStorage|progress|seen|cards|levels|concept)/.test(t)) {
      return makeStep(lineNo, t, "자료구조 항목 조회", "Map, Set, 저장소, 상태 객체에서 특정 항목을 꺼내거나 존재 여부를 확인합니다.", risk);
    }
    if (/^(?!(?:if|for|while|switch|catch)\b)[A-Za-z_$][\w$]*\s*\(/.test(t)) {
      return makeStep(lineNo, t, "함수 호출", "이미 정의했거나 브라우저가 제공하는 함수를 실행합니다. 인자와 실행 결과가 화면 상태나 데이터에 어떤 영향을 주는지 확인해야 합니다.", risk);
    }
    if (/JSON\.parse\s*\(/.test(t)) {
      return makeStep(lineNo, t, "JSON 문자열 변환", "JSON 문자열을 JavaScript 객체로 바꿉니다. 잘못된 JSON이면 오류가 날 수 있습니다.", risk);
    }
    if (/JSON\.stringify\s*\(/.test(t)) {
      return makeStep(lineNo, t, "JSON 문자열 만들기", "JavaScript 객체를 저장하거나 전송하기 쉬운 JSON 문자열로 바꿉니다.", risk);
    }
    if (/\.json\s*\(/.test(t) && !/Response\.json/.test(t)) {
      return makeStep(lineNo, t, "응답 JSON 변환", "fetch 응답 본문을 JavaScript 객체로 변환합니다. 응답이 JSON이 아니면 오류가 날 수 있습니다.", risk);
    }
    if (/\.ok\b|\.status\b/.test(t) && /response|res\b/i.test(t)) {
      return makeStep(lineNo, t, "응답 상태 확인", "HTTP 응답이 성공인지 상태 코드로 확인합니다. 실패 응답을 그대로 성공처럼 처리하지 않게 합니다.", risk);
    }
    if (/Array\.from\s*\(/.test(t)) {
      return makeStep(lineNo, t, "배열로 변환", "NodeList나 반복 가능한 값을 배열로 바꿔 map/filter 같은 배열 메서드를 쓰기 쉽게 만듭니다.", risk);
    }
    if (/\.map\s*\(/.test(t)) {
      return makeStep(lineNo, t, "배열 변환", "배열의 각 항목을 다른 값으로 바꾼 새 배열을 만듭니다.", risk);
    }
    if (/\.filter\s*\(/.test(t)) {
      return makeStep(lineNo, t, "배열 필터링", "배열에서 조건에 맞는 항목만 남긴 새 배열을 만듭니다.", risk);
    }
    if (/\.reduce\s*\(/.test(t)) {
      return makeStep(lineNo, t, "배열 누적 계산", "배열 값을 하나의 결과로 누적 계산합니다. 합계, 그룹화, 인덱스 만들기에 자주 씁니다.", risk);
    }
    if (/\.classList\.(add|remove|toggle|contains)\s*\(/.test(t)) {
      return makeStep(lineNo, t, "CSS 클래스 변경", "화면 요소의 클래스를 추가/삭제/토글해서 스타일이나 상태를 바꿉니다.", risk);
    }
    if (/\.dataset\./.test(t)) {
      return makeStep(lineNo, t, "data 속성 읽기", "HTML의 data-* 속성에 저장된 값을 읽습니다. 화면 요소의 상태나 식별값을 코드에서 사용할 때 씁니다.", risk);
    }
    // JAVASCRIPT_NODE_PROCESS_ENV_RULE_V229_A1
    if (/\bprocess\.env(?:\.[A-Za-z_$][\w$]*|\[[^\]]+\])?/.test(t)) {
      return makeStep(lineNo, t, "Node.js 환경변수 읽기", "Node.js 실행 환경에 설정된 환경변수를 읽습니다. API 주소, 실행 모드, 비밀키 이름처럼 코드 밖에서 주입되는 설정값을 확인할 때 자주 씁니다. 실제 비밀값을 코드나 화면에 그대로 출력하지 않도록 주의해야 합니다.", risk);
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
    // JS_RETURN_CHAIN_V205_A1
    if (/^return\b/.test(t)) {
      return makeStep(lineNo, t, "값 돌려주기", "함수 안에서 만든 값이나 계산 결과를 호출한 곳으로 돌려줍니다.", risk);
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
    // PACKAGE_JSON_FIELD_RULES_V329_A3
    if (/^"name"\s*:/.test(t)) {
      return makeStep(lineNo, t, "패키지 이름 설정", "package.json에서 이 Node/npm 프로젝트의 이름을 정합니다.", risk);
    }
    if (/^"version"\s*:/.test(t)) {
      return makeStep(lineNo, t, "패키지 버전 설정", "package.json에서 현재 패키지의 버전 번호를 정합니다.", risk);
    }
    if (/^"(?:dev|start|build|test|lint|format|preview|deploy|smoke|check|typecheck|serve|pages:deploy)"\s*:/.test(t) || /^"[A-Za-z0-9:_-]+"\s*:\s*"(?:npm|npx|node|vite|vitest|jest|tsc|eslint|prettier|wrangler|next|react-scripts|webpack|rollup|astro|nuxt|pytest|python)\b/.test(t)) {
      return makeStep(lineNo, t, "npm 스크립트 정의", "터미널에서 npm run 뒤에 붙여 실행할 작업을 정의합니다.", risk);
    }



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

    // TOML_CLOUDFLARE_BINDING_RULES_V215_A1
    if (/^\[\[d1_databases\]\]\s*$/.test(t)) {
      return makeStep(lineNo, t, "Cloudflare D1 설정", "wrangler.toml에서 Cloudflare D1 데이터베이스 바인딩 묶음을 시작합니다. binding 이름과 database_name이 코드의 env.DB 사용과 맞는지 확인합니다.", risk);
    }
    if (/^\[\[r2_buckets\]\]\s*$/.test(t)) {
      return makeStep(lineNo, t, "Cloudflare R2 설정", "wrangler.toml에서 Cloudflare R2 버킷 바인딩 묶음을 시작합니다. binding 이름과 bucket_name이 코드의 env.R2 사용과 맞는지 확인합니다.", risk);
    }
    if (/^binding\s*=/.test(t)) {
      return makeStep(lineNo, t, "Cloudflare binding 이름 설정", "Worker 코드에서 env.DB, env.ASSETS처럼 접근할 바인딩 이름을 설정합니다. 코드에서 쓰는 이름과 정확히 일치해야 합니다.", risk);
    }
    if (/^(database_name|bucket_name)\s*=/.test(t)) {
      return makeStep(lineNo, t, "Cloudflare 리소스 이름 설정", "D1 데이터베이스나 R2 버킷의 실제 리소스 이름을 설정합니다. 운영/개발 환경을 혼동하지 않도록 확인해야 합니다.", risk);
    }

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


    // JAVA_INTERFACE_ENUM_OPTIONAL_IO_RULES_V215_A1
    if (/\binterface\s+\w+/.test(t)) {
      return makeStep(lineNo, t, "interface 정의", "Java interface는 구현 클래스가 따라야 할 메서드 약속을 정의합니다. 어떤 메서드를 반드시 구현해야 하는지 확인합니다.", risk);
    }
    if (/\benum\s+\w+/.test(t)) {
      return makeStep(lineNo, t, "enum 열거형 정의", "Java enum은 FAST, SAFE처럼 정해진 선택지만 갖는 타입을 정의합니다. 상태나 모드를 제한할 때 씁니다.", risk);
    }
    if (/^try\s*\([^)]*\)\s*\{?/.test(t) && /Files\.newBufferedReader\s*\(/.test(t)) {
      return makeStep(lineNo, t, "try-with-resources 예외 처리 / 파일 reader 열기", "Java NIO Files.newBufferedReader로 파일 reader를 열고, try 블록이 끝나면 자동으로 닫는 Java 예외 처리 구조입니다. Path 값과 문자 인코딩, 예외 흐름을 함께 확인해야 합니다.", risk);
    }
    if (/^try\s*\([^)]*\)\s*\{?/.test(t)) {
      return makeStep(lineNo, t, "try-with-resources 예외 처리", "파일 reader 같은 자원을 열고 try 블록이 끝나면 자동으로 닫는 Java 예외 처리 구조입니다. 파일 처리와 예외 흐름을 함께 확인해야 합니다.", risk);
    }
    if (/Files\.newBufferedReader\s*\(/.test(t)) {
      return makeStep(lineNo, t, "파일 reader 열기", "Java NIO Files.newBufferedReader로 파일을 읽기 위한 reader를 엽니다. Path 값과 문자 인코딩, 예외 처리를 확인해야 합니다.", risk);
    }
    if (/Optional\.ofNullable\s*\(|\.orElse\s*\(/.test(t)) {
      return makeStep(lineNo, t, "Optional null 처리", "값이 null일 수 있는 경우 Optional로 감싸고 기본값을 지정합니다. null 때문에 프로그램이 멈추는 일을 줄이는 방어 코드입니다.", risk);
    }
    // JAVA_DEEP_RULES_V190_A2
    if (/^package\s+[A-Za-z_][\w.]*\s*;/.test(t)) {
      return makeStep(lineNo, t, "패키지 선언", "이 Java 파일이 어떤 패키지/폴더 논리 그룹에 속하는지 선언합니다.", risk);
    }
    if (/^import\s+/.test(t)) {
      return makeStep(lineNo, t, "라이브러리 불러오기", "Java 표준 라이브러리나 외부 클래스 기능을 현재 파일에서 사용할 수 있게 가져옵니다.", risk);
    }
    if (/^@[A-Za-z_][\w.]*/.test(t)) {
      return makeStep(lineNo, t, "어노테이션 설정", "클래스나 메서드에 추가 의미를 붙입니다. Spring, JUnit, Lombok 같은 프레임워크에서 자주 씁니다.", risk);
    }
    if (/\binterface\s+\w+/.test(t)) {
      return makeStep(lineNo, t, "인터페이스 정의", "구현 클래스가 반드시 제공해야 하는 메서드 약속을 정의합니다.", risk);
    }
    if (/class\s+\w+/.test(t)) {
      return makeStep(lineNo, t, "클래스 정의", "Java에서 관련 변수와 메서드를 묶는 설계도를 정의합니다.", risk);
    }
    if (/public\s+static\s+void\s+main/.test(t)) {
      return makeStep(lineNo, t, "프로그램 시작점", "Java 프로그램이 실행될 때 가장 먼저 들어오는 main 메서드입니다.", risk);
    }
    // JAVA_METHOD_STREAM_RULES_V190_A2
    // JAVA_PACKAGE_PRIVATE_METHOD_RULE_V208_A1
    if (/^\s*(?:public|private|protected)?\s*(?:static\s+)?[\w<>\[\], ?]+\s+\w+\s*\([^)]*\)\s*(?:throws\s+[\w, ]+)?\s*\{?/.test(t) && !/class\s+/.test(t)) {
      return makeStep(lineNo, t, "메서드 정의", "나중에 객체나 클래스 이름으로 호출할 수 있는 Java 코드 묶음을 정의합니다. 접근제어자가 없어도 같은 패키지 안에서 쓸 수 있는 package-private 메서드일 수 있습니다. 매개변수와 반환 타입을 함께 확인해야 합니다.", risk);
    }
    if (/^try\s*\{/.test(t)) {
      return makeStep(lineNo, t, "오류 대비 시작", "아래 코드를 실행하다가 예외가 생기면 catch/finally 구간에서 처리할 수 있게 준비합니다.", risk);
    }
    // JAVA_IO_EXCEPTION_RULE_V201_A1
    if (/\bIOException\b/.test(t)) {
      return makeStep(lineNo, t, "입출력 예외 처리", "파일 읽기/쓰기나 네트워크 입출력 중 발생할 수 있는 IOException을 처리합니다. 실패 시 사용자에게 어떤 메시지를 보여줄지 확인해야 합니다.", risk);
    }
    if (/^\}?\s*catch\s*\(/.test(t)) {
      return makeStep(lineNo, t, "오류 처리", "try 안에서 발생한 예외를 잡아 로그를 남기거나 대체 처리를 합니다.", risk);
    }
    if (/^\}?\s*finally\s*\{/.test(t)) {
      return makeStep(lineNo, t, "마지막 정리", "성공/실패와 관계없이 마지막에 실행되는 정리 구간입니다.", risk);
    }
    if (/^throw\s+new\s+/.test(t) || /^throw\s+/.test(t)) {
      return makeStep(lineNo, t, "예외 발생시키기", "조건이 맞지 않거나 계속 진행하면 위험할 때 의도적으로 예외를 발생시킵니다.", risk);
    }
    if (/\bnew\s+(ArrayList|HashMap|HashSet|LinkedList|TreeMap|TreeSet)\b|\b(List|Map|Set|Queue)<[^>]+>\s+\w+/.test(t)) {
      return makeStep(lineNo, t, "컬렉션/맵 만들기", "여러 값을 담는 List, Map, Set 같은 자료구조를 준비합니다.", risk);
    }
    if (/\.add\s*\(/.test(t)) {
      return makeStep(lineNo, t, "컬렉션에 값 추가", "List나 Set 같은 컬렉션에 새 값을 추가합니다.", risk);
    }
    if (/\.put\s*\(/.test(t)) {
      return makeStep(lineNo, t, "맵에 값 저장", "Map 구조에 key와 value를 저장합니다. 같은 key가 있으면 값이 바뀔 수 있습니다.", risk);
    }
    if (/\.stream\s*\(/.test(t)) {
      return makeStep(lineNo, t, "스트림 처리 시작", "컬렉션 데이터를 filter/map/collect 같은 연속 처리 흐름으로 다루기 시작합니다.", risk);
    }
    if (/\.filter\s*\(/.test(t)) {
      return makeStep(lineNo, t, "스트림 필터링", "조건에 맞는 항목만 남깁니다. 조건식이 실제 의도와 맞는지 확인해야 합니다.", risk);
    }
    if (/\.map\s*\(/.test(t)) {
      return makeStep(lineNo, t, "스트림 변환", "각 항목을 다른 형태의 값으로 바꿉니다.", risk);
    }
    if (/\.collect\s*\(/.test(t) || /Collectors\./.test(t)) {
      return makeStep(lineNo, t, "스트림 결과 모으기", "스트림 처리 결과를 List, Set, Map 같은 최종 자료구조로 모읍니다.", risk);
    }
    if (/\bnew\s+\w+\s*\(/.test(t)) {
      return makeStep(lineNo, t, "객체 생성", "클래스 설계도를 바탕으로 실제 사용할 객체를 만듭니다.", risk);
    }
    if (/Files\.(readString|writeString|readAllLines|write|copy|move|delete|deleteIfExists)|Paths\.get|Path\.of/.test(t)) {
      return makeStep(lineNo, t, "파일/경로 처리", "Java NIO로 파일 경로를 만들거나 파일을 읽고 씁니다. 삭제/이동은 대상 경로를 확인해야 합니다.", risk);
    }
    if (/HttpClient|HttpRequest|HttpResponse|\.send\s*\(/.test(t)) {
      return makeStep(lineNo, t, "HTTP 요청 처리", "Java 코드에서 웹 API 요청을 만들거나 응답을 받습니다. 상태 코드와 예외 처리를 확인해야 합니다.", risk);
    }
    if (/DriverManager\.getConnection|PreparedStatement|ResultSet|executeQuery|executeUpdate/.test(t)) {
      return makeStep(lineNo, t, "DB 접근", "Java에서 데이터베이스 연결, SQL 준비, 조회/수정 실행을 처리합니다.", risk);
    }
    if (/System\.(out|err)\.println/.test(t)) {
      return makeStep(lineNo, t, "화면에 출력", "괄호 안 값을 콘솔 화면에 보여줍니다. err는 오류 메시지 출력에 자주 씁니다.", risk);
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

    // JAVA_PLUS_EQUALS_ACCUMULATOR_V329_A1
    if (/^[A-Za-z_][A-Za-z0-9_]*(?:\[[^\]]+\]|\.[A-Za-z_][A-Za-z0-9_]*)?\s*\+=\s*.+;?$/.test(t)) {
      return makeStep(lineNo, t, "누적 더하기", "왼쪽 변수에 오른쪽 값을 더해서 다시 저장합니다. 합계, 점수, 개수를 쌓아 갈 때 자주 씁니다.", risk);
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

    // PYTHON_META_GUARD_V187_A2
    if (language === "python") {
      if (/csv\.|csv |csv\b|dictreader|dictwriter|writerow|writeheader/.test(text)) {
        category = category === "처리" ? "파일/경로" : category;
        pushUnique(tags, "CSV");
        pushUnique(tags, "파일");
      }
      if (/pandas|dataframe|groupby|merge|fillna|dropna|to_csv|read_csv/.test(text)) {
        category = category === "처리" ? "데이터처리" : category;
        pushUnique(tags, "pandas");
      }
      if (/try|except|finally|raise|assert|예외|조건 검증/.test(codeTitle)) {
        category = "오류처리";
        pushUnique(tags, "오류처리");
      }
      if (/logging|logger|로그/.test(text)) {
        category = category === "처리" ? "출력/응답" : category;
        pushUnique(tags, "로깅");
      }
      if (/os\.environ|os\.getenv|getenv|load_dotenv|환경변수/.test(text)) {
        category = category === "처리" ? "환경설정" : category;
        pushUnique(tags, "환경변수");
      }
      if (/__main__|직접 실행 진입점/.test(text)) {
        category = "구조";
        pushUnique(tags, "함수/구조");
      }
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

    // JAVA_META_GUARD_V190_A2
    if (language === "java") {
      pushUnique(tags, "Java");
      if (/패키지 선언|라이브러리 불러오기|^package\s+|^import\s+/.test(text)) {
        category = category === "처리" ? "의존성" : category;
        pushUnique(tags, "의존성");
      }
      if (/클래스 정의|메서드 정의|인터페이스 정의|프로그램 시작점|class\s+|interface\s+|main\s*\(/.test(text)) {
        category = "구조";
        pushUnique(tags, "함수/구조");
      }
      if (/try\s*\{|catch\s*\(|finally|throw|오류 대비|오류 처리|예외/.test(codeTitle)) {
        category = "오류처리";
        pushUnique(tags, "오류처리");
      }
      if (/arraylist|hashmap|hashset|list<|map<|set<|queue<|컬렉션|맵/.test(text)) {
        category = category === "처리" ? "데이터처리" : category;
        pushUnique(tags, "컬렉션");
      }
      if (/stream\s*\(|\.filter\s*\(|\.map\s*\(|collectors|스트림/.test(text)) {
        category = category === "처리" ? "데이터처리" : category;
        pushUnique(tags, "스트림");
      }
      if (/files\.|paths\.|path\.of|파일\/경로/.test(text)) {
        category = category === "처리" ? "파일/경로" : category;
        pushUnique(tags, "파일");
      }
      if (/httpclient|httprequest|httpresponse|http 요청/.test(text)) {
        category = category === "처리" ? "네트워크/API" : category;
        pushUnique(tags, "API");
      }
      if (/drivermanager|preparedstatement|resultset|executequery|executeupdate|db 접근/.test(text)) {
        category = "DB";
        pushUnique(tags, "DB");
        pushUnique(tags, "SQL");
      }
    }

    // JS_WORKERS_META_GUARD_V189_A2
    if (language === "javascript" || language === "workers") {
      if (/domcontentloaded|document\.|queryselector|getelementbyid|classlist|dataset|화면 요소|css 클래스/.test(text)) {
        category = category === "처리" ? "화면/UI" : category;
        pushUnique(tags, "DOM");
        pushUnique(tags, "UI");
      }
      if (/json\.parse|json\.stringify|응답 json|json 문자열|json/.test(text)) {
        category = category === "처리" ? "데이터변환" : category;
        pushUnique(tags, "JSON");
      }
      if (/array\.from|\.map\s*\(|\.filter\s*\(|\.reduce\s*\(|배열/.test(text)) {
        category = category === "처리" ? "데이터처리" : category;
        pushUnique(tags, "배열");
      }
      if (/await|promise|비동기/.test(text)) {
        category = category === "처리" ? "비동기" : category;
        pushUnique(tags, "비동기");
      }
      if (/env\.kv|kv 값|kv 저장소/.test(text)) {
        category = category === "처리" ? "저장소" : category;
        pushUnique(tags, "KV");
        pushUnique(tags, "Cloudflare");
      }
      if (/env\.r2|r2 객체|r2 저장소/.test(text)) {
        category = category === "처리" ? "저장소" : category;
        pushUnique(tags, "R2");
        pushUnique(tags, "Cloudflare");
      }
      if (/env\.[a-z0-9_]*queue|queue 메시지|queue/.test(text)) {
        category = category === "처리" ? "큐" : category;
        pushUnique(tags, "Queue");
        pushUnique(tags, "Cloudflare");
      }
      if (/caches\.default|캐시/.test(text)) {
        category = category === "처리" ? "캐시" : category;
        pushUnique(tags, "캐시");
        pushUnique(tags, "Cloudflare");
      }
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

    // POWERSHELL_META_GUARD_V188_A2
    if (language === "powershell") {
      if (/pipeline|파이프라인|where-object|foreach-object|select-object|sort-object|group-object|measure-object/.test(text)) {
        category = category === "처리" ? "파이프라인" : category;
        pushUnique(tags, "파이프라인");
      }
      if (/convertfrom-json|convertto-json|json/.test(text)) {
        category = category === "처리" ? "데이터변환" : category;
        pushUnique(tags, "JSON");
      }
      if (/import-csv|export-csv|convertfrom-csv|csv/.test(text)) {
        category = category === "처리" ? "파일/경로" : category;
        pushUnique(tags, "CSV");
        pushUnique(tags, "파일");
      }
      if (/start-process|get-process|stop-process|process|프로세스/.test(text)) {
        category = category === "처리" ? "프로세스" : category;
        pushUnique(tags, "프로세스");
      }
      if (/param\s*\(|입력 파라미터/.test(text)) {
        category = "CLI";
        pushUnique(tags, "CLI");
      }
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

  // MERMAID_FLOW_QUALITY_V191_A1
  function mermaidClassForStep(step) {
    const category = step.category || "";
    if (step.risk === "high") return "highRisk";
    if (step.risk === "medium") return "mediumRisk";
    if (category === "조건") return "conditionStep";
    if (category === "반복") return "loopStep";
    if (category === "오류처리") return "errorStep";
    if (category === "DB" || category === "파일/경로" || category === "저장소" || category === "데이터변환" || category === "데이터처리") return "dataStep";
    if (category === "출력/응답" || category === "네트워크/API" || category === "배포") return "ioStep";
    return "defaultStep";
  }

  function mermaidEdgeLabel(step) {
    const category = step.category || "";
    if (!category || category === "처리") return "다음";
    return mermaidLabel(category);
  }

  function mermaidNodeLine(id, label, step) {
    const category = step.category || "";
    if (category === "조건") return id + '{"' + label + '"}';
    if (category === "반복") return id + '[["' + label + '"]]';
    if (category === "출력/응답" || category === "네트워크/API" || category === "배포") return id + '(["' + label + '"])';
    return id + '["' + label + '"]';
  }

  function buildMermaid(steps, dataFlow, callFlow) {
    if (!steps.length) return "flowchart TD\n  START_NODE([시작])\n  START_NODE --> EMPTY[분석할 코드 없음]\n  EMPTY --> END_NODE([끝])";

    const lines = [
      "flowchart TD",
      "  classDef startEnd fill:#eef2ff,stroke:#4338ca,color:#111827;",
      "  classDef highRisk fill:#fee2e2,stroke:#b91c1c,color:#111827;",
      "  classDef mediumRisk fill:#fef3c7,stroke:#b45309,color:#111827;",
      "  classDef conditionStep fill:#e0f2fe,stroke:#0369a1,color:#111827;",
      "  classDef loopStep fill:#f3e8ff,stroke:#7e22ce,color:#111827;",
      "  classDef errorStep fill:#ffe4e6,stroke:#be123c,color:#111827;",
      "  classDef dataStep fill:#dcfce7,stroke:#15803d,color:#111827;",
      "  classDef ioStep fill:#ccfbf1,stroke:#0f766e,color:#111827;",
      "  classDef defaultStep fill:#f8fafc,stroke:#64748b,color:#111827;",
      "  START_NODE([시작])",
      "  END_NODE([끝])",
      "  class START_NODE,END_NODE startEnd;"
    ];

    const limited = steps.slice(0, 40);

    limited.forEach(function(step, idx) {
      const id = "N" + (idx + 1);
      const riskPrefix = step.risk === "high" ? "위험 · " : step.risk === "medium" ? "주의 · " : "";
      const categoryPrefix = step.category && step.category !== "처리" ? step.category + " · " : "";
      const label = mermaidLabel((idx + 1) + ". " + riskPrefix + categoryPrefix + step.title);
      const from = idx === 0 ? "START_NODE" : "N" + idx;

      lines.push("  " + mermaidNodeLine(id, label, step));
      lines.push("  " + from + " -->|" + mermaidEdgeLabel(step) + "| " + id);
      lines.push("  class " + id + " " + mermaidClassForStep(step) + ";");
    });

    if (steps.length > 40) {
      lines.push('  MORE["나머지 ' + (steps.length - 40) + '단계 생략"]');
      lines.push("  N40 -->|생략| MORE");
      lines.push("  class MORE defaultStep;");
      lines.push("  MORE --> END_NODE");
    } else {
      lines.push("  N" + limited.length + " --> END_NODE");
    }

    const dataItems = Array.isArray(dataFlow) ? dataFlow : [];
    const callItems = Array.isArray(callFlow) ? callFlow : [];

    if (dataItems.length) {
      // MERMAID_PRODUCER_CONSUMER_EDGES_V211_A1
      // MERMAID_EXTERNAL_INPUT_EDGES_V212_A1
      const limitedDataItems = dataItems.slice(0, 8);
      const producedBy = {};
      const dataEdgeSeen = {};
      const externalInputByName = {};
      let externalInputCount = 0;

      lines.push("  subgraph DATA_FLOW[데이터 흐름]");
      limitedDataItems.forEach(function(item, idx) {
        const id = "DF" + (idx + 1);
        const produces = Array.isArray(item.produces) ? item.produces : [];
        const consumes = Array.isArray(item.consumes) ? item.consumes : [];
        const details = [];

        if (produces.length) details.push("생성:" + produces.slice(0, 3).join(","));
        if (consumes.length) details.push("사용:" + consumes.slice(0, 3).join(","));

        const label = mermaidLabel(item.kind + " · " + item.name + (details.length ? " · " + details.join(" · ") : ""));
        lines.push("  " + id + '["' + label + '"]');
        lines.push("  class " + id + " dataStep;");

        produces.forEach(function(name) {
          if (name && !producedBy[name]) producedBy[name] = id;
        });
      });

      limitedDataItems.forEach(function(item, idx) {
        const id = "DF" + (idx + 1);
        const consumes = Array.isArray(item.consumes) ? item.consumes : [];
        let hasProducerEdge = false;

        consumes.forEach(function(name) {
          let from = producedBy[name];

          if (!from && name) {
            if (!externalInputByName[name]) {
              externalInputCount += 1;
              externalInputByName[name] = "DI" + externalInputCount;
              lines.push("  " + externalInputByName[name] + '(["' + mermaidLabel("입력 · " + name) + '"])');
              lines.push("  class " + externalInputByName[name] + " dataStep;");
            }
            from = externalInputByName[name];
          }

          const key = from + "|" + id + "|" + name;

          if (!from || from === id || dataEdgeSeen[key]) return;

          dataEdgeSeen[key] = true;
          hasProducerEdge = true;
          lines.push("  " + from + " -->|사용:" + mermaidLabel(name) + "| " + id);
        });

        if (!hasProducerEdge && idx > 0) {
          lines.push("  DF" + idx + " -.흐름.-> " + id);
        }
      });

      lines.push("  end");
      lines.push("  START_NODE -.데이터.-> DF1");
    }

    if (callItems.length) {
      lines.push("  subgraph CALL_FLOW[호출 흐름]");
      callItems.slice(0, 8).forEach(function(item, idx) {
        const id = "CF" + (idx + 1);
        const label = mermaidLabel(item.type + " · " + item.name);
        lines.push("  " + id + '["' + label + '"]');
        lines.push("  class " + id + " defaultStep;");
        if (idx > 0) lines.push("  CF" + idx + " -.-> " + id);
      });
      lines.push("  end");
      lines.push("  START_NODE -.호출.-> CF1");
    }

    return lines.join("\n");
  }

  // DATA_CALL_FLOW_V203_A1
  // PRODUCER_CONSUMER_DATA_FLOW_V209_A1
  function trimSourcePreview(value) {
    return String(value || "").trim().replace(/;$/, "").slice(0, 80);
  }

  function uniqueNames(values) {
    const seen = {};
    const out = [];
    (values || []).forEach(function(value) {
      const name = String(value || "").trim();
      if (!name || seen[name]) return;
      seen[name] = true;
      out.push(name);
    });
    return out;
  }

  function stripQuotedStrings(value) {
    return String(value || "")
      .replace(/"([^"\\]|\\.)*"/g, " ")
      .replace(/'([^'\\]|\\.)*'/g, " ")
      .replace(/`([^`\\]|\\.)*`/g, " ");
  }

  function isDataFlowNoiseName(name, language) {
    const n = String(name || "");
    if (!n) return true;
    if (/^\d/.test(n)) return true;

    const common = {
      "true": true, "false": true, "null": true, "undefined": true, "None": true, "True": true, "False": true,
      "return": true, "if": true, "else": true, "for": true, "while": true, "with": true, "try": true, "catch": true,
      "function": true, "def": true, "class": true, "new": true, "const": true, "let": true, "var": true,
      "public": true, "private": true, "protected": true, "static": true, "throws": true, "throw": true,
      "print": true, "console": true, "log": true, "error": true, "System": true, "out": true, "err": true, "println": true,
      "Response": true, "json": true, "Files": true, "Path": true, "of": true, "readString": true,
      "map": true, "filter": true, "list": true, "dict": true, "set": true, "tuple": true, "str": true,
      "int": true, "float": true, "bool": true, "String": true, "Number": true, "Boolean": true, "Array": true, "Object": true
    };

    if (common[n]) return true;
    if (language === "powershell" && /^[A-Z][A-Za-z]+-[A-Z]/.test(n)) return true;
    return false;
  }

  function extractDataFlowNames(value, language, exclude) {
    const text = stripQuotedStrings(value);
    const excludes = {};
    (exclude || []).forEach(function(name) {
      excludes[name] = true;
    });

    const out = [];
    let re;
    let match;

    if (language === "powershell") {
      re = /\$([A-Za-z_][\w-]*)/g;
      while ((match = re.exec(text)) !== null) {
        const name = match[1];
        // POWERSHELL_OUT_VARIABLE_CONSUME_FIX_V210_A1
        // PowerShell 변수는 $out처럼 일반 변수명이 out일 수 있다.
        // Java System.out 잡음을 막기 위한 공통 noise 목록을 그대로 적용하지 않는다.
        if (!excludes[name] && !/^(true|false|null|args|input|this|PSItem|_)$/i.test(name)) out.push(name);
      }
      return uniqueNames(out);
    }

    re = /\b([A-Za-z_$][\w$]*)\b/g;
    while ((match = re.exec(text)) !== null) {
      const name = match[1];
      const before = match.index > 0 ? text[match.index - 1] : "";
      const after = text[re.lastIndex] || "";

      if (before === ".") continue;
      if (after === ":") continue;
      if (excludes[name]) continue;
      if (isDataFlowNoiseName(name, language)) continue;

      out.push(name);
    }

    return uniqueNames(out);
  }

  function addDataFlowItem(list, seen, lineNo, kind, name, code, summary, produces, consumes) {
    const producerList = uniqueNames(produces || (name ? [name] : []));
    const consumerList = uniqueNames(consumes || []);
    const key = [lineNo, kind, name, code, producerList.join(","), consumerList.join(",")].join("|");
    if (seen[key]) return;
    seen[key] = true;
    list.push({
      lineNo: lineNo,
      kind: kind,
      name: name || "값",
      code: code,
      summary: summary || "",
      produces: producerList,
      consumes: consumerList
    });
  }

  function collectDataFlow(steps, language) {
    const list = [];
    const seen = {};

    (steps || []).forEach(function(step) {
      const code = cleanLine(step.code);
      let match;

      if (!code) return;

      if (language === "powershell") {
        match = code.match(/^\$([A-Za-z_][\w-]*)\s*=\s*(.+)$/);
      } else if (language === "javascript" || language === "workers") {
        match = code.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(.+)$/);
      } else if (language === "python") {
        match = code.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
      } else if (language === "java") {
        match = code.match(/\b(?:String|int|double|boolean|long|float|var|List<[^>]+>|Map<[^>]+>|Set<[^>]+>)\s+([A-Za-z_]\w*)\s*=\s*(.+?);?$/);
      }

      if (match) {
        const producedName = match[1];
        const rhs = match[2];
        const consumedNames = extractDataFlowNames(rhs, language, [producedName]);
        const consumerText = consumedNames.length ? " 사용: " + consumedNames.join(", ") + "." : "";
        addDataFlowItem(
          list,
          seen,
          step.lineNo,
          "생성/저장",
          producedName,
          code,
          producedName + "에 " + trimSourcePreview(rhs) + " 결과를 저장합니다." + consumerText,
          [producedName],
          consumedNames
        );
      }

      match = code.match(/\b([A-Za-z_]\w*)\.(append|extend|update|push|add|put|setItem)\s*\(/);
      if (match) {
        const targetName = match[1];
        const consumedNames = uniqueNames([targetName].concat(extractDataFlowNames(code, language, [targetName])));
        addDataFlowItem(list, seen, step.lineNo, "가공", targetName, code, targetName + " 값을 추가하거나 갱신합니다.", [targetName], consumedNames);
      }

      if (/^return\b/.test(code) || /\breturn\s+/.test(code)) {
        const consumedNames = extractDataFlowNames(code.replace(/^return\s+/, ""), language, []);
        addDataFlowItem(list, seen, step.lineNo, "반환", "return", code, "함수 밖으로 결과를 돌려줍니다.", ["return"], consumedNames);
      }

      if (/print\s*\(|console\.(log|error)\s*\(|System\.(out|err)\.println|Response\.json|new\s+Response/.test(code)) {
        const consumedNames = extractDataFlowNames(code, language, []);
        addDataFlowItem(list, seen, step.lineNo, "출력/응답", "output", code, "처리 결과를 화면이나 응답으로 내보냅니다.", ["output"], consumedNames);
      }

      if (/json\.dump\s*\(|\.write_text\s*\(|\.write\s*\(|\.to_csv\s*\(|Set-Content|Out-File|Export-Csv/i.test(code)) {
        const consumedNames = extractDataFlowNames(code, language, []);
        addDataFlowItem(list, seen, step.lineNo, "파일 저장", "file", code, "처리 결과를 파일에 저장합니다.", ["file"], consumedNames);
      }
    });

    return list.slice(0, 20);
  }

  function addCallFlowItem(list, seen, lineNo, type, name, target, code, summary) {
    const key = [lineNo, type, name, target, code].join("|");
    if (seen[key]) return;
    seen[key] = true;
    list.push({
      lineNo: lineNo,
      type: type,
      name: name,
      target: target || "",
      code: code,
      summary: summary || ""
    });
  }

  // FLOW_PRECISION_HELPERS_V205_A1
  function isKnownPowerShellCommand(name) {
    return /^(Set-Location|Get-ChildItem|Get-Content|Set-Content|Add-Content|Out-File|Write-Host|Select-Object|Where-Object|ForEach-Object|Sort-Object|Group-Object|Measure-Object|ConvertTo-Json|ConvertFrom-Json|Import-Csv|Export-Csv|New-Item|Copy-Item|Remove-Item|Test-Path|Join-Path|Start-Process|Get-Process|Stop-Process)$/i.test(String(name || ""));
  }

  function collectCallFlow(raw, language) {
    const lines = String(raw || "").split(/\r?\n/);
    const definitions = {};
    const list = [];
    const seen = {};
    const skip = {
      "if": true,
      "for": true,
      "while": true,
      "with": true,
      "return": true,
      "class": true,
      "catch": true,
      "function": true,
      "public": true,
      "private": true,
      "protected": true,
      "new": true,
      "switch": true
    };

    lines.forEach(function(line, idx) {
      const lineNo = idx + 1;
      const code = cleanLine(line);
      let match;

      if (!code) return;

      if (language === "python") {
        match = code.match(/^(?:async\s+)?def\s+([A-Za-z_]\w*)\s*\(/);
        if (match) {
          definitions[match[1]] = lineNo;
          addCallFlowItem(list, seen, lineNo, "정의", match[1], "", code, "사용자 함수 정의입니다.");
        }
      }

      if (language === "javascript" || language === "workers") {
        match = code.match(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/) || code.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(?/);
        if (match && /=>|function\s*\(|function\s+/.test(code)) {
          definitions[match[1]] = lineNo;
          addCallFlowItem(list, seen, lineNo, "정의", match[1], "", code, "사용자 함수/핸들러 정의입니다.");
        }
      }

      if (language === "java") {
        match = code.match(/\b(?:public|private|protected)?\s*(?:static\s+)?[A-Za-z_<>, \[\]]+\s+([A-Za-z_]\w*)\s*\([^)]*\)\s*(?:throws\s+[\w, ]+)?\s*\{/);
        if (match) {
          definitions[match[1]] = lineNo;
          addCallFlowItem(list, seen, lineNo, "정의", match[1], "", code, "Java 메서드 정의입니다.");
        }
      }

      if (language === "powershell") {
        match = code.match(/^function\s+([A-Za-z_][\w-]*)/i);
        if (match) {
          definitions[match[1]] = lineNo;
          addCallFlowItem(list, seen, lineNo, "정의", match[1], "", code, "PowerShell 함수 정의입니다.");
        }
      }
    });

    lines.forEach(function(line, idx) {
      const lineNo = idx + 1;
      const code = cleanLine(line);
      let re;
      let match;

      if (!code) return;

      if (language === "powershell") {
        re = /\b([A-Za-z][\w-]*)\b/g;
      } else {
        re = /\b([A-Za-z_$][\w$]*)\s*\(/g;
      }

      while ((match = re.exec(code)) !== null) {
        const name = match[1];
        if (!name || skip[name]) continue;

        // CALL_FLOW_SELF_CALL_GUARD_V205_A1
        if (definitions[name] && definitions[name] === lineNo) continue;
        if (language === "python" && /^def\s+/.test(code)) continue;
        if ((language === "javascript" || language === "workers") && /function\s+/.test(code) && code.includes(name)) continue;

        if (language === "powershell") {
          const before = code.slice(Math.max(0, match.index - 1), match.index);
          const after = code.slice(re.lastIndex, re.lastIndex + 1);
          if (before === "." || before === "\\" || before === "/" || after === "." || after === "\\" || after === "/") continue;
          if (!definitions[name] && !isKnownPowerShellCommand(name)) continue;
        }

        if (definitions[name]) {
          addCallFlowItem(list, seen, lineNo, "호출", name, "line " + definitions[name], code, "사용자 정의 함수/메서드를 호출합니다.");
        } else if (language === "powershell" && isKnownPowerShellCommand(name)) {
          addCallFlowItem(list, seen, lineNo, "호출", name, "PowerShell 명령", code, "PowerShell 내장 명령이나 cmdlet을 호출합니다.");
        } else if (/^(print|open|range|enumerate|len|json|fetch|setTimeout|addEventListener|println|readString|of|Path|Files|Response|console|document|localStorage)$/.test(name)) {
          addCallFlowItem(list, seen, lineNo, "호출", name, "내장/라이브러리", code, "내장 함수나 라이브러리 기능을 호출합니다.");
        }
      }
    });

    return list.slice(0, 24);
  }

  // UNKNOWN_ASSIGNMENT_CALL_V205_A1
  function collectLocalDefinitions(raw, language) {
    const lines = String(raw || "").split(/\r?\n/);
    const defs = {};

    lines.forEach(function(line, idx) {
      const code = cleanLine(line);
      let match;

      if (language === "python") {
        match = code.match(/^(?:async\s+)?def\s+([A-Za-z_]\w*)\s*\(/);
      } else if (language === "javascript" || language === "workers") {
        match = code.match(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/) || code.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(?/);
      } else if (language === "java") {
        match = code.match(/\b(?:public|private|protected)?\s*(?:static\s+)?[A-Za-z_<>, \[\]]+\s+([A-Za-z_]\w*)\s*\([^)]*\)\s*(?:throws\s+[\w, ]+)?\s*\{/);
      } else if (language === "powershell") {
        match = code.match(/^function\s+([A-Za-z_][\w-]*)/i);
      }

      if (match) defs[match[1]] = idx + 1;
    });

    return defs;
  }

  function isKnownStandaloneCall(language, name) {
    const n = String(name || "");
    const common = /^(print|open|range|enumerate|len|list|dict|set|tuple|str|int|float|bool|sum|min|max|map|filter|sorted|reversed|next|iter|round|abs|isinstance|Path|JSON|URL|Date|String|Number|Boolean|Array|Object|parseInt|parseFloat|fetch)$/;
    if (common.test(n)) return true;
    if (language === "python" && /^(json|csv|pd|pandas|np|numpy|os|sys|Path|traceback|time|dataclasses|collections|itertools|random|defaultdict|Counter|deque|FastAPI|APIRouter|Depends|HTTPException|Query|Body|Path|DataFrame|Series|array|zeros|ones|arange|linspace|read_csv|concat|mean|median|std)$/.test(n)) return true;
    if ((language === "javascript" || language === "workers") && /^set[A-Z][A-Za-z0-9_$]*$/.test(n)) return true;
    if ((language === "javascript" || language === "workers") && /^(document|console|localStorage|Response|Promise|Math|process|React|ReactDOM|useState|useEffect|useMemo|useCallback|useRef|useContext|createRoot)$/.test(n)) return true;
    return false;
  }

  // NESTED_UNKNOWN_CALL_V207_A1
  function pushUnknownCallName(list, seen, language, name, definitions) {
    const n = String(name || "");
    if (!n || seen[n]) return;
    if (definitions[n] || isKnownStandaloneCall(language, n)) return;
    seen[n] = true;
    list.push(n);
  }

  function unknownAssignmentCallNames(code, language, definitions) {
    const t = cleanLine(code);
    const list = [];
    const seen = {};
    let match;
    let rhs = "";

    if (language === "python") {
      match = t.match(/^[A-Za-z_]\w*\s*=\s*(.+)$/);
      if (!match) return list;
      rhs = match[1];

      rhs.replace(/\b(?:map|filter)\s*\(\s*([A-Za-z_]\w*)\s*,/g, function(_, name) {
        pushUnknownCallName(list, seen, language, name, definitions);
        return _;
      });

      const re = /\b([A-Za-z_]\w*)\s*\(/g;
      while ((match = re.exec(rhs)) !== null) {
        if (match.index > 0 && rhs[match.index - 1] === ".") continue;
        pushUnknownCallName(list, seen, language, match[1], definitions);
      }

      return list;
    }

    if (language === "javascript" || language === "workers") {
      match = t.match(/^(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*(.+)$/);
      if (!match) return list;
      rhs = match[1];

      const re = /\b([A-Za-z_$][\w$]*)\s*\(/g;
      while ((match = re.exec(rhs)) !== null) {
        if (match.index > 0 && rhs[match.index - 1] === ".") continue;
        pushUnknownCallName(list, seen, language, match[1], definitions);
      }

      return list;
    }

    return list;
  }

  function unknownAssignmentCallName(code, language) {
    const names = unknownAssignmentCallNames(code, language, {});
    return names.length ? names[0] : "";
  }

  function refineUnknownCallConfidence(steps, raw, language) {
    const definitions = collectLocalDefinitions(raw, language);

    return (steps || []).map(function(step) {
      if (step && (
        step.title === "URL 쿼리 파라미터 읽기" ||
        step.title === "비동기 병렬 처리" ||
        step.title === "DOM 요소 생성" ||
        step.title === "DOM 텍스트 설정" ||
        step.title === "DOM 요소 삽입" ||
        step.title === "엄격 모드 선언" ||
        step.title === "Node.js 모듈 불러오기" ||
        step.title === "Node.js 파일 처리" ||
        step.title === "Node.js 경로 처리" ||
        step.title === "외부 명령 실행" ||
        step.title === "격리 실행 컨텍스트 사용" ||
        step.title === "객체 속성 설정" ||
        step.title === "객체/배열 초기화" ||
        step.title === "객체 값 갱신" ||
        step.title === "문자열/배열 메서드 처리" ||
        step.title === "문자열 데이터 항목" ||
        step.title === "예제 코드 문자열" ||
        step.title === "블록/객체 닫기"
      )) {
        return step;
      }

      const names = unknownAssignmentCallNames(step.code, language, definitions);
      if (!names.length) return step;

      const knownGlobalCalls = {
        URLSearchParams: true,
        Promise: true,
        Array: true,
        Object: true,
        Date: true,
        Map: true,
        Set: true,
        String: true,
        JSON: true,
        Math: true,
        RegExp: true,
        Error: true,
        Number: true,
        Boolean: true,
        parseInt: true,
        parseFloat: true,
        encodeURIComponent: true,
        decodeURIComponent: true,
        require: true,
        fetch: true,
        function: true,
        Counter: true,
        confirm: true,
        alert: true,
        FastAPI: true,
        APIRouter: true,
        Depends: true,
        HTTPException: true,
        Query: true,
        Body: true
      };
      const unsupportedNames = names.filter(function(name) {
        return !knownGlobalCalls[name];
      });
      if (!unsupportedNames.length) return step;

      // PYTHON_OBJECT_CREATE_BEFORE_UNKNOWN_CALL_V322_A3_FIX
      const objectCreateBeforeUnknownCallV322A3 = step && step.code ? cleanLine(step.code).match(/^([A-Za-z_]\w*)\s*=\s*([A-Z][A-Za-z_]\w*)\s*\((.*)\)\s*$/) : null;
      if (objectCreateBeforeUnknownCallV322A3) {
        return Object.assign({}, step, {
          title: "객체 생성 결과 저장",
          explain: objectCreateBeforeUnknownCallV322A3[2] + " 클래스로 새 객체를 만들고, 그 결과를 " + objectCreateBeforeUnknownCallV322A3[1] + " 변수에 저장합니다. 이때 클래스의 __init__ 메서드가 객체의 초기값을 설정할 수 있습니다.",
          confidence: "exact",
          confidenceLabel: confidenceLabel("exact"),
          unsupportedTokens: []
        });
      }



      return Object.assign({}, step, {
        title: "미등록 함수 결과 저장",
        explain: unsupportedNames.join(", ") + " 함수 호출 결과를 변수에 저장합니다. 이 코드 조각 안에서는 함수 정의가 보이지 않으므로 외부 정의나 오타 여부를 확인해야 합니다.",
        confidence: "unsupported",
        confidenceLabel: confidenceLabel("unsupported"),
        unsupportedTokens: unsupportedNames
      });
    });
  }


  // PYTHON_LIST_COMPREHENSION_EXPAND_V329_A4
  function expandPythonListComprehensionStepsV329A4(steps, language) {
    if (language !== "python") return steps;
    if (!Array.isArray(steps)) return steps;

    const expanded = [];

    steps.forEach(function(step) {
      expanded.push(step);

      const code = String(step && step.code || "").trim();
      const lineNo = step && step.lineNo ? step.lineNo : 0;

      if (!/^return\s+\[.+\bfor\b.+\]$/.test(code)) return;

      const risk = riskOf(code, "python");

      expanded.push(makeStep(
        lineNo,
        code,
        "반복문",
        "리스트 컴프리헨션 안의 for 부분은 원본 목록에서 값을 하나씩 꺼내 결과 리스트를 만드는 반복 흐름입니다.",
        risk
      ));

      if (/\bif\b/.test(code)) {
        expanded.push(makeStep(
          lineNo,
          code,
          "조건 검사",
          "리스트 컴프리헨션 안의 if 부분은 조건에 맞는 항목만 결과 리스트에 포함하게 거르는 역할을 합니다.",
          risk
        ));
      }
    });

    return expanded;
  }


  // JS_ASYNC_EVENT_HANDLER_EXPAND_V329_A6
  function expandJavaScriptEventHandlerStepsV329A6(steps, language) {
    if (language !== "javascript" && language !== "workers") return steps;
    if (!Array.isArray(steps)) return steps;

    const expanded = [];

    steps.forEach(function(step) {
      expanded.push(step);

      const code = String(step && step.code || "").trim();
      const lineNo = step && step.lineNo ? step.lineNo : 0;
      const title = String(step && step.title || "");

      if (!/addEventListener\s*\(/.test(code)) return;
      if (title === "이벤트 처리 함수 정의") return;

      const risk = riskOf(code, language);

      expanded.push(makeStep(
        lineNo,
        code,
        "이벤트 처리 함수 정의",
        "사용자가 클릭, 입력 같은 동작을 했을 때 실행할 함수를 화면 요소에 연결합니다. async 콜백이면 내부에서 await로 비동기 작업을 기다릴 수 있습니다.",
        risk
      ));
    });

    return expanded;
  }


  // JS_LOCAL_STORAGE_ASSIGNMENT_EXPAND_V329_A7
  function expandJavaScriptLocalStorageAssignmentStepsV329A7(steps, language) {
    if (language !== "javascript" && language !== "workers") return steps;
    if (!Array.isArray(steps)) return steps;

    const expanded = [];

    steps.forEach(function(step) {
      expanded.push(step);

      const code = String(step && step.code || "").trim();
      const lineNo = step && step.lineNo ? step.lineNo : 0;
      const title = String(step && step.title || "");

      if (!/\b(const|let|var)\s+[A-Za-z_$][\w$]*\s*=/.test(code)) return;
      if (!/\b(?:localStorage|sessionStorage)\.getItem\s*\(/.test(code)) return;
      if (title === "변수에 값 저장") return;

      const risk = riskOf(code, language);

      expanded.push(makeStep(
        lineNo,
        code,
        "변수에 값 저장",
        "브라우저 저장소에서 꺼낸 값을 const, let, var 같은 변수 이름에 담습니다. 이후 코드에서 이 이름으로 저장된 값을 다시 사용할 수 있습니다.",
        risk
      ));
    });

    return expanded;
  }


  // PYTHON_PATHLIB_GLOB_RETURN_EXPAND_V329_A8
  function expandPythonPathlibGlobReturnStepsV329A8(steps, language) {
    if (language !== "python") return steps;
    if (!Array.isArray(steps)) return steps;

    const expanded = [];

    steps.forEach(function(step) {
      expanded.push(step);

      const code = String(step && step.code || "").trim();
      const lineNo = step && step.lineNo ? step.lineNo : 0;
      const title = String(step && step.title || "");

      if (!/^return\s+/.test(code)) return;
      if (!/\.(?:glob|rglob)\s*\(/.test(code)) return;
      if (title === "값 돌려주기") return;

      const risk = riskOf(code, "python");

      expanded.push(makeStep(
        lineNo,
        code,
        "값 돌려주기",
        "찾은 파일 목록을 함수 밖으로 돌려줍니다. 호출한 쪽에서는 이 반환값을 받아서 후속 처리나 반복에 사용할 수 있습니다.",
        risk
      ));
    });

    return expanded;
  }

  // UNSUPPORTED_ITEMS_V202_A1
  function summarizeConfidence(steps) {
    const counts = {
      exact: 0,
      inferred: 0,
      unsupported: 0
    };

    (steps || []).forEach(function(step) {
      const key = step.confidence || "inferred";
      counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  }

  function unsupportedTokenFromStep(step, language) {
    const code = cleanLine(step && step.code ? step.code : "");
    let match;

    if (!code) return "";

    if (language === "python") {
      // PYTHON_ASSIGNMENT_UNSUPPORTED_TOKEN_V205_FIX
      match = code.match(/^[A-Za-z_]\w*\s*=\s*([A-Za-z_]\w*)\s*\(/);
      if (match) return match[1];

      match = code.match(/^([A-Za-z_]\w*)\s*\(/);
      if (match) return match[1];
    }

    if (language === "javascript" || language === "workers") {
      match = code.match(/^([A-Za-z_$][\w$]*)\s*\(/);
      if (match) return match[1];
    }

    if (language === "java") {
      match = code.match(/\b([A-Za-z_]\w*)\s*\(/);
      if (match) return match[1];
    }

    if (language === "powershell") {
      match = code.match(/^([A-Za-z][\w-]*)\b/);
      if (match) return match[1];
    }

    return code.slice(0, 40);
  }

  function collectUnsupportedItems(steps, language) {
    const seen = {};
    const items = [];

    (steps || []).forEach(function(step) {
      if (step.confidence !== "unsupported") return;

      const tokens = Array.isArray(step.unsupportedTokens) && step.unsupportedTokens.length
        ? step.unsupportedTokens
        : [unsupportedTokenFromStep(step, language)];

      tokens.forEach(function(token) {
        const key = [step.lineNo, token, step.code].join("|");
        if (seen[key]) return;
        seen[key] = true;

        items.push({
          lineNo: step.lineNo,
          token: token || "확인 필요",
          code: step.code,
          title: step.title
        });
      });
    });

    return items;
  }


  // FUNCTION_FLOW_ADVISOR_V326_A4
  function pythonIndentV326A4(line) {
    const match = String(line || "").match(/^ */);
    return match ? match[0].length : 0;
  }

  function stripPythonCommentV326A4(line) {
    return String(line || "").replace(/#.*/, "").trim();
  }

  function splitParamsV326A4(raw) {
    return String(raw || "").split(",").map(function(item) {
      return item.trim().replace(/=.*$/, "").trim();
    }).filter(Boolean);
  }

  function compactV326A4(value) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, 160);
  }

  function collectFunctionFlowV326A4(raw, language) {
    if (language !== "python") return [];
    const lines = String(raw || "").split(/\r?\n/);
    const flows = [];

    for (let i = 0; i < lines.length; i++) {
      const header = lines[i];
      const match = header.match(/^(\s*)(async\s+def|def)\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*(?:->\s*([^:]+))?\s*:/);
      if (!match) continue;

      const baseIndent = match[1].length;
      const body = [];
      for (let j = i + 1; j < lines.length; j++) {
        const rawLine = lines[j];
        if (rawLine.trim() && pythonIndentV326A4(rawLine) <= baseIndent) break;
        body.push({ lineNo: j + 1, raw: rawLine, text: stripPythonCommentV326A4(rawLine) });
      }

      const flow = {
        name: match[3],
        kind: match[2].indexOf("async") >= 0 ? "async_python_function" : "python_function",
        lineNo: i + 1,
        params: splitParamsV326A4(match[4]),
        returnHint: compactV326A4(match[5] || ""),
        variables: [],
        loops: [],
        conditions: [],
        fileOps: [],
        jsonOps: [],
        dataOps: [],
        dynamicCalls: [],
        returns: [],
        orderedSteps: [],
        roleSummary: "",
        nextCommands: []
      };

      body.forEach(function(row) {
        const line = row.text;
        let m;
        if (!line) return;

        m = line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
        if (m && !/[=!<>]=/.test(line)) flow.variables.push({ lineNo: row.lineNo, name: m[1], expr: compactV326A4(m[2]) });

        m = line.match(/^for\s+(.+?)\s+in\s+(.+):$/);
        if (m) flow.loops.push({ lineNo: row.lineNo, type: "for", summary: "loop " + compactV326A4(m[1]) + " in " + compactV326A4(m[2]) });

        m = line.match(/^while\s+(.+):$/);
        if (m) flow.loops.push({ lineNo: row.lineNo, type: "while", summary: "while " + compactV326A4(m[1]) });

        m = line.match(/^(if|elif)\s+(.+):$/);
        if (m) flow.conditions.push({ lineNo: row.lineNo, type: m[1], condition: compactV326A4(m[2]) });
        if (/^else\s*:$/.test(line)) flow.conditions.push({ lineNo: row.lineNo, type: "else", condition: "fallback branch" });

        if (/with\s+open\s*\(|\bopen\s*\(|Path\s*\(|read_text\s*\(|write_text\s*\(/.test(line)) {
          flow.fileOps.push({ lineNo: row.lineNo, code: compactV326A4(line) });
        }

        if (/json\.(load|loads|dump|dumps)\s*\(/.test(line)) flow.jsonOps.push({ lineNo: row.lineNo, code: compactV326A4(line) });

        if (/\.(append|extend|update|add)\s*\(/.test(line) || /\[[^\]]+\s+for\s+.+\s+in\s+.+\]|\{[^}]+\s+for\s+.+\s+in\s+.+\}/.test(line)) {
          flow.dataOps.push({ lineNo: row.lineNo, code: compactV326A4(line) });
        }

        if (/\b(getattr|globals|locals|eval|exec)\s*\(|importlib\.|callback\s*\(|handler\s*\(|load_handler\s*\(|registry\s*\[|dispatch\s*\[/.test(line)) {
          flow.dynamicCalls.push({ lineNo: row.lineNo, code: compactV326A4(line) });
        }

        m = line.match(/^return\s+(.+)$/);
        if (m) flow.returns.push({ lineNo: row.lineNo, expr: compactV326A4(m[1]) });
      });

      if (flow.params.length) flow.orderedSteps.push("Input: receives " + flow.params.join(", ") + ".");
      if (flow.variables.length) flow.orderedSteps.push("Prepare values: creates/stores " + flow.variables.slice(0, 4).map(function(v) { return v.name; }).join(", ") + ".");
      if (flow.fileOps.length) flow.orderedSteps.push("File/path work: reads or writes files/paths.");
      if (flow.jsonOps.length) flow.orderedSteps.push("JSON work: converts JSON and Python data.");
      if (flow.loops.length) flow.orderedSteps.push("Loop: repeats over data or while a condition is true.");
      if (flow.conditions.length) flow.orderedSteps.push("Condition: checks branches before deciding what to process.");
      if (flow.dataOps.length) flow.orderedSteps.push("Collect/transform: appends, updates, or comprehends data.");
      if (flow.dynamicCalls.length) flow.orderedSteps.push("Dynamic call: actual target depends on runtime values or external registry.");
      if (flow.returns.length) flow.orderedSteps.push("Return: sends " + flow.returns.slice(0, 2).map(function(item) { return item.expr; }).join(", ") + " back to the caller.");

      if (flow.loops.length && flow.conditions.length && flow.dataOps.length && flow.returns.length) {
        flow.roleSummary = "Looks like a filter/collector function: it loops over input data, checks conditions, collects matching values, then returns the result.";
      } else if (flow.fileOps.length && flow.jsonOps.length && flow.returns.length) {
        flow.roleSummary = "Looks like a file/JSON loader: it reads a file, converts JSON, then returns Python data.";
      } else if (flow.dynamicCalls.length) {
        flow.roleSummary = "Looks like a dynamic dispatch function: it chooses or calls another function based on runtime values.";
      } else if (flow.returns.length) {
        flow.roleSummary = "Looks like a value-returning function: it prepares internal values and returns a result.";
      } else {
        flow.roleSummary = "Looks like a procedure-style function: it performs work through side effects or calls.";
      }

      if (flow.dynamicCalls.length) {
        flow.nextCommands.push('Select-String -Path .\\*.py -Recurse -Pattern "def ' + flow.name + '|def load_handler|handlers|registry|callback|getattr|globals|importlib"');
        flow.nextCommands.push("git status --short");
      }

      flows.push(flow);
      if (flows.length >= 8) break;
    }

    return flows;
  }

  function buildNextCheckAdvisorV326A4(raw, language, functionFlow, unsupportedItems) {
    const text = String(raw || "");
    const advisors = [];

    function add(reason, commands, pasteBackHint) {
      advisors.push({
        reason: reason,
        commands: commands,
        risk: "safe_read_only",
        pasteBackHint: pasteBackHint || "Run the command, then paste the output back for a more precise explanation."
      });
    }

    const dynamicDetected = /\b(getattr|globals|locals|eval|exec)\s*\(|importlib\.|callback\s*\(|handler\s*\(|load_handler\s*\(|registry\s*\[|dispatch\s*\[/.test(text) ||
      (functionFlow || []).some(function(flow) { return flow.dynamicCalls && flow.dynamicCalls.length; });

    if (language === "python" && dynamicDetected) {
      add(
        "Dynamic call or handler/registry pattern detected.",
        [
          'Select-String -Path .\\*.py -Recurse -Pattern "def load_handler|handlers|registry|callback|getattr|globals|importlib"',
          "git status --short"
        ],
        "Paste matched definition/registry lines back so the real target function can be explained."
      );
    }

    const unsupported = Array.isArray(unsupportedItems) ? unsupportedItems : [];
    const tokens = unsupported.map(function(item) { return item && item.token; }).filter(Boolean).slice(0, 6);
    if (language === "python" && tokens.length) {
      add(
        "Some function calls are not defined in this snippet.",
        [
          'Select-String -Path .\\*.py -Recurse -Pattern "' + tokens.join("|").replace(/"/g, "") + '"'
        ],
        "Paste the matched lines back so external definitions can be connected to this snippet."
      );
    }

    if (language === "python" && /with\s+open\s*\(|read_text\s*\(|write_text\s*\(|Path\s*\(/.test(text)) {
      add(
        "File/path operation detected.",
        [
          "Get-ChildItem -Recurse -File | Select-Object -First 40 FullName"
        ],
        "Paste the file list or target path output back to confirm which files are read or written."
      );
    }

    return advisors.slice(0, 6);
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
    let refinedSteps = refineUnknownCallConfidence(enrichedSteps, raw, language);
    refinedSteps = expandPythonListComprehensionStepsV329A4(refinedSteps, language);
    refinedSteps = expandPythonPathlibGlobReturnStepsV329A8(refinedSteps, language);
    refinedSteps = expandJavaScriptEventHandlerStepsV329A6(refinedSteps, language);
    refinedSteps = expandJavaScriptLocalStorageAssignmentStepsV329A7(refinedSteps, language);

    const dataFlow = collectDataFlow(refinedSteps, language);
    const callFlow = collectCallFlow(raw, language);
    const unsupportedItems = collectUnsupportedItems(refinedSteps, language);
    const functionFlowV326A4 = collectFunctionFlowV326A4(raw, language);
    const nextCheckAdvisorV326A4 = buildNextCheckAdvisorV326A4(raw, language, functionFlowV326A4, unsupportedItems);

    return {
      language: language,
      sourceCode: raw,
      summary: summarize(language, refinedSteps),
      flowSummary: summarizeFlow(refinedSteps),
      confidenceSummary: summarizeConfidence(refinedSteps),
      unsupportedItems: unsupportedItems,
      functionFlowV326A4: functionFlowV326A4,
      nextCheckAdvisorV326A4: nextCheckAdvisorV326A4,
      dataFlow: dataFlow,
      callFlow: callFlow,
      steps: refinedSteps,
      warnings: refinedSteps.filter(function(step) { return step.risk === "high" || step.risk === "medium"; }),
      mermaid: buildMermaid(refinedSteps, dataFlow, callFlow)
    };
  }

  window.CodeExplainerRules = {
    analyze: analyze,
    detectLanguage: detectLanguage
  };
})();
// === CODE EXPLAINER RULES V212-A1 END ===
// === CODE EXPLAINER RULES V215-A1 END ===

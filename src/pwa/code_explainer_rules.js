// === CODE EXPLAINER RULES V167-A1 START ===
(function() {
  "use strict";

  function stripFence(input) {
    return String(input || "")
      .replace(/^```[a-zA-Z0-9_-]*\s*/m, "")
      .replace(/```\s*$/m, "")
      .trim();
  }

  function cleanLine(line) {
    return String(line || "").trim();
  }

  function isBlankOrComment(line, language) {
    const t = cleanLine(line);
    if (!t) return true;
    if (language === "python") return t.startsWith("#");
    if (language === "powershell") return t.startsWith("#");
    if (language === "javascript" || language === "workers" || language === "java") {
      return t.startsWith("//") || t.startsWith("/*") || t.startsWith("*");
    }
    return false;
  }

  function detectLanguage(code) {
    const text = String(code || "");
    const lower = text.toLowerCase();

    if (/export\s+default/.test(text) && /fetch\s*\(\s*request\s*,\s*env/.test(text)) return "workers";
    if (/\benv\.(DB|KV|R2|AI)\b/.test(text) || /Response\.json/.test(text)) return "workers";
    if (/Set-Location|Copy-Item|Remove-Item|Compress-Archive|Expand-Archive|Get-Date|New-Item|Test-Path|Select-String/i.test(text)) return "powershell";
    if (/^\s*\$[A-Za-z_][\w-]*\s*=/m.test(text) || /\bgit\s+(status|add|commit|push|tag|stash|reset|clean)\b/i.test(text)) return "powershell";
    if (/^\s*def\s+\w+\s*\(/m.test(text) || /^\s*import\s+\w+/m.test(text) || /^\s*from\s+\w+/m.test(text)) return "python";
    if (/^\s*class\s+\w+\s*[:(]/m.test(text) && lower.includes("self")) return "python";
    if (/public\s+static\s+void\s+main|System\.out\.println|public\s+class|private\s+class|class\s+\w+\s*\{/m.test(text)) return "java";
    if (/\b(const|let|var)\s+\w+\s*=/.test(text) || /function\s+\w+\s*\(/.test(text) || /document\.getElementById|addEventListener|localStorage/.test(text)) return "javascript";
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
    }
    if (language === "python") {
      if (/shutil\.rmtree|os\.remove|os\.rmdir/.test(t)) return "high";
      if (/subprocess\.|os\.system/.test(t)) return "medium";
    }
    if (language === "javascript" || language === "workers") {
      if (/eval\s*\(|new\s+Function/.test(t)) return "high";
      if (/delete\s+|\.delete\s*\(/.test(t)) return "medium";
    }
    if (language === "java") {
      if (/Runtime\.getRuntime|ProcessBuilder/.test(t)) return "medium";
      if (/delete\s*\(/.test(t)) return "medium";
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

  function explainPowerShellLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "powershell");

    if (/^Set-Location\b/i.test(t) || /^cd\b/i.test(t)) {
      return makeStep(lineNo, t, "작업 폴더 이동", "이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다.", risk);
    }
    if (/^\$env:[A-Za-z_][\w-]*\s*=/.test(t)) {
      return makeStep(lineNo, t, "환경변수 설정", "현재 PowerShell 세션에서 사용할 임시 설정값을 저장합니다. API 키 같은 값은 코드에 저장하지 않는 용도로 자주 씁니다.", risk);
    }
    if (/^\$[A-Za-z_][\w-]*\s*=/.test(t)) {
      return makeStep(lineNo, t, "변수에 값 저장", "나중에 다시 쓰기 위해 값이나 경로를 변수 이름에 담습니다.", risk);
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
      return makeStep(lineNo, t, "임시 보관", "아직 커밋하지 않은 변경사항을 잠시 치워두고 작업 폴더를 깨끗하게 만듭니다.", risk);
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

    return makeStep(lineNo, t, "명령 실행", "이 줄은 PowerShell 명령입니다. 정확한 의미가 자동 규칙에 없으므로 원문을 확인하며 실행해야 합니다.", risk);
  }

  function explainPythonLine(line, lineNo) {
    const t = cleanLine(line);
    const risk = riskOf(t, "python");

    if (/^import\s+/.test(t) || /^from\s+.+\s+import\s+/.test(t)) {
      return makeStep(lineNo, t, "라이브러리 불러오기", "이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.", risk);
    }
    if (/^def\s+\w+\s*\(/.test(t)) {
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
    if (/env\.DB/.test(t)) {
      return makeStep(lineNo, t, "D1 데이터베이스 사용", "Cloudflare env에 연결된 DB를 사용합니다. SQL 실행 부분을 확인해야 합니다.", risk);
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
    if (/^(const|let|var)\s+\w+\s*=/.test(t)) {
      return makeStep(lineNo, t, "변수에 값 저장", "값이나 객체를 이름에 담아서 이후 코드에서 다시 사용합니다.", risk);
    }
    if (/function\s+\w+\s*\(/.test(t) || /=>/.test(t)) {
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
    if (/document\.getElementById|querySelector/.test(t)) {
      return makeStep(lineNo, t, "화면 요소 찾기", "HTML 화면에서 특정 요소를 찾아 값을 읽거나 내용을 바꾸기 위해 준비합니다.", risk);
    }
    if (/localStorage/.test(t)) {
      return makeStep(lineNo, t, "브라우저 저장소 사용", "현재 브라우저에 작은 데이터를 저장하거나 다시 불러옵니다.", risk);
    }

    return makeStep(lineNo, t, language === "workers" ? "Worker/JavaScript 코드 실행" : "JavaScript 코드 실행", "이 줄은 위에서 아래로 실행되는 JavaScript 코드입니다.", risk);
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

  function summarize(language, steps) {
    if (!steps.length) return "분석할 코드가 없습니다.";
    const risky = steps.filter(function(step) { return step.risk === "high" || step.risk === "medium"; }).length;
    const names = {
      powershell: "PowerShell 스크립트",
      python: "Python 코드",
      javascript: "JavaScript 코드",
      workers: "Cloudflare Workers 코드",
      java: "Java 코드"
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
    const lines = raw.split(/\r?\n/);
    const steps = [];

    lines.forEach(function(line, idx) {
      if (isBlankOrComment(line, language)) return;
      const lineNo = idx + 1;
      if (language === "powershell") steps.push(explainPowerShellLine(line, lineNo));
      else if (language === "python") steps.push(explainPythonLine(line, lineNo));
      else if (language === "javascript" || language === "workers") steps.push(explainJavaScriptLine(line, lineNo, language));
      else if (language === "java") steps.push(explainJavaLine(line, lineNo));
      else steps.push(makeStep(lineNo, cleanLine(line), "코드 실행", "이 줄을 순서대로 실행합니다.", "low"));
    });

    return {
      language: language,
      summary: summarize(language, steps),
      steps: steps,
      warnings: steps.filter(function(step) { return step.risk === "high" || step.risk === "medium"; }),
      mermaid: buildMermaid(steps)
    };
  }

  window.CodeExplainerRules = {
    analyze: analyze,
    detectLanguage: detectLanguage
  };
})();
// === CODE EXPLAINER RULES V167-A1 END ===

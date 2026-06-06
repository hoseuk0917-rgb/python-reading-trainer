// === CODE EXPLAINER RULES V174-A1 START ===
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

  function isStructuralOnlyLine(line, language) {
    const t = cleanLine(line);
    if (!t) return true;

    // 닫는 중괄호/괄호만 있는 줄은 설명 step으로 만들지 않는다.
    if (/^[}\])]+[;,]?$/.test(t)) return true;

    // JS/Workers 객체 리터럴의 단순 키 시작 줄은 실제 동작이 아니라 구조 보조 줄이다.
    if ((language === "javascript" || language === "workers") && /^[A-Za-z_$][\w$-]*\s*:\s*\{\s*,?$/.test(t)) {
      return true;
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
    if (/\.(all|first|run)\s*\(/.test(t) && /await|env\.DB|prepare/i.test(t)) {
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

    const tags = [];
    let category = "처리";

    if (/worker 진입 객체|export\s+default|프로그램 시작점|public\s+static\s+void\s+main/.test(text)) {
      category = "구조";
      pushUnique(tags, "함수/구조");
    }

    if (/ctx\.waituntil|백그라운드 작업|백그라운드/.test(text)) {
      category = "백그라운드";
      pushUnique(tags, "Cloudflare");
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
    if (/env\.db|database|d1|sql|select|insert|update|delete|prepare|bind|run\(|all\(|first\(/.test(text)) {
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
    if (/try|catch|except|finally|throw|raise|오류|exception/.test(text)) {
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
// === CODE EXPLAINER RULES V174-A1 END ===

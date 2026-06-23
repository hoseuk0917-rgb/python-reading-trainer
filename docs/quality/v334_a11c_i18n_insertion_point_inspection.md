# V334-A11C i18n Insertion Point Inspection

Purpose: find safe insertion points for analyzer i18n transformation instead of manually rewriting every makeStep rule.

## Summary

| metric | value |
|---|---:|
| total hits | 910 |

## Hits

### src/pwa/code_explainer_rules.js:279

- patterns: function confidenceLabel

      273:       return "inferred";
      274:     }
      275: 
      276:     return "exact";
      277:   }
      278: 
      279:   function confidenceLabel(confidence) {
      280:     if (confidence === "exact") return codeRuleTextV334A11B("확실", "exact");
      281:     if (confidence === "inferred") return codeRuleTextV334A11B("추정", "inferred");
      282:     if (confidence === "unsupported") return codeRuleTextV334A11B("미지원", "unsupported");
      283:     return codeRuleTextV334A11B("추정", "inferred");
      284:   }
      285: 
      286:   function makeStep(lineNo, code, title, explain, risk) {
      287:     const confidence = confidenceForStep(title, explain);
      288:     return {
      289:       lineNo: lineNo,
      290:       code: code,
      291:       title: title,

### src/pwa/code_explainer_rules.js:286

- patterns: function makeStep

      280:     if (confidence === "exact") return codeRuleTextV334A11B("확실", "exact");
      281:     if (confidence === "inferred") return codeRuleTextV334A11B("추정", "inferred");
      282:     if (confidence === "unsupported") return codeRuleTextV334A11B("미지원", "unsupported");
      283:     return codeRuleTextV334A11B("추정", "inferred");
      284:   }
      285: 
      286:   function makeStep(lineNo, code, title, explain, risk) {
      287:     const confidence = confidenceForStep(title, explain);
      288:     return {
      289:       lineNo: lineNo,
      290:       code: code,
      291:       title: title,
      292:       explain: explain,
      293:       risk: risk || "low",
      294:       confidence: confidence,
      295:       confidenceLabel: confidenceLabel(confidence)
      296:     };
      297:   }
      298: 

### src/pwa/code_explainer_rules.js:341

- patterns: return makeStep

      335:   function explainPowerShellLine(line, lineNo) {
      336:     const t = cleanLine(line);
      337:     const risk = riskOf(t, "powershell");
      338: 
      339:     // POWERSHELL_FOREACH_PIPELINE_PRIORITY_V329_A5
      340:     if (/\|/.test(t) && /\bForEach-Object\b/i.test(t)) {
      341:       return makeStep(lineNo, t, "각 항목 반복 처리", "파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.", risk);
      342:     }
      343: 
      344:     if (/^Set-Location\b/i.test(t) || /^cd\b/i.test(t)) {
      345:       return makeStep(lineNo, t, codeRuleTextV334A11B("작업 폴더 이동", "Change working directory"), codeRuleTextV334A11B("이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다.", "This changes the working directory from which later commands will run."), risk);
      346:     }
      347:     if (/^\$env:[A-Za-z_][\w-]*\s*=/.test(t)) {
      348:       return makeStep(lineNo, t, "환경변수 설정", "현재 PowerShell 세션에서 사용할 임시 설정값을 저장합니다. API 키 같은 민감값은 코드에 직접 쓰지 않고 환경변수로 넣는 방식이 안전합니다.", risk);
      349:     }
      350: 
      351:     // POWERSHELL_EARLY_PREF_RULE_V188_A2
      352:     if (/^\$ErrorActionPreference\s*=/.test(t)) {
      353:       return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);

### src/pwa/code_explainer_rules.js:345

- patterns: return makeStep

      339:     // POWERSHELL_FOREACH_PIPELINE_PRIORITY_V329_A5
      340:     if (/\|/.test(t) && /\bForEach-Object\b/i.test(t)) {
      341:       return makeStep(lineNo, t, "각 항목 반복 처리", "파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.", risk);
      342:     }
      343: 
      344:     if (/^Set-Location\b/i.test(t) || /^cd\b/i.test(t)) {
      345:       return makeStep(lineNo, t, codeRuleTextV334A11B("작업 폴더 이동", "Change working directory"), codeRuleTextV334A11B("이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다.", "This changes the working directory from which later commands will run."), risk);
      346:     }
      347:     if (/^\$env:[A-Za-z_][\w-]*\s*=/.test(t)) {
      348:       return makeStep(lineNo, t, "환경변수 설정", "현재 PowerShell 세션에서 사용할 임시 설정값을 저장합니다. API 키 같은 민감값은 코드에 직접 쓰지 않고 환경변수로 넣는 방식이 안전합니다.", risk);
      349:     }
      350: 
      351:     // POWERSHELL_EARLY_PREF_RULE_V188_A2
      352:     if (/^\$ErrorActionPreference\s*=/.test(t)) {
      353:       return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);
      354:     }
      355: 
      356:     const varMatch = t.match(/^\$([A-Za-z_][\w-]*)\s*=\s*(.+)$/);
      357:     if (varMatch) {

### src/pwa/code_explainer_rules.js:348

- patterns: return makeStep

      342:     }
      343: 
      344:     if (/^Set-Location\b/i.test(t) || /^cd\b/i.test(t)) {
      345:       return makeStep(lineNo, t, codeRuleTextV334A11B("작업 폴더 이동", "Change working directory"), codeRuleTextV334A11B("이후 명령들이 어느 폴더를 기준으로 실행될지 바꿉니다.", "This changes the working directory from which later commands will run."), risk);
      346:     }
      347:     if (/^\$env:[A-Za-z_][\w-]*\s*=/.test(t)) {
      348:       return makeStep(lineNo, t, "환경변수 설정", "현재 PowerShell 세션에서 사용할 임시 설정값을 저장합니다. API 키 같은 민감값은 코드에 직접 쓰지 않고 환경변수로 넣는 방식이 안전합니다.", risk);
      349:     }
      350: 
      351:     // POWERSHELL_EARLY_PREF_RULE_V188_A2
      352:     if (/^\$ErrorActionPreference\s*=/.test(t)) {
      353:       return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);
      354:     }
      355: 
      356:     const varMatch = t.match(/^\$([A-Za-z_][\w-]*)\s*=\s*(.+)$/);
      357:     if (varMatch) {
      358:       const name = varMatch[1];
      359:       const value = varMatch[2];
      360: 

### src/pwa/code_explainer_rules.js:353

- patterns: return makeStep

      347:     if (/^\$env:[A-Za-z_][\w-]*\s*=/.test(t)) {
      348:       return makeStep(lineNo, t, "환경변수 설정", "현재 PowerShell 세션에서 사용할 임시 설정값을 저장합니다. API 키 같은 민감값은 코드에 직접 쓰지 않고 환경변수로 넣는 방식이 안전합니다.", risk);
      349:     }
      350: 
      351:     // POWERSHELL_EARLY_PREF_RULE_V188_A2
      352:     if (/^\$ErrorActionPreference\s*=/.test(t)) {
      353:       return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);
      354:     }
      355: 
      356:     const varMatch = t.match(/^\$([A-Za-z_][\w-]*)\s*=\s*(.+)$/);
      357:     if (varMatch) {
      358:       const name = varMatch[1];
      359:       const value = varMatch[2];
      360: 
      361:       if (/Get-Date/i.test(value)) {
      362:         return makeStep(lineNo, t, codeRuleTextV334A11B("시간값을 변수에 저장", "Store current time in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다.", "$" + name + " stores the current date/time string. It is useful for unique backup names or run IDs."), risk);
      363:       }
      364:       if (/Test-Path/i.test(value)) {
      365:         return makeStep(lineNo, t, "경로 확인 결과 저장", "$" + name + " 변수에 파일이나 폴더가 존재하는지 검사한 결과를 저장합니다.", risk);

### src/pwa/code_explainer_rules.js:362

- patterns: return makeStep

      356:     const varMatch = t.match(/^\$([A-Za-z_][\w-]*)\s*=\s*(.+)$/);
      357:     if (varMatch) {
      358:       const name = varMatch[1];
      359:       const value = varMatch[2];
      360: 
      361:       if (/Get-Date/i.test(value)) {
      362:         return makeStep(lineNo, t, codeRuleTextV334A11B("시간값을 변수에 저장", "Store current time in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다.", "$" + name + " stores the current date/time string. It is useful for unique backup names or run IDs."), risk);
      363:       }
      364:       if (/Test-Path/i.test(value)) {
      365:         return makeStep(lineNo, t, "경로 확인 결과 저장", "$" + name + " 변수에 파일이나 폴더가 존재하는지 검사한 결과를 저장합니다.", risk);
      366:       }
      367:       if (/Invoke-WebRequest|curl\b/i.test(value)) {
      368:         return makeStep(lineNo, t, "웹 요청 결과 저장", "$" + name + " 변수에 웹 요청 결과를 저장합니다. URL, 인증, 응답 상태를 확인해야 합니다.", risk);
      369:       }
      370:       if (/Join-Path/i.test(value)) {
      371:         return makeStep(lineNo, t, "경로 조합 결과 저장", "$" + name + " 변수에 여러 경로 조각을 합친 결과를 저장합니다.", risk);
      372:       }
      373: 
      374: 

### src/pwa/code_explainer_rules.js:365

- patterns: return makeStep

      359:       const value = varMatch[2];
      360: 
      361:       if (/Get-Date/i.test(value)) {
      362:         return makeStep(lineNo, t, codeRuleTextV334A11B("시간값을 변수에 저장", "Store current time in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다.", "$" + name + " stores the current date/time string. It is useful for unique backup names or run IDs."), risk);
      363:       }
      364:       if (/Test-Path/i.test(value)) {
      365:         return makeStep(lineNo, t, "경로 확인 결과 저장", "$" + name + " 변수에 파일이나 폴더가 존재하는지 검사한 결과를 저장합니다.", risk);
      366:       }
      367:       if (/Invoke-WebRequest|curl\b/i.test(value)) {
      368:         return makeStep(lineNo, t, "웹 요청 결과 저장", "$" + name + " 변수에 웹 요청 결과를 저장합니다. URL, 인증, 응답 상태를 확인해야 합니다.", risk);
      369:       }
      370:       if (/Join-Path/i.test(value)) {
      371:         return makeStep(lineNo, t, "경로 조합 결과 저장", "$" + name + " 변수에 여러 경로 조각을 합친 결과를 저장합니다.", risk);
      372:       }
      373: 
      374: 
      375:       // POWERSHELL_CSV_PIPELINE_RULES_V215_A1
      376:       if (/Import-Csv/i.test(value)) {
      377:         return makeStep(lineNo, t, "CSV 읽기 결과 저장", "$" + name + " 변수에 CSV 파일을 읽은 표 형태 데이터를 저장합니다. CSV 첫 줄은 보통 열 이름으로 쓰이고, 이후 파이프라인에서 그룹/정렬/선택 처리를 할 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:368

- patterns: return makeStep

      362:         return makeStep(lineNo, t, codeRuleTextV334A11B("시간값을 변수에 저장", "Store current time in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 현재 날짜/시간 문자열을 넣습니다. 백업 파일명이나 실행 기록 이름을 겹치지 않게 만들 때 씁니다.", "$" + name + " stores the current date/time string. It is useful for unique backup names or run IDs."), risk);
      363:       }
      364:       if (/Test-Path/i.test(value)) {
      365:         return makeStep(lineNo, t, "경로 확인 결과 저장", "$" + name + " 변수에 파일이나 폴더가 존재하는지 검사한 결과를 저장합니다.", risk);
      366:       }
      367:       if (/Invoke-WebRequest|curl\b/i.test(value)) {
      368:         return makeStep(lineNo, t, "웹 요청 결과 저장", "$" + name + " 변수에 웹 요청 결과를 저장합니다. URL, 인증, 응답 상태를 확인해야 합니다.", risk);
      369:       }
      370:       if (/Join-Path/i.test(value)) {
      371:         return makeStep(lineNo, t, "경로 조합 결과 저장", "$" + name + " 변수에 여러 경로 조각을 합친 결과를 저장합니다.", risk);
      372:       }
      373: 
      374: 
      375:       // POWERSHELL_CSV_PIPELINE_RULES_V215_A1
      376:       if (/Import-Csv/i.test(value)) {
      377:         return makeStep(lineNo, t, "CSV 읽기 결과 저장", "$" + name + " 변수에 CSV 파일을 읽은 표 형태 데이터를 저장합니다. CSV 첫 줄은 보통 열 이름으로 쓰이고, 이후 파이프라인에서 그룹/정렬/선택 처리를 할 수 있습니다.", risk);
      378:       }
      379:       if (/Group-Object|Sort-Object|Select-Object|Export-Csv/i.test(value)) {
      380:         return makeStep(lineNo, t, "CSV 파이프라인 요약 저장", "$" + name + " 변수에 CSV 데이터를 파이프라인으로 넘겨 그룹, 정렬, 선택 같은 처리를 한 결과를 저장합니다. 어느 열을 기준으로 묶고 정렬하는지 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:371

- patterns: return makeStep

      365:         return makeStep(lineNo, t, "경로 확인 결과 저장", "$" + name + " 변수에 파일이나 폴더가 존재하는지 검사한 결과를 저장합니다.", risk);
      366:       }
      367:       if (/Invoke-WebRequest|curl\b/i.test(value)) {
      368:         return makeStep(lineNo, t, "웹 요청 결과 저장", "$" + name + " 변수에 웹 요청 결과를 저장합니다. URL, 인증, 응답 상태를 확인해야 합니다.", risk);
      369:       }
      370:       if (/Join-Path/i.test(value)) {
      371:         return makeStep(lineNo, t, "경로 조합 결과 저장", "$" + name + " 변수에 여러 경로 조각을 합친 결과를 저장합니다.", risk);
      372:       }
      373: 
      374: 
      375:       // POWERSHELL_CSV_PIPELINE_RULES_V215_A1
      376:       if (/Import-Csv/i.test(value)) {
      377:         return makeStep(lineNo, t, "CSV 읽기 결과 저장", "$" + name + " 변수에 CSV 파일을 읽은 표 형태 데이터를 저장합니다. CSV 첫 줄은 보통 열 이름으로 쓰이고, 이후 파이프라인에서 그룹/정렬/선택 처리를 할 수 있습니다.", risk);
      378:       }
      379:       if (/Group-Object|Sort-Object|Select-Object|Export-Csv/i.test(value)) {
      380:         return makeStep(lineNo, t, "CSV 파이프라인 요약 저장", "$" + name + " 변수에 CSV 데이터를 파이프라인으로 넘겨 그룹, 정렬, 선택 같은 처리를 한 결과를 저장합니다. 어느 열을 기준으로 묶고 정렬하는지 확인해야 합니다.", risk);
      381:       }
      382:       // POWERSHELL_VAR_RULES_V188_A2
      383:       if (/ConvertFrom-Json|ConvertTo-Json/i.test(value)) {

### src/pwa/code_explainer_rules.js:377

- patterns: return makeStep

      371:         return makeStep(lineNo, t, "경로 조합 결과 저장", "$" + name + " 변수에 여러 경로 조각을 합친 결과를 저장합니다.", risk);
      372:       }
      373: 
      374: 
      375:       // POWERSHELL_CSV_PIPELINE_RULES_V215_A1
      376:       if (/Import-Csv/i.test(value)) {
      377:         return makeStep(lineNo, t, "CSV 읽기 결과 저장", "$" + name + " 변수에 CSV 파일을 읽은 표 형태 데이터를 저장합니다. CSV 첫 줄은 보통 열 이름으로 쓰이고, 이후 파이프라인에서 그룹/정렬/선택 처리를 할 수 있습니다.", risk);
      378:       }
      379:       if (/Group-Object|Sort-Object|Select-Object|Export-Csv/i.test(value)) {
      380:         return makeStep(lineNo, t, "CSV 파이프라인 요약 저장", "$" + name + " 변수에 CSV 데이터를 파이프라인으로 넘겨 그룹, 정렬, 선택 같은 처리를 한 결과를 저장합니다. 어느 열을 기준으로 묶고 정렬하는지 확인해야 합니다.", risk);
      381:       }
      382:       // POWERSHELL_VAR_RULES_V188_A2
      383:       if (/ConvertFrom-Json|ConvertTo-Json/i.test(value)) {
      384:         return makeStep(lineNo, t, "JSON 처리 결과 저장", "$" + name + " 변수에 JSON을 PowerShell 객체로 바꾸거나 객체를 JSON 문자열로 바꾼 결과를 저장합니다.", risk);
      385:       }
      386:       if (/Get-Content/i.test(value)) {
      387:         return makeStep(lineNo, t, "파일 내용 읽기 결과 저장", "$" + name + " 변수에 파일 내용을 읽은 결과를 저장합니다. -Raw가 있으면 파일 전체를 하나의 문자열로 읽습니다.", risk);
      388:       }
      389:       if (/Get-ChildItem|Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|\|/i.test(value)) {

### src/pwa/code_explainer_rules.js:380

- patterns: return makeStep

      374: 
      375:       // POWERSHELL_CSV_PIPELINE_RULES_V215_A1
      376:       if (/Import-Csv/i.test(value)) {
      377:         return makeStep(lineNo, t, "CSV 읽기 결과 저장", "$" + name + " 변수에 CSV 파일을 읽은 표 형태 데이터를 저장합니다. CSV 첫 줄은 보통 열 이름으로 쓰이고, 이후 파이프라인에서 그룹/정렬/선택 처리를 할 수 있습니다.", risk);
      378:       }
      379:       if (/Group-Object|Sort-Object|Select-Object|Export-Csv/i.test(value)) {
      380:         return makeStep(lineNo, t, "CSV 파이프라인 요약 저장", "$" + name + " 변수에 CSV 데이터를 파이프라인으로 넘겨 그룹, 정렬, 선택 같은 처리를 한 결과를 저장합니다. 어느 열을 기준으로 묶고 정렬하는지 확인해야 합니다.", risk);
      381:       }
      382:       // POWERSHELL_VAR_RULES_V188_A2
      383:       if (/ConvertFrom-Json|ConvertTo-Json/i.test(value)) {
      384:         return makeStep(lineNo, t, "JSON 처리 결과 저장", "$" + name + " 변수에 JSON을 PowerShell 객체로 바꾸거나 객체를 JSON 문자열로 바꾼 결과를 저장합니다.", risk);
      385:       }
      386:       if (/Get-Content/i.test(value)) {
      387:         return makeStep(lineNo, t, "파일 내용 읽기 결과 저장", "$" + name + " 변수에 파일 내용을 읽은 결과를 저장합니다. -Raw가 있으면 파일 전체를 하나의 문자열로 읽습니다.", risk);
      388:       }
      389:       if (/Get-ChildItem|Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|\|/i.test(value)) {
      390:         return makeStep(lineNo, t, "파이프라인 결과 저장", "$" + name + " 변수에 여러 명령을 파이프(|)로 이어 처리한 결과를 저장합니다. 각 단계가 어떤 데이터를 넘기는지 순서대로 확인해야 합니다.", risk);
      391:       }
      392:       if (/Start-Process/i.test(value)) {

### src/pwa/code_explainer_rules.js:384

- patterns: return makeStep

      378:       }
      379:       if (/Group-Object|Sort-Object|Select-Object|Export-Csv/i.test(value)) {
      380:         return makeStep(lineNo, t, "CSV 파이프라인 요약 저장", "$" + name + " 변수에 CSV 데이터를 파이프라인으로 넘겨 그룹, 정렬, 선택 같은 처리를 한 결과를 저장합니다. 어느 열을 기준으로 묶고 정렬하는지 확인해야 합니다.", risk);
      381:       }
      382:       // POWERSHELL_VAR_RULES_V188_A2
      383:       if (/ConvertFrom-Json|ConvertTo-Json/i.test(value)) {
      384:         return makeStep(lineNo, t, "JSON 처리 결과 저장", "$" + name + " 변수에 JSON을 PowerShell 객체로 바꾸거나 객체를 JSON 문자열로 바꾼 결과를 저장합니다.", risk);
      385:       }
      386:       if (/Get-Content/i.test(value)) {
      387:         return makeStep(lineNo, t, "파일 내용 읽기 결과 저장", "$" + name + " 변수에 파일 내용을 읽은 결과를 저장합니다. -Raw가 있으면 파일 전체를 하나의 문자열로 읽습니다.", risk);
      388:       }
      389:       if (/Get-ChildItem|Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|\|/i.test(value)) {
      390:         return makeStep(lineNo, t, "파이프라인 결과 저장", "$" + name + " 변수에 여러 명령을 파이프(|)로 이어 처리한 결과를 저장합니다. 각 단계가 어떤 데이터를 넘기는지 순서대로 확인해야 합니다.", risk);
      391:       }
      392:       if (/Start-Process/i.test(value)) {
      393:         return makeStep(lineNo, t, "프로세스 실행 결과 저장", "$" + name + " 변수에 실행한 외부 프로그램의 프로세스 정보를 저장합니다. 나중에 종료하거나 상태를 확인할 때 씁니다.", risk);
      394:       }
      395: 
      396:       return makeStep(lineNo, t, codeRuleTextV334A11B("변수에 값 저장", "Store a value in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 값을 넣습니다. 이후 줄에서 $" + name + "을 쓰면 이 값을 다시 사용합니다.", "$" + name + " stores a value. Later lines can reuse that value by referring to $" + name + "."), risk);

### src/pwa/code_explainer_rules.js:387

- patterns: return makeStep

      381:       }
      382:       // POWERSHELL_VAR_RULES_V188_A2
      383:       if (/ConvertFrom-Json|ConvertTo-Json/i.test(value)) {
      384:         return makeStep(lineNo, t, "JSON 처리 결과 저장", "$" + name + " 변수에 JSON을 PowerShell 객체로 바꾸거나 객체를 JSON 문자열로 바꾼 결과를 저장합니다.", risk);
      385:       }
      386:       if (/Get-Content/i.test(value)) {
      387:         return makeStep(lineNo, t, "파일 내용 읽기 결과 저장", "$" + name + " 변수에 파일 내용을 읽은 결과를 저장합니다. -Raw가 있으면 파일 전체를 하나의 문자열로 읽습니다.", risk);
      388:       }
      389:       if (/Get-ChildItem|Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|\|/i.test(value)) {
      390:         return makeStep(lineNo, t, "파이프라인 결과 저장", "$" + name + " 변수에 여러 명령을 파이프(|)로 이어 처리한 결과를 저장합니다. 각 단계가 어떤 데이터를 넘기는지 순서대로 확인해야 합니다.", risk);
      391:       }
      392:       if (/Start-Process/i.test(value)) {
      393:         return makeStep(lineNo, t, "프로세스 실행 결과 저장", "$" + name + " 변수에 실행한 외부 프로그램의 프로세스 정보를 저장합니다. 나중에 종료하거나 상태를 확인할 때 씁니다.", risk);
      394:       }
      395: 
      396:       return makeStep(lineNo, t, codeRuleTextV334A11B("변수에 값 저장", "Store a value in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 값을 넣습니다. 이후 줄에서 $" + name + "을 쓰면 이 값을 다시 사용합니다.", "$" + name + " stores a value. Later lines can reuse that value by referring to $" + name + "."), risk);
      397:     }
      398: 
      399:     if (/Get-Date/i.test(t)) {

### src/pwa/code_explainer_rules.js:390

- patterns: return makeStep

      384:         return makeStep(lineNo, t, "JSON 처리 결과 저장", "$" + name + " 변수에 JSON을 PowerShell 객체로 바꾸거나 객체를 JSON 문자열로 바꾼 결과를 저장합니다.", risk);
      385:       }
      386:       if (/Get-Content/i.test(value)) {
      387:         return makeStep(lineNo, t, "파일 내용 읽기 결과 저장", "$" + name + " 변수에 파일 내용을 읽은 결과를 저장합니다. -Raw가 있으면 파일 전체를 하나의 문자열로 읽습니다.", risk);
      388:       }
      389:       if (/Get-ChildItem|Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|\|/i.test(value)) {
      390:         return makeStep(lineNo, t, "파이프라인 결과 저장", "$" + name + " 변수에 여러 명령을 파이프(|)로 이어 처리한 결과를 저장합니다. 각 단계가 어떤 데이터를 넘기는지 순서대로 확인해야 합니다.", risk);
      391:       }
      392:       if (/Start-Process/i.test(value)) {
      393:         return makeStep(lineNo, t, "프로세스 실행 결과 저장", "$" + name + " 변수에 실행한 외부 프로그램의 프로세스 정보를 저장합니다. 나중에 종료하거나 상태를 확인할 때 씁니다.", risk);
      394:       }
      395: 
      396:       return makeStep(lineNo, t, codeRuleTextV334A11B("변수에 값 저장", "Store a value in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 값을 넣습니다. 이후 줄에서 $" + name + "을 쓰면 이 값을 다시 사용합니다.", "$" + name + " stores a value. Later lines can reuse that value by referring to $" + name + "."), risk);
      397:     }
      398: 
      399:     if (/Get-Date/i.test(t)) {
      400:       return makeStep(lineNo, t, "현재 시간 만들기", "현재 날짜와 시간을 가져옵니다. 백업 파일명이나 실행 기록 이름을 만들 때 자주 씁니다.", risk);
      401:     }
      402:     // POWERSHELL_DEEP_RULES_V188_A2

### src/pwa/code_explainer_rules.js:393

- patterns: return makeStep

      387:         return makeStep(lineNo, t, "파일 내용 읽기 결과 저장", "$" + name + " 변수에 파일 내용을 읽은 결과를 저장합니다. -Raw가 있으면 파일 전체를 하나의 문자열로 읽습니다.", risk);
      388:       }
      389:       if (/Get-ChildItem|Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|\|/i.test(value)) {
      390:         return makeStep(lineNo, t, "파이프라인 결과 저장", "$" + name + " 변수에 여러 명령을 파이프(|)로 이어 처리한 결과를 저장합니다. 각 단계가 어떤 데이터를 넘기는지 순서대로 확인해야 합니다.", risk);
      391:       }
      392:       if (/Start-Process/i.test(value)) {
      393:         return makeStep(lineNo, t, "프로세스 실행 결과 저장", "$" + name + " 변수에 실행한 외부 프로그램의 프로세스 정보를 저장합니다. 나중에 종료하거나 상태를 확인할 때 씁니다.", risk);
      394:       }
      395: 
      396:       return makeStep(lineNo, t, codeRuleTextV334A11B("변수에 값 저장", "Store a value in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 값을 넣습니다. 이후 줄에서 $" + name + "을 쓰면 이 값을 다시 사용합니다.", "$" + name + " stores a value. Later lines can reuse that value by referring to $" + name + "."), risk);
      397:     }
      398: 
      399:     if (/Get-Date/i.test(t)) {
      400:       return makeStep(lineNo, t, "현재 시간 만들기", "현재 날짜와 시간을 가져옵니다. 백업 파일명이나 실행 기록 이름을 만들 때 자주 씁니다.", risk);
      401:     }
      402:     // POWERSHELL_DEEP_RULES_V188_A2
      403:     if (/^param\s*\(/i.test(t)) {
      404:       return makeStep(lineNo, t, "입력 파라미터 정의", "스크립트를 실행할 때 받을 입력값을 정의합니다. 예: -Path, -Port 같은 옵션을 명확히 정할 수 있습니다.", risk);
      405:     }

### src/pwa/code_explainer_rules.js:396

- patterns: return makeStep

      390:         return makeStep(lineNo, t, "파이프라인 결과 저장", "$" + name + " 변수에 여러 명령을 파이프(|)로 이어 처리한 결과를 저장합니다. 각 단계가 어떤 데이터를 넘기는지 순서대로 확인해야 합니다.", risk);
      391:       }
      392:       if (/Start-Process/i.test(value)) {
      393:         return makeStep(lineNo, t, "프로세스 실행 결과 저장", "$" + name + " 변수에 실행한 외부 프로그램의 프로세스 정보를 저장합니다. 나중에 종료하거나 상태를 확인할 때 씁니다.", risk);
      394:       }
      395: 
      396:       return makeStep(lineNo, t, codeRuleTextV334A11B("변수에 값 저장", "Store a value in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 값을 넣습니다. 이후 줄에서 $" + name + "을 쓰면 이 값을 다시 사용합니다.", "$" + name + " stores a value. Later lines can reuse that value by referring to $" + name + "."), risk);
      397:     }
      398: 
      399:     if (/Get-Date/i.test(t)) {
      400:       return makeStep(lineNo, t, "현재 시간 만들기", "현재 날짜와 시간을 가져옵니다. 백업 파일명이나 실행 기록 이름을 만들 때 자주 씁니다.", risk);
      401:     }
      402:     // POWERSHELL_DEEP_RULES_V188_A2
      403:     if (/^param\s*\(/i.test(t)) {
      404:       return makeStep(lineNo, t, "입력 파라미터 정의", "스크립트를 실행할 때 받을 입력값을 정의합니다. 예: -Path, -Port 같은 옵션을 명확히 정할 수 있습니다.", risk);
      405:     }
      406:     // POWERSHELL_PARAM_OBJECT_LITERAL_V207_A1
      407:     if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*\s*=/.test(t)) {
      408:       return makeStep(lineNo, t, "입력 파라미터 기본값", "param 블록 안에서 파라미터의 타입과 기본값을 정합니다. 실행할 때 같은 이름의 옵션을 주면 이 기본값 대신 입력값이 사용됩니다.", risk);

### src/pwa/code_explainer_rules.js:400

- patterns: return makeStep

      394:       }
      395: 
      396:       return makeStep(lineNo, t, codeRuleTextV334A11B("변수에 값 저장", "Store a value in a variable"), codeRuleTextV334A11B("$" + name + " 변수에 값을 넣습니다. 이후 줄에서 $" + name + "을 쓰면 이 값을 다시 사용합니다.", "$" + name + " stores a value. Later lines can reuse that value by referring to $" + name + "."), risk);
      397:     }
      398: 
      399:     if (/Get-Date/i.test(t)) {
      400:       return makeStep(lineNo, t, "현재 시간 만들기", "현재 날짜와 시간을 가져옵니다. 백업 파일명이나 실행 기록 이름을 만들 때 자주 씁니다.", risk);
      401:     }
      402:     // POWERSHELL_DEEP_RULES_V188_A2
      403:     if (/^param\s*\(/i.test(t)) {
      404:       return makeStep(lineNo, t, "입력 파라미터 정의", "스크립트를 실행할 때 받을 입력값을 정의합니다. 예: -Path, -Port 같은 옵션을 명확히 정할 수 있습니다.", risk);
      405:     }
      406:     // POWERSHELL_PARAM_OBJECT_LITERAL_V207_A1
      407:     if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*\s*=/.test(t)) {
      408:       return makeStep(lineNo, t, "입력 파라미터 기본값", "param 블록 안에서 파라미터의 타입과 기본값을 정합니다. 실행할 때 같은 이름의 옵션을 주면 이 기본값 대신 입력값이 사용됩니다.", risk);
      409:     }
      410:     if (/^\[pscustomobject\]@\{/.test(t)) {
      411:       return makeStep(lineNo, t, "PowerShell 객체 만들기", "여러 속성을 가진 사용자 정의 객체를 만들기 시작합니다. 보고서 행이나 JSON 변환용 데이터를 구성할 때 자주 씁니다.", risk);
      412:     }

### src/pwa/code_explainer_rules.js:404

- patterns: return makeStep

      398: 
      399:     if (/Get-Date/i.test(t)) {
      400:       return makeStep(lineNo, t, "현재 시간 만들기", "현재 날짜와 시간을 가져옵니다. 백업 파일명이나 실행 기록 이름을 만들 때 자주 씁니다.", risk);
      401:     }
      402:     // POWERSHELL_DEEP_RULES_V188_A2
      403:     if (/^param\s*\(/i.test(t)) {
      404:       return makeStep(lineNo, t, "입력 파라미터 정의", "스크립트를 실행할 때 받을 입력값을 정의합니다. 예: -Path, -Port 같은 옵션을 명확히 정할 수 있습니다.", risk);
      405:     }
      406:     // POWERSHELL_PARAM_OBJECT_LITERAL_V207_A1
      407:     if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*\s*=/.test(t)) {
      408:       return makeStep(lineNo, t, "입력 파라미터 기본값", "param 블록 안에서 파라미터의 타입과 기본값을 정합니다. 실행할 때 같은 이름의 옵션을 주면 이 기본값 대신 입력값이 사용됩니다.", risk);
      409:     }
      410:     if (/^\[pscustomobject\]@\{/.test(t)) {
      411:       return makeStep(lineNo, t, "PowerShell 객체 만들기", "여러 속성을 가진 사용자 정의 객체를 만들기 시작합니다. 보고서 행이나 JSON 변환용 데이터를 구성할 때 자주 씁니다.", risk);
      412:     }
      413:     if (/^[A-Za-z_][\w-]*\s*=\s*(\$_|[^=]+)$/.test(t) && !/^\$/.test(t)) {
      414:       return makeStep(lineNo, t, "객체 속성 값 설정", "PowerShell 객체 안에서 속성 이름과 값을 연결합니다. 왼쪽은 속성명, 오른쪽은 저장할 값입니다.", risk);
      415:     }
      416:     if (/^\$ErrorActionPreference\s*=/.test(t)) {

### src/pwa/code_explainer_rules.js:408

- patterns: return makeStep

      402:     // POWERSHELL_DEEP_RULES_V188_A2
      403:     if (/^param\s*\(/i.test(t)) {
      404:       return makeStep(lineNo, t, "입력 파라미터 정의", "스크립트를 실행할 때 받을 입력값을 정의합니다. 예: -Path, -Port 같은 옵션을 명확히 정할 수 있습니다.", risk);
      405:     }
      406:     // POWERSHELL_PARAM_OBJECT_LITERAL_V207_A1
      407:     if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*\s*=/.test(t)) {
      408:       return makeStep(lineNo, t, "입력 파라미터 기본값", "param 블록 안에서 파라미터의 타입과 기본값을 정합니다. 실행할 때 같은 이름의 옵션을 주면 이 기본값 대신 입력값이 사용됩니다.", risk);
      409:     }
      410:     if (/^\[pscustomobject\]@\{/.test(t)) {
      411:       return makeStep(lineNo, t, "PowerShell 객체 만들기", "여러 속성을 가진 사용자 정의 객체를 만들기 시작합니다. 보고서 행이나 JSON 변환용 데이터를 구성할 때 자주 씁니다.", risk);
      412:     }
      413:     if (/^[A-Za-z_][\w-]*\s*=\s*(\$_|[^=]+)$/.test(t) && !/^\$/.test(t)) {
      414:       return makeStep(lineNo, t, "객체 속성 값 설정", "PowerShell 객체 안에서 속성 이름과 값을 연결합니다. 왼쪽은 속성명, 오른쪽은 저장할 값입니다.", risk);
      415:     }
      416:     if (/^\$ErrorActionPreference\s*=/.test(t)) {
      417:       return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);
      418:     }
      419:     if (/^function\s+[A-Za-z_][\w-]*/i.test(t)) {
      420:       return makeStep(lineNo, t, "함수 정의", "반복해서 쓸 PowerShell 명령 묶음을 이름으로 정의합니다. 이 줄만으로 내부 명령이 바로 실행되지는 않습니다.", risk);

### src/pwa/code_explainer_rules.js:411

- patterns: return makeStep

      405:     }
      406:     // POWERSHELL_PARAM_OBJECT_LITERAL_V207_A1
      407:     if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*\s*=/.test(t)) {
      408:       return makeStep(lineNo, t, "입력 파라미터 기본값", "param 블록 안에서 파라미터의 타입과 기본값을 정합니다. 실행할 때 같은 이름의 옵션을 주면 이 기본값 대신 입력값이 사용됩니다.", risk);
      409:     }
      410:     if (/^\[pscustomobject\]@\{/.test(t)) {
      411:       return makeStep(lineNo, t, "PowerShell 객체 만들기", "여러 속성을 가진 사용자 정의 객체를 만들기 시작합니다. 보고서 행이나 JSON 변환용 데이터를 구성할 때 자주 씁니다.", risk);
      412:     }
      413:     if (/^[A-Za-z_][\w-]*\s*=\s*(\$_|[^=]+)$/.test(t) && !/^\$/.test(t)) {
      414:       return makeStep(lineNo, t, "객체 속성 값 설정", "PowerShell 객체 안에서 속성 이름과 값을 연결합니다. 왼쪽은 속성명, 오른쪽은 저장할 값입니다.", risk);
      415:     }
      416:     if (/^\$ErrorActionPreference\s*=/.test(t)) {
      417:       return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);
      418:     }
      419:     if (/^function\s+[A-Za-z_][\w-]*/i.test(t)) {
      420:       return makeStep(lineNo, t, "함수 정의", "반복해서 쓸 PowerShell 명령 묶음을 이름으로 정의합니다. 이 줄만으로 내부 명령이 바로 실행되지는 않습니다.", risk);
      421:     }
      422:     if (/^@['"]/.test(t) || /^['"]@/.test(t)) {
      423:       return makeStep(lineNo, t, "여러 줄 문자열 경계", "here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다.", risk);

### src/pwa/code_explainer_rules.js:414

- patterns: return makeStep

      408:       return makeStep(lineNo, t, "입력 파라미터 기본값", "param 블록 안에서 파라미터의 타입과 기본값을 정합니다. 실행할 때 같은 이름의 옵션을 주면 이 기본값 대신 입력값이 사용됩니다.", risk);
      409:     }
      410:     if (/^\[pscustomobject\]@\{/.test(t)) {
      411:       return makeStep(lineNo, t, "PowerShell 객체 만들기", "여러 속성을 가진 사용자 정의 객체를 만들기 시작합니다. 보고서 행이나 JSON 변환용 데이터를 구성할 때 자주 씁니다.", risk);
      412:     }
      413:     if (/^[A-Za-z_][\w-]*\s*=\s*(\$_|[^=]+)$/.test(t) && !/^\$/.test(t)) {
      414:       return makeStep(lineNo, t, "객체 속성 값 설정", "PowerShell 객체 안에서 속성 이름과 값을 연결합니다. 왼쪽은 속성명, 오른쪽은 저장할 값입니다.", risk);
      415:     }
      416:     if (/^\$ErrorActionPreference\s*=/.test(t)) {
      417:       return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);
      418:     }
      419:     if (/^function\s+[A-Za-z_][\w-]*/i.test(t)) {
      420:       return makeStep(lineNo, t, "함수 정의", "반복해서 쓸 PowerShell 명령 묶음을 이름으로 정의합니다. 이 줄만으로 내부 명령이 바로 실행되지는 않습니다.", risk);
      421:     }
      422:     if (/^@['"]/.test(t) || /^['"]@/.test(t)) {
      423:       return makeStep(lineNo, t, "여러 줄 문자열 경계", "here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다.", risk);
      424:     }
      425:     if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t) && /\bExport-Csv\b/i.test(t)) {
      426:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:417

- patterns: return makeStep

      411:       return makeStep(lineNo, t, "PowerShell 객체 만들기", "여러 속성을 가진 사용자 정의 객체를 만들기 시작합니다. 보고서 행이나 JSON 변환용 데이터를 구성할 때 자주 씁니다.", risk);
      412:     }
      413:     if (/^[A-Za-z_][\w-]*\s*=\s*(\$_|[^=]+)$/.test(t) && !/^\$/.test(t)) {
      414:       return makeStep(lineNo, t, "객체 속성 값 설정", "PowerShell 객체 안에서 속성 이름과 값을 연결합니다. 왼쪽은 속성명, 오른쪽은 저장할 값입니다.", risk);
      415:     }
      416:     if (/^\$ErrorActionPreference\s*=/.test(t)) {
      417:       return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);
      418:     }
      419:     if (/^function\s+[A-Za-z_][\w-]*/i.test(t)) {
      420:       return makeStep(lineNo, t, "함수 정의", "반복해서 쓸 PowerShell 명령 묶음을 이름으로 정의합니다. 이 줄만으로 내부 명령이 바로 실행되지는 않습니다.", risk);
      421:     }
      422:     if (/^@['"]/.test(t) || /^['"]@/.test(t)) {
      423:       return makeStep(lineNo, t, "여러 줄 문자열 경계", "here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다.", risk);
      424:     }
      425:     if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t) && /\bExport-Csv\b/i.test(t)) {
      426:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      427:     }
      428:     if (/\|\s*(Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|Format-Table|Out-Null)\b/i.test(t)) {
      429:       return makeStep(lineNo, t, codeRuleTextV334A11B("파이프라인 처리", "Pipeline processing"), codeRuleTextV334A11B("앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다.", "The result of the previous command is passed to the next command, then selected, sorted, or displayed as needed."), risk);

### src/pwa/code_explainer_rules.js:420

- patterns: return makeStep

      414:       return makeStep(lineNo, t, "객체 속성 값 설정", "PowerShell 객체 안에서 속성 이름과 값을 연결합니다. 왼쪽은 속성명, 오른쪽은 저장할 값입니다.", risk);
      415:     }
      416:     if (/^\$ErrorActionPreference\s*=/.test(t)) {
      417:       return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);
      418:     }
      419:     if (/^function\s+[A-Za-z_][\w-]*/i.test(t)) {
      420:       return makeStep(lineNo, t, "함수 정의", "반복해서 쓸 PowerShell 명령 묶음을 이름으로 정의합니다. 이 줄만으로 내부 명령이 바로 실행되지는 않습니다.", risk);
      421:     }
      422:     if (/^@['"]/.test(t) || /^['"]@/.test(t)) {
      423:       return makeStep(lineNo, t, "여러 줄 문자열 경계", "here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다.", risk);
      424:     }
      425:     if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t) && /\bExport-Csv\b/i.test(t)) {
      426:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      427:     }
      428:     if (/\|\s*(Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|Format-Table|Out-Null)\b/i.test(t)) {
      429:       return makeStep(lineNo, t, codeRuleTextV334A11B("파이프라인 처리", "Pipeline processing"), codeRuleTextV334A11B("앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다.", "The result of the previous command is passed to the next command, then selected, sorted, or displayed as needed."), risk);
      430:     }
      431:     if (/^Get-ChildItem\b/i.test(t) || /^dir\b/i.test(t) || /^ls\b/i.test(t)) {
      432:       return makeStep(lineNo, t, "파일 목록 가져오기", "폴더 안의 파일과 하위 폴더 목록을 가져옵니다. -Recurse가 있으면 하위 폴더까지 넓게 탐색합니다.", risk);

### src/pwa/code_explainer_rules.js:423

- patterns: return makeStep

      417:       return makeStep(lineNo, t, "오류 시 즉시 중단 설정", "PowerShell 명령 실패를 계속 무시하지 않고 Stop처럼 중단되게 만드는 설정입니다. 검증 스크립트에서 실패를 빨리 드러낼 때 유용합니다.", risk);
      418:     }
      419:     if (/^function\s+[A-Za-z_][\w-]*/i.test(t)) {
      420:       return makeStep(lineNo, t, "함수 정의", "반복해서 쓸 PowerShell 명령 묶음을 이름으로 정의합니다. 이 줄만으로 내부 명령이 바로 실행되지는 않습니다.", risk);
      421:     }
      422:     if (/^@['"]/.test(t) || /^['"]@/.test(t)) {
      423:       return makeStep(lineNo, t, "여러 줄 문자열 경계", "here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다.", risk);
      424:     }
      425:     if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t) && /\bExport-Csv\b/i.test(t)) {
      426:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      427:     }
      428:     if (/\|\s*(Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|Format-Table|Out-Null)\b/i.test(t)) {
      429:       return makeStep(lineNo, t, codeRuleTextV334A11B("파이프라인 처리", "Pipeline processing"), codeRuleTextV334A11B("앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다.", "The result of the previous command is passed to the next command, then selected, sorted, or displayed as needed."), risk);
      430:     }
      431:     if (/^Get-ChildItem\b/i.test(t) || /^dir\b/i.test(t) || /^ls\b/i.test(t)) {
      432:       return makeStep(lineNo, t, "파일 목록 가져오기", "폴더 안의 파일과 하위 폴더 목록을 가져옵니다. -Recurse가 있으면 하위 폴더까지 넓게 탐색합니다.", risk);
      433:     }
      434:     if (/^Get-Content\b/i.test(t)) {
      435:       return makeStep(lineNo, t, "파일 내용 읽기", "텍스트 파일 내용을 읽습니다. -Raw는 전체 파일을 한 문자열로 읽고, 없으면 줄 단위로 읽는 경우가 많습니다.", risk);

### src/pwa/code_explainer_rules.js:426

- patterns: return makeStep

      420:       return makeStep(lineNo, t, "함수 정의", "반복해서 쓸 PowerShell 명령 묶음을 이름으로 정의합니다. 이 줄만으로 내부 명령이 바로 실행되지는 않습니다.", risk);
      421:     }
      422:     if (/^@['"]/.test(t) || /^['"]@/.test(t)) {
      423:       return makeStep(lineNo, t, "여러 줄 문자열 경계", "here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다.", risk);
      424:     }
      425:     if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t) && /\bExport-Csv\b/i.test(t)) {
      426:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      427:     }
      428:     if (/\|\s*(Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|Format-Table|Out-Null)\b/i.test(t)) {
      429:       return makeStep(lineNo, t, codeRuleTextV334A11B("파이프라인 처리", "Pipeline processing"), codeRuleTextV334A11B("앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다.", "The result of the previous command is passed to the next command, then selected, sorted, or displayed as needed."), risk);
      430:     }
      431:     if (/^Get-ChildItem\b/i.test(t) || /^dir\b/i.test(t) || /^ls\b/i.test(t)) {
      432:       return makeStep(lineNo, t, "파일 목록 가져오기", "폴더 안의 파일과 하위 폴더 목록을 가져옵니다. -Recurse가 있으면 하위 폴더까지 넓게 탐색합니다.", risk);
      433:     }
      434:     if (/^Get-Content\b/i.test(t)) {
      435:       return makeStep(lineNo, t, "파일 내용 읽기", "텍스트 파일 내용을 읽습니다. -Raw는 전체 파일을 한 문자열로 읽고, 없으면 줄 단위로 읽는 경우가 많습니다.", risk);
      436:     }
      437:     // POWERSHELL_SET_CONTENT_PIPELINE_V205_A1
      438:     if (/^Out-File\b/i.test(t) || /\|\s*Out-File\b/i.test(t)) {

### src/pwa/code_explainer_rules.js:429

- patterns: return makeStep

      423:       return makeStep(lineNo, t, "여러 줄 문자열 경계", "here-string의 시작 또는 끝입니다. 긴 스크립트, JSON, Markdown, Python 코드 조각을 여러 줄 문자열로 저장할 때 씁니다.", risk);
      424:     }
      425:     if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t) && /\bExport-Csv\b/i.test(t)) {
      426:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      427:     }
      428:     if (/\|\s*(Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|Format-Table|Out-Null)\b/i.test(t)) {
      429:       return makeStep(lineNo, t, codeRuleTextV334A11B("파이프라인 처리", "Pipeline processing"), codeRuleTextV334A11B("앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다.", "The result of the previous command is passed to the next command, then selected, sorted, or displayed as needed."), risk);
      430:     }
      431:     if (/^Get-ChildItem\b/i.test(t) || /^dir\b/i.test(t) || /^ls\b/i.test(t)) {
      432:       return makeStep(lineNo, t, "파일 목록 가져오기", "폴더 안의 파일과 하위 폴더 목록을 가져옵니다. -Recurse가 있으면 하위 폴더까지 넓게 탐색합니다.", risk);
      433:     }
      434:     if (/^Get-Content\b/i.test(t)) {
      435:       return makeStep(lineNo, t, "파일 내용 읽기", "텍스트 파일 내용을 읽습니다. -Raw는 전체 파일을 한 문자열로 읽고, 없으면 줄 단위로 읽는 경우가 많습니다.", risk);
      436:     }
      437:     // POWERSHELL_SET_CONTENT_PIPELINE_V205_A1
      438:     if (/^Out-File\b/i.test(t) || /\|\s*Out-File\b/i.test(t)) {
      439:       return makeStep(lineNo, t, "파일로 출력 저장", "화면에 나올 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로를 확인해야 합니다.", risk);
      440:     }
      441:     // POWERSHELL_CONVERT_JSON_SET_CONTENT_V205_FIX

### src/pwa/code_explainer_rules.js:432

- patterns: return makeStep

      426:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      427:     }
      428:     if (/\|\s*(Where-Object|ForEach-Object|Select-Object|Sort-Object|Group-Object|Measure-Object|Format-Table|Out-Null)\b/i.test(t)) {
      429:       return makeStep(lineNo, t, codeRuleTextV334A11B("파이프라인 처리", "Pipeline processing"), codeRuleTextV334A11B("앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다.", "The result of the previous command is passed to the next command, then selected, sorted, or displayed as needed."), risk);
      430:     }
      431:     if (/^Get-ChildItem\b/i.test(t) || /^dir\b/i.test(t) || /^ls\b/i.test(t)) {
      432:       return makeStep(lineNo, t, "파일 목록 가져오기", "폴더 안의 파일과 하위 폴더 목록을 가져옵니다. -Recurse가 있으면 하위 폴더까지 넓게 탐색합니다.", risk);
      433:     }
      434:     if (/^Get-Content\b/i.test(t)) {
      435:       return makeStep(lineNo, t, "파일 내용 읽기", "텍스트 파일 내용을 읽습니다. -Raw는 전체 파일을 한 문자열로 읽고, 없으면 줄 단위로 읽는 경우가 많습니다.", risk);
      436:     }
      437:     // POWERSHELL_SET_CONTENT_PIPELINE_V205_A1
      438:     if (/^Out-File\b/i.test(t) || /\|\s*Out-File\b/i.test(t)) {
      439:       return makeStep(lineNo, t, "파일로 출력 저장", "화면에 나올 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로를 확인해야 합니다.", risk);
      440:     }
      441:     // POWERSHELL_CONVERT_JSON_SET_CONTENT_V205_FIX
      442:     if (/\bConvertTo-Json\b/i.test(t) && /\|\s*Set-Content\b/i.test(t)) {
      443:       return makeStep(lineNo, t, "객체를 JSON으로 변환 후 파일 저장", "PowerShell 객체를 JSON 문자열로 바꾼 뒤 파일에 저장합니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있고, Set-Content는 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      444:     }

### src/pwa/code_explainer_rules.js:435

- patterns: return makeStep

      429:       return makeStep(lineNo, t, codeRuleTextV334A11B("파이프라인 처리", "Pipeline processing"), codeRuleTextV334A11B("앞 명령의 결과를 뒤 명령으로 넘깁니다. 그다음 필요한 값만 고르거나 정렬해서 보여줍니다.", "The result of the previous command is passed to the next command, then selected, sorted, or displayed as needed."), risk);
      430:     }
      431:     if (/^Get-ChildItem\b/i.test(t) || /^dir\b/i.test(t) || /^ls\b/i.test(t)) {
      432:       return makeStep(lineNo, t, "파일 목록 가져오기", "폴더 안의 파일과 하위 폴더 목록을 가져옵니다. -Recurse가 있으면 하위 폴더까지 넓게 탐색합니다.", risk);
      433:     }
      434:     if (/^Get-Content\b/i.test(t)) {
      435:       return makeStep(lineNo, t, "파일 내용 읽기", "텍스트 파일 내용을 읽습니다. -Raw는 전체 파일을 한 문자열로 읽고, 없으면 줄 단위로 읽는 경우가 많습니다.", risk);
      436:     }
      437:     // POWERSHELL_SET_CONTENT_PIPELINE_V205_A1
      438:     if (/^Out-File\b/i.test(t) || /\|\s*Out-File\b/i.test(t)) {
      439:       return makeStep(lineNo, t, "파일로 출력 저장", "화면에 나올 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로를 확인해야 합니다.", risk);
      440:     }
      441:     // POWERSHELL_CONVERT_JSON_SET_CONTENT_V205_FIX
      442:     if (/\bConvertTo-Json\b/i.test(t) && /\|\s*Set-Content\b/i.test(t)) {
      443:       return makeStep(lineNo, t, "객체를 JSON으로 변환 후 파일 저장", "PowerShell 객체를 JSON 문자열로 바꾼 뒤 파일에 저장합니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있고, Set-Content는 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      444:     }
      445:     if (/^Set-Content\b/i.test(t) || /\|\s*Set-Content\b/i.test(t)) {
      446:       return makeStep(lineNo, t, "파일에 내용 저장", "값이나 파이프라인 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      447:     }

### src/pwa/code_explainer_rules.js:439

- patterns: return makeStep

      433:     }
      434:     if (/^Get-Content\b/i.test(t)) {
      435:       return makeStep(lineNo, t, "파일 내용 읽기", "텍스트 파일 내용을 읽습니다. -Raw는 전체 파일을 한 문자열로 읽고, 없으면 줄 단위로 읽는 경우가 많습니다.", risk);
      436:     }
      437:     // POWERSHELL_SET_CONTENT_PIPELINE_V205_A1
      438:     if (/^Out-File\b/i.test(t) || /\|\s*Out-File\b/i.test(t)) {
      439:       return makeStep(lineNo, t, "파일로 출력 저장", "화면에 나올 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로를 확인해야 합니다.", risk);
      440:     }
      441:     // POWERSHELL_CONVERT_JSON_SET_CONTENT_V205_FIX
      442:     if (/\bConvertTo-Json\b/i.test(t) && /\|\s*Set-Content\b/i.test(t)) {
      443:       return makeStep(lineNo, t, "객체를 JSON으로 변환 후 파일 저장", "PowerShell 객체를 JSON 문자열로 바꾼 뒤 파일에 저장합니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있고, Set-Content는 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      444:     }
      445:     if (/^Set-Content\b/i.test(t) || /\|\s*Set-Content\b/i.test(t)) {
      446:       return makeStep(lineNo, t, "파일에 내용 저장", "값이나 파이프라인 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      447:     }
      448:     if (/^Add-Content\b/i.test(t) || /\|\s*Add-Content\b/i.test(t)) {
      449:       return makeStep(lineNo, t, "파일에 내용 추가", "기존 파일 끝에 새 내용을 덧붙입니다. 로그나 누적 기록을 남길 때 씁니다.", risk);
      450:     }
      451:     if (/\bWhere-Object\b/i.test(t)) {

### src/pwa/code_explainer_rules.js:443

- patterns: return makeStep

      437:     // POWERSHELL_SET_CONTENT_PIPELINE_V205_A1
      438:     if (/^Out-File\b/i.test(t) || /\|\s*Out-File\b/i.test(t)) {
      439:       return makeStep(lineNo, t, "파일로 출력 저장", "화면에 나올 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로를 확인해야 합니다.", risk);
      440:     }
      441:     // POWERSHELL_CONVERT_JSON_SET_CONTENT_V205_FIX
      442:     if (/\bConvertTo-Json\b/i.test(t) && /\|\s*Set-Content\b/i.test(t)) {
      443:       return makeStep(lineNo, t, "객체를 JSON으로 변환 후 파일 저장", "PowerShell 객체를 JSON 문자열로 바꾼 뒤 파일에 저장합니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있고, Set-Content는 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      444:     }
      445:     if (/^Set-Content\b/i.test(t) || /\|\s*Set-Content\b/i.test(t)) {
      446:       return makeStep(lineNo, t, "파일에 내용 저장", "값이나 파이프라인 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      447:     }
      448:     if (/^Add-Content\b/i.test(t) || /\|\s*Add-Content\b/i.test(t)) {
      449:       return makeStep(lineNo, t, "파일에 내용 추가", "기존 파일 끝에 새 내용을 덧붙입니다. 로그나 누적 기록을 남길 때 씁니다.", risk);
      450:     }
      451:     if (/\bWhere-Object\b/i.test(t)) {
      452:       return makeStep(lineNo, t, "조건으로 필터링", "파이프라인으로 넘어온 항목 중 조건에 맞는 것만 남깁니다. $_는 현재 항목을 뜻합니다.", risk);
      453:     }
      454:     if (/\bForEach-Object\b/i.test(t)) {
      455:       return makeStep(lineNo, t, "각 항목 반복 처리", "파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.", risk);

### src/pwa/code_explainer_rules.js:446

- patterns: return makeStep

      440:     }
      441:     // POWERSHELL_CONVERT_JSON_SET_CONTENT_V205_FIX
      442:     if (/\bConvertTo-Json\b/i.test(t) && /\|\s*Set-Content\b/i.test(t)) {
      443:       return makeStep(lineNo, t, "객체를 JSON으로 변환 후 파일 저장", "PowerShell 객체를 JSON 문자열로 바꾼 뒤 파일에 저장합니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있고, Set-Content는 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      444:     }
      445:     if (/^Set-Content\b/i.test(t) || /\|\s*Set-Content\b/i.test(t)) {
      446:       return makeStep(lineNo, t, "파일에 내용 저장", "값이나 파이프라인 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      447:     }
      448:     if (/^Add-Content\b/i.test(t) || /\|\s*Add-Content\b/i.test(t)) {
      449:       return makeStep(lineNo, t, "파일에 내용 추가", "기존 파일 끝에 새 내용을 덧붙입니다. 로그나 누적 기록을 남길 때 씁니다.", risk);
      450:     }
      451:     if (/\bWhere-Object\b/i.test(t)) {
      452:       return makeStep(lineNo, t, "조건으로 필터링", "파이프라인으로 넘어온 항목 중 조건에 맞는 것만 남깁니다. $_는 현재 항목을 뜻합니다.", risk);
      453:     }
      454:     if (/\bForEach-Object\b/i.test(t)) {
      455:       return makeStep(lineNo, t, "각 항목 반복 처리", "파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.", risk);
      456:     }
      457:     if (/\bSelect-Object\b/i.test(t)) {
      458:       return makeStep(lineNo, t, "필요한 속성 선택", "객체에서 필요한 컬럼/속성만 고르거나 처음/마지막 일부만 선택합니다.", risk);

### src/pwa/code_explainer_rules.js:449

- patterns: return makeStep

      443:       return makeStep(lineNo, t, "객체를 JSON으로 변환 후 파일 저장", "PowerShell 객체를 JSON 문자열로 바꾼 뒤 파일에 저장합니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있고, Set-Content는 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      444:     }
      445:     if (/^Set-Content\b/i.test(t) || /\|\s*Set-Content\b/i.test(t)) {
      446:       return makeStep(lineNo, t, "파일에 내용 저장", "값이나 파이프라인 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      447:     }
      448:     if (/^Add-Content\b/i.test(t) || /\|\s*Add-Content\b/i.test(t)) {
      449:       return makeStep(lineNo, t, "파일에 내용 추가", "기존 파일 끝에 새 내용을 덧붙입니다. 로그나 누적 기록을 남길 때 씁니다.", risk);
      450:     }
      451:     if (/\bWhere-Object\b/i.test(t)) {
      452:       return makeStep(lineNo, t, "조건으로 필터링", "파이프라인으로 넘어온 항목 중 조건에 맞는 것만 남깁니다. $_는 현재 항목을 뜻합니다.", risk);
      453:     }
      454:     if (/\bForEach-Object\b/i.test(t)) {
      455:       return makeStep(lineNo, t, "각 항목 반복 처리", "파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.", risk);
      456:     }
      457:     if (/\bSelect-Object\b/i.test(t)) {
      458:       return makeStep(lineNo, t, "필요한 속성 선택", "객체에서 필요한 컬럼/속성만 고르거나 처음/마지막 일부만 선택합니다.", risk);
      459:     }
      460:     if (/\bSort-Object\b/i.test(t)) {
      461:       return makeStep(lineNo, t, "정렬", "파이프라인 데이터의 순서를 특정 속성 기준으로 정렬합니다.", risk);

### src/pwa/code_explainer_rules.js:452

- patterns: return makeStep

      446:       return makeStep(lineNo, t, "파일에 내용 저장", "값이나 파이프라인 결과를 파일에 저장합니다. 기존 파일을 덮어쓸 수 있으니 경로와 인코딩을 확인해야 합니다.", risk);
      447:     }
      448:     if (/^Add-Content\b/i.test(t) || /\|\s*Add-Content\b/i.test(t)) {
      449:       return makeStep(lineNo, t, "파일에 내용 추가", "기존 파일 끝에 새 내용을 덧붙입니다. 로그나 누적 기록을 남길 때 씁니다.", risk);
      450:     }
      451:     if (/\bWhere-Object\b/i.test(t)) {
      452:       return makeStep(lineNo, t, "조건으로 필터링", "파이프라인으로 넘어온 항목 중 조건에 맞는 것만 남깁니다. $_는 현재 항목을 뜻합니다.", risk);
      453:     }
      454:     if (/\bForEach-Object\b/i.test(t)) {
      455:       return makeStep(lineNo, t, "각 항목 반복 처리", "파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.", risk);
      456:     }
      457:     if (/\bSelect-Object\b/i.test(t)) {
      458:       return makeStep(lineNo, t, "필요한 속성 선택", "객체에서 필요한 컬럼/속성만 고르거나 처음/마지막 일부만 선택합니다.", risk);
      459:     }
      460:     if (/\bSort-Object\b/i.test(t)) {
      461:       return makeStep(lineNo, t, "정렬", "파이프라인 데이터의 순서를 특정 속성 기준으로 정렬합니다.", risk);
      462:     }
      463:     if (/\bGroup-Object\b/i.test(t)) {
      464:       return makeStep(lineNo, t, "그룹별 묶기", "같은 값을 가진 항목끼리 묶어서 개수나 그룹별 처리를 할 수 있게 합니다.", risk);

### src/pwa/code_explainer_rules.js:455

- patterns: return makeStep

      449:       return makeStep(lineNo, t, "파일에 내용 추가", "기존 파일 끝에 새 내용을 덧붙입니다. 로그나 누적 기록을 남길 때 씁니다.", risk);
      450:     }
      451:     if (/\bWhere-Object\b/i.test(t)) {
      452:       return makeStep(lineNo, t, "조건으로 필터링", "파이프라인으로 넘어온 항목 중 조건에 맞는 것만 남깁니다. $_는 현재 항목을 뜻합니다.", risk);
      453:     }
      454:     if (/\bForEach-Object\b/i.test(t)) {
      455:       return makeStep(lineNo, t, "각 항목 반복 처리", "파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.", risk);
      456:     }
      457:     if (/\bSelect-Object\b/i.test(t)) {
      458:       return makeStep(lineNo, t, "필요한 속성 선택", "객체에서 필요한 컬럼/속성만 고르거나 처음/마지막 일부만 선택합니다.", risk);
      459:     }
      460:     if (/\bSort-Object\b/i.test(t)) {
      461:       return makeStep(lineNo, t, "정렬", "파이프라인 데이터의 순서를 특정 속성 기준으로 정렬합니다.", risk);
      462:     }
      463:     if (/\bGroup-Object\b/i.test(t)) {
      464:       return makeStep(lineNo, t, "그룹별 묶기", "같은 값을 가진 항목끼리 묶어서 개수나 그룹별 처리를 할 수 있게 합니다.", risk);
      465:     }
      466:     if (/\bMeasure-Object\b/i.test(t)) {
      467:       return makeStep(lineNo, t, "개수/합계 측정", "항목 개수, 합계, 평균 같은 간단한 통계를 계산합니다.", risk);

### src/pwa/code_explainer_rules.js:458

- patterns: return makeStep

      452:       return makeStep(lineNo, t, "조건으로 필터링", "파이프라인으로 넘어온 항목 중 조건에 맞는 것만 남깁니다. $_는 현재 항목을 뜻합니다.", risk);
      453:     }
      454:     if (/\bForEach-Object\b/i.test(t)) {
      455:       return makeStep(lineNo, t, "각 항목 반복 처리", "파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.", risk);
      456:     }
      457:     if (/\bSelect-Object\b/i.test(t)) {
      458:       return makeStep(lineNo, t, "필요한 속성 선택", "객체에서 필요한 컬럼/속성만 고르거나 처음/마지막 일부만 선택합니다.", risk);
      459:     }
      460:     if (/\bSort-Object\b/i.test(t)) {
      461:       return makeStep(lineNo, t, "정렬", "파이프라인 데이터의 순서를 특정 속성 기준으로 정렬합니다.", risk);
      462:     }
      463:     if (/\bGroup-Object\b/i.test(t)) {
      464:       return makeStep(lineNo, t, "그룹별 묶기", "같은 값을 가진 항목끼리 묶어서 개수나 그룹별 처리를 할 수 있게 합니다.", risk);
      465:     }
      466:     if (/\bMeasure-Object\b/i.test(t)) {
      467:       return makeStep(lineNo, t, "개수/합계 측정", "항목 개수, 합계, 평균 같은 간단한 통계를 계산합니다.", risk);
      468:     }
      469:     if (/\bConvertFrom-Json\b/i.test(t)) {
      470:       return makeStep(lineNo, t, "JSON을 객체로 변환", "JSON 문자열을 PowerShell 객체로 바꿔서 속성처럼 접근할 수 있게 합니다.", risk);

### src/pwa/code_explainer_rules.js:461

- patterns: return makeStep

      455:       return makeStep(lineNo, t, "각 항목 반복 처리", "파이프라인으로 넘어온 항목을 하나씩 꺼내 같은 작업을 반복합니다. $_는 현재 처리 중인 항목입니다.", risk);
      456:     }
      457:     if (/\bSelect-Object\b/i.test(t)) {
      458:       return makeStep(lineNo, t, "필요한 속성 선택", "객체에서 필요한 컬럼/속성만 고르거나 처음/마지막 일부만 선택합니다.", risk);
      459:     }
      460:     if (/\bSort-Object\b/i.test(t)) {
      461:       return makeStep(lineNo, t, "정렬", "파이프라인 데이터의 순서를 특정 속성 기준으로 정렬합니다.", risk);
      462:     }
      463:     if (/\bGroup-Object\b/i.test(t)) {
      464:       return makeStep(lineNo, t, "그룹별 묶기", "같은 값을 가진 항목끼리 묶어서 개수나 그룹별 처리를 할 수 있게 합니다.", risk);
      465:     }
      466:     if (/\bMeasure-Object\b/i.test(t)) {
      467:       return makeStep(lineNo, t, "개수/합계 측정", "항목 개수, 합계, 평균 같은 간단한 통계를 계산합니다.", risk);
      468:     }
      469:     if (/\bConvertFrom-Json\b/i.test(t)) {
      470:       return makeStep(lineNo, t, "JSON을 객체로 변환", "JSON 문자열을 PowerShell 객체로 바꿔서 속성처럼 접근할 수 있게 합니다.", risk);
      471:     }
      472:     if (/\bConvertTo-Json\b/i.test(t)) {
      473:       return makeStep(lineNo, t, "객체를 JSON으로 변환", "PowerShell 객체를 JSON 문자열로 바꿉니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:464

- patterns: return makeStep

      458:       return makeStep(lineNo, t, "필요한 속성 선택", "객체에서 필요한 컬럼/속성만 고르거나 처음/마지막 일부만 선택합니다.", risk);
      459:     }
      460:     if (/\bSort-Object\b/i.test(t)) {
      461:       return makeStep(lineNo, t, "정렬", "파이프라인 데이터의 순서를 특정 속성 기준으로 정렬합니다.", risk);
      462:     }
      463:     if (/\bGroup-Object\b/i.test(t)) {
      464:       return makeStep(lineNo, t, "그룹별 묶기", "같은 값을 가진 항목끼리 묶어서 개수나 그룹별 처리를 할 수 있게 합니다.", risk);
      465:     }
      466:     if (/\bMeasure-Object\b/i.test(t)) {
      467:       return makeStep(lineNo, t, "개수/합계 측정", "항목 개수, 합계, 평균 같은 간단한 통계를 계산합니다.", risk);
      468:     }
      469:     if (/\bConvertFrom-Json\b/i.test(t)) {
      470:       return makeStep(lineNo, t, "JSON을 객체로 변환", "JSON 문자열을 PowerShell 객체로 바꿔서 속성처럼 접근할 수 있게 합니다.", risk);
      471:     }
      472:     if (/\bConvertTo-Json\b/i.test(t)) {
      473:       return makeStep(lineNo, t, "객체를 JSON으로 변환", "PowerShell 객체를 JSON 문자열로 바꿉니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있습니다.", risk);
      474:     }
      475:     if (/\bImport-Csv\b/i.test(t)) {
      476:       return makeStep(lineNo, t, "CSV 읽기", "CSV 파일을 행 단위 객체 목록으로 읽습니다. 첫 줄은 보통 컬럼명으로 사용됩니다.", risk);

### src/pwa/code_explainer_rules.js:467

- patterns: return makeStep

      461:       return makeStep(lineNo, t, "정렬", "파이프라인 데이터의 순서를 특정 속성 기준으로 정렬합니다.", risk);
      462:     }
      463:     if (/\bGroup-Object\b/i.test(t)) {
      464:       return makeStep(lineNo, t, "그룹별 묶기", "같은 값을 가진 항목끼리 묶어서 개수나 그룹별 처리를 할 수 있게 합니다.", risk);
      465:     }
      466:     if (/\bMeasure-Object\b/i.test(t)) {
      467:       return makeStep(lineNo, t, "개수/합계 측정", "항목 개수, 합계, 평균 같은 간단한 통계를 계산합니다.", risk);
      468:     }
      469:     if (/\bConvertFrom-Json\b/i.test(t)) {
      470:       return makeStep(lineNo, t, "JSON을 객체로 변환", "JSON 문자열을 PowerShell 객체로 바꿔서 속성처럼 접근할 수 있게 합니다.", risk);
      471:     }
      472:     if (/\bConvertTo-Json\b/i.test(t)) {
      473:       return makeStep(lineNo, t, "객체를 JSON으로 변환", "PowerShell 객체를 JSON 문자열로 바꿉니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있습니다.", risk);
      474:     }
      475:     if (/\bImport-Csv\b/i.test(t)) {
      476:       return makeStep(lineNo, t, "CSV 읽기", "CSV 파일을 행 단위 객체 목록으로 읽습니다. 첫 줄은 보통 컬럼명으로 사용됩니다.", risk);
      477:     }
      478:     if (/\bExport-Csv\b/i.test(t)) {
      479:       return makeStep(lineNo, t, "CSV 저장", "PowerShell 객체 목록을 CSV 파일로 저장합니다. -NoTypeInformation 여부와 인코딩을 확인합니다.", risk);

### src/pwa/code_explainer_rules.js:470

- patterns: return makeStep

      464:       return makeStep(lineNo, t, "그룹별 묶기", "같은 값을 가진 항목끼리 묶어서 개수나 그룹별 처리를 할 수 있게 합니다.", risk);
      465:     }
      466:     if (/\bMeasure-Object\b/i.test(t)) {
      467:       return makeStep(lineNo, t, "개수/합계 측정", "항목 개수, 합계, 평균 같은 간단한 통계를 계산합니다.", risk);
      468:     }
      469:     if (/\bConvertFrom-Json\b/i.test(t)) {
      470:       return makeStep(lineNo, t, "JSON을 객체로 변환", "JSON 문자열을 PowerShell 객체로 바꿔서 속성처럼 접근할 수 있게 합니다.", risk);
      471:     }
      472:     if (/\bConvertTo-Json\b/i.test(t)) {
      473:       return makeStep(lineNo, t, "객체를 JSON으로 변환", "PowerShell 객체를 JSON 문자열로 바꿉니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있습니다.", risk);
      474:     }
      475:     if (/\bImport-Csv\b/i.test(t)) {
      476:       return makeStep(lineNo, t, "CSV 읽기", "CSV 파일을 행 단위 객체 목록으로 읽습니다. 첫 줄은 보통 컬럼명으로 사용됩니다.", risk);
      477:     }
      478:     if (/\bExport-Csv\b/i.test(t)) {
      479:       return makeStep(lineNo, t, "CSV 저장", "PowerShell 객체 목록을 CSV 파일로 저장합니다. -NoTypeInformation 여부와 인코딩을 확인합니다.", risk);
      480:     }
      481:     if (/\bConvertFrom-Csv\b/i.test(t)) {
      482:       return makeStep(lineNo, t, "CSV 문자열 변환", "CSV 형식 문자열을 PowerShell 객체 목록으로 바꿉니다.", risk);

### src/pwa/code_explainer_rules.js:473

- patterns: return makeStep

      467:       return makeStep(lineNo, t, "개수/합계 측정", "항목 개수, 합계, 평균 같은 간단한 통계를 계산합니다.", risk);
      468:     }
      469:     if (/\bConvertFrom-Json\b/i.test(t)) {
      470:       return makeStep(lineNo, t, "JSON을 객체로 변환", "JSON 문자열을 PowerShell 객체로 바꿔서 속성처럼 접근할 수 있게 합니다.", risk);
      471:     }
      472:     if (/\bConvertTo-Json\b/i.test(t)) {
      473:       return makeStep(lineNo, t, "객체를 JSON으로 변환", "PowerShell 객체를 JSON 문자열로 바꿉니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있습니다.", risk);
      474:     }
      475:     if (/\bImport-Csv\b/i.test(t)) {
      476:       return makeStep(lineNo, t, "CSV 읽기", "CSV 파일을 행 단위 객체 목록으로 읽습니다. 첫 줄은 보통 컬럼명으로 사용됩니다.", risk);
      477:     }
      478:     if (/\bExport-Csv\b/i.test(t)) {
      479:       return makeStep(lineNo, t, "CSV 저장", "PowerShell 객체 목록을 CSV 파일로 저장합니다. -NoTypeInformation 여부와 인코딩을 확인합니다.", risk);
      480:     }
      481:     if (/\bConvertFrom-Csv\b/i.test(t)) {
      482:       return makeStep(lineNo, t, "CSV 문자열 변환", "CSV 형식 문자열을 PowerShell 객체 목록으로 바꿉니다.", risk);
      483:     }
      484:     if (/^Invoke-RestMethod\b/i.test(t)) {
      485:       return makeStep(lineNo, t, "REST API 호출", "웹 API에 요청을 보내고 JSON 응답을 PowerShell 객체로 바로 읽는 데 자주 씁니다. URL, 메서드, 인증값을 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:476

- patterns: return makeStep

      470:       return makeStep(lineNo, t, "JSON을 객체로 변환", "JSON 문자열을 PowerShell 객체로 바꿔서 속성처럼 접근할 수 있게 합니다.", risk);
      471:     }
      472:     if (/\bConvertTo-Json\b/i.test(t)) {
      473:       return makeStep(lineNo, t, "객체를 JSON으로 변환", "PowerShell 객체를 JSON 문자열로 바꿉니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있습니다.", risk);
      474:     }
      475:     if (/\bImport-Csv\b/i.test(t)) {
      476:       return makeStep(lineNo, t, "CSV 읽기", "CSV 파일을 행 단위 객체 목록으로 읽습니다. 첫 줄은 보통 컬럼명으로 사용됩니다.", risk);
      477:     }
      478:     if (/\bExport-Csv\b/i.test(t)) {
      479:       return makeStep(lineNo, t, "CSV 저장", "PowerShell 객체 목록을 CSV 파일로 저장합니다. -NoTypeInformation 여부와 인코딩을 확인합니다.", risk);
      480:     }
      481:     if (/\bConvertFrom-Csv\b/i.test(t)) {
      482:       return makeStep(lineNo, t, "CSV 문자열 변환", "CSV 형식 문자열을 PowerShell 객체 목록으로 바꿉니다.", risk);
      483:     }
      484:     if (/^Invoke-RestMethod\b/i.test(t)) {
      485:       return makeStep(lineNo, t, "REST API 호출", "웹 API에 요청을 보내고 JSON 응답을 PowerShell 객체로 바로 읽는 데 자주 씁니다. URL, 메서드, 인증값을 확인해야 합니다.", risk);
      486:     }
      487:     if (/^Start-Process\b/i.test(t)) {
      488:       return makeStep(lineNo, t, "외부 프로그램 실행", "별도 프로세스로 프로그램을 실행합니다. -PassThru가 있으면 프로세스 정보를 받아 나중에 종료/확인할 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:479

- patterns: return makeStep

      473:       return makeStep(lineNo, t, "객체를 JSON으로 변환", "PowerShell 객체를 JSON 문자열로 바꿉니다. -Depth가 낮으면 중첩 객체가 잘릴 수 있습니다.", risk);
      474:     }
      475:     if (/\bImport-Csv\b/i.test(t)) {
      476:       return makeStep(lineNo, t, "CSV 읽기", "CSV 파일을 행 단위 객체 목록으로 읽습니다. 첫 줄은 보통 컬럼명으로 사용됩니다.", risk);
      477:     }
      478:     if (/\bExport-Csv\b/i.test(t)) {
      479:       return makeStep(lineNo, t, "CSV 저장", "PowerShell 객체 목록을 CSV 파일로 저장합니다. -NoTypeInformation 여부와 인코딩을 확인합니다.", risk);
      480:     }
      481:     if (/\bConvertFrom-Csv\b/i.test(t)) {
      482:       return makeStep(lineNo, t, "CSV 문자열 변환", "CSV 형식 문자열을 PowerShell 객체 목록으로 바꿉니다.", risk);
      483:     }
      484:     if (/^Invoke-RestMethod\b/i.test(t)) {
      485:       return makeStep(lineNo, t, "REST API 호출", "웹 API에 요청을 보내고 JSON 응답을 PowerShell 객체로 바로 읽는 데 자주 씁니다. URL, 메서드, 인증값을 확인해야 합니다.", risk);
      486:     }
      487:     if (/^Start-Process\b/i.test(t)) {
      488:       return makeStep(lineNo, t, "외부 프로그램 실행", "별도 프로세스로 프로그램을 실행합니다. -PassThru가 있으면 프로세스 정보를 받아 나중에 종료/확인할 수 있습니다.", risk);
      489:     }
      490:     if (/^Get-Process\b/i.test(t)) {
      491:       return makeStep(lineNo, t, "프로세스 조회", "현재 실행 중인 프로그램 목록이나 특정 프로세스 상태를 확인합니다.", risk);

### src/pwa/code_explainer_rules.js:482

- patterns: return makeStep

      476:       return makeStep(lineNo, t, "CSV 읽기", "CSV 파일을 행 단위 객체 목록으로 읽습니다. 첫 줄은 보통 컬럼명으로 사용됩니다.", risk);
      477:     }
      478:     if (/\bExport-Csv\b/i.test(t)) {
      479:       return makeStep(lineNo, t, "CSV 저장", "PowerShell 객체 목록을 CSV 파일로 저장합니다. -NoTypeInformation 여부와 인코딩을 확인합니다.", risk);
      480:     }
      481:     if (/\bConvertFrom-Csv\b/i.test(t)) {
      482:       return makeStep(lineNo, t, "CSV 문자열 변환", "CSV 형식 문자열을 PowerShell 객체 목록으로 바꿉니다.", risk);
      483:     }
      484:     if (/^Invoke-RestMethod\b/i.test(t)) {
      485:       return makeStep(lineNo, t, "REST API 호출", "웹 API에 요청을 보내고 JSON 응답을 PowerShell 객체로 바로 읽는 데 자주 씁니다. URL, 메서드, 인증값을 확인해야 합니다.", risk);
      486:     }
      487:     if (/^Start-Process\b/i.test(t)) {
      488:       return makeStep(lineNo, t, "외부 프로그램 실행", "별도 프로세스로 프로그램을 실행합니다. -PassThru가 있으면 프로세스 정보를 받아 나중에 종료/확인할 수 있습니다.", risk);
      489:     }
      490:     if (/^Get-Process\b/i.test(t)) {
      491:       return makeStep(lineNo, t, "프로세스 조회", "현재 실행 중인 프로그램 목록이나 특정 프로세스 상태를 확인합니다.", risk);
      492:     }
      493:     if (/^Stop-Process\b/i.test(t)) {
      494:       return makeStep(lineNo, t, "프로세스 종료", "실행 중인 프로세스를 종료합니다. -Force가 있으면 강제로 종료하므로 대상 ID를 반드시 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:485

- patterns: return makeStep

      479:       return makeStep(lineNo, t, "CSV 저장", "PowerShell 객체 목록을 CSV 파일로 저장합니다. -NoTypeInformation 여부와 인코딩을 확인합니다.", risk);
      480:     }
      481:     if (/\bConvertFrom-Csv\b/i.test(t)) {
      482:       return makeStep(lineNo, t, "CSV 문자열 변환", "CSV 형식 문자열을 PowerShell 객체 목록으로 바꿉니다.", risk);
      483:     }
      484:     if (/^Invoke-RestMethod\b/i.test(t)) {
      485:       return makeStep(lineNo, t, "REST API 호출", "웹 API에 요청을 보내고 JSON 응답을 PowerShell 객체로 바로 읽는 데 자주 씁니다. URL, 메서드, 인증값을 확인해야 합니다.", risk);
      486:     }
      487:     if (/^Start-Process\b/i.test(t)) {
      488:       return makeStep(lineNo, t, "외부 프로그램 실행", "별도 프로세스로 프로그램을 실행합니다. -PassThru가 있으면 프로세스 정보를 받아 나중에 종료/확인할 수 있습니다.", risk);
      489:     }
      490:     if (/^Get-Process\b/i.test(t)) {
      491:       return makeStep(lineNo, t, "프로세스 조회", "현재 실행 중인 프로그램 목록이나 특정 프로세스 상태를 확인합니다.", risk);
      492:     }
      493:     if (/^Stop-Process\b/i.test(t)) {
      494:       return makeStep(lineNo, t, "프로세스 종료", "실행 중인 프로세스를 종료합니다. -Force가 있으면 강제로 종료하므로 대상 ID를 반드시 확인해야 합니다.", risk);
      495:     }
      496:     if (/^Wait-Job\b/i.test(t)) {
      497:       return makeStep(lineNo, t, "작업 완료 대기", "백그라운드 작업이 끝날 때까지 기다립니다.", risk);

### src/pwa/code_explainer_rules.js:488

- patterns: return makeStep

      482:       return makeStep(lineNo, t, "CSV 문자열 변환", "CSV 형식 문자열을 PowerShell 객체 목록으로 바꿉니다.", risk);
      483:     }
      484:     if (/^Invoke-RestMethod\b/i.test(t)) {
      485:       return makeStep(lineNo, t, "REST API 호출", "웹 API에 요청을 보내고 JSON 응답을 PowerShell 객체로 바로 읽는 데 자주 씁니다. URL, 메서드, 인증값을 확인해야 합니다.", risk);
      486:     }
      487:     if (/^Start-Process\b/i.test(t)) {
      488:       return makeStep(lineNo, t, "외부 프로그램 실행", "별도 프로세스로 프로그램을 실행합니다. -PassThru가 있으면 프로세스 정보를 받아 나중에 종료/확인할 수 있습니다.", risk);
      489:     }
      490:     if (/^Get-Process\b/i.test(t)) {
      491:       return makeStep(lineNo, t, "프로세스 조회", "현재 실행 중인 프로그램 목록이나 특정 프로세스 상태를 확인합니다.", risk);
      492:     }
      493:     if (/^Stop-Process\b/i.test(t)) {
      494:       return makeStep(lineNo, t, "프로세스 종료", "실행 중인 프로세스를 종료합니다. -Force가 있으면 강제로 종료하므로 대상 ID를 반드시 확인해야 합니다.", risk);
      495:     }
      496:     if (/^Wait-Job\b/i.test(t)) {
      497:       return makeStep(lineNo, t, "작업 완료 대기", "백그라운드 작업이 끝날 때까지 기다립니다.", risk);
      498:     }
      499:     if (/^Receive-Job\b/i.test(t)) {
      500:       return makeStep(lineNo, t, "작업 결과 받기", "백그라운드 작업이 만든 결과를 현재 콘솔로 가져옵니다.", risk);

### src/pwa/code_explainer_rules.js:491

- patterns: return makeStep

      485:       return makeStep(lineNo, t, "REST API 호출", "웹 API에 요청을 보내고 JSON 응답을 PowerShell 객체로 바로 읽는 데 자주 씁니다. URL, 메서드, 인증값을 확인해야 합니다.", risk);
      486:     }
      487:     if (/^Start-Process\b/i.test(t)) {
      488:       return makeStep(lineNo, t, "외부 프로그램 실행", "별도 프로세스로 프로그램을 실행합니다. -PassThru가 있으면 프로세스 정보를 받아 나중에 종료/확인할 수 있습니다.", risk);
      489:     }
      490:     if (/^Get-Process\b/i.test(t)) {
      491:       return makeStep(lineNo, t, "프로세스 조회", "현재 실행 중인 프로그램 목록이나 특정 프로세스 상태를 확인합니다.", risk);
      492:     }
      493:     if (/^Stop-Process\b/i.test(t)) {
      494:       return makeStep(lineNo, t, "프로세스 종료", "실행 중인 프로세스를 종료합니다. -Force가 있으면 강제로 종료하므로 대상 ID를 반드시 확인해야 합니다.", risk);
      495:     }
      496:     if (/^Wait-Job\b/i.test(t)) {
      497:       return makeStep(lineNo, t, "작업 완료 대기", "백그라운드 작업이 끝날 때까지 기다립니다.", risk);
      498:     }
      499:     if (/^Receive-Job\b/i.test(t)) {
      500:       return makeStep(lineNo, t, "작업 결과 받기", "백그라운드 작업이 만든 결과를 현재 콘솔로 가져옵니다.", risk);
      501:     }
      502:     if (/^throw\b/i.test(t)) {
      503:       return makeStep(lineNo, t, "오류 발생시키기", "조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다.", risk);

### src/pwa/code_explainer_rules.js:494

- patterns: return makeStep

      488:       return makeStep(lineNo, t, "외부 프로그램 실행", "별도 프로세스로 프로그램을 실행합니다. -PassThru가 있으면 프로세스 정보를 받아 나중에 종료/확인할 수 있습니다.", risk);
      489:     }
      490:     if (/^Get-Process\b/i.test(t)) {
      491:       return makeStep(lineNo, t, "프로세스 조회", "현재 실행 중인 프로그램 목록이나 특정 프로세스 상태를 확인합니다.", risk);
      492:     }
      493:     if (/^Stop-Process\b/i.test(t)) {
      494:       return makeStep(lineNo, t, "프로세스 종료", "실행 중인 프로세스를 종료합니다. -Force가 있으면 강제로 종료하므로 대상 ID를 반드시 확인해야 합니다.", risk);
      495:     }
      496:     if (/^Wait-Job\b/i.test(t)) {
      497:       return makeStep(lineNo, t, "작업 완료 대기", "백그라운드 작업이 끝날 때까지 기다립니다.", risk);
      498:     }
      499:     if (/^Receive-Job\b/i.test(t)) {
      500:       return makeStep(lineNo, t, "작업 결과 받기", "백그라운드 작업이 만든 결과를 현재 콘솔로 가져옵니다.", risk);
      501:     }
      502:     if (/^throw\b/i.test(t)) {
      503:       return makeStep(lineNo, t, "오류 발생시키기", "조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다.", risk);
      504:     }
      505:     if (/^exit\b/i.test(t)) {
      506:       return makeStep(lineNo, t, "스크립트 종료", "현재 스크립트나 프로세스를 지정한 종료 코드와 함께 끝냅니다.", risk);

### src/pwa/code_explainer_rules.js:497

- patterns: return makeStep

      491:       return makeStep(lineNo, t, "프로세스 조회", "현재 실행 중인 프로그램 목록이나 특정 프로세스 상태를 확인합니다.", risk);
      492:     }
      493:     if (/^Stop-Process\b/i.test(t)) {
      494:       return makeStep(lineNo, t, "프로세스 종료", "실행 중인 프로세스를 종료합니다. -Force가 있으면 강제로 종료하므로 대상 ID를 반드시 확인해야 합니다.", risk);
      495:     }
      496:     if (/^Wait-Job\b/i.test(t)) {
      497:       return makeStep(lineNo, t, "작업 완료 대기", "백그라운드 작업이 끝날 때까지 기다립니다.", risk);
      498:     }
      499:     if (/^Receive-Job\b/i.test(t)) {
      500:       return makeStep(lineNo, t, "작업 결과 받기", "백그라운드 작업이 만든 결과를 현재 콘솔로 가져옵니다.", risk);
      501:     }
      502:     if (/^throw\b/i.test(t)) {
      503:       return makeStep(lineNo, t, "오류 발생시키기", "조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다.", risk);
      504:     }
      505:     if (/^exit\b/i.test(t)) {
      506:       return makeStep(lineNo, t, "스크립트 종료", "현재 스크립트나 프로세스를 지정한 종료 코드와 함께 끝냅니다.", risk);
      507:     }
      508:     if (/^return\b/i.test(t)) {
      509:       return makeStep(lineNo, t, "값 반환", "함수나 스크립트 블록에서 결과를 돌려주고 이후 흐름을 끝냅니다.", risk);

### src/pwa/code_explainer_rules.js:500

- patterns: return makeStep

      494:       return makeStep(lineNo, t, "프로세스 종료", "실행 중인 프로세스를 종료합니다. -Force가 있으면 강제로 종료하므로 대상 ID를 반드시 확인해야 합니다.", risk);
      495:     }
      496:     if (/^Wait-Job\b/i.test(t)) {
      497:       return makeStep(lineNo, t, "작업 완료 대기", "백그라운드 작업이 끝날 때까지 기다립니다.", risk);
      498:     }
      499:     if (/^Receive-Job\b/i.test(t)) {
      500:       return makeStep(lineNo, t, "작업 결과 받기", "백그라운드 작업이 만든 결과를 현재 콘솔로 가져옵니다.", risk);
      501:     }
      502:     if (/^throw\b/i.test(t)) {
      503:       return makeStep(lineNo, t, "오류 발생시키기", "조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다.", risk);
      504:     }
      505:     if (/^exit\b/i.test(t)) {
      506:       return makeStep(lineNo, t, "스크립트 종료", "현재 스크립트나 프로세스를 지정한 종료 코드와 함께 끝냅니다.", risk);
      507:     }
      508:     if (/^return\b/i.test(t)) {
      509:       return makeStep(lineNo, t, "값 반환", "함수나 스크립트 블록에서 결과를 돌려주고 이후 흐름을 끝냅니다.", risk);
      510:     }
      511: 
      512:     if (/^New-Item\b/i.test(t)) {

### src/pwa/code_explainer_rules.js:503

- patterns: return makeStep

      497:       return makeStep(lineNo, t, "작업 완료 대기", "백그라운드 작업이 끝날 때까지 기다립니다.", risk);
      498:     }
      499:     if (/^Receive-Job\b/i.test(t)) {
      500:       return makeStep(lineNo, t, "작업 결과 받기", "백그라운드 작업이 만든 결과를 현재 콘솔로 가져옵니다.", risk);
      501:     }
      502:     if (/^throw\b/i.test(t)) {
      503:       return makeStep(lineNo, t, "오류 발생시키기", "조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다.", risk);
      504:     }
      505:     if (/^exit\b/i.test(t)) {
      506:       return makeStep(lineNo, t, "스크립트 종료", "현재 스크립트나 프로세스를 지정한 종료 코드와 함께 끝냅니다.", risk);
      507:     }
      508:     if (/^return\b/i.test(t)) {
      509:       return makeStep(lineNo, t, "값 반환", "함수나 스크립트 블록에서 결과를 돌려주고 이후 흐름을 끝냅니다.", risk);
      510:     }
      511: 
      512:     if (/^New-Item\b/i.test(t)) {
      513:       return makeStep(lineNo, t, "새 항목 생성", "폴더나 파일을 만듭니다. -ItemType Directory가 있으면 폴더를 만드는 명령입니다.", risk);
      514:     }
      515:     if (/^Copy-Item\b/i.test(t)) {

### src/pwa/code_explainer_rules.js:506

- patterns: return makeStep

      500:       return makeStep(lineNo, t, "작업 결과 받기", "백그라운드 작업이 만든 결과를 현재 콘솔로 가져옵니다.", risk);
      501:     }
      502:     if (/^throw\b/i.test(t)) {
      503:       return makeStep(lineNo, t, "오류 발생시키기", "조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다.", risk);
      504:     }
      505:     if (/^exit\b/i.test(t)) {
      506:       return makeStep(lineNo, t, "스크립트 종료", "현재 스크립트나 프로세스를 지정한 종료 코드와 함께 끝냅니다.", risk);
      507:     }
      508:     if (/^return\b/i.test(t)) {
      509:       return makeStep(lineNo, t, "값 반환", "함수나 스크립트 블록에서 결과를 돌려주고 이후 흐름을 끝냅니다.", risk);
      510:     }
      511: 
      512:     if (/^New-Item\b/i.test(t)) {
      513:       return makeStep(lineNo, t, "새 항목 생성", "폴더나 파일을 만듭니다. -ItemType Directory가 있으면 폴더를 만드는 명령입니다.", risk);
      514:     }
      515:     if (/^Copy-Item\b/i.test(t)) {
      516:       return makeStep(lineNo, t, codeRuleTextV334A11B("파일/폴더 복사", "Copying files/folders"), codeRuleTextV334A11B("원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다.", "Copies the original file or folder to another location. With -Recurse, folder contents are included."), risk);
      517:     }
      518:     if (/^Move-Item\b/i.test(t)) {

### src/pwa/code_explainer_rules.js:509

- patterns: return makeStep

      503:       return makeStep(lineNo, t, "오류 발생시키기", "조건이 맞지 않거나 검증에 실패했을 때 의도적으로 오류를 발생시켜 실행을 중단합니다.", risk);
      504:     }
      505:     if (/^exit\b/i.test(t)) {
      506:       return makeStep(lineNo, t, "스크립트 종료", "현재 스크립트나 프로세스를 지정한 종료 코드와 함께 끝냅니다.", risk);
      507:     }
      508:     if (/^return\b/i.test(t)) {
      509:       return makeStep(lineNo, t, "값 반환", "함수나 스크립트 블록에서 결과를 돌려주고 이후 흐름을 끝냅니다.", risk);
      510:     }
      511: 
      512:     if (/^New-Item\b/i.test(t)) {
      513:       return makeStep(lineNo, t, "새 항목 생성", "폴더나 파일을 만듭니다. -ItemType Directory가 있으면 폴더를 만드는 명령입니다.", risk);
      514:     }
      515:     if (/^Copy-Item\b/i.test(t)) {
      516:       return makeStep(lineNo, t, codeRuleTextV334A11B("파일/폴더 복사", "Copying files/folders"), codeRuleTextV334A11B("원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다.", "Copies the original file or folder to another location. With -Recurse, folder contents are included."), risk);
      517:     }
      518:     if (/^Move-Item\b/i.test(t)) {
      519:       return makeStep(lineNo, t, "파일/폴더 이동", "파일이나 폴더의 위치를 옮깁니다. 원래 위치에서 사라질 수 있으므로 대상 경로를 확인해야 합니다.", risk);
      520:     }
      521:     if (/^Remove-Item\b/i.test(t)) {

### src/pwa/code_explainer_rules.js:513

- patterns: return makeStep

      507:     }
      508:     if (/^return\b/i.test(t)) {
      509:       return makeStep(lineNo, t, "값 반환", "함수나 스크립트 블록에서 결과를 돌려주고 이후 흐름을 끝냅니다.", risk);
      510:     }
      511: 
      512:     if (/^New-Item\b/i.test(t)) {
      513:       return makeStep(lineNo, t, "새 항목 생성", "폴더나 파일을 만듭니다. -ItemType Directory가 있으면 폴더를 만드는 명령입니다.", risk);
      514:     }
      515:     if (/^Copy-Item\b/i.test(t)) {
      516:       return makeStep(lineNo, t, codeRuleTextV334A11B("파일/폴더 복사", "Copying files/folders"), codeRuleTextV334A11B("원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다.", "Copies the original file or folder to another location. With -Recurse, folder contents are included."), risk);
      517:     }
      518:     if (/^Move-Item\b/i.test(t)) {
      519:       return makeStep(lineNo, t, "파일/폴더 이동", "파일이나 폴더의 위치를 옮깁니다. 원래 위치에서 사라질 수 있으므로 대상 경로를 확인해야 합니다.", risk);
      520:     }
      521:     if (/^Remove-Item\b/i.test(t)) {
      522:       return makeStep(lineNo, t, "파일/폴더 삭제", "지정한 파일이나 폴더를 삭제합니다. -Recurse와 -Force가 함께 있으면 강하게 삭제하므로 실행 전 경로 확인이 필요합니다.", risk);
      523:     }
      524:     if (/^Compress-Archive\b/i.test(t)) {
      525:       return makeStep(lineNo, t, codeRuleTextV334A11B("ZIP 압축 생성", "Create ZIP archive"), codeRuleTextV334A11B("지정한 파일이나 폴더를 zip 파일로 묶습니다.", "Creates a ZIP archive from the specified files or folders."), risk);

### src/pwa/code_explainer_rules.js:516

- patterns: return makeStep

      510:     }
      511: 
      512:     if (/^New-Item\b/i.test(t)) {
      513:       return makeStep(lineNo, t, "새 항목 생성", "폴더나 파일을 만듭니다. -ItemType Directory가 있으면 폴더를 만드는 명령입니다.", risk);
      514:     }
      515:     if (/^Copy-Item\b/i.test(t)) {
      516:       return makeStep(lineNo, t, codeRuleTextV334A11B("파일/폴더 복사", "Copying files/folders"), codeRuleTextV334A11B("원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다.", "Copies the original file or folder to another location. With -Recurse, folder contents are included."), risk);
      517:     }
      518:     if (/^Move-Item\b/i.test(t)) {
      519:       return makeStep(lineNo, t, "파일/폴더 이동", "파일이나 폴더의 위치를 옮깁니다. 원래 위치에서 사라질 수 있으므로 대상 경로를 확인해야 합니다.", risk);
      520:     }
      521:     if (/^Remove-Item\b/i.test(t)) {
      522:       return makeStep(lineNo, t, "파일/폴더 삭제", "지정한 파일이나 폴더를 삭제합니다. -Recurse와 -Force가 함께 있으면 강하게 삭제하므로 실행 전 경로 확인이 필요합니다.", risk);
      523:     }
      524:     if (/^Compress-Archive\b/i.test(t)) {
      525:       return makeStep(lineNo, t, codeRuleTextV334A11B("ZIP 압축 생성", "Create ZIP archive"), codeRuleTextV334A11B("지정한 파일이나 폴더를 zip 파일로 묶습니다.", "Creates a ZIP archive from the specified files or folders."), risk);
      526:     }
      527:     if (/^Expand-Archive\b/i.test(t)) {
      528:       return makeStep(lineNo, t, "ZIP 압축 해제", "zip 파일을 지정한 폴더로 풉니다.", risk);

### src/pwa/code_explainer_rules.js:519

- patterns: return makeStep

      513:       return makeStep(lineNo, t, "새 항목 생성", "폴더나 파일을 만듭니다. -ItemType Directory가 있으면 폴더를 만드는 명령입니다.", risk);
      514:     }
      515:     if (/^Copy-Item\b/i.test(t)) {
      516:       return makeStep(lineNo, t, codeRuleTextV334A11B("파일/폴더 복사", "Copying files/folders"), codeRuleTextV334A11B("원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다.", "Copies the original file or folder to another location. With -Recurse, folder contents are included."), risk);
      517:     }
      518:     if (/^Move-Item\b/i.test(t)) {
      519:       return makeStep(lineNo, t, "파일/폴더 이동", "파일이나 폴더의 위치를 옮깁니다. 원래 위치에서 사라질 수 있으므로 대상 경로를 확인해야 합니다.", risk);
      520:     }
      521:     if (/^Remove-Item\b/i.test(t)) {
      522:       return makeStep(lineNo, t, "파일/폴더 삭제", "지정한 파일이나 폴더를 삭제합니다. -Recurse와 -Force가 함께 있으면 강하게 삭제하므로 실행 전 경로 확인이 필요합니다.", risk);
      523:     }
      524:     if (/^Compress-Archive\b/i.test(t)) {
      525:       return makeStep(lineNo, t, codeRuleTextV334A11B("ZIP 압축 생성", "Create ZIP archive"), codeRuleTextV334A11B("지정한 파일이나 폴더를 zip 파일로 묶습니다.", "Creates a ZIP archive from the specified files or folders."), risk);
      526:     }
      527:     if (/^Expand-Archive\b/i.test(t)) {
      528:       return makeStep(lineNo, t, "ZIP 압축 해제", "zip 파일을 지정한 폴더로 풉니다.", risk);
      529:     }
      530:     if (/Test-Path/i.test(t)) {
      531:       return makeStep(lineNo, t, "경로 존재 확인", "파일이나 폴더가 실제로 있는지 확인합니다. if와 함께 쓰면 있을 때만 다음 명령을 실행할 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:522

- patterns: return makeStep

      516:       return makeStep(lineNo, t, codeRuleTextV334A11B("파일/폴더 복사", "Copying files/folders"), codeRuleTextV334A11B("원본 파일이나 폴더를 다른 위치로 복사합니다. -Recurse가 있으면 폴더 안의 내용까지 포함합니다.", "Copies the original file or folder to another location. With -Recurse, folder contents are included."), risk);
      517:     }
      518:     if (/^Move-Item\b/i.test(t)) {
      519:       return makeStep(lineNo, t, "파일/폴더 이동", "파일이나 폴더의 위치를 옮깁니다. 원래 위치에서 사라질 수 있으므로 대상 경로를 확인해야 합니다.", risk);
      520:     }
      521:     if (/^Remove-Item\b/i.test(t)) {
      522:       return makeStep(lineNo, t, "파일/폴더 삭제", "지정한 파일이나 폴더를 삭제합니다. -Recurse와 -Force가 함께 있으면 강하게 삭제하므로 실행 전 경로 확인이 필요합니다.", risk);
      523:     }
      524:     if (/^Compress-Archive\b/i.test(t)) {
      525:       return makeStep(lineNo, t, codeRuleTextV334A11B("ZIP 압축 생성", "Create ZIP archive"), codeRuleTextV334A11B("지정한 파일이나 폴더를 zip 파일로 묶습니다.", "Creates a ZIP archive from the specified files or folders."), risk);
      526:     }
      527:     if (/^Expand-Archive\b/i.test(t)) {
      528:       return makeStep(lineNo, t, "ZIP 압축 해제", "zip 파일을 지정한 폴더로 풉니다.", risk);
      529:     }
      530:     if (/Test-Path/i.test(t)) {
      531:       return makeStep(lineNo, t, "경로 존재 확인", "파일이나 폴더가 실제로 있는지 확인합니다. if와 함께 쓰면 있을 때만 다음 명령을 실행할 수 있습니다.", risk);
      532:     }
      533:     if (/^if\s*\(/i.test(t)) {
      534:       return makeStep(lineNo, t, "조건 확인", "괄호 안 조건이 맞는지 검사합니다. 조건이 맞을 때만 중괄호 안 명령들이 실행됩니다.", risk);

### src/pwa/code_explainer_rules.js:525

- patterns: return makeStep

      519:       return makeStep(lineNo, t, "파일/폴더 이동", "파일이나 폴더의 위치를 옮깁니다. 원래 위치에서 사라질 수 있으므로 대상 경로를 확인해야 합니다.", risk);
      520:     }
      521:     if (/^Remove-Item\b/i.test(t)) {
      522:       return makeStep(lineNo, t, "파일/폴더 삭제", "지정한 파일이나 폴더를 삭제합니다. -Recurse와 -Force가 함께 있으면 강하게 삭제하므로 실행 전 경로 확인이 필요합니다.", risk);
      523:     }
      524:     if (/^Compress-Archive\b/i.test(t)) {
      525:       return makeStep(lineNo, t, codeRuleTextV334A11B("ZIP 압축 생성", "Create ZIP archive"), codeRuleTextV334A11B("지정한 파일이나 폴더를 zip 파일로 묶습니다.", "Creates a ZIP archive from the specified files or folders."), risk);
      526:     }
      527:     if (/^Expand-Archive\b/i.test(t)) {
      528:       return makeStep(lineNo, t, "ZIP 압축 해제", "zip 파일을 지정한 폴더로 풉니다.", risk);
      529:     }
      530:     if (/Test-Path/i.test(t)) {
      531:       return makeStep(lineNo, t, "경로 존재 확인", "파일이나 폴더가 실제로 있는지 확인합니다. if와 함께 쓰면 있을 때만 다음 명령을 실행할 수 있습니다.", risk);
      532:     }
      533:     if (/^if\s*\(/i.test(t)) {
      534:       return makeStep(lineNo, t, "조건 확인", "괄호 안 조건이 맞는지 검사합니다. 조건이 맞을 때만 중괄호 안 명령들이 실행됩니다.", risk);
      535:     }
      536:     if (/^foreach\s*\(/i.test(t)) {
      537:       return makeStep(lineNo, t, "반복 실행", "목록에 들어 있는 값을 하나씩 꺼내며 같은 작업을 반복합니다.", risk);

### src/pwa/code_explainer_rules.js:528

- patterns: return makeStep

      522:       return makeStep(lineNo, t, "파일/폴더 삭제", "지정한 파일이나 폴더를 삭제합니다. -Recurse와 -Force가 함께 있으면 강하게 삭제하므로 실행 전 경로 확인이 필요합니다.", risk);
      523:     }
      524:     if (/^Compress-Archive\b/i.test(t)) {
      525:       return makeStep(lineNo, t, codeRuleTextV334A11B("ZIP 압축 생성", "Create ZIP archive"), codeRuleTextV334A11B("지정한 파일이나 폴더를 zip 파일로 묶습니다.", "Creates a ZIP archive from the specified files or folders."), risk);
      526:     }
      527:     if (/^Expand-Archive\b/i.test(t)) {
      528:       return makeStep(lineNo, t, "ZIP 압축 해제", "zip 파일을 지정한 폴더로 풉니다.", risk);
      529:     }
      530:     if (/Test-Path/i.test(t)) {
      531:       return makeStep(lineNo, t, "경로 존재 확인", "파일이나 폴더가 실제로 있는지 확인합니다. if와 함께 쓰면 있을 때만 다음 명령을 실행할 수 있습니다.", risk);
      532:     }
      533:     if (/^if\s*\(/i.test(t)) {
      534:       return makeStep(lineNo, t, "조건 확인", "괄호 안 조건이 맞는지 검사합니다. 조건이 맞을 때만 중괄호 안 명령들이 실행됩니다.", risk);
      535:     }
      536:     if (/^foreach\s*\(/i.test(t)) {
      537:       return makeStep(lineNo, t, "반복 실행", "목록에 들어 있는 값을 하나씩 꺼내며 같은 작업을 반복합니다.", risk);
      538:     }
      539:     if (/^node\s+--check\b/i.test(t)) {
      540:       return makeStep(lineNo, t, "Node 문법 검사", "JavaScript 파일을 실행하지 않고 문법 오류가 있는지만 검사합니다.", risk);

### src/pwa/code_explainer_rules.js:531

- patterns: return makeStep

      525:       return makeStep(lineNo, t, codeRuleTextV334A11B("ZIP 압축 생성", "Create ZIP archive"), codeRuleTextV334A11B("지정한 파일이나 폴더를 zip 파일로 묶습니다.", "Creates a ZIP archive from the specified files or folders."), risk);
      526:     }
      527:     if (/^Expand-Archive\b/i.test(t)) {
      528:       return makeStep(lineNo, t, "ZIP 압축 해제", "zip 파일을 지정한 폴더로 풉니다.", risk);
      529:     }
      530:     if (/Test-Path/i.test(t)) {
      531:       return makeStep(lineNo, t, "경로 존재 확인", "파일이나 폴더가 실제로 있는지 확인합니다. if와 함께 쓰면 있을 때만 다음 명령을 실행할 수 있습니다.", risk);
      532:     }
      533:     if (/^if\s*\(/i.test(t)) {
      534:       return makeStep(lineNo, t, "조건 확인", "괄호 안 조건이 맞는지 검사합니다. 조건이 맞을 때만 중괄호 안 명령들이 실행됩니다.", risk);
      535:     }
      536:     if (/^foreach\s*\(/i.test(t)) {
      537:       return makeStep(lineNo, t, "반복 실행", "목록에 들어 있는 값을 하나씩 꺼내며 같은 작업을 반복합니다.", risk);
      538:     }
      539:     if (/^node\s+--check\b/i.test(t)) {
      540:       return makeStep(lineNo, t, "Node 문법 검사", "JavaScript 파일을 실행하지 않고 문법 오류가 있는지만 검사합니다.", risk);
      541:     }
      542:     if (/^npm\s+(install|ci)\b/i.test(t)) {
      543:       return makeStep(lineNo, t, "npm 의존성 설치", "package.json 기준으로 JavaScript 프로젝트에 필요한 패키지를 설치합니다.", risk);

### src/pwa/code_explainer_rules.js:534

- patterns: return makeStep

      528:       return makeStep(lineNo, t, "ZIP 압축 해제", "zip 파일을 지정한 폴더로 풉니다.", risk);
      529:     }
      530:     if (/Test-Path/i.test(t)) {
      531:       return makeStep(lineNo, t, "경로 존재 확인", "파일이나 폴더가 실제로 있는지 확인합니다. if와 함께 쓰면 있을 때만 다음 명령을 실행할 수 있습니다.", risk);
      532:     }
      533:     if (/^if\s*\(/i.test(t)) {
      534:       return makeStep(lineNo, t, "조건 확인", "괄호 안 조건이 맞는지 검사합니다. 조건이 맞을 때만 중괄호 안 명령들이 실행됩니다.", risk);
      535:     }
      536:     if (/^foreach\s*\(/i.test(t)) {
      537:       return makeStep(lineNo, t, "반복 실행", "목록에 들어 있는 값을 하나씩 꺼내며 같은 작업을 반복합니다.", risk);
      538:     }
      539:     if (/^node\s+--check\b/i.test(t)) {
      540:       return makeStep(lineNo, t, "Node 문법 검사", "JavaScript 파일을 실행하지 않고 문법 오류가 있는지만 검사합니다.", risk);
      541:     }
      542:     if (/^npm\s+(install|ci)\b/i.test(t)) {
      543:       return makeStep(lineNo, t, "npm 의존성 설치", "package.json 기준으로 JavaScript 프로젝트에 필요한 패키지를 설치합니다.", risk);
      544:     }
      545:     if (/^npm\s+run\b/i.test(t)) {
      546:       return makeStep(lineNo, t, "npm 스크립트 실행", "package.json의 scripts에 정의된 build, test 같은 명령을 실행합니다.", risk);

### src/pwa/code_explainer_rules.js:537

- patterns: return makeStep

      531:       return makeStep(lineNo, t, "경로 존재 확인", "파일이나 폴더가 실제로 있는지 확인합니다. if와 함께 쓰면 있을 때만 다음 명령을 실행할 수 있습니다.", risk);
      532:     }
      533:     if (/^if\s*\(/i.test(t)) {
      534:       return makeStep(lineNo, t, "조건 확인", "괄호 안 조건이 맞는지 검사합니다. 조건이 맞을 때만 중괄호 안 명령들이 실행됩니다.", risk);
      535:     }
      536:     if (/^foreach\s*\(/i.test(t)) {
      537:       return makeStep(lineNo, t, "반복 실행", "목록에 들어 있는 값을 하나씩 꺼내며 같은 작업을 반복합니다.", risk);
      538:     }
      539:     if (/^node\s+--check\b/i.test(t)) {
      540:       return makeStep(lineNo, t, "Node 문법 검사", "JavaScript 파일을 실행하지 않고 문법 오류가 있는지만 검사합니다.", risk);
      541:     }
      542:     if (/^npm\s+(install|ci)\b/i.test(t)) {
      543:       return makeStep(lineNo, t, "npm 의존성 설치", "package.json 기준으로 JavaScript 프로젝트에 필요한 패키지를 설치합니다.", risk);
      544:     }
      545:     if (/^npm\s+run\b/i.test(t)) {
      546:       return makeStep(lineNo, t, "npm 스크립트 실행", "package.json의 scripts에 정의된 build, test 같은 명령을 실행합니다.", risk);
      547:     }
      548:     if (/^python\s+.*validate_lessons\.py\b/i.test(t)) {
      549:       return makeStep(lineNo, t, "Python 검증 실행", "학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다.", risk);

### src/pwa/code_explainer_rules.js:540

- patterns: return makeStep

      534:       return makeStep(lineNo, t, "조건 확인", "괄호 안 조건이 맞는지 검사합니다. 조건이 맞을 때만 중괄호 안 명령들이 실행됩니다.", risk);
      535:     }
      536:     if (/^foreach\s*\(/i.test(t)) {
      537:       return makeStep(lineNo, t, "반복 실행", "목록에 들어 있는 값을 하나씩 꺼내며 같은 작업을 반복합니다.", risk);
      538:     }
      539:     if (/^node\s+--check\b/i.test(t)) {
      540:       return makeStep(lineNo, t, "Node 문법 검사", "JavaScript 파일을 실행하지 않고 문법 오류가 있는지만 검사합니다.", risk);
      541:     }
      542:     if (/^npm\s+(install|ci)\b/i.test(t)) {
      543:       return makeStep(lineNo, t, "npm 의존성 설치", "package.json 기준으로 JavaScript 프로젝트에 필요한 패키지를 설치합니다.", risk);
      544:     }
      545:     if (/^npm\s+run\b/i.test(t)) {
      546:       return makeStep(lineNo, t, "npm 스크립트 실행", "package.json의 scripts에 정의된 build, test 같은 명령을 실행합니다.", risk);
      547:     }
      548:     if (/^python\s+.*validate_lessons\.py\b/i.test(t)) {
      549:       return makeStep(lineNo, t, "Python 검증 실행", "학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다.", risk);
      550:     }
      551:     if (/^python\s+/.test(t)) {
      552:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 모듈을 실행합니다. 인자와 실행 위치를 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:543

- patterns: return makeStep

      537:       return makeStep(lineNo, t, "반복 실행", "목록에 들어 있는 값을 하나씩 꺼내며 같은 작업을 반복합니다.", risk);
      538:     }
      539:     if (/^node\s+--check\b/i.test(t)) {
      540:       return makeStep(lineNo, t, "Node 문법 검사", "JavaScript 파일을 실행하지 않고 문법 오류가 있는지만 검사합니다.", risk);
      541:     }
      542:     if (/^npm\s+(install|ci)\b/i.test(t)) {
      543:       return makeStep(lineNo, t, "npm 의존성 설치", "package.json 기준으로 JavaScript 프로젝트에 필요한 패키지를 설치합니다.", risk);
      544:     }
      545:     if (/^npm\s+run\b/i.test(t)) {
      546:       return makeStep(lineNo, t, "npm 스크립트 실행", "package.json의 scripts에 정의된 build, test 같은 명령을 실행합니다.", risk);
      547:     }
      548:     if (/^python\s+.*validate_lessons\.py\b/i.test(t)) {
      549:       return makeStep(lineNo, t, "Python 검증 실행", "학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다.", risk);
      550:     }
      551:     if (/^python\s+/.test(t)) {
      552:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 모듈을 실행합니다. 인자와 실행 위치를 확인해야 합니다.", risk);
      553:     }
      554:     if (/^git\s+status/i.test(t)) {
      555:       return makeStep(lineNo, t, "Git 변경 상태 확인", "현재 폴더에서 어떤 파일이 수정되었는지 확인합니다.", risk);

### src/pwa/code_explainer_rules.js:546

- patterns: return makeStep

      540:       return makeStep(lineNo, t, "Node 문법 검사", "JavaScript 파일을 실행하지 않고 문법 오류가 있는지만 검사합니다.", risk);
      541:     }
      542:     if (/^npm\s+(install|ci)\b/i.test(t)) {
      543:       return makeStep(lineNo, t, "npm 의존성 설치", "package.json 기준으로 JavaScript 프로젝트에 필요한 패키지를 설치합니다.", risk);
      544:     }
      545:     if (/^npm\s+run\b/i.test(t)) {
      546:       return makeStep(lineNo, t, "npm 스크립트 실행", "package.json의 scripts에 정의된 build, test 같은 명령을 실행합니다.", risk);
      547:     }
      548:     if (/^python\s+.*validate_lessons\.py\b/i.test(t)) {
      549:       return makeStep(lineNo, t, "Python 검증 실행", "학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다.", risk);
      550:     }
      551:     if (/^python\s+/.test(t)) {
      552:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 모듈을 실행합니다. 인자와 실행 위치를 확인해야 합니다.", risk);
      553:     }
      554:     if (/^git\s+status/i.test(t)) {
      555:       return makeStep(lineNo, t, "Git 변경 상태 확인", "현재 폴더에서 어떤 파일이 수정되었는지 확인합니다.", risk);
      556:     }
      557:     if (/^git\s+add/i.test(t)) {
      558:       return makeStep(lineNo, t, "Git 커밋 준비", "수정한 파일을 다음 커밋에 포함하도록 준비합니다. 아직 저장 기록이 만들어진 것은 아니고, 커밋 후보 목록에 올리는 단계입니다.", risk);

### src/pwa/code_explainer_rules.js:549

- patterns: return makeStep

      543:       return makeStep(lineNo, t, "npm 의존성 설치", "package.json 기준으로 JavaScript 프로젝트에 필요한 패키지를 설치합니다.", risk);
      544:     }
      545:     if (/^npm\s+run\b/i.test(t)) {
      546:       return makeStep(lineNo, t, "npm 스크립트 실행", "package.json의 scripts에 정의된 build, test 같은 명령을 실행합니다.", risk);
      547:     }
      548:     if (/^python\s+.*validate_lessons\.py\b/i.test(t)) {
      549:       return makeStep(lineNo, t, "Python 검증 실행", "학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다.", risk);
      550:     }
      551:     if (/^python\s+/.test(t)) {
      552:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 모듈을 실행합니다. 인자와 실행 위치를 확인해야 합니다.", risk);
      553:     }
      554:     if (/^git\s+status/i.test(t)) {
      555:       return makeStep(lineNo, t, "Git 변경 상태 확인", "현재 폴더에서 어떤 파일이 수정되었는지 확인합니다.", risk);
      556:     }
      557:     if (/^git\s+add/i.test(t)) {
      558:       return makeStep(lineNo, t, "Git 커밋 준비", "수정한 파일을 다음 커밋에 포함하도록 준비합니다. 아직 저장 기록이 만들어진 것은 아니고, 커밋 후보 목록에 올리는 단계입니다.", risk);
      559:     }
      560:     if (/^git\s+commit/i.test(t)) {
      561:       return makeStep(lineNo, t, "Git 커밋 생성", "준비된 변경사항을 하나의 기록으로 저장합니다. -m 뒤의 문장은 나중에 변경 이력을 볼 때 보이는 커밋 메시지입니다.", risk);

### src/pwa/code_explainer_rules.js:552

- patterns: return makeStep

      546:       return makeStep(lineNo, t, "npm 스크립트 실행", "package.json의 scripts에 정의된 build, test 같은 명령을 실행합니다.", risk);
      547:     }
      548:     if (/^python\s+.*validate_lessons\.py\b/i.test(t)) {
      549:       return makeStep(lineNo, t, "Python 검증 실행", "학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다.", risk);
      550:     }
      551:     if (/^python\s+/.test(t)) {
      552:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 모듈을 실행합니다. 인자와 실행 위치를 확인해야 합니다.", risk);
      553:     }
      554:     if (/^git\s+status/i.test(t)) {
      555:       return makeStep(lineNo, t, "Git 변경 상태 확인", "현재 폴더에서 어떤 파일이 수정되었는지 확인합니다.", risk);
      556:     }
      557:     if (/^git\s+add/i.test(t)) {
      558:       return makeStep(lineNo, t, "Git 커밋 준비", "수정한 파일을 다음 커밋에 포함하도록 준비합니다. 아직 저장 기록이 만들어진 것은 아니고, 커밋 후보 목록에 올리는 단계입니다.", risk);
      559:     }
      560:     if (/^git\s+commit/i.test(t)) {
      561:       return makeStep(lineNo, t, "Git 커밋 생성", "준비된 변경사항을 하나의 기록으로 저장합니다. -m 뒤의 문장은 나중에 변경 이력을 볼 때 보이는 커밋 메시지입니다.", risk);
      562:     }
      563:     if (/^git\s+tag/i.test(t)) {
      564:       return makeStep(lineNo, t, "Git 태그 생성", "현재 커밋에 버전 이름표를 붙입니다.", risk);

### src/pwa/code_explainer_rules.js:555

- patterns: return makeStep

      549:       return makeStep(lineNo, t, "Python 검증 실행", "학습 데이터와 앱 버전이 맞는지 검증 스크립트를 실행합니다.", risk);
      550:     }
      551:     if (/^python\s+/.test(t)) {
      552:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 모듈을 실행합니다. 인자와 실행 위치를 확인해야 합니다.", risk);
      553:     }
      554:     if (/^git\s+status/i.test(t)) {
      555:       return makeStep(lineNo, t, "Git 변경 상태 확인", "현재 폴더에서 어떤 파일이 수정되었는지 확인합니다.", risk);
      556:     }
      557:     if (/^git\s+add/i.test(t)) {
      558:       return makeStep(lineNo, t, "Git 커밋 준비", "수정한 파일을 다음 커밋에 포함하도록 준비합니다. 아직 저장 기록이 만들어진 것은 아니고, 커밋 후보 목록에 올리는 단계입니다.", risk);
      559:     }
      560:     if (/^git\s+commit/i.test(t)) {
      561:       return makeStep(lineNo, t, "Git 커밋 생성", "준비된 변경사항을 하나의 기록으로 저장합니다. -m 뒤의 문장은 나중에 변경 이력을 볼 때 보이는 커밋 메시지입니다.", risk);
      562:     }
      563:     if (/^git\s+tag/i.test(t)) {
      564:       return makeStep(lineNo, t, "Git 태그 생성", "현재 커밋에 버전 이름표를 붙입니다.", risk);
      565:     }
      566:     if (/^git\s+push/i.test(t)) {
      567:       return makeStep(lineNo, t, "원격 저장소로 업로드", "로컬 커밋이나 태그를 GitHub 같은 원격 저장소에 올립니다.", risk);

### src/pwa/code_explainer_rules.js:558

- patterns: return makeStep

      552:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 모듈을 실행합니다. 인자와 실행 위치를 확인해야 합니다.", risk);
      553:     }
      554:     if (/^git\s+status/i.test(t)) {
      555:       return makeStep(lineNo, t, "Git 변경 상태 확인", "현재 폴더에서 어떤 파일이 수정되었는지 확인합니다.", risk);
      556:     }
      557:     if (/^git\s+add/i.test(t)) {
      558:       return makeStep(lineNo, t, "Git 커밋 준비", "수정한 파일을 다음 커밋에 포함하도록 준비합니다. 아직 저장 기록이 만들어진 것은 아니고, 커밋 후보 목록에 올리는 단계입니다.", risk);
      559:     }
      560:     if (/^git\s+commit/i.test(t)) {
      561:       return makeStep(lineNo, t, "Git 커밋 생성", "준비된 변경사항을 하나의 기록으로 저장합니다. -m 뒤의 문장은 나중에 변경 이력을 볼 때 보이는 커밋 메시지입니다.", risk);
      562:     }
      563:     if (/^git\s+tag/i.test(t)) {
      564:       return makeStep(lineNo, t, "Git 태그 생성", "현재 커밋에 버전 이름표를 붙입니다.", risk);
      565:     }
      566:     if (/^git\s+push/i.test(t)) {
      567:       return makeStep(lineNo, t, "원격 저장소로 업로드", "로컬 커밋이나 태그를 GitHub 같은 원격 저장소에 올립니다.", risk);
      568:     }
      569:     if (/^git\s+stash/i.test(t)) {
      570:       return makeStep(lineNo, t, "임시 보관", "아직 커밋하지 않은 변경사항을 잠시 치워두고 작업 폴더를 깨끗하게 만듭니다. 나중에 stash pop/apply로 되돌릴 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:561

- patterns: return makeStep

      555:       return makeStep(lineNo, t, "Git 변경 상태 확인", "현재 폴더에서 어떤 파일이 수정되었는지 확인합니다.", risk);
      556:     }
      557:     if (/^git\s+add/i.test(t)) {
      558:       return makeStep(lineNo, t, "Git 커밋 준비", "수정한 파일을 다음 커밋에 포함하도록 준비합니다. 아직 저장 기록이 만들어진 것은 아니고, 커밋 후보 목록에 올리는 단계입니다.", risk);
      559:     }
      560:     if (/^git\s+commit/i.test(t)) {
      561:       return makeStep(lineNo, t, "Git 커밋 생성", "준비된 변경사항을 하나의 기록으로 저장합니다. -m 뒤의 문장은 나중에 변경 이력을 볼 때 보이는 커밋 메시지입니다.", risk);
      562:     }
      563:     if (/^git\s+tag/i.test(t)) {
      564:       return makeStep(lineNo, t, "Git 태그 생성", "현재 커밋에 버전 이름표를 붙입니다.", risk);
      565:     }
      566:     if (/^git\s+push/i.test(t)) {
      567:       return makeStep(lineNo, t, "원격 저장소로 업로드", "로컬 커밋이나 태그를 GitHub 같은 원격 저장소에 올립니다.", risk);
      568:     }
      569:     if (/^git\s+stash/i.test(t)) {
      570:       return makeStep(lineNo, t, "임시 보관", "아직 커밋하지 않은 변경사항을 잠시 치워두고 작업 폴더를 깨끗하게 만듭니다. 나중에 stash pop/apply로 되돌릴 수 있습니다.", risk);
      571:     }
      572:     if (/^git\s+diff\s+--stat/i.test(t)) {
      573:       return makeStep(lineNo, t, "변경량 요약 확인", "어떤 파일이 얼마나 바뀌었는지 줄 수 중심으로 요약해서 봅니다. 커밋 전 확인용으로 좋습니다.", risk);

### src/pwa/code_explainer_rules.js:564

- patterns: return makeStep

      558:       return makeStep(lineNo, t, "Git 커밋 준비", "수정한 파일을 다음 커밋에 포함하도록 준비합니다. 아직 저장 기록이 만들어진 것은 아니고, 커밋 후보 목록에 올리는 단계입니다.", risk);
      559:     }
      560:     if (/^git\s+commit/i.test(t)) {
      561:       return makeStep(lineNo, t, "Git 커밋 생성", "준비된 변경사항을 하나의 기록으로 저장합니다. -m 뒤의 문장은 나중에 변경 이력을 볼 때 보이는 커밋 메시지입니다.", risk);
      562:     }
      563:     if (/^git\s+tag/i.test(t)) {
      564:       return makeStep(lineNo, t, "Git 태그 생성", "현재 커밋에 버전 이름표를 붙입니다.", risk);
      565:     }
      566:     if (/^git\s+push/i.test(t)) {
      567:       return makeStep(lineNo, t, "원격 저장소로 업로드", "로컬 커밋이나 태그를 GitHub 같은 원격 저장소에 올립니다.", risk);
      568:     }
      569:     if (/^git\s+stash/i.test(t)) {
      570:       return makeStep(lineNo, t, "임시 보관", "아직 커밋하지 않은 변경사항을 잠시 치워두고 작업 폴더를 깨끗하게 만듭니다. 나중에 stash pop/apply로 되돌릴 수 있습니다.", risk);
      571:     }
      572:     if (/^git\s+diff\s+--stat/i.test(t)) {
      573:       return makeStep(lineNo, t, "변경량 요약 확인", "어떤 파일이 얼마나 바뀌었는지 줄 수 중심으로 요약해서 봅니다. 커밋 전 확인용으로 좋습니다.", risk);
      574:     }
      575:     if (/^git\s+diff\b/i.test(t)) {
      576:       return makeStep(lineNo, t, "변경 내용 확인", "커밋 전 실제 코드 변경 내용을 확인합니다.", risk);

### src/pwa/code_explainer_rules.js:567

- patterns: return makeStep

      561:       return makeStep(lineNo, t, "Git 커밋 생성", "준비된 변경사항을 하나의 기록으로 저장합니다. -m 뒤의 문장은 나중에 변경 이력을 볼 때 보이는 커밋 메시지입니다.", risk);
      562:     }
      563:     if (/^git\s+tag/i.test(t)) {
      564:       return makeStep(lineNo, t, "Git 태그 생성", "현재 커밋에 버전 이름표를 붙입니다.", risk);
      565:     }
      566:     if (/^git\s+push/i.test(t)) {
      567:       return makeStep(lineNo, t, "원격 저장소로 업로드", "로컬 커밋이나 태그를 GitHub 같은 원격 저장소에 올립니다.", risk);
      568:     }
      569:     if (/^git\s+stash/i.test(t)) {
      570:       return makeStep(lineNo, t, "임시 보관", "아직 커밋하지 않은 변경사항을 잠시 치워두고 작업 폴더를 깨끗하게 만듭니다. 나중에 stash pop/apply로 되돌릴 수 있습니다.", risk);
      571:     }
      572:     if (/^git\s+diff\s+--stat/i.test(t)) {
      573:       return makeStep(lineNo, t, "변경량 요약 확인", "어떤 파일이 얼마나 바뀌었는지 줄 수 중심으로 요약해서 봅니다. 커밋 전 확인용으로 좋습니다.", risk);
      574:     }
      575:     if (/^git\s+diff\b/i.test(t)) {
      576:       return makeStep(lineNo, t, "변경 내용 확인", "커밋 전 실제 코드 변경 내용을 확인합니다.", risk);
      577:     }
      578:     if (/^git\s+log\b/i.test(t)) {
      579:       return makeStep(lineNo, t, "커밋 기록 확인", "최근 커밋 목록과 태그/브랜치 위치를 확인합니다.", risk);

### src/pwa/code_explainer_rules.js:570

- patterns: return makeStep

      564:       return makeStep(lineNo, t, "Git 태그 생성", "현재 커밋에 버전 이름표를 붙입니다.", risk);
      565:     }
      566:     if (/^git\s+push/i.test(t)) {
      567:       return makeStep(lineNo, t, "원격 저장소로 업로드", "로컬 커밋이나 태그를 GitHub 같은 원격 저장소에 올립니다.", risk);
      568:     }
      569:     if (/^git\s+stash/i.test(t)) {
      570:       return makeStep(lineNo, t, "임시 보관", "아직 커밋하지 않은 변경사항을 잠시 치워두고 작업 폴더를 깨끗하게 만듭니다. 나중에 stash pop/apply로 되돌릴 수 있습니다.", risk);
      571:     }
      572:     if (/^git\s+diff\s+--stat/i.test(t)) {
      573:       return makeStep(lineNo, t, "변경량 요약 확인", "어떤 파일이 얼마나 바뀌었는지 줄 수 중심으로 요약해서 봅니다. 커밋 전 확인용으로 좋습니다.", risk);
      574:     }
      575:     if (/^git\s+diff\b/i.test(t)) {
      576:       return makeStep(lineNo, t, "변경 내용 확인", "커밋 전 실제 코드 변경 내용을 확인합니다.", risk);
      577:     }
      578:     if (/^git\s+log\b/i.test(t)) {
      579:       return makeStep(lineNo, t, "커밋 기록 확인", "최근 커밋 목록과 태그/브랜치 위치를 확인합니다.", risk);
      580:     }
      581:     if (/^git\s+reset\s+--hard/i.test(t)) {
      582:       return makeStep(lineNo, t, "변경사항 강제 되돌리기", "커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:573

- patterns: return makeStep

      567:       return makeStep(lineNo, t, "원격 저장소로 업로드", "로컬 커밋이나 태그를 GitHub 같은 원격 저장소에 올립니다.", risk);
      568:     }
      569:     if (/^git\s+stash/i.test(t)) {
      570:       return makeStep(lineNo, t, "임시 보관", "아직 커밋하지 않은 변경사항을 잠시 치워두고 작업 폴더를 깨끗하게 만듭니다. 나중에 stash pop/apply로 되돌릴 수 있습니다.", risk);
      571:     }
      572:     if (/^git\s+diff\s+--stat/i.test(t)) {
      573:       return makeStep(lineNo, t, "변경량 요약 확인", "어떤 파일이 얼마나 바뀌었는지 줄 수 중심으로 요약해서 봅니다. 커밋 전 확인용으로 좋습니다.", risk);
      574:     }
      575:     if (/^git\s+diff\b/i.test(t)) {
      576:       return makeStep(lineNo, t, "변경 내용 확인", "커밋 전 실제 코드 변경 내용을 확인합니다.", risk);
      577:     }
      578:     if (/^git\s+log\b/i.test(t)) {
      579:       return makeStep(lineNo, t, "커밋 기록 확인", "최근 커밋 목록과 태그/브랜치 위치를 확인합니다.", risk);
      580:     }
      581:     if (/^git\s+reset\s+--hard/i.test(t)) {
      582:       return makeStep(lineNo, t, "변경사항 강제 되돌리기", "커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다.", risk);
      583:     }
      584:     if (/^git\s+clean\s+-/i.test(t)) {
      585:       return makeStep(lineNo, t, "추적되지 않는 파일 삭제", "Git이 추적하지 않는 새 파일을 삭제합니다. 생성한 파일이 사라질 수 있으니 실행 전 목록 확인이 필요합니다.", risk);

### src/pwa/code_explainer_rules.js:576

- patterns: return makeStep

      570:       return makeStep(lineNo, t, "임시 보관", "아직 커밋하지 않은 변경사항을 잠시 치워두고 작업 폴더를 깨끗하게 만듭니다. 나중에 stash pop/apply로 되돌릴 수 있습니다.", risk);
      571:     }
      572:     if (/^git\s+diff\s+--stat/i.test(t)) {
      573:       return makeStep(lineNo, t, "변경량 요약 확인", "어떤 파일이 얼마나 바뀌었는지 줄 수 중심으로 요약해서 봅니다. 커밋 전 확인용으로 좋습니다.", risk);
      574:     }
      575:     if (/^git\s+diff\b/i.test(t)) {
      576:       return makeStep(lineNo, t, "변경 내용 확인", "커밋 전 실제 코드 변경 내용을 확인합니다.", risk);
      577:     }
      578:     if (/^git\s+log\b/i.test(t)) {
      579:       return makeStep(lineNo, t, "커밋 기록 확인", "최근 커밋 목록과 태그/브랜치 위치를 확인합니다.", risk);
      580:     }
      581:     if (/^git\s+reset\s+--hard/i.test(t)) {
      582:       return makeStep(lineNo, t, "변경사항 강제 되돌리기", "커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다.", risk);
      583:     }
      584:     if (/^git\s+clean\s+-/i.test(t)) {
      585:       return makeStep(lineNo, t, "추적되지 않는 파일 삭제", "Git이 추적하지 않는 새 파일을 삭제합니다. 생성한 파일이 사라질 수 있으니 실행 전 목록 확인이 필요합니다.", risk);
      586:     }
      587:     if (/^python\b/i.test(t)) {
      588:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 명령을 실행합니다.", risk);

### src/pwa/code_explainer_rules.js:579

- patterns: return makeStep

      573:       return makeStep(lineNo, t, "변경량 요약 확인", "어떤 파일이 얼마나 바뀌었는지 줄 수 중심으로 요약해서 봅니다. 커밋 전 확인용으로 좋습니다.", risk);
      574:     }
      575:     if (/^git\s+diff\b/i.test(t)) {
      576:       return makeStep(lineNo, t, "변경 내용 확인", "커밋 전 실제 코드 변경 내용을 확인합니다.", risk);
      577:     }
      578:     if (/^git\s+log\b/i.test(t)) {
      579:       return makeStep(lineNo, t, "커밋 기록 확인", "최근 커밋 목록과 태그/브랜치 위치를 확인합니다.", risk);
      580:     }
      581:     if (/^git\s+reset\s+--hard/i.test(t)) {
      582:       return makeStep(lineNo, t, "변경사항 강제 되돌리기", "커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다.", risk);
      583:     }
      584:     if (/^git\s+clean\s+-/i.test(t)) {
      585:       return makeStep(lineNo, t, "추적되지 않는 파일 삭제", "Git이 추적하지 않는 새 파일을 삭제합니다. 생성한 파일이 사라질 수 있으니 실행 전 목록 확인이 필요합니다.", risk);
      586:     }
      587:     if (/^python\b/i.test(t)) {
      588:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 명령을 실행합니다.", risk);
      589:     }
      590:     if (/^node\b/i.test(t)) {
      591:       return makeStep(lineNo, t, "Node.js 실행", "JavaScript 파일 검사나 실행을 합니다.", risk);

### src/pwa/code_explainer_rules.js:582

- patterns: return makeStep

      576:       return makeStep(lineNo, t, "변경 내용 확인", "커밋 전 실제 코드 변경 내용을 확인합니다.", risk);
      577:     }
      578:     if (/^git\s+log\b/i.test(t)) {
      579:       return makeStep(lineNo, t, "커밋 기록 확인", "최근 커밋 목록과 태그/브랜치 위치를 확인합니다.", risk);
      580:     }
      581:     if (/^git\s+reset\s+--hard/i.test(t)) {
      582:       return makeStep(lineNo, t, "변경사항 강제 되돌리기", "커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다.", risk);
      583:     }
      584:     if (/^git\s+clean\s+-/i.test(t)) {
      585:       return makeStep(lineNo, t, "추적되지 않는 파일 삭제", "Git이 추적하지 않는 새 파일을 삭제합니다. 생성한 파일이 사라질 수 있으니 실행 전 목록 확인이 필요합니다.", risk);
      586:     }
      587:     if (/^python\b/i.test(t)) {
      588:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 명령을 실행합니다.", risk);
      589:     }
      590:     if (/^node\b/i.test(t)) {
      591:       return makeStep(lineNo, t, "Node.js 실행", "JavaScript 파일 검사나 실행을 합니다.", risk);
      592:     }
      593:     if (/^npm\b/i.test(t)) {
      594:       return makeStep(lineNo, t, "npm 명령 실행", "JavaScript 프로젝트의 설치, 빌드, 실행 명령을 수행합니다.", risk);

### src/pwa/code_explainer_rules.js:585

- patterns: return makeStep

      579:       return makeStep(lineNo, t, "커밋 기록 확인", "최근 커밋 목록과 태그/브랜치 위치를 확인합니다.", risk);
      580:     }
      581:     if (/^git\s+reset\s+--hard/i.test(t)) {
      582:       return makeStep(lineNo, t, "변경사항 강제 되돌리기", "커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다.", risk);
      583:     }
      584:     if (/^git\s+clean\s+-/i.test(t)) {
      585:       return makeStep(lineNo, t, "추적되지 않는 파일 삭제", "Git이 추적하지 않는 새 파일을 삭제합니다. 생성한 파일이 사라질 수 있으니 실행 전 목록 확인이 필요합니다.", risk);
      586:     }
      587:     if (/^python\b/i.test(t)) {
      588:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 명령을 실행합니다.", risk);
      589:     }
      590:     if (/^node\b/i.test(t)) {
      591:       return makeStep(lineNo, t, "Node.js 실행", "JavaScript 파일 검사나 실행을 합니다.", risk);
      592:     }
      593:     if (/^npm\b/i.test(t)) {
      594:       return makeStep(lineNo, t, "npm 명령 실행", "JavaScript 프로젝트의 설치, 빌드, 실행 명령을 수행합니다.", risk);
      595:     }
      596:     if (/^Select-String\b/i.test(t)) {
      597:       return makeStep(lineNo, t, "파일에서 문자열 검색", "파일 안에서 특정 단어나 패턴이 있는 줄을 찾습니다.", risk);

### src/pwa/code_explainer_rules.js:588

- patterns: return makeStep

      582:       return makeStep(lineNo, t, "변경사항 강제 되돌리기", "커밋하지 않은 변경사항을 강제로 버립니다. 실행하면 복구가 어려울 수 있으니 매우 주의해야 합니다.", risk);
      583:     }
      584:     if (/^git\s+clean\s+-/i.test(t)) {
      585:       return makeStep(lineNo, t, "추적되지 않는 파일 삭제", "Git이 추적하지 않는 새 파일을 삭제합니다. 생성한 파일이 사라질 수 있으니 실행 전 목록 확인이 필요합니다.", risk);
      586:     }
      587:     if (/^python\b/i.test(t)) {
      588:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 명령을 실행합니다.", risk);
      589:     }
      590:     if (/^node\b/i.test(t)) {
      591:       return makeStep(lineNo, t, "Node.js 실행", "JavaScript 파일 검사나 실행을 합니다.", risk);
      592:     }
      593:     if (/^npm\b/i.test(t)) {
      594:       return makeStep(lineNo, t, "npm 명령 실행", "JavaScript 프로젝트의 설치, 빌드, 실행 명령을 수행합니다.", risk);
      595:     }
      596:     if (/^Select-String\b/i.test(t)) {
      597:       return makeStep(lineNo, t, "파일에서 문자열 검색", "파일 안에서 특정 단어나 패턴이 있는 줄을 찾습니다.", risk);
      598:     }
      599:     if (/^Set-Content\b/i.test(t)) {
      600:       return makeStep(lineNo, t, "파일 내용 쓰기", "지정한 파일에 텍스트를 저장합니다. 기존 파일 내용이 바뀔 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:591

- patterns: return makeStep

      585:       return makeStep(lineNo, t, "추적되지 않는 파일 삭제", "Git이 추적하지 않는 새 파일을 삭제합니다. 생성한 파일이 사라질 수 있으니 실행 전 목록 확인이 필요합니다.", risk);
      586:     }
      587:     if (/^python\b/i.test(t)) {
      588:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 명령을 실행합니다.", risk);
      589:     }
      590:     if (/^node\b/i.test(t)) {
      591:       return makeStep(lineNo, t, "Node.js 실행", "JavaScript 파일 검사나 실행을 합니다.", risk);
      592:     }
      593:     if (/^npm\b/i.test(t)) {
      594:       return makeStep(lineNo, t, "npm 명령 실행", "JavaScript 프로젝트의 설치, 빌드, 실행 명령을 수행합니다.", risk);
      595:     }
      596:     if (/^Select-String\b/i.test(t)) {
      597:       return makeStep(lineNo, t, "파일에서 문자열 검색", "파일 안에서 특정 단어나 패턴이 있는 줄을 찾습니다.", risk);
      598:     }
      599:     if (/^Set-Content\b/i.test(t)) {
      600:       return makeStep(lineNo, t, "파일 내용 쓰기", "지정한 파일에 텍스트를 저장합니다. 기존 파일 내용이 바뀔 수 있습니다.", risk);
      601:     }
      602:     if (/^Start-Job\b/i.test(t)) {
      603:       return makeStep(lineNo, t, "백그라운드 작업 시작", "명령을 별도 작업으로 실행해서 현재 콘솔을 계속 사용할 수 있게 합니다.", risk);

### src/pwa/code_explainer_rules.js:594

- patterns: return makeStep

      588:       return makeStep(lineNo, t, "Python 실행", "Python 스크립트나 명령을 실행합니다.", risk);
      589:     }
      590:     if (/^node\b/i.test(t)) {
      591:       return makeStep(lineNo, t, "Node.js 실행", "JavaScript 파일 검사나 실행을 합니다.", risk);
      592:     }
      593:     if (/^npm\b/i.test(t)) {
      594:       return makeStep(lineNo, t, "npm 명령 실행", "JavaScript 프로젝트의 설치, 빌드, 실행 명령을 수행합니다.", risk);
      595:     }
      596:     if (/^Select-String\b/i.test(t)) {
      597:       return makeStep(lineNo, t, "파일에서 문자열 검색", "파일 안에서 특정 단어나 패턴이 있는 줄을 찾습니다.", risk);
      598:     }
      599:     if (/^Set-Content\b/i.test(t)) {
      600:       return makeStep(lineNo, t, "파일 내용 쓰기", "지정한 파일에 텍스트를 저장합니다. 기존 파일 내용이 바뀔 수 있습니다.", risk);
      601:     }
      602:     if (/^Start-Job\b/i.test(t)) {
      603:       return makeStep(lineNo, t, "백그라운드 작업 시작", "명령을 별도 작업으로 실행해서 현재 콘솔을 계속 사용할 수 있게 합니다.", risk);
      604:     }
      605:     if (/^Stop-Job\b/i.test(t)) {
      606:       return makeStep(lineNo, t, "백그라운드 작업 중지", "실행 중인 백그라운드 작업을 멈춥니다.", risk);

### src/pwa/code_explainer_rules.js:597

- patterns: return makeStep

      591:       return makeStep(lineNo, t, "Node.js 실행", "JavaScript 파일 검사나 실행을 합니다.", risk);
      592:     }
      593:     if (/^npm\b/i.test(t)) {
      594:       return makeStep(lineNo, t, "npm 명령 실행", "JavaScript 프로젝트의 설치, 빌드, 실행 명령을 수행합니다.", risk);
      595:     }
      596:     if (/^Select-String\b/i.test(t)) {
      597:       return makeStep(lineNo, t, "파일에서 문자열 검색", "파일 안에서 특정 단어나 패턴이 있는 줄을 찾습니다.", risk);
      598:     }
      599:     if (/^Set-Content\b/i.test(t)) {
      600:       return makeStep(lineNo, t, "파일 내용 쓰기", "지정한 파일에 텍스트를 저장합니다. 기존 파일 내용이 바뀔 수 있습니다.", risk);
      601:     }
      602:     if (/^Start-Job\b/i.test(t)) {
      603:       return makeStep(lineNo, t, "백그라운드 작업 시작", "명령을 별도 작업으로 실행해서 현재 콘솔을 계속 사용할 수 있게 합니다.", risk);
      604:     }
      605:     if (/^Stop-Job\b/i.test(t)) {
      606:       return makeStep(lineNo, t, "백그라운드 작업 중지", "실행 중인 백그라운드 작업을 멈춥니다.", risk);
      607:     }
      608: 
      609:     // POWERSHELL_VERIFY_SCRIPT_RULES_V219_A1

### src/pwa/code_explainer_rules.js:600

- patterns: return makeStep

      594:       return makeStep(lineNo, t, "npm 명령 실행", "JavaScript 프로젝트의 설치, 빌드, 실행 명령을 수행합니다.", risk);
      595:     }
      596:     if (/^Select-String\b/i.test(t)) {
      597:       return makeStep(lineNo, t, "파일에서 문자열 검색", "파일 안에서 특정 단어나 패턴이 있는 줄을 찾습니다.", risk);
      598:     }
      599:     if (/^Set-Content\b/i.test(t)) {
      600:       return makeStep(lineNo, t, "파일 내용 쓰기", "지정한 파일에 텍스트를 저장합니다. 기존 파일 내용이 바뀔 수 있습니다.", risk);
      601:     }
      602:     if (/^Start-Job\b/i.test(t)) {
      603:       return makeStep(lineNo, t, "백그라운드 작업 시작", "명령을 별도 작업으로 실행해서 현재 콘솔을 계속 사용할 수 있게 합니다.", risk);
      604:     }
      605:     if (/^Stop-Job\b/i.test(t)) {
      606:       return makeStep(lineNo, t, "백그라운드 작업 중지", "실행 중인 백그라운드 작업을 멈춥니다.", risk);
      607:     }
      608: 
      609:     // POWERSHELL_VERIFY_SCRIPT_RULES_V219_A1
      610:     if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*,?$/.test(t)) {
      611:       return makeStep(lineNo, t, "입력 파라미터 선언", "param 블록 안에서 입력값의 타입과 이름을 선언합니다. 실행할 때 같은 이름의 옵션으로 값을 받을 수 있습니다.", risk);
      612:     }

### src/pwa/code_explainer_rules.js:603

- patterns: return makeStep

      597:       return makeStep(lineNo, t, "파일에서 문자열 검색", "파일 안에서 특정 단어나 패턴이 있는 줄을 찾습니다.", risk);
      598:     }
      599:     if (/^Set-Content\b/i.test(t)) {
      600:       return makeStep(lineNo, t, "파일 내용 쓰기", "지정한 파일에 텍스트를 저장합니다. 기존 파일 내용이 바뀔 수 있습니다.", risk);
      601:     }
      602:     if (/^Start-Job\b/i.test(t)) {
      603:       return makeStep(lineNo, t, "백그라운드 작업 시작", "명령을 별도 작업으로 실행해서 현재 콘솔을 계속 사용할 수 있게 합니다.", risk);
      604:     }
      605:     if (/^Stop-Job\b/i.test(t)) {
      606:       return makeStep(lineNo, t, "백그라운드 작업 중지", "실행 중인 백그라운드 작업을 멈춥니다.", risk);
      607:     }
      608: 
      609:     // POWERSHELL_VERIFY_SCRIPT_RULES_V219_A1
      610:     if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*,?$/.test(t)) {
      611:       return makeStep(lineNo, t, "입력 파라미터 선언", "param 블록 안에서 입력값의 타입과 이름을 선언합니다. 실행할 때 같은 이름의 옵션으로 값을 받을 수 있습니다.", risk);
      612:     }
      613:     if (/^&\s+\$[A-Za-z_][\w-]*/.test(t)) {
      614:       return makeStep(lineNo, t, "스크립트블록 실행", "변수에 담긴 PowerShell 스크립트블록을 실행합니다. 검증 단계나 콜백처럼 전달된 명령 묶음을 실행할 때 쓰입니다.", risk);
      615:     }

### src/pwa/code_explainer_rules.js:606

- patterns: return makeStep

      600:       return makeStep(lineNo, t, "파일 내용 쓰기", "지정한 파일에 텍스트를 저장합니다. 기존 파일 내용이 바뀔 수 있습니다.", risk);
      601:     }
      602:     if (/^Start-Job\b/i.test(t)) {
      603:       return makeStep(lineNo, t, "백그라운드 작업 시작", "명령을 별도 작업으로 실행해서 현재 콘솔을 계속 사용할 수 있게 합니다.", risk);
      604:     }
      605:     if (/^Stop-Job\b/i.test(t)) {
      606:       return makeStep(lineNo, t, "백그라운드 작업 중지", "실행 중인 백그라운드 작업을 멈춥니다.", risk);
      607:     }
      608: 
      609:     // POWERSHELL_VERIFY_SCRIPT_RULES_V219_A1
      610:     if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*,?$/.test(t)) {
      611:       return makeStep(lineNo, t, "입력 파라미터 선언", "param 블록 안에서 입력값의 타입과 이름을 선언합니다. 실행할 때 같은 이름의 옵션으로 값을 받을 수 있습니다.", risk);
      612:     }
      613:     if (/^&\s+\$[A-Za-z_][\w-]*/.test(t)) {
      614:       return makeStep(lineNo, t, "스크립트블록 실행", "변수에 담긴 PowerShell 스크립트블록을 실행합니다. 검증 단계나 콜백처럼 전달된 명령 묶음을 실행할 때 쓰입니다.", risk);
      615:     }
      616:     if (/^Invoke-Step\b/i.test(t)) {
      617:       return makeStep(lineNo, t, "검증 단계 실행", "이름을 붙인 검증 단계를 실행합니다. 중괄호 안의 명령 묶음을 실행하고 성공/실패를 단계별로 보여주는 흐름입니다.", risk);
      618:     }

### src/pwa/code_explainer_rules.js:611

- patterns: return makeStep

      605:     if (/^Stop-Job\b/i.test(t)) {
      606:       return makeStep(lineNo, t, "백그라운드 작업 중지", "실행 중인 백그라운드 작업을 멈춥니다.", risk);
      607:     }
      608: 
      609:     // POWERSHELL_VERIFY_SCRIPT_RULES_V219_A1
      610:     if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*,?$/.test(t)) {
      611:       return makeStep(lineNo, t, "입력 파라미터 선언", "param 블록 안에서 입력값의 타입과 이름을 선언합니다. 실행할 때 같은 이름의 옵션으로 값을 받을 수 있습니다.", risk);
      612:     }
      613:     if (/^&\s+\$[A-Za-z_][\w-]*/.test(t)) {
      614:       return makeStep(lineNo, t, "스크립트블록 실행", "변수에 담긴 PowerShell 스크립트블록을 실행합니다. 검증 단계나 콜백처럼 전달된 명령 묶음을 실행할 때 쓰입니다.", risk);
      615:     }
      616:     if (/^Invoke-Step\b/i.test(t)) {
      617:       return makeStep(lineNo, t, "검증 단계 실행", "이름을 붙인 검증 단계를 실행합니다. 중괄호 안의 명령 묶음을 실행하고 성공/실패를 단계별로 보여주는 흐름입니다.", risk);
      618:     }
      619:     if (/^Assert-Contains\b/i.test(t)) {
      620:       return makeStep(lineNo, t, "문자열 포함 검증", "파일이나 텍스트 안에 기대한 문자열이 들어 있는지 확인합니다. 버전, 마커, 샘플 이름 검증에 자주 쓰입니다.", risk);
      621:     }
      622:     if (/^["'][^"']*["'],?$/.test(t)) {
      623:       return makeStep(lineNo, t, "문자열 데이터 항목", "배열이나 목록 안에 들어 있는 문자열 값입니다. URL, 파일 경로, 버전 붙은 리소스 주소처럼 데이터로 쓰일 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:614

- patterns: return makeStep

      608: 
      609:     // POWERSHELL_VERIFY_SCRIPT_RULES_V219_A1
      610:     if (/^\[[A-Za-z_][\w.\[\]]*\]\$[A-Za-z_][\w-]*,?$/.test(t)) {
      611:       return makeStep(lineNo, t, "입력 파라미터 선언", "param 블록 안에서 입력값의 타입과 이름을 선언합니다. 실행할 때 같은 이름의 옵션으로 값을 받을 수 있습니다.", risk);
      612:     }
      613:     if (/^&\s+\$[A-Za-z_][\w-]*/.test(t)) {
      614:       return makeStep(lineNo, t, "스크립트블록 실행", "변수에 담긴 PowerShell 스크립트블록을 실행합니다. 검증 단계나 콜백처럼 전달된 명령 묶음을 실행할 때 쓰입니다.", risk);
      615:     }
      616:     if (/^Invoke-Step\b/i.test(t)) {
      617:       return makeStep(lineNo, t, "검증 단계 실행", "이름을 붙인 검증 단계를 실행합니다. 중괄호 안의 명령 묶음을 실행하고 성공/실패를 단계별로 보여주는 흐름입니다.", risk);
      618:     }
      619:     if (/^Assert-Contains\b/i.test(t)) {
      620:       return makeStep(lineNo, t, "문자열 포함 검증", "파일이나 텍스트 안에 기대한 문자열이 들어 있는지 확인합니다. 버전, 마커, 샘플 이름 검증에 자주 쓰입니다.", risk);
      621:     }
      622:     if (/^["'][^"']*["'],?$/.test(t)) {
      623:       return makeStep(lineNo, t, "문자열 데이터 항목", "배열이나 목록 안에 들어 있는 문자열 값입니다. URL, 파일 경로, 버전 붙은 리소스 주소처럼 데이터로 쓰일 수 있습니다.", risk);
      624:     }
      625: 
      626:     if (/^Start-Sleep\b/i.test(t)) {

### src/pwa/code_explainer_rules.js:617

- patterns: return makeStep

      611:       return makeStep(lineNo, t, "입력 파라미터 선언", "param 블록 안에서 입력값의 타입과 이름을 선언합니다. 실행할 때 같은 이름의 옵션으로 값을 받을 수 있습니다.", risk);
      612:     }
      613:     if (/^&\s+\$[A-Za-z_][\w-]*/.test(t)) {
      614:       return makeStep(lineNo, t, "스크립트블록 실행", "변수에 담긴 PowerShell 스크립트블록을 실행합니다. 검증 단계나 콜백처럼 전달된 명령 묶음을 실행할 때 쓰입니다.", risk);
      615:     }
      616:     if (/^Invoke-Step\b/i.test(t)) {
      617:       return makeStep(lineNo, t, "검증 단계 실행", "이름을 붙인 검증 단계를 실행합니다. 중괄호 안의 명령 묶음을 실행하고 성공/실패를 단계별로 보여주는 흐름입니다.", risk);
      618:     }
      619:     if (/^Assert-Contains\b/i.test(t)) {
      620:       return makeStep(lineNo, t, "문자열 포함 검증", "파일이나 텍스트 안에 기대한 문자열이 들어 있는지 확인합니다. 버전, 마커, 샘플 이름 검증에 자주 쓰입니다.", risk);
      621:     }
      622:     if (/^["'][^"']*["'],?$/.test(t)) {
      623:       return makeStep(lineNo, t, "문자열 데이터 항목", "배열이나 목록 안에 들어 있는 문자열 값입니다. URL, 파일 경로, 버전 붙은 리소스 주소처럼 데이터로 쓰일 수 있습니다.", risk);
      624:     }
      625: 
      626:     if (/^Start-Sleep\b/i.test(t)) {
      627:       return makeStep(lineNo, t, "잠시 대기", "다음 명령을 바로 실행하지 않고 지정한 시간만큼 기다립니다. 배포 반영이나 서버 준비를 기다릴 때 씁니다.", risk);
      628:     }
      629:     if (/^Write-Host\b/i.test(t)) {

### src/pwa/code_explainer_rules.js:620

- patterns: return makeStep

      614:       return makeStep(lineNo, t, "스크립트블록 실행", "변수에 담긴 PowerShell 스크립트블록을 실행합니다. 검증 단계나 콜백처럼 전달된 명령 묶음을 실행할 때 쓰입니다.", risk);
      615:     }
      616:     if (/^Invoke-Step\b/i.test(t)) {
      617:       return makeStep(lineNo, t, "검증 단계 실행", "이름을 붙인 검증 단계를 실행합니다. 중괄호 안의 명령 묶음을 실행하고 성공/실패를 단계별로 보여주는 흐름입니다.", risk);
      618:     }
      619:     if (/^Assert-Contains\b/i.test(t)) {
      620:       return makeStep(lineNo, t, "문자열 포함 검증", "파일이나 텍스트 안에 기대한 문자열이 들어 있는지 확인합니다. 버전, 마커, 샘플 이름 검증에 자주 쓰입니다.", risk);
      621:     }
      622:     if (/^["'][^"']*["'],?$/.test(t)) {
      623:       return makeStep(lineNo, t, "문자열 데이터 항목", "배열이나 목록 안에 들어 있는 문자열 값입니다. URL, 파일 경로, 버전 붙은 리소스 주소처럼 데이터로 쓰일 수 있습니다.", risk);
      624:     }
      625: 
      626:     if (/^Start-Sleep\b/i.test(t)) {
      627:       return makeStep(lineNo, t, "잠시 대기", "다음 명령을 바로 실행하지 않고 지정한 시간만큼 기다립니다. 배포 반영이나 서버 준비를 기다릴 때 씁니다.", risk);
      628:     }
      629:     if (/^Write-Host\b/i.test(t)) {
      630:       return makeStep(lineNo, t, "콘솔에 메시지 출력", "진행 상태나 결과를 PowerShell 화면에 보여줍니다.", risk);
      631:     }
      632:     if (/^Unblock-File\b/i.test(t)) {

### src/pwa/code_explainer_rules.js:623

- patterns: return makeStep

      617:       return makeStep(lineNo, t, "검증 단계 실행", "이름을 붙인 검증 단계를 실행합니다. 중괄호 안의 명령 묶음을 실행하고 성공/실패를 단계별로 보여주는 흐름입니다.", risk);
      618:     }
      619:     if (/^Assert-Contains\b/i.test(t)) {
      620:       return makeStep(lineNo, t, "문자열 포함 검증", "파일이나 텍스트 안에 기대한 문자열이 들어 있는지 확인합니다. 버전, 마커, 샘플 이름 검증에 자주 쓰입니다.", risk);
      621:     }
      622:     if (/^["'][^"']*["'],?$/.test(t)) {
      623:       return makeStep(lineNo, t, "문자열 데이터 항목", "배열이나 목록 안에 들어 있는 문자열 값입니다. URL, 파일 경로, 버전 붙은 리소스 주소처럼 데이터로 쓰일 수 있습니다.", risk);
      624:     }
      625: 
      626:     if (/^Start-Sleep\b/i.test(t)) {
      627:       return makeStep(lineNo, t, "잠시 대기", "다음 명령을 바로 실행하지 않고 지정한 시간만큼 기다립니다. 배포 반영이나 서버 준비를 기다릴 때 씁니다.", risk);
      628:     }
      629:     if (/^Write-Host\b/i.test(t)) {
      630:       return makeStep(lineNo, t, "콘솔에 메시지 출력", "진행 상태나 결과를 PowerShell 화면에 보여줍니다.", risk);
      631:     }
      632:     if (/^Unblock-File\b/i.test(t)) {
      633:       return makeStep(lineNo, t, "파일 차단 해제", "인터넷에서 받은 스크립트 파일의 실행 차단 표시를 해제합니다. 신뢰할 수 있는 파일인지 먼저 확인해야 합니다.", risk);
      634:     }
      635:     if (/^Set-ExecutionPolicy\b/i.test(t)) {

### src/pwa/code_explainer_rules.js:627

- patterns: return makeStep

      621:     }
      622:     if (/^["'][^"']*["'],?$/.test(t)) {
      623:       return makeStep(lineNo, t, "문자열 데이터 항목", "배열이나 목록 안에 들어 있는 문자열 값입니다. URL, 파일 경로, 버전 붙은 리소스 주소처럼 데이터로 쓰일 수 있습니다.", risk);
      624:     }
      625: 
      626:     if (/^Start-Sleep\b/i.test(t)) {
      627:       return makeStep(lineNo, t, "잠시 대기", "다음 명령을 바로 실행하지 않고 지정한 시간만큼 기다립니다. 배포 반영이나 서버 준비를 기다릴 때 씁니다.", risk);
      628:     }
      629:     if (/^Write-Host\b/i.test(t)) {
      630:       return makeStep(lineNo, t, "콘솔에 메시지 출력", "진행 상태나 결과를 PowerShell 화면에 보여줍니다.", risk);
      631:     }
      632:     if (/^Unblock-File\b/i.test(t)) {
      633:       return makeStep(lineNo, t, "파일 차단 해제", "인터넷에서 받은 스크립트 파일의 실행 차단 표시를 해제합니다. 신뢰할 수 있는 파일인지 먼저 확인해야 합니다.", risk);
      634:     }
      635:     if (/^Set-ExecutionPolicy\b/i.test(t)) {
      636:       return makeStep(lineNo, t, "스크립트 실행 정책 변경", "PowerShell 스크립트 실행 제한을 바꿉니다. 보안에 영향을 줄 수 있어 범위와 정책값을 확인해야 합니다.", risk);
      637:     }
      638:     if (/^Invoke-WebRequest\b/i.test(t) || /^curl\b/i.test(t)) {
      639:       return makeStep(lineNo, t, "웹 요청 실행", "URL에 요청을 보내 파일이나 응답을 가져옵니다. 주소와 저장 위치, 인증값 포함 여부를 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:630

- patterns: return makeStep

      624:     }
      625: 
      626:     if (/^Start-Sleep\b/i.test(t)) {
      627:       return makeStep(lineNo, t, "잠시 대기", "다음 명령을 바로 실행하지 않고 지정한 시간만큼 기다립니다. 배포 반영이나 서버 준비를 기다릴 때 씁니다.", risk);
      628:     }
      629:     if (/^Write-Host\b/i.test(t)) {
      630:       return makeStep(lineNo, t, "콘솔에 메시지 출력", "진행 상태나 결과를 PowerShell 화면에 보여줍니다.", risk);
      631:     }
      632:     if (/^Unblock-File\b/i.test(t)) {
      633:       return makeStep(lineNo, t, "파일 차단 해제", "인터넷에서 받은 스크립트 파일의 실행 차단 표시를 해제합니다. 신뢰할 수 있는 파일인지 먼저 확인해야 합니다.", risk);
      634:     }
      635:     if (/^Set-ExecutionPolicy\b/i.test(t)) {
      636:       return makeStep(lineNo, t, "스크립트 실행 정책 변경", "PowerShell 스크립트 실행 제한을 바꿉니다. 보안에 영향을 줄 수 있어 범위와 정책값을 확인해야 합니다.", risk);
      637:     }
      638:     if (/^Invoke-WebRequest\b/i.test(t) || /^curl\b/i.test(t)) {
      639:       return makeStep(lineNo, t, "웹 요청 실행", "URL에 요청을 보내 파일이나 응답을 가져옵니다. 주소와 저장 위치, 인증값 포함 여부를 확인해야 합니다.", risk);
      640:     }
      641:     if (/^(npx\s+)?wrangler\b/i.test(t)) {
      642:       return makeStep(lineNo, t, "Cloudflare Wrangler 실행", "Cloudflare Workers, Pages, D1, R2 같은 리소스를 배포하거나 조회하는 명령입니다. 원격 리소스가 바뀔 수 있습니다.", risk);

### src/pwa/code_explainer_rules.js:633

- patterns: return makeStep

      627:       return makeStep(lineNo, t, "잠시 대기", "다음 명령을 바로 실행하지 않고 지정한 시간만큼 기다립니다. 배포 반영이나 서버 준비를 기다릴 때 씁니다.", risk);
      628:     }
      629:     if (/^Write-Host\b/i.test(t)) {
      630:       return makeStep(lineNo, t, "콘솔에 메시지 출력", "진행 상태나 결과를 PowerShell 화면에 보여줍니다.", risk);
      631:     }
      632:     if (/^Unblock-File\b/i.test(t)) {
      633:       return makeStep(lineNo, t, "파일 차단 해제", "인터넷에서 받은 스크립트 파일의 실행 차단 표시를 해제합니다. 신뢰할 수 있는 파일인지 먼저 확인해야 합니다.", risk);
      634:     }
      635:     if (/^Set-ExecutionPolicy\b/i.test(t)) {
      636:       return makeStep(lineNo, t, "스크립트 실행 정책 변경", "PowerShell 스크립트 실행 제한을 바꿉니다. 보안에 영향을 줄 수 있어 범위와 정책값을 확인해야 합니다.", risk);
      637:     }
      638:     if (/^Invoke-WebRequest\b/i.test(t) || /^curl\b/i.test(t)) {
      639:       return makeStep(lineNo, t, "웹 요청 실행", "URL에 요청을 보내 파일이나 응답을 가져옵니다. 주소와 저장 위치, 인증값 포함 여부를 확인해야 합니다.", risk);
      640:     }
      641:     if (/^(npx\s+)?wrangler\b/i.test(t)) {
      642:       return makeStep(lineNo, t, "Cloudflare Wrangler 실행", "Cloudflare Workers, Pages, D1, R2 같은 리소스를 배포하거나 조회하는 명령입니다. 원격 리소스가 바뀔 수 있습니다.", risk);
      643:     }
      644:     if (/^try\s*\{/i.test(t)) {
      645:       return makeStep(lineNo, t, "오류 대비 시작", "이 안의 명령을 실행하다가 오류가 나면 catch 블록에서 처리할 수 있게 준비합니다.", risk);

### src/pwa/code_explainer_rules.js:636

- patterns: return makeStep

      630:       return makeStep(lineNo, t, "콘솔에 메시지 출력", "진행 상태나 결과를 PowerShell 화면에 보여줍니다.", risk);
      631:     }
      632:     if (/^Unblock-File\b/i.test(t)) {
      633:       return makeStep(lineNo, t, "파일 차단 해제", "인터넷에서 받은 스크립트 파일의 실행 차단 표시를 해제합니다. 신뢰할 수 있는 파일인지 먼저 확인해야 합니다.", risk);
      634:     }
      635:     if (/^Set-ExecutionPolicy\b/i.test(t)) {
      636:       return makeStep(lineNo, t, "스크립트 실행 정책 변경", "PowerShell 스크립트 실행 제한을 바꿉니다. 보안에 영향을 줄 수 있어 범위와 정책값을 확인해야 합니다.", risk);
      637:     }
      638:     if (/^Invoke-WebRequest\b/i.test(t) || /^curl\b/i.test(t)) {
      639:       return makeStep(lineNo, t, "웹 요청 실행", "URL에 요청을 보내 파일이나 응답을 가져옵니다. 주소와 저장 위치, 인증값 포함 여부를 확인해야 합니다.", risk);
      640:     }
      641:     if (/^(npx\s+)?wrangler\b/i.test(t)) {
      642:       return makeStep(lineNo, t, "Cloudflare Wrangler 실행", "Cloudflare Workers, Pages, D1, R2 같은 리소스를 배포하거나 조회하는 명령입니다. 원격 리소스가 바뀔 수 있습니다.", risk);
      643:     }
      644:     if (/^try\s*\{/i.test(t)) {
      645:       return makeStep(lineNo, t, "오류 대비 시작", "이 안의 명령을 실행하다가 오류가 나면 catch 블록에서 처리할 수 있게 준비합니다.", risk);
      646:     }
      647:     if (/^\}?\s*catch\s*\{/i.test(t)) {
      648:       return makeStep(lineNo, t, "오류 처리", "try 안에서 실패한 경우 이 블록으로 넘어와 실패 메시지나 대체 동작을 처리합니다.", risk);

### src/pwa/code_explainer_rules.js:639

- patterns: return makeStep

      633:       return makeStep(lineNo, t, "파일 차단 해제", "인터넷에서 받은 스크립트 파일의 실행 차단 표시를 해제합니다. 신뢰할 수 있는 파일인지 먼저 확인해야 합니다.", risk);
      634:     }
      635:     if (/^Set-ExecutionPolicy\b/i.test(t)) {
      636:       return makeStep(lineNo, t, "스크립트 실행 정책 변경", "PowerShell 스크립트 실행 제한을 바꿉니다. 보안에 영향을 줄 수 있어 범위와 정책값을 확인해야 합니다.", risk);
      637:     }
      638:     if (/^Invoke-WebRequest\b/i.test(t) || /^curl\b/i.test(t)) {
      639:       return makeStep(lineNo, t, "웹 요청 실행", "URL에 요청을 보내 파일이나 응답을 가져옵니다. 주소와 저장 위치, 인증값 포함 여부를 확인해야 합니다.", risk);
      640:     }
      641:     if (/^(npx\s+)?wrangler\b/i.test(t)) {
      642:       return makeStep(lineNo, t, "Cloudflare Wrangler 실행", "Cloudflare Workers, Pages, D1, R2 같은 리소스를 배포하거나 조회하는 명령입니다. 원격 리소스가 바뀔 수 있습니다.", risk);
      643:     }
      644:     if (/^try\s*\{/i.test(t)) {
      645:       return makeStep(lineNo, t, "오류 대비 시작", "이 안의 명령을 실행하다가 오류가 나면 catch 블록에서 처리할 수 있게 준비합니다.", risk);
      646:     }
      647:     if (/^\}?\s*catch\s*\{/i.test(t)) {
      648:       return makeStep(lineNo, t, "오류 처리", "try 안에서 실패한 경우 이 블록으로 넘어와 실패 메시지나 대체 동작을 처리합니다.", risk);
      649:     }
      650: 
      651:     // POWERSHELL_CSV_PIPELINE_DIRECT_V215_A1

### src/pwa/code_explainer_rules.js:642

- patterns: return makeStep

      636:       return makeStep(lineNo, t, "스크립트 실행 정책 변경", "PowerShell 스크립트 실행 제한을 바꿉니다. 보안에 영향을 줄 수 있어 범위와 정책값을 확인해야 합니다.", risk);
      637:     }
      638:     if (/^Invoke-WebRequest\b/i.test(t) || /^curl\b/i.test(t)) {
      639:       return makeStep(lineNo, t, "웹 요청 실행", "URL에 요청을 보내 파일이나 응답을 가져옵니다. 주소와 저장 위치, 인증값 포함 여부를 확인해야 합니다.", risk);
      640:     }
      641:     if (/^(npx\s+)?wrangler\b/i.test(t)) {
      642:       return makeStep(lineNo, t, "Cloudflare Wrangler 실행", "Cloudflare Workers, Pages, D1, R2 같은 리소스를 배포하거나 조회하는 명령입니다. 원격 리소스가 바뀔 수 있습니다.", risk);
      643:     }
      644:     if (/^try\s*\{/i.test(t)) {
      645:       return makeStep(lineNo, t, "오류 대비 시작", "이 안의 명령을 실행하다가 오류가 나면 catch 블록에서 처리할 수 있게 준비합니다.", risk);
      646:     }
      647:     if (/^\}?\s*catch\s*\{/i.test(t)) {
      648:       return makeStep(lineNo, t, "오류 처리", "try 안에서 실패한 경우 이 블록으로 넘어와 실패 메시지나 대체 동작을 처리합니다.", risk);
      649:     }
      650: 
      651:     // POWERSHELL_CSV_PIPELINE_DIRECT_V215_A1
      652:     if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t)) {
      653:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      654:     }

### src/pwa/code_explainer_rules.js:645

- patterns: return makeStep

      639:       return makeStep(lineNo, t, "웹 요청 실행", "URL에 요청을 보내 파일이나 응답을 가져옵니다. 주소와 저장 위치, 인증값 포함 여부를 확인해야 합니다.", risk);
      640:     }
      641:     if (/^(npx\s+)?wrangler\b/i.test(t)) {
      642:       return makeStep(lineNo, t, "Cloudflare Wrangler 실행", "Cloudflare Workers, Pages, D1, R2 같은 리소스를 배포하거나 조회하는 명령입니다. 원격 리소스가 바뀔 수 있습니다.", risk);
      643:     }
      644:     if (/^try\s*\{/i.test(t)) {
      645:       return makeStep(lineNo, t, "오류 대비 시작", "이 안의 명령을 실행하다가 오류가 나면 catch 블록에서 처리할 수 있게 준비합니다.", risk);
      646:     }
      647:     if (/^\}?\s*catch\s*\{/i.test(t)) {
      648:       return makeStep(lineNo, t, "오류 처리", "try 안에서 실패한 경우 이 블록으로 넘어와 실패 메시지나 대체 동작을 처리합니다.", risk);
      649:     }
      650: 
      651:     // POWERSHELL_CSV_PIPELINE_DIRECT_V215_A1
      652:     if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t)) {
      653:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      654:     }
      655:     if (/\|\s*Out-Null/i.test(t)) {
      656:       return makeStep(lineNo, t, "출력 숨기기", "명령 결과를 화면에 표시하지 않고 버립니다. 실제 작업은 실행되지만 출력만 숨겨집니다.", risk);
      657:     }

### src/pwa/code_explainer_rules.js:648

- patterns: return makeStep

      642:       return makeStep(lineNo, t, "Cloudflare Wrangler 실행", "Cloudflare Workers, Pages, D1, R2 같은 리소스를 배포하거나 조회하는 명령입니다. 원격 리소스가 바뀔 수 있습니다.", risk);
      643:     }
      644:     if (/^try\s*\{/i.test(t)) {
      645:       return makeStep(lineNo, t, "오류 대비 시작", "이 안의 명령을 실행하다가 오류가 나면 catch 블록에서 처리할 수 있게 준비합니다.", risk);
      646:     }
      647:     if (/^\}?\s*catch\s*\{/i.test(t)) {
      648:       return makeStep(lineNo, t, "오류 처리", "try 안에서 실패한 경우 이 블록으로 넘어와 실패 메시지나 대체 동작을 처리합니다.", risk);
      649:     }
      650: 
      651:     // POWERSHELL_CSV_PIPELINE_DIRECT_V215_A1
      652:     if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t)) {
      653:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      654:     }
      655:     if (/\|\s*Out-Null/i.test(t)) {
      656:       return makeStep(lineNo, t, "출력 숨기기", "명령 결과를 화면에 표시하지 않고 버립니다. 실제 작업은 실행되지만 출력만 숨겨집니다.", risk);
      657:     }
      658:     if (/\|\s*Format-Table\b/i.test(t)) {
      659:       return makeStep(lineNo, t, "표 형태로 출력", "파이프라인 결과를 표 형태로 화면에 보여줍니다. 검증 리포트나 요약 데이터를 읽기 좋게 표시할 때 씁니다.", risk);
      660:     }

### src/pwa/code_explainer_rules.js:653

- patterns: return makeStep

      647:     if (/^\}?\s*catch\s*\{/i.test(t)) {
      648:       return makeStep(lineNo, t, "오류 처리", "try 안에서 실패한 경우 이 블록으로 넘어와 실패 메시지나 대체 동작을 처리합니다.", risk);
      649:     }
      650: 
      651:     // POWERSHELL_CSV_PIPELINE_DIRECT_V215_A1
      652:     if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t)) {
      653:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      654:     }
      655:     if (/\|\s*Out-Null/i.test(t)) {
      656:       return makeStep(lineNo, t, "출력 숨기기", "명령 결과를 화면에 표시하지 않고 버립니다. 실제 작업은 실행되지만 출력만 숨겨집니다.", risk);
      657:     }
      658:     if (/\|\s*Format-Table\b/i.test(t)) {
      659:       return makeStep(lineNo, t, "표 형태로 출력", "파이프라인 결과를 표 형태로 화면에 보여줍니다. 검증 리포트나 요약 데이터를 읽기 좋게 표시할 때 씁니다.", risk);
      660:     }
      661: 
      662:     return makeStep(lineNo, t, "명령 실행", "이 줄은 PowerShell 명령입니다. 자동 규칙에 없는 명령이므로 원문, 경로, 옵션을 확인한 뒤 실행해야 합니다.", risk);
      663:   }
      664: 
      665:   function explainPythonLine(line, lineNo) {

### src/pwa/code_explainer_rules.js:656

- patterns: return makeStep

      650: 
      651:     // POWERSHELL_CSV_PIPELINE_DIRECT_V215_A1
      652:     if (/\|\s*(Group-Object|Sort-Object|Select-Object|Export-Csv)\b/i.test(t)) {
      653:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      654:     }
      655:     if (/\|\s*Out-Null/i.test(t)) {
      656:       return makeStep(lineNo, t, "출력 숨기기", "명령 결과를 화면에 표시하지 않고 버립니다. 실제 작업은 실행되지만 출력만 숨겨집니다.", risk);
      657:     }
      658:     if (/\|\s*Format-Table\b/i.test(t)) {
      659:       return makeStep(lineNo, t, "표 형태로 출력", "파이프라인 결과를 표 형태로 화면에 보여줍니다. 검증 리포트나 요약 데이터를 읽기 좋게 표시할 때 씁니다.", risk);
      660:     }
      661: 
      662:     return makeStep(lineNo, t, "명령 실행", "이 줄은 PowerShell 명령입니다. 자동 규칙에 없는 명령이므로 원문, 경로, 옵션을 확인한 뒤 실행해야 합니다.", risk);
      663:   }
      664: 
      665:   function explainPythonLine(line, lineNo) {
      666:     const t = cleanLine(line);
      667:     const risk = riskOf(t, "python");
      668: 

### src/pwa/code_explainer_rules.js:659

- patterns: return makeStep

      653:       return makeStep(lineNo, t, "CSV 그룹 정렬 선택 저장", "파이프라인으로 넘어온 CSV/객체 데이터를 그룹으로 묶고, 정렬하고, 필요한 열을 선택한 뒤 저장하는 흐름입니다. Group-Object, Sort-Object, Select-Object, Export-Csv 순서를 확인해야 합니다.", risk);
      654:     }
      655:     if (/\|\s*Out-Null/i.test(t)) {
      656:       return makeStep(lineNo, t, "출력 숨기기", "명령 결과를 화면에 표시하지 않고 버립니다. 실제 작업은 실행되지만 출력만 숨겨집니다.", risk);
      657:     }
      658:     if (/\|\s*Format-Table\b/i.test(t)) {
      659:       return makeStep(lineNo, t, "표 형태로 출력", "파이프라인 결과를 표 형태로 화면에 보여줍니다. 검증 리포트나 요약 데이터를 읽기 좋게 표시할 때 씁니다.", risk);
      660:     }
      661: 
      662:     return makeStep(lineNo, t, "명령 실행", "이 줄은 PowerShell 명령입니다. 자동 규칙에 없는 명령이므로 원문, 경로, 옵션을 확인한 뒤 실행해야 합니다.", risk);
      663:   }
      664: 
      665:   function explainPythonLine(line, lineNo) {
      666:     const t = cleanLine(line);
      667:     const risk = riskOf(t, "python");
      668: 
      669:     // PYTHON_FLASK_ROUTE_DECORATOR_RULE_V330_A6
      670:     if (/^@[A-Za-z_][\w.]*\.route\s*\(/.test(t)) {
      671:       return makeStep(lineNo, t, "Flask 라우트 등록", "Flask 앱에서 특정 URL 경로로 들어온 요청을 바로 아래 함수에 연결합니다. 괄호 안의 경로와 methods 옵션을 확인합니다.", risk);

### src/pwa/code_explainer_rules.js:662

- patterns: return makeStep

      656:       return makeStep(lineNo, t, "출력 숨기기", "명령 결과를 화면에 표시하지 않고 버립니다. 실제 작업은 실행되지만 출력만 숨겨집니다.", risk);
      657:     }
      658:     if (/\|\s*Format-Table\b/i.test(t)) {
      659:       return makeStep(lineNo, t, "표 형태로 출력", "파이프라인 결과를 표 형태로 화면에 보여줍니다. 검증 리포트나 요약 데이터를 읽기 좋게 표시할 때 씁니다.", risk);
      660:     }
      661: 
      662:     return makeStep(lineNo, t, "명령 실행", "이 줄은 PowerShell 명령입니다. 자동 규칙에 없는 명령이므로 원문, 경로, 옵션을 확인한 뒤 실행해야 합니다.", risk);
      663:   }
      664: 
      665:   function explainPythonLine(line, lineNo) {
      666:     const t = cleanLine(line);
      667:     const risk = riskOf(t, "python");
      668: 
      669:     // PYTHON_FLASK_ROUTE_DECORATOR_RULE_V330_A6
      670:     if (/^@[A-Za-z_][\w.]*\.route\s*\(/.test(t)) {
      671:       return makeStep(lineNo, t, "Flask 라우트 등록", "Flask 앱에서 특정 URL 경로로 들어온 요청을 바로 아래 함수에 연결합니다. 괄호 안의 경로와 methods 옵션을 확인합니다.", risk);
      672:     }
      673: 
      674:     // FASTAPI_IMPORT_RULES_V230_A1

### src/pwa/code_explainer_rules.js:671

- patterns: return makeStep

      665:   function explainPythonLine(line, lineNo) {
      666:     const t = cleanLine(line);
      667:     const risk = riskOf(t, "python");
      668: 
      669:     // PYTHON_FLASK_ROUTE_DECORATOR_RULE_V330_A6
      670:     if (/^@[A-Za-z_][\w.]*\.route\s*\(/.test(t)) {
      671:       return makeStep(lineNo, t, "Flask 라우트 등록", "Flask 앱에서 특정 URL 경로로 들어온 요청을 바로 아래 함수에 연결합니다. 괄호 안의 경로와 methods 옵션을 확인합니다.", risk);
      672:     }
      673: 
      674:     // FASTAPI_IMPORT_RULES_V230_A1
      675:     if (/^from\s+fastapi\s+import\s+/.test(t)) {
      676:       return makeStep(lineNo, t, "FastAPI 기능 불러오기", "FastAPI, APIRouter, Depends, HTTPException, Query, Body 같은 API 서버 구성 기능을 가져옵니다. 앱 생성, 라우트 연결, 요청값 검증, 오류 응답 처리에 쓰입니다.", risk);
      677:     }
      678:     if (/^from\s+pydantic\s+import\s+.*BaseModel/.test(t)) {
      679:       return makeStep(lineNo, t, "Pydantic 모델 기능 불러오기", "API 요청과 응답 데이터의 모양을 정의하고 검증하기 위한 BaseModel 기능을 가져옵니다.", risk);
      680:     }
      681:     if (/^import\s+/.test(t) || /^from\s+.+\s+import\s+/.test(t)) {
      682:       return makeStep(lineNo, t, "라이브러리 불러오기", "이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.", risk);
      683:     }

### src/pwa/code_explainer_rules.js:676

- patterns: return makeStep

      670:     if (/^@[A-Za-z_][\w.]*\.route\s*\(/.test(t)) {
      671:       return makeStep(lineNo, t, "Flask 라우트 등록", "Flask 앱에서 특정 URL 경로로 들어온 요청을 바로 아래 함수에 연결합니다. 괄호 안의 경로와 methods 옵션을 확인합니다.", risk);
      672:     }
      673: 
      674:     // FASTAPI_IMPORT_RULES_V230_A1
      675:     if (/^from\s+fastapi\s+import\s+/.test(t)) {
      676:       return makeStep(lineNo, t, "FastAPI 기능 불러오기", "FastAPI, APIRouter, Depends, HTTPException, Query, Body 같은 API 서버 구성 기능을 가져옵니다. 앱 생성, 라우트 연결, 요청값 검증, 오류 응답 처리에 쓰입니다.", risk);
      677:     }
      678:     if (/^from\s+pydantic\s+import\s+.*BaseModel/.test(t)) {
      679:       return makeStep(lineNo, t, "Pydantic 모델 기능 불러오기", "API 요청과 응답 데이터의 모양을 정의하고 검증하기 위한 BaseModel 기능을 가져옵니다.", risk);
      680:     }
      681:     if (/^import\s+/.test(t) || /^from\s+.+\s+import\s+/.test(t)) {
      682:       return makeStep(lineNo, t, "라이브러리 불러오기", "이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.", risk);
      683:     }
      684:     // PYTHON_INIT_METHOD_RULE_V322_A3
      685:     if (/^(async\s+)?def\s+__init__\s*\(/.test(t)) {
      686:       return makeStep(lineNo, t, "\uac1d\uccb4 \ucd08\uae30\ud654 \uba54\uc11c\ub4dc \uc815\uc758", "__init__ \uba54\uc11c\ub4dc\ub294 \uc0c8 \uac1d\uccb4\uac00 \ub9cc\ub4e4\uc5b4\uc9c8 \ub54c \ucc98\uc74c \uc2e4\ud589\ub418\uba70 self.name\ucc98\ub7fc \uac1d\uccb4\uac00 \uae30\uc5b5\ud560 \uc18d\uc131\uc758 \ucd08\uae30\uac12\uc744 \uc900\ube44\ud569\ub2c8\ub2e4.", risk);
      687:     }
      688: 

### src/pwa/code_explainer_rules.js:679

- patterns: return makeStep

      673: 
      674:     // FASTAPI_IMPORT_RULES_V230_A1
      675:     if (/^from\s+fastapi\s+import\s+/.test(t)) {
      676:       return makeStep(lineNo, t, "FastAPI 기능 불러오기", "FastAPI, APIRouter, Depends, HTTPException, Query, Body 같은 API 서버 구성 기능을 가져옵니다. 앱 생성, 라우트 연결, 요청값 검증, 오류 응답 처리에 쓰입니다.", risk);
      677:     }
      678:     if (/^from\s+pydantic\s+import\s+.*BaseModel/.test(t)) {
      679:       return makeStep(lineNo, t, "Pydantic 모델 기능 불러오기", "API 요청과 응답 데이터의 모양을 정의하고 검증하기 위한 BaseModel 기능을 가져옵니다.", risk);
      680:     }
      681:     if (/^import\s+/.test(t) || /^from\s+.+\s+import\s+/.test(t)) {
      682:       return makeStep(lineNo, t, "라이브러리 불러오기", "이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.", risk);
      683:     }
      684:     // PYTHON_INIT_METHOD_RULE_V322_A3
      685:     if (/^(async\s+)?def\s+__init__\s*\(/.test(t)) {
      686:       return makeStep(lineNo, t, "\uac1d\uccb4 \ucd08\uae30\ud654 \uba54\uc11c\ub4dc \uc815\uc758", "__init__ \uba54\uc11c\ub4dc\ub294 \uc0c8 \uac1d\uccb4\uac00 \ub9cc\ub4e4\uc5b4\uc9c8 \ub54c \ucc98\uc74c \uc2e4\ud589\ub418\uba70 self.name\ucc98\ub7fc \uac1d\uccb4\uac00 \uae30\uc5b5\ud560 \uc18d\uc131\uc758 \ucd08\uae30\uac12\uc744 \uc900\ube44\ud569\ub2c8\ub2e4.", risk);
      687:     }
      688: 
      689:     if (/^(async\s+)?def\s+\w+\s*\(/.test(t)) {
      690:       return makeStep(lineNo, t, "함수 정의", "나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.", risk);
      691:     }

### src/pwa/code_explainer_rules.js:682

- patterns: return makeStep

      676:       return makeStep(lineNo, t, "FastAPI 기능 불러오기", "FastAPI, APIRouter, Depends, HTTPException, Query, Body 같은 API 서버 구성 기능을 가져옵니다. 앱 생성, 라우트 연결, 요청값 검증, 오류 응답 처리에 쓰입니다.", risk);
      677:     }
      678:     if (/^from\s+pydantic\s+import\s+.*BaseModel/.test(t)) {
      679:       return makeStep(lineNo, t, "Pydantic 모델 기능 불러오기", "API 요청과 응답 데이터의 모양을 정의하고 검증하기 위한 BaseModel 기능을 가져옵니다.", risk);
      680:     }
      681:     if (/^import\s+/.test(t) || /^from\s+.+\s+import\s+/.test(t)) {
      682:       return makeStep(lineNo, t, "라이브러리 불러오기", "이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.", risk);
      683:     }
      684:     // PYTHON_INIT_METHOD_RULE_V322_A3
      685:     if (/^(async\s+)?def\s+__init__\s*\(/.test(t)) {
      686:       return makeStep(lineNo, t, "\uac1d\uccb4 \ucd08\uae30\ud654 \uba54\uc11c\ub4dc \uc815\uc758", "__init__ \uba54\uc11c\ub4dc\ub294 \uc0c8 \uac1d\uccb4\uac00 \ub9cc\ub4e4\uc5b4\uc9c8 \ub54c \ucc98\uc74c \uc2e4\ud589\ub418\uba70 self.name\ucc98\ub7fc \uac1d\uccb4\uac00 \uae30\uc5b5\ud560 \uc18d\uc131\uc758 \ucd08\uae30\uac12\uc744 \uc900\ube44\ud569\ub2c8\ub2e4.", risk);
      687:     }
      688: 
      689:     if (/^(async\s+)?def\s+\w+\s*\(/.test(t)) {
      690:       return makeStep(lineNo, t, "함수 정의", "나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.", risk);
      691:     }
      692:     // PYDANTIC_BASEMODEL_RULE_V230_A1
      693:     if (/^class\s+\w+\s*\(\s*BaseModel\s*\)\s*:/.test(t)) {
      694:       return makeStep(lineNo, t, "Pydantic 데이터 모델 정의", "FastAPI에서 요청 본문이나 응답 JSON의 필드 구조를 정의합니다. 아래 들여쓰기된 필드 이름과 자료형이 API 데이터 규격이 됩니다.", risk);

### src/pwa/code_explainer_rules.js:686

- patterns: return makeStep

      680:     }
      681:     if (/^import\s+/.test(t) || /^from\s+.+\s+import\s+/.test(t)) {
      682:       return makeStep(lineNo, t, "라이브러리 불러오기", "이미 만들어진 기능을 현재 코드에서 사용할 수 있게 가져옵니다.", risk);
      683:     }
      684:     // PYTHON_INIT_METHOD_RULE_V322_A3
      685:     if (/^(async\s+)?def\s+__init__\s*\(/.test(t)) {
      686:       return makeStep(lineNo, t, "\uac1d\uccb4 \ucd08\uae30\ud654 \uba54\uc11c\ub4dc \uc815\uc758", "__init__ \uba54\uc11c\ub4dc\ub294 \uc0c8 \uac1d\uccb4\uac00 \ub9cc\ub4e4\uc5b4\uc9c8 \ub54c \ucc98\uc74c \uc2e4\ud589\ub418\uba70 self.name\ucc98\ub7fc \uac1d\uccb4\uac00 \uae30\uc5b5\ud560 \uc18d\uc131\uc758 \ucd08\uae30\uac12\uc744 \uc900\ube44\ud569\ub2c8\ub2e4.", risk);
      687:     }
      688: 
      689:     if (/^(async\s+)?def\s+\w+\s*\(/.test(t)) {
      690:       return makeStep(lineNo, t, "함수 정의", "나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.", risk);
      691:     }
      692:     // PYDANTIC_BASEMODEL_RULE_V230_A1
      693:     if (/^class\s+\w+\s*\(\s*BaseModel\s*\)\s*:/.test(t)) {
      694:       return makeStep(lineNo, t, "Pydantic 데이터 모델 정의", "FastAPI에서 요청 본문이나 응답 JSON의 필드 구조를 정의합니다. 아래 들여쓰기된 필드 이름과 자료형이 API 데이터 규격이 됩니다.", risk);
      695:     }
      696:     if (/^class\s+\w+/.test(t)) {
      697:       return makeStep(lineNo, t, "클래스 정의", "관련 데이터와 기능을 묶어 객체를 만들기 위한 설계도를 정의합니다.", risk);
      698:     }

### src/pwa/code_explainer_rules.js:690

- patterns: return makeStep

      684:     // PYTHON_INIT_METHOD_RULE_V322_A3
      685:     if (/^(async\s+)?def\s+__init__\s*\(/.test(t)) {
      686:       return makeStep(lineNo, t, "\uac1d\uccb4 \ucd08\uae30\ud654 \uba54\uc11c\ub4dc \uc815\uc758", "__init__ \uba54\uc11c\ub4dc\ub294 \uc0c8 \uac1d\uccb4\uac00 \ub9cc\ub4e4\uc5b4\uc9c8 \ub54c \ucc98\uc74c \uc2e4\ud589\ub418\uba70 self.name\ucc98\ub7fc \uac1d\uccb4\uac00 \uae30\uc5b5\ud560 \uc18d\uc131\uc758 \ucd08\uae30\uac12\uc744 \uc900\ube44\ud569\ub2c8\ub2e4.", risk);
      687:     }
      688: 
      689:     if (/^(async\s+)?def\s+\w+\s*\(/.test(t)) {
      690:       return makeStep(lineNo, t, "함수 정의", "나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.", risk);
      691:     }
      692:     // PYDANTIC_BASEMODEL_RULE_V230_A1
      693:     if (/^class\s+\w+\s*\(\s*BaseModel\s*\)\s*:/.test(t)) {
      694:       return makeStep(lineNo, t, "Pydantic 데이터 모델 정의", "FastAPI에서 요청 본문이나 응답 JSON의 필드 구조를 정의합니다. 아래 들여쓰기된 필드 이름과 자료형이 API 데이터 규격이 됩니다.", risk);
      695:     }
      696:     if (/^class\s+\w+/.test(t)) {
      697:       return makeStep(lineNo, t, "클래스 정의", "관련 데이터와 기능을 묶어 객체를 만들기 위한 설계도를 정의합니다.", risk);
      698:     }
      699:     // PYDANTIC_FIELD_RULE_V230_A2
      700:     if (/^[A-Za-z_]\w*\s*:\s*[A-Za-z_][\w.\[\], |]*(?:\s*=\s*.+)?$/.test(t)) {
      701:       return makeStep(lineNo, t, "Pydantic 모델 필드 정의", "데이터 모델 안의 필드 이름과 자료형을 정의합니다. FastAPI에서는 요청 본문이나 응답 JSON에 어떤 값이 들어갈 수 있는지 정하는 규격으로 쓰입니다.", risk);
      702:     }

### src/pwa/code_explainer_rules.js:694

- patterns: return makeStep

      688: 
      689:     if (/^(async\s+)?def\s+\w+\s*\(/.test(t)) {
      690:       return makeStep(lineNo, t, "함수 정의", "나중에 이름으로 불러서 실행할 수 있는 코드 묶음을 만듭니다. 이 줄만으로 함수 안쪽이 바로 실행되지는 않습니다.", risk);
      691:     }
      692:     // PYDANTIC_BASEMODEL_RULE_V230_A1
      693:     if (/^class\s+\w+\s*\(\s*BaseModel\s*\)\s*:/.test(t)) {
      694:       return makeStep(lineNo, t, "Pydantic 데이터 모델 정의", "FastAPI에서 요청 본문이나 응답 JSON의 필드 구조를 정의합니다. 아래 들여쓰기된 필드 이름과 자료형이 API 데이터 규격이 됩니다.", risk);
      695:     }
      696:     if (/^class\s+\w+/.test(t)) {
      697:       return makeStep(lineNo, t, "클래스 정의", "관련 데이터와 기능을 묶어 객체를 만들기 위한 설계도를 정의합니다.", risk);
      698:     }
      699:     // PYDANTIC_FIELD_RULE_V230_A2
      700:     if (/^[A-Za-z_]\w*\s*:\s*[A-Za-z_][\w.\[\], |]*(?:\s*=\s*.+)?$/.test(t)) {
      701:       return makeStep(lineNo, t, "Pydantic 모델 필드 정의", "데이터 모델 안의 필드 이름과 자료형을 정의합니다. FastAPI에서는 요청 본문이나 응답 JSON에 어떤 값이 들어갈 수 있는지 정하는 규격으로 쓰입니다.", risk);
      702:     }
      703: 
      704: 
      705:     // PYTHON_PATH_RE_DATE_COPY_RULES_V215_A1
      706:     if (/re\.(findall|search|match|sub|split)\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:697

- patterns: return makeStep

      691:     }
      692:     // PYDANTIC_BASEMODEL_RULE_V230_A1
      693:     if (/^class\s+\w+\s*\(\s*BaseModel\s*\)\s*:/.test(t)) {
      694:       return makeStep(lineNo, t, "Pydantic 데이터 모델 정의", "FastAPI에서 요청 본문이나 응답 JSON의 필드 구조를 정의합니다. 아래 들여쓰기된 필드 이름과 자료형이 API 데이터 규격이 됩니다.", risk);
      695:     }
      696:     if (/^class\s+\w+/.test(t)) {
      697:       return makeStep(lineNo, t, "클래스 정의", "관련 데이터와 기능을 묶어 객체를 만들기 위한 설계도를 정의합니다.", risk);
      698:     }
      699:     // PYDANTIC_FIELD_RULE_V230_A2
      700:     if (/^[A-Za-z_]\w*\s*:\s*[A-Za-z_][\w.\[\], |]*(?:\s*=\s*.+)?$/.test(t)) {
      701:       return makeStep(lineNo, t, "Pydantic 모델 필드 정의", "데이터 모델 안의 필드 이름과 자료형을 정의합니다. FastAPI에서는 요청 본문이나 응답 JSON에 어떤 값이 들어갈 수 있는지 정하는 규격으로 쓰입니다.", risk);
      702:     }
      703: 
      704: 
      705:     // PYTHON_PATH_RE_DATE_COPY_RULES_V215_A1
      706:     if (/re\.(findall|search|match|sub|split)\s*\(/.test(t)) {
      707:       return makeStep(lineNo, t, "정규식 검색/치환", "re 모듈의 정규식으로 문자열 안에서 패턴을 찾거나 바꿉니다. 찾는 패턴, 대상 문자열, 결과가 리스트인지 문자열인지 확인해야 합니다.", risk);
      708:     }
      709:     if (/datetime\.(now|today|utcnow)\s*\(/.test(t) && /\.strftime\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:701

- patterns: return makeStep

      695:     }
      696:     if (/^class\s+\w+/.test(t)) {
      697:       return makeStep(lineNo, t, "클래스 정의", "관련 데이터와 기능을 묶어 객체를 만들기 위한 설계도를 정의합니다.", risk);
      698:     }
      699:     // PYDANTIC_FIELD_RULE_V230_A2
      700:     if (/^[A-Za-z_]\w*\s*:\s*[A-Za-z_][\w.\[\], |]*(?:\s*=\s*.+)?$/.test(t)) {
      701:       return makeStep(lineNo, t, "Pydantic 모델 필드 정의", "데이터 모델 안의 필드 이름과 자료형을 정의합니다. FastAPI에서는 요청 본문이나 응답 JSON에 어떤 값이 들어갈 수 있는지 정하는 규격으로 쓰입니다.", risk);
      702:     }
      703: 
      704: 
      705:     // PYTHON_PATH_RE_DATE_COPY_RULES_V215_A1
      706:     if (/re\.(findall|search|match|sub|split)\s*\(/.test(t)) {
      707:       return makeStep(lineNo, t, "정규식 검색/치환", "re 모듈의 정규식으로 문자열 안에서 패턴을 찾거나 바꿉니다. 찾는 패턴, 대상 문자열, 결과가 리스트인지 문자열인지 확인해야 합니다.", risk);
      708:     }
      709:     if (/datetime\.(now|today|utcnow)\s*\(/.test(t) && /\.strftime\s*\(/.test(t)) {
      710:       return makeStep(lineNo, t, "날짜/시간 생성 / 날짜 문자열 포맷", "현재 날짜나 시간을 만든 뒤 datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
      711:     }
      712:     if (/datetime\.(now|today|utcnow)\s*\(/.test(t)) {
      713:       return makeStep(lineNo, t, "날짜/시간 생성", "현재 날짜나 시간을 만듭니다. 파일명, 로그 시각, 실행 시각 표시처럼 시간 기준 값을 만들 때 사용합니다.", risk);

### src/pwa/code_explainer_rules.js:707

- patterns: return makeStep

      701:       return makeStep(lineNo, t, "Pydantic 모델 필드 정의", "데이터 모델 안의 필드 이름과 자료형을 정의합니다. FastAPI에서는 요청 본문이나 응답 JSON에 어떤 값이 들어갈 수 있는지 정하는 규격으로 쓰입니다.", risk);
      702:     }
      703: 
      704: 
      705:     // PYTHON_PATH_RE_DATE_COPY_RULES_V215_A1
      706:     if (/re\.(findall|search|match|sub|split)\s*\(/.test(t)) {
      707:       return makeStep(lineNo, t, "정규식 검색/치환", "re 모듈의 정규식으로 문자열 안에서 패턴을 찾거나 바꿉니다. 찾는 패턴, 대상 문자열, 결과가 리스트인지 문자열인지 확인해야 합니다.", risk);
      708:     }
      709:     if (/datetime\.(now|today|utcnow)\s*\(/.test(t) && /\.strftime\s*\(/.test(t)) {
      710:       return makeStep(lineNo, t, "날짜/시간 생성 / 날짜 문자열 포맷", "현재 날짜나 시간을 만든 뒤 datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
      711:     }
      712:     if (/datetime\.(now|today|utcnow)\s*\(/.test(t)) {
      713:       return makeStep(lineNo, t, "날짜/시간 생성", "현재 날짜나 시간을 만듭니다. 파일명, 로그 시각, 실행 시각 표시처럼 시간 기준 값을 만들 때 사용합니다.", risk);
      714:     }
      715:     if (/\.strftime\s*\(/.test(t)) {
      716:       return makeStep(lineNo, t, "날짜 문자열 포맷", "datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
      717:     }
      718:     if (/shutil\.(copy|copy2|copyfile)\s*\(/.test(t)) {
      719:       return makeStep(lineNo, t, "파일 복사", "shutil로 파일을 다른 위치나 다른 이름으로 복사합니다. 원본 경로와 대상 경로가 맞는지, 같은 이름을 덮어쓰지 않는지 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:710

- patterns: return makeStep

      704: 
      705:     // PYTHON_PATH_RE_DATE_COPY_RULES_V215_A1
      706:     if (/re\.(findall|search|match|sub|split)\s*\(/.test(t)) {
      707:       return makeStep(lineNo, t, "정규식 검색/치환", "re 모듈의 정규식으로 문자열 안에서 패턴을 찾거나 바꿉니다. 찾는 패턴, 대상 문자열, 결과가 리스트인지 문자열인지 확인해야 합니다.", risk);
      708:     }
      709:     if (/datetime\.(now|today|utcnow)\s*\(/.test(t) && /\.strftime\s*\(/.test(t)) {
      710:       return makeStep(lineNo, t, "날짜/시간 생성 / 날짜 문자열 포맷", "현재 날짜나 시간을 만든 뒤 datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
      711:     }
      712:     if (/datetime\.(now|today|utcnow)\s*\(/.test(t)) {
      713:       return makeStep(lineNo, t, "날짜/시간 생성", "현재 날짜나 시간을 만듭니다. 파일명, 로그 시각, 실행 시각 표시처럼 시간 기준 값을 만들 때 사용합니다.", risk);
      714:     }
      715:     if (/\.strftime\s*\(/.test(t)) {
      716:       return makeStep(lineNo, t, "날짜 문자열 포맷", "datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
      717:     }
      718:     if (/shutil\.(copy|copy2|copyfile)\s*\(/.test(t)) {
      719:       return makeStep(lineNo, t, "파일 복사", "shutil로 파일을 다른 위치나 다른 이름으로 복사합니다. 원본 경로와 대상 경로가 맞는지, 같은 이름을 덮어쓰지 않는지 확인해야 합니다.", risk);
      720:     }
      721:     // PYTHON_ENTRY_ERROR_RULES_V187_A2
      722:     if (/^if\s+__name__\s*==\s*["']__main__["']\s*:\s*$/.test(t)) {

### src/pwa/code_explainer_rules.js:713

- patterns: return makeStep

      707:       return makeStep(lineNo, t, "정규식 검색/치환", "re 모듈의 정규식으로 문자열 안에서 패턴을 찾거나 바꿉니다. 찾는 패턴, 대상 문자열, 결과가 리스트인지 문자열인지 확인해야 합니다.", risk);
      708:     }
      709:     if (/datetime\.(now|today|utcnow)\s*\(/.test(t) && /\.strftime\s*\(/.test(t)) {
      710:       return makeStep(lineNo, t, "날짜/시간 생성 / 날짜 문자열 포맷", "현재 날짜나 시간을 만든 뒤 datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
      711:     }
      712:     if (/datetime\.(now|today|utcnow)\s*\(/.test(t)) {
      713:       return makeStep(lineNo, t, "날짜/시간 생성", "현재 날짜나 시간을 만듭니다. 파일명, 로그 시각, 실행 시각 표시처럼 시간 기준 값을 만들 때 사용합니다.", risk);
      714:     }
      715:     if (/\.strftime\s*\(/.test(t)) {
      716:       return makeStep(lineNo, t, "날짜 문자열 포맷", "datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
      717:     }
      718:     if (/shutil\.(copy|copy2|copyfile)\s*\(/.test(t)) {
      719:       return makeStep(lineNo, t, "파일 복사", "shutil로 파일을 다른 위치나 다른 이름으로 복사합니다. 원본 경로와 대상 경로가 맞는지, 같은 이름을 덮어쓰지 않는지 확인해야 합니다.", risk);
      720:     }
      721:     // PYTHON_ENTRY_ERROR_RULES_V187_A2
      722:     if (/^if\s+__name__\s*==\s*["']__main__["']\s*:\s*$/.test(t)) {
      723:       return makeStep(lineNo, t, "직접 실행 진입점", "이 파일을 직접 실행했을 때만 아래 들여쓰기 코드가 실행됩니다. 다른 파일에서 import할 때는 실행되지 않게 분리하는 패턴입니다.", risk);
      724:     }
      725:     if (/^try\s*:\s*$/.test(t)) {

### src/pwa/code_explainer_rules.js:716

- patterns: return makeStep

      710:       return makeStep(lineNo, t, "날짜/시간 생성 / 날짜 문자열 포맷", "현재 날짜나 시간을 만든 뒤 datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
      711:     }
      712:     if (/datetime\.(now|today|utcnow)\s*\(/.test(t)) {
      713:       return makeStep(lineNo, t, "날짜/시간 생성", "현재 날짜나 시간을 만듭니다. 파일명, 로그 시각, 실행 시각 표시처럼 시간 기준 값을 만들 때 사용합니다.", risk);
      714:     }
      715:     if (/\.strftime\s*\(/.test(t)) {
      716:       return makeStep(lineNo, t, "날짜 문자열 포맷", "datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
      717:     }
      718:     if (/shutil\.(copy|copy2|copyfile)\s*\(/.test(t)) {
      719:       return makeStep(lineNo, t, "파일 복사", "shutil로 파일을 다른 위치나 다른 이름으로 복사합니다. 원본 경로와 대상 경로가 맞는지, 같은 이름을 덮어쓰지 않는지 확인해야 합니다.", risk);
      720:     }
      721:     // PYTHON_ENTRY_ERROR_RULES_V187_A2
      722:     if (/^if\s+__name__\s*==\s*["']__main__["']\s*:\s*$/.test(t)) {
      723:       return makeStep(lineNo, t, "직접 실행 진입점", "이 파일을 직접 실행했을 때만 아래 들여쓰기 코드가 실행됩니다. 다른 파일에서 import할 때는 실행되지 않게 분리하는 패턴입니다.", risk);
      724:     }
      725:     if (/^try\s*:\s*$/.test(t)) {
      726:       return makeStep(lineNo, t, "예외 처리 시작", "아래 코드를 실행하다가 문제가 생기면 except/finally 구간에서 처리할 수 있게 준비합니다.", risk);
      727:     }
      728:     if (/^except\b.*:\s*$/.test(t)) {

### src/pwa/code_explainer_rules.js:719

- patterns: return makeStep

      713:       return makeStep(lineNo, t, "날짜/시간 생성", "현재 날짜나 시간을 만듭니다. 파일명, 로그 시각, 실행 시각 표시처럼 시간 기준 값을 만들 때 사용합니다.", risk);
      714:     }
      715:     if (/\.strftime\s*\(/.test(t)) {
      716:       return makeStep(lineNo, t, "날짜 문자열 포맷", "datetime 값을 원하는 날짜 문자열 형식으로 바꿉니다. 예를 들어 %Y%m%d는 연월일을 붙인 파일명용 문자열이 됩니다.", risk);
      717:     }
      718:     if (/shutil\.(copy|copy2|copyfile)\s*\(/.test(t)) {
      719:       return makeStep(lineNo, t, "파일 복사", "shutil로 파일을 다른 위치나 다른 이름으로 복사합니다. 원본 경로와 대상 경로가 맞는지, 같은 이름을 덮어쓰지 않는지 확인해야 합니다.", risk);
      720:     }
      721:     // PYTHON_ENTRY_ERROR_RULES_V187_A2
      722:     if (/^if\s+__name__\s*==\s*["']__main__["']\s*:\s*$/.test(t)) {
      723:       return makeStep(lineNo, t, "직접 실행 진입점", "이 파일을 직접 실행했을 때만 아래 들여쓰기 코드가 실행됩니다. 다른 파일에서 import할 때는 실행되지 않게 분리하는 패턴입니다.", risk);
      724:     }
      725:     if (/^try\s*:\s*$/.test(t)) {
      726:       return makeStep(lineNo, t, "예외 처리 시작", "아래 코드를 실행하다가 문제가 생기면 except/finally 구간에서 처리할 수 있게 준비합니다.", risk);
      727:     }
      728:     if (/^except\b.*:\s*$/.test(t)) {
      729:       return makeStep(lineNo, t, "예외 잡기", "try 안에서 발생한 오류를 잡아 사용자 친화적인 메시지나 대체 동작을 실행합니다. 너무 넓은 except는 실제 오류를 숨길 수 있습니다.", risk);
      730:     }
      731:     if (/^finally\s*:\s*$/.test(t)) {

### src/pwa/code_explainer_rules.js:723

- patterns: return makeStep

      717:     }
      718:     if (/shutil\.(copy|copy2|copyfile)\s*\(/.test(t)) {
      719:       return makeStep(lineNo, t, "파일 복사", "shutil로 파일을 다른 위치나 다른 이름으로 복사합니다. 원본 경로와 대상 경로가 맞는지, 같은 이름을 덮어쓰지 않는지 확인해야 합니다.", risk);
      720:     }
      721:     // PYTHON_ENTRY_ERROR_RULES_V187_A2
      722:     if (/^if\s+__name__\s*==\s*["']__main__["']\s*:\s*$/.test(t)) {
      723:       return makeStep(lineNo, t, "직접 실행 진입점", "이 파일을 직접 실행했을 때만 아래 들여쓰기 코드가 실행됩니다. 다른 파일에서 import할 때는 실행되지 않게 분리하는 패턴입니다.", risk);
      724:     }
      725:     if (/^try\s*:\s*$/.test(t)) {
      726:       return makeStep(lineNo, t, "예외 처리 시작", "아래 코드를 실행하다가 문제가 생기면 except/finally 구간에서 처리할 수 있게 준비합니다.", risk);
      727:     }
      728:     if (/^except\b.*:\s*$/.test(t)) {
      729:       return makeStep(lineNo, t, "예외 잡기", "try 안에서 발생한 오류를 잡아 사용자 친화적인 메시지나 대체 동작을 실행합니다. 너무 넓은 except는 실제 오류를 숨길 수 있습니다.", risk);
      730:     }
      731:     if (/^finally\s*:\s*$/.test(t)) {
      732:       return makeStep(lineNo, t, "마지막 정리", "성공/실패와 관계없이 마지막에 실행되는 정리 구간입니다. 파일 닫기, 로그 출력, 임시 상태 정리에 자주 씁니다.", risk);
      733:     }
      734:     if (/^raise\s+SystemExit\b/.test(t)) {
      735:       return makeStep(lineNo, t, "친절한 종료", "CLI 도구에서 오류 메시지를 보여주고 프로그램을 종료합니다. 사용자에게 무엇이 문제인지 알려줄 때 씁니다.", risk);

### src/pwa/code_explainer_rules.js:726

- patterns: return makeStep

      720:     }
      721:     // PYTHON_ENTRY_ERROR_RULES_V187_A2
      722:     if (/^if\s+__name__\s*==\s*["']__main__["']\s*:\s*$/.test(t)) {
      723:       return makeStep(lineNo, t, "직접 실행 진입점", "이 파일을 직접 실행했을 때만 아래 들여쓰기 코드가 실행됩니다. 다른 파일에서 import할 때는 실행되지 않게 분리하는 패턴입니다.", risk);
      724:     }
      725:     if (/^try\s*:\s*$/.test(t)) {
      726:       return makeStep(lineNo, t, "예외 처리 시작", "아래 코드를 실행하다가 문제가 생기면 except/finally 구간에서 처리할 수 있게 준비합니다.", risk);
      727:     }
      728:     if (/^except\b.*:\s*$/.test(t)) {
      729:       return makeStep(lineNo, t, "예외 잡기", "try 안에서 발생한 오류를 잡아 사용자 친화적인 메시지나 대체 동작을 실행합니다. 너무 넓은 except는 실제 오류를 숨길 수 있습니다.", risk);
      730:     }
      731:     if (/^finally\s*:\s*$/.test(t)) {
      732:       return makeStep(lineNo, t, "마지막 정리", "성공/실패와 관계없이 마지막에 실행되는 정리 구간입니다. 파일 닫기, 로그 출력, 임시 상태 정리에 자주 씁니다.", risk);
      733:     }
      734:     if (/^raise\s+SystemExit\b/.test(t)) {
      735:       return makeStep(lineNo, t, "친절한 종료", "CLI 도구에서 오류 메시지를 보여주고 프로그램을 종료합니다. 사용자에게 무엇이 문제인지 알려줄 때 씁니다.", risk);
      736:     }
      737:     // FASTAPI_HTTP_EXCEPTION_RULE_V230_A1
      738:     if (/^raise\s+HTTPException\s*\(/.test(t) || /HTTPException\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:729

- patterns: return makeStep

      723:       return makeStep(lineNo, t, "직접 실행 진입점", "이 파일을 직접 실행했을 때만 아래 들여쓰기 코드가 실행됩니다. 다른 파일에서 import할 때는 실행되지 않게 분리하는 패턴입니다.", risk);
      724:     }
      725:     if (/^try\s*:\s*$/.test(t)) {
      726:       return makeStep(lineNo, t, "예외 처리 시작", "아래 코드를 실행하다가 문제가 생기면 except/finally 구간에서 처리할 수 있게 준비합니다.", risk);
      727:     }
      728:     if (/^except\b.*:\s*$/.test(t)) {
      729:       return makeStep(lineNo, t, "예외 잡기", "try 안에서 발생한 오류를 잡아 사용자 친화적인 메시지나 대체 동작을 실행합니다. 너무 넓은 except는 실제 오류를 숨길 수 있습니다.", risk);
      730:     }
      731:     if (/^finally\s*:\s*$/.test(t)) {
      732:       return makeStep(lineNo, t, "마지막 정리", "성공/실패와 관계없이 마지막에 실행되는 정리 구간입니다. 파일 닫기, 로그 출력, 임시 상태 정리에 자주 씁니다.", risk);
      733:     }
      734:     if (/^raise\s+SystemExit\b/.test(t)) {
      735:       return makeStep(lineNo, t, "친절한 종료", "CLI 도구에서 오류 메시지를 보여주고 프로그램을 종료합니다. 사용자에게 무엇이 문제인지 알려줄 때 씁니다.", risk);
      736:     }
      737:     // FASTAPI_HTTP_EXCEPTION_RULE_V230_A1
      738:     if (/^raise\s+HTTPException\s*\(/.test(t) || /HTTPException\s*\(/.test(t)) {
      739:       return makeStep(lineNo, t, "FastAPI HTTP 오류 응답", "API 요청을 처리할 수 없을 때 상태 코드와 detail 메시지를 담아 HTTP 오류 응답을 만듭니다. status_code와 detail 내용이 사용자에게 보여져도 되는지 확인해야 합니다.", risk);
      740:     }
      741:     if (/^raise\b/.test(t)) {

### src/pwa/code_explainer_rules.js:732

- patterns: return makeStep

      726:       return makeStep(lineNo, t, "예외 처리 시작", "아래 코드를 실행하다가 문제가 생기면 except/finally 구간에서 처리할 수 있게 준비합니다.", risk);
      727:     }
      728:     if (/^except\b.*:\s*$/.test(t)) {
      729:       return makeStep(lineNo, t, "예외 잡기", "try 안에서 발생한 오류를 잡아 사용자 친화적인 메시지나 대체 동작을 실행합니다. 너무 넓은 except는 실제 오류를 숨길 수 있습니다.", risk);
      730:     }
      731:     if (/^finally\s*:\s*$/.test(t)) {
      732:       return makeStep(lineNo, t, "마지막 정리", "성공/실패와 관계없이 마지막에 실행되는 정리 구간입니다. 파일 닫기, 로그 출력, 임시 상태 정리에 자주 씁니다.", risk);
      733:     }
      734:     if (/^raise\s+SystemExit\b/.test(t)) {
      735:       return makeStep(lineNo, t, "친절한 종료", "CLI 도구에서 오류 메시지를 보여주고 프로그램을 종료합니다. 사용자에게 무엇이 문제인지 알려줄 때 씁니다.", risk);
      736:     }
      737:     // FASTAPI_HTTP_EXCEPTION_RULE_V230_A1
      738:     if (/^raise\s+HTTPException\s*\(/.test(t) || /HTTPException\s*\(/.test(t)) {
      739:       return makeStep(lineNo, t, "FastAPI HTTP 오류 응답", "API 요청을 처리할 수 없을 때 상태 코드와 detail 메시지를 담아 HTTP 오류 응답을 만듭니다. status_code와 detail 내용이 사용자에게 보여져도 되는지 확인해야 합니다.", risk);
      740:     }
      741:     if (/^raise\b/.test(t)) {
      742:       return makeStep(lineNo, t, "예외 발생시키기", "조건이 맞지 않거나 계속 진행하면 위험할 때 의도적으로 오류를 발생시킵니다.", risk);
      743:     }
      744:     if (/^assert\s+/.test(t)) {

### src/pwa/code_explainer_rules.js:735

- patterns: return makeStep

      729:       return makeStep(lineNo, t, "예외 잡기", "try 안에서 발생한 오류를 잡아 사용자 친화적인 메시지나 대체 동작을 실행합니다. 너무 넓은 except는 실제 오류를 숨길 수 있습니다.", risk);
      730:     }
      731:     if (/^finally\s*:\s*$/.test(t)) {
      732:       return makeStep(lineNo, t, "마지막 정리", "성공/실패와 관계없이 마지막에 실행되는 정리 구간입니다. 파일 닫기, 로그 출력, 임시 상태 정리에 자주 씁니다.", risk);
      733:     }
      734:     if (/^raise\s+SystemExit\b/.test(t)) {
      735:       return makeStep(lineNo, t, "친절한 종료", "CLI 도구에서 오류 메시지를 보여주고 프로그램을 종료합니다. 사용자에게 무엇이 문제인지 알려줄 때 씁니다.", risk);
      736:     }
      737:     // FASTAPI_HTTP_EXCEPTION_RULE_V230_A1
      738:     if (/^raise\s+HTTPException\s*\(/.test(t) || /HTTPException\s*\(/.test(t)) {
      739:       return makeStep(lineNo, t, "FastAPI HTTP 오류 응답", "API 요청을 처리할 수 없을 때 상태 코드와 detail 메시지를 담아 HTTP 오류 응답을 만듭니다. status_code와 detail 내용이 사용자에게 보여져도 되는지 확인해야 합니다.", risk);
      740:     }
      741:     if (/^raise\b/.test(t)) {
      742:       return makeStep(lineNo, t, "예외 발생시키기", "조건이 맞지 않거나 계속 진행하면 위험할 때 의도적으로 오류를 발생시킵니다.", risk);
      743:     }
      744:     if (/^assert\s+/.test(t)) {
      745:       return makeStep(lineNo, t, "조건 검증", "반드시 참이어야 하는 조건을 검사합니다. 테스트나 내부 검증에는 유용하지만 사용자 입력 검증을 이것만으로 처리하면 부족할 수 있습니다.", risk);
      746:     }
      747:     // PYTHON_BUILTIN_MAPPING_V228_A1

### src/pwa/code_explainer_rules.js:739

- patterns: return makeStep

      733:     }
      734:     if (/^raise\s+SystemExit\b/.test(t)) {
      735:       return makeStep(lineNo, t, "친절한 종료", "CLI 도구에서 오류 메시지를 보여주고 프로그램을 종료합니다. 사용자에게 무엇이 문제인지 알려줄 때 씁니다.", risk);
      736:     }
      737:     // FASTAPI_HTTP_EXCEPTION_RULE_V230_A1
      738:     if (/^raise\s+HTTPException\s*\(/.test(t) || /HTTPException\s*\(/.test(t)) {
      739:       return makeStep(lineNo, t, "FastAPI HTTP 오류 응답", "API 요청을 처리할 수 없을 때 상태 코드와 detail 메시지를 담아 HTTP 오류 응답을 만듭니다. status_code와 detail 내용이 사용자에게 보여져도 되는지 확인해야 합니다.", risk);
      740:     }
      741:     if (/^raise\b/.test(t)) {
      742:       return makeStep(lineNo, t, "예외 발생시키기", "조건이 맞지 않거나 계속 진행하면 위험할 때 의도적으로 오류를 발생시킵니다.", risk);
      743:     }
      744:     if (/^assert\s+/.test(t)) {
      745:       return makeStep(lineNo, t, "조건 검증", "반드시 참이어야 하는 조건을 검사합니다. 테스트나 내부 검증에는 유용하지만 사용자 입력 검증을 이것만으로 처리하면 부족할 수 있습니다.", risk);
      746:     }
      747:     // PYTHON_BUILTIN_MAPPING_V228_A1
      748:     if (/\bnext\s*\(/.test(t)) {
      749:       return makeStep(lineNo, t, "next 값 꺼내기", "반복 가능한 값에서 다음 항목을 하나 꺼냅니다. 두 번째 기본값을 넣으면 더 이상 값이 없을 때 오류 대신 그 값을 돌려줄 수 있습니다.", risk);
      750:     }
      751:     if (/\biter\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:742

- patterns: return makeStep

      736:     }
      737:     // FASTAPI_HTTP_EXCEPTION_RULE_V230_A1
      738:     if (/^raise\s+HTTPException\s*\(/.test(t) || /HTTPException\s*\(/.test(t)) {
      739:       return makeStep(lineNo, t, "FastAPI HTTP 오류 응답", "API 요청을 처리할 수 없을 때 상태 코드와 detail 메시지를 담아 HTTP 오류 응답을 만듭니다. status_code와 detail 내용이 사용자에게 보여져도 되는지 확인해야 합니다.", risk);
      740:     }
      741:     if (/^raise\b/.test(t)) {
      742:       return makeStep(lineNo, t, "예외 발생시키기", "조건이 맞지 않거나 계속 진행하면 위험할 때 의도적으로 오류를 발생시킵니다.", risk);
      743:     }
      744:     if (/^assert\s+/.test(t)) {
      745:       return makeStep(lineNo, t, "조건 검증", "반드시 참이어야 하는 조건을 검사합니다. 테스트나 내부 검증에는 유용하지만 사용자 입력 검증을 이것만으로 처리하면 부족할 수 있습니다.", risk);
      746:     }
      747:     // PYTHON_BUILTIN_MAPPING_V228_A1
      748:     if (/\bnext\s*\(/.test(t)) {
      749:       return makeStep(lineNo, t, "next 값 꺼내기", "반복 가능한 값에서 다음 항목을 하나 꺼냅니다. 두 번째 기본값을 넣으면 더 이상 값이 없을 때 오류 대신 그 값을 돌려줄 수 있습니다.", risk);
      750:     }
      751:     if (/\biter\s*\(/.test(t)) {
      752:       return makeStep(lineNo, t, "반복자 만들기", "리스트, 튜플, 파일 같은 반복 가능한 값을 next로 하나씩 꺼낼 수 있는 반복자 형태로 바꿉니다.", risk);
      753:     }
      754:     if (/\breversed\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:745

- patterns: return makeStep

      739:       return makeStep(lineNo, t, "FastAPI HTTP 오류 응답", "API 요청을 처리할 수 없을 때 상태 코드와 detail 메시지를 담아 HTTP 오류 응답을 만듭니다. status_code와 detail 내용이 사용자에게 보여져도 되는지 확인해야 합니다.", risk);
      740:     }
      741:     if (/^raise\b/.test(t)) {
      742:       return makeStep(lineNo, t, "예외 발생시키기", "조건이 맞지 않거나 계속 진행하면 위험할 때 의도적으로 오류를 발생시킵니다.", risk);
      743:     }
      744:     if (/^assert\s+/.test(t)) {
      745:       return makeStep(lineNo, t, "조건 검증", "반드시 참이어야 하는 조건을 검사합니다. 테스트나 내부 검증에는 유용하지만 사용자 입력 검증을 이것만으로 처리하면 부족할 수 있습니다.", risk);
      746:     }
      747:     // PYTHON_BUILTIN_MAPPING_V228_A1
      748:     if (/\bnext\s*\(/.test(t)) {
      749:       return makeStep(lineNo, t, "next 값 꺼내기", "반복 가능한 값에서 다음 항목을 하나 꺼냅니다. 두 번째 기본값을 넣으면 더 이상 값이 없을 때 오류 대신 그 값을 돌려줄 수 있습니다.", risk);
      750:     }
      751:     if (/\biter\s*\(/.test(t)) {
      752:       return makeStep(lineNo, t, "반복자 만들기", "리스트, 튜플, 파일 같은 반복 가능한 값을 next로 하나씩 꺼낼 수 있는 반복자 형태로 바꿉니다.", risk);
      753:     }
      754:     if (/\breversed\s*\(/.test(t)) {
      755:       return makeStep(lineNo, t, "거꾸로 반복하기", "순서가 있는 값을 뒤에서 앞으로 읽는 반복자를 만듭니다. 실제 리스트가 필요한 경우 list(reversed(...))처럼 감싸는지 확인합니다.", risk);
      756:     }
      757:     if (/\bround\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:749

- patterns: return makeStep

      743:     }
      744:     if (/^assert\s+/.test(t)) {
      745:       return makeStep(lineNo, t, "조건 검증", "반드시 참이어야 하는 조건을 검사합니다. 테스트나 내부 검증에는 유용하지만 사용자 입력 검증을 이것만으로 처리하면 부족할 수 있습니다.", risk);
      746:     }
      747:     // PYTHON_BUILTIN_MAPPING_V228_A1
      748:     if (/\bnext\s*\(/.test(t)) {
      749:       return makeStep(lineNo, t, "next 값 꺼내기", "반복 가능한 값에서 다음 항목을 하나 꺼냅니다. 두 번째 기본값을 넣으면 더 이상 값이 없을 때 오류 대신 그 값을 돌려줄 수 있습니다.", risk);
      750:     }
      751:     if (/\biter\s*\(/.test(t)) {
      752:       return makeStep(lineNo, t, "반복자 만들기", "리스트, 튜플, 파일 같은 반복 가능한 값을 next로 하나씩 꺼낼 수 있는 반복자 형태로 바꿉니다.", risk);
      753:     }
      754:     if (/\breversed\s*\(/.test(t)) {
      755:       return makeStep(lineNo, t, "거꾸로 반복하기", "순서가 있는 값을 뒤에서 앞으로 읽는 반복자를 만듭니다. 실제 리스트가 필요한 경우 list(reversed(...))처럼 감싸는지 확인합니다.", risk);
      756:     }
      757:     if (/\bround\s*\(/.test(t)) {
      758:       return makeStep(lineNo, t, "반올림 계산", "숫자를 정해진 자리수로 반올림합니다. 두 번째 인자가 있으면 소수 몇 자리까지 남길지 정합니다.", risk);
      759:     }
      760:     if (/\babs\s*\(/.test(t)) {
      761:       return makeStep(lineNo, t, "절댓값 계산", "음수와 양수의 부호를 제외하고 크기만 가져옵니다. 거리, 차이, 오차 계산에서 자주 씁니다.", risk);

### src/pwa/code_explainer_rules.js:752

- patterns: return makeStep

      746:     }
      747:     // PYTHON_BUILTIN_MAPPING_V228_A1
      748:     if (/\bnext\s*\(/.test(t)) {
      749:       return makeStep(lineNo, t, "next 값 꺼내기", "반복 가능한 값에서 다음 항목을 하나 꺼냅니다. 두 번째 기본값을 넣으면 더 이상 값이 없을 때 오류 대신 그 값을 돌려줄 수 있습니다.", risk);
      750:     }
      751:     if (/\biter\s*\(/.test(t)) {
      752:       return makeStep(lineNo, t, "반복자 만들기", "리스트, 튜플, 파일 같은 반복 가능한 값을 next로 하나씩 꺼낼 수 있는 반복자 형태로 바꿉니다.", risk);
      753:     }
      754:     if (/\breversed\s*\(/.test(t)) {
      755:       return makeStep(lineNo, t, "거꾸로 반복하기", "순서가 있는 값을 뒤에서 앞으로 읽는 반복자를 만듭니다. 실제 리스트가 필요한 경우 list(reversed(...))처럼 감싸는지 확인합니다.", risk);
      756:     }
      757:     if (/\bround\s*\(/.test(t)) {
      758:       return makeStep(lineNo, t, "반올림 계산", "숫자를 정해진 자리수로 반올림합니다. 두 번째 인자가 있으면 소수 몇 자리까지 남길지 정합니다.", risk);
      759:     }
      760:     if (/\babs\s*\(/.test(t)) {
      761:       return makeStep(lineNo, t, "절댓값 계산", "음수와 양수의 부호를 제외하고 크기만 가져옵니다. 거리, 차이, 오차 계산에서 자주 씁니다.", risk);
      762:     }
      763:     if (/\bisinstance\s*\(/.test(t)) {
      764:       return makeStep(lineNo, t, "자료형 확인", "값이 특정 자료형인지 검사합니다. 문자열, 숫자, 리스트처럼 입력 종류에 따라 다르게 처리할 때 씁니다.", risk);

### src/pwa/code_explainer_rules.js:755

- patterns: return makeStep

      749:       return makeStep(lineNo, t, "next 값 꺼내기", "반복 가능한 값에서 다음 항목을 하나 꺼냅니다. 두 번째 기본값을 넣으면 더 이상 값이 없을 때 오류 대신 그 값을 돌려줄 수 있습니다.", risk);
      750:     }
      751:     if (/\biter\s*\(/.test(t)) {
      752:       return makeStep(lineNo, t, "반복자 만들기", "리스트, 튜플, 파일 같은 반복 가능한 값을 next로 하나씩 꺼낼 수 있는 반복자 형태로 바꿉니다.", risk);
      753:     }
      754:     if (/\breversed\s*\(/.test(t)) {
      755:       return makeStep(lineNo, t, "거꾸로 반복하기", "순서가 있는 값을 뒤에서 앞으로 읽는 반복자를 만듭니다. 실제 리스트가 필요한 경우 list(reversed(...))처럼 감싸는지 확인합니다.", risk);
      756:     }
      757:     if (/\bround\s*\(/.test(t)) {
      758:       return makeStep(lineNo, t, "반올림 계산", "숫자를 정해진 자리수로 반올림합니다. 두 번째 인자가 있으면 소수 몇 자리까지 남길지 정합니다.", risk);
      759:     }
      760:     if (/\babs\s*\(/.test(t)) {
      761:       return makeStep(lineNo, t, "절댓값 계산", "음수와 양수의 부호를 제외하고 크기만 가져옵니다. 거리, 차이, 오차 계산에서 자주 씁니다.", risk);
      762:     }
      763:     if (/\bisinstance\s*\(/.test(t)) {
      764:       return makeStep(lineNo, t, "자료형 확인", "값이 특정 자료형인지 검사합니다. 문자열, 숫자, 리스트처럼 입력 종류에 따라 다르게 처리할 때 씁니다.", risk);
      765:     }
      766:     if (/^if\s+.+:\s*$/.test(t)) {
      767:       return makeStep(lineNo, t, "조건 검사", "조건이 맞으면 바로 아래 들여쓰기된 코드가 실행됩니다.", risk);

### src/pwa/code_explainer_rules.js:758

- patterns: return makeStep

      752:       return makeStep(lineNo, t, "반복자 만들기", "리스트, 튜플, 파일 같은 반복 가능한 값을 next로 하나씩 꺼낼 수 있는 반복자 형태로 바꿉니다.", risk);
      753:     }
      754:     if (/\breversed\s*\(/.test(t)) {
      755:       return makeStep(lineNo, t, "거꾸로 반복하기", "순서가 있는 값을 뒤에서 앞으로 읽는 반복자를 만듭니다. 실제 리스트가 필요한 경우 list(reversed(...))처럼 감싸는지 확인합니다.", risk);
      756:     }
      757:     if (/\bround\s*\(/.test(t)) {
      758:       return makeStep(lineNo, t, "반올림 계산", "숫자를 정해진 자리수로 반올림합니다. 두 번째 인자가 있으면 소수 몇 자리까지 남길지 정합니다.", risk);
      759:     }
      760:     if (/\babs\s*\(/.test(t)) {
      761:       return makeStep(lineNo, t, "절댓값 계산", "음수와 양수의 부호를 제외하고 크기만 가져옵니다. 거리, 차이, 오차 계산에서 자주 씁니다.", risk);
      762:     }
      763:     if (/\bisinstance\s*\(/.test(t)) {
      764:       return makeStep(lineNo, t, "자료형 확인", "값이 특정 자료형인지 검사합니다. 문자열, 숫자, 리스트처럼 입력 종류에 따라 다르게 처리할 때 씁니다.", risk);
      765:     }
      766:     if (/^if\s+.+:\s*$/.test(t)) {
      767:       return makeStep(lineNo, t, "조건 검사", "조건이 맞으면 바로 아래 들여쓰기된 코드가 실행됩니다.", risk);
      768:     }
      769:     if (/^elif\s+.+:\s*$/.test(t)) {
      770:       return makeStep(lineNo, t, "다른 조건 검사", "앞 조건이 틀렸을 때 추가 조건을 검사합니다.", risk);

### src/pwa/code_explainer_rules.js:761

- patterns: return makeStep

      755:       return makeStep(lineNo, t, "거꾸로 반복하기", "순서가 있는 값을 뒤에서 앞으로 읽는 반복자를 만듭니다. 실제 리스트가 필요한 경우 list(reversed(...))처럼 감싸는지 확인합니다.", risk);
      756:     }
      757:     if (/\bround\s*\(/.test(t)) {
      758:       return makeStep(lineNo, t, "반올림 계산", "숫자를 정해진 자리수로 반올림합니다. 두 번째 인자가 있으면 소수 몇 자리까지 남길지 정합니다.", risk);
      759:     }
      760:     if (/\babs\s*\(/.test(t)) {
      761:       return makeStep(lineNo, t, "절댓값 계산", "음수와 양수의 부호를 제외하고 크기만 가져옵니다. 거리, 차이, 오차 계산에서 자주 씁니다.", risk);
      762:     }
      763:     if (/\bisinstance\s*\(/.test(t)) {
      764:       return makeStep(lineNo, t, "자료형 확인", "값이 특정 자료형인지 검사합니다. 문자열, 숫자, 리스트처럼 입력 종류에 따라 다르게 처리할 때 씁니다.", risk);
      765:     }
      766:     if (/^if\s+.+:\s*$/.test(t)) {
      767:       return makeStep(lineNo, t, "조건 검사", "조건이 맞으면 바로 아래 들여쓰기된 코드가 실행됩니다.", risk);
      768:     }
      769:     if (/^elif\s+.+:\s*$/.test(t)) {
      770:       return makeStep(lineNo, t, "다른 조건 검사", "앞 조건이 틀렸을 때 추가 조건을 검사합니다.", risk);
      771:     }
      772:     if (/^else\s*:\s*$/.test(t)) {
      773:       return makeStep(lineNo, t, "조건이 모두 아닐 때", "앞의 if/elif 조건이 맞지 않을 때 실행되는 부분입니다.", risk);

### src/pwa/code_explainer_rules.js:764

- patterns: return makeStep

      758:       return makeStep(lineNo, t, "반올림 계산", "숫자를 정해진 자리수로 반올림합니다. 두 번째 인자가 있으면 소수 몇 자리까지 남길지 정합니다.", risk);
      759:     }
      760:     if (/\babs\s*\(/.test(t)) {
      761:       return makeStep(lineNo, t, "절댓값 계산", "음수와 양수의 부호를 제외하고 크기만 가져옵니다. 거리, 차이, 오차 계산에서 자주 씁니다.", risk);
      762:     }
      763:     if (/\bisinstance\s*\(/.test(t)) {
      764:       return makeStep(lineNo, t, "자료형 확인", "값이 특정 자료형인지 검사합니다. 문자열, 숫자, 리스트처럼 입력 종류에 따라 다르게 처리할 때 씁니다.", risk);
      765:     }
      766:     if (/^if\s+.+:\s*$/.test(t)) {
      767:       return makeStep(lineNo, t, "조건 검사", "조건이 맞으면 바로 아래 들여쓰기된 코드가 실행됩니다.", risk);
      768:     }
      769:     if (/^elif\s+.+:\s*$/.test(t)) {
      770:       return makeStep(lineNo, t, "다른 조건 검사", "앞 조건이 틀렸을 때 추가 조건을 검사합니다.", risk);
      771:     }
      772:     if (/^else\s*:\s*$/.test(t)) {
      773:       return makeStep(lineNo, t, "조건이 모두 아닐 때", "앞의 if/elif 조건이 맞지 않을 때 실행되는 부분입니다.", risk);
      774:     }
      775:     if (/^continue\s*$/.test(t)) {
      776:       return makeStep(lineNo, t, "다음 반복으로 건너뛰기", "현재 반복에서 남은 코드를 실행하지 않고 다음 항목 처리로 넘어갑니다. 조건에 맞지 않는 파일이나 데이터를 제외할 때 자주 씁니다.", risk);

### src/pwa/code_explainer_rules.js:767

- patterns: return makeStep

      761:       return makeStep(lineNo, t, "절댓값 계산", "음수와 양수의 부호를 제외하고 크기만 가져옵니다. 거리, 차이, 오차 계산에서 자주 씁니다.", risk);
      762:     }
      763:     if (/\bisinstance\s*\(/.test(t)) {
      764:       return makeStep(lineNo, t, "자료형 확인", "값이 특정 자료형인지 검사합니다. 문자열, 숫자, 리스트처럼 입력 종류에 따라 다르게 처리할 때 씁니다.", risk);
      765:     }
      766:     if (/^if\s+.+:\s*$/.test(t)) {
      767:       return makeStep(lineNo, t, "조건 검사", "조건이 맞으면 바로 아래 들여쓰기된 코드가 실행됩니다.", risk);
      768:     }
      769:     if (/^elif\s+.+:\s*$/.test(t)) {
      770:       return makeStep(lineNo, t, "다른 조건 검사", "앞 조건이 틀렸을 때 추가 조건을 검사합니다.", risk);
      771:     }
      772:     if (/^else\s*:\s*$/.test(t)) {
      773:       return makeStep(lineNo, t, "조건이 모두 아닐 때", "앞의 if/elif 조건이 맞지 않을 때 실행되는 부분입니다.", risk);
      774:     }
      775:     if (/^continue\s*$/.test(t)) {
      776:       return makeStep(lineNo, t, "다음 반복으로 건너뛰기", "현재 반복에서 남은 코드를 실행하지 않고 다음 항목 처리로 넘어갑니다. 조건에 맞지 않는 파일이나 데이터를 제외할 때 자주 씁니다.", risk);
      777:     }
      778:     // PYTHON_ITER_JSON_RULES_V201_A1
      779:     if (/^for\s+.+\s+in\s+range\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:770

- patterns: return makeStep

      764:       return makeStep(lineNo, t, "자료형 확인", "값이 특정 자료형인지 검사합니다. 문자열, 숫자, 리스트처럼 입력 종류에 따라 다르게 처리할 때 씁니다.", risk);
      765:     }
      766:     if (/^if\s+.+:\s*$/.test(t)) {
      767:       return makeStep(lineNo, t, "조건 검사", "조건이 맞으면 바로 아래 들여쓰기된 코드가 실행됩니다.", risk);
      768:     }
      769:     if (/^elif\s+.+:\s*$/.test(t)) {
      770:       return makeStep(lineNo, t, "다른 조건 검사", "앞 조건이 틀렸을 때 추가 조건을 검사합니다.", risk);
      771:     }
      772:     if (/^else\s*:\s*$/.test(t)) {
      773:       return makeStep(lineNo, t, "조건이 모두 아닐 때", "앞의 if/elif 조건이 맞지 않을 때 실행되는 부분입니다.", risk);
      774:     }
      775:     if (/^continue\s*$/.test(t)) {
      776:       return makeStep(lineNo, t, "다음 반복으로 건너뛰기", "현재 반복에서 남은 코드를 실행하지 않고 다음 항목 처리로 넘어갑니다. 조건에 맞지 않는 파일이나 데이터를 제외할 때 자주 씁니다.", risk);
      777:     }
      778:     // PYTHON_ITER_JSON_RULES_V201_A1
      779:     if (/^for\s+.+\s+in\s+range\s*\(/.test(t)) {
      780:       return makeStep(lineNo, t, "range 반복", "range는 정해진 횟수나 숫자 범위를 만들어 반복할 때 씁니다. 시작값, 끝값, step이 의도한 범위인지 확인해야 합니다.", risk);
      781:     }
      782:     if (/^for\s+.+\s+in\s+enumerate\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:773

- patterns: return makeStep

      767:       return makeStep(lineNo, t, "조건 검사", "조건이 맞으면 바로 아래 들여쓰기된 코드가 실행됩니다.", risk);
      768:     }
      769:     if (/^elif\s+.+:\s*$/.test(t)) {
      770:       return makeStep(lineNo, t, "다른 조건 검사", "앞 조건이 틀렸을 때 추가 조건을 검사합니다.", risk);
      771:     }
      772:     if (/^else\s*:\s*$/.test(t)) {
      773:       return makeStep(lineNo, t, "조건이 모두 아닐 때", "앞의 if/elif 조건이 맞지 않을 때 실행되는 부분입니다.", risk);
      774:     }
      775:     if (/^continue\s*$/.test(t)) {
      776:       return makeStep(lineNo, t, "다음 반복으로 건너뛰기", "현재 반복에서 남은 코드를 실행하지 않고 다음 항목 처리로 넘어갑니다. 조건에 맞지 않는 파일이나 데이터를 제외할 때 자주 씁니다.", risk);
      777:     }
      778:     // PYTHON_ITER_JSON_RULES_V201_A1
      779:     if (/^for\s+.+\s+in\s+range\s*\(/.test(t)) {
      780:       return makeStep(lineNo, t, "range 반복", "range는 정해진 횟수나 숫자 범위를 만들어 반복할 때 씁니다. 시작값, 끝값, step이 의도한 범위인지 확인해야 합니다.", risk);
      781:     }
      782:     if (/^for\s+.+\s+in\s+enumerate\s*\(/.test(t)) {
      783:       return makeStep(lineNo, t, "enumerate 반복", "enumerate는 목록의 값과 함께 순서 번호를 같이 꺼내 반복합니다. 인덱스와 실제 값이 각각 어디에 들어가는지 확인해야 합니다.", risk);
      784:     }
      785:     if (/^for\s+.+\s+in\s+.+:\s*$/.test(t)) {

### src/pwa/code_explainer_rules.js:776

- patterns: return makeStep

      770:       return makeStep(lineNo, t, "다른 조건 검사", "앞 조건이 틀렸을 때 추가 조건을 검사합니다.", risk);
      771:     }
      772:     if (/^else\s*:\s*$/.test(t)) {
      773:       return makeStep(lineNo, t, "조건이 모두 아닐 때", "앞의 if/elif 조건이 맞지 않을 때 실행되는 부분입니다.", risk);
      774:     }
      775:     if (/^continue\s*$/.test(t)) {
      776:       return makeStep(lineNo, t, "다음 반복으로 건너뛰기", "현재 반복에서 남은 코드를 실행하지 않고 다음 항목 처리로 넘어갑니다. 조건에 맞지 않는 파일이나 데이터를 제외할 때 자주 씁니다.", risk);
      777:     }
      778:     // PYTHON_ITER_JSON_RULES_V201_A1
      779:     if (/^for\s+.+\s+in\s+range\s*\(/.test(t)) {
      780:       return makeStep(lineNo, t, "range 반복", "range는 정해진 횟수나 숫자 범위를 만들어 반복할 때 씁니다. 시작값, 끝값, step이 의도한 범위인지 확인해야 합니다.", risk);
      781:     }
      782:     if (/^for\s+.+\s+in\s+enumerate\s*\(/.test(t)) {
      783:       return makeStep(lineNo, t, "enumerate 반복", "enumerate는 목록의 값과 함께 순서 번호를 같이 꺼내 반복합니다. 인덱스와 실제 값이 각각 어디에 들어가는지 확인해야 합니다.", risk);
      784:     }
      785:     if (/^for\s+.+\s+in\s+.+:\s*$/.test(t)) {
      786:       // QUALITY_EXPLANATION_REFINEMENT_V331_A2
      787:       return makeStep(lineNo, t, "for 반복문 실행", "목록이나 범위에서 값을 하나씩 꺼내어 바로 아래 들여쓰기 블록을 반복 실행합니다. 반복 변수에 어떤 값이 들어가는지 따라가면 흐름을 이해하기 쉽습니다.", risk);
      788:     }

### src/pwa/code_explainer_rules.js:780

- patterns: return makeStep

      774:     }
      775:     if (/^continue\s*$/.test(t)) {
      776:       return makeStep(lineNo, t, "다음 반복으로 건너뛰기", "현재 반복에서 남은 코드를 실행하지 않고 다음 항목 처리로 넘어갑니다. 조건에 맞지 않는 파일이나 데이터를 제외할 때 자주 씁니다.", risk);
      777:     }
      778:     // PYTHON_ITER_JSON_RULES_V201_A1
      779:     if (/^for\s+.+\s+in\s+range\s*\(/.test(t)) {
      780:       return makeStep(lineNo, t, "range 반복", "range는 정해진 횟수나 숫자 범위를 만들어 반복할 때 씁니다. 시작값, 끝값, step이 의도한 범위인지 확인해야 합니다.", risk);
      781:     }
      782:     if (/^for\s+.+\s+in\s+enumerate\s*\(/.test(t)) {
      783:       return makeStep(lineNo, t, "enumerate 반복", "enumerate는 목록의 값과 함께 순서 번호를 같이 꺼내 반복합니다. 인덱스와 실제 값이 각각 어디에 들어가는지 확인해야 합니다.", risk);
      784:     }
      785:     if (/^for\s+.+\s+in\s+.+:\s*$/.test(t)) {
      786:       // QUALITY_EXPLANATION_REFINEMENT_V331_A2
      787:       return makeStep(lineNo, t, "for 반복문 실행", "목록이나 범위에서 값을 하나씩 꺼내어 바로 아래 들여쓰기 블록을 반복 실행합니다. 반복 변수에 어떤 값이 들어가는지 따라가면 흐름을 이해하기 쉽습니다.", risk);
      788:     }
      789:     if (/^while\s+.+:\s*$/.test(t)) {
      790:       return makeStep(lineNo, t, "조건 반복문", "조건이 참인 동안 아래 코드를 계속 반복합니다. 조건이 끝나는지 확인해야 합니다.", risk);
      791:     }
      792:     if (/^with\s+open\s*\(/.test(t) || /open\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:783

- patterns: return makeStep

      777:     }
      778:     // PYTHON_ITER_JSON_RULES_V201_A1
      779:     if (/^for\s+.+\s+in\s+range\s*\(/.test(t)) {
      780:       return makeStep(lineNo, t, "range 반복", "range는 정해진 횟수나 숫자 범위를 만들어 반복할 때 씁니다. 시작값, 끝값, step이 의도한 범위인지 확인해야 합니다.", risk);
      781:     }
      782:     if (/^for\s+.+\s+in\s+enumerate\s*\(/.test(t)) {
      783:       return makeStep(lineNo, t, "enumerate 반복", "enumerate는 목록의 값과 함께 순서 번호를 같이 꺼내 반복합니다. 인덱스와 실제 값이 각각 어디에 들어가는지 확인해야 합니다.", risk);
      784:     }
      785:     if (/^for\s+.+\s+in\s+.+:\s*$/.test(t)) {
      786:       // QUALITY_EXPLANATION_REFINEMENT_V331_A2
      787:       return makeStep(lineNo, t, "for 반복문 실행", "목록이나 범위에서 값을 하나씩 꺼내어 바로 아래 들여쓰기 블록을 반복 실행합니다. 반복 변수에 어떤 값이 들어가는지 따라가면 흐름을 이해하기 쉽습니다.", risk);
      788:     }
      789:     if (/^while\s+.+:\s*$/.test(t)) {
      790:       return makeStep(lineNo, t, "조건 반복문", "조건이 참인 동안 아래 코드를 계속 반복합니다. 조건이 끝나는지 확인해야 합니다.", risk);
      791:     }
      792:     if (/^with\s+open\s*\(/.test(t) || /open\s*\(/.test(t)) {
      793:       return makeStep(lineNo, t, "파일 열기", "파일을 읽거나 쓰기 위해 엽니다. with를 쓰면 작업 후 파일을 자동으로 닫기 쉽습니다.", risk);
      794:     }
      795:     if (/json\.dump\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:787

- patterns: return makeStep

      781:     }
      782:     if (/^for\s+.+\s+in\s+enumerate\s*\(/.test(t)) {
      783:       return makeStep(lineNo, t, "enumerate 반복", "enumerate는 목록의 값과 함께 순서 번호를 같이 꺼내 반복합니다. 인덱스와 실제 값이 각각 어디에 들어가는지 확인해야 합니다.", risk);
      784:     }
      785:     if (/^for\s+.+\s+in\s+.+:\s*$/.test(t)) {
      786:       // QUALITY_EXPLANATION_REFINEMENT_V331_A2
      787:       return makeStep(lineNo, t, "for 반복문 실행", "목록이나 범위에서 값을 하나씩 꺼내어 바로 아래 들여쓰기 블록을 반복 실행합니다. 반복 변수에 어떤 값이 들어가는지 따라가면 흐름을 이해하기 쉽습니다.", risk);
      788:     }
      789:     if (/^while\s+.+:\s*$/.test(t)) {
      790:       return makeStep(lineNo, t, "조건 반복문", "조건이 참인 동안 아래 코드를 계속 반복합니다. 조건이 끝나는지 확인해야 합니다.", risk);
      791:     }
      792:     if (/^with\s+open\s*\(/.test(t) || /open\s*\(/.test(t)) {
      793:       return makeStep(lineNo, t, "파일 열기", "파일을 읽거나 쓰기 위해 엽니다. with를 쓰면 작업 후 파일을 자동으로 닫기 쉽습니다.", risk);
      794:     }
      795:     if (/json\.dump\s*\(/.test(t)) {
      796:       return makeStep(lineNo, t, "JSON 파일 쓰기", "Python 딕셔너리나 리스트를 JSON 형식으로 파일에 저장합니다. ensure_ascii, indent, 파일 인코딩을 확인해야 합니다.", risk);
      797:     }
      798:     if (/json\.dumps\s*\(/.test(t)) {
      799:       return makeStep(lineNo, t, "JSON 문자열 만들기", "Python 딕셔너리나 리스트를 JSON 문자열로 바꿉니다. API 응답, 로그, 파일 저장 전에 자주 씁니다.", risk);

### src/pwa/code_explainer_rules.js:790

- patterns: return makeStep

      784:     }
      785:     if (/^for\s+.+\s+in\s+.+:\s*$/.test(t)) {
      786:       // QUALITY_EXPLANATION_REFINEMENT_V331_A2
      787:       return makeStep(lineNo, t, "for 반복문 실행", "목록이나 범위에서 값을 하나씩 꺼내어 바로 아래 들여쓰기 블록을 반복 실행합니다. 반복 변수에 어떤 값이 들어가는지 따라가면 흐름을 이해하기 쉽습니다.", risk);
      788:     }
      789:     if (/^while\s+.+:\s*$/.test(t)) {
      790:       return makeStep(lineNo, t, "조건 반복문", "조건이 참인 동안 아래 코드를 계속 반복합니다. 조건이 끝나는지 확인해야 합니다.", risk);
      791:     }
      792:     if (/^with\s+open\s*\(/.test(t) || /open\s*\(/.test(t)) {
      793:       return makeStep(lineNo, t, "파일 열기", "파일을 읽거나 쓰기 위해 엽니다. with를 쓰면 작업 후 파일을 자동으로 닫기 쉽습니다.", risk);
      794:     }
      795:     if (/json\.dump\s*\(/.test(t)) {
      796:       return makeStep(lineNo, t, "JSON 파일 쓰기", "Python 딕셔너리나 리스트를 JSON 형식으로 파일에 저장합니다. ensure_ascii, indent, 파일 인코딩을 확인해야 합니다.", risk);
      797:     }
      798:     if (/json\.dumps\s*\(/.test(t)) {
      799:       return makeStep(lineNo, t, "JSON 문자열 만들기", "Python 딕셔너리나 리스트를 JSON 문자열로 바꿉니다. API 응답, 로그, 파일 저장 전에 자주 씁니다.", risk);
      800:     }
      801:     if (/json\.load|json\.loads/.test(t)) {
      802:       return makeStep(lineNo, t, "JSON 읽기", "JSON 형식의 문자열이나 파일 내용을 Python 데이터로 바꿉니다.", risk);

### src/pwa/code_explainer_rules.js:793

- patterns: return makeStep

      787:       return makeStep(lineNo, t, "for 반복문 실행", "목록이나 범위에서 값을 하나씩 꺼내어 바로 아래 들여쓰기 블록을 반복 실행합니다. 반복 변수에 어떤 값이 들어가는지 따라가면 흐름을 이해하기 쉽습니다.", risk);
      788:     }
      789:     if (/^while\s+.+:\s*$/.test(t)) {
      790:       return makeStep(lineNo, t, "조건 반복문", "조건이 참인 동안 아래 코드를 계속 반복합니다. 조건이 끝나는지 확인해야 합니다.", risk);
      791:     }
      792:     if (/^with\s+open\s*\(/.test(t) || /open\s*\(/.test(t)) {
      793:       return makeStep(lineNo, t, "파일 열기", "파일을 읽거나 쓰기 위해 엽니다. with를 쓰면 작업 후 파일을 자동으로 닫기 쉽습니다.", risk);
      794:     }
      795:     if (/json\.dump\s*\(/.test(t)) {
      796:       return makeStep(lineNo, t, "JSON 파일 쓰기", "Python 딕셔너리나 리스트를 JSON 형식으로 파일에 저장합니다. ensure_ascii, indent, 파일 인코딩을 확인해야 합니다.", risk);
      797:     }
      798:     if (/json\.dumps\s*\(/.test(t)) {
      799:       return makeStep(lineNo, t, "JSON 문자열 만들기", "Python 딕셔너리나 리스트를 JSON 문자열로 바꿉니다. API 응답, 로그, 파일 저장 전에 자주 씁니다.", risk);
      800:     }
      801:     if (/json\.load|json\.loads/.test(t)) {
      802:       return makeStep(lineNo, t, "JSON 읽기", "JSON 형식의 문자열이나 파일 내용을 Python 데이터로 바꿉니다.", risk);
      803:     }
      804:     // PANDAS_NUMPY_MAPPING_V231_A1
      805:     if (/pandas\.read_(csv|excel|json)\s*\(|pd\.read_(csv|excel|json)\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:796

- patterns: return makeStep

      790:       return makeStep(lineNo, t, "조건 반복문", "조건이 참인 동안 아래 코드를 계속 반복합니다. 조건이 끝나는지 확인해야 합니다.", risk);
      791:     }
      792:     if (/^with\s+open\s*\(/.test(t) || /open\s*\(/.test(t)) {
      793:       return makeStep(lineNo, t, "파일 열기", "파일을 읽거나 쓰기 위해 엽니다. with를 쓰면 작업 후 파일을 자동으로 닫기 쉽습니다.", risk);
      794:     }
      795:     if (/json\.dump\s*\(/.test(t)) {
      796:       return makeStep(lineNo, t, "JSON 파일 쓰기", "Python 딕셔너리나 리스트를 JSON 형식으로 파일에 저장합니다. ensure_ascii, indent, 파일 인코딩을 확인해야 합니다.", risk);
      797:     }
      798:     if (/json\.dumps\s*\(/.test(t)) {
      799:       return makeStep(lineNo, t, "JSON 문자열 만들기", "Python 딕셔너리나 리스트를 JSON 문자열로 바꿉니다. API 응답, 로그, 파일 저장 전에 자주 씁니다.", risk);
      800:     }
      801:     if (/json\.load|json\.loads/.test(t)) {
      802:       return makeStep(lineNo, t, "JSON 읽기", "JSON 형식의 문자열이나 파일 내용을 Python 데이터로 바꿉니다.", risk);
      803:     }
      804:     // PANDAS_NUMPY_MAPPING_V231_A1
      805:     if (/pandas\.read_(csv|excel|json)\s*\(|pd\.read_(csv|excel|json)\s*\(/.test(t)) {
      806:       return makeStep(lineNo, t, "pandas 파일 읽기", "CSV, Excel, JSON 같은 표 형태 파일을 pandas DataFrame으로 읽습니다. 파일 경로, 인코딩, 구분자, 헤더 행이 맞는지 확인해야 합니다.", risk);
      807:     }
      808:     if (/pd\.DataFrame\s*\(|pandas\.DataFrame\s*\(|pd\.Series\s*\(|pandas\.Series\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:799

- patterns: return makeStep

      793:       return makeStep(lineNo, t, "파일 열기", "파일을 읽거나 쓰기 위해 엽니다. with를 쓰면 작업 후 파일을 자동으로 닫기 쉽습니다.", risk);
      794:     }
      795:     if (/json\.dump\s*\(/.test(t)) {
      796:       return makeStep(lineNo, t, "JSON 파일 쓰기", "Python 딕셔너리나 리스트를 JSON 형식으로 파일에 저장합니다. ensure_ascii, indent, 파일 인코딩을 확인해야 합니다.", risk);
      797:     }
      798:     if (/json\.dumps\s*\(/.test(t)) {
      799:       return makeStep(lineNo, t, "JSON 문자열 만들기", "Python 딕셔너리나 리스트를 JSON 문자열로 바꿉니다. API 응답, 로그, 파일 저장 전에 자주 씁니다.", risk);
      800:     }
      801:     if (/json\.load|json\.loads/.test(t)) {
      802:       return makeStep(lineNo, t, "JSON 읽기", "JSON 형식의 문자열이나 파일 내용을 Python 데이터로 바꿉니다.", risk);
      803:     }
      804:     // PANDAS_NUMPY_MAPPING_V231_A1
      805:     if (/pandas\.read_(csv|excel|json)\s*\(|pd\.read_(csv|excel|json)\s*\(/.test(t)) {
      806:       return makeStep(lineNo, t, "pandas 파일 읽기", "CSV, Excel, JSON 같은 표 형태 파일을 pandas DataFrame으로 읽습니다. 파일 경로, 인코딩, 구분자, 헤더 행이 맞는지 확인해야 합니다.", risk);
      807:     }
      808:     if (/pd\.DataFrame\s*\(|pandas\.DataFrame\s*\(|pd\.Series\s*\(|pandas\.Series\s*\(/.test(t)) {
      809:       return makeStep(lineNo, t, "pandas 표 만들기", "리스트나 딕셔너리 데이터를 pandas DataFrame 또는 Series 구조로 바꿉니다. 이후 필터링, 집계, 저장 같은 표 데이터 처리를 할 수 있습니다.", risk);
      810:     }
      811:     if (/pd\.concat\s*\(|pandas\.concat\s*\(/.test(t)) {

### src/pwa/code_explainer_rules.js:802

- patterns: return makeStep

      796:       return makeStep(lineNo, t, "JSON 파일 쓰기", "Python 딕셔너리나 리스트를 JSON 형식으로 파일에 저장합니다. ensure_ascii, indent, 파일 인코딩을 확인해야 합니다.", risk);
      797:     }
      798:     if (/json\.dumps\s*\(/.test(t)) {
      799:       return makeStep(lineNo, t, "JSON 문자열 만들기", "Python 딕셔너리나 리스트를 JSON 문자열로 바꿉니다. API 응답, 로그, 파일 저장 전에 자주 씁니다.", risk);
      800:     }
      801:     if (/json\.load|json\.loads/.test(t)) {
      802:       return makeStep(lineNo, t, "JSON 읽기", "JSON 형식의 문자열이나 파일 내용을 Python 데이터로 바꿉니다.", risk);
      803:     }
      804:     // PANDAS_NUMPY_MAPPING_V231_A1
      805:     if (/pandas\.read_(csv|excel|json)\s*\(|pd\.read_(csv|excel|json)\s*\(/.test(t)) {
      806:       return makeStep(lineNo, t, "pandas 파일 읽기", "CSV, Excel, JSON 같은 표 형태 파일을 pandas DataFrame으로 읽습니다. 파일 경로, 인코딩, 구분자, 헤더 행이 맞는지 확인해야 합니다.", risk);
      807:     }
      808:     if (/pd\.DataFrame\s*\(|pandas\.DataFrame\s*\(|pd\.Series\s*\(|pandas\.Series\s*\(/.test(t)) {
      809:       return makeStep(lineNo, t, "pandas 표 만들기", "리스트나 딕셔너리 데이터를 pandas DataFrame 또는 Series 구조로 바꿉니다. 이후 필터링, 집계, 저장 같은 표 데이터 처리를 할 수 있습니다.", risk);
      810:     }
      811:     if (/pd\.concat\s*\(|pandas\.concat\s*\(/.test(t)) {
      812:       return makeStep(lineNo, t, "pandas 표 이어붙이기", "여러 DataFrame을 위아래 또는 좌우로 이어 붙입니다. axis 방향과 인덱스 중복 여부를 확인해야 합니다.", risk);
      813:     }
      814:     if (/\.head\s*\(|\.tail\s*\(|\.info\s*\(|\.describe\s*\(|\.shape\b|\.columns\b/.test(t)) {

### src/pwa/code_explainer_rules.js:806

- patterns: return makeStep

      800:     }
      801:     if (/json\.load|json\.loads/.test(t)) {
      802:       return makeStep(lineNo, t, "JSON 읽기", "JSON 형식의 문자열이나 파일 내용을 Python 데이터로 바꿉니다.", risk);
      803:     }
      804:     // PANDAS_NUMPY_MAPPING_V231_A1
      805:     if (/pandas\.read_(csv|excel|json)\s*\(|pd\.read_(csv|excel|json)\s*\(/.test(t)) {
      806:       return makeStep(lineNo, t, "pandas 파일 읽기", "CSV, Excel, JSON 같은 표 형태 파일을 pandas DataFrame으로 읽습니다. 파일 경로, 인코딩, 구분자, 헤더 행이 맞는지 확인해야 합니다.", risk);
      807:     }
      808:     if (/pd\.DataFrame\s*\(|pandas\.DataFrame\s*\(|pd\.Series\s*\(|pandas\.Series\s*\(/.test(t)) {
      809:       return makeStep(lineNo, t, "pandas 표 만들기", "리스트나 딕셔너리 데이터를 pandas DataFrame 또는 Series 구조로 바꿉니다. 이후 필터링, 집계, 저장 같은 표 데이터 처리를 할 수 있습니다.", risk);
      810:     }
      811:     if (/pd\.concat\s*\(|pandas\.concat\s*\(/.test(t)) {
      812:       return makeStep(lineNo, t, "pandas 표 이어붙이기", "여러 DataFrame을 위아래 또는 좌우로 이어 붙입니다. axis 방향과 인덱스 중복 여부를 확인해야 합니다.", risk);
      813:     }
      814:     if (/\.head\s*\(|\.tail\s*\(|\.info\s*\(|\.describe\s*\(|\.shape\b|\.columns\b/.test(t)) {
      815:       return makeStep(lineNo, t, "pandas 미리보기/요약", "표 데이터의 앞뒤 일부, 열 이름, 크기, 자료형, 통계 요약을 확인합니다. 본격 처리 전에 데이터 구조를 점검하는 단계입니다.", risk);
      816:     }
      817:     if (/\.loc\s*\[|\.iloc\s*\[/.test(t)) {
      818:       return makeStep(lineNo, t, "pandas 행/열 선택", "loc 또는 iloc으로 표에서 필요한 행과 열을 선택합니다. loc은 이름 기준, iloc은 위치 번호 기준이라는 차이를 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:809

- patterns: return makeStep

      803:     }
      804:     // PANDAS_NUMPY_MAPPING_V231_A1
      805:     if (/pandas\.read_(csv|excel|json)\s*\(|pd\.read_(csv|excel|json)\s*\(/.test(t)) {
      806:       return makeStep(lineNo, t, "pandas 파일 읽기", "CSV, Excel, JSON 같은 표 형태 파일을 pandas DataFrame으로 읽습니다. 파일 경로, 인코딩, 구분자, 헤더 행이 맞는지 확인해야 합니다.", risk);
      807:     }
      808:     if (/pd\.DataFrame\s*\(|pandas\.DataFrame\s*\(|pd\.Series\s*\(|pandas\.Series\s*\(/.test(t)) {
      809:       return makeStep(lineNo, t, "pandas 표 만들기", "리스트나 딕셔너리 데이터를 pandas DataFrame 또는 Series 구조로 바꿉니다. 이후 필터링, 집계, 저장 같은 표 데이터 처리를 할 수 있습니다.", risk);
      810:     }
      811:     if (/pd\.concat\s*\(|pandas\.concat\s*\(/.test(t)) {
      812:       return makeStep(lineNo, t, "pandas 표 이어붙이기", "여러 DataFrame을 위아래 또는 좌우로 이어 붙입니다. axis 방향과 인덱스 중복 여부를 확인해야 합니다.", risk);
      813:     }
      814:     if (/\.head\s*\(|\.tail\s*\(|\.info\s*\(|\.describe\s*\(|\.shape\b|\.columns\b/.test(t)) {
      815:       return makeStep(lineNo, t, "pandas 미리보기/요약", "표 데이터의 앞뒤 일부, 열 이름, 크기, 자료형, 통계 요약을 확인합니다. 본격 처리 전에 데이터 구조를 점검하는 단계입니다.", risk);
      816:     }
      817:     if (/\.loc\s*\[|\.iloc\s*\[/.test(t)) {
      818:       return makeStep(lineNo, t, "pandas 행/열 선택", "loc 또는 iloc으로 표에서 필요한 행과 열을 선택합니다. loc은 이름 기준, iloc은 위치 번호 기준이라는 차이를 확인해야 합니다.", risk);
      819:     }
      820:     if (/\.sort_values\s*\(|\.value_counts\s*\(/.test(t)) {
      821:       return makeStep(lineNo, t, "pandas 정렬/빈도 계산", "표 데이터를 특정 열 기준으로 정렬하거나 값별 개수를 셉니다. 어떤 열을 기준으로 보는지 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:812

- patterns: return makeStep

      806:       return makeStep(lineNo, t, "pandas 파일 읽기", "CSV, Excel, JSON 같은 표 형태 파일을 pandas DataFrame으로 읽습니다. 파일 경로, 인코딩, 구분자, 헤더 행이 맞는지 확인해야 합니다.", risk);
      807:     }
      808:     if (/pd\.DataFrame\s*\(|pandas\.DataFrame\s*\(|pd\.Series\s*\(|pandas\.Series\s*\(/.test(t)) {
      809:       return makeStep(lineNo, t, "pandas 표 만들기", "리스트나 딕셔너리 데이터를 pandas DataFrame 또는 Series 구조로 바꿉니다. 이후 필터링, 집계, 저장 같은 표 데이터 처리를 할 수 있습니다.", risk);
      810:     }
      811:     if (/pd\.concat\s*\(|pandas\.concat\s*\(/.test(t)) {
      812:       return makeStep(lineNo, t, "pandas 표 이어붙이기", "여러 DataFrame을 위아래 또는 좌우로 이어 붙입니다. axis 방향과 인덱스 중복 여부를 확인해야 합니다.", risk);
      813:     }
      814:     if (/\.head\s*\(|\.tail\s*\(|\.info\s*\(|\.describe\s*\(|\.shape\b|\.columns\b/.test(t)) {
      815:       return makeStep(lineNo, t, "pandas 미리보기/요약", "표 데이터의 앞뒤 일부, 열 이름, 크기, 자료형, 통계 요약을 확인합니다. 본격 처리 전에 데이터 구조를 점검하는 단계입니다.", risk);
      816:     }
      817:     if (/\.loc\s*\[|\.iloc\s*\[/.test(t)) {
      818:       return makeStep(lineNo, t, "pandas 행/열 선택", "loc 또는 iloc으로 표에서 필요한 행과 열을 선택합니다. loc은 이름 기준, iloc은 위치 번호 기준이라는 차이를 확인해야 합니다.", risk);
      819:     }
      820:     if (/\.sort_values\s*\(|\.value_counts\s*\(/.test(t)) {
      821:       return makeStep(lineNo, t, "pandas 정렬/빈도 계산", "표 데이터를 특정 열 기준으로 정렬하거나 값별 개수를 셉니다. 어떤 열을 기준으로 보는지 확인해야 합니다.", risk);
      822:     }
      823:     if (/\.isna\s*\(|\.notna\s*\(|\.fillna\s*\(|\.dropna\s*\(|\.astype\s*\(/.test(t)) {
      824:       return makeStep(lineNo, t, "pandas 결측값/자료형 처리", "비어 있는 값 확인, 채우기, 제거, 자료형 변환을 수행합니다. 원본 데이터가 바뀌는지와 변환 실패 가능성을 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:815

- patterns: return makeStep

      809:       return makeStep(lineNo, t, "pandas 표 만들기", "리스트나 딕셔너리 데이터를 pandas DataFrame 또는 Series 구조로 바꿉니다. 이후 필터링, 집계, 저장 같은 표 데이터 처리를 할 수 있습니다.", risk);
      810:     }
      811:     if (/pd\.concat\s*\(|pandas\.concat\s*\(/.test(t)) {
      812:       return makeStep(lineNo, t, "pandas 표 이어붙이기", "여러 DataFrame을 위아래 또는 좌우로 이어 붙입니다. axis 방향과 인덱스 중복 여부를 확인해야 합니다.", risk);
      813:     }
      814:     if (/\.head\s*\(|\.tail\s*\(|\.info\s*\(|\.describe\s*\(|\.shape\b|\.columns\b/.test(t)) {
      815:       return makeStep(lineNo, t, "pandas 미리보기/요약", "표 데이터의 앞뒤 일부, 열 이름, 크기, 자료형, 통계 요약을 확인합니다. 본격 처리 전에 데이터 구조를 점검하는 단계입니다.", risk);
      816:     }
      817:     if (/\.loc\s*\[|\.iloc\s*\[/.test(t)) {
      818:       return makeStep(lineNo, t, "pandas 행/열 선택", "loc 또는 iloc으로 표에서 필요한 행과 열을 선택합니다. loc은 이름 기준, iloc은 위치 번호 기준이라는 차이를 확인해야 합니다.", risk);
      819:     }
      820:     if (/\.sort_values\s*\(|\.value_counts\s*\(/.test(t)) {
      821:       return makeStep(lineNo, t, "pandas 정렬/빈도 계산", "표 데이터를 특정 열 기준으로 정렬하거나 값별 개수를 셉니다. 어떤 열을 기준으로 보는지 확인해야 합니다.", risk);
      822:     }
      823:     if (/\.isna\s*\(|\.notna\s*\(|\.fillna\s*\(|\.dropna\s*\(|\.astype\s*\(/.test(t)) {
      824:       return makeStep(lineNo, t, "pandas 결측값/자료형 처리", "비어 있는 값 확인, 채우기, 제거, 자료형 변환을 수행합니다. 원본 데이터가 바뀌는지와 변환 실패 가능성을 확인해야 합니다.", risk);
      825:     }
      826:     if (/\.groupby\s*\(/.test(t)) {
      827:       return makeStep(lineNo, t, "pandas 그룹 집계", "특정 열 값을 기준으로 행을 묶고 합계, 평균, 개수 같은 집계를 계산합니다. 그룹 기준 열과 집계 대상 열을 함께 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:818

- patterns: return makeStep

      812:       return makeStep(lineNo, t, "pandas 표 이어붙이기", "여러 DataFrame을 위아래 또는 좌우로 이어 붙입니다. axis 방향과 인덱스 중복 여부를 확인해야 합니다.", risk);
      813:     }
      814:     if (/\.head\s*\(|\.tail\s*\(|\.info\s*\(|\.describe\s*\(|\.shape\b|\.columns\b/.test(t)) {
      815:       return makeStep(lineNo, t, "pandas 미리보기/요약", "표 데이터의 앞뒤 일부, 열 이름, 크기, 자료형, 통계 요약을 확인합니다. 본격 처리 전에 데이터 구조를 점검하는 단계입니다.", risk);
      816:     }
      817:     if (/\.loc\s*\[|\.iloc\s*\[/.test(t)) {
      818:       return makeStep(lineNo, t, "pandas 행/열 선택", "loc 또는 iloc으로 표에서 필요한 행과 열을 선택합니다. loc은 이름 기준, iloc은 위치 번호 기준이라는 차이를 확인해야 합니다.", risk);
      819:     }
      820:     if (/\.sort_values\s*\(|\.value_counts\s*\(/.test(t)) {
      821:       return makeStep(lineNo, t, "pandas 정렬/빈도 계산", "표 데이터를 특정 열 기준으로 정렬하거나 값별 개수를 셉니다. 어떤 열을 기준으로 보는지 확인해야 합니다.", risk);
      822:     }
      823:     if (/\.isna\s*\(|\.notna\s*\(|\.fillna\s*\(|\.dropna\s*\(|\.astype\s*\(/.test(t)) {
      824:       return makeStep(lineNo, t, "pandas 결측값/자료형 처리", "비어 있는 값 확인, 채우기, 제거, 자료형 변환을 수행합니다. 원본 데이터가 바뀌는지와 변환 실패 가능성을 확인해야 합니다.", risk);
      825:     }
      826:     if (/\.groupby\s*\(/.test(t)) {
      827:       return makeStep(lineNo, t, "pandas 그룹 집계", "특정 열 값을 기준으로 행을 묶고 합계, 평균, 개수 같은 집계를 계산합니다. 그룹 기준 열과 집계 대상 열을 함께 확인해야 합니다.", risk);
      828:     }
      829:     if (/pd\.merge\s*\(|pandas\.merge\s*\(|\.merge\s*\(|\.join\s*\(/.test(t)) {
      830:       return makeStep(lineNo, t, "pandas 표 병합", "공통 열이나 인덱스를 기준으로 두 표를 합칩니다. 조인 방식, 중복 행, 누락값 발생 여부를 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:821

- patterns: return makeStep

      815:       return makeStep(lineNo, t, "pandas 미리보기/요약", "표 데이터의 앞뒤 일부, 열 이름, 크기, 자료형, 통계 요약을 확인합니다. 본격 처리 전에 데이터 구조를 점검하는 단계입니다.", risk);
      816:     }
      817:     if (/\.loc\s*\[|\.iloc\s*\[/.test(t)) {
      818:       return makeStep(lineNo, t, "pandas 행/열 선택", "loc 또는 iloc으로 표에서 필요한 행과 열을 선택합니다. loc은 이름 기준, iloc은 위치 번호 기준이라는 차이를 확인해야 합니다.", risk);
      819:     }
      820:     if (/\.sort_values\s*\(|\.value_counts\s*\(/.test(t)) {
      821:       return makeStep(lineNo, t, "pandas 정렬/빈도 계산", "표 데이터를 특정 열 기준으로 정렬하거나 값별 개수를 셉니다. 어떤 열을 기준으로 보는지 확인해야 합니다.", risk);
      822:     }
      823:     if (/\.isna\s*\(|\.notna\s*\(|\.fillna\s*\(|\.dropna\s*\(|\.astype\s*\(/.test(t)) {
      824:       return makeStep(lineNo, t, "pandas 결측값/자료형 처리", "비어 있는 값 확인, 채우기, 제거, 자료형 변환을 수행합니다. 원본 데이터가 바뀌는지와 변환 실패 가능성을 확인해야 합니다.", risk);
      825:     }
      826:     if (/\.groupby\s*\(/.test(t)) {
      827:       return makeStep(lineNo, t, "pandas 그룹 집계", "특정 열 값을 기준으로 행을 묶고 합계, 평균, 개수 같은 집계를 계산합니다. 그룹 기준 열과 집계 대상 열을 함께 확인해야 합니다.", risk);
      828:     }
      829:     if (/pd\.merge\s*\(|pandas\.merge\s*\(|\.merge\s*\(|\.join\s*\(/.test(t)) {
      830:       return makeStep(lineNo, t, "pandas 표 병합", "공통 열이나 인덱스를 기준으로 두 표를 합칩니다. 조인 방식, 중복 행, 누락값 발생 여부를 확인해야 합니다.", risk);
      831:     }
      832:     if (/np\.array\s*\(|numpy\.array\s*\(/.test(t)) {
      833:       return makeStep(lineNo, t, "NumPy 배열 만들기", "리스트 같은 값을 NumPy 배열로 바꿉니다. 수치 계산, 벡터 연산, 형태 변경을 빠르게 처리하기 위한 기본 구조입니다.", risk);

### src/pwa/code_explainer_rules.js:824

- patterns: return makeStep

      818:       return makeStep(lineNo, t, "pandas 행/열 선택", "loc 또는 iloc으로 표에서 필요한 행과 열을 선택합니다. loc은 이름 기준, iloc은 위치 번호 기준이라는 차이를 확인해야 합니다.", risk);
      819:     }
      820:     if (/\.sort_values\s*\(|\.value_counts\s*\(/.test(t)) {
      821:       return makeStep(lineNo, t, "pandas 정렬/빈도 계산", "표 데이터를 특정 열 기준으로 정렬하거나 값별 개수를 셉니다. 어떤 열을 기준으로 보는지 확인해야 합니다.", risk);
      822:     }
      823:     if (/\.isna\s*\(|\.notna\s*\(|\.fillna\s*\(|\.dropna\s*\(|\.astype\s*\(/.test(t)) {
      824:       return makeStep(lineNo, t, "pandas 결측값/자료형 처리", "비어 있는 값 확인, 채우기, 제거, 자료형 변환을 수행합니다. 원본 데이터가 바뀌는지와 변환 실패 가능성을 확인해야 합니다.", risk);
      825:     }
      826:     if (/\.groupby\s*\(/.test(t)) {
      827:       return makeStep(lineNo, t, "pandas 그룹 집계", "특정 열 값을 기준으로 행을 묶고 합계, 평균, 개수 같은 집계를 계산합니다. 그룹 기준 열과 집계 대상 열을 함께 확인해야 합니다.", risk);
      828:     }
      829:     if (/pd\.merge\s*\(|pandas\.merge\s*\(|\.merge\s*\(|\.join\s*\(/.test(t)) {
      830:       return makeStep(lineNo, t, "pandas 표 병합", "공통 열이나 인덱스를 기준으로 두 표를 합칩니다. 조인 방식, 중복 행, 누락값 발생 여부를 확인해야 합니다.", risk);
      831:     }
      832:     if (/np\.array\s*\(|numpy\.array\s*\(/.test(t)) {
      833:       return makeStep(lineNo, t, "NumPy 배열 만들기", "리스트 같은 값을 NumPy 배열로 바꿉니다. 수치 계산, 벡터 연산, 형태 변경을 빠르게 처리하기 위한 기본 구조입니다.", risk);
      834:     }
      835:     if (/np\.(zeros|ones|arange|linspace)\s*\(|numpy\.(zeros|ones|arange|linspace)\s*\(/.test(t)) {
      836:       return makeStep(lineNo, t, "NumPy 기본 배열 생성", "0이나 1로 채운 배열, 일정 간격 숫자 배열을 만듭니다. shape, 시작값, 끝값, 간격 조건을 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:827

- patterns: return makeStep

      821:       return makeStep(lineNo, t, "pandas 정렬/빈도 계산", "표 데이터를 특정 열 기준으로 정렬하거나 값별 개수를 셉니다. 어떤 열을 기준으로 보는지 확인해야 합니다.", risk);
      822:     }
      823:     if (/\.isna\s*\(|\.notna\s*\(|\.fillna\s*\(|\.dropna\s*\(|\.astype\s*\(/.test(t)) {
      824:       return makeStep(lineNo, t, "pandas 결측값/자료형 처리", "비어 있는 값 확인, 채우기, 제거, 자료형 변환을 수행합니다. 원본 데이터가 바뀌는지와 변환 실패 가능성을 확인해야 합니다.", risk);
      825:     }
      826:     if (/\.groupby\s*\(/.test(t)) {
      827:       return makeStep(lineNo, t, "pandas 그룹 집계", "특정 열 값을 기준으로 행을 묶고 합계, 평균, 개수 같은 집계를 계산합니다. 그룹 기준 열과 집계 대상 열을 함께 확인해야 합니다.", risk);
      828:     }
      829:     if (/pd\.merge\s*\(|pandas\.merge\s*\(|\.merge\s*\(|\.join\s*\(/.test(t)) {
      830:       return makeStep(lineNo, t, "pandas 표 병합", "공통 열이나 인덱스를 기준으로 두 표를 합칩니다. 조인 방식, 중복 행, 누락값 발생 여부를 확인해야 합니다.", risk);
      831:     }
      832:     if (/np\.array\s*\(|numpy\.array\s*\(/.test(t)) {
      833:       return makeStep(lineNo, t, "NumPy 배열 만들기", "리스트 같은 값을 NumPy 배열로 바꿉니다. 수치 계산, 벡터 연산, 형태 변경을 빠르게 처리하기 위한 기본 구조입니다.", risk);
      834:     }
      835:     if (/np\.(zeros|ones|arange|linspace)\s*\(|numpy\.(zeros|ones|arange|linspace)\s*\(/.test(t)) {
      836:       return makeStep(lineNo, t, "NumPy 기본 배열 생성", "0이나 1로 채운 배열, 일정 간격 숫자 배열을 만듭니다. shape, 시작값, 끝값, 간격 조건을 확인해야 합니다.", risk);
      837:     }
      838:     if (/np\.(mean|median|std|sum|min|max)\s*\(|numpy\.(mean|median|std|sum|min|max)\s*\(/.test(t)) {
      839:       return makeStep(lineNo, t, "NumPy 통계 계산", "배열의 평균, 중앙값, 표준편차, 합계, 최솟값, 최댓값 같은 통계값을 계산합니다. axis 기준이 있는지 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:830

- patterns: return makeStep

      824:       return makeStep(lineNo, t, "pandas 결측값/자료형 처리", "비어 있는 값 확인, 채우기, 제거, 자료형 변환을 수행합니다. 원본 데이터가 바뀌는지와 변환 실패 가능성을 확인해야 합니다.", risk);
      825:     }
      826:     if (/\.groupby\s*\(/.test(t)) {
      827:       return makeStep(lineNo, t, "pandas 그룹 집계", "특정 열 값을 기준으로 행을 묶고 합계, 평균, 개수 같은 집계를 계산합니다. 그룹 기준 열과 집계 대상 열을 함께 확인해야 합니다.", risk);
      828:     }
      829:     if (/pd\.merge\s*\(|pandas\.merge\s*\(|\.merge\s*\(|\.join\s*\(/.test(t)) {
      830:       return makeStep(lineNo, t, "pandas 표 병합", "공통 열이나 인덱스를 기준으로 두 표를 합칩니다. 조인 방식, 중복 행, 누락값 발생 여부를 확인해야 합니다.", risk);
      831:     }
      832:     if (/np\.array\s*\(|numpy\.array\s*\(/.test(t)) {
      833:       return makeStep(lineNo, t, "NumPy 배열 만들기", "리스트 같은 값을 NumPy 배열로 바꿉니다. 수치 계산, 벡터 연산, 형태 변경을 빠르게 처리하기 위한 기본 구조입니다.", risk);
      834:     }
      835:     if (/np\.(zeros|ones|arange|linspace)\s*\(|numpy\.(zeros|ones|arange|linspace)\s*\(/.test(t)) {
      836:       return makeStep(lineNo, t, "NumPy 기본 배열 생성", "0이나 1로 채운 배열, 일정 간격 숫자 배열을 만듭니다. shape, 시작값, 끝값, 간격 조건을 확인해야 합니다.", risk);
      837:     }
      838:     if (/np\.(mean|median|std|sum|min|max)\s*\(|numpy\.(mean|median|std|sum|min|max)\s*\(/.test(t)) {
      839:       return makeStep(lineNo, t, "NumPy 통계 계산", "배열의 평균, 중앙값, 표준편차, 합계, 최솟값, 최댓값 같은 통계값을 계산합니다. axis 기준이 있는지 확인해야 합니다.", risk);
      840:     }
      841:     if (/\.reshape\s*\(/.test(t)) {
      842:       return makeStep(lineNo, t, "NumPy 형태 변경", "배열의 전체 원소 수는 유지하면서 행과 열 모양을 바꿉니다. 바꾸려는 shape가 원소 개수와 맞는지 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:833

- patterns: return makeStep

      827:       return makeStep(lineNo, t, "pandas 그룹 집계", "특정 열 값을 기준으로 행을 묶고 합계, 평균, 개수 같은 집계를 계산합니다. 그룹 기준 열과 집계 대상 열을 함께 확인해야 합니다.", risk);
      828:     }
      829:     if (/pd\.merge\s*\(|pandas\.merge\s*\(|\.merge\s*\(|\.join\s*\(/.test(t)) {
      830:       return makeStep(lineNo, t, "pandas 표 병합", "공통 열이나 인덱스를 기준으로 두 표를 합칩니다. 조인 방식, 중복 행, 누락값 발생 여부를 확인해야 합니다.", risk);
      831:     }
      832:     if (/np\.array\s*\(|numpy\.array\s*\(/.test(t)) {
      833:       return makeStep(lineNo, t, "NumPy 배열 만들기", "리스트 같은 값을 NumPy 배열로 바꿉니다. 수치 계산, 벡터 연산, 형태 변경을 빠르게 처리하기 위한 기본 구조입니다.", risk);
      834:     }
      835:     if (/np\.(zeros|ones|arange|linspace)\s*\(|numpy\.(zeros|ones|arange|linspace)\s*\(/.test(t)) {
      836:       return makeStep(lineNo, t, "NumPy 기본 배열 생성", "0이나 1로 채운 배열, 일정 간격 숫자 배열을 만듭니다. shape, 시작값, 끝값, 간격 조건을 확인해야 합니다.", risk);
      837:     }
      838:     if (/np\.(mean|median|std|sum|min|max)\s*\(|numpy\.(mean|median|std|sum|min|max)\s*\(/.test(t)) {
      839:       return makeStep(lineNo, t, "NumPy 통계 계산", "배열의 평균, 중앙값, 표준편차, 합계, 최솟값, 최댓값 같은 통계값을 계산합니다. axis 기준이 있는지 확인해야 합니다.", risk);
      840:     }
      841:     if (/\.reshape\s*\(/.test(t)) {
      842:       return makeStep(lineNo, t, "NumPy 형태 변경", "배열의 전체 원소 수는 유지하면서 행과 열 모양을 바꿉니다. 바꾸려는 shape가 원소 개수와 맞는지 확인해야 합니다.", risk);
      843:     }
      844:     if (/np\.where\s*\(|numpy\.where\s*\(/.test(t)) {
      845:       return makeStep(lineNo, t, "NumPy 조건 선택", "조건이 참일 때와 거짓일 때 사용할 값을 골라 새 배열을 만듭니다. 벡터화된 if 처리처럼 자주 씁니다.", risk);

### src/pwa/code_explainer_rules.js:836

- patterns: return makeStep

      830:       return makeStep(lineNo, t, "pandas 표 병합", "공통 열이나 인덱스를 기준으로 두 표를 합칩니다. 조인 방식, 중복 행, 누락값 발생 여부를 확인해야 합니다.", risk);
      831:     }
      832:     if (/np\.array\s*\(|numpy\.array\s*\(/.test(t)) {
      833:       return makeStep(lineNo, t, "NumPy 배열 만들기", "리스트 같은 값을 NumPy 배열로 바꿉니다. 수치 계산, 벡터 연산, 형태 변경을 빠르게 처리하기 위한 기본 구조입니다.", risk);
      834:     }
      835:     if (/np\.(zeros|ones|arange|linspace)\s*\(|numpy\.(zeros|ones|arange|linspace)\s*\(/.test(t)) {
      836:       return makeStep(lineNo, t, "NumPy 기본 배열 생성", "0이나 1로 채운 배열, 일정 간격 숫자 배열을 만듭니다. shape, 시작값, 끝값, 간격 조건을 확인해야 합니다.", risk);
      837:     }
      838:     if (/np\.(mean|median|std|sum|min|max)\s*\(|numpy\.(mean|median|std|sum|min|max)\s*\(/.test(t)) {
      839:       return makeStep(lineNo, t, "NumPy 통계 계산", "배열의 평균, 중앙값, 표준편차, 합계, 최솟값, 최댓값 같은 통계값을 계산합니다. axis 기준이 있는지 확인해야 합니다.", risk);
      840:     }
      841:     if (/\.reshape\s*\(/.test(t)) {
      842:       return makeStep(lineNo, t, "NumPy 형태 변경", "배열의 전체 원소 수는 유지하면서 행과 열 모양을 바꿉니다. 바꾸려는 shape가 원소 개수와 맞는지 확인해야 합니다.", risk);
      843:     }
      844:     if (/np\.where\s*\(|numpy\.where\s*\(/.test(t)) {
      845:       return makeStep(lineNo, t, "NumPy 조건 선택", "조건이 참일 때와 거짓일 때 사용할 값을 골라 새 배열을 만듭니다. 벡터화된 if 처리처럼 자주 씁니다.", risk);
      846:     }
      847:     if (/np\.random\.(rand|randn|randint|choice|seed)\s*\(|numpy\.random\.(rand|randn|randint|choice|seed)\s*\(/.test(t)) {
      848:       return makeStep(lineNo, t, "NumPy 무작위 값", "배열 형태의 난수나 무작위 선택값을 만듭니다. 재현 가능한 결과가 필요하면 seed 설정 여부를 확인해야 합니다.", risk);

### src/pwa/code_explainer_rules.js:839

- patterns: return makeStep

      833:       return makeStep(lineNo, t, "NumPy 배열 만들기", "리스트 같은 값을 NumPy 배열로 바꿉니다. 수치 계산, 벡터 연산, 형태 변경을 빠르게 처리하기 위한 기본 구조입니다.", risk);
      834:     }
      835:     if (/np\.(zeros|ones|arange|linspace)\s*\(|numpy\.(zeros|ones|arange|linspace)\s*\(/.test(t)) {
      836:       return makeStep(lineNo, t, "NumPy 기본 배열 생성", "0이나 1로 채운 배열, 일정 간격 숫자 배열을 만듭니다. shape, 시작값, 끝값, 간격 조건을 확인해야 합니다.", risk);
      837:     }
      838:     if (/np\.(mean|median|std|sum|min|max)\s*\(|numpy\.(mean|median|std|sum|min|max)\s*\(/.test(t)) {
      839:       return makeStep(lineNo, t, "NumPy 통계 계산", "배열의 평균, 중앙값, 표준편차, 합계, 최솟값, 최댓값 같은 통계값을 계산합니다. axis 기준이 있는지 확인해야 합니다.", risk);
      840:     }
      841:     if (/\.reshape\s*\(/.test(t)) {
      842:       return makeStep(lineNo, t, "NumPy 형태 변경", "배열의 전체 원소 수는 유지하면서 행과 열 모양을 바꿉니다. 바꾸려는 shape가 원소 개수와 맞는지 확인해야 합니다.", risk);
      843:     }
      844:     if (/np\.where\s*\(|numpy\.where\s*\(/.test(t)) {
      845:       return makeStep(lineNo, t, "NumPy 조건 선택", "조건이 참일 때와 거짓일 때 사용할 값을 골라 새 배열을 만듭니다. 벡터화된 if 처리처럼 자주 씁니다.", risk);
      846:     }
      847:     if (/np\.random\.(rand|randn|randint|choice|seed)\s*\(|numpy\.random\.(rand|randn|randint|choice|seed)\s*\(/.test(t)) {
      848:       return makeStep(lineNo, t, "NumPy 무작위 값", "배열 형태의 난수나 무작위 선택값을 만듭니다. 재현 가능한 결과가 필요하면 seed 설정 여부를 확인해야 합니다.", risk);
      849:     }
      850:     if (/pandas\.read_csv|pd\.read_csv/.test(t)) {
      851:       return makeStep(lineNo, t, "CSV 표 읽기", "CSV 파일을 표 형태 데이터로 읽습니다.", risk);

### src/pwa/code_explainer_rules.js:842

- patterns: return makeStep

      836:       return makeStep(lineNo, t, "NumPy 기본 배열 생성", "0이나 1로 채운 배열, 일정 간격 숫자 배열을 만듭니다. shape, 시작값, 끝값, 간격 조건을 확인해야 합니다.", risk);
      837:     }
      838:     if (/np\.(mean|median|std|sum|min|max)\s*\(|numpy\.(mean|median|std|sum|min|max)\s*\(/.test(t)) {
      839:       return makeStep(lineNo, t, "NumPy 통계 계산", "배열의 평균, 중앙값, 표준편차, 합계, 최솟값, 최댓값 같은 통계값을 계산합니다. axis 기준이 있는지 확인해야 합니다.", risk);
      840:     }
      841:     if (/\.reshape\s*\(/.test(t)) {
      842:       return makeStep(lineNo, t, "NumPy 형태 변경", "배열의 전체 원소 수는 유지하면서 행과 열 모양을 바꿉니다. 바꾸려는 shape가 원소 개수와 맞는지 확인해야 합니다.", risk);
      843:     }
      844:     if (/np\.where\s*\(|numpy\.where\s*\(/.test(t)) {
      845:       return makeStep(lineNo, t, "NumPy 조건 선택", "조건이 참일 때와 거짓일 때 사용할 값을 골라 새 배열을 만듭니다. 벡터화된 if 처리처럼 자주 씁니다.", risk);
      846:     }
      847:     if (/np\.random\.(rand|randn|randint|choice|seed)\s*\(|numpy\.random\.(rand|randn|randint|choice|seed)\s*\(/.test(t)) {
      848:       return makeStep(lineNo, t, "NumPy 무작위 값", "배열 형태의 난수나 무작위 선택값을 만듭니다. 재현 가능한 결과가 필요하면 seed 설정 여부를 확인해야 합니다.", risk);
      849:     }
      850:     if (/pandas\.read_csv|pd\.read_csv/.test(t)) {
      851:       return makeStep(lineNo, t, "CSV 표 읽기", "CSV 파일을 표 형태 데이터로 읽습니다.", risk);
      852:     }
      853:     if (/requests\.(get|post|put|delete)/.test(t)) {
      854:       return makeStep(lineNo, t, "HTTP 요청", "웹 API나 URL에 요청을 보냅니다. timeout과 오류 처리가 있는지 확인하는 것이 좋습니다.", risk);

### src/pwa/code_explainer_rules.js:845

- patterns: return makeStep

      839:       return makeStep(lineNo, t, "NumPy 통계 계산", "배열의 평균, 중앙값, 표준편차, 합계, 최솟값, 최댓값 같은 통계값을 계산합니다. axis 기준이 있는지 확인해야 합니다.", risk);
      840:     }
      841:     if (/\.reshape\s*\(/.test(t)) {
      842:       return makeStep(lineNo, t, "NumPy 형태 변경", "배열의 전체 원소 수는 유지하면서 행과 열 모양을 바꿉니다. 바꾸려는 shape가 원소 개수와 맞는지 확인해야 합니다.", risk);
      843:     }
      844:     if (/np\.where\s*\(|numpy\.where\s*\(/.test(t)) {
      845:       return makeStep(lineNo, t, "NumPy 조건 선택", "조건이 참일 때와 거짓일 때 사용할 값을 골라 새 배열을 만듭니다. 벡터화된 if 처리처럼 자주 씁니다.", risk);
      846:     }
      847:     if (/np\.random\.(rand|randn|randint|choice|seed)\s*\(|numpy\.random\.(rand|randn|randint|choice|seed)\s*\(/.test(t)) {
      848:       return makeStep(lineNo, t, "NumPy 무작위 값", "배열 형태의 난수나 무작위 선택값을 만듭니다. 재현 가능한 결과가 필요하면 seed 설정 여부를 확인해야 합니다.", risk);
      849:     }
      850:     if (/pandas\.read_csv|pd\.read_csv/.test(t)) {
      851:       return makeStep(lineNo, t, "CSV 표 읽기", "CSV 파일을 표 형태 데이터로 읽습니다.", risk);
      852:     }
      853:     if (/requests\.(get|post|put|delete)/.test(t)) {
      854:       return makeStep(lineNo, t, "HTTP 요청", "웹 API나 URL에 요청을 보냅니다. timeout과 오류 처리가 있는지 확인하는 것이 좋습니다.", risk);
      855:     }
      856:     if (/argparse\.ArgumentParser|\.add_argument\s*\(|\.parse_args\s*\(/.test(t)) {
      857:       return makeStep(lineNo, t, "명령행 인자 처리", "터미널에서 받은 --input 같은 옵션을 정의하거나 읽습니다.", risk);

### src/pwa/code_explainer_rules.js:848

- patterns: return makeStep

      842:       return makeStep(lineNo, t, "NumPy 형태 변경", "배열의 전체 원소 수는 유지하면서 행과 열 모양을 바꿉니다. 바꾸려는 shape가 원소 개수와 맞는지 확인해야 합니다.", risk);
      843:     }
      844:     if (/np\.where\s*\(|numpy\.where\s*\(/.test(t)) {
      845:       return makeStep(lineNo, t, "NumPy 조건 선택", "조건이 참일 때와 거짓일 때 사용할 값을 골라 새 배열을 만듭니다. 벡터화된 if 처리처럼 자주 씁니다.", risk);
      846:     }
      847:     if (/np\.random\.(rand|randn|randint|choice|seed)\s*\(|numpy\.random\.(rand|randn|randint|choice|seed)\s*\(/.test(t)) {
      848:       return makeStep(lineNo, t, "NumPy 무작위 값", "배열 형태의 난수나 무작위 선택값을 만듭니다. 재현 가능한 결과가 필요하면 seed 설정 여부를 확인해야 합니다.", risk);
      849:     }
      850:     if (/pandas\.read_csv|pd\.read_csv/.test(t)) {
      851:       return makeStep(lineNo, t, "CSV 표 읽기", "CSV 파일을 표 형태 데이터로 읽습니다.", risk);
      852:     }
      853:     if (/requests\.(get|post|put|delete)/.test(t)) {
      854:       return makeStep(lineNo, t, "HTTP 요청", "웹 API나 URL에 요청을 보냅니다. timeout과 오류 처리가 있는지 확인하는 것이 좋습니다.", risk);
      855:     }
      856:     if (/argparse\.ArgumentParser|\.add_argument\s*\(|\.parse_args\s*\(/.test(t)) {
      857:       return makeStep(lineNo, t, "명령행 인자 처리", "터미널에서 받은 --input 같은 옵션을 정의하거나 읽습니다.", risk);
      858:     }
      859: 
      860:     // PYTHON_STDLIB_COMMON_MAPPING_V228_A1

### src/pwa/code_explainer_rules.js:851

- patterns: return makeStep

      845:       return makeStep(lineNo, t, "NumPy 조건 선택", "조건이 참일 때와 거짓일 때 사용할 값을 골라 새 배열을 만듭니다. 벡터화된 if 처리처럼 자주 씁니다.", risk);
      846:     }
      847:     if (/np\.random\.(rand|randn|randint|choice|seed)\s*\(|numpy\.random\.(rand|randn|randint|choice|seed)\s*\(/.test(t)) {
      848:       return makeStep(lineNo, t, "NumPy 무작위 값", "배열 형태의 난수나 무작위 선택값을 만듭니다. 재현 가능한 결과가 필요하면 seed 설정 여부를 확인해야 합니다.", risk);
      849:     }
      850:     if (/pandas\.read_csv|pd\.read_csv/.test(t)) {
      851:       return makeStep(lineNo, t, "CSV 표 읽기", "CSV 파일을 표 형태 데이터로 읽습니다.", risk);
      852:     }
      853:     if (/requests\.(get|post|put|delete)/.test(t)) {
      854:       return makeStep(lineNo, t, "HTTP 요청", "웹 API나 URL에 요청을 보냅니다. timeout과 오류 처리가 있는지 확인하는 것이 좋습니다.", risk);
      855:     }
      856:     if (/argparse\.ArgumentParser|\.add_argument\s*\(|\.parse_args\s*\(/.test(t)) {
      857:       return makeStep(lineNo, t, "명령행 인자 처리", "터미널에서 받은 --input 같은 옵션을 정의하거나 읽습니다.", risk);
      858:     }
      859: 
      860:     // PYTHON_STDLIB_COMMON_MAPPING_V228_A1
      861:     if (/traceback\.(format_exc|print_exc|extract_tb|format_exception)\s*\(/.test(t)) {
      862:       return makeStep(lineNo, t, "traceback 오류 정보 처리", "예외가 발생했을 때 호출 경로와 오류 위치 정보를 문자열로 만들거나 출력합니다. 디버깅 로그와 오류 보고에 자주 씁니다.", risk);
      863:     }

### src/pwa/code_explainer_rules.js:854

- patterns: return makeStep

      848:       return makeStep(lineNo, t, "NumPy 무작위 값", "배열 형태의 난수나 무작위 선택값을 만듭니다. 재현 가능한 결과가 필요하면 seed 설정 여부를 확인해야 합니다.", risk);
      849:     }
      850:     if (/pandas\.read_csv|pd\.read_csv/.test(t)) {
      851:       return makeStep(lineNo, t, "CSV 표 읽기", "CSV 파일을 표 형태 데이터로 읽습니다.", risk);
      852:     }
      853:     if (/requests\.(get|post|put|delete)/.test(t)) {
      854:       return makeStep(lineNo, t, "HTTP 요청", "웹 API나 URL에 요청을 보냅니다. timeout과 오류 처리가 있는지 확인하는 것이 좋습니다.", risk);
      855:     }
      856:     if (/argparse\.ArgumentParser|\.add_argument\s*\(|\.parse_args\s*\(/.test(t)) {
      857:       return makeStep(lineNo, t, "명령행 인자 처리", "터미널에서 받은 --input 같은 옵션을 정의하거나 읽습니다.", risk);
      858:     }
      859: 
      860:     // PYTHON_STDLIB_COMMON_MAPPING_V228_A1
      861:     if (/traceback\.(format_exc|print_exc|extract_tb|format_exception)\s*\(/.test(t)) {
      862:       return makeStep(lineNo, t, "traceback 오류 정보 처리", "예외가 발생했을 때 호출 경로와 오류 위치 정보를 문자열로 만들거나 출력합니다. 디버깅 로그와 오류 보고에 자주 씁니다.", risk);
      863:     }
      864:     if (/\btime\.(time|sleep|perf_counter|strftime|localtime)\s*\(/.test(t)) {
      865:       return makeStep(lineNo, t, "time 시간 처리", "현재 시각을 구하거나 잠시 멈추거나 실행 시간을 재는 표준 라이브러리 기능입니다. 대기 시간과 측정 기준을 확인해야 합니다.", risk);
      866:     }

### src/pwa/code_explainer_rules.js:857

- patterns: return makeStep

      851:       return makeStep(lineNo, t, "CSV 표 읽기", "CSV 파일을 표 형태 데이터로 읽습니다.", risk);
      852:     }
      853:     if (/requests\.(get|post|put|delete)/.test(t)) {
      854:       return makeStep(lineNo, t, "HTTP 요청", "웹 API나 URL에 요청을 보냅니다. timeout과 오류 처리가 있는지 확인하는 것이 좋습니다.", risk);
      855:     }
      856:     if (/argparse\.ArgumentParser|\.add_argument\s*\(|\.parse_args\s*\(/.test(t)) {
      857:       return makeStep(lineNo, t, "명령행 인자 처리", "터미널에서 받은 --input 같은 옵션을 정의하거나 읽습니다.", risk);
      858:     }
      859: 
      860:     // PYTHON_STDLIB_COMMON_MAPPING_V228_A1
      861:     if (/traceback\.(format_exc|print_exc|extract_tb|format_exception)\s*\(/.test(t)) {
      862:       return makeStep(lineNo, t, "traceback 오류 정보 처리", "예외가 발생했을 때 호출 경로와 오류 위치 정보를 문자열로 만들거나 출력합니다. 디버깅 로그와 오류 보고에 자주 씁니다.", risk);
      863:     }
      864:     if (/\btime\.(time|sleep|perf_counter|strftime|localtime)\s*\(/.test(t)) {
      865:       return makeStep(lineNo, t, "time 시간 처리", "현재 시각을 구하거나 잠시 멈추거나 실행 시간을 재는 표준 라이브러리 기능입니다. 대기 시간과 측정 기준을 확인해야 합니다.", risk);
      866:     }
      867:     if (/^@dataclass\b|dataclasses\.dataclass\s*\(/.test(t)) {
      868:       return makeStep(lineNo, t, "dataclass 데이터 클래스", "반복해서 쓰는 데이터 묶음 클래스를 간단히 정의하게 해줍니다. 필드 이름과 기본값이 객체 구조를 결정합니다.", risk);
      869:     }


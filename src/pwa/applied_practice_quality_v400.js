(function (root) {
  "use strict";
  if (!root) return;

  const VERSION = "v400_applied_practice_r3";
  const SESSION_KEY = "python-reading-trainer-contextual-practice-session-v351";
  const PROGRESS_KEY = "python-reading-trainer-progress-v1";
  const FUNCTION_SPECIFIC = new Set(["def", "function", "parameter", "argument", "return", "scope"]);

  const ALIAS = {
    print: ["output"], output: ["print"], variable: ["assignment"], assignment: ["variable"],
    reassign: ["assignment", "variable"], str: ["string"], string: ["str"], int: ["number"], float: ["number"],
    if: ["condition"], elif: ["condition"], else: ["condition"], comparison: ["condition"], bool: ["condition"],
    for: ["loop"], while: ["loop"], range: ["loop"], break: ["loop"], continue: ["loop"],
    def: ["function"], parameter: ["function"], argument: ["function"], return: ["function"], scope: ["function"],
    index: ["list"], append: ["list"], key: ["dict"], get: ["dict"]
  };

  const VARIANTS = [
    { id:"v400_print", moduleId:"basics", kind:"output_prediction", requires:[["print","output"]], tags:["print","output"], code:'print("Ready")', qko:"이 코드를 실행하면 무엇이 출력될까요?", qen:"What will this code print?", cko:["Ready","\"Ready\"","print"], cen:["Ready","\"Ready\"","print"], a:0, eko:"print()는 Ready라는 글자를 출력하며 따옴표 자체는 출력하지 않습니다.", een:"print() displays Ready; the quote characters are not printed." },
    { id:"v400_assignment", moduleId:"basics", kind:"value_trace", requires:[["variable","assignment"]], tags:["variable","assignment","reassign"], code:"score = 3\nscore = 8", qko:"두 번째 줄까지 실행한 뒤 score에 저장된 값은 무엇일까요?", qen:"After the second line, what is stored in score?", cko:["3","8","11"], cen:["3","8","11"], a:1, eko:"두 번째 대입이 이전 값 3을 8로 바꿉니다.", een:"The second assignment replaces 3 with 8." },
    { id:"v400_input_store", moduleId:"basics", kind:"input_trace", requires:[["input"],["variable","assignment"]], tags:["input","variable","assignment"], code:'name = input("Name: ")', qko:"사용자가 Mina라고 입력했다면 name에 저장되는 값은 무엇일까요?", qen:"If the user types Mina, what is stored in name?", cko:["Mina","Name:","input"], cen:["Mina","Name:","input"], a:0, eko:"input()이 돌려준 Mina가 name에 저장됩니다.", een:"input() returns Mina, which is stored in name." },
    { id:"v400_input_print", moduleId:"basics", kind:"input_output_trace", requires:[["input"],["variable","assignment"],["print","output"]], tags:["input","variable","assignment","print","output"], code:'name = input("Name: ")\nprint(name)', qko:"사용자가 Mina라고 입력했다면 마지막 줄에서 무엇이 출력될까요?", qen:"If the user types Mina, what will the final line print?", cko:["Mina","Name:","None"], cen:["Mina","Name:","None"], a:0, eko:"Mina가 name에 저장되고 print(name)이 그 값을 출력합니다.", een:"Mina is stored in name and print(name) displays it." },
    { id:"v400_type", moduleId:"basics", kind:"type_reasoning", requires:[["type"],["variable","assignment"]], tags:["type"], code:'value = "7"', qko:"value에 저장된 값의 자료형은 무엇일까요?", qen:"What is the type of the value stored in value?", cko:["문자열(str)","정수(int)","불리언(bool)"], cen:["str","int","bool"], a:0, eko:"7이 따옴표 안에 있으므로 문자열(str)입니다.", een:"Because 7 is inside quotes, it is a string." },
    { id:"v400_if_combo", moduleId:"condition", kind:"branch_value_trace", requires:[["if","condition"],["variable","assignment"]], tags:["if","condition","comparison","bool"], code:'score = 7\nresult = "retry"\nif score >= 5:\n    result = "pass"', qko:"코드가 끝난 뒤 result에 저장된 값은 무엇일까요?", qen:"What is stored in result after the code finishes?", cko:["retry","pass","7"], cen:["retry","pass","7"], a:1, eko:"7 >= 5가 참이므로 result가 pass로 바뀝니다.", een:"7 >= 5 is true, so result becomes pass." },
    { id:"v400_list_combo", moduleId:"collections", kind:"collection_lookup", requires:[["list"],["variable","assignment"]], tags:["list","index"], code:'items = ["red", "green", "blue"]\nselected = items[1]', qko:"selected에 저장되는 값은 무엇일까요?", qen:"What is stored in selected?", cko:["red","green","blue"], cen:["red","green","blue"], a:1, eko:"인덱스는 0부터 시작하므로 items[1]은 green입니다.", een:"Indexes start at 0, so items[1] is green." },
    { id:"v400_loop_combo", moduleId:"loop", kind:"loop_trace", requires:[["for","loop"],["list"],["variable","assignment"]], tags:["for","loop"], code:'last = ""\nfor name in ["A", "B", "C"]:\n    last = name', qko:"반복이 모두 끝난 뒤 last에 남는 값은 무엇일까요?", qen:"What remains in last after the loop?", cko:["A","B","C"], cen:["A","B","C"], a:2, eko:"매 반복마다 last가 바뀌므로 마지막 값 C가 남습니다.", een:"last changes each iteration, so C remains." },
    { id:"v400_function_combo", moduleId:"functions", kind:"call_trace", requires:[["def","function"],["return"],["variable","assignment"]], tags:["def","function","return","parameter","argument"], code:'def double(x):\n    return x * 2\n\nresult = double(4)', qko:"함수 호출이 끝난 뒤 result에 저장되는 값은 무엇일까요?", qen:"What is stored in result after the call?", cko:["4","8","None"], cen:["4","8","None"], a:1, eko:"double(4)가 8을 돌려주므로 result에는 8이 저장됩니다.", een:"double(4) returns 8, so result stores 8." }
  ];

  function norm(v) { return String(v == null ? "" : v).trim().toLowerCase(); }
  function add(set, value) {
    const key = norm(value); if (!key) return; set.add(key);
    (ALIAS[key] || []).forEach(function (x) { set.add(x); });
  }
  function expand(set) {
    let changed = true;
    while (changed) {
      changed = false;
      Array.from(set).forEach(function (key) { (ALIAS[key] || []).forEach(function (x) { if (!set.has(x)) { set.add(x); changed = true; } }); });
    }
    return set;
  }
  function concepts(card, resolver) {
    const out = new Set(); if (!card) return out;
    (Array.isArray(card.concepts) ? card.concepts : []).forEach(function (x) { add(out, x); });
    add(out, card.primary_concept);
    try { if (typeof resolver === "function") add(out, resolver(card)); } catch (_) {}
    const code = String(card.code || "");
    [["input",/\binput\s*\(/],["print",/\bprint\s*\(/],["type",/\btype\s*\(/],["len",/\blen\s*\(/],["def",/\bdef\b/],["return",/\breturn\b/],["for",/\bfor\b/],["while",/\bwhile\b/],["if",/\b(?:if|elif|else)\b/],["comment",/^\s*#/m],["comparison",/(?:==|!=|<=|>=|<|>)/],["assignment",/(^|\n)\s*[A-Za-z_][A-Za-z0-9_]*\s*=(?!=)/],["list",/\[[^\]\n]*\]/],["dict",/\{[^}\n]*:[^}\n]*\}/]].forEach(function (row) { if (row[1].test(code)) add(out, row[0]); });
    return expand(out);
  }
  function read(storage, key) { try { const raw = storage && storage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (_) { return null; } }
  function sourceCard(win, rows, session) {
    const sourceId = session ? String(session.sourceCardId || "") : "";
    if (sourceId) {
      for (let i = 0; i < rows.length; i += 1) {
        if (rows[i] && String(rows[i].id || "") === sourceId) return rows[i];
      }
      return null;
    }
    try { if (typeof win.getCurrentCard === "function") { const card = win.getCurrentCard(); if (card) return card; } } catch (_) {}
    try { if (typeof currentIndex !== "undefined" && rows[currentIndex]) return rows[currentIndex]; } catch (_) {}
    return null;
  }
  function learned(win, rows, count, resolver, source) {
    const out = new Set(), progress = read(win.localStorage, PROGRESS_KEY), byId = new Map();
    rows.forEach(function (card) { if (card && card.id) byId.set(String(card.id), card); });
    let matched = 0;
    if (progress && progress.correct) Object.keys(progress.correct).forEach(function (id) { if (progress.correct[id] && byId.has(id)) { matched += 1; concepts(byId.get(id), resolver).forEach(function (x) { add(out, x); }); } });
    if (!matched && !progress) rows.slice(0, Math.max(0, Number(count || 0))).forEach(function (card) { concepts(card, resolver).forEach(function (x) { add(out, x); }); });
    if (source) concepts(source, resolver).forEach(function (x) { add(out, x); });
    return expand(out);
  }
  function functionKnown(set) { return Array.from(FUNCTION_SPECIFIC).some(function (x) { return set.has(x); }); }
  function groupOk(group, set, engine) {
    return (group || []).some(function (token) {
      const key = norm(token); if (key[0] !== "@") return set.has(key);
      const family = key.slice(1);
      if (family === "function") return functionKnown(set);
      return Array.from(set).some(function (x) { try { return engine.familyOf(x) === family; } catch (_) { return false; } });
    });
  }
  function requirementsOk(req, set, engine) { return (req || []).every(function (group) { return groupOk(group, set, engine); }); }
  function score(variant, source, primary, engine) {
    let s = variant.tags.some(function (x) { return norm(x) === norm(primary); }) ? 100 : 0;
    variant.tags.forEach(function (x) { if (source.has(norm(x))) s += 10; });
    variant.requires.forEach(function (g) { if (groupOk(g, source, engine)) s += 2; });
    return s;
  }
  function pick(learnedSet, sourceSet, moduleId, primary, reason, engine) {
    let rows = VARIANTS.filter(function (v) { return (!moduleId || v.moduleId === moduleId) && requirementsOk(v.requires, learnedSet, engine); });
    if (!rows.length) return null;
    if (sourceSet.size) { const related = rows.filter(function (v) { return score(v, sourceSet, primary, engine) > 0; }); if (related.length) rows = related; }
    rows.sort(function (a,b) {
      const d = score(b, sourceSet, primary, engine) - score(a, sourceSet, primary, engine); if (d) return d;
      if (reason === "weak") return a.requires.length - b.requires.length;
      return b.requires.length - a.requires.length || a.id.localeCompare(b.id);
    });
    return rows[0];
  }
  function mission(v, locale) {
    const en = locale === "en", choices = (en ? v.cen : v.cko).slice();
    return { id:v.id, kind:v.kind, moduleId:v.moduleId, code:v.code, question:en?v.qen:v.qko, choices:choices, answerIndex:v.a, explanation:en?v.een:v.eko, quality:VERSION };
  }
  function unavailableMission(locale, moduleId, boundary) {
    const en = locale === "en";
    return {
      id: "practice_unavailable",
      kind: "unavailable",
      moduleId: moduleId || "",
      code: "",
      question: en
        ? "There is not yet a reliable applied problem that uses only what you have learned. Continue learning and try again later."
        : "현재까지 배운 내용만으로 안전하게 만들 수 있는 응용 문제가 아직 없습니다. 학습을 조금 더 진행한 뒤 다시 풀어보세요.",
      choices: [],
      answerIndex: -1,
      explanation: "",
      boundary: Number(boundary || 0),
      unavailable: true,
      quality: VERSION
    };
  }
  function bad(m) {
    if (!m || !Array.isArray(m.choices) || m.choices.length < 2) return true;
    if (m.id === "fallback_recent_concept" || m.kind === "concept_trace") return true;
    const q = String(m.question || "").toLowerCase();
    return q.includes("학습 개념은 무엇일까요") || q.includes("learned concept should you trace first");
  }
  function safeOriginal(engine, m, learnedSet) {
    if (bad(m)) return false;
    const t = (engine.PRACTICE_TEMPLATES || []).find(function (x) { return x.id === m.id; });
    return !t || requirementsOk(t.requires || [], learnedSet, engine);
  }
  function moduleHasSafePractice(engine, moduleId, learnedSet) {
    const custom = VARIANTS.some(function (v) { return v.moduleId === moduleId && requirementsOk(v.requires, learnedSet, engine); });
    if (custom) return true;
    return (engine.PRACTICE_TEMPLATES || []).some(function (t) {
      return t.moduleId === moduleId && requirementsOk(t.requires || [], learnedSet, engine);
    });
  }
  function primary(card, resolver) {
    try { if (typeof resolver === "function") { const p = norm(resolver(card)); if (p && p !== "call") return p; } } catch (_) {}
    const set = concepts(card, resolver), order = ["input","print","assignment","type","comment","if","for","while","list","dict","def","function","return"];
    for (let i=0;i<order.length;i+=1) if (set.has(order[i])) return order[i];
    return norm(card && card.primary_concept);
  }

  function install(win) {
    const engine = win.LearningEngineV341;
    if (!engine || engine.__appliedPracticeQualityV400) return !!engine;
    const basePractice = engine.missionForPracticeModule && engine.missionForPracticeModule.bind(engine);
    const baseCheckpoint = engine.missionForCheckpoint && engine.missionForCheckpoint.bind(engine);
    const baseUnlocked = engine.unlockedPracticeModules && engine.unlockedPracticeModules.bind(engine);
    if (!basePractice || !baseCheckpoint) return false;

    engine.missionForPracticeModule = function (moduleId, count, locale, cardsValue, resolver) {
      const rows = Array.isArray(cardsValue) ? cardsValue : [], session = read(win.sessionStorage, SESSION_KEY);
      const src = session ? sourceCard(win, rows, session) : null, known = learned(win, rows, count, resolver, src), srcSet = concepts(src, resolver), p = primary(src, resolver);
      if (src) {
        const v = pick(known, srcSet, moduleId, p, session && session.reason, engine);
        if (v) { const m = mission(v, locale); m.checkpoint=0; m.boundary=Number(count||0); m.moduleId=moduleId; m.sourceCardId=String(src.id||""); m.sourceMode="current_or_learned_combination"; return m; }
      }
      const original = basePractice(moduleId, count, locale, rows, resolver);
      if (safeOriginal(engine, original, known)) return original;
      const v = pick(known, new Set(), moduleId, "", "learned", engine) || pick(known, new Set(), "", "", "learned", engine);
      if (v) { const m = mission(v, locale); m.checkpoint=0; m.boundary=Number(count||0); m.moduleId=moduleId; m.sourceMode="learned_combination"; return m; }
      return unavailableMission(locale, moduleId, count);
    };

    engine.missionForCheckpoint = function (n, locale, cardsValue, resolver) {
      const rows = Array.isArray(cardsValue) ? cardsValue : [], boundary = Math.min(rows.length, Math.max(0, Number(n||1))*Number(engine.CHECKPOINT_INTERVAL||30));
      const known = learned(win, rows, boundary, resolver, null), original = baseCheckpoint(n, locale, rows, resolver);
      if (safeOriginal(engine, original, known)) return original;
      const v = pick(known, new Set(), "", "", "checkpoint", engine);
      if (!v) return unavailableMission(locale, "checkpoint", boundary);
      const m = mission(v, locale); m.checkpoint=Number(n||1); m.boundary=boundary; m.sourceMode="learned_combination"; return m;
    };

    if (baseUnlocked) engine.unlockedPracticeModules = function (count, cardsValue, resolver) {
      const baseRows = baseUnlocked(count, cardsValue, resolver), known = learned(win, cardsValue||[], count, resolver, null);
      return baseRows.map(function (mod) {
        if (!mod || !mod.unlocked) return mod;
        if (mod.id === "functions" && !functionKnown(known)) {
          let first = -1;
          for (let i=0;i<(cardsValue||[]).length;i+=1) if (functionKnown(concepts(cardsValue[i], resolver))) { first=i; break; }
          const at=first>=0?first+1:null;
          return Object.assign({}, mod, {unlockAt:at, unlocked:false, remaining:at==null?null:Math.max(0,at-Number(count||0))});
        }
        if (!moduleHasSafePractice(engine, mod.id, known)) {
          return Object.assign({}, mod, {unlocked:false, remaining:null});
        }
        return mod;
      });
    };

    engine.__appliedPracticeQualityV400 = VERSION;
    if (win.document && win.document.documentElement) win.document.documentElement.dataset.appliedPracticeQualityV400 = VERSION;
    return true;
  }

  root.AppliedPracticeQualityV400 = Object.freeze({ version:VERSION, variants:VARIANTS.slice(), install:install, badMission:bad });
  install(root);
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : null));
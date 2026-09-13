"use strict";

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const overlayPath = path.join(ROOT, "src", "pwa", "applied_practice_quality_v400.js");
const contextualPath = path.join(ROOT, "src", "pwa", "contextual_practice_v351.js");
const loaderPath = path.join(ROOT, "src", "pwa", "admin_local_loader_v400_7.js");
const pwaIndexPath = path.join(ROOT, "src", "pwa", "index.html");
const rootIndexPath = path.join(ROOT, "index.html");
const overlaySource = fs.readFileSync(overlayPath, "utf8");
const contextualSource = fs.readFileSync(contextualPath, "utf8");
const loaderSource = fs.readFileSync(loaderPath, "utf8");
const pwaIndexSource = fs.readFileSync(pwaIndexPath, "utf8");
const rootIndexSource = fs.readFileSync(rootIndexPath, "utf8");
let failures = 0;
function check(name, ok, detail) {
  const pass = Boolean(ok);
  console.log(name + "=" + (pass ? "PASS" : "FAIL") + (detail ? " DETAIL=" + detail : ""));
  if (!pass) failures += 1;
}

function storage(initial) {
  const data = Object.assign({}, initial || {});
  return {
    getItem(key) { return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null; },
    setItem(key, value) { data[key] = String(value); },
    removeItem(key) { delete data[key]; }
  };
}

const cards = [
  { id: "P1", concepts: ["print"], primary_concept: "print", code: 'print("hello")' },
  { id: "I1", concepts: ["call", "assignment"], primary_concept: "call", code: 'age = input("Age: ")\nprint(age)' }
];
const current = cards[0];
const source = cards[1];
const progress = { correct: { P1: 1, I1: 1 }, seen: { P1: 1, I1: 1 }, confused: {} };
const sessionValue = { moduleId: "basics", reason: "milestone", sourceCardId: "I1", returnIndex: 2, completed: false };

const engine = {
  CHECKPOINT_INTERVAL: 30,
  PRACTICE_TEMPLATES: [
    { id: "valid_basic", moduleId: "basics", requires: [["print", "output"]] }
  ],
  _mode: "bad",
  familyOf(value) {
    const key = String(value || "").toLowerCase();
    return key === "call" ? "function" : key;
  },
  missionForPracticeModule() {
    if (this._mode === "valid") {
      return { id: "valid_basic", kind: "output_prediction", code: 'print("ok")', question: "무엇이 출력될까요?", choices: ["ok", "no"], answerIndex: 0, explanation: "ok" };
    }
    if (this._mode === "family") {
      return { id: "family_func", kind: "call_trace", code: "helper()", question: "무엇이 실행될까요?", choices: ["helper", "none"], answerIndex: 0, explanation: "helper" };
    }
    return { id: "fallback_recent_concept", kind: "concept_trace", code: source.code, question: "이 코드를 읽을 때 먼저 추적할 학습 개념은 무엇일까요?", choices: ["assignment", "call", "comment"], answerIndex: 0, explanation: "assignment" };
  },
  missionForCheckpoint() {
    return { id: "fallback_recent_concept", kind: "concept_trace", code: source.code, question: "이 코드를 읽을 때 먼저 추적할 학습 개념은 무엇일까요?", choices: ["assignment", "call", "comment"], answerIndex: 0, explanation: "assignment" };
  },
  unlockedPracticeModules() {
    return [
      { id: "basics", unlocked: true, unlockAt: 1, remaining: 0 },
      { id: "functions", unlocked: true, unlockAt: 2, remaining: 0 }
    ];
  }
};

const documentElement = { dataset: {} };
const win = {
  LearningEngineV341: engine,
  localStorage: storage({ "python-reading-trainer-progress-v1": JSON.stringify(progress) }),
  sessionStorage: storage({ "python-reading-trainer-contextual-practice-session-v351": JSON.stringify(sessionValue) }),
  document: { documentElement },
  getCurrentCard() { return current; }
};
win.window = win;
win.globalThis = win;

const context = vm.createContext({
  window: win,
  globalThis: win,
  console,
  Set,
  Map,
  Array,
  Object,
  String,
  Number,
  Math,
  JSON,
  RegExp,
  Boolean
});
vm.runInContext(overlaySource, context, { filename: "applied_practice_quality_v400.js" });

const resolver = card => card.primary_concept || (card.concepts && card.concepts[0]) || "";
const mission = engine.missionForPracticeModule("basics", 2, "ko", cards, resolver);
check("CURRENT_INPUT_IS_APPLIED_PROBLEM", mission.id !== "fallback_recent_concept" && mission.kind !== "concept_trace", mission.id + ":" + mission.kind);
check("SESSION_SOURCE_SURVIVES_CURRENT_CARD_DRIFT", /input\s*\(/.test(mission.code) && mission.sourceCardId === "I1" && current.id !== mission.sourceCardId, mission.id + ":current=" + current.id + ":source=" + mission.sourceCardId);
check("ANSWER_DERIVED_FROM_CODE", mission.choices[mission.answerIndex] === "Mina", JSON.stringify(mission.choices));
check("NO_CONCEPT_GUESS_PROMPT", !/학습 개념은 무엇일까요/.test(mission.question), mission.question);
check("SOURCE_MODE_RECORDED", mission.sourceMode === "current_or_learned_combination", String(mission.sourceMode));

const modules = engine.unlockedPracticeModules(2, cards, resolver);
const fn = modules.find(row => row.id === "functions");
check("GENERIC_CALL_DOES_NOT_UNLOCK_FUNCTIONS", fn && fn.unlocked === false, JSON.stringify(fn));

const checkpoint = engine.missionForCheckpoint(1, "ko", cards, resolver);
check("CHECKPOINT_NO_CONCEPT_FALLBACK", checkpoint.id !== "fallback_recent_concept" && checkpoint.kind !== "concept_trace", checkpoint.id + ":" + checkpoint.kind);

win.sessionStorage.removeItem("python-reading-trainer-contextual-practice-session-v351");
engine._mode = "valid";
const valid = engine.missionForPracticeModule("basics", 2, "ko", cards, resolver);
check("VALID_LEARNED_TEMPLATE_RETAINED", valid.id === "valid_basic", valid.id);

engine.PRACTICE_TEMPLATES.push({ id: "family_func", moduleId: "functions", requires: [["@function"]] });
engine._mode = "family";
const callOnlyCards = [{ id: "X1", concepts: ["call"], primary_concept: "call", code: "helper()" }];
win.localStorage.setItem("python-reading-trainer-progress-v1", JSON.stringify({ correct: { X1: 1 }, seen: { X1: 1 }, confused: {} }));
const callOnlyMission = engine.missionForPracticeModule("functions", 1, "ko", callOnlyCards, resolver);
check("FUNCTION_FAMILY_REQUIRES_FUNCTION_SPECIFIC_LEARNING", callOnlyMission.id === "practice_unavailable" && callOnlyMission.unavailable === true, callOnlyMission.id + ":" + callOnlyMission.kind);
check("NO_SAFE_PROBLEM_MEANS_NO_FAKE_QUESTION", Array.isArray(callOnlyMission.choices) && callOnlyMission.choices.length === 0 && !/학습 개념은 무엇일까요/.test(callOnlyMission.question), callOnlyMission.question);
const callOnlyModules = engine.unlockedPracticeModules(1, callOnlyCards, resolver);
const callOnlyFunctionModule = callOnlyModules.find(row => row.id === "functions");
check("CALL_ONLY_FUNCTION_MODULE_LOCKED", callOnlyFunctionModule && callOnlyFunctionModule.unlocked === false, JSON.stringify(callOnlyFunctionModule));
const callOnlyCheckpoint = engine.missionForCheckpoint(1, "ko", callOnlyCards, resolver);
check("UNSAFE_CHECKPOINT_BECOMES_UNAVAILABLE", callOnlyCheckpoint.id === "practice_unavailable" && callOnlyCheckpoint.unavailable === true, callOnlyCheckpoint.id + ":" + callOnlyCheckpoint.kind);

check("OVERLAY_EXPOSES_AUDIT_API", win.AppliedPracticeQualityV400 && win.AppliedPracticeQualityV400.version === "v400_applied_practice_r3", win.AppliedPracticeQualityV400 && win.AppliedPracticeQualityV400.version);
check("CALL_NOT_ALIASED_TO_FUNCTION", !/call\s*:\s*\[\s*["']function["']/.test(overlaySource), "generic call remains separate");
check("FUNCTION_FAMILY_GUARD_PRESENT", overlaySource.includes('if (family === "function") return functionKnown(set);'), "@function cannot be satisfied by generic call");
check("BAD_FALLBACK_NOT_RETURNED", !/return\s+original;\s*\n\s*};/.test(overlaySource), "bad fallback is replaced by unavailable state");
check("SESSION_SOURCE_LOOKUP_PRESENT", overlaySource.includes("session.sourceCardId") && overlaySource.includes("sourceCard(win, rows, session)"), "overlay resolves the captured source card before current-card fallback");
check("CONTEXT_SESSION_CAPTURES_SOURCE_CARD", contextualSource.includes('sourceCardId: String(sourceCardId || "")'), "contextual practice stores the source card id");
check("CONTEXT_START_PASSES_SOURCE_CARD", contextualSource.includes("startContextPractice(module.id, reason, nextReturnIndex(), sourceCard && sourceCard.id)"), "suggestion click passes the source card id");
check("RUNTIME_LOADER_PRESENT", loaderSource.includes("applied_practice_quality_v400.js?v=20260914_v400_applied_practice_r3"), "admin loader references source-bound overlay");
check("RUNTIME_LOADER_GLOBAL_NOT_LOCAL_ONLY", loaderSource.indexOf("applied_practice_quality_v400.js") > loaderSource.lastIndexOf("})();", loaderSource.indexOf("applied_practice_quality_v400.js") - 1), "overlay loader is outside local-admin IIFE");
check("PWA_CONTEXT_CACHE_BUST", pwaIndexSource.includes("contextual_practice_v351.js?v=20260914_v351_a2"), "pwa index requests the source-binding contextual script");
check("PWA_LOADER_CACHE_BUST", pwaIndexSource.includes("admin_local_loader_v400_7.js?v=20260914_v400_7_applied_r3"), "pwa index requests the updated applied-practice loader");
check("ROOT_RELEASE_CONTRACT_PRESERVED", rootIndexSource.includes('RELEASE = "20260821_v400_7_hardening1"'), "root redirect keeps the V400.7 release contract while child script URLs are cache-busted");

console.log("ERRORS=" + failures);
console.log("RESULT=" + (failures ? "FAIL_APPLIED_PRACTICE_QUALITY_V400" : "PASS_APPLIED_PRACTICE_QUALITY_V400"));
process.exitCode = failures ? 1 : 0;

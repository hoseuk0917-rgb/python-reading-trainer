"use strict";

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const overlayPath = path.join(ROOT, "src", "pwa", "applied_practice_quality_v400.js");
const loaderPath = path.join(ROOT, "src", "pwa", "admin_local_loader_v400_7.js");
const overlaySource = fs.readFileSync(overlayPath, "utf8");
const loaderSource = fs.readFileSync(loaderPath, "utf8");
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
const current = cards[1];
const progress = { correct: { P1: 1, I1: 1 }, seen: { P1: 1, I1: 1 }, confused: {} };
const sessionValue = { moduleId: "basics", reason: "milestone", returnIndex: 2, completed: false };

const engine = {
  CHECKPOINT_INTERVAL: 30,
  PRACTICE_TEMPLATES: [
    { id: "valid_basic", moduleId: "basics", requires: [["print", "output"]] }
  ],
  _mode: "bad",
  familyOf(value) { return String(value || "").toLowerCase(); },
  missionForPracticeModule() {
    if (this._mode === "valid") {
      return { id: "valid_basic", kind: "output_prediction", code: 'print("ok")', question: "무엇이 출력될까요?", choices: ["ok", "no"], answerIndex: 0, explanation: "ok" };
    }
    return { id: "fallback_recent_concept", kind: "concept_trace", code: current.code, question: "이 코드를 읽을 때 먼저 추적할 학습 개념은 무엇일까요?", choices: ["assignment", "call", "comment"], answerIndex: 0, explanation: "assignment" };
  },
  missionForCheckpoint() {
    return { id: "fallback_recent_concept", kind: "concept_trace", code: current.code, question: "이 코드를 읽을 때 먼저 추적할 학습 개념은 무엇일까요?", choices: ["assignment", "call", "comment"], answerIndex: 0, explanation: "assignment" };
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
check("CURRENT_INPUT_RELATED", /input\s*\(/.test(mission.code) && mission.sourceCardId === "I1", mission.id + ":" + mission.sourceCardId);
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

check("OVERLAY_EXPOSES_AUDIT_API", win.AppliedPracticeQualityV400 && win.AppliedPracticeQualityV400.version === "v400_applied_practice_r1", win.AppliedPracticeQualityV400 && win.AppliedPracticeQualityV400.version);
check("CALL_NOT_ALIASED_TO_FUNCTION", !/call\s*:\s*\[\s*["']function["']/.test(overlaySource), "generic call remains separate");
check("RUNTIME_LOADER_PRESENT", loaderSource.includes("applied_practice_quality_v400.js?v=20260911_v400_applied_practice_r1"), "admin loader references overlay");
check("RUNTIME_LOADER_GLOBAL_NOT_LOCAL_ONLY", loaderSource.indexOf("applied_practice_quality_v400.js") > loaderSource.lastIndexOf("})();", loaderSource.indexOf("applied_practice_quality_v400.js") - 1), "overlay loader is outside local-admin IIFE");

console.log("ERRORS=" + failures);
console.log("RESULT=" + (failures ? "FAIL_APPLIED_PRACTICE_QUALITY_V400" : "PASS_APPLIED_PRACTICE_QUALITY_V400"));
process.exitCode = failures ? 1 : 0;

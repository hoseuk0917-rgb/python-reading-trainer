"use strict";

const fs = require("fs");
const path = require("path");
const engine = require("../src/pwa/learning_engine_v341.js");

let errors = 0;
function check(name, ok, detail) {
  const pass = Boolean(ok);
  console.log(name + "=" + (pass ? "PASS" : "FAIL") + (detail ? " DETAIL=" + detail : ""));
  if (!pass) errors += 1;
}

const expectedIds = ["basics", "condition", "loop", "collections", "functions", "file_error", "object_module", "data_tools"];
const oldBiasedIds = new Set(["safe_change", "regression", "idempotence", "test_layers", "git_review", "ci_gate", "reproducibility", "baseline_rollback"]);
const oldDevKinds = new Set(["change_procedure", "regression", "idempotence", "test_scope", "pr_review", "ci_gate", "reproducibility", "baseline", "rollback"]);

check("PRACTICE_MODULE_COUNT", engine.PRACTICE_MODULES.length === 8, String(engine.PRACTICE_MODULES.length));
check("PRACTICE_MODULE_IDS_ARE_PYTHON_TOPICS", expectedIds.every(id => engine.PRACTICE_MODULES.some(m => m.id === id)), engine.PRACTICE_MODULES.map(m => m.id).join(','));
check("OLD_DEV_WORKFLOW_MODULES_REMOVED", engine.PRACTICE_MODULES.every(m => !oldBiasedIds.has(m.id)), engine.PRACTICE_MODULES.map(m => m.id).join(','));
check("NO_FIXED_MISSION_CHECKPOINT_ON_MODULES", engine.PRACTICE_MODULES.every(m => !("missionCheckpoint" in m)), "dynamic topic routing");
check("PRACTICE_TEMPLATES_ARE_PYTHON_CENTERED", engine.PRACTICE_TEMPLATES.length >= 15 && engine.PRACTICE_TEMPLATES.every(t => !oldDevKinds.has(t.kind) && typeof t.code === 'string' && t.code.length > 0), "templates=" + engine.PRACTICE_TEMPLATES.length);

const cards = [
  {id:'A1', concepts:['len','list','print'], code:'items=[1,2,3]\nprint(len(items))'},
  {id:'A2', concepts:['variable','print'], code:'x=1\nprint(x)'},
  {id:'A3', concepts:['comment','print'], code:'# note\nprint(1)'},
  {id:'A4', concepts:['if','bool','print'], code:'if ok:\n    print(1)'},
  {id:'A5', concepts:['for','list','print'], code:'for x in xs:\n    print(x)'},
  {id:'A6', concepts:['dict','get'], code:'row.get("x",0)'},
  {id:'A7', concepts:['def','return'], code:'def f(x):\n    return x'},
  {id:'A8', concepts:['open','file','with'], code:'with open("x") as f:\n    pass'}
];
const primary = c => c.concepts[0];
const modules = engine.unlockedPracticeModules(4, cards, primary);
check("MODULE_UNLOCK_DRIVEN_BY_FIRST_TOPIC_INDEX", modules.find(m => m.id === 'basics').unlocked && modules.find(m => m.id === 'condition').unlocked, JSON.stringify(modules.map(m => ({id:m.id,unlockAt:m.unlockAt,unlocked:m.unlocked}))));
check("LATER_TOPIC_MODULES_STAY_LOCKED", !modules.find(m => m.id === 'loop').unlocked && !modules.find(m => m.id === 'functions').unlocked, "count=4");

const moduleMission = engine.missionForPracticeModule('condition', 4, 'ko', cards, primary);
check("MODULE_MISSION_IS_INTERNAL_PYTHON_PRACTICE", moduleMission.moduleId === 'condition' && moduleMission.checkpoint === 0 && !oldDevKinds.has(moduleMission.kind), moduleMission.kind);

const ui = fs.readFileSync(path.join(__dirname, "..", "src", "pwa", "learning_experience_v341.js"), "utf8");
const delegatedContract =
  ui.includes("button.dataset.practiceModuleV341") &&
  ui.includes("[data-mission-checkpoint-v341], [data-practice-module-v341]") &&
  ui.includes("const moduleId = String(button.dataset.practiceModuleV341 || \"\")") &&
  ui.includes("openMission(0, moduleId)");
check("UI_USES_TOPIC_MODULE_FIELD", delegatedContract, "practice module via delegated click");
check("UI_DELEGATED_PRACTICE_ROUTING", ui.includes("function bindMissionDelegation()") && ui.includes("bindMissionDelegation();"), "single delegated handler");
check("MODULE_PRACTICE_DOES_NOT_COMPLETE_CHECKPOINT", ui.includes('appendActivity(correct ? "practice_correct" : "practice_wrong"') && !/if \(moduleId\)[\s\S]{0,300}completeCheckpoint\(/.test(ui), "separate completion path");
check("DEVELOPMENT_WORKFLOW_FILTERS_SIDECARDS", ui.includes('card.type === "development_workflow"'), "reference cards only");
check("NO_DEBUG_MISSION_EXPORT", !ui.includes("window.openPracticeMissionV341"), "mission remains internal");
check("NO_USER_BADGE_WORD_KO", !ui.includes("배지"), "badge wording absent");
check("NO_USER_BADGE_WORD_EN", !/\bbadges?\b/i.test(ui), "badge wording absent");
check("NO_USER_XP_WORD", !/\bXP\b|experience points|coins?|loot/i.test(ui), "gamified currency absent");

console.log("ERRORS=" + errors);
console.log("RESULT=" + (errors ? "FAIL_LEARNING_EXPERIENCE_V341_R2_AUDIT" : "PASS_LEARNING_EXPERIENCE_V341_R2_AUDIT"));
process.exitCode = errors ? 1 : 0;

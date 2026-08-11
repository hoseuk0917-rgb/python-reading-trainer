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

const expectedKinds = {
  safe_change: "change_procedure",
  regression: "regression",
  idempotence: "idempotence",
  test_layers: "test_scope",
  git_review: "pr_review",
  ci_gate: "ci_gate",
  reproducibility: "reproducibility",
  baseline_rollback: "baseline"
};

check("PRACTICE_MODULE_COUNT", engine.PRACTICE_MODULES.length === 8, String(engine.PRACTICE_MODULES.length));
engine.PRACTICE_MODULES.forEach(module => {
  const mission = engine.missionForCheckpoint(module.missionCheckpoint, "ko");
  check(
    "MODULE_" + module.id.toUpperCase() + "_MISSION",
    Number.isInteger(module.missionCheckpoint) && mission.kind === expectedKinds[module.id],
    "checkpoint=" + module.missionCheckpoint + " kind=" + mission.kind
  );
});

const ui = fs.readFileSync(path.join(__dirname, "..", "src", "pwa", "learning_experience_v341.js"), "utf8");
const delegatedContract =
  ui.includes("button.dataset.missionCheckpointV341") &&
  ui.includes("[data-mission-checkpoint-v341]") &&
  ui.includes("const number = Number(button.dataset.missionCheckpointV341 || 0)") &&
  ui.includes("if (number > 0) openMission(number)");
check("UI_USES_EXACT_MISSION_FIELD", delegatedContract, "missionCheckpoint via delegated click");
check("UI_DELEGATED_MISSION_ROUTING", ui.includes("function bindMissionDelegation()") && ui.includes("bindMissionDelegation();"), "single delegated handler");
check("NO_DEBUG_MISSION_EXPORT", !ui.includes("window.openPracticeMissionV341"), "mission remains internal");
check("NO_USER_BADGE_WORD_KO", !ui.includes("배지"), "badge wording absent");
check("NO_USER_BADGE_WORD_EN", !/\bbadges?\b/i.test(ui), "badge wording absent");
check("NO_USER_XP_WORD", !/\bXP\b|experience points|coins?|loot/i.test(ui), "gamified currency absent");

console.log("ERRORS=" + errors);
console.log("RESULT=" + (errors ? "FAIL_LEARNING_EXPERIENCE_V341_R2_AUDIT" : "PASS_LEARNING_EXPERIENCE_V341_R2_AUDIT"));
process.exitCode = errors ? 1 : 0;

#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const runtime = fs.readFileSync(path.join(ROOT, "src/pwa/study_progress_v346.js"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "src/pwa/study_ui_v346.css"), "utf8");
const index = fs.readFileSync(path.join(ROOT, "src/pwa/index.html"), "utf8");
const v345 = fs.readFileSync(path.join(ROOT, "src/pwa/study_experience_v345.js"), "utf8");

let failed = false;
function check(name, ok, detail) {
  console.log(`${name}=${ok ? "PASS" : "FAIL"} DETAIL=${detail == null ? "" : detail}`);
  if (!ok) failed = true;
}

console.log("=== PRT V346 STUDY QUALITY CONTRACT AUDIT ===");
check("VERSION", runtime.includes('const VERSION = "v346_a1"'), "v346_a1");
check("NEXT_ACTION_PANEL", runtime.includes('panel.id = "nextActionV346"'), "progress action panel");
check("NEXT_ACTION_REVIEW_PRIORITY", /if \(due\.length\) kind = "review";\s*else if \(checkpoint\.pending\) kind = "checkpoint";\s*else if \(nextIndex < list\.length\) kind = "new";/.test(runtime), "review > checkpoint > new > complete");
check("NEXT_ACTION_USES_V340_REVIEW", runtime.includes("LearningEngineV340.dueReviewIds"), "due review state");
check("NEXT_ACTION_USES_V341_CHECKPOINT", runtime.includes("unlockedCheckpointCount") && runtime.includes("completedCheckpoints"), "pending checkpoint state");
check("NEXT_ACTION_FIXED_SEQUENCE", runtime.includes("firstUnseenIndex") && runtime.includes("nextCardTitle"), "first unseen new card");
check("TODAY_SUMMARY_REUSES_V345", runtime.includes("StudyExperienceV345.showSessionSummary"), "existing summary API");
check("PROGRESS_RUNTIME_READ_ONLY", !/localStorage\.setItem|sessionStorage\.setItem|saveProgress\s*\(/.test(runtime), "V346 does not write learning state");
const visibleRewardTerms = /["'`](?:[^"'`]*(?:\bXP\b|coins?|loot|developer badge|achievement badge|배지|코인|전리품)[^"'`]*)["'`]/i;
check("NO_XP_BADGE_CURRENCY", !visibleRewardTerms.test(runtime), "no user-facing gamification reward wording");
check("KO_EN_COPY", runtime.includes("지금 할 일") && runtime.includes("What to do now") && runtime.includes("복습부터 시작") && runtime.includes("Start review"), "bilingual next action copy");

check("SHARED_UI_CSS", css.includes("/* PRT STUDY UI COMPONENTS V346 */"), "component layer");
check("SHARED_UI_TOKENS", css.includes("--prt-radius-card") && css.includes("--prt-primary") && css.includes("--prt-line"), "shared tokens");
check("SHARED_ACTION_COMPONENT", css.includes(".prt-action") && css.includes(".prt-action--primary"), "buttons");
check("SHARED_SURFACE_COMPONENT", css.includes(".prt-surface") && css.includes(".prt-surface--soft"), "surfaces");
check("SHARED_STAT_COMPONENT", css.includes(".prt-stat-grid") && css.includes(".prt-stat"), "stats");
check("SHARED_DIALOG_COMPONENT", css.includes(".prt-dialog"), "dialogs");
check("TOUCH_TARGET_44", /\.prt-action\s*\{[\s\S]*?min-height:\s*44px/.test(css), "44px");
check("REDUCED_MOTION", css.includes("prefers-reduced-motion"), "motion preference");
check("COMPONENT_ADOPTS_V345", runtime.includes('["#studyDataV345"') && runtime.includes('[".v345-modal-card"'), "V345 surfaces/dialog");
check("COMPONENT_ADOPTS_V341_V340", runtime.includes('[".practice-v341-card"') && runtime.includes('[".modal-v340-card"'), "V341/V340 surfaces/dialog");
check("NO_V346_INLINE_STYLE_IN_RUNTIME", !/\.style\.[A-Za-z]+\s*=/.test(runtime), "layout styling lives in CSS");

const cssCount = (index.match(/study_ui_v346\.css/g) || []).length;
const jsCount = (index.match(/study_progress_v346\.js/g) || []).length;
check("INDEX_CSS_ONCE", cssCount === 1, String(cssCount));
check("INDEX_RUNTIME_ONCE", jsCount === 1, String(jsCount));
const v345Pos = index.indexOf("study_experience_v345.js");
const v346Pos = index.indexOf("study_progress_v346.js");
check("INDEX_V346_AFTER_V345", v345Pos >= 0 && v346Pos > v345Pos, `${v345Pos}->${v346Pos}`);
const mainStylePos = index.indexOf("style.css");
const sharedStylePos = index.indexOf("study_ui_v346.css");
check("INDEX_SHARED_CSS_AFTER_BASE", mainStylePos >= 0 && sharedStylePos > mainStylePos, `${mainStylePos}->${sharedStylePos}`);
check("V345_STILL_PRESENT", v345.includes("BACKUP_SCHEMA") && v345.includes("showSessionSummary"), "backup/summary preserved");

console.log(`RESULT=${failed ? "FAIL_STUDY_QUALITY_V346_AUDIT" : "PASS_STUDY_QUALITY_V346_AUDIT"}`);
process.exit(failed ? 1 : 0);

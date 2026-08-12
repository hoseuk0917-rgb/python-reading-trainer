"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const runtime = fs.readFileSync(path.join(root, "src/pwa/study_experience_v345.js"), "utf8");
const index = fs.readFileSync(path.join(root, "src/pwa/index.html"), "utf8");
const v348Path = path.join(root, "src/pwa/learning_runtime_v348.js");
const runtimeV348 = fs.existsSync(v348Path) ? fs.readFileSync(v348Path, "utf8") : "";

const rows = [];
let failed = false;
function check(name, ok, detail) {
  rows.push(`${name}=${ok ? "PASS" : "FAIL"} DETAIL=${detail == null ? "" : detail}`);
  if (!ok) failed = true;
}

console.log("=== PRT V345 STUDY EXPERIENCE AUDIT ===");
check("VERSION", runtime.includes('const VERSION = "v345_a1";'), "v345_a1");
check("SCRIPT_LOADED_ONCE", (index.match(/study_experience_v345\.js\?v=20260812_v345_a1/g) || []).length === 1, (index.match(/study_experience_v345\.js/g) || []).length);
check("SCRIPT_AFTER_V344", index.indexOf("explanation_support_v344.js") >= 0 && index.indexOf("explanation_support_v344.js") < index.indexOf("study_experience_v345.js"), "load-order");

check("NAV_PRIMARY_VIEWS", /\["learn", "practice", "progress"\]/.test(runtime), "learn/practice/progress");
check("NAV_SUPPORT_VIEWS", /\["outline", "notes"\]/.test(runtime), "outline/notes");
check("NAV_DOM_ORDER", runtime.includes('["learn", "practice", "progress", "outline", "notes"].forEach'), "learn>practice>progress>outline>notes>tools");
check("TOOLS_GROUP", /\["code", "command", "project"\]/.test(runtime) && runtime.includes('aria-haspopup", "menu"'), "code/command/project");
check("TOOLS_KEEP_REAL_TAB_BUTTONS", runtime.includes('menu.appendChild(btn)') && runtime.includes('.tab-btn[data-view="'), "moved existing buttons");

check("BACKUP_SCHEMA", runtime.includes('python-reading-trainer-backup-v345'), "schema");
check("BACKUP_APP_KEY_SCOPE", runtime.includes('/^(python-reading-trainer-|pythonReadingTrainer\\.)/') && runtime.includes("if (!isAppKey(key)) continue"), "app-only keys");
check("RESTORE_REJECTS_FOREIGN_KEYS", runtime.includes('errors.push(label + " contains non-app key: " + key)'), "foreign-key guard");
check("RESTORE_SIZE_GUARD", runtime.includes("MAX_BACKUP_CHARS") && runtime.includes('errors.push("backup is too large")'), "8MB guard");
check("RESTORE_PREVIEW", runtime.includes("showRestorePreview") && runtime.includes("복원 실행") && runtime.includes("Confirm study data restore"), "preview-before-write");
check("BACKUP_API", runtime.includes("exportStateObject: exportStateObject") && runtime.includes("applyBackupObject: applyBackupObject"), "testable API");

check("SESSION_ACTIVITY", runtime.includes("ACTIVITY_KEY") && runtime.includes("recordActivity") && runtime.includes("getTodaySummary"), "today events");
check("SESSION_SUMMARY_HOME", runtime.includes("sessionSummaryV345") && runtime.includes("오늘 학습 요약"), "home summary button");
check("NO_XP_BADGE_CURRENCY", !/\bXP\b|coin|coins|loot|badge/i.test(runtime), "evidence-not-gamification");

check("FOCUS_DEFAULT_ON", runtime.includes('return raw === null ? true : raw !== "off";'), "default-on");
check("FOCUS_PREANSWER_HIDE", runtime.includes("v345-focus-on:not(.v345-support-revealed)") && runtime.includes("#readingGoalWrap") && runtime.includes(".side"), "hide support before answer");
check("FOCUS_HELP_ESCAPE", runtime.includes("focusHelpV345") && runtime.includes("revealSupport"), "manual help");
const localAnswerReveal = runtime.includes('choice.classList.contains("correct")') && runtime.includes("if (outcome) revealSupport()");
const delegatedAnswerReveal = runtimeV348.includes('target.closest(".choice-btn")') && runtimeV348.includes("StudyExperienceV345.revealSupport");
check("FOCUS_REVEALS_AFTER_ANSWER", localAnswerReveal || delegatedAnswerReveal, delegatedAnswerReveal ? "delegated to V348" : "V345 local");

check("TABLIST_ARIA", runtime.includes('nav.setAttribute("role", "tablist")') && runtime.includes('btn.setAttribute("role", "tab")') && runtime.includes('aria-selected'), "tabs");
check("TAB_KEYBOARD", runtime.includes("ArrowRight") && runtime.includes("ArrowLeft") && runtime.includes('event.key === "Home"') && runtime.includes('event.key === "End"'), "arrow/home/end");
const localEscape = runtime.includes("closeKnownDialogOnEscape") && runtime.includes('event.key !== "Escape"');
const sharedEscape = runtimeV348.includes('event.key !== "Escape"') && runtimeV348.includes("closeTrackedDialog");
check("MODAL_ESCAPE", localEscape || sharedEscape, sharedEscape ? "shared V348 controller" : "V345 local");
const localTrap = runtime.includes("trapDialogFocus") && runtime.includes('event.key !== "Tab"');
const sharedTrap = runtimeV348.includes("trapDialogFocus") && runtimeV348.includes('event.key !== "Tab"');
check("MODAL_FOCUS_TRAP", localTrap || sharedTrap, sharedTrap ? "shared V348 controller" : "V345 local");
check("FOCUS_VISIBLE", runtime.includes(":focus-visible") && runtime.includes("outline:3px solid"), "visible keyboard focus");
check("REDUCED_MOTION", runtime.includes("prefers-reduced-motion"), "motion preference");
check("TOUCH_TARGET", runtime.includes("min-height:44px") && !runtime.includes("min-height:40px"), "44px minimum control height");
check("RESULT_LIVE_REGION", runtime.includes('result.setAttribute("aria-live", "polite")'), "answer announcement");

rows.forEach((row) => console.log(row));
console.log(`RESULT=${failed ? "FAIL_STUDY_EXPERIENCE_V345_AUDIT" : "PASS_STUDY_EXPERIENCE_V345_AUDIT"}`);
if (failed) process.exit(1);

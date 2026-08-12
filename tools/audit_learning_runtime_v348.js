"use strict";

const fs = require("fs");

function read(path) { return fs.readFileSync(path, "utf8"); }
function count(text, token) { return text.split(token).length - 1; }

const runtime = read("src/pwa/learning_runtime_v348.js");
const loop = read("src/pwa/learning_loop_v340.js");
const experience = read("src/pwa/learning_experience_v341.js");
const study = read("src/pwa/study_experience_v345.js");
const progress = read("src/pwa/study_progress_v346.js");
const compat = read("src/pwa/learning_flow_hardening_v347.js");
const index = read("src/pwa/index.html");
const css = read("src/pwa/study_ui_v348.css");

const checks = [];
function check(name, ok, detail) { checks.push([name, !!ok, detail || ""]); }

check("RUNTIME_VERSION", runtime.includes('const VERSION = "v348_a1"'), "v348_a1");
check("SINGLE_ATTEMPT_PIPELINE", runtime.includes("installAttemptPipeline") && runtime.includes("recordAttemptEffects"), "delegated click pipeline");
check("V340_SCHEDULER_DELEGATED", loop.includes("if (window.LearningRuntimeV348) return;") && loop.includes("boot-time fallback"), "V348 owns production wrong scheduling");
check("V341_NO_HANDLER_STACK", experience.includes("recordLessonAttempt") && !experience.includes("const originalCheckAnswer = checkAnswer") && !experience.includes("const originalUnsure = jumpToConfusedOrNext"), "learning-experience side effect API");
check("V345_NO_ATTEMPT_DUPLICATION", study.includes("__studyExperienceV345AttemptDelegatedToV348") && study.includes("recordActivity: recordActivity") && study.includes("revealSupport: revealSupport"), "activity API delegated");
check("V345_NO_DIALOG_KEYDOWN_DUPLICATION", !study.includes('document.addEventListener("keydown", trapDialogFocus)') && !study.includes('document.addEventListener("keydown", closeKnownDialogOnEscape)'), "shared dialog controller");
check("V346_COMPONENT_ADOPTION_DELEGATED", progress.includes("if (!window.LearningRuntimeV348) adoptExistingComponents();"), "boot fallback only");
check("V347_COMPAT_ONLY", compat.includes('const VERSION = "v347_compat"') && !compat.includes("MutationObserver") && !compat.includes("addEventListener") && !compat.includes("scheduleWrong(loadReviewState"), "no active hardening layer");
check("DIALOG_CONTROLLER_COVERS_V340_V341_V345", ["reviewModalV340", "syntaxModalV340", "missionModalV341", "studyModalV345"].every((id) => runtime.includes(id)), "tracked dialogs");
check("DIALOG_INITIAL_FOCUS_RECONCILIATION", runtime.includes("focusDialogOnOpen") && runtime.includes("if (focusDialog(modal)) return;") && runtime.includes("window.requestAnimationFrame(retry)"), "immediate focus + bounded frame reconciliation");
check("DIALOG_FOCUS_TRAP", runtime.includes("trapDialogFocus") && runtime.includes('event.key !== "Tab"'), "single trap");
check("DIALOG_ESCAPE", runtime.includes('event.key !== "Escape"') && runtime.includes("closeTrackedDialog"), "single Escape controller");
check("SEMANTIC_FOCUS_RETURN", runtime.includes("startSemanticFocusLease") && runtime.includes("pendingReviewOpener") && runtime.includes("goProgress"), "rerender-safe V346 return");
check("SHARED_COMPONENT_ADOPTION", runtime.includes("adoptSharedComponents") && runtime.includes("prt-dialog-overlay") && runtime.includes("prt-action"), "V340/V341/V345 shared classes");
check("SHARED_DIALOG_CSS", css.includes(".prt-dialog-overlay") && css.includes(".modal-v340,") && css.includes(".mission-v341,") && css.includes(".v345-modal {") && css.includes("prefers-reduced-motion"), "common legacy + shared dialog presentation");
check("LEGACY_DIALOG_OVERLAY_DUPLICATES_REMOVED", !loop.includes(".modal-v340 { position:fixed; inset:0;") && !experience.includes(".mission-v341 { position:fixed; inset:0;") && !study.includes(".v345-modal { position:fixed; inset:0;"), "overlay geometry centralized");
check("LEGACY_DIALOG_CARD_DUPLICATES_REMOVED", !loop.includes(".modal-v340-card { width:min(720px,100%); max-height:88vh;") && !experience.includes(".mission-v341-card { width:min(680px,100%); max-height:88vh;") && !study.includes(".v345-modal-card { width:min(620px,100%); max-height:88vh;"), "card shell centralized");
check("INDEX_V348_CSS_ONCE", count(index, "study_ui_v348.css?v=20260812_v348_a1") === 1, "1");
check("INDEX_V348_RUNTIME_ONCE", count(index, "learning_runtime_v348.js?v=20260812_v348_a1") === 1, "1");
check("INDEX_V347_COMPAT", count(index, "learning_flow_hardening_v347.js?v=20260812_v347_compat") === 1, "compat facade");
check("INDEX_LOAD_ORDER", index.indexOf("study_progress_v346.js") < index.indexOf("learning_flow_hardening_v347.js?v=20260812_v347_compat") && index.indexOf("learning_flow_hardening_v347.js?v=20260812_v347_compat") < index.indexOf("learning_runtime_v348.js"), "V346 -> V347 compat -> V348");
check("NO_STORAGE_CLEAR", !runtime.includes("localStorage.clear") && !runtime.includes("sessionStorage.clear"), "storage-safe");
check("NO_GAMIFICATION_REWARD", !/\b(xp|coin|loot)\b/i.test(runtime), "no reward layer");

let errors = 0;
console.log("=== PRT V348 SHARED LEARNING RUNTIME AUDIT ===");
for (const [name, ok, detail] of checks) {
  console.log(`${name}=${ok ? "PASS" : "FAIL"} DETAIL=${detail}`);
  if (!ok) errors += 1;
}
console.log(`ERRORS=${errors}`);
console.log(`RESULT=${errors ? "FAIL_LEARNING_RUNTIME_V348_AUDIT" : "PASS_LEARNING_RUNTIME_V348_AUDIT"}`);
if (errors) process.exit(1);

"use strict";
const fs = require("fs");
function read(p){return fs.readFileSync(p,"utf8");}
const runtime=read("src/pwa/learning_flow_hardening_v347.js");
const index=read("src/pwa/index.html");
const harness=read("tools/e2e_learning_flow_v347_browser_case.js");
const shell=read("tools/e2e_learning_flow_v347_browser_case.html");
const checks=[];
function check(name,ok,detail=""){checks.push([name,!!ok,detail]);}
check("RUNTIME_VERSION",runtime.includes('const VERSION = "v347_a11"'),"v347_a11");
check("WRONG_REVIEW_FALLBACK",runtime.includes("LearningEngineV340.scheduleWrong")&&runtime.includes('existing.lastResult === "wrong"'),"guarded fallback");
check("NO_DOUBLE_WRONG_LAPSE",runtime.includes("canonical V340 wrapper remains primary")&&runtime.includes("return false;"),"canonical path no-op");
check("V346_REVIEW_ORIGIN_CAPTURE",runtime.includes("captureV346ReviewOpener")&&runtime.includes('panel.dataset.kind !== "review"'),"review-only origin");
check("V346_CANCEL_RETURNS_PROGRESS",runtime.includes("returnToProgressForReviewOrigin")&&runtime.includes('setView("progress")'),"origin view restored");
check("DIRECT_V340_REVIEW_PRESERVED",runtime.includes("Direct V340")||runtime.includes("explicitReviewOpener"),"origin-scoped behavior");
check("DIALOG_FOCUS",runtime.includes("focusDialog")&&runtime.includes("firstDialogControl"),"review/syntax/mission");
check("V340_ESCAPE",runtime.includes('event.key !== "Escape"')&&runtime.includes("closeV340Modal"),"keyboard close");
check("SEMANTIC_FOCUS_LEASE",runtime.includes("startSemanticFocusLease")&&runtime.includes("resolveControl"),"rerender-safe current control");
check("NO_FIXED_FOCUS_DELAY",!runtime.includes("setTimeout(function () {\n          const active")&&!runtime.includes("setTimeout(focus"),"observer/rAF lifecycle");
check("NO_STORAGE_CLEAR",!runtime.includes("localStorage.clear")&&!runtime.includes("sessionStorage.clear"),"no unrelated state wipe");
check("NO_GAMIFICATION_REWARD",!/\b(xp|coin|loot)\b/i.test(runtime),"no XP/currency");
const script='./learning_flow_hardening_v347.js?v=20260812_v347_a11';
check("INDEX_SCRIPT_ONCE",index.split(script).length-1===1,"1");
check("INDEX_AFTER_V346",index.indexOf("study_progress_v346.js")<index.indexOf(script),"load order");
for(const marker of ["WRONG_SCHEDULES_REVIEW","REVIEW_DIALOG_FOCUS_RETURNS","REVIEW_CORRECT_ADVANCES_INTERVAL","CARD_30_UNLOCKS_CHECKPOINT_1","CHECKPOINT_CORRECT_STORES_COMPLETION","PRACTICE_MODULE_SEPARATE_FROM_CHECKPOINT","BACKUP_VALID","RESTORE_RECOVERS_CARD_31","EN_RESTORED_DECISION_PARITY","APP_VIEWPORT_390"]){check("E2E_"+marker,harness.includes(marker),marker);}
check("EXACT_390_SHELL",shell.includes('frame.style.width = "390px"'),"iframe browsing context");
check("RELEASE_DIAGNOSTICS_ABSENT",!harness.includes("REVIEW_MANUAL_FOCUS_PROBE")&&!harness.includes("REVIEW_FOCUS_CONTEXT"),"temporary probe removed");
let errors=0; console.log("=== PRT V347 RELEASE CONTRACT AUDIT ===");
for(const [n,ok,d] of checks){console.log(`${n}=${ok?"PASS":"FAIL"} DETAIL=${d}`); if(!ok) errors++;}
console.log(`ERRORS=${errors}`); console.log(`RESULT=${errors?"FAIL_E2E_LEARNING_FLOW_V347_AUDIT":"PASS_E2E_LEARNING_FLOW_V347_AUDIT"}`); if(errors)process.exit(1);

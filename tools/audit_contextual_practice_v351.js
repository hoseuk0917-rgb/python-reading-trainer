"use strict";
const fs = require("fs");

const index = fs.readFileSync("src/pwa/index.html", "utf8");
const js = fs.readFileSync("src/pwa/contextual_practice_v351.js", "utf8");
const css = fs.readFileSync("src/pwa/contextual_practice_v351.css", "utf8");
const checks = [];
function check(name, ok) { checks.push([name, !!ok]); console.log(name + "=" + (!!ok)); }

check("INDEX_LOADS_V351_CSS", index.includes("contextual_practice_v351.css"));
check("INDEX_LOADS_V351_JS", index.includes("contextual_practice_v351.js"));
check("V351_AFTER_V350", index.indexOf("learning_flow_v350.js") >= 0 && index.indexOf("contextual_practice_v351.js") > index.indexOf("learning_flow_v350.js"));
check("NON_BLOCKING_INLINE_PROMPT", js.includes("result.insertAdjacentElement(\"afterend\", box)") && !js.includes("alert("));
check("MILESTONE_CADENCE_EIGHT", js.includes("count >= 8 && count % 8 === 0"));
check("CHECKPOINT_DUPLICATE_SUPPRESSION", js.includes("count % 30 === 0"));
check("REPEATED_CONFUSION_TRIGGER", js.includes("confusion >= 2"));
check("USES_UNLOCKED_PRACTICE_MODULES", js.includes("unlockedPracticeModules"));
check("USES_LEARNED_CONTEXT", js.includes("buildLearningContext"));
check("CONTEXT_RETURN_SESSION", js.includes("SESSION_KEY") && js.includes("returnIndex") && js.includes("returnToLearning"));
check("CHECKPOINT_CONTEXT_ACTIONS", js.includes("contextCheckpointActionsV351") && js.includes("배운 내용 적용해보기") && js.includes("다음 학습 계속"));
check("PRACTICE_COMPLETION_RETURN", js.includes("markPracticeComplete") && js.includes("contextPracticeMissionReturnV351"));
check("NO_PROGRESS_CLEAR", !js.includes("localStorage.clear") && !js.includes("sessionStorage.clear"));
check("NO_LEARNING_CONTENT_MUTATION", !js.includes("card.answer =") && !js.includes("card.question ="));
check("MOBILE_STACKED_ACTIONS", css.includes("@media (max-width:820px)") && css.includes("grid-template-columns:1fr"));
check("BILINGUAL_CONTEXT_COPY", js.includes("Apply what I learned") && js.includes("응용 문제 풀기"));

const failed = checks.filter(([, ok]) => !ok);
console.log("TOTAL_CHECKS=" + checks.length);
console.log("FAILED_CHECKS=" + failed.length);
console.log("RESULT=" + (failed.length ? "FAIL_V351_CONTEXTUAL_PRACTICE_AUDIT" : "PASS_V351_CONTEXTUAL_PRACTICE_AUDIT"));
if (failed.length) process.exit(1);

"use strict";
const fs = require("fs");
function read(path) { return fs.readFileSync(path, "utf8"); }
const index = read("src/pwa/index.html");
const js = read("src/pwa/learning_flow_v350.js");
const css = read("src/pwa/learning_flow_v350.css");
const checks = [];
function check(name, ok) { checks.push([name, !!ok]); console.log(name + "=" + (!!ok)); }
check("INDEX_LOADS_V350_CSS", index.includes("learning_flow_v350.css?v=20260812_v350_a1"));
check("INDEX_LOADS_V350_JS", index.includes("learning_flow_v350.js?v=20260812_v350_a1"));
check("V350_LOADS_AFTER_V349_COMPAT", index.indexOf("consumer_ux_v349_compat_r2.js") < index.indexOf("learning_flow_v350.js"));
check("PRACTICE_GLOBAL_NAV_HIDDEN", css.includes("#consumerPracticeV349") && css.includes("display:none !important"));
check("PRACTICE_MAPPED_TO_LEARNING_CONTEXT", js.includes("v350-practice-context") && js.includes("consumerLearnV349") && js.includes("aria-current"));
check("LEARNING_HOME_PRACTICE_ENTRY", js.includes("practiceEntryV350") && js.includes("배운 내용 연습") && js.includes('navigate("practice")'));
check("PRACTICE_BREADCRUMB", js.includes("practiceFlowHeaderV350") && js.includes("practiceBackToLearnV350"));
check("HEADER_OVERFLOW_HIDDEN", css.includes("#consumerHeaderV349 { display:none !important; }"));
check("DIRECT_NATIVE_LANGUAGE_CONTROL", js.includes("headerLanguageV350") && js.includes("languageToggleV334A9") && !js.includes("headerLanguageToggleV350"));
check("STUDY_DATA_MENU_ENTRY", js.includes("learningDataMenuV350") && js.includes("studyDataV345"));
check("RESET_MOVED_TO_STUDY_DATA", js.includes("resetProgressV350") && js.includes("resetBtn") && css.includes("learning-data-danger-v350"));
check("FOCUS_MODE_NOT_RELOCATED", !js.includes("focusModeToggleV345") && !js.includes("FOCUS_KEY"));
check("NO_STORAGE_CLEAR", !js.includes("localStorage.clear") && !js.includes("sessionStorage.clear"));
check("NO_CONTENT_MUTATION", !js.includes("cards.splice") && !js.includes("cards.length =") && !js.includes("sideCards.splice"));
check("BILINGUAL_UI", js.includes('document.documentElement.lang === "en"'));
const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
console.log("TOTAL_CHECKS=" + checks.length);
console.log("FAILED_CHECKS=" + failed.length);
if (failed.length) { console.error("FAILED=" + failed.join(",")); process.exit(1); }
console.log("RESULT=PASS_V350_LEARNING_FLOW_AUDIT");

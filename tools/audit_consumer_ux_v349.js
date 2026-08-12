"use strict";
const fs = require("fs");
function read(path) { return fs.readFileSync(path, "utf8"); }
const index = read("src/pwa/index.html");
const js = read("src/pwa/consumer_ux_v349.js");
const css = read("src/pwa/consumer_ui_v349.css");
const checks = [];
function check(name, ok) { checks.push([name, !!ok]); console.log(name + "=" + (!!ok)); }
check("INDEX_LOADS_V349_CSS", index.includes("consumer_ui_v349.css?v=20260812_v349_a1"));
check("INDEX_LOADS_V349_JS", index.includes("consumer_ux_v349.js?v=20260812_v349_a1"));
check("V349_LOADS_AFTER_V348", index.indexOf("learning_runtime_v348.js") < index.indexOf("consumer_ux_v349.js"));
check("LEGACY_VIEWS_PRESERVED", ["learn","outline","progress","practice","notes","code","command","project"].every(v => index.includes('data-view="' + v + '"')));
check("RESET_CONTROL_PRESERVED", index.includes('id="resetBtn"'));
check("PRIMARY_GROUPS_FOUR", ["consumerLearnV349","consumerPracticeV349","consumerToolsV349","consumerLibraryV349"].every(id => js.includes(id)));
check("TOOLS_GROUP_PRESERVES_THREE", ["code","command","project"].every(v => js.includes('{ view: "' + v + '"')));
check("MY_LEARNING_GROUP_PRESERVES_THREE", ["progress","outline","notes"].every(v => js.includes('{ view: "' + v + '"')));
check("HEADER_OVERFLOW_MENU", js.includes("consumerHeaderMenuBtnV349") && js.includes("headerActionsV334A9") && js.includes("resetBtn"));
check("LEARNING_SUPPORT_DISCLOSURE", js.includes("learningSupportToggleV349") && css.includes("v349-support-open"));
check("STUDY_TOOLS_DISCLOSURE", js.includes("studyToolsDisclosureV349") && css.includes("#studyToolsV7.v349-study-tools:not(.v349-expanded)"));
check("HOME_PROGRESSIVE_DISCLOSURE", js.includes("home-details-toggle-v349") && css.includes("v349-details-open"));
check("TOOL_ADVANCED_DISCLOSURE", ["codeAdvancedActionsV349","codeScopeDisclosureV349","commandSampleDisclosureV349"].every(id => js.includes(id)));
check("MOBILE_BOTTOM_NAV", css.includes("position:fixed") && css.includes("bottom:0") && css.includes(".consumer-nav-v349"));
check("FOCUS_MODE_SINGLE_COLUMN", css.includes("#learnView.v343-quiz-mode") && css.includes("--v349-focus-max: 760px"));
check("LEGACY_TABS_VISUALLY_HIDDEN_ONLY", css.includes("nav.tabs") && css.includes("display:none !important") && !js.includes("removeChild(legacyTabs)"));
check("NO_STORAGE_CLEAR", !js.includes("localStorage.clear") && !js.includes("sessionStorage.clear"));
check("NO_CONTENT_MUTATION", !js.includes("cards.splice") && !js.includes("cards.length =") && !js.includes("sideCards.splice"));
check("ESCAPE_MENU_CLOSE", js.includes('event.key === "Escape"') && js.includes("closeMenu(true)"));
check("BILINGUAL_UI", js.includes('document.documentElement.lang === "en"'));
const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
console.log("TOTAL_CHECKS=" + checks.length);
console.log("FAILED_CHECKS=" + failed.length);
if (failed.length) { console.error("FAILED=" + failed.join(",")); process.exit(1); }
console.log("RESULT=PASS_V349_CONSUMER_UX_AUDIT");

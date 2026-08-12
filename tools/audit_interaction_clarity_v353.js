"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const index = fs.readFileSync(path.join(root, "src/pwa/index.html"), "utf8");
const js = fs.readFileSync(path.join(root, "src/pwa/interaction_clarity_v353.js"), "utf8");
const css = fs.readFileSync(path.join(root, "src/pwa/interaction_clarity_v353.css"), "utf8");

const checks = [];
function check(name, ok, detail) {
  checks.push({ name, ok: !!ok, detail: detail || "" });
}

check("V353_A2_RUNTIME", js.includes('const VERSION = "v353_a2"'));
check("V353_CSS_ONCE", (index.match(/interaction_clarity_v353\.css/g) || []).length === 1);
check("V353_JS_ONCE", (index.match(/interaction_clarity_v353\.js/g) || []).length === 1);
check("V353_A2_ASSETS", index.includes("interaction_clarity_v353.css?v=20260813_v353_a2") && index.includes("interaction_clarity_v353.js?v=20260813_v353_a2"));
check("V353_AFTER_V351_CSS", index.indexOf("interaction_clarity_v353.css") > index.indexOf("contextual_practice_v351.css"));
check("V353_AFTER_V351_JS", index.indexOf("interaction_clarity_v353.js") > index.indexOf("contextual_practice_v351.js"));
check("FOCUS_VISUAL_LABEL_CONSTANT", css.includes('content: "집중 모드"') && css.includes('content: "Focus mode"'));
check("SUPPORT_VISUAL_LABEL_CONSTANT", css.includes('content: "보조 자료"') && css.includes('content: "Support"'));
check("FOCUS_ACTUAL_STATE_SOURCE", js.includes("function focusActuallyOn()") && js.includes('learn.classList.contains("v345-focus-on")'));
check("SUPPORT_ACTUAL_STATE_SOURCE", js.includes("function supportActuallyOn()") && js.includes("manualSupportOpen()") && js.includes("visible(support)"));
check("COLOR_DRIVEN_BY_ACTUAL_STATE", css.includes('[data-v353-active="true"]') && css.includes('[data-v353-active="false"]'));
check("NO_ARIA_ONLY_COLOR_RULE", !css.includes('#focusModeToggleV345[aria-pressed="true"]') && !css.includes('#learningSupportToggleV349[aria-expanded="true"]'));
check("TOUCH_STICKY_HOVER_GUARD", css.includes("@media (hover: hover) and (pointer: fine)"));
check("DUPLICATE_HELP_HIDDEN", css.includes("#focusHelpV345") && css.includes("display: none !important"));
check("META_COPY_REMOVED", css.includes(".concept-intro-note-v306") && css.includes(".mobile-sidecards-note") && css.includes(".side-section-note"));
check("SUPPORT_TOGGLE_MOVED_TO_CONTROL_CLUSTER", js.includes('support.parentElement !== bar') && js.includes('bar.appendChild(support)'));
check("SUPPORT_USES_EXISTING_LIVE_REGION", js.includes('document.getElementById("learningSupportRegionV349")') && !js.includes("learningSupportInlineV353"));
check("SUPPORT_SHEET_STATE_CLASS", js.includes('support.classList.toggle("v353-manual-support-sheet", sheet)'));
check("SUPPORT_SHEET_FIXED_MOBILE", css.includes("#learningSupportRegionV349.v353-manual-support-sheet") && css.includes("position: fixed !important") && css.includes("max-height: min(62vh, 560px)"));
check("SUPPORT_SHEET_NAV_CLEARANCE", css.includes("bottom: calc(84px + env(safe-area-inset-bottom, 0px))"));
check("SUPPORT_CLOSE_BUTTON", js.includes('close.id = "supportSheetCloseV353"') && js.includes("closeManualSupport(true)"));
check("SUPPORT_CLOSE_STICKY_HEADER", css.includes(".v353-support-sheet-header") && css.includes("position: sticky") && css.includes(".v353-support-sheet-close"));
check("SUPPORT_ESCAPE_CLOSE", js.includes('event.key === "Escape"') && js.includes("closeManualSupport(true)"));
check("SUPPORT_FOCUS_CLOSE_ON_MOBILE", js.includes("mobileLayout() && close && visible(close) ? close : support"));
check("SUPPORT_ARIA_CONTROLS_STABLE", js.includes('support.setAttribute("aria-controls", "learningSupportRegionV349")'));
check("NO_CONTENT_PORTAL_OR_COPY", !/appendChild\(support\.firstChild\)|cloneNode\(|learningSupportInlineV353/.test(js));
check("NO_STORAGE_MUTATION", !/localStorage\.(?:setItem|removeItem|clear)|sessionStorage\.(?:setItem|removeItem|clear)/.test(js));
check("NO_LEARNING_STATE_MUTATION", !/\b(?:correct|confused|seen|currentIndex)\s*[=+]/.test(js));

let failed = 0;
console.log("=== PRT V353 A2 INTERACTION CLARITY AUDIT ===");
for (const row of checks) {
  console.log(row.name + "=" + (row.ok ? "PASS" : "FAIL") + (row.detail ? " DETAIL=" + row.detail : ""));
  if (!row.ok) failed += 1;
}
console.log("TOTAL_CHECKS=" + checks.length);
console.log("FAILED_CHECKS=" + failed);
console.log("RESULT=" + (failed ? "FAIL_V353_A2_INTERACTION_CLARITY_AUDIT" : "PASS_V353_A2_INTERACTION_CLARITY_AUDIT"));
if (failed) process.exit(1);

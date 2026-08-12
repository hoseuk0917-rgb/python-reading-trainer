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

check("V353_CSS_ONCE", (index.match(/interaction_clarity_v353\.css/g) || []).length === 1);
check("V353_JS_ONCE", (index.match(/interaction_clarity_v353\.js/g) || []).length === 1);
check("V353_AFTER_V351_CSS", index.indexOf("interaction_clarity_v353.css") > index.indexOf("contextual_practice_v351.css"));
check("V353_AFTER_V351_JS", index.indexOf("interaction_clarity_v353.js") > index.indexOf("contextual_practice_v351.js"));
check("FOCUS_VISUAL_LABEL_CONSTANT", css.includes('content: "집중 모드"') && css.includes('content: "Focus mode"'));
check("SUPPORT_VISUAL_LABEL_CONSTANT", css.includes('content: "보조 자료"') && css.includes('content: "Support"'));
check("FOCUS_ACTIVE_BY_ARIA", css.includes('#focusModeToggleV345[aria-pressed="true"]'));
check("FOCUS_INACTIVE_BY_ARIA", css.includes('#focusModeToggleV345[aria-pressed="false"]'));
check("SUPPORT_ACTIVE_BY_ARIA", css.includes('#learningSupportToggleV349[aria-expanded="true"]'));
check("DUPLICATE_HELP_HIDDEN", css.includes("#focusHelpV345") && css.includes("display: none !important"));
check("META_COPY_REMOVED", css.includes(".concept-intro-note-v306") && css.includes(".mobile-sidecards-note") && css.includes(".side-section-note"));
check("SUPPORT_MOVED_TO_CONTROL_CLUSTER", js.includes('support.parentElement !== bar') && js.includes('bar.appendChild(support)'));
check("SUPPORT_IMMEDIATE_POSITIONING", js.includes("alignSupportRegion") && js.includes("window.scrollTo") && js.includes('behavior: "auto"'));
check("SUPPORT_FOCUS_AFTER_POSITION", js.includes('support.focus({ preventScroll: true })'));
check("NO_STORAGE_MUTATION", !/localStorage\.(?:setItem|removeItem|clear)|sessionStorage\.(?:setItem|removeItem|clear)/.test(js));
check("NO_LEARNING_STATE_MUTATION", !/\b(?:correct|confused|seen|currentIndex)\s*[=+]/.test(js));

let failed = 0;
console.log("=== PRT V353 INTERACTION CLARITY AUDIT ===");
for (const row of checks) {
  console.log(row.name + "=" + (row.ok ? "PASS" : "FAIL") + (row.detail ? " DETAIL=" + row.detail : ""));
  if (!row.ok) failed += 1;
}
console.log("TOTAL_CHECKS=" + checks.length);
console.log("FAILED_CHECKS=" + failed);
console.log("RESULT=" + (failed ? "FAIL_V353_INTERACTION_CLARITY_AUDIT" : "PASS_V353_INTERACTION_CLARITY_AUDIT"));
if (failed) process.exit(1);

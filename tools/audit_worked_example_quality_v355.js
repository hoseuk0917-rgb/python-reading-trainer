"use strict";

const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const index = fs.readFileSync(path.join(root, "src/pwa/index.html"), "utf8");
const runtimePath = path.join(root, "src/pwa/worked_example_quality_v355.js");
const r2Path = path.join(root, "src/pwa/worked_example_quality_v355_r2.js");
const runtimeText = fs.readFileSync(runtimePath, "utf8");
const r2Text = fs.readFileSync(r2Path, "utf8");
const combinedRuntime = runtimeText + "\n" + r2Text;
const runtime = require(runtimePath);
const examples = runtime.EXAMPLES || {};
const alternates = runtime.ALTERNATES || {};
const rows = Object.entries(examples);
const alternateRows = Object.entries(alternates);
const allRows = rows.concat(alternateRows);
const checks = [];
function check(name, ok, detail) { checks.push({ name, ok: !!ok, detail: detail || "" }); }

check("VERSION", runtime.VERSION === "v355_a1", runtime.VERSION);
check("V355_CSS_ONCE", (index.match(/worked_example_quality_v355\.css/g) || []).length === 1);
check("V355_JS_ONCE", (index.match(/worked_example_quality_v355\.js/g) || []).length === 1);
check("V355_R2_JS_ONCE", (index.match(/worked_example_quality_v355_r2\.js/g) || []).length === 1);
check("V355_AFTER_V353_CSS", index.indexOf("worked_example_quality_v355.css") > index.indexOf("interaction_clarity_v353.css"));
check("V355_AFTER_V353_JS", index.indexOf("worked_example_quality_v355.js") > index.indexOf("interaction_clarity_v353.js"));
check("V355_R2_AFTER_V355", index.indexOf("worked_example_quality_v355_r2.js") > index.indexOf("worked_example_quality_v355.js"));
check("CURATED_EXAMPLE_COUNT", rows.length >= 40, String(rows.length));
check("ALTERNATE_EXAMPLE_PARITY", alternateRows.length === rows.length && rows.every(([key]) => alternates[key]), rows.length + "/" + alternateRows.length);
check("EVERY_CURATED_HAS_CODE", allRows.every(([, value]) => value && String(value.code || "").trim().length > 0));
check("EVERY_CURATED_HAS_OUTPUT", allRows.every(([, value]) => value && String(value.output || "").trim().length > 0));
check("EVERY_CURATED_HAS_CONCEPT_TOKEN", allRows.every(([, value]) => value && value.token && String(value.code).includes(String(value.token))));
check("TYPE_SAME_FUNCTION", examples.type && examples.type.code.includes("type(number)") && examples.type.code.includes("type(word)"));
check("TYPE_DIFFERENT_INPUTS", examples.type && examples.type.code.includes("number = 8") && examples.type.code.includes('word = "hello"') && !examples.type.code.includes("value = 3"));
check("TYPE_OUTPUT_EXPLICIT", examples.type && examples.type.output === "<class 'int'>\n<class 'str'>");
check("TYPE_ALTERNATE_DIFFERENT_VALUES", alternates.type && alternates.type.code.includes("score = 42") && alternates.type.code.includes('name = "Mina"'));
check("EXACT_PRIMARY_ONLY", runtimeText.includes("variantsFor(primary)") && runtimeText.includes("chooseCurated(engine, card, cardsValue, index, primary)") && runtimeText.includes("return null;"));
check("NO_PREVIOUS_CONCEPT_FALLBACK", !runtimeText.includes('source: "previous"'));
check("DISTINCTNESS_GATE", runtimeText.includes("isWorkedExampleDistinct"));
check("KNOWN_SYNTAX_GATE", runtimeText.includes("exampleUsesOnlyKnownNamedSyntax"));
check("CURRENT_CARD_SYNTAX_REUSE", runtimeText.includes("allowedWithCurrentCardSyntax") && runtimeText.includes('allowed.add(entry[0])') && runtimeText.includes('["print", /\\bprint'));
check("ALTERNATE_DISTINCTNESS_SELECTION", runtimeText.includes("variants.some") && runtimeText.includes("chooseCurated"));
check("R2_TAKES_UI_OWNERSHIP", r2Text.includes("takeUiOwnership") && r2Text.includes("__workedExampleQualityV355Observer") && r2Text.includes("legacy.disconnect()"));
check("R2_DIRECT_RENDER", r2Text.includes("buildWorkedExample") && r2Text.includes("box.innerHTML = \"\"") && r2Text.includes("worked-v355-output"));
check("R2_SPECIAL_MAIN_FALLBACK", r2Text.includes("SPECIAL_VARIANTS") && r2Text.includes("count = 2") && r2Text.includes("count + 3") && r2Text.includes("installSpecialFallback"));
check("R2_BOUNDED_RECONCILIATION", r2Text.includes("scheduleBoundedRefresh") && r2Text.includes("[0, 40, 120, 300]"));
check("OUTPUT_UI", runtimeText.includes("worked-v355-output") && runtimeText.includes('t(win, "출력", "Output")'));
check("NO_OLD_META_NOTE", runtimeText.includes("if (meta) meta.remove()") && runtimeText.includes("if (note) note.remove()"));
check("NO_STORAGE_MUTATION", !/localStorage\.(?:setItem|removeItem|clear)|sessionStorage\.(?:setItem|removeItem|clear)/.test(combinedRuntime));
const learningStateWrite = /\bsaveProgress\s*\(|\b(?:correct|confused|seen)\s*\[[^\]]+\]\s*=(?!=)|\bcurrentIndex\s*=(?!=)/;
check("NO_LEARNING_PROGRESS_MUTATION", !learningStateWrite.test(combinedRuntime));

let failed = 0;
console.log("=== PRT V355 WORKED EXAMPLE QUALITY AUDIT ===");
for (const item of checks) {
  console.log(item.name + "=" + (item.ok ? "PASS" : "FAIL") + (item.detail ? " DETAIL=" + item.detail : ""));
  if (!item.ok) failed += 1;
}
console.log("CURATED_KEYS=" + rows.map(([key]) => key).join(","));
console.log("PRIMARY_VARIANTS=" + rows.length);
console.log("ALTERNATE_VARIANTS=" + alternateRows.length);
console.log("TOTAL_CHECKS=" + checks.length);
console.log("FAILED_CHECKS=" + failed);
console.log("RESULT=" + (failed ? "FAIL_V355_WORKED_EXAMPLE_QUALITY_AUDIT" : "PASS_V355_WORKED_EXAMPLE_QUALITY_AUDIT"));
if (failed) process.exit(1);

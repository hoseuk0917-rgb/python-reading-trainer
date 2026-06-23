const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10n_source_level_study_tools_i18n_cleanup.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10n_source_level_study_tools_i18n_cleanup.json");

let text = fs.readFileSync(APP, "utf8");

const beforeLength = text.length;

// 1) Remove ragged runtime residual patches. These were DOM-after-the-fact patches, not source fixes.
const runtimeBlockRe = /\/\/ V334_A10[I-L][^\n]*START[\s\S]*?\/\/ V334_A10[I-L][^\n]*END\r?\n?/g;
const runtimeBlocks = text.match(runtimeBlockRe) || [];
text = text.replace(runtimeBlockRe, "");

// 2) Remove duplicated second Study Tools V7 block, keeping the first canonical V7 block.
const startMarker = "// === STUDY TOOLS V7 START ===";
const endMarker = "// === STUDY TOOLS V7 END ===";
const firstStart = text.indexOf(startMarker);
const secondStart = firstStart >= 0 ? text.indexOf(startMarker, firstStart + startMarker.length) : -1;

let removedDuplicateStudyTools = false;

if (secondStart >= 0) {
  const secondEnd = text.indexOf(endMarker, secondStart);
  if (secondEnd < 0) {
    throw new Error("Second Study Tools V7 block found but end marker is missing.");
  }
  const removeEnd = secondEnd + endMarker.length;
  text = text.slice(0, secondStart) + text.slice(removeEnd).replace(/^\r?\n/, "");
  removedDuplicateStudyTools = true;
}

// 3) Remove old A10N helper if rerun.
text = text.replace(/\/\/ V334_A10N_STUDY_TOOLS_SOURCE_I18N_HELPER_START[\s\S]*?\/\/ V334_A10N_STUDY_TOOLS_SOURCE_I18N_HELPER_END\r?\n?/g, "");

// 4) Insert a small source-level helper before Study Tools V7.
const helper = `
// V334_A10N_STUDY_TOOLS_SOURCE_I18N_HELPER_START
function isEnglishLocaleV334A10N() {
  try {
    if (typeof window !== "undefined") {
      const urlLang = new URLSearchParams(window.location.search).get("lang");
      if (urlLang) return String(urlLang).toLowerCase().startsWith("en");

      const stored = window.localStorage && (
        window.localStorage.getItem("pythonReadingTrainerLocaleV334") ||
        window.localStorage.getItem("python-reading-trainer-lang")
      );
      if (stored) return String(stored).toLowerCase().startsWith("en");
    }

    if (typeof document !== "undefined" && document.documentElement) {
      const lang = document.documentElement.getAttribute("lang") || "";
      if (lang) return String(lang).toLowerCase().startsWith("en");
    }
  } catch (error) {
    return false;
  }

  return false;
}

function studyToolsTextV334A10N(ko, en) {
  return isEnglishLocaleV334A10N() ? en : ko;
}
// V334_A10N_STUDY_TOOLS_SOURCE_I18N_HELPER_END

`;

const canonicalStart = text.indexOf(startMarker);
if (canonicalStart < 0) {
  throw new Error("Canonical Study Tools V7 block not found.");
}

text = text.slice(0, canonicalStart) + helper + text.slice(canonicalStart);

// 5) Source-level Study Tools fixes.
const replacements = [
  {
    name: "pseudo_title_after",
    oldValue: 'content: " · 현재 필터 기준으로 검색/오늘 큐 생성";',
    newValue: 'content: "";'
  },
  {
    name: "today_button",
    oldValue: 'todayBtn.textContent = "현재 조건으로 오늘 최대 10장";',
    newValue: 'todayBtn.textContent = studyToolsTextV334A10N("현재 조건으로 오늘 최대 10장", "Up to 10 today from current filters");'
  },
  {
    name: "empty_queue_box",
    oldValue: `box.innerHTML = '<div class="study-tools-empty">오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러보세요.</div>';`,
    newValue: `box.innerHTML = '<div class="study-tools-empty">' + studyToolsTextV334A10N("오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러보세요.", "Today's queue is empty. Change filters or press Today 10.") + '</div>';`
  },
  {
    name: "help_line",
    oldValue: `help.innerHTML = "현재 조건: <b>" + levelText + "</b> · <b>" + modeText + "</b> · 오늘 큐 <b>" + queueCount + "장</b>." + warning + " 10장을 원하면 레벨을 <b>전체 레벨</b>로 바꾸세요.";`,
    newValue: `const warningEnV334A10N = warning ? " Current filters may not produce 10 cards." : "";
  help.innerHTML = isEnglishLocaleV334A10N()
    ? "Current filters: <b>" + levelText + "</b> · <b>" + modeText + "</b> · today's queue <b>" + queueCount + "</b>." + warningEnV334A10N + " To build 10 cards, change the level to <b>All levels</b>."
    : "현재 조건: <b>" + levelText + "</b> · <b>" + modeText + "</b> · 오늘 큐 <b>" + queueCount + "장</b>." + warning + " 10장을 원하면 레벨을 <b>전체 레벨</b>로 바꾸세요.";`
  },
  {
    name: "no_matching_cards_alert",
    oldValue: `alert("조건에 맞는 카드가 없습니다.");`,
    newValue: `alert(studyToolsTextV334A10N("조건에 맞는 카드가 없습니다.", "No cards match the current filters."));`
  },
  {
    name: "not_in_queue_alert",
    oldValue: `alert("현재 카드는 오늘 큐 안의 카드가 아닙니다.");`,
    newValue: `alert(studyToolsTextV334A10N("현재 카드는 오늘 큐 안의 카드가 아닙니다.", "The current card is not in today's queue."));`
  },
  {
    name: "empty_queue_alert",
    oldValue: `alert("오늘 큐가 비어 있습니다.");`,
    newValue: `alert(studyToolsTextV334A10N("오늘 큐가 비어 있습니다.", "Today's queue is empty."));`
  },
  {
    name: "queue_complete_alert",
    oldValue: `alert("오늘 큐를 모두 완료했습니다.");`,
    newValue: `alert(studyToolsTextV334A10N("오늘 큐를 모두 완료했습니다.", "Today's queue is complete."));`
  },
  {
    name: "queue_status",
    oldValue: `status.textContent = "오늘 큐 " + doneCount + " / " + queueCards.length + " 완료" + (idx >= 0 ? " · 현재 " + (idx + 1) + "번째" : "");`,
    newValue: `status.textContent = isEnglishLocaleV334A10N()
    ? "Today's queue " + doneCount + " / " + queueCards.length + " complete" + (idx >= 0 ? " · current " + (idx + 1) : "")
    : "오늘 큐 " + doneCount + " / " + queueCards.length + " 완료" + (idx >= 0 ? " · 현재 " + (idx + 1) + "번째" : "");`
  }
];

const applied = [];

for (const item of replacements) {
  const count = text.split(item.oldValue).length - 1;
  if (count > 0) {
    text = text.split(item.oldValue).join(item.newValue);
  }
  applied.push({ name: item.name, count });
}

// 6) Normalize version.
for (const file of [ROOT_INDEX, INDEX]) {
  let value = fs.readFileSync(file, "utf8");
  value = value.replace(/20260622_v334_a10[a-z]*/g, "20260622_v334_a10n");
  fs.writeFileSync(file, value, "utf8");
}

text = text.replace(/20260622_v334_a10[a-z]*/g, "20260622_v334_a10n");

fs.writeFileSync(APP, text, "utf8");

const finalText = fs.readFileSync(APP, "utf8");
const runtimeMarkersLeft = (finalText.match(/V334_A10[I-L]/g) || []).length;
const studyToolsV7Starts = (finalText.match(/\/\/ === STUDY TOOLS V7 START ===/g) || []).length;
const studyToolsV7Ends = (finalText.match(/\/\/ === STUDY TOOLS V7 END ===/g) || []).length;

const report = {
  audit: "V334_A10N_SOURCE_LEVEL_STUDY_TOOLS_I18N_CLEANUP",
  version: "20260622_v334_a10n",
  removed_runtime_blocks: runtimeBlocks.length,
  removed_duplicate_study_tools_v7: removedDuplicateStudyTools,
  study_tools_v7_starts: studyToolsV7Starts,
  study_tools_v7_ends: studyToolsV7Ends,
  runtime_markers_left: runtimeMarkersLeft,
  replacements: applied,
  before_length: beforeLength,
  after_length: finalText.length
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A10N Source-level Study Tools i18n Cleanup");
md.push("");
md.push("Purpose: remove ragged runtime residual patches and fix Study Tools EN/KO copy at the source.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260622_v334_a10n |");
md.push("| removed runtime blocks | " + runtimeBlocks.length + " |");
md.push("| removed duplicate Study Tools V7 block | " + (removedDuplicateStudyTools ? "YES" : "NO") + " |");
md.push("| Study Tools V7 starts | " + studyToolsV7Starts + " |");
md.push("| Study Tools V7 ends | " + studyToolsV7Ends + " |");
md.push("| runtime markers left | " + runtimeMarkersLeft + " |");
md.push("");
md.push("## Replacement counts");
md.push("");
md.push("| replacement | count |");
md.push("|---|---:|");
for (const item of applied) {
  md.push("| " + item.name + " | " + item.count + " |");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A10N_SOURCE_LEVEL_STUDY_TOOLS_I18N_CLEANUP");
console.log("version=20260622_v334_a10n");
console.log("removed_runtime_blocks=" + runtimeBlocks.length);
console.log("removed_duplicate_study_tools_v7=" + removedDuplicateStudyTools);
console.log("study_tools_v7_starts=" + studyToolsV7Starts);
console.log("study_tools_v7_ends=" + studyToolsV7Ends);
console.log("runtime_markers_left=" + runtimeMarkersLeft);
console.log("report=" + path.relative(ROOT, OUT_MD));

if (runtimeMarkersLeft !== 0) {
  throw new Error("A10I-L runtime markers still remain.");
}

if (studyToolsV7Starts !== 1 || studyToolsV7Ends !== 1) {
  throw new Error("Study Tools V7 block count is not exactly one.");
}

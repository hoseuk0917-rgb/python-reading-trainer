const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EN_ROOT = path.join(ROOT, "data_i18n", "en");

const APP = path.join(ROOT, "src", "pwa", "app.js");
const INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10q_safe_en_residual_source_fixes.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10q_safe_en_residual_source_fixes.json");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith(".json")) out.push(full);
  }
  return out;
}

const exactPathMap = new Map([
  [
    "data_i18n\\en\\lessons\\python_core_gaps_v99_a1.json::10.explanation",
    "pop() removes and returns the last value in a list. In this example, the last value C is stored in `value`, and only A and B remain in `items`. Because `pop()` changes both the returned value and the original list, it can be confusing if you look at only one output. Track the returned value, the changed list, and any later line that uses that list. Therefore the outputs are `C` and `['A', 'B']`, in order. As an answer choice, `C\\n['A', 'B']` is correct."
  ],
  [
    "data_i18n\\en\\lessons\\python_core_gaps_v99_a1.json::11.explanation",
    "`pop(0)` removes and returns the value at index 0. In this example, the first value A is stored in `value`, and the remaining list contains B and C. When you omit the index, `pop()` removes the last value, but when you pass `0`, it removes the value at that position. Also notice that the later elements shift forward after execution. Therefore the outputs are `A` and `['B', 'C']`, in order. As an answer choice, `A\\n['B', 'C']` is correct."
  ],
  [
    "data_i18n\\en\\lessons\\python_core_gaps_v99_a1.json::12.explanation",
    "`setdefault` inserts the default value only when the key does not already exist. If the key already exists, it keeps the existing value. In this example, key `a` is already present, so the new default value is not overwritten, and the existing value 2 is returned. `counts['a']` also remains 2. This method is often used for dictionary accumulation or grouping. The key point is that it fills only missing keys, unlike direct bracket assignment. Therefore the outputs are `2` and `2`, in order. As an answer choice, `2\\n2` is correct."
  ],
  [
    "data_i18n\\en\\lessons\\python_core_gaps_v99_a1.json::14.explanation",
    "`row.pop('temp')` returns the value 99 and removes the `temp` key from `row`. Therefore `'temp' in row` is False. `pop` both returns a value and deletes the key, so you need to remember that the dictionary structure changes afterward. Therefore the outputs are `99` and `False`, in order. As an answer choice, `99\\nFalse` is correct."
  ],
  [
    "data_i18n\\en\\lessons\\python_core_gaps_v99_a1.json::19.explanation",
    "`readline` reads only one line from the current file position and then moves the read position to the next line. If `readlines` is called after that, it does not start from the beginning again; it reads only the remaining lines. In this example, the first line A has already been read, so only B remains in `rest`, and its length is 1. For file-reading questions, track not only the function name but also the current cursor position. Therefore the outputs are `A` and `1`, in order. As an answer choice, `A\\n1` is correct."
  ],
  [
    "data_i18n\\en\\lessons\\python_core_gaps_v99_a1.json::25.explanation",
    "The values that pass the condition `n % 2 == 0` are 2 and 4. A set removes duplicates, so 2 remains only once. A set comprehension uses a loop and a condition to create a result set without duplicates. It is useful when you want to collect only values that satisfy a condition."
  ],
  [
    "data_i18n\\en\\lessons\\python_argparse_cli_beginner_v125_a1.json::7.reading_goal",
    "Understand why the `if __name__ == '__main__'` structure prevents automatic execution during import."
  ],
  [
    "data_i18n\\en\\lessons\\python_libraries_missing_topics_v11.json::5.question",
    "What is the purpose of `if __name__ == '__main__'`?"
  ],
  [
    "data_i18n\\en\\lessons\\python_project_structure_imports_v18.json::5.title",
    "Reading `if __name__ == '__main__'`"
  ]
]);

const exactMap = new Map([
  ["KG/JSONL/LLM/PM 관점 연결 설명", "Connection explanation from KG/JSONL/LLM/PM perspectives"],
  ["이 카드에서 읽을 수 있어야 하는 코드 흐름", "Code flow the learner should be able to read in this card"],
  ["사용자에게 보여줄 질문", "Question shown to the learner"],
  ["선택지가 필요한 경우", "When answer choices are required"],
  ["사이드 카드 제목", "Side card title"],
  ["짧은 해설", "Short explanation"],

  ["Python 함수", "Python function"],
  ["Git 커밋 생성", "Create a Git commit"],
  ["파일 이름", "File name"],
  ["함수 정의", "Function definition"],
  ["파일 저장", "Save file"],
  ["오류 처리", "Error handling"],
  ["사이드카드", "Side card"],
  ["웹서버", "Web server"],
  ["기본값", "Default value"],
  ["오류", "Error"],
  ["함수", "Function"],
  ["없음", "None"],

  ["['A\\n', 'B\\n']가 된다", "It becomes ['A\\n', 'B\\n']"]
]);

const phrasePairs = [
  ["입력 파일이 없습니다", "Input file does not exist"],
  ["txt만 가능", "Only .txt files are allowed"],
  ["불러오는 중", "Loading"],
  ["불러오지 못했습니다", "Could not load"],
  ["표시할 카드가 없습니다", "No cards to show"],
  ["정말 진도를 초기화할까요?", "Reset progress?"],
  ["오프라인 상태입니다", "You are offline"],
  ["다시 연결되었습니다", "Back online"],
  ["오래된 버전입니다", "This version is outdated"],
  ["조건에 맞는 카드가 없습니다", "No cards match the current filters"],
  ["근거 문서가 부족합니다.", "There is not enough supporting context."],
  ["학년:", "Grade:"],
  ["질문:", "Question:"],
  ["근거:", "Evidence:"],
  ["점수", "score"]
];

function applyText(value, rel, jsonPath) {
  const key = rel + "::" + jsonPath.join(".");
  if (exactPathMap.has(key)) {
    return exactPathMap.get(key);
  }

  if (exactMap.has(value)) {
    return exactMap.get(value);
  }

  let next = value;

  for (const [from, to] of phrasePairs) {
    next = next.split(from).join(to);
  }

  return next;
}

function visit(value, rel, jsonPath, changes) {
  if (typeof value === "string") {
    const after = applyText(value, rel, jsonPath);
    if (after !== value) {
      changes.push({
        file: rel,
        path: jsonPath.join("."),
        before: value,
        after
      });
      return after;
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => visit(item, rel, jsonPath.concat(String(index)), changes));
  }

  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = visit(value[key], rel, jsonPath.concat(key), changes);
    }
    return out;
  }

  return value;
}

const changes = [];

for (const file of walk(EN_ROOT)) {
  const rel = path.relative(ROOT, file);
  const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const data = JSON.parse(raw);

  const fileChanges = [];
  const next = visit(data, rel, [], fileChanges);

  if (fileChanges.length > 0) {
    fs.writeFileSync(file, JSON.stringify(next, null, 2) + "\n", "utf8");
    changes.push(...fileChanges);
  }
}

for (const file of [ROOT_INDEX, INDEX, APP]) {
  let value = fs.readFileSync(file, "utf8");
  value = value.replace(/20260622_v334_a10[a-z]*/g, "20260622_v334_a10q");
  fs.writeFileSync(file, value.replace(/\s+$/g, "") + "\n", "utf8");
}

const byFile = new Map();
for (const change of changes) {
  byFile.set(change.file, (byFile.get(change.file) || 0) + 1);
}

const report = {
  audit: "V334_A10Q_SAFE_EN_RESIDUAL_SOURCE_FIXES",
  version: "20260622_v334_a10q",
  changed_values: changes.length,
  changed_files: byFile.size,
  by_file: Object.fromEntries(Array.from(byFile.entries()).sort((a, b) => b[1] - a[1])),
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A10Q Safe EN Residual Source Fixes");
md.push("");
md.push("Purpose: fix high-confidence Korean residuals directly in data_i18n/en and stop adding runtime residual patches.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260622_v334_a10q |");
md.push("| changed values | " + changes.length + " |");
md.push("| changed files | " + byFile.size + " |");
md.push("");
md.push("## Changed files");
md.push("");
md.push("| file | changes |");
md.push("|---|---:|");
for (const [file, count] of Array.from(byFile.entries()).sort((a, b) => b[1] - a[1])) {
  md.push("| " + file + " | " + count + " |");
}
md.push("");
md.push("## Sample changes");
md.push("");
for (const change of changes.slice(0, 80)) {
  md.push("### " + change.file + " :: " + change.path);
  md.push("");
  md.push("before:");
  md.push("");
  md.push("    " + change.before.replace(/\n/g, "\n    "));
  md.push("");
  md.push("after:");
  md.push("");
  md.push("    " + change.after.replace(/\n/g, "\n    "));
  md.push("");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A10Q_SAFE_EN_RESIDUAL_SOURCE_FIXES");
console.log("version=20260622_v334_a10q");
console.log("changed_values=" + changes.length);
console.log("changed_files=" + byFile.size);
console.log("report=" + path.relative(ROOT, OUT_MD));

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const APP = path.join(ROOT, "src", "pwa", "app.js");
const INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10r_final_visible_en_residual_fixes.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10r_final_visible_en_residual_fixes.json");

const fixes = [
  {
    file: "data_i18n/en/lessons/python_foundation_beginner_v94_a1_part2.json",
    path: ["13", "explanation"],
    value: "The result of `input()` is the string \"10,\" and when a suffix string meaning age is appended to it, the result becomes an age-style text value. This problem is a beginner-level reading comprehension exercise designed to check whether a value is a string or a number, and whether a conversion function has been applied. The correct answer is determined by Python’s actual execution rules, not by the appearance of the options. In particular, you should be careful not to assume that the value received via `input()` is automatically treated as a number. When reading similar code, check in order: whether quotes are present, the data type of the `input()` result, conversion functions like `int()` or `str()`, and the final value displayed by `print`."
  },
  {
    file: "data_i18n/en/lessons/python_foundation_beginner_v94_a1_part2.json",
    path: ["3", "explanation"],
    value: "`str(count)` converts the number 3 into the string \"3\". When that string is combined with a suffix string, the final result is also a string. This problem is a beginner-level reading comprehension exercise designed to check whether a value is a string or a number, and whether a conversion function has been applied. The correct answer is determined by Python’s actual execution rules, not by the appearance of the options. In particular, you should be careful not to assume that numbers and strings can always be added directly. When reading similar code, check in order: quotes, data type, conversion functions like `int()` or `str()`, and the final value displayed by `print`."
  },
  {
    file: "data_i18n/en/lessons/python_foundation_beginner_v94_a1_part2.json",
    path: ["3", "question"],
    value: "If you convert `count` to a string, what is the output of adding `text` and the suffix string?"
  },
  {
    file: "data_i18n/en/lessons/python_project_expansion_v6.json",
    path: ["16", "answer"],
    value: "Tab"
  },
  {
    file: "data_i18n/en/lessons/python_project_expansion_v6.json",
    path: ["16", "choices", "0"],
    value: "Tab"
  }
];

function getAt(obj, parts) {
  let cur = obj;
  for (const part of parts) cur = cur[part];
  return cur;
}

function setAt(obj, parts, value) {
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i += 1) {
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

const changes = [];

for (const fix of fixes) {
  const full = path.join(ROOT, fix.file);
  const data = JSON.parse(fs.readFileSync(full, "utf8").replace(/^\uFEFF/, ""));
  const before = getAt(data, fix.path);

  if (before !== fix.value) {
    setAt(data, fix.path, fix.value);
    fs.writeFileSync(full, JSON.stringify(data, null, 2) + "\n", "utf8");
    changes.push({
      file: fix.file,
      path: fix.path.join("."),
      before,
      after: fix.value
    });
  }
}

for (const file of [ROOT_INDEX, INDEX, APP]) {
  let value = fs.readFileSync(file, "utf8");
  value = value.replace(/20260622_v334_a10[a-z]*/g, "20260622_v334_a10r");
  fs.writeFileSync(file, value.replace(/\s+$/g, "") + "\n", "utf8");
}

const report = {
  audit: "V334_A10R_FINAL_VISIBLE_EN_RESIDUAL_FIXES",
  version: "20260622_v334_a10r",
  changed_values: changes.length,
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A10R Final Visible EN Residual Fixes");
md.push("");
md.push("Purpose: remove the last five visible_must_fix Korean residuals from data_i18n/en.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260622_v334_a10r |");
md.push("| changed values | " + changes.length + " |");
md.push("");
md.push("## Changes");
md.push("");

for (const change of changes) {
  md.push("### " + change.file + " :: " + change.path);
  md.push("");
  md.push("before:");
  md.push("");
  md.push("    " + String(change.before).replace(/\n/g, "\n    "));
  md.push("");
  md.push("after:");
  md.push("");
  md.push("    " + String(change.after).replace(/\n/g, "\n    "));
  md.push("");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A10R_FINAL_VISIBLE_EN_RESIDUAL_FIXES");
console.log("version=20260622_v334_a10r");
console.log("changed_values=" + changes.length);
console.log("report=" + path.relative(ROOT, OUT_MD));

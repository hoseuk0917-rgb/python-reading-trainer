const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const targets = [
  "현재 필터 기준으로 검색/오늘 큐 생성",
  "현재 필터 기준으로 검색",
  "오늘 큐 생성",
  "레벨을",
  "바꾸세요",
  "All levels로",
  "Study tools",
  "To create",
  "오늘 큐",
  "조건을 바꾸거나",
  "Today 10"
];

const includeExt = new Set([".js", ".html", ".json", ".md"]);
const skipDirs = new Set([".git", "node_modules", ".tmp", "dist", "build"]);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (includeExt.has(path.extname(full).toLowerCase())) out.push(full);
  }
  return out;
}

function lineNoAt(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

const hits = [];

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }

  for (const target of targets) {
    let from = 0;
    while (true) {
      const idx = text.indexOf(target, from);
      if (idx < 0) break;

      const line = lineNoAt(text, idx);
      const lines = text.split(/\r?\n/);
      const start = Math.max(0, line - 4);
      const end = Math.min(lines.length, line + 3);

      hits.push({
        file: rel,
        line,
        target,
        context: lines.slice(start, end).map((v, i) => `${start + i + 1}: ${v}`).join("\n")
      });

      from = idx + target.length;
    }
  }
}

const outDir = path.join(ROOT, "docs", "quality");
fs.mkdirSync(outDir, { recursive: true });

const outJson = path.join(outDir, "v334_a10m_exact_residual_source_locator.json");
const outMd = path.join(outDir, "v334_a10m_exact_residual_source_locator.md");

fs.writeFileSync(outJson, JSON.stringify({ hits }, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A10M Exact Residual Source Locator");
md.push("");
md.push(`hits: ${hits.length}`);
md.push("");

for (const h of hits) {
  md.push(`## ${h.file}:${h.line}`);
  md.push("");
  md.push(`target: ${h.target}`);
  md.push("");
  md.push("    " + h.context.replace(/\n/g, "\n    "));
  md.push("");
}

fs.writeFileSync(outMd, md.join("\n"), "utf8");

console.log("V334_A10M_EXACT_RESIDUAL_SOURCE_LOCATOR");
console.log("hits=" + hits.length);
console.log("report=" + path.relative(ROOT, outMd));

const important = hits.filter(h =>
  h.file === "src\\pwa\\app.js" ||
  h.file === "src/pwa/app.js" ||
  h.file.includes("data_i18n") ||
  h.target.includes("레벨") ||
  h.target.includes("현재 필터")
);

console.log("");
console.log("=== important hits ===");
for (const h of important.slice(0, 80)) {
  console.log(`${h.file}:${h.line} :: ${h.target}`);
}

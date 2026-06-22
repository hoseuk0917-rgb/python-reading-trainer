const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const files = [
  "index.html",
  "src/pwa/index.html",
  "src/pwa/app.js"
];

const NEXT = "20260622_v334_a9";

for (const rel of files) {
  const abs = path.join(ROOT, rel);
  let text = fs.readFileSync(abs, "utf8");

  text = text.replaceAll("20260621_v334_a7", NEXT);
  text = text.replaceAll("20260619_v328_a2", NEXT);
  text = text.replaceAll("20260619_v328_a3", NEXT);
  text = text.replaceAll("20260619_v328_a2_layout", NEXT);
  text = text.replaceAll("20260619_v328_a3_finish", NEXT);

  fs.writeFileSync(abs, text, "utf8");
  console.log("version_bumped=" + rel);
}

console.log("V334_A9_VERSION_BUMPED");
console.log("version=" + NEXT);

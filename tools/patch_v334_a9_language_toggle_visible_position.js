const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");

let text = fs.readFileSync(APP, "utf8");

text = text.replace('wrap.style.bottom = "18px";', 'wrap.style.top = "86px";');
text = text.replace('wrap.style.right = "18px";', 'wrap.style.left = "12px";');

text = text.replace('wrap.style.background = "rgba(15, 23, 42, 0.82)";', 'wrap.style.background = "rgba(15, 23, 42, 0.96)";');
text = text.replace('wrap.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.22)";', 'wrap.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.32)";');

if (!text.includes('wrap.style.outline = "2px solid rgba(59, 130, 246, 0.55)";')) {
  text = text.replace(
    'wrap.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.32)";',
    'wrap.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.32)";\n  wrap.style.outline = "2px solid rgba(59, 130, 246, 0.55)";'
  );
}

fs.writeFileSync(APP, text, "utf8");

console.log("V334_A9_LANGUAGE_TOGGLE_VISIBLE_POSITION_FIXED");
console.log("file=src/pwa/app.js");

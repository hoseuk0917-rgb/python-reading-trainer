const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");

let text = fs.readFileSync(APP, "utf8");

text = text.replace('wrap.style.top = "86px";', 'wrap.style.top = "52px";');
text = text.replace('wrap.style.left = "12px";', 'wrap.style.right = "92px";');

text = text.replace('wrap.style.outline = "2px solid rgba(59, 130, 246, 0.55)";', 'wrap.style.outline = "none";');
text = text.replace('wrap.style.padding = "4px";', 'wrap.style.padding = "3px";');
text = text.replace('btn.style.padding = "6px 10px";', 'btn.style.padding = "5px 9px";');

fs.writeFileSync(APP, text, "utf8");

console.log("V334_A9_LANGUAGE_TOGGLE_POSITION_POLISHED");
console.log("file=src/pwa/app.js");

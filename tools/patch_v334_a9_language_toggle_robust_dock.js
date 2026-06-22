const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");

let text = fs.readFileSync(APP, "utf8");

const oldFind = `function findProgressResetButtonV334A9() {
  return Array.from(document.querySelectorAll("button")).find(function(btn) {
    const label = (btn.textContent || "").replace(/\\s+/g, " ").trim();
    return label === "진도 초기화" || label === "Reset progress";
  });
}`;

const newFind = `function findProgressResetButtonV334A9() {
  const candidates = Array.from(document.querySelectorAll("button, a, [role='button'], input, span, div"))
    .filter(function(el) {
      if (!el || el.closest("#languageToggleV334A9")) {
        return false;
      }

      const label = ((el.value || el.textContent || "") + "").replace(/\\s+/g, " ").trim();
      if (!(label === "진도 초기화" || label === "Reset progress")) {
        return false;
      }

      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })
    .sort(function(a, b) {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const aScore = Math.abs(ar.top) + Math.abs(window.innerWidth - ar.right);
      const bScore = Math.abs(br.top) + Math.abs(window.innerWidth - br.right);
      return aScore - bScore;
    });

  return candidates[0] || null;
}`;

if (!text.includes(oldFind)) {
  throw new Error("old findProgressResetButtonV334A9 block not found");
}

text = text.replace(oldFind, newFind);

fs.writeFileSync(APP, text, "utf8");

console.log("V334_A9_LANGUAGE_TOGGLE_ROBUST_DOCK_PATCHED");
console.log("file=src/pwa/app.js");

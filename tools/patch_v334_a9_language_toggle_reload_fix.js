const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");

let text = fs.readFileSync(APP, "utf8");

const newSetFunction = `function setLanguageAndReloadV334A9(lang) {
  if (!SUPPORTED_LANGUAGES_V334_A9.includes(lang) || lang === currentLanguage) {
    return;
  }

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY_V334_A9, lang);
  } catch (err) {
    console.warn("Could not save language preference:", err);
  }

  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    url.searchParams.set("b", String(Date.now()));
    window.location.assign(url.toString());
    return;
  } catch (err) {
    console.warn("Could not update language URL:", err);
  }

  window.location.reload();
}`;

text = text.replace(
  /function setLanguageAndReloadV334A9\(lang\) \{[\s\S]*?\n\}\n\nfunction renderLanguageToggleV334A9\(\) \{/,
  newSetFunction + "\n\nfunction renderLanguageToggleV334A9() {"
);

text = text.replace('wrap.style.top = "12px";', 'wrap.style.bottom = "18px";');
text = text.replace('wrap.style.right = "12px";', 'wrap.style.right = "18px";');

fs.writeFileSync(APP, text, "utf8");

console.log("V334_A9_LANGUAGE_TOGGLE_RELOAD_AND_POSITION_FIXED");
console.log("file=src/pwa/app.js");

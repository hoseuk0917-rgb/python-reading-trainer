const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");

let text = fs.readFileSync(APP, "utf8");

const marker = "LANGUAGE_TOGGLE_I18N_V334_A9";

if (!text.includes(marker)) {
  const anchor = "let sideCards = [];\n";
  if (!text.includes(anchor)) {
    throw new Error("Could not find app state anchor: let sideCards = [];");
  }

  const block = `let sideCards = [];\n\n// === LANGUAGE_TOGGLE_I18N_V334_A9 START ===\nconst LANGUAGE_STORAGE_KEY_V334_A9 = "pythonReadingTrainer.language";\nconst SUPPORTED_LANGUAGES_V334_A9 = ["ko", "en"];\nlet currentLanguage = readStoredLanguageV334A9();\n\nfunction readStoredLanguageV334A9() {\n  try {\n    const params = new URLSearchParams(window.location.search || "");\n    const queryLang = params.get("lang");\n    if (SUPPORTED_LANGUAGES_V334_A9.includes(queryLang)) {\n      localStorage.setItem(LANGUAGE_STORAGE_KEY_V334_A9, queryLang);\n      return queryLang;\n    }\n\n    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY_V334_A9);\n    if (SUPPORTED_LANGUAGES_V334_A9.includes(stored)) {\n      return stored;\n    }\n  } catch (err) {\n    console.warn("Language preference unavailable:", err);\n  }\n\n  return "ko";\n}\n\nfunction getLocalizedDataRootV334A9() {\n  return currentLanguage === "en" ? "../../data_i18n/en" : "../../data";\n}\n\nfunction localizedDataPath(path) {\n  return String(path || "").replace("../../data/", getLocalizedDataRootV334A9() + "/");\n}\n\nfunction setLanguageAndReloadV334A9(lang) {\n  if (!SUPPORTED_LANGUAGES_V334_A9.includes(lang) || lang === currentLanguage) {\n    return;\n  }\n\n  try {\n    localStorage.setItem(LANGUAGE_STORAGE_KEY_V334_A9, lang);\n  } catch (err) {\n    console.warn("Could not save language preference:", err);\n  }\n\n  window.location.reload();\n}\n\nfunction renderLanguageToggleV334A9() {\n  if (document.getElementById("languageToggleV334A9")) {\n    return;\n  }\n\n  document.documentElement.lang = currentLanguage === "en" ? "en" : "ko";\n\n  const wrap = document.createElement("div");\n  wrap.id = "languageToggleV334A9";\n  wrap.setAttribute("aria-label", "Language switcher");\n  wrap.style.position = "fixed";\n  wrap.style.top = "12px";\n  wrap.style.right = "12px";\n  wrap.style.zIndex = "9999";\n  wrap.style.display = "flex";\n  wrap.style.gap = "4px";\n  wrap.style.padding = "4px";\n  wrap.style.border = "1px solid rgba(148, 163, 184, 0.45)";\n  wrap.style.borderRadius = "999px";\n  wrap.style.background = "rgba(15, 23, 42, 0.82)";\n  wrap.style.backdropFilter = "blur(8px)";\n  wrap.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.22)";\n\n  function makeButton(lang, label) {\n    const btn = document.createElement("button");\n    btn.type = "button";\n    btn.textContent = label;\n    btn.dataset.lang = lang;\n    btn.setAttribute("aria-pressed", currentLanguage === lang ? "true" : "false");\n    btn.title = lang === "ko" ? "한국어 데이터로 보기" : "View English data";\n    btn.style.border = "0";\n    btn.style.borderRadius = "999px";\n    btn.style.padding = "6px 10px";\n    btn.style.cursor = "pointer";\n    btn.style.fontSize = "12px";\n    btn.style.fontWeight = "700";\n    btn.style.color = currentLanguage === lang ? "#0f172a" : "#e5e7eb";\n    btn.style.background = currentLanguage === lang ? "#f8fafc" : "transparent";\n    btn.addEventListener("click", function() {\n      setLanguageAndReloadV334A9(lang);\n    });\n    return btn;\n  }\n\n  wrap.appendChild(makeButton("ko", "KO"));\n  wrap.appendChild(makeButton("en", "EN"));\n  document.body.appendChild(wrap);\n}\n// === LANGUAGE_TOGGLE_I18N_V334_A9 END ===\n`;

  text = text.replace(anchor, block);
}

text = text.replace(
  'const curriculumRes = await fetch(withDataVersion("../../data/curriculum/curriculum_v1.json"));',
  'renderLanguageToggleV334A9();\n  const curriculumRes = await fetch(withDataVersion(localizedDataPath("../../data/curriculum/curriculum_v1.json")));'
);

text = text.replaceAll(
  "fetch(withDataVersion(path))",
  "fetch(withDataVersion(localizedDataPath(path)))"
);

fs.writeFileSync(APP, text, "utf8");

console.log("V334_A9_APP_I18N_PATCHED");
console.log("file=src/pwa/app.js");

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");

let text = fs.readFileSync(APP, "utf8");

const newRenderFunction = `function renderLanguageToggleV334A9() {
  if (document.getElementById("languageToggleV334A9")) {
    return;
  }

  document.documentElement.lang = currentLanguage === "en" ? "en" : "ko";

  const wrap = document.createElement("div");
  wrap.id = "languageToggleV334A9";
  wrap.setAttribute("aria-label", "Language switcher");
  wrap.style.display = "inline-flex";
  wrap.style.alignItems = "center";
  wrap.style.gap = "4px";
  wrap.style.marginRight = "8px";
  wrap.style.padding = "3px";
  wrap.style.border = "1px solid #d8e1f0";
  wrap.style.borderRadius = "999px";
  wrap.style.background = "#ffffff";
  wrap.style.boxShadow = "0 1px 3px rgba(15, 23, 42, 0.08)";
  wrap.style.verticalAlign = "middle";

  function makeButton(lang, label) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.dataset.lang = lang;
    btn.setAttribute("aria-pressed", currentLanguage === lang ? "true" : "false");
    btn.title = lang === "ko" ? "한국어 데이터로 보기" : "View English data";
    btn.style.border = "0";
    btn.style.borderRadius = "999px";
    btn.style.padding = "5px 9px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "12px";
    btn.style.fontWeight = "800";
    btn.style.lineHeight = "1";
    btn.style.color = currentLanguage === lang ? "#ffffff" : "#334155";
    btn.style.background = currentLanguage === lang ? "#2563eb" : "transparent";
    btn.addEventListener("click", function() {
      setLanguageAndReloadV334A9(lang);
    });
    return btn;
  }

  wrap.appendChild(makeButton("ko", "KO"));
  wrap.appendChild(makeButton("en", "EN"));

  const resetButton = Array.from(document.querySelectorAll("button")).find(function(btn) {
    return (btn.textContent || "").trim() === "진도 초기화";
  });

  if (resetButton && resetButton.parentElement) {
    resetButton.insertAdjacentElement("beforebegin", wrap);
    return;
  }

  const header = document.querySelector("header") || document.querySelector(".app-header") || document.querySelector(".topbar");
  if (header) {
    header.appendChild(wrap);
    return;
  }

  document.body.insertBefore(wrap, document.body.firstChild);
}`;

const before = text;

text = text.replace(
  /function renderLanguageToggleV334A9\(\) \{[\s\S]*?\n\}\n\/\/ === LANGUAGE_TOGGLE_I18N_V334_A9 END ===/,
  newRenderFunction + "\n// === LANGUAGE_TOGGLE_I18N_V334_A9 END ==="
);

if (text === before) {
  throw new Error("renderLanguageToggleV334A9 replacement failed");
}

fs.writeFileSync(APP, text, "utf8");

console.log("V334_A9_LANGUAGE_TOGGLE_HEADER_UX_INTEGRATED");
console.log("file=src/pwa/app.js");

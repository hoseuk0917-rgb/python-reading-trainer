const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");

let text = fs.readFileSync(APP, "utf8");

const oldDock = `function dockLanguageToggleV334A9() {
  const wrap = document.getElementById("languageToggleV334A9");
  if (!wrap) {
    return false;
  }

  const resetButton = findProgressResetButtonV334A9();
  if (resetButton && resetButton.parentElement) {
    wrap.style.display = "inline-flex";
    wrap.style.marginRight = "8px";
    wrap.style.marginLeft = "0";
    wrap.style.position = "static";
    wrap.style.transform = "none";
    resetButton.insertAdjacentElement("beforebegin", wrap);
    return true;
  }

  return false;
}`;

const newDock = `function dockLanguageToggleV334A9() {
  const wrap = document.getElementById("languageToggleV334A9");
  if (!wrap) {
    return false;
  }

  const resetButton = findProgressResetButtonV334A9();
  if (resetButton && resetButton.parentElement) {
    let actions = document.getElementById("headerActionsV334A9");

    if (!actions) {
      actions = document.createElement("div");
      actions.id = "headerActionsV334A9";
      actions.style.display = "inline-flex";
      actions.style.alignItems = "center";
      actions.style.justifyContent = "flex-end";
      actions.style.gap = "8px";
      actions.style.marginLeft = "auto";

      resetButton.insertAdjacentElement("beforebegin", actions);
      actions.appendChild(resetButton);
    }

    wrap.style.display = "inline-flex";
    wrap.style.marginRight = "0";
    wrap.style.marginLeft = "0";
    wrap.style.position = "static";
    wrap.style.transform = "none";

    if (wrap.parentElement !== actions) {
      actions.insertBefore(wrap, resetButton);
    }

    return true;
  }

  return false;
}`;

if (!text.includes(oldDock)) {
  throw new Error("old dockLanguageToggleV334A9 block not found");
}

text = text.replace(oldDock, newDock);

fs.writeFileSync(APP, text, "utf8");

console.log("V334_A9_LANGUAGE_TOGGLE_WRAPPED_WITH_RESET");
console.log("file=src/pwa/app.js");

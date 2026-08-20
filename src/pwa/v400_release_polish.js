(function () {
  "use strict";

  const VERSION = "V400.1_RELEASE_POLISH_1";

  function text(ko, en) {
    return String(document.documentElement.lang || "").toLowerCase().startsWith("en") ? en : ko;
  }

  function openDiagnostic() {
    const tab = document.querySelector('[data-view="diagnostic"]');
    if (tab) {
      tab.click();
      window.setTimeout(function () {
        if (window.PRTDiagnosticV4002 && typeof window.PRTDiagnosticV4002.activate === "function") {
          window.PRTDiagnosticV4002.activate();
        }
      }, 30);
      return true;
    }
    return false;
  }

  function ensureDiagnosticEntry() {
    const home = document.getElementById("learningHomeV343");
    if (!home || !home.firstElementChild) return false;

    let box = document.getElementById("prtDiagnosticEntryV4001");
    if (box && document.body.contains(box)) return true;

    box = document.createElement("section");
    box.id = "prtDiagnosticEntryV4001";
    box.style.marginBottom = "14px";
    box.style.padding = "16px";
    box.style.border = "1px solid rgba(37,99,235,.24)";
    box.style.borderRadius = "18px";
    box.style.background = "#ffffff";
    box.innerHTML = "<div style='font-size:12px;font-weight:900;color:#2563eb;margin-bottom:5px'>" +
      text("학습 시작점", "START HERE") +
      "</div><strong style='display:block;font-size:18px;color:#0f172a'>" +
      text("내 수준부터 진단해볼까?", "Check my level first") +
      "</strong><p style='margin:7px 0 12px;color:#475569;line-height:1.55'>" +
      text("처음에 넘겼어도 언제든 다시 들어갈 수 있습니다. 8개 영역을 확인하고 약점에 맞춰 학습을 이어갑니다.", "You can return anytime, even if you skipped it earlier. Check eight areas and continue from your weaker topics.") +
      "</p>";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text("수준 진단 열기", "Open diagnostic");
    button.className = "home-v343-primary";
    button.style.marginTop = "0";
    button.addEventListener("click", openDiagnostic);
    box.appendChild(button);

    home.insertBefore(box, home.firstElementChild);
    return true;
  }

  function ensureMobileDiagnosticTabVisibility() {
    const tab = document.querySelector('[data-view="diagnostic"]');
    if (!tab) return false;
    tab.title = text("수준 진단", "Skill diagnostic");
    tab.setAttribute("aria-label", text("수준 진단", "Skill diagnostic"));
    return true;
  }

  function ensureOwnerToolsHint() {
    const panel = document.getElementById("studyToolsV7");
    if (!panel) return false;

    let hint = document.getElementById("prtOwnerToolsHintV4001");
    if (hint) return true;

    hint = document.createElement("div");
    hint.id = "prtOwnerToolsHintV4001";
    hint.style.marginTop = "10px";
    hint.style.padding = "10px 12px";
    hint.style.border = "1px dashed rgba(100,116,139,.35)";
    hint.style.borderRadius = "10px";
    hint.style.fontSize = "12px";
    hint.style.lineHeight = "1.5";
    hint.style.color = "#64748b";
    hint.textContent = text(
      "관리자 기능은 Developer 권한이 열린 뒤 이 학습도구 영역에 Admin 버튼으로 표시됩니다. 휴대폰에서는 학습도구의 ‘설정 펼치기’를 먼저 누르세요.",
      "Admin appears here after Developer access is enabled. On mobile, open the study-tool settings first."
    );
    panel.appendChild(hint);
    return true;
  }

  function refresh() {
    ensureDiagnosticEntry();
    ensureMobileDiagnosticTabVisibility();
    ensureOwnerToolsHint();
  }

  function boot() {
    refresh();
    [100, 300, 700, 1500, 3000].forEach(function (delay) {
      window.setTimeout(refresh, delay);
    });

    document.addEventListener("click", function (event) {
      const target = event.target && event.target.closest ? event.target.closest('[data-view="learn"], #studyToolsToggleV272') : null;
      if (target) window.setTimeout(refresh, 50);
    }, true);

    const observer = new MutationObserver(function () {
      window.setTimeout(refresh, 20);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.PRTV400ReleasePolish = Object.freeze({
      version: VERSION,
      openDiagnostic: openDiagnostic,
      refresh: refresh
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

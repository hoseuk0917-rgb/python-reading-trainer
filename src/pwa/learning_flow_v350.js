(function () {
  "use strict";

  const VERSION = "v350_a1";
  let refreshQueued = false;

  function t(ko, en) {
    return document.documentElement.lang === "en" ? en : ko;
  }

  function navigate(viewName, options) {
    try {
      if (window.ConsumerUxV349 && typeof window.ConsumerUxV349.navigate === "function") {
        window.ConsumerUxV349.navigate(viewName, options || {});
        return;
      }
    } catch (_) {}
    const legacy = document.querySelector('.tab-btn[data-view="' + viewName + '"]');
    if (legacy) legacy.click();
  }

  function activeViewName() {
    const active = document.querySelector(".view.active-view");
    if (!active || !active.id || !active.id.endsWith("View")) return "learn";
    return active.id.slice(0, -4);
  }

  function ensureDirectLanguage() {
    const topbar = document.querySelector(".topbar");
    const original = document.getElementById("languageToggleV334A9");
    if (!topbar || !original) return false;
    let wrap = document.getElementById("headerLanguageV350");
    let button = document.getElementById("headerLanguageToggleV350");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "headerLanguageV350";
      wrap.className = "header-language-v350";
      button = document.createElement("button");
      button.type = "button";
      button.id = "headerLanguageToggleV350";
      button.className = "header-language-toggle-v350";
      button.addEventListener("click", function () {
        original.click();
        window.setTimeout(scheduleRefresh, 0);
      });
      wrap.appendChild(button);
      topbar.appendChild(wrap);
    }
    const originalText = String(original.textContent || "").replace(/\s+/g, " ").trim();
    button.textContent = originalText || (document.documentElement.lang === "en" ? "KO" : "EN");
    button.setAttribute("aria-label", t("언어 전환", "Switch language"));
    return true;
  }

  function ensureStudyDataDestination() {
    const menu = document.getElementById("consumerLibraryMenuV349");
    if (menu && !document.getElementById("learningDataMenuV350")) {
      const button = document.createElement("button");
      button.type = "button";
      button.id = "learningDataMenuV350";
      button.setAttribute("role", "menuitem");
      button.innerHTML = '<strong>' + t("학습 데이터", "Study data") + '</strong><span>' + t("백업·복원과 진도 초기화를 관리합니다.", "Manage backup, restore, and progress reset.") + '</span>';
      button.addEventListener("click", openStudyData);
      menu.appendChild(button);
    }

    const panel = document.getElementById("studyDataV345");
    const originalReset = document.getElementById("resetBtn");
    if (!panel) return false;
    panel.classList.add("learning-data-v350");
    if (!document.getElementById("learningDataDangerV350")) {
      const danger = document.createElement("div");
      danger.id = "learningDataDangerV350";
      danger.className = "learning-data-danger-v350";
      const title = document.createElement("strong");
      title.textContent = t("학습 기록 초기화", "Reset learning progress");
      const desc = document.createElement("p");
      desc.textContent = t("필요할 때만 사용하세요. 현재 진도와 학습 기록을 처음 상태로 되돌립니다.", "Use only when needed. This returns progress and learning history to the initial state.");
      const reset = document.createElement("button");
      reset.type = "button";
      reset.id = "resetProgressV350";
      reset.textContent = t("진도 초기화", "Reset progress");
      reset.addEventListener("click", function () {
        if (originalReset) originalReset.click();
      });
      danger.appendChild(title);
      danger.appendChild(desc);
      danger.appendChild(reset);
      panel.appendChild(danger);
    }
    return true;
  }

  function openStudyData() {
    navigate("progress");
    let tries = 0;
    const timer = window.setInterval(function () {
      tries += 1;
      const panel = document.getElementById("studyDataV345");
      if (panel) {
        panel.setAttribute("tabindex", "-1");
        panel.scrollIntoView({ block: "start", behavior: "auto" });
        panel.focus({ preventScroll: true });
        window.clearInterval(timer);
      } else if (tries > 40) {
        window.clearInterval(timer);
      }
    }, 50);
  }

  function ensurePracticeEntry() {
    const shell = document.querySelector("#learningHomeV343 .home-v343-shell");
    if (!shell) return false;
    let entry = document.getElementById("practiceEntryV350");
    if (!entry) {
      entry = document.createElement("section");
      entry.id = "practiceEntryV350";
      entry.className = "practice-entry-v350";
      entry.innerHTML = '<div><strong>' + t("배운 내용 연습", "Practice what you learned") + '</strong><span>' + t("지금까지 배운 범위로 결과 예측·흐름 추적·버그 찾기를 연습합니다.", "Practice output prediction, flow tracing, and bug finding with concepts you have already learned.") + '</span></div>';
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = t("연습 시작", "Start practice");
      button.addEventListener("click", function () { navigate("practice"); });
      entry.appendChild(button);
      const detailsToggle = shell.querySelector(".home-details-toggle-v349");
      const nextBox = shell.querySelector(".home-v343-next");
      if (detailsToggle) detailsToggle.insertAdjacentElement("afterend", entry);
      else if (nextBox) nextBox.insertAdjacentElement("afterend", entry);
      else shell.appendChild(entry);
    }

    shell.querySelectorAll(".home-v343-actions button").forEach(function (button) {
      const text = String(button.textContent || "").trim();
      if (/^(실전 보기|Open practice)$/.test(text)) button.classList.add("practice-entry-legacy-v350");
    });
    const primary = shell.querySelector(".home-v343-primary");
    if (primary && /^(실전 열기|Open practice)$/.test(String(primary.textContent || "").trim())) {
      primary.textContent = t("배운 내용 연습 시작", "Start practice");
    }
    return true;
  }

  function ensurePracticeContext() {
    const practiceView = document.getElementById("practiceView");
    const host = document.getElementById("practiceDashboardV341");
    const panel = practiceView && practiceView.querySelector(":scope > section.panel");
    if (!practiceView || !host || !panel) return false;
    let header = document.getElementById("practiceFlowHeaderV350");
    if (!header) {
      header = document.createElement("div");
      header.id = "practiceFlowHeaderV350";
      header.className = "practice-flow-header-v350";
      const crumb = document.createElement("div");
      crumb.className = "practice-breadcrumb-v350";
      const back = document.createElement("button");
      back.type = "button";
      back.id = "practiceBackToLearnV350";
      back.textContent = t("학습", "Learn");
      back.addEventListener("click", function () { navigate("learn", { home: true }); });
      const sep = document.createElement("span");
      sep.setAttribute("aria-hidden", "true");
      sep.textContent = "›";
      const current = document.createElement("strong");
      current.textContent = t("배운 내용 연습", "Practice what you learned");
      crumb.appendChild(back);
      crumb.appendChild(sep);
      crumb.appendChild(current);
      const desc = document.createElement("p");
      desc.textContent = t("학습에서 만난 개념을 섞어 실제 코드 읽기처럼 다시 확인합니다.", "Mix concepts encountered in learning and apply them like real code reading.");
      header.appendChild(crumb);
      header.appendChild(desc);
      panel.insertBefore(header, host);
    }
    const title = host.querySelector("h1");
    if (title && /^(실전|Practice)$/.test(String(title.textContent || "").trim())) {
      title.textContent = t("배운 내용 연습", "Practice what you learned");
    }

    const isPractice = activeViewName() === "practice";
    document.body.classList.toggle("v350-practice-context", isPractice);
    if (isPractice) {
      const learn = document.getElementById("consumerLearnV349");
      const practice = document.getElementById("consumerPracticeV349");
      if (learn) learn.setAttribute("aria-current", "page");
      if (practice) practice.removeAttribute("aria-current");
    }
    return true;
  }

  function refresh() {
    ensureDirectLanguage();
    ensureStudyDataDestination();
    ensurePracticeEntry();
    ensurePracticeContext();
    document.documentElement.dataset.learningFlowV350 = VERSION;
  }

  function scheduleRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    window.requestAnimationFrame(function () {
      refreshQueued = false;
      refresh();
    });
  }

  function startObserver() {
    if (!document.body || window.__learningFlowV350Observer) return;
    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    window.__learningFlowV350Observer = observer;
  }

  let tries = 0;
  const timer = window.setInterval(function () {
    tries += 1;
    try {
      refresh();
      startObserver();
      if ((document.getElementById("consumerNavV349") && document.getElementById("headerLanguageToggleV350")) || tries > 200) {
        window.clearInterval(timer);
      }
    } catch (error) {
      console.warn("learning flow v350 init failed", error);
      if (tries > 200) window.clearInterval(timer);
    }
  }, 100);

  window.LearningFlowV350 = { version: VERSION, refresh: refresh, openStudyData: openStudyData };
})();

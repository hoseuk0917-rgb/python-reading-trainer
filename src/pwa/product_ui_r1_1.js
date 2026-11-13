(function () {
  "use strict";

  if (window.__PRTProductUiR11Booted) return;
  window.__PRTProductUiR11Booted = true;

  const VERSION = "R1.1";
  let refreshQueued = false;

  function isEnglish() {
    return String(document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function text(ko, en) {
    return isEnglish() ? en : ko;
  }

  function bookIcon() {
    return '<svg viewBox="0 0 32 32" aria-hidden="true">'
      + '<path d="M4.5 7.5c4.4-.8 8.1.2 11.5 3v16c-3.4-2.8-7.1-3.8-11.5-3V7.5Z"/>'
      + '<path d="M27.5 7.5c-4.4-.8-8.1.2-11.5 3v16c3.4-2.8 7.1-3.8 11.5-3V7.5Z"/>'
      + '<path d="m12 16 2.2 2.2L12 20.4M20 16l-2.2 2.2L20 20.4"/>'
      + '</svg>';
  }

  function ensureBrand() {
    const topbar = document.querySelector("body > .topbar");
    const identity = topbar && topbar.firstElementChild;
    if (!topbar || !identity) return false;

    identity.classList.add("prt-r11-product-identity");
    topbar.setAttribute("aria-label", text("AYVNIX Python Reading Trainer", "AYVNIX Python Reading Trainer"));

    let lockup = document.getElementById("prtR11BrandLockup");
    if (!lockup) {
      lockup = document.createElement("div");
      lockup.id = "prtR11BrandLockup";
      lockup.className = "prt-r11-brand-lockup";
      lockup.innerHTML = '<span class="prt-r11-brand-mark">' + bookIcon() + '</span>'
        + '<span class="prt-r11-wordmark">AYVNIX</span>'
        + '<span class="prt-r11-brand-divider" aria-hidden="true"></span>';
      identity.insertBefore(lockup, identity.firstChild);
    }

    const title = identity.querySelector(".app-title");
    const subtitle = identity.querySelector(".app-subtitle");
    if (title) title.textContent = "Python Reading Trainer";
    if (subtitle) {
      subtitle.textContent = text(
        "코드를 읽는 힘이 실력으로 이어지는 학습",
        "Turn code-reading confidence into practical skill"
      );
    }
    return true;
  }

  function nextActionState() {
    const api = window.StudyQualityV346;
    if (!api || typeof api.getNextActionState !== "function") return null;
    try {
      return api.getNextActionState();
    } catch (_) {
      return null;
    }
  }

  function checkpointText(state) {
    if (state.pendingCheckpoint) {
      return text(
        "체크포인트 " + state.pendingCheckpoint + " 열림",
        "Checkpoint " + state.pendingCheckpoint + " open"
      );
    }
    if (state.kind === "complete") return text("순차 학습 완료", "Sequence complete");
    return text(
      "다음 체크포인트까지 " + state.checkpointRemaining,
      state.checkpointRemaining + " to next checkpoint"
    );
  }

  function enhanceHome() {
    const shell = document.querySelector("#learningHomeV343 .home-v343-shell");
    if (!shell) return false;
    shell.classList.add("prt-r11-home-shell");

    const state = nextActionState();
    if (!state) return true;

    const signature = [
      state.attempted,
      state.total,
      state.dueReviewCount,
      state.pendingCheckpoint,
      state.checkpointRemaining,
      Number(state.weekly && state.weekly.cardAttempts || 0),
      Number(state.weekly && state.weekly.cardGoal || 0),
      Number(state.weekly && state.weekly.studyDays || 0),
      Number(state.weekly && state.weekly.dayGoal || 0),
      isEnglish() ? "en" : "ko"
    ].join(":");

    let status = document.getElementById("prtR11HomeStatus");
    if (!status) {
      status = document.createElement("section");
      status.id = "prtR11HomeStatus";
      status.className = "prt-r11-home-status";
      status.setAttribute("aria-label", text("전체 학습 진행", "Overall learning progress"));
      const subtitle = shell.querySelector(".home-v343-sub");
      if (subtitle) subtitle.insertAdjacentElement("afterend", status);
      else shell.prepend(status);
    }

    if (status.dataset.signature === signature) return true;
    status.dataset.signature = signature;

    const total = Math.max(0, Number(state.total || 0));
    const attempted = Math.min(total, Math.max(0, Number(state.attempted || 0)));
    const percent = total ? Math.round((attempted / total) * 100) : 0;
    const week = state.weekly || {};

    status.innerHTML = '<div class="prt-r11-progress-heading">'
      + '<span>' + text("전체 학습 진행", "Overall progress") + '</span>'
      + '<strong>' + percent + '%</strong>'
      + '</div>'
      + '<progress max="' + Math.max(1, total) + '" value="' + attempted + '">'
      + percent + '%</progress>'
      + '<div class="prt-r11-progress-count">'
      + '<strong>' + attempted.toLocaleString() + '</strong> / ' + total.toLocaleString()
      + '<span>' + text("시도한 카드", "cards attempted") + '</span>'
      + '</div>'
      + '<div class="prt-r11-status-grid">'
      + '<div><span>' + text("복습 대기", "Reviews due") + '</span><strong>' + Number(state.dueReviewCount || 0) + '</strong></div>'
      + '<div><span>' + text("학습 경로", "Learning path") + '</span><strong>' + checkpointText(state) + '</strong></div>'
      + '<div><span>' + text("이번 주", "This week") + '</span><strong>'
      + Number(week.cardAttempts || 0) + '/' + Number(week.cardGoal || 0)
      + ' · ' + Number(week.studyDays || 0) + '/' + Number(week.dayGoal || 0)
      + '</strong></div>'
      + '</div>';
    return true;
  }

  function enhanceNavigation() {
    const nav = document.getElementById("consumerNavV349");
    if (!nav) return false;
    nav.setAttribute("aria-label", text("주요 학습 메뉴", "Primary learning navigation"));
    nav.classList.add("prt-r11-navigation");
    return true;
  }

  function enhanceViews() {
    document.querySelectorAll("main.view").forEach(function (view) {
      view.classList.add("prt-r11-view");
    });
    const code = document.getElementById("codeView");
    const command = document.getElementById("commandView");
    const project = document.getElementById("projectView");
    if (code) code.dataset.r11Tool = "code";
    if (command) command.dataset.r11Tool = "command";
    if (project) project.dataset.r11Tool = "project";
  }

  function refresh() {
    ensureBrand();
    enhanceNavigation();
    enhanceHome();
    enhanceViews();
    document.documentElement.dataset.prtProductUi = VERSION;
  }

  function scheduleRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    window.requestAnimationFrame(function () {
      refreshQueued = false;
      refresh();
    });
  }

  function boot() {
    refresh();
    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, { childList: true, subtree: true });
    const langObserver = new MutationObserver(scheduleRefresh);
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    [80, 240, 700, 1600, 3200].forEach(function (delay) {
      window.setTimeout(refresh, delay);
    });
    window.PRTProductUiR11 = Object.freeze({ version: VERSION, refresh: refresh });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

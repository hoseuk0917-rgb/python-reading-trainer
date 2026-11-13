(function () {
  "use strict";

  const VERSION = "r1.3_closeout";
  const MOBILE_QUERY = "(max-width: 820px)";
  const SCROLL_THRESHOLD = 44;
  const CONTENT_THRESHOLD = 80;
  const dismissedViews = new Set();
  let currentViewKey = "";
  let refreshQueued = false;
  let keyboardNavigation = false;

  function visible(node) {
    if (!node || node.hidden) return false;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }

  function mobileLayout() {
    try { return Boolean(window.matchMedia && window.matchMedia(MOBILE_QUERY).matches); }
    catch (_) { return window.innerWidth <= 820; }
  }

  function activeView() {
    return document.querySelector(".view.active-view");
  }

  function viewKey(view) {
    if (!view) return "";
    if (view.id === "learnView") {
      if (view.classList.contains("v343-quiz-mode")) return "learn:quiz";
      if (view.classList.contains("v343-home-mode")) return "learn:home";
    }
    return view.id || "unknown";
  }

  function overlayOpen() {
    const selectors = [
      "#prtDeveloperWorkbenchV40062",
      "#prtDevDrawerV1",
      ".prt-admin-v1",
      '[role="dialog"]',
      ".diagram-modal",
      ".v345-modal",
      ".modal-v340",
      ".consumer-popover-v349",
      ".consumer-header-popover-v349"
    ];
    return selectors.some(function (selector) {
      return Array.from(document.querySelectorAll(selector)).some(visible);
    });
  }

  function keyboardFocusActive() {
    if (!keyboardNavigation) return false;
    const node = document.activeElement;
    return Boolean(node && node !== document.body && node !== document.documentElement && node.id !== "prtScrollCueR13");
  }

  function ensureCue() {
    let cue = document.getElementById("prtScrollCueR13");
    if (cue) return cue;
    cue = document.createElement("button");
    cue.type = "button";
    cue.id = "prtScrollCueR13";
    cue.className = "prt-scroll-cue-r13";
    cue.hidden = true;
    cue.setAttribute("aria-label", document.documentElement.lang === "en" ? "View content below" : "아래 내용 보기");
    cue.setAttribute("aria-hidden", "true");
    cue.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>';
    cue.addEventListener("click", function () {
      const key = currentViewKey || viewKey(activeView());
      if (key) dismissedViews.add(key);
      setCueVisible(cue, false);
      const nav = document.getElementById("consumerNavV349");
      const navRect = nav && visible(nav) ? nav.getBoundingClientRect() : null;
      const viewportHeight = navRect && getComputedStyle(nav).position === "fixed" ? navRect.top : window.innerHeight;
      const amount = Math.max(160, Math.round(viewportHeight * .48));
      let reducedMotion = false;
      try { reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (_) {}
      window.scrollBy({ top: amount, left: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
    document.body.appendChild(cue);
    return cue;
  }

  function setCueVisible(cue, show) {
    if (!cue) return;
    if (show) {
      if (cue.hidden) cue.hidden = false;
      if (!cue.classList.contains("is-visible")) cue.classList.add("is-visible");
      cue.setAttribute("aria-hidden", "false");
    } else {
      if (cue.classList.contains("is-visible")) cue.classList.remove("is-visible");
      if (!cue.hidden) cue.hidden = true;
      cue.setAttribute("aria-hidden", "true");
    }
  }

  function navMetrics() {
    const nav = document.getElementById("consumerNavV349");
    if (!nav || !visible(nav)) return { node: nav, rect: null, fixed: false, height: 0 };
    const style = getComputedStyle(nav);
    const rect = nav.getBoundingClientRect();
    return { node: nav, rect: rect, fixed: style.position === "fixed", height: rect.height };
  }

  function hasMeaningfulContentBelow(view, nav) {
    if (!view || !visible(view)) return false;
    const rect = view.getBoundingClientRect();
    const viewportBottom = nav.fixed && nav.rect ? nav.rect.top : window.innerHeight;
    const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const remainingInView = rect.bottom - viewportBottom;
    const remainingInDocument = documentHeight - (window.scrollY + viewportBottom);
    return remainingInView > CONTENT_THRESHOLD && remainingInDocument > CONTENT_THRESHOLD;
  }

  function refresh() {
    refreshQueued = false;
    if (!document.body) return;
    const cue = ensureCue();
    const view = activeView();
    const key = viewKey(view);
    const nav = navMetrics();

    if (key !== currentViewKey) {
      currentViewKey = key;
      if (window.scrollY >= SCROLL_THRESHOLD && key) dismissedViews.add(key);
    }

    if (currentViewKey && window.scrollY >= SCROLL_THRESHOLD) dismissedViews.add(currentViewKey);
    document.documentElement.style.setProperty("--prt-r13-nav-height", Math.round(nav.height) + "px");

    const show = mobileLayout()
      && Boolean(key)
      && nav.fixed
      && window.scrollY < SCROLL_THRESHOLD
      && !dismissedViews.has(key)
      && !overlayOpen()
      && !keyboardFocusActive()
      && hasMeaningfulContentBelow(view, nav);

    cue.setAttribute("aria-label", document.documentElement.lang === "en" ? "View content below" : "아래 내용 보기");
    setCueVisible(cue, show);
    document.documentElement.dataset.prtProductUiR13 = VERSION;
  }

  function scheduleRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    window.requestAnimationFrame(refresh);
  }

  function onScroll() {
    if (currentViewKey && window.scrollY >= SCROLL_THRESHOLD) dismissedViews.add(currentViewKey);
    scheduleRefresh();
  }

  function start() {
    ensureCue();
    refresh();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleRefresh, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener("resize", scheduleRefresh, { passive: true });
    document.addEventListener("pointerdown", function () { keyboardNavigation = false; scheduleRefresh(); }, true);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Tab" || event.key.startsWith("Arrow")) {
        keyboardNavigation = true;
        scheduleRefresh();
      }
    }, true);
    document.addEventListener("focusin", scheduleRefresh, true);
    document.addEventListener("focusout", scheduleRefresh, true);

    if (!window.__prtProductUiR13Observer) {
      const observer = new MutationObserver(scheduleRefresh);
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["class", "hidden", "aria-hidden"]
      });
      window.__prtProductUiR13Observer = observer;
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();

  window.PRTProductUiR13 = {
    version: VERSION,
    refresh: refresh,
    state: function () {
      const cue = document.getElementById("prtScrollCueR13");
      return {
        viewKey: currentViewKey,
        dismissed: currentViewKey ? dismissedViews.has(currentViewKey) : false,
        cueVisible: Boolean(cue && !cue.hidden && cue.classList.contains("is-visible"))
      };
    }
  };
})();

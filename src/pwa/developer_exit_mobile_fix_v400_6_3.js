(function () {
  "use strict";

  const VERSION = "V400.6.3_DEVELOPER_EXIT_MOBILE_FIX1";
  const STYLE_ID = "prtDeveloperExitMobileFixStyleV40063";
  const EXIT_ID = "prtWbDisableV40063";

  function t(ko, en) {
    return String(document.documentElement.lang || "")
      .toLowerCase()
      .startsWith("en") ? en : ko;
  }

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @media (max-width: 860px) {
        #prtDevChipV1 {
          display: none !important;
        }
      }

      #prtDeveloperWorkbenchV40062 .prt-wb-actions {
        align-items: center;
        justify-content: flex-end;
      }

      #${EXIT_ID} {
        border-color: #fecaca;
        color: #b42318;
      }

      @media (max-width: 560px) {
        #prtDeveloperWorkbenchV40062 .prt-wb-head {
          align-items: flex-start;
        }

        #prtDeveloperWorkbenchV40062 .prt-wb-actions {
          width: 100%;
          justify-content: flex-start;
        }

        #prtDeveloperWorkbenchV40062 .prt-wb-title {
          min-width: 0;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function workbenchApi() {
    return window.PRTDeveloperWorkbenchV40062 || null;
  }

  function legacyApi() {
    return window.PRTDeveloperModeV1 || null;
  }

  function closeWorkbench() {
    const api = workbenchApi();
    if (api && typeof api.close === "function") {
      api.close();
      return true;
    }
    return false;
  }

  function disableDeveloper() {
    closeWorkbench();

    const api = legacyApi();
    if (api && typeof api.disable === "function") {
      api.disable();
    } else if (api && typeof api.close === "function") {
      api.close();
    }
  }

  function enhanceWorkbench() {
    const root = document.getElementById("prtDeveloperWorkbenchV40062");
    if (!root) return false;

    const actions = root.querySelector(".prt-wb-head .prt-wb-actions");
    const close = root.querySelector("#prtWbCloseV40062");

    if (!actions || !close) return false;

    close.textContent = t("학습으로 돌아가기", "Back to learning");
    close.title = t(
      "Developer 화면만 닫고 GitHub 인증 상태는 유지합니다.",
      "Close the Developer screen while keeping GitHub authentication."
    );

    let exit = root.querySelector("#" + EXIT_ID);

    if (!exit) {
      exit = document.createElement("button");
      exit.type = "button";
      exit.id = EXIT_ID;
      exit.className = "prt-wb-btn";
      exit.addEventListener("click", disableDeveloper);
      actions.appendChild(exit);
    }

    exit.textContent = t("Developer 종료", "Exit Developer");
    exit.title = t(
      "Developer Mode를 비활성화합니다. 다시 열려면 더보기 → Developer를 누르세요.",
      "Disable Developer Mode. Reopen it from More → Developer."
    );

    return true;
  }

  function onKeydown(event) {
    if (event.key !== "Escape") return;

    const api = workbenchApi();
    if (!api || typeof api.getState !== "function") return;

    let state = null;
    try {
      state = api.getState();
    } catch (_) {
      state = null;
    }

    if (state && state.open === true) {
      event.preventDefault();
      closeWorkbench();
    }
  }

  function boot() {
    installStyle();
    enhanceWorkbench();

    [80, 180, 400, 800, 1600, 3200].forEach(function (delay) {
      window.setTimeout(enhanceWorkbench, delay);
    });

    const observer = new MutationObserver(function () {
      enhanceWorkbench();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    document.addEventListener("keydown", onKeydown, true);

    window.PRTDeveloperExitMobileFixV40063 = Object.freeze({
      version: VERSION,
      enhance: enhanceWorkbench,
      close: closeWorkbench,
      disable: disableDeveloper
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

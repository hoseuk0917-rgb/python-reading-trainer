(function () {
  "use strict";

  const VERSION = "V400.7_RELEASE_POLISH_BOOT";
  const SW_URL = "./sw_v400_1.js?v=20260821_v400_7_hardening1";
  const CORE_LOADER_ID = "prtCoreLoaderV4004";
  const CORE_LOADER_STYLE_ID = "prtCoreLoaderStyleV4004";
  const INPUT_BEGINNER_CARD_ID = "PYF94_A1_L01_INPUT_001";

  function isLocalHost() {
    const host = String(window.location.hostname || "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  }

  function isEnglish() {
    return String(document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function text(ko, en) {
    return isEnglish() ? en : ko;
  }

  function openDiagnostic() {
    if (
      window.ConsumerUxV349
      && typeof window.ConsumerUxV349.navigate === "function"
    ) {
      window.ConsumerUxV349.navigate("diagnostic");
      return true;
    }

    const tab = document.querySelector('[data-view="diagnostic"]');
    if (!tab) return false;
    tab.click();
    return true;
  }

  function stripRemoteAdminQuery() {
    if (isLocalHost()) return;

    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has("admin")) return;
      url.searchParams.delete("admin");
      window.history.replaceState(null, "", url.href);
    } catch (_) {}
  }

  function installCoreLoaderStyle() {
    if (document.getElementById(CORE_LOADER_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = CORE_LOADER_STYLE_ID;
    style.textContent = [
      "body.prt-core-loading-v4004 #learnView > section.panel,",
      "body.prt-core-loading-v4004 #learnView > aside.side { display: none !important; }",
      ".prt-core-loader-v4004 { margin: 10px auto 14px; width: min(720px, calc(100% - 18px)); box-sizing: border-box; padding: 18px; border: 1px solid #e2e8f0; border-radius: 18px; background: #fff; box-shadow: 0 8px 24px rgba(15,23,42,.05); color: #0f172a; }",
      ".prt-core-loader-v4004 strong { display: block; font-size: 16px; line-height: 1.35; }",
      ".prt-core-loader-v4004 span { display: block; margin-top: 5px; color: #64748b; font-size: 12px; line-height: 1.45; }",
      ".prt-core-loader-line-v4004 { width: 42%; height: 4px; margin-top: 13px; overflow: hidden; border-radius: 999px; background: #e8eef8; }",
      ".prt-core-loader-line-v4004::after { content: \"\"; display: block; width: 45%; height: 100%; border-radius: inherit; background: #2563eb; animation: prt-core-loader-v4004 1.05s ease-in-out infinite alternate; }",
      "@keyframes prt-core-loader-v4004 { from { transform: translateX(0); } to { transform: translateX(122%); } }",
      "@media (max-width: 820px) { .prt-core-loader-v4004 { margin-top: 7px; padding: 14px; border-radius: 16px; } .prt-core-loader-v4004 strong { font-size: 14px; } }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function ensureCoreLoader() {
    const learnView = document.getElementById("learnView");
    if (!learnView) return null;

    let loader = document.getElementById(CORE_LOADER_ID);
    if (loader) return loader;

    loader = document.createElement("section");
    loader.id = CORE_LOADER_ID;
    loader.className = "prt-core-loader-v4004";
    loader.setAttribute("role", "status");
    loader.setAttribute("aria-live", "polite");
    loader.innerHTML = [
      "<strong>" + text("학습 데이터를 준비하고 있어요", "Preparing study data") + "</strong>",
      "<span>" + text("처음 한 번만 조금 걸릴 수 있습니다. 이후에는 저장된 데이터를 먼저 보여줍니다.", "The first load can take a little longer. Later visits use saved data first.") + "</span>",
      '<div class="prt-core-loader-line-v4004" aria-hidden="true"></div>'
    ].join("");

    learnView.insertBefore(loader, learnView.firstChild);
    return loader;
  }

  function coreReady() {
    const title = document.getElementById("cardTitle");
    const home = document.querySelector("#learningHomeV343 .home-v343-shell");
    const value = String(title && title.textContent || "").trim();
    const cardReady = Boolean(value && value !== "Loading..." && value !== "loading...");
    return cardReady && Boolean(home);
  }

  function installCoreLoadingState() {
    if (!document.body) return;

    if (window.PRTBrandSplashV4006) {
      const oldLoader = document.getElementById(CORE_LOADER_ID);
      if (oldLoader) oldLoader.remove();
      document.body.classList.remove("prt-core-loading-v4004");
      return;
    }

    installCoreLoaderStyle();
    document.body.classList.add("prt-core-loading-v4004");
    ensureCoreLoader();

    let stopped = false;
    let observer = null;

    function finish() {
      if (stopped) return;
      stopped = true;
      document.body.classList.remove("prt-core-loading-v4004");
      const loader = document.getElementById(CORE_LOADER_ID);
      if (loader) loader.remove();
      if (observer) observer.disconnect();
    }

    function sync() {
      if (coreReady()) finish();
    }

    observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    [0, 100, 250, 500, 1000, 2000, 4000].forEach(function (delay) {
      window.setTimeout(sync, delay);
    });

    window.setTimeout(finish, 12000);
  }

  function prefersReducedMotion() {
    try {
      return Boolean(
        window.matchMedia
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch (_) {
      return false;
    }
  }

  function installLearningNextScroll() {
    const nextButton = document.getElementById("nextBtn");
    const progressText = document.getElementById("progressText");
    const learnPanel = document.querySelector("#learnView > section.panel");

    if (!nextButton || !progressText || !learnPanel) return false;

    let progressBeforeClick = "";

    nextButton.addEventListener("click", function () {
      progressBeforeClick = String(progressText.textContent || "").trim();
    }, true);

    nextButton.addEventListener("click", function () {
      const previousProgress = progressBeforeClick;

      window.requestAnimationFrame(function () {
        const currentProgress = String(progressText.textContent || "").trim();
        if (!previousProgress || !currentProgress || previousProgress === currentProgress) {
          return;
        }

        const topbar = document.querySelector(".topbar");
        const stickyOffset = topbar
          ? topbar.getBoundingClientRect().height + 12
          : 12;
        const targetTop = Math.max(
          0,
          window.scrollY + learnPanel.getBoundingClientRect().top - stickyOffset
        );

        window.scrollTo({
          top: targetTop,
          behavior: prefersReducedMotion() ? "auto" : "smooth"
        });
      });
    });

    return true;
  }

  function learnerPlainText(value) {
    return String(value == null ? "" : value)
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .trim();
  }

  function cleanRichCardLearnerText(card) {
    if (!card || card.authoring_version !== "V2.3") return card;

    ["title", "question", "explanation"].forEach(function (key) {
      if (typeof card[key] === "string") card[key] = learnerPlainText(card[key]);
    });

    const ce = card.concept_explanation;
    if (ce && typeof ce === "object") {
      ["what_it_is", "how_to_read", "key_point", "common_mistake"].forEach(function (key) {
        if (typeof ce[key] === "string") ce[key] = learnerPlainText(ce[key]);
      });
    }

    const example = card.teaching_example;
    if (example && typeof example === "object" && typeof example.walkthrough === "string") {
      example.walkthrough = learnerPlainText(example.walkthrough);
    }

    const ae = card.answer_explanation;
    if (ae && typeof ae === "object") {
      ["step_by_step", "why_correct", "takeaway"].forEach(function (key) {
        if (typeof ae[key] === "string") ae[key] = learnerPlainText(ae[key]);
      });
      if (ae.common_wrong_choice && typeof ae.common_wrong_choice === "object") {
        ["choice", "why_wrong", "misread_step"].forEach(function (key) {
          if (typeof ae.common_wrong_choice[key] === "string") {
            ae.common_wrong_choice[key] = learnerPlainText(ae.common_wrong_choice[key]);
          }
        });
      }
    }

    return card;
  }

  function applyInputBeginnerClarity(card) {
    if (!card || card.id !== INPUT_BEGINNER_CARD_ID) return card;

    if (isEnglish()) {
      card.title = "Store the value from input() in a variable";
      card.code = "name = input(\"Name: \")\nprint(name)";
      card.question = "The user types Python and presses Enter. What value is stored in name?";
      card.choices = ["name", "Name:", "Python", "None"];
      card.answer = "Python";

      card.concept_explanation = {
        what_it_is: "input() waits for the user to type something, then gives the typed text back as a string.",
        how_to_read: "In input(\"Name: \"), \"Name: \" is only a prompt shown on the screen. If the user types Python, input() produces the string \"Python\", and that value is stored in name.",
        key_point: "The prompt \"Name: \" and the user's input \"Python\" are different. The value stored in the variable is what the user actually typed.",
        common_mistake: "It is easy to think that \"Name: \" is stored in name, but it is only a prompt telling the user what to enter."
      };

      card.teaching_example = {
        code: "city = input(\"City: \")\nprint(city)",
        walkthrough: "First, the screen shows \"City: \". If the user types Busan and presses Enter, the string \"Busan\" is stored in city. The next line, print(city), prints Busan."
      };

      card.answer_explanation = {
        step_by_step: "1. The screen shows \"Name: \". 2. The user types Python and presses Enter. 3. input() produces the string \"Python\", which is stored in name. 4. print(name) prints Python.",
        why_correct: "The value stored in name is what the user actually typed, not the prompt shown on the screen.",
        common_wrong_choice: {
          choice: "Name:",
          why_wrong: "\"Name: \" is only a prompt telling the user what to enter. It is not the value stored in name.",
          misread_step: "Separate the prompt inside input() from the text that the user types on the keyboard."
        },
        takeaway: "With input(\"prompt\"), Python shows the prompt first, then returns the text the user actually types as a string."
      };
    } else {
      card.title = "input()으로 입력받은 값을 변수에 저장하기";
      card.code = "name = input(\"이름: \")\nprint(name)";
      card.question = "사용자가 Python을 입력하고 Enter를 눌렀습니다. 변수 name에 저장되는 값은 무엇인가요?";
      card.choices = ["name", "이름:", "Python", "None"];
      card.answer = "Python";

      card.concept_explanation = {
        what_it_is: "input()은 사용자가 키보드로 입력할 때까지 기다렸다가, 입력한 글자를 문자열로 가져오는 함수입니다.",
        how_to_read: "input(\"이름: \")의 \"이름: \"은 화면에 보여 주는 안내문입니다. 사용자가 Python을 입력하면 실제 결과는 문자열 \"Python\"이고, 그 값이 name에 저장됩니다.",
        key_point: "안내문 \"이름: \"과 사용자가 입력한 값 \"Python\"은 서로 다릅니다. 변수에 저장되는 것은 사용자가 입력한 값입니다.",
        common_mistake: "\"이름: \"이 name에 저장된다고 생각하기 쉽지만, 그것은 입력을 부탁하기 위해 화면에 보여 주는 문구일 뿐입니다."
      };

      card.teaching_example = {
        code: "city = input(\"도시: \")\nprint(city)",
        walkthrough: "먼저 화면에 \"도시: \"가 보입니다. 사용자가 Busan을 입력하고 Enter를 누르면 city에 문자열 \"Busan\"이 저장됩니다. 다음 줄 print(city)는 Busan을 출력합니다."
      };

      card.answer_explanation = {
        step_by_step: "1. 화면에 \"이름: \"이 보입니다. 2. 사용자가 Python을 입력하고 Enter를 누릅니다. 3. input()의 결과인 문자열 \"Python\"이 name에 저장됩니다. 4. print(name)은 Python을 출력합니다.",
        why_correct: "name에 저장되는 값은 안내문이 아니라 사용자가 실제로 입력한 \"Python\"이기 때문입니다.",
        common_wrong_choice: {
          choice: "이름:",
          why_wrong: "\"이름: \"은 사용자가 무엇을 입력해야 하는지 알려 주는 안내문입니다. name에 저장되는 값이 아닙니다.",
          misread_step: "input() 괄호 안의 안내문과 사용자가 키보드로 입력한 값을 따로 구분해서 보세요."
        },
        takeaway: "input(\"안내문\")에서는 안내문을 먼저 보여 주고, 사용자가 실제로 입력한 글자를 문자열로 가져옵니다."
      };
    }

    card.explanation = card.answer_explanation.step_by_step;
    return card;
  }

  function learnerConceptLabel(card) {
    if (!card) return "";
    if (card.id === INPUT_BEGINNER_CARD_ID) return "input()";

    const raw = String(card.primary_concept || "").trim();
    if (!raw) return "";

    const koLabels = {
      call: "함수 사용",
      assignment: "변수에 값 저장하기",
      arithmetic: "숫자 계산",
      sequence_operation: "값을 순서대로 계산하기"
    };
    const enLabels = {
      call: "Function call",
      assignment: "Assignment",
      arithmetic: "Arithmetic",
      sequence_operation: "Sequence operation"
    };
    const labels = isEnglish() ? enLabels : koLabels;

    if (labels[raw]) return labels[raw];
    if (/^[a-z0-9_]+$/i.test(raw) && raw.indexOf("_") >= 0) {
      return text("핵심 개념", "Core concept");
    }
    return raw;
  }

  function repairRenderedConceptTitle(card) {
    const intro = document.getElementById("conceptIntro");
    if (!intro || !card) return;
    const title = intro.querySelector(".concept-intro-title-v306");
    if (!title) return;

    const raw = String(card.primary_concept || "").trim();
    const shown = String(title.textContent || "").trim();
    if (raw && shown === raw) {
      title.textContent = learnerConceptLabel(card) || text("핵심 개념", "Core concept");
    }
  }

  function installLearnerClarityGuard() {
    const baseRenderCard = window.renderCard;
    if (typeof baseRenderCard !== "function") return false;
    if (baseRenderCard.__prtLearnerClarityV400) return true;

    function guardedRenderCard() {
      let card = null;
      try {
        if (typeof window.getCurrentCard === "function") {
          card = window.getCurrentCard();
        }
      } catch (_) {}

      cleanRichCardLearnerText(card);
      applyInputBeginnerClarity(card);

      const result = baseRenderCard.apply(this, arguments);
      repairRenderedConceptTitle(card);
      return result;
    }

    guardedRenderCard.__prtLearnerClarityV400 = true;
    window.renderCard = guardedRenderCard;
    return true;
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol !== "https:" && !isLocalHost()) return;

    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register(SW_URL, { scope: "./" })
        .then(function (registration) {
          try { registration.update(); } catch (_) {}
        })
        .catch(function (error) {
          console.warn("V400.7 service worker registration failed", error);
        });
    }, { once: true });
  }

  function boot() {
    document.documentElement.dataset.releasePolishV4001 = VERSION;
    stripRemoteAdminQuery();
    installCoreLoadingState();
    installLearningNextScroll();
    installLearnerClarityGuard();
    registerServiceWorker();

    window.PRTReleasePolishV4001 = Object.freeze({
      version: VERSION,
      openDiagnostic: openDiagnostic,
      remoteAdminEnabled: false,
      forcedReloadEnabled: false,
      brandSplashEnabled: Boolean(window.PRTBrandSplashV4006)
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
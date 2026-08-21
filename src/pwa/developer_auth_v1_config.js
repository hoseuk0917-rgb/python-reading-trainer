(function () {
    "use strict";

    const VERSION = "V400.6.2_DEVELOPER_AUTH_ENTRY_OAUTH1";
    const AUTH_BASE = "https://veriautonomy.com/api/prt-developer";
    const MENU_ENTRY_ID = "prtDeveloperMenuEntryV40062";

    window.PRTDeveloperAuthV1Config = Object.freeze({
        version: VERSION,
        authBase: AUTH_BASE,
        ownerGithubId: "238496232"
    });

    function isLocalHost() {
        const host = String(window.location.hostname || "").toLowerCase();
        return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
    }

    function isEnglish() {
        return String(document.documentElement.lang || "").toLowerCase().startsWith("en");
    }

    function closeMoreMenu() {
        const menu = document.getElementById("consumerMoreMenuV349");
        const opener = document.getElementById("consumerMoreV349");
        if (menu) {
            menu.hidden = true;
            menu.setAttribute("aria-hidden", "true");
        }
        if (opener) opener.setAttribute("aria-expanded", "false");
    }

    function currentReturnTo() {
        const url = new URL(window.location.href);
        url.hash = "";
        return url.href;
    }

    function openDeveloper() {
        closeMoreMenu();

        if (isLocalHost()) {
            const api = window.PRTDeveloperModeV1;
            if (api && typeof api.open === "function") api.open();
            return;
        }

        const auth = window.PRTDeveloperAuthV1;
        if (auth && typeof auth.getState === "function") {
            try {
                const state = auth.getState();
                if (state && state.authenticated === true) {
                    const api = window.PRTDeveloperModeV1;
                    if (api && typeof api.open === "function") api.open();
                    return;
                }
            } catch (_) {}
        }

        const login = AUTH_BASE
            + "/auth/github/start?return_to="
            + encodeURIComponent(currentReturnTo());

        window.location.assign(login);
    }

    function ensureDeveloperMenuEntry() {
        const menu = document.getElementById("consumerMoreMenuV349");
        if (!menu) return false;

        let button = document.getElementById(MENU_ENTRY_ID);
        if (!button) {
            button = document.createElement("button");
            button.type = "button";
            button.id = MENU_ENTRY_ID;
            button.setAttribute("role", "menuitem");
            button.dataset.ownerTool = "developer";
            button.addEventListener("click", openDeveloper);
            menu.appendChild(button);
        }

        button.innerHTML = isEnglish()
            ? "<strong>Developer</strong><span>Open Developer Mode after GitHub owner verification.</span>"
            : "<strong>Developer</strong><span>GitHub 본인 인증 후 Developer Mode를 엽니다.</span>";

        return true;
    }

    function scheduleDeveloperMenuEntry() {
        [0, 80, 180, 400, 800, 1600, 3200, 6400].forEach(function (delay) {
            window.setTimeout(ensureDeveloperMenuEntry, delay);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", scheduleDeveloperMenuEntry, { once: true });
    } else {
        scheduleDeveloperMenuEntry();
    }

    const observer = new MutationObserver(function () {
        if (!document.getElementById(MENU_ENTRY_ID)) ensureDeveloperMenuEntry();
    });

    if (document.documentElement) {
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    if (!document.querySelector('link[data-v400-release-polish-v3]')) {
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = "./release_polish_v400_1.css?v=20260821_v400_3";
        style.setAttribute("data-v400-release-polish-v3", "1");
        document.head.appendChild(style);
    }

    if (!document.querySelector('script[data-v400-release-polish-v3]')) {
        const script = document.createElement("script");
        script.src = "./v400_release_polish.js?v=20260821_v400_3_release_polish";
        script.async = false;
        script.setAttribute("data-v400-release-polish-v3", "1");
        document.head.appendChild(script);
    }
})();

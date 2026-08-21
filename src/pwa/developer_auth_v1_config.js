(function () {
    "use strict";

    const VERSION = "V400.7_DEVELOPER_ENTRY_HARDENED1";
    const AUTH_BASE = "https://veriautonomy.com/api/prt-developer";
    const ENTRY_ID = "consumerDeveloperV40061";

    window.PRTDeveloperAuthV1Config = Object.freeze({
        version: VERSION,
        authBase: AUTH_BASE,
        ownerGithubId: "238496232"
    });

    function isLocalHost() {
        const host = String(window.location.hostname || "").toLowerCase();
        return host === "localhost"
            || host === "127.0.0.1"
            || host === "::1"
            || host === "[::1]";
    }

    function currentReturnTo() {
        try {
            const url = new URL(window.location.href);
            url.hash = "";
            return url.href;
        } catch (_) {
            return String(window.location.href || "").split("#")[0];
        }
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

    function beginDeveloperFallback() {
        closeMoreMenu();

        const remote = window.PRTDeveloperRemoteEntryV40061;
        if (remote && typeof remote.open === "function") {
            try {
                remote.open();
                return;
            } catch (_) {}
        }

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
                    const workbench = window.PRTDeveloperWorkbenchV40062;
                    if (workbench && typeof workbench.open === "function") {
                        workbench.open();
                        return;
                    }
                    const api = window.PRTDeveloperModeV1;
                    if (api && typeof api.open === "function") api.open();
                    return;
                }
            } catch (_) {}
        }

        window.location.assign(
            AUTH_BASE
            + "/auth/github/start?return_to="
            + encodeURIComponent(currentReturnTo())
        );
    }

    function ensureDeveloperEntryFallback() {
        const menu = document.getElementById(ENTRY_ID)
            ? document.getElementById(ENTRY_ID).parentElement
            : document.getElementById("consumerMoreMenuV349");
        if (!menu) return false;

        let entry = document.getElementById(ENTRY_ID);
        if (!entry) {
            entry = document.createElement("button");
            entry.type = "button";
            entry.id = ENTRY_ID;
            entry.setAttribute("role", "menuitem");
            entry.dataset.tool = "developer";
            entry.innerHTML = "<strong>Developer</strong><span>GitHub 본인 인증 후 Developer Mode를 엽니다.</span>";
            entry.addEventListener("click", beginDeveloperFallback);
            menu.appendChild(entry);
        } else if (entry.parentElement !== menu) {
            menu.appendChild(entry);
        }

        return true;
    }

    function bootDeveloperEntryFallback() {
        ensureDeveloperEntryFallback();

        [80, 180, 400, 800, 1600, 3200, 6400].forEach(function (delay) {
            window.setTimeout(ensureDeveloperEntryFallback, delay);
        });

        document.addEventListener("click", function (event) {
            const target = event.target && event.target.closest
                ? event.target.closest("#consumerMoreV349")
                : null;
            if (target) window.setTimeout(ensureDeveloperEntryFallback, 0);
        }, true);

        window.addEventListener("pageshow", function () {
            window.setTimeout(ensureDeveloperEntryFallback, 0);
        });

        document.addEventListener("visibilitychange", function () {
            if (!document.hidden) window.setTimeout(ensureDeveloperEntryFallback, 0);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootDeveloperEntryFallback, { once: true });
    } else {
        bootDeveloperEntryFallback();
    }

    if (!document.querySelector('link[data-v400-release-polish-v3]')) {
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = "./release_polish_v400_1.css?v=20260821_v400_7_hardening1";
        style.setAttribute("data-v400-release-polish-v3", "1");
        document.head.appendChild(style);
    }

    if (!document.querySelector('script[data-v400-release-polish-v3]')) {
        const script = document.createElement("script");
        script.src = "./v400_release_polish.js?v=20260821_v400_7_hardening1";
        script.async = false;
        script.setAttribute("data-v400-release-polish-v3", "1");
        document.head.appendChild(script);
    }

    if (!document.querySelector('script[data-v400-developer-workbench]')) {
        const script = document.createElement("script");
        script.src = "./developer_workbench_v400_6_2.js?v=20260821_v400_7_hardening1";
        script.async = false;
        script.setAttribute("data-v400-developer-workbench", "1");
        document.head.appendChild(script);
    }

    if (!document.querySelector('script[data-v400-developer-exit-mobile-fix]')) {
        const script = document.createElement("script");
        script.src = "./developer_exit_mobile_fix_v400_6_3.js?v=20260821_v400_7_1_advanced_return1";
        script.async = false;
        script.setAttribute("data-v400-developer-exit-mobile-fix", "1");
        document.head.appendChild(script);
    }

    if (!document.querySelector('script[data-v400-developer-remote-entry]')) {
        const script = document.createElement("script");
        script.src = "./developer_remote_entry_v400_6_1.js?v=20260821_v400_7_hardening1";
        script.async = false;
        script.setAttribute("data-v400-developer-remote-entry", "1");
        document.head.appendChild(script);
    }
})();

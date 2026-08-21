(function () {
    "use strict";

    window.PRTDeveloperAuthV1Config = Object.freeze({
        version: "V400.3_DEVELOPER_AUTH_V1_2",
        authBase: "",
        ownerGithubId: "238496232"
    });

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

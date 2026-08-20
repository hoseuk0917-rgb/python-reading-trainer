(function () {
    "use strict";

    window.PRTDeveloperAuthV1Config = Object.freeze({
        version: "V400.2_DEVELOPER_AUTH_V1_2",
        authBase: "",
        ownerGithubId: "238496232"
    });

    if (!document.querySelector('link[data-v400-release-polish-v2]')) {
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = "./release_polish_v400_1.css?v=20260821_v400_2";
        style.setAttribute("data-v400-release-polish-v2", "1");
        document.head.appendChild(style);
    }

    if (!document.querySelector('script[data-v400-release-polish-v2]')) {
        const script = document.createElement("script");
        script.src = "./v400_release_polish.js?v=20260821_v400_2_release_polish2";
        script.defer = true;
        script.setAttribute("data-v400-release-polish-v2", "1");
        document.head.appendChild(script);
    }

})();

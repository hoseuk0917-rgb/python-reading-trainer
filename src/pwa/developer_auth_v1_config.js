(function () {
    "use strict";

    window.PRTDeveloperAuthV1Config = Object.freeze({
        version: "V400.1_DEVELOPER_AUTH_V1_2",
        authBase: "",
        ownerGithubId: "238496232"
    });

    if (!document.querySelector('script[data-v400-release-polish]')) {
        const script = document.createElement("script");
        script.src = "./v400_release_polish.js?v=20260821_v400_1_release_polish1";
        script.defer = true;
        script.setAttribute("data-v400-release-polish", "1");
        document.head.appendChild(script);
    }

})();

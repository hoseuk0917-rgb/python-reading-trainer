(function () {
    "use strict";

    window.PRTDeveloperAuthV1Config = Object.freeze({
        version: "V400.6.2_DEVELOPER_AUTH_WORKBENCH1",
        authBase: "https://veriautonomy.com/api/prt-developer",
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

    if (!document.querySelector('script[data-v400-developer-workbench]')) {
        const script = document.createElement("script");
        script.src = "./developer_workbench_v400_6_2.js?v=20260821_v400_6_2_workbench1";
        script.async = false;
        script.setAttribute("data-v400-developer-workbench", "1");
        document.head.appendChild(script);
    }

    if (!document.querySelector('script[data-v400-developer-remote-entry]')) {
        const script = document.createElement("script");
        script.src = "./developer_remote_entry_v400_6_1.js?v=20260821_v400_6_2_dev_entry2";
        script.async = false;
        script.setAttribute("data-v400-developer-remote-entry", "1");
        document.head.appendChild(script);
    }
})();

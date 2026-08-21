(function () {
  "use strict";

  const VERSION = "V400.7_ADMIN_LOCAL_LOADER1";

  function isLocalHost() {
    const host = String(window.location.hostname || "").toLowerCase();
    return host === "localhost"
      || host === "127.0.0.1"
      || host === "::1"
      || host === "[::1]";
  }

  if (!isLocalHost()) {
    window.PRTAdminLocalLoaderV4007 = Object.freeze({
      version: VERSION,
      local: false,
      loaded: false
    });
    return;
  }

  if (!document.querySelector('link[data-prt-admin-local-v4007]')) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "./admin_mode_v1.css?v=20260821_v400_7_local1";
    style.setAttribute("data-prt-admin-local-v4007", "1");
    document.head.appendChild(style);
  }

  if (!document.querySelector('script[data-prt-admin-local-v4007]')) {
    const script = document.createElement("script");
    script.src = "./admin_mode_v1.js?v=20260821_v400_7_local1";
    script.async = false;
    script.setAttribute("data-prt-admin-local-v4007", "1");
    document.head.appendChild(script);
  }

  window.PRTAdminLocalLoaderV4007 = Object.freeze({
    version: VERSION,
    local: true,
    loaded: true
  });
})();

(function () {
  "use strict";

  const PAGES_HOST = "hoseuk0917-rgb.github.io";
  const PAGES_PATH_PREFIX = "/python-reading-trainer/";

  function isPagesApp() {
    try {
      return (
        String(window.location.hostname || "").toLowerCase() === PAGES_HOST
        && String(window.location.pathname || "").startsWith(PAGES_PATH_PREFIX)
      );
    } catch (_) {
      return false;
    }
  }

  document.addEventListener(
    "click",
    function (event) {
      const button = event.target && event.target.closest
        ? event.target.closest("#consumerAdminDeviceV4002")
        : null;

      if (!button || !isPagesApp()) return;

      try {
        const url = new URL(window.location.href);
        if (url.searchParams.get("admin") === "1") return;

        event.preventDefault();
        event.stopImmediatePropagation();
        url.searchParams.set("admin", "1");
        window.location.assign(url.toString());
      } catch (_) {}
    },
    true
  );
})();

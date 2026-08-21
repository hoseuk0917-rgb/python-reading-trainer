const CACHE_PREFIX = "python-reading-trainer-v400";
const RELEASE = "20260821_v400_7_hardening1";
const CACHE_NAME = "python-reading-trainer-v400-7-hardening1-20260821";

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./style.css",
  "./consumer_ui_v349.css",
  "./release_polish_v400_1.css",
  "./app.js",
  "./content_quality_semantics.js",
  "./learning_home_v343.js",
  "./consumer_ux_v349.js",
  "./release_polish_v400_1.js",
  "./v400_release_polish.js",
  "./developer_auth_v1_config.js",
  "./developer_auth_v1.js",
  "./developer_remote_entry_v400_6_1.js",
  "./developer_workbench_v400_6_2.js",
  "./developer_exit_mobile_fix_v400_6_3.js",
  "./icon-v400-192.png",
  "./icon-v400-512.png",
  "./icon-maskable-v400-192.png",
  "./icon-maskable-v400-512.png",
  "./icon-v400.svg",
  "./icon-maskable-v400.svg"
];

const CRITICAL_UI_FILES = new Set([
  "index.html",
  "manifest.json",
  "consumer_ui_v349.css",
  "consumer_ux_v349.js",
  "release_polish_v400_1.css",
  "release_polish_v400_1.js",
  "v400_release_polish.js",
  "content_quality_semantics.js",
  "icon-v400-192.png",
  "icon-v400-512.png",
  "icon-maskable-v400-192.png",
  "icon-maskable-v400-512.png",
  "icon-v400.svg",
  "icon-maskable-v400.svg",
  "developer_auth_v1_config.js",
  "developer_auth_v1.js",
  "developer_remote_entry_v400_6_1.js",
  "developer_workbench_v400_6_2.js",
  "developer_exit_mobile_fix_v400_6_3.js"
]);

function isDataUrl(url) {
  return (
    url.pathname.includes("/data/")
    || url.pathname.includes("/data_i18n/")
    || url.pathname.endsWith(".json")
  );
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return Promise.allSettled(
          SHELL_ASSETS.map(function (path) {
            return cache.add(new Request(path, { cache: "reload" }));
          })
        );
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

async function migratePreviousCaches() {
  const keys = await caches.keys();
  const previousKeys = keys.filter(function (key) {
    return key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME;
  });

  if (!previousKeys.length) return;

  const target = await caches.open(CACHE_NAME);

  for (const key of previousKeys) {
    const previous = await caches.open(key);
    const requests = await previous.keys();

    for (const request of requests) {
      const existing = await target.match(request);
      if (existing) continue;

      const response = await previous.match(request);
      if (!response) continue;

      try {
        await target.put(request, response.clone());
      } catch (_) {}
    }
  }

  await Promise.allSettled(
    previousKeys.map(function (key) {
      return caches.delete(key);
    })
  );
}

self.addEventListener("activate", function (event) {
  event.waitUntil(
    migratePreviousCaches()
      .then(function () {
        return self.clients.claim();
      })
  );
});

function freshRequest(request) {
  return new Request(request, { cache: "no-store" });
}

function networkFirst(request) {
  return fetch(freshRequest(request))
    .then(function (response) {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(request, copy).catch(function () {});
        });
      }
      return response;
    })
    .catch(function () {
      return caches.match(request).then(function (cached) {
        if (cached) return cached;
        if (request.mode === "navigate") return caches.match("./index.html");
        throw new Error("OFFLINE_RESOURCE_MISSING");
      });
    });
}

function staleWhileRevalidate(request) {
  return caches.match(request).then(function (cached) {
    const refresh = fetch(freshRequest(request))
      .then(function (response) {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, copy).catch(function () {});
          });
        }
        return response;
      })
      .catch(function () {
        return cached;
      });

    return cached || refresh;
  });
}

self.addEventListener("fetch", function (event) {
  const request = event.request;
  if (!request || request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const fileName = url.pathname.split("/").pop() || "";
  const isCriticalUi = CRITICAL_UI_FILES.has(fileName);
  const isData = isDataUrl(url);

  if (request.mode === "navigate" || isCriticalUi) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isData) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

const CACHE_PREFIX = "python-reading-trainer-v400";
const CACHE_NAME = "python-reading-trainer-v400-1-20260821";

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./style.css",
  "./study_ui_v346.css",
  "./study_ui_v348.css",
  "./consumer_ui_v349.css",
  "./consumer_ui_v349_compat_r2.css",
  "./learning_flow_v350.css",
  "./contextual_practice_v351.css",
  "./interaction_clarity_v353.css",
  "./worked_example_quality_v355.css",
  "./diagnostic_v400_2.css",
  "./diagnostic_remediation_v400_2.css",
  "./developer_mode_v1.css",
  "./admin_mode_v1.css",
  "./release_polish_v400_1.css",
  "./code_explainer_rules.js",
  "./python_browser_runtime.js",
  "./python_archify_browser_renderer.js",
  "./python_structure_bridge.js",
  "./python_execution_lens.js",
  "./code_explainer.js",
  "./project_analyzer.js",
  "./command_explainer.js",
  "./content_quality_semantics.js",
  "./app.js",
  "./learning_engine_v340.js",
  "./learning_loop_v340.js",
  "./learning_engine_v341.js",
  "./learning_experience_v341.js",
  "./learning_home_v343.js",
  "./explanation_support_v344.js",
  "./study_experience_v345.js",
  "./study_progress_v346.js",
  "./learning_flow_hardening_v347.js",
  "./learning_runtime_v348.js",
  "./consumer_ux_v349.js",
  "./consumer_ux_v349_compat_r2.js",
  "./learning_flow_v350.js",
  "./contextual_practice_v351.js",
  "./interaction_clarity_v353.js",
  "./worked_example_quality_v355.js",
  "./worked_example_quality_v355_r2.js",
  "./v400_pedagogy_runtime.js",
  "./diagnostic_v400_2.js",
  "./diagnostic_remediation_v400_2.js",
  "./developer_mode_v1.js",
  "./developer_auth_v1_config.js",
  "./developer_auth_v1.js",
  "./admin_mode_v1.js",
  "./release_polish_v400_1.js",
  "./developer_mode_v1_catalog.json",
  "./icon-v400.svg",
  "./icon-maskable-v400.svg"
];

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

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME;
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

function networkFirst(request) {
  return fetch(request)
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
        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }
        throw new Error("OFFLINE_RESOURCE_MISSING");
      });
    });
}

function staleWhileRevalidate(request) {
  return caches.match(request).then(function (cached) {
    const refresh = fetch(request)
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

  const isData = (
    url.pathname.includes("/data/")
    || url.pathname.includes("/data_i18n/")
    || url.pathname.endsWith(".json")
  );

  if (request.mode === "navigate" || isData) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

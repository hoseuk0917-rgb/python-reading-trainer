const fs = require("fs");

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function assert(condition, label) {
  if (!condition) {
    console.error("FAIL=" + label);
    process.exitCode = 1;
    return false;
  }
  console.log("PASS=" + label);
  return true;
}

const rootIndex = read("index.html");
const appIndex = read("src/pwa/index.html");
const polishJs = read("src/pwa/release_polish_v400_1.js");
const polishCss = read("src/pwa/release_polish_v400_1.css");
const sw = read("src/pwa/sw_v400_1.js");
const manifest = JSON.parse(read("src/pwa/manifest.json"));
const readme = read("README.md");

let ok = true;

ok = assert(rootIndex.includes("release: V400.1"), "root_release_v400_1") && ok;
ok = assert(rootIndex.includes("window.location.search") && rootIndex.includes("window.location.hash"), "root_query_hash_preserved") && ok;

ok = assert(appIndex.includes("release_polish_v400_1.css?v=20260821_v400_1"), "polish_css_loaded") && ok;
ok = assert(appIndex.includes("release_polish_v400_1.js?v=20260821_v400_1"), "polish_js_loaded") && ok;
ok = assert(appIndex.includes("consumer_ui_v349.css?v=20260821_v400_5"), "consumer_css_cache_buster") && ok;
ok = assert(appIndex.includes("consumer_ux_v349.js?v=20260821_v400_5"), "consumer_js_cache_buster") && ok;
ok = assert(appIndex.includes("v400=20260821_v400_1"), "app_js_cache_buster") && ok;
ok = assert(appIndex.includes("manifest.json?v=20260821_v400_1"), "manifest_cache_buster") && ok;

ok = assert(polishCss.includes(":not(#diagnosticLearningPromptV4002)"), "diagnostic_home_visibility_override") && ok;
ok = assert(polishCss.includes("#diagnosticLearningPromptV4002"), "diagnostic_prompt_explicit_display") && ok;

ok = assert(polishJs.includes('url.searchParams.get(ADMIN_QUERY_KEY) === "1"'), "admin_query_opt_in") && ok;
ok = assert(polishJs.includes('PAGES_HOST = "hoseuk0917-rgb.github.io"'), "admin_host_lock") && ok;
ok = assert(polishJs.includes('PAGES_PATH_PREFIX = "/python-reading-trainer/"'), "admin_path_lock") && ok;
ok = assert(polishJs.includes("isDeveloperAccessAllowed: function ()"), "admin_access_shim_present") && ok;
ok = assert(polishJs.includes("Developer 편집 · 로컬 전용"), "remote_admin_developer_disabled") && ok;
ok = assert(polishJs.includes('id = "consumerAdminV4001"'), "header_admin_entry") && ok;
ok = assert(polishJs.includes('register("./sw_v400_1.js?v=20260821_v400_1"'), "service_worker_registered") && ok;

ok = assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, "manifest_icons_present") && ok;
ok = assert(manifest.start_url === "./" && manifest.scope === "./", "manifest_scope_start") && ok;
ok = assert(manifest.icons.some((row) => row.purpose === "maskable"), "manifest_maskable_icon") && ok;

ok = assert(sw.includes('CACHE_NAME = "python-reading-trainer-v400-1-20260821"'), "service_worker_cache_version") && ok;
ok = assert(sw.includes('request.mode === "navigate" || isData'), "service_worker_network_first_navigation_data") && ok;
ok = assert(sw.includes("staleWhileRevalidate"), "service_worker_static_revalidate") && ok;

ok = assert(readme.includes("현재 릴리즈: V400.1"), "readme_current_release") && ok;
ok = assert(readme.includes("?admin=1"), "readme_mobile_admin_instructions") && ok;
ok = assert(readme.includes("더보기 → 진단"), "readme_diagnostic_reentry") && ok;

console.log("V400_RELEASE_POLISH_AUDIT_PASS=" + ok);
if (!ok) process.exit(1);

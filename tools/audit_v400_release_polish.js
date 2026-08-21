const fs = require("fs");

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function pass(label, condition) {
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
const boot = read("src/pwa/release_polish_v400_1.js");
const runtime = read("src/pwa/content_quality_semantics.js");
const polish = read("src/pwa/v400_release_polish.js");
const auth = read("src/pwa/developer_auth_v1_config.js");
const remoteEntry = read("src/pwa/developer_remote_entry_v400_6_1.js");
const workbench = read("src/pwa/developer_workbench_v400_6_2.js");
const exitFix = read("src/pwa/developer_exit_mobile_fix_v400_6_3.js");
const adminLoader = read("src/pwa/admin_local_loader_v400_7.js");
const css = read("src/pwa/release_polish_v400_1.css");
const sw = read("src/pwa/sw_v400_1.js");
const icon = read("src/pwa/icon-v400.svg");
const maskable = read("src/pwa/icon-maskable-v400.svg");
const manifest = JSON.parse(read("src/pwa/manifest.json"));
const koLesson = JSON.parse(read("data/runtime/lesson_bundle_v400_5.json"));
const enLesson = JSON.parse(read("data_i18n/en/runtime/lesson_bundle_v400_5.json"));
const koSupport = JSON.parse(read("data/runtime/support_bundle_v400_5.json"));
const enSupport = JSON.parse(read("data_i18n/en/runtime/support_bundle_v400_5.json"));

const pngPaths = [
  "src/pwa/icon-v400-192.png",
  "src/pwa/icon-v400-512.png",
  "src/pwa/icon-maskable-v400-192.png",
  "src/pwa/icon-maskable-v400-512.png"
];

let ok = true;
ok = pass("root_release_v400_7", rootIndex.includes('RELEASE = "20260821_v400_7_hardening1"')) && ok;
ok = pass("root_admin_not_forwarded", rootIndex.includes('key !== "admin"')) && ok;
ok = pass("runtime_before_app", appIndex.indexOf("content_quality_semantics.js") < appIndex.indexOf("./app.js?")) && ok;

ok = pass("brand_splash_v400_6", runtime.includes('V400.6_BRAND_SPLASH')) && ok;
ok = pass("brand_mark", runtime.includes("prt-brand-mark-v4006")) && ok;
ok = pass("brand_ko_tagline", runtime.includes("코드를 쓰기 전에, 읽는 힘부터.")) && ok;
ok = pass("brand_en_tagline", runtime.includes("Read code first. Write with confidence.")) && ok;
ok = pass("brand_ready_exit", runtime.includes('finish("core-ready")')) && ok;
ok = pass("brand_no_forced_minimum", !runtime.includes("minimumVisible")) && ok;

ok = pass("runtime_bundle_v400_5", runtime.includes("V400.5_RUNTIME_CONTENT_BUNDLES_INLINE")) && ok;
ok = pass("runtime_fetch_interceptor", runtime.includes("window.fetch = function")) && ok;
ok = pass("runtime_fallback", runtime.includes("return nativeFetch(input, init)")) && ok;

ok = pass("boot_v400_7", boot.includes('V400.7_RELEASE_POLISH_BOOT')) && ok;
ok = pass("sw_release_v400_7", boot.includes('SW_URL = "./sw_v400_1.js?v=20260821_v400_7_hardening1"')) && ok;
ok = pass("brand_replaces_legacy_loader", boot.includes("window.PRTBrandSplashV4006")) && ok;
ok = pass("no_forced_reload", !boot.includes("window.location.reload") && !boot.includes("controllerchange")) && ok;
ok = pass("remote_admin_disabled", boot.includes("remoteAdminEnabled: false") && polish.includes("remoteAdminEnabled: false")) && ok;
ok = pass("mobile_admin_route_absent", !auth.includes("v400_mobile_admin_route.js")) && ok;
ok = pass("admin_static_css_absent", !appIndex.includes("admin_mode_v1.css?")) && ok;
ok = pass("admin_static_js_absent", !appIndex.includes('<script src="./admin_mode_v1.js?')) && ok;
ok = pass("admin_local_loader_wired", appIndex.includes("admin_local_loader_v400_7.js")) && ok;
ok = pass("admin_local_loader_guarded", adminLoader.includes("isLocalHost") && adminLoader.includes("admin_mode_v1.js") && adminLoader.includes("admin_mode_v1.css")) && ok;

ok = pass("developer_config_v400_7", auth.includes('V400.7_DEVELOPER_ENTRY_HARDENED1')) && ok;
ok = pass("developer_fallback_preserved", auth.includes("beginDeveloperFallback") && auth.includes('ENTRY_ID = "consumerDeveloperV40061"')) && ok;
ok = pass("developer_auth_no_body_observer", !auth.includes("new MutationObserver") && !auth.includes("setInterval")) && ok;
ok = pass("developer_runtime_cache_key", auth.includes("20260821_v400_7_hardening1")) && ok;
ok = pass("developer_workbench_loader", auth.includes("developer_workbench_v400_6_2.js")) && ok;
ok = pass("developer_exit_loader", auth.includes("developer_exit_mobile_fix_v400_6_3.js")) && ok;
ok = pass("developer_remote_entry_loader", auth.includes("developer_remote_entry_v400_6_1.js")) && ok;
ok = pass("developer_remote_entry_hardened", remoteEntry.includes("V400.7_DEVELOPER_REMOTE_ENTRY_HARDENED1")) && ok;
ok = pass("developer_remote_entry_no_body_observer", !remoteEntry.includes("new MutationObserver") && !remoteEntry.includes("setInterval")) && ok;
ok = pass("release_polish_hardened", polish.includes("V400.7_RELEASE_POLISH_HARDENED")) && ok;
ok = pass("release_polish_no_body_observer", !polish.includes("bodyObserver") && !polish.includes("observe(document.body")) && ok;
ok = pass("developer_workbench_present", workbench.includes("PRTDeveloperWorkbenchV40062")) && ok;
ok = pass("developer_exit_fix_present", exitFix.includes("PRTDeveloperExitMobileFixV40064")) && ok;

ok = pass("bottom_nav_preserved", css.includes(".consumer-nav-button-v349.active::before")) && ok;
ok = pass("manifest_release_v400_7", manifest.start_url === "./?release=20260821_v400_7_hardening1") && ok;
ok = pass("manifest_background_matches_brand", manifest.background_color === "#f7faff") && ok;
ok = pass("system_splash_png_files", pngPaths.every((path) => fs.existsSync(path) && fs.statSync(path).size > 0)) && ok;
ok = pass("manifest_png_192", manifest.icons.some((row) => row.src === "./icon-v400-192.png" && row.sizes === "192x192" && row.type === "image/png" && row.purpose === "any")) && ok;
ok = pass("manifest_png_512", manifest.icons.some((row) => row.src === "./icon-v400-512.png" && row.sizes === "512x512" && row.type === "image/png" && row.purpose === "any")) && ok;
ok = pass("manifest_maskable_png_192", manifest.icons.some((row) => row.src === "./icon-maskable-v400-192.png" && row.sizes === "192x192" && row.type === "image/png" && row.purpose === "maskable")) && ok;
ok = pass("manifest_maskable_png_512", manifest.icons.some((row) => row.src === "./icon-maskable-v400-512.png" && row.sizes === "512x512" && row.type === "image/png" && row.purpose === "maskable")) && ok;
ok = pass("brand_icon", icon.includes("linearGradient") && icon.includes("M91 153")) && ok;
ok = pass("brand_maskable_icon", maskable.includes("linearGradient") && maskable.includes("M123 174")) && ok;

ok = pass("sw_cache_v400_7", sw.includes("python-reading-trainer-v400-7-hardening1-20260821")) && ok;
ok = pass("sw_manifest_network_first", sw.includes('"manifest.json"') && sw.includes("CRITICAL_UI_FILES")) && ok;
ok = pass("sw_developer_critical", ["developer_auth_v1.js", "developer_remote_entry_v400_6_1.js", "developer_workbench_v400_6_2.js", "developer_exit_mobile_fix_v400_6_3.js"].every((name) => sw.includes('"' + name + '"'))) && ok;
ok = pass("sw_system_splash_png_assets", pngPaths.every((path) => sw.includes('"./' + path.replace("src/pwa/", "") + '"'))) && ok;
ok = pass("sw_no_navigation", !sw.includes("client.navigate")) && ok;

ok = pass("lesson_bundle_counts", koLesson.card_count === 1785 && enLesson.card_count === 1785) && ok;
ok = pass("lesson_source_counts", koLesson.source_file_count === 98 && enLesson.source_file_count === 98) && ok;
ok = pass("support_counts", koSupport.source_file_count === enSupport.source_file_count && koSupport.resource_file_count === 2) && ok;

console.log("V400_RELEASE_POLISH_AUDIT_PASS=" + ok);
if (!ok) process.exit(1);

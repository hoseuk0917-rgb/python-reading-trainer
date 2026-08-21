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
const bootPolish = read("src/pwa/release_polish_v400_1.js");
const visualPolish = read("src/pwa/v400_release_polish.js");
const authConfig = read("src/pwa/developer_auth_v1_config.js");
const css = read("src/pwa/release_polish_v400_1.css");
const sw = read("src/pwa/sw_v400_1.js");
const manifest = JSON.parse(read("src/pwa/manifest.json"));
const readme = read("README.md");

let ok = true;

ok = assert(rootIndex.includes('RELEASE = "20260821_v400_4"'), "root_release_v400_4") && ok;
ok = assert(!rootIndex.includes("serviceWorker.getRegistrations"), "root_does_not_unregister_sw") && ok;
ok = assert(!rootIndex.includes('indexOf("python-reading-trainer-v400") === 0'), "root_does_not_purge_warm_cache") && ok;
ok = assert(rootIndex.includes('key !== "admin"'), "root_admin_query_not_forwarded") && ok;
ok = assert(rootIndex.includes("body { visibility: hidden;"), "root_no_interstitial_paint") && ok;

ok = assert(appIndex.includes("release_polish_v400_1.css"), "polish_css_loaded") && ok;
ok = assert(appIndex.includes("release_polish_v400_1.js"), "polish_boot_loaded") && ok;
ok = assert(appIndex.includes("consumer_ui_v349.css"), "consumer_css_loaded") && ok;
ok = assert(appIndex.includes("consumer_ux_v349.js"), "consumer_js_loaded") && ok;
ok = assert(appIndex.includes('data-view="diagnostic"'), "diagnostic_view_wired") && ok;

ok = assert(bootPolish.includes('VERSION = "V400.4_RELEASE_POLISH_BOOT"'), "boot_polish_v400_4") && ok;
ok = assert(bootPolish.includes('SW_URL = "./sw_v400_1.js?v=20260821_v400_4"'), "service_worker_v400_4_registered") && ok;
ok = assert(bootPolish.includes("prt-core-loading-v4004"), "compact_core_loader") && ok;
ok = assert(bootPolish.includes("forcedReloadEnabled: false"), "forced_reload_disabled") && ok;
ok = assert(!bootPolish.includes("controllerchange"), "controller_reload_listener_removed") && ok;
ok = assert(!bootPolish.includes("window.location.reload"), "window_reload_removed") && ok;
ok = assert(bootPolish.includes("remoteAdminEnabled: false"), "boot_remote_admin_disabled") && ok;
ok = assert(!bootPolish.includes("ADMIN_QUERY_KEY"), "boot_admin_query_shim_removed") && ok;
ok = assert(!bootPolish.includes("prtDiagnosticEntryV4001"), "legacy_first_paint_card_removed") && ok;

ok = assert(visualPolish.includes('VERSION = "V400.3_RELEASE_POLISH"'), "visual_polish_v400_3_preserved") && ok;
ok = assert(visualPolish.includes("prt-diagnostic-entry-v4003"), "compact_diagnostic_entry") && ok;
ok = assert(visualPolish.includes("upgradePrimaryNavIcons"), "svg_bottom_nav_icons") && ok;
ok = assert(visualPolish.includes("removePublicAdminArtifacts"), "public_admin_cleanup") && ok;
ok = assert(visualPolish.includes("remoteAdminEnabled: false"), "visual_remote_admin_disabled") && ok;
ok = assert(!visualPolish.includes("openDeviceAdmin"), "device_admin_surface_removed") && ok;

ok = assert(authConfig.includes("V400.3_DEVELOPER_AUTH_V1_2"), "auth_config_v400_3_preserved") && ok;
ok = assert(!authConfig.includes("v400_mobile_admin_route.js"), "mobile_admin_route_not_loaded") && ok;

ok = assert(css.includes("body:not(.consumer-ux-v349-ready) > .topbar"), "initial_shell_hidden_until_ready") && ok;
ok = assert(css.includes(".consumer-nav-button-v349.active::before"), "compact_bottom_nav_active_indicator") && ok;
ok = assert(css.includes("background: transparent !important"), "bottom_nav_no_large_active_tile") && ok;
ok = assert(css.includes("#consumerAdminDeviceV4002"), "stale_public_admin_css_hidden") && ok;

ok = assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, "manifest_icons_present") && ok;
ok = assert(manifest.start_url === "./?release=20260821_v400_4" && manifest.scope === "./", "manifest_release_start_scope") && ok;
ok = assert(manifest.icons.some((row) => row.purpose === "maskable"), "manifest_maskable_icon") && ok;

ok = assert(sw.includes('CACHE_NAME = "python-reading-trainer-v400-4-20260821"'), "service_worker_cache_v400_4") && ok;
ok = assert(sw.includes("migratePreviousCaches"), "previous_cache_migration") && ok;
ok = assert(sw.includes("CRITICAL_UI_FILES"), "critical_ui_network_first_list") && ok;
ok = assert(sw.includes('cache: "no-store"'), "critical_ui_fetch_no_store") && ok;
ok = assert(sw.includes("staleWhileRevalidate(request)"), "warm_data_cache_first") && ok;
ok = assert(!sw.includes("client.navigate"), "activated_sw_does_not_force_navigation") && ok;
ok = assert(!sw.includes("code_explainer_rules.js"), "heavy_tool_not_precached") && ok;
ok = assert(sw.includes("v400_release_polish.js"), "visual_polish_precached") && ok;

ok = assert(readme.includes("현재 릴리즈: V400.4"), "readme_current_release") && ok;
ok = assert(readme.includes("강제 reload/navigation 제거"), "readme_forced_reload_removed") && ok;
ok = assert(readme.includes("공개 GitHub Pages에서는 Admin/Developer 진입을 제공하지 않습니다"), "readme_remote_admin_disabled") && ok;
ok = assert(readme.includes("더보기 → 진단"), "readme_diagnostic_reentry") && ok;

console.log("V400_RELEASE_POLISH_AUDIT_PASS=" + ok);
if (!ok) process.exit(1);

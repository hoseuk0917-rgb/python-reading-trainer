"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const baseUrl = process.env.V342_SMOKE_URL || "http://127.0.0.1:3377/tools/learning_hardening_v342_browser_case.html";
function which(name){const r=spawnSync("which",[name],{encoding:"utf8"});return r.status===0?String(r.stdout||"").trim():"";}
function findChrome(){return [process.env.CHROME_BIN,which("google-chrome"),which("google-chrome-stable"),which("chromium"),which("chromium-browser"),"/usr/bin/google-chrome","/usr/bin/chromium"].filter(Boolean).find(f=>fs.existsSync(f))||"";}
function decodeHtml(v){return String(v||"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");}

const chrome=findChrome();
if(!chrome){console.error("CHROME_FOUND=False");console.error("RESULT=FAIL_LEARNING_HARDENING_V342_REAL_BROWSER_SMOKE");process.exit(1);}
console.log("=== PRT V342 HARDENING REAL BROWSER SMOKE RUNNER ===");
console.log("CHROME_FOUND=True");
console.log("CHROME="+chrome);
console.log("HARNESS_BASE_URL="+baseUrl);

function runCase(caseName){
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),"prt-v342-"+caseName+"-"));
  const url=baseUrl+(baseUrl.includes("?")?"&":"?")+"case="+encodeURIComponent(caseName);
  const args=["--headless=new","--no-sandbox","--disable-dev-shm-usage","--disable-gpu","--disable-background-networking","--disable-component-update","--disable-default-apps","--disable-extensions","--disable-sync","--metrics-recording-only","--no-first-run","--window-size=1500,1800","--virtual-time-budget=150000","--user-data-dir="+profile,"--dump-dom",url];
  let result;
  try{result=spawnSync(chrome,args,{encoding:"utf8",maxBuffer:25*1024*1024,timeout:190000,env:{...process.env,HOME:profile}});}finally{try{fs.rmSync(profile,{recursive:true,force:true});}catch(_){}}
  const out=String(result&&result.stdout||""), err=String(result&&result.stderr||"");
  const match=out.match(/<pre id="report">([\s\S]*?)<\/pre>/i);
  const report=match?decodeHtml(match[1]):"";
  const pass="RESULT=PASS_LEARNING_HARDENING_V342_REAL_BROWSER_CASE";
  const fail="RESULT=FAIL_LEARNING_HARDENING_V342_REAL_BROWSER_CASE";
  const ok=Boolean(result&&!result.error&&result.status===0&&report.includes(pass)&&!report.includes(fail));
  console.log("\n=== CASE "+caseName.toUpperCase()+" ===");
  console.log("URL="+url);console.log("CHROME_EXIT_CODE="+String(result&&result.status));console.log("DOM_BYTES="+Buffer.byteLength(out,"utf8"));console.log("REPORT_FOUND="+Boolean(match));
  console.log("\n=== HARNESS REPORT "+caseName.toUpperCase()+" ===");console.log(report?report.trim():"REPORT_NOT_FOUND");
  if(err){const tail=err.split(/\r?\n/).filter(Boolean).filter(l=>!/DevTools listening on|dbus|upower/i.test(l)).slice(-8);if(tail.length){console.log("\n=== CHROME STDERR TAIL "+caseName.toUpperCase()+" ===");console.log(tail.join("\n"));}}
  if(result&&result.error) console.error(caseName.toUpperCase()+"_CHROME_ERROR="+String(result.error.message||result.error));
  return ok;
}
const desktop=runCase("desktop"), narrow=runCase("narrow");
console.log("\nDESKTOP_V342_BROWSER_PASS="+desktop);console.log("NARROW_V342_BROWSER_PASS="+narrow);
if(!desktop||!narrow){console.error("RESULT=FAIL_LEARNING_HARDENING_V342_REAL_BROWSER_SMOKE");process.exit(1);}
console.log("RESULT=PASS_LEARNING_HARDENING_V342_REAL_BROWSER_SMOKE");

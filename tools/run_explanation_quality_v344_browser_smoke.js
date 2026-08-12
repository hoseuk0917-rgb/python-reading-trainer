"use strict";
const {spawnSync}=require("child_process");
const fs=require("fs");
const chromeCandidates=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium","/usr/bin/chromium-browser"];
const chrome=chromeCandidates.find(fs.existsSync);
if(!chrome){console.error("CHROME_FOUND=False");process.exit(1);}
console.log("=== PRT V344 EXPLANATION QUALITY REAL BROWSER SMOKE ===");
console.log("CHROME="+chrome);
const cases=[{name:"DESKTOP",width:1200,height:1000},{name:"NARROW",width:390,height:1000}];
let failed=false;
for(const c of cases){
  const url="http://127.0.0.1:3377/tools/explanation_quality_v344_browser_case.html?case="+c.name.toLowerCase();
  const out=spawnSync(chrome,["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--window-size="+c.width+","+c.height,"--virtual-time-budget=30000","--dump-dom",url],{encoding:"utf8",maxBuffer:20*1024*1024,timeout:90000});
  const dom=out.stdout||"";
  const match=dom.match(/<pre id="report">([\s\S]*?)<\/pre>/i);
  const text=match?match[1].replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&"):"";
  console.log("\n=== CASE "+c.name+" ===");
  console.log("CHROME_EXIT_CODE="+out.status);
  if(out.error) console.log("CHROME_ERROR="+out.error.message);
  console.log(text||"REPORT_NOT_FOUND");
  const ok=out.status===0&&text.includes("RESULT=PASS_EXPLANATION_QUALITY_V344_REAL_BROWSER_CASE")&&!text.includes("=FAIL ");
  console.log(c.name+"_PASS="+ok);
  if(!ok)failed=true;
}
console.log("RESULT="+(failed?"FAIL_EXPLANATION_QUALITY_V344_REAL_BROWSER_SMOKE":"PASS_EXPLANATION_QUALITY_V344_REAL_BROWSER_SMOKE"));
if(failed)process.exit(1);

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

function createBrowserLikeSandbox() {
  const sandbox = {
    console,
    navigator: { language: "ko-KR" },
    location: { search: "", href: "http://127.0.0.1/" },
    localStorage: {
      getItem() { return null; },
      setItem() {},
      removeItem() {},
      clear() {}
    },
    sessionStorage: {
      getItem() { return null; },
      setItem() {},
      removeItem() {},
      clear() {}
    },
    document: {
      documentElement: {
        getAttribute(name) {
          return String(name || "").toLowerCase() === "lang" ? "ko-KR" : "";
        }
      },
      addEventListener() {},
      querySelector() { return null; },
      getElementById() { return null; },
      body: { dataset: {} }
    },
    URLSearchParams,
    setTimeout,
    clearTimeout
  };

  sandbox.window = sandbox;
  return sandbox;
}

function loadAnalyzer() {
  const rulesPath = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
  const rulesText = fs.readFileSync(rulesPath, "utf8");
  const sandbox = createBrowserLikeSandbox();

  vm.createContext(sandbox);
  vm.runInContext(rulesText, sandbox, { filename: "code_explainer_rules.js" });

  const api = sandbox.window.CodeExplainerRules || sandbox.CodeExplainerRules;
  if (!api || typeof api.analyze !== "function") {
    throw new Error("CodeExplainerRules.analyze is not callable");
  }
  return api;
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.on("data", (chunk) => chunks.push(chunk));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    process.stdin.on("error", reject);
  });
}

function parseArgs(argv) {
  const args = { language: "python" };
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--language" && i + 1 < argv.length) {
      args.language = argv[++i];
    }
  }
  return args;
}

(async function main() {
  try {
    const args = parseArgs(process.argv);
    const source = await readStdin();
    if (!source.trim()) {
      throw new Error("stdin source is empty");
    }

    const analyzer = loadAnalyzer();
    const result = analyzer.analyze(source, args.language || "python") || {};
    process.stdout.write(JSON.stringify(result));
  } catch (error) {
    process.stderr.write(String(error && error.stack ? error.stack : error) + "\n");
    process.exitCode = 1;
  }
})();

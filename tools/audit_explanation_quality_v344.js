"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const support = fs.readFileSync(path.join(ROOT, "src/pwa/explanation_support_v344.js"), "utf8");
const app = fs.readFileSync(path.join(ROOT, "src/pwa/app.js"), "utf8");
const index = fs.readFileSync(path.join(ROOT, "src/pwa/index.html"), "utf8");

let errors = 0;
function check(name, ok, detail) {
  console.log(`${name}=${ok ? "PASS" : "FAIL"}${detail ? ` DETAIL=${detail}` : ""}`);
  if (!ok) errors += 1;
}

const requiredTerms = [
  "bytecode", "cpython", "compile", "interpreter", "iterable", "iterator", "object", "reference",
  "protocol", "argument", "parameter", "scope", "module", "exception", "serialization", "runtime",
  "cache", "dependency", "package", "venv", "api", "attribute", "method", "instance", "mutable",
  "immutable", "encoding", "utf8", "stdlib", "envvar", "process"
];
requiredTerms.forEach((term) => check(`GLOSSARY_${term.toUpperCase()}`, new RegExp(`\\n\\s*${term}:\\s*\\{`).test(support), "KO/EN refresher entry"));

check("BYTECODE_EXPLICIT_BRIDGE", /바이트코드는 Python 소스와 실제 실행 사이/.test(support) && /Bytecode is an intermediate instruction form/.test(support));
check("THREE_LAYER_POPUP", /한 줄 정의/.test(support) && /작은 예/.test(support) && /지금 왜 나왔나요\?/.test(support));
check("POPUP_NO_PROGRESS_WRITE", !/localStorage\.setItem\s*\(/.test(support) && !/python-reading-trainer-progress/.test(support));
check("SAFE_TEXT_WALKER", /createTreeWalker/.test(support) && /DocumentFragment/.test(support));
check("NO_INNERHTML_TEXT_REWRITE", !/\.innerHTML\s*=.*node\.nodeValue/.test(support), "modal template innerHTML is allowed; prose replacement is not");
check("SUPPORT_DENSITY_CAP", /MAX_TERMS_PER_BLOCK\s*=\s*4/.test(support));
check("EXCLUDES_CODE_AND_EXISTING_SYNTAX", /code, pre, button, a, input, textarea/.test(support) && /\.syntax-token-v340/.test(support));
check("TARGETS_LESSON_SIDECARD_EXPLAINER", /#conceptIntro/.test(support) && /#sideCards/.test(support) && /#codeSummary/.test(support) && /#codeSteps \.code-step p/.test(support));
check("FOCUS_RETURN", /returnFocus/.test(support) && /returnTermId/.test(support) && /restoreFocus/.test(support) && /candidate\.focus/.test(support) && /requestAnimationFrame/.test(support), "saved element + term fallback + post-dialog restore");
check("ESCAPE_CLOSE", /event\.key === "Escape"/.test(support));

check("FOUNDATION_OVERRIDE_PRESENT", /EXPLANATION_QUALITY_FOUNDATION_V344_A1/.test(app));
const foundationFragments = [
  [
    '"variable": {definition:"변수는 값을 나중에 다시 쓰기 위해 붙여 두는 이름이다.',
    '"variable": {definition:"변수는 값을 나중에 다시 쓰기 위해 붙이는 이름이다.'
  ],
  ['"parameter": {definition:"매개변수(parameter)는 함수가 호출될 때 받을 값에 붙여 둔 이름이다.'],
  ['"argument": {definition:"인자(argument)는 함수를 호출할 때 실제로 건네는 값이다.'],
  ['"return": {definition:"return은 함수가 만든 결과를 호출한 곳으로 돌려주고'],
  ['"object": {definition:"객체(object)는 Python에서 실제로 다루는 하나의 값이다.'],
  ['"iterable": {definition:"iterable은 for문처럼 값을 하나씩 차례로 꺼내 볼 수 있는 대상을 뜻한다.']
];
foundationFragments.forEach((alternatives, i) => check(`BEGINNER_FOUNDATION_${i + 1}`, alternatives.some((fragment) => app.includes(fragment))));

const v344Block = (app.match(/EXPLANATION_QUALITY_FOUNDATION_V344_A1 BEGIN([\s\S]*?)EXPLANATION_QUALITY_FOUNDATION_V344_A1 END/) || ["", ""])[1];
check("FOUNDATION_BLOCK_NO_OPAQUE_FIRST_LINE", !/definition:\"(?:AST|CallExpression|protocol|reference|object reference|bytecode)/i.test(v344Block));
check("FOUNDATION_KO_EN_PARITY", /if \(currentLanguage === "en"\)/.test(v344Block) && (v344Block.match(/"variable": \{definition:/g) || []).length === 2);

const supportPos = index.indexOf("explanation_support_v344.js");
const appPos = index.indexOf("./app.js?");
check("SUPPORT_SCRIPT_WIRED", supportPos > appPos && supportPos > 0, "support runs after core renderers");
check("V344_CACHE_BUST", /eq=20260812_v344_explain1/.test(index) && /explanation_support_v344\.js\?v=20260812_v344_explain1/.test(index));

const genericBoilerplate = [
  "비슷한 문제에서도 같은 원칙",
  "When encountering similar code",
  "This problem is a Level"
];
genericBoilerplate.forEach((phrase) => check(`NO_GENERIC_${phrase.slice(0, 10).replace(/\s/g, "_")}`, !v344Block.includes(phrase)));

console.log(`ERRORS=${errors}`);
if (errors) process.exit(1);
console.log("RESULT=PASS_EXPLANATION_QUALITY_V344_AUDIT");

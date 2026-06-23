const fs = require("fs");
const path = require("path");

function arg(name, fallback = "") {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJsonl(file) {
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJsonl(file, rows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join("\n") + "\n", "utf8");
}

function sumChars(rows) {
  return rows.reduce((acc, row) => acc + Number(row.ko_chars || Array.from(String(row.ko || "")).length), 0);
}

function makeBatches(rows, maxRows, maxChars) {
  const batches = [];
  let cur = [];
  let chars = 0;

  rows.forEach((row) => {
    const c = Number(row.ko_chars || Array.from(String(row.ko || "")).length);
    if (cur.length && (cur.length >= maxRows || chars + c > maxChars)) {
      batches.push(cur);
      cur = [];
      chars = 0;
    }
    cur.push(row);
    chars += c;
  });

  if (cur.length) batches.push(cur);
  return batches;
}

async function translateBatch(endpoint, authKey, batch) {
  const params = new URLSearchParams();
  batch.forEach((row) => params.append("text", row.ko));
  params.append("source_lang", "KO");
  params.append("target_lang", "EN-US");
  params.append("preserve_formatting", "1");

  const res = await fetch(endpoint + "/v2/translate", {
    method: "POST",
    headers: {
      "Authorization": "DeepL-Auth-Key " + authKey,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const body = await res.text();

  if (!res.ok) {
    throw new Error(`DeepL HTTP ${res.status}: ${body.slice(0, 500)}`);
  }

  const json = JSON.parse(body);
  if (!json.translations || json.translations.length !== batch.length) {
    throw new Error(`Unexpected translation count: got ${json.translations ? json.translations.length : 0}, expected ${batch.length}`);
  }

  return json.translations.map((t) => t.text);
}

async function main() {
  const input = arg("--input");
  const output = arg("--output");
  const report = arg("--report", output.replace(/\.jsonl$/i, ".report.json"));
  const authEnv = arg("--auth-env");
  const endpoint = arg("--endpoint", "https://api-free.deepl.com");
  const limit = Number(arg("--limit", "0"));
  const batchRows = Number(arg("--batch-rows", "35"));
  const batchChars = Number(arg("--batch-chars", "18000"));

  if (!input || !output || !authEnv) {
    console.error("Usage: node tools/run_deepl_translate_jsonl_a8.js --input in.jsonl --output out.jsonl --auth-env DEEPL_AUTH_KEY_WIFE [--limit 5]");
    process.exit(1);
  }

  const authKey = process.env[authEnv];
  if (!authKey) {
    console.error(`Missing environment variable: ${authEnv}`);
    process.exit(1);
  }

  const sourceRows = readJsonl(input);
  const rows = limit > 0 ? sourceRows.slice(0, limit) : sourceRows;

  let existing = [];
  const done = new Map();

  if (fs.existsSync(output)) {
    existing = readJsonl(output);
    existing.forEach((row) => {
      if (row && row.id && row.status === "translated" && row.en) done.set(row.id, row);
    });
  }

  const pending = rows.filter((row) => !done.has(row.id));
  const batches = makeBatches(pending, batchRows, batchChars);

  console.log("DEEPL_TRANSLATE_JSONL_A8");
  console.log(`input=${input}`);
  console.log(`output=${output}`);
  console.log(`auth_env=${authEnv}`);
  console.log(`endpoint=${endpoint}`);
  console.log(`source_rows=${sourceRows.length}`);
  console.log(`selected_rows=${rows.length}`);
  console.log(`selected_chars=${sumChars(rows)}`);
  console.log(`already_done=${done.size}`);
  console.log(`pending=${pending.length}`);
  console.log(`batches=${batches.length}`);

  const translatedMap = new Map(done);

  for (let i = 0; i < batches.length; i += 1) {
    const batch = batches[i];
    const chars = sumChars(batch);

    let translated = null;
    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        console.log(`batch ${i + 1}/${batches.length}: rows=${batch.length} chars=${chars} attempt=${attempt}`);
        translated = await translateBatch(endpoint, authKey, batch);
        break;
      } catch (err) {
        lastError = err;
        console.log(`retryable_error=${err.message}`);
        await sleep(1500 * attempt);
      }
    }

    if (!translated) {
      throw lastError || new Error("Unknown DeepL error");
    }

    batch.forEach((row, idx) => {
      translatedMap.set(row.id, {
        ...row,
        en: translated[idx],
        status: "translated",
        translated_at: new Date().toISOString(),
        deepl_endpoint: endpoint
      });
    });

    const outRows = rows.map((row) => translatedMap.get(row.id) || row);
    writeJsonl(output, outRows);
    await sleep(250);
  }

  const finalRows = rows.map((row) => translatedMap.get(row.id) || row);
  const translatedRows = finalRows.filter((row) => row.status === "translated" && row.en);

  writeJsonl(output, finalRows);
  fs.writeFileSync(report, JSON.stringify({
    audit: "V334_A8_DEEPL_TRANSLATE_JSONL",
    input,
    output,
    auth_env: authEnv,
    endpoint,
    selected_rows: rows.length,
    selected_chars: sumChars(rows),
    translated_rows: translatedRows.length,
    translated_chars: sumChars(translatedRows),
    completed: translatedRows.length === rows.length
  }, null, 2) + "\n", "utf8");

  console.log("DEEPL_TRANSLATE_DONE");
  console.log(`translated_rows=${translatedRows.length}`);
  console.log(`translated_chars=${sumChars(translatedRows)}`);
  console.log(`completed=${translatedRows.length === rows.length}`);
  console.log(`report=${report}`);

  if (translatedRows.length !== rows.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error("DEEPL_TRANSLATE_FAILED");
  console.error(err && err.stack ? err.stack : String(err));
  process.exit(1);
});

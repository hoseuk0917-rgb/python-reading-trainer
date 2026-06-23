const fs = require("fs");

const files = [
  "src/pwa/app.js",
  "src/pwa/index.html",
  "index.html"
];

for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  text = text.replace(/\s+$/g, "") + "\n";
  fs.writeFileSync(file, text, "utf8");
  console.log("normalized_eof=" + file);
}

const ignore = ".gitignore";
let gitignore = fs.existsSync(ignore) ? fs.readFileSync(ignore, "utf8") : "";
if (!/(^|\r?\n)\.tmp\/(\r?\n|$)/.test(gitignore)) {
  gitignore = gitignore.replace(/\s+$/g, "") + "\n.tmp/\n";
  fs.writeFileSync(ignore, gitignore, "utf8");
  console.log("added_tmp_to_gitignore=true");
} else {
  console.log("added_tmp_to_gitignore=false");
}

const fs = require("fs");
const path = require("path");

const root = __dirname;
const src = path.join(root, "src");
const out = path.join(root, "public");

fs.mkdirSync(out, { recursive: true });

const files = ["index.html", "styles.css"];
for (const name of files) {
  const from = path.join(src, name);
  const to = path.join(out, name);
  if (!fs.existsSync(from)) {
    console.error("Missing source file:", from);
    process.exit(1);
  }
  fs.copyFileSync(from, to);
  console.log("Wrote", path.relative(root, to));
}

console.log("Build complete → public/");

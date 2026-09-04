const fs = require("fs");
const path = require("path");

const root = __dirname;
const src = path.join(root, "src");
const out = path.join(root, "public");
const assetsSrc = path.join(root, "assets");
const assetsOut = path.join(out, "assets");

fs.mkdirSync(out, { recursive: true });

const files = ["index.html", "styles.css", "weather.js"];
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

// Copy logo and other static assets into public/assets
fs.mkdirSync(assetsOut, { recursive: true });
if (fs.existsSync(assetsSrc)) {
  for (const name of fs.readdirSync(assetsSrc)) {
    const from = path.join(assetsSrc, name);
    if (!fs.statSync(from).isFile()) continue;
    const to = path.join(assetsOut, name);
    fs.copyFileSync(from, to);
    console.log("Wrote", path.relative(root, to));
  }
} else {
  console.warn("No assets/ directory found; skipped asset copy");
}

console.log("Build complete → public/");

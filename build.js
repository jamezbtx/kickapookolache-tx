const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = __dirname;
const src = path.join(root, "src");
const out = path.join(root, "public");
const assetsSrc = path.join(root, "assets");
const assetsOut = path.join(out, "assets");

fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(path.join(out, "data"), { recursive: true });

const files = ["index.html", "styles.css", "weather.js", "feeds.js", "share.js", "obituaries.html", "police-blotter.html", "local-jobs.html"];
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

// Refresh live feed snapshot into public/data/feeds.json (soft-fail)
const fetchScript = path.join(root, "scripts", "fetch-feeds.js");
if (fs.existsSync(fetchScript)) {
  console.log("Running scripts/fetch-feeds.js …");
  const result = spawnSync(process.execPath, [fetchScript], {
    cwd: root,
    encoding: "utf8",
    env: process.env
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    console.warn(
      "fetch-feeds.js exited with status",
      result.status,
      "(continuing build)"
    );
  }
} else {
  console.warn("Missing scripts/fetch-feeds.js; skipped feed refresh");
}

console.log("Build complete → public/");

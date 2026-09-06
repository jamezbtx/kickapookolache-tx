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

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log("Wrote", path.relative(root, to));
}

function copyDirRecursive(fromDir, toDir) {
  if (!fs.existsSync(fromDir)) return;
  fs.mkdirSync(toDir, { recursive: true });
  for (const name of fs.readdirSync(fromDir)) {
    const from = path.join(fromDir, name);
    const to = path.join(toDir, name);
    const st = fs.statSync(from);
    if (st.isDirectory()) copyDirRecursive(from, to);
    else if (st.isFile()) copyFile(from, to);
  }
}

const rootFiles = [
  "index.html",
  "styles.css",
  "weather.js",
  "essentials.js",
  "feeds.js",
  "share.js",
  "submit.js",
  "obituaries.html",
  "police-blotter.html",
  "local-jobs.html",
  "ask-the-kolache.html",
  "garage-sales.html",
  "submit.html",
  "thank-you.html",
  "columns.html"
];
for (const name of rootFiles) {
  const from = path.join(src, name);
  const to = path.join(out, name);
  if (!fs.existsSync(from)) {
    console.error("Missing source file:", from);
    process.exit(1);
  }
  copyFile(from, to);
}

// Nested column HTML pages under src/columns/ → public/columns/
const columnsSrc = path.join(src, "columns");
if (fs.existsSync(columnsSrc)) {
  copyDirRecursive(columnsSrc, path.join(out, "columns"));
}

// Copy logo and nested column assets into public/assets (recursive)
fs.mkdirSync(assetsOut, { recursive: true });
if (fs.existsSync(assetsSrc)) {
  copyDirRecursive(assetsSrc, assetsOut);
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

// Refresh essentials snapshot into public/data/essentials.json (soft-fail)
const fetchEssentials = path.join(root, "scripts", "fetch-essentials.js");
if (fs.existsSync(fetchEssentials)) {
  console.log("Running scripts/fetch-essentials.js …");
  const essResult = spawnSync(process.execPath, [fetchEssentials], {
    cwd: root,
    encoding: "utf8",
    env: process.env
  });
  if (essResult.stdout) process.stdout.write(essResult.stdout);
  if (essResult.stderr) process.stderr.write(essResult.stderr);
  if (essResult.status !== 0) {
    console.warn(
      "fetch-essentials.js exited with status",
      essResult.status,
      "(continuing build)"
    );
  }
} else {
  console.warn("Missing scripts/fetch-essentials.js; skipped essentials refresh");
}

console.log("Build complete → public/");

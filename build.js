const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = __dirname;
const src = path.join(root, "src");
const out = path.join(root, "public");
const assetsSrc = path.join(root, "assets");
const assetsOut = path.join(out, "assets");

fs.mkdirSync(out, { recursive: true });
// Remove held pages/assets left over from earlier builds
// Staged articles (Steven Palmer + Kayla Goodson): approved, but NOT shipped by a normal build.
// ARTICLES_LIVE=1 includes the two pages, their assets and the staged homepage/interviews/sitemap blocks.
// Used for the draft preview; for the production publish see /workspace/kickapoo-ops/editorial/PUBLISH-2026-10-02.md.
const ARTICLES_LIVE = process.env.ARTICLES_LIVE !== "0"; // default ON since the Oct. 2, 2026 publish; ARTICLES_LIVE=0 builds without the two articles
const ARTICLE_PAGES = ["steven-james-west-lake.html", "kayla-goodson-chandler-chamber.html"];
const ARTICLE_ASSET_DIRS = [path.join("assets", "spotlights", "steven-james-west-lake"), path.join("assets", "spotlights", "kayla-goodson")];
const held_list = ["obituaries.html", "police-blotter.html"]; // pages dropped Oct. 11, 2026 (James); sources kept in src/ but not built
if (!ARTICLES_LIVE) held_list.push(...ARTICLE_PAGES, ...ARTICLE_ASSET_DIRS);
for (const held of held_list) {
  fs.rmSync(path.join(out, held), { recursive: true, force: true });
}
fs.mkdirSync(path.join(out, "data"), { recursive: true });

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log("Wrote", path.relative(root, to));
}

// HELD (staged articles): skip their asset folders unless ARTICLES_LIVE=1
// DRAFT columns (written, not approved): built only with DRAFT_COLUMNS=1 (used for draft preview deploys).
// A normal build leaves them out of public/ entirely. Remove the entry here when James approves a column.
const DRAFT_COLUMN_PAGES = [path.join("columns", "chrittys-bushcraft", "one-match-fire.html"), path.join("columns", "carlees-creations", "paracord-bracelet.html")];
const DRAFT_COLUMN_ASSET_DIRS = [path.join("assets", "columns", "chrittys-bushcraft", "one-match-fire"), path.join("assets", "columns", "carlees-creations", "paracord-bracelet")];
const DRAFT_COLUMNS = process.env.DRAFT_COLUMNS === "1";
// DRAFT stories (written, not approved): built only with DRAFT_STORIES=1 (draft preview deploys only, never --prod).
// A normal build leaves the page, its assets and the <!--DRAFT:stories--> teaser block out of public/ entirely.
// At publish: move the page into rootFiles, drop its entry here, and turn its teaser block into a normal card.
const DRAFT_STORY_PAGES = []; // chandler-chapter-11-rick-ford.html published Oct. 2026 (now in rootFiles)
const DRAFT_STORY_ASSET_DIRS = [];
const DRAFT_STORIES = process.env.DRAFT_STORIES === "1";
const EXCLUDE_DIRS = new Set([].concat(ARTICLES_LIVE ? [] : ARTICLE_ASSET_DIRS, DRAFT_COLUMNS ? [] : DRAFT_COLUMN_ASSET_DIRS, DRAFT_STORIES ? [] : DRAFT_STORY_ASSET_DIRS).map((d) => path.join(root, d)));
if (!DRAFT_COLUMNS) {
  for (const p of DRAFT_COLUMN_PAGES.concat(DRAFT_COLUMN_ASSET_DIRS)) fs.rmSync(path.join(out, p), { recursive: true, force: true });
}
if (!DRAFT_STORIES) {
  for (const p of DRAFT_STORY_PAGES.concat(DRAFT_STORY_ASSET_DIRS)) fs.rmSync(path.join(out, p), { recursive: true, force: true });
}

// Staged blocks in index.html / interviews.html / sitemap.xml:
//   <!--STAGED:articles-->...<!--/STAGED:articles-->     kept only when ARTICLES_LIVE=1
//   <!--UNSTAGED:articles-->...<!--/UNSTAGED:articles--> kept only when NOT live (the old text)
function applyStaged(text) {
  const keepStaged = ARTICLES_LIVE;
  text = text.replace(/<!--STAGED:articles-->([\s\S]*?)<!--\/STAGED:articles-->([ \t]*\n?)/g, (m, inner, nl) => (keepStaged ? inner.replace(/^\n/, "").replace(/[ \t]+$/, "") + nl : ""));
  text = text.replace(/<!--UNSTAGED:articles-->([\s\S]*?)<!--\/UNSTAGED:articles-->([ \t]*\n?)/g, (m, inner, nl) => (keepStaged ? "" : inner + nl));
  //   <!--DRAFT:stories-->...<!--/DRAFT:stories-->           kept only when DRAFT_STORIES=1 (draft preview)
  text = text.replace(/[ \t]*<!--DRAFT:stories-->([\s\S]*?)<!--\/DRAFT:stories-->([ \t]*\n?)/g, (m, inner, nl) => (DRAFT_STORIES ? inner.replace(/^\n/, "") + nl : ""));
  if (text.includes("<urlset")) text = text.replace(/^[ \t]*<url>/gm, "  <url>").replace(/\n[ \t]*\n/g, "\n"); // tidy sitemap whitespace
  return text;
}
const STAGED_FILES = new Set(["index.html", "interviews.html", "sitemap.xml"]);

function copyDirRecursive(fromDir, toDir) {
  if (!fs.existsSync(fromDir)) return;
  if (EXCLUDE_DIRS.has(path.resolve(fromDir))) { console.log("Skipped (held)", path.relative(root, fromDir)); return; }
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
  "click-track.js",
  "share.js",
  "submit.js",
  "local-jobs.html",
  "ask-the-kolache.html",
  "garage-sales.html",
  "submit.html",
  "thank-you.html",
  "columns.html",
  "contact.html",
  "privacy.html",
  "rate-card.html",
  "crossword.html",
  "crossword.js",
  "puzzle-celebrate.js",
  "robots.txt",
  "sitemap.xml",
  "google8b5645cd28b56a20.html",
  "pastor-heath-rock-hill.html",
  "interviews.html",
  "word-search.html",
  "word-search.js",
  "archive.js",
  "manifest.webmanifest",
  "sw.js",
  "pwa.js",
  "push.js",
  "offline.html",
  "apple-touch-icon.png",
  "about.html",
  "local-updates.html",
  "flag-retirement-brownsboro-cadet.html",
  "lake-palestine-state-park.html",
  "chandler-chapter-11-rick-ford.html",
  "chandler-pow-wow-2026.html",
  "chandler-museum-memorial-park.html",
  "morgan-smith-brownsboro.html",
  "union-hill-pumpkin-park-brownsboro.html",
  "kornpop-the-klown-brownsboro.html",
  "lake-palestine-state-park-update-rodney-franklin.html",
  "normandy-norwegian-colony-brownsboro.html"
];
for (const name of rootFiles) {
  const from = path.join(src, name);
  const to = path.join(out, name);
  if (!fs.existsSync(from)) {
    console.error("Missing source file:", from);
    process.exit(1);
  }
  if (STAGED_FILES.has(name)) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, applyStaged(fs.readFileSync(from, "utf8")));
    console.log("Wrote", path.relative(root, to), ARTICLES_LIVE ? "(articles live)" : "(articles staged out)");
  } else copyFile(from, to);
}
if (DRAFT_STORIES) {
  console.log("DRAFT_STORIES=1 → including draft story pages (preview only)");
  for (const name of DRAFT_STORY_PAGES) copyFile(path.join(src, name), path.join(out, name));
}
if (ARTICLES_LIVE) {
  console.log("ARTICLES_LIVE=1 → including Steven Palmer + Kayla Goodson article pages");
  for (const name of ARTICLE_PAGES) copyFile(path.join(src, name), path.join(out, name));
}

// Static crossword sample (API falls back here when Blobs weekly key is empty)
const crosswordSrc = path.join(root, "data", "crossword.json");
if (fs.existsSync(crosswordSrc)) {
  copyFile(crosswordSrc, path.join(out, "data", "crossword.json"));
} else {
  console.warn("Missing data/crossword.json; crossword page will show empty state without API");
}

// Weekly crossword queue: data/crosswords/YYYY-MM-DD.json (built by scripts/gen-crossword.mjs) is
// inlined into the crossword functions so /api/crossword always has this week's puzzle.
{
  const qDir = path.join(root, "data", "crosswords");
  const queue = {};
  for (const f of [crosswordSrc, ...(fs.existsSync(path.join(root, "data", "archive")) ? fs.readdirSync(path.join(root, "data", "archive")).filter((n) => /^crossword-.*\.json$/.test(n)).map((n) => path.join(root, "data", "archive", n)) : [])]) {
    if (fs.existsSync(f)) { const p = JSON.parse(fs.readFileSync(f, "utf8")); queue[p.id] = p; }
  }
  if (fs.existsSync(qDir)) for (const n of fs.readdirSync(qDir).filter((n) => n.endsWith(".json"))) {
    const p = JSON.parse(fs.readFileSync(path.join(qDir, n), "utf8"));
    if ([...p.across, ...p.down].every((e) => e.clue)) queue[p.id] = p;
    else console.warn("Skipping crossword", n, "(unclued entries)");
  }
  fs.writeFileSync(path.join(root, "netlify", "functions", "lib", "crossword-queue-data.mjs"),
    "// GENERATED by build.js from data/crosswords + data/crossword.json. Do not edit.\nexport const QUEUE = " + JSON.stringify(queue) + ";\n");
  console.log("Crossword queue:", Object.keys(queue).sort().join(", "));
}

// Puzzle archive (previous weeks): data/archive/*.json -> public/data/archive/ (loaded with ?week=YYYY-MM-DD)
copyDirRecursive(path.join(root, "data", "archive"), path.join(out, "data", "archive"));

// Word Search: published Oct. 2, 2026 (puzzle data baked into the build from src/data/wordsearch.json).
// Weekly swap: src/data/wordsearches/<Monday>.json (newest on/before this week, Central time) wins over
// src/data/wordsearch.json. Make one with: node scripts/gen-wordsearch.js --in data/wordsearches/<Monday>.json --out src/data/wordsearches/<Monday>.json
{
  const wsDir = path.join(src, "data", "wordsearches");
  const t = new Date(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date()) + "T12:00:00Z");
  t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 6) % 7));
  const monday = t.toISOString().slice(0, 10);
  const pick = fs.existsSync(wsDir) ? fs.readdirSync(wsDir).filter((n) => /^\d{4}-\d{2}-\d{2}\.json$/.test(n) && n.slice(0, 10) <= monday).sort().pop() : null;
  copyFile(pick ? path.join(wsDir, pick) : path.join(src, "data", "wordsearch.json"), path.join(out, "data", "wordsearch.json"));
  console.log("Word search:", pick || "src/data/wordsearch.json");
}

// Nested column HTML pages under src/columns/ → public/columns/
const columnsSrc = path.join(src, "columns");
if (fs.existsSync(columnsSrc)) {
  copyDirRecursive(columnsSrc, path.join(out, "columns"));
  if (!DRAFT_COLUMNS) for (const p of DRAFT_COLUMN_PAGES) fs.rmSync(path.join(out, p), { force: true });
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

// ---------------------------------------------------------------------------
// Shared partials (src/partials/*.html).
//   <!--INCLUDE:good-neighbor-->  is replaced by src/partials/good-neighbor.html in the built page.
//   STORY PAGES GET IT AUTOMATICALLY: any page with <article class="... column-article ..."> and no explicit
//   marker gets the "Know a good neighbor?" callout inserted just before </main>. A new interview/column page
//   only needs to use that article class; no per-page edit is required.
// Story og:image standard: 2400x1260 JPEG, filename ending -og-hq-2400x1260.jpg (see README "Story og image standard").
// ---------------------------------------------------------------------------
const partialsDir = path.join(src, "partials");
const partials = {};
if (fs.existsSync(partialsDir)) {
  for (const f of fs.readdirSync(partialsDir)) {
    if (f.endsWith(".html")) partials[f.replace(/\.html$/, "")] = fs.readFileSync(path.join(partialsDir, f), "utf8").trim();
  }
}
const PWA_HEAD = [
  '<link rel="manifest" href="/manifest.webmanifest" />',
  '<meta name="theme-color" content="#8b1e1e" />',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
  '<script src="/pwa.js" defer></script>',
  '<script src="/push.js" defer></script>'
];
const INCLUDE_RE = /([ \t]*)<!--INCLUDE:([a-z0-9-]+)-->/g;
const warnings = [];
function applyPartials(file) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  html = html.replace(INCLUDE_RE, (m, indent, name) => {
    if (!partials[name]) { console.error("Unknown partial", name, "in", path.relative(root, file)); process.exit(1); }
    return partials[name].split("\n").map((l) => indent + l).join("\n");
  });
  const isStory = /<article[^>]*class="[^"]*\bcolumn-article\b/.test(html);
  if (isStory && partials["good-neighbor"] && !before.includes("<!--INCLUDE:good-neighbor-->") && !html.includes('class="good-neighbor')) {
    html = html.replace(/([ \t]*)<\/main>/, (m, indent) => partials["good-neighbor"].split("\n").map((l) => indent + l).join("\n") + "\n" + indent + "</main>");
  }
  if (isStory) {
    const og = (html.match(/<meta property="og:image" content="([^"]+)"/) || [])[1] || "";
    if (!/-og-hq-2400x1260\.jpg$/.test(og)) warnings.push(path.relative(root, file) + ": og:image " + (og ? "is not the HQ standard (-og-hq-2400x1260.jpg): " + og : "missing (stories should have a 2400x1260 -og-hq card)"));
  }
  // PWA head tags (manifest, theme color, touch icon, SW registration) on every page that has a <head>.
  if (html.includes("</head>") && !html.includes('rel="manifest"')) {
    html = html.replace(/([ \t]*)<\/head>/, (m, indent) => indent + PWA_HEAD.join("\n" + indent) + "\n" + indent + "</head>");
  }
  if (html !== before) fs.writeFileSync(file, html);
}
function walkHtml(dir, fn) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "assets" || name === "node_modules") continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkHtml(p, fn);
    else if (name.endsWith(".html")) fn(p);
  }
}
walkHtml(out, applyPartials);
walkHtml(out, (f) => { if (fs.readFileSync(f, "utf8").includes("<!--INCLUDE:")) { console.error("Unresolved INCLUDE marker in", path.relative(root, f)); process.exit(1); } });
for (const w of warnings) console.warn("WARN", w);

// News SEO: NewsArticle JSON-LD on stories + news-sitemap.xml (see scripts/seo.js)
require("./scripts/seo.js").run({ out, isStory: (h) => /<article[^>]*class="[^"]*\bcolumn-article\b/.test(h) });

console.log("Build complete → public/");

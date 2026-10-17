#!/usr/bin/env node
/**
 * finalize-spotlights.js: run ONLY at publish time (after James says "publish").
 *
 * For each staged spotlight page in src/:
 *   - removes the <p class="draft-banner"> line
 *   - removes the <div class="draft-notes"> … </div> block
 *   - flips <meta name="robots"> from "noindex, nofollow" to "index, follow"
 *   - strips the "DRAFT · " title prefix and the "DRAFT. " description prefix
 * Then adds interviews.html + both spotlight pages to src/sitemap.xml (if missing).
 *
 * Usage:  node scripts/finalize-spotlights.js [--dry-run] [--root=/path/to/repo]
 * It does NOT build or deploy. After it runs: node build.js && netlify deploy --prod --dir=public
 */
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const rootArg = args.find((a) => a.startsWith("--root="));
const root = rootArg ? path.resolve(rootArg.slice(7)) : path.resolve(__dirname, "..");
const src = path.join(root, "src");

const ALL_PAGES = ["pastor-heath-rock-hill.html", "steven-james-west-lake.html", "kayla-goodson-chandler-chamber.html"];
// --only=a.html,b.html limits which spotlights get finalized (e.g. hold one that isn't approved)
const onlyArg = args.find((a) => a.startsWith("--only="));
const PAGES = onlyArg ? onlyArg.slice(7).split(",").filter(Boolean) : ALL_PAGES;
for (const p of PAGES) if (!ALL_PAGES.includes(p)) { console.error(`Unknown page: ${p}`); process.exit(2); }
const SITEMAP_ADD = ["interviews.html", ...PAGES];
const _d = new Date();
const today = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, "0")}-${String(_d.getDate()).padStart(2, "0")}`; // local (CT) date
let problems = 0;

for (const name of PAGES) {
  const file = path.join(src, name);
  let s = fs.readFileSync(file, "utf8");
  const before = s;
  s = s.replace(/^[ \t]*<p class="draft-banner">[\s\S]*?<\/p>[ \t]*\r?\n/m, "");
  s = s.replace(/^[ \t]*<div class="draft-notes">[\s\S]*?<\/ul>\s*<\/div>[ \t]*\r?\n/m, "");
  s = s.replace(/<meta name="robots" content="noindex, nofollow" \/>/, '<meta name="robots" content="index, follow" />');
  s = s.replace(/<title>DRAFT · /, "<title>");
  s = s.replace(/(<meta name="description" content=")DRAFT\. /, "$1");
  // Sanity checks: nothing draft-y should remain in the markup (CSS rules in <style> are harmless).
  const body = s.slice(s.indexOf("</head>"));
  for (const needle of ['class="draft-banner"', 'class="draft-notes"', "noindex", "Draft for review", "remove before publish"]) {
    if ((needle === "noindex" ? s : body).includes(needle)) {
      console.error(`!! ${name}: still contains "${needle}"`);
      problems++;
    }
  }
  console.log(`${before === s ? "unchanged" : "finalized"}: src/${name}`);
  if (!dryRun && before !== s) fs.writeFileSync(file, s);
}

const smPath = path.join(src, "sitemap.xml");
let sm = fs.readFileSync(smPath, "utf8");
const smBefore = sm;
for (const name of SITEMAP_ADD) {
  const loc = `https://kickapookolache.com/${name}`;
  if (sm.includes(`<loc>${loc}</loc>`)) { console.log(`sitemap already has ${name}`); continue; }
  const freq = name === "interviews.html" ? "weekly" : "monthly";
  const pri = name === "interviews.html" ? "0.7" : "0.6";
  sm = sm.replace("</urlset>", `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${pri}</priority></url>\n</urlset>`);
  console.log(`sitemap + ${name}`);
}
if (!dryRun && sm !== smBefore) fs.writeFileSync(smPath, sm);

console.log(dryRun ? "(dry run: no files written)" : "Done. Next: node build.js && netlify deploy --prod --dir=public");
process.exit(problems ? 1 : 0);

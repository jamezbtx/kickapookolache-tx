// Comms Check ad placement (James, Nov. 23, 2026): the ad always sits directly after the newest/main story.
//   Story pages (<article class="... column-article ...">): right after the closing </article>.
//   Homepage index.html: right after the FIRST story card in #stories-interviews (the lead/newest story),
//   so it follows automatically as new stories are added on top.
// Markup lives in src/partials/comms-check-ad.html. Idempotent (skips pages that already have class="cc-ad ").
// Used by build.js (applyPartials). Standalone: `node scripts/comms-ad.js public` applies it in place to a built
// folder without running a full build (use this when public/ has hand-maintained pages).
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const partial = () => fs.readFileSync(path.join(root, "src", "partials", "comms-check-ad.html"), "utf8").trim();
const STORY_RE = /<article[^>]*class="[^"]*\bcolumn-article\b/;
function indentBlock(text, indent) { return text.split("\n").map((l) => indent + l).join("\n") + "\n"; }
function injectCommsAd(html, isIndex, ad = partial()) {
  if (html.includes('class="cc-ad ')) return html;
  if (STORY_RE.test(html)) {
    return html.replace(/(<article[^>]*class="[^"]*\bcolumn-article\b[\s\S]*?<\/article>[ \t]*\n)/, (m) => m + indentBlock(ad, "      "));
  }
  if (isIndex) {
    return html.replace(/(<div id="stories-interviews"[^>]*>\s*<article[\s\S]*?<\/article>[ \t]*\n)/, (m) => m + indentBlock(ad, "            "));
  }
  return html;
}
module.exports = { injectCommsAd, STORY_RE };
if (require.main === module) {
  const dir = path.resolve(process.argv[2] || path.join(root, "public"));
  const walk = (d) => { for (const n of fs.readdirSync(d)) { if (n === "assets" || n === "node_modules") continue; const p = path.join(d, n); if (fs.statSync(p).isDirectory()) walk(p); else if (n.endsWith(".html")) { const h = fs.readFileSync(p, "utf8"); const o = injectCommsAd(h, p === path.join(dir, "index.html")); if (o !== h) { fs.writeFileSync(p, o); console.log("cc-ad →", path.relative(dir, p)); } } } };
  walk(dir);
}

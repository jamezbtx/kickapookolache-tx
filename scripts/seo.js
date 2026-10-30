"use strict";
/**
 * News SEO, run by build.js after partials: NewsArticle JSON-LD on every story page and
 * public/news-sitemap.xml (Google News: articles published in the last 2 days).
 * Dates come ONLY from <meta property="article:published_time|article:modified_time"> or the
 * documented publish log below. Never guessed; pages without a date get no date fields and stay
 * out of the news sitemap.
 */
const fs = require("fs");
const path = require("path");

const SITE = "https://kickapookolache.com";
// All publish times now live in each page's article:published_time meta (verified against
// Netlify production deploy history; see kickapoo-ops/seo/publish-dates-2026-10-12.md).
const PUBLISH_LOG = {};
const city = (name) => ({ "@type": "City", name, containedInPlace: { "@type": "State", name: "Texas" } });
// Where each story takes place (checked against the story text). Columns are how-tos: no location.
const LOCATIONS = {
  "chandler-chapter-11-rick-ford.html": [city("Chandler")],
  "chandler-museum-memorial-park.html": [city("Chandler")],
  "chandler-pow-wow-2026.html": [city("Chandler")],
  "kayla-goodson-chandler-chamber.html": [city("Chandler")],
  "steven-james-west-lake.html": [city("Chandler")],
  "pastor-heath-rock-hill.html": [city("Brownsboro")],
  "lake-palestine-state-park.html": [{ "@type": "Place", name: "Lake Palestine, near Chandler, Texas" }, city("Chandler")],
  "flag-retirement-brownsboro-cadet.html": [city("Tyler")],
  "normandy-norwegian-colony-brownsboro.html": [city("Brownsboro")],
  "bear-necessities-brownsboro.html": [city("Brownsboro"), city("Chandler")]
};
const PUBLISHER = {
  "@type": "NewsMediaOrganization",
  "@id": SITE + "/#organization",
  name: "Kickapoo Kolache",
  url: SITE + "/",
  logo: { "@type": "ImageObject", url: SITE + "/assets/kickapoo-kolache-logo-light.jpg", width: 800, height: 800 }
};

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "’").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html, attr, key) => { const m = html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`)); return m ? decode(m[1]) : ""; };
const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function run({ out, isStory, now = new Date() }) {
  const stories = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      if (name === "assets" || name === "node_modules") continue;
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (name.endsWith(".html")) {
        const html = fs.readFileSync(p, "utf8");
        if (isStory(html)) stories.push({ file: p, rel: path.relative(out, p).split(path.sep).join("/"), html });
      }
    }
  };
  walk(out);
  const missing = [];
  const news = [];
  for (const s of stories) {
    let { html } = s;
    const url = meta(html, "property", "og:url") || (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || `${SITE}/${s.rel}`;
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    const headline = decode(meta(html, "property", "og:title") || title.replace(/\s*·\s*Kickapoo Kolache\s*$/, ""));
    const pub = meta(html, "property", "article:published_time") || PUBLISH_LOG[s.rel] || "";
    const mod = meta(html, "property", "article:modified_time") || pub;
    if (!pub) missing.push(s.rel);
    const ld = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: headline.length > 110 ? headline.slice(0, 107) + "…" : headline,
      description: meta(html, "name", "description") || undefined,
      image: meta(html, "property", "og:image") ? [meta(html, "property", "og:image")] : undefined,
      datePublished: pub || undefined,
      dateModified: pub ? mod : undefined,
      author: { "@type": "Person", name: "James Burgess", url: SITE + "/about.html" },
      contributor: meta(html, "name", "contributor") ? { "@type": "Person", name: meta(html, "name", "contributor") } : undefined,
      publisher: PUBLISHER,
      contentLocation: LOCATIONS[s.rel],
      inLanguage: "en-US"
    };
    const tag = `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`;
    // replace an existing NewsArticle block, else insert before </head>
    const re = /<script type="application\/ld\+json">[^<]*"NewsArticle"[^<]*<\/script>/;
    html = re.test(html) ? html.replace(re, tag) : html.replace(/(\s*)<\/head>/, `\n  ${tag}$1</head>`);
    JSON.parse(html.match(/<script type="application\/ld\+json">([^<]*)<\/script>/g).map((t) => t.replace(/^<script[^>]*>|<\/script>$/g, "")).find((j) => j.includes("NewsArticle")));
    fs.writeFileSync(s.file, html);
    if (pub && now - new Date(pub) <= 2 * 864e5 && now >= new Date(pub)) news.push({ url, headline, pub });
  }
  const body = news.sort((a, b) => b.pub.localeCompare(a.pub)).map((n) => `  <url>
    <loc>${xml(n.url)}</loc>
    <news:news>
      <news:publication><news:name>Kickapoo Kolache</news:name><news:language>en</news:language></news:publication>
      <news:publication_date>${n.pub}</news:publication_date>
      <news:title>${xml(n.headline)}</news:title>
    </news:news>
  </url>`).join("\n");
  fs.writeFileSync(path.join(out, "news-sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${body}
</urlset>
`);
  console.log(`SEO: NewsArticle JSON-LD on ${stories.length} stories; news-sitemap.xml has ${news.length} (last 2 days)`);
  if (missing.length) console.warn("SEO WARN: no publish date (no datePublished, kept out of news sitemap):", missing.join(", "));
  return { stories: stories.map((s) => s.rel), news, missing };
}
module.exports = { run };

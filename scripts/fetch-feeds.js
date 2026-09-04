"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "data");
const OUT_FILE = path.join(OUT_DIR, "feeds.json");

const CHANDLER_FEED =
  "https://www.chandlertx.com/RSSFeed.aspx?ModID=1&CID=All-newsflash.xml";
const CHANDLER_PAGE = "https://www.chandlertx.com/m/NewsFlash";
const MAXPREPS_SCHOOL =
  "https://www.maxpreps.com/tx/brownsboro/brownsboro-bears/";
const MAXPREPS_FOOTBALL =
  "https://www.maxpreps.com/tx/brownsboro/brownsboro-bears/football/";
const UA =
  "KickapooKolache/1.0 (+local draft builder; Brownsboro-Chandler TX)";

function fetchText(url, timeoutMs) {
  return new Promise(function (resolve, reject) {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          "User-Agent": UA,
          Accept: "application/rss+xml, application/xml, text/xml, text/html, */*"
        },
        timeout: timeoutMs || 15000
      },
      function (res) {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          res.resume();
          fetchText(res.headers.location, timeoutMs).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error("HTTP " + res.statusCode + " for " + url));
          return;
        }
        const chunks = [];
        res.on("data", function (c) {
          chunks.push(c);
        });
        res.on("end", function () {
          resolve(Buffer.concat(chunks).toString("utf8"));
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", function () {
      req.destroy();
      reject(new Error("Timeout fetching " + url));
    });
  });
}

function decodeXml(s) {
  return String(s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseRssItems(xml, maxItems) {
  const items = [];
  const re = /<item\b[\s\S]*?<\/item>/gi;
  let match;
  while ((match = re.exec(xml)) && items.length < (maxItems || 5)) {
    const block = match[0];
    const titleM = block.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const linkM = block.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i);
    const dateM = block.match(/<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i);
    const title = decodeXml(titleM && titleM[1]);
    const link = decodeXml(linkM && linkM[1]);
    const pubDate = decodeXml(dateM && dateM[1]);
    if (!title) continue;
    items.push({ title: title, link: link || null, pubDate: pubDate || null });
  }
  return items;
}

function parseMaxprepsFeatured(html) {
  const m = html.match(
    /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i
  );
  if (!m) return { featured: null, note: "No __NEXT_DATA__ found" };
  let data;
  try {
    data = JSON.parse(m[1]);
  } catch (err) {
    return { featured: null, note: "Failed to parse __NEXT_DATA__ JSON" };
  }
  const featured =
    data &&
    data.props &&
    data.props.pageProps &&
    data.props.pageProps.featuredGameData;
  if (!featured) return { featured: null, note: "No featuredGameData" };

  const date = featured.date || featured.contestDateInGMT || null;
  let opponent = null;
  if (featured.opponentTeam && featured.opponentTeam.name) {
    opponent = featured.opponentTeam.name;
  } else if (Array.isArray(featured.teams)) {
    const other = featured.teams.find(function (t) {
      const name = (t && t.name) || "";
      return name && !/brownsboro/i.test(name);
    });
    if (other) opponent = other.name;
  }
  if (!opponent && featured.title) {
    const vs = featured.title.match(
      /(?:vs\.?|@)\s*(.+?)(?:\s*$)/i
    );
    if (vs) opponent = vs[1].replace(/\s+Varsity.*$/i, "").trim();
  }

  const note =
    featured.description ||
    featured.title ||
    (opponent && date ? "Featured football game" : "Featured game data present");

  if (!date && !opponent) {
    return { featured: null, note: "featuredGameData lacked date/opponent" };
  }

  return {
    featured: {
      date: date || null,
      opponent: opponent || null,
      note: note
    }
  };
}

async function main() {
  const errors = [];
  const result = {
    fetchedAt: new Date().toISOString(),
    maxpreps: {
      schoolUrl: MAXPREPS_SCHOOL,
      footballUrl: MAXPREPS_FOOTBALL,
      featured: null
    },
    chandler: {
      hasRss: true,
      feedUrl: CHANDLER_FEED,
      pageUrl: CHANDLER_PAGE,
      items: []
    },
    brownsboro: {
      hasRss: false,
      label: "No RSS — link fallback",
      pageUrl: "https://brownsborotx.gov/",
      agendasUrl: "https://brownsborotx.gov/meeting-agendas-and-minutes"
    },
    bisd: {
      hasRss: false,
      label: "No news RSS — link fallback",
      newsUrl: "https://www.gobearsgo.net/about-us/new-headlines",
      calendarUrl: "https://www.gobearsgo.net/about-us/district-wide-calendar"
    },
    errors: errors
  };

  try {
    const xml = await fetchText(CHANDLER_FEED);
    result.chandler.items = parseRssItems(xml, 5);
    if (!result.chandler.items.length) {
      errors.push("Chandler RSS returned no items");
    }
  } catch (err) {
    errors.push("Chandler RSS: " + (err && err.message ? err.message : String(err)));
  }

  try {
    const html = await fetchText(MAXPREPS_FOOTBALL);
    const parsed = parseMaxprepsFeatured(html);
    result.maxpreps.featured = parsed.featured;
    if (!parsed.featured && parsed.note) {
      errors.push("MaxPreps: " + parsed.note);
    }
  } catch (err) {
    errors.push("MaxPreps: " + (err && err.message ? err.message : String(err)));
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(result, null, 2) + "\n", "utf8");
  console.log(
    "Wrote",
    path.relative(ROOT, OUT_FILE),
    "(" + result.chandler.items.length + " Chandler items,",
    result.maxpreps.featured ? "MaxPreps featured ok" : "MaxPreps featured null,",
    errors.length + " errors)"
  );
}

main().catch(function (err) {
  console.error("fetch-feeds failed hard:", err);
  const fallback = {
    fetchedAt: new Date().toISOString(),
    maxpreps: {
      schoolUrl: MAXPREPS_SCHOOL,
      footballUrl: MAXPREPS_FOOTBALL,
      featured: null
    },
    chandler: {
      hasRss: true,
      feedUrl: CHANDLER_FEED,
      pageUrl: CHANDLER_PAGE,
      items: []
    },
    brownsboro: {
      hasRss: false,
      label: "No RSS — link fallback",
      pageUrl: "https://brownsborotx.gov/",
      agendasUrl: "https://brownsborotx.gov/meeting-agendas-and-minutes"
    },
    bisd: {
      hasRss: false,
      label: "No news RSS — link fallback",
      newsUrl: "https://www.gobearsgo.net/about-us/new-headlines",
      calendarUrl: "https://www.gobearsgo.net/about-us/district-wide-calendar"
    },
    errors: [String(err && err.message ? err.message : err)]
  };
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify(fallback, null, 2) + "\n", "utf8");
  } catch (_) {}
  process.exitCode = 0;
});

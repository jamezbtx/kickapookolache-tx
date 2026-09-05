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
const CHANDLER_JOBS_FEED =
  "https://www.chandlertx.com/RSSFeed.aspx?CommunityJobs=False&ModID=66&CID=All-0";
const CHANDLER_JOBS_PAGE = "https://www.chandlertx.com/jobs.aspx";
const HENDERSON_FEED =
  "https://www.henderson-county.com/RSSFeed.aspx?ModID=1&CID=All-newsflash.xml";
const HENDERSON_PAGE = "https://www.henderson-county.com/CivicAlerts.aspx";
const ATHENS_FEED =
  "https://www.athensreview.com/search/?f=rss&t=article&c=news&l=25&s=start_time&sd=desc";
const ATHENS_PAGE = "https://www.athensreview.com/";
const MAXPREPS_SCHOOL =
  "https://www.maxpreps.com/tx/brownsboro/brownsboro-bears/";
const MAXPREPS_FOOTBALL =
  "https://www.maxpreps.com/tx/brownsboro/brownsboro-bears/football/";
const UA =
  "KickapooKolache/1.0 (+local draft builder; Brownsboro-Chandler TX)";

// Rural towns for Athens Review title/desc filter (Brownsboro–Chandler + rural Henderson).
// Drop Tyler-only. Soft-fail OK if Athens yields nothing.
const RURAL_TOWNS = [
  "Brownsboro",
  "Chandler",
  "Murchison",
  "Eustace",
  "Malakoff",
  "Tool",
  "Seven Points",
  "Gun Barrel",
  "Berryville",
  "Larue",
  "Poynor",
  "Neches",
  "Trinidad",
  "Enchanted Oaks",
  "Payne Springs",
  "Star Harbor",
  "Moore Station"
];
const RURAL_INCLUDE_RE = new RegExp(
  "\\b(" +
    RURAL_TOWNS.map(function (t) {
      return t.replace(/\s+/g, "\\s+");
    }).join("|") +
    ")\\b",
  "i"
);

const LOCAL_BRIEFS_MAX = 10;

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

function stripTags(s) {
  return decodeXml(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
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
    const descM = block.match(/<description\b[^>]*>([\s\S]*?)<\/description>/i);
    const title = decodeXml(titleM && titleM[1]);
    const link = decodeXml(linkM && linkM[1]);
    const pubDate = decodeXml(dateM && dateM[1]);
    const description = stripTags(descM && descM[1]);
    if (!title) continue;
    items.push({
      title: title,
      link: link || null,
      pubDate: pubDate || null,
      description: description || null
    });
  }
  return items;
}

function haystack(item) {
  return [item.title, item.description, item.link]
    .filter(Boolean)
    .join(" ");
}

function passesRuralFilter(item) {
  const text = haystack(item);
  if (!text) return false;
  // Require an explicit rural town from the allow-list.
  if (!RURAL_INCLUDE_RE.test(text)) return false;
  // Drop Tyler-only: Tyler mention without a rural town after stripping Tyler.
  if (/\btyler\b/i.test(text)) {
    const withoutTyler = text.replace(/\btyler\b/gi, " ");
    if (!RURAL_INCLUDE_RE.test(withoutTyler)) return false;
  }
  return true;
}

function toBrief(item, source, sourceUrl) {
  return {
    title: item.title,
    link: item.link || null,
    pubDate: item.pubDate || null,
    source: source,
    sourceUrl: sourceUrl
  };
}

function briefSortKey(item) {
  if (!item.pubDate) return 0;
  const t = Date.parse(item.pubDate);
  return Number.isNaN(t) ? 0 : t;
}

function buildLocalBriefs(groups, briefErrors) {
  const sources = [];
  const briefs = [];
  const seen = Object.create(null);

  (groups || []).forEach(function (g) {
    const items = g.items || [];
    sources.push({
      id: g.id,
      label: g.label,
      url: g.url,
      count: items.length,
      error: g.error || null
    });
    items.forEach(function (item) {
      if (!item || !item.title) return;
      const key = (item.link || item.title).toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      briefs.push(toBrief(item, g.label, g.url));
    });
  });

  briefs.sort(function (a, b) {
    return briefSortKey(b) - briefSortKey(a);
  });

  return {
    items: briefs.slice(0, LOCAL_BRIEFS_MAX),
    sources: sources,
    errors: briefErrors || []
  };
}

function opponentLabelFromTeam(team) {
  // featuredGameData.opponentTeam is a nested object — never treat the whole
  // object as a string. Prefer school name, then append mascot when present.
  if (!team || typeof team !== "object") return null;
  const school =
    (team.formattedNameWithoutState && String(team.formattedNameWithoutState).trim()) ||
    (team.name && String(team.name).trim()) ||
    (team.formattedName && String(team.formattedName).trim()) ||
    null;
  if (!school) return null;
  const mascot = team.mascot && String(team.mascot).trim();
  return mascot ? school + " " + mascot : school;
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

  // Prefer local wall-clock date (e.g. 2026-09-04T19:30:00). Do NOT fall back
  // to contestDateInGMT for display — that shifts kickoff by the TZ offset.
  const date = featured.date || null;
  const ot = featured.opponentTeam;
  let opponent = opponentLabelFromTeam(ot);
  let opponentMascot = ot && ot.mascot ? String(ot.mascot).trim() : null;
  let opponentName =
    (ot && (ot.formattedNameWithoutState || ot.name)) || null;
  if (opponentName) opponentName = String(opponentName).trim();

  if (!opponent && Array.isArray(featured.teams)) {
    const other = featured.teams.find(function (t) {
      const name = (t && t.name) || "";
      return name && !/brownsboro/i.test(name);
    });
    if (other) {
      opponent = opponentLabelFromTeam(other);
      opponentName = other.name || opponentName;
      opponentMascot = other.mascot || opponentMascot;
    }
  }
  if (!opponent && featured.title) {
    const vs = featured.title.match(/(?:vs\.?|@)\s*(.+?)(?:\s*$)/i);
    if (vs) opponent = vs[1].replace(/\s+Varsity.*$/i, "").trim();
  }

  const current = featured.currentTeam || null;
  let homeAway = null;
  if (current && typeof current.homeAwayType === "number") {
    homeAway = current.homeAwayType === 0 ? "home" : current.homeAwayType === 1 ? "away" : null;
  } else if (ot && typeof ot.homeAwayType === "number") {
    // opponent homeAwayType 1 = opponent is away => Bears are home
    homeAway = ot.homeAwayType === 1 ? "home" : ot.homeAwayType === 0 ? "away" : null;
  }

  let vsLabel = null;
  if (opponent) {
    vsLabel = homeAway === "away" ? "@ " + opponent : "vs " + opponent;
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
      date: date,
      dateIsLocalWall: true,
      opponent: opponent || null,
      opponentName: opponentName || null,
      opponentMascot: opponentMascot || null,
      homeAway: homeAway,
      vsLabel: vsLabel,
      location: featured.location || null,
      canonicalUrl: featured.canonicalUrl || null,
      note: note
    }
  };
}

function emptyPayload(errors) {
  return {
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
    chandlerJobs: {
      hasRss: true,
      feedUrl: CHANDLER_JOBS_FEED,
      pageUrl: CHANDLER_JOBS_PAGE,
      items: []
    },
    henderson: {
      hasRss: true,
      feedUrl: HENDERSON_FEED,
      pageUrl: HENDERSON_PAGE,
      items: [],
      note: "Official Henderson County news flash (often empty)"
    },
    athensReview: {
      hasRss: true,
      feedUrl: ATHENS_FEED,
      pageUrl: ATHENS_PAGE,
      items: [],
      filter:
        "Keep rural towns (Brownsboro–Chandler + rural Henderson list); drop Tyler-only"
    },
    localBriefs: {
      items: [],
      sources: [],
      errors: []
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
      calendarUrl: "https://www.gobearsgo.net/about-us/district-wide-calendar",
      parentSquareUrl: "https://www.gobearsgo.net/families/parentsquare",
      note: "ParentSquare is primary for families"
    },
    errors: errors || []
  };
}

async function main() {
  const errors = [];
  const result = emptyPayload(errors);

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
    const jobsXml = await fetchText(CHANDLER_JOBS_FEED);
    result.chandlerJobs.items = parseRssItems(jobsXml, 10);
    // Often empty — soft note only, not a hard failure
    if (!result.chandlerJobs.items.length) {
      errors.push("Chandler jobs RSS returned no items (often empty)");
    }
  } catch (err) {
    errors.push(
      "Chandler jobs RSS: " + (err && err.message ? err.message : String(err))
    );
  }

  try {
    const henXml = await fetchText(HENDERSON_FEED);
    result.henderson.items = parseRssItems(henXml, 8);
    // Empty channel is normal — soft note only
    if (!result.henderson.items.length) {
      errors.push("Henderson County RSS returned no items (often empty)");
    }
  } catch (err) {
    errors.push(
      "Henderson County RSS: " + (err && err.message ? err.message : String(err))
    );
  }

  try {
    const athXml = await fetchText(ATHENS_FEED);
    const raw = parseRssItems(athXml, 25);
    const kept = [];
    let dropped = 0;
    raw.forEach(function (item) {
      if (passesRuralFilter(item)) {
        kept.push(item);
      } else {
        dropped += 1;
      }
    });
    result.athensReview.items = kept.slice(0, 8);
    result.athensReview.rawCount = raw.length;
    result.athensReview.keptCount = kept.length;
    result.athensReview.droppedCount = dropped;
    // Soft-fail: zero rural matches is OK — recorded on localBriefs.errors.
  } catch (err) {
    // Soft-fail Athens
    errors.push(
      "Athens Review RSS (soft-fail): " +
        (err && err.message ? err.message : String(err))
    );
  }

  const briefErrors = [];
  if (!result.henderson.items.length) {
    briefErrors.push("Henderson County RSS returned no items (often empty)");
  }
  if (!result.athensReview.items.length) {
    briefErrors.push(
      "Athens Review: no rural-town matches after filter (soft-fail; raw=" +
        (result.athensReview.rawCount || 0) +
        ")"
    );
  }

  // Local briefs deliberately EXCLUDE Chandler News Flash (shown only under
  // Official City & School Feeds) to avoid homepage duplication.
  result.localBriefs = buildLocalBriefs(
    [
      {
        id: "henderson",
        label: "Henderson County News Flash",
        url: HENDERSON_FEED,
        items: result.henderson.items,
        error: null
      },
      {
        id: "athens",
        label: "Athens Review (rural filter)",
        url: ATHENS_FEED,
        items: result.athensReview.items,
        error: null
      }
    ],
    briefErrors
  );

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
  const srcCounts = (result.localBriefs.sources || [])
    .map(function (s) {
      return s.id + "=" + s.count;
    })
    .join(", ");
  console.log(
    "Wrote",
    path.relative(ROOT, OUT_FILE),
    "(" + result.chandler.items.length + " Chandler,",
    result.henderson.items.length + " Henderson,",
    result.athensReview.items.length + " Athens-filtered,",
    "localBriefs=" + result.localBriefs.items.length,
    "[" + srcCounts + "],",
    result.chandlerJobs.items.length + " Chandler jobs,",
    result.maxpreps.featured ? "MaxPreps ok" : "MaxPreps null,",
    errors.length + " notes)"
  );
}

main().catch(function (err) {
  console.error("fetch-feeds failed hard:", err);
  const fallback = emptyPayload([
    String(err && err.message ? err.message : err)
  ]);
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify(fallback, null, 2) + "\n", "utf8");
  } catch (_) {}
  process.exitCode = 0;
});

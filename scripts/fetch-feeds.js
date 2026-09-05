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
const GARAGE_CL_QUERY =
  "Brownsboro|Chandler|Murchison|Eustace|Berryville|Poynor|Larue|Neches|75756|75758";
const GARAGE_CL_FEED =
  "https://easttexas.craigslist.org/search/gms?format=rss&query=" +
  encodeURIComponent(GARAGE_CL_QUERY);
const GARAGE_CL_PAGE =
  "https://easttexas.craigslist.org/search/gms?query=" +
  encodeURIComponent(GARAGE_CL_QUERY);
// Unfiltered East TX gms HTML (Chrome fallback when format=rss is blocked).
const CL_GMS_PAGE_FALLBACK = "https://easttexas.craigslist.org/search/gms";
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

// Garage / moving sales — tighter local filter (CL East TX can be noisy).
const GARAGE_TOWNS = [
  "Brownsboro",
  "Chandler",
  "Murchison",
  "Eustace",
  "Berryville",
  "Poynor",
  "Larue",
  "La Rue",
  "Neches",
  "Malakoff",
  "Tool",
  "Seven Points",
  "Gun Barrel",
  "Trinidad",
  "Enchanted Oaks",
  "Payne Springs",
  "Star Harbor",
  "Moore Station"
];
const GARAGE_ZIP_RE = /\b(75756|75758)\b/;
const GARAGE_HENDERSON_CO_RE =
  /\bHenderson\s+Count(?:y|ies)\b|\bHenderson\s+Co\.?\b/i;
const GARAGE_TOWN_RE = new RegExp(
  "\\b(" +
    GARAGE_TOWNS.map(function (t) {
      return t.replace(/\s+/g, "\\s+");
    }).join("|") +
    ")\\b",
  "i"
);
const GARAGE_SALES_MAX = 8;

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

function garageHaystack(item) {
  return [item.title, item.description, item.location, item.link]
    .filter(Boolean)
    .join(" ");
}

function extractGarageLocation(block, item) {
  // CL RSS sometimes puts neighborhood in <title> suffix or geo tags.
  const geoM = block.match(/<(?:cl:)?region\b[^>]*>([\s\S]*?)<\/(?:cl:)?region>/i);
  if (geoM) return decodeXml(geoM[1]);
  const neighM = block.match(
    /<(?:cl:)?neighborhood\b[^>]*>([\s\S]*?)<\/(?:cl:)?neighborhood>/i
  );
  if (neighM) return decodeXml(neighM[1]);
  // Title pattern: "… - Brownsboro" / "(Chandler)"
  const title = item.title || "";
  const dash = title.match(/\s[-–—]\s*([^(-–—]{2,40})\s*$/);
  if (dash) return dash[1].trim();
  const paren = title.match(/\(([^)]{2,40})\)\s*$/);
  if (paren) return paren[1].trim();
  return null;
}

function parseGarageRssItems(xml, maxItems) {
  const items = [];
  const re = /<item\b[\s\S]*?<\/item>/gi;
  let match;
  while ((match = re.exec(xml)) && items.length < (maxItems || 25)) {
    const block = match[0];
    const titleM = block.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const linkM = block.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i);
    let dateM = block.match(/<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i);
    if (!dateM) {
      dateM = block.match(/<dc:date\b[^>]*>([\s\S]*?)<\/dc:date>/i);
    }
    const descM = block.match(
      /<description\b[^>]*>([\s\S]*?)<\/description>/i
    );
    const title = decodeXml(titleM && titleM[1]);
    const link = decodeXml(linkM && linkM[1]);
    const pubDate = decodeXml(dateM && dateM[1]);
    const description = stripTags(descM && descM[1]);
    if (!title) continue;
    const base = {
      title: title,
      link: link || null,
      pubDate: pubDate || null,
      description: description || null
    };
    base.location = extractGarageLocation(block, base);
    items.push(base);
  }
  return items;
}

function isGarageLocal(text) {
  return (
    GARAGE_TOWN_RE.test(text) ||
    GARAGE_ZIP_RE.test(text) ||
    GARAGE_HENDERSON_CO_RE.test(text)
  );
}

function passesGarageFilter(item) {
  const text = garageHaystack(item);
  if (!text) return false;
  if (!isGarageLocal(text)) return false;
  // Drop Tyler/Longview-only noise: metro mention without a local marker left.
  if (/\b(tyler|longview)\b/i.test(text)) {
    const withoutMetro = text.replace(/\b(tyler|longview)\b/gi, " ");
    if (!isGarageLocal(withoutMetro)) return false;
  }
  return true;
}

function toGarageItem(item) {
  return {
    title: item.title,
    link: item.link || null,
    pubDate: item.pubDate || null,
    location: item.location || null
  };
}

function findChromeBin() {
  const candidates = [
    process.env.CHROME_PATH,
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium"
  ].filter(Boolean);
  for (let i = 0; i < candidates.length; i++) {
    try {
      if (fs.existsSync(candidates[i])) return candidates[i];
    } catch (_) {}
  }
  return null;
}

function fetchHtmlViaChrome(url) {
  const { spawnSync } = require("child_process");
  const bin = findChromeBin();
  if (!bin) throw new Error("No Chrome/Chromium binary for HTML fallback");
  const result = spawnSync(
    bin,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--virtual-time-budget=12000",
      "--dump-dom",
      url
    ],
    {
      encoding: "utf8",
      maxBuffer: 12 * 1024 * 1024,
      timeout: 45000
    }
  );
  if (result.error) throw result.error;
  const html = result.stdout || "";
  if (!html || /<title>blocked<\/title>/i.test(html)) {
    throw new Error("Chrome HTML fetch blocked or empty");
  }
  return html;
}

function decodeHtmlEntities(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function parseGarageSearchHtml(html, maxItems) {
  const items = [];
  const seen = Object.create(null);
  const re =
    /<div[^>]*data-pid="(\d+)"[^>]*class="[^"]*cl-search-result[^"]*"[^>]*title="([^"]*)"[\s\S]*?<span class="result-location">([^<]*)<\/span>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*class="[^"]*posting-title[^"]*"/gi;
  let match;
  while ((match = re.exec(html)) && items.length < (maxItems || 40)) {
    const pid = match[1];
    if (seen[pid]) continue;
    seen[pid] = true;
    const title = decodeHtmlEntities(match[2]);
    const location = decodeHtmlEntities(match[3]);
    let link = decodeHtmlEntities(match[4]);
    if (link && link.startsWith("/")) {
      link = "https://www.craigslist.org" + link;
    }
    // Capture posted date from nearby meta if present
    const slice = html.slice(match.index, match.index + 1200);
    const dateM = slice.match(/title="([^"]*GMT[^"]*)"/i);
    const pubDate = dateM ? dateM[1] : null;
    if (!title) continue;
    items.push({
      title: title,
      link: link || null,
      pubDate: pubDate,
      description: null,
      location: location || null
    });
  }
  return items;
}

function filterGarageItems(raw) {
  const kept = [];
  (raw || []).forEach(function (item) {
    if (passesGarageFilter(item)) kept.push(toGarageItem(item));
  });
  return kept;
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
    garageSales: {
      items: [],
      hasRss: true,
      feedUrl: GARAGE_CL_FEED,
      pageUrl: GARAGE_CL_PAGE,
      source: null,
      rawCount: 0,
      keptCount: 0,
      filterNote:
        "Brownsboro/Chandler/rural west Henderson towns + 75756/75758 + Henderson County; drop Tyler/Longview-only",
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

  // Craigslist East TX garage/moving sales — RSS first, Chrome HTML fallback.
  // Soft-fail on 403/block; never invent listings.
  result.garageSales.errors = [];
  result.garageSales.source = null;
  try {
    let rawCl = [];
    let source = null;
    try {
      const clXml = await fetchText(GARAGE_CL_FEED);
      if (/<item\b/i.test(clXml)) {
        rawCl = parseGarageRssItems(clXml, 40);
        source = "rss";
      } else {
        throw new Error("RSS response had no <item> nodes");
      }
    } catch (rssErr) {
      const rssMsg =
        "Craigslist garage RSS soft-fail: " +
        (rssErr && rssErr.message ? rssErr.message : String(rssErr));
      result.garageSales.errors.push(rssMsg);
      errors.push(rssMsg);
      // Prefer full gms category HTML (query RSS is often blocked); filter locally.
      const html = fetchHtmlViaChrome(CL_GMS_PAGE_FALLBACK);
      rawCl = parseGarageSearchHtml(html, 40);
      source = "html-chrome";
    }
    const keptCl = filterGarageItems(rawCl);
    result.garageSales.items = keptCl.slice(0, GARAGE_SALES_MAX);
    result.garageSales.rawCount = rawCl.length;
    result.garageSales.keptCount = keptCl.length;
    result.garageSales.source = source;
    if (!keptCl.length) {
      const note =
        "Craigslist garage: no filtered local hits (raw=" +
        rawCl.length +
        ", source=" +
        source +
        ")";
      result.garageSales.errors.push(note);
      errors.push(note);
    }
  } catch (err) {
    const msg =
      "Craigslist garage (soft-fail): " +
      (err && err.message ? err.message : String(err));
    result.garageSales.items = [];
    result.garageSales.keptCount = 0;
    result.garageSales.rawCount = 0;
    result.garageSales.source = null;
    result.garageSales.errors.push(msg);
    errors.push(msg);
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
    "garageCL=" +
      result.garageSales.keptCount +
      "/" +
      result.garageSales.rawCount +
      (result.garageSales.source ? "@" + result.garageSales.source : ""),
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

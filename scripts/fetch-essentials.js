"use strict";

/**
 * Build-time essentials snapshot → public/data/essentials.json
 *
 * Soft-fail: if OpenAI / Netlify AI Gateway is unavailable, writes
 * source=empty / items=[] — do NOT invent EXAMPLE almanac/joke/history bodies.
 * essentials.js renders an honest empty/waiting state on the homepage.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "data");
const OUT_FILE = path.join(OUT_DIR, "essentials.json");

const SYSTEM_PROMPT =
  "You write daily essentials for Kickapoo Kolache, a warm local digital newspaper for Brownsboro and Chandler, Texas (East Texas, ZIPs 75756 / 75758). Tone: neighbors-first, heritage, kitchen-table friendly. NO fake crime or breaking news. Jokes must be clean, short, and freshly worded \u2014 prefer gentle East Texas / small-town / farm / church-potluck / weather humor. NEVER reuse overused classics (scarecrow outstanding in his field; chicken crossing the road; why was 6 afraid of 7; parallel lines have so much in common; nacho cheese; I told my wife she was drawing her eyebrows too high). Scripture: short Protestant-friendly verse + reference. History (This Day in History) \u2014 HARD ACCURACY RULES: (1) Must name a verifiable real place + date — never invent Brownsboro/Chandler/Henderson County rail, fair, school, church, or 'reached the area' milestones. (2) Ban vague hedging that implies our towns when the event is elsewhere: do NOT say 'the area', 'communities like ours', 'nearby towns', or 'this region' without naming the real place. (3) Prefer East Texas / Henderson County / rural Texas ONLY when sure; otherwise use a well-known Texas fact for that calendar date with the real place named (TSHA-style). (4) If uncertain, pick a broader true Texas heritage item — never fabricate. (5) Keep bans: Battle of the Sexes, culture-war, invented fairs/festivals. Each value is an object with body (string); scripture may also include reference (string). Keep each body to 1-3 short sentences. Reply with json only.";

function emptyPayload() {
  return {
    generatedAt: new Date().toISOString(),
    timezone: "America/Chicago",
    source: "empty",
    items: [],
    note: "Daily essentials appear when ready."
  };
}

function itemsFromAi(parsed) {
  const order = ["almanac", "joke", "scripture", "history"];
  const titles = {
    almanac: "Farmer's Almanac tip",
    joke: "Joke of the day",
    scripture: "Scripture",
    history: "This Day in History"
  };
  return order.map(function (type) {
    const chunk = (parsed && parsed[type]) || {};
    let body = chunk.body || "";
    if (type === "scripture" && chunk.reference) {
      body = body ? body + " — " + chunk.reference : chunk.reference;
    }
    return {
      type: type,
      title: chunk.title || titles[type],
      body: body,
      badge: "Daily",
      source: "ai"
    };
  }).filter(function (item) {
    return item.body && String(item.body).trim();
  });
}

async function tryAi() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.warn("No OPENAI_API_KEY — keeping existing essentials.json if present");
    return "KEEP";
  }
  let OpenAI;
  try {
    OpenAI = require("openai");
  } catch (err) {
    console.warn("openai package missing — writing empty essentials");
    return null;
  }
  const client = new OpenAI({
    apiKey: key,
    baseURL: process.env.OPENAI_BASE_URL || undefined
  });
  const today = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date());
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content:
          "Today is " +
          today +
          " (America/Chicago). Generate today's almanac tip, clean joke, short scripture+ref, and this-day-in-history. For history: Name the exact city/county and date. Prefer East Texas/Henderson County ONLY if sure; otherwise a well-known Texas fact for this date with the real place named. Never invent local rail/fair/school milestones. Never say 'the area' or 'communities like ours'."
      }
    ],
    temperature: 0.7
  });
  const raw =
    completion.choices &&
    completion.choices[0] &&
    completion.choices[0].message &&
    completion.choices[0].message.content;
  if (!raw) throw new Error("Empty AI response");
  const parsed = JSON.parse(raw);
  const items = itemsFromAi(parsed);
  if (!items.length) return null;
  return {
    generatedAt: new Date().toISOString(),
    timezone: "America/Chicago",
    source: "ai",
    items: items
  };
}

// Prefer the live, already-validated edition (Blobs via /api/essentials, written by the
// guarded daily function) so the static fallback never carries unvalidated AI history.
async function tryLiveApi() {
  const url = process.env.ESSENTIALS_API_URL || "https://kickapookolache.com/api/essentials";
  if (typeof fetch !== "function") return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(function () { ctrl.abort(); }, 8000);
    const res = await fetch(url, { signal: ctrl.signal, headers: { "cache-control": "no-cache" } });
    clearTimeout(t);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (data && Array.isArray(data.items) && data.items.length) return data;
  } catch (err) {
    console.warn("Live /api/essentials unavailable:", err && err.message ? err.message : err);
  }
  return null;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const live = await tryLiveApi();
  if (live) {
    fs.writeFileSync(OUT_FILE, JSON.stringify(live, null, 2) + "\n", "utf8");
    console.log(
      "Wrote",
      path.relative(ROOT, OUT_FILE),
      "from live /api/essentials (" + live.items.length + " items, generatedAt=" + (live.generatedAt || "?") + ")"
    );
    return;
  }
  let payload = emptyPayload();
  let keepExisting = false;
  try {
    const ai = await tryAi();
    if (ai === "KEEP") {
      keepExisting = true;
    } else if (ai && ai.items && ai.items.length) {
      payload = ai;
    }
  } catch (err) {
    console.warn(
      "AI essentials soft-fail:",
      err && err.message ? err.message : err
    );
  }
  if (keepExisting && fs.existsSync(OUT_FILE)) {
    try {
      const prev = JSON.parse(fs.readFileSync(OUT_FILE, "utf8"));
      if (prev && Array.isArray(prev.items) && prev.items.length) {
        console.log(
          "Kept",
          path.relative(ROOT, OUT_FILE),
          "(" + prev.items.length + " items, source=" + (prev.source || "?") + ")"
        );
        return;
      }
    } catch (_) {}
  }
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(
    "Wrote",
    path.relative(ROOT, OUT_FILE),
    "(" + payload.items.length + " items, source=" + payload.source + ")"
  );
}

main().catch(function (err) {
  console.error("fetch-essentials.js failed:", err && err.message ? err.message : err);
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(
      OUT_FILE,
      JSON.stringify(emptyPayload(), null, 2) + "\n",
      "utf8"
    );
    console.warn("Wrote empty essentials after failure");
  } catch (_) {
    process.exit(1);
  }
});

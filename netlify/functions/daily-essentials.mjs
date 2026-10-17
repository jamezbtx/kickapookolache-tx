/**
 * Scheduled daily essentials, every day ~5am America/Chicago.
 * Cron UTC: 0 10 * * * = 5:00am CDT / 4:00am CST (also set in netlify.toml). Runs 15 min before
 * daily-feeds (15 10 * * *). Renamed from weekly-essentials on 2026-10-09; cadence was already daily.
 *
 * Netlify AI Gateway + OpenAI SDK gpt-4o-mini when available.
 * Soft-fails to empty items (no EXAMPLE cards). Stores JSON in Blobs store "essentials" key "weekly"
 * (legacy key name kept on purpose: /api/essentials reads it; it holds the current daily edition).
 *
 * Hardening (2026-09-25):
 *  - A rejected joke no longer throws away the edition: the joke alone is retried (2x), then a
 *    vetted fallback joke (lib/essentials-guard.mjs) not in the recent-jokes list is used.
 *    Rejected joke text is logged. Recent jokes live in blob key "recent-jokes".
 *  - History must match the curated VERIFIED_HISTORY entry for today's date (same year + keyword)
 *    and must not hit HISTORY_DENYLIST; otherwise the curated entry is used. With no curated
 *    entry for the date, an unverifiable model item is dropped rather than published.
 *  - Every run logs "ESSENTIALS PATH joke=... history=..." naming the path taken.
 *
 * Curated content (2026-09-30):
 *  - Scripture, almanac tip and joke now come from lib/essentials-content.mjs (no AI): scripture
 *    rotates by Chicago day number through ~200 verified KJV verses (no repeat until all used),
 *    the almanac tip is chosen from tips tagged for the current Chicago month, and jokes come
 *    from the curated JOKES list with no repeat until exhausted (tracked in blob "recent-jokes").
 *  - The AI is asked for history only (still guarded by VERIFIED_HISTORY exactly as before). If the
 *    AI fails, the curated items plus guarded history are still published. AI-supplied
 *    scripture/almanac/joke are used only if the curated lists somehow fail.
 */
import OpenAI from "openai";
import { getStore } from "@netlify/blobs";
import {
  chicagoParts,
  curatedFor,
  denylistHit,
  matchesCurated,
  pickFallbackJoke
} from "./lib/essentials-guard.mjs";
import { JOKES, pickAlmanac, pickJoke, pickScripture, scriptureBody } from "./lib/essentials-content.mjs";

const SYSTEM_PROMPT =
  "You write daily essentials for Kickapoo Kolache, a warm local digital newspaper for Brownsboro and Chandler, Texas (East Texas, ZIPs 75756 / 75758). Tone: neighbors-first, heritage, kitchen-table friendly, small-town Texas. NO fake crime or breaking news. Jokes must be G-rated clean (church bulletin / porch safe), short, freshly worded, and actually funny — setup plus a clear punchline that lands. NO double meanings, NO body-part or 'nuts' innuendo, NO crude farm slang, NO bathroom humor, NO romantic/sexual jokes. Prefer a genuinely funny, well-known clean joke (classic farm, livestock, weather, church, or neighbor humor) over a forced or made-up pun; if a pun does not clearly land, choose a different joke. Prefer gentle East Texas farm, weather, church-potluck, livestock, and neighbor humor (no vague squirrel/acorn word salad) \u2014 prefer gentle East Texas / farm / church-potluck / weather humor. NEVER reuse overused classics (scarecrow outstanding in his field; chicken crossing the road; why was 6 afraid of 7; parallel lines have so much in common; nacho cheese; cow+trampoline / moo-sical). Scripture: short Protestant-friendly verse + reference (do not repeat the reference twice). History (This Day in History) \u2014 HARD ACCURACY RULES: (1) History MUST name a verifiable real place + calendar date — never invent Brownsboro/Chandler/Henderson County rail, fair, school, church, or 'reached the area' milestones. (2) BAN vague hedging that implies our towns when the event is elsewhere: do NOT say 'the area', 'communities like ours', 'nearby towns', or 'this region' without naming the real place. (3) Prefer East Texas / Henderson County / rural Texas ONLY when you are sure the fact is documented; otherwise use a well-known Texas fact for that calendar date and name the real city/county (TSHA Texas Day by Day style). (4) If uncertain, pick a broader true Texas heritage item for the date — NEVER fabricate. (5) Keep existing bans: gender politics, 'Battle of the Sexes', activism slogans, culture-war framing, partisan politics, national social-issue campaigns, invented fairs/festivals. Keep history about place, land, work, faith, and Texas heritage. Each value is an object with body (string); scripture may also include reference (string). Keep each body to 1-3 short sentences. Reply with json only.";

function fallbackPayload() {
  return {
    generatedAt: new Date().toISOString(),
    timezone: "America/Chicago",
    source: "fallback",
    items: []
  };
}

function itemsFromAi(parsed) {
  const order = ["scripture", "almanac", "history", "joke"];
  const titles = {
    almanac: "Farmer's Almanac tip",
    joke: "Joke of the day",
    scripture: "Scripture",
    history: "This Day in History"
  };
  return order
    .map((type) => {
      const chunk = (parsed && parsed[type]) || {};
      let body = chunk.body || "";
      if (type === "scripture" && chunk.reference) {
        const ref = String(chunk.reference).trim();
        const bare = String(body || "").trim();
        // Avoid "verse — ref" when body already ends with the same reference
        if (ref && bare) {
          const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
          if (norm(bare).endsWith(norm(ref)) || bare.includes(ref)) {
            body = bare;
          } else {
            body = bare + " — " + ref;
          }
        } else {
          body = bare || ref;
        }
      }
      return {
        type,
        title: chunk.title || titles[type],
        body,
        badge: "Essentials",
        source: "ai"
      };
    })
    .filter((item) => item.body && String(item.body).trim());
}

function priorJokeBody(prev) {
  if (!prev || !Array.isArray(prev.items)) return "";
  const joke = prev.items.find((i) => i && i.type === "joke");
  return joke && joke.body ? String(joke.body).trim() : "";
}

function jokeNorm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}


function historyIsVagueOrInventedLocal(body) {
  const s = String(body || "");
  if (/\b(the area|communities like ours|nearby towns|this region)\b/i.test(s)) return true;
  // Local place-name without other strong named cues beyond our towns → treat as suspect invention
  if (
    /\b(brownsboro|chandler|henderson county)\b/i.test(s) &&
    !/\b(galveston|houston|dallas|austin|beaumont|port bolivar|tyler|palestine|athens|gun barrel|kaufman|smith county|van zandt)\b/i.test(
      s
    ) &&
    /\b(rail|railway|railroad|fair|festival|school|church|reached|opened|founded|arrived)\b/i.test(s)
  ) {
    return true;
  }
  return false;
}


function userPrompt(today, avoidJoke, attempt) {
  let s =
    "Today is " +
    today +
    " (America/Chicago). Reply with a json object with one key, history. " +
    "The value must be an object with a body string (1-3 short sentences). " +
    "Generate only this-day-in-history (scripture, almanac and joke are supplied elsewhere). " +
    "For history: Name the exact city/county and date. Prefer verifiable East Texas / Henderson County / rural Texas ONLY if sure. " +
    "Otherwise a well-known Texas fact for this calendar date with the real place named (TSHA-style). " +
    "NEVER invent Brownsboro/Chandler/Henderson County rail/fair/school milestones. " +
    "NEVER say 'the area', 'communities like ours', 'nearby towns', or 'this region' without naming the real place. " +
    "If uncertain, pick a broader true Texas heritage item — never fabricate. " +
    "BANNED for history: gender equality campaigns, Battle of the Sexes, activism, culture-war, partisan politics, invented fairs. " +
    "The history object must also include source: the publication or URL where the fact is documented (for example TSHA Handbook of Texas or TSHA Texas Day by Day). If you cannot name a real source, choose a different, well-documented fact. " +
    "The word json must appear because the response format is json.";
  if (avoidJoke) {
    s +=
      " Do NOT reuse or lightly rephrase this previous joke (write a different punchline): «" +
      avoidJoke.replace(/[«»]/g, "") +
      "».";
  }
  if (attempt > 1) {
    s += " Important: previous attempt reused a joke — invent a different clean East Texas neighbor joke.";
  }
  if (attempt >= 2) {
    s +=
      " HISTORY RETRY: Name the exact city/county; do not say the area or communities like ours. " +
      "Do not invent Brownsboro/Chandler/Henderson County milestones. Prefer a documented Texas fact for this date.";
  }
  return s;
}

function formatAiError(err) {
  const parts = [];
  if (err && err.message) parts.push(err.message);
  if (err && err.status) parts.push("status=" + err.status);
  try {
    if (err && err.error) parts.push(JSON.stringify(err.error));
  } catch (_) {}
  return parts.join(" | ") || String(err);
}

const JOKE_BANNED_RES = [
  /scarecrow/i,
  /outstanding in (his|her|their|the) field/i,
  /corn-?fused/i,
  /trampoline/i,
  /moo-?sical/i,
  /acorns in order/i,
  /squirrel say/i,
  /\bnuts\b/i,
  /where'?s my tract-?or/i, // James: lame tractor pun (2026-09-25)
  /cross(ed|es|ing)? the road/i,
  /afraid of (seven|7)/i,
  /parallel lines/i,
  /nacho cheese/i,
  /\b(butt|ass|hell|damn|crap|sexy|horny|naked|underwear)\b/i
];

/** null when clean + new; otherwise a short reason string. */
function jokeProblem(body, avoidList) {
  const b = String(body || "").trim();
  if (!b) return "empty joke";
  for (const re of JOKE_BANNED_RES) if (re.test(b)) return "banned/unclean pattern " + re;
  const n = jokeNorm(b);
  if ((avoidList || []).some((a) => jokeNorm(a) === n)) return "reused recent joke";
  return null;
}

function historyTopicProblem(body) {
  const b = String(body || "");
  if (
    /gender equality/i.test(b) ||
    /battle of the sexes/i.test(b) ||
    /\b(billie jean king|bobby riggs)\b/i.test(b) ||
    /\b(activis[mt]|culture.?war|feminist|lgbt|pride month)\b/i.test(b) ||
    /\b(democrat|republican|trump|biden|harris|obama)\b/i.test(b)
  ) {
    return "banned culture-war / politics topic";
  }
  if (/\b(brownsboro|chandler)\b/i.test(b) && /\b(fair|festival|opened its doors|showcase|livestock show)\b/i.test(b)) {
    return "invented local fair/festival";
  }
  if (historyIsVagueOrInventedLocal(b)) return "vague or invented-local";
  const deny = denylistHit(b);
  if (deny) return "denylisted false claim: " + deny;
  return null;
}

function parseJsonLoose(raw) {
  try {
    return JSON.parse(raw);
  } catch (_) {
    const m = String(raw).match(/\{[\s\S]*\}/);
    if (!m) throw new Error("AI response was not json");
    return JSON.parse(m[0]);
  }
}

async function callModel(client, today, avoidJoke, attempt) {
  // Prefer plain completion + json instruction — gateway is flaky with response_format json_object.
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt(today, avoidJoke, attempt) }
    ],
    temperature: 0.95
  });
  const raw = completion.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty AI response");
  const parsed = parseJsonLoose(raw);
  const items = itemsFromAi(parsed);
  if (!items.length) throw new Error("AI json parsed but no usable items");
  const histSource = parsed && parsed.history && parsed.history.source ? String(parsed.history.source) : "";
  return { items, histSource };
}

async function retryJokeOnly(client, today, avoidList) {
  for (let i = 1; i <= 2; i++) {
    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content:
              "Today is " + today + ". Reply with a json object {\"joke\":{\"body\":\"...\"}} containing ONE new, short, G-rated East Texas farm, weather, or church-potluck joke (setup + punchline).  Prefer a genuinely funny, well-known clean joke (classic farm, livestock, weather, church, or neighbor humor) over a forced or made-up pun; if a pun does not clearly land, choose a different joke. " +
              "No scarecrows, no chickens crossing roads, no nuts, no innuendo. Do not reuse any of these: " +
              (avoidList || []).map((j) => "«" + String(j).replace(/[«»]/g, "") + "»").join(" ")
          }
        ],
        temperature: 1.0
      });
      const raw = completion.choices?.[0]?.message?.content;
      const parsed = parseJsonLoose(raw || "");
      const body = parsed && parsed.joke && parsed.joke.body ? String(parsed.joke.body).trim() : "";
      const why = jokeProblem(body, avoidList);
      if (!why) return body;
      console.warn("REJECTED JOKE (joke-only retry " + i + "):", JSON.stringify(body), "reason:", why);
    } catch (err) {
      console.warn("Joke-only retry", i, "soft-fail:", formatAiError(err));
    }
  }
  return null;
}

function seedFromKey(key) {
  return key.split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
}

/** Apply joke rules to an items[] list. Returns { items, path }. */
async function guardJoke(items, { client, today, avoidList, key }) {
  const idx = items.findIndex((i) => i.type === "joke");
  const current = idx >= 0 ? items[idx].body : "";
  const why = jokeProblem(current, avoidList);
  if (idx >= 0 && !why) return { items, path: "model" };
  if (idx >= 0) console.warn("REJECTED JOKE:", JSON.stringify(current), "reason:", why);
  let body = null;
  let path = "";
  if (client) {
    body = await retryJokeOnly(client, today, avoidList.concat(current ? [current] : []));
    if (body) path = "model-joke-retry";
  }
  if (!body) {
    body = pickFallbackJoke(avoidList.concat(current ? [current] : []), (j) => !jokeProblem(j, []), seedFromKey(key));
    path = body ? "vetted-fallback-list" : "dropped-no-clean-joke";
  }
  const out = items.filter((i) => i.type !== "joke");
  if (body) {
    const joke = { type: "joke", title: "Joke of the day", body, badge: "Essentials", source: path === "vetted-fallback-list" ? "curated" : "ai" };
    out.splice(idx >= 0 ? idx : Math.min(1, out.length), 0, joke);
  }
  return { items: out, path };
}

/** Apply history rules. Returns { items, path }. */
function guardHistory(items, { histSource, key }) {
  const curated = curatedFor(key);
  const idx = items.findIndex((i) => i.type === "history");
  const model = idx >= 0 ? items[idx] : null;
  const modelBody = model ? model.body : "";
  const problem = model ? historyTopicProblem(modelBody) : "no history from model";
  console.log("Model history candidate:", JSON.stringify(modelBody), "source:", JSON.stringify(histSource || "(none)"));

  if (model && !problem && curated && matchesCurated(modelBody, curated)) {
    const out = items.slice();
    out[idx] = { ...model, sourceUrl: curated.sourceUrl, sourceName: curated.sourceName };
    return { items: out, path: "model-matched-curated" };
  }
  if (curated) {
    if (model) {
      console.warn(
        "History not accepted (" + (problem || "does not match curated fact for " + key) + "); using curated entry",
        curated.sourceUrl
      );
    }
    const item = {
      type: "history",
      title: "This Day in History",
      body: curated.body,
      badge: "Essentials",
      source: "curated",
      sourceUrl: curated.sourceUrl,
      sourceName: curated.sourceName
    };
    const out = items.filter((i) => i.type !== "history");
    out.push(item);
    return { items: out, path: "curated-fallback" };
  }
  console.warn(
    "No curated VERIFIED_HISTORY entry for " + key + " — dropping unverifiable model history. EXTEND lib/essentials-guard.mjs."
  );
  return { items: items.filter((i) => i.type !== "history"), path: "dropped-no-curated-entry" };
}

async function generateAi(avoidJoke) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("AI soft-fail: OPENAI_API_KEY missing (AI Gateway not injected?)");
    return null;
  }
  console.log(
    "AI gateway base=",
    process.env.OPENAI_BASE_URL || "(default)",
    "avoidJoke=",
    avoidJoke ? "yes" : "no"
  );
  const client = new OpenAI();
  const today = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date());

  let lastErr = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await callModel(client, today, avoidJoke, attempt);
      return { ...r, client, today };
    } catch (err) {
      lastErr = err;
      console.warn("AI attempt", attempt, "soft-fail:", formatAiError(err));
    }
  }
  throw lastErr || new Error("AI failed");
}

export default async (req) => {
  let next_run = null;
  try {
    const body = await req.json();
    next_run = body && body.next_run;
  } catch (_) {}
  console.log("daily-essentials run; next_run=", next_run);

  const { key } = chicagoParts();
  const store = getStore("essentials");
  let prev = null;
  try {
    prev = await store.get("weekly", { type: "json" });
  } catch (_) {}
  let recentJokes = [];
  try {
    const r = await store.get("recent-jokes", { type: "json" });
    if (Array.isArray(r)) recentJokes = r.filter(Boolean).map(String);
  } catch (_) {}
  const avoidJoke = priorJokeBody(prev);
  const avoidList = Array.from(new Set([...recentJokes, ...(avoidJoke ? [avoidJoke] : [])]));

  let payload = fallbackPayload();
  let editionPath = "fallback-empty";
  let jokePath = "n/a";
  let historyPath = "n/a";
  let ai = null;
  try {
    ai = await generateAi(avoidJoke);
  } catch (err) {
    console.warn("AI soft-fail:", formatAiError(err));
  }

  // --- Curated scripture / almanac / joke (no AI). Re-runs on the same Chicago day are stable. ---
  const parts = chicagoParts();
  const prevIsToday =
    !!(prev && prev.generatedAt) && chicagoParts(new Date(prev.generatedAt)).key === key &&
    chicagoParts(new Date(prev.generatedAt)).y === parts.y;
  const prevBody = (type) => {
    const it = prev && Array.isArray(prev.items) ? prev.items.find((i) => i && i.type === type) : null;
    return it && it.body ? String(it.body) : "";
  };
  const curatedItems = [];
  try {
    const sc = pickScripture(parts, prevIsToday ? "" : prevBody("scripture"));
    if (sc) {
      curatedItems.push({ type: "scripture", title: "Scripture", body: scriptureBody(sc), badge: "Essentials", source: "curated" });
    }
  } catch (err) {
    console.warn("Curated scripture soft-fail:", formatAiError(err));
  }
  try {
    const al = pickAlmanac(parts, prevIsToday ? "" : prevBody("almanac"));
    if (al) {
      curatedItems.push({ type: "almanac", title: "Farmer's Almanac tip", body: al.body, badge: "Essentials", source: "curated" });
    }
  } catch (err) {
    console.warn("Curated almanac soft-fail:", formatAiError(err));
  }
  try {
    // Same-day re-run: keep today's already-chosen curated joke instead of burning another one.
    const todays = prevIsToday ? priorJokeBody(prev) : "";
    let jk = null;
    if (todays && JOKES.some((j) => jokeNorm(j) === jokeNorm(todays)) && !jokeProblem(todays, [])) jk = todays;
    if (!jk) jk = pickJoke(avoidList, (j) => !jokeProblem(j, []));
    if (jk) {
      curatedItems.push({ type: "joke", title: "Joke of the day", body: jk, badge: "Essentials", source: "curated" });
      jokePath = "curated-list";
    }
  } catch (err) {
    console.warn("Curated joke soft-fail:", formatAiError(err));
  }

  {
    // AI supplies history only. AI scripture/almanac/joke are used only if a curated pick is missing.
    const aiItems = ai && ai.items ? ai.items : [];
    let items = curatedItems.slice();
    for (const type of ["scripture", "almanac", "joke"]) {
      if (!items.some((i) => i.type === type)) {
        const a = aiItems.find((i) => i.type === type);
        if (a) items.push(a);
      }
    }
    const aiHistory = aiItems.find((i) => i.type === "history");
    if (aiHistory) items.push(aiHistory);

    if (!items.some((i) => i.type === "joke")) {
      // Last resort: existing guard path (AI retry -> vetted fallback list)
      const j = await guardJoke(items, { client: ai ? ai.client : null, today: ai ? ai.today : "", avoidList, key });
      items = j.items;
      jokePath = j.path;
    }
    const h = guardHistory(items, { histSource: ai ? ai.histSource : "", key });
    items = h.items;
    historyPath = h.path;
    if (items.length) {
      payload = {
        generatedAt: new Date().toISOString(),
        timezone: "America/Chicago",
        source: ai ? "ai" : "curated",
        items
      };
      editionPath = ai ? "curated+ai-history" : "curated-no-ai";
    } else if (prev && Array.isArray(prev.items) && prev.items.length) {
      console.warn("Nothing usable produced; keeping prior essentials");
      payload = { ...prev, refreshedAt: new Date().toISOString() };
      editionPath = "prior-kept";
    }
  }

  // Final safety net: drop history that still looks vague/invented-local or denylisted
  if (payload && Array.isArray(payload.items)) {
    const hist = payload.items.find((i) => i && i.type === "history");
    if (hist && hist.source !== "curated" && historyTopicProblem(hist.body)) {
      console.warn("Stripping bad history before blob write");
      payload = { ...payload, items: payload.items.filter((i) => !(i && i.type === "history")) };
      historyPath += "+stripped";
    }
  }

  if (payload && Array.isArray(payload.items)) {
    const ORDER = ["scripture", "almanac", "history", "joke"];
    const rank = (t) => (ORDER.indexOf(t) < 0 ? ORDER.length : ORDER.indexOf(t));
    payload = { ...payload, items: payload.items.slice().sort((a, b) => rank(a.type) - rank(b.type)) };
  }

  console.log("ESSENTIALS PATH date=" + key, "edition=" + editionPath, "joke=" + jokePath, "history=" + historyPath);

  try {
    await store.setJSON("weekly", payload);
    const joke = (payload.items || []).find((i) => i.type === "joke");
    if (joke && joke.body) {
      const next = [joke.body, ...recentJokes.filter((x) => jokeNorm(x) !== jokeNorm(joke.body))].slice(0, Math.max(200, JOKES.length + 20));
      await store.setJSON("recent-jokes", next);
    }
    console.log(
      "Stored essentials blob; source=",
      payload.source,
      "items=",
      (payload.items && payload.items.length) || 0,
      "joke=",
      joke ? joke.body.slice(0, 80) : "(none)"
    );
  } catch (err) {
    console.warn("Blob write soft-fail:", err && err.message ? err.message : err);
  }

  return new Response(
    JSON.stringify({
      ok: true,
      source: payload.source,
      items: (payload.items && payload.items.length) || 0,
      paths: { edition: editionPath, joke: jokePath, history: historyPath }
    }),
    { headers: { "content-type": "application/json" } }
  );
};

export const config = {
  schedule: "0 10 * * *"
};

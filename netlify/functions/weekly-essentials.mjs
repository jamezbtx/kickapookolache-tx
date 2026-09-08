/**
 * Scheduled weekly essentials (Mondays ~6am America/Chicago).
 * Cron UTC: 0 11 * * 1 ≈ 6:00am CDT / 5:00am CST (also set in netlify.toml).
 *
 * Netlify AI Gateway + OpenAI SDK gpt-4o-mini when available.
 * Soft-fails to empty items (no EXAMPLE cards). Stores JSON in Blobs store "essentials" key "weekly"
 * (items[] shape matching public/data/essentials.json / essentials.js).
 *
 * Blockers: AI Gateway needs a production enable once; scheduled functions
 * auto-run only on published production deploys (draft: Netlify UI "Run now").
 */
import OpenAI from "openai";
import { getStore } from "@netlify/blobs";

const SYSTEM_PROMPT =
  "You write weekly essentials for Kickapoo Kolache, a warm local digital newspaper for Brownsboro and Chandler, Texas (East Texas, ZIPs 75756 / 75758). Tone: neighbors-first, heritage, kitchen-table friendly. NO fake crime or breaking news. Jokes must be clean. Scripture: short Protestant-friendly verse + reference. History: prefer verifiable well-known Texas / East Texas history; do NOT invent Brownsboro/Chandler incidents — if unsure, frame as broader East Texas / Texas heritage and keep it modest. Return ONLY valid JSON with keys almanac, joke, scripture, history. Each value is an object with body (string); scripture may also include reference (string). Keep each body to 1-3 short sentences.";

const FALLBACK_ITEMS = [];

function fallbackPayload() {
  return {
    generatedAt: new Date().toISOString(),
    timezone: "America/Chicago",
    source: "fallback",
    items: FALLBACK_ITEMS
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
  return order.map((type) => {
    const chunk = (parsed && parsed[type]) || {};
    let body = chunk.body || "";
    if (type === "scripture" && chunk.reference) {
      body = body ? body + " — " + chunk.reference : chunk.reference;
    }
    return {
      type,
      title: chunk.title || titles[type],
      body,
      badge: "Essentials",
      source: "ai"
    };
  });
}

async function generateAi() {
  if (!process.env.OPENAI_API_KEY) return null;
  const client = new OpenAI();
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
          " (America/Chicago). Generate today's almanac tip, clean joke, short scripture+ref, and this-day-in-history for Brownsboro-Chandler / East Texas."
      }
    ],
    temperature: 0.7
  });
  const raw = completion.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty AI response");
  const parsed = JSON.parse(raw);
  return {
    generatedAt: new Date().toISOString(),
    timezone: "America/Chicago",
    source: "ai",
    items: itemsFromAi(parsed)
  };
}

export default async (req) => {
  let next_run = null;
  try {
    const body = await req.json();
    next_run = body && body.next_run;
  } catch (_) {}
  console.log("weekly-essentials run; next_run=", next_run);

  let payload = fallbackPayload();
  try {
    const ai = await generateAi();
    if (ai && ai.items && ai.items.length) payload = ai;
  } catch (err) {
    console.warn("AI soft-fail:", err && err.message ? err.message : err);
  }

  try {
    const store = getStore("essentials");
    await store.setJSON("weekly", payload);
    console.log("Stored essentials blob; source=", payload.source);
  } catch (err) {
    console.warn("Blob write soft-fail:", err && err.message ? err.message : err);
  }

  return new Response(JSON.stringify({ ok: true, source: payload.source }), {
    headers: { "content-type": "application/json" }
  });
};

export const config = {
  schedule: "0 11 * * 1"
};

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
  "You write daily essentials for Kickapoo Kolache, a warm local digital newspaper for Brownsboro and Chandler, Texas (East Texas, ZIPs 75756 / 75758). Tone: neighbors-first, heritage, kitchen-table friendly. NO fake crime or breaking news. Jokes must be clean. Scripture: short Protestant-friendly verse + reference. History: prefer verifiable well-known Texas / East Texas history; do NOT invent Brownsboro/Chandler incidents — if unsure, frame as broader East Texas / Texas heritage and keep it modest. Return ONLY valid JSON with keys almanac, joke, scripture, history. Each value is an object with body (string); scripture may also include reference (string). Keep each body to 1-3 short sentences.";

function emptyPayload() {
  return {
    generatedAt: new Date().toISOString(),
    timezone: "America/Chicago",
    source: "empty",
    items: [],
    note: "Awaiting daily essentials — no invented EXAMPLE bodies."
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
    console.warn("No OPENAI_API_KEY — writing empty essentials");
    return null;
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
          " (America/Chicago). Generate today's almanac tip, clean joke, short scripture+ref, and this-day-in-history for Brownsboro-Chandler / East Texas."
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

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let payload = emptyPayload();
  try {
    const ai = await tryAi();
    if (ai && ai.items && ai.items.length) payload = ai;
  } catch (err) {
    console.warn(
      "AI essentials soft-fail:",
      err && err.message ? err.message : err
    );
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

"use strict";

/**
 * Build-time essentials snapshot → public/data/essentials.json
 *
 * Today: writes local-heritage EXAMPLE / fallback cards for Brownsboro–Chandler.
 * Future: a scheduled routine can regenerate this file daily via AI
 * (set source: "ai") without changing the homepage loader shape.
 * Do not wire a Grok Bot routine here — scaffold only.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "data");
const OUT_FILE = path.join(OUT_DIR, "essentials.json");

const FALLBACK_ITEMS = [
  {
    type: "almanac",
    title: "Farmer's Almanac tip",
    body:
      "EXAMPLE only — not a live almanac feed. After Labor Day, Brownsboro–Chandler gardens can still use a little shade cloth; plant cool-weather greens once the afternoon heat finally breaks.",
    badge: "EXAMPLE"
  },
  {
    type: "joke",
    title: "Joke of the day",
    body:
      "EXAMPLE only — not a live joke feed. Why did the kolache refuse to leave Chandler? It was already in a jam — and the coffee on Main Street was still hot.",
    badge: "EXAMPLE"
  },
  {
    type: "scripture",
    title: "Scripture",
    body:
      "EXAMPLE only — not a live lectionary. “Love your neighbor as yourself.” A short weekday verse for Brownsboro–Chandler kitchen tables; live rotation comes later.",
    badge: "EXAMPLE"
  },
  {
    type: "history",
    title: "This Day in History",
    body:
      "EXAMPLE only — not a live history feed. On this day in East Texas lore: neighbors in Brownsboro and Chandler swapped harvest news over fence lines long before the FM roads were paved. Local heritage placeholder.",
    badge: "EXAMPLE"
  }
];

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    source: "fallback",
    items: FALLBACK_ITEMS
  };
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(
    "Wrote",
    path.relative(ROOT, OUT_FILE),
    "(" + payload.items.length + " items, source=" + payload.source + ")"
  );
}

try {
  main();
} catch (err) {
  console.error("fetch-essentials.js failed:", err && err.message ? err.message : err);
  process.exit(1);
}

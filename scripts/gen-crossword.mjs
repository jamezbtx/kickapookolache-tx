#!/usr/bin/env node
/**
 * Country Living Crossword generator (offline authoring + queue builder).
 *   node scripts/gen-crossword.mjs 2026-10-12 [weeks=1]
 * Fills the standard 13x13 template for each Monday. Fill words come from the clued bank
 * (netlify/functions/lib/crossword-bank.mjs) plus data/crossword-clues-extra.json; if the bank
 * can't fill a grid, it falls back to scripts/crossword-fill-words.txt and prints the words that
 * still need a clue. Add those to data/crossword-clues-extra.json and re-run. Output goes to
 * data/crosswords/YYYY-MM-DD.json (the weekly queue the Monday function publishes).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateCrossword, mondayOf } from "../netlify/functions/lib/crossword-gen.mjs";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const clueFile = path.join(root, "data", "crossword-clues-extra.json");
const clues = fs.existsSync(clueFile) ? JSON.parse(fs.readFileSync(clueFile, "utf8")) : {};
const extra = fs.readFileSync(path.join(root, "scripts", "crossword-fill-words.txt"), "utf8").split(/\s+/).filter(Boolean).map((w) => w.toUpperCase());
const start = mondayOf(new Date((process.argv[2] || new Date().toISOString().slice(0, 10)) + "T17:00:00Z"));
const weeks = +(process.argv[3] || 1);
fs.mkdirSync(path.join(root, "data", "crosswords"), { recursive: true });
const need = new Set();
for (let i = 0; i < weeks; i++) {
  const d = new Date(start + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + 7 * i);
  const day = d.toISOString().slice(0, 10);
  const out = path.join(root, "data", "crosswords", day + ".json");
  // only use words with clues if possible; otherwise allow fallback words
  let p = generateCrossword(day, { extra: Object.keys(clues), clues });
  if (!p && process.env.ALLOW_UNCLUED) p = generateCrossword(day, { extra, clues });
  if (!p) { console.error(day, "generation failed"); continue; }
  const missing = [...p.across, ...p.down].filter((e) => !e.clue).map((e) => e.answer);
  missing.forEach((w) => need.add(w));
  fs.writeFileSync(out, JSON.stringify(p, null, 2) + "\n");
  console.log(day, p.themeEntries.join(" + "), missing.length ? "NEEDS CLUES: " + missing.join(" ") : "OK");
}
if (need.size) console.log("\nAdd clues for:", [...need].sort().join(" "));

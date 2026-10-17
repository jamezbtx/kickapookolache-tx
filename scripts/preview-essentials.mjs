// Offline preview of curated essentials (no network, no AI).
// Usage: node scripts/preview-essentials.mjs [days=14] [startYYYY-MM-DD=2026-09-30]
import { SCRIPTURES, ALMANAC_TIPS, JOKES, pickScripture, pickAlmanac, pickJoke, scriptureBody } from "../netlify/functions/lib/essentials-content.mjs";

// Same patterns as JOKE_BANNED_RES in netlify/functions/daily-essentials.mjs (kept in sync by the check below).
import { readFileSync } from "node:fs";
const src = readFileSync(new URL("../netlify/functions/daily-essentials.mjs", import.meta.url), "utf8");
const block = src.slice(src.indexOf("const JOKE_BANNED_RES = ["), src.indexOf("];", src.indexOf("const JOKE_BANNED_RES = [")) + 2);
const BANNED = new Function(block.replace("const JOKE_BANNED_RES =", "return") )();
const clean = (j) => !BANNED.some((re) => re.test(j));

const days = Number(process.argv[2] || 14);
const [Y, M, D] = (process.argv[3] || "2026-09-30").split("-").map(Number);

console.log(`Counts: scriptures=${SCRIPTURES.length} almanac=${ALMANAC_TIPS.length} jokes=${JOKES.length}`);
const rejects = JOKES.filter((j) => !clean(j));
console.log(`Joke banned-pattern rejects: ${rejects.length}`);
rejects.forEach((j) => console.log("  REJECT:", j));
console.log("Dup scripture refs:", SCRIPTURES.length - new Set(SCRIPTURES.map((s) => s.ref)).size);
console.log("Dup jokes:", JOKES.length - new Set(JOKES).size);
console.log("Months with <8 tips:", [1,2,3,4,5,6,7,8,9,10,11,12].filter((m) => ALMANAC_TIPS.filter((t) => t.months.includes(m)).length < 8));
console.log("");

let recent = [];
let prevSc = "", prevAl = "";
const seen = { sc: new Set(), al: new Set(), jk: new Set() };
for (let i = 0; i < days; i++) {
  const dt = new Date(Date.UTC(Y, M - 1, D + i));
  const parts = { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
  const label = `${parts.y}-${String(parts.m).padStart(2, "0")}-${String(parts.d).padStart(2, "0")}`;
  const sc = pickScripture(parts, prevSc);
  const al = pickAlmanac(parts, prevAl);
  const jk = pickJoke(recent, clean);
  recent = [jk, ...recent].slice(0, 200);
  prevSc = scriptureBody(sc); prevAl = al.body;
  const dup = [seen.sc.has(sc.ref) && "SCRIPTURE-REPEAT", seen.al.has(al.body) && "ALMANAC-REPEAT", seen.jk.has(jk) && "JOKE-REPEAT"].filter(Boolean);
  seen.sc.add(sc.ref); seen.al.add(al.body); seen.jk.add(jk);
  console.log(`=== ${label} ${dup.join(" ")}`);
  console.log(`  Scripture: ${scriptureBody(sc)}`);
  console.log(`  Almanac:   ${al.body}`);
  console.log(`  Joke:      ${jk}`);
}
console.log(`\nUnique over ${days} days: scriptures=${seen.sc.size} almanac=${seen.al.size} jokes=${seen.jk.size}`);

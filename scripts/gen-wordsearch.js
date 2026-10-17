#!/usr/bin/env node
/**
 * Country Living Word Search generator (deterministic, seeded).
 *
 * Usage:
 *   node scripts/gen-wordsearch.js                       # data/wordsearch-input.json -> src/data/wordsearch.json
 *   node scripts/gen-wordsearch.js --in other.json --out src/data/wordsearch.json
 *   node scripts/gen-wordsearch.js --seed 123            # override seed from the input file
 *   node scripts/gen-wordsearch.js --no-backward         # force forward-only words
 *   node scripts/gen-wordsearch.js --check [file]        # only verify an existing puzzle file
 *
 * Input JSON: { id, title, weekLabel, theme, size, allowBackward, seed, words: [...] }
 * Same input + same seed always produces the same grid.
 *
 * Verified on every run (exit 1 on failure):
 *  - every listed word is present exactly once in the grid (all 8 directions, forward or reversed),
 *    at the position recorded in the output
 *  - no listed word appears a second time by accident (including inside filler or as another word's reverse)
 *  - no banned/unsuitable word appears anywhere in the grid (any direction)
 *  - at least 2 horizontal, 2 vertical and 2 diagonal words; backward words capped at ~1/3 of the list
 */
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
const flag = (name) => args.includes(name);

// Words that must never appear by accident in the filler (G-rated / church-bulletin clean).
const BANNED = ["ASS", "SEX", "SEXY", "HELL", "DAMN", "CRAP", "PISS", "SHIT", "FUCK", "BITCH", "BUTT", "TIT", "TITS", "BOOB", "NUDE", "NAKED", "RAPE", "KILL", "DEAD", "DIE", "GUN", "DRUG", "BEER", "WINE", "BRA", "PEE", "POO", "FART", "SLUT", "WHORE", "HATE", "DICK", "COCK", "PORN", "GOD", "SIN", "LUST", "KKK", "NAZI"];

// 8 directions as [dRow, dCol]. "Forward" reads left-to-right / top-to-bottom; "backward" is the reverse.
const FORWARD = [[0, 1], [1, 0], [1, 1], [-1, 1]];
const BACKWARD = [[0, -1], [-1, 0], [-1, -1], [1, -1]];
const kindOf = ([dr, dc]) => (dr === 0 ? "horizontal" : dc === 0 ? "vertical" : "diagonal");

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ALL_DIRS = [...FORWARD, ...BACKWARD];
function* linesThrough(grid) {
  const N = grid.length;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) for (const d of ALL_DIRS) yield [r, c, d];
}
function readAt(grid, r, c, d, len) {
  const N = grid.length; let s = "";
  for (let i = 0; i < len; i++) {
    const rr = r + d[0] * i, cc = c + d[1] * i;
    if (rr < 0 || cc < 0 || rr >= N || cc >= N) return null;
    s += grid[rr][cc];
  }
  return s;
}
function findAll(grid, word) {
  const hits = [];
  for (const [r, c, d] of linesThrough(grid)) if (readAt(grid, r, c, d, word.length) === word) hits.push({ row: r, col: c, dir: d });
  return hits;
}

function verify(puzzle) {
  const errs = [];
  const g = puzzle.grid, N = puzzle.size;
  if (g.length !== N || g.some((row) => row.length !== N || !/^[A-Z]+$/.test(row))) errs.push("grid is not an N x N block of A-Z");
  const seen = new Set();
  const kinds = { horizontal: 0, vertical: 0, diagonal: 0 };
  let backward = 0;
  for (const w of puzzle.words) {
    if (!/^[A-Z]{3,}$/.test(w.word)) errs.push(`${w.word}: must be A-Z, 3+ letters`);
    if (seen.has(w.word)) errs.push(`${w.word}: listed twice`);
    seen.add(w.word);
    const at = readAt(g, w.row, w.col, w.dir, w.word.length);
    if (at !== w.word) errs.push(`${w.word}: not at recorded position (grid reads ${at})`);
    const hits = findAll(g, w.word);
    if (hits.length !== 1) errs.push(`${w.word}: appears ${hits.length} times in the grid (must be exactly 1)`);
    // findAll scans all 8 directions, so a reversed/duplicate copy anywhere counts as a second hit above
    kinds[kindOf(w.dir)]++;
    if (BACKWARD.some((b) => b[0] === w.dir[0] && b[1] === w.dir[1])) backward++;
    if (!puzzle.allowBackward && backward) errs.push(`${w.word}: backward placement but allowBackward is false`);
  }
  // substring collisions between listed words (e.g. a word hidden inside another word's cells is fine only if exactly 1 hit)
  for (const b of BANNED) for (const [r, c, d] of linesThrough(g)) {
    if (readAt(g, r, c, d, b.length) === b && !puzzle.words.some((w) => w.word.includes(b))) errs.push(`unsuitable word ${b} appears in grid at (${r},${c})`);
  }
  if (puzzle.words.length < 12 || puzzle.words.length > 16) errs.push(`word count ${puzzle.words.length} outside 12-16`);
  for (const k of Object.keys(kinds)) if (kinds[k] < 2) errs.push(`only ${kinds[k]} ${k} words (need at least 2)`);
  if (backward > Math.ceil(puzzle.words.length / 3)) errs.push(`${backward} backward words is more than a third of the list`);
  return { errs, kinds, backward };
}

function generate(input, seed, allowBackward) {
  const N = input.size;
  const words = input.words.map((w) => w.toUpperCase().replace(/[^A-Z]/g, ""));
  if (new Set(words).size !== words.length) throw new Error("duplicate words in input");
  const longest = Math.max(...words.map((w) => w.length));
  if (longest > N) throw new Error(`word longer than grid: ${longest} > ${N}`);
  const rnd = mulberry32(seed);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const maxBack = allowBackward ? Math.floor(words.length / 3) : 0;
  const order = words.map((w, i) => i).sort((a, b) => words[b].length - words[a].length); // long words first

  for (let attempt = 0; attempt < 500; attempt++) {
    const grid = Array.from({ length: N }, () => Array(N).fill(""));
    const placed = [];
    let back = 0, ok = true, placedCount = 0;
    for (const idx of order) {
      const word = words[idx];
      let done = false;
      for (let tries = 0; tries < 400 && !done; tries++) {
        const useBack = allowBackward && back < maxBack && rnd() < 0.3;
        // rotate horizontal / vertical / diagonal so the mix stays balanced
        const want = ["horizontal", "vertical", "diagonal"][placedCount % 3];
        const dir = pick((useBack ? BACKWARD : FORWARD).filter((d) => kindOf(d) === want));
        const r = Math.floor(rnd() * N), c = Math.floor(rnd() * N);
        const er = r + dir[0] * (word.length - 1), ec = c + dir[1] * (word.length - 1);
        if (er < 0 || ec < 0 || er >= N || ec >= N) continue;
        let fits = true, overlap = 0;
        for (let i = 0; i < word.length; i++) {
          const ch = grid[r + dir[0] * i][c + dir[1] * i];
          if (ch && ch !== word[i]) { fits = false; break; }
          if (ch) overlap++;
        }
        if (!fits || overlap === word.length) continue;
        for (let i = 0; i < word.length; i++) grid[r + dir[0] * i][c + dir[1] * i] = word[i];
        if (useBack) back++;
        placed[idx] = { word, row: r, col: c, dir };
        placedCount++;
        done = true;
      }
      if (!done) { ok = false; break; }
    }
    if (!ok) continue;
    // filler: half from the word letters (harder), half uniform
    const pool = words.join("");
    const fixed = grid.map((row) => row.map((ch) => !!ch));
    const fillCell = (r, c) => { grid[r][c] = rnd() < 0.5 ? pick(pool.split("")) : String.fromCharCode(65 + Math.floor(rnd() * 26)); };
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!fixed[r][c]) fillCell(r, c);
    // re-roll filler cells that accidentally spell an unsuitable word or a second copy of a listed word
    for (let pass = 0; pass < 200; pass++) {
      let bad = false;
      const rows = grid.map((row) => row.join(""));
      const targets = [...BANNED.filter((b) => !words.some((w) => w.includes(b))), ...words];
      for (const t of targets) for (const [r, c, d] of linesThrough(rows)) {
        if (readAt(rows, r, c, d, t.length) !== t) continue;
        const cells = Array.from({ length: t.length }, (_, i) => [r + d[0] * i, c + d[1] * i]);
        const isPlaced = words.includes(t) && placed.some((p) => p && p.word === t && p.row === r && p.col === c && p.dir === d);
        const isPlacedRev = false;
        if (isPlaced || isPlacedRev) continue;
        const free = cells.filter(([rr, cc]) => !fixed[rr][cc]);
        if (free.length) { const [rr, cc] = pick(free); fillCell(rr, cc); bad = true; }
      }
      if (!bad) break;
    }
    const puzzle = {
      id: input.id, title: input.title, weekLabel: input.weekLabel, theme: input.theme, author: "Kickapoo Kolache",
      size: N, allowBackward, seed,
      grid: grid.map((row) => row.join("")),
      words: placed
    };
    const vr = verify(puzzle);
    if (process.env.WS_DEBUG && attempt < 5) console.error(attempt, vr.errs.join(" | "));
    if (vr.errs.length === 0) return { puzzle, attempt };
  }
  throw new Error("could not build a valid grid in 500 attempts; try another seed or fewer/shorter words");
}

if (flag("--check")) {
  const file = args[args.indexOf("--check") + 1] && !args[args.indexOf("--check") + 1].startsWith("--") ? args[args.indexOf("--check") + 1] : path.join(root, "src", "data", "wordsearch.json");
  const p = JSON.parse(fs.readFileSync(file, "utf8"));
  const { errs, kinds, backward } = verify(p);
  console.log(`File: ${path.resolve(file)}\nGrid ${p.size}x${p.size}, ${p.words.length} words (${kinds.horizontal} horizontal, ${kinds.vertical} vertical, ${kinds.diagonal} diagonal; ${backward} backward)`);
  if (errs.length) { errs.forEach((e) => console.log("FAIL:", e)); console.log("RESULT: FAIL"); process.exit(1); }
  console.log("Checks: every word present exactly once at its recorded spot · no duplicate/reversed copies · no unsuitable accidental words · direction mix OK\nRESULT: PASS");
  process.exit(0);
}

const inFile = opt("--in", path.join(root, "data", "wordsearch-input.json"));
const outFile = opt("--out", path.join(root, "src", "data", "wordsearch.json"));
const input = JSON.parse(fs.readFileSync(inFile, "utf8"));
const seed = Number(opt("--seed", input.seed ?? 1));
const allowBackward = flag("--no-backward") ? false : input.allowBackward !== false;
const { puzzle, attempt } = generate(input, seed, allowBackward);
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(puzzle, null, 2) + "\n");
const v = verify(puzzle);
console.log(`Wrote ${path.relative(root, outFile)} (seed ${seed}, attempt ${attempt + 1})`);
console.log(puzzle.grid.join("\n"));
console.log(`${puzzle.words.length} words: ${v.kinds.horizontal} horizontal, ${v.kinds.vertical} vertical, ${v.kinds.diagonal} diagonal; ${v.backward} backward`);
console.log("RESULT: PASS (all words present exactly once, no unsuitable accidental words)");

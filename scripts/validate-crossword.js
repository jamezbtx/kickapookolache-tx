#!/usr/bin/env node
/**
 * Validate a Country Living Crossword JSON file against its clue list.
 * Usage: node scripts/validate-crossword.js [path/to/crossword.json] [--words wordlist.txt]
 * Exits 1 on any error. Checks:
 *  - square grid, rows of equal length, only A–Z or "." (block)
 *  - 180° rotational symmetry of black squares
 *  - all white squares connected; no 1- or 2-letter entries (every white square is in an
 *    across AND a down entry of 3+ letters)
 *  - numbering recomputed from the grid matches puzzle.numbers
 *  - every across/down run in the grid has exactly one clue with matching num/row/col,
 *    and the clue's answer equals the letters in the grid (so every crossing agrees)
 *  - no extra clues, no duplicate answers, no empty clues, clue text never contains its answer
 *  - optional: every answer appears in a word list (theme entries listed in puzzle.themeEntries skip this)
 */
"use strict";
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
let file = path.join(__dirname, "..", "data", "crossword.json");
let wordsFile = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--words") wordsFile = args[++i];
  else file = args[i];
}
const p = JSON.parse(fs.readFileSync(file, "utf8"));
const errors = [];
const warns = [];
const err = (m) => errors.push(m);

const grid = p.grid;
const N = grid.length;
if (p.size !== N) err(`size ${p.size} != grid rows ${N}`);
grid.forEach((row, r) => {
  if (row.length !== N) err(`row ${r} length ${row.length} != ${N}`);
  if (!/^[A-Z.]+$/.test(row)) err(`row ${r} has characters other than A-Z or "."`);
});
const isW = (r, c) => r >= 0 && c >= 0 && r < N && c < N && grid[r][c] !== ".";

// symmetry
for (let r = 0; r < N; r++)
  for (let c = 0; c < N; c++)
    if (isW(r, c) !== isW(N - 1 - r, N - 1 - c)) err(`asymmetric block at (${r},${c})`);

// connectivity
const whites = [];
for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (isW(r, c)) whites.push([r, c]);
const seen = new Set([whites[0].join(",")]);
const stack = [whites[0]];
while (stack.length) {
  const [r, c] = stack.pop();
  for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const k = `${r + dr},${c + dc}`;
    if (isW(r + dr, c + dc) && !seen.has(k)) { seen.add(k); stack.push([r + dr, c + dc]); }
  }
}
if (seen.size !== whites.length) err(`grid not connected (${seen.size}/${whites.length} white squares reachable)`);

// recompute runs + numbering
const runs = { across: [], down: [] };
const numbers = [];
let n = 0;
for (let r = 0; r < N; r++) {
  numbers.push([]);
  for (let c = 0; c < N; c++) {
    let num = 0;
    if (isW(r, c)) {
      const sa = !isW(r, c - 1) && isW(r, c + 1);
      const sd = !isW(r - 1, c) && isW(r + 1, c);
      if (sa || sd) num = ++n;
      if (sa) { let e = c; while (isW(r, e)) e++; runs.across.push({ num, row: r, col: c, answer: grid[r].slice(c, e) }); }
      if (sd) { let e = r; let s = ""; while (isW(e, c)) s += grid[e++][c]; runs.down.push({ num, row: r, col: c, answer: s }); }
    }
    numbers[r].push(num);
  }
}
// every white square checked both ways with 3+ letters
for (const [r, c] of whites) {
  const aLen = (() => { let s = c; while (isW(r, s - 1)) s--; let e = c; while (isW(r, e + 1)) e++; return e - s + 1; })();
  const dLen = (() => { let s = r; while (isW(s - 1, c)) s--; let e = r; while (isW(e + 1, c)) e++; return e - s + 1; })();
  if (aLen < 3) err(`square (${r},${c}) is in a ${aLen}-letter across run (min 3)`);
  if (dLen < 3) err(`square (${r},${c}) is in a ${dLen}-letter down run (min 3)`);
}
if (JSON.stringify(numbers) !== JSON.stringify(p.numbers)) err("puzzle.numbers does not match numbering recomputed from grid");

const answers = new Map();
for (const dir of ["across", "down"]) {
  const clues = p[dir] || [];
  const byNum = new Map();
  for (const cl of clues) {
    if (byNum.has(cl.num)) err(`${dir} ${cl.num}: duplicate clue`);
    byNum.set(cl.num, cl);
    if (!cl.clue || !String(cl.clue).trim()) err(`${dir} ${cl.num}: empty clue`);
    if (cl.clue && cl.answer && new RegExp(`\\b${cl.answer}\\b`, "i").test(cl.clue)) err(`${dir} ${cl.num}: clue contains its answer`);
  }
  for (const run of runs[dir]) {
    const cl = byNum.get(run.num);
    if (!cl) { err(`${dir} ${run.num} (${run.answer}) has no clue`); continue; }
    if (cl.row !== run.row || cl.col !== run.col) err(`${dir} ${run.num}: clue at (${cl.row},${cl.col}) but grid entry starts at (${run.row},${run.col})`);
    if (cl.answer !== run.answer) err(`${dir} ${run.num}: clue answer ${cl.answer} != grid letters ${run.answer}`);
    byNum.delete(run.num);
    if (answers.has(run.answer)) err(`duplicate answer ${run.answer} (${answers.get(run.answer)} and ${dir} ${run.num})`);
    answers.set(run.answer, `${dir} ${run.num}`);
  }
  for (const [num, cl] of byNum) err(`${dir} ${num} (${cl.answer}) is not an entry in the grid`);
}

// same-root duplicates (e.g. EWE + EWES) and a small never-allowed list
const BANNED = ["SEX", "SEXY", "BEER", "WINE", "BOOZE", "DAMN", "HELL", "KILL", "DRUG", "DRUGS", "NUDE", "NAKED", "BRA", "STD", "PMS", "LUST", "BUTT"];
for (const a of answers.keys()) {
  if (BANNED.includes(a)) err(`${answers.get(a)} ${a} is on the never-allowed list`);
  for (const b of answers.keys()) if (a !== b && (b === a + "S" || b === a + "ES" || b === a + "ED")) err(`same-root duplicate: ${a} / ${b}`);
}

if (wordsFile) {
  const words = new Set(fs.readFileSync(wordsFile, "utf8").split(/\s+/).filter(Boolean).map((w) => w.toUpperCase()));
  const theme = new Set((p.themeEntries || []).map((w) => w.toUpperCase()));
  for (const [a, where] of answers) if (!theme.has(a) && !words.has(a)) err(`${where} ${a} not found in word list`);
}

const total = runs.across.length + runs.down.length;
console.log(`File: ${path.resolve(file)}`);
console.log(`Grid ${N}x${N}, ${whites.length} white / ${N * N - whites.length} black squares, ${runs.across.length} across + ${runs.down.length} down = ${total} entries`);
warns.forEach((w) => console.log("WARN:", w));
if (errors.length) {
  errors.forEach((e) => console.log("FAIL:", e));
  console.log(`RESULT: FAIL (${errors.length} error${errors.length > 1 ? "s" : ""})`);
  process.exit(1);
}
console.log("Checks: symmetry OK · connected OK · min length 3 OK · numbering OK · every entry clued OK · crossings/answers match grid OK · no duplicates or same-root pairs OK · banned list OK" + (wordsFile ? " · word list OK" : ""));
console.log("RESULT: PASS");

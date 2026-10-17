// Weekly Country Living Crossword generator (deterministic per Monday date).
import { THEMES, WORDS, LONG } from "./crossword-bank.mjs";

const TEMPLATE = [
  "###..###..###", "###.####..###", "###.####.####", "#############",
  "...###.###...", "####..###.###", "####.###.####", "###.###..####",
  "...###.###...", "#############", "####.####.###", "###..####.###", "###..###..###"
];
const N = 13;
const CLUE = new Map([...WORDS, ...LONG]);
const BY_LEN = { 3: [], 4: [], 5: [], 7: [] };
for (const w of new Set([...WORDS, ...LONG].map((x) => x[0]))) BY_LEN[w.length].push(w);

function rng(seed) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1e9) / 1e9; };
}
const shuffle = (a, r) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** Monday (America/Chicago calendar) on or before the given date, as YYYY-MM-DD. */
export function mondayOf(d = new Date()) {
  const s = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(d);
  const t = new Date(s + "T12:00:00Z");
  t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 6) % 7));
  return t.toISOString().slice(0, 10);
}

function slots() {
  const W = (r, c) => r >= 0 && c >= 0 && r < N && c < N && TEMPLATE[r][c] !== ".";
  const out = []; const numbers = []; let n = 0;
  for (let r = 0; r < N; r++) { numbers.push([]); for (let c = 0; c < N; c++) {
    let num = 0;
    if (W(r, c)) {
      const sa = !W(r, c - 1) && W(r, c + 1), sd = !W(r - 1, c) && W(r + 1, c);
      if (sa || sd) num = ++n;
      if (sa) { const cells = []; for (let e = c; W(r, e); e++) cells.push([r, e]); out.push({ dir: "across", num, row: r, col: c, cells }); }
      if (sd) { const cells = []; for (let e = r; W(e, c); e++) cells.push([e, c]); out.push({ dir: "down", num, row: r, col: c, cells }); }
    }
    numbers[r].push(num);
  } }
  return { slots: out, numbers };
}

// extra: optional array of fill words with no bank clue (offline authoring only); bank words are tried first.
export function generateCrossword(monday = mondayOf(), { extra = [], clues = {}, deadlineMs = 0 } = {}) {
  const deadline = deadlineMs ? Date.now() + deadlineMs : Infinity;
  const CL = new Map([...CLUE, ...Object.entries(clues)]);
  const EX = { 3: [], 4: [], 5: [], 7: [] };
  for (const w of new Set(extra)) if (EX[w.length] && !CLUE.has(w)) EX[w.length].push(w);
  const r = rng("kk-crossword-" + monday);
  const weekIdx = Math.round((Date.parse(monday) - Date.parse("2026-10-12")) / 6048e5);
  const { slots: S, numbers } = slots();
  // a theme fits a row only if every down crossing has at least 2 bank words with that letter
  const feasible = (t, row) => S.filter((s) => s.dir === "down").every((s) => {
    const k = s.cells.findIndex(([y]) => y === row);
    return k < 0 || BY_LEN[s.cells.length].filter((w) => w[k] === t[s.col]).length >= 2;
  });
  const top = THEMES.filter(([t]) => feasible(t, 3)), bottom = THEMES.filter(([t]) => feasible(t, 9));
  // try theme pairs starting from this week's rotation
  for (let attempt = 0; attempt < 3000; attempt++) {
    const t1 = top[(((weekIdx + attempt) % top.length) + top.length) % top.length];
    const t2 = bottom[(((weekIdx * 3 + 1 + attempt * 7) % bottom.length) + bottom.length) % bottom.length];
    if (t1[0] === t2[0]) continue;
    if (Date.now() > deadline) return null;
    const g = TEMPLATE.map((row) => row.split("").map((ch) => (ch === "." ? "." : null)));
    t1[0].split("").forEach((ch, c) => (g[3][c] = ch));
    t2[0].split("").forEach((ch, c) => (g[9][c] = ch));
    const open = S.filter((s) => s.cells.length < 13);
    const used = new Set([t1[0], t2[0]]);
    const pools = {};
    for (const k of Object.keys(BY_LEN)) {
      const allW = [...new Set([...BY_LEN[k], ...EX[k]])];
      pools[k] = [...shuffle(allW.filter((w) => CL.has(w)), r), ...shuffle(allW.filter((w) => !CL.has(w)), r)];
    }
    const rootClash = (w) => [...used].some((u) => u === w + "S" || w === u + "S" || u === w + "ES" || w === u + "ES" || u === w + "ED" || w === u + "ED");
    const cache = new Map();
    const cands = (s) => {
      const pat = s.cells.map(([y, x]) => g[y][x] || "?").join("");
      let c = cache.get(pat);
      if (!c) { const re = new RegExp("^" + pat.replace(/\?/g, ".") + "$"); c = pools[pat.length].filter((w) => re.test(w)); cache.set(pat, c); }
      return c.filter((w) => !used.has(w));
    };
    let budget = 4000;
    const assign = new Map();
    const solve = () => {
      if (--budget < 0 || (budget % 256 === 0 && Date.now() > deadline)) return false;
      let best = null, bestC = null;
      for (const s of open) {
        if (assign.has(s)) continue;
        const c = cands(s);
        if (!best || c.length < bestC.length) { best = s; bestC = c; if (!c.length) return false; }
      }
      if (!best) return true;
      for (const w of bestC) {
        if (rootClash(w)) continue;
        const prev = best.cells.map(([y, x]) => g[y][x]);
        best.cells.forEach(([y, x], k) => (g[y][x] = w[k]));
        used.add(w); assign.set(best, w);
        if (solve()) return true;
        used.delete(w); assign.delete(best);
        best.cells.forEach(([y, x], k) => (g[y][x] = prev[k]));
      }
      return false;
    };
    if (!solve()) continue;
    const grid = g.map((row) => row.join(""));
    const clueFor = (s) => {
      const a = s.cells.map(([y, x]) => g[y][x]).join("");
      return { num: s.num, row: s.row, col: s.col, answer: a, clue: a === t1[0] ? t1[1] : a === t2[0] ? t2[1] : CL.get(a) || null };
    };
    const dt = new Date(monday + "T12:00:00Z");
    const label = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).replace(/^(\w{3}) /, (m, mo) => (mo === "May" ? "May " : mo + ". "));
    return {
      id: monday,
      title: "Country Living Crossword",
      weekLabel: "Week of " + label,
      theme: "Country living in East Texas",
      author: "Kickapoo Kolache",
      size: N,
      grid,
      numbers,
      across: S.filter((s) => s.dir === "across").map(clueFor),
      down: S.filter((s) => s.dir === "down").map(clueFor),
      themeEntries: [t1[0], t2[0]],
      generated: true
    };
  }
  return null;
}

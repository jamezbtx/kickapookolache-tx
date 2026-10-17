/**
 * Scheduled every Monday 5:00 AM Central (10:00 UTC; 11:00 UTC would be 5 AM in CST/winter — 
 * Netlify cron is UTC, so 11:00 UTC = 5 AM CST / 6 AM CDT).
 * Publishes this week's Country Living Crossword to Blobs. Source: the bundled queue for this
 * Monday; if the queue has no puzzle for this exact week, generate one live from the clued bank
 * (G-rated country-living words only); else keep the newest queued puzzle.
 */
import { getStore } from "@netlify/blobs";
import { currentPuzzle } from "./lib/crossword-queue.mjs";
import { generateCrossword, mondayOf } from "./lib/crossword-gen.mjs";

export default async () => {
  const monday = mondayOf();
  let p = currentPuzzle();
  if (!p || p.id !== monday) {
    const fresh = generateCrossword(monday, { deadlineMs: 20000 });
    if (fresh) p = fresh;
  }
  if (!p) return new Response("no puzzle", { status: 500 });
  await getStore("crossword").setJSON("weekly", p);
  await getStore("crossword").setJSON("week-" + p.id, p);
  console.log("crossword published", p.id, p.themeEntries);
  return new Response("ok " + p.id);
};

export const config = { schedule: "0 11 * * 1" };

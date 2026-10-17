/**
 * GET /api/crossword — this week's Country Living Crossword.
 * Order: Netlify Blobs (store "crossword", key "weekly", written Mondays by crossword-weekly)
 * -> bundled queue data/crosswords/<Monday>.json -> newest queued puzzle on/before this week
 * -> data/crossword.json. Never 404s while any bundled puzzle exists.
 */
import { getStore } from "@netlify/blobs";
import { currentPuzzle } from "./lib/crossword-queue.mjs";

const json = (data, status = 200, cache = "public, max-age=300") =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": cache } });

export default async () => {
  const fallback = currentPuzzle();
  try {
    const blob = await getStore("crossword").get("weekly", { type: "json" });
    if (blob && blob.grid && (!fallback || blob.id >= fallback.id)) return json(blob);
  } catch (err) {
    console.warn("crossword blobs soft-fail:", err && err.message ? err.message : err);
  }
  if (fallback) return json(fallback);
  return json({ error: "not_found" }, 404, "no-store");
};

export const config = { path: "/api/crossword" };

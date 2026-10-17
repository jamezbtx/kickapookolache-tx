/**
 * Scheduled daily feed refresh (~6:15am America/Chicago).
 * Cron UTC: 15 11 * * * (after Essentials at 0 11).
 * Runs collectFeeds() and stores JSON in Blobs store "feeds" key "latest".
 */
import { createRequire } from "module";
import { getStore } from "@netlify/blobs";

const require = createRequire(import.meta.url);
const { collectFeeds, emptyPayload } = require("./lib/collect-feeds.cjs");

export default async (req) => {
  let next_run = null;
  try {
    const body = await req.json();
    next_run = body && body.next_run;
  } catch (_) {}
  console.log("daily-feeds run; next_run=", next_run);

  let payload;
  try {
    payload = await collectFeeds();
    console.log(
      "collectFeeds ok; localBriefs=",
      payload && payload.localBriefs && payload.localBriefs.items
        ? payload.localBriefs.items.length
        : 0,
      "fetchedAt=",
      payload && payload.fetchedAt
    );
  } catch (err) {
    console.warn("collectFeeds soft-fail:", err && err.message ? err.message : err);
    payload = emptyPayload([
      String(err && err.message ? err.message : err)
    ]);
  }

  try {
    const store = getStore("feeds");
    // Don't overwrite a good blob with a totally empty localBriefs if this run failed hard
    if (
      (!payload.localBriefs || !payload.localBriefs.items || !payload.localBriefs.items.length) &&
      payload.errors &&
      payload.errors.length
    ) {
      try {
        const prev = await store.get("latest", { type: "json" });
        if (
          prev &&
          prev.localBriefs &&
          Array.isArray(prev.localBriefs.items) &&
          prev.localBriefs.items.length
        ) {
          console.warn("Keeping prior feeds blob; this run had empty localBriefs");
          payload = prev;
        }
      } catch (_) {}
    }
    await store.setJSON("latest", payload);
    console.log("Stored feeds blob; fetchedAt=", payload.fetchedAt);
  } catch (err) {
    console.warn("Blob write soft-fail:", err && err.message ? err.message : err);
  }

  return new Response(
    JSON.stringify({
      ok: true,
      fetchedAt: payload && payload.fetchedAt,
      localBriefs:
        payload && payload.localBriefs && payload.localBriefs.items
          ? payload.localBriefs.items.length
          : 0
    }),
    { headers: { "content-type": "application/json" } }
  );
};

export const config = {
  schedule: "15 10 * * *"
};

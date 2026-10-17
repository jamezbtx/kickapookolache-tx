/**
 * GET /api/feeds — serve latest feeds snapshot from Netlify Blobs (key latest).
 * Falls through soft-empty if blob missing (client then uses static data/feeds.json).
 */
import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const store = getStore("feeds");
    const data = await store.get("latest", { type: "json" });
    if (data) {
      return new Response(JSON.stringify(data), {
        headers: {
          "content-type": "application/json",
          "cache-control": "public, max-age=60"
        }
      });
    }
  } catch (err) {
    console.warn("feeds GET soft-fail:", err && err.message ? err.message : err);
  }
  return new Response(JSON.stringify({ missing: true }), {
    status: 404,
    headers: { "content-type": "application/json" }
  });
};

export const config = {
  path: "/api/feeds"
};

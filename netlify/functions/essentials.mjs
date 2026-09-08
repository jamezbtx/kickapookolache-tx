/**
 * GET /api/essentials — serve essentials from Netlify Blobs.
 * Soft-fail 404 if blob missing; homepage falls back to static JSON / empty UI.
 */
import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const store = getStore("essentials");
    const data = await store.get("daily", { type: "json" });
    if (!data) {
      return new Response(JSON.stringify({ error: "not_found" }), {
        status: 404,
        headers: { "content-type": "application/json", "cache-control": "no-store" }
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=300"
      }
    });
  } catch (err) {
    console.warn("essentials GET soft-fail:", err && err.message ? err.message : err);
    return new Response(JSON.stringify({ error: "unavailable" }), {
      status: 503,
      headers: { "content-type": "application/json", "cache-control": "no-store" }
    });
  }
};

export const config = {
  path: "/api/essentials"
};

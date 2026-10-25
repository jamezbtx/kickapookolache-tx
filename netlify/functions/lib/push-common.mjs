import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";
export const subs = () => getStore({ name: "push-subs", consistency: "strong" });
export const keyFor = (endpoint) => createHash("sha256").update(String(endpoint)).digest("hex");
export const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
export function validSub(s) {
  return s && typeof s.endpoint === "string" && /^https:\/\//.test(s.endpoint) && s.endpoint.length < 1000 &&
    s.keys && typeof s.keys.p256dh === "string" && typeof s.keys.auth === "string" && s.keys.p256dh.length < 200 && s.keys.auth.length < 100;
}

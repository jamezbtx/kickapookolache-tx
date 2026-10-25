/** POST /api/push-subscribe: store a browser push subscription (Blobs 'push-subs', key = sha256(endpoint)). */
import { subs, keyFor, json, validSub } from "./lib/push-common.mjs";
export default async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  let s; try { s = JSON.parse((await req.text()).slice(0, 4000)); } catch { return json({ error: "bad json" }, 400); }
  if (!validSub(s)) return json({ error: "bad subscription" }, 400);
  await subs().setJSON(keyFor(s.endpoint), { endpoint: s.endpoint, keys: { p256dh: s.keys.p256dh, auth: s.keys.auth }, created: new Date().toISOString() });
  return json({ ok: true });
};
export const config = { path: "/api/push-subscribe" };

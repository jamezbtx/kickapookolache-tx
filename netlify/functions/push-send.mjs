/** POST /api/push-send: header X-Push-Token: $PUSH_SEND_TOKEN, body {title, body, url[, endpointHash]}.
 *  Manual only: never scheduled. Sends to every stored subscriber (or only endpointHash if given, for tests),
 *  removes 404/410 subscriptions, returns counts. */
import webpush from "web-push";
import { timingSafeEqual } from "node:crypto";
import { subs, json } from "./lib/push-common.mjs";
const same = (a, b) => { a = Buffer.from(String(a)); b = Buffer.from(String(b)); return a.length === b.length && timingSafeEqual(a, b); };
export default async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const tok = process.env.PUSH_SEND_TOKEN;
  if (!tok || !same(req.headers.get("x-push-token") || "", tok)) return json({ error: "unauthorized" }, 401);
  let b; try { b = JSON.parse(await req.text()); } catch { return json({ error: "bad json" }, 400); }
  const title = String(b.title || "").slice(0, 120), body = String(b.body || "").slice(0, 240);
  let url = String(b.url || "/");
  try { const u = new URL(url, "https://kickapookolache.com"); url = u.pathname + u.search; } catch { url = "/"; }
  if (!title) return json({ error: "title required" }, 400);
  webpush.setVapidDetails(process.env.VAPID_SUBJECT, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  const store = subs();
  const { blobs } = await store.list();
  const keys = blobs.map((x) => x.key).filter((k) => !b.endpointHash || k === b.endpointHash);
  const payload = JSON.stringify({ title, body, url });
  let sent = 0, removed = 0, failed = 0;
  await Promise.all(keys.map(async (k) => {
    const s = await store.get(k, { type: "json" });
    if (!s) return;
    try { await webpush.sendNotification(s, payload, { TTL: 86400 }); sent++; }
    catch (e) {
      if (e && (e.statusCode === 404 || e.statusCode === 410)) { await store.delete(k); removed++; }
      else { failed++; console.warn("push fail", e && e.statusCode); }
    }
  }));
  return json({ subscribers: keys.length, sent, removed, failed });
};
export const config = { path: "/api/push-send" };

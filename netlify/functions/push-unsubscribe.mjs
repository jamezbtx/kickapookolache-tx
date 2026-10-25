/** POST /api/push-unsubscribe: body {endpoint}. Removes that subscription. */
import { subs, keyFor, json } from "./lib/push-common.mjs";
export default async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  let b; try { b = JSON.parse((await req.text()).slice(0, 4000)); } catch { return json({ error: "bad json" }, 400); }
  if (!b || typeof b.endpoint !== "string") return json({ error: "bad request" }, 400);
  await subs().delete(keyFor(b.endpoint));
  return json({ ok: true });
};
export const config = { path: "/api/push-unsubscribe" };

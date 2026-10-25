/** GET /api/push-key: the public VAPID key the browser needs to subscribe. */
import { json } from "./lib/push-common.mjs";
export default async () => {
  const k = process.env.VAPID_PUBLIC_KEY;
  return k ? json({ publicKey: k }) : json({ error: "not configured" }, 503);
};
export const config = { path: "/api/push-key" };

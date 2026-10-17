/** POST /api/click: count one listing click. Body {business, type}. No IP/UA/cookies stored. */
import { getStore } from "@netlify/blobs";
const TYPES = new Set(["website", "phone", "email", "directions", "facebook"]);
const day = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date());
export default async (req) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  let b;
  try { b = JSON.parse((await req.text()).slice(0, 500)); } catch { return new Response(null, { status: 400 }); }
  const business = String(b.business || "").replace(/[^\p{L}\p{N} &'’.,-]/gu, "").trim().slice(0, 80);
  if (!business || !TYPES.has(b.type)) return new Response(null, { status: 400 });
  const store = getStore({ name: "clicks", consistency: "strong" });
  const key = `${day()}/${encodeURIComponent(business)}/${b.type}`;
  try {
    const n = (await store.get(key, { type: "json" })) || 0;
    await store.setJSON(key, n + 1);
  } catch (e) { console.warn("click store fail", e && e.message); }
  return new Response(null, { status: 204 });
};
export const config = { path: "/api/click" };

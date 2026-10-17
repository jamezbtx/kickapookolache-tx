/** GET /api/click-report?token=… — private listing click counts. */
import { getStore } from "@netlify/blobs";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const dayStr = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(d);
export default async (req) => {
  const url = new URL(req.url);
  const token = process.env.CLICK_REPORT_TOKEN;
  if (!token || url.searchParams.get("token") !== token) return new Response("Not found", { status: 404 });
  const store = getStore({ name: "clicks", consistency: "strong" });
  const { blobs } = await store.list();
  const rows = [];
  for (const b of blobs) {
    const [d, biz, type] = b.key.split("/");
    rows.push({ d, biz: decodeURIComponent(biz), type, n: (await store.get(b.key, { type: "json" })) || 0 });
  }
  const now = new Date();
  const since = (n) => dayStr(new Date(now - (n - 1) * 864e5));
  const types = ["website", "phone", "email", "directions", "facebook"];
  const table = (n) => {
    const s = since(n), agg = {};
    for (const r of rows) if (r.d >= s) { (agg[r.biz] ||= {})[r.type] = ((agg[r.biz] || {})[r.type] || 0) + r.n; }
    const names = Object.keys(agg).sort();
    const body = names.length ? names.map((b) => { const t = types.map((k) => agg[b][k] || 0); return `<tr><td>${esc(b)}</td>${t.map((x) => `<td>${x}</td>`).join("")}<td><b>${t.reduce((a, c) => a + c, 0)}</b></td></tr>`; }).join("") : `<tr><td colspan="${types.length + 2}">No clicks yet</td></tr>`;
    return `<h2>Last ${n} days (${s} to ${dayStr(now)})</h2><table><tr><th>Business</th>${types.map((t) => `<th>${t}</th>`).join("")}<th>Total</th></tr>${body}</table>`;
  };
  const html = `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Listing clicks · Kickapoo Kolache</title>
<style>body{font:15px system-ui,sans-serif;margin:2rem;color:#222}table{border-collapse:collapse;margin-bottom:2rem}td,th{border:1px solid #ccc;padding:.35rem .7rem;text-align:right}td:first-child,th:first-child{text-align:left}th{background:#f3eee4}</style>
<h1>Local Businesses: link clicks</h1><p>Counts only (no cookies, no visitor data). Days in Central time.</p>${table(7)}${table(30)}`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
};
export const config = { path: "/api/click-report" };

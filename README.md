# Kickapoo Kolache

Local digital newspaper homepage shell for Brownsboro and Chandler, Texas
(ZIPs 75756 / 75758). Scope: Brownsboro–Chandler only — not Tyler metro.

## Build

Install dependencies, then run the build script defined in package.json.
Output lands in the publish directory: public/

## Panels (James-approved order · draft/homepage-shell)

0. Essentials — almanac / joke / scripture / This Day in History (EXAMPLE + JSON scaffold)
1. Weather — ZIPs 75756 / 75758 (Open-Meteo draft + NWS official links + multi-day)
2. Interviews & Stories — From neighbors (honest empty + tip CTA; spotlight-style features when James files them) + Local briefs LIVE (Henderson County / filtered Athens Review — NOT Chandler News Flash)
3. Contractor Spotlight — ONE featured paid/partner card (EXAMPLE; separate from directory; monetization)
4. Bears Sports · MaxPreps (placeholder)
5. Official City & School Feeds — Chandler RSS + Brownsboro/BISD fallbacks
6. Columns — Christian Bushcraft + Carlee Craft (EXAMPLE)
7. Local Contractors directory — sponsored listing cards (multiple EXAMPLE)
8. Local Resources · City / BISD (near footer)

Weekly Spotlights (business/school/official/pastor EXAMPLE panel) removed from homepage — those features live under Interviews & Stories when filed.

## Status

DRAFT homepage shell only.
Code branch: draft/homepage-shell
main holds Coming soon only.
Do not Netlify-prod-deploy or push this draft to kickapookolache.com.

## Essentials (AI-daily scaffold)

Build runs `scripts/fetch-essentials.js` (soft-fail) and writes
`public/data/essentials.json` with shape:
`{ generatedAt, source: "fallback"|"ai", items: [{ type, title, body, badge }] }`.

Homepage `essentials.js` loads that JSON into `#essentials-root` (static EXAMPLE
HTML remains as fallback). Types: almanac · joke · scripture · history.

A future scheduled routine can regenerate `essentials.json` daily via AI
(`source: "ai"`). No Grok Bot routine is wired yet — pipeline scaffold only.

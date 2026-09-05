# Kickapoo Kolache

Local digital newspaper homepage shell for Brownsboro and Chandler, Texas
(ZIPs 75756 / 75758). Scope: Brownsboro–Chandler only — not Tyler metro.

## Build

Install dependencies, then run the build script defined in package.json.
Output lands in the publish directory: public/

## Panels (James-approved order · draft/homepage-shell)

0. Essentials — almanac / joke / scripture / This Day in History (EXAMPLE + JSON scaffold)
1. Weather — ZIPs 75756 / 75758 (Open-Meteo draft + NWS official links + multi-day)
2. Interviews & Stories (EXAMPLE)
3. Weekly Spotlights — business / school / official / pastor (EXAMPLE)
4. Contractor Spotlight — ONE featured paid/partner card (EXAMPLE; separate from directory)
5. Bears Sports · MaxPreps (placeholder)
6. Official City & School Feeds (placeholders)
7. Columns — Christian Bushcraft + Carlee Craft (EXAMPLE)
8. Local Contractors directory — sponsored listing cards (multiple EXAMPLE)
9. Local Resources · City / BISD (near footer)

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

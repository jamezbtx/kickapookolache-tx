# Kickapoo Kolache

Local digital newspaper homepage shell for Brownsboro and Chandler, Texas
(ZIPs 75756 / 75758). Scope: Brownsboro–Chandler only — not Tyler metro.

## Build

Install dependencies, then run the build script defined in package.json.
Output lands in the publish directory: public/

## Panels (James-approved order · draft/homepage-shell)

0. Essentials — almanac / joke / scripture / This Day in History
1. Weather — 75756 / 75758 (Open-Meteo + NWS)
2. Interviews & Stories — neighbor tips + Local briefs (regional outlets filtered to Brownsboro/Chandler/rural Henderson)
3. Business Spotlight — one featured partner (Get listed)
4. Bears Sports · MaxPreps
5. Official City & School Notices — government/school links only
6. Neighbor Columns — Chritty’s Bushcraft + Carlee’s Creations
7. Local Businesses directory
8. Local Resources — city/BISD + emergency/utilities + official calendars


Also: Submit form, Rate card, Contact, Privacy, Garage Sales, Jobs, Obits, Blotter, Ask the Kolache.

## Status

Code branch: draft/homepage-shell
Draft banners and noindex removed on this branch (pre-publish polish).
main holds Coming soon only.
Do not Netlify-prod-deploy or push this draft to kickapookolache.com until James says publish.

## Forms

Netlify form kickapoo-submit → kickapookolache@gmail.com.

## Calendars

Official outbound calendars only (Chandler, Brownsboro, BISD). Chandler CivicPlus calendar RSS often returns zero items — we link calendar pages rather than a Kickapoo-hosted live event feed.


## Essentials (AI weekly scaffold)

Build runs `scripts/fetch-essentials.js` (soft-fail) and writes
`public/data/essentials.json` with shape:
`{ generatedAt, source: "fallback"|"ai", items: [{ type, title, body, badge }] }`.

Homepage `essentials.js` loads that JSON into `#essentials-root` (
HTML remains as fallback). Types: almanac · joke · scripture · history.

A future scheduled routine can regenerate `essentials.json` weekly via AI
(`source: "ai"`). No Grok Bot routine is wired yet — pipeline scaffold only.

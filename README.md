# Kickapoo Kolache

Local digital newspaper homepage shell for Brownsboro and Chandler, Texas
(ZIPs 75756 / 75758). Scope: Brownsboro–Chandler only — not Tyler metro.

## Build

Install dependencies, then run the build script defined in package.json.
Output lands in the publish directory: public/

## Panels (order follows the nav · James, Oct. 11, 2026 · draft/homepage-shell)

Nav (every page): Home · Interviews · Columns · Local Jobs · Local Updates · Garage Sales · Ask the Kolache ·
Crossword · Word Search · Submit / Get listed · Contact · Rate card. Homepage blocks run in that same sequence:

1. Home: Essentials (almanac / joke / scripture / This Day in History), then Weather (75756 / 75758, Open-Meteo + NWS)
2. Interviews: Interviews & Stories (neighbor stories + interviews)
3. Columns: Neighbor Columns (Chritty's Bushcraft + Carlee's Creations)
4. Local Updates: Official City & School Notices, Bears Sports · MaxPreps, Local Resources (city/BISD, emergency/utilities, calendars), Local Updates link
5. Crossword / Word Search: Play today
6. Submit / Get listed: Business Spotlight (one featured partner), then Local Businesses directory
7. Contact: "Know a good neighbor?" callout (mailto editor)

Local Jobs, Garage Sales, Ask the Kolache and Rate card have no homepage block (nav links only).
If a homepage block is added or moved, keep it in nav order.

Also: Submit form, Rate card, Contact, Privacy, Garage Sales, Jobs, Ask the Kolache. (Obituaries and Police Blotter pages dropped Oct. 11, 2026; old URLs 301 to home.)

## Status

Code branch: draft/homepage-shell
Draft banners and noindex removed on this branch (pre-publish polish).
main holds Coming soon only.
Published to kickapookolache.com Oct. 11, 2026 (James): production deploy 6acb8461fc7dc02f6ad5118a. Rollback target 6aca8943b35357f6475b7819.
Oct. 11, 2026 mobile width fix (grids use minmax(0, 1fr); panel h2 rules full width): production deploy 6acbbb9f1c6d685cecb9c1a1. Rollback target 6acb8461fc7dc02f6ad5118a.
Oct. 22, 2026 Lake Palestine state park story (Rodney Franklin) published 9:01 AM CT: production deploy 6ada179492ff80f5d3164e5b (commit 0f9d96b). Rollback target 6ad60f089344222be5d45987.
Oct. 27, 2026 Normandy / Norwegian cemetery story published 9:44 AM CT (branch normandy-2026-10-27): production deploy 6ae0b92eb5cb9bf2f77a016f. Rollback target 6adf4933ed525e54105d2fe8.
Note: Blobs store `essentials` is site-wide, so draft/branch deploys read the same `/api/essentials` blob that production's
scheduled `daily-essentials` writes. Branch deploys never run the schedule; a history entry added on a draft only appears
after production runs the new code (or a manual re-run).

## Forms

Netlify form kickapoo-submit → editor@kickapookolache.com.

## Calendars

Official outbound calendars only (Chandler, Brownsboro, BISD). Chandler CivicPlus calendar RSS often returns zero items — we link calendar pages rather than a Kickapoo-hosted live event feed.


## Essentials (daily)

Build runs `scripts/fetch-essentials.js` (soft-fail) and writes
`public/data/essentials.json` with shape:
`{ generatedAt, source: "fallback"|"ai", items: [{ type, title, body, badge }] }`.

Homepage `essentials.js` loads that JSON into `#essentials-root` (
HTML remains as fallback). Types: almanac · joke · scripture · history.

In production the scheduled Netlify function `netlify/functions/daily-essentials.mjs`
(renamed from `weekly-essentials` on 2026-10-09; it already ran daily) regenerates essentials
every day at `0 10 * * *` UTC (5:00am CDT / 4:00am CST), 15 minutes before `daily-feeds`
(`15 10 * * *`). It writes Blobs store `essentials`, key `weekly` (legacy key name, kept so
`/api/essentials` keeps reading it).

## Shared partials (src/partials/)

`<!--INCLUDE:name-->` in a source page is replaced at build time with `src/partials/name.html`.
`good-neighbor.html` is the "Know a good neighbor?" callout (mailto editor@kickapookolache.com, subject "Good neighbor tip").
It is placed explicitly on the homepage, About, Contact and Submit pages. **Every story page gets it automatically**: any page with
`<article class="... column-article ...">` and no explicit marker has it inserted before `</main>` by `build.js`. New interviews/columns need no extra step.

## Story og image standard (James approved Oct. 2, 2026)

Every story/interview page uses a **2400x1260 JPEG** share card (1.91:1, quality ~94, 4:4:4), named `<slug>-og-hq-2400x1260.jpg`,
stored in the story's `assets/spotlights/<slug>/` folder, with `og:image` + `twitter:image` pointing at it and
`og:image:width=2400`, `og:image:height=1260`. Render it at device scale factor 2 from the template in
`/workspace/kickapoo-ops/editorial/templates/og/` (see its README). `node build.js` prints a WARN for any story page that is not on this standard.
(Pastor Heath and the two column pages predate it.)

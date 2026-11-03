# Plank Plan

A 12-week plank training app in a single self-contained file: `index.html`. No build step, no framework, no dependencies besides Google Fonts (Barlow / Barlow Condensed). Open the file in a browser to run it.

Deployed as a static site on Vercel (https://work-out-plan.vercel.app/), which redeploys automatically on every push to `main`. The file must stay named `index.html` so it's served at `/`.

## PWA and icons

- `manifest.webmanifest` makes it installable (standalone, portrait). `index.html` links it and carries the iOS `apple-mobile-web-app-*` meta tags.
- `sw.js` precaches the app shell and icons, then serves same-origin files and Google Fonts stale-while-revalidate. Navigations resolve to the cached `/`, so the app opens offline and a new deploy shows up on the next open. Bump `CACHE` whenever the `PRECACHE` list changes.
- Registration is at the end of the script and runs only over http(s), so opening the file locally or as an artifact skips it.
- `favicon.svg` is the source design (accent `#2450c9`, timer ring, plank figure). All raster icons are rendered from it: `favicon.ico` (16 + 32 px), `apple-touch-icon.png` (180 px, square, no rounded corners), `icon-192.png`, `icon-512.png`, and `icon-maskable-512.png` (full-bleed, content scaled to 78% for the safe zone). Regenerate them all if the SVG changes.

## Program logic

- Day-1 test times the best clean hold for front plank, side plank left, side plank right.
- 12 weeks = 3 phases of 4 weeks. Retests are due at the end of weeks 4, 8 and 12 (`dueTest()`).
- Daily target per hold (`targets()`): reference test × 50% / 67.5% / 77.5% (by phase, `PCT`) + 5 s per week into the phase + user adjustment (`state.adj`, ±5 s steps, clamped to ±30), rounded to 5 s, minimum 10 s.
- The reference test for phase N is the latest test taken at week ≤ (N−1)×4 (`refTest()`), falling back to the day-1 test.
- Goal (`GOAL`): 2:00 front, 1:00 each side.
- `weekNum()` is 1–12 once started (clamped), 0 before the first test.

## State and storage

- Shape: `{start, tests:[{week, date, f, l, r}], log:{"YYYY-MM-DD": rounds}, rest, adj, updated}`. Keys `f`/`l`/`r` = front / left / right, values in seconds.
- Persisted to `localStorage` under `plank-plan-v1` (`LS_KEY`).
- When hosted as a Claude artifact, it also syncs via `window.claude.use("db")` to `data/users/<id>/plank`; whichever copy has the newer `updated` wins on load (`connect()`).
- Changing the state shape needs a migration or a new storage key, because existing users' data is already saved.

## Code structure

Everything lives in one `<script>` IIFE, split into commented sections: state, dates, plan logic, storage, render, test view, modal, audio, session timer.

- Rendering is a full `innerHTML` rebuild of `#app` followed by `bind()` / `bindTest()` to attach listeners.
- `#overlay` hosts the confirm modal, the session-done modal and the full-screen session timer.
- Dates are local `YYYY-MM-DD` keys; use `keyOf`, `parseKey`, `addDays`, `diffDays` rather than raw `Date` math.
- The session timer uses `performance.now()` deadlines; only holds that run to zero count toward logged rounds (`sess.done`).
- A global `keydown` handler gives dialogs Escape (cancel / close / pause the timer) and a Tab focus trap.

## Conventions

- Keep it a single HTML file with no build step or framework.
- Match the existing compact style: CSS custom properties for theming (light/dark), terse one-line functions.
- Escape any dynamic text inserted into HTML with `esc()`.
- Keep the thumb-safe guidance: the user has a thumb injury, so the plan uses forearm planks only, with no high planks or push-ups. Don't add exercises that load the hands.

## Testing

There is no test suite. Verify changes by opening the file in a browser. For headless checks, load it in jsdom with `url: "http://localhost/"` (so `localStorage` works), seed state under `plank-plan-v1`, and stub `window.performance.now` to fast-forward the session timer.

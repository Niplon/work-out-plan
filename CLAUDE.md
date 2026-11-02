# Plank Plan

A 12-week plank training app in a single self-contained file: `Plank Plan.html`. No build step, no framework, no dependencies besides Google Fonts (Barlow / Barlow Condensed). Open the file in a browser to run it.

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

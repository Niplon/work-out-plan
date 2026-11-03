# Plank Plan

A 12-week plank program in a single HTML file. Take a test on day 1, and the app sets your daily hold times, runs a guided timer, tracks your streak, and schedules retests.

**Goal:** a 2:00 front plank and a 1:00 side plank on each side.

## Getting started

Open **https://work-out-plan.vercel.app/** on your phone. Nothing to install, no account needed. It's built for phones but works on any screen.

You can also download `index.html` and open it straight from your computer.

### Install on your phone

- **iPhone (Safari):** tap Share → **Add to Home Screen**.
- **Android (Chrome):** tap the menu → **Install app**.

Once installed it opens full-screen like a native app. It works offline after your first visit, so a weak signal at the gym won't stop the timer.

Your progress is saved in the browser on that device (`localStorage`), so use the same browser each time.

## How it works

1. **Day-1 test.** Time your best clean hold for a front plank, a left side plank and a right side plank. Stop as soon as your hips sag or twist. Use the built-in stopwatch or type the seconds.
2. **Daily sessions.** Do 3 rounds of front, side left, side right, about 8 minutes, 5–6 days a week. A busy day? One round still counts.
3. **Retests** at the end of weeks 4, 8 and 12 reset your targets for the next phase.

| Weeks | Hold length | Each week |
|-------|-------------|-----------|
| 1–4   | 50% of your day-1 test | +5 s |
| 5–8   | ~67% of your week-4 test | +5 s |
| 9–12  | ~78% of your week-8 test | +5 s |

If the targets feel off, use the **Easier −5s / Harder +5s** buttons.

## Features

- Guided session timer with a countdown ring, beeps, vibration, pause and skip, and it keeps the screen on
- Choice of 1–3 rounds and 30, 45 or 60 s rest
- Day streak, sessions this week, and progress bars toward the goal
- 12-week calendar: tap a past day to log or unlog it
- History of test results, with an option to redo the latest test
- Light and dark themes, keyboard-friendly dialogs

## A note on form

The plan uses **forearm planks only**, with hands open and relaxed. It was built around a thumb injury, so it avoids high planks and push-ups. If a hold causes pain, stop, and check with a professional before continuing.

## Development

All the HTML, CSS and JavaScript lives in `index.html`, with no build step or framework. Pushing to `main` redeploys the site on Vercel. See [CLAUDE.md](CLAUDE.md) for how the code is organized.

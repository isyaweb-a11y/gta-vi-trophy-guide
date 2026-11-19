# gta-vi-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/isyaweb-a11y/gta-vi-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/isyaweb-a11y/gta-vi-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Leonida Legend** — an offline trophy guide and tracker for Grand Theft Auto VI on PlayStation 5, covering all 55 official trophies (1 platinum, 2 gold, 6 silver, 46 bronze) with their names, descriptions and grades exactly as PlayStation publishes them.

## What it does

- **A guide for every trophy, in our own words.** Each of the 55 entries explains what to do, where and how as far as the official descriptions and the cited sources support it, and when it can be missed. Every guide cites its sources beside it — the official PS5 trophy list as published by Exophase and PSNProfiles, plus PowerPyx's trophy guide and roadmap where the guide draws on it. Official names and descriptions are reproduced as published (including "T**s Ass Drug Money" and "Let’s Go Bowling"); nothing else is copied from any guide.
- **Missable trophies flagged, with the reasoning.** Nine trophies carry a watch-out flag built from the official descriptions: the five named-character strand finals (Andy, Kenton, Billy, Randy, Tyrone), the two partner trophies that need your partner with you ("Hot Together", "Retail Therapy"), the one-off unscheduled departure at VCIA ("Catch Me If You Can"), and the 500 tracked choices behind "Actions Speak Louder". Every other trophy explains why it is *not* missable.
- **A six-stage roadmap to the platinum**, shown in the app: story first (chapters and named missions), strangers & side strands, collectibles & exploration (3 card sets, 100 WAiNK locations, 100 vehicles, 52 areas…), activities & challenges (250 stunts, 42 shooting-range golds, 50 challenges…), money & property ($250,000 laundered, $100,000 spent, 8 garages), and cleanup to 100% completion and the platinum.
- **A real tracker.** Tick trophies off and progress is saved in the browser (localStorage), with an earned count, percentage and per-grade progress in the header, plus a platinum progress callout. Progress can be **exported** to a JSON file, **imported** back, or reset.
- **Filters and spoiler mode.** Filter by kind (story, side, collectibles, activities, feats, money, meta), by grade, by earned/unearned, missable-only, or free-text search. Spoiler mode hides the names and descriptions of unearned story trophies ("Hidden trophy") until you earn them.

## How it is built

Plain static files under `app/` — no build step, no network requests at runtime. The app fetches only its own `app/data/trophies.json`; the code is split into small ES modules (`app/js/tracker-state.js`, `app/js/filters.js`, `app/js/roadmap.js`, `app/js/guide-panel.js`, with `app/app.js` as the entry). The look is an original neon-dusk "Leonida sunset" made purely from CSS gradients — no Rockstar logo, no official artwork, no game screenshots, no external fonts or images.

`main.ts` (Node 22, standard library only) hands the entry in: it copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library in `vendor/makefun-frontend.ts`, which is left byte-identical.

## Run it

```sh
node serve.ts
# then open http://localhost:8080
```

To produce the hand-in output locally:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=sc1d8ke0&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>

# 2026 FIFA World Cup Tracker

Interactive tournament tracker for the 2026 FIFA World Cup. Enter match scores and watch group standings, 3rd-place rankings, and the knockout bracket update in real time.

**[skotniczny.github.io/world-cup-2026](https://skotniczny.github.io/world-cup-2026/)**

## Tech stack

- [Svelte 5](https://svelte.dev/) with runes (`$state`, `$derived`)
- TypeScript (strict)
- Vite
- [svelte5-router](https://www.npmjs.com/package/svelte5-router)

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run check` | Run svelte-check |
| `npm run make-data` | Re-fetch match/team data from FIFA API |

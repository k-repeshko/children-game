# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A touch-first toddler game for iPad (React 19 + TypeScript + Vite). The child drags a rainbow-colored shape onto a matching target line on the opposite side; on success a reward video overlay plays for a configurable number of seconds, then a new round starts. `README.md` is the product spec (game rules, reward behavior, settings ranges) — keep it in sync when behavior changes.

## Commands

- `npm run dev` — Vite dev server (app is served under `/children-game/`, e.g. `http://localhost:5173/children-game/`)
- `npm run build` — type-check (`tsc -b`) then production build to `dist/`
- `npm run lint` — oxlint (config in `.oxlintrc.json`)
- `npm run preview` — serve the built `dist/`
- `npm run deploy` — builds and publishes `dist/` to GitHub Pages via `gh-pages`

There is no test framework set up. Verify changes with `npm run build` (type-check) and `npm run lint`.

## Architecture

**View / logic split.** Every component lives in `src/components/<Name>/` as three files:
- `<Name>.tsx` — presentational only; receives a fully-prepared props object and renders it.
- `<Name>.logic.ts` — a `use<Name>Logic` hook (or `build<Name>Props` helper) that owns state, handlers, and computed styles, and exports the `<Name>Props` type.
- `<Name>.css` — component styles.

Follow the same pattern for new components. Framework-free logic (pure functions, constants, browser API wrappers) goes in `src/logic/*.logic.ts` / `game.constants.ts`.

**State lives in `App.logic.ts`.** `useAppLogic` is the single orchestrator: it holds settings, the current `GameRound`, completion count, reward visibility, and the reward auto-close timer, then calls each component's logic hook and hands `App.tsx` ready-made `*Props` objects. Components don't share state with each other directly.

**Round lifecycle.**
1. `createGameRound()` (`logic/round.logic.ts`) picks a random rainbow color and random shape side; the target goes on the opposite side.
2. `useGameBoardLogic` handles pointer-drag (with an enlarged invisible hit area), measures the board, and calls `onSuccess` when the shape rect intersects the target rect. A `resetToken` (round index) prop forces the board to reset its position.
3. `handleRoundComplete` locks completion (`completionLockedRef` guards double-fires), increments the count, and shows the reward overlay with `rewardStartSeconds = completionCount * rewardSeconds` so each reward continues further into the same video.
4. The reward auto-close timer starts only when video playback actually begins (`onPlaybackStarted`), not when the overlay opens. Playback requires a user tap ("Tap to start video") because of mobile autoplay restrictions.
5. On timeout, `closeRewardRound` creates a new round and bumps the round index.

**Routing.** `HashRouter` (required for GitHub Pages) with `/` (game) and `/settings`. Navigating to `/settings` cancels any active reward; returning to `/` from settings starts a fresh round.

**Settings.** `logic/settings.logic.ts` loads/validates/saves `{ rewardSeconds, shapes }` in `localStorage` under `game-settings`; invalid stored data falls back to defaults. Range constants (`MAX_REWARD_SECONDS`, `MIN_SHAPES`, `MAX_SHAPES`) are exported from there. `shapes` is stored but not yet used by gameplay.

## Gotchas

- `vite.config.ts` sets `base: '/children-game/'`. Reference public assets via `import.meta.env.BASE_URL` (see `RewardOverlay.logic.ts`), not absolute `/` paths.
- The React Compiler is enabled (`babel-plugin-react-compiler` via `@rolldown/plugin-babel`), though the codebase still uses explicit `useCallback`/`useMemo`.
- Fullscreen handling in `logic/fullscreen.logic.ts` includes `webkit`-prefixed fallbacks for iPad Safari — preserve them.

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
- `<Name>.scss` — component styles.

Follow the same pattern for new components. Framework-free logic (pure functions, constants, browser API wrappers) goes in `src/logic/*.logic.ts` / `game.constants.ts`.

**UI kit (`src/ui/`).** Game-agnostic, stateless building blocks: `Button` (`shape="pill|circle"`, `size="md|lg"`), `Surface` (card panel), `Overlay` (fixed blurred backdrop), `Corner` (safe-area-aware corner placement), `Badge`, `NumberField`, `FieldError`, `Page` (centered page with title + actions), `PlayIcon`. Import from the barrel: `import { Button, Page } from '../../ui'`. Kit components are `<Name>.tsx` + `<Name>.scss` only (props type exported from the `.tsx`, no `.logic.ts` unless one gains behavior), use `ui-` prefixed BEM classes (`.ui-button--circle`), and forward native props plus `className`. Feature components should compose the kit first and only add local SCSS for layout/positioning that is truly specific (e.g. `.reward-play-button` centering). When a style repeats in two feature components, move it into the kit or a token.

**Styles** are SCSS (compiled by Vite via `sass-embedded`). Shared tokens (colors, radii, shadows, spacing, z-index) live in `src/styles/_variables.scss` and shared mixins (`focus-ring`, `safe-corner`) in `src/styles/_mixins.scss`; pull them in with `@use '../../styles/variables' as *;` (module system — don't use `@import`). Class names are plain global BEM-ish names (`.reward-overlay--hidden`), not CSS modules.

**State lives in `App.logic.ts`.** `useAppLogic` is the single orchestrator: it holds settings, the current `GameRound`, completion count, reward visibility, and the reward auto-close timer, then calls each component's logic hook and hands `App.tsx` ready-made `*Props` objects. Components don't share state with each other directly.

**Round lifecycle.**
1. `createGameRound()` (`logic/round.logic.ts`) picks a random rainbow color and random shape side; the target goes on the opposite side.
2. `useGameBoardLogic` lays out `shapeCount` shapes via `getShapeGridLayout` (`logic/shapeGrid.logic.ts`: 3-column grid, scaled to fit the board), handles pointer-drag per shape (with an enlarged invisible hit area), measures the board, hides each shape whose rect intersects the target rect, and calls `onSuccess` once all shapes are delivered. A `resetToken` (round index) prop forces the board to reset its position.
3. `handleRoundComplete` locks completion (`completionLockedRef` guards double-fires), increments the count, and shows the reward overlay with `rewardStartSeconds = completionCount * rewardSeconds` so each reward continues further into the same video.
4. The reward auto-close timer starts only when video playback actually begins (`onPlaybackStarted`), not when the overlay opens. Playback requires a user tap ("Tap to start video") because of mobile autoplay restrictions.
   The video is split into 10 s clips (`logic/rewardClips.logic.ts`, `planRewardClips`). `RewardOverlay` stays mounted while hidden: between rewards it prefetches the next reward's clips as blob URLs and preloads the first one; on `ended` it moves to the next clip on the same `<video>` element (which the first tap unlocked on iPad).
5. On timeout, `closeRewardRound` creates a new round and bumps the round index.

**Routing.** `HashRouter` (required for GitHub Pages) with `/` (game) and `/settings`. Navigating to `/settings` cancels any active reward; returning to `/` from settings starts a fresh round.

**Settings.** `logic/settings.logic.ts` loads/validates/saves `{ rewardSeconds, shapes }` in `localStorage` under `game-settings`; invalid stored data falls back to defaults. Range constants (`MAX_REWARD_SECONDS`, `MIN_SHAPES`, `MAX_SHAPES`) are exported from there. `shapes` sets how many shapes a round shows.

## Gotchas

- `vite.config.ts` sets `base: '/children-game/'`. Reference public assets via `import.meta.env.BASE_URL` (see `rewardClips.logic.ts`), not absolute `/` paths.
- The React Compiler is enabled (`babel-plugin-react-compiler` via `@rolldown/plugin-babel`), though the codebase still uses explicit `useCallback`/`useMemo`.
- `public/sw.js` (registered only in production builds by `logic/serviceWorker.logic.ts`) caches `/videos/*` cache-first and answers `Range` requests from the cache with 206 responses, which Safari needs for `<video>`. Test it with `npm run build && npm run preview`, not the dev server.
- `public/videos/clips/` and `src/logic/rewardClips.manifest.ts` are generated by `scripts/encode-reward-video.sh` — regenerate them together rather than editing them by hand.
- Fullscreen handling in `logic/fullscreen.logic.ts` includes `webkit`-prefixed fallbacks for iPad Safari — preserve them.

## Workflow

- Tasks live in `tasks/#N <name>.md` in the main checkout (not in worktrees). If a task file isn't found in the worktree, look in the main repo's `tasks/`.
- `tasks/#0-task-template.md` is the template for defining a new task (Goal, Behavior, Open questions, Acceptance criteria, Out of scope). When the user asks to define or write up a task, create the new `tasks/#N <name>.md` from it, keeping its section structure, and drop the optional sections that don't apply.
- When asked to implement a task, first read its task file and check it for missing details or contradictions (within the task, against `README.md`, or against current behavior). If you find any, ask the user before planning or coding.
- Ask before assuming gameplay behavior; the audience is a toddler: big touch targets, no fail states, no text-dependent UI.
- There are no tests. For pure logic, check it headlessly: bundle with `npx esbuild file.ts --bundle --platform=node` and run it with node.
- The dev server may move off 5173 if the port is busy. Use the URL that `preview_start` reports.
- Commit messages: short imperative subject plus a body explaining why.
- After implementing a task, append a `## Implementation notes` section to its task file: decisions made during planning or coding that the task didn't state (answers to questions, assumptions, deviations), plus anything left unverified. Keep it short.

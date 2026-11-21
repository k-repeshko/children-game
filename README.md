# iPad Game

## Game concept

- Full-screen white background.
- Large game shapes (boxes) and thick target lines (or dashed slots) are shown in the play area.
- Each round picks `Colors` distinct random rainbow colors and `Forms` distinct random forms (square, circle, triangle, star). The `Match` setting decides what a shape must match: **Color** (default), **Shape** or **Color & Shape**. Every chosen color is used by at least one shape, and every target receives at least one shape, so a round can always be finished.
  - **Color:** one colored line target per color. Forms are decorative: each shape gets a random chosen form (a chosen form may go unused).
  - **Shape:** one target per chosen form, a gray dashed outline (slot) of that form with a translucent gray fill. Every chosen form appears on at least one shape; colors are decorative.
  - **Color & Shape:** max(`Colors`, `Forms`) distinct (form, color) pairs that use every chosen color and form; each pair is a dashed outline of its form in its color with a translucent fill and gets at least one shape. Every shape has exactly one matching target.
- Slot targets are squares drawn in the same geometry as the shapes, with side = per-target stack height (capped at 25% of the board width), so they shrink as the number of targets grows. There are at most 4 targets in every mode.
- The shapes start on either the left or right side at random, and the targets appear on the opposite side, stacked evenly in random order. Target height shrinks as the number of targets grows (1 target keeps full size) so all targets fit with gaps between them.
- The number of shapes comes from the `Shapes` setting. They are laid out row by row in a grid of up to 3 columns (e.g. 3 shapes = 1 row, 4 = 2 rows, 8 = 3 rows) with gaps so they don't overlap. The grid is vertically centered, a partial last row is left-aligned, and the first column is always nearest the screen edge. Shape size and gaps shrink to fit small screens.
- The child drags each shape with a finger to the target line; a shape disappears only when dropped on its own target (matching color, form, or both, per `Match`). If it overlaps several targets, the one with the largest bounding-box overlap counts; on slot targets (Shape, Color & Shape) the shape must also cover at least 50% of the smaller of shape and slot. A shape dropped on a wrong target (or anywhere else) just stays where it was dropped, with no feedback.
- When the last shape has been delivered, the game is completed.

## Reward behavior

- When the game is finished, a reward overlay appears.
- The reward screen plays a local video from the `videos/` folder.
- Reward duration is configurable in Settings via `Reward Seconds`.
- `Reward Seconds` accepts values from 1 to 20.
- `Shapes` accepts values from 1 to 9 (number of shapes shown per round).
- `Colors` accepts values from 1 to 4 and must not exceed `Shapes` (default 1).
- `Forms` accepts values from 1 to 4 (default 1).
- `Match` is Color, Shape or Color & Shape (default Color; old saved settings load as Color).
- Saving requires `Shapes` ≥ number of targets: Color: `Colors`; Shape and Color & Shape: max(`Colors`, `Forms`). Stored settings that break this fall back to defaults.
- The reward remains visible for the configured duration after video playback starts, then the game auto-restarts.
- The game tracks completion count in memory and advances the reward playback by configured intervals between completions.

## UX details

- App-like fullscreen button is available.
- Settings button is available to the left of the fullscreen button.
- Fullscreen overlay display is supported.
- Drag hit-area is expanded for easier grabbing.
- Target line is thicker and larger for easier visual focus.

## Local reward videos

- The reward video is stored as 10-second clips in `public/videos/clips/reward-NNN.mp4` (H.264 720×400, ~0.47 Mbps, mono 64 kbps AAC, ~0.5–1.4 MB each), listed in the generated `src/logic/rewardClips.manifest.ts`.
- Regenerate the clips and the manifest from a source video with `scripts/encode-reward-video.sh <source> [start-seconds] [end-seconds]` (requires ffmpeg and ffprobe). The optional start/end points trim the source; the current clips use 29.27–382.35 s, which skips the studio logo, the theme song and the end credits.
- Each reward plays the window `[completionCount × Reward Seconds, + Reward Seconds)` of the full video (wrapping at the end), whatever the setting is: it starts in the matching clip at the right offset and moves on to the next clip seamlessly.
- While the child plays a round, the clips the next reward needs are downloaded into memory, and the first one is loaded into the hidden video player, so the reward starts instantly. If they aren't ready in time, the clip streams from the network instead.
- A poster frame (`public/videos/reward-poster.jpg`) shows until playback starts.
- In production builds a service worker (`public/sw.js`) keeps every clip it has fetched, plus the poster, on the device. Later rewards and repeat visits play them without the network. The cache is named after the clips' content hash (`REWARD_CLIPS_VERSION`), so regenerated clips replace the old cache.
- Reward playback uses **Tap to start video** on all devices.
- Settings are saved in local storage.

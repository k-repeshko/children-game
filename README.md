# iPad Game

## Game concept

- Full-screen white background.
- A large game piece (box) and a thick target line are shown in the play area.
- The piece and target line are always the same random rainbow color.
- The piece starts on either the left or right side at random, and the target line appears on the opposite side.
- The child drags the piece with a finger to the target line.
- When the piece touches the line, the game is completed.

## Reward behavior

- When the game is finished, a reward overlay appears.
- The reward screen plays a local video from the `videos/` folder.
- Reward duration is configurable in Settings via `Reward Seconds`.
- `Reward Seconds` accepts values from 1 to 20.
- `Shapes` accepts values from 1 to 9 (reserved for future gameplay logic).
- The reward remains visible for the configured duration after video playback starts, then the game auto-restarts.
- The game tracks completion count in memory and advances the reward playback by configured intervals between completions.

## UX details

- App-like fullscreen button is available.
- Settings button is available to the left of the fullscreen button.
- Fullscreen overlay display is supported.
- Drag hit-area is expanded for easier grabbing.
- Target line is thicker and larger for easier visual focus.

## Local reward videos

- Reward video path: `public/videos/reward.m4v`
- Video is played locally by the browser from `/videos/*`.
- Reward playback uses **Tap to start video** on all devices.
- Settings are saved in local storage.

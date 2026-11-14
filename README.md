# iPad Game

## Game concept

- Full-screen white background.
- A big red square and a thick red target line are shown in the game area.
- The square starts on either the left or right side at random, and the target line appears on the opposite side.
- The child drags the square with a finger to the target line.
- When the square touches the line, the game is completed.

## Reward behavior

- When the game is finished, a reward overlay appears.
- The reward screen plays a local video from the `videos/` folder, with a fallback flower video if needed.
- The reward remains visible for 20 seconds, then the game auto-restarts.
- The app tracks how many times the game has been completed and advances the reward playback by 20-second intervals between completions.

## UX details

- Fullscreen button is available for app-like presentation.
- Fullscreen overlay display is supported.
- Drag hit-area is expanded so the square is easier to grab.
- The target line is thicker and larger for easier visual focus.

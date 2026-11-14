# iPad Game

## Game concept

- Full-screen white background.
- Big red square starts on the left.
- Thick red vertical target line on the right.
- Child drags the red square with finger to the target line.
- When square touches the line, the game is completed.

## Reward behavior

- A random Smeshariki `.mov` video is shown as reward.
- Videos are loaded from the `videos/` folder:
  - `smeshariki-01.mov`
  - `smeshariki-2.mov`
  - `smeshariki-3.mov`
- If a reward video fails, a fallback flower video is used.
- The reward screen stays visible for 10 seconds, then the game auto-restarts.

## UX details

- App-like fullscreen button exists.
- Overlay/video now renders correctly in fullscreen.
- Drag hit-area is expanded to make grabbing easier.
- Target line is thicker/larger for easier visual focus.

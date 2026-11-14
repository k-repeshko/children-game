# iPad Game

## Game concept

- Full-screen white background.
- A large game piece and a thick target line are shown in the play area.
- The piece and target line are always the same random rainbow color.
- The piece starts on either the left or right side at random, and the target line appears on the opposite side.
- The child drags the piece with a finger to the target line.
- When the piece touches the line, the game is completed.

## Reward behavior

- When the game is finished, a reward overlay appears.
- The reward screen plays a local video from the `videos/` folder.
- If the reward video fails, a fallback flower video is used.
- The reward remains visible for 10 seconds, then the game auto-restarts.
- The game tracks completion count in memory and advances the reward playback by 20-second intervals between completions.

## UX details

- App-like fullscreen button is available.
- Fullscreen overlay display is supported.
- Drag hit-area is expanded for easier grabbing.
- Target line is thicker and larger for easier visual focus.

## Ideas

### Multiple pieces
check read me to understand how current game works
make the following update:
on the left of Full Screen button have a Settings button
Settings button opens Settings page (a page, not a modal window)
Settings page has an input for number of "Pieces"
Settings page has a save button
save button saves json with settings like this { "pieces": 2 }  to local storage
every time game opens it reads settings
game shows pieces according to settings
target is still the only one
all pieces have same color, and target too
after all pieces are moved to the target the game is finished and reward is opened
a piece which is moved to the target disapears, so it will not distract a child from moving another piece
Do not commit changes until I approve and test, don't forget to update readme
# iPad Game

## Game concept

- Full-screen white background.
- A large game shape (box) and a thick target line are shown in the play area.
- The shape and target line are always the same random rainbow color.
- The shape starts on either the left or right side at random, and the target line appears on the opposite side.
- The child drags the shape with a finger to the target line.
- When the shape touches the line, the game is completed.

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

- The reward video is stored as 10-second clips in `public/videos/clips/reward-NNN.mp4` (H.264 720×400, ~0.47 Mbps, mono 64 kbps AAC, ~0.5–1.4 MB each), listed in the generated `src/logic/rewardClips.manifest.ts`.
- Regenerate the clips and the manifest from a source video with `scripts/encode-reward-video.sh <source>` (requires ffmpeg and ffprobe).
- Each reward plays the window `[completionCount × Reward Seconds, + Reward Seconds)` of the full video (wrapping at the end), whatever the setting is: it starts in the matching clip at the right offset and moves on to the next clip seamlessly.
- While the child plays a round, the clips the next reward needs are downloaded into memory, and the first one is loaded into the hidden video player, so the reward starts instantly. If they aren't ready in time, the clip streams from the network instead.
- A poster frame (`public/videos/reward-poster.jpg`) shows until playback starts.
- In production builds a service worker (`public/sw.js`) keeps every clip it has fetched, plus the poster, on the device. Later rewards and repeat visits play them without the network. The cache is named after the clips' content hash (`REWARD_CLIPS_VERSION`), so regenerated clips replace the old cache.
- Reward playback uses **Tap to start video** on all devices.
- Settings are saved in local storage.

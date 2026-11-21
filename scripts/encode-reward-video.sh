#!/usr/bin/env bash
# Re-encodes a source cartoon into the compact reward video used by the game.
# Usage: scripts/encode-reward-video.sh <source-video> [output]  (needs ffmpeg on PATH or $FFMPEG)
set -euo pipefail

FFMPEG="${FFMPEG:-ffmpeg}"
SRC="${1:?usage: $0 <source-video> [output]}"
OUT="${2:-public/videos/reward.mp4}"

# H.264 (plays everywhere, incl. iPad Safari and desktop browsers), tuned for flat-color animation.
# Keyframes are forced every 2 s so seeks are cheap and the file can be cut on 10 s boundaries.
# Mono 64 kbps AAC is plenty for cartoon audio on a tablet speaker.
"$FFMPEG" -hide_banner -y -i "$SRC" \
  -c:v libx264 -preset veryslow -tune animation -crf 28 -profile:v high -pix_fmt yuv420p \
  -force_key_frames 'expr:gte(t,n_forced*2)' \
  -c:a aac -b:a 64k -ac 1 \
  -movflags +faststart \
  "$OUT"

import { REWARD_CLIPS, REWARD_CLIP_SECONDS } from './rewardClips.manifest'

/**
 * The reward video is split into fixed-length clips (see scripts/encode-reward-video.sh).
 * A reward covers the window [startSeconds, startSeconds + rewardSeconds) of the full video;
 * these helpers map that window onto clips and download them ahead of time as blob URLs, so
 * playback starts from memory instead of the network.
 */

const CLIPS_BASE_URL = `${import.meta.env.BASE_URL}videos/clips/`
// Enough for the current reward plus the next one; older blob URLs are revoked.
const MAX_CACHED_CLIPS = 8

export const REWARD_CLIP_COUNT = REWARD_CLIPS.length
export const REWARD_TOTAL_SECONDS = REWARD_CLIPS.reduce((sum, clip) => sum + clip.duration, 0)

export type RewardClipStep = {
  /** Clip index in REWARD_CLIPS. */
  index: number
  /** Where to start inside the clip, in seconds. */
  offset: number
}

/** Clips needed to play `rewardSeconds` starting at `startSeconds` (wrapping past the end). */
export function planRewardClips(startSeconds: number, rewardSeconds: number): RewardClipStep[] {
  const start = ((startSeconds % REWARD_TOTAL_SECONDS) + REWARD_TOTAL_SECONDS) % REWARD_TOTAL_SECONDS
  const firstIndex = Math.min(Math.floor(start / REWARD_CLIP_SECONDS), REWARD_CLIP_COUNT - 1)
  const firstOffset = start - firstIndex * REWARD_CLIP_SECONDS

  const steps: RewardClipStep[] = [{ index: firstIndex, offset: firstOffset }]
  let covered = REWARD_CLIPS[firstIndex].duration - firstOffset
  while (covered < rewardSeconds && steps.length < REWARD_CLIP_COUNT) {
    const index = (steps[steps.length - 1].index + 1) % REWARD_CLIP_COUNT
    steps.push({ index, offset: 0 })
    covered += REWARD_CLIPS[index].duration
  }
  return steps
}

export function nextRewardClipIndex(index: number): number {
  return (index + 1) % REWARD_CLIP_COUNT
}

export function getRewardClipNetworkUrl(index: number): string {
  return CLIPS_BASE_URL + REWARD_CLIPS[index].file
}

// index -> blob URL promise, in least-recently-used order (Map keeps insertion order).
const clipCache = new Map<number, Promise<string | null>>()

function touch(index: number, entry: Promise<string | null>) {
  clipCache.delete(index)
  clipCache.set(index, entry)
}

function evictOldClips() {
  while (clipCache.size > MAX_CACHED_CLIPS) {
    const [oldestIndex, oldestEntry] = clipCache.entries().next().value!
    clipCache.delete(oldestIndex)
    void oldestEntry.then((url) => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    })
  }
}

/** Downloads a clip into memory once; resolves to a blob URL, or null if the download failed. */
export function loadRewardClip(index: number): Promise<string | null> {
  const cached = clipCache.get(index)
  if (cached) {
    touch(index, cached)
    return cached
  }

  const entry = fetch(getRewardClipNetworkUrl(index))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      return response.blob()
    })
    .then((blob) => URL.createObjectURL(blob))
    .catch((error: unknown) => {
      console.warn(`Failed to prefetch reward clip ${index}.`, error)
      // Forget the failure so a later call can retry.
      if (clipCache.get(index) === entry) {
        clipCache.delete(index)
      }
      return null
    })

  touch(index, entry)
  evictOldClips()
  return entry
}

/** Downloads clips one after another, in order, so the first one is ready as soon as possible. */
export async function prefetchRewardClips(indices: number[]): Promise<void> {
  for (const index of indices) {
    await loadRewardClip(index)
  }
}

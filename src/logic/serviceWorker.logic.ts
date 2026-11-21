import { REWARD_CLIPS_VERSION } from './rewardClips.manifest'

/**
 * Registers public/sw.js, which caches the reward clips and poster on the device so repeat
 * rewards (and repeat visits) play without the network. The clip version is in the script URL,
 * so new clips install a new worker with a fresh cache.
 *
 * Only in production builds: in dev, Vite serves files that change often, and a cache-first
 * worker would hide those changes.
 */
export function registerRewardCacheWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    return
  }

  const base = import.meta.env.BASE_URL
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${base}sw.js?v=${REWARD_CLIPS_VERSION}`, { scope: base })
      .catch((error: unknown) => {
        console.warn('Failed to register the reward cache service worker.', error)
      })
  })
}

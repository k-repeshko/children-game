// Service worker that keeps reward video clips (and the poster) on the device.
// Registered from src/logic/serviceWorker.logic.ts as `sw.js?v=<REWARD_CLIPS_VERSION>`;
// a new clip version gets a fresh cache and the old ones are deleted.

const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev'
const CACHE_PREFIX = 'reward-videos-'
const CACHE_NAME = CACHE_PREFIX + VERSION
const VIDEOS_PATH = new URL('videos/', self.registration.scope).pathname

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(
        names
          .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') {
    return
  }
  const url = new URL(request.url)
  if (url.origin !== self.location.origin || !url.pathname.startsWith(VIDEOS_PATH)) {
    return
  }

  event.respondWith(respondFromCache(request))
})

async function respondFromCache(request) {
  const cache = await caches.open(CACHE_NAME)
  // Match on the URL only, so a Range request finds the full cached file.
  const cached = await cache.match(request.url)
  const range = request.headers.get('range')

  if (cached) {
    return range ? sliceRange(cached, range) : cached
  }

  if (range) {
    // A <video> streaming a clip that isn't cached yet: pass the partial request through, and
    // download the whole file in the background so it's cached next time.
    void cacheFullFile(cache, request.url)
    return fetch(request)
  }

  const response = await fetch(request)
  if (response.ok && response.status === 200) {
    await cache.put(request.url, response.clone())
  }
  return response
}

async function cacheFullFile(cache, url) {
  try {
    const response = await fetch(url)
    if (response.ok && response.status === 200) {
      await cache.put(url, response)
    }
  } catch {
    // Offline or failed: try again on the next request.
  }
}

// Safari requires 206 responses with exact byte ranges for <video> playback.
async function sliceRange(response, rangeHeader) {
  const blob = await response.blob()
  const size = blob.size
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim())
  if (!match || (match[1] === '' && match[2] === '')) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })
  }

  let start
  let end
  if (match[1] === '') {
    // Suffix range: the last N bytes.
    start = Math.max(size - Number(match[2]), 0)
    end = size - 1
  } else {
    start = Number(match[1])
    end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1)
  }
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })
  }

  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
    },
  })
}

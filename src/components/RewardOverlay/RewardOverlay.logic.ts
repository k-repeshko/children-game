import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  getRewardClipNetworkUrl,
  loadRewardClip,
  nextRewardClipIndex,
  planRewardClips,
  prefetchRewardClips,
} from '../../logic/rewardClips.logic'

const REWARD_POSTER_SOURCE = `${import.meta.env.BASE_URL}videos/reward-poster.jpg`

type UseRewardOverlayLogicInput = {
  visible: boolean
  startSeconds: number
  rewardSeconds: number
  onPlaybackStarted: () => void
}

export type RewardOverlayProps = UseRewardOverlayLogicInput

type UseRewardOverlayLogicResult = {
  videoRef: RefObject<HTMLVideoElement | null>
  posterPath: string
  showManualPlayButton: boolean
  manualPlayButtonLabel: string
  onManualPlay: () => void
  onVideoLoaded: () => void
  onVideoPlaying: () => void
  onVideoEnded: () => void
}

type LoadedClip = {
  index: number
  offset: number
}

export function buildRewardOverlayProps(input: UseRewardOverlayLogicInput): RewardOverlayProps {
  return { ...input }
}

export function useRewardOverlayLogic({
  visible,
  startSeconds,
  rewardSeconds,
  onPlaybackStarted,
}: UseRewardOverlayLogicInput): UseRewardOverlayLogicResult {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [showManualPlayButton, setShowManualPlayButton] = useState(false)
  // Clip currently assigned to the <video>, and the in-clip offset to seek to once it loads.
  const loadedClipRef = useRef<LoadedClip | null>(null)
  const pendingOffsetRef = useRef(0)
  // Bumped on every clip switch so stale async loads don't overwrite a newer one.
  const loadTokenRef = useRef(0)

  const plan = useMemo(
    () => planRewardClips(startSeconds, rewardSeconds),
    [startSeconds, rewardSeconds],
  )
  const firstStep = plan[0]

  const assignClip = useCallback((index: number, url: string, offset: number) => {
    const element = videoRef.current
    if (!element) {
      return
    }

    loadedClipRef.current = { index, offset }
    pendingOffsetRef.current = offset
    element.src = url
  }, [])

  const playElement = useCallback(() => {
    const element = videoRef.current
    if (!element) {
      return
    }

    void element
      .play()
      .then(() => {
        onPlaybackStarted()
      })
      .catch(() => {
        setShowManualPlayButton(true)
      })
  }, [onPlaybackStarted])

  // Pause when the overlay hides; show the play button when it opens.
  useEffect(() => {
    if (visible) {
      setShowManualPlayButton(true)
      return
    }

    videoRef.current?.pause()
    setShowManualPlayButton(false)
  }, [visible])

  // Between rewards, download the clips the next reward needs and load its first clip into the
  // (hidden) <video>, so the reward plays from memory the moment it opens.
  useEffect(() => {
    if (visible) {
      return
    }

    const token = ++loadTokenRef.current
    const { index, offset } = firstStep
    void loadRewardClip(index).then((url) => {
      if (token === loadTokenRef.current) {
        assignClip(index, url ?? getRewardClipNetworkUrl(index), offset)
      }
    })
    void prefetchRewardClips(plan.map((step) => step.index))
  }, [visible, plan, firstStep, assignClip])

  const startPlayback = useCallback(() => {
    setShowManualPlayButton(false)

    // The prefetch hasn't finished yet: stream the clip from the network instead. This must
    // happen synchronously inside the tap, because iPad Safari only allows play() from a gesture.
    const loaded = loadedClipRef.current
    if (!loaded || loaded.index !== firstStep.index || loaded.offset !== firstStep.offset) {
      loadTokenRef.current += 1
      assignClip(firstStep.index, getRewardClipNetworkUrl(firstStep.index), firstStep.offset)
    }

    playElement()
  }, [assignClip, firstStep, playElement])

  const onVideoLoaded = useCallback(() => {
    const element = videoRef.current
    const offset = pendingOffsetRef.current
    pendingOffsetRef.current = 0
    if (element && offset > 0) {
      element.currentTime = offset
    }
  }, [])

  const onVideoPlaying = useCallback(() => {
    onPlaybackStarted()
  }, [onPlaybackStarted])

  // A clip finished mid-reward: continue with the next one on the same element (which the
  // first tap already unlocked for playback) and keep one clip downloaded ahead.
  const onVideoEnded = useCallback(() => {
    const loaded = loadedClipRef.current
    if (!visible || !loaded) {
      return
    }

    const nextIndex = nextRewardClipIndex(loaded.index)
    const token = ++loadTokenRef.current
    void loadRewardClip(nextIndex).then((url) => {
      if (token !== loadTokenRef.current) {
        return
      }
      assignClip(nextIndex, url ?? getRewardClipNetworkUrl(nextIndex), 0)
      playElement()
    })
    void loadRewardClip(nextRewardClipIndex(nextIndex))
  }, [visible, assignClip, playElement])

  return {
    videoRef,
    posterPath: REWARD_POSTER_SOURCE,
    showManualPlayButton,
    manualPlayButtonLabel: 'Play video',
    onManualPlay: startPlayback,
    onVideoLoaded,
    onVideoPlaying,
    onVideoEnded,
  }
}

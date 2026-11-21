import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

const PRIMARY_REWARD_SOURCE = `${import.meta.env.BASE_URL}videos/reward.m4v`
const REWARD_POSTER_SOURCE = `${import.meta.env.BASE_URL}videos/reward-poster.jpg`

type UseRewardOverlayLogicInput = {
  visible: boolean
  startSeconds: number
  onPlaybackStarted: () => void
}

export type RewardOverlayProps = UseRewardOverlayLogicInput

type UseRewardOverlayLogicResult = {
  videoRef: RefObject<HTMLVideoElement | null>
  sourcePath: typeof PRIMARY_REWARD_SOURCE
  posterPath: string
  showManualPlayButton: boolean
  manualPlayButtonLabel: string
  onManualPlay: () => void
  onVideoLoaded: () => void
  onVideoPlaying: () => void
}

type BuildRewardOverlayPropsInput = {
  visible: boolean
  startSeconds: number
  onPlaybackStarted: () => void
}

export function buildRewardOverlayProps({
  visible,
  startSeconds,
  onPlaybackStarted,
}: BuildRewardOverlayPropsInput): RewardOverlayProps {
  return {
    visible,
    startSeconds,
    onPlaybackStarted,
  }
}

export function useRewardOverlayLogic({
  visible,
  startSeconds,
  onPlaybackStarted,
}: UseRewardOverlayLogicInput): UseRewardOverlayLogicResult {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [showManualPlayButton, setShowManualPlayButton] = useState(false)

  const startPlayback = useCallback(() => {
    const element = videoRef.current
    if (!element) {
      return
    }

    setShowManualPlayButton(false)
    void element
      .play()
      .then(() => {
        onPlaybackStarted()
      })
      .catch(() => {
        setShowManualPlayButton(true)
      })
  }, [onPlaybackStarted])

  const seekToStart = useCallback(() => {
    const element = videoRef.current
    if (!element || element.readyState < HTMLMediaElement.HAVE_METADATA) {
      return
    }

    const duration = element.duration
    const effectiveStart =
      Number.isFinite(duration) && duration > 0 ? startSeconds % duration : 0
    if (Math.abs(element.currentTime - effectiveStart) > 0.25) {
      element.currentTime = effectiveStart
    }
  }, [startSeconds])

  // The <video> stays mounted between rewards, so while the overlay is hidden
  // we park it at the upcoming start position and let it buffer from there.
  useEffect(() => {
    if (visible) {
      setShowManualPlayButton(true)
      return
    }

    videoRef.current?.pause()
    setShowManualPlayButton(false)
    seekToStart()
  }, [visible, seekToStart])

  const onVideoLoaded = useCallback(() => {
    seekToStart()
  }, [seekToStart])

  const onVideoPlaying = useCallback(() => {
    onPlaybackStarted()
  }, [onPlaybackStarted])

  return {
    videoRef,
    sourcePath: PRIMARY_REWARD_SOURCE,
    posterPath: REWARD_POSTER_SOURCE,
    showManualPlayButton,
    manualPlayButtonLabel: 'Play video',
    onManualPlay: startPlayback,
    onVideoLoaded,
    onVideoPlaying,
  }
}

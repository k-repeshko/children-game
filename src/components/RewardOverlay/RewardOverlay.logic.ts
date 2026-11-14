import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

const PRIMARY_REWARD_SOURCE = '/videos/reward.m4v'

type UseRewardOverlayLogicInput = {
  visible: boolean
  startSeconds: number
  onPlaybackStarted: () => void
}

export type RewardOverlayProps = UseRewardOverlayLogicInput

type UseRewardOverlayLogicResult = {
  videoRef: RefObject<HTMLVideoElement | null>
  sourcePath: typeof PRIMARY_REWARD_SOURCE
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
    onPlaybackStarted()
    void element
      .play()
      .then(() => {
        onPlaybackStarted()
      })
      .catch(() => undefined)
  }, [onPlaybackStarted])

  useEffect(() => {
    if (!visible) {
      const element = videoRef.current
      if (element) {
        element.pause()
      }
      setShowManualPlayButton(false)
      return
    }

    setShowManualPlayButton(true)
  }, [visible])

  const onVideoLoaded = useCallback(() => {
    if (!visible) {
      return
    }

    const element = videoRef.current
    if (!element) {
      return
    }

    const duration = element.duration
    const effectiveStart =
      Number.isFinite(duration) && duration > 0 ? startSeconds % duration : 0
    element.currentTime = effectiveStart
  }, [visible, startSeconds])

  const onVideoPlaying = useCallback(() => {
    onPlaybackStarted()
  }, [onPlaybackStarted])

  return {
    videoRef,
    sourcePath: PRIMARY_REWARD_SOURCE,
    showManualPlayButton,
    manualPlayButtonLabel: 'Play video',
    onManualPlay: startPlayback,
    onVideoLoaded,
    onVideoPlaying,
  }
}

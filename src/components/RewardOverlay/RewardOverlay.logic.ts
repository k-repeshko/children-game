import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

const PRIMARY_REWARD_SOURCE = '/videos/reward.mov'

type UseRewardOverlayLogicInput = {
  visible: boolean
  startSeconds: number
}

export type RewardOverlayProps = UseRewardOverlayLogicInput

type UseRewardOverlayLogicResult = {
  videoRef: RefObject<HTMLVideoElement | null>
  sourcePath: typeof PRIMARY_REWARD_SOURCE
  showNativeControls: boolean
  showManualPlayButton: boolean
  manualPlayButtonText: string
  onManualPlay: () => void
  onVideoLoaded: () => void
  onVideoCanPlay: () => void
  onVideoPlaying: () => void
}

type BuildRewardOverlayPropsInput = {
  visible: boolean
  startSeconds: number
}

export function buildRewardOverlayProps({
  visible,
  startSeconds,
}: BuildRewardOverlayPropsInput): RewardOverlayProps {
  return {
    visible,
    startSeconds,
  }
}

export function useRewardOverlayLogic({
  visible,
  startSeconds,
}: UseRewardOverlayLogicInput): UseRewardOverlayLogicResult {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isTouchPlayback = window.matchMedia('(pointer: coarse)').matches
  const [showManualPlayButton, setShowManualPlayButton] = useState(false)

  const startPlayback = useCallback(() => {
    const element = videoRef.current
    if (!element) {
      return
    }

    const playAttempt = element.play()
    if (!playAttempt) {
      setShowManualPlayButton(false)
      return
    }

    void playAttempt
      .then(() => {
        setShowManualPlayButton(false)
      })
      .catch(() => {
        setShowManualPlayButton(true)
      })
  }, [])

  useEffect(() => {
    if (!visible) {
      setShowManualPlayButton(false)
      return
    }

    if (isTouchPlayback) {
      setShowManualPlayButton(true)
    }
  }, [visible, isTouchPlayback])

  const onVideoLoaded = useCallback(() => {
    const element = videoRef.current
    if (!element) {
      return
    }

    const duration = element.duration
    const effectiveStart =
      Number.isFinite(duration) && duration > 0 ? startSeconds % duration : 0
    element.currentTime = effectiveStart

    if (isTouchPlayback) {
      return
    }

    startPlayback()
  }, [isTouchPlayback, startSeconds, startPlayback])

  const onVideoCanPlay = useCallback(() => {
    if (isTouchPlayback) {
      return
    }

    startPlayback()
  }, [isTouchPlayback, startPlayback])

  const onVideoPlaying = useCallback(() => {
    setShowManualPlayButton(false)
  }, [])

  return {
    videoRef,
    sourcePath: PRIMARY_REWARD_SOURCE,
    showNativeControls: isTouchPlayback,
    showManualPlayButton,
    manualPlayButtonText: 'Tap to start video',
    onManualPlay: startPlayback,
    onVideoLoaded,
    onVideoCanPlay,
    onVideoPlaying,
  }
}

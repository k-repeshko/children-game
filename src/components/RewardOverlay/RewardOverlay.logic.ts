import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

const PRIMARY_REWARD_SOURCE = '/videos/reward.m4v'

type UseRewardOverlayLogicInput = {
  visible: boolean
  startSeconds: number
}

export type RewardOverlayProps = UseRewardOverlayLogicInput

type UseRewardOverlayLogicResult = {
  videoRef: RefObject<HTMLVideoElement | null>
  sourcePath: typeof PRIMARY_REWARD_SOURCE
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
  const [hasUnlockedPlayback, setHasUnlockedPlayback] = useState(false)
  const [showManualPlayButton, setShowManualPlayButton] = useState(false)

  const startPlayback = useCallback((isUserInitiated: boolean) => {
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
        if (isUserInitiated) {
          setHasUnlockedPlayback(true)
        }
        setShowManualPlayButton(false)
      })
      .catch(() => {
        setShowManualPlayButton(true)
      })
  }, [])

  useEffect(() => {
    if (!visible) {
      const element = videoRef.current
      if (element) {
        element.pause()
      }
      setShowManualPlayButton(false)
      return
    }

    if (isTouchPlayback && !hasUnlockedPlayback) {
      setShowManualPlayButton(true)
    }
  }, [visible, isTouchPlayback, hasUnlockedPlayback])

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

    if (isTouchPlayback && !hasUnlockedPlayback) {
      return
    }

    startPlayback(false)
  }, [visible, isTouchPlayback, hasUnlockedPlayback, startSeconds, startPlayback])

  const onVideoCanPlay = useCallback(() => {
    if (!visible) {
      return
    }

    if (isTouchPlayback && !hasUnlockedPlayback) {
      return
    }

    startPlayback(false)
  }, [visible, isTouchPlayback, hasUnlockedPlayback, startPlayback])

  const onVideoPlaying = useCallback(() => {
    setShowManualPlayButton(false)
  }, [])

  return {
    videoRef,
    sourcePath: PRIMARY_REWARD_SOURCE,
    showManualPlayButton,
    manualPlayButtonText: 'Tap to start video',
    onManualPlay: () => {
      startPlayback(true)
    },
    onVideoLoaded,
    onVideoCanPlay,
    onVideoPlaying,
  }
}

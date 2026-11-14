import { useCallback, useEffect, useRef } from 'react'
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

  const startPlayback = useCallback(() => {
    const element = videoRef.current
    if (!element) {
      return
    }

    void element.play().catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!visible) {
      const element = videoRef.current
      if (element) {
        element.pause()
      }
      return
    }
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

  return {
    videoRef,
    sourcePath: PRIMARY_REWARD_SOURCE,
    showManualPlayButton: visible,
    manualPlayButtonText: 'Tap to start video',
    onManualPlay: startPlayback,
    onVideoLoaded,
  }
}

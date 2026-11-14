import { useCallback, useRef } from 'react'
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
  startSeconds,
}: UseRewardOverlayLogicInput): UseRewardOverlayLogicResult {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const onVideoLoaded = useCallback(() => {
    const element = videoRef.current
    if (!element) {
      return
    }

    const maxStart = Number.isFinite(element.duration)
      ? Math.max(element.duration - 1, 0)
      : startSeconds
    const effectiveStart = Math.min(startSeconds, maxStart)
    element.currentTime = effectiveStart
    void element.play().catch(() => undefined)
  }, [startSeconds])

  return {
    videoRef,
    sourcePath: PRIMARY_REWARD_SOURCE,
    onVideoLoaded,
  }
}

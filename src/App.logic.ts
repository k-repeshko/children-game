import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFullscreenButtonLogic } from './components/FullscreenButton/FullscreenButton.logic'
import {
  useGameBoardLogic,
  type GameBoardProps,
} from './components/GameBoard/GameBoard.logic'
import {
  type RewardOverlayProps,
  buildRewardOverlayProps,
} from './components/RewardOverlay/RewardOverlay.logic'
import { REWARD_STEP_SECONDS } from './logic/game.constants'
import { createGameRound, type GameRound } from './logic/round.logic'

type UseAppLogicResult = {
  completionCount: number
  gameBoardProps: GameBoardProps
  rewardOverlayProps: RewardOverlayProps
  fullscreenButtonProps: ReturnType<typeof useFullscreenButtonLogic>
}

export function useAppLogic(): UseAppLogicResult {
  const [progress, setProgress] = useState({
    completionCount: 0,
    rewardStartSeconds: 0,
  })
  const [isRewardVisible, setIsRewardVisible] = useState(false)
  const [isRewardPlaybackStarted, setIsRewardPlaybackStarted] = useState(false)
  const [round, setRound] = useState<GameRound>(() => createGameRound())
  const [roundIndex, setRoundIndex] = useState(0)
  const completionLockedRef = useRef(false)

  const handleRoundComplete = useCallback(() => {
    if (completionLockedRef.current || isRewardVisible) {
      return
    }

    completionLockedRef.current = true
    setProgress((current) => ({
      completionCount: current.completionCount + 1,
      rewardStartSeconds: current.completionCount * REWARD_STEP_SECONDS,
    }))
    setIsRewardPlaybackStarted(false)
    setIsRewardVisible(true)
  }, [isRewardVisible, isRewardPlaybackStarted])

  const handleRewardPlaybackStarted = useCallback(() => {
    if (!isRewardVisible) {
      return
    }

    setIsRewardPlaybackStarted(true)
  }, [isRewardVisible])

  useEffect(() => {
    if (!isRewardVisible) {
      completionLockedRef.current = false
      return
    }

    if (!isRewardPlaybackStarted) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsRewardVisible(false)
      setIsRewardPlaybackStarted(false)
      setRound(createGameRound())
      setRoundIndex((current) => current + 1)
      completionLockedRef.current = false
    }, REWARD_STEP_SECONDS * 1000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isRewardVisible])

  const gameBoardProps = useGameBoardLogic({
    color: round.color,
    pieceSide: round.pieceSide,
    targetSide: round.targetSide,
    resetToken: roundIndex,
    disabled: isRewardVisible,
    onSuccess: handleRoundComplete,
  })
  const rewardOverlayProps = useMemo(
    () =>
      buildRewardOverlayProps({
        visible: isRewardVisible,
        startSeconds: progress.rewardStartSeconds,
        onPlaybackStarted: handleRewardPlaybackStarted,
      }),
    [isRewardVisible, progress.rewardStartSeconds, handleRewardPlaybackStarted],
  )
  const fullscreenButtonProps = useFullscreenButtonLogic()

  return {
    completionCount: progress.completionCount,
    gameBoardProps,
    rewardOverlayProps,
    fullscreenButtonProps,
  }
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFullscreenButtonLogic } from './components/FullscreenButton/FullscreenButton.logic'
import {
  useGameBoardLogic,
  type GameBoardProps,
} from './components/GameBoard/GameBoard.logic'
import type { RewardOverlayProps } from './components/RewardOverlay/RewardOverlay.logic'
import type { SettingsPageProps } from './components/SettingsPage/SettingsPage.logic'
import { useSettingsButtonLogic } from './components/SettingsButton/SettingsButton.logic'
import type { MatchMode } from './logic/game.constants'
import { createGameRound, type GameRound } from './logic/round.logic'
import {
  loadGameSettings,
  MAX_COLORS,
  MAX_FORMS,
  MIN_FORMS,
  parseFormsInput,
  MAX_SHAPES,
  MIN_COLORS,
  MAX_REWARD_SECONDS,
  MIN_SHAPES,
  parseColorsInput,
  parseShapesInput,
  isShapeCountEnough,
  getRequiredShapes,
  parseRewardSecondsInput,
  saveGameSettings,
} from './logic/settings.logic'

type UseAppLogicResult = {
  completionCount: number
  gameBoardProps: GameBoardProps
  rewardOverlayProps: RewardOverlayProps
  settingsPageProps: SettingsPageProps
  settingsButtonProps: ReturnType<typeof useSettingsButtonLogic>
  fullscreenButtonProps: ReturnType<typeof useFullscreenButtonLogic>
}

export function useAppLogic(): UseAppLogicResult {
  const navigate = useNavigate()
  const location = useLocation()
  const [settings, setSettings] = useState(() => loadGameSettings())
  const rewardSeconds = settings.rewardSeconds
  const [rewardSecondsInput, setRewardSecondsInput] = useState(() => String(rewardSeconds))
  const [shapesInput, setShapesInput] = useState(() => String(settings.shapes))
  const [colorsInput, setColorsInput] = useState(() => String(settings.colors))
  const [formsInput, setFormsInput] = useState(() => String(settings.forms))
  const [matchInput, setMatchInput] = useState<MatchMode>(() => settings.match)
  const [settingsErrorMessage, setSettingsErrorMessage] = useState<string | null>(null)
  const [progress, setProgress] = useState({
    completionCount: 0,
    rewardStartSeconds: 0,
  })
  const [isRewardVisible, setIsRewardVisible] = useState(false)
  const [round, setRound] = useState<GameRound>(() => createGameRound(settings.shapes, settings.colors, settings.forms, settings.match))
  const [roundIndex, setRoundIndex] = useState(0)
  const [previousPathname, setPreviousPathname] = useState(location.pathname)
  const completionLockedRef = useRef(false)
  const rewardCloseTimeoutRef = useRef<number | null>(null)

  // Route changes are handled during render (not in an effect) so state updates don't cascade.
  if (previousPathname !== location.pathname) {
    setPreviousPathname(location.pathname)
    if (location.pathname === '/settings') {
      setIsRewardVisible(false)
      setRewardSecondsInput(String(rewardSeconds))
      setShapesInput(String(settings.shapes))
      setColorsInput(String(settings.colors))
      setFormsInput(String(settings.forms))
      setMatchInput(settings.match)
      setSettingsErrorMessage(null)
    } else if (previousPathname === '/settings' && location.pathname === '/') {
      setIsRewardVisible(false)
      setRound(createGameRound(settings.shapes, settings.colors, settings.forms, settings.match))
      setRoundIndex((current) => current + 1)
    }
  }

  const clearRewardCloseTimeout = useCallback(() => {
    if (rewardCloseTimeoutRef.current !== null) {
      window.clearTimeout(rewardCloseTimeoutRef.current)
      rewardCloseTimeoutRef.current = null
    }
  }, [])

  const closeRewardRound = useCallback(() => {
    clearRewardCloseTimeout()
    setIsRewardVisible(false)
    setRound(createGameRound(settings.shapes, settings.colors, settings.forms, settings.match))
    setRoundIndex((current) => current + 1)
    completionLockedRef.current = false
  }, [clearRewardCloseTimeout, settings.shapes, settings.colors, settings.forms, settings.match])

  const handleRoundComplete = useCallback(() => {
    if (completionLockedRef.current || isRewardVisible) {
      return
    }

    clearRewardCloseTimeout()
    completionLockedRef.current = true
    setProgress((current) => ({
      completionCount: current.completionCount + 1,
      rewardStartSeconds: current.completionCount * rewardSeconds,
    }))
    setIsRewardVisible(true)
  }, [clearRewardCloseTimeout, isRewardVisible, rewardSeconds])

  const handleRewardPlaybackStarted = useCallback(() => {
    if (!isRewardVisible || rewardCloseTimeoutRef.current !== null) {
      return
    }

    rewardCloseTimeoutRef.current = window.setTimeout(() => {
      closeRewardRound()
    }, rewardSeconds * 1000)
  }, [closeRewardRound, isRewardVisible, rewardSeconds])

  const onRewardSecondsInputChange = useCallback((value: string) => {
    setRewardSecondsInput(value)
    setSettingsErrorMessage(null)
  }, [])

  const onShapesInputChange = useCallback((value: string) => {
    setShapesInput(value)
    setSettingsErrorMessage(null)
  }, [])

  const onColorsInputChange = useCallback((value: string) => {
    setColorsInput(value)
    setSettingsErrorMessage(null)
  }, [])

  const onFormsInputChange = useCallback((value: string) => {
    setFormsInput(value)
    setSettingsErrorMessage(null)
  }, [])

  const onMatchInputChange = useCallback((value: MatchMode) => {
    setMatchInput(value)
    setSettingsErrorMessage(null)
  }, [])

  const onSaveSettings = useCallback(() => {
    const parsedRewardSeconds = parseRewardSecondsInput(rewardSecondsInput)
    if (parsedRewardSeconds === null) {
      setSettingsErrorMessage(
        `Reward Seconds must be a whole number from 1 to ${MAX_REWARD_SECONDS}.`,
      )
      return
    }
    const parsedShapes = parseShapesInput(shapesInput)
    if (parsedShapes === null) {
      setSettingsErrorMessage(`Shapes must be a whole number from ${MIN_SHAPES} to ${MAX_SHAPES}.`)
      return
    }

    const parsedColors = parseColorsInput(colorsInput, parsedShapes)
    if (parsedColors === null) {
      setSettingsErrorMessage(
        `Colors must be a whole number from ${MIN_COLORS} to ${MAX_COLORS} and not more than Shapes.`,
      )
      return
    }

    const parsedForms = parseFormsInput(formsInput)
    if (parsedForms === null) {
      setSettingsErrorMessage(`Forms must be a whole number from ${MIN_FORMS} to ${MAX_FORMS}.`)
      return
    }

    const nextSettings = {
      rewardSeconds: parsedRewardSeconds,
      shapes: parsedShapes,
      colors: parsedColors,
      forms: parsedForms,
      match: matchInput,
    }
    if (!isShapeCountEnough(nextSettings)) {
      setSettingsErrorMessage(
        `Shapes must be at least ${getRequiredShapes(matchInput, parsedColors, parsedForms)} for this Match mode, Colors and Forms.`,
      )
      return
    }

    try {
      saveGameSettings(nextSettings)
    } catch (error) {
      console.error('Failed to save game settings.', error)
      setSettingsErrorMessage('Failed to save settings. Please try again.')
      return
    }

    setSettings(nextSettings)
    setSettingsErrorMessage(null)
    navigate('/')
  }, [colorsInput, formsInput, matchInput, navigate, rewardSecondsInput, shapesInput])

  useEffect(() => {
    if (!isRewardVisible) {
      completionLockedRef.current = false
      clearRewardCloseTimeout()
    }
  }, [clearRewardCloseTimeout, isRewardVisible])

  useEffect(() => {
    return () => {
      clearRewardCloseTimeout()
    }
  }, [clearRewardCloseTimeout])

  const gameBoardProps = useGameBoardLogic({
    targets: round.targets,
    match: settings.match,
    shapeColors: round.shapeColors,
    shapeForms: round.shapeForms,
    shapeCount: settings.shapes,
    shapeSide: round.shapeSide,
    targetSide: round.targetSide,
    resetToken: roundIndex,
    disabled: isRewardVisible,
    onSuccess: handleRoundComplete,
  })
  // While the overlay is hidden, point it at the next reward's start so it can buffer ahead.
  const rewardStartSeconds = isRewardVisible
    ? progress.rewardStartSeconds
    : progress.completionCount * rewardSeconds
  const rewardOverlayProps = useMemo(
    () =>
      ({
        visible: isRewardVisible,
        startSeconds: rewardStartSeconds,
        rewardSeconds,
        onPlaybackStarted: handleRewardPlaybackStarted,
      }),
    [isRewardVisible, rewardStartSeconds, rewardSeconds, handleRewardPlaybackStarted],
  )
  const fullscreenButtonProps = useFullscreenButtonLogic()
  const settingsButtonProps = useSettingsButtonLogic()
  const settingsPageProps = useMemo(
    () => ({
      rewardSecondsInput,
      maxRewardSeconds: MAX_REWARD_SECONDS,
      shapesInput,
      minShapes: MIN_SHAPES,
      maxShapes: MAX_SHAPES,
      colorsInput,
      minColors: MIN_COLORS,
      maxColors: MAX_COLORS,
      formsInput,
      minForms: MIN_FORMS,
      maxForms: MAX_FORMS,
      matchInput,
      errorMessage: settingsErrorMessage,
      onRewardSecondsInputChange,
      onShapesInputChange,
      onColorsInputChange,
      onFormsInputChange,
      onMatchInputChange,
      onSave: onSaveSettings,
    }),
    [
      onRewardSecondsInputChange,
      onShapesInputChange,
      onColorsInputChange,
      onFormsInputChange,
      onMatchInputChange,
      onSaveSettings,
      matchInput,
      rewardSecondsInput,
      colorsInput,
      formsInput,
      shapesInput,
      settingsErrorMessage,
    ],
  )

  return {
    completionCount: progress.completionCount,
    gameBoardProps,
    rewardOverlayProps,
    settingsPageProps,
    settingsButtonProps,
    fullscreenButtonProps,
  }
}

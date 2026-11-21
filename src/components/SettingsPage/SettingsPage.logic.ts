import type { MatchMode } from '../../logic/game.constants'

export type SettingsPageProps = {
  rewardSecondsInput: string
  maxRewardSeconds: number
  shapesInput: string
  minShapes: number
  maxShapes: number
  colorsInput: string
  minColors: number
  maxColors: number
  formsInput: string
  minForms: number
  maxForms: number
  matchInput: MatchMode
  errorMessage: string | null
  onRewardSecondsInputChange: (value: string) => void
  onShapesInputChange: (value: string) => void
  onColorsInputChange: (value: string) => void
  onFormsInputChange: (value: string) => void
  onMatchInputChange: (value: MatchMode) => void
  onSave: () => void
}

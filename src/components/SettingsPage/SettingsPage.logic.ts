export type SettingsPageProps = {
  rewardSecondsInput: string
  maxRewardSeconds: number
  shapesInput: string
  minShapes: number
  maxShapes: number
  colorsInput: string
  minColors: number
  maxColors: number
  errorMessage: string | null
  onRewardSecondsInputChange: (value: string) => void
  onShapesInputChange: (value: string) => void
  onColorsInputChange: (value: string) => void
  onSave: () => void
}

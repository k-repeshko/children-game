export type SettingsPageProps = {
  rewardSecondsInput: string
  maxRewardSeconds: number
  shapesInput: string
  minShapes: number
  maxShapes: number
  errorMessage: string | null
  onRewardSecondsInputChange: (value: string) => void
  onShapesInputChange: (value: string) => void
  onSave: () => void
}

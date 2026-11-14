export type SettingsPageProps = {
  rewardSecondsInput: string
  maxRewardSeconds: number
  errorMessage: string | null
  onRewardSecondsInputChange: (value: string) => void
  onSave: () => void
}

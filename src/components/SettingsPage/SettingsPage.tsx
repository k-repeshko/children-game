import { Button, FieldError, NumberField, Page } from '../../ui'
import { type SettingsPageProps } from './SettingsPage.logic'

export function SettingsPage({
  rewardSecondsInput,
  maxRewardSeconds,
  shapesInput,
  minShapes,
  maxShapes,
  errorMessage,
  onRewardSecondsInputChange,
  onShapesInputChange,
  onSave,
}: SettingsPageProps) {
  return (
    <Page title="Settings" actions={<Button onClick={onSave}>Save</Button>}>
      <NumberField
        label="Reward Seconds"
        min={1}
        max={maxRewardSeconds}
        value={rewardSecondsInput}
        onChange={onRewardSecondsInputChange}
      />
      <NumberField
        label="Shapes"
        min={minShapes}
        max={maxShapes}
        value={shapesInput}
        onChange={onShapesInputChange}
      />
      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
    </Page>
  )
}

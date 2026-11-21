import { Button, FieldError, NumberField, Page } from '../../ui'
import { type SettingsPageProps } from './SettingsPage.logic'

export function SettingsPage({
  rewardSecondsInput,
  maxRewardSeconds,
  shapesInput,
  minShapes,
  maxShapes,
  colorsInput,
  minColors,
  maxColors,
  formsInput,
  minForms,
  maxForms,
  errorMessage,
  onRewardSecondsInputChange,
  onShapesInputChange,
  onColorsInputChange,
  onFormsInputChange,
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
      <NumberField
        label="Colors"
        min={minColors}
        max={maxColors}
        value={colorsInput}
        onChange={onColorsInputChange}
      />
      <NumberField
        label="Forms"
        min={minForms}
        max={maxForms}
        value={formsInput}
        onChange={onFormsInputChange}
      />
      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
    </Page>
  )
}

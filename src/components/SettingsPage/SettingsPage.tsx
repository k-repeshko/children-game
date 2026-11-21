import type { MatchMode } from '../../logic/game.constants'
import { Button, FieldError, NumberField, Page, SelectField } from '../../ui'
import { type SettingsPageProps } from './SettingsPage.logic'

const MATCH_LABELS: readonly { value: MatchMode; label: string }[] = [
  { value: 'color', label: 'Color' },
  { value: 'shape', label: 'Shape' },
  { value: 'both', label: 'Color & Shape' },
]

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
  matchInput,
  errorMessage,
  onRewardSecondsInputChange,
  onShapesInputChange,
  onColorsInputChange,
  onFormsInputChange,
  onMatchInputChange,
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
      <SelectField
        label="Match"
        value={matchInput}
        options={MATCH_LABELS}
        onChange={(value) => {
          onMatchInputChange(value as MatchMode)
        }}
      />
      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
    </Page>
  )
}

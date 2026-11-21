import './SettingsPage.scss'
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
    <section className="settings-page" aria-label="Settings">
      <h1 className="settings-title">Settings</h1>
      <label className="settings-field">
        <span className="settings-label">Reward Seconds</span>
        <input
          className="settings-input"
          type="number"
          min={1}
          max={maxRewardSeconds}
          step={1}
          value={rewardSecondsInput}
          onChange={(event) => {
            onRewardSecondsInputChange(event.target.value)
          }}
        />
      </label>
      <label className="settings-field">
        <span className="settings-label">Shapes</span>
        <input
          className="settings-input"
          type="number"
          min={minShapes}
          max={maxShapes}
          step={1}
          value={shapesInput}
          onChange={(event) => {
            onShapesInputChange(event.target.value)
          }}
        />
      </label>
      {errorMessage ? <p className="settings-error">{errorMessage}</p> : null}
      <button type="button" className="settings-save-button" onClick={onSave}>
        Save
      </button>
    </section>
  )
}

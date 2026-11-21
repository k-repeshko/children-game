import './SettingsButton.scss'
import type { SettingsButtonProps } from './SettingsButton.logic'

export function SettingsButton({ isVisible, onOpenSettings, title }: SettingsButtonProps) {
  if (!isVisible) {
    return null
  }

  return (
    <button type="button" className="settings-button" onClick={onOpenSettings}>
      {title}
    </button>
  )
}

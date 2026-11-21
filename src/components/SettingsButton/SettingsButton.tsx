import { Button } from '../../ui'
import type { SettingsButtonProps } from './SettingsButton.logic'

export function SettingsButton({ isVisible, onOpenSettings, title }: SettingsButtonProps) {
  if (!isVisible) {
    return null
  }

  return <Button onClick={onOpenSettings}>{title}</Button>
}

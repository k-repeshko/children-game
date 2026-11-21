import { Button } from '../../ui'
import type { FullscreenButtonProps } from './FullscreenButton.logic'

export function FullscreenButton({
  isSupported,
  isFullscreen,
  onToggleFullscreen,
  title,
}: FullscreenButtonProps) {
  if (!isSupported) {
    return null
  }

  return (
    <Button onClick={onToggleFullscreen} aria-pressed={isFullscreen}>
      {title}
    </Button>
  )
}

import './FullscreenButton.scss'
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
    <button
      type="button"
      className="fullscreen-button"
      onClick={onToggleFullscreen}
      aria-pressed={isFullscreen}
    >
      {title}
    </button>
  )
}

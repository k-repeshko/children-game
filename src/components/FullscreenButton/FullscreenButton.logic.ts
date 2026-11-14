import { useMemo } from 'react'
import { useFullscreenLogic } from '../../logic/fullscreen.logic'

export type FullscreenButtonProps = {
  isSupported: boolean
  isFullscreen: boolean
  onToggleFullscreen: () => void
  title: string
}

export function useFullscreenButtonLogic(): FullscreenButtonProps {
  const { isSupported, isFullscreen, toggleFullscreen } = useFullscreenLogic()

  return useMemo(
    () => ({
      isSupported,
      isFullscreen,
      onToggleFullscreen: toggleFullscreen,
      title: isFullscreen ? 'Exit fullscreen' : 'Fullscreen',
    }),
    [isSupported, isFullscreen, toggleFullscreen],
  )
}

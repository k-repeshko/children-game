import { useCallback, useEffect, useState } from 'react'

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element
  webkitExitFullscreen?: () => Promise<void>
}

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>
}

type UseFullscreenLogicResult = {
  isSupported: boolean
  isFullscreen: boolean
  toggleFullscreen: () => void
}

function getFullscreenElement(currentDocument: FullscreenDocument): Element | null {
  return currentDocument.fullscreenElement ?? currentDocument.webkitFullscreenElement ?? null
}

export function useFullscreenLogic(): UseFullscreenLogicResult {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const currentDocument = document as FullscreenDocument
    const updateState = () => {
      setIsFullscreen(Boolean(getFullscreenElement(currentDocument)))
    }

    updateState()
    currentDocument.addEventListener('fullscreenchange', updateState)
    currentDocument.addEventListener('webkitfullscreenchange', updateState)

    return () => {
      currentDocument.removeEventListener('fullscreenchange', updateState)
      currentDocument.removeEventListener('webkitfullscreenchange', updateState)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    const currentDocument = document as FullscreenDocument
    const rootElement = currentDocument.documentElement as FullscreenElement
    const fullscreenElement = getFullscreenElement(currentDocument)

    if (fullscreenElement) {
      if (currentDocument.exitFullscreen) {
        void currentDocument.exitFullscreen()
        return
      }

      if (currentDocument.webkitExitFullscreen) {
        void currentDocument.webkitExitFullscreen()
      }
      return
    }

    if (rootElement.requestFullscreen) {
      void rootElement.requestFullscreen()
      return
    }

    if (rootElement.webkitRequestFullscreen) {
      void rootElement.webkitRequestFullscreen()
    }
  }, [])

  return {
    isSupported: Boolean(
      document.documentElement.requestFullscreen ||
        (document.documentElement as FullscreenElement).webkitRequestFullscreen,
    ),
    isFullscreen,
    toggleFullscreen,
  }
}

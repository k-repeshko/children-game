import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export type SettingsButtonProps = {
  isVisible: boolean
  onOpenSettings: () => void
  title: string
}

export function useSettingsButtonLogic(): SettingsButtonProps {
  const navigate = useNavigate()
  const location = useLocation()

  const onOpenSettings = useCallback(() => {
    navigate('/settings')
  }, [navigate])

  return useMemo(
    () => ({
      isVisible: location.pathname !== '/settings',
      onOpenSettings,
      title: 'Settings',
    }),
    [location.pathname, onOpenSettings],
  )
}

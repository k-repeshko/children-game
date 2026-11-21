import './App.scss'
import { Routes, Route } from 'react-router-dom'
import { FullscreenButton } from './components/FullscreenButton/FullscreenButton'
import { GameBoard } from './components/GameBoard/GameBoard'
import { RewardOverlay } from './components/RewardOverlay/RewardOverlay'
import { SettingsButton } from './components/SettingsButton/SettingsButton'
import { SettingsPage } from './components/SettingsPage/SettingsPage'
import { useAppLogic } from './App.logic'
import { Badge, Corner } from './ui'

function App() {
  const {
    completionCount,
    gameBoardProps,
    rewardOverlayProps,
    settingsPageProps,
    settingsButtonProps,
    fullscreenButtonProps,
  } = useAppLogic()

  return (
    <main className="app">
      <Corner position="top-right">
        <SettingsButton {...settingsButtonProps} />
        <FullscreenButton {...fullscreenButtonProps} />
      </Corner>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Corner position="top-left">
                <Badge aria-live="polite">Completed: {completionCount}</Badge>
              </Corner>
              <GameBoard {...gameBoardProps} />
              <RewardOverlay {...rewardOverlayProps} />
            </>
          }
        />
        <Route path="/settings" element={<SettingsPage {...settingsPageProps} />} />
      </Routes>
    </main>
  )
}

export default App

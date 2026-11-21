import './App.scss'
import { Routes, Route } from 'react-router-dom'
import { FullscreenButton } from './components/FullscreenButton/FullscreenButton'
import { GameBoard } from './components/GameBoard/GameBoard'
import { RewardOverlay } from './components/RewardOverlay/RewardOverlay'
import { SettingsButton } from './components/SettingsButton/SettingsButton'
import { SettingsPage } from './components/SettingsPage/SettingsPage'
import { useAppLogic } from './App.logic'

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
      <div className="top-actions">
        <SettingsButton {...settingsButtonProps} />
        <FullscreenButton {...fullscreenButtonProps} />
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="status" aria-live="polite">
                Completed: {completionCount}
              </div>
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

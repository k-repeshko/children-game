import './App.css'
import { FullscreenButton } from './components/FullscreenButton/FullscreenButton'
import { GameBoard } from './components/GameBoard/GameBoard'
import { RewardOverlay } from './components/RewardOverlay/RewardOverlay'
import { useAppLogic } from './App.logic'

function App() {
  const {
    completionCount,
    gameBoardProps,
    rewardOverlayProps,
    fullscreenButtonProps,
  } = useAppLogic()

  return (
    <main className="app">
      <FullscreenButton {...fullscreenButtonProps} />
      <div className="status" aria-live="polite">
        Completed: {completionCount}
      </div>
      <GameBoard {...gameBoardProps} />
      <RewardOverlay {...rewardOverlayProps} />
    </main>
  )
}

export default App

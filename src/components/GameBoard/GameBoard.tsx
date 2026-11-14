import './GameBoard.css'
import type { GameBoardProps } from './GameBoard.logic'

export function GameBoard({
  boardRef,
  targetStyle,
  pieceStyle,
  hitAreaStyle,
  isDisabled,
  onPiecePointerDown,
  onPiecePointerMove,
  onPiecePointerUp,
}: GameBoardProps) {
  return (
    <section ref={boardRef} className="game-board" aria-label="Game board">
      <div className="target-line" style={targetStyle} aria-hidden="true" />
      <button
        type="button"
        className="piece"
        style={pieceStyle}
        disabled={isDisabled}
        aria-label="Drag piece to the line"
        onPointerDown={onPiecePointerDown}
        onPointerMove={onPiecePointerMove}
        onPointerUp={onPiecePointerUp}
      >
        <span className="piece-hit-area" style={hitAreaStyle} aria-hidden="true" />
      </button>
    </section>
  )
}

import './GameBoard.scss'
import type { GameBoardProps } from './GameBoard.logic'

export function GameBoard({
  boardRef,
  targetStyle,
  shapeStyle,
  hitAreaStyle,
  isDisabled,
  onShapePointerDown,
  onShapePointerMove,
  onShapePointerUp,
}: GameBoardProps) {
  return (
    <section ref={boardRef} className="game-board" aria-label="Game board">
      <div className="target-line" style={targetStyle} aria-hidden="true" />
      <button
        type="button"
        className="shape"
        style={shapeStyle}
        disabled={isDisabled}
        aria-label="Drag shape to the line"
        onPointerDown={onShapePointerDown}
        onPointerMove={onShapePointerMove}
        onPointerUp={onShapePointerUp}
      >
        <span className="shape-hit-area" style={hitAreaStyle} aria-hidden="true" />
      </button>
    </section>
  )
}

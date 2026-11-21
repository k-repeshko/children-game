import './GameBoard.scss'
import type { GameBoardProps } from './GameBoard.logic'

export function GameBoard({
  boardRef,
  targets,
  shapes,
  hitAreaStyle,
  isDisabled,
}: GameBoardProps) {
  return (
    <section ref={boardRef} className="game-board" aria-label="Game board">
      {targets.map(({ key, style }) => (
        <div key={key} className="target-line" style={style} aria-hidden="true" />
      ))}
      {shapes.map(({ key, style, onPointerDown, onPointerMove, onPointerUp }) => (
        <button
          key={key}
          type="button"
          className="shape"
          style={style}
          disabled={isDisabled}
          aria-label="Drag shape to the line"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <span className="shape-hit-area" style={hitAreaStyle} aria-hidden="true" />
        </button>
      ))}
    </section>
  )
}

import './GameBoard.scss'
import type { ShapeForm } from '../../logic/game.constants'
import {
  SHAPE_FORM_STROKE,
  STAR_POINTS,
  TRIANGLE_POINTS,
} from '../../logic/shapeForms.logic'
import type { GameBoardProps } from './GameBoard.logic'

function ShapeFormGraphic({ form }: { form: ShapeForm }) {
  const outline = {
    fill: 'currentColor',
    stroke: 'currentColor',
    strokeWidth: SHAPE_FORM_STROKE,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg className="shape-graphic" viewBox="0 0 100 100" aria-hidden="true">
      {form === 'square' ? <rect width="100" height="100" rx="23" fill="currentColor" /> : null}
      {form === 'circle' ? <circle cx="50" cy="50" r="50" fill="currentColor" /> : null}
      {form === 'triangle' ? <polygon points={TRIANGLE_POINTS} {...outline} /> : null}
      {form === 'star' ? <polygon points={STAR_POINTS} {...outline} /> : null}
    </svg>
  )
}

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
      {shapes.map(({ key, form, style, onPointerDown, onPointerMove, onPointerUp }) => (
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
          <ShapeFormGraphic form={form} />
          <span className="shape-hit-area" style={hitAreaStyle} aria-hidden="true" />
        </button>
      ))}
    </section>
  )
}

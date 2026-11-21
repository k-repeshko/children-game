import './GameBoard.scss'
import type { ShapeForm } from '../../logic/game.constants'
import {
  SHAPE_FORM_STROKE,
  STAR_POINTS,
  TRIANGLE_POINTS,
} from '../../logic/shapeForms.logic'
import type { GameBoardProps } from './GameBoard.logic'

function ShapeFormGraphic({
  form,
  className = 'shape-graphic',
  dashed = false,
}: {
  form: ShapeForm
  className?: string
  dashed?: boolean
}) {
  // Dashed: an unfilled outline (target slot) in the same geometry as the filled shape.
  const outline = dashed
    ? {
        // Translucent fill so the slot reads as a target, not just a dashed line.
        fill: 'currentColor',
        fillOpacity: 0.22,
        stroke: 'currentColor',
        strokeWidth: 4,
        strokeDasharray: '9 7',
        strokeLinejoin: 'round' as const,
      }
    : {
        fill: 'currentColor',
        stroke: 'currentColor',
        strokeWidth: SHAPE_FORM_STROKE,
        strokeLinejoin: 'round' as const,
      }

  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      {form === 'square' ? <rect width="100" height="100" rx="23" {...(dashed ? outline : { fill: 'currentColor' })} /> : null}
      {form === 'circle' ? <circle cx="50" cy="50" r="50" {...(dashed ? outline : { fill: 'currentColor' })} /> : null}
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
      {targets.map(({ key, form, style }) =>
        form === null ? (
          <div key={key} className="target-line" style={style} aria-hidden="true" />
        ) : (
          <div key={key} className="target-slot" style={style} aria-hidden="true">
            <ShapeFormGraphic form={form} className="target-slot-graphic" dashed />
          </div>
        ),
      )}
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

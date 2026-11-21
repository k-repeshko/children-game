import {
  BOARD_EDGE_GAP,
  SHAPE_GRID_COLUMNS,
  SHAPE_GRID_GAP,
  SHAPE_GRID_TARGET_CLEARANCE,
  SHAPE_SIZE,
  TARGET_WIDTH,
} from './game.constants'
import type { Side } from './round.logic'

export type Point = {
  x: number
  y: number
}

export type BoardSize = {
  width: number
  height: number
}

export type ShapeGridLayout = {
  size: number
  centers: Point[]
}

/**
 * Lays `count` shapes out row-major in a grid of up to 3 columns, anchored to
 * `shapeSide` (column 0 is nearest that screen edge) and vertically centered.
 * Size and gap shrink together when the board is too small for the full size.
 */
export function getShapeGridLayout(
  count: number,
  shapeSide: Side,
  board: BoardSize,
): ShapeGridLayout {
  const columns = Math.min(count, SHAPE_GRID_COLUMNS)
  const rows = Math.ceil(count / SHAPE_GRID_COLUMNS)

  // Total grid extent in units of shape size, with the gap proportional to it.
  const gapRatio = SHAPE_GRID_GAP / SHAPE_SIZE
  const unitsWide = columns + (columns - 1) * gapRatio
  const unitsTall = rows + (rows - 1) * gapRatio

  const availableWidth =
    board.width - 2 * BOARD_EDGE_GAP - TARGET_WIDTH - SHAPE_GRID_TARGET_CLEARANCE
  const availableHeight = board.height - 2 * BOARD_EDGE_GAP

  const size = Math.max(
    1,
    Math.min(SHAPE_SIZE, availableWidth / unitsWide, availableHeight / unitsTall),
  )
  const gap = size * gapRatio
  const step = size + gap
  const top = (board.height - (rows * size + (rows - 1) * gap)) / 2

  const centers: Point[] = []
  for (let index = 0; index < count; index += 1) {
    const column = index % SHAPE_GRID_COLUMNS
    const row = Math.floor(index / SHAPE_GRID_COLUMNS)
    const offset = BOARD_EDGE_GAP + size / 2 + column * step
    centers.push({
      x: shapeSide === 'left' ? offset : board.width - offset,
      y: top + size / 2 + row * step,
    })
  }

  return { size, centers }
}

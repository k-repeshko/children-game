import {
  BOARD_EDGE_GAP,
  TARGET_GAP,
  TARGET_HEIGHT,
  TARGET_STACK_HEIGHT,
  TARGET_STACK_MARGIN,
  TARGET_WIDTH,
} from './game.constants'
import type { Side } from './round.logic'

export type Rect = {
  left: number
  top: number
  width: number
  height: number
}

export type Size = {
  width: number
  height: number
}

// Targets are stacked evenly and centered; each target shrinks as the count grows.
export function getTargetRects(count: number, targetSide: Side, size: Size): Rect[] {
  const left = targetSide === 'left' ? BOARD_EDGE_GAP : size.width - BOARD_EDGE_GAP - TARGET_WIDTH
  const stackHeight =
    count <= 1
      ? TARGET_HEIGHT
      : Math.min(TARGET_STACK_HEIGHT, size.height - 2 * TARGET_STACK_MARGIN)
  const height = Math.max(0, (stackHeight - (count - 1) * TARGET_GAP) / count)
  const top = (size.height - stackHeight) / 2

  return Array.from({ length: count }, (_, index) => ({
    left,
    top: top + index * (height + TARGET_GAP),
    width: TARGET_WIDTH,
    height,
  }))
}

function overlapArea(a: Rect, b: Rect): number {
  const width = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left)
  const height = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top)
  return width > 0 && height > 0 ? width * height : 0
}

// Index of the target with the largest overlap with the shape, or null if none overlaps.
export function findOverlappedTarget(shape: Rect, targets: readonly Rect[]): number | null {
  let best: number | null = null
  let bestArea = 0
  targets.forEach((target, index) => {
    const area = overlapArea(shape, target)
    if (area > bestArea) {
      best = index
      bestArea = area
    }
  })
  return best
}

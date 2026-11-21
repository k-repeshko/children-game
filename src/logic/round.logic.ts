import { getRandomRainbowColors, shuffle } from './rainbow.logic'

export type Side = 'left' | 'right'

export type GameRound = {
  // One target per color, in top-to-bottom stacking order.
  targetColors: string[]
  // One color per shape; every entry of targetColors appears at least once.
  shapeColors: string[]
  shapeSide: Side
  targetSide: Side
}

function getRandomSide(): Side {
  return Math.random() > 0.5 ? 'left' : 'right'
}

function getOppositeSide(side: Side): Side {
  return side === 'left' ? 'right' : 'left'
}

// Assumes 1 <= palette.length <= shapeCount (enforced by settings validation).
export function assignShapeColors(palette: readonly string[], shapeCount: number): string[] {
  const extras = Array.from(
    { length: Math.max(0, shapeCount - palette.length) },
    () => palette[Math.floor(Math.random() * palette.length)],
  )
  return shuffle([...palette, ...extras]).slice(0, Math.max(shapeCount, 0))
}

export function createGameRound(shapeCount: number, colorCount: number): GameRound {
  const shapeSide = getRandomSide()
  const palette = getRandomRainbowColors(colorCount)

  return {
    targetColors: shuffle(palette),
    shapeColors: assignShapeColors(palette, shapeCount),
    shapeSide,
    targetSide: getOppositeSide(shapeSide),
  }
}

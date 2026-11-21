import { SHAPE_FORMS, type ShapeForm } from './game.constants'
import { getRandomRainbowColors, shuffle } from './rainbow.logic'

export type Side = 'left' | 'right'

export type GameRound = {
  // One target per color, in top-to-bottom stacking order.
  targetColors: string[]
  // One color per shape; every entry of targetColors appears at least once.
  shapeColors: string[]
  // One form per shape, picked independently from the round's chosen forms.
  shapeForms: ShapeForm[]
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

export function assignShapeForms(formCount: number, shapeCount: number): ShapeForm[] {
  const chosen = shuffle([...SHAPE_FORMS]).slice(0, formCount)
  return Array.from(
    { length: Math.max(shapeCount, 0) },
    () => chosen[Math.floor(Math.random() * chosen.length)],
  )
}

export function createGameRound(
  shapeCount: number,
  colorCount: number,
  formCount: number,
): GameRound {
  const shapeSide = getRandomSide()
  const palette = getRandomRainbowColors(colorCount)

  return {
    targetColors: shuffle(palette),
    shapeColors: assignShapeColors(palette, shapeCount),
    shapeForms: assignShapeForms(formCount, shapeCount),
    shapeSide,
    targetSide: getOppositeSide(shapeSide),
  }
}

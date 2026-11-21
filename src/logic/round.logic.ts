import { SHAPE_FORMS, type MatchMode, type ShapeForm } from './game.constants'
import { getRandomRainbowColors, shuffle } from './rainbow.logic'

export type Side = 'left' | 'right'

// A target accepts shapes whose color and form equal its own; null means "any" (the target
// does not care about that property).
export type Target = {
  color: string | null
  form: ShapeForm | null
}

export type GameRound = {
  // In top-to-bottom stacking order. Every target receives at least one shape.
  targets: Target[]
  // One color / form per shape; every shape is accepted by exactly one target.
  shapeColors: string[]
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

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function targetAccepts(target: Target, color: string, form: ShapeForm): boolean {
  return (
    (target.color === null || target.color === color) &&
    (target.form === null || target.form === form)
  )
}

// Every item appears at least once, the rest are random picks; shuffled.
// Assumes 1 <= items.length <= count (enforced by settings validation).
function spreadAcross<T>(items: readonly T[], count: number): T[] {
  const extras = Array.from({ length: Math.max(0, count - items.length) }, () => pickRandom(items))
  return shuffle([...items, ...extras]).slice(0, Math.max(count, 0))
}

// Shapes with a random form from the chosen set (a chosen form may go unused).
function assignRandomForms(chosen: readonly ShapeForm[], shapeCount: number): ShapeForm[] {
  return Array.from({ length: Math.max(shapeCount, 0) }, () => pickRandom(chosen))
}

// N = max(colors, forms) distinct pairs that use every color and every form. One of the two
// lists has no repeats, so the pairs are distinct.
function createPairs(
  colors: readonly string[],
  forms: readonly ShapeForm[],
): { color: string; form: ShapeForm }[] {
  const count = Math.max(colors.length, forms.length)
  const pairColors = spreadAcross(colors, count)
  const pairForms = spreadAcross(forms, count)
  return pairColors.map((color, index) => ({ color, form: pairForms[index] }))
}

export function createGameRound(
  shapeCount: number,
  colorCount: number,
  formCount: number,
  match: MatchMode,
): GameRound {
  const shapeSide = getRandomSide()
  const palette = getRandomRainbowColors(colorCount)
  const forms = shuffle([...SHAPE_FORMS]).slice(0, formCount)
  const sides = { shapeSide, targetSide: getOppositeSide(shapeSide) }

  if (match === 'shape') {
    return {
      ...sides,
      targets: forms.map((form) => ({ color: null, form })),
      shapeColors: spreadAcross(palette, shapeCount),
      shapeForms: spreadAcross(forms, shapeCount),
    }
  }

  if (match === 'both') {
    const pairs = createPairs(palette, forms)
    const shapePairs = spreadAcross(pairs, shapeCount)
    return {
      ...sides,
      targets: pairs.map(({ color, form }) => ({ color, form })),
      shapeColors: shapePairs.map((pair) => pair.color),
      shapeForms: shapePairs.map((pair) => pair.form),
    }
  }

  return {
    ...sides,
    targets: palette.map((color) => ({ color, form: null })),
    shapeColors: spreadAcross(palette, shapeCount),
    shapeForms: assignRandomForms(forms, shapeCount),
  }
}

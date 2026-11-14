import { getRandomRainbowColor } from './rainbow.logic'

export type Side = 'left' | 'right'

export type GameRound = {
  color: string
  shapeSide: Side
  targetSide: Side
}

function getRandomSide(): Side {
  return Math.random() > 0.5 ? 'left' : 'right'
}

function getOppositeSide(side: Side): Side {
  return side === 'left' ? 'right' : 'left'
}

export function createGameRound(): GameRound {
  const shapeSide = getRandomSide()

  return {
    color: getRandomRainbowColor(),
    shapeSide,
    targetSide: getOppositeSide(shapeSide),
  }
}

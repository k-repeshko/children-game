import { getRandomRainbowColor } from './rainbow.logic'

export type Side = 'left' | 'right'

export type GameRound = {
  color: string
  pieceSide: Side
  targetSide: Side
}

function getRandomSide(): Side {
  return Math.random() > 0.5 ? 'left' : 'right'
}

function getOppositeSide(side: Side): Side {
  return side === 'left' ? 'right' : 'left'
}

export function createGameRound(): GameRound {
  const pieceSide = getRandomSide()

  return {
    color: getRandomRainbowColor(),
    pieceSide,
    targetSide: getOppositeSide(pieceSide),
  }
}

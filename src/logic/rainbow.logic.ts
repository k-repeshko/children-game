const RAINBOW_COLORS = [
  '#ff3b30',
  '#ff9500',
  '#ffcc00',
  '#34c759',
  '#30b0c7',
  '#007aff',
  '#af52de',
] as const

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

// Returns `count` distinct rainbow colors in random order.
export function getRandomRainbowColors(count: number): string[] {
  return shuffle(RAINBOW_COLORS).slice(0, count)
}

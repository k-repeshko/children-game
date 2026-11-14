const RAINBOW_COLORS = [
  '#ff3b30',
  '#ff9500',
  '#ffcc00',
  '#34c759',
  '#30b0c7',
  '#007aff',
  '#af52de',
] as const

export function getRandomRainbowColor(): string {
  const randomIndex = Math.floor(Math.random() * RAINBOW_COLORS.length)
  return RAINBOW_COLORS[randomIndex]
}

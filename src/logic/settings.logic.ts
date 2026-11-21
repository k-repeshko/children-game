import { REWARD_STEP_SECONDS } from './game.constants'

const SETTINGS_STORAGE_KEY = 'game-settings'
export const MAX_REWARD_SECONDS = 20
export const MIN_SHAPES = 1
export const MAX_SHAPES = 9
export const MIN_COLORS = 1
export const MAX_COLORS = 4

export type GameSettings = {
  rewardSeconds: number
  shapes: number
  colors: number
}

function isValidRewardSeconds(value: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= MAX_REWARD_SECONDS
}

function isValidShapes(value: number): boolean {
  return Number.isInteger(value) && value >= MIN_SHAPES && value <= MAX_SHAPES
}

function isValidColors(value: number, shapes: number): boolean {
  return Number.isInteger(value) && value >= MIN_COLORS && value <= MAX_COLORS && value <= shapes
}

export function getDefaultSettings(): GameSettings {
  return {
    rewardSeconds: REWARD_STEP_SECONDS,
    shapes: MIN_SHAPES,
    colors: MIN_COLORS,
  }
}

export function loadGameSettings(): GameSettings {
  const defaults = getDefaultSettings()

  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!stored) {
      return defaults
    }

    const parsed = JSON.parse(stored) as Partial<GameSettings>
    const rewardSeconds = parsed.rewardSeconds
    const shapes = parsed.shapes
    // Settings saved before colors existed have no value: treat as 1 color.
    const colors = parsed.colors ?? MIN_COLORS
    if (
      typeof rewardSeconds !== 'number' ||
      !isValidRewardSeconds(rewardSeconds) ||
      typeof shapes !== 'number' ||
      !isValidShapes(shapes) ||
      typeof colors !== 'number' ||
      !isValidColors(colors, shapes)
    ) {
      console.warn('Invalid stored settings. Falling back to default settings.')
      return defaults
    }

    return {
      rewardSeconds,
      shapes,
      colors,
    }
  } catch (error) {
    console.error('Failed to load game settings from local storage.', error)
    return defaults
  }
}

export function saveGameSettings(settings: GameSettings): void {
  if (!isValidRewardSeconds(settings.rewardSeconds)) {
    throw new Error('Reward seconds must be a positive integer.')
  }
  if (!isValidShapes(settings.shapes)) {
    throw new Error(`Shapes must be an integer from ${MIN_SHAPES} to ${MAX_SHAPES}.`)
  }

  if (!isValidColors(settings.colors, settings.shapes)) {
    throw new Error(
      `Colors must be an integer from ${MIN_COLORS} to ${MAX_COLORS} and not exceed shapes.`,
    )
  }

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

export function parseRewardSecondsInput(input: string): number | null {
  const normalized = input.trim()
  if (!normalized) {
    return null
  }

  const numeric = Number(normalized)
  if (!isValidRewardSeconds(numeric)) {
    return null
  }

  return numeric
}

export function parseShapesInput(input: string): number | null {
  const normalized = input.trim()
  if (!normalized) {
    return null
  }

  const numeric = Number(normalized)
  if (!isValidShapes(numeric)) {
    return null
  }

  return numeric
}

export function parseColorsInput(input: string, shapes: number): number | null {
  const normalized = input.trim()
  if (!normalized) {
    return null
  }

  const numeric = Number(normalized)
  if (!isValidColors(numeric, shapes)) {
    return null
  }

  return numeric
}

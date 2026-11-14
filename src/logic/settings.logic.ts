import { REWARD_STEP_SECONDS } from './game.constants'

const SETTINGS_STORAGE_KEY = 'game-settings'
export const MAX_REWARD_SECONDS = 20

export type GameSettings = {
  rewardSeconds: number
}

function isValidRewardSeconds(value: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= MAX_REWARD_SECONDS
}

export function getDefaultSettings(): GameSettings {
  return {
    rewardSeconds: REWARD_STEP_SECONDS,
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
    if (typeof rewardSeconds !== 'number' || !isValidRewardSeconds(rewardSeconds)) {
      console.warn('Invalid stored rewardSeconds. Falling back to default settings.')
      return defaults
    }

    return {
      rewardSeconds,
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

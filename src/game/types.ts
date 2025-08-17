import type { TaskType } from './constants'

export type GameConfig = {
  sessionMs: number
  penaltyMs: number
  spawnIntervalMinMs: number
  spawnIntervalMaxMs: number
  maxOnScreen: number
  pointsPerStep: number
  comboIncrement: number
  comboCap: number
  timeBonusFactor: number
  tapMinIntervalMs: number
  gridCols: number
  gridRows: number
}

export type SpawnedTask = {
  id: number
  type: TaskType
  cellX: number
  cellY: number
  createdAtMs: number
  expiresAtMs: number
}

export type GameState = {
  timeLeftMs: number
  score: number
  combo: number
  currentStepIndex: number
  completedDeploys: number
  mistakesCount: number
  lastTapAcceptedAt: number
  tasks: SpawnedTask[]
  nextSpawnAt: number
}
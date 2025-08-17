import { GameConfig } from './types'

export const DEFAULT_CONFIG: GameConfig = {
  sessionMs: 60_000,
  penaltyMs: 3_000,
  spawnIntervalMinMs: 1_200,
  spawnIntervalMaxMs: 1_600,
  maxOnScreen: 5,
  pointsPerStep: 100,
  comboIncrement: 0.1,
  comboCap: 3.0,
  timeBonusFactor: 5,
  tapMinIntervalMs: 150,
  gridCols: 3,
  gridRows: 4,
}
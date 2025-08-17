export const CFG = {
  durationMs: 120_000,
  maxDurationMs: 180_000,
  spawnIntervalStart: 1_000,
  spawnIntervalMin: 600,
  rampEverySec: 20,
  fallSpeedStart: 180, // px/s
  fallSpeedMax: 300,
  fallRampPct: 0.06,
  blockWidth: 120,
  blockHeight: 64,
  blockCompression: 0.65,
  platformWidth: 220,
  platformHeight: 20,
  playPaddingTop: 64,
  playPaddingBottom: 100,
  time: { correct: 1_000, wrong: -5_000, bad: -8_000, heal: 2_000 },
  points: { base: 100, speedBonus: 20, finishMultiplier: 5 },
  speedBonusWindow: 1_000,
  comboTiers: [2, 4, 6, 8],
  comboMult: [1.2, 1.5, 1.8, 2.0],
  badEverySecMin: 12,
  maxIdenticalOnScreen: 2,
  toppleOutsidePlatformFails: true,
  healSpawnBiasWhenBlocked: 0.85,
};

export type Config = typeof CFG;

import type { BlockKind } from '../steps';

export type FallingBlock = {
  id: string;
  kind: BlockKind;
  x: number; // center x (px)
  y: number; // top y (px)
  vx: number; // drift x (px/s)
  vy: number; // fall speed (px/s)
  width: number;
  height: number;
  spawnAt: number; // ms
};

export type StackItem = {
  kind: Extract<BlockKind, { type: 'step' }>;
  x: number;
  y: number;
};

export type GamePhase = 'welcome' | 'rules' | 'playing' | 'success' | 'fail';

export type GameState = {
  phase: GamePhase;
  seed: number;
  timeLeftMs: number;
  score: number;
  scoreDelta?: { value: number; positive: boolean; at: number };
  combo: number;
  maxCombo: number;
  stepIndex: number; // 0..8 in MAIN_SEQUENCE
  blocked: false | 'bug' | 'infra';
  blocks: FallingBlock[];
  stack: StackItem[];
  platformX: number; // center x of platform
  platformWidth: number;
  spawnCooldownMs: number;
  lastCorrectAt?: number;
  lastTick: number;
  rng: () => number; // 0..1
};

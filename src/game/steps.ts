export type StepId =
  | 'requirements'
  | 'branch'
  | 'code'
  | 'tests'
  | 'fix-bugs'
  | 'resolve-conflicts'
  | 'mr-approvals'
  | 'merge-main'
  | 'deploy-prod';

export type BlockKind =
  | { type: 'step'; step: StepId }
  | { type: 'bad'; name: 'bug' | 'infra' }
  | { type: 'heal'; name: 'fix-bug' | 'fix-infra' };

export const MAIN_SEQUENCE: StepId[] = [
  'requirements',
  'branch',
  'code',
  'tests',
  'fix-bugs',
  'resolve-conflicts',
  'mr-approvals',
  'merge-main',
  'deploy-prod',
];

export const HEAL_FOR: Record<'bug' | 'infra', 'fix-bug' | 'fix-infra'> = {
  bug: 'fix-bug',
  infra: 'fix-infra',
};


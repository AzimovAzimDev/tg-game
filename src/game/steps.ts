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

export const LABELS_RU = {
  requirements: 'Сбор требований',
  branch: 'Создать ветку',
  code: 'Писать код',
  tests: 'Писать тесты',
  'fix-bugs': 'Фиксить баги',
  'resolve-conflicts': 'Решить конфликты',
  'mr-approvals': 'Получить аппрувы',
  'merge-main': 'Слить в main',
  'deploy-prod': 'Деплой в прод',
  bug: 'Баг',
  infra: 'Инфраструктура упала',
  'fix-bug': 'Фикс бага',
  'fix-infra': 'Фикс инфраструктуры',
} as const;

export const LABELS_EN = {
  requirements: 'Get Requirements',
  branch: 'Create Branch',
  code: 'Write Code',
  tests: 'Write Tests',
  'fix-bugs': 'Fix Bugs',
  'resolve-conflicts': 'Resolve Conflicts',
  'mr-approvals': 'Get MR Approvals',
  'merge-main': 'Merge to Main',
  'deploy-prod': 'Deploy to Prod',
  bug: 'Bug',
  infra: 'Infra Outage',
  'fix-bug': 'Fix Bug',
  'fix-infra': 'Fix Infrastructure',
} as const;

export type LabelKey = keyof typeof LABELS_RU;

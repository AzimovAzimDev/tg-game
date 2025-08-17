export const STEPS = [
  { key: 'install', label: 'Install deps 📦' },
  { key: 'fix',     label: 'Fix bug 🐛' },
  { key: 'merge',   label: 'Merge PR 🔀' },
  { key: 'push',    label: 'Push to prod 🚀' },
] as const
export type TaskType = typeof STEPS[number]['key']
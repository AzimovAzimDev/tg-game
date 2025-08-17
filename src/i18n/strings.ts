export type Lang = 'en' | 'ru'

export const strings = {
  title: { en: 'Deploy or Die', ru: 'Deploy or Die' },
  play: { en: 'Play', ru: 'Играть' },
  rulesTitle: { en: 'Checklist order', ru: 'Порядок шагов' },
  steps: {
    en: ['Install deps 📦','Fix bug 🐛','Merge PR 🔀','Push to prod 🚀'],
    ru: ['Install deps 📦','Fix bug 🐛','Merge PR 🔀','Push to prod 🚀'],
  },
  score: { en: 'Score', ru: 'Счёт' },
  combo: { en: 'Combo', ru: 'Комбо' },
  time: { en: 'Time', ru: 'Время' },
  mistakes: { en: 'Mistakes', ru: 'Ошибки' },
  restart: { en: 'Restart', ru: 'Ещё раз' },
  send: { en: 'Send Result', ru: 'Отправить результат' },
  victory: { en: 'Victory!', ru: 'Победа!' },
  tryAgain: { en: 'Try Again', ru: 'Попробуй ещё' },
  memelines: {
    en: [
      'You deployed with zero rollbacks! 💪',
      'Deploying on Friday? Certified hero.',
      'Prod is saved. QA is still grumpy.'
    ],
    ru: [
      'Деплой без откатов! 💪',
      'Деплой в пятницу? Герой.',
      'Прод спасён. QA всё ещё ворчит.'
    ]
  },
}
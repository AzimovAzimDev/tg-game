import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { USER_PREFERENCES } from './config/userPreferences';

function getCookie(name: string): string | undefined {
  return document.cookie
    .split(';')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => c.split('='))
    .find(([k]) => k === name)?.[1];
}

const initialLng = (() => {
  if (typeof document !== 'undefined') {
    const fromCookie = getCookie(USER_PREFERENCES.languageCookie);
    if (fromCookie) return decodeURIComponent(fromCookie);
  }
  return USER_PREFERENCES.defaultLanguage;
})();

i18n.use(initReactI18next).init({
  resources: {
    ru: {
      translation: {
        hello: 'Привет, мир',
        home: 'Главная',
        languageSelect: {
          title: 'Выберите язык / Tiлдi таңдаңыз',
          russian: 'Русский',
          kazakh: 'Қазақша',
          ariaLabel: 'Выбор языка',
        },
        welcome: {
          greeting: 'Привет, {{firstName}} {{lastName}}!',
          title: 'Deploy or Die',
          description: 'Твоя задача — собрать весь цикл разработки до продакшн-деплоя.<br /><br />На экране будет показан правильный порядок блоков задач — каждый из них отмечен смайликом.<br /><br />Тебе нужно ловить только нужные задачи, собирать их в правильной последовательности и игнорировать лишние блоки.',
          startButton: 'Начать',
          startButtonAria: 'Начать игру',
          resultsButton: 'Результаты',
          resultsButtonAria: 'Результаты',
        },
        rules: {
          title: 'Правила игры',
          list: {
            1: 'Сверху падают блоки с задачами',
            2: 'Управляй платформой внизу, чтобы поймать только нужные блоки',
            3: 'Собирай задачи в правильном порядок',
            4: 'Подсказка с нужным блоком всегда отображается в верхней части экрана',
          },
          stepsTitle: 'Порядок кликов',
          startButton: 'Погнали ⚡',
          startButtonAria: 'Начать игру',
        },
        steps: {
          requirements: 'Get requirements 📝',
          branch: 'Create branch 🌿',
          code: 'Write code 💻',
          tests: 'Write tests 🧪',
          'fix-bugs': 'Fix bugs 🐛',
          'resolve-conflicts': 'Resolve conflicts ⚔️',
          'mr-approvals': 'Get MR approvals ✅',
          'merge-main': 'Merge to main 🔀',
          'deploy-prod': 'Deploy to prod 🚀',
        },
        game: {
          score: 'Очки',
          goal: 'Цель',
          cycleComplete: 'Цикл завершен!',
          me: 'Я',
          blocked: 'Заблокировано',
          bug: 'Баг',
          infra: 'Инфра',
          fixBug: 'Исправить баг',
          fixInfra: 'Исправить инфру',
          time: 'Время',
          shareText: 'Deploy or Die — Я набрал {{score}} очков. Следующий шаг: {{goal}} {{emoji}}',
          copied: 'Скопировано в буфер обмена',
          endTitle: 'Время вышло!',
          finalScore: 'Итоговый счет',
          playAgain: 'Играть снова',
          copyResult: 'Скопировать результат',
          nice: 'Отлично!',
        },
        profile: {
          actionsAria: 'Действия профиля',
        },
        leaders: {
          myResults: 'Мои результаты',
          noResults: 'Пока нет результатов. Сыграйте игру, чтобы увидеть свои баллы здесь.',
        },
      },
    },
    kk: {
      translation: {
        hello: 'Сәлем, әлем',
        home: 'Басты бет',
        languageSelect: {
          title: 'Выберите язык / Tiлдi таңдаңыз',
          russian: 'Орысша',
          kazakh: 'Қазақша',
          ariaLabel: 'Тілді таңдау',
        },
        welcome: {
          greeting: 'Сәлем, {{firstName}} {{lastName}}!',
          title: 'Deploy or Die',
          description: 'Твоя задача — собрать весь цикл разработки до продакшн-деплоя.<br /><br />На экране будет показан правильный порядок блоков задач — каждый из них отмечен смайликом.<br /><br />Тебе нужно ловить только нужные задачи, собирать их в правильной последовательности и игнорировать лишние блоки.',
          startButton: 'Бастау',
          startButtonAria: 'Ойынды бастау',
          resultsButton: 'Нәтижелер',
          resultsButtonAria: 'Нәтижелер',
        },
        rules: {
          title: 'Ойын ережелері',
          list: {
            1: 'Жоғарыдан тапсырмалар блоктары түседі',
            2: 'Тек қажетті блоктарды ұстау үшін төмендегі платформаны басқарыңыз',
            3: 'Тапсырмаларды дұрыс тәртіпте жинаңыз',
            4: 'Қажетті блок туралы кеңес әрқашан экранның жоғарғы жағында көрсетіледі',
          },
          stepsTitle: 'Басу тәртібі',
          startButton: 'Кеттік ⚡',
          startButtonAria: 'Ойынды бастау',
        },
        steps: {
          requirements: 'Get requirements 📝',
          branch: 'Create branch 🌿',
          code: 'Write code 💻',
          tests: 'Write tests 🧪',
          'fix-bugs': 'Fix bugs 🐛',
          'resolve-conflicts': 'Resolve conflicts ⚔️',
          'mr-approvals': 'Get MR approvals ✅',
          'merge-main': 'Merge to main 🔀',
          'deploy-prod': 'Deploy to prod 🚀',
        },
        game: {
          score: 'Ұпайлар',
          goal: 'Мақсат',
          cycleComplete: 'Цикл аяқталды!',
          me: 'Мен',
          blocked: 'Бұғатталған',
          bug: 'Қате',
          infra: 'Инфра',
          fixBug: 'Қатені жөндеу',
          fixInfra: 'Инфраны жөндеу',
          time: 'Уақыт',
          shareText: 'Deploy or Die — Мен {{score}} ұпай жинадым. Келесі қадам: {{goal}} {{emoji}}',
          copied: 'Алмасу буферіне көшірілді',
          endTitle: 'Уақыт бітті!',
          finalScore: 'Соңғы есеп',
          playAgain: 'Қайта ойнау',
          copyResult: 'Нәтижені көшіру',
          nice: 'Керемет!',
        },
        profile: {
          actionsAria: 'Профиль әрекеттері',
        },
        leaders: {
          myResults: 'Менің нәтижелерім',
          noResults: 'Әзірше нәтиже жоқ. Өз ұпайларыңызды көру үшін ойын ойнаңыз.',
        },
      },
    },
    en: {
      translation: {
        hello: 'Hello World',
        home: 'Home',
        languageSelect: {
          title: 'Choose language',
          russian: 'Russian',
          kazakh: 'Kazakh',
          ariaLabel: 'Choose language',
        },
        welcome: {
          greeting: 'Hello, {{firstName}} {{lastName}}!',
          title: 'Deploy or Die',
          description: 'Your task is to assemble the entire development cycle before production deployment.<br /><br />The screen will show the correct order of task blocks, each marked with an emoji.<br /><br />You need to catch only the necessary tasks, collect them in the correct sequence, and ignore the extra blocks.',
          startButton: 'Start',
          startButtonAria: 'Start the game',
          resultsButton: 'Results',
          resultsButtonAria: 'Results',
        },
        rules: {
          title: 'Game Rules',
          list: {
            1: 'Task blocks fall from the top',
            2: 'Control the platform below to catch only the necessary blocks',
            3: 'Collect tasks in the correct order',
            4: 'A hint with the required block is always displayed at the top of the screen',
          },
          stepsTitle: 'Order of clicks',
          startButton: 'Let\'s go ⚡',
          startButtonAria: 'Start the game',
        },
        steps: {
          requirements: 'Get requirements 📝',
          branch: 'Create branch 🌿',
          code: 'Write code 💻',
          tests: 'Write tests 🧪',
          'fix-bugs': 'Fix bugs 🐛',
          'resolve-conflicts': 'Resolve conflicts ⚔️',
          'mr-approvals': 'Get MR approvals ✅',
          'merge-main': 'Merge to main 🔀',
          'deploy-prod': 'Deploy to prod 🚀',
        },
        game: {
          score: 'Score',
          goal: 'Goal',
          cycleComplete: 'Cycle complete!',
          me: 'Me',
          blocked: 'Blocked',
          bug: 'Bug',
          infra: 'Infra',
          fixBug: 'Fix bug',
          fixInfra: 'Fix infra',
          time: 'Time',
          shareText: 'Deploy or Die — I scored {{score}} pts. Next: {{goal}} {{emoji}}',
          copied: 'Copied to clipboard',
          endTitle: 'Time\'s up!',
          finalScore: 'Final score',
          playAgain: 'Play again',
          copyResult: 'Copy result',
          nice: 'Nice!',
        },
        profile: {
          actionsAria: 'Profile actions',
        },
      },
    },
  },
  lng: initialLng,
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
});

export default i18n;

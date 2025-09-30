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
          ariaLabel: 'Добро пожаловать',
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
            5: 'Только первый результат игры может использоваться для получения призов в KolesaConf Shop.',
          },
          stepsTitle: 'Порядок блоков',
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
          fullscreen: 'Полный экран',
          exitFullscreen: 'Выйти из полного экрана',
        },
        profile: {
          actionsAria: 'Действия профиля',
        },
        leaders: {
          myResults: 'Мои результаты',
          noResults: 'Пока нет результатов. Сыграйте игру, чтобы увидеть свои баллы здесь.',
          disclaimer: 'Только первый результат игры может использоваться для получения призов в KolesaConf Shop.',
        },
        tabs: {
          home: 'Главная',
          results: 'Результаты',
          profile: 'Профиль',
          rules: 'Правила',
          language: 'Язык',
          startGameAria: 'Начать игру',
          bottomTabsAria: 'Нижние вкладки',
        },
        successModal: {
          ariaLabel: 'Успех',
          alt: 'Успех',
          yourScore: 'Ваши баллы: <strong>{{score}}</strong>',
          showAllResults: 'Показать все мои результаты',
          playAgain: 'Сыграть ещё раз',
        },
        unsuccessModal: {
          ariaLabel: 'Неуспех',
          alt: 'Неуспех',
        },
        leaderboard: {
          winnersTitle: 'Получат приз от Kolesa Group',
          othersTitle: 'Все участники',
          pointsAriaLabel: '{{score}} очков',
        },
        changeLanguage: {
          title: 'Сменить язык',
          save: 'Сохранить',
        },
      },
    },
    kk: {
      translation: {
        hello: 'Сәлем, әлем',
        home: 'Басты бет',
        languageSelect: {
          title: 'Выберите язык / Tiлдi таңдаңыз',
          russian: 'Русский',
          kazakh: 'Қазақша',
          ariaLabel: 'Тілді таңдау',
        },
        welcome: {
          ariaLabel: 'Қош келдіңіз',
          greeting: 'Сәлем, {{firstName}} {{lastName}}!',
          title: 'Deploy or Die',
          description: 'Сіздің міндетіңіз — продакшн-деплойға дейінгі бүкіл әзірлеу циклін жинау.<br /><br />Экранда тапсырмалар блоктарының дұрыс тәртібі көрсетіледі — олардың әрқайсысы смайликпен белгіленген.<br /><br />Сізге тек қажетті тапсырмаларды ұстап, оларды дұрыс ретпен жинап, артық блоктарды елемеу керек.',
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
            5: 'KolesaConf Shop-тағы сыйлықтар үшін тек ойынның бірінші нәтижесін пайдалануға болады.',
          },
          stepsTitle: 'Блоктардың реті',
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
          fullscreen: 'Толық экран',
          exitFullscreen: 'Толық экраннан шығу',
        },
        profile: {
          actionsAria: 'Профиль әрекеттері',
        },
        leaders: {
          myResults: 'Менің нәтижелерім',
          noResults: 'Әзірше нәтиже жоқ. Өз ұпайларыңызды көру үшін ойын ойнаңыз.',
          disclaimer: 'KolesaConf Shop-тағы сыйлықтар үшін тек ойынның бірінші нәтижесін пайдалануға болады.',
        },
        tabs: {
          home: 'Басты',
          results: 'Нәтижелер',
          profile: 'Профиль',
          rules: 'Ережелер',
          language: 'Тіл',
          startGameAria: 'Ойынды бастау',
          bottomTabsAria: 'Төменгі бетбелгілер',
        },
        successModal: {
          ariaLabel: 'Сәттілік',
          alt: 'Сәттілік',
          yourScore: 'Сіздің ұпайларыңыз: <strong>{{score}}</strong>',
          showAllResults: 'Барлық нәтижелерімді көрсету',
          playAgain: 'Қайта ойнау',
        },
        unsuccessModal: {
          ariaLabel: 'Сәтсіздік',
          alt: 'Сәтсіздік',
        },
        leaderboard: {
          winnersTitle: 'Kolesa Group-тан сыйлық алады',
          othersTitle: 'Барлық қатысушылар',
          pointsAriaLabel: '{{score}} ұпай',
        },
        changeLanguage: {
          title: 'Тілді өзгерту',
          save: 'Сақтау',
        },
      },
    },
    en: {
      translation: {
        hello: 'Hello World',
        home: 'Home',
        languageSelect: {
          title: 'Choose language',
          russian: 'Русский',
          kazakh: 'Kazakh',
          ariaLabel: 'Choose language',
        },
        welcome: {
          ariaLabel: 'Welcome',
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
            5: 'Only the first game result can be used to receive prizes at the KolesaConf Shop.',
          },
          stepsTitle: 'Order of blocks',
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
          fullscreen: 'Fullscreen',
          exitFullscreen: 'Exit Fullscreen',
        },
        profile: {
          actionsAria: 'Profile actions',
        },
        leaders: {
          myResults: 'My Results',
          noResults: 'No results yet. Play a game to see your scores here.',
          disclaimer: 'Only the first game result can be used to receive prizes at the KolesaConf Shop.',
        },
        tabs: {
          home: 'Home',
          results: 'Results',
          profile: 'Profile',
          rules: 'Rules',
          language: 'Language',
          startGameAria: 'Start Game',
          bottomTabsAria: 'Bottom Tabs',
        },
        successModal: {
          ariaLabel: 'Success',
          alt: 'Success',
          yourScore: 'Your score: <strong>{{score}}</strong>',
          showAllResults: 'Show all my results',
          playAgain: 'Play again',
        },
        unsuccessModal: {
          ariaLabel: 'Failure',
          alt: 'Failure',
        },
        leaderboard: {
          winnersTitle: 'Will receive a prize from Kolesa Group',
          othersTitle: 'All participants',
          pointsAriaLabel: '{{score}} points',
        },
        changeLanguage: {
          title: 'Change language',
          save: 'Save',
        },
      },
    },
  },
  lng: initialLng,
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
});

export default i18n;

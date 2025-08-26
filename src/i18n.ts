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
      },
    },
    kk: {
      translation: {
        hello: 'Сәлем, әлем',
        home: 'Басты бет',
      },
    },
    en: {
      translation: {
        hello: 'Hello World',
        home: 'Home',
      },
    },
  },
  lng: initialLng,
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
});

export default i18n;

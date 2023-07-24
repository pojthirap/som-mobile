import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import th from '../language/th.json';
import en from '../language/en.json';

const resources = {
  en: {
    translation: en,
  },
  th: {
    translation: th,
  },
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    keySeparator: false,
    lng: 'th',
  });

export const getLanguage = () => i18next.language;

export default i18next;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import uz from './locales/uz.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

void i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      uz: { translation: uz },
      ru: { translation: ru },
      en: { translation: en },
    },
    lng: 'uz',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;

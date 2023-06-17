import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
// below line removed in removing support for non-english languages
// import LanguageDetector from 'i18next-browser-languagedetector';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

const namespace = ['main', 'api', 'about', 'model'];
if (googleClientId) namespace.push('drive');

i18n
  .use(Backend)
  .use(initReactI18next)
  //.use(LanguageDetector)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
    },
    // Set default language to English
    // fallbackLng: {
    //   default: ['en'],
    // },

    ns: namespace,
    defaultNS: 'main',
  });


export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationPT from './locales/pt.json';

const resources = {
    en: {
        translation: translationEN
    },
    'pt-BR': {
        translation: translationPT
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'pt-BR', // default: load in Portuguese first
        fallbackLng: 'pt-BR',
        debug: false,
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        },
        detection: {
            order: ['localStorage', 'cookie', 'querystring'],
            caches: ['localStorage', 'cookie']
        }
    });

export default i18n;

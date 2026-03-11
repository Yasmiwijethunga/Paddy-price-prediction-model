import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './locales/en/translation.json'
import siTranslation from './locales/si/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      si: { translation: siTranslation },
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
  })

// Keep <html lang="..."> in sync so :lang(si) CSS rules activate
i18n.on('initialized', () => {
  document.documentElement.lang = i18n.language?.split('-')[0] || 'en'
})
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng.split('-')[0]
})

export default i18n

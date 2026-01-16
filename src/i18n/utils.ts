import { translations, type Locale } from './translations'

export function getTranslations(locale: Locale = 'fr') {
  return translations[locale]
}

export function getLocalizedPath(path: string, locale: Locale) {
  if (locale === 'fr') {
    return path
  }
  return `/${locale}${path === '/' ? '' : path}`
}

export function getAlternateLocale(currentLocale: Locale): Locale {
  return currentLocale === 'fr' ? 'en' : 'fr'
}

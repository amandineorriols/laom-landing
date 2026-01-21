import { translations, type Locale } from './translations'

export function getTranslations(locale: Locale = 'fr') {
  return translations[locale]
}

export function getLocalizedPath(path: string, locale: Locale) {
  // Strip /en or /en/ prefix to get the base path (pathnames on EN site include /en)
  const base = path.replace(/^\/en\/?/, '/') || '/'
  if (locale === 'fr') {
    return base
  }
  return base === '/' ? '/en' : `/${locale}${base}`
}

export function getAlternateLocale(currentLocale: Locale): Locale {
  return currentLocale === 'fr' ? 'en' : 'fr'
}

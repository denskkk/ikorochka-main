export const locales = ['uk', 'ru'] as const
type Locale = typeof locales[number]

export const defaultLocale: Locale = 'uk'

export function getLocaleFromPath(pathname: string | undefined){
  if(!pathname) return defaultLocale
  const lang = pathname.split('/')[1]
  if(locales.includes(lang as Locale)) return lang as Locale
  return defaultLocale
}

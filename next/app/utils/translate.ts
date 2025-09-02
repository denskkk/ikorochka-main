import fs from 'fs'
import path from 'path'
import { defaultLocale } from '../i18n'

type Messages = Record<string,string>

const cache = new Map<string, Messages>()

export function loadMessages(locale: string){
  if(cache.has(locale)) return cache.get(locale)!
  try{
    const p = path.join(process.cwd(), 'public', 'locales', locale, 'common.json')
    const raw = fs.readFileSync(p, 'utf-8')
    const obj = JSON.parse(raw) as Messages
    cache.set(locale, obj)
    return obj
  }catch(e){
    if(locale === defaultLocale) return {}
    return loadMessages(defaultLocale)
  }
}

export function t(key: string, locale: string){
  const msgs = loadMessages(locale)
  return msgs[key] ?? key
}

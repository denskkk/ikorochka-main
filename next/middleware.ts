import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/
const locales = ['uk', 'ru']
const defaultLocale = 'uk'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Skip public files and api
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return
  }

  const segments = pathname.split('/')
  const first = segments[1]
  if (locales.includes(first)) {
    return
  }

  // Special handling: plain /admin should redirect into locale
  if (pathname === '/admin') {
    const cookie = req.cookies.get('lang')?.value
    const targetLocale = locales.includes(cookie || '') ? cookie! : defaultLocale
    const url = req.nextUrl.clone()
    url.pathname = `/${targetLocale}/admin`
    return NextResponse.redirect(url)
  }

  // Detect preferred locale from cookie
  const cookie = req.cookies.get('lang')?.value
  const targetLocale = locales.includes(cookie || '') ? cookie! : defaultLocale
  const url = req.nextUrl.clone()
  url.pathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/']
}

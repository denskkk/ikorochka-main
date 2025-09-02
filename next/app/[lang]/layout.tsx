import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { locales } from '../i18n'
import '../globals.css'
import { Header } from '../../components/layout/Header'
import { MobileDock } from '../../components/layout/MobileDock'
import Footer from '../../components/layout/Footer'
import { Manrope } from 'next/font/google'
import type { Metadata } from 'next'

const manrope = Manrope({ subsets: ['latin','cyrillic'], variable: '--font-sans', display: 'swap' })

export function generateStaticParams(){
  return locales.map(l=>({ lang: l }))
}

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: { default: 'Ікорочка – Преміальна ікра та делікатеси', template: '%s | Ікорочка' },
  description: 'Преміальна червона ікра та морепродукти: свіжість, холодова логістика, без консервантів.',
  openGraph: {
    siteName: 'Ікорочка',
    type: 'website'
  },
  twitter: { card: 'summary_large_image' }
}

export default function LangLayout({ children, params }: { children: ReactNode, params: { lang: string } }) {
  const { lang } = params
  if(!locales.includes(lang as any)) notFound()
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ікорочка',
    url: 'https://example.com',
    sameAs: ['https://t.me/ikorochka'],
    logo: 'https://example.com/assets/ikra.png'
  }
  return (
    <html lang={lang} className="dark">
      <head>
        <link rel="alternate" hrefLang="uk" href="https://example.com/uk" />
        <link rel="alternate" hrefLang="ru" href="https://example.com/ru" />
        <link rel="alternate" hrefLang="x-default" href="https://example.com/uk" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className={`${manrope.variable} bg-graphite-900 text-white antialiased min-h-screen flex flex-col`}>
        <Header />
        {children}
        <Footer />
        <MobileDock />
      </body>
    </html>
  )
}

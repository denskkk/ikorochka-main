import './globals.css'
import type { ReactNode } from 'react'
import { Manrope } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin','cyrillic'], variable: '--font-sans', display: 'swap' })

export const metadata = {
  title: 'Ікорочка – Преміальна ікра і делікатеси',
  description: 'Інтернет-магазин преміальної червоної ікри та морепродуктів: свіжість, якість, вишуканий смак.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className="dark">
      <body className={`${manrope.variable} bg-graphite-900 text-white antialiased min-h-screen flex flex-col`}>
        {/* Root layout only wraps children; [lang]/layout adds chrome */}
        {children}
      </body>
    </html>
  )
}

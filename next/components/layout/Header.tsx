"use client";
import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import LocaleSwitcher from '../LocaleSwitcher'
import { usePathname } from 'next/navigation'
import useHydrated from '../hooks/useHydrated'
import OrderButton from './OrderButton'

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() || '/'
  const lang = pathname.split('/')[1] === 'ru' ? 'ru' : 'uk'

  const texts: any = {
    uk: { siteName: 'Ікорочка', catalog: 'Каталог', sets: 'Сети', about: 'Про нас', delivery: 'Доставка', order: 'Замовити' },
    ru: { siteName: 'Икорочка', catalog: 'Каталог', sets: 'Сеты', about: 'О нас', delivery: 'Доставка', order: 'Заказать' }
  }
  const txt = lang === 'ru' ? texts.ru : texts.uk
  const hydrated = useHydrated()
  const display = hydrated ? txt : texts.uk
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-graphite-900/70 border-b border-white/10">
      <div className="container mx-auto px-5 h-16 flex items-center justify-between">
        <Link href={("/" + lang) as any} className="font-bold tracking-tight text-lg">{display.siteName}</Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href={("/" + lang + "/catalog") as any} className="text-white/70 hover:text-white transition">{display.catalog}</Link>
          <Link href={("/" + lang + "/sets") as any} className="text-white/70 hover:text-white transition">{display.sets}</Link>
          <Link href={("/" + lang + "/about") as any} className="text-white/70 hover:text-white transition">{display.about}</Link>
          <Link href={("/" + lang + "/delivery") as any} className="text-white/70 hover:text-white transition">{display.delivery}</Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <OrderButton />
          <LocaleSwitcher />
        </div>
        <button onClick={()=>setOpen(o=>!o)} className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-white/15 bg-white/5 text-white/80">
          <Menu size={20} />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-graphite-900/95 backdrop-blur-md">
          <nav className="px-5 py-4 flex flex-col gap-4 text-sm">
            <Link onClick={()=>setOpen(false)} href={("/" + lang + "/catalog") as any} className="text-white/80">{display.catalog}</Link>
            <Link onClick={()=>setOpen(false)} href={("/" + lang + "/sets") as any} className="text-white/80">{display.sets}</Link>
            <Link onClick={()=>setOpen(false)} href={("/" + lang + "/about") as any} className="text-white/80">{display.about}</Link>
            <Link onClick={()=>setOpen(false)} href={("/" + lang + "/delivery") as any} className="text-white/80">{display.delivery}</Link>
            <div className="pt-2"><OrderButton variant="small" labelOverride={display.order} /></div>
          </nav>
        </div>
      )}
    </header>
  )
}

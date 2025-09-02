"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useHydrated from '../hooks/useHydrated'

export default function Footer() {
  const pathname = usePathname() || '/'
  const lang = pathname.split('/')[1] === 'ru' ? 'ru' : 'uk'

  const texts = {
    uk: {
      siteName: 'Ікорочка',
      freeDelivery: 'Доставка по місту безкоштовна',
      catalog: 'Каталог',
      sets: 'Сети',
      about: 'Про нас',
      delivery: 'Доставка',
      search: 'Пошук',
      cart: 'Кошик',
      contactTitle: "Зв'вязок",
      phone: 'Тел: +380 (63) 000-00-00',
      telegram: 'Telegram: @ikorochka',
      email: 'Email: hi@ikorochka.ua'
    },
    ru: {
      siteName: 'Икорочка',
      freeDelivery: 'Доставка по городу бесплатна',
      catalog: 'Каталог',
      sets: 'Сеты',
      about: 'О нас',
      delivery: 'Доставка',
      search: 'Поиск',
      cart: 'Корзина',
      contactTitle: 'Контакты',
      phone: 'Тел: +380 (63) 000-00-00',
      telegram: 'Telegram: @ikorochka',
      email: 'Email: hi@ikorochka.ua'
    }
  }

  const txt = lang === 'ru' ? texts.ru : texts.uk
  const hydrated = useHydrated()

  const display = hydrated ? txt : texts.uk

  return (
    <footer className="relative mt-32 border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-5 py-16 grid gap-12 md:grid-cols-4 relative z-10">
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight"><span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">{display.siteName}</span></h3>
          <p className="text-sm text-white/50 leading-relaxed">Преміальна червона ікра та морепродукти. Безкоштовна доставка по місту щодня.</p>
          <p className="text-xs text-gold-300/70 font-semibold uppercase tracking-wide">{display.freeDelivery}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-white/60">Навігація</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href={("/" + lang + "/catalog") as any} className="hover:text-white">{display.catalog}</Link></li>
            <li><Link href={("/" + lang + "/sets") as any} className="hover:text-white">{display.sets}</Link></li>
            <li><Link href={("/" + lang + "/about") as any} className="hover:text-white">{display.about}</Link></li>
            <li><Link href={("/" + lang + "/delivery") as any} className="hover:text-white">{display.delivery}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-white/60">Клієнтам</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href={("/" + lang + "/search") as any} className="hover:text-white">{display.search}</Link></li>
            <li><Link href={("/" + lang + "/cart") as any} className="hover:text-white">{display.cart}</Link></li>
            <li><Link href={("/" + lang + "/policy") as any} className="hover:text-white">Політика</Link></li>
            <li><Link href={("/" + lang + "/contacts") as any} className="hover:text-white">Контакти</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-white/60">{display.contactTitle}</h4>
          <p className="text-sm text-white/60">{display.phone}<br/>{display.telegram}<br/>{display.email}</p>
          <p className="text-[11px] text-white/40">© {new Date().getFullYear()} {display.siteName}. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  )
}

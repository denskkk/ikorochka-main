"use client";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Layers3, Home } from 'lucide-react'
import useHydrated from '../hooks/useHydrated'
import OrderButton from './OrderButton'

export function MobileDock(){
  const pathname = usePathname() || '/'
  const hydrated = useHydrated()
  const lang = pathname.split('/')[1] === 'ru' ? 'ru' : 'uk'

  const labels = {
    uk: { home:'Головна', catalog:'Каталог', order:'Замовити' },
    ru: { home:'Главная', catalog:'Каталог', order:'Заказать' }
  }
  const L = hydrated ? labels[lang as 'uk'|'ru'] : labels.uk

  const homeHref = '/' + lang
  const catalogHref = '/' + lang + '/catalog'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-graphite-900/90 backdrop-blur-xl border-t border-white/10">
      <ul className="flex items-center justify-around py-2 px-2">
        <li>
          <Link href={homeHref as any} className={`flex flex-col items-center px-3 text-[11px] font-medium transition ${pathname===homeHref ? 'text-white' : 'text-white/55 hover:text-white'}`}>
            <Home size={20} className="mb-0.5" />
            {L.home}
          </Link>
        </li>
        <li>
          <OrderButton variant="small" labelOverride={L.order} />
        </li>
        <li>
          <Link href={catalogHref as any} className={`flex flex-col items-center px-3 text-[11px] font-medium transition ${pathname===catalogHref ? 'text-white' : 'text-white/55 hover:text-white'}`}>
            <Layers3 size={20} className="mb-0.5" />
            {L.catalog}
          </Link>
        </li>
      </ul>
    </nav>
  )
}

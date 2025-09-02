"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import useHydrated from '../../components/hooks/useHydrated'

export default function TopCategories() {
  const pathname = usePathname() || '/'
  const lang = pathname.split('/')[1] === 'ru' ? 'ru' : 'uk'

  const cats = lang === 'ru' ? [
    { slug: 'caviar', title: 'Червона ікра', image: '/assets/ikra.png' },
    { slug: 'seafood', title: 'Морепродукти', image: '/assets/seafood.png' },
    { slug: 'ready', title: 'Готовая продукция', image: '/assets/dumplings.png' }
  ] : [
    { slug: 'caviar', title: 'Червона ікра', image: '/assets/ikra.png' },
    { slug: 'seafood', title: 'Морепродукти', image: '/assets/seafood.png' },
    { slug: 'ready', title: 'Готова продукція', image: '/assets/dumplings.png' }
  ]
  const hydrated = useHydrated()
  const fallbackCats = [
    { slug: 'caviar', title: 'Червона ікра', image: '/assets/ikra.png' },
    { slug: 'seafood', title: 'Морепродукти', image: '/assets/seafood.png' },
    { slug: 'ready', title: 'Готова продукція', image: '/assets/dumplings.png' }
  ]

  const headerTitle = lang === 'ru' ? 'Ассортимент' : 'Асортимент'
  const viewCatalog = lang === 'ru' ? 'Переглянуть каталог →' : 'Переглянути каталог →'

  return (
    <section className="py-12 sm:py-20">
      <div className="container mx-auto px-5 flex items-end justify-between mb-8 sm:mb-10">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{headerTitle}</h2>
  <Link href={`/${lang}/catalog` as any} className="text-sm font-medium text-white/60 hover:text-white">{viewCatalog}</Link>
        </div>
  <div className="container mx-auto px-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {(hydrated ? cats : fallbackCats).map((c) => (
          <div
            key={c.slug}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-graphite-800/60 backdrop-blur-sm shadow-soft hover:shadow-glow transition"
          >
            <div className="absolute inset-0">
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center opacity-75 sm:opacity-70 group-hover:opacity-95 transition duration-700"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggL/QcMhfQAAAABJRU5ErkJggg=="
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
            </div>
            <div className="relative p-5 sm:p-6 flex flex-col h-44 sm:h-56 justify-end">
              <h3 className="font-semibold text-lg tracking-tight mb-2">{c.title}</h3>
              <Link
                href={`/${lang}/catalog?category=${c.slug}` as any}
                className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-caviar-300 group-hover:text-white transition"
              >
                {(hydrated ? (lang === 'ru' ? 'Смотреть' : 'Дивитись') : 'Дивитись')} <span className="ml-1 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

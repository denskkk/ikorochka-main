"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import useHydrated from '../hooks/useHydrated'

export default function Hero() {
  const pathname = usePathname() || '/'
  const lang = pathname.split('/')[1] === 'ru' ? 'ru' : 'uk'

  const L: any = {
    uk: {
      brand: 'Ікорочка', tagline: 'преміальна ікра', popular: 'Популярно · Швидка доставка',
      description: 'Свіжа червона ікра, морепродукти та делікатеси — акуратно фасуємо, зберігаємо в холодовій ланцюжку та доставляємо по місту.',
      freeFrom: 'Безкоштовна доставка від', ctaChoose: 'Вибрати ікру', ctaBuild: 'Зібрати набір', badge: 'Преміум', ribbonLeft: 'Натуральний смак · Без консервантів', ribbonRight: 'Від 420 ₴'
    },
    ru: {
      brand: 'Икорочка', tagline: 'премиальная икра', popular: 'Популярно · Быстрая доставка',
      description: 'Свежая красная икра, морепродукты и деликатесы — аккуратно фасуем, храним в холодовой цепи и доставляем по городу.',
      freeFrom: 'Бесплатная доставка от', ctaChoose: 'Выбрать икру', ctaBuild: 'Собрать набор', badge: 'Премиум', ribbonLeft: 'Натуральный вкус · Без консервантов', ribbonRight: 'От 420 ₴'
    }
  }
  const t = L[lang]
  const hydrated = useHydrated()

  return (
    <section className="relative overflow-hidden min-h-[72vh] md:min-h-[68vh] flex items-center bg-gradient-to-br from-caviar-900/85 to-black/95">
      {/* decorative soft radial for depth */}
      <div className="absolute -left-20 -top-20 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-gold-400/6 to-transparent blur-3xl pointer-events-none -z-10 hidden sm:block" />
      {/* Mobile-only blurred background image */}
      <div className="absolute inset-0 -z-20 block lg:hidden">
        <Image
          src="/assets/ikra.png"
          alt="фон икры"
          fill
          className="object-cover object-center w-full h-full filter blur-sm brightness-75 opacity-45"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/30 to-black/70" />
      </div>

      <div className="container mx-auto px-5 py-14 sm:py-20 flex flex-col-reverse lg:flex-row items-center gap-6 sm:gap-12">
        {/* Text content */}
        <div className="flex-1 flex flex-col items-center lg:items-start justify-center order-2 lg:order-1 text-center lg:text-left px-2 sm:px-0">
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight mb-3">
            <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">{hydrated ? t.brand : L.uk.brand}</span>
            <span className="text-white/90"> — {hydrated ? t.tagline : L.uk.tagline}</span>
          </h1>

          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <div className="text-sm text-gold-300 font-semibold select-none tracking-tight">★★★★★</div>
            <div className="text-sm text-white/60">{hydrated ? t.popular : L.uk.popular}</div>
          </div>

          <p className="max-w-xl text-base md:text-lg text-white/70 leading-relaxed mb-6 mx-auto lg:mx-0">
            {hydrated ? t.description : L.uk.description}
          </p>

          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold bg-black/30 text-gold-200 border border-white/6">{hydrated ? t.freeFrom : L.uk.freeFrom} <b className="text-white">3000 ₴</b></span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center sm:items-start">
            <Link href={("/" + lang + "/catalog") as any} className="inline-flex block w-full sm:w-auto h-12 items-center justify-center rounded-full px-6 text-sm font-semibold bg-gradient-to-r from-caviar-500 to-caviar-400 shadow-lg hover:scale-[1.01] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-caviar-300">
              {hydrated ? t.ctaChoose : L.uk.ctaChoose}
            </Link>
            <Link href={("/" + lang + "/sets") as any} className="inline-flex block w-full sm:w-auto h-12 items-center justify-center rounded-full px-6 text-sm font-semibold border border-white/12 bg-white/4 hover:bg-white/8 transition">
              {hydrated ? t.ctaBuild : L.uk.ctaBuild}
            </Link>
          </div>
        </div>

        {/* Visual product card */}
        <div className="flex-1 flex items-center justify-center order-1 lg:order-2 px-4">
          <div className="relative w-full max-w-[520px] sm:max-w-xl">
            {/* soft outer glow */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-gold-400/10 via-gold-300/6 to-transparent blur-2xl pointer-events-none" />

            <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-sm aspect-[4/3] animate-float">
              {/* top-left badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-400 to-gold-200 text-black shadow-[0_6px_18px_rgba(245,210,110,0.12)]">Премиум</span>
              </div>

              {/* decorative bottom ribbon */}
              <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between p-4 pointer-events-none">
                <div className="bg-gradient-to-r from-black/30 to-transparent px-3 py-1 rounded-md text-xs text-white/80">{hydrated ? t.ribbonLeft : L.uk.ribbonLeft}</div>
                <div className="bg-gradient-to-l from-black/30 to-transparent px-3 py-1 rounded-md text-xs text-gold-200">{hydrated ? t.ribbonRight : L.uk.ribbonRight}</div>
              </div>

              <Image
                src="/assets/ikra.png"
                alt={hydrated ? `${t.brand} — ${t.tagline}` : `${L.uk.brand} — ${L.uk.tagline}`}
                fill
                className="object-cover object-center brightness-[1.02] saturate-[1.2] select-none transform-gpu transition-transform duration-[900ms] will-change-transform"
                priority
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggL/QcMhfQAAAABJRU5ErkJggg=="
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

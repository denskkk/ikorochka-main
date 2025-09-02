"use client"

// Lightweight static benefits section — client-side localized
import { usePathname } from 'next/navigation'
import useHydrated from '../hooks/useHydrated'

export default function BenefitsSection() {
  const pathname = usePathname() || '/'
  const lang = pathname.split('/')[1] === 'ru' ? 'ru' : 'uk'

  const content = lang === 'ru' ? {
    title: 'Почему выбирают нас',
    desc: 'Мы создаем люксовую клиентскую ценность на основе свежей красной икры и морепродуктов, удобно доставляем по городу и упаковываем как для дома, так и для подарка.',
    items: [
      { title: 'Бесплатная доставка', desc: 'Доставка по городу в течение 2–4 часов. Бесплатно от 3000 ₴.' },
      { title: 'Свежесть и качество', desc: 'Контроль температуры и быстрая логистика — гарантия свежести.' },
      { title: 'Премиальная подборка', desc: 'Тщательно отобранные поставки и готовые подарочные решения.' }
    ]
  } : {
    title: 'Чому обирають нас',
    desc: 'Ми створюємо люксову клієнтську цінність на основі свіжої червоної ікри та морепродуктів, зручно доставляємо по місту та пакуємо як для дому, так і для подарунка.',
    items: [
      { title: 'Безкоштовна доставка', desc: 'Доставка по місту протягом 2–4 годин. Безкоштовно від 3000 ₴.' },
      { title: 'Свіжість і якість', desc: 'Контроль температури та швидка логістика — гарантія свіжості.' },
      { title: 'Преміальний підбір', desc: 'Ретельно відібрані поставки та готові подарункові рішення.' }
    ]
  }
  const hydrated = useHydrated()
  const fallback = {
    title: 'Чому обирають нас',
    desc: 'Ми створюємо люксову клієнтську цінність на основі свіжої червоної ікри та морепродуктів, зручно доставляємо по місту та пакуємо як для дому, так і для подарунка.',
    items: [
      { title: 'Безкоштовна доставка', desc: 'Доставка по місту протягом 2–4 годин. Безкоштовно від 3000 ₴.' },
      { title: 'Свіжість і якість', desc: 'Контроль температури та швидка логістика — гарантія свіжості.' },
      { title: 'Преміальний підбір', desc: 'Ретельно відібрані поставки та готові подарункові рішення.' }
    ]
  }

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-5">
        <div className="max-w-2xl mb-14">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">{hydrated ? content.title : fallback.title}</h2>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">{hydrated ? content.desc : fallback.desc}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {(hydrated ? content.items : fallback.items).map((it) => (
            <div key={it.title} className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-soft hover:shadow-glow transition">
              <h3 className="font-semibold text-lg mb-3 tracking-tight">
                <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">{it.title}</span>
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

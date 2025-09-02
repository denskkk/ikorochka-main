"use client"
import { usePathname } from 'next/navigation'
import useHydrated from '../../components/hooks/useHydrated'

export default function PromoStrips() {
  const pathname = usePathname() || '/'
  const lang = pathname.split('/')[1] === 'ru' ? 'ru' : 'uk'
  const items = lang === 'ru' ? [
    { title: 'Свежий улов недели', accent: '— скидки до 15% на сет «Камчатка»', color: 'from-caviar-400/70 to-caviar-300/30' },
    { title: 'Подарочные наборы', accent: '— гравировка и открытка', color: 'from-gold-400/70 to-gold-300/10' },
    { title: 'Premium селекция', accent: '— только крупное ровное зерно', color: 'from-caviar-400/60 to-caviar-200/10' }
  ] : [
    { title: 'Свіжий улов тижня', accent: '— знижки до 15% на сет «Камчатка»', color: 'from-caviar-400/70 to-caviar-300/30' },
    { title: 'Подарункові набори', accent: '— гравірування та листівка', color: 'from-gold-400/70 to-gold-300/10' },
    { title: 'Premium селекція', accent: '— тільки велике рівне зерно', color: 'from-caviar-400/60 to-caviar-200/10' }
  ]
  const hydrated = useHydrated()

  // fallback uk strings to avoid hydration mismatch when server rendered as uk
  const fallback = [
    { title: 'Свіжий улов тижня', accent: '— знижки до 15% на сет «Камчатка»', color: 'from-caviar-400/70 to-caviar-300/30' },
    { title: 'Подарункові набори', accent: '— гравірування та листівка', color: 'from-gold-400/70 to-gold-300/10' },
    { title: 'Premium селекція', accent: '— тільки велике рівне зерно', color: 'from-caviar-400/60 to-caviar-200/10' }
  ]

  return (
    <div className="relative py-10">
      <div className="container mx-auto px-5 grid gap-5 md:grid-cols-3">
  {(hydrated ? items : fallback).map((i) => (
          <div
            key={i.title}
            className={`relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${i.color} p-6 backdrop-blur-sm shadow-soft`}
          >
            <h3 className="text-lg font-semibold tracking-tight mb-1">{i.title}</h3>
            <p className="text-sm text-white/70">{i.accent}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

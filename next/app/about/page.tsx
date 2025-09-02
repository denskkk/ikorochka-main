import type { Metadata } from 'next'
import { CheckCircle, Gift, Truck, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'О нас | Икорочка',
  description: 'История компании, ценности, подход к качеству и свежести. Почему выбирают нас.',
  openGraph: {
    title: 'О нас | Икорочка',
    description: 'Как мы обеспечиваем свежесть красной икры и морепродуктов: холодовая цепь, контроль качества, прямые поставки.',
    type: 'article'
  },
  alternates: { canonical: '/about' }
}

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'О нас – Икорочка',
    description: 'История и ценности: свежая красная икра и морепродукты премиального качества.',
    publisher: { '@type': 'Organization', name: 'Икорочка' }
  }
  return (
    <main className="container mx-auto px-5 py-16">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">О компании</h1>
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <p className="text-lg text-white/70 mb-6 max-w-2xl">Мы начали с небольшой семейной партии икры для друзей. Сегодня «Икорочка» — это команда, объединяющая рыбаков, технологов и специалистов по логистике. Мы держим высокую планку качества и честности. Без посредников, без компромиссов.</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-white/80"><CheckCircle className="text-gold-400" size={22}/> Собственные поставки из северных регионов</li>
            <li className="flex items-center gap-3 text-white/80"><CheckCircle className="text-gold-400" size={22}/> Только соль и икра — никаких улучшителей</li>
            <li className="flex items-center gap-3 text-white/80"><CheckCircle className="text-gold-400" size={22}/> Удобные каналы заказа и быстрая доставка</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col gap-6 items-center justify-center shadow-soft">
          <Users className="text-caviar-400" size={48}/>
          <div className="text-xl font-bold text-white/90 mb-2">Команда</div>
          <div className="text-white/60 text-center">Рыбаки, технологи, логисты — каждый эксперт в своём деле. Мы работаем напрямую с производителями.</div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center text-center shadow-soft">
          <Gift className="text-gold-400 mb-2" size={36}/>
          <div className="font-semibold text-lg mb-1">Подарочные решения</div>
          <div className="text-white/60">Соберите свой сет или выберите готовый подарок — красиво и удобно.</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center text-center shadow-soft">
          <Truck className="text-caviar-400 mb-2" size={36}/>
          <div className="font-semibold text-lg mb-1">Доставка 24/7</div>
          <div className="text-white/60">Бережная логистика, холодовая цепь, быстрая доставка по городу и стране.</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center text-center shadow-soft">
          <CheckCircle className="text-gold-400 mb-2" size={36}/>
          <div className="font-semibold text-lg mb-1">Контроль качества</div>
          <div className="text-white/60">Сертификаты, свежесть, лабораторные проверки — только лучшее для вас.</div>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-gradient-to-r from-caviar-500/20 to-gold-400/10 p-8 text-white/80 text-center text-lg font-semibold shadow-glow">Спасибо, что выбираете нас!</div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}

import type { Metadata } from 'next'
import { Truck, CreditCard, Store, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Доставка | Икорочка',
  description: 'Условия и способы доставки, оплата, сроки. Охлаждённая логистика по городу и стране.',
  openGraph: {
    title: 'Доставка и оплата | Икорочка',
    description: 'Курьер по городу 2–4 часа, по стране — изотермическая упаковка. Оплата наличными, картой или безналично.',
    type: 'article'
  },
  alternates: { canonical: '/delivery' }
}

export default function DeliveryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Как быстро доставка по городу?', acceptedAnswer: { '@type': 'Answer', text: 'Обычно 2–4 часа в пределах города.' } },
      { '@type': 'Question', name: 'Какие способы оплаты?', acceptedAnswer: { '@type': 'Answer', text: 'Наличные, карта курьеру, онлайн оплата, безнал для юрлиц.' } },
      { '@type': 'Question', name: 'Как обеспечивается холодовая цепь?', acceptedAnswer: { '@type': 'Answer', text: 'Используем изотермическую тару и холодовые элементы.' } }
    ]
  }
  return (
    <main className="container mx-auto px-5 py-16">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">Доставка и оплата</h1>
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <p className="text-lg text-white/70 mb-6 max-w-2xl">Мы доставляем свежую икру и морепродукты по городу и всей стране. Используем изотермическую упаковку и холодовую цепь для сохранения качества.</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-white/80"><Truck className="text-caviar-400" size={22}/> Курьером по городу — 2–4 часа</li>
            <li className="flex items-center gap-3 text-white/80"><Package className="text-gold-400" size={22}/> По стране — надёжные службы, изотермическая упаковка</li>
            <li className="flex items-center gap-3 text-white/80"><Store className="text-gold-400" size={22}/> Самовывоз — холодильная витрина, резерв на 24 часа</li>
            <li className="flex items-center gap-3 text-white/80"><CreditCard className="text-caviar-400" size={22}/> Оплата: наличные, карта, онлайн, безнал для юрлиц</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col gap-6 items-center justify-center shadow-soft">
          <Truck className="text-caviar-400" size={48}/>
          <div className="text-xl font-bold text-white/90 mb-2">Бережная логистика</div>
          <div className="text-white/60 text-center">Изотермическая упаковка, холодовые элементы, отслеживание доставки. Сохраняем свежесть и вкус.</div>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-gradient-to-r from-caviar-500/20 to-gold-400/10 p-8 text-white/80 text-center text-lg font-semibold shadow-glow">Подберём оптимальный способ доставки для вас. Свяжитесь с нами для консультации!</div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}

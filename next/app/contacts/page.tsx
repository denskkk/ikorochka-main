import type { Metadata } from 'next'
import ContactForm from '../../components/ContactForm'

export const metadata: Metadata = {
  title: 'Контакты | Икорочка',
  description: 'Свяжитесь с Икорочка: телефон, Telegram, email. Заказы и консультации по свежей красной икре и морепродуктам.',
  openGraph: {
    title: 'Контакты | Икорочка',
    description: 'Телефон, Telegram и email для быстрого заказа свежей икры и морепродуктов.',
    type: 'website'
  },
  alternates: { canonical: '/contacts' }
}

export default function ContactsPage(){
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Икорочка',
    url: 'https://example.com',
    contactPoint: [{
      '@type': 'ContactPoint',
      telephone: '+380630000000',
      contactType: 'sales',
      areaServed: 'UA',
      availableLanguage: ['uk','ru']
    }]
  }
  return (
    <main className="container mx-auto px-5 py-12">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">Контакты</h1>
      <p className="text-white/70 max-w-2xl mb-8">Мы быстро отвечаем в Telegram и по телефону. Оставьте заявку — перезвоним и уточним детали заказа, фасовку, доставку и предпочтения.</p>
      <div className="grid gap-12 md:grid-cols-2 items-start">
        <div className="space-y-6 text-sm">
          <div>
            <div className="text-white/50 uppercase text-[11px] tracking-wider mb-1">Телефон</div>
            <a href="tel:+380630000000" className="text-lg font-semibold text-gold-300 hover:text-gold-200">+380 (63) 000-00-00</a>
          </div>
          <div>
            <div className="text-white/50 uppercase text-[11px] tracking-wider mb-1">Telegram</div>
            <a href="https://t.me/ikorochka" className="text-lg font-semibold text-gold-300 hover:text-gold-200" target="_blank" rel="noopener noreferrer">@ikorochka</a>
          </div>
          <div>
            <div className="text-white/50 uppercase text-[11px] tracking-wider mb-1">Email</div>
            <a href="mailto:hi@ikorochka.ua" className="text-lg font-semibold text-gold-300 hover:text-gold-200">hi@ikorochka.ua</a>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-white/70 text-sm leading-relaxed">Доставка по місту 2–4 години. Від 3000 ₴ — безкоштовно. Температурний ланцюг збереження якості.</div>
        </div>
        <div className="max-w-md">
          <ContactForm />
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}

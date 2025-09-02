import type { Metadata } from 'next'
import Image from 'next/image'
import formatPrice from '../../utils/formatCurrency'
import OrderButton from '../../components/layout/OrderButton'

export const metadata: Metadata = {
  title: 'Сети | Ікорочка',
  description: 'Подарункові та гастро-набори з ікри й морепродуктів. Ідеально для подарунка або дегустації.'
}

const sets = [
  {
    id: 'set-kamchatka',
  name: 'Сет «Камчатка»',
  desc: 'Ікра кети, гребінець, креветка, подарункова упаковка.',
    price: 4990,
    img: '/assets/ikra.png',
    tag: 'Хит недели'
  },
  {
    id: 'set-premium',
  name: 'Преміум-сет',
  desc: 'Ікра лососева, тартар, рієт, фірмова ложка.',
    price: 3890,
    img: '/assets/ikra.png',
    tag: 'Премиум'
  },
  {
    id: 'set-gift',
  name: 'Подарунковий сет',
  desc: 'Ікра, морепродукти, листівка, гравірування.',
    price: 2990,
    img: '/assets/ikra.png',
    tag: 'Подарок'
  },
]


export default function SetsPage() {
  return (
    <main className="container mx-auto px-5 py-16">
  <h1 className="text-3xl md:text-5xl font-bold mb-8">Сети</h1>
  <p className="text-lg text-white/70 mb-8 max-w-2xl">Подарункові та гастрономічні набори: зберіть свій сет або оберіть готове рішення для подарунка чи дегустації.</p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sets.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col shadow-soft hover:shadow-glow transition group">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4">
              <Image src={s.img} alt={s.name} fill className="object-cover object-center group-hover:scale-105 transition duration-700" sizes="(max-width: 768px) 100vw, 33vw" priority />
              <span className="absolute top-3 left-3 bg-gold-400/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow">{s.tag}</span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1 tracking-tight">{s.name}</h3>
                <div className="text-sm text-white/50 mb-2">{s.desc}</div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold text-gold-400">{formatPrice(s.price)}</span>
                <OrderButton variant="small" labelOverride={langLabel()} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

function langLabel(){
  if (typeof window === 'undefined') return 'Замовити'
  const parts = window.location.pathname.split('/')
  const lang = parts[1] === 'ru' ? 'ru' : 'uk'
  return lang === 'ru' ? 'Заказать' : 'Замовити'
}

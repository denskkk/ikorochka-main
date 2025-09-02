"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import formatPrice from '../../utils/formatCurrency'
import { products as fallbackProducts } from '../../data/products'
import OrderButton from '../../components/layout/OrderButton'

const categories = [
  { key: 'caviar', label: 'Червона ікра' },
  { key: 'seafood', label: 'Морепродукти' },
  { key: 'ready', label: 'Готова продукція' },
]

export default function CatalogPage() {
  const [filter, setFilter] = useState<'caviar'|'seafood'|'ready'|'all'>('all')
  const [products, setProducts] = useState<any[]>(Array.isArray(fallbackProducts) ? fallbackProducts : [])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    fetch('/api/products')
      .then(r => r.json())
      .then(data =>{
        if(!mounted) return
        if (data && typeof data === 'object' && 'error' in data) {
          console.error('GET /api/products error:', data)
          setProducts([])
        } else if (Array.isArray(data)) {
          // Allow genuine empty array (admin cleared catalog)
          setProducts(data)
        } else {
          setProducts([])
        }
      })
      .catch((err)=> {
        console.error('failed to fetch /api/products', err)
        setProducts([])
      })
      .finally(()=> setLoading(false))
    return ()=> { mounted = false }
  },[])

  const filtered = Array.isArray(products)
    ? (filter === 'all' ? products : products.filter(p => p.category === filter))
    : []

  return (
    <main className="container mx-auto px-5 py-16">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">Каталог</h1>
      <p className="text-lg text-white/70 mb-8 max-w-2xl">Свіжа червона ікра, морепродукти та делікатеси з доставкою по місту — <b className='text-gold-400'>безкоштовно від 3000 ₴</b>.</p>
      <div className="flex gap-4 mb-8 flex-wrap">
        <button onClick={()=>setFilter('all')} className={`px-5 py-2 rounded-full border ${filter==='all'?'bg-caviar-500 text-white':'border-white/10 text-white/60'} font-semibold transition`}>Всі</button>
        {categories.map(c => (
          <button key={c.key} onClick={()=>setFilter(c.key as any)} className={`px-5 py-2 rounded-full border ${filter===c.key?'bg-caviar-500 text-white':'border-white/10 text-white/60'} font-semibold transition`}>{c.label}</button>
        ))}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center text-white/60">Товарів наразі немає.</div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col shadow-soft hover:shadow-glow transition group">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4">
                <Image src={p.img} alt={p.name} fill className="object-cover object-center group-hover:scale-105 transition duration-700" sizes="(max-width: 768px) 100vw, 33vw" priority />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1 tracking-tight">{p.name}</h3>
                  <div className="text-sm text-white/50 mb-2">{p.weight}</div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-bold text-gold-400">{formatPrice(p.price)}</span>
                  <OrderButton variant="small" labelOverride={langLabel()} />
                </div>
              </div>
              <div className="mt-3 text-xs text-white/40">{p.stock}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

// Temporary simple function to choose button label based on pathname language
function langLabel(){
  if (typeof window === 'undefined') return 'Замовити'
  const parts = window.location.pathname.split('/')
  const lang = parts[1] === 'ru' ? 'ru' : 'uk'
  return lang === 'ru' ? 'Заказать' : 'Замовити'
}

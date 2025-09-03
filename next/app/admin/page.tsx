"use client"
import { useEffect, useState } from 'react'
import { products as initialProducts } from '../../data/products'
import Image from 'next/image'

type Product = (typeof initialProducts)[number]

export default function AdminPage(){
  const [items, setItems] = useState<Product[]>(Array.isArray(initialProducts) ? initialProducts : [])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const empty: Product = { id: `p-${Date.now()}`, name: '', category: 'caviar', weight: '', price: 0, img: '/assets/ikra.png', stock: '' }
  const [form, setForm] = useState<Product>(empty)
  const [saving, setSaving] = useState(false)
  const [saveInfo, setSaveInfo] = useState<string>('')
  const [adminToken, setAdminToken] = useState('')

  function startEdit(i:number){ setEditingIndex(i); setForm(items[i]) }
  function startNew(){ setEditingIndex(null); setForm({...empty, id:`p-${Date.now()}`}) }
  function save(){
    if(editingIndex === null){ setItems(s => [form, ...s]) }
    else { setItems(s => s.map((it,idx)=> idx===editingIndex? form: it)) }
    setForm({...empty, id:`p-${Date.now()}`})
    setEditingIndex(null)
  }
  function remove(i:number){ setItems(s => s.filter((_,idx)=> idx!==i)) }

  async function onFile(e: any){
    const file = e.target.files?.[0]
    if(!file) return
    const fr = new FileReader()
    fr.onload = () => { setForm(f => ({...f, img: String(fr.result)})) }
    fr.readAsDataURL(file)
  }

  function exportJSON(){
    const blob = new Blob([JSON.stringify(items, null, 2)], {type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'products.json'; a.click(); URL.revokeObjectURL(url)
  }

  useEffect(()=>{
    fetch('/api/products').then(r=> r.json()).then(data=> setItems(data || initialProducts)).catch(()=> setItems(initialProducts))
    // load token from localStorage
    try{ const t = localStorage.getItem('ADMIN_TOKEN'); if(t) setAdminToken(t) }catch{/* ignore */}
  },[])

  async function applyToServer(){
    try{
      setSaving(true); setSaveInfo('')
      const headers: Record<string,string> = { 'Content-Type': 'application/json' }
      const token = (typeof window!=='undefined') ? localStorage.getItem('ADMIN_TOKEN') : null
      if(token) headers['x-admin-token'] = token
      const res = await fetch('/api/products', { method: 'POST', body: JSON.stringify(items), headers })
      if(!res.ok){
        let detail: any
        try{ detail = await res.json() }catch{ try{ detail = await res.text() }catch{ detail = 'unknown error'} }
        const core = (detail?.message || detail?.error || JSON.stringify(detail))
        if(detail?.error === 'unauthorized'){
          throw new Error('unauthorized — задайте ADMIN_TOKEN. Введите токен ниже и повторите.')
        }
        throw new Error('save failed: ' + core)
      }
      const data = await res.json()
      if(data.storage === 'memory'){
        setSaveInfo(`Тимчасово (RAM) збережено о ${new Date().toLocaleTimeString()} ⚠️ Підключи Gist для постійного зберігання.`)
      } else {
        setSaveInfo(`Збережено (${data.storage}) в ${new Date().toLocaleTimeString()} `)
      }
  try { localStorage.setItem('LAST_PRODUCTS', JSON.stringify(items)); localStorage.setItem('LAST_PRODUCTS_UPDATED', String(Date.now())) } catch {/* ignore */}
    }catch(e){ setSaveInfo('Помилка: '+ e) }
    finally{ setSaving(false) }
  }

  return (
    <main className="container mx-auto px-5 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin — Продукти</h1>
        <div className="flex gap-3 items-center flex-wrap">
          <button onClick={startNew} className="px-4 py-2 rounded-full bg-caviar-500 text-white">Додати товар</button>
          <button onClick={exportJSON} className="px-4 py-2 rounded-full border border-white/10">Експорт JSON</button>
          <button disabled={saving} onClick={applyToServer} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 disabled:opacity-40">{saving? 'Збереження...' : 'Зберегти на сервері'}</button>
          <span className="text-xs text-white/60 min-w-[160px]">{saveInfo}</span>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-xs text-white/60 mb-1">ADMIN_TOKEN (для збереження)</label>
          <input value={adminToken} onChange={e=> setAdminToken(e.target.value)} className="p-2 rounded bg-white text-black w-64" placeholder="вставте токен" />
        </div>
        <button
          onClick={()=> { try{ localStorage.setItem('ADMIN_TOKEN', adminToken); setSaveInfo('Токен збережений в браузері'); }catch{ setSaveInfo('Не вдалося зберегти токен') } }}
          className="px-4 py-2 rounded bg-white/10 border border-white/20 text-sm hover:bg-white/20">
          Застосувати токен
        </button>
        {adminToken && (
          <button onClick={()=> { try{ localStorage.removeItem('ADMIN_TOKEN'); }catch{/* ignore */} setAdminToken(''); setSaveInfo('Токен очищено'); }} className="px-3 py-2 rounded border border-white/20 text-xs">Очистити</button>
        )}
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {items.length === 0 && (
            <div className="p-4 rounded border border-dashed text-sm text-white/60">
              Немає товарів. Додайте перший за допомогою кнопки «Додати товар».<br/>
              Категорії доступні: <code>caviar</code> (червона ікра), <code>seafood</code> (морепродукти), <code>ready</code> (готова продукція).
            </div>
          )}
          {(Array.isArray(items) ? items : []).map((p, i) => (
            <div key={p.id} className="p-4 rounded-lg border border-white/8 flex items-center gap-4">
              <div className="w-24 h-16 relative rounded overflow-hidden">
                <Image src={p.img} alt={p.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-white/60">{p.category} · {p.weight} · {p.stock}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={()=> startEdit(i)} className="px-3 py-1 rounded bg-white/6">Edit</button>
                <button onClick={()=> remove(i)} className="px-3 py-1 rounded border border-white/10">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg border border-white/8">
          <h2 className="font-semibold mb-3">Форма товару</h2>
          <p className="text-xs text-white/50 mb-4 leading-relaxed">Заповніть дані і натисніть «Зберегти». Зображення можна вставити як URL або завантажити файл (base64). Потім «Зберегти на сервері». Можете зберегти ADMIN_TOKEN у localStorage (в консолі: <code>localStorage.setItem(&apos;ADMIN_TOKEN&apos;,&apos;ТВОЙ_ТОКЕН&apos;)</code>) для захищеного доступу.</p>
          <div className="grid gap-2">
            <label className="text-xs text-white/60">ID</label>
            <input value={form.id} onChange={e=> setForm(f=>({...f, id:e.target.value}))} className="p-2 rounded bg-white text-black placeholder:text-black/50" />

            <label className="text-xs text-white/60">Назва</label>
            <input value={form.name} onChange={e=> setForm(f=>({...f, name:e.target.value}))} className="p-2 rounded bg-white text-black placeholder:text-black/50" />

            <label className="text-xs text-white/60">Категорія</label>
            <select value={form.category} onChange={e=> setForm(f=>({...f, category: e.target.value as any}))} className="p-2 rounded bg-white text-black">
              <option value="caviar">caviar</option>
              <option value="seafood">seafood</option>
              <option value="ready">ready</option>
            </select>

            <label className="text-xs text-white/60">Вага</label>
            <input value={form.weight} onChange={e=> setForm(f=>({...f, weight:e.target.value}))} className="p-2 rounded bg-white text-black" />

            <label className="text-xs text-white/60">Ціна</label>
            <input type="number" value={form.price} onChange={e=> setForm(f=>({...f, price: Number(e.target.value)}))} className="p-2 rounded bg-white text-black" />

            <label className="text-xs text-white/60">Наявність</label>
            <input value={form.stock} onChange={e=> setForm(f=>({...f, stock:e.target.value}))} className="p-2 rounded bg-white text-black" />

            <label className="text-xs text-white/60">Зображення (локально або URL)</label>
            <input type="file" accept="image/*" onChange={onFile} className="p-2 rounded bg-white text-black" />
            <input value={form.img} onChange={e=> setForm(f=>({...f, img:e.target.value}))} className="p-2 rounded bg-white text-black" />

            <div className="flex gap-2 mt-3">
              <button onClick={save} className="px-4 py-2 rounded bg-caviar-500 text-white">Зберегти</button>
              <button onClick={()=> { setForm(empty); setEditingIndex(null) }} className="px-4 py-2 rounded border">Скинути</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

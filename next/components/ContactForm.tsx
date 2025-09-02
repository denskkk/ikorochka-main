'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import useHydrated from './hooks/useHydrated'

export default function ContactForm(){
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'error'>('idle')
  const pathname = usePathname() || '/'
  const lang = pathname.split('/')[1] === 'ru' ? 'ru' : 'uk'

  const L: any = {
    uk: { name: "Ваше ім'я", phone: 'Телефон', note: 'Коментар', send: 'Відправити', sending: 'Відправляється...', ok: 'Відправлено', error: 'Помилка' },
    ru: { name: 'Ваше имя', phone: 'Телефон', note: 'Комментарий', send: 'Отправить', sending: 'Отправка...', ok: 'Отправлено', error: 'Ошибка' }
  }
  const t = L[lang]
  const hydrated = useHydrated()

  async function submit(e: any){
    e.preventDefault()
    setStatus('sending')
    try{
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, note, locale: lang })
      })
      if(res.ok){
        setStatus('ok')
        setName(''); setPhone(''); setNote('')
      }else{
        setStatus('error')
      }
    }catch(e){
      setStatus('error')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder={hydrated ? t.name : L.uk.name} className="w-full p-3 rounded bg-white/5" />
      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder={hydrated ? t.phone : L.uk.phone} className="w-full p-3 rounded bg-white/5" />
      <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={hydrated ? t.note : L.uk.note} className="w-full p-3 rounded bg-white/5" />
      <div>
        <button type="submit" className="px-4 py-2 rounded bg-caviar-500">{status==='sending' ? t.sending : t.send}</button>
        {status==='ok' && <span className="ml-3 text-green-400">{t.ok}</span>}
        {status==='error' && <span className="ml-3 text-red-400">{t.error}</span>}
      </div>
    </form>
  )
}

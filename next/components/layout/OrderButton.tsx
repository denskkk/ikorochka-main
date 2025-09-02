'use client'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface OrderButtonProps { variant?: 'default' | 'small'; labelOverride?: string }

export default function OrderButton({ variant='default', labelOverride }: OrderButtonProps){
  const [open, setOpen] = useState(false)
  const [name,setName] = useState('')
  const [phone,setPhone] = useState('')
  const [note,setNote] = useState('')
  const [website,setWebsite] = useState('') // honeypot
  const [status,setStatus] = useState<'idle'|'sending'|'ok'|'error'>('idle')
  const [errorMsg,setErrorMsg] = useState('')
  const pathname = usePathname() || '/'
  const lang = pathname.split('/')[1] === 'ru' ? 'ru' : 'uk'
  const firstFieldRef = useRef<HTMLInputElement|null>(null)

  const L: any = {
    uk: { order:'Замовити', ordering:'Відправляється...', success:'Заявку надіслано', fail:'Помилка', name:"Ім'я", phone:'Телефон', comment:'Коментар', send:'Надіслати', close:'Закрити', again:'Ще одну', required:'Вкажіть телефон', rate:'Забагато заявок, спробуйте пізніше', spam:'Виявлено спам' },
    ru: { order:'Заказать', ordering:'Отправка...', success:'Заявка отправлена', fail:'Ошибка', name:'Имя', phone:'Телефон', comment:'Комментарий', send:'Отправить', close:'Закрыть', again:'Ещё одну', required:'Укажите телефон', rate:'Слишком много заявок, попробуйте позже', spam:'Обнаружен спам' }
  }
  const t = L[lang]

  useEffect(()=>{ if(open){ setTimeout(()=>firstFieldRef.current?.focus(), 40) }},[open])

  async function submit(e:any){
    e.preventDefault()
    if(!phone.trim()) { setErrorMsg(t.required); return }
    setStatus('sending'); setErrorMsg('')
    try {
      const res = await fetch('/api/notify', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, phone, note, website, locale: lang }) })
      if(res.ok){
        setStatus('ok')
        setName(''); setPhone(''); setNote(''); setWebsite('')
      } else {
        setStatus('error')
        try {
          const j = await res.json()
          if(j.error==='rate_limited') setErrorMsg(t.rate)
          else if(j.error==='spam_detected') setErrorMsg(t.spam)
          else if(j.error==='invalid_phone') setErrorMsg(t.required)
          else setErrorMsg(j.error || t.fail)
        } catch(_err){ /* ignore */ }
      }
    } catch(err:any){
      setStatus('error'); setErrorMsg(String(err?.message||err))
    }
  }

  function reset(){ setStatus('idle'); setErrorMsg('') }

  const label = labelOverride || (status==='sending' ? t.ordering : t.order)
  const baseBtn = variant==='small'
    ? 'h-9 px-4 text-xs rounded-full'
    : 'h-10 px-5 text-sm rounded-full'

  // Accessibility & focus trap
  const dialogRef = useRef<HTMLDivElement|null>(null)

  useEffect(()=>{
    if(open){
      const prevOverflow = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
      const keyHandler = (e: KeyboardEvent)=>{
        if(e.key === 'Escape') { e.stopPropagation(); setOpen(false) }
        if(e.key === 'Tab' && dialogRef.current){
          const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
          const list = Array.from(focusables).filter(el=>!el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))
          if(list.length){
            const first = list[0]
            const last = list[list.length-1]
            if(!dialogRef.current.contains(document.activeElement)){
              first.focus();
              e.preventDefault();
              return
            }
            if(!e.shiftKey && document.activeElement === last){
              first.focus(); e.preventDefault();
            }else if(e.shiftKey && document.activeElement === first){
              last.focus(); e.preventDefault();
            }
          }
        }
      }
      window.addEventListener('keydown', keyHandler, { capture: true })
      return ()=>{ window.removeEventListener('keydown', keyHandler, { capture: true } as any); document.documentElement.style.overflow = prevOverflow }
    }
  },[open])

  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)
  useEffect(()=>{
    if(typeof document !== 'undefined'){
      let el = document.getElementById('order-modal-root') as HTMLElement | null
      if(!el){
        el = document.createElement('div')
        el.id = 'order-modal-root'
        document.body.appendChild(el)
      }
      setPortalEl(el)
    }
  },[])

  return <>
    <button onClick={()=>{ setOpen(true); reset(); }} className={`relative font-semibold inline-flex items-center justify-center bg-caviar-500 hover:bg-caviar-400 transition shadow-glow ${baseBtn}`}>
      {label}
    </button>
    {open && portalEl && createPortal(
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" aria-modal="true" role="dialog" aria-labelledby="order-dialog-title">
        <div className="absolute inset-0 bg-black/75 backdrop-blur-xl" onClick={()=>setOpen(false)} />
        <div ref={dialogRef} className="relative w-full max-w-lg bg-gradient-to-b from-graphite-900/96 via-graphite-950/95 to-black/95 border border-white/10 shadow-[0_20px_64px_-8px_rgba(0,0,0,.75)] rounded-3xl flex flex-col overflow-hidden animate-pop ring-1 ring-white/5">
          <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-white/8 via-transparent to-transparent" />
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02] backdrop-blur-sm">
            <h2 id="order-dialog-title" className="font-semibold text-base sm:text-lg tracking-tight text-white/90">{t.order}</h2>
            <button onClick={()=>setOpen(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition"><X size={18}/></button>
          </div>
          <div className="p-5 sm:p-6 flex-1 overflow-y-auto custom-scroll min-h-[340px] max-h-[78vh]">
            {status==='ok' ? (
              <div className="space-y-5 text-center py-6">
                <div className="text-green-400 font-semibold text-lg">{t.success}</div>
                <button onClick={()=>{ reset(); }} className="px-5 py-2 rounded-full bg-caviar-500 hover:bg-caviar-400 text-sm font-semibold">{t.again}</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" autoComplete="off" noValidate>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wide">{t.name}</label>
                  <input ref={firstFieldRef} value={name} onChange={e=>setName(e.target.value)} placeholder={t.name} className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:ring-2 focus:ring-caviar-400/70 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wide">{t.phone}</label>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder={t.phone} className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:ring-2 focus:ring-caviar-400/70 text-sm" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wide">{t.comment}</label>
                  <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={t.comment} className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:ring-2 focus:ring-caviar-400/70 text-sm min-h-[110px] resize-y" />
                </div>
                <input value={website} onChange={e=>setWebsite(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                {errorMsg && <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 px-3 py-2 rounded-lg">{errorMsg}</div>}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                  <button type="submit" disabled={status==='sending'} className="px-6 py-3 rounded-full bg-caviar-500 hover:bg-caviar-400 disabled:opacity-60 text-sm font-semibold shadow-glow">
                    {status==='sending' ? t.ordering : t.send}
                  </button>
                  <button type="button" onClick={()=>setOpen(false)} className="text-sm text-white/60 hover:text-white px-2 py-2">{t.close}</button>
                </div>
              </form>
            )}
          </div>
          <div className="px-5 py-3 text-[11px] leading-relaxed text-white/40 border-t border-white/10 bg-black/20">
            Telegram instant notification · Anti-spam & rate limiting.
          </div>
        </div>
      </div>, portalEl)
    }

    <style jsx global>{`
      @keyframes pop { 0% { transform: translateY(30px) scale(.98); opacity:0 } 100% { transform: translateY(0) scale(1); opacity:1 } }
      .animate-pop { animation: pop .35s cubic-bezier(.4,.8,.3,1) }
      .custom-scroll { scrollbar-width: thin; }
      .custom-scroll::-webkit-scrollbar { width:8px; }
      .custom-scroll::-webkit-scrollbar-track { background: transparent; }
      .custom-scroll::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, rgba(255,255,255,.15), rgba(255,255,255,.05)); border-radius:4px; }
    `}</style>
  </>
}

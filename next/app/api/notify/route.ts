import { NextResponse } from 'next/server'

// Keep edge runtime for low latency. Simple in-memory rate limiter (best effort, not globally shared).
export const runtime = 'edge'

const TELEGRAM_API = 'https://api.telegram.org'

// --- Rate limiting (in-memory, per edge instance) ---
type Entry = { count: number; expires: number }
// window: 5 minutes, max submissions per IP
const WINDOW_MS = 5 * 60 * 1000
const MAX_PER_WINDOW = 6
// Basic bucket: ip -> Entry
const rateMap: Map<string, Entry> = new Map()

function rateLimit(ip: string){
  const now = Date.now()
  const e = rateMap.get(ip)
  if(!e || e.expires < now){
    rateMap.set(ip, { count: 1, expires: now + WINDOW_MS })
    return { allowed: true }
  }
  if(e.count >= MAX_PER_WINDOW){
    return { allowed: false, retryAfter: Math.ceil((e.expires - now)/1000) }
  }
  e.count++
  return { allowed: true }
}

// Basic sanitization
function clean(s: any){
  if(typeof s !== 'string') return ''
  return s.replace(/[<>`]/g,'').trim().slice(0, 500)
}

function looksSpam(note: string){
  const lower = note.toLowerCase()
  if(/https?:\/\//.test(lower)) return true
  if(/viagra|casino|bitcoin|earn money|http/.test(lower)) return true
  return false
}

export async function POST(req: Request){
  try{
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || '0.0.0.0'
    const body = await req.json().catch(()=> ({}))
    const { name, phone, note, website } = body || {}

    // Honeypot
    if(website){
      return NextResponse.json({ ok: true, skipped: true })
    }

    // Validation
    const phoneStr = clean(phone)
    if(!phoneStr || phoneStr.replace(/\D/g,'').length < 8){
      return NextResponse.json({ error: 'invalid_phone' }, { status: 400 })
    }
    const nameStr = clean(name).slice(0,80)
    const noteStr = clean(note).slice(0,400)

    if(looksSpam(noteStr)){
      return NextResponse.json({ error: 'spam_detected' }, { status: 400 })
    }

    // Rate limit
    const rl = rateLimit(ip)
    if(!rl.allowed){
      return NextResponse.json({ error: 'rate_limited', retryAfter: rl.retryAfter }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } })
    }

    if(!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID){
      return NextResponse.json({ error: 'telegram_not_configured' }, { status: 500 })
    }
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    const text = [
      'Новая заявка с сайта:',
      `IP: ${ip}`,
      `Имя: ${nameStr || '-'}`,
      `Телефон: ${phoneStr || '-'}`,
      `Комментарий: ${noteStr || '-'}`,
    ].join('\n')

    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    })
    if(!res.ok){
      const txt = await res.text()
      return NextResponse.json({ error: 'telegram_error', detail: txt }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  }catch(e:any){
    return NextResponse.json({ error: 'cannot_send', message: String(e?.message || e) }, { status: 500 })
  }
}

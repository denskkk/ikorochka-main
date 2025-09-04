import { NextResponse } from 'next/server'

// Keep edge runtime for low latency. Simple in-memory rate limiter (best effort, not globally shared).
// Edge возможен, но для отладки Telegram иногда удобнее nodejs (лучше логи). Можно вернуть 'edge' при желании.
export const runtime = 'nodejs'

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
  const { name, phone, note, website, productId, productName, productPrice } = body || {}

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

    const lines: string[] = []
    lines.push('Новая заявка с сайта:')
    lines.push(`IP: ${ip}`)
    lines.push(`Имя: ${nameStr || '-'}`)
    lines.push(`Телефон: ${phoneStr || '-'}`)
    if(productId || productName){
      const pLine = [`Товар:`,
        productName ? ` ${productName}` : '',
        productId ? ` (id: ${productId})` : '',
        (productPrice!==undefined && productPrice!==null && productPrice!=='') ? ` | Цена: ${productPrice}` : ''
      ].join('').trim()
      lines.push(pLine)
    }
    lines.push(`Комментарий: ${noteStr || '-'}`)
    const text = lines.join('\n')

    const url = `${TELEGRAM_API}/bot${token}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    })
    if(!res.ok){
      let detail: any
      try { detail = await res.json() } catch { detail = await res.text() }
      console.error('Telegram sendMessage failed', { status: res.status, detail })

      const description: string = (detail?.description || '').toLowerCase()
      let cause = 'unknown'
      const nextSteps: string[] = []
      if(description.includes('chat not found')){
        cause = 'chat_not_found'
        nextSteps.push(
          'Убедись что указал правильный CHAT ID (для канала/супергруппы обычно начинается с -100...)',
          'Добавь бота в канал/группу и дай хотя бы право отправки сообщений',
          'Если это приватный канал: сделай бота админом или используй @username для получения id через сторонние боты (@getidsbot)',
          'Проверь токен через: https://api.telegram.org/bot<TOKEN>/getMe (должен вернуть ok:true)'
        )
      }else if(description.includes('forbidden')){
        cause = 'forbidden'
        nextSteps.push(
          'Пользователь/чат запретил боту писать или бот не добавлен',
          'Для каналов: бот должен быть админом',
          'Попробуй удалить и снова добавить бота'
        )
      }else{
        nextSteps.push('Проверь токен и chat id','Повтори запрос позже','Смотри логи для деталей')
      }

      return NextResponse.json({
        error: 'telegram_error',
        status: res.status,
        cause,
        detail,
        suggestions: nextSteps,
        debug: {
          tokenPresent: !!token,
          chatIdSample: chatId?.toString().slice(0,6)+"…",
          urlUsed: '/bot<token>/sendMessage',
          hints: [
            'Бот в канале/группе и не заблокирован',
            'Для канала: бот админ',
            'Chat id корректный (минус перед числами, -100 для канала)',
            'Проверка токена через getMe'
          ],
          selfTest: {
            curlExample: 'curl -X POST https://api.telegram.org/botTOKEN/sendMessage -H "Content-Type: application/json" -d "{\\n  \'chat_id\': CHAT_ID,\\n  \'text\': \'test\'\\n}"'
          }
        }
      }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  }catch(e:any){
    return NextResponse.json({ error: 'cannot_send', message: String(e?.message || e) }, { status: 500 })
  }
}

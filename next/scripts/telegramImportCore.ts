import fs from 'fs'
import path from 'path'

export interface ImportOptions {
  limit?: number
  since?: Date | null
}

export interface ImportResult {
  added: number
  products: any[]
  newProducts: any[]
  skipped: number
  errors: { id?: string; error: any }[]
}

function slugify(str:string){
  return str.toLowerCase().replace(/[^a-zа-яёїієґ0-9]+/gi,'-').replace(/^-+|-+$/g,'').substring(0,50)
}

export async function runTelegramImport({ limit = 100, since = null }: ImportOptions = {}): Promise<ImportResult>{
  const { TelegramClient } = await import('telegram') as any
  const { StringSession } = (await import('telegram/sessions')) as any
  const apiId = parseInt(process.env.TELEGRAM_API_ID || '')
  const apiHash = process.env.TELEGRAM_API_HASH
  const channel = process.env.TELEGRAM_CHANNEL
  const chatIdEnv = process.env.TELEGRAM_CHAT_ID
  const chatId = chatIdEnv ? parseInt(chatIdEnv) : undefined
  if(!apiId || !apiHash || (!channel && !chatId)) throw new Error('Missing Telegram credentials')

  const sessStr = process.env.TELEGRAM_SESSION || ''
  const stringSession = new StringSession(sessStr)
  const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })
  await client.start({ phoneNumber: async () => { throw new Error('Interactive login not supported in API route. Provide TELEGRAM_SESSION.') }, password: async () => '', phoneCode: async () => '', onError: (e: unknown)=>{ console.error(e) } })

  let entity: any
  if(chatId){
    entity = await client.getEntity(chatId)
  } else if(channel){
    const dialogs = await client.getDialogs()
    entity = dialogs.find((d:any)=> d?.entity?.username?.toLowerCase() === channel.toLowerCase())?.entity || await client.getEntity(channel)
  }
  if(!entity) throw new Error('Channel/group entity not found')

  const productsPath = path.join(process.cwd(), 'data', 'products.json')
  const existing: any[] = JSON.parse(fs.readFileSync(productsPath,'utf8'))
  const existingIds = new Set(existing.map(p=>p.id))

  const iterator = client.iterMessages(entity, { limit })
  const newProducts: any[] = []
  const errors: { id?: string; error:any }[] = []
  let skipped = 0
  for await (const message of iterator){
    try {
      if(!message) continue
      if(since && message.date < since) break
      const text: string = message.message || message.text || ''
      if(!text) { skipped++; continue }
      if(!/(грн)/i.test(text)) { skipped++; continue }
      const priceMatch = text.match(/([0-9][0-9 .]{0,8})\s*грн/i)
      if(!priceMatch){ skipped++; continue }
      const price = parseInt(priceMatch[1].replace(/[^0-9]/g,''))
      if(!price || isNaN(price)){ skipped++; continue }
      const weightMatch = text.match(/([0-9.,]+)\s*(кг|г|гр|kg|g)/i)
      const weight = weightMatch ? weightMatch[0].replace(/\s+/g,' ') : ''
      let firstLine = text.split(/\n+/)[0]
      firstLine = firstLine.replace(/Собираю.*|Предзаказ.*/i,'').trim() || firstLine.trim()
      const nameRaw = firstLine.split(/-|—/)[0].trim()
      const name = nameRaw.length > 5 ? nameRaw : `Товар ${message.id}`
      const lower = text.toLowerCase()
      let category: 'caviar' | 'seafood' | 'ready' = 'seafood'
      if(/икр/.test(lower)) category = 'caviar'
      else if(/сет|набор/.test(lower)) category = 'ready'
      const stock = /нет|законч/i.test(lower) ? 'немає' : 'є в наявності'
      const id = slugify(name) + '-' + message.id
      if(existingIds.has(id)) { skipped++; continue }
      let img = ''
      if(message.photo){
        const filePath = path.join('public','assets','auto', `${id}.jpg`)
        const absPath = path.join(process.cwd(), filePath)
        fs.mkdirSync(path.dirname(absPath), { recursive: true })
        try {
          const buff = await client.downloadMedia(message.photo, {})
          fs.writeFileSync(absPath, buff)
          img = '/' + filePath.replace(/\\/g,'/')
        } catch(e){
          console.warn('Photo download failed', id, e)
        }
      }
      const product = { id, name, category, weight, price, img, stock, description: text.split('\n').slice(1,4).join(' ') }
      newProducts.push(product)
      existing.push(product)
      existingIds.add(id)
    } catch(e:any){
      errors.push({ error: e })
    }
  }
  if(newProducts.length){
    fs.writeFileSync(productsPath, JSON.stringify(existing, null, 2), 'utf8')
  }
  return { added: newProducts.length, products: existing, newProducts, skipped, errors }
}

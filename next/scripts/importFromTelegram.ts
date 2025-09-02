/*
 Script to import products from a Telegram channel using MTProto (gramjs).
 Usage (after installing deps and setting env):
   npx ts-node scripts/importFromTelegram.ts --limit 200 --since 2025-08-01

 Required ENV:
   TELEGRAM_API_ID=xxxxx
   TELEGRAM_API_HASH=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TELEGRAM_CHANNEL=ikorochka_channel_username (without @)
   TELEGRAM_SESSION=base64 session string (will be generated on first run if absent)
*/

import fs from 'fs'
import path from 'path'
import { argv } from 'process'

// Lazy import gramjs to avoid type issues if not installed yet
async function run(){
  const { TelegramClient } = await import('telegram') as any
  const { StringSession } = (await import('telegram/sessions')) as any

  const apiId = parseInt(process.env.TELEGRAM_API_ID || '')
  const apiHash = process.env.TELEGRAM_API_HASH
  const channel = process.env.TELEGRAM_CHANNEL // username without @
  const chatIdEnv = process.env.TELEGRAM_CHAT_ID // numeric id like -1001234567890 (for supergroup/channel)
  const chatId = chatIdEnv ? parseInt(chatIdEnv) : undefined
  if(!apiId || !apiHash || (!channel && !chatId)){
    console.error('Missing TELEGRAM_API_ID / TELEGRAM_API_HASH and TELEGRAM_CHANNEL or TELEGRAM_CHAT_ID')
    process.exit(1)
  }

  const sessStr = process.env.TELEGRAM_SESSION || ''
  const stringSession = new StringSession(sessStr)
  const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })
  await client.start({
    phoneNumber: async () => { throw new Error('Provide TELEGRAM_SESSION to run headless. Run once interactively to capture session.') },
    password: async () => '',
    phoneCode: async () => '',
  onError: (err: unknown) => console.error(err)
  })
  if(!process.env.TELEGRAM_SESSION){
    console.log('SESSION STRING:', client.session.save())
  }

  const limitArg = argv.includes('--limit') ? parseInt(argv[argv.indexOf('--limit')+1]) : 100
  const sinceArg = argv.includes('--since') ? new Date(argv[argv.indexOf('--since')+1]) : null

  let entity: any
  if(chatId){
    entity = await client.getEntity(chatId)
  } else if(channel){
    const dialogs = await client.getDialogs()
    entity = dialogs.find((d:any)=> d?.entity?.username?.toLowerCase() === channel.toLowerCase())?.entity
      || await client.getEntity(channel)
  }

  const productsPath = path.join(process.cwd(), 'data', 'products.json')
  const existing: any[] = JSON.parse(fs.readFileSync(productsPath,'utf8'))
  const existingIds = new Set(existing.map(p=>p.id))

  function slugify(str:string){
    return str.toLowerCase().replace(/[^a-zа-яёїієґ0-9]+/gi,'-').replace(/^-+|-+$/g,'').substring(0,50)
  }

  const iterator = client.iterMessages(entity, { limit: limitArg })
  const newProducts: any[] = []
  for await (const message of iterator){
    if(!message) continue
    if(sinceArg && message.date < sinceArg) break
    const text: string = message.message || message.text || ''
    if(!text) continue
    if(!/(грн)/i.test(text)) continue // heuristic: must contain price

    // Extract price
    const priceMatch = text.match(/([0-9][0-9 .]{0,8})\s*грн/i)
    if(!priceMatch) continue
    const price = parseInt(priceMatch[1].replace(/[^0-9]/g,''))

    // Extract weight
    const weightMatch = text.match(/([0-9.,]+)\s*(кг|г|гр|kg|g)/i)
    const weight = weightMatch ? weightMatch[0].replace(/\s+/g,' ') : ''

    // Name (first line or before price)
    let firstLine = text.split(/\n+/)[0]
    firstLine = firstLine.replace(/Собираю.*|Предзаказ.*/i,'').trim() || firstLine.trim()
    const nameRaw = firstLine.split(/-|—/)[0].trim()
    const name = nameRaw.length > 5 ? nameRaw : `Товар ${message.id}`

    // Category inference
    const lower = text.toLowerCase()
    let category: 'caviar' | 'seafood' | 'ready' = 'seafood'
    if(/икр/.test(lower)) category = 'caviar'
    else if(/сет|набор/.test(lower)) category = 'ready'

    // Stock heuristic
    const stock = /нет|законч/i.test(lower) ? 'немає' : 'є в наявності'

    // Build id and skip duplicates
    const id = slugify(name) + '-' + message.id
    if(existingIds.has(id)) continue

    // Download photo if exists
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
        console.warn('Failed to download photo for', id, e)
      }
    }

    const product = { id, name, category, weight, price, img, stock, description: text.split('\n').slice(1,4).join(' ') }
    newProducts.push(product)
    existing.push(product)
    existingIds.add(id)
  }

  if(newProducts.length){
    fs.writeFileSync(productsPath, JSON.stringify(existing, null, 2), 'utf8')
    console.log('Added', newProducts.length, 'products')
  } else {
    console.log('No new products detected')
  }
  process.exit(0)
}

run().catch(e=>{ console.error(e); process.exit(1) })

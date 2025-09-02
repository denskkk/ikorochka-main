/* JS version of importer (no ts-node required)
   Usage:
     node scripts/importFromTelegram.mjs --limit 500 --since 2025-08-01
*/
import fs from 'fs'
import dotenv from 'dotenv'
// Load .env.local first, fallback to .env
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' })
} else {
  dotenv.config()
}
import path from 'path'
import process from 'process'

const { TelegramClient } = await import('telegram')
const { StringSession } = await import('telegram/sessions/index.js')

const apiId = parseInt(process.env.TELEGRAM_API_ID || '')
const apiHash = process.env.TELEGRAM_API_HASH
const channel = process.env.TELEGRAM_CHANNEL
const chatIdEnv = process.env.TELEGRAM_CHAT_ID
const chatId = chatIdEnv ? parseInt(chatIdEnv) : undefined
if(!apiId || !apiHash || (!channel && !chatId)){
  console.error('Missing credentials (TELEGRAM_API_ID / TELEGRAM_API_HASH / TELEGRAM_CHANNEL or TELEGRAM_CHAT_ID)')
  process.exit(1)
}

const sessStr = process.env.TELEGRAM_SESSION || ''
const stringSession = new StringSession(sessStr)
const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })
await client.start({
  phoneNumber: async () => { throw new Error('Provide TELEGRAM_SESSION.') },
  password: async () => '',
  phoneCode: async () => '',
  onError: (e)=> console.error(e)
})

const args = process.argv.slice(2)
const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit')+1]) : 200
const since = args.includes('--since') ? new Date(args[args.indexOf('--since')+1]) : null

let entity
if(chatId){
  entity = await client.getEntity(chatId)
} else if(channel){
  const dialogs = await client.getDialogs()
  entity = dialogs.find(d=> d?.entity?.username?.toLowerCase() === channel.toLowerCase())?.entity || await client.getEntity(channel)
}
if(!entity){
  console.error('Entity not found')
  process.exit(1)
}

const productsPath = path.join(process.cwd(), 'data', 'products.json')
const existing = JSON.parse(fs.readFileSync(productsPath,'utf8'))
const existingIds = new Set(existing.map(p=>p.id))
const slugify = (s)=> s.toLowerCase().replace(/[^a-zа-яёїієґ0-9]+/gi,'-').replace(/^-+|-+$/g,'').substring(0,50)

const iterator = client.iterMessages(entity, { limit })
let added = 0
for await (const message of iterator){
  if(!message) continue
  if(since && message.date < since) break
  const text = message.message || message.text || ''
  if(!text) continue
  if(!/(грн)/i.test(text)) continue
  const priceMatch = text.match(/([0-9][0-9 .]{0,8})\s*грн/i)
  if(!priceMatch) continue
  const price = parseInt(priceMatch[1].replace(/[^0-9]/g,''))
  const weightMatch = text.match(/([0-9.,]+)\s*(кг|г|гр|kg|g)/i)
  const weight = weightMatch ? weightMatch[0].replace(/\s+/g,' ') : ''
  let firstLine = text.split(/\n+/)[0]
  firstLine = firstLine.replace(/Собираю.*|Предзаказ.*/i,'').trim() || firstLine.trim()
  const nameRaw = firstLine.split(/-|—/)[0].trim()
  const name = nameRaw.length > 5 ? nameRaw : `Товар ${message.id}`
  const lower = text.toLowerCase()
  let category = 'seafood'
  if(/икр/.test(lower)) category = 'caviar'
  else if(/сет|набор/.test(lower)) category = 'ready'
  const stock = /нет|законч/i.test(lower) ? 'немає' : 'є в наявності'
  const id = slugify(name) + '-' + message.id
  if(existingIds.has(id)) continue
  let img = ''
  // Try to download photo (supports messages with media.photo or photo property)
  if(message.photo || (message.media && message.media.photo)){
    const filePath = path.join('public','assets','auto', `${id}.jpg`)
    const absPath = path.join(process.cwd(), filePath)
    fs.mkdirSync(path.dirname(absPath), { recursive: true })
    try {
      // Using whole message gives gramjs freedom to pick best size
      const buff = await client.downloadMedia(message, {})
      if(buff){
        fs.writeFileSync(absPath, buff)
        img = '/' + filePath.replace(/\\/g,'/')
      }
    } catch(e){ console.warn('Photo download failed', id, e.message || e) }
  }
  const product = { id, name, category, weight, price, img, stock, description: text.split('\n').slice(1,4).join(' ') }
  existing.push(product)
  existingIds.add(id)
  added++
}
if(added){
  fs.writeFileSync(productsPath, JSON.stringify(existing, null, 2), 'utf8')
  console.log('Added', added, 'products')
} else {
  console.log('No new products')
}

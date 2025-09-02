/* Re-download images for products lacking img or whose file is missing.
   Usage:
     node scripts/repairProductImages.mjs --limit 3000
*/
import fs from 'fs'
import path from 'path'
import process from 'process'
import dotenv from 'dotenv'
if (fs.existsSync('.env.local')) dotenv.config({ path: '.env.local' }); else dotenv.config()

const { TelegramClient } = await import('telegram')
const { StringSession } = await import('telegram/sessions/index.js')

const apiId = parseInt(process.env.TELEGRAM_API_ID || '')
const apiHash = process.env.TELEGRAM_API_HASH
const channel = process.env.TELEGRAM_CHANNEL
const chatIdEnv = process.env.TELEGRAM_CHAT_ID
const chatId = chatIdEnv ? parseInt(chatIdEnv) : undefined
const sessStr = process.env.TELEGRAM_SESSION || ''
if(!apiId || !apiHash || (!channel && !chatId) || !sessStr){
  console.error('Missing env vars'); process.exit(1)
}

const limitArg = process.argv.includes('--limit') ? parseInt(process.argv[process.argv.indexOf('--limit')+1]) : 1000

const productsPath = path.join(process.cwd(), 'data', 'products.json')
const products = JSON.parse(fs.readFileSync(productsPath,'utf8'))
const needsImage = new Map()
for(const p of products){
  if(!p.img || p.img === ''){
    // message id is after last dash
    const mid = p.id.split('-').pop()
    needsImage.set(mid, p)
  } else {
    const abs = path.join(process.cwd(), p.img.replace(/^\//,''))
    if(!fs.existsSync(abs)){
      const mid = p.id.split('-').pop()
      needsImage.set(mid, p)
    }
  }
}
if(!needsImage.size){ console.log('No products need image repair'); process.exit(0) }
console.log('Will attempt to repair', needsImage.size, 'products')

const stringSession = new StringSession(sessStr)
const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })
await client.start({ phoneNumber: async () => { throw new Error('Need session'); }, password: async () => '', phoneCode: async () => '', onError: (e)=> console.error(e) })

let entity
if(chatId){ entity = await client.getEntity(chatId) } else { entity = await client.getEntity(channel) }

const iterator = client.iterMessages(entity, { limit: limitArg })
let fixed = 0
for await (const message of iterator){
  if(!message) continue
  const mid = String(message.id)
  if(!needsImage.has(mid)) continue
  try {
    if(message.photo || (message.media && message.media.photo)){
      const p = needsImage.get(mid)
      const filePath = path.join('public','assets','auto', `${p.id}.jpg`)
      const absPath = path.join(process.cwd(), filePath)
      fs.mkdirSync(path.dirname(absPath), { recursive: true })
      const buff = await client.downloadMedia(message, {})
      if(buff){
        fs.writeFileSync(absPath, buff)
        p.img = '/' + filePath.replace(/\\/g,'/')
        fixed++
        needsImage.delete(mid)
        console.log('Repaired', p.id)
      }
    }
  } catch(e){
    console.warn('Failed to repair', mid, e.message || e)
  }
  if(!needsImage.size) break
}
if(fixed){
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2),'utf8')
  console.log('Fixed images for', fixed, 'products')
} else {
  console.log('No images fixed')
}
if(needsImage.size){
  console.log('Remaining without images:', Array.from(needsImage.values()).map(p=>p.id))
}

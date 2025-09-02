/* ESM JS version of getTelegramSession (no TypeScript needed)
   Usage:
     node scripts/getTelegramSession.mjs
*/
// Load environment variables: prefer .env.local then fallback to .env
import fs from 'fs'
import dotenv from 'dotenv'
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' })
} else {
  dotenv.config()
}
import readline from 'readline'
const { TelegramClient } = await import('telegram')
// Explicit index.js to avoid ERR_UNSUPPORTED_DIR_IMPORT on Node 22
const { StringSession } = await import('telegram/sessions/index.js')

const apiId = parseInt(process.env.TELEGRAM_API_ID || '')
const apiHash = process.env.TELEGRAM_API_HASH
if(!apiId || !apiHash){
  console.error('Set TELEGRAM_API_ID and TELEGRAM_API_HASH in env before running.')
  process.exit(1)
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q)=> new Promise(r=> rl.question(q, a=> r(a.trim())))

try {
  const phone = await ask('Phone number (+380XXXXXXXXX): ')
  const client = new TelegramClient(new StringSession(''), apiId, apiHash, { connectionRetries: 5 })
  await client.start({
    phoneNumber: async () => phone,
    password: async () => await ask('Two-step password (blank if none): '),
    phoneCode: async () => await ask('Code from Telegram: '),
    onError: (e)=> console.error(e)
  })
  console.log('\nSESSION_STRING=')
  console.log(client.session.save())
  console.log('\nAdd to .env.local as TELEGRAM_SESSION=... (keep secret)')
  rl.close()
  process.exit(0)
} catch(e){
  console.error(e)
  rl.close()
  process.exit(1)
}

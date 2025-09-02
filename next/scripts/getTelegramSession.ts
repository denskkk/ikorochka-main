/*
Interactive one-time helper to obtain TELEGRAM_SESSION string.
Usage:
  npm install telegram
  npx ts-node next/scripts/getTelegramSession.ts
Then copy printed SESSION_STRING into .env.local as TELEGRAM_SESSION=...
*/
import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'
import * as readline from 'readline'

const apiId = parseInt(process.env.TELEGRAM_API_ID || '')
const apiHash = process.env.TELEGRAM_API_HASH
if(!apiId || !apiHash){
  console.error('Set TELEGRAM_API_ID and TELEGRAM_API_HASH in env before running.')
  process.exit(1)
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
function ask(q:string){ return new Promise<string>(res=> rl.question(q, ans=> res(ans.trim()))) }

async function main(){
  const phone = await ask('Phone number (international format, e.g. +380XXXXXXXXX): ')
  const client = new TelegramClient(new StringSession(''), apiId, apiHash, { connectionRetries: 5 })
  await client.start({
    phoneNumber: async () => phone,
    password: async () => await ask('Two‑step password (or blank): '),
    phoneCode: async () => await ask('Code from Telegram: '),
  onError: (err: unknown)=> console.error(err)
  })
  console.log('\nSESSION_STRING=')
  console.log(client.session.save())
  console.log('\nAdd this to .env.local as TELEGRAM_SESSION=... and NEVER share it.')
  rl.close()
  process.exit(0)
}

main().catch(e=>{ console.error(e); rl.close(); process.exit(1) })

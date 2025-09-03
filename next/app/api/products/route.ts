import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Optional: Fallback to GitHub Gist when filesystem not writable (e.g. some hosting or read-only build output)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GIST_ID = process.env.PRODUCTS_GIST_ID // create empty gist with a products.json file
const ADMIN_TOKEN = process.env.ADMIN_SYNC_TOKEN

export const runtime = 'nodejs'

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json')

export async function GET(){
  // Try local file first
  try{
    const raw = await fs.readFile(DATA_PATH, 'utf-8')
    let mtime = ''
  try { const st = await fs.stat(DATA_PATH); mtime = st.mtime.toISOString() } catch{ /* ignore stat error */ }
    return new NextResponse(raw, { status: 200, headers: { 'Content-Type': 'application/json', 'X-Source':'file', 'X-Updated': mtime } })
  }catch(e:any){
    if(GITHUB_TOKEN && GIST_ID){
      try{
        const r = await fetch(`https://api.github.com/gists/${GIST_ID}`, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'Accept':'application/vnd.github+json' } })
        if(!r.ok) throw new Error('gist_fetch_failed '+r.status)
        const j:any = await r.json()
        const content = j?.files?.['products.json']?.content || '[]'
        const updated = j?.updated_at || ''
        return new NextResponse(content, { status: 200, headers: { 'Content-Type': 'application/json', 'X-Source':'gist', 'X-Updated': updated } })
      }catch(err:any){
        return NextResponse.json({ error: 'cannot_read_products', message: String(err?.message||err), fallback:'gist_failed' }, { status: 500 })
      }
    }
    return NextResponse.json({ error: 'cannot_read_products', message: String(e?.message || e) }, { status: 500 })
  }
}

export async function POST(req: Request){
  try{
    if(ADMIN_TOKEN){
      const header = req.headers.get('x-admin-token') || ''
      if(header !== ADMIN_TOKEN){
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
      }
    }
    const body = await req.json()
    const dataStr = JSON.stringify(body, null, 2)
    // Try filesystem write first
    try {
      await fs.writeFile(DATA_PATH, dataStr, 'utf-8')
      return NextResponse.json({ ok: true, storage: 'file', ts: new Date().toISOString() })
    }catch(fileErr:any){
      if(!(GITHUB_TOKEN && GIST_ID)) throw fileErr
      // Fallback to gist update
      const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type':'application/json', Authorization: `Bearer ${GITHUB_TOKEN}`, 'Accept':'application/vnd.github+json' },
        body: JSON.stringify({ files: { 'products.json': { content: dataStr } } })
      })
      if(!res.ok){
        const txt = await res.text()
        throw new Error('gist_update_failed '+res.status+': '+txt)
      }
      return NextResponse.json({ ok: true, storage: 'gist', ts: new Date().toISOString() })
    }
  }catch(e:any){
    const msg = String(e?.message || e)
    if(msg.includes('EROFS')){
      return NextResponse.json({
        error: 'read_only_filesystem',
        message: msg,
        hint: 'Хостинг не даёт записывать файл. Настрой PRODUCTS_GIST_ID + GITHUB_TOKEN или используй другой storage.',
        expectedEnv: ['GITHUB_TOKEN','PRODUCTS_GIST_ID'],
        docs: 'Create a private gist with products.json then set env vars.'
      }, { status: 507 })
    }
    return NextResponse.json({ error: 'cannot_write_products', message: msg }, { status: 500 })
  }
}

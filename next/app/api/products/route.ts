import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json')

export async function GET(){
  try{
    const raw = await fs.readFile(DATA_PATH, 'utf-8')
    return new NextResponse(raw, { status: 200, headers: { 'Content-Type': 'application/json' } })
  }catch(e:any){
    return NextResponse.json({ error: 'cannot read products', message: String(e?.message || e) }, { status: 500 })
  }
}

export async function POST(req: Request){
  try{
    const body = await req.json()
    await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  }catch(e:any){
    return NextResponse.json({ error: 'cannot write products', message: String(e?.message || e) }, { status: 500 })
  }
}

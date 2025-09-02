import { NextRequest, NextResponse } from 'next/server'
import { runTelegramImport } from '../../../../scripts/telegramImportCore'

// Secure this endpoint with a token in header: X-ADMIN-TOKEN matching ADMIN_SYNC_TOKEN
export const runtime = 'nodejs'

export async function POST(req: NextRequest){
  const token = req.headers.get('x-admin-token')
  if(!process.env.ADMIN_SYNC_TOKEN || token !== process.env.ADMIN_SYNC_TOKEN){
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') || '150')
    const sinceParam = url.searchParams.get('since')
    const since = sinceParam ? new Date(sinceParam) : null
    const result = await runTelegramImport({ limit, since })
    return NextResponse.json({ ok: true, ...result })
  } catch(e:any){
    return NextResponse.json({ error: e.message || 'Import failed' }, { status: 500 })
  }
}

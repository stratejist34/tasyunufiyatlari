import { NextRequest, NextResponse } from 'next/server'

import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status')
  const supabase = createServerSupabaseClient()

  let query = supabase.from('quotes').select('*').order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Admin quotes fetch failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Teklif kayıtları alınamadı.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    quotes: data ?? [],
  })
}

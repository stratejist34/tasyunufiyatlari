import { NextResponse } from 'next/server'

import { createServerSupabaseClient } from '@/lib/supabase-server'

import type { CombinationMetrics } from './types'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.rpc('get_combination_metrics')

  if (error) {
    console.error('combination-metrics rpc failed:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, metrics: data as CombinationMetrics })
}

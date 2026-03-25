import { NextResponse } from 'next/server'

import { createServerSupabaseClient } from '@/lib/supabase-server'

import type { DashboardMetrics } from './types'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.rpc('get_dashboard_metrics')

  if (error) {
    console.error('dashboard-metrics rpc failed:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, metrics: data as DashboardMetrics })
}

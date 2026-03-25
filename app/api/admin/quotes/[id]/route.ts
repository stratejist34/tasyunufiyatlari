import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createServerSupabaseClient } from '@/lib/supabase-server'

const quoteUpdateSchema = z
  .object({
    status: z
      .enum(['pending', 'contacted', 'quoted', 'approved', 'rejected', 'completed'])
      .optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  })
  .refine((payload) => payload.status || payload.priority, {
    message: 'En az bir alan guncellenmeli.',
  })

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const quoteId = Number(id)

  if (!Number.isFinite(quoteId)) {
    return NextResponse.json(
      { ok: false, error: 'Gecersiz teklif kimligi.' },
      { status: 400 }
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = quoteUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Guncelleme verisi gecersiz.' },
      { status: 400 }
    )
  }

  const supabase = createServerSupabaseClient()
  const updatePayload = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('quotes')
    .update(updatePayload)
    .eq('id', quoteId)
    .select('*')
    .single()

  if (error) {
    console.error('Admin quote update failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Teklif guncellenemedi.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    quote: data,
  })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const quoteId = Number(id)

  if (!Number.isFinite(quoteId)) {
    return NextResponse.json({ ok: false, error: 'Geçersiz teklif kimliği.' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  // İlişkili funnel eventlerini önce sil
  await supabase.from('quote_funnel_events').delete().eq('quote_id', quoteId)

  const { error } = await supabase.from('quotes').delete().eq('id', quoteId)

  if (error) {
    console.error('Admin quote delete failed:', error)
    return NextResponse.json({ ok: false, error: 'Teklif silinemedi.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

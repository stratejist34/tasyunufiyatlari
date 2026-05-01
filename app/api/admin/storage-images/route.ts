import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const BUCKET = 'product-images';

export async function GET() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlMeta } = supabase.storage.from(BUCKET).getPublicUrl('');
  const baseUrl = urlMeta.publicUrl.replace(/\/$/, '');

  const files = (data ?? [])
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => ({
      name: f.name,
      url: `${baseUrl}/${f.name}`,
    }));

  return NextResponse.json({ files });
}

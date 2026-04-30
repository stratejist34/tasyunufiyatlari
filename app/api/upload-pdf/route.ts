import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';

const MAX_PDF_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILENAME = /^TY\d{4,12}\.pdf$/; // quote_code pattern: TY + 4-12 digit + .pdf

/**
 * PDF teklif yükleme — RLS bypass'lı server-side upload.
 * Client direkt anon-key ile storage'a yazmıyor; bu route service_role ile yapar.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const filename = formData.get('filename');

    if (!(file instanceof Blob)) {
      return NextResponse.json({ ok: false, error: 'Geçersiz dosya.' }, { status: 400 });
    }

    if (typeof filename !== 'string' || !ALLOWED_FILENAME.test(filename)) {
      return NextResponse.json(
        { ok: false, error: 'Geçersiz dosya adı.' },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { ok: false, error: 'Dosya boyutu 0–5MB aralığında olmalı.' },
        { status: 400 }
      );
    }

    if (file.type && file.type !== 'application/pdf') {
      return NextResponse.json(
        { ok: false, error: 'Sadece PDF kabul edilir.' },
        { status: 400 }
      );
    }

    // PDF magic byte kontrolü: "%PDF" (25 50 44 46)
    const head = await file.slice(0, 4).arrayBuffer();
    const headBytes = new Uint8Array(head);
    if (
      headBytes[0] !== 0x25 ||
      headBytes[1] !== 0x50 ||
      headBytes[2] !== 0x44 ||
      headBytes[3] !== 0x46
    ) {
      return NextResponse.json(
        { ok: false, error: 'Dosya PDF formatında değil.' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase.storage
      .from('quote-pdfs')
      .upload(filename, file, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      console.error('[upload-pdf] Storage upload failed:', error.message);
      return NextResponse.json(
        { ok: false, error: 'Dosya yüklenemedi.' },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from('quote-pdfs').getPublicUrl(filename);

    return NextResponse.json({
      ok: true,
      publicUrl: urlData.publicUrl,
      storagePath: filename,
    });
  } catch (err) {
    console.error('[upload-pdf] Unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: 'Beklenmeyen bir hata oluştu.' },
      { status: 500 }
    );
  }
}

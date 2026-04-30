// PDF upload — anon Supabase client direkt storage'a yazmıyor (RLS engelliyor).
// Bunun yerine server-side route /api/upload-pdf üzerinden service_role ile yüklenir.

export interface PdfUploadResult {
  publicUrl: string;
  storagePath: string;
}

export async function uploadPdfToStorage(
  pdfBlob: Blob,
  filename: string
): Promise<PdfUploadResult | null> {
  try {
    const formData = new FormData();
    formData.append('file', pdfBlob, filename);
    formData.append('filename', filename);

    const res = await fetch('/api/upload-pdf', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || !result.ok) {
      console.error('[uploadPdfToStorage] Upload failed:', result.error || res.statusText);
      return null;
    }

    return {
      publicUrl: result.publicUrl,
      storagePath: result.storagePath,
    };
  } catch (err) {
    console.error('[uploadPdfToStorage] Unexpected error:', err);
    return null;
  }
}

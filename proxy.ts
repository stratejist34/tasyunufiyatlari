import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /ofis sayfası ve /api/admin/* rotalarını koru
  const isProtected =
    pathname.startsWith('/ofis') ||
    pathname.startsWith('/api/admin');

  if (!isProtected) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization');

  if (authHeader) {
    const base64 = authHeader.replace('Basic ', '');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const decoded = new TextDecoder('utf-8').decode(bytes);
    const colonIdx = decoded.indexOf(':');
    const user = decoded.slice(0, colonIdx);
    const pass = decoded.slice(colonIdx + 1);

    const adminUser = process.env.ADMIN_USER ?? 'admin';
    const adminPass = process.env.ADMIN_PASSWORD;
    const patronPass = process.env.PATRON_PASSWORD;

    const isAdmin = !!adminPass && user === adminUser && pass === adminPass;
    const isPatron = !!patronPass && user === 'patron' && pass === patronPass;

    if (isAdmin || isPatron) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Yetkisiz erişim', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Yönetim Paneli"',
    },
  });
}

export const config = {
  matcher: ['/ofis/:path*', '/api/admin/:path*'],
};

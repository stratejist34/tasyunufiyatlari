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
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    const [user, pass] = decoded.split(':');

    const expectedUser = process.env.ADMIN_USER ?? 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD;

    if (expectedPass && user === expectedUser && pass === expectedPass) {
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

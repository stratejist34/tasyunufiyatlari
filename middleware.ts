import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected =
    pathname.startsWith('/ofis') || pathname.startsWith('/api/admin')

  if (!isProtected) return NextResponse.next()

  const authHeader = request.headers.get('authorization')

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ')
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded)
      const colonIdx = decoded.indexOf(':')
      const user = decoded.slice(0, colonIdx)
      const pass = decoded.slice(colonIdx + 1)

      const expectedUser = process.env.ADMIN_USER
      const expectedPass = process.env.ADMIN_PASSWORD

      if (user === expectedUser && pass === expectedPass) {
        return NextResponse.next()
      }
    }
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Ofis Paneli"',
    },
  })
}

export const config = {
  matcher: ['/ofis/:path*', '/api/admin/:path*'],
}

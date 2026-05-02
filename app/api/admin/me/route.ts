import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const h = await headers();
  const user = h.get('x-auth-user') ?? '';
  return NextResponse.json({ user });
}

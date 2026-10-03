import { NextResponse } from 'next/server';
import { DEMO_SESSION_VALUE, SESSION_COOKIE } from '@journeys/auth-server';

function safeReturnTo(value: FormDataEntryValue | null) {
  const path = typeof value === 'string' ? value : '/app2';
  return path.startsWith('/') && !path.startsWith('//') ? path : '/app2';
}

export async function POST(request: Request) {
  const form = await request.formData();
  const response = NextResponse.redirect(
    new URL(safeReturnTo(form.get('returnTo')), request.url),
    303,
  );

  response.cookies.set({
    name: SESSION_COOKIE,
    value: DEMO_SESSION_VALUE,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return response;
}

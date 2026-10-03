import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@journeys/auth-server';

export function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/', request.url), 303);
  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}

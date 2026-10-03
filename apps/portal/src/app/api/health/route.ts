import { NextResponse } from 'next/server';
import type { HealthResponse } from '@journeys/shared-api-client';

export const dynamic = 'force-dynamic';

export function GET() {
  const body: HealthResponse = {
    status: 'ok',
    service: 'journey-hub',
    version: process.env['APP_VERSION'] ?? 'development',
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body, { headers: { 'cache-control': 'no-store' } });
}

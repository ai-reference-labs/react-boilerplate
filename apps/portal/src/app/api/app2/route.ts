import { NextResponse } from 'next/server';
import { getSession } from '@journeys/auth-server';
import type { App2QueueResponse } from '@journeys/shared-api-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Sign in before using the App 2 API.' },
      { status: 401 },
    );
  }

  const response: App2QueueResponse = {
    generatedAt: new Date().toISOString(),
    items: [
      {
        id: 'REQ-1042',
        title: 'Renewal application refresh',
        owner: 'M. Chen',
        priority: 'high',
        target: 'Sprint 24',
        progress: 64,
        status: 'ready',
      },
      {
        id: 'REQ-1048',
        title: 'Broker document exchange',
        owner: 'R. Singh',
        priority: 'standard',
        target: 'Sprint 25',
        progress: 31,
        status: 'discovery',
      },
      {
        id: 'REQ-1051',
        title: 'Urgent review routing',
        owner: 'T. Brooks',
        priority: 'urgent',
        target: 'Sprint 24',
        progress: 82,
        status: 'scheduled',
      },
    ],
  };
  return NextResponse.json(response, {
    headers: { 'cache-control': 'no-store' },
  });
}

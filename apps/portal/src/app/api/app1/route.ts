import { NextResponse } from 'next/server';
import type {
  App1Receipt,
  App1Request,
  Priority,
} from '@journeys/shared-api-client';

const priorities = new Set<Priority>(['standard', 'high', 'urgent']);

function isApp1Request(value: unknown): value is App1Request {
  if (!value || typeof value !== 'object') return false;
  const input = value as Record<string, unknown>;
  return (
    typeof input['title'] === 'string' &&
    input['title'].trim().length >= 3 &&
    typeof input['requester'] === 'string' &&
    input['requester'].trim().length > 0 &&
    typeof input['description'] === 'string' &&
    input['description'].trim().length >= 10 &&
    typeof input['priority'] === 'string' &&
    priorities.has(input['priority'] as Priority)
  );
}

export async function POST(request: Request) {
  const input: unknown = await request.json().catch(() => null);
  if (!isApp1Request(input)) {
    return NextResponse.json(
      { error: 'Provide a title, requester, description, and valid priority.' },
      { status: 400 },
    );
  }

  const receipt: App1Receipt = {
    id: `REQ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    status: 'accepted',
    submittedAt: new Date().toISOString(),
    summary: `${input.title.trim()} was accepted for ${input.requester.trim()}.`,
  };
  return NextResponse.json(receipt, { status: 201 });
}

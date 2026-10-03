import type { App1Receipt, App1Request, App2QueueResponse } from './contracts';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new ApiError(
      body?.error ?? 'The API request failed.',
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export function submitApp1(input: App1Request) {
  return request<App1Receipt>('/api/app1', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getApp2Queue() {
  return request<App2QueueResponse>('/api/app2');
}

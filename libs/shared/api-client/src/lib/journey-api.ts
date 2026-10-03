import type {
  IntakeReceipt,
  IntakeRequest,
  PlanningQueueResponse,
} from './contracts';

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

export function submitIntake(input: IntakeRequest) {
  return request<IntakeReceipt>('/api/intake', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getPlanningQueue() {
  return request<PlanningQueueResponse>('/api/planning');
}

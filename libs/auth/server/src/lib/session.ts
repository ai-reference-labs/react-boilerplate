import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'journey-hub-session';
export const DEMO_SESSION_VALUE = 'local-demo-user';

export interface UserSession {
  name: string;
  role: string;
}

const demoSession: UserSession = {
  name: 'Alex Morgan',
  role: 'Application developer',
};

export async function getSession(): Promise<UserSession | null> {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return value === DEMO_SESSION_VALUE ? demoSession : null;
}

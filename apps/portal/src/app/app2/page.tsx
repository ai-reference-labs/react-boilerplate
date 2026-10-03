import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { App2Feature } from '@journeys/app2-feature';
import { getSession } from '@journeys/auth-server';
import { UserPill } from '@journeys/auth-client';
import { JourneyShell } from '@journeys/ui-components';

export const metadata: Metadata = { title: 'App 2 · Post-sign-on' };

export default async function App2Page() {
  const session = await getSession();
  if (!session) {
    redirect('/auth?returnTo=/app2');
  }

  return (
    <JourneyShell
      number="02"
      title="App 2 workbench"
      owner="App 2 team · Post-sign-on"
      description="A protected module that validates the session before rendering or serving API data."
      tone="blue"
    >
      <div style={{ marginBottom: '28px' }}>
        <UserPill name={session.name} role={session.role} />
      </div>
      <App2Feature />
    </JourneyShell>
  );
}

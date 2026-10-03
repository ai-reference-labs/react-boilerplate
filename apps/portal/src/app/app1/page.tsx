import type { Metadata } from 'next';
import { App1Feature } from '@journeys/app1-feature';
import { JourneyShell } from '@journeys/ui-components';

export const metadata: Metadata = { title: 'App 1 · Pre-sign-on' };

export default function App1Page() {
  return (
    <JourneyShell
      number="01"
      title="App 1 workbench"
      owner="App 1 team · Pre-sign-on"
      description="A public module that works before authentication and submits through a typed sample API."
      tone="citrus"
    >
      <App1Feature />
    </JourneyShell>
  );
}

import type { Metadata } from 'next';
import { IntakeFeature } from '@journeys/intake-feature';
import { JourneyShell } from '@journeys/ui-components';

export const metadata: Metadata = { title: 'Intake workbench' };

export default function IntakePage() {
  return (
    <JourneyShell
      number="01"
      title="Intake workbench"
      owner="Intake team"
      description="A focused development route for the intake module, backed by a typed sample API."
      tone="citrus"
    >
      <IntakeFeature />
    </JourneyShell>
  );
}

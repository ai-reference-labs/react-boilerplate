import type { Metadata } from 'next';
import { PlanningFeature } from '@journeys/planning-feature';
import { JourneyShell } from '@journeys/ui-components';

export const metadata: Metadata = { title: 'Planning workbench' };

export default function PlanningPage() {
  return (
    <JourneyShell
      number="02"
      title="Planning workbench"
      owner="Planning team"
      description="A focused module route that loads its queue from the shared typed API client."
      tone="blue"
    >
      <PlanningFeature />
    </JourneyShell>
  );
}

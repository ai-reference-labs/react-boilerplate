import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { getPlanningQueue } from '@journeys/shared-api-client';
import { PlanningFeature } from './planning-feature';

vi.mock('@journeys/shared-api-client', () => ({ getPlanningQueue: vi.fn() }));

describe('PlanningFeature', () => {
  it('loads and renders planning items', async () => {
    vi.mocked(getPlanningQueue).mockResolvedValue({
      generatedAt: 'now',
      items: [
        {
          id: 'REQ-1',
          title: 'Renewal flow',
          owner: 'Jordan',
          priority: 'high',
          target: 'Q4',
          progress: 64,
          status: 'ready',
        },
      ],
    });
    render(<PlanningFeature />);
    expect(await screen.findByText('Renewal flow')).toBeTruthy();
    expect(screen.getByText('REQ-1')).toBeTruthy();
  });
});

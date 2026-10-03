import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { getApp2Queue } from '@journeys/shared-api-client';
import { App2Feature } from './app2-feature';

vi.mock('@journeys/shared-api-client', () => ({ getApp2Queue: vi.fn() }));

describe('App2Feature', () => {
  it('loads and renders protected items', async () => {
    vi.mocked(getApp2Queue).mockResolvedValue({
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
    render(<App2Feature />);
    expect(await screen.findByText('Renewal flow')).toBeTruthy();
    expect(screen.getByText('REQ-1')).toBeTruthy();
  });
});

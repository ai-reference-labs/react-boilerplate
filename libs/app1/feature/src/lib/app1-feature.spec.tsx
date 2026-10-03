import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { App1Feature } from './app1-feature';

vi.mock('@journeys/shared-api-client', () => ({ submitApp1: vi.fn() }));

describe('App1Feature', () => {
  it('renders the public sample fields', () => {
    render(<App1Feature />);
    expect(
      screen.getByRole('heading', { name: 'Describe the need' }),
    ).toBeTruthy();
    expect(screen.getByLabelText('Request title')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /submit to sample api/i }),
    ).toBeTruthy();
  });

  it('keeps native validation on required fields', () => {
    render(<App1Feature />);
    expect(screen.getByLabelText('Request title')).toHaveProperty(
      'required',
      true,
    );
    fireEvent.click(
      screen.getByRole('button', { name: /submit to sample api/i }),
    );
  });
});

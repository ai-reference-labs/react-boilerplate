import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { IntakeFeature } from './intake-feature';

vi.mock('@journeys/shared-api-client', () => ({ submitIntake: vi.fn() }));

describe('IntakeFeature', () => {
  it('renders the sample intake fields', () => {
    render(<IntakeFeature />);
    expect(
      screen.getByRole('heading', { name: 'Describe the need' }),
    ).toBeTruthy();
    expect(screen.getByLabelText('Request title')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /submit to sample api/i }),
    ).toBeTruthy();
  });

  it('keeps native validation on required fields', () => {
    render(<IntakeFeature />);
    expect(screen.getByLabelText('Request title')).toHaveProperty(
      'required',
      true,
    );
    fireEvent.click(
      screen.getByRole('button', { name: /submit to sample api/i }),
    );
  });
});

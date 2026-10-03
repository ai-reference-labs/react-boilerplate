import { render, screen } from '@testing-library/react';
import { JourneyShell, ModuleMark } from './ui-components';

describe('shared UI', () => {
  it('renders a module mark', () => {
    render(<ModuleMark label="01" tone="citrus" />);
    expect(screen.getByText('01')).toBeTruthy();
  });

  it('renders the journey shell content', () => {
    render(
      <JourneyShell
        number="01"
        title="Intake"
        owner="Intake team"
        description="Description"
        tone="citrus"
      >
        <p>Module</p>
      </JourneyShell>,
    );
    expect(screen.getByRole('heading', { name: 'Intake' })).toBeTruthy();
    expect(screen.getByText('Module')).toBeTruthy();
  });
});

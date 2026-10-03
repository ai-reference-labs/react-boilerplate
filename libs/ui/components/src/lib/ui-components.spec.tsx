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
        title="App 1"
        owner="App 1 team"
        description="Description"
        tone="citrus"
      >
        <p>Module</p>
      </JourneyShell>,
    );
    expect(screen.getByRole('heading', { name: 'App 1' })).toBeTruthy();
    expect(screen.getByText('Module')).toBeTruthy();
  });
});

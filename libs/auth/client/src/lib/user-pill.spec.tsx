import { render, screen } from '@testing-library/react';
import { UserPill } from './user-pill';

describe('UserPill', () => {
  it('shows the current user and role', () => {
    render(<UserPill name="Alex Morgan" role="Application developer" />);
    expect(screen.getByText('Alex Morgan')).toBeTruthy();
    expect(screen.getByText('Application developer')).toBeTruthy();
  });
});

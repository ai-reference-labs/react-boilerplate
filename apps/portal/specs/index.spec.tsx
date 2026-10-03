import React from 'react';
import { render } from '@testing-library/react';
import Page from '../src/app/page';

describe('Page', () => {
  it('renders the getting-started page', () => {
    render(<Page />);
    expect(document.querySelector('h1')?.textContent).toContain(
      'One application',
    );
  });
});

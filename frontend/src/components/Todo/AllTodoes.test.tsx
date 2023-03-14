import React from 'react';
import { render, screen } from '@testing-library/react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import AllTodoes from './AllTodoes';

let container: HTMLDivElement;
let root: any;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  root = createRoot(container);
});

afterEach(() => {
  // cleanup on exiting
  if (container) {
    act(() => {
      root.unmount();
    });
    container.remove();
  }
});

it('renders without crashing', () => {
  act(() => {
    root.render(<AllTodoes />)
  });
});

it.skip('renders table with no items message', () => {
  act(() => {
    root.render(<AllTodoes />)
  });
  
  expect(screen.getByText('No items to display')).toBeInTheDocument();
  //expect(container?.textContent).toContain('No items to display');
});

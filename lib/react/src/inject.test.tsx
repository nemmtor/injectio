import { act, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';

import { Injectio } from './injectio';
import { inject } from './inject';

describe('inject', () => {
  it('should summon a component', async () => {
    render(<></>, { wrapper });

    act(() => {
      inject(() => <div>hello world</div>);
    });
    const helloWorld = screen.getByText('hello world');

    expect(helloWorld).toBeVisible();
  });
});

const wrapper = (props: { children: ReactNode }) => {
  return (
    <>
      {props.children}
      <Injectio />
    </>
  );
};

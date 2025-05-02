import userEvent from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';

import { Injectio } from './injectio';
import { inject } from './inject';

describe('injectio', () => {
  it('should allow to summon a component', async () => {
    render(<></>, { wrapper });

    act(() => {
      inject(() => <div>hello world</div>);
    });
    const helloWorld = screen.getByText('hello world');

    expect(helloWorld).toBeVisible();
  });

  it('should allow to dismiss injected component', async () => {
    const user = userEvent.setup();
    render(<></>, { wrapper });

    act(() => {
      inject(({ dismissed, dismiss }) =>
        dismissed ? null : <button onClick={dismiss}>dismiss</button>
      );
    });
    const dismissButtonBefore = screen.getByText('dismiss');
    await user.click(dismissButtonBefore);
    const dismissButtonAfter = screen.queryByText('dismiss');

    expect(dismissButtonAfter).not.toBeInTheDocument();
  });

  it('should allow to remove injected component', async () => {
    const user = userEvent.setup();
    render(<></>, { wrapper });

    act(() => {
      inject(({ remove }) => <button onClick={remove}>remove</button>);
    });
    const removeButtonBefore = screen.getByText('remove');
    await user.click(removeButtonBefore);
    const removeButtonAfter = screen.queryByText('remove');

    expect(removeButtonAfter).not.toBeInTheDocument();
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

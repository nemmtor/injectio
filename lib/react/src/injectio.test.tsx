import userEvent from '@testing-library/user-event';
import { act, render, screen, waitFor } from '@testing-library/react';
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

  it('should allow to resolve with a value', async () => {
    const user = userEvent.setup();
    render(<></>, { wrapper });

    let value = '';
    act(() => {
      const result = inject(({ resolve }) => (
        <button onClick={() => resolve('value')}>dismiss</button>
      ));
      result.value.then((resultValue) => {
        value = resultValue as string;
      });
    });
    const dismissButton = screen.getByText('dismiss');
    await user.click(dismissButton);

    expect(value).toBe('value');
  });

  it('should allow to resolve from caller code', async () => {
    render(<></>, { wrapper });

    let value = '';
    act(() => {
      const result = inject(() => <div>Hello World</div>);
      result.value.then((resultValue) => {
        value = resultValue as string;
      });
      result.resolve('value');
    });

    await waitFor(() => {
      expect(value).toBe('value');
    });
  });

  it('should allow to dismiss from caller code', async () => {
    render(<></>, { wrapper });

    act(() => {
      const result = inject(({ dismissed }) =>
        dismissed ? null : <div>Hello World</div>
      );
      result.dismiss();
    });
    const injectedComponent = screen.queryByText('Hello World');

    await waitFor(() => {
      expect(injectedComponent).not.toBeInTheDocument();
    });
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

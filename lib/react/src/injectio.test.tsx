import userEvent from '@testing-library/user-event';
import { act, render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import { Injectio } from './injectio';
import { inject } from './inject';

type ModalProps = { visible: boolean };

describe('injectio', () => {
  it('should allow to summon a component', async () => {
    render(<></>, { wrapper });

    act(() => {
      inject(() => <div>hello world</div>, { visible: true });
    });
    const helloWorld = screen.getByText('hello world');

    expect(helloWorld).toBeVisible();
  });

  it('should allow to update props to hide component', async () => {
    const user = userEvent.setup();
    render(<></>, { wrapper });

    let updateProps: ((updater: (props: ModalProps) => ModalProps) => void) | undefined;
    act(() => {
      const result = inject(
        ({ props }) =>
          props.visible ? <button onClick={() => updateProps?.((p) => ({ ...p, visible: false }))}>dismiss</button> : null,
        { visible: true }
      );
      updateProps = result.updateProps;
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
      inject(({ remove }) => <button onClick={remove}>remove</button>, { visible: true });
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
      const result = inject<ModalProps, string>(
        ({ resolve }) => (
          <button onClick={() => resolve('value')}>dismiss</button>
        ),
        { visible: true }
      );
      result.value.then((resultValue) => {
        value = resultValue;
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
      const result = inject<ModalProps, string>(() => <div>Hello World</div>, { visible: true });
      result.value.then((resultValue) => {
        value = resultValue;
      });
      result.resolve('value');
    });

    await waitFor(() => {
      expect(value).toBe('value');
    });
  });

  it('should allow to update props from caller code', async () => {
    render(<></>, { wrapper });

    act(() => {
      const result = inject(
        ({ props }) => (props.visible ? <div>Hello World</div> : null),
        { visible: true }
      );
      result.updateProps((props) => ({ ...props, visible: false }));
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

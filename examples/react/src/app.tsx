import { inject } from '@injectio/react';

export const App = () => {
  return (
    <button
      onClick={() => {
        inject(({ onDismiss, dismissed }) => dismissed ? null : (
          <>
            <div>Hello world</div>
            <button onClick={onDismiss}>Dismiss</button>
          </>
        ));
      }}>
      Add hello world
    </button>
  );
};

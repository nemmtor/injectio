import { describe, expect, it } from '@effect/vitest';
import { Injectio, inject } from '@injectio/react';
import { render, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as Deferred from 'effect/Deferred';
import * as Effect from 'effect/Effect';
import * as Exit from 'effect/Exit';
import * as Scope from 'effect/Scope';

describe('Injectio', () => {
  it.scoped('should display injected component', () =>
    Effect.gen(function* () {
      const { getByText } = render(<Injectio />);

      yield* inject({
        renderFn: () => <p>Hello world</p>,
        initialProps: {},
      });

      yield* Effect.promise(() =>
        waitFor(() => expect(getByText('Hello world')).toBeInTheDocument()),
      );
    }),
  );

  it.effect('should unmount component when scope gets closed', () =>
    Effect.gen(function* () {
      const { getByText, queryByText } = render(<Injectio />);
      const scope = yield* Scope.make();
      yield* inject({
        renderFn: () => <p>Hello world</p>,
        initialProps: {},
      }).pipe(Scope.extend(scope));
      yield* Effect.promise(() => waitFor(() => getByText('Hello world')));

      yield* Scope.close(scope, Exit.void);

      yield* Effect.promise(() =>
        waitFor(() =>
          expect(queryByText('Hello world')).not.toBeInTheDocument(),
        ),
      );
    }),
  );

  it.scoped('should apply initial props to the injected component', () =>
    Effect.gen(function* () {
      const { getByText } = render(<Injectio />);

      yield* inject({
        renderFn: ({ props }) => <p>{props.text}</p>,
        initialProps: {
          text: 'Hello world',
        },
      });

      yield* Effect.promise(() =>
        waitFor(() => expect(getByText('Hello world')).toBeInTheDocument()),
      );
    }),
  );

  it.scoped(
    'should allow updating props of injected component from the calling code',
    () =>
      Effect.gen(function* () {
        const { getByText } = render(<Injectio />);
        const { updateProps } = yield* inject({
          renderFn: ({ props }) => <p>{props.text}</p>,
          initialProps: {
            text: 'Hello world',
          },
        });

        updateProps({ text: 'Changed text' });

        yield* Effect.promise(() =>
          waitFor(() => expect(getByText('Changed text')).toBeInTheDocument()),
        );
      }),
  );

  it.scoped(
    'should allow updating props of injected component from itself',
    () =>
      Effect.gen(function* () {
        const user = userEvent.setup();
        const { getByText } = render(<Injectio />);
        yield* inject({
          renderFn: ({ props, updateProps }) => (
            <button
              type="button"
              onClick={() => updateProps({ text: 'Changed text' })}
            >
              {props.text}
            </button>
          ),
          initialProps: {
            text: 'Hello world',
          },
        });
        const button = yield* Effect.promise(() =>
          waitFor(() => getByText('Hello world')),
        );

        yield* Effect.promise(() => user.click(button));

        yield* Effect.promise(() =>
          waitFor(() => expect(getByText('Changed text')).toBeInTheDocument()),
        );
      }),
  );

  it.scoped('should communicate returned value via deferred', () =>
    Effect.gen(function* () {
      const user = userEvent.setup();
      const { getByText } = render(<Injectio />);
      const { deferred } = yield* inject<string>({
        renderFn: ({ deferred }) => (
          <button
            type="button"
            onClick={() =>
              deferred.pipe(Deferred.succeed('ok'), Effect.runPromise)
            }
          >
            Hello world
          </button>
        ),
        initialProps: {},
      });
      const button = yield* Effect.promise(() =>
        waitFor(() => getByText('Hello world')),
      );

      yield* Effect.promise(() => user.click(button));
      const returnedValue = yield* Deferred.await(deferred);

      expect(returnedValue).toBe('ok');
    }),
  );

  it.scoped('should have isolated rerenders of injected components', () =>
    Effect.gen(function* () {
      let firstComponentRenderCount = 0;
      let secondComponentRenderCount = 0;
      const Component = (props: { onRender: VoidFunction; text: string }) => {
        props.onRender();

        return <div>{props.text}</div>;
      };
      const { getByText } = render(<Injectio />);
      const firstComponent = yield* inject({
        renderFn: ({ props }) => (
          <Component
            {...props}
            onRender={() => {
              firstComponentRenderCount += 1;
            }}
          />
        ),
        initialProps: {
          text: 'First component',
        },
      });
      yield* inject({
        renderFn: ({ props }) => (
          <Component
            {...props}
            onRender={() => {
              secondComponentRenderCount += 1;
            }}
          />
        ),
        initialProps: {
          text: 'Second component',
        },
      });
      yield* Effect.promise(() => waitFor(() => getByText('First component')));
      yield* Effect.promise(() => waitFor(() => getByText('Second component')));

      firstComponent.updateProps({ text: 'Changed text' });
      yield* Effect.promise(() => waitFor(() => getByText('Changed text')));
      firstComponent.updateProps({ text: 'Another text' });
      yield* Effect.promise(() => waitFor(() => getByText('Another text')));

      expect(firstComponentRenderCount).toBe(3);
      expect(secondComponentRenderCount).toBe(1);
    }),
  );
});

![Injectio header](https://github.com/nemmtor/injectio/raw/main/media/header.png)
# Summon React components on demand.
Injectio lets you render React components from anywhere in your JavaScript code – not just from within other React components. Perfect for showing modals, forms, and dialogs programmatically.

Built with [Effect](https://effect.website/).

## Setup
Install Injectio using your preferred package manager:
```bash
npm install @injectio/react
yarn add @injectio/react
pnpm add @injectio/react
```

Add the `<Injectio />` component to your app root, typically as one of the last elements:
```tsx
import { Injectio } from '@injectio/react';

createRoot(root).render(
  <StrictMode>
    <App />
    <Injectio />
  </StrictMode>,
);
```

Think of `<Injectio />` as a React Portal that renders your injected components.

## Basic usage
Let's say you have a dialog component:
```tsx
export const SomeDialog = () => {
  return <Dialog open>...</Dialog>;
};
```

You can make it injectable by wrapping it with the `inject` function:
```tsx
import { inject } from '@injectio/react';

const injectSomeDialog = () => inject<...>({
  renderFn: () => <SomeDialog />,
  // ...
});
```

Now you can call `injectSomeDialog()` from anywhere in your app – event handlers, store, or any JavaScript code.

> [!TIP]
> For better developer experience, consider attaching the inject function as a static method to your component:
> SomeDialog.inject = () => inject<...>(...)

### Understanding Component Lifecycle
The `inject` function returns an Effect that manages the component's lifecycle. The component stays rendered as long as the [Effect's scope](https://effect.website/docs/resource-management/scope/) remains active. When the scope ends, the component is automatically removed.

> [!NOTE]
> Components cannot be manually removed because this could leave the deferred in an incomplete state. If a component were removed without completing its deferred, the component would disappear but you could still interact with it (awaiting deferred, calling updateProps, etc.).


Here are some examples:

✅ **Correct usage** - Wait for the component to complete before closing the scope:
```tsx
import { Deferred, Effect } from 'effect';

injectSomeDialog().pipe(
  Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
  Effect.scoped,
  Effect.runPromise,
);
```

✅ **Correct usage** - Show the component for 5 seconds, then remove it:
```tsx
import { Duration, Effect } from 'effect';

injectSomeDialog().pipe(
  Effect.tap(Effect.sleep(Duration.seconds(5))),
  Effect.scoped,
  Effect.runPromise,
);
```

❌ **Wrong usage** - The scope closes immediately, so the component disappears right away:
```tsx
import { Effect } from 'effect';

injectSomeDialog().pipe(Effect.scoped, Effect.runPromise);
```

### Simplified API

If you want a simpler API that handles scope management automatically:

```tsx
import { Effect, Deferred } from 'effect';

const injectSomeDialog = () =>
  inject({
    renderFn: () => <SomeDialog />,
    // ...
  }).pipe(
    Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
    Effect.scoped,
    Effect.runPromise,
  );
```

However, this approach reduces flexibility. The more composable you keep your injection functions, the more use cases you can handle.

## Working with Deferred Values

The `inject` function returns an object that includes a [deferred](https://effect.website/docs/concurrency/deferred/) property. This deferred value allows your injected components to return data back to the calling code.

The `inject` function accepts generic types `<A, E, P>` where:

- `A` is the success value type
- `E` is the error value type
- `P` is for props (covered later)

### Completing the Deferred from Outside

You can complete the deferred from anywhere in your app:

```tsx
export const Example = () => {
  const [deferred, setDeferred] = useState<Deferred.Deferred<undefined>>();

  const injectThing = () =>
    inject<undefined>({
      renderFn: () => <div>Injected thing</div>,
      // ...
    }).pipe(
      Effect.tap(({ deferred }) => Effect.sync(() => setDeferred(deferred))),
      Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
      Effect.tap(() => Effect.sync(() => setDeferred(undefined))),
      Effect.scoped,
      Effect.runPromise,
    );

  return (
    <>
      {!deferred && <Button onClick={injectThing}>Inject thing</Button>}
      {deferred && (
        <Button
          onClick={() =>
            deferred.pipe(Deferred.succeed(undefined), Effect.runPromise)
          }
        >
          Remove thing
        </Button>
      )}
    </>
  );
};
```

### Completing the Deferred from Inside the Component

Most of the time, you'll want to complete the deferred from within the injected component itself. Access the deferred through the `renderFn` props:

```tsx
const injectSomething = () =>
  inject<undefined>({
    renderFn: ({ deferred }) => (
      <Something
        onConfirm={() =>
          deferred.pipe(Deferred.succeed(undefined), Effect.runPromise)
        }
      />
    ),
    // ...
  });
```

### Returning Data

In most cases, you'll want to return specific data from your injected component:

```tsx
const injectProfileForm = () =>
  inject<ProfileFormOutput>({
    renderFn: ({ deferred }) => (
      <ProfileFormDialog
        onConfirm={(formData) =>
          deferred.pipe(Deferred.succeed(formData), Effect.runPromise)
        }
      />
    ),
    // ...
  });
```

### Error Handling

You can also fail the deferred, which gets transformed into Effect's error channel. This works great with Effect's [tagged error](taggedError).

```tsx
class ProfileFormCancelledError extends Data.TaggedError(
  'ProfileFormCancelledError',
) {}

const injectProfileFormDialog = () =>
  inject<ProfileFormOutput, ProfileFormCancelledError>({
    renderFn: ({ deferred }) => (
      <ProfileFormDialog
        onCancel={() =>
          deferred.pipe(
            Deferred.fail(new ProfileFormCancelledError()),
            Effect.runPromise,
          )()
        }
        onConfirm={(formData) =>
          deferred.pipe(Deferred.succeed(formData), Effect.runPromise)
        }
      />
    ),
    // ...
  });

injectProfileFormDialog().pipe(
  Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
  Effect.catchTags({
    ProfileFormCancelledError: () => injectConfirmationDialog(),
  }),
  Effect.scoped,
  Effect.runPromise,
);
```

## Controlling Props
Injectio provides a way to control props of your injected components. The `P` generic type defines the type of props you want to control programmatically. Pass these props as `initialProps` and access them from the `renderFn`:

```tsx
type InjectedProps = {
  opened: boolean;
};
const injectSomeDialog = () =>
  inject<undefined, never, InjectedProps>({
    renderFn: ({ props }) => <SomeDialog {...props} />,
    initialProps: {
      opened: true,
    },
  });
```

> [!NOTE]
> Currently, the default type of `P` is `Record<string, never>` which means you need to pass an empty object even if you don't want to inject any props. This might change in future versions to make `initialProps` optional.

You can update these props by calling the `updateProps` function that comes from the inject function:
```tsx
injectSomeDialog().pipe(
  Effect.tap(Effect.sleep(Duration.seconds(2))),
  Effect.tap(({ updateProps }) => {
    updateProps({ opened: false });
  }),
  Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
  Effect.scoped,
  Effect.runPromise,
);
```

You can access the same `updateProps` function directly from `renderFn`:
```tsx
type InjectedProps = {
  opened: boolean;
};
const injectSomeDialog = () =>
  inject<undefined, never, InjectedProps>({
    renderFn: ({ props, updateProps }) => (
      <SomeDialog {...props} onClick={() => updateProps({ opened: false })} />
    ),
    initialProps: {
      opened: true,
    },
  });
```

## Recipes
Here are some useful examples you can use with Injectio.

### Unmount animation

Add a finalizer that updates the prop controlling the `open` state and waits for the animation to complete:
```tsx
const SomeDialog = () => {...};

const injectSomeDialog = () =>
  Effect.gen(function* () {
    const result = yield* inject<undefined, never, InjectedProps>({
      renderFn: ({ props }) => {
        return <SomeDialog {...props} />;
      },
      initialProps: {
        open: true,
      },
    });

    yield* Effect.addFinalizer(() => {
      result.updateProps({ open: false });
      return Effect.sleep(Duration.millis(150));
    });

    return result;
  });
```

### Show component while some other effect is executing
You can inject components, change their props and execute different effects concurrently
by using [Effect's concurrency](https://effect.website/docs/concurrency/basic-concurrency/).

```tsx
Effect.gen(function* () {
  const injectedComponent = yield* inject();
  const apiCallFiber = yield* Effect.fork(someApiCall);
  const apiResult = Fiber.join(apiCallFiber); // not yielded yet to not block code execution

  const slowPath = Effect.void.pipe(
    Effect.tap(() =>
      Effect.sync(() =>
        injectedComponent.updateProps({
          title: "Hold on, usually it doesn't take that long.",
        }),
      ).pipe(Effect.delay(Duration.seconds(5000))),
    ),
    Effect.flatMap(() => apiResult),
  );

  return yield* Effect.raceFirst(apiResult, slowPath);
});
```

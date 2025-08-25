<p align="center">
  <img src="media/header.png" />
</p>

Empower React rendering system with [Effect](https://effect.website/) superpowers.

Injectio allows you to move React component into the portal by yielding it's render function and allows you to await deferred component value/error from the calling code.

Perfect for anything that is rendered on top of screen:
- dialogs (confirmation, with forms etc.)
- notifications
- drawers
- and more...

## Example
Here's a quick example showing the power of injectio.
Injecting a modal which might succeed with `Profile` or error with `SelectProfileCancelledError | TimeoutException`.

```tsx
class SelectProfileCancelledError extends Data.TaggedError(
  'SelectProfileCancelledError',
) {}

// select profile returns an Effect of type:
// Effect.Effect<Profile, SelectProfileCancelledError | TimeoutException, never>
const selectProfile = () =>
  inject<Profile, SelectProfileCancelledError>({
    initialProps: {},
    renderFn: ({ deferred }) => (
      <SelectProfileModal
        onCancel={() =>
          deferred.pipe(
            Deferred.fail(new SelectProfileCancelledError()),
            Effect.runPromise,
          )
        }
        onSelect={(profile) =>
          deferred.pipe(Deferred.succeed(profile), Effect.runPromise)
        }
      />
    ),
  }).pipe(
    Effect.timeout(Duration.seconds(30)),
    Effect.flatMap(({ deferred }) => Deferred.await(deferred)),
    Effect.scoped,
  );

export const Example = () => {
  const startOnboarding = useCallback(async () => {
    const profile = await selectProfile().pipe(Effect.runPromise);
    // proceed with collected profile
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button onClick={startOnboarding} variant="outline">
        Start onboarding
      </Button>
    </div>
  );
};
```
What makes this powerful:
- **Flexible error handling**: Handle errors locally or propagate them with full type safety.
- **Seamless composition**: Use as Promise (`Effect.runPromise`) or within Effect pipelines (`Effect.gen`, `.pipe`) to compose complex flows with full type safety, DI and reliable error handling.
- **Effect ecosystem integration**: Utilise Effect power - DI, error handling, retries, repetition, scheduling, concurrency and more - anything that Effect brings can now be mixed with rendering components.
- **UI that yields values**: Retrieving data from UI interaction becomes easy without unnecessary callbacks or state management.

## Inspiration

Inspired by [Nice Modal](https://www.npmjs.com/package/@ebay/nice-modal-react).


# Testing

Use this when writing Effect tests, tests involving time, retry, schedules, concurrency, workers, services, fakes, or config.

## Defaults

- Use `it.effect` by default.
- Use `it.live` only when real time or live runtime services are the behavior under test.
- Use test layers and `ConfigProvider` rather than global mutation.
- Use `TestClock.setTime` / `TestClock.adjust` for sleeps, schedules, retries, leases, and timeouts.
- Fork sleeping effects before advancing `TestClock`.
- Avoid arbitrary `Effect.sleep(...)` in tests; it usually makes tests slow and flaky.
- Assert typed failures, rollback, interruption, finalization, retry bounds, idempotency, concurrency laws, and malformed persistence where relevant.
- Put shared layer graphs and stable doubles at module or suite scope. Reset mock
  state before each test and configure only behavior needed by that test.
- Provide shared graphs with `it.layer` or `layer`; use direct outermost
  `Effect.provide` for one-test suites.
- Keep mock setup in the test's main `Effect.gen` when it is part of Arrange.

```ts
it.effect("finds a user", () =>
  Effect.gen(function* () {
    const users = yield* UserRepo.Service
    const result = yield* users.find(UserId.make("u1"))
    expect(Option.isSome(result)).toBe(true)
  }).pipe(Effect.provide(UserRepo.testLayer)),
)
```

## Synchronization Instead Of Sleeps

- Use `Deferred` for one-shot readiness/completion signals.
- Use `Queue` for handing test-controlled work or observed events across fibers.
- Use `Latch` for reusable open/close coordination gates.
- Use `Ref` for shared test observation state.
- Use explicit test hooks when the production boundary can expose a deterministic synchronization point.

```ts
it.effect("publishes exactly once", () =>
  Effect.gen(function* () {
    const published = yield* Queue.unbounded<Message>()
    const ready = yield* Deferred.make<void>()

    const runWorker = makeWorker({
      onReady: () => Deferred.succeed(ready, undefined),
      onPublish: (message) => Queue.offer(published, message),
    })

    yield* runWorker.pipe(
      Effect.forkScoped,
    )

    yield* Deferred.await(ready)
    const message = yield* Queue.take(published)

    expect(message).toEqual(expectedMessage)
  }),
)
```

## Test Doubles

Use `Layer.mock` for small partial port doubles. Omitted methods then fail loudly:

```ts
const addUser = vi.fn<(user: User) => Effect.Effect<void>>()
const repository = Layer.mock(UserRepository, { add: addUser })
```

Use `Layer.succeed` for complete static implementations. Introduce first-class
stateful test services only when several suites need control and inspection that a
small mock cannot provide.

### Reusable Stateful Stubs

Use `TestInterface extends Interface`, `TestService`, and `testLayer` for reusable/stateful fakes.

```ts
export interface Interface {
  readonly send: (message: Message) => Effect.Effect<void, SendError>
}

export class Service extends Context.Service<Service, Interface>()(
  "@app/Notifier",
) {}

export interface TestInterface extends Interface {
  readonly sentMessages: () => Effect.Effect<ReadonlyArray<Message>>
  readonly failNextSend: (error: SendError) => Effect.Effect<void>
}

export class TestService extends Context.Service<TestService, TestInterface>()(
  "@app/Notifier/Test",
) {}

export const testLayer = Layer.effectContext(
  Effect.gen(function* () {
    const sent = yield* Ref.make<ReadonlyArray<Message>>([])
    const nextFailure = yield* Ref.make<Option.Option<SendError>>(Option.none())

    const service = TestService.of({
      send: Effect.fn("Notifier.Test.send")(function* (message) {
        const failure = yield* Ref.getAndSet(nextFailure, Option.none())
        if (Option.isSome(failure)) return yield* Effect.fail(failure.value)
        yield* Ref.update(sent, (messages) => [...messages, message])
      }),
      sentMessages: Effect.fn("Notifier.Test.sentMessages")(function* () {
        return yield* Ref.get(sent)
      }),
      failNextSend: Effect.fn("Notifier.Test.failNextSend")(function* (error) {
        yield* Ref.set(nextFailure, Option.some(error))
      }),
    })

    return Context.empty().pipe(
      Context.add(Service, service),
      Context.add(TestService, service),
    )
  }),
)
```

Guidance:

- The same object should back both the real `Service` tag and `TestService` tag.
- Production code depends only on the real service tag.
- Tests use `TestService` for control and inspection.
- Use function-valued service members, including zero-argument operations, so `Effect.fn` fits naturally.

## Config In Tests

Use `ConfigProvider.layer(ConfigProvider.fromUnknown(...))` when the test should exercise Config decoding.

Use `Layer.succeed(AppConfiguration.Service, config)` when the app wraps decoded config in its own service and the test does not need to exercise env decoding.

# Services, Layers, And Modules

Use this when defining service tags, module surfaces, layer implementations, runtime wiring, typed errors, or `Effect.fn` operation boundaries.

## Service Roles

Concrete application use cases infer their service shape from `make`:

```ts
export class DefineUser extends Context.Service<DefineUser>()(
  "Injectio/Users/DefineUser",
  {
    make: Effect.gen(function* () {
      const users = yield* UserRepository

      const execute = Effect.fn("DefineUser.execute")(function* (input: Input) {
        yield* users.add(input)
      })

      return { execute } as const
    }),
  },
) {
  static readonly layer = Layer.effect(this, this.make)
}
```

Use an explicit service interface for stable dependency-inversion boundaries,
such as ports:

```ts
interface UserRepositoryService {
  readonly add: (input: Input) => Effect.Effect<void, PersistenceError>
}

export class UserRepository extends Context.Service<
  UserRepository,
  UserRepositoryService
>()("Injectio/Users/UserRepository") {}
```

Guidance:

- Capture dependencies in use-case `make`; do not provide the same services per
  invocation.
- Return the smallest caller-required outcome.
- Keep dependency-free domain behavior as plain Effect functions.
- Use stable business service identifiers, not package or filesystem paths.
- Export only intentional surfaces; keep helpers and implementation details local.

## Layer Constructors

Choose the layer constructor that matches the thing produced.

```ts
Layer.succeed(Service, impl)       // already-built service
Layer.sync(Service, () => impl)    // lazy synchronous service
Layer.effect(Service, makeEffect)  // effectful service acquisition
```

Guidance:

- Use `Layer.effect(this, this.make)` for concrete use-case services.
- Use `Layer.effect(Service, Effect.gen(...))` for effectful port implementations.
- Use `Layer.effectContext(...)` when one acquisition intentionally supplies multiple services, especially first-class test stubs or one client backing several service tags.
- Use `Layer.unwrap(...)` when config or runtime discovery chooses/builds the layer.
- Use `Layer.fresh(...)` or `Effect.provide(layer, { local: true })` only when a test or operation needs isolated acquisition.
- Use `Context.Reference` rarely, only for ambient/defaultable runtime references where a safe default is real.

## Long-Lived Work

A layer that starts a stream, listener, worker, subscription, or forever loop must fork that work into the layer scope. Layer acquisition must complete.

```ts
export const layer = Layer.effectDiscard(
  Effect.gen(function* () {
    const events = yield* Events.Service

    yield* events.stream.pipe(
      Stream.runForEach(handleEvent),
      Effect.forkScoped,
    )
  }),
)
```

Guidance:

- Use `Effect.forkScoped`, `FiberSet`, or `FiberMap` for scoped background work.
- Do not run forever work inline during layer acquisition.
- Do not expose public `start` methods unless the domain explicitly needs manual lifecycle control.

## Runtime Wiring

- Use `Layer.provide(...)` to hide an implementation dependency.
- Use `Layer.provideMerge(...)` only when the dependency should remain exposed for downstream consumers.
- Use `Layer.mergeAll(...)` for independent exposed layers.
- Prefer flat, topologically sorted runtime layer values with named subgraphs.
- Avoid using `provideMerge` as a blind make-it-compile tool.
- Avoid hiding important authority or lifecycle dependencies behind broad invisible provisioning.

## Effect.fn

Use extra `Effect.fn(...)` arguments for wrappers that apply to the whole function call. Each transform receives `(effect, ...originalArgs)`.

```ts
const readAttachment = Effect.fn("Attachment.read")(
  function* (ref: AttachmentRef) {
    return yield* api.read(ref)
  },
  (effect, ref) =>
    effect.pipe(
      attachmentError("Attachment.read", { attachmentId: ref.id }),
    ),
)
```

Good whole-function transforms:

- error classification
- localized recovery
- logging annotations
- spans
- retry
- timeout
- ensuring cleanup
- small local provisioning
- result mapping

Guidance:

- Keep the generator body focused on the core workflow.
- Use transforms when the wrapper needs original arguments.
- Do not build long clever pipelines; one or two transforms is usually enough.
- Do not use this for local branch-level handling inside the workflow.

## Operation Error Helpers

For boundary errors with operation labels, prefer a shared curried `mapError` helper over hand-writing wrappers in every module.

```ts
const persistenceError = operationError(PersistenceError.make)

const row = yield* query.pipe(
  persistenceError("UserRepository.findById"),
)
```

Name the local helper after the error it produces, such as `persistenceError`, `projectionError`, or `processingError`. Use `Effect.fn(...)` and spans for observability in addition to payload labels, not instead of them.

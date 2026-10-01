---
name: effect
description: |
  Injectio guide for Effect v4 and Schema implementation. Use when implementing Effect workflows, services, layers, schemas, configuration, schedules, caches, streams, HTTP clients, or tests.
license: MIT
compatibility: Requires Effect v4. Examples are reviewed against the version documented in this repository.
---

# Effect

Use Injectio conventions and the pinned Effect v4 APIs.

## Source Rule

If `vendor/effect` is not initialized, initialize it first. Ignore prior API
knowledge and use only:

- nearest `AGENTS.md`
- `vendor/effect/LLMS.md`
- pinned source under `vendor/effect/packages/`

Never use Context7 or current upstream Effect documentation for this repository.
If vendored material does not answer a question, inspect more vendored source or
ask rather than substituting another version.

## Branch Chooser

Read only the branch references that match the task.

- Data models, schemas, brands, variants, optional keys, or decoders: read `references/SCHEMA.md`.
- Services, module surfaces, layers, runtime wiring, errors, `Effect.fn`, or test services: read `references/SERVICES_LAYERS.md`.
- Runtime config, env variables, `ConfigProvider`, or `layerConfig`: read `references/CONFIG.md`.
- Retry, repeat, polling, backoff, jitter, rate-limit-aware policies, or pass loops: read `references/SCHEDULING.md`.
- Memoization, per-key TTL caches, deduplicating concurrent lookups, or request batching: read `references/CACHING.md`.
- Streams, event sources, async iterables, queues/pubsubs, pagination, backpressure, or stream consumers: read `references/STREAMS.md`.
- Outgoing HTTP calls, Effect HttpClient, status handling, or HTTP rate limiting: read `references/HTTP_CLIENTS.md`.
- Effect tests, time, sleeps, concurrency synchronization, or fakes: read `references/TESTING.md`.

If a task spans several branches, read all matching files before editing.

## Core Defaults

- Compose workflows with `Effect.gen(function* () { ... })`.
- Define public service methods and non-trivial internal service methods with `Effect.fn("Domain.operation")`.
- Use `Effect.fnUntraced` only for internal helpers where stack-frame/span metadata is intentionally unnecessary.
- Define concrete application use cases with `Context.Service<Self>()`, an
  inferred `make`, and `Layer.effect(this, this.make)`. Use explicit service
  interfaces for stable ports, not every concrete use case.
- Capture use-case dependencies in `make`; callers invoke dependency-free methods.
- Keep dependency-free domain workflows as plain functions.
- Model ordinary records with `Schema.Struct(...)` and important domain objects
  with named `Schema.Opaque` models when constructor control and readable hovers
  matter.
- Model typed Effect errors with `Schema.TaggedError`.
- Read runtime config through `Config`, not direct `process.env` access in application logic.
- Use `Schedule` for retry, repeat, polling, pacing, and backoff policies.
- Use `Stream` for effectful sources that emit many values over time and need pull, backpressure, interruption, or transformation.
- Prefer Effect HTTP client modules for outgoing HTTP in Effect applications when their typed errors, layers, and client transforms are useful.
- Prefer Effect-aware tests, explicit layers, and deterministic synchronization over sleeps.
- Prefer decoders and `schema.makeEffect(...)` at untrusted boundaries; reserve throwing `schema.make(...)` for trusted construction, and never use casts to skip validation.
- Return `void` when successful completion is the contract. Reserve `undefined`
  for meaningful absence; in generators use `return yield* Effect.void` when an
  explicit success return is required.
- Use `Schema.is(Foo)` inline rather than aliasing it to `isFoo`.

## Quick Selection Guide

- Ordinary supporting or nested DTO record: `Schema.Struct(...)` plus `type X = typeof X.Type`. Top-level DTOs and read models follow AGENTS.md and ADR 0012.
- Important domain object: named `Schema.Opaque` over its structural schema.
- Scalar ID/value object: constrained branded schema.
- Internal workflow decision or state: `Data.TaggedEnum<...>` plus `Data.taggedEnum<...>()` constructors and exhaustive `$match`.
- Reusable boundary-crossing tagged variant: `Schema.TaggedStruct(...)` plus `type X = typeof X.Type`.
- Boundary-crossing tagged union: `Schema.TaggedUnion(...)` with `.cases`, `.guards`, and `.match`.
- External/custom discriminator such as `type`: `Schema.Struct({ type: Schema.tag("variant"), ... })` plus `Schema.toTaggedUnion("type")` when union helpers are needed.
- Expected typed failure: `Schema.TaggedError`.
- Unknown boundary payload: `Schema.decodeUnknownEffect(...)`.
- Concrete use case: inferred `Context.Service<Self>()` `make` plus `Layer.effect(this, this.make)`.
- Stable port: explicit `Context.Service<Service, Interface>()(...)`.
- Public or non-trivial internal service method: `Effect.fn("Domain.operation")`.
- Runtime configuration: `Config` recipes read in layers; override with `ConfigProvider` in tests.
- Event source: `Stream` consumed with `Stream.runForEach(...)` and forked with `Effect.forkScoped` in the owning layer.
- Queue-backed event source: `Queue` for the producer boundary, `Stream.fromQueue(...)` for consumers.
- Broadcast event source: `PubSub` / `Stream.fromPubSub(...)` or `SubscriptionRef` for latest-value state.
- Polling worker: `runPass().pipe(Effect.repeat(Schedule.spaced(...)))`, with typed pass failures handled before repeat.
- Retry transient operation: `Effect.retry(...)` / `Effect.retryOrElse(...)` with a bounded `Schedule`.
- Keyed lookup cache with TTL and concurrent-lookup dedupe: prefer `Cache.make(...)` / exit-aware `Cache.makeWith(...)` when their lifecycle and eviction model fit.
- Memoize a single effect result: `Effect.cached(...)` / `Effect.cachedWithTTL(...)`.
- Batch N keys into one backend call (only when a real batch endpoint exists): `Effect.request(...)` + `RequestResolver`.
- HTTP request in an Effect application: prefer Effect `HttpClient` plus request/response schema decoding.
- HTTP transient retry: `HttpClient.retryTransient(...)`.
- Time-sensitive test: `TestClock`, not real sleeping.
- Concurrent/background test synchronization: `Deferred`, `Queue`, `Latch`, `Ref`, or explicit test hooks.

## Boundary Rules

- Keep HTTP handlers thin: receive decoded input, read context, call services,
  and map typed errors to transport responses.
- Keep business rules in services or domain functions, not transport handlers.
- Wrap HTTP clients, SDKs, CLIs, and external integrations in named effects at adapter boundaries.
- Keep provider/network calls outside authoritative database transactions.
- Catch or retry only when the current boundary has a truthful response.
- Retry only when the operation has proven idempotency.
- Let exhausted failures remain visible unless the boundary has a real fallback.

## Do Nots

- Do not use `as any`, non-null assertions, or unchecked casts to silence Effect typing problems.
- Do not introduce `Schema.Class` or `Schema.TaggedClass` as default app data-modeling patterns.
- Do not hand-roll `_tag` error classes when `Schema.TaggedError` fits.
- Do not use cause-level recovery when typed-error recovery is enough.
- Do not use `Layer.mergeAll(...)` or `provideMerge(...)` as blind make-it-compile tools.
- Do not hide required application authority, credentials, persistence, transports, or external services behind `Context.Reference` defaults.
- Do not add arbitrary `Effect.sleep(...)` to tests when a deterministic synchronization primitive is available.
- Do not hand-roll Map/TTL/prune caches or in-flight dedupe when `effect/Cache` fits.

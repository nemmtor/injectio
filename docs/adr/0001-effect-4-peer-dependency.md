# 0001: Effect 4 as the only supported peer

Status: accepted

## Decision

`@injectio/react` declares `effect@^4.0.0` as its only supported peer range.
Effect 3 is not supported. The library imports from the `effect` barrel and
uses `Effect.gen({ self })`, `Deferred.makeUnsafe`, and `Scope.provide`.

## Why

The package is unpublished, so no consumer is broken by a major peer. One
supported major keeps the code, tests, and docs free of version branches.
Effect 4 is the current major and the demo app already targets its ecosystem
packages (`@effect/atom-react`, `@effect/vitest`).

## Consequences

Consumers on Effect 3 cannot use the library. The first release ships as
`0.1.0` with a changeset stating the requirement.

A pinned `vendor/effect` submodule is the API reference for contributors and
agents. Bump it together with the `effect` catalog entry.

## Alternatives

- Support Effect 3 and 4: needs two code paths for `Effect.gen` with `self`,
  `Scope.extend` versus `Scope.provide`, and test helpers. Rejected as cost
  without current demand.
- Effect 3 only: dead-ends the library on a superseded major.

## Reconsider when

A concrete user needs Effect 3 and the divergence stays limited to the files
in `packages/react/src/internal/core.ts`.

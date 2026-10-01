# 0002: ESM-only build with tsdown

Status: accepted

## Decision

`@injectio/react` is built with `tsdown` into unbundled ESM plus `.d.ts` files
in `dist`. There is no CommonJS output.

Workspace consumers (tests, demo app) resolve the package to `src/index.ts`
through `exports`. `publishConfig.exports` rewrites it to `dist` at publish
time, so `pnpm pack` and `changeset publish` ship dist-only entry points.

## Why

Effect 4 ships ESM only, so a CommonJS build of this library would still pull
ESM-only code into every consumer. The previous tsc, babel, and
`build-utils pack-v5` pipeline existed to produce CommonJS and a rewritten
package directory. tsdown replaces all of it with one config.

## Consequences

Node consumers need ESM support. Bundlers are unaffected.

The `exports` map exposes only `.` and `./package.json`. Deep imports of
internal modules are not supported.

## Alternatives

- Keep tsc plus babel: more moving parts for an output nobody can use.
- Dual ESM and CJS with tsdown: possible later, but pointless while the peer
  dependency is ESM only.

## Reconsider when

Effect ships a CommonJS build or a consumer needs `require()` support.

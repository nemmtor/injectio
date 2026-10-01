# Project readiness TODO

Assessment date: 2026-10-01

## Current status

Injectio is a working MVP / pre-release library. The core API is implemented:
`inject()` and `<Injectio />` support programmatic rendering, returning results
through deferred values, updating props, and cleanup when the owning Effect
scope closes. The repository also contains seven demo flows, documentation,
package-build scripts, and an MIT license.

The remaining work is primarily release preparation, documentation corrections,
and lifecycle/compatibility validation.

## Verification baseline

| Check | Result |
| --- | --- |
| Tests (`./node_modules/.bin/vitest run`) | 23 tests passed across 6 files |
| Types (`./node_modules/.bin/tsc -b tsconfig.json`) | Passed |
| Lint (`./node_modules/.bin/biome lint`) | Passed |
| Demo build (`npm run build` in `examples/react`) | Passed with a bundle-size warning |
| Full workspace build (`pnpm build` at repository root) | Passed after fixing `allowBuilds` in `pnpm-workspace.yaml` (2026-10-01) |

Standard `pnpm test --run`, `pnpm check-types`, and `pnpm lint` commands hit the
same build-approval blocker. The installed binaries were used for the successful
checks above. Full package assembly and publishable artifacts remain unverified.

## TODO

### 1. Restore a reproducible verification and build workflow

- [ ] Resolve the existing local changes in `pnpm-workspace.yaml:4–7`. The
  `allowBuilds` entries contain the literal value `set this to true or false`
  for `@tailwindcss/oxide`, `esbuild`, and `msgpackr-extract`. Choose the intended
  approval settings and reconcile them with `onlyBuiltDependencies`.
- [ ] Document or pin the supported package-manager version. This assessment
  used pnpm 11.20.0.
- [ ] Rerun standard test, type-check, lint, and full workspace-build commands
  after resolving the configuration issue.
- [ ] Verify the generated publishable package and its entry points in a
  consuming project.

The workspace configuration was already modified before the assessment. This is
a local setup blocker, not proof that the committed project cannot build.

### 2. Prepare the first release

- [ ] Confirm publication status. `README.md:16` says the package is not yet
  published; npm registry status was not independently checked.
- [ ] Choose an initial release version; `packages/react/package.json:5`
  currently declares `0.0.0`.
- [ ] Add CI checks for tests, types, lint, and builds. No checked-in CI workflow
  was found during the assessment.
- [ ] Define the release process and record release notes/tags. No local Git
  tags or checked-in release workflows were found.
- [ ] Update installation instructions when publication is confirmed.

### 3. Correct and validate documentation examples

Apply corrections to both `README.md` and `packages/react/README.md`, which
contain the same examples.

- [ ] Fix `injectSomeDialog.pipe(...)` at line 58 to call the function before
  piping: `injectSomeDialog().pipe(...)`.
- [ ] Fix the variable mismatch at lines 92–93: `someService` is declared, but
  `userService` is referenced.
- [ ] Remove the extra `()` at line 204, which attempts to call the Promise
  returned by `Effect.runPromise`.
- [ ] Provide and verify a complete, copy-pasteable basic example, including
  required `initialProps` and imports.

### 4. Define compatibility and host-lifecycle behavior

- [ ] Decide whether server rendering is supported. The external-store hooks
  in `packages/react/src/injectio.ts:7` and
  `packages/react/src/internal/injected-component.ts:9` have no server snapshot.
  Direct server rendering is unsupported as written; either document the
  client-only boundary or implement and verify server-rendering behavior.
- [ ] Define behavior with multiple `<Injectio />` hosts or React roots.
  `packages/react/src/internal/core.ts:14` uses a global singleton, so hosts
  share injections. Document a single-host requirement or add isolation if
  multiple independent hosts are intended.
- [ ] Define what should happen when the host unmounts while callers are still
  awaiting deferred results, then document and test that behavior.

### 5. Extend lifecycle and compatibility tests

Existing tests cover rendering, initial and updated props, successful deferred
results, scope cleanup, and isolated rerenders. Add explicit coverage for:

- [ ] Deferred failure and error propagation.
- [ ] Fiber interruption and associated cleanup.
- [ ] React Strict Mode behavior.
- [ ] Host unmount while callers await results.
- [ ] The chosen server-rendering and multiple-host support boundaries.
- [ ] Supported React versions; peer dependencies advertise React 18 and 19,
  while the current development dependency uses React 19.

### 6. Optional demo polish

- [ ] Review the demo production bundle warning. The build emitted a JavaScript
  chunk of approximately 539 kB before gzip (173 kB gzip), above the default
  500 kB warning threshold. This did not fail the build and is not itself a
  library-release blocker.

## Readiness target

Before calling the project release-ready, establish a reproducible full build,
verify the packaged consumer experience, correct the usage examples, document
the supported runtime boundaries, and cover the key lifecycle edge cases.

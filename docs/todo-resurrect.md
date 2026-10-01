# Resurrect plan

Date: 2026-10-01. Model setup on `~/Projects/seedhub`. Complements `docs/todo.md` (release readiness).

## Status

Phases 0-9 done in one PR (branch `chore/fix-workspace-build-approvals`). Phase 10 and the items below remain.

Deviations from the plan:

- `tsc --noEmit` per package via turbo. No project references or `tsc -b`.
- `@effect/tsgo` (`prepare` script patches TypeScript and oxlint) replaces the language-service plugin.
- `exactOptionalPropertyTypes` is off in `examples/react` only (shadcn components).
- `Injected` and `Core` methods became arrow properties and the store holds a small `InjectedView` type. This removes the `as` cast and the `bind` calls that the new lint rules reject.
- `publishConfig.exports` rewrites entry points to `dist` at publish. Checked with `pnpm pack`.
- oxlint and knip ignore `examples/react/src/components/ui` (generated shadcn code). Unused example deps (`vaul`, `framer-motion`, `globals`, `@hookform/resolvers`) stay, ignored in knip.
- Release workflow is untested. It needs an `NPM_TOKEN` secret and the `@injectio` scope. It sets npm provenance.
- ADRs 0001 and 0002 added in `docs/adr`.
- Not run: React 18 test matrix, Node 24 compatibility.

Verified locally: `pnpm check`, `pnpm build`, `pnpm test:e2e`, `pnpm coverage`.

## Gap: injectio vs seedhub

| Area          | injectio now                                   | seedhub                                                                      |
| ------------- | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| Node / pnpm   | none pinned (local node 24, pnpm 11)           | `.nvmrc`, `devEngines`, `engines`, `packageManager` (pnpm 12.5.1), nix flake |
| Workspace     | `onlyBuiltDependencies` + broken `allowBuilds` | `catalog:`, `allowBuilds: true/false`                                        |
| effect        | 3.17, `@effect/vitest` 0.25                    | 4.0.0                                                                        |
| TypeScript    | ~5.9, `tsc -b` project refs, NodeNext          | 7.0.2, Bundler, strict flags, `verbatimModuleSyntax`                         |
| Lint / format | Biome 2.2.2                                    | oxlint (type-aware, effect-tsgo preset) + oxfmt                              |
| Build         | tsc + babel + `build-utils pack-v5`            | tsdown                                                                       |
| Tests         | vitest 3, `@effect/vitest` 0.25                | vitest 5, `@effect/vitest` 4                                                 |
| Task runner   | `pnpm -r`                                      | turbo                                                                        |
| Hygiene       | none                                           | knip, manypkg, dependency-cruiser, lefthook, renovate                        |
| CI            | none                                           | GH Actions `checks.yml`, SHA-pinned actions                                  |
| Agent docs    | none                                           | `AGENTS.md`, `.agents/`                                                      |

## Phase 0 - Unblock baseline

- [x] Fix `pnpm-workspace.yaml`: replace placeholder `allowBuilds` with `true`/`false`, drop `onlyBuiltDependencies`.
  - `esbuild: true`, `@tailwindcss/oxide: true`, `msgpackr-extract: false` (seedhub choice).
- [x] Confirm `pnpm install`, `pnpm exec vitest run` (23 tests), `pnpm check-types`, `pnpm lint`, `pnpm build` all green on current versions. Note: `pnpm test --run` fails on pnpm 11 (recursive exec), use `pnpm exec vitest run`.
- [x] Commit as own PR. Everything after builds on green baseline.

## Phase 1 - Toolchain pins

- [x] `.nvmrc` (26.9.0) + `engines` (`>=26 <27`) + `devEngines` like seedhub.
- [x] `packageManager` field with pnpm 12.x hash. Copy seedhub value.
- [x] `.editorconfig`: add `end_of_line = lf`.
- [x] `flake.nix` + `flake.lock` + `.envrc` (`use flake`) copied from seedhub (nodejs_26 + corepack). Add `.corepack`, `.direnv` to `.gitignore`.
- [x] Root `package.json`: drop `workspaces` field (pnpm uses `pnpm-workspace.yaml`). Add `description`, `keywords`, `repository`.

## Phase 2 - Package bump (no behavior change)

- [x] Add `catalog:` to `pnpm-workspace.yaml` for shared deps: `effect`, `react`, `react-dom`, `@types/react`, `@types/react-dom`, `typescript`, `vitest`, `@effect/vitest`, `jsdom`, testing-library set, `@types/node`, `vite`, `tailwindcss`, `@tailwindcss/vite`.
- [x] Use `packages/*` + `examples/*` as `catalog:` consumers.
- [x] Bump to seedhub versions as start, re-check latest at bump time:
  - react / react-dom `^19.3`, `@types/react` `^19.3`
  - vitest `^5`, jsdom `^30`, `@testing-library/jest-dom` `^7`, `@testing-library/react` `^16.3.3`
  - vite `^8`, `@vitejs/plugin-react` `^6`, tailwind `^4.3`, `@tailwindcss/vite` `^4.3`
  - `uuid`: drop dep, use `crypto.randomUUID()` (stdlib, ids are only store keys). Update `core.ts` + tests.
- [x] Bump example-only deps (radix, sonner, vaul, framer-motion, lucide, react-hook-form, next-themes, hookform resolvers). `@effect-atom/atom-react` -> `@effect/atom-react` (Phase 4).
- [x] Run tests + types after each group, not all at once.

## Phase 3 - TypeScript 7 + tsconfig

- [x] Replace `tsconfig.base.json` with seedhub base: `moduleResolution: Bundler`, `module: ESNext`, `noEmit`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noUncheckedSideEffectImports`.
- [x] Drop `emitDecoratorMetadata`, `experimentalDecorators`, `downlevelIteration`, `baseUrl`.
- [x] Swap `@effect/language-service` plugin for `@effect/tsgo` + `"prepare": "effect-tsgo patch --oxlint"`.
- [x] Collapse `packages/react` tsconfigs: one `tsconfig.json` (+ test include) instead of src/test/build trio, if build moves to tsdown (Phase 5).
- [x] Fix new strict errors: `.js` import suffixes decision, `Observable`/`Store` index access, `exactOptionalPropertyTypes` on `Injected` props.
- [x] No `any`, no `!`, no `as` (user rule) - lint enforces in Phase 6.

## Phase 4 - Effect 4 migration

Highest risk. Own PR.

- [x] Add `vendor/effect` git submodule (`https://github.com/Effect-TS/effect`) like seedhub (decided). Add `.gitmodules`, `/vendor/*/` in `.gitignore`, `vendor` in oxfmt/oxlint ignores. CI checkout needs `submodules` only if a job reads it (not needed). Verify every API against vendored source, not memory or Context7.
- [x] Touchpoints (all in `packages/react/src`): `Deferred.make/await`, `Effect.gen` with `this`, `Effect.addFinalizer`, `Effect.sync`, scope semantics in `core.ts`; `inject.ts` return shape; `observable.ts` / `store.ts` (likely no effect).
- [x] Tests: `@effect/vitest` 4 (`it.effect`, `it.layer`). Convert existing tests.
- [x] README + `examples/react`: `@effect-atom/atom-react` -> `@effect/atom-react` 4.0.0, update examples.
- [x] `peerDependencies.effect`: v4 only (decided). Drop v3 range.
- [x] Update import style: `effect/Deferred` subpath vs namespace imports per seedhub `namespaceImportPackages`.

## Phase 5 - Build: tsdown

- [x] Replace tsc + babel + `build-utils pack-v5` with `tsdown` (copy seedhub `packages/common/tsdown.config.ts`: esm, es2022, dts, sourcemap, treeshake).
- [x] ESM only (decided). `format: ["esm"]`. No CJS, no babel.
- [x] `exports` in `packages/react/package.json`: `types` -> src, `default` -> dist (seedhub pattern) for workspace; verify published manifest has dist-only paths. Remove `publishConfig.directory: dist` hack if no longer assembling a dist package.
- [x] Add `files: ["dist"]`, `sideEffects: false`.
- [x] Drop devDeps: `@babel/*`, `babel-plugin-annotate-pure-calls`, `@effect/build-utils`, `glob`, `scripts/clean.mjs` (use `del-cli`).
- [x] Verify with `pnpm pack` + install tarball in scratch app. Overlaps `docs/todo.md` item 1.

## Phase 6 - Biome -> oxlint + oxfmt

- [x] Add `.oxlintrc.json` from seedhub, strip backend/FSD overrides. Keep: react + jsx-a11y override for `packages/react` + `examples/react`, vitest override for tests, no-console off for scripts.
- [x] Add `.oxfmtrc.jsonc` copied from seedhub: double quotes (decided), trailing commas `all`, width 80.
- [x] Scripts: `lint`, `lint:fix`, `format`, `check-format`. Remove `biome.json`, `@biomejs/biome`, `check-actions*`.
- [x] Add `oxlint-tsgolint`. One formatting-only commit for repo-wide reformat, no logic.
- [x] GH Actions lint: `actionlint` in CI replaces biome `check-actions`.

## Phase 7 - Repo hygiene

- [x] `turbo.jsonc` + root scripts via turbo (`build`, `test`, `check-types`, `clean`). Copy seedhub task shape (decided). Add `.turbo` to `.gitignore`.
- [x] Playwright e2e (decided): root `e2e/` with `playwright.config.ts` (`webServer`: build + `vite preview` of `examples/react`), `tsconfig.json`, smoke test per demo flow (7 flows: open, return value, close on scope end). Scripts `test:e2e`; `@playwright/test` root devDep. Ignore `e2e/**` from vitest, add oxlint e2e override from seedhub.
- [x] `knip` (`knip.json`, ignore `@effect/language-service` if kept).
- [x] `@manypkg/cli` + `check-monorepo`.
- [x] `lefthook.yml`: manypkg, oxfmt, oxlint on staged, conventional commit msg check. Branch-name rule included (decided).
- Skipped: `dependency-cruiser` (7 source files, no layering to enforce).
- [x] `renovate.json` copy; keep `typescript` pin rule only if needed.
- [x] `.gitignore`: add `.turbo`, `playwright-report`, `test-results`, `.env*`.
- [x] Single root `check` script: types, format, lint, test, knip, monorepo.

## Phase 8 - CI

- [x] `.github/workflows/checks.yml` modeled on seedhub: actionlint, `pnpm/setup`, monorepo, format, knip, lint, types; separate build + tests jobs. Pin actions by SHA, `permissions: contents: read`, concurrency cancel.
- [x] Add example build job (`examples/react` vite build).
- [x] `e2e` job: cache Playwright browsers, `pnpm exec playwright install --with-deps chromium`, upload `playwright-report` artifact (copy seedhub job).
- [x] Skip production-image job (no server).
- [x] Release workflow: see Release tooling below.

## Phase 9 - Agent docs

- [x] `AGENTS.md` (+ `CLAUDE.md` pointing to it): effect-via-vendor rule, test boundaries (`it` from `@effect/vitest`; plain vitest only for UI tests), code style, no `any`/`!`/`as`.
- [x] `.agents/skills`: copy `effect`, `test-driven-development` from seedhub. Skip backend/FSD skills.
- [x] `docs/adr/`: one ADR for effect 4 + peer range, one for build tool. Skip rest.

## Phase 10 - Then resume `docs/todo.md`

README example fixes, SSR / multi-host / unmount-while-awaiting decisions, lifecycle tests (failure, interruption, StrictMode), React 18 test matrix, first release.

## Release tooling (suggestion)

Use **changesets** (`@changesets/cli` + `changesets/action`).

- Pre-1.0 single public package, explicit semver control, no dependence on commit-title discipline (past titles like `chore: tests (#9)` would yield no release under release-please).
- Fits pnpm + monorepo; ignore `react-example` (private) via `.changeset/config.json` `ignore`.
- Flow: PR adds `.changeset/*.md` -> merge to main -> action opens "Version Packages" PR -> merge -> action runs `pnpm build && changeset publish` with npm provenance (`id-token: write`, `NPM_TOKEN` secret).
- Start `0.1.0`; `pre` mode not needed.
- Alternative: release-please. Pick if you prefer zero per-PR files and are fine enforcing meaningful `feat`/`fix` titles.

## Order / PRs

1. Phase 0 (fix workspace)
2. Phase 1 + 2 (pins + bump)
3. Phase 3 (TS 7)
4. Phase 6 (lint/format swap) - before Effect migration so diffs stay readable
5. Phase 4 (Effect 4)
6. Phase 5 (tsdown)
7. Phase 7 + 8 (hygiene, turbo, Playwright, CI, release workflow)
8. Phase 9 (agent docs)

Each PR: `pnpm check` green before merge.

## Risks

- Effect 4 API break could change `inject()` public shape. Library not published yet, so break is free now. Do it before 0.1.0.
- TS 7 (native) + `@effect/tsgo` may lag some tooling (`dependency-cruiser` needed a `typescript@^6` packageExtension in seedhub). Expect similar friction.
- Repo-wide reformat on oxfmt swap pollutes `git blame`. Isolate commit; add `.git-blame-ignore-revs`.
- pnpm 12 / node 26 are bleeding edge. Decided: node 26 anyway.

## Decisions (resolved)

- Node 26, pnpm 12.x, nix flake + direnv.
- Effect v4 only, ESM only.
- oxfmt double quotes.
- turbo, Playwright e2e, drop `uuid`, `vendor/effect` submodule.
- Release: changesets.
- Keep branch-name hook.
- Keep heavy `examples/react` deps.

## Unresolved questions

1. `@injectio` npm scope available? Provenance publish ok? Check before release workflow (Phase 8). Not blocking earlier phases.

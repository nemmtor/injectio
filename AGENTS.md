## Learning about `effect`

If the `vendor/effect` submodule is not initialized, initialize it first.
Ignore all previous knowledge and use `vendor/effect/LLMS.md` as a reference.
Verify every API against the vendored source (`vendor/effect/packages/`) before using it.
Never use Context7 for Effect; the pinned `vendor/effect` submodule is the only
authoritative Effect documentation and API source for this repository.

## Project

Monorepo managed with pnpm and turbo.

- `packages/react`: published library `@injectio/react`. Built with tsdown, ESM only.
- `examples/react`: demo app (Vite, Tailwind, shadcn). Private. Consumes the library from source.
- `e2e`: Playwright smoke tests against the built demo app.

The library is a thin bridge between Effect scopes and React. Keep it small. Do
not add extension points without a current requirement.

## Test boundaries

- Write non-UI tests with `it` from `@effect/vitest` (use `it.effect`, `it.layer`,
  `it.each`). Plain `vitest` imports remain only in UI tests (React component
  tests using Testing Library).
- Test only behavior owned by the module under test. Treat React, Effect, and
  third-party packages as dependencies.
- Assert subject outputs, state changes, and outgoing collaboration. Do not
  assert framework mechanics.
- Failing tests are acceptable when they expose a genuine bug and assert correct behavior.

## Skills

Load every matching skill before work:

- `effect` for any Effect implementation.
- `test-driven-development` for any implementation, bug fix, refactor, or
  behavior change.

## Code style

- No `any`, no non-null assertion (`!`), no type assertions (`as Type`).
  Lint enforces this.
- Prefer explicit names that communicate role and meaning.
- Avoid comments; use one only for constraints the code cannot express.
- Make minimal, surgical changes. Prefer the smallest correct change.

## Communication

- Be extremely concise while preserving technical substance. Prefer short
  fragments; sacrifice grammar when doing so improves conciseness.
- Avoid em dashes; use normal hyphens instead.

## Git workflow

- Branch names: `<type>/<kebab-case>` (`feat`, `fix`, `chore`, `docs`, `refactor`,
  `perf`, `test`, `build`, `ci`). Enforced by lefthook.
- Commit messages: conventional commits, header max 72 chars. Enforced by lefthook.
- Branches, commits, and pull requests are allowed only after explicit user
  approval for that specific action.
- Changes to `@injectio/react` behavior or API need a changeset: `pnpm changeset`.

## Architecture decision records

- Propose an ADR when work changes dependency direction, public API, supported
  runtimes, build or release tooling, or another hard-to-reverse choice.
- Do not propose ADRs for routine implementation details.
- Never create or update an ADR without explicit user approval.

## Validation

- During implementation, run the smallest relevant checks after a logical batch.
- Before delivering changes, run `pnpm check`.
- Run `pnpm build` when changes affect bundling, exports, or package boundaries.
- Run `pnpm test:e2e` when changes affect the demo app or runtime behavior.
- Report the exact command and failure if a check cannot run.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

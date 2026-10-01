# Writing Good Tests

**Load this reference when:** writing or changing tests, adding mocks, or
adding cleanup/helper methods for tests.

## Overview

A test exists to catch a specific break. Two principles govern everything
here:

```
1. Every test names the break it catches
2. Every test exercises the real subject, not its dependencies' internals
```

Use doubles at stable dependency boundaries, including other application
layers and third-party packages. Dependencies need not be slow or external to
the process to justify a double; ownership determines the test boundary.

## Principle 1: Name the Break

Before writing the test body, answer: **what production change should
make this test fail — and is that change a bug or a decision?** A test
earns its place by catching a wrong branch, missing side effect, wrong
argument, boundary case, or broken contract.

**Derive expectations independently.** Use literals and hand-checked
fixtures; table-driven tests with literal `want` values are the preferred
shape. An expectation computed by the code under test — or its helpers —
passes no matter what that code does:

```typescript
// ❌ Mirror assertion: the same builder computes both sides — always true
const expected = buildSearchQuery({ tag: 'urgent' });
expect(buildSearchQuery({ tag: 'urgent' })).toBe(expected);

// ✅ Hand-derived literal
expect(buildSearchQuery({ tag: 'urgent' })).toBe('tag:"urgent"');
```

**Treat test factory defaults as opaque.** Use a factory when most valid setup
is irrelevant to behavior under test, and pass relevant differences through
its override parameter:

```typescript
const user = makeUser({ status: "suspended" });
```

Do not spread factory output to override it. That exposes implementation and
bypasses factory API:

```typescript
const user = { ...makeUser(), status: "suspended" };
```

Never hardcode a whole-object expectation from factory defaults. Changing an
unrelated default would break test despite unchanged behavior. When test
asserts serialization, mapping, normalization, or entire object shape, arrange
all asserted values explicitly. When behavior is identity forwarding, compare
returned object to arranged instance. Factories remain suitable for error and
branch tests whose assertions ignore valid baseline fields.

**No change detectors.** If only intentional decisions can fail a test —
a constant's value, exact message wording, private structure — it fires
on redesign and sleeps through bugs. Test the behavior that depends on
the decision: not `expect(MAX_RETRIES).toBe(5)` but "a failing call is
retried 5 times and the 6th attempt never happens."

**Behavior, not text.** Asserting that a script, skill, or config
contains an exact line proves only that the source is the source. Run
scripts against controlled inputs and assert outputs, side effects, or
exit codes. Validate agent instructions against their authoritative sources;
use consumer behavior checks when warranted. Do not add source-text tests for
prose.

**Your code, not the framework.** Test the contract your code makes at
its boundaries — the route you register, the query you emit, the payload
you produce. Upstream mechanics are their maintainers' tests to write
(the classic: asserting your router invokes a registered handler — that
is the framework's test, not yours). When upstream behavior genuinely
surprised you, write one narrow characterization test naming the
assumption. The same boundary applies inside your code: constructors,
getters, constants, and trivial forwarding earn tests only when they
validate, normalize, default, derive, enforce, or cause side effects —
otherwise assert the first consumer-visible result that depends on them.

### Gate Function

```
BEFORE writing the test body:
  Name the production change that would make this test fail.

  Cannot name one            → redesign around an observable behavior
  "The source text changed"  → run the artifact and assert its effects
  Only intentional decisions → change detector; test the behavior
                               that depends on the decision

  Confirm the expected value is derived without the code under test.
  IF it reuses the code's logic or helpers:
    Replace it with a literal or hand-checked fixture

  IF using a test factory:
    Pass scenario values through factory overrides
    Treat defaults as opaque
    Whole-object assertion -> arrange asserted values explicitly
```

## Principle 2: Exercise the Real Thing

**Assert the subject's contract, not the double's implementation.** Outputs,
state changes, and outgoing calls are observable behavior. A spy can verify
that a use case sends the correct blueprint to its catalog port, or avoids
calling that port after a failure. Do not assert the fake's storage algorithm,
framework mechanics, or a mock's existence alone.

```typescript
// ✅ Real behavior
expect(screen.getByRole('navigation')).toBeInTheDocument();

// ❌ Mock existence
expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
```

**Mock at the right level.** Keep the subject's decisions real and replace
collaborators at stable ports or module APIs. Model the contract outcomes
needed by the scenario, including failures. Do not pull real persistence or
another layer's business rules into a unit test to reproduce side effects.

**Make doubles specific.** When arguments, call counts, or ordering are
part of the contract, assert them — a fake that accepts anything verifies
nothing. Give each branch (success, error, malformed) its own fixture or
spy, so the wrong branch cannot satisfy the expectation.

**Match the boundary contract.** Returned fixtures include required contract
fields and scenario-relevant optional values, not a dependency's private data.
Partial port doubles are fine when unused methods fail loudly.

**Production classes carry production methods only.** Cleanup that only
tests need lives in test utilities, never as a `destroy()` on the
production class. Ask: is this method called only from tests? Does this
class own this resource's lifecycle? Wrong answers → test utility.

**Simplify complex doubles.** First reconsider the subject and seam. Use an
integration test only when collaboration between real components is the
behavior under test, and respect the repository's persistence-test limits.

### Gate Function

```
BEFORE adding a mock or test helper:
  Identify the subject's responsibility and its stable dependency seam.
  Keep subject behavior real; configure collaborator outcomes through doubles.

  Responses satisfy the boundary contract, not dependency internals.

  A method only tests call lives in test utilities, not production.

  About to assert on a double?
    Subject-owned outgoing call or absence of a call -> valid assertion.
    Double internals or mere mock existence -> remove or rewrite assertion.
```

## Tests Ship With the Implementation

The TDD cycle — failing test, minimal implementation, refactor — is what
"complete" means. Ship the tests the behavior needs and only those:
trivial code and human prose earn none, and a test written to satisfy
process costs maintenance forever.

## The Mutation Check

Before finishing, mentally mutate the production code; at least one test
should fail for each realistic mutation:

- Wrong constant or argument
- Wrong branch handler
- Missing state change or side effect
- Empty or default return
- Missing validation for zero, empty, nil, unauthorized, or malformed input

A mutation nothing catches marks the behavior as unprotected — or the
test as tautological.

## Quick Reference

| When you... | Do |
|-------------|-----|
| Write any test | Name the break it catches — a bug, not a decision |
| Build an expected value | Derive it by hand; never with the code under test |
| Use a test factory | Override through its API; never assert hidden defaults |
| Test a script or document | Run it / pressure-test its consumer; never grep its text |
| Reach for a dependency test | Test your boundary contract, not their documented mechanics |
| Want to assert on a double | Assert subject-owned collaboration, not double internals |
| Are about to mock a method | Identify ownership; replace the stable dependency seam |
| Build a mock response | Satisfy the boundary contract and scenario |
| Need cleanup only tests use | Put it in test utilities |
| Watch mock setup balloon | Simplify the seam; integrate only to test real collaboration |
| Finish a test file | Run the mutation check |

## Warning Signs

- Setup and assertion share the same object, guaranteeing equality
- The test can fail only through a panic, crash, or missing selector
- The test fails on every intentional change, never on accidental breakage
- Expected values are hidden behind loops, builders, or helpers
- The test greps source text, or asserts a removed symbol stays removed
- The test would still matter if only the framework remained
- The test exists for coverage, checking no side effect or outcome
- An assertion checks only a `*-mock` test ID or the double's internal state
- A method is called only from test files
- Mock setup is more than half the test, or you can't explain why the mock is needed
- Mocking "just to be safe"

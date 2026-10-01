import { describe, expect, it, vi } from "@effect/vitest";
import { Core } from "../../src/internal/core";
import { Effect, Exit, Scope } from "effect";

describe("Core", () => {
  it("should be a singleton", () => {
    const core1 = Core.getInstance();
    const core2 = Core.getInstance();

    expect(core1).toBe(core2);
  });

  it.effect("should allow adding items", () =>
    Effect.gen(function* () {
      const core = Core.getInstance();
      yield* core.add({ renderFn: vi.fn<() => null>(), initialProps: {} });

      const snapshot = core.getSnapshot();

      expect(snapshot).toHaveLength(1);
    }),
  );

  it("should notify registered observers after removing an item", () => {
    const core = Core.getInstance();
    const spyObserver = vi.fn<VoidFunction>();
    core.observe(spyObserver);

    core.remove("1");

    expect(spyObserver).toHaveBeenCalled();
  });

  it.effect("should notify registered observers after adding an item", () =>
    Effect.gen(function* () {
      const core = Core.getInstance();
      const spyObserver = vi.fn<VoidFunction>();
      core.observe(spyObserver);

      yield* core.add({ renderFn: vi.fn<() => null>(), initialProps: {} });

      expect(spyObserver).toHaveBeenCalled();
    }),
  );

  it.effect("should remove an item after scope gets closed", () =>
    Effect.gen(function* () {
      const core = Core.getInstance();
      const scope = yield* Scope.make();
      yield* core
        .add({ renderFn: vi.fn<() => null>(), initialProps: {} })
        .pipe(Scope.provide(scope));

      yield* Scope.close(scope, Exit.void);
      const snapshot = core.getSnapshot();

      expect(snapshot).toHaveLength(0);
    }),
  );
});

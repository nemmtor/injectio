import { describe, expect, it, vi } from "@effect/vitest";
import { Injected } from "../../src/internal/injected";
import { Deferred } from "effect";

describe("Injected", () => {
  it("should notify registered observers after updating props", () => {
    const injected = new Injected({
      props: { count: 0 },
      deferred: Deferred.makeUnsafe(),
      id: "1",
      renderFn: vi.fn<() => null>(),
    });
    const spyObserver = vi.fn<VoidFunction>();
    injected.observe(spyObserver);

    injected.updateProps({ count: 1 });

    expect(spyObserver).toHaveBeenCalled();
  });

  it("should update props reference after updating them", () => {
    const injected = new Injected({
      props: { count: 0 },
      deferred: Deferred.makeUnsafe(),
      id: "1",
      renderFn: vi.fn<() => null>(),
    });

    const propsBefore = injected.getProps();
    injected.updateProps({ count: 1 });
    const propsAfter = injected.getProps();

    expect(propsBefore).not.toBe(propsAfter);
  });
});

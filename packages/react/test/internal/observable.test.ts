import { describe, expect, it, vi } from "@effect/vitest";
import { Observable } from "../../src/internal/observable";

describe("Observable", () => {
  it("should allow notifying registered observers", () => {
    const observable = new Observable();
    const spyObserver = vi.fn<VoidFunction>();

    observable.observe(spyObserver);
    observable.emit();

    expect(spyObserver).toHaveBeenCalled();
  });

  it("should allow unregistering observer", () => {
    const observable = new Observable();
    const spyObserver = vi.fn<VoidFunction>();
    const cleanup = observable.observe(spyObserver);

    cleanup();
    observable.emit();

    expect(spyObserver).not.toHaveBeenCalled();
  });
});

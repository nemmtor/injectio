import { describe, expect, it, vi } from "@effect/vitest";
import { render } from "@testing-library/react";
import { Injected } from "../../src/internal/injected";
import { InjectedComponent } from "../../src/internal/injected-component";
import { Deferred } from "effect";

describe("InjectedComponent", () => {
  it("should call renderFn", () => {
    const spyRenderFn = vi.fn<() => null>();
    const injected = new Injected<unknown, unknown, unknown>({
      props: { count: 0 },
      deferred: Deferred.makeUnsafe(),
      id: "1",
      renderFn: spyRenderFn,
    });

    render(<InjectedComponent item={injected} />);

    expect(spyRenderFn).toHaveBeenCalled();
  });

  it("should call renderFn with injected props", () => {
    const spyRenderFn = vi.fn<() => null>();
    const injected = new Injected<unknown, unknown, unknown>({
      props: { count: 0 },
      deferred: Deferred.makeUnsafe(),
      id: "1",
      renderFn: spyRenderFn,
    });

    render(<InjectedComponent item={injected} />);

    expect(spyRenderFn).toHaveBeenCalledWith(
      expect.objectContaining({ props: injected.getProps() }),
    );
  });

  it("should call renderFn with created deferred", () => {
    const spyRenderFn = vi.fn<() => null>();
    const deferred = Deferred.makeUnsafe<unknown, unknown>();
    const injected = new Injected<unknown, unknown, unknown>({
      props: { count: 0 },
      deferred,
      id: "1",
      renderFn: spyRenderFn,
    });

    render(<InjectedComponent item={injected} />);

    expect(spyRenderFn).toHaveBeenCalledWith(
      expect.objectContaining({ deferred }),
    );
  });
});

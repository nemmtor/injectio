import { describe, expect, it, vi } from '@effect/vitest';
import { render } from '@testing-library/react';
import * as Deferred from 'effect/Deferred';
import * as Effect from 'effect/Effect';
import { Injected } from '../../src/internal/injected.js';
import { InjectedComponent } from '../../src/internal/injected-component.js';

describe('InjectedComponent', () => {
  it('should call renderFn', () => {
    const spyRenderFn = vi.fn();
    const injected = new Injected<unknown, unknown, unknown>({
      props: { count: 0 },
      deferred: Effect.runSync(Deferred.make()),
      id: '1',
      renderFn: spyRenderFn,
    });

    render(<InjectedComponent item={injected} />);

    expect(spyRenderFn).toHaveBeenCalled();
  });

  it('should call renderFn with injected props', () => {
    const spyRenderFn = vi.fn();
    const injected = new Injected<unknown, unknown, unknown>({
      props: { count: 0 },
      deferred: Effect.runSync(Deferred.make()),
      id: '1',
      renderFn: spyRenderFn,
    });

    render(<InjectedComponent item={injected} />);

    expect(spyRenderFn).toHaveBeenCalledWith(
      expect.objectContaining({ props: injected.getProps() }),
    );
  });

  it('should call renderFn with created deferred', () => {
    const spyRenderFn = vi.fn();
    const deferred = Effect.runSync(Deferred.make<unknown, unknown>());
    const injected = new Injected<unknown, unknown, unknown>({
      props: { count: 0 },
      deferred,
      id: '1',
      renderFn: spyRenderFn,
    });

    render(<InjectedComponent item={injected} />);

    expect(spyRenderFn).toHaveBeenCalledWith(
      expect.objectContaining({ deferred }),
    );
  });
});

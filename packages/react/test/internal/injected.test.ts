import { describe, expect, it, vi } from '@effect/vitest';
import * as Deferred from 'effect/Deferred';
import * as Effect from 'effect/Effect';
import { Injected } from '../../src/internal/injected.js';

describe('Injected', () => {
  it('should notify registered observers after updating props', () => {
    const injected = new Injected({
      props: { count: 0 },
      deferred: Effect.runSync(Deferred.make()),
      id: '1',
      renderFn: vi.fn(),
    });
    const spyObserver = vi.fn();
    injected.observe(spyObserver);

    injected.updateProps({ count: 1 });

    expect(spyObserver).toHaveBeenCalled();
  });

  it('should update props reference after updating them', () => {
    const injected = new Injected({
      props: { count: 0 },
      deferred: Effect.runSync(Deferred.make()),
      id: '1',
      renderFn: vi.fn(),
    });

    const propsBefore = injected.getProps();
    injected.updateProps({ count: 1 });
    const propsAfter = injected.getProps();

    expect(propsBefore).not.toBe(propsAfter);
  });
});

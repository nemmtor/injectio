import { describe, expect, it, vi } from '@effect/vitest';
import { Observable } from '../../src/internal/observable.js';

describe('Observable', () => {
  it('should allow notifying registered observers', () => {
    const observable = new Observable();
    const spyObserver = vi.fn();

    observable.observe(spyObserver);
    observable.emit();

    expect(spyObserver).toBeCalled();
  });

  it('should allow unregistering observer', () => {
    const observable = new Observable();
    const spyObserver = vi.fn();
    const cleanup = observable.observe(spyObserver);

    cleanup();
    observable.emit();

    expect(spyObserver).not.toBeCalled();
  });
});

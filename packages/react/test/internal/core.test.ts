import { describe, expect, it, vi } from '@effect/vitest';
import * as Effect from 'effect/Effect';
import * as Exit from 'effect/Exit';
import * as Scope from 'effect/Scope';
import { Core } from '../../src/internal/core.js';

describe('Core', () => {
  it('should be a singleton', () => {
    const core1 = Core.getInstance();
    const core2 = Core.getInstance();

    expect(core1).toBe(core2);
  });

  it.scoped('should allow adding items', () =>
    Effect.gen(function* () {
      const core = Core.getInstance();
      yield* core.add({ renderFn: vi.fn(), initialProps: {} });

      const snapshot = core.getSnapshot();

      expect(snapshot).toHaveLength(1);
    }),
  );

  it('should notify registered observers after removing an item', () => {
    const core = Core.getInstance();
    const spyObserver = vi.fn();
    core.observe(spyObserver);

    core.remove('1');

    expect(spyObserver).toHaveBeenCalled();
  });

  it.scoped('should notify registered observers after adding an item', () =>
    Effect.gen(function* () {
      const core = Core.getInstance();
      const spyObserver = vi.fn();
      core.observe(spyObserver);

      yield* core.add({ renderFn: vi.fn(), initialProps: {} });

      expect(spyObserver).toHaveBeenCalled();
    }),
  );

  it.effect('should remove an item after scope gets closed', () =>
    Effect.gen(function* () {
      const core = Core.getInstance();
      const scope = yield* Scope.make();
      yield* core
        .add({ renderFn: vi.fn(), initialProps: {} })
        .pipe(Scope.extend(scope));

      yield* Scope.close(scope, Exit.void);
      const snapshot = core.getSnapshot();

      expect(snapshot).toHaveLength(0);
    }),
  );
});

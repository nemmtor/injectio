import { describe, it, expect } from 'vitest';

import { DeferredPromise } from './deferred-promise';

describe('deferredPromise', () => {
  it('should resolve with given value', async () => {
    const value = 5;
    const deferredPromise = DeferredPromise.make();

    deferredPromise.resolve(value);

    await expect(deferredPromise.promise).resolves.toBe(value);
  });
});

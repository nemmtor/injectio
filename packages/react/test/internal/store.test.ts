import { describe, expect, it } from '@effect/vitest';
import { Store } from '../../src/internal/store.js';

describe('Store', () => {
  it('should allow adding items', () => {
    const store = new Store();

    store.add({ id: '1' });

    expect(store.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
        }),
      ]),
    );
  });

  it('should allow removing items', () => {
    const store = new Store();
    store.add({ id: '1' });

    store.remove('1');

    expect(store.items).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
        }),
      ]),
    );
  });

  it('should update reference of a snapshot after adding item', () => {
    const store = new Store();

    const snapshotBefore = store.items;
    store.add({ id: '1' });
    const snapshotAfter = store.items;

    expect(snapshotBefore).not.toBe(snapshotAfter);
  });

  it('should update reference of a snapshot after removing item', () => {
    const store = new Store();

    const snapshotBefore = store.items;
    store.remove('1');
    const snapshotAfter = store.items;

    expect(snapshotBefore).not.toBe(snapshotAfter);
  });
});

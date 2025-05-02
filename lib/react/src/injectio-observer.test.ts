import { InjectioObserver } from './injectio-observer';

describe('injectio observer', () => {
  it('should notify subscribers after adding new item', () => {
    const injectioObserver = InjectioObserver.getInstance();
    const subscriber = vi.fn();

    injectioObserver.subscribe(subscriber);
    injectioObserver.add(vi.fn());

    expect(subscriber).toHaveBeenCalled();
  });

  it('should update snapshot after adding new item', () => {
    const injectioObserver = InjectioObserver.getInstance();

    injectioObserver.add(vi.fn());
    const snapshotAfter = injectioObserver.getSnapshot();

    expect(snapshotAfter).toHaveLength(1);
  });

  it('should update snapshot reference after injected calls onSync', () => {
    const injectioObserver = InjectioObserver.getInstance();
    injectioObserver.add(vi.fn());
    const snapshotBeforeSync = injectioObserver.getSnapshot();
    const [injected] = snapshotBeforeSync;

    injected?.dismiss();
    const snapshotAfterSync = injectioObserver.getSnapshot();

    expect(snapshotBeforeSync).not.toBe(snapshotAfterSync);
  });

  it('should update snapshot reference after injected calls onRemove', () => {
    const injectioObserver = InjectioObserver.getInstance();
    injectioObserver.add(vi.fn());
    const snapshotBeforeSync = injectioObserver.getSnapshot();
    const [injected] = snapshotBeforeSync;

    injected?.remove();
    const snapshotAfterSync = injectioObserver.getSnapshot();

    expect(snapshotBeforeSync).not.toBe(snapshotAfterSync);
  });
});

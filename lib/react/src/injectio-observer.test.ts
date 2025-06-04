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
    const snapshot = injectioObserver.getSnapshot();

    expect(snapshot).toHaveLength(1);
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

  it('should not add another item with same id', () => {
    const injectioObserver = InjectioObserver.getInstance();
    const item = vi.fn();

    injectioObserver.add(item, 'id');
    injectioObserver.add(item, 'id');
    const snapshot = injectioObserver.getSnapshot();

    expect(snapshot).toHaveLength(1);
  });

  it('should restart promise after adding item with same id', () => {
    const injectioObserver = InjectioObserver.getInstance();
    const item = vi.fn();

    const firstInjection = injectioObserver.add(item, 'id');
    firstInjection.resolve('resolved');
    const firstInjectionValue = firstInjection.value;
    const secondInjection = injectioObserver.add(item, 'id');
    const secondInjectionValue = secondInjection.value;

    expect(firstInjectionValue).not.toBe(secondInjectionValue);
  });
});
